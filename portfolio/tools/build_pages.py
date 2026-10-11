#!/usr/bin/env python3
"""Stage only public site files for GitHub Pages; no captured responses or tools."""
import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORIES = ('assets', 'remote', 'stubs', 'terminal', 'projects', 'contact', '404')
FILES = ('index.html', '404.html', 'robots.txt', 'sitemap.xml', 'llms.txt')

def build(output):
    output = output.resolve()
    assert output != ROOT and ROOT not in output.parents, 'Output must be outside portfolio'
    output.mkdir(parents=True, exist_ok=True)
    assert not any(output.iterdir()), 'Use an empty output directory'
    for name in DIRECTORIES:
        shutil.copytree(ROOT / name, output / name)
    for name in FILES:
        shutil.copy2(ROOT / name, output / name)
    (output / '.nojekyll').touch()
    paths = list(output.rglob('*'))
    assert not any(p.is_symlink() for p in paths), 'No symlinks in Pages artifact'
    assert not any(p.suffix in ('.har', '.map') for p in paths), 'No HARs or source maps'
    assert all(p.stat().st_size < 100 * 1024 * 1024 for p in paths if p.is_file())
    print(f'Pages artifact: {output}, {sum(p.is_file() for p in paths)} files')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    build(parser.parse_args().output)
