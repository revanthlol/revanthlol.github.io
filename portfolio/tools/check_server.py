import json,urllib.request,urllib.error
from urllib.parse import urlsplit
from pathlib import Path
root=Path(__file__).resolve().parents[1];base='http://127.0.0.1:8765'
with urllib.request.urlopen(base+'/') as r:assert r.status==200
mapping=json.loads((root/'url-map.json').read_text());url=next(u for u in mapping if '/cms/' in u and 'indexes' in u and '?' not in u)
u=urlsplit(url)
with urllib.request.urlopen(base+'/remote/'+u.netloc+u.path+'?range=0-2,10-11') as r:assert len(r.read())==5
for route in ['/captured/','/%63aptured/','/tools/','/assets/%2e%2e/captured/']:
    try:urllib.request.urlopen(base+route);raise AssertionError(route)
    except urllib.error.HTTPError as e:assert e.code==403,(route,e.code)
print('Server responds; combined CMS ranges and private-directory guards pass.')
