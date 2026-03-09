export function createAudioController() {
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) {}
    }
  }

  function playClick() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const len = Math.floor(audioCtx.sampleRate * 0.012);
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.1;
      src.connect(gain);
      gain.connect(audioCtx.destination);
      src.start();
    } catch (_) {}
  }

  function initSoundToggle() {
    document.getElementById("sound-toggle").addEventListener("click", () => {
      initAudio();
      soundEnabled = !soundEnabled;
      const btn = document.getElementById("sound-toggle");
      btn.textContent = soundEnabled ? "🔊" : "🔇";
      btn.title = soundEnabled ? "typing sounds ON (click to disable)" : "toggle typing sounds";
    });
  }

  return { playClick, initSoundToggle };
}

export function createEasterEggController({ THEMES, make, scroll }) {
  const easterSet = new Set();
  const easterKeys = ["neofetch", "matrix", "hack"];
  let easterDone = false;

  function unlockCyberpunk() {
    const t = THEMES.cyberpunk;
    Object.keys(t).forEach((k) => document.documentElement.style.setProperty(`--${k}`, t[k]));
    const out = document.getElementById("output");
    out.appendChild(
      make(`<pre class="mt" style="color:#00ff41;line-height:1.3;font-size:.82rem">
╔══════════════════════════════════════════╗
║  ⚡  R O O T   M O D E   U N L O C K E D  ⚡  ║
║                                          ║
║  you ran: neofetch · matrix · hack       ║
║  cyberpunk theme activated               ║
║  welcome to the inner circle.            ║
║                                          ║
║  type  theme frappe  to go back          ║
╚══════════════════════════════════════════╝</pre>`)
    );
    scroll();
  }

  function checkEaster(cmd) {
    if (easterDone) return;
    if (easterKeys.includes(cmd)) easterSet.add(cmd);
    if (easterKeys.every((k) => easterSet.has(k))) {
      easterDone = true;
      setTimeout(unlockCyberpunk, 600);
    }
  }

  return { checkEaster };
}

export function createInactivityController({ onIdle, isOverlayActive, inactivityMs = 60000 }) {
  let inactivityTimer = null;

  function resetInactivity() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (!isOverlayActive()) onIdle();
    }, inactivityMs);
  }

  return { resetInactivity };
}

export function createVisualEffects({ SL_LINES }) {
  let pipesAF = null;
  let matrixAF = null;
  let onOverlayExit = () => {};

  function setOnOverlayExit(fn) {
    onOverlayExit = fn;
  }

  function startPipes(auto = false) {
    const canvas = document.getElementById("pipes-canvas");
    const hint = document.getElementById("pipes-exit-hint");
    canvas.style.display = "block";
    hint.style.display = auto ? "none" : "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ["--blue", "--pink", "--green", "--mauve", "--yellow", "--peach"].map((v) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim()
    );

    const CELL = 20;
    const cols = Math.floor(canvas.width / CELL);
    const rows = Math.floor(canvas.height / CELL);
    const DIRS = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const CORNERS = { "0-1": "┓", "0-3": "┛", "1-0": "┗", "1-2": "┛", "2-1": "┗", "2-3": "┏", "3-0": "┏", "3-2": "┓" };

    function pchar(pd, nd) {
      if (pd === nd) return pd === 0 || pd === 2 ? "━" : "┃";
      return CORNERS[`${pd}-${nd}`] || "+";
    }

    const pipes = Array.from({ length: 7 }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      dir: Math.floor(Math.random() * 4),
      color: colors[Math.floor(Math.random() * colors.length)],
      steps: 0,
    }));

    ctx.font = `${CELL}px IBM Plex Mono`;
    ctx.textBaseline = "top";

    function frame() {
      for (const pipe of pipes) {
        const pd = pipe.dir;
        if (pipe.steps > 3 && Math.random() < 0.15) pipe.dir = (pipe.dir + (Math.random() < 0.5 ? 1 : -1) + 4) % 4;
        ctx.fillStyle = pipe.color;
        ctx.fillText(pchar(pd, pipe.dir), pipe.x * CELL, pipe.y * CELL);
        const [dx, dy] = DIRS[pipe.dir];
        pipe.x = (pipe.x + dx + cols) % cols;
        pipe.y = (pipe.y + dy + rows) % rows;
        pipe.steps++;
        if (pipe.steps > 80 + Math.random() * 60) {
          pipe.x = Math.floor(Math.random() * cols);
          pipe.y = Math.floor(Math.random() * rows);
          pipe.dir = Math.floor(Math.random() * 4);
          pipe.color = colors[Math.floor(Math.random() * colors.length)];
          pipe.steps = 0;
        }
      }
      pipesAF = requestAnimationFrame(frame);
    }

    frame();

    function exitPipes() {
      cancelAnimationFrame(pipesAF);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
      hint.style.display = "none";
      onOverlayExit();
      document.getElementById("cmd-input").focus();
    }

    setTimeout(() => {
      canvas.addEventListener("click", exitPipes, { once: true });
      document.addEventListener("keyup", exitPipes, { once: true });
    }, 500);
  }

  function startMatrix() {
    const canvas = document.getElementById("matrix-canvas");
    const hint = document.getElementById("matrix-exit-hint");
    canvas.style.display = "block";
    hint.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/|{}[]";

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px IBM Plex Mono";
      for (let i = 0; i < drops.length; i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = drops[i] * 16 < 60 ? "#ffffff" : "#00ff41";
        ctx.fillText(c, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      matrixAF = requestAnimationFrame(draw);
    }

    draw();

    function exitMatrix() {
      cancelAnimationFrame(matrixAF);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
      hint.style.display = "none";
      document.getElementById("cmd-input").focus();
    }

    setTimeout(() => {
      canvas.addEventListener("click", exitMatrix, { once: true });
      document.addEventListener("keyup", exitMatrix, { once: true });
    }, 800);
  }

  function startSL() {
    const stage = document.getElementById("sl-stage");
    const train = document.getElementById("sl-train");
    train.textContent = SL_LINES.join("\n");
    stage.style.display = "block";

    let pos = window.innerWidth + 60;
    function anim() {
      pos -= 6;
      train.style.left = `${pos}px`;
      if (pos < -720) {
        stage.style.display = "none";
        return;
      }
      requestAnimationFrame(anim);
    }

    anim();
  }

  function isOverlayActive() {
    return (
      document.getElementById("pipes-canvas").style.display !== "none" ||
      document.getElementById("matrix-canvas").style.display !== "none"
    );
  }

  return { startPipes, startMatrix, startSL, isOverlayActive, setOnOverlayExit };
}
