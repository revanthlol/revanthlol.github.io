"""Shared static element definitions for SSR and the React runtime."""
import html,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PROJECTS=json.loads((ROOT/'tools/phase2b-projects.json').read_text())
EMAIL='personallyrevanth@gmail.com'
HERO='I build web apps, browser tools and Linux utilities. Most of it is open source.'
ABOUT="I'm Revanth, a student and open source developer based in Hyderabad. I build web apps, browser tools and Linux utilities, and I run Arch with Hyprland. I'm also a business partner in Fresh 360, a Hyderabad drinks company, and built its website."
SOCIALS=[('GitHub','https://github.com/revanthlol'),('X','https://x.com/revanthlol'),('Instagram','https://www.instagram.com/revanthloll/'),('Reddit','https://www.reddit.com/user/ocusii'),('Pinterest','https://in.pinterest.com/ocuslol/'),('Discord','https://discord.com/users/1400787457221595230')]
TECH=['HTML','Java','JavaScript','Kotlin','Lua','PHP','QML','Rust','TypeScript','React','Next.js','Node.js','Python','FastAPI','Supabase','Three.js','Tailwind CSS','Tauri','Linux','Arch Linux','Hyprland','Vite','Express','PostgreSQL']
FAQ=[('Are your projects open source?', 'Most are public on GitHub, and each project page links to its repository. Some are demo-only.'),('Are you available for work?',"Yes. I'm available for work. Reach me through the Connect page."),('Can I contribute or report a bug?',"Yes. Open an issue or a pull request on the project's GitHub repository."),('What do you build with?', 'The primary languages across my repos are HTML, Java, JavaScript, Kotlin, Lua, PHP, QML, Rust and TypeScript. I run Arch Linux with Hyprland.')]
def e(tag,props=None,*children):return [tag,props or {},list(children)]
def a(label,href,external=False):
 props={'href':href}
 if external:props.update(target='_blank',rel='noopener noreferrer')
 return e('a',props,label)
def socials():return e('div',{'className':'rev-socials'},*[e('a',{'href':url,'target':'_blank','rel':'me noopener noreferrer','aria-label':f'Revanth on {name}'},name) for name,url in SOCIALS])
def footer():return e('footer',{'className':'rev-footer'},e('p',{'className':'rev-wordmark'},'Revanth'),e('div',{'className':'rev-footer-info'},e('div',{},e('p',{'className':'rev-footer-label'},'(INQUIRIES)'),a(EMAIL,'mailto:'+EMAIL)),e('nav',{'aria-label':'Footer'},e('p',{'className':'rev-footer-label'},'(NAVIGATION)'),a('Projects','/projects/'),a('About','/#about'),a('Connect','/contact/'),a('404','/404/')),e('div',{},e('p',{'className':'rev-footer-label'},'(SOCIALS)'),socials())),e('p',{'className':'rev-copyright'},'© Revanth'))
def header():return e('header',{'className':'rev-header'},a('Revanth','/'),e('nav',{'aria-label':'Main'},a('Projects','/projects/'),a('About','/#about'),a('Connect','/contact/')))
def nav_terminal():return e('a',{'href':'/terminal/','className':'rev-nav-terminal'},'Terminal')
def nav_theme():return e('button',{'type':'button','className':'rev-theme-toggle','data-theme-toggle':''},e('span',{'className':'rev-theme-dark'},'Dark mode'),e('span',{'className':'rev-theme-light'},'Light mode'))
def connect_button():return e('a',{'href':'/contact/','className':'rev-static-connect','aria-label':'Connect'},e('span',{'className':'rev-connect-rest'},'Connect'),e('span',{'className':'rev-connect-hover','aria-hidden':'true'},e('span',{'className':'rev-connect-avatars'},e('span',{'className':'rev-connect-avatar'},'R'),e('span',{'className':'rev-connect-avatar'},'Y')),"Let's chat!"))
def card(p):
 return e('article',{'className':'rev-card'},e('a',{'href':p['href'],'className':'rev-card-primary'},e('div',{'className':'rev-image-mask'},e('img',{'src':p['image'],'alt':'','width':1476,'height':1164,'loading':'lazy','className':'rev-scan-base','aria-hidden':'true'}),e('img',{'src':p['image'],'alt':'','width':1476,'height':1164,'loading':'lazy','className':'rev-focus-rack'})),e('h3',{},p['name'])),e('p',{'className':'rev-card-description'},p['description']),e('div',{'className':'rev-labels'},e('span',{},p['category']),*[e('span',{},t) for t in p['tags']]),e('div',{'className':'rev-project-links'},*[a(l['label'],l['href'],True) for l in p['links']]))
def grid(home=False):
 section=e('section',{'className':'rev-projects rev-section','id':'projects','data-framer-name':'Selected projects' if home else 'Projects'},e('h2' if home else 'h1',{},'Projects',e('sup',{'className':'rev-project-count'},'04' if home else f'{len(PROJECTS):02d}')),e('div',{'className':'rev-grid'},*[card(p) for p in PROJECTS[:4] if home] if home else [card(p) for p in PROJECTS]),a('All projects','/projects/') if home else None)
 return e('div',{'className':'rev-home-projects-wrap'},section) if home else section

def carousel():return e('div',{'className':'rev-carousel','aria-label':'Selected project images'},e('div',{'className':'rev-carousel-track'},*[e('div',{'className':'rev-carousel-set','aria-hidden':'true' if repeat else 'false'},*[e('img',{'src':p['image'],'alt':'','width':1476,'height':1164}) for p in PROJECTS[:4]]) for repeat in range(2)]))
def hero():return e('div',{'className':'rev-hero'},e('h1',{},'Building things instead of accepting that the existing tool is “good enough.”'),e('p',{},HERO),a('Connect','/contact/'),carousel())
def tech():
 return e('section',{'className':'rev-tech','aria-label':'Technology marquee'},e('div',{'className':'marquee rev-technology-marquee','data-speed':'38','data-hover-speed':'0.25','data-draggable':'true','aria-label':'Tools and languages'},*[e('span',{},t) for t in TECH]),e('button',{'className':'rev-marquee-toggle','type':'button','aria-pressed':'false','aria-label':'Pause marquee'}))

def about():return e('section',{'className':'rev-about rev-section','id':'about'},e('h2',{},'About me'),e('p',{},ABOUT))
def contact():return e('section',{'className':'rev-contact rev-section'},e('h1',{},'Connect'),e('p',{},'Email me or find me on GitHub and elsewhere.'),a(EMAIL,'mailto:'+EMAIL),socials())
def cta():return e('section',{'className':'rev-cta rev-section'},e('h2',{},'Get in touch'),connect_button())
def detail(p):
 fields=[e('div',{},e('dt',{},'(CATEGORY)'),e('dd',{},p['category']))]
 if p['language']:fields.append(e('div',{},e('dt',{},'(LANGUAGE)'),e('dd',{},p['language'])))
 fields.append(e('div',{},e('dt',{},'(LINKS)'),e('dd',{},*[a(l['label'],l['href'],True) for l in p['links']])))
 outbound=next((l for l in p['links'] if l['label']=='GitHub'),p['links'][0])
 button=e('a',{'href':outbound['href'],'className':'rev-detail-outbound','target':'_blank','rel':'noopener noreferrer'},'View live demo' if p['slug']=='gild' else 'View on GitHub',e('span',{'aria-hidden':'true'},'↗'))
 index=next(i for i,x in enumerate(PROJECTS) if x['slug']==p['slug']);more=[PROJECTS[(index+i)%len(PROJECTS)] for i in (1,2)]
 return e('main',{'className':'rev-detail framer-cizVt'},e('div',{'className':'framer-1tspyxg rev-detail-content'},e('section',{'className':'framer-18103n5 rev-detail-top'},e('h1',{},p['name']),e('p',{'className':'rev-detail-description'},p['description']),e('div',{'className':'rev-labels'},*[e('span',{},t) for t in p['tags']]) if p['tags'] else None,e('div',{'className':'rev-detail-summary'},e('dl',{'className':'rev-detail-fields'},*fields),button)),e('img',{'className':'rev-detail-image','src':p['image'],'alt':'','width':1476,'height':1164}),e('section',{'className':'rev-detail-body'},e('ul',{},*[e('li',{},f) for f in p['features']])) if p['features'] else None,e('section',{'className':'rev-more-work'},e('div',{'className':'rev-more-heading'},e('h2',{},'More Work'),a('See more ↗','/projects/')),e('div',{'className':'rev-grid'},*[card(x) for x in more]))),cta())

def markup(n):
 if n is None:return ''
 if isinstance(n,str):return html.escape(n)
 tag,props,children=n;attrs=''.join(' '+('class' if k=='className' else k)+'="'+html.escape(str(v),quote=True)+'"' for k,v in props.items())
 if tag in ['img','br','hr']:return '<'+tag+attrs+'>'
 return '<'+tag+attrs+'>'+''.join(markup(c) for c in children)+'</'+tag+'>'
def native_socials(cls):return e('div',{'className':cls},e('p',{'className':'rev-native-social-label'},'(SOCIALS)'),socials())
def definitions():return {'nav-terminal':nav_terminal(),'nav-theme':nav_theme(),'connect-button':connect_button(),'hero-copy':e('p',{'className':'framer-text framer-styles-preset-rqhmc2 rev-native-hero-copy'},HERO),'contact-links':e('div',{'className':'rev-native-contact-links'},a(EMAIL,'mailto:'+EMAIL),socials()),'footer-socials-desktop':native_socials('framer-axpwzq'),'footer-socials-phone':native_socials('framer-1153bhh'),'home-projects':grid(True),'projects':grid(False),'hero':hero(),'tech':tech(),'about':about(),'contact':contact(),'footer':footer(),'cta':cta()}
assert len(PROJECTS) in (10,11) and len({p['slug'] for p in PROJECTS})==len(PROJECTS) and len(TECH)==24
