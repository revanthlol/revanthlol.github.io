const fs=require('fs'),acorn=require('acorn');
for(const name of process.argv.slice(2)){
 const s=fs.readFileSync(name,'utf8'),ast=acorn.parse(s,{ecmaVersion:'latest',sourceType:'module'});let hits=[];
 function walk(n,parents=[]){if(!n||typeof n!=='object')return;
 if(n.type==='CallExpression' && n.arguments[1]?.type==='ObjectExpression'){
  const props=n.arguments[1].properties;const get=k=>{let p=props.find(p=>(p.key?.name||p.key?.value)===k);return p?s.slice(p.value.start,p.value.end):''};let cls=get('className'),label=get('data-framer-name');
  if((cls||label)&& (s.slice(n.arguments[0].start,n.arguments[0].end).includes('section')||['`Hero`','`About`','`FAQ`','`Contact`','`Services`','`Testimonials`'].includes(label))){hits.push({start:n.start,end:n.end,callee:s.slice(n.callee.start,n.callee.end),tag:s.slice(n.arguments[0].start,n.arguments[0].end),cls,label,preview:s.slice(n.start,n.start+160)});}
 }
 for(const [k,v] of Object.entries(n)){if(['start','end'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,parents.concat(n)));else if(v&&typeof v==='object')walk(v,parents.concat(n));}
 }walk(ast); console.log(name,JSON.stringify(hits));
}
