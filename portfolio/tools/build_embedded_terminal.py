"""Copy the original TUI, then apply counted exact patches to its embedded copy."""
import json
from pathlib import Path
from phase2b_components import ABOUT,EMAIL,SOCIALS,PROJECTS
ROOT=Path(__file__).resolve().parents[1];REPO=ROOT.parent
PALETTE=dict(bg='#111111',surface='#191919',overlay='#777777',fg='#f5f5f5',muted='#aaaaaa',blue='#eeeeee',pink='#cccccc',red='#ffffff',green='#dddddd',mauve='#bbbbbb',yellow='#eeeeee',peach='#cccccc',border='#444444',accent='#ffffff')
def build(stage,write):
 logs=[]
 def change(file,s,old,new):
  count=s.count(old);assert count>0,(file,old)
  logs.append(dict(file='terminal/'+file,string=old,replacement=new,count=count));return s.replace(old,new)
 for file in ['style.css','script.js','js/main.js','js/core.js','js/constants.js','js/commands.js','js/effects.js','js/window-controls.js']:
  s=(REPO/file).read_text()
  if file=='style.css':s=change(file,s,' !important','')
  if file=='js/main.js':
   s=change(file,s,'  input.focus();\n  inactivity.resetInactivity();','  inactivity.resetInactivity();')
   s=change(file,s,'  input.placeholder = "try: help  |  projects  |  contact";','  input.placeholder = "try: help  |  projects  |  contact";\n  input.setAttribute("aria-label", "Terminal command");')
   s=change(file,s,'      e.preventDefault();\n      const val = input.value;','      if (!input.value.trim()) return;\n      e.preventDefault();\n      const val = input.value;')
   s=change(file,s,'input.focus();\n      },\n      { passive: true }','// Scrolling the terminal should not open the phone keyboard.\n      },\n      { passive: true }')
   s=change(file,s,'  if (urlCmd) setTimeout(() => run(urlCmd), 400);','  if (urlCmd) setTimeout(() => run(urlCmd), 400);\n  else run("neofetch");')
   # Ambient screensavers are opt-in inside a portfolio section.
   s=change(file,s,'    onIdle: () => effects.startPipes(true),','    onIdle: () => {},')
  if file=='js/constants.js':
   end=s.index('export const BANNER_FONT');old=s[:end]
   data={'about':[ABOUT],'interests':[],'contact':[['email',EMAIL,'mailto:'+EMAIL]]+[[name,url,url] for name,url in SOCIALS],'skills':[],'neo':{'user':'rev@portfolio','os':'Arch Linux','role':'Student and open source developer','location':'Hyderabad','wm':'Hyprland'}}
   s=change(file,s,old,'export const DATA = '+json.dumps(data,ensure_ascii=False)+';\nexport const SITE_PROJECTS = '+json.dumps(PROJECTS,ensure_ascii=False)+';\n\n')
   start=s.index('export const THEMES =');end=s.index('\n};',start)+3
   s=change(file,s,s[start:end],'export const THEMES = '+json.dumps({k:PALETTE for k in ['monochrome','frappe','mocha','latte','cyberpunk']})+';')
  if file=='js/core.js':
   start=s.index('  const FS = {');end=s.index('\n  };',start)+5
   fs={'~':{'type':'dir','children':['links','projects','about.md']},'~/about.md':{'type':'file','content':[ABOUT]},'~/links':{'type':'dir','children':['email.md']+[n.lower()+'.md' for n,_ in SOCIALS]},'~/links/email.md':{'type':'file','content':[EMAIL]},'~/projects':{'type':'dir','children':[p['slug']+'.md' for p in PROJECTS]}}
   for n,u in SOCIALS:fs['~/links/'+n.lower()+'.md']={'type':'file','content':[u]}
   for p in PROJECTS:fs['~/projects/'+p['slug']+'.md']={'type':'file','content':[p['name'],p['description']]+[l['label']+': '+l['href'] for l in p['links']]}
   s=change(file,s,s[start:end],'  const FS = '+json.dumps(fs,ensure_ascii=False)+';')
  if file=='js/commands.js':
   s='import { SITE_PROJECTS } from "./constants.js";\n'+s
   start=s.index('  const fallbackProjects =');end=s.index('  reg(["projects", "repos"], renderProjects);',start)
   new='''  function renderProjects() {
    const cards=SITE_PROJECTS.map(p=>`<div class="repo-card"><a class="repo-name" href="${esc(p.href)}" target="_top">${esc(p.name)}</a><div class="repo-desc">${esc(p.description)}</div><div class="repo-meta">${esc(p.category)}${p.language?" · "+esc(p.language):""}</div></div>`).join("");
    return make(`<div class="mt"><div class="line"><span class="badge">projects</span></div>${cards}</div>`);
  }

'''
   s=change(file,s,s[start:end],new)
   start=s.index('    const rows = [');end=s.index('\n    ];',start)+7
   s=change(file,s,s[start:end],'''    const rows = [[null, `<span class="bold c-blue">${esc(n.user)}</span>`],["OS","os"],["Role","role"],["Location","location"],["WM","wm"]];''')
   for old in ['#ea999c','#a6d189','#e5c890','#8caaee','#ca9ee6','#85c1dc','#c6d0f5']:
    if old in s:s=change(file,s,old,'#bbbbbb')
   s=change(file,s,'synced GitHub projects list','portfolio projects')
   s=change(file,s,'mocha  frappe  latte  cyberpunk','monochrome')
   s=change(file,s,'["mocha", "frappe", "latte", "cyberpunk"]','["monochrome"]')
  if file=='js/effects.js':
   for old,new in [('#00ff41','#eeeeee'),('"🔊" : "🔇"','"on" : "off"')]:
    if old in s:s=change(file,s,old,new)
  write('terminal/'+file,s,'Embedded copy of existing terminal with isolated, counted patches')
 doc=(REPO/'index.html').read_text();a=doc.index('<link href="https://fonts.googleapis.com');b=doc.index('\n',a)
 doc=change('index.html',doc,doc[a:b],'')
 doc=change('index.html',doc,'<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="embed.css"><meta name="robots" content="noindex">')
 doc=change('index.html',doc,' spellcheck="false" autofocus',' spellcheck="false"')
 doc=change('index.html',doc,'rev@portfolio — kitty','rev@portfolio')
 doc=change('index.html',doc,'>🔇</span>','>off</span>')
 a=doc.index('<footer id="footer">');b=doc.index('</footer>',a)+9
 doc=change('index.html',doc,doc[a:b],'<footer id="footer">Type help for commands. Tab completes text; an empty prompt lets Tab leave the terminal.</footer>')
 write('terminal/index.html',doc,'Offline embedded terminal document')
 css=':root{'+''.join('--'+k+':'+v+';' for k,v in PALETTE.items())+'}\n'+'''html,body{background:#111;min-height:100%;font-size:13px}body::before,body::after{content:none}.window{left:0;top:0;transform:none;width:100%;height:calc(100vh - 30px);border-radius:0;border:0;box-shadow:none;backdrop-filter:none}.titlebar{background:#191919;border-bottom:1px solid #444;padding:14px 16px;cursor:default}.terminal-body{background:#111;border:0;border-radius:0;padding:20px;overscroll-behavior:contain}.dot.r{background:#eee}.dot.y{background:#999}.dot.g{background:#555}.sound-toggle{font-size:11px;color:#aaa}.win-title{color:#ccc}.neo-wrap{flex-wrap:wrap}.neo-art{font-size:10px}.repo-card{background:#191919;border-color:#444}#footer{bottom:7px;left:16px;right:16px;font-size:10px;color:#999;text-align:left}#cmd-input{min-width:0;font-size:13px}.input-row{min-width:0}.titlebar .dot{width:10px;height:10px}.terminal-body a{color:#fff;text-underline-offset:3px}@media(max-width:500px){.terminal-body{padding:16px}.neo-art{display:none}.win-title{font-size:11px}.pu,.pp,.pd{font-size:11px}.input-row{flex-wrap:wrap}#cmd-input{flex:1;min-width:100px}}@media(prefers-reduced-motion:reduce){*{animation:none;transition:none}}
'''
 css+='\n#footer{transform:none;width:auto;white-space:normal;line-height:1.25}.win-title{display:block;min-width:0}.sound-toggle{margin-left:auto}.neo-info{min-width:0;max-width:100%}.neo-row{white-space:normal;overflow-wrap:anywhere}\n'
 write('terminal/embed.css',css,'Monochrome terminal theme isolated in iframe')
 (ROOT/'tools/terminal-replacements.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2))
