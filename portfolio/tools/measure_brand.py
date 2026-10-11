import json
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox']);page=b.new_page();page.goto('http://127.0.0.1:8765/',wait_until='networkidle')
 metrics=page.evaluate('''() => { const ctx=document.createElement('canvas').getContext('2d');ctx.font='600 220px Geist';ctx.letterSpacing='-8.8px';return ['Arjuna','Revanth'].map(text=>{const m=ctx.measureText(text);return {text,width:m.width,left:m.actualBoundingBoxLeft,right:m.actualBoundingBoxRight}})}''');print(json.dumps(metrics));Path('portfolio/tools/brand-measurements.json').write_text(json.dumps(metrics,indent=2));b.close()
