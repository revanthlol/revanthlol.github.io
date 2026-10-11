#!/usr/bin/env python3
import base64, hashlib, json, mimetypes
from pathlib import Path
from urllib.parse import urlsplit
ROOT = Path(__file__).resolve().parents[1]

def asset_path(url, mime):
    u = urlsplit(url)
    ext = { 'text/javascript': '.mjs', 'application/javascript': '.mjs', 'text/html': '.html' }.get(mime, mimetypes.guess_extension(mime) or '.bin')
    return 'assets/' + u.netloc + '/' + hashlib.sha256(url.encode()).hexdigest()[:24] + ext

def main():
    entries = json.loads((ROOT.parent / 'arjuna.framer.media.har').read_text())['log']['entries']
    mapping, metadata = {}, {}
    for e in entries:
        c = e['response'].get('content', {})
        if 'text' not in c: continue
        url = e['request']['url']
        mime = c.get('mimeType', '').split(';')[0]
        path = asset_path(url, mime)
        data = base64.b64decode(c['text'], validate=True) if c.get('encoding') == 'base64' else c['text'].encode()
        dest = ROOT / 'captured' / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        mapping[url] = path
        metadata[path] = {'mime': mime, 'status': e['response']['status'], 'url': url}
    (ROOT / 'url-map.json').write_text(json.dumps(mapping, indent=2))
    (ROOT / 'tools/source-map.json').write_text(json.dumps(mapping, indent=2))
    (ROOT / 'tools/metadata.json').write_text(json.dumps(metadata, indent=2))
    assert all((ROOT / 'captured' / p).exists() for p in mapping.values())
    print(f'Extracted {len(mapping)} URLs; originals retained in captured/.')

if __name__ == '__main__': main()
