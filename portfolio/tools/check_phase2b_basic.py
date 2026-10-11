from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlsplit
import json
ROOT=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for route,width in [('/',375),('/projects/',375),('/contact/',375),('/projects/leprint/',375),('/projects/gild/',375),('/404/',375),('/missing/nested/path',375),('/projects/',1280)]:
  page=browser.new_page(viewport={'width':width,'height':900});row={'route':route,'width':width,'errors':[],'warnings':[],'external':[],'bad_status':[]}
  page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ['error','warning'] else None)
  page.on('pageerror',lambda e:row['errors'].append(str(e)))
  page.on('request',lambda r:row['external'].append(r.url) if urlsplit(r.url).netloc!='127.0.0.1:8767' else None)
  page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
  try:
   response=page.goto('http://127.0.0.1:8767'+route,wait_until='networkidle',timeout=20000);page.wait_for_timeout(500)
   row['status']=response.status;row['h1']=page.locator('h1').all_text_contents();row['cards']=page.locator('.rev-card').count();row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth');row['descriptions']=page.locator('.rev-card-description').evaluate_all('(ns)=>ns.map(n=>({text:n.textContent,height:n.clientHeight,scroll:n.scrollHeight}))')
   row['body_text']=page.locator('body').inner_text()[:1500];row['masks']=page.locator('.rev-image-mask').evaluate_all('(ns)=>ns.map(n=>({width:n.clientWidth,height:n.clientHeight}))')
   page.screenshot(path=str(ROOT/'tools'/('basic-'+route.strip('/').replace('/','-')+'-'+str(width)+'.png')),full_page=True)
  except Exception as e:row['exception']=str(e)
  rows.append(row);page.close();print(route,width,'errors',len(row['errors']),'warnings',len(row['warnings']),'status',row.get('status'),'cards',row.get('cards'),flush=True)
 browser.close()
(ROOT/'tools/phase2b-basic-results.json').write_text(json.dumps(rows,indent=2))
