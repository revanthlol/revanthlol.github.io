const fs=require('fs'),acorn=require('acorn');const [file,mode,key]=process.argv.slice(2),s=fs.readFileSync(file,'utf8'),ast=acorn.parse(s,{ecmaVersion:'latest',sourceType:'module'}),found=[];
function value(n){if(n?.type==='Literal')return n.value;if(n?.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;}
function walk(n,parents=[]){if(!n||typeof n!=='object')return;
if(n.type==='CallExpression'&&n.arguments[1]?.type==='ObjectExpression'){
const props=n.arguments[1].properties,get=k=>props.find(p=>value(p.key)===k||p.key?.name===k)?.value;
let match=mode==='class'?value(get('className'))===key:mode==='name'?value(get('data-framer-name'))===key:mode==='tag'?s.slice(n.arguments[0].start,n.arguments[0].end)===key:mode==='callee'?s.slice(n.callee.start,n.callee.end)===key:false;
if(match)found.push({start:n.start,end:n.end,old:s.slice(n.start,n.end),callee:s.slice(n.callee.start,n.callee.end),parents:parents.filter(p=>p.type==='CallExpression').map(p=>({callee:s.slice(p.callee.start,p.callee.end),old:s.slice(p.start,p.end),start:p.start,end:p.end})),props:props.filter(p=>p.type==='Property').map(p=>({key:value(p.key)||p.key.name,value:value(p.value),source:s.slice(p.value.start,p.value.end)}))});}
for(const [k,v]of Object.entries(n)){if(k==='start'||k==='end')continue;if(Array.isArray(v))v.forEach(x=>walk(x,parents.concat(n)));else if(v&&typeof v==='object')walk(v,parents.concat(n));}}
walk(ast);process.stdout.write(JSON.stringify(found));
