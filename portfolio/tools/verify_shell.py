"""Optional manual browser checks for the shared header, routes and theme controls.
Not run automatically. Start tools/serve.py before invoking this with tools/.venv/bin/python.
"""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome-stable', headless=True, args=['--no-sandbox'])
    failures = []
    cases = 0
    for width in (320, 390, 768, 1024, 1440, 1920):
        page = browser.new_page(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
        page.on('pageerror', lambda error: failures.append(str(error)))
        for route, content in (
            ('/', '.framer-10134r8'), ('/projects/', '.framer-76thpi'),
            ('/contact/', '.framer-c8iews'), ('/projects/leprint/', '.rev-detail'),
            ('/404/', '.rev-notfound'), ('/terminal/', '#win'),
        ):
            page.goto('http://127.0.0.1:8765' + route)
            page.wait_for_selector('[data-site-header]')
            page.wait_for_timeout(350)
            header = page.locator('[data-site-header]')
            assert header.count() == 1
            assert header.locator('.site-desktop-nav a').evaluate_all('(links) => links.map(link => link.getAttribute("href"))') == ['/', '/projects/', '/#about', '/terminal/', '/contact/']
            assert abs(header.bounding_box()['height'] - 72) < 1
            assert header.locator('.cm__links a').all_text_contents()[-1].strip().startswith('05')
            assert header.locator('.cm__links a[href="/contact/"]').count() == 1
            assert header.locator('.cm__cta').count() == 0
            assert header.locator('tron-tiles').count() == (2 if width > 1200 else 0)
            menu = header.locator('[data-cm]')
            for theme in ('light', 'dark'):
                if width < 810:
                    menu.locator('.cm__btn').click()
                    assert menu.get_attribute('data-open') == 'true'
                    switcher = menu.locator('[data-theme-switcher]')
                else:
                    switcher = header.locator('.site-desktop-nav [data-theme-switcher]')
                switcher.locator(f'[data-mode={theme}]').click()
                assert page.evaluate('document.documentElement.dataset.theme') == theme
                assert switcher.locator(f'[data-mode={theme}]').get_attribute('aria-pressed') == 'true'
                if width < 810:
                    page.keyboard.press('Escape')
                    assert menu.get_attribute('data-open') == 'false'
                expected = min(width, 1200)
                for selector in ('[data-site-header]', content, 'footer:visible' if route != '/terminal/' else '#win'):
                    box = page.locator(selector).first.bounding_box()
                    assert box and abs(box['width'] - expected) < 1, (width, route, selector, box)
                    assert abs(box['x'] - (width - expected) / 2) < 1, (width, route, selector, box)
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), (width, route, theme)
                cases += 1
            if width == 390:
                toggle = menu.locator('.cm__btn')
                toggle.focus()
                page.keyboard.press('Enter')
                page.keyboard.press('Escape')
                assert menu.get_attribute('data-open') == 'false'
            for href in ('/', '/projects/', '/#about', '/contact/', '/terminal/'):
                assert header.locator(f'a[href="{href}"]').count() >= 1
            if route == '/':
                assert page.locator('h1:visible').inner_text().split() == 'Building things instead of accepting that the existing tool is “good enough.”'.split()
            if route == '/terminal/':
                page.locator('#cmd-input').fill('help')
                page.locator('#cmd-input').press('Enter')
                assert 'projects' in page.locator('#output').inner_text()
        page.reload()
        assert page.evaluate('document.documentElement.dataset.theme') == 'dark'
        page.close()
    assert not failures, failures
    browser.close()
    print(f'PASS: {cases} shared-header route/width/theme combinations.')
