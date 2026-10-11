"""Use approved tab photos, reading captures without changing them."""
from pathlib import Path
import io
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]

def convert(out):
    archive = ROOT / 'tools/reference/work-images'
    archive.mkdir(parents=True, exist_ok=True)
    incoming = ROOT / 'assets/Monochrome Workbench with Orange Penguin.png'
    linux = archive / 'linux-utilities.png'
    if incoming.exists():
        assert not linux.exists(), 'Original already archived'
        shutil.move(incoming, linux)
    sources = {
        'browser-tools': ROOT / 'captured/assets/framerusercontent.com/afbc4e7e1a021320bec20206.avif',
        'linux-utilities': linux,
    }
    destination = Path(out) / 'assets/work'
    destination.mkdir(parents=True, exist_ok=True)
    for name, source in sources.items():
        if not source.exists():
            continue  # Fresh clones retain the committed compressed image.
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            for quality in (84, 78, 72, 66, 60, 54, 48):
                data = io.BytesIO()
                image.save(data, 'WEBP', quality=quality, method=6)
                if data.tell() <= 100_000:
                    break
            assert data.tell() <= 100_000
            target = destination / (name + '.webp')
            target.write_bytes(data.getvalue())
            print(f'{name}: {image.size}, {target.stat().st_size} bytes')

if __name__ == '__main__':
    convert(ROOT)
