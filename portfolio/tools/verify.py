#!/usr/bin/env python3
import json,time
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops,ImageStat
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification';OUT.mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
    for width in (375,768,1280,1920):
        for label,origin in [('local','http://127.0.0.1:8765'),('live','https://arjuna.framer.media')]:
            context=browser.new_context(viewport={'width':width,'height':900},device_scale_factor=1)
            page=context.new_page();record={'label':label,'width':width,'requests':[],'errors':[],'warnings':[],'failed':[],'bad_status':[]}
            page.on('request',lambda r:record['requests'].append({'url':r.url,'type':r.resource_type}))
            page.on('console',lambda m:record['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
            page.on('pageerror',lambda e:record['errors'].append(str(e)))
            page.on('requestfailed',lambda r:record['failed'].append({'url':r.url,'error':r.failure}))
            page.on('response',lambda r:record['bad_status'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
            try:
                page.goto(origin+'/',wait_until='networkidle',timeout=60000)
                page.wait_for_timeout(2000)
                record['title']=page.title()
                record['height']=page.evaluate('document.documentElement.scrollHeight')
                record['overflow']=page.evaluate('document.documentElement.scrollWidth > innerWidth')
                page.screenshot(path=str(OUT/f'{label}-{width}-top.png'))
                for y in range(0,record['height'],350):
                    page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(180)
                page.wait_for_timeout(1000)
                record['hovers']=[]
                for selector in ['a','button']:
                    for element in page.locator(selector).all()[:12]:
                        if element.is_visible():
                            element.hover();page.wait_for_timeout(120);record['hovers'].append((element.inner_text() or element.get_attribute('aria-label') or selector)[:80])
                page.evaluate('scrollTo(0,0)');page.wait_for_timeout(1000)
                page.screenshot(path=str(OUT/f'{label}-{width}-full.png'),full_page=True)
                record['links']=page.locator('a').evaluate_all('(nodes)=>nodes.map(n=>({text:n.textContent,href:n.getAttribute("href")}))')
                record['external']= [r for r in record['requests'] if urlsplit(r['url']).netloc and urlsplit(r['url']).netloc != urlsplit(origin).netloc]
            except Exception as e:record['error']=str(e)
            results.append(record);context.close()
            (OUT/'results.json').write_text(json.dumps(results,indent=2))
            print(label,width,'requests',len(record['requests']),'errors',len(record['errors']),'bad',record['bad_status'],flush=True)
    browser.close()
comparisons=[]
for width in (375,768,1280,1920):
    a=Image.open(OUT/f'local-{width}-top.png').convert('RGB');b=Image.open(OUT/f'live-{width}-top.png').convert('RGB')
    diff=ImageChops.difference(a,b);diff.save(OUT/f'diff-{width}-top.png')
    comparisons.append({'width':width,'top_mean_absolute_rgb_difference':sum(ImageStat.Stat(diff).mean)/3})
    print(width,'mean absolute RGB difference',sum(ImageStat.Stat(diff).mean)/3,flush=True)
(OUT/'comparison.json').write_text(json.dumps(comparisons,indent=2))
assert len(results)==8
assert all(not r.get('error') and not r['errors'] and all(w.startswith('Invalid keyframe value for property filter: blur(-') for w in r['warnings']) and not r['bad_status'] and not r['external'] for r in results if r['label']=='local')
