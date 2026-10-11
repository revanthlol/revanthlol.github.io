import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'verification/phase2a';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox'])
 for width in [375,768,1280,1920]:
  for label,port in [('baseline',8766),('patched',8765)]:
   page=b.new_page(viewport={'width':width,'height':900});page.goto(f'http://127.0.0.1:{port}/',wait_until='networkidle')
   for name,selector in [('services','section[data-framer-name="Services"]'),('footer','.framer-enlusb')]:
    e=page.locator(selector).first
    if not e.count():continue
    e.scroll_into_view_if_needed();page.wait_for_timeout(1300);page.screenshot(path=str(out/f'{label}-{width}-{name}.png'))
    rows.append(dict(label=label,width=width,section=name,box=e.bounding_box()))
   page.close()
 b.close()
(out/'section-captures.json').write_text(json.dumps(rows,indent=2))
print('Saved in-view service/footer comparisons.')
