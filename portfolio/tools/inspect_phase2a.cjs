const fs = require('fs');
const acorn = require('./node_modules/acorn');
for (const file of process.argv.slice(2)) {
 const source = fs.readFileSync(file, 'utf8');
 const tree = acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module'});
 function walk(node, parents) {
  if (!node || typeof node !== 'object') return;
  let value = node.type === 'TemplateLiteral' && node.expressions.length === 0 ? node.quasis[0].value.cooked : node.type === 'Literal' ? node.value : null;
  if (['Pricing','PRICING','Simple Pricing','Remix for free','More Templates','__framer-badge-container','Pricing section','TRUSTED BY:','Testimonials','Can I pay in milestones?'].includes(value)) {
   console.log(JSON.stringify({file, value, node:[node.start,node.end],parents:parents.slice(-9).map(n=>({type:n.type,start:n.start,end:n.end,head:source.slice(n.start,n.start+140)}))}));
  }
  for (const [key, value] of Object.entries(node)) {
   if (key==='start'||key==='end') continue;
   if (Array.isArray(value)) value.forEach(n=>walk(n,[...parents,node]));
   else if (value && typeof value==='object') walk(value,[...parents,node]);
  }
 }
 walk(tree, []);
}
