from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',args=['--no-sandbox']);page=b.new_page(viewport={'width':1280,'height':900});page.goto('http://127.0.0.1:8767/',wait_until='networkidle');page.wait_for_timeout(4000)
 for cls in ['framer-1oxbm6s','framer-1qn42e','framer-p0xxsf','framer-n39wxq','framer-u9eyae']:
  print(cls,page.locator('.'+cls).evaluate_all('(ns)=>ns.map(n=>({rect:n.getBoundingClientRect().toJSON(),style:n.getAttribute("style"),opacity:getComputedStyle(n).opacity,visibility:getComputedStyle(n).visibility,display:getComputedStyle(n).display,text:n.innerText?.slice(0,100)}))'))
 print('ancestors',page.locator('h1').first.evaluate('(n)=>{let out=[];while(n){let s=getComputedStyle(n);out.push([n.tagName,n.className,s.opacity,s.transform,s.visibility]);n=n.parentElement}return out}'));print('spans',page.locator('h1 span').evaluate_all('(ns)=>ns.map(n=>[n.textContent,getComputedStyle(n).opacity,getComputedStyle(n).transform])'));print('carousel',page.locator('.framer-zojsb7-container').evaluate('(n)=>n.innerHTML.slice(0,3000)'))
 page.screenshot(path='portfolio/tools/native-motion-inspect.png');b.close()
