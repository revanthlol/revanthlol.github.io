import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox'])
 for width in (375,768,1280,1920):
  for route in ('/','/projects/'):
   page=b.new_page(viewport={'width':width,'height':900},has_touch=width<810,is_mobile=width<810)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('http://127.0.0.1:8767'+route,wait_until='networkidle')
   card=page.locator('.rev-card-primary').nth(1);img=card.locator('img');card.scroll_into_view_if_needed();page.mouse.move(0,0);page.wait_for_timeout(1000)
   read=lambda:img.evaluate('(n)=>({filter:getComputedStyle(n).filter,opacity:getComputedStyle(n).opacity,src:n.getAttribute("src"),width:n.naturalWidth})')
   rest=read();page.screenshot(path=str(ROOT/f'tools/images-rest-{width}-{route=="/"}.png'))
   assert rest['width']==1600
   if width>=810:
    assert 'grayscale(1)' in rest['filter'] and 'blur(18px)' in rest['filter']
    card.hover();page.wait_for_timeout(1000);hover=read();assert hover['filter']=='none' and hover['opacity']=='1'
    page.screenshot(path=str(ROOT/f'tools/images-hover-{width}-{route=="/"}.png'))
    page.mouse.move(0,0);card.focus();page.wait_for_timeout(1000);assert read()['filter']=='none'
   else:assert rest['filter']=='none' and rest['opacity']=='1'
   page.emulate_media(reduced_motion='reduce');page.mouse.move(0,0);card.evaluate('(n)=>n.blur()');page.wait_for_timeout(100);assert read()['filter']=='none'
   assert not errors;rows.append(dict(width=width,route=route,rest=rest,errors=errors));page.close()
 page=b.new_page();page.goto('http://127.0.0.1:8767/projects/slotforge/',wait_until='networkidle');detail=page.locator('.rev-detail-image');assert detail.evaluate('(n)=>getComputedStyle(n).filter')=='grayscale(1)';detail.hover();page.wait_for_timeout(1000);assert detail.evaluate('(n)=>getComputedStyle(n).filter')=='none';page.set_viewport_size({'width':375,'height':900});page.wait_for_timeout(1000);assert detail.evaluate('(n)=>getComputedStyle(n).filter')=='none'
 b.close()
(ROOT/'tools/project-image-browser-results.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
