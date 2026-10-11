"""Local deterministic grayscale project placeholders; no network."""
from PIL import Image,ImageDraw,ImageFont,ImageFilter
from pathlib import Path
import random,hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
def generate(out):
 out=Path(out);(out/'assets/projects').mkdir(parents=True,exist_ok=True);(out/'assets/work').mkdir(parents=True,exist_ok=True)
 for p in json.loads((ROOT/'tools/phase2b-projects.json').read_text()):
  rng=random.Random(int.from_bytes(hashlib.sha256(p['slug'].encode()).digest()[:8],'big'))
  image=Image.new('RGB',(1476,1164),(18,18,18));d=ImageDraw.Draw(image)
  for _ in range(8):
   x=rng.randint(-300,1200);y=rng.randint(-300,1100);r=rng.randint(160,550);g=rng.randint(25,110);d.ellipse((x,y,x+r,y+r),fill=(g,g,g))
  image=image.filter(ImageFilter.GaussianBlur(65));d=ImageDraw.Draw(image)
  for _ in range(5):
   x=rng.randint(-200,1200);y=rng.randint(-200,1000);r=rng.randint(150,550);g=rng.randint(130,215);d.arc((x,y,x+r,y+r),rng.randint(0,90),rng.randint(190,330),fill=(g,g,g),width=2)
  target=out/('assets/projects/'+p['slug']+'.webp');image.save(target,'WEBP',quality=80,method=6);assert target.stat().st_size<=100000
  if p['slug'] in ('leprint','cyclr','typd'):
   name={'leprint':'web-apps','cyclr':'browser-tools','typd':'linux-utilities'}[p['slug']]
   existing=ROOT/('assets/work/'+name+'.webp');destination=out/('assets/work/'+name+'.webp')
   if existing.exists() and existing!=destination:shutil.copy2(existing,destination)
   elif not existing.exists():image.save(destination,'WEBP',quality=80,method=6)
 from convert_project_images import convert
 convert(out)
 share=Image.new('RGB',(1200,630),'#f7f7f7');d=ImageDraw.Draw(share);font='/usr/share/fonts/TTF/DejaVuSans.ttf'
 d.text((64,70),'Revanth',fill='#111',font=ImageFont.truetype(font,84));d.line((64,210,1136,210),fill='#aaa',width=1)
 d.text((64,310),'Student.',fill='#111',font=ImageFont.truetype(font,54));d.text((64,385),'Open source developer.',fill='#111',font=ImageFont.truetype(font,54));d.text((64,555),'revanthlol.github.io',fill='#555',font=ImageFont.truetype(font,24));share.save(out/'assets/share.png',optimize=True)
 (out/'assets/favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="white"/><text x="32" y="48" text-anchor="middle" font-family="sans-serif" font-size="48" fill="black">R</text></svg>')
