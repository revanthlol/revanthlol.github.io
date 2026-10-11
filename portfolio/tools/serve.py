#!/usr/bin/env python3
import argparse,json,mimetypes,posixpath
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit,parse_qs,unquote
from extract_har import ROOT
from pathlib import Path
mimetypes.add_type('text/javascript','.mjs')
mimetypes.add_type('application/wasm','.wasm')
mimetypes.add_type('font/woff2','.woff2')
mimetypes.add_type('video/mp4','.mp4')
mimetypes.add_type('image/avif','.avif')
mimetypes.add_type('image/webp','.webp')
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        u=urlsplit(self.path)
        if posixpath.normpath(unquote(u.path)).strip('/').split('/')[0] in ('captured','tools','_baseline','_phase2a_baseline'):return self.send_error(403)
        if u.path.startswith('/remote/'):
            original='https://'+u.path[len('/remote/'):]
            mapping=json.loads((ROOT/'url-map.json').read_text())
            path=mapping.get(original)
            if not path:return self.send_error(404,'Uncaptured resource')
            if '/cms/' not in original:
                self.send_response(302);self.send_header('Location','/'+path);self.end_headers();return
            data=(ROOT/path).read_bytes()
            if 'range' in parse_qs(u.query):
                ranges=[tuple(map(int,r.split('-'))) for r in parse_qs(u.query)['range'][0].split(',')];data=b''.join(data[start:end+1] for start,end in ranges)
            self.send_response(200);self.send_header('Content-Type',self.guess_type(path));self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data);return
        if u.path=='/favicon.ico':self.path='/assets/favicon.svg'
        super().do_GET()
    def send_error(self,code,message=None,explain=None):
        fallback=ROOT/'404.html'
        if code==404 and fallback.exists() and not urlsplit(self.path).path.startswith(('/assets/','/remote/','/stubs/')):
            data=fallback.read_bytes();self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers()
            if self.command!='HEAD':self.wfile.write(data)
            return
        return super().send_error(code,message,explain)
    def end_headers(self):
        self.send_header('Cache-Control','no-cache');super().end_headers()
p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8765);p.add_argument('--root',type=Path,default=ROOT);a=p.parse_args();ROOT=a.root.resolve()
print(f'Serving {ROOT} at http://127.0.0.1:{a.port}',flush=True)
ThreadingHTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
