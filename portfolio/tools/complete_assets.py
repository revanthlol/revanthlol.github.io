#!/usr/bin/env python3
import concurrent.futures, html, json, re, subprocess
from pathlib import Path
from urllib.parse import urlsplit, urljoin
from extract_har import ROOT, asset_path
URL = re.compile(r'https?://[^\s"\'<>`\\)]+')
IMPORT = re.compile(r'(?:from\s*|import\s*\(\s*|import\s*)["\'`]([^"\'`]+)["\'`]')

def main():
    mapping=json.loads((ROOT/'tools/source-map.json' if (ROOT/'tools/source-map.json').exists() else ROOT/'url-map.json').read_text())
    meta=json.loads((ROOT/'tools/metadata.json').read_text())
    failures={}
    for iteration in range(8):
        needed=set()
        if (ROOT/'verification/results.json').exists():
            for record in json.loads((ROOT/'verification/results.json').read_text()):
                if record['label']=='local':
                    needed.update(r['url'] for r in record['requests'] if urlsplit(r['url']).netloc in ('framerusercontent.com','fonts.gstatic.com','framer.com'))
        for url,path in list(mapping.items()):
            if urlsplit(url).netloc not in ('arjuna.framer.media','framerusercontent.com','fonts.gstatic.com'): continue
            if not path.endswith(('.html','.mjs','.css','.json')): continue
            text=(ROOT/'captured'/path).read_text(errors='replace')
            for value in URL.findall(text):
                value=html.unescape(value)
                u=urlsplit(value)
                if '${' in value: continue
                if u.netloc=='fonts.gstatic.com' and u.path.endswith('.woff2') or u.netloc=='framerusercontent.com' and u.path.endswith(('.png','.jpg','.svg','.webp','.avif','.woff2','.mp4','.json','.framercms')):
                    needed.add(value)
            if path.endswith('.mjs'):
                for spec in IMPORT.findall(text):
                    if spec.startswith('./'): needed.add(urljoin(url,spec))
            if u := re.findall(r'new URL\(["\'`]([^"\'`]+\.framercms)["\'`],["\'`]([^"\'`]+)["\'`]\)',text):
                for spec,base in u: needed.add(urljoin(base,spec).replace('/modules/','/cms/'))
            if url=='https://arjuna.framer.media/':
                for link in re.findall(r'href="(\./[^"#?]+)"',text): needed.add(urljoin(url,link))
        missing=sorted(needed-mapping.keys()-failures.keys())
        if not missing: break
        print(f'Round {iteration}: fetching {len(missing)} specifically referenced assets/pages',flush=True)
        def fetch(url):
            tmp=ROOT/'tools'/('download-'+__import__('hashlib').sha256(url.encode()).hexdigest()[:20])
            result=subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','45','-o',str(tmp),'-w','%{content_type}',url],capture_output=True,text=True)
            if result.returncode:
                tmp.unlink(missing_ok=True)
                return url,None,result.stderr
            mime=result.stdout.split(';')[0]
            path=asset_path(url,mime)
            dest=ROOT/'captured'/path;dest.parent.mkdir(parents=True,exist_ok=True);tmp.rename(dest)
            return url,path,mime
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for url,path,mime in pool.map(fetch,missing):
                if path: mapping[url]=path;meta[path]={'mime':mime,'url':url,'status':200,'source':'referenced fetch'}
                else: failures[url]=mime
        (ROOT/'url-map.json').write_text(json.dumps(mapping,indent=2))
        (ROOT/'tools/source-map.json').write_text(json.dumps(mapping,indent=2))
        (ROOT/'tools/metadata.json').write_text(json.dumps(meta,indent=2))
        (ROOT/'tools/missing-assets.json').write_text(json.dumps(failures,indent=2))
    print(f'{len(mapping)} mapped URLs; {len(failures)} missing',flush=True)
if __name__=='__main__': main()
