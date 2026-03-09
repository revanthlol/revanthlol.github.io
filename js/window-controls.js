export function initWindowControls() {
  const win = document.getElementById("win");
  const titlebar = document.getElementById("titlebar");

  let dragging = false;
  let dragSX = 0;
  let dragSY = 0;
  let winSL = 0;
  let winST = 0;

  let isMin = false;
  let isMax = false;
  let savedStyle = {};

  titlebar.addEventListener("mousedown", (e) => {
    if (["dot-r", "dot-y", "dot-g", "sound-toggle"].includes(e.target.id)) return;
    dragging = true;
    const r = win.getBoundingClientRect();
    winSL = r.left;
    winST = r.top;
    dragSX = e.clientX;
    dragSY = e.clientY;
    win.style.left = `${winSL}px`;
    win.style.top = `${winST}px`;
    win.style.transform = "none";
    win.classList.add("dragged");
    win.classList.remove("maximised");
    isMax = false;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    win.style.left = `${winSL + e.clientX - dragSX}px`;
    win.style.top = `${winST + e.clientY - dragSY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  document.getElementById("dot-r").addEventListener("click", () => {
    win.classList.add("closing");
    setTimeout(() => {
      win.innerHTML = `<div style="padding:3rem;text-align:center;color:var(--red)"><div style="font-size:1.1rem">nice try.</div><div style="color:var(--overlay);font-size:.85rem;margin-top:.5rem">this terminal cannot be killed.</div><div style="color:var(--overlay);font-size:.75rem;margin-top:.25rem">( refresh to restart )</div></div>`;
      win.classList.remove("closing");
    }, 250);
  });

  document.getElementById("dot-y").addEventListener("click", () => {
    isMin = !isMin;
    win.classList.toggle("minimised", isMin);
    document.getElementById("footer").classList.toggle("hidden", isMin);
  });

  document.getElementById("dot-g").addEventListener("click", () => {
    if (!isMax) {
      savedStyle = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height,
        transform: win.style.transform,
      };
      win.classList.add("maximised");
      isMax = true;
    } else {
      win.classList.remove("maximised");
      Object.assign(win.style, savedStyle);
      isMax = false;
    }
  });
}
