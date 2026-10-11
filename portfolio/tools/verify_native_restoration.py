from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlsplit
import json
ROOT=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  for route in ('/','/projects/','/contact/'):
   page=browser.new_page(viewport={'width':width,'height':900});row=dict(route=route,width=width,errors=[],warnings=[],external=[],missing=[])
   page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
   page.on('pageerror',lambda e:row['errors'].append(str(e)))
   page.on('request',lambda r:row['external'].append(r.url) if urlsplit(r.url).netloc!='127.0.0.1:8767' else None)
   page.on('response',lambda r:row['missing'].append(r.url) if r.status>=400 else None)
   page.goto('http://127.0.0.1:8767'+route,wait_until='networkidle');page.wait_for_timeout(1800)
   row['h1']=page.locator('h1').all_text_contents();row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth')
   if route=='/':
    row['hero_motion_before']=page.locator('.framer-zojsb7-container ul').first.evaluate('(n)=>getComputedStyle(n).transform')
    page.wait_for_timeout(600);row['carousel_changes']=row.pop('hero_motion_before')!=page.locator('.framer-zojsb7-container ul').first.evaluate('(n)=>getComputedStyle(n).transform')
   page.screenshot(path=str(ROOT/f'tools/restored-{width}-{route.strip("/") or "home"}-top.png'))
   height=page.evaluate('document.documentElement.scrollHeight')
   for y in range(0,height,550):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(120)
   page.evaluate('scrollTo(0,document.documentElement.scrollHeight)');page.wait_for_timeout(1200)
   if route in ('/','/projects/'):
    cta=page.locator('section.framer-CuZuO').first;cta.scroll_into_view_if_needed();page.wait_for_timeout(1800);row['cta_text']=cta.inner_text();row['connect_hrefs']=cta.locator('a').evaluate_all('(ns)=>ns.map(n=>n.getAttribute("href"))');cta.locator('a').first.hover();page.wait_for_timeout(500);page.screenshot(path=str(ROOT/f'tools/restored-{width}-{route.strip("/") or "home"}-cta.png'));page.evaluate('scrollTo(0,document.documentElement.scrollHeight)')
   row['footer']=page.locator('footer').first.inner_text();row['cta_native']=page.locator('section.framer-CuZuO').count()
   page.screenshot(path=str(ROOT/f'tools/restored-{width}-{route.strip("/") or "home"}-footer.png'))
   rows.append(row);print(route,width,'errors',len(row['errors']),'warnings',len(row['warnings']),'overflow',row['overflow'],flush=True);page.close()
 browser.close()
(ROOT/'tools/native-restoration-results.json').write_text(json.dumps(rows,indent=2))
