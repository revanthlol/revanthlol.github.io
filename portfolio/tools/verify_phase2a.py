#!/usr/bin/env python3
import json,sys
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'verification/phase2a';OUT.mkdir(parents=True,exist_ok=True)
widths=list(map(int,sys.argv[1:])) or [375,768,1280,1920]
results=json.loads((OUT/'results.json').read_text()) if sys.argv[1:] else []
results=[r for r in results if r['width'] not in widths]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
    for width in widths:
        for label,port in [('baseline',8766),('patched',8765)]:
            page=browser.new_page(viewport={'width':width,'height':900});row={'label':label,'width':width,'requests':[],'errors':[],'warnings':[],'bad_status':[],'failed':[]}
            page.on('request',lambda r:row['requests'].append(r.url));page.on('pageerror',lambda e:row['errors'].append(str(e)))
            page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
            page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
            page.on('requestfailed',lambda r:row['failed'].append([r.url,r.failure]))
            try:
                page.goto(f'http://127.0.0.1:{port}/',wait_until='networkidle');page.wait_for_timeout(1800)
                row['initial_height']=page.evaluate('document.documentElement.scrollHeight')
                row['initial_badges']=page.locator('#__framer-badge-container, .framer-1f3ejyv-container').count()
                row['initial_pricing']=page.locator('#pricing').count()
                row['metadata']=page.locator('title,meta[name="description"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"]').evaluate_all('(ns)=>ns.map(n=>({tag:n.tagName,name:n.name||n.getAttribute("property")||n.rel,value:n.content||n.href||n.textContent}))')
                page.screenshot(path=str(OUT/f'{label}-{width}-top.png'))
                row['section_boxes']=page.locator('main section, #main section').evaluate_all('(ns)=>ns.map(n=>({name:n.dataset.framerName,id:n.id,x:n.getBoundingClientRect().x,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height}))')
                for y in range(0,row['initial_height'],300):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(250)
                page.wait_for_timeout(700)
                row['after_scroll_badges']=page.locator('#__framer-badge-container, .framer-1f3ejyv-container').count()
                row['after_scroll_pricing']=page.locator('#pricing').count()
                row['body_text']=page.locator('body').inner_text()
                for element in page.locator('a,button,[data-highlight="true"]').all()[:18]:
                    if element.is_visible():element.hover();page.wait_for_timeout(160)
                page.evaluate('scrollTo(0,0)');page.wait_for_timeout(1000)
                page.screenshot(path=str(OUT/f'{label}-{width}-full.png'),full_page=True)
                row['footer_fit']=page.locator('.framer-enlusb').evaluate_all('(ns)=>ns.filter(n=>n.getBoundingClientRect().width).map(n=>{let r=document.createRange();r.selectNodeContents(n.querySelector("p"));return {box:n.getBoundingClientRect().right,text:r.getBoundingClientRect().right}})')
                row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth')
                row['anchors']=page.locator('a[href*="pricing"]').count()
                if label=='patched':
                    row['resizes']=[]
                    for resize in [375,768,1280]:
                        page.set_viewport_size({'width':resize,'height':900});page.evaluate('scrollTo(0,document.documentElement.scrollHeight)');page.wait_for_timeout(500)
                        row['resizes'].append({'width':resize,'badges':page.locator('#__framer-badge-container, .framer-1f3ejyv-container').count(),'pricing':page.locator('#pricing').count(),'promo_text':page.get_by_text('Remix for free',exact=True).count()+page.get_by_text('More Templates',exact=True).count(),'badge_title':page.locator('a[title*="Create a free website with Framer"]').count()})
                row['external']=[u for u in row['requests'] if urlsplit(u).netloc not in ('',f'127.0.0.1:{port}')]
            except Exception as e:row['exception']=str(e)
            results.append(row);page.close();(OUT/'results.json').write_text(json.dumps(results,indent=2))
            print(label,width,'errors',len(row['errors']),'warnings',len(row['warnings']),'bad',row['bad_status'],'exception',row.get('exception'),flush=True)
    browser.close()
for row in results:
    if row['label']=='patched':
        assert not row.get('exception') and not row['errors'] and not row['external'] and not row['bad_status'],row
        assert all(f['text']<=f['box']+1 for f in row['footer_fit']),row['footer_fit']
        assert row['initial_badges']==row['after_scroll_badges']==row['initial_pricing']==row['after_scroll_pricing']==row['anchors']==0,row
        assert all(not any(r[k] for k in ['badges','pricing','promo_text','badge_title']) for r in row['resizes']),row
print('Phase 2a network, console, hydration, badge, pricing and resize assertions passed.')
