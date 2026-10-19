#!/usr/bin/env python3
"""Sync readable component trees into existing prerendered pages, without touching Framer bundles.
Run after editing assets/components/content.mjs. The same trees render during hydration.
"""
import json
from pathlib import Path
from patch_phase2a import Markup
from phase2b_components import markup
ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / 'assets/components/content.mjs').read_text()
trees = json.loads(source.removeprefix('export const trees = ').strip().removesuffix(';'))
TARGETS = {
    'index.html': [('rev-home-projects-wrap', 'home-projects'), ('rev-tech', 'tech')],
    'projects/index.html': [('rev-projects rev-section', 'projects')],
}
pages = [ROOT / name for name in ('index.html', 'contact/index.html', 'projects/index.html', 'terminal/index.html', '404/index.html', '404.html')]
pages.extend((ROOT / 'projects').glob('*/index.html'))
header = (ROOT / 'assets/components/site-header.html').read_text()
for page in pages:
    slots = TARGETS.setdefault(str(page.relative_to(ROOT)), [])
    if 'class="rev-static-connect"' in page.read_text():
        slots.append(('rev-static-connect', 'connect-button'))
for filename, slots in TARGETS.items():
    path = ROOT / filename
    text = path.read_text()
    replacements = []
    for class_name, key in slots:
        nodes = [n for n in Markup(text).nodes if n['attrs'].get('class') == class_name]
        assert len(nodes) == 1, (filename, key, len(nodes))
        for node in nodes:
            replacements.append((node['start'], node['end'], markup(trees[key])))
    headers = [node for node in Markup(text).nodes if node['attrs'].get('class') == 'site-header']
    assert len(headers) == 1, (filename, 'site-header', len(headers))
    replacements.append((headers[0]['start'], headers[0]['end'], header))
    for start, end, value in sorted(replacements, reverse=True):
        text = text[:start] + value + text[end:]
    path.write_text(text)
    print('Synced', filename)
