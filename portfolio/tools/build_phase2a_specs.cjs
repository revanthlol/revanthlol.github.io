const fs = require('fs');
const path = require('path');
const acorn = require('./node_modules/acorn');
const root = path.resolve(__dirname, '../_baseline');
const specs = [];
const files = ['assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs', 'assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs'];
function value(node) {
 if (node?.type === 'Literal') return node.value;
 if (node?.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
}
function property(node, key) {
 return node?.properties?.find(p => (p.key?.name || value(p.key)) === key)?.value;
}
for (const file of files) {
 const source = fs.readFileSync(path.join(root, file), 'utf8');
 const tree = acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module'});
 const chosen = new Map();
 function choose(node, reason) { chosen.set(node.start, {node, reason}); }
 function walk(node, parents = []) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'CallExpression') {
   const props = node.arguments[1];
   const name = value(property(props, 'data-framer-name'));
   const cls = value(property(props, 'className'));
   if (name === 'Pricing' && source.slice(node.start,node.start+30).startsWith('h(w.section,')) choose(node, 'Remove pricing section render expression');
   if (['framer-40vf18','framer-18q4vgx'].includes(cls)) choose(node, 'Remove footer pricing link render expression');
   if (['framer-1oleqaz-container','framer-1f3ejyv-container'].includes(cls)) {
    const wrapper = [...parents].reverse().find(p => p.type==='CallExpression' && p.arguments[0]?.name==='V');
    if (!wrapper) throw Error('Missing layout wrapper for '+cls);
    choose(wrapper, cls==='framer-1oleqaz-container' ? 'Remove nav pricing link render expression' : 'Remove template promotion controls render expression');
   }
  }
  if (node.type === 'LogicalExpression' && source.slice(node.start,node.end).startsWith('pr&&T(()=>{C(document.getElementById(`__framer-badge-container`)')) choose(node, 'Disable independent Framer badge mount');
  for (const [key, child] of Object.entries(node)) {
   if (key==='start'||key==='end') continue;
   if (Array.isArray(child)) child.forEach(n=>walk(n,[...parents,node]));
   else if (child && typeof child==='object') walk(child,[...parents,node]);
  }
 }
 walk(tree);
 for (const {node, reason} of chosen.values()) specs.push({file, old:source.slice(node.start,node.end),new:reason.includes('badge mount')?'void 0':'null',expected:1,reason});
}
if (specs.length!==6) throw Error('Unexpected render replacement count: '+specs.length);
fs.writeFileSync(path.join(__dirname,'phase2a-specs.json'),JSON.stringify(specs,null,2));
console.log(specs.map(s=>({file:s.file,reason:s.reason,characters:s.old.length})));
