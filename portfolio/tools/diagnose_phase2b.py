"""Isolated golden comparison and at most three LePrint hydration experiments."""
import sys,json,hashlib,html
from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
from difflib import SequenceMatcher
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from patch_phase2a import Markup
ROOT=Path(__file__).resolve().parents[1]
# Reuse the experiment constants, without executing its runner.
exec((ROOT/'tools/spike_phase2b_details.py').read_text().split('with sync_playwright() as p:')[0])
original=(ROOT/COLLECTION).read_text()
base_config=json.loads(base_node['attrs']['data-framer-hydrate-v2'])
def inner(doc):
 n=next(n for n in Markup(doc).nodes if n['attrs'].get('id')=='main');i=doc.index('>',n['start'])+1;return doc[i:n['end']-6]
class Tokens(HTMLParser):
 def __init__(self,s):
  super().__init__();self.tokens=[];self.feed(s)
 def handle_starttag(self,t,a):self.tokens.append(('start',t,tuple(sorted(a))))
 def handle_endtag(self,t):self.tokens.append(('end',t))
 def handle_data(self,t):
  if t.strip():self.tokens.append(('text',t))
 def handle_comment(self,t):self.tokens.append(('comment',t))
def summary(a,b):
 aa=Tokens(a).tokens;bb=Tokens(b).tokens;changes=[]
 for op,i,j,k,l in SequenceMatcher(None,aa,bb,autojunk=False).get_opcodes():
  if op!='equal':changes.append({'operation':op,'captured':repr(aa[i:j])[:650],'generated':repr(bb[k:l])[:650]})
 return {'equal_ignoring_attribute_order_and_whitespace':aa==bb,'captured_bytes':len(a),'generated_bytes':len(b),'captured_tokens':len(aa),'generated_tokens':len(bb),'changed_regions':len(changes),'examples':changes[:18],'captured_comments':[x[1] for x in aa if x[0]=='comment'][:30],'generated_comments':[x[1] for x in bb if x[0]=='comment'][:30],'captured_tags':dict(Counter(x[1] for x in aa if x[0]=='start')),'generated_tags':dict(Counter(x[1] for x in bb if x[0]=='start'))}
def paths(s):
 # Exact literals only; cover document/chunk asset strings and fixture card paths.
 for old,new in [('../../assets/','/assets/'),('../assets/','/assets/'),('./assets/','/assets/'),('"./projects/','"/projects/'),('`./projects/','`/projects/')]:s=s.replace(old,new)
 return s
sources={p:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.rglob('*') if p.is_file() and (p==ROOT/'index.html' or p.parent==ROOT/'assets/framerusercontent.com' or p.parts[-3:-1]==('projects','bima-ai-agency-template'))}
result={'golden':{},'attempts':[]}
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 def build(data,props,width):
  page=browser.new_page(viewport={'width':width,'height':900})
  page.route('**/aba02741a571e35654223869.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=data))
  page.route('**/e20b170e00af0a816fc7b3e2.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=builder_main))
  page.goto('http://127.0.0.1:8765/projects/bima-ai-agency-template/',wait_until='networkidle')
  page.evaluate('async file=>{const m=await import("/"+file);m.o();globalThis.React=m.C}',CORE)
  page.add_script_tag(content=server)
  output=page.evaluate('''async ({file,props})=>{const m=await import('/'+file),e=await m.getPageRoot(props),s=await ReactDOMServer.renderToReadableStream(e);await s.allReady;return await new Response(s).text()}''',{'file':MAIN,'props':props})
  page.close();return output
 rendered=build(original,base_config,1280)
 (ROOT/'tools/golden-bima-generated.html').write_text(rendered)
 result['golden']=summary(inner(base),rendered)
 # Control: captured Bima document, unmodified runtime.
 control=browser.new_page(viewport={'width':375,'height':900});msgs=[]
 control.on('console',lambda m:msgs.append(m.text) if m.type in ['warning','error'] else None)
 control.goto('http://127.0.0.1:8765/projects/bima-ai-agency-template/',wait_until='networkidle');control.wait_for_timeout(700)
 result['golden']['captured_control_hydration_warnings']=sum('recoverable' in m.lower() for m in msgs);control.close()
 (ROOT/'tools/phase2b-golden-results.json').write_text(json.dumps(result,indent=2))
 print('Golden',result['golden']['changed_regions'],'changed regions; control hydration',result['golden']['captured_control_hydration_warnings'],flush=True)
 # One direct route only. Fix paths before evaluating hydration.
 props=dict(base_config);props.update(pathVariables={'JAY0WjSmm':'leprint'},collectionItemId='spike-leprint')
 for attempt,width,static_flag in [(1,1280,False),(2,375,False),(3,375,True)]:
  if static_flag:
   # Static renderer tests whether live renderer's suspense streaming is the cause.
   pass
  output=build(paths(collection),props,width)
  if static_flag:
   # Remove only React's completed Suspense delimiters, testing the captured boundary shape.
   output=output.replace('<!--$-->','').replace('<!--/$-->','')
  attrs=dict(base_node['attrs']);attrs['data-framer-hydrate-v2']=json.dumps(props,separators=(',',':'))
  tag='<div '+' '.join(k if v is None else k+'="'+html.escape(v,quote=True)+'"' for k,v in attrs.items())+'>'
  doc=paths(base.replace(base[base_node['start']:base_node['end']],tag+output+'</div>',1)).replace('<head>','<head><base href="/">',1)
  ctx=browser.new_context(viewport={'width':375,'height':900});page=ctx.new_page();row={'attempt':attempt,'focus':['root-relative paths with existing builder viewport','matching builder viewport to target','completed Suspense delimiters removed to match captured shape'][attempt-1],'warnings':[],'errors':[],'bad_status':[],'external':[]}
  ctx.route('**/aba02741a571e35654223869.mjs',lambda r:r.fulfill(status=200,content_type='text/javascript',body=paths(collection)))
  ctx.route('http://127.0.0.1:8765/projects/leprint/',lambda r:r.fulfill(status=200,content_type='text/html',body=doc))
  page.on('console',lambda m:row['warnings' if m.type=='warning' else 'errors'].append(m.text) if m.type in ['warning','error'] else None)
  page.on('pageerror',lambda e:row['errors'].append(str(e)))
  page.on('response',lambda r:row['bad_status'].append([r.status,r.url]) if r.status>=400 else None)
  page.on('request',lambda r:row['external'].append(r.url) if urlsplit(r.url).netloc!='127.0.0.1:8765' else None)
  page.goto('http://127.0.0.1:8765/projects/leprint/',wait_until='networkidle');page.wait_for_timeout(700)
  row['hydration_count']=sum('recoverable' in w.lower() or 'hydration' in w.lower() for w in row['warnings'])
  row['runtime_loaded']=page.evaluate('!!window.__framer_importFromPackage');row['headings']=page.locator('h1').all_text_contents();row['asset_urls']=page.locator('img').evaluate_all('(ns)=>ns.map(n=>n.src)')
  row['hrefs']=page.locator('a').evaluate_all('(ns)=>ns.map(n=>n.getAttribute("href"))')
  result['attempts'].append(row);ctx.close();(ROOT/'tools/phase2b-golden-results.json').write_text(json.dumps(result,indent=2))
  print('Attempt',attempt,'hydration',row['hydration_count'],'errors',len(row['errors']),'404s',len(row['bad_status']),flush=True)
  if not row['hydration_count'] and not row['errors']:break
 browser.close()
assert all(hashlib.sha256(p.read_bytes()).hexdigest()==h for p,h in sources.items())
print('Served source hashes unchanged.')
