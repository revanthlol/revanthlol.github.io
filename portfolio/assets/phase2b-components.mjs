// Bridge to the export's React instance. Editable content lives in components/content.mjs.
import { C as React, o as init } from "./framerusercontent.com/8d44bc9696caad172d1da6d5.mjs";
import { trees } from "./components/content.mjs";
import { Marquee } from "./marquee/marquee.js";
import { InteractiveHalftoneWordmark } from "./halftone-wordmark.js";
import ContributionSkyline from "./contribution-skyline.js";
import { REVANTH_CONTRIBUTIONS } from "./contributions-data.js";

init();

export function SkylineSection() {
  const [data, setData] = React.useState(REVANTH_CONTRIBUTIONS);
  React.useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/revanthlol")
      .then(res => res.json())
      .then(json => {
        if (json && Array.isArray(json.contributions) && json.contributions.length > 0) {
          const sorted = json.contributions.slice().sort((a, b) => a.date.localeCompare(b.date));
          setData(sorted);
        }
      })
      .catch(() => {});
  }, []);

  return React.createElement(
    "section",
    { className: "rev-skyline-section-wrap", id: "activity", "aria-label": "GitHub Contributions" },
    React.createElement(ContributionSkyline, {
      data,
      palette: "github",
      scrollDriven: true,
      title: React.createElement(
        React.Fragment,
        null,
        React.createElement("span", { className: "font-semibold tabular-nums" }, "803"),
        " contributions in the last year"
      ),
      className: "rev-skyline-card"
    })
  );
}

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

  if (kind === "skyline") {
    return React.createElement(SkylineSection);
  }

  if (kind === "footer-wordmark") {
    return React.createElement(InteractiveHalftoneWordmark, { text: "Revanth" });
  }
  return element(trees[kind], kind === "tech" ? ref : null);
}
