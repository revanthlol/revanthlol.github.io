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

  const FS = {
    "~": { type: "dir", children: ["links", "projects", "interests.md", "about.md"] },
    "~/links": { type: "dir", children: ["github.md", "twitter.md", "email.md"] },
    "~/projects": { type: "dir", children: ["portfolio_v1.md", "api_backend.md", "linux_scripts.md", "readme.md"] },
    "~/interests.md": { type: "file", content: DATA.interests },
    "~/about.md": { type: "file", content: ["# about rev", ...DATA.about.map((l) => l.replace(/<[^>]+>/g, ""))] },
    "~/links/github.md": { type: "file", content: ["github.com/revanthlol", "https://github.com/revanthlol"] },
    "~/links/twitter.md": { type: "file", content: ["@revanthlol", "https://x.com/revanthlol"] },
    "~/links/email.md": { type: "file", content: ["rev@proton.me"] },
    "~/projects/portfolio_v1.md": { type: "file", content: ["# Portfolio Terminal", "This very terminal portfolio site!", "Stack: Vanilla HTML/CSS/JS", "Theme: Catppuccin Frappe"] },
    "~/projects/api_backend.md": { type: "file", content: ["# Backend API", "REST API in Node.js + Express.", "JWT auth, rate-limiting, SQLite.", "Deployed on a self-hosted VPS running Arch."] },
    "~/projects/linux_scripts.md": { type: "file", content: ["# Linux Scripts", "Arch dotfiles + automation tools.", "Hyprland, fish, Neovim configs.", "Because manually setting up Arch twice is too many times."] },
    "~/projects/readme.md": { type: "file", content: ["# Projects dir", "Browse with cat <filename>.", "Or run `projects` for a prettier view."] },
  };

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
