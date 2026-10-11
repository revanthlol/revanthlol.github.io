"""Keep captured Framer shells and motion; replace their content only."""
import html
from patch_phase2a import Markup
from phase2b_components import HERO,ABOUT,PROJECTS,markup
HOME='assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs'
MAIN='assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs'
CARD='assets/framerusercontent.com/12e83545c455d886f0604cbc.mjs'
def restore(stage,patch,ast,ssr,replace_call,defs):
 def alltext(file,old,new):
  s=(stage/file).read_text()
  if old in s:patch(file,old,new,'Preserve native component, replace content',s.count(old))
 def heading(file,old,new):
  s=(stage/file).read_text()
  for n in Markup(s).nodes:
   if n['tag'] not in ('h1','h2'):continue
   fragment=s[n['start']:n['end']];parser=Markup(fragment)
   # Native word reveal spans retain the captured initial motion styles.
   spans=[m for m in parser.nodes if m['tag']=='span']
   plain=' '.join(html.unescape(fragment[m['start']:m['end']].split('>',1)[1].rsplit('</',1)[0]) for m in spans).strip()
   if plain!=old:continue
   opening=fragment[:fragment.index('>')+1];end='</'+n['tag']+'>'
   first=fragment[spans[0]['start']:spans[0]['end']];prefix=first[:first.index('>')+1]
   replacement=opening+' '.join(prefix+html.escape(word)+'</span>' for word in new.split(' '))+end
   patch(file,fragment,replacement,'Native animated heading text',s.count(fragment));s=(stage/file).read_text()
 for file in [HOME,CARD,'assets/framerusercontent.com/9b477f352fe32a876a1167cd.mjs']:
  for old,new in [('Result Driven Design For Fast Growing Team','Student. Open source developer.'),('Let’s Make It Happen.','Get in touch'),('BOOK A CALL','Connect'),("LET'S TALK!","Let's chat"),('cal.com','/contact/')]:alltext(file,old,new)
 alltext(HOME,'I help brands, founders, and small teams craft [] digital experiences',HERO)
 for file in ['index.html','projects/index.html','contact/index.html','404/index.html']:
  heading(file,'Result Driven Design For Fast Growing Team','Student. Open source developer.')
  heading(file,'Let’s Make It Happen.','Get in touch')
  for old,new in [('BOOK A CALL','Connect'),("LET&#x27;S TALK!","Let&#x27;s chat"),("LET’S TALK!","Let's chat"),("LET'S TALK!","Let's chat"),('https://cal.com','/contact/'),('© 2025 Revanth','© Revanth')]:alltext(file,old,new)
  # The credit is removed, preserving the footer itself and its responsive variants.
  ssr(file,lambda n:n['attrs'].get('data-framer-name')=='Made by','','Remove creator credit only')
  for cls,kind in [('framer-axpwzq','footer-socials-desktop'),('framer-1153bhh','footer-socials-phone')]:
   s=(stage/file).read_text()
   if any(n['attrs'].get('class')==cls for n in Markup(s).nodes):ssr(file,lambda n:n['attrs'].get('class')==cls,markup(defs[kind]),'Social links inside native footer layout')
 # Keep the parent appear animation; render shared plain copy instead of the brand-specific inline slot.
 for r in ast(HOME,'tag','bn'):
  if r['callee'] in ('p','h'):patch(HOME,r['old'],r['callee']+'(RevStatic,{kind:"hero-copy"})','Replace inline copy renderer, keep property controls')
 ssr('index.html',lambda n:n['attrs'].get('class')=='framer-text-wrap-container',markup(defs['hero-copy']),'Shared copy in original animated hero subtext wrapper')
 replace_call(MAIN,'name','Made by',None)
 for cls,kind in [('framer-axpwzq','footer-socials-desktop'),('framer-1153bhh','footer-socials-phone')]:replace_call(MAIN,'class',cls,kind)
 groups=[['ec1e6f5f4c69b2df64425de4.jpg','08433d32f137c40b4538acd5.avif','e0048950fd747310dcd5a155.jpg'],['04dc708738fa7d6e33bd33e6.png','d1c6dcd8ae666e35bb18930c.avif','2b117465c0f61f46d71310bb.png'],['f9facdd8169a4f343a8a7512.png','4c86f3b7cb5dce5ccb310c67.avif','f0e2f981fc591532bf7f8c26.png'],['7f5d22dca694775a8d8f5968.png','66350af6012071dadca61453.avif','6f7267958b0d7e4217e8e2d4.png']]
 for project,files in zip(PROJECTS,groups):
  for name in files:
   for file in [HOME,'index.html']:alltext(file,'/assets/framerusercontent.com/'+name,project['image'])
 for file in [HOME,CARD,'index.html','projects/index.html']:alltext(file,'/assets/framerusercontent.com/5a21203e418054b7d0e6782c.avif','/assets/favicon.svg')

 # About retains native section, type and appear effects; only portrait and copy change.
 for file in [MAIN,'index.html','projects/index.html','contact/index.html']:
  alltext(file,'`Contact`','`Connect`');alltext(file,'>Contact<','>Connect<')
 alltext(HOME,'Simple Design, Big Impact.','About me');heading('index.html','Simple Design, Big Impact.','About me')
 old='Hey, I’m Revanth, a digital designer who believes in keeping things simple, smart, and intentional.'
 for file in [HOME,'index.html']:alltext(file,old,ABOUT)
 replace_call(HOME,'class','framer-g98vfr',None)
 ssr('index.html',lambda n:n['attrs'].get('class')=='framer-g98vfr','','Remove portrait and unapproved extra biography, preserve About header')
 contact='assets/framerusercontent.com/8b009bbdb40fdb2a701b8f3e.mjs'
 alltext(contact,'Let’s Make It Happen.','Connect');heading('contact/index.html','Get in touch','Connect')
 alltext(contact,'Not a fan of forms?','Email me or find me on GitHub and elsewhere.')
 alltext(contact,'Let’s hop on a call instead.','')
 alltext('contact/index.html','Not a fan of forms?','Email me or find me on GitHub and elsewhere.')
 alltext('contact/index.html','Let’s hop on a call instead.','')
 replace_call(contact,'class','framer-1q75sb7','contact-links')
 ssr('contact/index.html',lambda n:n['attrs'].get('class')=='framer-1q75sb7',markup(defs['contact-links']),'Contact links in native form column')
 # This little left-column call button becomes redundant alongside visible email links.
 r=ast(contact,'class','framer-15nndqp-container')[0]
 wrapper=next(p for p in reversed(r['parents']) if p['old'].startswith('c(C,'))
 patch(contact,wrapper['old'],'null','Remove commercial call button only')
 ssr('contact/index.html',lambda n:n['attrs'].get('class')=='framer-15nndqp-container','','Remove commercial call button SSR')

 # The captured tablet variant explicitly disables mouse hover. Keep its SSR variant,
 # but enable the native interaction on devices that actually support hover.
 old='yEBbR_wMN:{"data-framer-name":`No hover`,"data-highlight":void 0,onMouseEnter:void 0}'
 patch(CARD,old,'yEBbR_wMN:{"data-framer-name":`No hover`,"data-highlight":void 0,onMouseEnter:typeof window!==`undefined`&&window.matchMedia(`(hover: hover) and (pointer: fine)`).matches?ae:void 0}','Enable native hero hover at tablet widths without changing SSR variants')
 alltext(CARD,"Let's talk!","Let's chat")
