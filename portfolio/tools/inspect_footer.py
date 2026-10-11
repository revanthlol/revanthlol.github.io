from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox'])
 for width in [375,768,1280]:
  for port in [8766,8765]:
   page=b.new_page(viewport={'width':width,'height':900});page.goto(f'http://127.0.0.1:{port}/',wait_until='networkidle')
   print(width,port,json.dumps(page.locator('.framer-enlusb').evaluate('(e)=>{const p=e.querySelector("p"),s=getComputedStyle(p),range=document.createRange();range.selectNodeContents(p);const c=document.createElement("canvas").getContext("2d");c.font="600 220px Geist";c.letterSpacing="-8.8px";return {html:e.outerHTML,rect:e.getBoundingClientRect().toJSON(),textRect:range.getBoundingClientRect().toJSON(),font:s.font,fontSize:s.fontSize,letterSpacing:s.letterSpacing,measure:c.measureText("Revanth").width}}')));page.close()
 b.close()
