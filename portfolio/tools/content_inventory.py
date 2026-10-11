#!/usr/bin/env python3
import html,json,sys
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from patch_phase2a import Markup
ROOT=Path(__file__).resolve().parents[1]
ROUTES=['/','/contact/','/projects/','/projects/batavia-fashion-ecommerce-template/','/projects/bima-ai-agency-template/','/projects/mandala-marketing-agency-template/','/404/']
source_files={}
for path in ROOT.joinpath('_baseline').rglob('*'):
    if path.is_file() and path.suffix in ('.html','.mjs','.json','.svg','.css'):
        rel=str(path.relative_to(ROOT/'_baseline'));source_files[rel]=(ROOT/rel).read_bytes().decode('utf8',errors='replace')
for folder in ['assets','remote']:
    for path in (ROOT/folder).rglob('*'):
        if path.is_file() and '.framercms' in path.name:source_files[str(path.relative_to(ROOT))]=path.read_bytes().decode('utf8',errors='replace')
MAPPING=json.loads((ROOT/'url-map.json').read_text());reverse={'/'+p:u for u,p in MAPPING.items()}
DATA_JS=r'''() => {
 const visible = e => { for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return false}return true };
 const place = e => {let ns=[];for(let p=e;p;p=p.parentElement){if(p.dataset.framerName)ns.unshift(p.dataset.framerName);if(p.tagName==='SECTION'||p.tagName==='HEADER'||p.tagName==='FOOTER')break}return ns.join(' / ')||e.tagName};
 const texts=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){const n=walker.currentNode,e=n.parentElement;if(!e||(e.closest('script,style,noscript')||(e.closest('svg')&&!e.closest('foreignObject')))||!visible(e))continue;const value=n.textContent.trim();if(value)texts.push({text:value,element:e.tagName,location:place(e)});}
 const images=[...document.images].filter(visible).map(e=>({src:e.getAttribute('src'),currentSrc:e.currentSrc,srcset:e.getAttribute('srcset'),alt:e.alt,location:place(e)}));
 const graphics=[];for(const e of document.querySelectorAll('svg,use'))if(visible(e)&&!e.closest('svg[display="none"]'))graphics.push({tag:e.tagName,id:e.id,href:e.getAttribute('href')||e.getAttribute('xlink:href'),location:place(e)});
 const backgrounds=[];for(const e of document.querySelectorAll('body *'))if(visible(e)){const s=getComputedStyle(e);for(const key of ['backgroundImage','maskImage'])if(s[key]&&s[key]!=='none'&&s[key].includes('url('))backgrounds.push({property:key,value:s[key],location:place(e)})}
 return {texts,images,graphics,backgrounds,forms:[...document.querySelectorAll('input,textarea,select,button')].filter(e=>visible(e)&&e.getAttribute('aria-hidden')!=='true').map(e=>({tag:e.tagName,name:e.name,type:e.type,placeholder:e.placeholder||'',required:e.required,options:e.options?[...e.options].map(o=>o.text):[],text:e.innerText||''})),metadata:[...document.querySelectorAll('title,meta[name="description"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],script[type="application/ld+json"]')].map(e=>({name:e.name||e.getAttribute('property')||e.rel||e.tagName,value:e.content||e.href||e.textContent})),links:[...document.querySelectorAll('a')].filter(visible).map(e=>({text:e.innerText,href:e.getAttribute('href')}))};
}'''
rows=json.loads((ROOT/'tools/content-inventory-data.json').read_text()) if '--from-data' in sys.argv else []
if '--from-data' not in sys.argv:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
        for route in ROUTES:
            record={'route':route,'views':[],'errors':[],'warnings':[],'external':[],'bad_status':[]}
            for width in [375,1280]:
                page=browser.new_page(viewport={'width':width,'height':900})
                page.on('pageerror',lambda e:record['errors'].append(str(e)))
                page.on('console',lambda m:record['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
                page.on('request',lambda r:record['external'].append(r.url) if urlsplit(r.url).netloc not in ('','127.0.0.1:8765') else None)
                page.on('response',lambda r:record['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
                page.goto('http://127.0.0.1:8765'+route,wait_until='networkidle')
                for y in range(0,page.evaluate('document.documentElement.scrollHeight'),700):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(100)
                page.wait_for_timeout(500)
                def capture(state):
                    view=page.evaluate(DATA_JS);view['width']=width;view['state']=state;record['views'].append(view)
                capture('default')
                if route=='/':
                    for label in ['Framer Development','Branding','Web Design']:
                        control=page.get_by_text(label,exact=True).first
                        if control.count():
                            control.click();page.wait_for_timeout(500);capture(label)
                    for control in page.locator('[data-framer-name="Question"][data-highlight="true"]').all():
                        control.click();page.wait_for_timeout(350);capture('FAQ expanded');control.click()
                if width==375:
                    control=page.locator('.framer-17gqyph').first
                    if control.count():
                        control.click();page.wait_for_timeout(350);capture('mobile menu expanded');control.click()

                assert not page.locator('#pricing,#__framer-badge-container,.framer-1f3ejyv-container,a[href*="pricing"]').count(),route
                page.close()
            rows.append(record);print(route,'texts',sum(len(v['texts']) for v in record['views']),'images',sum(len(v['images']) for v in record['views']),'errors',record['errors'],flush=True)
            (ROOT/'tools/content-inventory-data.json').write_text(json.dumps(rows,indent=2))
        browser.close()

def sources(value,static):
    hits=[]
    for file,text in source_files.items():
        if file.endswith('.html') and file!=static:continue
        if value in html.unescape(text):
            kind='static HTML' if file.endswith('.html') else 'CMS binary data' if '.framercms' in file or '/cms/' in reverse.get('/'+file,'') else 'search JSON' if file.endswith('.json') else 'JS chunk' if file.endswith('.mjs') else 'asset'
            hits.append(f'{file} ({kind})')
    return '; '.join(hits) or 'Hydrated composition; see route HTML and runtime chunk'
def flag(value,location=''):
    s=(value+' '+location).lower()
    if value in ('Revanth','REVANTH','GitHub','personallyrevanth@gmail.com'):return 'Supplied identity/contact'
    if any(x in s for x in ['testimonial','happy clients','co-founder','ceo of','cto of','founder of']):return 'FAKE/UNVERIFIED template client claim or testimonial'
    if any(x in s for x in ['logoipsum','trusted','technologies']):return 'Placeholder technology/logo strip; logos not swapped yet'
    if any(x in s for x in ['available','dec','2025','6+ years']):return 'Placeholder date/availability/experience'
    if any(x in s for x in ['revenue','conversion','raised','repeat purchases','15%','20%','4x','$5m']):return 'FAKE/UNVERIFIED template metric'
    if any(x in s for x in ['pricing','budget','50%','milestone','$','client','slack','quote','white-label',' nda']):return 'Placeholder commercial/pricing/client copy; later content swap'
    if 'lorem' in s or 'ipsum' in s:return 'Placeholder'
    return 'Template content; not verified as Revanth personal content'
def cell(value):return str(value).replace('|','\\|').replace('\n','<br>')
lines=['# Content inventory','', 'Read-only inventory after Phase 2a. Template claims are not facts about Revanth. Sources are matched against served files; `captured/` was not modified. Both phone and desktop DOMs were sampled, including off-screen and hover/reveal content. Identical strings are deduplicated per location within each route. Removed pricing/promotion content is preserved in the baseline appendix.','', 'GitHub data remains only in `tools/github-data.json`; it is not used by the site. The supplied pins have not replaced the template projects.','', 'Still pending: stock project case studies and metrics, fake testimonials (explicitly retained), old designer/client/service/about/FAQ copy, dates, technology-logo placeholders, social links other than GitHub, and contact Budget options. No manifest or JSON-LD exists in the captured served pages.','']
for record in rows:
    route=record['route'];static='index.html' if route=='/' else route.strip('/')+'/index.html'
    lines += [f'## Route {route}', '',f'Static source: `{static}`. Runtime and CMS sources are listed for each matching string/asset.','', '### Text', '', '| Current string | Location | Sources | Placeholder status |','| --- | --- | --- | --- |']
    seen=set()
    for view in record['views']:
        for item in view['texts']:
            key=(item['text'],item['location'])
            if key in seen:continue
            seen.add(key);lines.append('| '+' | '.join(map(cell,[item['text'],item['location'],sources(item['text'],static),flag(item['text'],item['location'])]))+' |')
    lines += ['','### Images','','| Local image | Original URL / alt | Location | Sources | Status |','| --- | --- | --- | --- | --- |']
    seen=set()
    for view in record['views']:
        for item in view['images']:
            src=item['src'] or urlsplit(item['currentSrc']).path
            local=urlsplit(item['currentSrc']).path if item['currentSrc'] else src
            key=(src,item['alt'],item['location'])
            if key in seen:continue
            seen.add(key)
            origin=reverse.get(local,src);status='Template image; not a Revanth asset'
            if not item['alt']:status+='; empty alt (decorative/unspecified)'
            lines.append('| '+' | '.join(map(cell,[local,origin+'; alt='+repr(item['alt']),item['location'],sources(src,static),status]))+' |')
            if item['srcset']:lines.append('| '+cell('srcset: '+item['srcset'])+' | Responsive candidates | '+cell(item['location'])+' | '+cell(static)+' (static HTML) | Template responsive variants |')
    lines += ['','### Inline graphics and CSS images','']
    graphics=[]
    for view in record['views']:
        for item in view['graphics']+view['backgrounds']:
            text=json.dumps(item,ensure_ascii=False)
            if text not in graphics:graphics.append(text)
    lines.extend('- `'+g.replace('`','\\`')+'` (route HTML/JS; decorative template graphic)' for g in graphics)
    lines += ['','### Form controls, metadata and links','']
    for category in ['forms','metadata','links']:
        lines.append('**'+category+'**');seen=set()
        for view in record['views']:
            for item in view[category]:
                text=json.dumps(item,ensure_ascii=False)
                if text not in seen:lines.append('- `'+text.replace('`','\\`')+'`');seen.add(text)
        lines.append('')
lines+=['## Baseline appendix: removed content','','Pricing/promotion strings remain here for planning; they are absent from the patched rendered pages. Compiled unused pricing component definitions/styles remain to preserve shared runtime references.','']
for token in ['Pricing','Remix for free','More Templates','Made in Framer']:
    lines.append('- Removed control/heading: '+token)
base=ROOT/'_baseline/index.html';text=base.read_text();node=next(n for n in Markup(text).nodes if n['attrs'].get('id')=='pricing')
from html.parser import HTMLParser
class RemovedText(HTMLParser):
    def handle_data(self,data):
        if data.strip() and data.strip() not in self.items:self.items.append(data.strip())
p=RemovedText();p.items=[];p.feed(text[node['start']:node['end']])
for value in p.items:lines.append('- '+value+' (`_baseline/index.html`, pricing section, template pricing placeholder)')
(ROOT/'CONTENT_INVENTORY.md').write_text('\n'.join(lines)+'\n')
assert len(rows)==7
assert all(not r['errors'] and not r['external'] and not r['bad_status'] for r in rows),rows
print('Wrote CONTENT_INVENTORY.md; all seven routes checked at phone and desktop.')
