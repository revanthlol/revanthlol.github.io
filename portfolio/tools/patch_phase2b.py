#!/usr/bin/env python3
"""Repeatable counted patches on Phase 2a; static details are a separate step."""
import hashlib,html,json,shutil,subprocess,tempfile
from pathlib import Path
from patch_phase2a import Markup
from phase2b_components import *
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'_phase2a_baseline'
HOME='assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs';MAIN='assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs';LIST='assets/framerusercontent.com/9b477f352fe32a876a1167cd.mjs';CONTACT='assets/framerusercontent.com/8b009bbdb40fdb2a701b8f3e.mjs';CARD='assets/framerusercontent.com/12e83545c455d886f0604cbc.mjs'
DEFS=definitions();logs=[]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 manifest=json.loads((ROOT/'tools/phase2a-baseline-manifest.json').read_text());assert all(digest(BASE/m['file'])==m['sha256'] for m in manifest),'Phase2a baseline changed'
 with tempfile.TemporaryDirectory(prefix='phase2b-',dir=ROOT/'tools') as temporary:
  stage=Path(temporary)/'site';shutil.copytree(BASE,stage)
  def patch(file,old,new,reason,expected=1):
   path=stage/file;s=path.read_text();count=s.count(old);assert count==expected,(file,reason,count,expected)
   path.write_text(s.replace(old,new));logs.append({'file':file,'string':old,'replacement':new,'count':count,'reason':reason})
  def write(file,text,reason):
   p=stage/file;p.parent.mkdir(parents=True,exist_ok=True)
   if p.exists():patch(file,p.read_text(),text,reason)
   else:p.write_text(text);logs.append({'file':file,'string':None,'replacement':text,'count':1,'reason':reason})
  def ast(file,mode,key):return json.loads(subprocess.check_output(['node',str(ROOT/'tools/phase2b_ast.cjs'),str(stage/file),mode,key]))
  def replace_call(file,mode,key,kind=None,outer=False):
   rows=ast(file,mode,key);assert rows,(file,mode,key)
   if outer:rows=[max(rows,key=lambda r:len(r['old']))]
   for r in rows:patch(file,r['old'],r['callee']+'(RevStatic,{kind:'+json.dumps(kind)+'})' if kind else 'null','Replace runtime '+key+' with '+str(kind))
  def ssr(file,predicate,new,reason):
   text=(stage/file).read_text();nodes=[n for n in Markup(text).nodes if predicate(n)];assert nodes,(file,reason)
   # Only outermost selected nodes; captured HTML is not reformatted.
   nodes=[n for n in nodes if not any(m['start']<n['start'] and m['end']>=n['end'] for m in nodes)]
   for n in reversed(nodes):
    old=text[n['start']:n['end']];count=(stage/file).read_text().count(old)
    if count:patch(file,old,new,reason,count)
  def add_import(file):
   s=(stage/file).read_text();patch(file,s[:s.index(';')+1],s[:s.index(';')+1]+'import{Static as RevStatic}from"../phase2b-components.mjs";','Import shared static runtime component')
  for file in [HOME,MAIN,LIST,CONTACT,CARD]:add_import(file)
  # One immutable element-definition source powers prerender and hydrated output.
  payload=json.dumps(DEFS,ensure_ascii=False,separators=(',',':'))
  write('assets/phase2b-components.mjs','import{C as React,o as init}from"./framerusercontent.com/8d44bc9696caad172d1da6d5.mjs";init();const trees='+payload+';function element(n){if(n===null||typeof n==="string")return n;const[t,p,c]=n;return React.createElement(t,p,...c.map(element))}export function Static({kind}){return element(trees[kind])}','Shared static trees rendered with the bundled React instance')
  write('assets/projects-data.json',json.dumps(PROJECTS,ensure_ascii=False,indent=2),'Public project data and independently switchable card hrefs')
  write('assets/custom.css',(ROOT/'tools/phase2b_custom.css').read_text(),'Reusable Focus rack and approved content layouts')
  # Runtime and SSR change together, not client-side injection.
  replace_call(HOME,'class','framer-13160wj','home-projects');ssr('index.html',lambda n:n['attrs'].get('id')=='projects',markup(DEFS['home-projects']),'Home cards SSR from shared static array')
  replace_call(LIST,'class','framer-3xw7pi','projects');ssr('projects/index.html',lambda n:n['attrs'].get('class')=='framer-3xw7pi',markup(DEFS['projects']),'Projects cards SSR from shared static array')
  for name in ['Testimonials']:
   replace_call(HOME,'name',name,None,True);ssr('index.html',lambda n:n['attrs'].get('data-framer-name')==name,'','Remove '+name+' SSR and runtime')
  replace_call(HOME,'class','framer-1kppelj',None);ssr('index.html',lambda n:n['attrs'].get('class')=='framer-1kppelj','','Remove availability tag')
  replace_call(HOME,'class','framer-1qt92hm','tech');ssr('index.html',lambda n:n['attrs'].get('class')=='framer-1qt92hm',markup(DEFS['tech']),'24 approved technologies replace logo strip')
  from restore_phase2b_native import restore
  restore(stage,patch,ast,ssr,replace_call,DEFS)
  from restore_phase2b_tabs import restore_tabs
  restore_tabs(stage,patch,ast,ssr)
  # Preserve the native accordion. Remove only fifth item and trailing divider.
  for cls in ['framer-1hnotmg-container','framer-8tr5k9-container']:
   r=ast(HOME,'class',cls)[0];wrapper=next(p for p in reversed(r['parents']) if p['callee']=='p' and p['old'].startswith('p(W,'));patch(HOME,wrapper['old'],'null','Remove fifth FAQ item or trailing divider')
   ssr('index.html',lambda n:n['attrs'].get('class')==cls,'','Remove fifth FAQ SSR item or trailing divider')
  faq_source=(BASE/HOME).read_text();faq_props=next(r['props'] for r in ast(HOME,'tag','Li') if any(p['key']=='HHqY1P6ZH' and isinstance(p.get('value'),str) for p in r['props']));mapping=[('HHqY1P6ZH','eJyvvvFJa'),('iOE65SpYC','jPO_qL__s'),('yhckWiqPB','qTngwpCeb'),('r52VGsonF','L9lxqCdtb')]
  for i,(q,a_key) in enumerate(mapping):
   for key,new in [(q,FAQ[i][0]),(a_key,FAQ[i][1])]:
    old=next(p['value'] for p in faq_props if p['key']==key)
    for file in [HOME,'index.html']:
     text=(stage/file).read_text()
     if old in text:patch(file,old,new,'Approved FAQ text throughout defaults/SSR/runtime',text.count(old))
  # Empty fifth FAQ defaults, now unreachable.
  for key in ['GsiCzR_i0','hOKggGjuh']:
   old=next(p['value'] for p in faq_props if p['key']==key);text=(stage/HOME).read_text()
   if old in text:patch(HOME,old,'','Remove dormant fifth FAQ copy',text.count(old))
  # The native dynamic template-detail route is no longer needed; anchors use static routes.
  route=',vGddleDz8:{collectionId:`G6CQli_2A`,elements:{},page:I(()=>import(`./42f270154bab0bea1700f521.mjs`)),path:`/projects/:JAY0WjSmm`}'
  patch(MAIN,route,'','Remove native old template-detail route; new details use static anchors')
  for file in [MAIN,'index.html','projects/index.html','contact/index.html']:
   text=(stage/file).read_text();old='(04)' if file==MAIN else '>(04)<'
   if old in text:patch(file,old,f'({len(PROJECTS):02d})' if file==MAIN else f'>({len(PROJECTS):02d})<','Navigation collection count',text.count(old))
  # Keep internal identifiers and asset provenance; old documents are removed below.
  # Dormant template component labels/defaults are separable typed string literals.
  for file in [HOME,MAIN,LIST,CONTACT,CARD]:
   literals=json.loads(subprocess.check_output(['node',str(ROOT/'tools/phase2b_literals.cjs'),str(stage/file)]))
   for old in literals:
    text=(stage/file).read_text()
    if old in text:patch(file,old,'""','Remove dormant template string literal',text.count(old))
  # Unused descriptive input fields, not Framer hashed identifiers.
  for old,new in [('pricingName:','legacyHeading:'),('testimonial:','legacyCopy:')]:
   text=(stage/HOME).read_text()
   if old in text:patch(HOME,old,new,'Remove retired component input name',text.count(old))
  # Metadata is replaced structurally by exact existing tag strings.
  person={'@context':'https://schema.org','@type':'Person','name':'Revanth','url':'https://revanthlol.github.io/','email':EMAIL,'sameAs':[url for _,url in SOCIALS]}
  def metadata(file,title,description,route,noindex=False):
   text=(stage/file).read_text()
   for n in Markup(text).nodes:
    attrs=n['attrs'];key=attrs.get('name') or attrs.get('property');new=None
    if n['tag']=='title':new='<title>'+html.escape(title)+'</title>'
    elif n['tag']=='meta' and key in ['description','og:description','twitter:description']:new='<meta '+('property' if 'property' in attrs else 'name')+'="'+key+'" content="'+html.escape(description,quote=True)+'">'
    elif n['tag']=='meta' and key in ['og:title','twitter:title']:new='<meta '+('property' if 'property' in attrs else 'name')+'="'+key+'" content="'+html.escape(title,quote=True)+'">'
    elif n['tag']=='meta' and key in ['og:url','twitter:url']:new='<meta '+('property' if 'property' in attrs else 'name')+'="'+key+'" content="https://revanthlol.github.io'+route+'">'
    elif n['tag']=='meta' and key in ['og:image','twitter:image']:new='<meta '+('property' if 'property' in attrs else 'name')+'="'+key+'" content="/assets/share.png">'
    elif n['tag']=='link' and attrs.get('rel')=='canonical':new='<link rel="canonical" href="https://revanthlol.github.io'+route+'">'
    elif n['tag']=='link' and 'icon' in attrs.get('rel',''):new='<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">'
    if new and new!=text[n['start']:n['end']]:patch(file,text[n['start']:n['end']],new,'Per-route SEO metadata')
   addition='<link rel="stylesheet" href="/assets/custom.css"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><script type="application/ld+json">'+json.dumps(person,separators=(',',':'))+'</script>'
   if noindex:addition+='<meta name="robots" content="noindex">'
   patch(file,'</head>',addition+'</head>','Local styles/favicon/Person schema and index rules')
  metadata('index.html','Revanth | Student and open source developer',HERO,'/')
  metadata('projects/index.html','Projects | Revanth','Web apps, browser tools, Linux utilities and websites by Revanth.','/projects/')
  metadata('contact/index.html','Connect | Revanth','Contact Revanth by email or through public social profiles.','/contact/')
  metadata('404/index.html','Page not found | Revanth','The requested page could not be found. Browse projects or return to the home page.','/404/',True)
  # Keep the designed 404 body; rewrite its copy in both runtime and captured HTML.
  old='Looks like this page went off-script. Let’s get you back on the right workflow.'
  for file in ['404/index.html','assets/framerusercontent.com/d782a072d595ff29ba090c8e.mjs']:
   text=(stage/file).read_text()
   if old in text:patch(file,old,'The page does not exist or has moved.','Plain 404 copy',text.count(old))
  # Tier 2: reuse captured detail CSS and content layout classes, without runtime hydration.
  captured=(BASE/'projects/bima-ai-agency-template/index.html').read_text();head=captured[:captured.index('</head>')+7]
  # Remove module scripts, preload and any original metadata in the template head.
  nodes=Markup(head).nodes
  for n in reversed(nodes):
   attrs=n['attrs'];key=attrs.get('name') or attrs.get('property')
   if n['tag']=='script' or n['tag']=='title' or (n['tag']=='link' and attrs.get('rel') in ['modulepreload','canonical','icon','apple-touch-icon']) or (n['tag']=='meta' and (key in ['description','generator'] or (key or '').startswith(('og:','twitter:')))):
    head=head[:n['start']]+head[n['end']:]
  for prefix in ['../../assets/','../assets/','./assets/']:head=head.replace(prefix,'/assets/')
  from phase2b_static_shell import shell
  native_header,native_footer=shell(stage)
  write('assets/static-shell.js',(ROOT/'tools/phase2b_static_shell.js').read_text(),'Keyboard-operable menu for captured static navbar')
  detail_steps=[]
  for p in PROJECTS:
   file='projects/'+p['slug']+'/index.html';title=p['name']+' | Revanth';route='/projects/'+p['slug']+'/'
   meta='<title>'+html.escape(title)+'</title><meta name="description" content="'+html.escape(p['description'],quote=True)+'"><link rel="canonical" href="https://revanthlol.github.io'+route+'">'
   for key,value in [('og:title',title),('og:description',p['description']),('og:url','https://revanthlol.github.io'+route),('og:image','/assets/share.png'),('og:type','website'),('twitter:card','summary_large_image'),('twitter:title',title),('twitter:description',p['description']),('twitter:image','/assets/share.png')]:meta+='<meta '+('property' if key.startswith('og:') else 'name')+'="'+key+'" content="'+html.escape(value,quote=True)+'">'
   meta+='<link rel="stylesheet" href="/assets/custom.css"><link rel="icon" href="/assets/favicon.svg"><script type="application/ld+json">'+json.dumps(person,separators=(',',':'))+'</script>'
   doc=head.replace('</head>',meta+'</head>')+'<body class="rev-static">'+native_header+markup(detail(p))+native_footer+'<script src="/assets/static-shell.js" defer></script>'+'</body></html>'
   assert 'type="module"' not in doc and 'framer-hydrate' not in doc
   write(file,doc,'Static detail step '+p['slug']);detail_steps.append(file)
  # Old template pages disappear. Original baseline/captured files remain immutable.
  old_directories=[p for p in (stage/'projects').iterdir() if p.is_dir() and p.name not in {p['slug'] for p in PROJECTS}]
  for p in old_directories:
   for f in p.rglob('*'):
    if f.is_file():logs.append({'file':str(f.relative_to(stage)),'string':f.read_text() if f.suffix=='.html' else None,'replacement':None,'count':1,'reason':'Remove old template route; fallback to designed 404'})
   shutil.rmtree(p)
  # Search JSON reflects only final public content, with no duplicate email side effect.
  search={p['href'].rstrip('/'):{'version':1,'title':p['name'],'description':p['description'],'h1':[p['name']],'h2':[],'h3':[],'h4':[],'h5':[],'h6':[],'p':[p['description']],'url':p['href'],'keywords':'','codeblock':[]} for p in PROJECTS}
  search.update({'/':{'version':1,'title':'Revanth','description':HERO,'h1':['Student. Open source developer.'],'p':[ABOUT],'url':'/'}})
  for name in ['aa3809039f5a82dc2f229d25.json','315ac781d557ac9dded7ed8a.json']:write('assets/framerusercontent.com/'+name,json.dumps(search,ensure_ascii=False,separators=(',',':')),'Replace commercial search data with approved public content')
  # Normalize active document asset paths; preserve URL-map identity keys.
  for path in stage.rglob('*.html'):
   file=str(path.relative_to(stage));text=path.read_text()
   for prefix in ['../../assets/','../assets/','./assets/']:
    if prefix in text:patch(file,prefix,'/assets/','Root-relative assets at clean and unknown routes',text.count(prefix));text=path.read_text()
  # Remove stale template copy in dormant template-owned literals without changing identifiers.
  for file in [HOME,MAIN,LIST,CONTACT,CARD]:
   text=(stage/file).read_text()
   for old,new in [('BOOK A CALL','Connect'),('Book a call','Connect'),("LET'S TALK!",'Connect'),('Let’s Make It Happen.','Get in touch'),('© 2025 Revanth','© Revanth'),('cal.com','/contact/'),('Made by Velox Themes',''),('veloxthemes.com',''),('Velox Themes',''),('Arjuna',''),('ARJUNA','')]:
    if old in text:patch(file,old,new,'Remove dormant commercial/template copy',text.count(old));text=(stage/file).read_text()
  # Static designed 404 works at arbitrary nested URLs without runtime route matching.
  notfound=e('main',{'className':'rev-notfound rev-section'},e('h1',{},'404'),e('p',{},'Page not found'),e('p',{},'The page does not exist or has moved.'),a('Back to home','/'),a('Projects','/projects/'))
  nfhead=head.replace('</head>','<title>Page not found | Revanth</title><meta name="description" content="The requested page could not be found. Browse projects or return to the home page."><link rel="canonical" href="https://revanthlol.github.io/404/"><meta name="robots" content="noindex"><meta property="og:title" content="Page not found | Revanth"><meta property="og:description" content="The requested page could not be found. Browse projects or return to the home page."><meta property="og:image" content="/assets/share.png"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/custom.css"><link rel="icon" href="/assets/favicon.svg"></head>')
  nfdoc=nfhead+'<body class="rev-static">'+native_header+markup(notfound)+native_footer+'<script src="/assets/static-shell.js" defer></script>'+'</body></html>'
  write('404/index.html',nfdoc,'Designed static 404 with plain header/footer and noindex')
  write('404.html',nfdoc,'GitHub Pages designed fallback')
  routes=['/','/projects/','/contact/']+[p['href'] for p in PROJECTS]
  write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>https://revanthlol.github.io'+r+'</loc></url>' for r in routes)+'</urlset>','Public sitemap without 404')
  write('robots.txt','User-agent: *\nAllow: /\nSitemap: https://revanthlol.github.io/sitemap.xml\n','Public crawler rules')
  write('llms.txt','# Revanth\n\n'+HERO+'\n\n## Pages\n- [Projects](https://revanthlol.github.io/projects/)\n- [Connect](https://revanthlol.github.io/contact/)\n\n## Projects\n'+''.join('- ['+p['name']+'](https://revanthlol.github.io'+p['href']+'): '+p['description']+'\n' for p in PROJECTS),'Factual public site summary')
  from build_embedded_terminal import build
  build(stage,write)
  from generate_phase2b_assets import generate
  generate(stage)
  # Self-check before publishing the staged output; no baseline or captured writes.
  assert len(list((stage/'assets/projects').glob('*.webp')))==len(PROJECTS)
  assert all((stage/('projects/'+p['slug']+'/index.html')).exists() for p in PROJECTS)
  prior_manifest=ROOT/'tools/phase2b-output-manifest.json'
  if prior_manifest.exists():
   current={str(p.relative_to(stage)) for p in stage.rglob('*') if p.is_file()};original={m['file'] for m in manifest}
   for item in json.loads(prior_manifest.read_text()):
    name=item['file']
    if name not in current and name not in original:
     destination=ROOT/name
     assert destination.resolve().is_relative_to(ROOT) and Path(name).parts[0] in ('projects','assets')
     if destination.is_file():destination.unlink();logs.append({'file':name,'string':None,'replacement':None,'count':1,'reason':'Remove orphaned generated output, including separately removable GILD'})
  for path in stage.rglob('*'):
   if path.is_file():dest=ROOT/path.relative_to(stage);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,dest)
  for name in [p.name for p in old_directories]:
   dest=ROOT/'projects'/name
   if dest.exists():shutil.rmtree(dest)
  (ROOT/'tools/phase2b-replacements.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2))
  (ROOT/'tools/phase2b-output-manifest.json').write_text(json.dumps([{'file':str(p.relative_to(stage)),'sha256':digest(p)} for p in stage.rglob('*') if p.is_file()],indent=2))
  print(json.dumps({'operations':len(logs),'replacement_count':sum(l['count'] for l in logs),'details':detail_steps},indent=2))
 reference=ROOT/'css-reveal-playground.html'
 if reference.exists():dest=ROOT/'tools/reference/css-reveal-playground.html';dest.parent.mkdir(exist_ok=True);shutil.move(reference,dest)
if __name__=='__main__':main()
