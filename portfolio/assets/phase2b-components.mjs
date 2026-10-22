// Bridge to the export's React instance. Editable content lives in components/content.mjs.
import { C as React, o as init } from "./framerusercontent.com/8d44bc9696caad172d1da6d5.mjs";
import { trees } from "./components/content.mjs";
import { Marquee } from "./marquee/marquee.js";
import { InteractiveHalftoneWordmark } from "./halftone-wordmark.js";
init();
function element(node, ref) {
  if (node === null || typeof node === "string") return node;
  const [tag, props, children] = node;
  return React.createElement(tag, ref ? { ...props, ref } : props, ...children.map(child => element(child)));
}
export function Static({ kind }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (kind !== "tech" || !ref.current) return;
    const root = ref.current;
    let instance;
    let disposed = false;
    const button = root.querySelector("button");
    const toggle = () => {
      instance?.toggle();
      const paused = instance?.paused ?? false;
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "Play marquee" : "Pause marquee");
    };
    document.fonts.ready.then(() => {
      if (disposed) return;
      instance = new Marquee(root.querySelector(".marquee"));
      button.addEventListener("click", toggle);
    });
    return () => {
      disposed = true;
      button.removeEventListener("click", toggle);
      instance?.destroy();
    };
  }, [kind]);
  if (kind === "footer-wordmark") {
    return React.createElement(InteractiveHalftoneWordmark, { text: "Revanth" });
  }
  return element(trees[kind], kind === "tech" ? ref : null);
}
