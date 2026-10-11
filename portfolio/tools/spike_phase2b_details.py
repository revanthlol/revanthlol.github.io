#!/usr/bin/env python3
"""Generate experiment HTML with React's SSR renderer and test in-memory overrides."""
import hashlib,html,json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from patch_phase2a import Markup
ROOT=Path(__file__).resolve().parents[1]
COLLECTION='assets/framerusercontent.com/aba02741a571e35654223869.mjs'
MAIN='assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs'
PROJECTS='assets/framerusercontent.com/9b477f352fe32a876a1167cd.mjs'
CORE='assets/framerusercontent.com/8d44bc9696caad172d1da6d5.mjs'
SLUGS=['leprint','slotforge','cyclr','erp','typd','textfx','focusd','socialmesh','omrealtor','fresh360','gild']
# Reuse the isolated typed fixture adapter, never importing the prior runner.
prior=(ROOT/'tools/spike_phase2b.py').read_text();start=prior.index("ADAPTER=r'''")+len("ADAPTER=r'''");end=prior.index("'''.replace('SLUGS'",start)
adapter=prior[start:end].replace('SLUGS',json.dumps(SLUGS))
adapter=adapter.replace('const data=structuredClone(__original[0].data);','const data=structuredClone(__original[0].data); const clean=value=>{if(!value||typeof value!==\"object\")return;if(value.type===a.ResponsiveImage&&value.value)delete value.value.srcSet;for(const child of Object.values(value))clean(child)};clean(data);')
collection=(ROOT/COLLECTION).read_text()+adapter
main=(ROOT/MAIN).read_text()
hydrate='let e=document.getElementById(`main`);`framerHydrateV2`in e.dataset?lr(!0,e):lr(!1,e)'
assert main.count(hydrate)==1
builder_main=main.replace(hydrate,'void 0')
projects=(ROOT/PROJECTS).read_text();assert projects.count('pageSize:4')==1
projects=projects.replace('pageSize:4','pageSize:11')
server=(ROOT/'tools/node_modules/react-dom/umd/react-dom-server.browser.production.min.js').read_text()
base=(ROOT/'projects/bima-ai-agency-template/index.html').read_text();base_node=next(n for n in Markup(base).nodes if n['attrs'].get('id')=='main')
project_base=(ROOT/'projects/index.html').read_text();project_node=next(n for n in Markup(project_base).nodes if n['attrs'].get('id')=='main')
rows=[];generation=[];generated={};source_hashes={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in [COLLECTION,MAIN,PROJECTS,'projects/index.html','projects/bima-ai-agency-template/index.html']}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 builder=browser.new_page(viewport={'width':1280,'height':900});builder.set_default_timeout(15000)
 builder.route('**/aba02741a571e35654223869.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=collection))
 builder.route('**/e20b170e00af0a816fc7b3e2.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=builder_main))
 builder.route('**/9b477f352fe32a876a1167cd.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=projects))
 builder.goto('http://127.0.0.1:8765/projects/',wait_until='networkidle')
 builder.evaluate('''async core=>{let m=await import('/'+core);m.o();globalThis.React=m.C}''',CORE)
 builder.add_script_tag(content=server)
 for slug in ['index']+SLUGS:
  record={'slug':slug,'errors':[]};builder.on('console',lambda m:record['errors'].append(m.text) if m.type=='error' else None)
  try:
   props={'routeId':'YEOqcEier','localeId':'default'} if slug=='index' else {'routeId':'vGddleDz8','pathVariables':{'JAY0WjSmm':slug},'localeId':'default','collectionItemId':'spike-'+slug}
   rendered=builder.evaluate('''async ({file,props})=>{const m=await import('/'+file),element=await m.getPageRoot(props);const stream=await ReactDOMServer.renderToReadableStream(element);await Promise.race([stream.allReady,new Promise((_,reject)=>setTimeout(()=>reject(Error('SSR allReady timed out')),12000))]);return await new Response(stream).text()}''',{'file':MAIN,'props':props})
   template,node=(project_base,project_node) if slug=='index' else (base,base_node)
   config=json.loads(node['attrs']['data-framer-hydrate-v2']);config.update(props)
   attrs=dict(node['attrs']);attrs['data-framer-hydrate-v2']=json.dumps(config,separators=(',',':'))
   tag='<div '+ ' '.join(k if v is None else k+'="'+html.escape(v,quote=True)+'"' for k,v in attrs.items())+'>'
   new_main=tag+rendered+'</div>'
   doc=template.replace(template[node['start']:node['end']],new_main,1)
   # Only outer-document paths/metadata are adjusted, not hand-edited rendered JSX.
   generated['/projects/' if slug=='index' else '/projects/'+slug]=doc
   record['html_length']=len(rendered)
  except Exception as e:record['exception']=str(e)
  generation.append(record);print('SSR',slug,record.get('html_length'),record.get('exception'),flush=True)
  if record.get('exception'):break
 builder.close()
 (ROOT/'tools/phase2b-detail-spike-generation.json').write_text(json.dumps(generation,indent=2))
 for width in [375,768,1280,1920]:
  if len(generated)!=12:break
  context=browser.new_context(viewport={'width':width,'height':900})
  context.route('**/aba02741a571e35654223869.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=collection))
  context.route('**/9b477f352fe32a876a1167cd.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=projects))
  def documents(route):
   path=urlsplit(route.request.url).path.rstrip('/')
   key='/projects/' if path=='/projects' else path
   if key in generated:route.fulfill(status=200,content_type='text/html',body=generated[key])
   else:route.continue_()
  context.route('http://127.0.0.1:8765/projects/**',documents)
  for slug in SLUGS:
   row={'width':width,'slug':slug,'errors':[],'warnings':[],'requests':[],'bad_status':[],'failed':[],'actions':[]};page=context.new_page();page.set_default_timeout(12000)
   page.on('console',lambda m:row['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ['error','warning'] else None)
   page.on('pageerror',lambda e:row['errors'].append(str(e)))
   page.on('request',lambda r:row['requests'].append(r.url))
   page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
   page.on('requestfailed',lambda r:row['failed'].append([r.url,r.failure]))
   try:
    for action in ['direct','reload','cards','navigate','back','forward']:
     if action=='direct':page.goto('http://127.0.0.1:8765/projects/'+slug,wait_until='networkidle')
     elif action=='reload':page.reload(wait_until='networkidle')
     elif action=='cards':page.goto('http://127.0.0.1:8765/projects/',wait_until='networkidle')
     elif action=='navigate':page.locator('section[data-framer-name="Latest projects"] a[href$="/'+slug+'"]').first.click()
     elif action=='back':page.go_back(wait_until='networkidle')
     else:page.go_forward(wait_until='networkidle')
     page.wait_for_timeout(350)
     row['actions'].append({'action':action,'url':page.url,'headings':page.locator('h1').all_text_contents()})
    row['hydration_warnings']=[w for w in row['warnings'] if any(s in w.lower() for s in ['recoverable','hydration','server/client','minified react error'])]
    row['external']=[u for u in row['requests'] if urlsplit(u).netloc not in ('','127.0.0.1:8765')]
    row['links']=page.locator('a').evaluate_all('(ns)=>ns.map(n=>({text:n.innerText,href:n.href})).filter(n=>n.href.includes("gild-two")||n.href.includes("github.com/revanthlol/gild"))') if slug=='gild' else []
   except Exception as e:row['exception']=str(e)
   rows.append(row);page.close();(ROOT/'tools/phase2b-detail-spike-results.json').write_text(json.dumps(rows,indent=2))
   print(width,slug,'errors',len(row['errors']),'hydration',len(row.get('hydration_warnings',[])),row.get('exception'),flush=True)
   if row.get('exception') or row['errors'] or row.get('hydration_warnings'):break
  context.close()
  if rows and (rows[-1].get('exception') or rows[-1]['errors'] or rows[-1].get('hydration_warnings')):break
 browser.close()
assert source_hashes=={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in source_hashes}
print('Served files unchanged. Do not interpret generated HTML alone as a passing hydration test.')
