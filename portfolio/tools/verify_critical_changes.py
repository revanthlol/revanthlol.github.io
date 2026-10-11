from playwright.sync_api import sync_playwright
from urllib.parse import urlsplit
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1];projects=json.loads((ROOT/'tools/phase2b-projects.json').read_text());rows=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  for route in ['/','/projects/','/contact/','/404/']+[x['href'] for x in projects]:
   page=browser.new_page(viewport={'width':width,'height':900});row=dict(route=route,width=width,errors=[],warnings=[],external=[],missing=[])
   page.on('pageerror',lambda e:row['errors'].append(str(e)))
   page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
   page.on('request',lambda r:row['external'].append(r.url) if urlsplit(r.url).netloc!='127.0.0.1:8767' else None)
   page.on('response',lambda r:row['missing'].append([r.status,r.url]) if r.status>=400 else None)
   page.goto('http://127.0.0.1:8767'+route,wait_until='networkidle');page.wait_for_timeout(700)
   row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth');row['h1']=page.locator('h1').all_text_contents();row['discord']=page.locator('a[href="https://discord.com/users/1400787457221595230"]').count()
   if route=='/':
    page.wait_for_timeout(1200);hero=page.locator('.framer-lt3ewa-container a').first;hero.hover();page.wait_for_timeout(1100);row['hero_hover']=hero.inner_text();row['hero_hover_state']=hero.get_attribute('data-framer-name');page.screenshot(path=str(ROOT/f'tools/critical-hero-hover-{width}.png'))
    tabs=page.locator('.framer-jki9ce');tabs.scroll_into_view_if_needed();page.wait_for_timeout(800);row['tabs_text']=tabs.inner_text();row['tab_changes']=[]
    for label in ('Browser tools','Linux utilities','Web apps'):
     target=tabs.get_by_text(label,exact=True).first;target.click();page.wait_for_timeout(550);row['tab_changes'].append({'label':label,'images':tabs.locator('img').evaluate_all('(ns)=>ns.map(n=>n.currentSrc)')})
    page.screenshot(path=str(ROOT/f'tools/critical-tabs-{width}.png'))
    cta=page.locator('section.framer-CuZuO').first;cta.scroll_into_view_if_needed();page.wait_for_timeout(800);cta.locator('a').first.hover();page.wait_for_timeout(1100);row['footer_hover']=cta.locator('a').first.inner_text();row['footer_hover_state']=cta.locator('a').first.get_attribute('data-framer-name')
   if route.startswith('/projects/') and route!='/projects/':
    row['nav_class']=page.locator('.rev-captured-header nav').first.get_attribute('class');row['more_work']=page.locator('.rev-more-work .rev-card').count();row['cta']=page.locator('.rev-detail-outbound').get_attribute('href')
    if width==375:
     icon=page.locator('.rev-native-phone [role=button]').first;icon.click();row['menu_opens']=page.locator('#rev-mobile-links').is_visible();page.keyboard.press('Escape');row['menu_closes']=not page.locator('#rev-mobile-links').is_visible()
    if route=='/projects/leprint/':page.screenshot(path=str(ROOT/f'tools/critical-leprint-{width}.png'));page.locator('.rev-more-work').scroll_into_view_if_needed();page.screenshot(path=str(ROOT/f'tools/critical-leprint-more-{width}.png'))
   rows.append(row);page.close()
   if row['errors'] or row['warnings'] or row['external'] or row['missing'] or row['overflow']:print('ISSUE',route,width,{k:row[k] for k in ('errors','warnings','external','missing','overflow')},flush=True)
  print('Completed width',width,flush=True)
 browser.close()
(ROOT/'tools/critical-changes-results.json').write_text(json.dumps(rows,indent=2));print('renders',len(rows),'errors',sum(len(r['errors']) for r in rows),'warnings',sum(len(r['warnings']) for r in rows),'external',sum(len(r['external']) for r in rows),'missing',sum(len(r['missing']) for r in rows),'overflow',sum(r['overflow'] for r in rows))
