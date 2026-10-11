from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlsplit
import json
ROOT=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  page=b.new_page(viewport={'width':width,'height':900});r={'width':width,'errors':[],'warnings':[],'external':[],'missing':[],'commands':{}}
  page.on('pageerror',lambda e:r['errors'].append(str(e)));page.on('console',lambda m:r['errors' if m.type=='error' else 'warnings'].append(m.text) if m.type in ('error','warning') else None)
  page.on('request',lambda q:r['external'].append(q.url) if urlsplit(q.url).netloc!='127.0.0.1:8767' else None);page.on('response',lambda q:r['missing'].append(q.url) if q.status>=400 else None)
  page.goto('http://127.0.0.1:8767/',wait_until='networkidle');page.wait_for_timeout(1000);frame=page.locator('iframe[src="/terminal/"]');frame.scroll_into_view_if_needed();terminal=page.frame_locator('iframe[src="/terminal/"]');terminal.locator('#cmd-input').wait_for();page.wait_for_timeout(300)
  r['parent_focus']=page.evaluate('document.activeElement.tagName');r['before_projects']=page.evaluate('document.querySelector(".rev-terminal-section").getBoundingClientRect().bottom<document.querySelector("#projects").getBoundingClientRect().top');r['overflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth');r['frame_overflow']=terminal.locator('body').evaluate('()=>document.documentElement.scrollWidth>innerWidth');r['color']=terminal.locator('body').evaluate('(n)=>getComputedStyle(n).backgroundColor')
  frame.screenshot(path=str(ROOT/f'tools/embedded-terminal-boot-{width}.png'))
  for cmd,expected in [('help','commands'),('whoami',"I'm Revanth"),('neofetch','Arch Linux'),('projects','LePrint'),('cat ~/projects/gild.md','Landing page for a podcast'),('cat ~/links/email.md','personallyrevanth@gmail.com'),('theme monochrome','theme switched')]:
   terminal.locator('#cmd-input').fill(cmd);terminal.locator('#cmd-input').press('Enter');page.wait_for_timeout(120);r['commands'][cmd]=expected in terminal.locator('#output').inner_text()
  terminal.locator('#cmd-input').fill('who');terminal.locator('#cmd-input').press('Tab');r['autocomplete']=terminal.locator('#cmd-input').input_value()=='whoami';terminal.locator('#cmd-input').press('ArrowUp');r['history']=terminal.locator('#cmd-input').input_value()=='theme monochrome';terminal.locator('#cmd-input').press('Control+l');r['clear']=terminal.locator('#output').inner_text()=='';terminal.locator('#cmd-input').fill('');terminal.locator('#cmd-input').press('Tab');r['tab_exits']=terminal.locator('#cmd-input').evaluate('(n)=>document.activeElement!==n')
  page.screenshot(path=str(ROOT/f'tools/embedded-terminal-{width}.png'));rows.append(r);print(width,r,flush=True);page.close()
 b.close()
(ROOT/'tools/embedded-terminal-results.json').write_text(json.dumps(rows,indent=2))
assert all(not r['errors'] and not r['warnings'] and not r['external'] and not r['missing'] and not r['overflow'] and not r['frame_overflow'] and all(r['commands'].values()) and r['autocomplete'] and r['history'] and r['clear'] and r['tab_exits'] and r['before_projects'] for r in rows)
