import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox'])
    routes=['/contact/','/projects/','/projects/batavia-fashion-ecommerce-template/','/projects/bima-ai-agency-template/','/projects/mandala-marketing-agency-template/','/404/']
    for route in routes:
        page=browser.new_page(viewport={'width':1280,'height':900});record={'route':route,'requests':[],'errors':[],'bad_status':[]}
        page.on('request',lambda r:record['requests'].append(r.url))
        page.on('pageerror',lambda e:record['errors'].append(str(e)))
        page.on('console',lambda m:record['errors'].append(m.text) if m.type in ('error','warning') else None)
        page.on('response',lambda r:record['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
        try:
            page.goto('http://127.0.0.1:8765'+route,wait_until='networkidle');page.wait_for_timeout(1000)
            for y in range(0,page.evaluate('document.documentElement.scrollHeight'),600):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(120)
            record['title']=page.title();record['h1']=page.locator('h1').all_text_contents();record['external']=[u for u in record['requests'] if u.startswith('https://')]
            page.screenshot(path=str(ROOT/'verification'/('route-'+route.strip('/').replace('/','-')+'.png')),full_page=True)
            record['forms']=page.locator('input,textarea,button').evaluate_all('(nodes)=>nodes.map(n=>({tag:n.tagName,type:n.type,name:n.name,text:n.textContent}))')
        except Exception as e:record['error']=str(e)
        results.append(record);print(route,'errors',len(record['errors']),'external',len(record.get('external',[])),'bad',record['bad_status'],flush=True);page.close()
    page=browser.new_page();page.goto('http://127.0.0.1:8765/',wait_until='networkidle')
    link=page.locator('a[href="./contact"]').first
    link.click();page.wait_for_timeout(1500)
    results.append({'interaction':'home contact link','url':page.url,'title':page.title()})
    browser.close()
(ROOT/'verification/routes.json').write_text(json.dumps(results,indent=2))
