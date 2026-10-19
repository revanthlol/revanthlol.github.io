"""Reuse the captured native nav/footer on runtime-free pages."""
from patch_phase2a import Markup
def shell(stage):
 source=(stage/'index.html').read_text();nodes=Markup(source).nodes
 def parts(tag):
  result=[]
  for n in nodes:
   if n['tag']!=tag:continue
   value=source[n['start']:n['end']]
   for old,new in [('href="./#projects"','href="/projects/"'),('href="./"','href="/"'),('href="./projects"','href="/projects/"'),('href="./projects/"','href="/projects/"'),('href="./contact"','href="/contact/"'),('href="./contact/"','href="/contact/"'),('href="./404"','href="/404/"'),('href="./404/"','href="/404/"'),('href="./#about"','href="/#about"')]:value=value.replace(old,new)
   result.append('<div class="rev-native-'+n['attrs']['data-framer-name'].lower()+'">'+value+'</div>')
  return ''.join(result)
 header=(stage/'assets/components/site-header.html').read_text()
 footer='<div class="rev-captured-footer">'+parts('footer')+'</div>'
 return header,footer
