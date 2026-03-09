export function initCommands(ctx) {
  const {
    DATA,
    ART,
    THEMES,
    QUOTES,
    MAN_PAGES,
    BANNER_FONT,
    QUIZ_QUESTIONS,
    FS,
    resolvePath,
    getCwd,
    setCwd,
    updatePrompt,
    reg,
    allCommands,
    make,
    esc,
    scroll,
    printer,
    startPipes,
    startMatrix,
    startSL,
    cmdHistory,
    resetInactivity,
  } = ctx;

  let quizState = null;

  reg("help", () =>
    make(`
<div class="line mt"><span class="badge">commands</span></div>
<div class="line"><span class="c-blue">whoami</span>   — who is rev</div>
<div class="line"><span class="c-blue">neofetch</span> — system info</div>
<div class="line"><span class="c-blue">ls / cat / cd / pwd</span> — filesystem</div>
<div class="line"><span class="c-blue">contact</span>  — get in touch</div>
<div class="line"><span class="c-blue">projects / repos</span> — synced GitHub projects list</div>
<div class="line"><span class="c-blue">theme</span>    — switch theme (mocha, frappe, latte, cyberpunk)</div>
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
`)
  );

  reg("whoami", () => make(`<div class="mt">${DATA.about.map((l) => `<div class="line">${l}</div>`).join("")}</div>`));

  reg(["neofetch", "fastfetch"], () => {
    const n = DATA.neo;
    const rows = [
      [null, `<span class="bold c-blue">${esc(n.user)}</span>`],
      [null, `<span class="c-over">${"─".repeat(n.user.length)}</span>`],
      ["OS", "os"],
      ["Host", "host"],
      ["Role", "role"],
      ["Location", "location"],
      ["Skills", "skills"],
      ["Editor", "editor"],
      ["Kernel", "kernel"],
      ["Uptime", "uptime"],
      ["Packages", "packages"],
      ["Shell", "shell"],
      ["WM", "wm"],
      ["Terminal", "terminal"],
      ["CPU", "cpu"],
      ["Memory", "memory"],
    ];
    const info = rows
      .map(([k, v]) =>
        k
          ? `<div class="neo-row"><span class="neo-key">${k}</span><span class="neo-sep">: </span><span class="neo-val">${esc(n[v])}</span></div>`
          : `<div class="neo-row">${v}</div>`
      )
      .join("");
    const sw = ["#ea999c", "#a6d189", "#e5c890", "#8caaee", "#ca9ee6", "#85c1dc", "#c6d0f5"]
      .map((c) => `<div class="sw" style="background:${c}"></div>`)
      .join("");
    return make(`<div class="neo-wrap mt"><pre class="neo-art">${ART}</pre><div class="neo-info">${info}<div class="swatches">${sw}</div></div></div>`);
  });

  reg("ls", (args) => {
    const cwd = getCwd();
    const tp = args.length > 0 ? resolvePath(args[0]) : cwd;
    const node = FS[tp];
    if (!node) return make(`<div class="line mt c-red">ls: cannot access '${esc(args[0] || "")}': No such file or directory</div>`);
    if (node.type === "file") return make(`<div class="line mt c-fg">${esc(tp.split("/").pop())}</div>`);
    const items = node.children
      .map((c) => {
        const cp = tp === "~" ? `~/${c}` : `${tp}/${c}`;
        return FS[cp]?.type === "dir" ? `<span class="c-blue bold">${esc(c)}/</span>` : `<span class="c-fg">${esc(c)}</span>`;
      })
      .join('<span style="margin:0 .4rem"> </span>');
    return make(`<div class="line mt">${items}</div>`);
  });

  reg("cat", (args) => {
    if (!args.length) return make(`<div class="line mt c-over">Usage: cat &lt;file&gt;</div>`);
    const fp = resolvePath(args[0]);
    const node = FS[fp];
    if (!node) return make(`<div class="line mt c-red">cat: ${esc(args[0])}: No such file or directory</div>`);
    if (node.type === "dir") return make(`<div class="line mt c-red">cat: ${esc(args[0])}: Is a directory</div>`);
    return make(`<div class="mt">${node.content.map((l) => `<div class="line">${esc(l)}</div>`).join("")}</div>`);
  });

  reg("cd", (args) => {
    if (!args.length || args[0] === "~") {
      setCwd("~");
      updatePrompt();
      return null;
    }
    const t = resolvePath(args[0]);
    const node = FS[t];
    if (!node) return make(`<div class="line mt c-red">bash: cd: ${esc(args[0])}: No such file or directory</div>`);
    if (node.type === "file") return make(`<div class="line mt c-red">bash: cd: ${esc(args[0])}: Not a directory</div>`);
    setCwd(t);
    updatePrompt();
    return null;
  });

  reg("pwd", () => {
    return make(`<div class="line mt">${esc(getCwd().replace("~", "/home/rev"))}</div>`);
  });

  reg("contact", () => {
    const items = DATA.contact
      .map(
        ([k, v, url]) =>
          `<div class="line"><span class="c-mauve">→</span> <span class="c-blue">${esc(k)}</span><span class="c-over">: </span><a href="${url}" target="_blank">${esc(v)}</a></div>`
      )
      .join("");
    return make(`<div class="mt"><div class="line"><span class="badge">contact</span></div>${items}</div>`);
  });

  const fallbackProjects = [
    { name: "portfolio-terminal", description: "This very terminal portfolio. Meta, right? Vanilla JS + Catppuccin.", language: "HTML/CSS/JS", stars: 0, forks: 0, url: "https://github.com/revanthlol" },
    { name: "api-backend", description: "REST API in Node.js + Express. JWT auth, rate-limiting, SQLite.", language: "Node.js", stars: 2, forks: 1, url: "https://github.com/revanthlol" },
    { name: "linux-scripts", description: "Arch dotfiles + automation. Hyprland, fish, Neovim configs.", language: "Bash", stars: 5, forks: 0, url: "https://github.com/revanthlol" },
  ];

  async function renderProjects() {
    const out = document.getElementById("output");
    const loading = make(`<div class="line mt c-over">⟳ syncing projects from GitHub...</div>`);
    out.appendChild(loading);
    scroll();

    function drawProjectCards(items, isFallback = false) {
      out.appendChild(make(`<div class="line mt"><span class="badge">projects</span> <span class="c-over">revanthlol ${isFallback ? "· fallback cache" : "· live sync"}</span></div>`, false));
      items.forEach((r) => {
        const lang = r.language ? `<span class="c-yellow">[${esc(r.language)}]</span>` : "";
        const desc = r.description ? `<div class="repo-desc">${esc(r.description)}</div>` : "";
        const repoUrl = r.html_url || r.url;
        const stars = r.stargazers_count ?? r.stars ?? 0;
        const forks = r.forks_count ?? r.forks ?? 0;
        const date = r.updated_at
          ? ` · updated ${new Date(r.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
          : "";
        out.appendChild(
          make(`<div class="repo-card"><div><a class="repo-name" href="${repoUrl}" target="_blank">${esc(r.name)}</a> ${lang}</div>${desc}<div class="repo-meta">★ ${stars} &nbsp;⑂ ${forks}${date}</div></div>`)
        );
      });
      scroll();
    }

    try {
      const res = await fetch("https://api.github.com/users/revanthlol/repos?sort=updated&per_page=6");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();
      out.removeChild(loading);
      if (!Array.isArray(repos) || !repos.length) {
        drawProjectCards(fallbackProjects, true);
        return null;
      }
      drawProjectCards(repos, false);
    } catch (e) {
      try {
        out.removeChild(loading);
      } catch (_) {}
      out.appendChild(make(`<div class="line mt c-red">live sync failed: ${esc(e.message)}</div>`));
      drawProjectCards(fallbackProjects, true);
    }
    return null;
  }

  reg(["projects", "repos"], renderProjects);

  reg("theme", (args) => {
    if (!args.length) return make(`<div class="line mt">available: <span class="c-pink">mocha  frappe  latte  cyberpunk</span> &nbsp; usage: theme [name]</div>`);
    const t = THEMES[args[0].toLowerCase()];
    if (!t) return make(`<div class="line mt c-red">theme not found: ${esc(args[0])}</div>`);
    Object.keys(t).forEach((k) => document.documentElement.style.setProperty(`--${k}`, t[k]));
    return make(`<div class="line mt c-green">✓ theme switched to <span class="bold">${esc(args[0])}</span></div>`);
  });

  reg("date", () => make(`<div class="line mt">${esc(new Date().toString())}</div>`));
  reg("echo", (args) => make(`<div class="line mt">${esc(args.join(" "))}</div>`));
  reg("sudo", () => make(`<div class="line mt c-red">rev is not in the sudoers file. This incident will be reported.</div>`));

  reg("fortune", () => {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return make(`<div class="mt"><div class="line" style="border-left:2px solid var(--mauve);padding-left:.75rem"><span class="c-fg">"${esc(q.text)}"</span></div><div class="line c-over" style="padding-left:.75rem">  — ${esc(q.author)}</div></div>`);
  });

  reg("ping", (args) => {
    const host = args[0] || "google.com";
    const funny = {
      localhost: "yourself (narcissistic)",
      "127.0.0.1": "loopback (also you)",
      "google.com": "big corporate overlord",
      "github.com": "the code graveyard",
      "stackoverflow.com": "the answer oracle",
      "archlinux.org": "the true path",
      "neovim.io": "the one true editor",
    };
    const label = funny[host.toLowerCase()] ? `${host} (${funny[host.toLowerCase()]})` : `${host}`;
    const ip = [192, 168, Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(".");
    let lines = `<div class="line mt c-blue">PING ${esc(label)} (${ip}): 56 bytes</div>`;
    let recv = 0;
    for (let i = 0; i < 5; i++) {
      const ms = (Math.random() * 18 + 1.5).toFixed(3);
      const ok = Math.random() > 0.05;
      if (ok) {
        lines += `<div class="line c-fg">64 bytes from ${esc(host)}: icmp_seq=${i} ttl=64 time=<span class="c-green">${ms} ms</span></div>`;
        recv++;
      } else {
        lines += `<div class="line c-red">Request timeout for icmp_seq ${i}</div>`;
      }
    }
    const loss = Math.round(((5 - recv) / 5) * 100);
    lines += `<div class="line mt c-over">--- ${esc(host)} ping statistics ---</div>`;
    lines += `<div class="line ${loss === 0 ? "c-green" : "c-red"}">5 transmitted, ${recv} received, ${loss}% loss</div>`;
    return make(`<div class="mt">${lines}</div>`);
  });

  reg("curl", async (args) => {
    if (!args.length) return make(`<div class="line mt c-over">Usage: curl [opts] &lt;url&gt;</div>`);
    const url = args[args.length - 1];
    const filename = url.split("/").pop().split("?")[0] || "file.bin";
    const size = Math.floor(Math.random() * 900 + 100);
    const out = document.getElementById("output");
    out.appendChild(make(`<div class="line mt">  % Total &nbsp; % Received &nbsp; Xferd <span class="c-over">— ${esc(url)}</span></div>`));
    scroll();
    await new Promise((r) => setTimeout(r, 300));
    const wrapper = make(`<div><div class="progress-row"><span class="c-over" style="min-width:3rem" id="pc-pct"> 0%</span><div class="progress-wrap" style="flex:1"><div class="progress-bar" id="pc-bar"></div></div><span class="c-over" id="pc-sz">0 / ${size} KB</span></div></div>`);
    out.appendChild(wrapper);
    scroll();
    await new Promise((resolve) => {
      const bar = wrapper.querySelector("#pc-bar");
      const pctEl = wrapper.querySelector("#pc-pct");
      const szEl = wrapper.querySelector("#pc-sz");
      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 14 + 3;
        if (pct >= 100) {
          pct = 100;
          clearInterval(iv);
          bar.style.width = "100%";
          pctEl.textContent = "100%";
          pctEl.className = "c-green";
          szEl.textContent = `${size} / ${size} KB`;
          out.appendChild(make(`<div class="line c-green">✓  ${esc(filename)} saved  (${size} KB)</div>`));
          scroll();
          resolve();
        } else {
          bar.style.width = `${pct}%`;
          pctEl.textContent = `${Math.floor(pct)}%`;
          szEl.textContent = `${Math.floor((pct / 100) * size)} / ${size} KB`;
          scroll();
        }
      }, 130);
    });
    return null;
  });

  reg("man", (args) => {
    if (!args.length) return make(`<div class="line mt c-over">What manual page do you want? Usage: man &lt;command&gt;</div>`);
    const cmd = args[0].toLowerCase();
    const page = MAN_PAGES[cmd];
    if (!page) return make(`<div class="line mt c-red">No manual entry for ${esc(args[0])}</div>`);
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

  reg("cowsay", (args) => {
    const msg = args.join(" ") || "moo.";
    const LEN = 38;
    const words = msg.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      if ((`${cur} ${w}`).trim().length > LEN) {
        lines.push(cur.trim());
        cur = w;
      } else {
        cur = `${cur} ${w}`.trim();
      }
    }
    if (cur) lines.push(cur);

    const padded = lines.map((l) => l.padEnd(LEN));
    const top = ` ${"_".repeat(LEN + 2)}`;
    const bot = ` ${"-".repeat(LEN + 2)}`;
    const bubble =
      lines.length === 1
        ? `< ${padded[0]} >`
        : padded
            .map((l, i) => (i === 0 ? `/ ${l} \\` : i === lines.length - 1 ? `\\ ${l} /` : `| ${l} |`))
            .join("\n");

    const cow = `        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
    return make(`<pre class="line mt" style="color:var(--green);line-height:1.4">${esc(top)}\n${esc(bubble)}\n${esc(bot)}\n${esc(cow)}</pre>`);
  });

  reg("banner", (args) => {
    if (!args.length) return make(`<div class="line mt c-over">Usage: banner &lt;text&gt; (max 8 chars)</div>`);
    const text = args.join(" ").toUpperCase().slice(0, 8);
    const lines = ["", "", "", "", ""];
    for (const ch of text) {
      const g = BANNER_FONT[ch] || BANNER_FONT[" "];
      for (let r = 0; r < 5; r++) lines[r] += `${g[r]} `;
    }
    return make(`<pre class="banner-out">${lines.map((l) => esc(l)).join("\n")}</pre>`);
  });

  reg("hack", async (args) => {
    const target = args[0] || "mainframe.gov";
    const out = document.getElementById("output");
    const p = printer(out);
    await p(`Initiating connection to ${target}...`, "c-blue");
    await p("Scanning open ports...", "c-over", 500);
    await p("22/tcp   open  ssh", "c-green", 400);
    await p("80/tcp   open  http", "c-green", 100);
    await p("443/tcp  open  https", "c-green", 100);
    await p("3306/tcp open  mysql    ← VULNERABLE", "c-red", 200);
    await p(`Exploiting CVE-2024-${Math.floor(Math.random() * 9000 + 1000)}...`, "c-yellow", 700);
    await p("[▓▓▓▓▓▓░░░░] Bypassing firewall...", "c-over", 800);
    await p("[▓▓▓▓▓▓▓▓░░] Bypassing firewall... [OK]", "c-over", 700);
    await p("[▓▓▓▓▓▓▓▓▓░] Injecting payload... [OK]", "c-over", 600);
    await p("[▓▓▓▓▓▓▓▓▓▓] Escalating privileges... [OK]", "c-over", 600);
    await p(`root@${target}:~#`, "c-green", 500);
    await p("cat /etc/shadow", "c-fg", 400);
    await p("root:$6$REDACTED$xyz....:19000:0::::::", "c-red", 300);
    await p("", "", 400);
    await p("╔════════════════════════════════════╗", "c-green", 100);
    await p("║  ⚡  ACCESS GRANTED  ⚡             ║", "c-green", 100);
    await p("║  jk, this is completely fake 😅    ║", "c-green", 100);
    await p("║  please don't hack anything real   ║", "c-green", 100);
    await p("╚════════════════════════════════════╝", "c-green", 100);
    return null;
  });

  reg("ssh", async (args) => {
    const host = args[0] || "rev@archlinux.dev";
    const user = host.includes("@") ? host.split("@")[0] : "rev";
    const out = document.getElementById("output");
    const p = printer(out);
    await p(`Connecting to ${host}...`, "c-over");
    await p("SSH-2.0-OpenSSH_9.3p1 Arch Linux", "c-over", 300);
    await p(`Authenticating as ${user} with ed25519 key...`, "c-over", 400);
    const loadEl = make(`<div class="line c-over">Establishing secure channel<span id="ssh-dots"></span></div>`);
    out.appendChild(loadEl);
    scroll();
    const dotsEl = loadEl.querySelector("#ssh-dots");
    await new Promise((resolve) => {
      let n = 0;
      const iv = setInterval(() => {
        n++;
        dotsEl.textContent = ".".repeat(n);
        if (n >= 6) {
          clearInterval(iv);
          resolve();
        }
      }, 220);
    });
    await p("", "", 200);
    await p(`Warning: Permanently added '${host}' to known hosts.`, "c-yellow", 100);
    await p(`Last login: ${new Date(Date.now() - 3600000).toLocaleString()} from 10.0.0.42`, "c-over", 300);
    await p("", "", 100);
    await p("  there's nothing here.", "c-mauve", 200);
    await p("  (but it looked cool, right?)", "c-over", 100);
    await p("", "", 100);
    await p(`${user}@remote:~$ exit`, "c-fg", 500);
    await p("Connection to remote host closed.", "c-over", 300);
    return null;
  });

  reg("quiz", () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    const maxScore = shuffled.reduce((s, q) => s + q.pts, 0);
    quizState = { questions: shuffled, idx: 0, score: 0, maxScore };
    const q = shuffled[0];
    return make(`<div class="mt">
    <div class="line"><span class="badge">linux quiz</span> <span class="c-over">${shuffled.length} questions · type your answer · type <span class="c-red">exit</span> to quit</span></div>
    <div class="quiz-prompt"><div class="qnum">Question 1 / ${shuffled.length}</div><div class="qtext">▶  ${esc(q.q)}</div></div>
  </div>`);
  });

  reg("share", (args) => {
    if (!args.length) return make(`<div class="line mt c-over">Usage: share &lt;command&gt;  e.g. share neofetch</div>`);
    const cmd = args.join(" ");
    const url = `${location.origin}${location.pathname}?cmd=${encodeURIComponent(cmd)}`;
    navigator.clipboard.writeText(url).catch(() => {});
    return make(`<div class="mt"><div class="line c-green">✓ link copied to clipboard</div><div class="line c-over">${esc(url)}</div><div class="line c-over" style="font-size:.82rem">share this URL — it will auto-run: <span class="c-blue">${esc(cmd)}</span></div></div>`);
  });

  reg("pipes", () => {
    setTimeout(() => startPipes(false), 100);
    return make(`<div class="line mt c-green">starting pipes screensaver... press any key or click to exit</div>`);
  });

  reg("matrix", () => {
    setTimeout(startMatrix, 100);
    return make(`<div class="line mt c-green">initializing the matrix... press any key or click to exit</div>`);
  });

  reg("history", () => {
    if (!cmdHistory.length) return make(`<div class="line mt c-over">no history yet.</div>`);
    return make(`<div class="mt">${cmdHistory.map((c, i) => `<div class="line"><span class="c-over">${String(i + 1).padStart(4)}</span>  ${esc(c)}</div>`).join("")}</div>`);
  });

  reg("clear", () => {
    document.getElementById("output").innerHTML = "";
    return null;
  });

  function isQuizActive() {
    return quizState !== null;
  }

  function handleQuizInput(raw) {
    if (!quizState) return;

    const out = document.getElementById("output");
    const ans = raw.trim().toLowerCase();
    out.insertAdjacentHTML(
      "beforeend",
      `<div class="line mt"><span class="pu">answer</span><span class="pp"> ></span><span class="pd"> </span><span class="pc">${esc(raw.trim())}</span></div>`
    );

    if (ans === "exit" || ans === "quit") {
      out.appendChild(make(`<div class="line mt c-over">quiz aborted. run <span class="c-blue">quiz</span> to try again</div>`));
      quizState = null;
      scroll();
      return;
    }

    const q = quizState.questions[quizState.idx];
    const correct = q.a.some((a) => ans.includes(a.toLowerCase()) || a.toLowerCase() === ans);
    if (correct) {
      quizState.score += q.pts;
      out.appendChild(make(`<div class="line c-green">✓ correct! +${q.pts} pt${q.pts > 1 ? "s" : ""}</div>`));
    } else {
      out.appendChild(make(`<div class="line c-red">✗ nope. Answer: <span class="c-yellow">${esc(q.a[0])}</span></div>`));
    }

    quizState.idx++;
    if (quizState.idx >= quizState.questions.length) {
      const pct = Math.round((quizState.score / quizState.maxScore) * 100);
      const grade = pct >= 90 ? "S" : pct >= 70 ? "A" : pct >= 50 ? "B" : pct >= 30 ? "C" : "F";
      const msg = pct >= 90 ? "certified arch wizard 🧙‍♂️" : pct >= 70 ? "solid linux knowledge!" : pct >= 50 ? "not bad, keep hacking." : "maybe stick to GUI apps...";
      out.appendChild(
        make(`<div class="mt"><div class="line"><span class="badge">quiz complete</span></div><div class="line">Score: <span class="c-blue">${quizState.score}/${quizState.maxScore}</span> (${pct}%) — Grade: <span class="c-mauve bold">${grade}</span></div><div class="line c-over">${msg}</div></div>`)
      );
      quizState = null;
    } else {
      setTimeout(() => {
        const nq = quizState.questions[quizState.idx];
        out.appendChild(make(`<div class="quiz-prompt mt"><div class="qnum">Question ${quizState.idx + 1} / ${quizState.questions.length}</div><div class="qtext">▶  ${esc(nq.q)}</div></div>`));
        scroll();
      }, 300);
    }

    scroll();
  }

  function getArgCompletions(cmd, partial) {
    const cwd = getCwd();
    const node = FS[cwd];
    const children = node ? node.children : [];
    const map = {
      theme: ["mocha", "frappe", "latte", "cyberpunk"],
      man: allCommands(),
      ping: ["google.com", "github.com", "localhost", "archlinux.org", "neovim.io"],
    };

    if (["cat", "ls"].includes(cmd)) {
      return children.filter((c) => c.toLowerCase().startsWith(partial.toLowerCase()));
    }

    if (cmd === "cd") {
      return children
        .filter((c) => {
          const p = cwd === "~" ? `~/${c}` : `${cwd}/${c}`;
          return FS[p]?.type === "dir";
        })
        .filter((c) => c.toLowerCase().startsWith(partial.toLowerCase()));
    }

    return (map[cmd] || []).filter((c) => c.toLowerCase().startsWith(partial.toLowerCase()));
  }

  return {
    isQuizActive,
    handleQuizInput,
    getArgCompletions,
    runTypoEffect: startSL,
    onCommandRun: () => resetInactivity(),
  };
}
