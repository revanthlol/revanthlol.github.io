#!/usr/bin/env python3
"""Check the static artifact or deployed Pages origin with a real browser."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
projects = json.loads((root / 'tools/phase2b-projects.json').read_text())
routes = ['/', '/projects/', '/contact/', '/404/'] + ['/projects/' + p['slug'] + '/' for p in projects]
rows = []
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path='/usr/bin/google-chrome-stable', headless=True, args=['--no-sandbox'])
    for width in (375, 768, 1280, 1920):
        for route in routes:
            row = dict(width=width, route=route, errors=[], warnings=[], external=[], failures=[])
            page = browser.new_page(viewport=dict(width=width, height=900))
            page.on('pageerror', lambda error: row['errors'].append(str(error)))
            page.on('console', lambda message: row['errors' if message.type == 'error' else 'warnings'].append(message.text) if message.type in ('error', 'warning') else None)
            page.on('request', lambda request: row['external'].append(request.url) if urlsplit(request.url).netloc != urlsplit(args.base).netloc else None)
            page.on('response', lambda response: row['failures'].append([response.status, response.url]) if response.status >= 400 else None)
            page.goto(args.base.rstrip('/') + route, wait_until='networkidle')
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            page.wait_for_timeout(250)
            row['overflow'] = page.evaluate('document.documentElement.scrollWidth > innerWidth')
            row['title'] = page.title()
            rows.append(row)
            page.close()
    page = browser.new_page()
    response = page.goto(args.base.rstrip('/') + '/not-a-real-page-check/', wait_until='networkidle')
    fallback = dict(status=response.status, title=page.title())
    browser.close()
(root / 'tools/pages-results.json').write_text(json.dumps(dict(base=args.base, routes=rows, fallback=fallback), indent=2))
bad = [row for row in rows if any(row[key] for key in ('errors', 'warnings', 'external', 'failures', 'overflow'))]
print(json.dumps(dict(checked=len(rows), failures=bad, fallback=fallback), indent=2))
assert not bad
# Plain http.server lacks a custom fallback; GitHub Pages must have one.
if urlsplit(args.base).hostname == 'revanthlol.github.io':
    assert fallback['status'] == 404 and fallback['title'] == 'Page not found | Revanth'
