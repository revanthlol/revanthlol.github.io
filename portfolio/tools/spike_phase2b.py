#!/usr/bin/env python3
"""Browser-only CMS experiment; no served source files are changed."""
import hashlib,html,json,sys
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from patch_phase2a import Markup
ROOT=Path(__file__).resolve().parents[1]
COLLECTION='assets/framerusercontent.com/aba02741a571e35654223869.mjs'
PROJECTS='assets/framerusercontent.com/9b477f352fe32a876a1167cd.mjs'
SLUGS=['leprint','slotforge','cyclr','erp','typd','textfx','focusd','socialmesh','omrealtor','fresh360','gild']
# Experimental fixtures reuse the original first record; none is portfolio content.
ADAPTER=r'''
vt();
const __old=$.collectionByLocaleId.default;
const __original=await __old.scanItems();
const __slugs=SLUGS;
const __items=__slugs.map((slug,index)=>{
 const data=structuredClone(__original[0].data);
 const string=value=>({type:a.String,value});
 data.id=string('spike-'+slug);data.JAY0WjSmm=string(slug);
 data.XHTNecnYe=string('[spike] '+slug);data.ROaF2GvSS=string('[spike] '+slug);
 data.previousItemId=index?string('spike-'+__slugs[index-1]):null;
 data.nextItemId=index+1<__slugs.length?string('spike-'+__slugs[index+1]):null;
 data.hri3Z_PUu={type:a.Link,value:slug==='gild'?'https://gild-two.vercel.app':'https://github.com/revanthlol/'+slug};
 return {pointer:'0/'+index+'/1',data};
});
const __byPointer=new Map(__items.map(item=>[item.pointer,item]));
$.collectionByLocaleId.default={schema:__old.schema,indexes:[],resolveRichText:__old.resolveRichText,
 async scanItems(){return __items},async resolveItems(pointers){return pointers.map(pointer=>{if(!__byPointer.has(pointer))throw Error('Missing spike pointer');return __byPointer.get(pointer)})},
 compareItems(left,right){return __items.indexOf(left)-__items.indexOf(right)},compareValues:__old.compareValues.bind(__old)};
export{$ as spikeCollection,gt as spikeUtils,Q as spikeQuery};
'''.replace('SLUGS',json.dumps(SLUGS))
collection=(ROOT/COLLECTION).read_text()+ADAPTER
projects=(ROOT/PROJECTS).read_text();assert projects.count('pageSize:4')==1
projects=projects.replace('pageSize:4','pageSize:11')
original=(ROOT/'projects/index.html').read_text();nodes=Markup(original).nodes
anchors=[n for n in nodes if n['tag']=='a' and n['attrs'].get('href','').startswith('./projects/')]
assert len(anchors)==4,len(anchors)
first=original[anchors[0]['start']:anchors[0]['end']]
blocks=[]
for slug in SLUGS:
 block=first.replace('href="'+anchors[0]['attrs']['href']+'"','href="/projects/'+slug+'/"')
 block=block.replace('>Bima<','>[spike] '+slug+'<')
 blocks.append(block)
start=anchors[0]['start'];end=anchors[-1]['end']
# Exact SSR fragment replacement only, retaining all surrounding page/layout markup.
ssr=original.replace(original[start:end],''.join(blocks),1)
rows=[];watched=[COLLECTION,PROJECTS,'projects/index.html']
hashes={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in watched}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in [375,768,1280,1920]:
  page=browser.new_page(viewport={'width':width,'height':900});page.set_default_timeout(10000)
  row={'width':width,'errors':[],'warnings':[],'requests':[],'bad_status':[],'failed':[]}
  page.on('pageerror',lambda e:row['errors'].append(str(e)))
  page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
  page.on('request',lambda r:row['requests'].append(r.url))
  page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
  page.on('requestfailed',lambda r:row['failed'].append([r.url,r.failure]))
  page.route('**/aba02741a571e35654223869.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=collection))
  page.route('**/9b477f352fe32a876a1167cd.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=projects))
  page.route('http://127.0.0.1:8765/projects/',lambda r:r.fulfill(status=200,content_type='text/html',body=ssr))
  try:
   page.goto('http://127.0.0.1:8765/projects/',wait_until='networkidle');page.wait_for_timeout(1500)
   row['cards']=page.locator('section[data-framer-name="Latest projects"] a[href*="/projects/"]').evaluate_all('(ns)=>ns.map(n=>({href:n.getAttribute("href"),text:n.innerText}))')
   row['slug_checks']=page.evaluate('''async (file)=>{const m=await import('/'+file),rows=await m.spikeCollection.collectionByLocaleId.default.scanItems();return Promise.all(rows.map(async item=>({slug:item.data.JAY0WjSmm.value,id:item.data.id.value,foundId:await m.spikeUtils.getRecordIdBySlug(item.data.JAY0WjSmm.value,'default'),foundSlug:await m.spikeUtils.getSlugByRecordId(item.data.id.value,'default')})))}''',COLLECTION)
   row['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth')
   row['projects_errors']=list(row['errors'])
   page.locator('section[data-framer-name="Latest projects"] a[href*="/gild"]').first.click();page.wait_for_timeout(1500)
   row['detail_url']=page.url;row['detail_text']=page.locator('body').inner_text()[:600]
   row['detail_links']=page.locator('a').evaluate_all('(ns)=>ns.map(n=>({href:n.href,text:n.innerText})).filter(n=>n.href.includes("gild-two")||n.href.includes("github.com/revanthlol/gild"))')
   row['detail_errors']=row['errors'][len(row['projects_errors']):]
   row['external']=[u for u in row['requests'] if urlsplit(u).netloc not in ('','127.0.0.1:8765')]
  except Exception as e:row['exception']=str(e)
  rows.append(row);page.close()
  (ROOT/'tools/phase2b-spike-results.json').write_text(json.dumps(rows,indent=2))
  print(width,'cards',len(row.get('cards',[])),'errors',row['errors'],'detail',row.get('detail_url'),'exception',row.get('exception'),flush=True)
 browser.close()
assert hashes=={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in watched}
print('Served-source hashes unchanged. Experiment results saved; inspect before choosing implementation.')
