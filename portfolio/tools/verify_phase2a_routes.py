import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
import sys
BASELINE='--baseline' in sys.argv
PORT=8766 if BASELINE else 8765
routes=['/contact/','/projects/','/projects/batavia-fashion-ecommerce-template/','/projects/bima-ai-agency-template/','/projects/mandala-marketing-agency-template/','/404/'];rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox'])
 for width in [375,768,1280,1920]:
  for route in routes:
   row=dict(width=width,route=route,requests=[],errors=[],warnings=[],bad_status=[]);page=b.new_page(viewport={'width':width,'height':900})
   page.on('request',lambda r:row['requests'].append(r.url));page.on('pageerror',lambda e:row['errors'].append(str(e)))
   page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
   page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ['warning','error'] else None)
   page.goto(f'http://127.0.0.1:{PORT}'+route,wait_until='networkidle')
   for y in range(0,page.evaluate('document.documentElement.scrollHeight'),500):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(150)
   for e in page.locator('a').all()[:8]:
    if e.is_visible():e.hover();page.wait_for_timeout(80)
   row['external']=[u for u in row['requests'] if urlsplit(u).netloc!=f'127.0.0.1:{PORT}'];row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth')
   row['removed_dom']=page.locator('#pricing,#__framer-badge-container,.framer-1f3ejyv-container,a[href*="pricing"]').count()
   row['metadata']=page.locator('title,link[rel="canonical"],meta[property="og:url"]').evaluate_all('(ns)=>ns.map(n=>n.content||n.href||n.textContent)')
   assert not row['external'] and not row['errors'] and not row['bad_status'] and (BASELINE or not row['removed_dom']) and not row['overflow'],row
   rows.append(row);page.close();print(width,route,'warnings',len(row['warnings']),flush=True)
   (ROOT/('verification/phase2a/routes-baseline.json' if BASELINE else 'verification/phase2a/routes.json')).write_text(json.dumps(rows,indent=2))
 b.close()
print('24 secondary-route viewport checks passed.')
