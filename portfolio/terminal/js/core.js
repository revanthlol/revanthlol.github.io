export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function make(html, anim = true) {
  const d = document.createElement("div");
  d.innerHTML = html;
  if (anim) d.classList.add("fadein");
  return d;
}

export function scroll() {
  const tb = document.getElementById("tb");
  tb.scrollTop = tb.scrollHeight;
}

export function printer(out) {
  return async function print(text, cls = "c-fg", wait = 0) {
    if (wait) await new Promise((r) => setTimeout(r, wait));
    out.appendChild(make(`<div class="line ${cls}">${esc(text)}</div>`));
    scroll();
  };
}

export function createCommandRegistry() {
  const commands = {};

  function reg(names, fn) {
    (Array.isArray(names) ? names : [names]).forEach((n) => {
      commands[n.toLowerCase()] = fn;
    });
  }

  function allCommands() {
    return Object.keys(commands).filter((k) => k !== "clear");
  }

  function getCommand(name) {
    return commands[name.toLowerCase()];
  }

  return { reg, allCommands, getCommand };
}

export function createFilesystem(DATA) {
  let cwd = "~";

  const FS = {"~": {"type": "dir", "children": ["links", "projects", "about.md"]}, "~/about.md": {"type": "file", "content": ["I'm Revanth, a student and open source developer based in Hyderabad. I build web apps, browser tools and Linux utilities, and I run Arch with Hyprland. I'm also a business partner in Fresh 360, a Hyderabad drinks company, and built its website."]}, "~/links": {"type": "dir", "children": ["email.md", "github.md", "x.md", "instagram.md", "reddit.md", "pinterest.md", "discord.md"]}, "~/links/email.md": {"type": "file", "content": ["personallyrevanth@gmail.com"]}, "~/projects": {"type": "dir", "children": ["leprint.md", "slotforge.md", "cyclr.md", "erp.md", "typd.md", "textfx.md", "focusd.md", "socialmesh.md", "omrealtor.md", "fresh360.md", "gild.md"]}, "~/links/github.md": {"type": "file", "content": ["https://github.com/revanthlol"]}, "~/links/x.md": {"type": "file", "content": ["https://x.com/revanthlol"]}, "~/links/instagram.md": {"type": "file", "content": ["https://www.instagram.com/revanthloll/"]}, "~/links/reddit.md": {"type": "file", "content": ["https://www.reddit.com/user/ocusii"]}, "~/links/pinterest.md": {"type": "file", "content": ["https://in.pinterest.com/ocuslol/"]}, "~/links/discord.md": {"type": "file", "content": ["https://discord.com/users/1400787457221595230"]}, "~/projects/leprint.md": {"type": "file", "content": ["LePrint", "A QR-based print, scan and copy kiosk system with a web interface and a local printer agent.", "GitHub: https://github.com/revanthlol/LePrint", "Live site: https://leprint.in/"]}, "~/projects/slotforge.md": {"type": "file", "content": ["SlotForge", "An academic timetable app that models scheduling constraints and generates schedules with OR-Tools.", "GitHub: https://github.com/revanthlol/SlotForge", "Live site: https://slotforge-main.vercel.app/"]}, "~/projects/cyclr.md": {"type": "file", "content": ["cyclr", "A keyboard-driven tab switcher for Chromium and Firefox, with previews and configurable shortcuts.", "GitHub: https://github.com/revanthlol/cyclr", "Live site: https://cyclrr.vercel.app/"]}, "~/projects/erp.md": {"type": "file", "content": ["erp", "An unofficial interface for a college student portal, with attendance, results and profile views.", "GitHub: https://github.com/revanthlol/erp", "Live site: https://erp-la.vercel.app/"]}, "~/projects/typd.md": {"type": "file", "content": ["typd", "A Wayland virtual keyboard with a draggable, resizable interface and on-screen key feedback.", "GitHub: https://github.com/revanthlol/typd"]}, "~/projects/textfx.md": {"type": "file", "content": ["TextFX", "An animated SVG text generator with per-line fonts, colors, timing and cursor controls.", "GitHub: https://github.com/revanthlol/TextFX", "Live site: https://textfxsvg.vercel.app/"]}, "~/projects/focusd.md": {"type": "file", "content": ["focusd", "A Linux window-time tracker with local SQLite storage and support for Hyprland and X11.", "GitHub: https://github.com/revanthlol/focusd"]}, "~/projects/socialmesh.md": {"type": "file", "content": ["socialmesh", "A community fork of Shoutrrr, an open source app for self-hosted social publishing and scheduling.", "GitHub: https://github.com/revanthlol/socialmesh"]}, "~/projects/omrealtor.md": {"type": "file", "content": ["omrealtor", "A static website concept for a property advisory firm, with area guides, service pages and contact information.", "GitHub: https://github.com/revanthlol/omrealtor"]}, "~/projects/fresh360.md": {"type": "file", "content": ["Fresh 360", "Website for Fresh 360, a Hyderabad drinks company I'm a business partner in. Three brands: Juicera, Fruizy and Fizzo.", "GitHub: https://github.com/revanthlol/fresh360", "Live site: https://fresh360.vercel.app/"]}, "~/projects/gild.md": {"type": "file", "content": ["GILD (Great Indian Legal Diaries)", "Landing page for a podcast on Indian law and criminal justice.", "Live demo: https://gild-two.vercel.app"]}};

  function getCwd() {
    return cwd;
  }

  function setCwd(value) {
    cwd = value;
  }

  function resolvePath(input) {
    if (!input || input === "~") return "~";
    if (input === "..") {
      if (cwd === "~") return "~";
      const p = cwd.split("/");
      p.pop();
      return p.join("/") || "~";
    }
    if (input.startsWith("~/")) return input;
    return cwd === "~" ? `~/${input}` : `${cwd}/${input}`;
  }

  function updatePrompt() {
    document.getElementById("prompt-path").textContent = `:${cwd}`;
  }

  return { FS, getCwd, setCwd, resolvePath, updatePrompt };
}
