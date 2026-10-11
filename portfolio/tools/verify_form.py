import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome-stable',headless=True,args=['--no-sandbox']);page=b.new_page();requests=[];errors=[]
    page.on('request',lambda r:requests.append({'url':r.url,'method':r.method}));page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.goto('http://127.0.0.1:8765/contact/',wait_until='networkidle')
    page.locator('input[name="Name"]').fill('Offline check');page.locator('input[name="Company name"]').fill('Offline');page.locator('textarea[name="Message"]').fill('Local verification only')
    page.locator('select[name="Budget"]').select_option('$6k-$10k')
    assert page.locator('form').evaluate('(f)=>f.checkValidity()')
    page.wait_for_timeout(500)
    page.locator('button[type="submit"]').click();page.wait_for_timeout(1200)
    page.screenshot(path=str(ROOT/'verification/form-submit.png'),full_page=True)
    result={'requests':requests,'errors':errors,'visible_text':page.locator('form').inner_text(),'action':page.locator('form').get_attribute('action')}
    assert not [r for r in requests if r['method']=='POST' or r['url'].startswith('https://')],result
    assert not errors,result
    (ROOT/'verification/form.json').write_text(json.dumps(result,indent=2));print(result['visible_text']);b.close()
