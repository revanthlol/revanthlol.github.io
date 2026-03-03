// ── DATA ────────────────────────────────────────────────────────────────
const DATA = {
  about:[
    "linux user, backend dev, terminal addict.",
    "currently hacking on <span class='c-mauve'>fun web apps</span> &amp; learning <span class='c-peach'>Rust</span>.",
    "i like fast software, minimal setups, and tools that stay out of your way.",
  ],
  interests:[
    "linux & window managers",
    "backend development",
    "cybersecurity basics",
    "low-level systems",
    "making cringy things fun",
  ],
  contact: [["email", "rev@proton.me", "mailto:rev@proton.me"],["github", "github.com/revanthlol", "https://github.com/revanthlol"],["twitter", "@revanthlol", "https://x.com/revanthlol"],
  ],
  neo: {
    user: "rev@hp", os: "Arch Linux x86_64", host: "HP EliteBook 745 G5",
    role: "Backend Developer", location: "India", skills: "Rust, Node.js, Python, Bash",
    editor: "Neovim (btw)", kernel: "Linux 6.18.13-zen1-1-zen", uptime: "fueled by caffeine",
    packages: "1149 (pacman)", shell: "fish 4.5.0", wm: "Hyprland 0.54.0 (Wayland)",
    terminal: "kitty 0.45.0", cpu: "AMD Ryzen 5 PRO 2500U (8) @ 2.00 GHz", memory: "Brain full, allocating swap...",
  },
};

// ── THEMES ──────────────────────────────────────────────────────────────
const THEMES = {
  frappe: { bg: "#303446", surface: "#414559", overlay: "#626880", fg: "#c6d0f5", muted: "#b5bfe2", blue: "#8caaee", pink: "#f2d5cf", red: "#ea999c", green: "#a6d189", mauve: "#ca9ee6", yellow: "#e5c890", peach: "#ef9f76", accent: "#684eff" },
  mocha: { bg: "#1e1e2e", surface: "#313244", overlay: "#6c7086", fg: "#cdd6f4", muted: "#bac2de", blue: "#89b4fa", pink: "#f5c2e7", red: "#f38ba8", green: "#a6e3a1", mauve: "#cba6f7", yellow: "#f9e2af", peach: "#fab387", accent: "#89b4fa" },
  latte: { bg: "#eff1f5", surface: "#ccd0da", overlay: "#9ca0b0", fg: "#4c4f69", muted: "#bcc0cc", blue: "#1e66f5", pink: "#ea76cb", red: "#d20f39", green: "#40a02b", mauve: "#8839ef", yellow: "#df8e1d", peach: "#fe640b", accent: "#1e66f5" },
};

const ART = `
                 .o+\\
                \`ooo/
               \`+oooo:
              \`+oooooo:
              -+oooooo+:
            \`/:-:++oooo+:
           \`/++++/+++++++:
          \`/++++++++++++++:
         \`/+++ooooooooooooo/\`
        ./ooosssso++osssssso+\`
       .oossssso-\` \`/ossssss+\`
      -osssssso. :ssssssso.
     :osssssss/ osssso+++.
    /ossssssss/ +ssssooo/-
  \`/ossssso+/:- -:/+osssso+-
 \`+sso+:-\` \`.-/+oso:
\`++:. \`-/+/
. \`/`;

// ── HELPERS ──────────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function make(html, anim = true) {
  const d = document.createElement("div");
  d.innerHTML = html;
  if (anim) d.classList.add("fadein");
  return d;
}

// ── COMMAND REGISTRY ──────────────────────────────────────────────────────
const CMDS = {};
function reg(names, fn) {
  (Array.isArray(names) ? names : [names]).forEach(n => (CMDS[n.toLowerCase()] = fn));
}

// ── COMMANDS ──────────────────────────────────────────────────────────────
reg("help", () => make(`
<div class="line mt"><span class="badge">commands</span></div>
<div class="line"><span class="c-blue">whoami</span>   — who is rev</div>
<div class="line"><span class="c-blue">neofetch</span> — system info</div>
<div class="line"><span class="c-blue">ls</span>       — list directory contents</div>
<div class="line"><span class="c-blue">cat</span>      — read file contents</div>
<div class="line"><span class="c-blue">contact</span>  — get in touch</div>
<div class="line"><span class="c-blue">projects</span> — my projects</div>
<div class="line"><span class="c-blue">theme</span>    — switch theme (mocha, frappe, latte)</div>
<div class="line"><span class="c-blue">weather</span>  — fetch current weather</div>
<div class="line"><span class="c-blue">date</span>     — print system date/time</div>
<div class="line"><span class="c-blue">history</span>  — view command history</div>
<div class="line"><span class="c-blue">clear</span>    — clear terminal</div>
<div class="line mt c-over">tip: ↑↓ history · Tab autocomplete</div>
`));

reg("whoami", () => make(`<div class="mt">${DATA.about.map(l => `<div class="line">${l}</div>`).join("")}</div>`));

reg(["neofetch", "fastfetch"], () => {
  const n = DATA.neo;
  const rows = [[null, `<span class="bold c-blue">${esc(n.user)}</span>`],[null, `<span class="c-over">${"─".repeat(n.user.length)}</span>`],
    ["OS", n.os], ["Host", n.host], ["Role", n.role], ["Location", n.location],
    ["Skills", n.skills],["Editor", n.editor], ["Kernel", n.kernel], ["Uptime", n.uptime],["Packages", n.packages], ["Shell", n.shell], ["WM", n.wm], ["Terminal", n.terminal],
    ["CPU", n.cpu], ["Memory", n.memory],
  ];
  const info = rows.map(([k, v]) => k ? `<div class="neo-row"><span class="neo-key">${k}</span><span class="neo-sep">: </span><span class="neo-val">${esc(v)}</span></div>` : `<div class="neo-row">${v}</div>`).join("");
  const swatches =["#ea999c","#a6d189","#e5c890","#8caaee","#ca9ee6","#85c1dc","#c6d0f5"].map(c => `<div class="sw" style="background:${c}"></div>`).join("");
  return make(`<div class="neo-wrap mt"><pre class="neo-art">${ART}</pre><div class="neo-info">${info}<div class="swatches">${swatches}</div></div></div>`);
});

reg("ls", (args) => {
  if (args.length === 0) {
    return make(`<div class="line mt c-blue">links/  projects/  <span class="c-fg">interests.md</span></div>`);
  }
  const dir = args[0].replace(/\/$/, "");
  if (dir === "links") {
    const items = DATA.contact.filter(x => x[0] !== 'email').map(([cls,label,url]) => `<a class="${cls}" href="${url}" target="_blank">${label}</a>`).join('<span class="c-over">  </span>');
    return make(`<div class="line mt link-row">${items}</div>`);
  } else if (dir === "projects") {
    return make(`<div class="line mt">portfolio_v1  api_backend  linux_scripts</div>`);
  }
  return make(`<div class="line mt c-red">ls: cannot access '${esc(args[0])}': No such file or directory</div>`);
});

reg("cat", (args) => {
  if (args.length === 0) return make(`<div class="line mt">Usage: cat [file]</div>`);
  if (args[0] === "interests.md") {
    const items = DATA.interests.map(i => `<div class="line"><span class="c-blue">•</span> ${i}</div>`).join('');
    return make(`<div class="mt"><div class="line"><span class="badge">interests</span></div>${items}</div>`);
  }
  return make(`<div class="line mt c-red">cat: ${esc(args[0])}: No such file or directory</div>`);
});

reg("contact", () => {
  const items = DATA.contact.map(([k,v,url]) => `<div class="line"><span class="c-mauve">→</span> <span class="c-blue">${esc(k)}</span><span class="c-over">: </span><a href="${url}" target="_blank">${esc(v)}</a></div>`).join('');
  return make(`<div class="mt"><div class="line"><span class="badge">contact</span></div>${items}</div>`);
});

reg("projects", () => make(`
<div class="line mt"><span class="badge">projects</span></div>
<div class="line"><span class="c-green">• Portfolio Terminal</span> - This very site! Meta, right?</div>
<div class="line"><span class="c-green">• Backend API</span> - Some cool API I built in Node.js</div>
<div class="line"><span class="c-green">• Linux Script</span> - Automation tools for Arch</div>
`));

reg("theme", (args) => {
  if (args.length === 0) return make(`<div class="line mt">Available themes: <span class="c-pink">mocha, frappe, latte</span>. Usage: theme [name]</div>`);
  const t = THEMES[args[0].toLowerCase()];
  if (!t) return make(`<div class="line mt c-red">Theme not found.</div>`);
  
  // Apply theme to CSS variables
  Object.keys(t).forEach(key => document.documentElement.style.setProperty(`--${key}`, t[key]));
  return make(`<div class="line mt c-green">Theme successfully switched to ${esc(args[0])}.</div>`);
});

reg("date", () => make(`<div class="line mt">${new Date().toString()}</div>`));

reg("echo", (args) => make(`<div class="line mt">${esc(args.join(" "))}</div>`));

reg("sudo", () => make(`<div class="line mt c-red">rev is not in the sudoers file. This incident will be reported.</div>`));

reg("weather", async (args) => {
  try {
    const loc = args.join("+") || "";
    // wttr.in format 3 is a sleek one-liner
    const res = await fetch(`https://wttr.in/${loc}?format=3`); 
    const text = await res.text();
    return make(`<div class="line mt c-blue">${esc(text)}</div>`);
  } catch (e) {
    return make(`<div class="line mt c-red">Failed to fetch weather. Offline?</div>`);
  }
});

reg("history", () => {
  const histList = history.map((cmd, i) => `<div class="line"><span class="c-over">${(i+1).toString().padStart(3, ' ')}</span>  ${esc(cmd)}</div>`).join("");
  return make(`<div class="mt">${histList}</div>`);
});

reg("clear", () => { document.getElementById("output").innerHTML = ""; return null; });

// ── RUNTIME & HISTORY ────────────────────────────────────────────────────
const history =[];
let histIdx = 0;
const ALL_CMDS = () => Object.keys(CMDS).filter(k => k !== 'clear');

async function run(raw) {
  const out = document.getElementById("output");
  const cmdRaw = raw.trim();
  
  // Echo the command
  out.insertAdjacentHTML("beforeend", `<div class="line mt"><span class="pu">rev@portfolio</span><span class="pp">:~</span><span class="pd">&nbsp;$&nbsp;</span><span class="pc">${esc(cmdRaw)}</span></div>`);

  if (!cmdRaw) return scroll();

  // Add to bash history array
  if (history[history.length - 1] !== cmdRaw) history.push(cmdRaw);
  histIdx = history.length;

  // Split command and arguments
  const parts = cmdRaw.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const fn = CMDS[cmd];
  if (fn) {
    const res = await fn(args); // Await handles async commands like weather
    if (res) out.appendChild(res);
  } else {
    out.appendChild(make(`<div class="line mt"><span class="c-red">fish: Unknown command:</span> <span class="c-over">${esc(cmd)}</span> — try <span class="c-pink">help</span></div>`));
  }
  scroll();
}

function scroll() {
  const tb = document.getElementById("tb");
  tb.scrollTop = tb.scrollHeight;
}

// ── INPUT EVENT LISTENERS ────────────────────────────────────────────────
const input = document.getElementById("cmd-input");
document.getElementById('tb').addEventListener('click', () => input.focus());

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    run(input.value);
    input.value = "";
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      input.value = history[histIdx];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIdx < history.length - 1) {
      histIdx++;
      input.value = history[histIdx];
    } else {
      histIdx = history.length;
      input.value = "";
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const val = input.value.toLowerCase();
    if (!val) return;
    const matches = ALL_CMDS().filter(k => k.startsWith(val));
    if (matches.length === 1) input.value = matches[0];
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    document.getElementById("output").innerHTML = "";
  }
});

// ── BOOT ────────────────────────────────────────────────────────────────
document.getElementById("output").appendChild(
  make(`<div class="line"><span class="c-blue bold">rev@portfolio</span> <span class="c-over">~</span></div>
<div class="line c-over">type <span class="c-pink">help</span> to get started</div>`, false)
);
input.focus();