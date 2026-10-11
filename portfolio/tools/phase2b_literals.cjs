const fs=require('fs'),acorn=require('acorn');const file=process.argv[2],s=fs.readFileSync(file,'utf8'),ast=acorn.parse(s,{ecmaVersion:'latest',sourceType:'module'}),out=new Set();
const words=['pricing','testimonial','web design','framer development','branding','services','velox','made by','logoipsum','lorem','available •','end of dec','arjuna','get a quote','fixed scope','fixed timeline','unlimited revisions','frequent updates on slack','basic animations','advanced animations','seo optimized','landing page','full website','converts','clients','high-converting'];
function walk(n){if(!n||typeof n!=='object')return;let v=n.type==='Literal'&&typeof n.value==='string'?n.value:n.type==='TemplateLiteral'&&!n.expressions.length?n.quasis[0].value.cooked:null;
if(v&&!v.includes('.framer-')&&!v.startsWith('@')&&(words.some(w=>v.toLowerCase().includes(w))||v.includes('$')))out.add(s.slice(n.start,n.end));
for(const[k,v]of Object.entries(n)){if(k==='start'||k==='end')continue;if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}}
walk(ast);process.stdout.write(JSON.stringify([...out]));
