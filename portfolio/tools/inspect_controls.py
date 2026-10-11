from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':900});page.goto('http://127.0.0.1:8765/',wait_until='networkidle')
 print(page.locator('[tabindex="0"]').evaluate_all('(ns)=>ns.map(e=>({name:e.dataset.framerName,text:e.innerText,html:e.outerHTML.slice(0,400)}))'))
 b.close()
