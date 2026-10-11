"""Repurpose the original animated tabs with approved labels and neutral images."""
from patch_phase2a import Markup
HOME='assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs'
def restore_tabs(stage,patch,ast,ssr):
 mapping=[('How I can help you','What I work on'),('(services)','(WHAT I WORK ON)'),('Web Design','Web apps'),('Framer Development','Browser tools'),('Branding','Linux utilities'),('`Services`','`What I work on`'),('data-framer-name="Services"','data-framer-name="What I work on"')]
 groups=[(['a7dbf1f6f0878a3b9ec6d605.jpg','70a74d0dcda273266c340872.avif','a2d10654f38ef4ce1f8798fd.jpg'],'leprint'),(['a095c74bb0b8a4691d8c1bc8.png','921bdc5a29cd3ec681fd1764.avif','c586032d6c60ee30d2b2ee4c.png'],'cyclr'),(['b3125ae9a4ca9bb86cb952c5.png','130dad3feefccb79744b1e15.avif'],'typd')]
 for names,slug in groups:
  target={'leprint':'web-apps','cyclr':'browser-tools','typd':'linux-utilities'}[slug]
  for name in names:mapping.append(('/assets/framerusercontent.com/'+name,'/assets/work/'+target+'.webp'))
 for file in [HOME,'index.html']:
  for old,new in mapping:
   s=(stage/file).read_text();count=s.count(old)
   if count:patch(file,old,new,'Repurpose original tabbed component without changing motion',count)
 # Captured title is word-separated by the existing reveal spans.
 s=(stage/'index.html').read_text()
 for n in Markup(s).nodes:
  if n['attrs'].get('class')!='framer-1188202':continue
  old=s[n['start']:n['end']];nodes=Markup(old).nodes;h=next(x for x in nodes if x['tag']=='h2');span=next(x for x in nodes if x['tag']=='span');prefix=old[span['start']:span['end']].split('>',1)[0]+'>'
  inner=old[h['start']:h['end']];new=inner.split('>',1)[0]+'>'+' '.join(prefix+w+'</span>' for w in ['What','I','work','on'])+'</h2>'
  patch('index.html',inner,new,'Repurpose native animated tab heading',s.count(inner));break
