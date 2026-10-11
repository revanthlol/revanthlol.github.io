"""Compress supplied screenshots; keep original PNGs in ignored reference storage."""
from pathlib import Path
import io
import json
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'leprint': 'leprint.in_(desktop).png',
    'slotforge': 'slotforge-main.vercel.app_(desktop).png',
    'cyclr': 'cyclrr.vercel.app_(desktop).png',
    'erp': 'erp-la.vercel.app_login(desktop).png',
    'textfx': 'textfxsvg.vercel.app_(desktop).png',
    'socialmesh': 'socialmesh.ocus.qd.je_dashboard(desktop).png',
    'omrealtor': 'omrealtor.vercel.app_(desktop).png',
    'fresh360': 'fresh360.vercel.app_(desktop).png',
    'gild': 'gild-two.vercel.app_(desktop).png',
}

def convert(out):
    archive = ROOT / 'tools/reference/project-screenshots'
    archive.mkdir(parents=True, exist_ok=True)
    target = Path(out) / 'assets/projects'
    target.mkdir(parents=True, exist_ok=True)
    report = []
    for slug, filename in SOURCES.items():
        incoming = ROOT / 'assets/projects' / filename
        source = archive / (slug + '.png')
        if incoming.exists():
            assert not source.exists(), f'Original already archived: {source}'
            shutil.move(incoming, source)
        if not source.exists():
            # A fresh clone uses the committed WebPs; originals remain local.
            existing = ROOT / 'assets/projects' / (slug + '.webp')
            if existing.exists() and existing != target / existing.name:
                shutil.copy2(existing, target / existing.name)
            continue
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            for quality in (84, 80, 76, 72, 68, 64, 60, 56, 52, 48):
                encoded = io.BytesIO()
                image.save(encoded, 'WEBP', quality=quality, method=6)
                if encoded.tell() <= 100_000:
                    break
            assert encoded.tell() <= 100_000, f'{slug} exceeds 100 KB'
            destination = target / (slug + '.webp')
            destination.write_bytes(encoded.getvalue())
            with Image.open(destination) as check:
                assert check.size == image.size and check.format == 'WEBP'
            report.append(dict(project=slug, source_bytes=source.stat().st_size,
                               bytes=destination.stat().st_size, dimensions=image.size, quality=quality))
    (ROOT / 'tools/project-images-results.json').write_text(json.dumps(report, indent=2))
    return report

if __name__ == '__main__':
    print(json.dumps(convert(ROOT), indent=2))
