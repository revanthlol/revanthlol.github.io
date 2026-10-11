from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
s=(ROOT/'PHASE2B_PLAN.md').read_text();table=s[s.index('| LePrint | Web app |'):s.index('\nThe three supplied descriptions')];rows=[[x.strip() for x in l.strip('|').split('|')] for l in table.splitlines() if l.startswith('| ')]
repos=['LePrint','SlotForge','cyclr','erp','typd','TextFX','focusd','socialmesh','omrealtor','fresh360',None];slugs=[r.lower() if r else 'gild' for r in repos];meta={r['name'].lower():r for r in json.loads((ROOT/'tools/github-data.json').read_text())};lives=['https://leprint.in/','https://slotforge-main.vercel.app/','https://cyclrr.vercel.app/','https://erp-la.vercel.app/',None,'https://textfxsvg.vercel.app/',None,None,None,'https://fresh360.vercel.app/','https://gild-two.vercel.app']
features=[['QR-based document upload','Local printer and scanner agent','Print job status'],['Scheduling constraints','Schedule generation with OR-Tools','Conflict inspection and schedule export'],['Keyboard tab navigation','Tab previews','Configurable shortcuts'],['Attendance views','Results and profile views','Unofficial student portal interface'],['On-screen Wayland keyboard','Draggable and resizable interface','On-screen key feedback'],['Per-line fonts and colors','Typing, deletion and cursor controls','SVG export'],['Local SQLite window-time records','CLI reports and export','Hyprland and X11 support'],['Self-hosted social publishing and scheduling','Shared workspaces','Community fork of Shoutrrr'],[],[],[]]
projects=[]
for i,(name,cat,desc) in enumerate(rows):
 slug=slugs[i];repo=repos[i];links=[]
 if repo:links.append({'label':'GitHub','href':'https://github.com/revanthlol/'+repo})
 if lives[i]:links.append({'label':'Live demo' if slug=='gild' else 'Live site','href':lives[i]})
 projects.append({'slug':slug,'name':name,'category':cat,'description':desc,'href':'/projects/'+slug+'/','image':'/assets/projects/'+slug+'.webp','language':None if slug in ['gild','fresh360','omrealtor'] else meta.get(slug,{}).get('language'),'tags':['Work in progress'] if slug=='typd' else ['Fork'] if slug=='socialmesh' else [],'links':links,'features':features[i]})
assert len(projects)==11 and projects[-1]['links']==[{'label':'Live demo','href':'https://gild-two.vercel.app'}]
(ROOT/'tools/phase2b-projects.json').write_text(json.dumps(projects,indent=2))
