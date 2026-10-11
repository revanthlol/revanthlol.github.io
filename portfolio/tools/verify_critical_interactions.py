from playwright.sync_api import sync_playwright
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  page=b.new_page(viewport={'width':width,'height':900});row={'width':width,'errors':[],'warnings':[],'tabs':[]};page.on('pageerror',lambda e:row['errors'].append(str(e)));page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('warning','error') else None)
  page.goto('http://127.0.0.1:8767/',wait_until='networkidle');page.wait_for_timeout(1500);tabs=page.locator('.framer-jki9ce');tabs.scroll_into_view_if_needed();page.wait_for_timeout(800)
  for label in ('Browser tools','Linux utilities','Web apps'):
   tabs.get_by_text(label,exact=True).first.click();page.wait_for_timeout(900)
   row['tabs'].append({'label':label,'states':tabs.locator('img').evaluate_all('(ns)=>ns.map(n=>{let o=1,p=n;while(p&&!p.classList.contains("framer-jki9ce")){o*=Number(getComputedStyle(p).opacity);p=p.parentElement}return {url:n.currentSrc,opacity:o}})')})
  row['faq_copy']=page.get_by_text('Are you available for work?',exact=True).count();row['heading']=page.locator('.rev-projects h2').inner_text();row['count_sup']=page.locator('.rev-projects h2 sup').inner_text()
  page.goto('http://127.0.0.1:8767/projects/leprint/',wait_until='networkidle');cta=page.locator('.rev-static-connect');cta.scroll_into_view_if_needed();cta.hover();page.wait_for_timeout(400);row['static_hover']=cta.locator('.rev-connect-hover').evaluate('(n)=>({text:n.textContent,opacity:getComputedStyle(n).opacity})');row['nav_links']=page.locator('.rev-native-desktop nav a').evaluate_all('(ns)=>ns.map(n=>({text:n.textContent,href:n.getAttribute("href")}))');page.screenshot(path=str(ROOT/f'tools/critical-detail-footer-{width}.png'))
  if width<810:
   page.locator('.rev-native-phone [role=button]').first.click();page.locator('#rev-mobile-links a[href="/projects/"]').click()
  else:page.locator('.rev-native-desktop nav a[href="/projects/"]').click()
  page.wait_for_url('**/projects/');page.wait_for_load_state('networkidle');row['projects_navigation']=page.url.endswith('/projects/')
  page.go_back(wait_until='networkidle');row['back_navigation']=page.url.endswith('/projects/leprint/');page.reload(wait_until='networkidle');row['reload_title']=page.title()
  rows.append(row);page.close()
 b.close()
(ROOT/'tools/critical-interactions-results.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
