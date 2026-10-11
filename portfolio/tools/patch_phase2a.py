#!/usr/bin/env python3
"""Rebuild served files from the immutable baseline, then apply counted literal patches."""
import hashlib,html,json,shutil,tempfile
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'_baseline'
PROTECTED=[
'Working with Arjuna was a breeze. He turned our rough ideas into a stunning website that actually converts. Highly recommended!',
'Super professional, fast turnaround, and clean design. Arjuna just gets what you need and brings it to life beautifully.',
'Smart design decisions, great communication, and attention to detail. Arjuna is the kind of designer you keep coming back to.',
'Clean layouts, smooth handoff, and clear vision. Arjuna makes every project feel easy and stress-free from start to finish.',
'Always on time, super organized, and full of creative ideas. Working with Arjuna was a total win for our brand.'
]
class Markup(HTMLParser):
    VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self,text):
        super().__init__(convert_charrefs=False);self.text=text;self.stack=[];self.nodes=[];self.lines=[0]
        self.lines.extend(i+1 for i,c in enumerate(text) if c=='\n');self.feed(text)
    def position(self):
        line,column=self.getpos();return self.lines[line-1]+column
    def handle_starttag(self,tag,attrs):
        node={'tag':tag,'attrs':dict(attrs),'start':self.position(),'end':self.position()+len(self.get_starttag_text())}
        self.nodes.append(node)
        if tag not in self.VOID:self.stack.append(node)
    def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.stack.pop() if self.stack and self.stack[-1]['start']==self.position() else None
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag']==tag:
                self.stack[i]['end']=self.text.index('>',self.position())+1;del self.stack[i:];break

def occurrences(root):
    rows=[]
    for p in sorted(root.rglob('*')):
        if not p.is_file():continue
        try:text=p.read_text()
        except UnicodeDecodeError:continue
        low=text.lower();items=[];offset=0
        while (offset:=low.find('arjuna',offset))!=-1:
            context=text[max(0,offset-110):offset+170]
            reason='Original URL-map identity; keys and asset provenance are preserved' if p.name=='url-map.json' or p.parts[-2]=='stubs' else 'Retained testimonial template copy, per user instruction' if any(sentence in text[max(0,offset-200):offset+300] for sentence in PROTECTED) else 'Review remaining reference'
            items.append({'offset':offset,'context':context,'reason':reason});offset+=6
        if items:rows.append({'file':str(p.relative_to(root)),'occurrences':items})
    return rows

def main():
    manifest=json.loads((ROOT/'tools/baseline-manifest.json').read_text())
    assert all(hashlib.sha256((BASE/x['file']).read_bytes()).hexdigest()==x['sha256'] for x in manifest),'Baseline changed'
    logs=[]
    with tempfile.TemporaryDirectory(prefix='phase2a-',dir=ROOT/'tools') as temp:
        stage=Path(temp)/'site';shutil.copytree(BASE,stage)
        def patch(file,old,new,reason,expected=None,protect=False):
            path=stage/file;text=path.read_text();chunks=[text]
            if protect:
                for sentence in PROTECTED:
                    split=[]
                    for chunk in chunks:
                        if chunk in PROTECTED:split.append(chunk);continue
                        parts=chunk.split(sentence)
                        for i,part in enumerate(parts):
                            if i:split.append(sentence)
                            split.append(part)
                    chunks=split
            count=sum(chunk.count(old) for chunk in chunks if not protect or chunk not in PROTECTED)
            if expected is not None:assert count==expected,(file,reason,count,expected)
            if not count:return
            output=''.join(chunk if protect and chunk in PROTECTED else chunk.replace(old,new) for chunk in chunks)
            path.write_text(output)
            logs.append({'file':file,'string':old,'replacement':new,'count':count,'reason':reason})
        for spec in json.loads((ROOT/'tools/phase2a-specs.json').read_text()):
            patch(spec['file'],spec['old'],spec['new'],spec['reason'],spec['expected'])
        for path in sorted(stage.rglob('*.html')):
            file=str(path.relative_to(stage));text=path.read_text();nodes=Markup(text).nodes
            for node in nodes:
                a=node['attrs'];classes=a.get('class','').split()
                remove=a.get('id')=='__framer-badge-container' or a.get('id')=='pricing' or any(c in classes for c in ['framer-1f3ejyv-container','framer-1oleqaz-container','framer-40vf18','framer-18q4vgx'])
                if remove:patch(file,text[node['start']:node['end']],'','Remove SSR badge/promotion/pricing markup',1)
            for node in nodes:
                a=node['attrs']
                if a.get('rel')=='canonical' or a.get('property')=='og:url':
                    old=text[node['start']:node['end']];key='href' if a.get('rel')=='canonical' else 'content'
                    new=old.replace(key+'="'+html.escape(a[key],quote=True)+'"',key+'="https://revanthlol.github.io/"')
                    patch(file,old,new,'Rebrand canonical/og:url',1)
        main='assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs'
        home='assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs'
        patch(main,'viewBox:`0 0 637.8 220`','viewBox:`0 0 807.7 220`','Fit measured Revanth footer text without clipping',1)
        for path in sorted(stage.rglob('*.html')):
            if path.relative_to(stage).parts[0]=='assets':continue
            patch(str(path.relative_to(stage)),'viewBox="0 0 637.8 220"','viewBox="0 0 807.7 220"','Fit measured Revanth footer text without clipping',2)
        patch(main,'Idw5Egdb2:`pricing`,','','Remove pricing route anchor mapping',1)
        patch(home,',"Idw5Egdb2":{"pattern":":Idw5Egdb2","name":"pricing"}','','Remove pricing scroll-section metadata',1)
        patch(main,'siteCanonicalURL:`https://arjuna.framer.media`','siteCanonicalURL:`https://revanthlol.github.io`','Rebrand runtime canonical origin',1)
        for path in sorted(stage.rglob('*')):
            if not path.is_file() or path.name=='url-map.json' or path.parts[-2]=='stubs':continue
            if path.suffix not in ('.html','.css','.mjs','.js','.json','.svg','.webmanifest'):continue
            try:text=path.read_text()
            except UnicodeDecodeError:continue
            file=str(path.relative_to(stage))
            patch(file,'https://arjuna.framer.media','https://revanthlol.github.io','Rebrand inline canonical-origin helper')
            patch(file,'hello@arjuna.design','personallyrevanth@gmail.com','Use supplied email')
            patch(file,'https://x.com','https://github.com/revanthlol','Use supplied GitHub destination')
            patch(file,'yaXIr64Cr:`x.com`','yaXIr64Cr:`https://github.com/revanthlol`','Use GitHub social component prop')
            patch(file,'X/Twitter','GitHub','Use GitHub social label')
            for old,new in [('Arjuna','Revanth'),('ARJUNA','REVANTH')]:patch(file,old,new,'Rebrand identity; preserve testimonial sentences',protect=True)
            patch(file,'TRUSTED BY:','TECHNOLOGIES','Rename logo-strip heading')
            patch(file,'trusted by:','technologies','Rename logo-strip label')
        pricing_tokens=['Pricing','Simple Pricing','Landing Page','Full Website','(starting at)','$3500','$5500','$8000','A single, high-converting page perfect for launches or campaigns.','Landing Page & 404','Basic animations','Mobile responsive','Unlimited revisions','SEO optimized','Frequent updates on Slack','Web development + $2000','A complete website with multiple pages, custom design, and responsive layout','Multiple pages','Advanced animations','(ask for pricing)','Get a quote','I help brands, founders, and small teams craft beautiful and impactful digital experiences','Fixed Scope','Fixed Timeline','Design and Development']
        promotion_tokens=['Remix for free','More Templates','New','Create a free website with Framer, the website builder loved by startups, designers and agencies.']
        for path in sorted((stage/'assets').rglob('*.json')):
            if not path.name in ('aa3809039f5a82dc2f229d25.json','315ac781d557ac9dded7ed8a.json'):continue
            file=str(path.relative_to(stage))
            for token in pricing_tokens+promotion_tokens:
                quoted=json.dumps(token,ensure_ascii=False)
                patch(file,quoted+',','','Remove separable pricing/promotion search-index entry')
                patch(file,','+quoted,'','Remove separable pricing/promotion search-index entry')
            json.loads(path.read_text())
        # CMS files and asset/map identities remain byte-for-byte unchanged.
        changed=[]
        for item in manifest:
            file=item['file'];data=(stage/file).read_bytes()
            if data!=(BASE/file).read_bytes():changed.append(file)
        for name,rows in [('before',occurrences(BASE)),('after',occurrences(stage))]:
            (ROOT/f'tools/arjuna-{name}.json').write_text(json.dumps(rows,indent=2))
            report=[f'# Arjuna occurrence inventory: {name}', '', 'Case-insensitive scan of all served text files; captured bodies and asset/map identities are preserved.']
            for row in rows:
                report += ['',f"## {row['file']} ({len(row['occurrences'])} occurrences)",'']
                for item in row['occurrences']:
                    report += [f"Offset {item['offset']}: {item['reason'] if name=='after' else 'Original occurrence'}",'```text',item['context'],'```','']
            (ROOT/f'tools/arjuna-{name}.md').write_text('\n'.join(report)+'\n')
        for item in manifest:
            file=item['file'];shutil.copy2(stage/file,ROOT/file)
        (ROOT/'tools/phase2a-replacements.json').write_text(json.dumps(logs,indent=2))
        summary={'changed_files':changed,'replacement_operations':len(logs),'replacement_count':sum(x['count'] for x in logs)}
        (ROOT/'tools/phase2a-summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
