// ── DATA ─────────────────────────────────────────────────────────────────
const DATA = {
  about: [
    "linux user, backend dev, terminal addict.",
    "currently hacking on <span class='c-mauve'>fun web apps</span> &amp; learning <span class='c-peach'>Rust</span>.",
    "i like fast software, minimal setups, and tools that stay out of your way.",
  ],
  interests: ["linux & window managers","backend development","cybersecurity basics","low-level systems","making cringy things fun"],
  contact: [
    ["email",   "rev@proton.me",         "mailto:rev@proton.me"],
    ["github",  "github.com/revanthlol", "https://github.com/revanthlol"],
    ["twitter", "@revanthlol",           "https://x.com/revanthlol"],
  ],
  skills: [
    {name:"Rust",    pct:65, color:"peach" },
    {name:"Node.js", pct:88, color:"green" },
    {name:"Python",  pct:80, color:"blue"  },
    {name:"Bash",    pct:90, color:"yellow"},
    {name:"Linux",   pct:95, color:"mauve" },
    {name:"SQL",     pct:72, color:"pink"  },
  ],
  neo: {
    user:"rev@hp", os:"Arch Linux x86_64", host:"HP EliteBook 745 G5",
    role:"Backend Developer", location:"India",
    skills:"Rust, Node.js, Python, Bash", editor:"Neovim (btw)",
    kernel:"Linux 6.18.13-zen1-1-zen", uptime:"fueled by caffeine",
    packages:"1149 (pacman)", shell:"fish 4.5.0", wm:"Hyprland 0.54.0 (Wayland)",
    terminal:"kitty 0.45.0", cpu:"AMD Ryzen 5 PRO 2500U (8) @ 2.00 GHz",
    memory:"Brain full, allocating swap...",
  },
};

// ── BANNER FONT (5-row ASCII, A-Z, 0-9) ──────────────────────────────────
const BANNER_FONT = {
  ' ':['     ','     ','     ','     ','     '],
  'A':[' ▄█▄ ','█   █','█████','█   █','█   █'],
  'B':['████ ','█   █','████ ','█   █','████ '],
  'C':[' ████','█    ','█    ','█    ',' ████'],
  'D':['████ ','█   █','█   █','█   █','████ '],
  'E':['█████','█    ','████ ','█    ','█████'],
  'F':['█████','█    ','████ ','█    ','█    '],
  'G':[' ████','█    ','█  ██','█   █',' ████'],
  'H':['█   █','█   █','█████','█   █','█   █'],
  'I':['█████','  █  ','  █  ','  █  ','█████'],
  'J':['  ███','   █ ','   █ ','█  █ ',' ██  '],
  'K':['█   █','█  █ ','███  ','█  █ ','█   █'],
  'L':['█    ','█    ','█    ','█    ','█████'],
  'M':['█   █','██ ██','█ █ █','█   █','█   █'],
  'N':['█   █','██  █','█ █ █','█  ██','█   █'],
  'O':[' ███ ','█   █','█   █','█   █',' ███ '],
  'P':['████ ','█   █','████ ','█    ','█    '],
  'Q':[' ███ ','█   █','█ █ █','█  ██',' ████'],
  'R':['████ ','█   █','████ ','█  █ ','█   █'],
  'S':[' ████','█    ',' ███ ','    █','████ '],
  'T':['█████','  █  ','  █  ','  █  ','  █  '],
  'U':['█   █','█   █','█   █','█   █',' ███ '],
  'V':['█   █','█   █','█   █',' █ █ ','  █  '],
  'W':['█   █','█   █','█ █ █','██ ██','█   █'],
  'X':['█   █',' █ █ ','  █  ',' █ █ ','█   █'],
  'Y':['█   █',' █ █ ','  █  ','  █  ','  █  '],
  'Z':['█████','   █ ','  █  ',' █   ','█████'],
  '0':[' ███ ','█   █','█   █','█   █',' ███ '],
  '1':['  █  ',' ██  ','  █  ','  █  ',' ███ '],
  '2':[' ███ ','█   █','  ██ ',' █   ','█████'],
  '3':['████ ','    █','  ██ ','    █','████ '],
  '4':['█   █','█   █','█████','    █','    █'],
  '5':['█████','█    ','████ ','    █','████ '],
  '6':[' ███ ','█    ','████ ','█   █',' ███ '],
  '7':['█████','    █','   █ ','  █  ','  █  '],
  '8':[' ███ ','█   █',' ███ ','█   █',' ███ '],
  '9':[' ███ ','█   █',' ████','    █',' ███ '],
  '!':['  █  ','  █  ','  █  ','     ','  █  '],
  '?':[' ███ ','█   █','  ██ ','     ','  █  '],
  '.':[' ','     ','     ','     ','  █  '],
};

// ── SL LOCOMOTIVE ─────────────────────────────────────────────────────────
const SL_LINES = [
`      ====        ________                ___________    `,
`  _D _|  |_______/        \\__I_I_____===__|_________|   `,
`   |(_)---  |   H\\________/ |   |        =|___ ___|    `,
`   /     |  |   H  |  |     |   |         ||_| |_||    `,
`  |      |  |   H  |__|__-------------------| [___] |   `,
`  |______|__|___H__/__|_____/[][]~\\________|       |__ `,
`   \\_/      \\_/       \\___/   \\___/                    `,
];

// ── QUIZ QUESTIONS ────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {q:"What command lists directory contents?",           a:["ls"],                     pts:1},
  {q:"What command prints the working directory?",       a:["pwd"],                    pts:1},
  {q:"What command creates a new directory?",            a:["mkdir"],                  pts:1},
  {q:"What command moves or renames a file?",            a:["mv"],                     pts:1},
  {q:"What command copies a file?",                      a:["cp"],                     pts:1},
  {q:"What command searches text patterns in files?",    a:["grep"],                   pts:1},
  {q:"What package manager does Arch Linux use?",        a:["pacman"],                 pts:1},
  {q:"What flag makes ls show hidden files?",            a:["-a","-la","-al","--all"], pts:1},
  {q:"What command shows running processes?",            a:["ps","top","htop"],        pts:1},
  {q:"What command shows disk usage?",                   a:["df","du"],                pts:1},
  {q:"What command finds files by name?",                a:["find","locate"],          pts:1},
  {q:"What does 'chmod 777' give a file?",               a:["all permissions","full permissions","rwxrwxrwx","read write execute"], pts:2},
  {q:"What signal does Ctrl+C send to a process?",       a:["sigint","2","interrupt"], pts:2},
  {q:"What does 'sudo' stand for?",                      a:["superuser do","switch user do","substitute user do"], pts:2},
  {q:"What shell config file runs on fish startup?",     a:["config.fish","~/.config/fish/config.fish"], pts:2},
];

// ── THEMES ────────────────────────────────────────────────────────────────
const THEMES = {
  frappe:    {bg:"#303446",surface:"#414559",overlay:"#626880",fg:"#c6d0f5",muted:"#b5bfe2",blue:"#8caaee",pink:"#f2d5cf",red:"#ea999c",green:"#a6d189",mauve:"#ca9ee6",yellow:"#e5c890",peach:"#ef9f76",accent:"#684eff"},
  mocha:     {bg:"#1e1e2e",surface:"#313244",overlay:"#6c7086",fg:"#cdd6f4",muted:"#bac2de",blue:"#89b4fa",pink:"#f5c2e7",red:"#f38ba8",green:"#a6e3a1",mauve:"#cba6f7",yellow:"#f9e2af",peach:"#fab387",accent:"#89b4fa"},
  latte:     {bg:"#eff1f5",surface:"#ccd0da",overlay:"#9ca0b0",fg:"#4c4f69",muted:"#bcc0cc",blue:"#1e66f5",pink:"#ea76cb",red:"#d20f39",green:"#40a02b",mauve:"#8839ef",yellow:"#df8e1d",peach:"#fe640b",accent:"#1e66f5"},
  cyberpunk: {bg:"#0a0a0f",surface:"#0d1117",overlay:"#30363d",fg:"#00ff41",muted:"#58a6ff",blue:"#58a6ff",pink:"#ff79c6",red:"#ff5555",green:"#00ff41",mauve:"#bd93f9",yellow:"#f1fa8c",peach:"#ffb86c",accent:"#ff0080"},
};

// ── NEOFETCH ART ──────────────────────────────────────────────────────────
const ART = `
                 .o+\`
                \`ooo/
               \`+oooo:
              \`+oooooo:
              -+oooooo+:
            \`/:-:++oooo+:
           \`/++++/+++++++:
          \`/++++++++++++++:
         \`/+++ooooooooooooo/\`
        ./ooosssso++osssssso+\`
       .oossssso-\`  \`/ossssss+\`
      -osssssso.     :ssssssso.
     :osssssss/       osssso+++.
    /ossssssss/        +ssssooo/-
  \`/ossssso+/:- -:/+osssso+-
 \`+sso+:-\`       \`.-/+oso:
\`++:.           \`-/+/
.                \`/`;

// ── FORTUNE QUOTES ────────────────────────────────────────────────────────
const QUOTES = [
  {text:"Talk is cheap. Show me the code.",                                                 author:"Linus Torvalds"},
  {text:"Any fool can write code a computer can understand. Good programmers write code humans can understand.", author:"Martin Fowler"},
  {text:"First, solve the problem. Then, write the code.",                                  author:"John Johnson"},
  {text:"The best code is no code at all.",                                                 author:"Jeff Atwood"},
  {text:"It works on my machine.",                                                          author:"Every developer, ever"},
  {text:"sudo make me a sandwich",                                                          author:"xkcd #149"},
  {text:"There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.", author:"Jeff Atwood"},
  {text:"A ship in port is safe, but that's not what ships are for.",                       author:"Grace Hopper"},
  {text:"Premature optimization is the root of all evil.",                                  author:"Donald Knuth"},
  {text:"Debugging is twice as hard as writing the code in the first place.",               author:"Brian Kernighan"},
  {text:"rm -rf / # you only live once",                                                    author:"anonymous sysadmin"},
  {text:"Have you tried turning it off and on again?",                                      author:"The IT Crowd"},
  {text:"One man's crappy software is another man's full-time job.",                        author:"Jessica Gaston"},
  {text:"The computer was born to solve problems that did not exist before.",               author:"Bill Gates"},
  {text:"In the beginning was the command line.",                                           author:"Neal Stephenson"},
];

// ── MAN PAGES ─────────────────────────────────────────────────────────────
const MAN_PAGES = {
  help:     {synopsis:"help",               desc:"List all available commands. Tip: use Tab for autocomplete."},
  whoami:   {synopsis:"whoami",             desc:"Print information about rev — background, current focus, and general vibe."},
  neofetch: {synopsis:"neofetch|fastfetch", desc:"Display system information alongside the Arch Linux logo. Classic."},
  ls:       {synopsis:"ls [dir]",           desc:"List directory contents. Blue = directory, default = file."},
  cat:      {synopsis:"cat <file>",         desc:"Print file contents. Works with .md files in the current directory."},
  cd:       {synopsis:"cd [dir]",           desc:"Change working directory. 'cd ~' returns home. 'cd ..' goes up one level."},
  pwd:      {synopsis:"pwd",                desc:"Print the absolute path of the current working directory."},
  contact:  {synopsis:"contact",            desc:"Display all contact info and social links."},
  projects: {synopsis:"projects",           desc:"List rev's notable projects with descriptions."},
  repos:    {synopsis:"repos",              desc:"Fetch and display live public GitHub repos via the GitHub API."},
  skills:   {synopsis:"skills",             desc:"Display proficiency bars for various technologies."},
  theme:    {synopsis:"theme [name]",       desc:"Switch color theme. Available: mocha, frappe, latte, cyberpunk."},
  weather:  {synopsis:"weather [location]", desc:"Fetch current weather via wttr.in. Auto-detects location if omitted."},
  date:     {synopsis:"date",               desc:"Print the current system date and time."},
  history:  {synopsis:"history",            desc:"Show command history for this session."},
  fortune:  {synopsis:"fortune",            desc:"Print a random inspirational or humorous dev quote."},
  ping:     {synopsis:"ping <host>",        desc:"Send ICMP ECHO_REQUEST packets. Results are definitely 100% real."},
  curl:     {synopsis:"curl [opts] <url>",  desc:"Transfer data from a URL with an animated progress bar."},
  man:      {synopsis:"man <command>",      desc:"Display the manual page for a command. You're reading one right now."},
  cowsay:   {synopsis:"cowsay [message]",   desc:"Have a cow say something. Essential Unix utility."},
  banner:   {synopsis:"banner <text>",      desc:"Print large ASCII art text. Max 8 characters. Great for dramatic reveals."},
  hack:     {synopsis:"hack [target]",      desc:"Initiate a highly realistic and completely legal hacking sequence."},
  quiz:     {synopsis:"quiz",               desc:"Test your Linux/terminal knowledge. 5 random questions. How well do you know your shell?"},
  share:    {synopsis:"share <command>",    desc:"Generate a shareable URL that auto-runs a command when visited."},
  ssh:      {synopsis:"ssh [user@host]",    desc:"Open an SSH connection to a remote server. Results may vary."},
  pipes:    {synopsis:"pipes",              desc:"Launch the classic pipes screensaver. Click or press any key to exit."},
  matrix:   {synopsis:"matrix",             desc:"You already know. Press any key or click to exit."},
  banner:   {synopsis:"banner <text>",      desc:"Print large ASCII art text. Max 8 characters."},
  clear:    {synopsis:"clear | Ctrl+L",     desc:"Clear the terminal screen."},
  echo:     {synopsis:"echo <text>",        desc:"Print text to the terminal."},
  sudo:     {synopsis:"sudo <command>",     desc:"Execute as superuser. Strongly inadvisable."},
};

// ── FAKE FILESYSTEM ───────────────────────────────────────────────────────
let cwd = "~";

const FS = {
  "~":              {type:"dir", children:["links","projects","interests.md","about.md"]},
  "~/links":        {type:"dir", children:["github.md","twitter.md","email.md"]},
  "~/projects":     {type:"dir", children:["portfolio_v1.md","api_backend.md","linux_scripts.md","readme.md"]},
  "~/interests.md": {type:"file", content:DATA.interests},
  "~/about.md":     {type:"file", content:["# about rev",...DATA.about.map(l=>l.replace(/<[^>]+>/g,""))]},
  "~/links/github.md":  {type:"file", content:["github.com/revanthlol","https://github.com/revanthlol"]},
  "~/links/twitter.md": {type:"file", content:["@revanthlol","https://x.com/revanthlol"]},
  "~/links/email.md":   {type:"file", content:["rev@proton.me"]},
  "~/projects/portfolio_v1.md": {type:"file", content:["# Portfolio Terminal","This very terminal portfolio site!","Stack: Vanilla HTML/CSS/JS","Theme: Catppuccin Frappe"]},
  "~/projects/api_backend.md":  {type:"file", content:["# Backend API","REST API in Node.js + Express.","JWT auth, rate-limiting, SQLite.","Deployed on a self-hosted VPS running Arch."]},
  "~/projects/linux_scripts.md":{type:"file", content:["# Linux Scripts","Arch dotfiles + automation tools.","Hyprland, fish, Neovim configs.","Because manually setting up Arch twice is too many times."]},
  "~/projects/readme.md":       {type:"file", content:["# Projects dir","Browse with cat <filename>.","Or run `projects` for a prettier view."]},
};

function resolvePath(input) {
  if (!input || input==="~") return "~";
  if (input==="..") { if(cwd==="~") return "~"; const p=cwd.split("/"); p.pop(); return p.join("/")||"~"; }
  if (input.startsWith("~/")) return input;
  return cwd==="~" ? `~/${input}` : `${cwd}/${input}`;
}

function updatePrompt() {
  document.getElementById("prompt-path").textContent = ":"+cwd;
}

// ── SOUND SYSTEM ──────────────────────────────────────────────────────────
let soundEnabled = false;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) try { audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){}
}

function playClick() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const len  = Math.floor(audioCtx.sampleRate * 0.012);
    const buf  = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<len;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
    const src  = audioCtx.createBufferSource();
    src.buffer = buf;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.1;
    src.connect(gain); gain.connect(audioCtx.destination); src.start();
  } catch(e){}
}

document.getElementById("sound-toggle").addEventListener("click",()=>{
  initAudio(); soundEnabled=!soundEnabled;
  const btn=document.getElementById("sound-toggle");
  btn.textContent=soundEnabled?"🔊":"🔇";
  btn.title=soundEnabled?"typing sounds ON (click to disable)":"toggle typing sounds";
});

// ── HELPERS ───────────────────────────────────────────────────────────────
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function make(html,anim=true){ const d=document.createElement("div"); d.innerHTML=html; if(anim)d.classList.add("fadein"); return d; }
function scroll(){ const tb=document.getElementById("tb"); tb.scrollTop=tb.scrollHeight; }

// async line printer (used by hack, ssh)
function printer(out){ return async function print(text,cls="c-fg",wait=0){
  if(wait) await new Promise(r=>setTimeout(r,wait));
  out.appendChild(make(`<div class="line ${cls}">${esc(text)}</div>`));
  scroll();
};}

// ── COMMAND REGISTRY ──────────────────────────────────────────────────────
const CMDS={};
function reg(names,fn){ (Array.isArray(names)?names:[names]).forEach(n=>CMDS[n.toLowerCase()]=fn); }
const ALL_CMDS=()=>Object.keys(CMDS).filter(k=>k!=="clear");

// ── EASTER EGG CHAIN ─────────────────────────────────────────────────────
// Run neofetch + matrix + hack in any order to unlock cyberpunk theme
const EASTER_SET = new Set();
const EASTER_KEYS = ["neofetch","matrix","hack"];
let easterDone = false;

function checkEaster(cmd){
  if(easterDone) return;
  if(EASTER_KEYS.includes(cmd)) EASTER_SET.add(cmd);
  if(EASTER_KEYS.every(k=>EASTER_SET.has(k))){
    easterDone=true;
    setTimeout(unlockCyberpunk, 600);
  }
}

function unlockCyberpunk(){
  const t=THEMES.cyberpunk;
  Object.keys(t).forEach(k=>document.documentElement.style.setProperty(`--${k}`,t[k]));
  const out=document.getElementById("output");
  out.appendChild(make(`<pre class="mt" style="color:#00ff41;line-height:1.3;font-size:.82rem">
╔══════════════════════════════════════════╗
║  ⚡  R O O T   M O D E   U N L O C K E D  ⚡  ║
║                                          ║
║  you ran: neofetch · matrix · hack       ║
║  cyberpunk theme activated               ║
║  welcome to the inner circle.            ║
║                                          ║
║  type  theme frappe  to go back          ║
╚══════════════════════════════════════════╝</pre>`));
  scroll();
}

// ── INACTIVITY SCREENSAVER ────────────────────────────────────────────────
let inactivityTimer=null;
const INACTIVITY_MS=60000;

function resetInactivity(){
  clearTimeout(inactivityTimer);
  inactivityTimer=setTimeout(()=>{
    // only trigger if no overlay already active
    if(document.getElementById("pipes-canvas").style.display==="none"
    && document.getElementById("matrix-canvas").style.display==="none"){
      startPipes(true); // auto mode
    }
  }, INACTIVITY_MS);
}

// ── COMMANDS ─────────────────────────────────────────────────────────────
reg("help",()=>make(`
<div class="line mt"><span class="badge">commands</span></div>
<div class="line"><span class="c-blue">whoami</span>   — who is rev</div>
<div class="line"><span class="c-blue">neofetch</span> — system info</div>
<div class="line"><span class="c-blue">skills</span>   — proficiency bars</div>
<div class="line"><span class="c-blue">ls / cat / cd / pwd</span> — filesystem</div>
<div class="line"><span class="c-blue">contact</span>  — get in touch</div>
<div class="line"><span class="c-blue">projects</span> — my projects</div>
<div class="line"><span class="c-blue">repos</span>    — live github repos</div>
<div class="line"><span class="c-blue">theme</span>    — switch theme (mocha, frappe, latte, cyberpunk)</div>
<div class="line"><span class="c-blue">weather</span>  — current weather</div>
<div class="line"><span class="c-blue">fortune</span>  — random dev quote</div>
<div class="line"><span class="c-blue">ping</span>     — ping a host</div>
<div class="line"><span class="c-blue">curl</span>     — fetch URL with progress bar</div>
<div class="line"><span class="c-blue">banner</span>   — big ASCII text</div>
<div class="line"><span class="c-blue">cowsay</span>   — cow with a message</div>
<div class="line"><span class="c-blue">hack</span>     — totally real hacking</div>
<div class="line"><span class="c-blue">quiz</span>     — linux knowledge quiz</div>
<div class="line"><span class="c-blue">share</span>    — generate shareable URL</div>
<div class="line"><span class="c-blue">ssh</span>      — fake SSH handshake</div>
<div class="line"><span class="c-blue">pipes</span>    — pipes screensaver</div>
<div class="line"><span class="c-blue">matrix</span>   — 🟩</div>
<div class="line"><span class="c-blue">man</span>      — command manual</div>
<div class="line"><span class="c-blue">date / history / clear</span></div>
<div class="line mt c-over">↑↓ history · Tab autocomplete · Ctrl+L clear</div>
<div class="line c-over">drag titlebar · 🟡 minimise · 🟢 maximise</div>
<div class="line c-over">swipe up/down on mobile for history</div>
`));

reg("whoami",()=>make(`<div class="mt">${DATA.about.map(l=>`<div class="line">${l}</div>`).join("")}</div>`));

reg(["neofetch","fastfetch"],()=>{
  const n=DATA.neo;
  const rows=[[null,`<span class="bold c-blue">${esc(n.user)}</span>`],[null,`<span class="c-over">${"─".repeat(n.user.length)}</span>`],
    ["OS","os"],["Host","host"],["Role","role"],["Location","location"],["Skills","skills"],
    ["Editor","editor"],["Kernel","kernel"],["Uptime","uptime"],["Packages","packages"],
    ["Shell","shell"],["WM","wm"],["Terminal","terminal"],["CPU","cpu"],["Memory","memory"]];
  const info=rows.map(([k,v])=>k?`<div class="neo-row"><span class="neo-key">${k}</span><span class="neo-sep">: </span><span class="neo-val">${esc(n[v])}</span></div>`:`<div class="neo-row">${v}</div>`).join("");
  const sw=["#ea999c","#a6d189","#e5c890","#8caaee","#ca9ee6","#85c1dc","#c6d0f5"].map(c=>`<div class="sw" style="background:${c}"></div>`).join("");
  return make(`<div class="neo-wrap mt"><pre class="neo-art">${ART}</pre><div class="neo-info">${info}<div class="swatches">${sw}</div></div></div>`);
});

reg("skills",()=>{
  const B=20;
  const bars=DATA.skills.map(s=>{
    const f=Math.round(s.pct/100*B),e=B-f;
    return `<div class="skill-row"><span class="skill-label">${esc(s.name)}</span><span class="skill-filled c-${s.color}">${"█".repeat(f)}</span><span class="skill-track">${"░".repeat(e)}</span><span class="skill-pct">${s.pct}%</span></div>`;
  }).join("");
  return make(`<div class="mt"><div class="line"><span class="badge">skills</span></div><div class="skill-bar-wrap">${bars}</div></div>`);
});

reg("ls",(args)=>{
  const tp=args.length>0?resolvePath(args[0]):cwd;
  const node=FS[tp];
  if(!node) return make(`<div class="line mt c-red">ls: cannot access '${esc(args[0]||"")}': No such file or directory</div>`);
  if(node.type==="file") return make(`<div class="line mt c-fg">${esc(tp.split("/").pop())}</div>`);
  const items=node.children.map(c=>{
    const cp=tp==="~"?`~/${c}`:`${tp}/${c}`;
    return FS[cp]?.type==="dir"?`<span class="c-blue bold">${esc(c)}/</span>`:`<span class="c-fg">${esc(c)}</span>`;
  }).join('<span style="margin:0 .4rem"> </span>');
  return make(`<div class="line mt">${items}</div>`);
});

reg("cat",(args)=>{
  if(!args.length) return make(`<div class="line mt c-over">Usage: cat &lt;file&gt;</div>`);
  const fp=resolvePath(args[0]);
  const node=FS[fp];
  if(!node)            return make(`<div class="line mt c-red">cat: ${esc(args[0])}: No such file or directory</div>`);
  if(node.type==="dir")return make(`<div class="line mt c-red">cat: ${esc(args[0])}: Is a directory</div>`);
  return make(`<div class="mt">${node.content.map(l=>`<div class="line">${esc(l)}</div>`).join("")}</div>`);
});

reg("cd",(args)=>{
  if(!args.length||args[0]==="~"){ cwd="~"; updatePrompt(); return null; }
  const t=resolvePath(args[0]);
  const node=FS[t];
  if(!node)              return make(`<div class="line mt c-red">bash: cd: ${esc(args[0])}: No such file or directory</div>`);
  if(node.type==="file") return make(`<div class="line mt c-red">bash: cd: ${esc(args[0])}: Not a directory</div>`);
  cwd=t; updatePrompt(); return null;
});

reg("pwd",()=>{
  return make(`<div class="line mt">${esc(cwd.replace("~","/home/rev"))}</div>`);
});

reg("contact",()=>{
  const items=DATA.contact.map(([k,v,url])=>`<div class="line"><span class="c-mauve">→</span> <span class="c-blue">${esc(k)}</span><span class="c-over">: </span><a href="${url}" target="_blank">${esc(v)}</a></div>`).join("");
  return make(`<div class="mt"><div class="line"><span class="badge">contact</span></div>${items}</div>`);
});

reg("projects",()=>make(`
<div class="line mt"><span class="badge">projects</span></div>
<div class="repo-card">
  <div class="repo-name">portfolio-terminal</div>
  <div class="repo-desc">This very terminal portfolio. Meta, right? Vanilla JS + Catppuccin.</div>
  <div class="repo-meta">● HTML/CSS/JS  ★ 0 forks  ∞ vibes</div>
</div>
<div class="repo-card">
  <div class="repo-name">api-backend</div>
  <div class="repo-desc">REST API in Node.js + Express. JWT auth, rate-limiting, SQLite.</div>
  <div class="repo-meta">● Node.js  ★ 2  ⑂ 1</div>
</div>
<div class="repo-card">
  <div class="repo-name">linux-scripts</div>
  <div class="repo-desc">Arch dotfiles + automation. Hyprland, fish, Neovim configs.</div>
  <div class="repo-meta">● Bash  ★ 5  ⑂ 0</div>
</div>
<div class="line mt c-over">run <span class="c-blue">repos</span> to fetch live GitHub data</div>
`));

reg("repos",async()=>{
  const out=document.getElementById("output");
  const loading=make(`<div class="line mt c-over">⟳ fetching from api.github.com...</div>`);
  out.appendChild(loading); scroll();
  try{
    const res=await fetch("https://api.github.com/users/revanthlol/repos?sort=updated&per_page=6");
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos=await res.json();
    out.removeChild(loading);
    if(!Array.isArray(repos)||!repos.length){ out.appendChild(make(`<div class="line mt c-over">no public repos found.</div>`)); scroll(); return null; }
    out.appendChild(make(`<div class="line mt"><span class="badge">github repos</span> <span class="c-over">revanthlol</span></div>`,false));
    repos.forEach(r=>{
      const lang=r.language?`<span class="c-yellow">[${esc(r.language)}]</span>`:"";
      const desc=r.description?`<div class="repo-desc">${esc(r.description)}</div>`:"";
      const date=new Date(r.updated_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
      out.appendChild(make(`<div class="repo-card"><div><a class="repo-name" href="${r.html_url}" target="_blank">${esc(r.name)}</a> ${lang}</div>${desc}<div class="repo-meta">★ ${r.stargazers_count} &nbsp;⑂ ${r.forks_count} &nbsp;· updated ${date}</div></div>`));
    });
    scroll();
  }catch(e){
    try{out.removeChild(loading);}catch(_){}
    out.appendChild(make(`<div class="line mt c-red">failed to fetch repos: ${esc(e.message)}</div>`)); scroll();
  }
  return null;
});

reg("theme",(args)=>{
  if(!args.length) return make(`<div class="line mt">available: <span class="c-pink">mocha  frappe  latte  cyberpunk</span> &nbsp; usage: theme [name]</div>`);
  const t=THEMES[args[0].toLowerCase()];
  if(!t) return make(`<div class="line mt c-red">theme not found: ${esc(args[0])}</div>`);
  Object.keys(t).forEach(k=>document.documentElement.style.setProperty(`--${k}`,t[k]));
  return make(`<div class="line mt c-green">✓ theme switched to <span class="bold">${esc(args[0])}</span></div>`);
});

reg("weather",async(args)=>{
  try{
    const res=await fetch(`https://wttr.in/${args.join("+")||""}?format=3`);
    const text=await res.text();
    return make(`<div class="line mt c-blue">☁  ${esc(text.trim())}</div>`);
  }catch(e){ return make(`<div class="line mt c-red">failed to fetch weather. offline?</div>`); }
});

reg("date",()=>make(`<div class="line mt">${esc(new Date().toString())}</div>`));
reg("echo",(args)=>make(`<div class="line mt">${esc(args.join(" "))}</div>`));
reg("sudo",()=>make(`<div class="line mt c-red">rev is not in the sudoers file. This incident will be reported.</div>`));

reg("fortune",()=>{
  const q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  return make(`<div class="mt"><div class="line" style="border-left:2px solid var(--mauve);padding-left:.75rem"><span class="c-fg">"${esc(q.text)}"</span></div><div class="line c-over" style="padding-left:.75rem">  — ${esc(q.author)}</div></div>`);
});

reg("ping",(args)=>{
  const host=args[0]||"google.com";
  const funny={
    "localhost":"yourself (narcissistic)","127.0.0.1":"loopback (also you)",
    "google.com":"big corporate overlord","github.com":"the code graveyard",
    "stackoverflow.com":"the answer oracle","archlinux.org":"the true path",
    "neovim.io":"the one true editor",
  };
  const label=funny[host.toLowerCase()]?`${host} (${funny[host.toLowerCase()]})`:`${host}`;
  const ip=[192,168,Math.floor(Math.random()*256),Math.floor(Math.random()*256)].join(".");
  let lines=`<div class="line mt c-blue">PING ${esc(label)} (${ip}): 56 bytes</div>`;
  let recv=0;
  for(let i=0;i<5;i++){
    const ms=(Math.random()*18+1.5).toFixed(3), ok=Math.random()>0.05;
    if(ok){lines+=`<div class="line c-fg">64 bytes from ${esc(host)}: icmp_seq=${i} ttl=64 time=<span class="c-green">${ms} ms</span></div>`;recv++;}
    else   lines+=`<div class="line c-red">Request timeout for icmp_seq ${i}</div>`;
  }
  const loss=Math.round((5-recv)/5*100);
  lines+=`<div class="line mt c-over">--- ${esc(host)} ping statistics ---</div>`;
  lines+=`<div class="line ${loss===0?"c-green":"c-red"}">5 transmitted, ${recv} received, ${loss}% loss</div>`;
  return make(`<div class="mt">${lines}</div>`);
});

reg("curl",async(args)=>{
  if(!args.length) return make(`<div class="line mt c-over">Usage: curl [opts] &lt;url&gt;</div>`);
  const url=args[args.length-1];
  const filename=url.split("/").pop().split("?")[0]||"file.bin";
  const size=Math.floor(Math.random()*900+100);
  const out=document.getElementById("output");
  out.appendChild(make(`<div class="line mt">  % Total &nbsp; % Received &nbsp; Xferd <span class="c-over">— ${esc(url)}</span></div>`));
  scroll();
  await new Promise(r=>setTimeout(r,300));
  const wrapper=make(`<div><div class="progress-row"><span class="c-over" style="min-width:3rem" id="pc-pct"> 0%</span><div class="progress-wrap" style="flex:1"><div class="progress-bar" id="pc-bar"></div></div><span class="c-over" id="pc-sz">0 / ${size} KB</span></div></div>`);
  out.appendChild(wrapper); scroll();
  await new Promise(resolve=>{
    const bar=wrapper.querySelector("#pc-bar"),pctEl=wrapper.querySelector("#pc-pct"),szEl=wrapper.querySelector("#pc-sz");
    let pct=0;
    const iv=setInterval(()=>{
      pct+=Math.random()*14+3;
      if(pct>=100){
        pct=100; clearInterval(iv); bar.style.width="100%";
        pctEl.textContent="100%"; pctEl.className="c-green";
        szEl.textContent=`${size} / ${size} KB`;
        out.appendChild(make(`<div class="line c-green">✓  ${esc(filename)} saved  (${size} KB)</div>`));
        scroll(); resolve();
      }else{
        bar.style.width=pct+"%"; pctEl.textContent=Math.floor(pct)+"%";
        szEl.textContent=`${Math.floor(pct/100*size)} / ${size} KB`; scroll();
      }
    },130);
  });
  return null;
});

reg("man",(args)=>{
  if(!args.length) return make(`<div class="line mt c-over">What manual page do you want? Usage: man &lt;command&gt;</div>`);
  const cmd=args[0].toLowerCase(), page=MAN_PAGES[cmd];
  if(!page) return make(`<div class="line mt c-red">No manual entry for ${esc(args[0])}</div>`);
  return make(`<div class="man-page mt"><span class="man-section">${cmd.toUpperCase()}(1)  rev@portfolio Manual  ${cmd.toUpperCase()}(1)</span>

<span class="man-section">NAME</span>
    <span class="man-cmd">${esc(page.synopsis)}</span>

<span class="man-section">SYNOPSIS</span>
    <span class="man-opt">${esc(page.synopsis)}</span>

<span class="man-section">DESCRIPTION</span>
    ${esc(page.desc)}

<span class="man-section">SEE ALSO</span>
    help(1), whoami(1)

<span class="man-section">AUTHOR</span>
    rev &lt;rev@proton.me&gt;</div>`);
});

reg("cowsay",(args)=>{
  const msg=args.join(" ")||"moo.";
  const LEN=38;
  const words=msg.split(" "); const lines=[]; let cur="";
  for(const w of words){
    if((cur+" "+w).trim().length>LEN){lines.push(cur.trim());cur=w;}
    else cur=(cur+" "+w).trim();
  }
  if(cur) lines.push(cur);
  const padded=lines.map(l=>l.padEnd(LEN));
  const top=" "+"_".repeat(LEN+2), bot=" "+"-".repeat(LEN+2);
  let bubble;
  if(lines.length===1){ bubble=`< ${padded[0]} >`; }
  else { bubble=padded.map((l,i)=>i===0?`/ ${l} \\`:i===lines.length-1?`\\ ${l} /`:`| ${l} |`).join("\n"); }
  const cow=`        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
  return make(`<pre class="line mt" style="color:var(--green);line-height:1.4">${esc(top)}\n${esc(bubble)}\n${esc(bot)}\n${esc(cow)}</pre>`);
});

// ── BANNER ────────────────────────────────────────────────────────────────
reg("banner",(args)=>{
  if(!args.length) return make(`<div class="line mt c-over">Usage: banner &lt;text&gt; (max 8 chars)</div>`);
  const text=args.join(" ").toUpperCase().slice(0,8);
  const lines=["","","","",""];
  for(const ch of text){
    const g=BANNER_FONT[ch]||BANNER_FONT[' '];
    for(let r=0;r<5;r++) lines[r]+=g[r]+" ";
  }
  return make(`<pre class="banner-out">${lines.map(l=>esc(l)).join("\n")}</pre>`);
});

// ── HACK ──────────────────────────────────────────────────────────────────
reg("hack",async(args)=>{
  const target=args[0]||"mainframe.gov";
  const out=document.getElementById("output");
  const p=printer(out);
  await p(`Initiating connection to ${target}...`,"c-blue");
  await p("Scanning open ports...","c-over",500);
  await p("22/tcp   open  ssh","c-green",400);
  await p("80/tcp   open  http","c-green",100);
  await p("443/tcp  open  https","c-green",100);
  await p("3306/tcp open  mysql    ← VULNERABLE","c-red",200);
  await p(`Exploiting CVE-2024-${Math.floor(Math.random()*9000+1000)}...`,"c-yellow",700);
  await p("[▓▓▓▓▓▓░░░░] Bypassing firewall...","c-over",800);
  await p("[▓▓▓▓▓▓▓▓░░] Bypassing firewall... [OK]","c-over",700);
  await p("[▓▓▓▓▓▓▓▓▓░] Injecting payload... [OK]","c-over",600);
  await p("[▓▓▓▓▓▓▓▓▓▓] Escalating privileges... [OK]","c-over",600);
  await p(`root@${target}:~#`,"c-green",500);
  await p("cat /etc/shadow","c-fg",400);
  await p("root:$6$REDACTED$xyz....:19000:0::::::","c-red",300);
  await p("","",400);
  await p("╔════════════════════════════════════╗","c-green",100);
  await p("║  ⚡  ACCESS GRANTED  ⚡             ║","c-green",100);
  await p("║  jk, this is completely fake 😅    ║","c-green",100);
  await p("║  please don't hack anything real   ║","c-green",100);
  await p("╚════════════════════════════════════╝","c-green",100);
  return null;
});

// ── SSH ───────────────────────────────────────────────────────────────────
reg("ssh",async(args)=>{
  const host=args[0]||"rev@archlinux.dev";
  const user=host.includes("@")?host.split("@")[0]:"rev";
  const out=document.getElementById("output");
  const p=printer(out);
  await p(`Connecting to ${host}...`,"c-over");
  await p("SSH-2.0-OpenSSH_9.3p1 Arch Linux","c-over",300);
  await p(`Authenticating as ${user} with ed25519 key...`,"c-over",400);
  const loadEl=make(`<div class="line c-over">Establishing secure channel<span id="ssh-dots"></span></div>`);
  out.appendChild(loadEl); scroll();
  const dotsEl=loadEl.querySelector("#ssh-dots");
  await new Promise(resolve=>{
    let n=0;
    const iv=setInterval(()=>{ dotsEl.textContent=".".repeat(++n); if(n>=6){clearInterval(iv);resolve();} },220);
  });
  await p("","",200);
  await p(`Warning: Permanently added '${host}' to known hosts.`,"c-yellow",100);
  await p(`Last login: ${new Date(Date.now()-3600000).toLocaleString()} from 10.0.0.42`,"c-over",300);
  await p("","",100);
  await p("  there's nothing here.","c-mauve",200);
  await p("  (but it looked cool, right?)","c-over",100);
  await p("","",100);
  await p(`${user}@remote:~$ exit`,"c-fg",500);
  await p("Connection to remote host closed.","c-over",300);
  return null;
});

// ── QUIZ ──────────────────────────────────────────────────────────────────
let quizState=null;

reg("quiz",()=>{
  // Pick 5 random questions
  const shuffled=[...QUIZ_QUESTIONS].sort(()=>Math.random()-.5).slice(0,5);
  const maxScore=shuffled.reduce((s,q)=>s+q.pts,0);
  quizState={questions:shuffled,idx:0,score:0,maxScore};
  const q=shuffled[0];
  return make(`<div class="mt">
    <div class="line"><span class="badge">linux quiz</span> <span class="c-over">${shuffled.length} questions · type your answer · type <span class="c-red">exit</span> to quit</span></div>
    <div class="quiz-prompt"><div class="qnum">Question 1 / ${shuffled.length}</div><div class="qtext">▶  ${esc(q.q)}</div></div>
  </div>`);
});

function handleQuizInput(raw){
  const out=document.getElementById("output");
  const ans=raw.trim().toLowerCase();
  out.insertAdjacentHTML("beforeend",`<div class="line mt"><span class="pu">answer</span><span class="pp"> ></span><span class="pd"> </span><span class="pc">${esc(raw.trim())}</span></div>`);
  if(ans==="exit"||ans==="quit"){ out.appendChild(make(`<div class="line mt c-over">quiz aborted. run <span class="c-blue">quiz</span> to try again</div>`)); quizState=null; scroll(); return; }
  const q=quizState.questions[quizState.idx];
  const correct=q.a.some(a=>ans.includes(a.toLowerCase())||a.toLowerCase()===ans);
  if(correct){ quizState.score+=q.pts; out.appendChild(make(`<div class="line c-green">✓ correct! +${q.pts} pt${q.pts>1?"s":""}</div>`)); }
  else { out.appendChild(make(`<div class="line c-red">✗ nope. Answer: <span class="c-yellow">${esc(q.a[0])}</span></div>`)); }
  quizState.idx++;
  if(quizState.idx>=quizState.questions.length){
    const pct=Math.round(quizState.score/quizState.maxScore*100);
    const grade=pct>=90?"S":pct>=70?"A":pct>=50?"B":pct>=30?"C":"F";
    const msg=pct>=90?"certified arch wizard 🧙‍♂️":pct>=70?"solid linux knowledge!":pct>=50?"not bad, keep hacking.":"maybe stick to GUI apps...";
    out.appendChild(make(`<div class="mt"><div class="line"><span class="badge">quiz complete</span></div><div class="line">Score: <span class="c-blue">${quizState.score}/${quizState.maxScore}</span> (${pct}%) — Grade: <span class="c-mauve bold">${grade}</span></div><div class="line c-over">${msg}</div></div>`));
    quizState=null;
  }else{
    setTimeout(()=>{
      const nq=quizState.questions[quizState.idx];
      out.appendChild(make(`<div class="quiz-prompt mt"><div class="qnum">Question ${quizState.idx+1} / ${quizState.questions.length}</div><div class="qtext">▶  ${esc(nq.q)}</div></div>`));
      scroll();
    },300);
  }
  scroll();
}

// ── SHARE ─────────────────────────────────────────────────────────────────
reg("share",(args)=>{
  if(!args.length) return make(`<div class="line mt c-over">Usage: share &lt;command&gt;  e.g. share neofetch</div>`);
  const cmd=args.join(" ");
  const url=`${location.origin}${location.pathname}?cmd=${encodeURIComponent(cmd)}`;
  navigator.clipboard.writeText(url).catch(()=>{});
  return make(`<div class="mt"><div class="line c-green">✓ link copied to clipboard</div><div class="line c-over">${esc(url)}</div><div class="line c-over" style="font-size:.82rem">share this URL — it will auto-run: <span class="c-blue">${esc(cmd)}</span></div></div>`);
});

// ── PIPES SCREENSAVER ─────────────────────────────────────────────────────
let pipesAF=null;

function startPipes(auto=false){
  const canvas=document.getElementById("pipes-canvas");
  const hint=document.getElementById("pipes-exit-hint");
  canvas.style.display="block";
  hint.style.display=auto?"none":"block"; // no hint for auto screensaver, just click to exit
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const ctx=canvas.getContext("2d");
  const bg=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
  const colors=["--blue","--pink","--green","--mauve","--yellow","--peach"]
    .map(v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim());
  const CELL=20, cols=Math.floor(canvas.width/CELL), rows=Math.floor(canvas.height/CELL);
  const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
  const CORNERS={"0-1":"┓","0-3":"┛","1-0":"┗","1-2":"┛","2-1":"┗","2-3":"┏","3-0":"┏","3-2":"┓"};
  function pchar(pd,nd){
    if(pd===nd) return pd===0||pd===2?"━":"┃";
    return CORNERS[`${pd}-${nd}`]||"+";
  }
  const pipes=Array.from({length:7},()=>({
    x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows),
    dir:Math.floor(Math.random()*4), color:colors[Math.floor(Math.random()*colors.length)], steps:0,
  }));
  ctx.font=`${CELL}px IBM Plex Mono`; ctx.textBaseline="top";
  function frame(){
    for(const pipe of pipes){
      const pd=pipe.dir;
      if(pipe.steps>3&&Math.random()<0.15) pipe.dir=((pipe.dir+(Math.random()<.5?1:-1))+4)%4;
      ctx.fillStyle=pipe.color;
      ctx.fillText(pchar(pd,pipe.dir),pipe.x*CELL,pipe.y*CELL);
      const[dx,dy]=DIRS[pipe.dir];
      pipe.x=(pipe.x+dx+cols)%cols; pipe.y=(pipe.y+dy+rows)%rows; pipe.steps++;
      if(pipe.steps>80+Math.random()*60){
        pipe.x=Math.floor(Math.random()*cols); pipe.y=Math.floor(Math.random()*rows);
        pipe.dir=Math.floor(Math.random()*4);
        pipe.color=colors[Math.floor(Math.random()*colors.length)];
        pipe.steps=0;
      }
    }
    pipesAF=requestAnimationFrame(frame);
  }
  frame();
  function exitPipes(){ cancelAnimationFrame(pipesAF); ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display="none"; hint.style.display="none"; resetInactivity(); document.getElementById("cmd-input").focus(); }
  setTimeout(()=>{ canvas.addEventListener("click",exitPipes,{once:true}); document.addEventListener("keyup",exitPipes,{once:true}); },500);
}

reg("pipes",()=>{ setTimeout(()=>startPipes(false),100); return make(`<div class="line mt c-green">starting pipes screensaver... press any key or click to exit</div>`); });

// ── MATRIX ────────────────────────────────────────────────────────────────
let matrixAF=null;

function startMatrix(){
  const canvas=document.getElementById("matrix-canvas");
  const hint=document.getElementById("matrix-exit-hint");
  canvas.style.display="block"; hint.style.display="block";
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  const ctx=canvas.getContext("2d");
  const cols=Math.floor(canvas.width/16);
  const drops=Array(cols).fill(1);
  const chars="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/|{}[]";
  function draw(){
    ctx.fillStyle="rgba(0,0,0,0.05)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font="14px IBM Plex Mono";
    for(let i=0;i<drops.length;i++){
      const c=chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle=drops[i]*16<60?"#ffffff":"#00ff41";
      ctx.fillText(c,i*16,drops[i]*16);
      if(drops[i]*16>canvas.height&&Math.random()>.975) drops[i]=0;
      drops[i]++;
    }
    matrixAF=requestAnimationFrame(draw);
  }
  draw();
  function exit(){ cancelAnimationFrame(matrixAF); ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display="none"; hint.style.display="none"; document.getElementById("cmd-input").focus(); }
  // keyup + 800ms delay so the Enter that launched matrix doesn't instantly exit
  setTimeout(()=>{ canvas.addEventListener("click",exit,{once:true}); document.addEventListener("keyup",exit,{once:true}); },800);
}

reg("matrix",()=>{ setTimeout(startMatrix,100); return make(`<div class="line mt c-green">initializing the matrix... press any key or click to exit</div>`); });

// ── SL LOCOMOTIVE ─────────────────────────────────────────────────────────
function startSL(){
  const stage=document.getElementById("sl-stage");
  const train=document.getElementById("sl-train");
  train.textContent=SL_LINES.join("\n");
  stage.style.display="block";
  let pos=window.innerWidth+60;
  function anim(){ pos-=6; train.style.left=pos+"px"; if(pos<-720){stage.style.display="none";return;} requestAnimationFrame(anim); }
  anim();
}

reg("history",()=>{
  if(!cmdHistory.length) return make(`<div class="line mt c-over">no history yet.</div>`);
  return make(`<div class="mt">${cmdHistory.map((c,i)=>`<div class="line"><span class="c-over">${String(i+1).padStart(4)}</span>  ${esc(c)}</div>`).join("")}</div>`);
});

reg("clear",()=>{ document.getElementById("output").innerHTML=""; return null; });

// ── WINDOW DRAGGING ───────────────────────────────────────────────────────
const win=document.getElementById("win");
const titlebar=document.getElementById("titlebar");
let dragging=false, dragSX,dragSY,winSL,winST;

titlebar.addEventListener("mousedown",e=>{
  if(["dot-r","dot-y","dot-g","sound-toggle"].includes(e.target.id)) return;
  dragging=true;
  const r=win.getBoundingClientRect();
  winSL=r.left; winST=r.top; dragSX=e.clientX; dragSY=e.clientY;
  win.style.left=winSL+"px"; win.style.top=winST+"px"; win.style.transform="none";
  win.classList.add("dragged"); win.classList.remove("maximised"); isMax=false;
  e.preventDefault();
});
document.addEventListener("mousemove",e=>{ if(!dragging)return; win.style.left=(winSL+e.clientX-dragSX)+"px"; win.style.top=(winST+e.clientY-dragSY)+"px"; });
document.addEventListener("mouseup",()=>{ dragging=false; });

// ── DOT BUTTONS ───────────────────────────────────────────────────────────
let isMin=false, isMax=false, savedStyle={};

document.getElementById("dot-r").addEventListener("click",()=>{
  win.classList.add("closing");
  setTimeout(()=>{
    win.innerHTML=`<div style="padding:3rem;text-align:center;color:var(--red)"><div style="font-size:1.1rem">nice try.</div><div style="color:var(--overlay);font-size:.85rem;margin-top:.5rem">this terminal cannot be killed.</div><div style="color:var(--overlay);font-size:.75rem;margin-top:.25rem">( refresh to restart )</div></div>`;
    win.classList.remove("closing");
  },250);
});

document.getElementById("dot-y").addEventListener("click",()=>{
  isMin=!isMin; win.classList.toggle("minimised",isMin);
  document.getElementById("footer").classList.toggle("hidden",isMin);
});

document.getElementById("dot-g").addEventListener("click",()=>{
  if(!isMax){
    savedStyle={left:win.style.left,top:win.style.top,width:win.style.width,height:win.style.height,transform:win.style.transform};
    win.classList.add("maximised"); isMax=true;
  }else{
    win.classList.remove("maximised"); Object.assign(win.style,savedStyle); isMax=false;
  }
});

// ── RUNTIME ───────────────────────────────────────────────────────────────
const cmdHistory=[];
let histIdx=0;

async function run(raw){
  const out=document.getElementById("output");
  const cmdRaw=raw.trim();
  const promptUser=document.getElementById("prompt-user").textContent;
  const promptPath=document.getElementById("prompt-path").textContent;
  out.insertAdjacentHTML("beforeend",`<div class="line mt"><span class="pu">${esc(promptUser)}</span><span class="pp">${esc(promptPath)}</span><span class="pd">&nbsp;$&nbsp;</span><span class="pc">${esc(cmdRaw)}</span></div>`);
  if(!cmdRaw){scroll();return;}
  if(cmdHistory[cmdHistory.length-1]!==cmdRaw) cmdHistory.push(cmdRaw);
  histIdx=cmdHistory.length;
  resetInactivity();
  const parts=cmdRaw.split(/\s+/), cmd=parts[0].toLowerCase(), args=parts.slice(1);
  // SL typo detection
  if(cmd==="sl"){ startSL(); out.appendChild(make(`<div class="line mt c-over">choo choo! (did you mean <span class="c-blue">ls</span>?)</div>`)); scroll(); return; }
  checkEaster(cmd);
  const fn=CMDS[cmd];
  if(fn){ const res=await fn(args); if(res) out.appendChild(res); }
  else out.appendChild(make(`<div class="line mt"><span class="c-red">fish: Unknown command:</span> <span class="c-over">${esc(cmd)}</span> — try <span class="c-pink">help</span></div>`));
  scroll();
}

// ── TAB AUTOCOMPLETE (commands + arguments) ───────────────────────────────
function getArgCompletions(cmd,partial){
  const node=FS[cwd], children=node?node.children:[];
  const map={theme:["mocha","frappe","latte","cyberpunk"],man:ALL_CMDS(),ping:["google.com","github.com","localhost","archlinux.org","neovim.io"]};
  if(["cat","ls"].includes(cmd)) return children.filter(c=>c.toLowerCase().startsWith(partial.toLowerCase()));
  if(cmd==="cd") return children.filter(c=>{ const p=cwd==="~"?`~/${c}`:`${cwd}/${c}`; return FS[p]?.type==="dir"; }).filter(c=>c.toLowerCase().startsWith(partial.toLowerCase()));
  return (map[cmd]||[]).filter(c=>c.toLowerCase().startsWith(partial.toLowerCase()));
}

// ── INPUT HANDLER ─────────────────────────────────────────────────────────
const input=document.getElementById("cmd-input");
document.getElementById("tb").addEventListener("click",()=>input.focus());

// Mobile touch swipe for history
let touchY0=0, touchX0=0;
document.getElementById("tb").addEventListener("touchstart",e=>{ touchY0=e.touches[0].clientY; touchX0=e.touches[0].clientX; input.focus(); },{passive:true});
document.getElementById("tb").addEventListener("touchend",e=>{
  const dy=touchY0-e.changedTouches[0].clientY, dx=Math.abs(touchX0-e.changedTouches[0].clientX);
  if(Math.abs(dy)>35&&Math.abs(dy)>dx){
    if(dy<0){ if(histIdx<cmdHistory.length-1){histIdx++;input.value=cmdHistory[histIdx];}else{histIdx=cmdHistory.length;input.value="";} }
    else { if(histIdx>0){histIdx--;input.value=cmdHistory[histIdx];} }
  }
},{passive:true});

input.addEventListener("keydown",e=>{
  if(!["Shift","Control","Alt","Meta","CapsLock"].includes(e.key)) playClick();
  resetInactivity();

  if(e.key==="Enter"){
    const val=input.value; input.value="";
    if(quizState) handleQuizInput(val);
    else run(val);

  }else if(e.key==="ArrowUp"){
    e.preventDefault();
    if(histIdx>0){histIdx--;input.value=cmdHistory[histIdx];}

  }else if(e.key==="ArrowDown"){
    e.preventDefault();
    if(histIdx<cmdHistory.length-1){histIdx++;input.value=cmdHistory[histIdx];}
    else{histIdx=cmdHistory.length;input.value="";}

  }else if(e.key==="Tab"){
    e.preventDefault();
    const val=input.value, parts=val.split(/\s+/);
    if(parts.length<=1&&!val.includes(" ")){
      const matches=ALL_CMDS().filter(k=>k.startsWith(val.toLowerCase()));
      if(matches.length===1) input.value=matches[0];
      else if(matches.length>1){
        const out=document.getElementById("output");
        out.appendChild(make(`<div class="ac-hint mt">${matches.map(m=>`<span>${m}</span>`).join("")}</div>`));
        scroll();
      }
    }else{
      const cmd=parts[0].toLowerCase(), partial=parts[parts.length-1];
      const comps=getArgCompletions(cmd,partial);
      if(comps.length===1){parts[parts.length-1]=comps[0];input.value=parts.join(" ");}
      else if(comps.length>1){
        const out=document.getElementById("output");
        out.appendChild(make(`<div class="ac-hint mt">${comps.map(m=>`<span>${m}</span>`).join("")}</div>`));
        scroll();
      }
    }

  }else if(e.key==="l"&&e.ctrlKey){
    e.preventDefault();
    document.getElementById("output").innerHTML="";
  }
});

// ── BOOT ──────────────────────────────────────────────────────────────────
// Visitor counter (localStorage)
const visits=parseInt(localStorage.getItem("rv_visits")||"0")+1;
localStorage.setItem("rv_visits",String(visits));
const visitLabel=visits===1?"first visit!":`boot #${visits}`;

document.getElementById("output").appendChild(make(`
<div class="line"><span class="c-blue bold">rev@portfolio</span> <span class="c-over">~</span>  <span class="visit-badge">${visitLabel}</span></div>
<div class="line c-over">type <span class="c-pink">help</span> to get started · <span class="c-mauve">fortune</span> for a quote · <span class="c-yellow">quiz</span> to test yourself</div>
<div class="line c-over" style="font-size:.78rem">💡 secret: run three specific commands to unlock a hidden theme</div>
`,false));

// URL ?cmd= auto-run
const urlCmd=new URLSearchParams(location.search).get("cmd");
if(urlCmd){ setTimeout(()=>run(urlCmd),400); }

input.focus();
resetInactivity();