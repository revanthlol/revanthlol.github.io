import json
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  page=b.new_page(viewport={'width':width,'height':900});requests=[];errors=[];bad=[]
  page.on('request',lambda r:requests.append(r.url));page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type in ('warning','error') else None)
  page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
  page.goto('http://127.0.0.1:8765/',wait_until='networkidle');page.wait_for_timeout(1000)
  for y in range(0,page.evaluate('document.documentElement.scrollHeight'),600):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(80)
  page.wait_for_timeout(500)
  assert not errors and not bad and not [u for u in requests if u.startswith('https://')],(width,errors,bad)
  print(width,json.dumps({'external':[u for u in requests if u.startswith('https://')],'errors':errors,'bad':bad}),flush=True);page.close()
 b.close()
