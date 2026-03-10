export const DATA = {
  about: [
    "Linux loyalist, backend tinkerer, and yes, I do spend too much time in the terminal.",
    "Currently cobbling together <span class='c-mauve'>web apps that won't crash on purpose</span> while pretending Rust isn't out to humble me.",
    "I gravitate toward software that's swift, setups that don't fight back, and tools with the decency to vanish when uninvited.",
  ],
  interests: [
    "Linux and its window managers—because why have one when you can have five?",
    "messing around with computers, because why not?",
    "Rescuing cringeworthy ideas from total obscurity",
  ],
  contact: [
    [
      "email",
      "personallyrevanth@gmail.com",
      "mailto:personallyrevanth@gmail.com",
    ],
    ["github", "github.com/revanthlol", "https://github.com/revanthlol"],
    ["twitter", "@revanthlol", "https://x.com/revanthlol"],
  ],
  skills: [
    { name: "Rust", pct: 65, color: "peach" },
    { name: "Node.js", pct: 88, color: "green" },
    { name: "Python", pct: 80, color: "blue" },
    { name: "Bash", pct: 90, color: "yellow" },
    { name: "Linux", pct: 95, color: "mauve" },
    { name: "SQL", pct: 72, color: "pink" },
  ],
  neo: {
    user: "rev@hp",
    os: "Arch Linux x86_64",
    host: "HP EliteBook 745 G5",
    role: "Backend Developer",
    location: "India",
    skills: "Rust, Node.js, Python, Bash",
    editor: "Neovim (btw)",
    kernel: "Linux 6.18.13-zen1-1-zen",
    uptime: "fueled by caffeine",
    packages: "1149 (pacman)",
    shell: "fish 4.5.0",
    wm: "Hyprland 0.54.0 (Wayland)",
    terminal: "kitty 0.45.0",
    cpu: "AMD Ryzen 5 PRO 2500U (8) @ 2.00 GHz",
    memory: "Brain full, allocating swap...",
  },
};

export const BANNER_FONT = {
  " ": ["     ", "     ", "     ", "     ", "     "],
  A: [" ▄█▄ ", "█   █", "█████", "█   █", "█   █"],
  B: ["████ ", "█   █", "████ ", "█   █", "████ "],
  C: [" ████", "█    ", "█    ", "█    ", " ████"],
  D: ["████ ", "█   █", "█   █", "█   █", "████ "],
  E: ["█████", "█    ", "████ ", "█    ", "█████"],
  F: ["█████", "█    ", "████ ", "█    ", "█    "],
  G: [" ████", "█    ", "█  ██", "█   █", " ████"],
  H: ["█   █", "█   █", "█████", "█   █", "█   █"],
  I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
  J: ["  ███", "   █ ", "   █ ", "█  █ ", " ██  "],
  K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
  M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
  N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  P: ["████ ", "█   █", "████ ", "█    ", "█    "],
  Q: [" ███ ", "█   █", "█ █ █", "█  ██", " ████"],
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  S: [" ████", "█    ", " ███ ", "    █", "████ "],
  T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
  W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
  X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
  0: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  1: ["  █  ", " ██  ", "  █  ", "  █  ", " ███ "],
  2: [" ███ ", "█   █", "  ██ ", " █   ", "█████"],
  3: ["████ ", "    █", "  ██ ", "    █", "████ "],
  4: ["█   █", "█   █", "█████", "    █", "    █"],
  5: ["█████", "█    ", "████ ", "    █", "████ "],
  6: [" ███ ", "█    ", "████ ", "█   █", " ███ "],
  7: ["█████", "    █", "   █ ", "  █  ", "  █  "],
  8: [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
  9: [" ███ ", "█   █", " ████", "    █", " ███ "],
  "!": ["  █  ", "  █  ", "  █  ", "     ", "  █  "],
  "?": [" ███ ", "█   █", "  ██ ", "     ", "  █  "],
  ".": [" ", "     ", "     ", "     ", "  █  "],
};

export const SL_LINES = [
  "      ====        ________                ___________    ",
  "  _D _|  |_______/        \\__I_I_____===__|_________|   ",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|    ",
  "   /     |  |   H  |  |     |   |         ||_| |_||    ",
  "  |      |  |   H  |__|__-------------------| [___] |   ",
  "  |______|__|___H__/__|_____/[][]~\\________|       |__ ",
  "   \\_/      \\_/       \\___/   \\___/                    ",
];

export const QUIZ_QUESTIONS = [
  { q: "What command lists directory contents?", a: ["ls"], pts: 1 },
  { q: "What command prints the working directory?", a: ["pwd"], pts: 1 },
  { q: "What command creates a new directory?", a: ["mkdir"], pts: 1 },
  { q: "What command moves or renames a file?", a: ["mv"], pts: 1 },
  { q: "What command copies a file?", a: ["cp"], pts: 1 },
  { q: "What command searches text patterns in files?", a: ["grep"], pts: 1 },
  { q: "What package manager does Arch Linux use?", a: ["pacman"], pts: 1 },
  { q: "What flag makes ls show hidden files?", a: ["-a", "-la", "-al", "--all"], pts: 1 },
  { q: "What command shows running processes?", a: ["ps", "top", "htop"], pts: 1 },
  { q: "What command shows disk usage?", a: ["df", "du"], pts: 1 },
  { q: "What command finds files by name?", a: ["find", "locate"], pts: 1 },
  { q: "What does 'chmod 777' give a file?", a: ["all permissions", "full permissions", "rwxrwxrwx", "read write execute"], pts: 2 },
  { q: "What signal does Ctrl+C send to a process?", a: ["sigint", "2", "interrupt"], pts: 2 },
  { q: "What does 'sudo' stand for?", a: ["superuser do", "switch user do", "substitute user do"], pts: 2 },
  { q: "What shell config file runs on fish startup?", a: ["config.fish", "~/.config/fish/config.fish"], pts: 2 },
];

export const THEMES = {
  frappe: { bg: "#303446", surface: "#414559", overlay: "#626880", fg: "#c6d0f5", muted: "#b5bfe2", blue: "#8caaee", pink: "#f2d5cf", red: "#ea999c", green: "#a6d189", mauve: "#ca9ee6", yellow: "#e5c890", peach: "#ef9f76", accent: "#684eff" },
  mocha: { bg: "#1e1e2e", surface: "#313244", overlay: "#6c7086", fg: "#cdd6f4", muted: "#bac2de", blue: "#89b4fa", pink: "#f5c2e7", red: "#f38ba8", green: "#a6e3a1", mauve: "#cba6f7", yellow: "#f9e2af", peach: "#fab387", accent: "#89b4fa" },
  latte: { bg: "#eff1f5", surface: "#ccd0da", overlay: "#9ca0b0", fg: "#4c4f69", muted: "#bcc0cc", blue: "#1e66f5", pink: "#ea76cb", red: "#d20f39", green: "#40a02b", mauve: "#8839ef", yellow: "#df8e1d", peach: "#fe640b", accent: "#1e66f5" },
  cyberpunk: { bg: "#0a0a0f", surface: "#0d1117", overlay: "#30363d", fg: "#00ff41", muted: "#58a6ff", blue: "#58a6ff", pink: "#ff79c6", red: "#ff5555", green: "#00ff41", mauve: "#bd93f9", yellow: "#f1fa8c", peach: "#ffb86c", accent: "#ff0080" },
};

export const ART = `
                 .o+
                \`ooo/
               \`+oooo:
              \`+oooooo:
              -+oooooo+:
            \`/:-:++oooo+:
           \`/++++/+++++++:
          \`/++++++++++++++:
         \`/+++ooooooooooooo/\`
        ./ooosssso++osssssso+\`
       .oossssso-\`  \`/ossssss+
      -osssssso.     :ssssssso.
     :osssssss/       osssso+++.
    /ossssssss/        +ssssooo/-
  \`/ossssso+/:- -:/+osssso+-
 \`+sso+:-\`       \`.-/+oso:
\`++:.           \`-/+/
.                \`/`;

export const QUOTES = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Any fool can write code a computer can understand. Good programmers write code humans can understand.", author: "Martin Fowler" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best code is no code at all.", author: "Jeff Atwood" },
  { text: "It works on my machine.", author: "Every developer, ever" },
  { text: "sudo make me a sandwich", author: "xkcd #149" },
  { text: "There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.", author: "Jeff Atwood" },
  { text: "A ship in port is safe, but that's not what ships are for.", author: "Grace Hopper" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
  { text: "rm -rf / # you only live once", author: "anonymous sysadmin" },
  { text: "Have you tried turning it off and on again?", author: "The IT Crowd" },
  { text: "One man's crappy software is another man's full-time job.", author: "Jessica Gaston" },
  { text: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" },
  { text: "In the beginning was the command line.", author: "Neal Stephenson" },
];

export const MAN_PAGES = {
  help: { synopsis: "help", desc: "List all available commands. Tip: use Tab for autocomplete." },
  whoami: { synopsis: "whoami", desc: "Print information about rev — background, current focus, and general vibe." },
  neofetch: { synopsis: "neofetch|fastfetch", desc: "Display system information alongside the Arch Linux logo. Classic." },
  ls: { synopsis: "ls [dir]", desc: "List directory contents. Blue = directory, default = file." },
  cat: { synopsis: "cat <file>", desc: "Print file contents. Works with .md files in the current directory." },
  cd: { synopsis: "cd [dir]", desc: "Change working directory. 'cd ~' returns home. 'cd ..' goes up one level." },
  pwd: { synopsis: "pwd", desc: "Print the absolute path of the current working directory." },
  contact: { synopsis: "contact", desc: "Display all contact info and social links." },
  projects: { synopsis: "projects", desc: "Display the synced GitHub project list (with fallback cache)." },
  repos: { synopsis: "repos", desc: "Alias of projects. Shows the same synced project list." },
  theme: { synopsis: "theme [name]", desc: "Switch color theme. Available: mocha, frappe, latte, cyberpunk." },
  date: { synopsis: "date", desc: "Print the current system date and time." },
  history: { synopsis: "history", desc: "Show command history for this session." },
  fortune: { synopsis: "fortune", desc: "Print a random inspirational or humorous dev quote." },
  ping: { synopsis: "ping <host>", desc: "Send ICMP ECHO_REQUEST packets. Results are definitely 100% real." },
  curl: { synopsis: "curl [opts] <url>", desc: "Transfer data from a URL with an animated progress bar." },
  man: { synopsis: "man <command>", desc: "Display the manual page for a command. You're reading one right now." },
  cowsay: { synopsis: "cowsay [message]", desc: "Have a cow say something. Essential Unix utility." },
  banner: { synopsis: "banner <text>", desc: "Print large ASCII art text. Max 8 characters." },
  hack: { synopsis: "hack [target]", desc: "Initiate a highly realistic and completely legal hacking sequence." },
  quiz: { synopsis: "quiz", desc: "Test your Linux/terminal knowledge. 5 random questions. How well do you know your shell?" },
  share: { synopsis: "share <command>", desc: "Generate a shareable URL that auto-runs a command when visited." },
  ssh: { synopsis: "ssh [user@host]", desc: "Open an SSH connection to a remote server. Results may vary." },
  pipes: { synopsis: "pipes", desc: "Launch the classic pipes screensaver. Click or press any key to exit." },
  matrix: { synopsis: "matrix", desc: "You already know. Press any key or click to exit." },
  clear: { synopsis: "clear | Ctrl+L", desc: "Clear the terminal screen." },
  echo: { synopsis: "echo <text>", desc: "Print text to the terminal." },
  sudo: { synopsis: "sudo <command>", desc: "Execute as superuser. Strongly inadvisable." },
};
