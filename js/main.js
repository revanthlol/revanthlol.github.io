import { DATA, BANNER_FONT, SL_LINES, QUIZ_QUESTIONS, THEMES, ART, QUOTES, MAN_PAGES } from "./constants.js";
import { createCommandRegistry, createFilesystem, esc, make, printer, scroll } from "./core.js";
import { createAudioController, createEasterEggController, createInactivityController, createVisualEffects } from "./effects.js";
import { initCommands } from "./commands.js";
import { initWindowControls } from "./window-controls.js";

function initApp() {
  const { reg, allCommands, getCommand } = createCommandRegistry();
  const { FS, getCwd, setCwd, resolvePath, updatePrompt } = createFilesystem(DATA);

  const cmdHistory = [];
  let histIdx = 0;

  const audio = createAudioController();
  audio.initSoundToggle();

  const effects = createVisualEffects({ SL_LINES });
  const inactivity = createInactivityController({
    onIdle: () => effects.startPipes(true),
    isOverlayActive: effects.isOverlayActive,
  });
  effects.setOnOverlayExit(inactivity.resetInactivity);

  const easter = createEasterEggController({ THEMES, make, scroll });

  const commands = initCommands({
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
    startPipes: effects.startPipes,
    startMatrix: effects.startMatrix,
    startSL: effects.startSL,
    cmdHistory,
    resetInactivity: inactivity.resetInactivity,
  });

  initWindowControls();

  async function run(raw) {
    const out = document.getElementById("output");
    const cmdRaw = raw.trim();
    const promptUser = document.getElementById("prompt-user").textContent;
    const promptPath = document.getElementById("prompt-path").textContent;

    out.insertAdjacentHTML(
      "beforeend",
      `<div class="line mt"><span class="pu">${esc(promptUser)}</span><span class="pp">${esc(promptPath)}</span><span class="pd">&nbsp;$&nbsp;</span><span class="pc">${esc(cmdRaw)}</span></div>`
    );

    if (!cmdRaw) {
      scroll();
      return;
    }

    if (cmdHistory[cmdHistory.length - 1] !== cmdRaw) cmdHistory.push(cmdRaw);
    histIdx = cmdHistory.length;

    inactivity.resetInactivity();

    const parts = cmdRaw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === "sl") {
      effects.startSL();
      out.appendChild(make(`<div class="line mt c-over">choo choo! (did you mean <span class="c-blue">ls</span>?)</div>`));
      scroll();
      return;
    }

    easter.checkEaster(cmd);

    const fn = getCommand(cmd);
    if (fn) {
      const res = await fn(args);
      if (res) out.appendChild(res);
    } else {
      out.appendChild(make(`<div class="line mt"><span class="c-red">fish: Unknown command:</span> <span class="c-over">${esc(cmd)}</span> — try <span class="c-pink">help</span></div>`));
    }

    scroll();
  }

  const input = document.getElementById("cmd-input");
  input.placeholder = "try: help  |  projects  |  contact";
  document.getElementById("tb").addEventListener("click", () => input.focus());
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  let touchY0 = 0;
  let touchX0 = 0;

  document
    .getElementById("tb")
    .addEventListener(
      "touchstart",
      (e) => {
        touchY0 = e.touches[0].clientY;
        touchX0 = e.touches[0].clientX;
        input.focus();
      },
      { passive: true }
    );

  document
    .getElementById("tb")
    .addEventListener(
      "touchend",
      (e) => {
        const dy = touchY0 - e.changedTouches[0].clientY;
        const dx = Math.abs(touchX0 - e.changedTouches[0].clientX);
        if (Math.abs(dy) > 35 && Math.abs(dy) > dx) {
          if (dy < 0) {
            if (histIdx < cmdHistory.length - 1) {
              histIdx++;
              input.value = cmdHistory[histIdx];
            } else {
              histIdx = cmdHistory.length;
              input.value = "";
            }
          } else if (histIdx > 0) {
            histIdx--;
            input.value = cmdHistory[histIdx];
          }
        }
      },
      { passive: true }
    );

  input.addEventListener("keydown", (e) => {
    if (!["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) audio.playClick();
    inactivity.resetInactivity();

    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      if (commands.isQuizActive()) commands.handleQuizInput(val);
      else run(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = cmdHistory[histIdx];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        input.value = cmdHistory[histIdx];
      } else {
        histIdx = cmdHistory.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const val = input.value;
      const parts = val.split(/\s+/);

      if (parts.length <= 1 && !val.includes(" ")) {
        const matches = allCommands().filter((k) => k.startsWith(val.toLowerCase()));
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          const out = document.getElementById("output");
          out.appendChild(make(`<div class="ac-hint mt">${matches.map((m) => `<span>${m}</span>`).join("")}</div>`));
          scroll();
        }
      } else {
        const cmd = parts[0].toLowerCase();
        const partial = parts[parts.length - 1];
        const completions = commands.getArgCompletions(cmd, partial);
        if (completions.length === 1) {
          parts[parts.length - 1] = completions[0];
          input.value = parts.join(" ");
        } else if (completions.length > 1) {
          const out = document.getElementById("output");
          out.appendChild(make(`<div class="ac-hint mt">${completions.map((m) => `<span>${m}</span>`).join("")}</div>`));
          scroll();
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      document.getElementById("output").innerHTML = "";
    }
  });

  const visits = parseInt(localStorage.getItem("rv_visits") || "0", 10) + 1;
  localStorage.setItem("rv_visits", String(visits));
  const visitLabel = visits === 1 ? "first visit!" : `boot #${visits}`;

  document.getElementById("output").appendChild(
    make(
      `
<div class="line"><span class="c-blue bold">rev@portfolio</span> <span class="c-over">~</span>  <span class="visit-badge">${visitLabel}</span></div>
<div class="line c-over">quick start: <span class="c-pink">help</span> · <span class="c-mauve">projects</span> · <span class="c-yellow">contact</span></div>
<div class="line c-over">workflow: Tab autocomplete · ↑↓ history · swipe up/down on mobile history</div>
<div class="line c-over" style="font-size:.78rem">tip: type <span class="c-blue">/</span> anywhere to focus the prompt</div>
`,
      false
    )
  );

  const urlCmd = new URLSearchParams(location.search).get("cmd");
  if (urlCmd) setTimeout(() => run(urlCmd), 400);

  input.focus();
  inactivity.resetInactivity();
}

initApp();
