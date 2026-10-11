#!/usr/bin/env python3
import html, json, os, re
from pathlib import Path
from urllib.parse import urlsplit, urljoin
from extract_har import ROOT
from complete_assets import IMPORT, URL

def main():
    mapping=json.loads((ROOT/'tools/source-map.json' if (ROOT/'tools/source-map.json').exists() else ROOT/'url-map.json').read_text())
    meta=json.loads((ROOT/'tools/metadata.json').read_text())
    pagepaths={u:('index.html' if urlsplit(u).path=='/' else urlsplit(u).path.strip('/')+'/index.html') for u in mapping if urlsplit(u).netloc=='arjuna.framer.media'}
    originals=dict(mapping)
    mapping.update(pagepaths)
    changes=[];graph=[]
    for url,path in originals.items():
        source=ROOT/'captured'/path
        destpath=mapping[url];dest=ROOT/destpath;dest.parent.mkdir(parents=True,exist_ok=True)
        mime=meta[path]['mime']
        if urlsplit(url).netloc=='api.framer.com':
            dest.write_text('{}');changes.append({'url':url,'reason':'Editor API response replaced with empty JSON; captured authentication material excluded from served copy.'});continue
        if mime not in ('text/html','text/javascript','application/javascript','text/css','application/json') or '/cms/' in url:
            dest.write_bytes(source.read_bytes());continue
        text=source.read_text()
        replacements={}
        for original,target in mapping.items():
            relative='/' + target if mime in ('text/javascript','application/javascript','application/json') else os.path.relpath(ROOT/target,dest.parent)
            if not relative.startswith(('.', '/')): relative='./'+relative
            replacements[original]=relative
            replacements[html.escape(original,quote=False)]=relative
        if mime in ('text/javascript','application/javascript'):
            for spec in IMPORT.findall(text):
                resolved=urljoin(url,spec)
                if resolved in mapping:
                    relative=os.path.relpath(ROOT/mapping[resolved],dest.parent)
                    if not relative.startswith(('.', '/')): relative='./'+relative
                    for quote in ('"',"'",'`'): replacements[quote+spec+quote]=quote+relative+quote
                    graph.append({'source':destpath,'specifier':spec,'target':mapping[resolved]})
                elif spec.startswith(('./','https://')): graph.append({'source':destpath,'specifier':spec,'missing':resolved})
            # Keep Framer's URL constructor and /modules/ -> /cms/ derivation intact.
            for base in re.findall(r'new URL\([^,]+,["\'`](https://framerusercontent.com/modules/[^"\'`]+)["\'`]\)',text):
                for quote in ('"',"'",'`'):
                    replacements[quote+base+quote]='new URL('+json.dumps('/remote/'+urlsplit(base).netloc+urlsplit(base).path)+',location.href).href'
        if '/framer.CZHfwi-G.mjs' in url:
            text=text.replace('function To(e,t){try{let n=new URL(e);return t?n.searchParams.set(`scale-down-to`,`${t}`):n.searchParams.delete(`scale-down-to`),n.toString()}catch{return e}}','function To(e,t){try{let n=new URL(globalThis.__offlineOriginals[e]||e);return t?n.searchParams.set(`scale-down-to`,`${t}`):n.searchParams.delete(`scale-down-to`),globalThis.__offlineUrls[n.toString()]||globalThis.__offlineUrls[e]||e}catch{return e}}')
        if '/G6CQli_2A.' in url:
            text=text.replace('let c=await s.arrayBuffer(),l=new Uint8Array(c);','let c=await s.arrayBuffer(),l=new Uint8Array(c);if(l.length!==i)l=new Uint8Array(n.flatMap(e=>Array.from(l.subarray(e.from,e.to))));')
            text=text.replace('return JSON.parse(e)}constructor', 'return JSON.parse(e,(k,v)=>typeof v==="string"?(globalThis.__offlineUrls[v]||v):v)}constructor')
        if url=='https://framer.com/edit/init.mjs':
            text='export function createEditorBar(){return ()=>null} export default createEditorBar;\n'
            changes.append({'url':url,'reason':'Neutralized editor login iframe and authenticated editor API; createEditorBar returns no UI.'})
        replacements['https://framer.com/m/phosphor-icons/']='/remote/framer.com/m/phosphor-icons/'
        # Replace in one pass: replacement strings must never be replaced again.
        pattern=re.compile('|'.join(re.escape(k) for k in sorted(replacements,key=len,reverse=True)))
        text=pattern.sub(lambda m:replacements[m.group()],text)
        if mime=='text/html':
            text=text.replace('https://events.framer.com/script?v=2','/stubs/events.js')
            text=re.sub(r'<link[^>]+rel="(?:preconnect|dns-prefetch)"[^>]*>','',text)
            text=text.replace('<head>','<head><script src="/stubs/url-map.js"></script><meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: blob:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; font-src \'self\' data:; connect-src \'self\'; frame-src \'self\';">',1)
        dest.write_text(text)
    mapscript=ROOT/'stubs/url-map.js';mapscript.parent.mkdir(exist_ok=True);mapscript.write_text('globalThis.__offlineUrls='+json.dumps({u:'/'+p for u,p in mapping.items()})+';globalThis.__offlineOriginals='+json.dumps({'/'+p:u for u,p in mapping.items()})+';\n')
    with mapscript.open('a') as f:
        f.write((ROOT/'tools/image-url-adapter.js').read_text())
    stub=ROOT/'stubs/events.js';stub.parent.mkdir(exist_ok=True);stub.write_text('/* Captured analytics request failed; offline no-op. */\n')
    changes.append({'url':'https://events.framer.com/script?v=2','reason':'Local no-op analytics script; no event transmission.'})
    (ROOT/'tools/stubs.json').write_text(json.dumps(changes,indent=2))
    (ROOT/'tools/module-graph.json').write_text(json.dumps(graph,indent=2))
    (ROOT/'url-map.json').write_text(json.dumps(mapping,indent=2))
    (ROOT/'tools/source-map.json').write_text(json.dumps(originals,indent=2))
    for original,target in mapping.items():
        u=urlsplit(original)
        if u.netloc=='framerusercontent.com' and '/cms/' in u.path and not u.query or u.netloc=='framer.com' and '/m/phosphor-icons/' in u.path:
            alias=ROOT/'remote'/u.netloc/u.path.lstrip('/');alias.parent.mkdir(parents=True,exist_ok=True);alias.write_bytes((ROOT/target).read_bytes())
            if alias.suffix=='.57':
                body=alias.read_text()
                for spec in IMPORT.findall(body):
                    if spec.startswith('.'):
                        absolute='/' + os.path.normpath(os.path.join(os.path.dirname(target),spec))
                        for quote in ('\"',"'",'`'): body=body.replace(quote+spec+quote,quote+absolute+quote)
                alias.write_text(body)
    assert all((ROOT/g['target']).exists() for g in graph if 'target' in g)
    print('Rewritten files; unresolved imports:',[g for g in graph if 'missing' in g])
if __name__=='__main__':main()
