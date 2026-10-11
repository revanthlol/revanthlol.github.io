from playwright.sync_api import sync_playwright
import json
from pathlib import Path
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for w in [375,768,1280,1920]:
  page=b.new_page(viewport={'width':w,'height':900})
  page.goto('http://127.0.0.1:8765/projects/',wait_until='networkidle')
  masks=page.locator('.framer-qs9x1t').evaluate_all('(ns)=>ns.map(n=>{const r=n.getBoundingClientRect();return {width:r.width,height:r.height}}).filter(r=>r.width>0)')
  page.goto('http://127.0.0.1:8765/',wait_until='networkidle')
  portrait=page.locator('section#about img').evaluate_all('(ns)=>ns.map(n=>({src:n.getAttribute("src"),parentClass:n.parentElement.className,parentName:n.parentElement.getAttribute("data-framer-name"),width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height}))')
  rows.append({'width':w,'projects_masks':masks,'portrait':portrait});page.close()
 b.close()
Path('portfolio/tools/phase2b-measurements.json').write_text(json.dumps(rows,indent=2))
print(json.dumps(rows,indent=2))
