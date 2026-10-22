// Interactive Halftone Wordmark with Directional Prism Ray Caustics
// Adapts dynamically to site theme (monotone resting state: deep black in light mode, pure white in dark mode)
// Cursor repulsion & click shockwave disperse into spectral prism wavelengths.

import { C as React, o as init } from "./framerusercontent.com/8d44bc9696caad172d1da6d5.mjs";
init();

// Liquid Silver Chrome Warp:
// Polished liquid mercury reflection with bright specular white glints
// and ethereal cool pearlescent sheen (ice blue, silvery lilac, and pale champagne)
function getLiquidChromeRgb(phase, specular, isDark) {
  phase = ((phase % 1) + 1) % 1;
  let baseR, baseG, baseB;
  if (phase < 0.28) {
    // 0.0 -> 0.28: Icy Steel Blue (cool liquid reflection)
    const t = phase / 0.28;
    if (isDark) {
      baseR = 165 + (205 - 165) * t;
      baseG = 205 + (228 - 205) * t;
      baseB = 242 + (252 - 242) * t;
    } else {
      baseR = 55 + (90 - 55) * t;
      baseG = 105 + (132 - 105) * t;
      baseB = 160 + (182 - 160) * t;
    }
  } else if (phase < 0.62) {
    // 0.28 -> 0.62: Silvery Lilac / Metallic Violet Sheen
    const t = (phase - 0.28) / 0.34;
    if (isDark) {
      baseR = 205 + (228 - 205) * t;
      baseG = 228 + (198 - 228) * t;
      baseB = 252 + (246 - 252) * t;
    } else {
      baseR = 90 + (130 - 90) * t;
      baseG = 132 + (102 - 132) * t;
      baseB = 182 + (162 - 182) * t;
    }
  } else if (phase < 0.88) {
    // 0.62 -> 0.88: Pale Champagne Pearl / Liquid Titanium
    const t = (phase - 0.62) / 0.26;
    if (isDark) {
      baseR = 228 + (252 - 228) * t;
      baseG = 198 + (244 - 198) * t;
      baseB = 246 + (222 - 246) * t;
    } else {
      baseR = 130 + (150 - 130) * t;
      baseG = 102 + (136 - 102) * t;
      baseB = 162 + (112 - 162) * t;
    }
  } else {
    // 0.88 -> 1.0: Polished Platinum wrap
    const t = (phase - 0.88) / 0.12;
    if (isDark) {
      baseR = 252 + (165 - 252) * t;
      baseG = 244 + (205 - 244) * t;
      baseB = 222 + (242 - 222) * t;
    } else {
      baseR = 150 + (55 - 150) * t;
      baseG = 136 + (105 - 136) * t;
      baseB = 112 + (160 - 112) * t;
    }
  }

  // Specular reflection glint (high-contrast liquid chrome flare)
  if (specular > 0.05) {
    const s = Math.min(1, Math.pow(specular, 2.2));
    if (isDark) {
      baseR = baseR + (255 - baseR) * s;
      baseG = baseG + (255 - baseG) * s;
      baseB = baseB + (255 - baseB) * s;
    } else {
      baseR = baseR + (235 - baseR) * s;
      baseG = baseG + (242 - baseG) * s;
      baseB = baseB + (252 - baseB) * s;
    }
  }

  return [Math.round(baseR), Math.round(baseG), Math.round(baseB)];
}

function calculateDotRadius(density, gap) {
  const clamped = density < 0 ? 0 : density > 1 ? 1 : density;
  return Math.sqrt(clamped) * gap * 0.58;
}

function physicsStep(curX, curY, vx, vy, origX, origY, ptrX, ptrY, radius) {
  const dx = curX - ptrX;
  const dy = curY - ptrY;
  const distSq = dx * dx + dy * dy;
  if (radius > 0 && distSq < radius * radius) {
    const dist = Math.sqrt(distSq) + 0.001;
    const push = (1 - dist / radius) * 2.8;
    vx += (dx / dist) * push;
    vy += (dy / dist) * push;
  }
  // Restorative spring force toward grid origin (k = 0.05) + velocity damping (0.84)
  vx = (vx + (origX - curX) * 0.05) * 0.84;
  vy = (vy + (origY - curY) * 0.05) * 0.84;
  return [curX + vx, curY + vy, vx, vy];
}

export function attachHalftoneCanvas(rootEl, canvasEl, options = {}) {
  if (canvasEl._halftoneCleanup) {
    try { canvasEl._halftoneCleanup(); } catch (_) {}
  }

  const {
    text = "Revanth",
    fontFamily = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight = 600,
    dotGap = 5.5,
    radius = 90,
    grain = 0.35,
    interactive = true
  } = options;

  const ctx = canvasEl.getContext("2d");
  if (!ctx) return () => {};

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let heightPx = 0;
  let dpr = 1;
  let pointerX = -1e5;
  let pointerY = -1e5;
  let animFrame = 0;
  let isIntersecting = true;
  let needsDraw = true;
  let shockwave = { x: 0, y: 0, t: -1 };
  let particles = new Float32Array(0);
  let particleCount = 0;
  let noiseCanvas = null;

  // Theme detection
  const getIsDark = () => document.documentElement.dataset.theme === "dark";
  let isDark = getIsDark();

  const layout = () => {
    const rect = rootEl.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    heightPx = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = Math.round(width * dpr);
    canvasEl.height = Math.round(heightPx * dpr);

    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = heightPx;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    // Measure font size to cleanly fit the container width and height
    const baseFont = `${fontWeight} 100px ${fontFamily}`;
    offCtx.font = baseFont;
    try { offCtx.letterSpacing = "-0.04em"; } catch (_) {}
    const displayText = text || " ";
    const baseMetrics = offCtx.measureText(displayText);
    const measuredWidth100 = baseMetrics.width || 100;
    const ascent100 = baseMetrics.actualBoundingBoxAscent || 75;
    const descent100 = baseMetrics.actualBoundingBoxDescent || 20;
    const totalHeight100 = Math.max(40, ascent100 + descent100);

    // Scale to fill width edge-to-edge, matching the original footer SVG wordmark
    const scaleX = (width * 0.995) / measuredWidth100;
    const scaleY = (heightPx * 0.95) / totalHeight100;
    const scale = Math.min(scaleX, scaleY);
    const targetFontSize = Math.max(20, Math.round(scale * 100));

    offCtx.font = `${fontWeight} ${targetFontSize}px ${fontFamily}`;
    try { offCtx.letterSpacing = "-0.04em"; } catch (_) {}
    const finalMetrics = offCtx.measureText(displayText);
    const ascent = finalMetrics.actualBoundingBoxAscent || (targetFontSize * 0.75);
    const descent = finalMetrics.actualBoundingBoxDescent || (targetFontSize * 0.2);
    const baselineY = Math.round((heightPx - (ascent + descent)) / 2 + ascent);

    offCtx.fillStyle = "#000000";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "alphabetic";
    offCtx.fillText(displayText, width / 2, baselineY);

    const imgData = offCtx.getImageData(0, 0, width, heightPx).data;
    const gap = Math.max(3.5, dotGap);
    const cols = Math.ceil(width / gap);
    const rows = Math.ceil(heightPx / gap);
    const particleData = [];

    // 3x3 supersampling for crisp, anti-aliased dot radius
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let sumAlpha = 0;
        for (let sy = 0; sy < 3; sy++) {
          for (let sx = 0; sx < 3; sx++) {
            const sampleX = Math.min(width - 1, Math.floor(c * gap + ((sx + 0.5) * gap) / 3));
            const sampleY = Math.min(heightPx - 1, Math.floor(r * gap + ((sy + 0.5) * gap) / 3));
            sumAlpha += imgData[(sampleY * width + sampleX) * 4 + 3];
          }
        }
        const density = sumAlpha / (9 * 255);
        if (density < 0.05) continue;
        const dotX = c * gap + gap / 2;
        const dotY = r * gap + gap / 2;
        particleData.push(dotX, dotY, 0, 0, dotX, dotY, calculateDotRadius(density, gap));
      }
    }

    particles = new Float32Array(particleData);
    particleCount = particleData.length / 7;

    // Create film-grain noise texture
    noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    const noiseCtx = noiseCanvas.getContext("2d");
    if (noiseCtx) {
      const noiseImg = noiseCtx.createImageData(256, 256);
      for (let i = 0; i < noiseImg.data.length; i += 4) {
        const val = Math.random() * 255;
        noiseImg.data[i] = val;
        noiseImg.data[i + 1] = val;
        noiseImg.data[i + 2] = val;
        noiseImg.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
      }
      noiseCtx.putImageData(noiseImg, 0, 0);
    }
    needsDraw = true;
  };

  const draw = (now) => {
    isDark = getIsDark();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, heightPx);

    const restingInk = isDark ? [255, 255, 255] : [0, 0, 0];
    const restingFill = isDark ? "#ffffff" : "#000000";

    const interactRadius = interactive && !prefersReducedMotion ? Math.max(0, radius) : 0;
    const shockElapsed = shockwave.t < 0 ? 1e9 : now - shockwave.t;
    const waveRadius = shockElapsed * 0.95;

    let moving = false;

    for (let i = 0; i < particleCount; i++) {
      const offset = i * 7;
      let curX = particles[offset];
      let curY = particles[offset + 1];
      let vx = particles[offset + 2];
      let vy = particles[offset + 3];
      const origX = particles[offset + 4];
      const origY = particles[offset + 5];
      const dotRadius = particles[offset + 6];

      let waveInfluence = 0;
      let waveHue = 0;

      if (!prefersReducedMotion) {
        if (shockElapsed < 900) {
          const dx = origX - shockwave.x;
          const dy = origY - shockwave.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const waveDiff = Math.abs(dist - waveRadius);
          const waveBand = 1 - Math.min(1, waveDiff / 32);
          if (waveBand > 0) {
            waveInfluence = waveBand * Math.max(0, 1 - shockElapsed / 900);
            const push = waveInfluence * 3.4;
            vx += (dx / dist) * push;
            vy += (dy / dist) * push;
            // Radial spectral dispersion along the shockwave front
            waveHue = ((dist * 1.8 - shockElapsed * 0.5) % 360 + 360) % 360;
          }
        }

        const stepResult = physicsStep(
          curX,
          curY,
          vx,
          vy,
          origX,
          origY,
          pointerX,
          pointerY,
          interactRadius
        );
        curX = stepResult[0];
        curY = stepResult[1];
        vx = stepResult[2];
        vy = stepResult[3];

        if (
          Math.abs(vx) + Math.abs(vy) > 0.02 ||
          Math.abs(curX - origX) + Math.abs(curY - origY) > 0.05
        ) {
          moving = true;
        } else {
          curX = origX;
          curY = origY;
          vx = 0;
          vy = 0;
        }

        particles[offset] = curX;
        particles[offset + 1] = curY;
        particles[offset + 2] = vx;
        particles[offset + 3] = vy;
      }

      // Liquid Silver Chrome Warp:
      // Specular glint from reflection vector + iridescent liquid chrome metallic sheen
      const dispX = curX - origX;
      const dispY = curY - origY;
      const dispDist = Math.hypot(dispX, dispY);
      const warmth = Math.min(1, dispDist / 18);
      const totalIntensity = Math.min(1, warmth * 1.5 + waveInfluence * 1.8);

      if (totalIntensity > 0.02) {
        // Dispersed ray angle from pointer push or displacement origin
        const ptrDx = curX - pointerX;
        const ptrDy = curY - pointerY;
        const angle = Math.atan2(ptrDy, ptrDx);
        const curvaturePhase = (Math.sin(angle * 1.5 + dispDist * 0.22) * 0.5 + 0.5);
        const distFromShock = Math.hypot(origX - shockwave.x, origY - shockwave.y);
        const shockPhase = (Math.sin(distFromShock * 0.14 - shockElapsed * 0.012) * 0.5 + 0.5);
        const chromePhase = waveInfluence > 0.15 ? shockPhase : curvaturePhase;

        // Specular highlight: shiny glint facing top-left reflection angle (~45 deg)
        const lightAngle = 0.7853; // ~45 deg
        const alignment = Math.max(0, Math.cos(angle - lightAngle));
        const specular = Math.pow(alignment, 3.5) * Math.min(1, totalIntensity * 1.4);

        const chromeRgb = getLiquidChromeRgb(chromePhase, specular, isDark);
        const r = Math.round(restingInk[0] + (chromeRgb[0] - restingInk[0]) * totalIntensity);
        const g = Math.round(restingInk[1] + (chromeRgb[1] - restingInk[1]) * totalIntensity);
        const b = Math.round(restingInk[2] + (chromeRgb[2] - restingInk[2]) * totalIntensity);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
      } else {
        ctx.fillStyle = restingFill;
      }

      ctx.beginPath();
      ctx.arc(curX, curY, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (noiseCanvas && grain > 0) {
      ctx.globalAlpha = Math.min(1, grain) * 0.08;
      ctx.globalCompositeOperation = isDark ? "screen" : "multiply";
      const pattern = ctx.createPattern(noiseCanvas, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, heightPx);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    needsDraw = moving || shockElapsed < 900 || pointerX > -1e4;
  };

  const loop = (now) => {
    animFrame = 0;
    if (isIntersecting) {
      draw(now);
      if (needsDraw) {
        animFrame = requestAnimationFrame(loop);
      }
    }
  };

  const wake = () => {
    needsDraw = true;
    if (!animFrame && isIntersecting) {
      animFrame = requestAnimationFrame(loop);
    }
  };

  const toLocal = (e) => {
    const rect = canvasEl.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const onMove = (e) => {
    if (!interactive) return;
    const [lx, ly] = toLocal(e);
    pointerX = lx;
    pointerY = ly;
    wake();
  };

  const onLeave = () => {
    pointerX = -1e5;
    pointerY = -1e5;
    wake();
  };

  const onDown = (e) => {
    if (!interactive || prefersReducedMotion) return;
    const [lx, ly] = toLocal(e);
    shockwave = { x: lx, y: ly, t: performance.now() };
    wake();
  };

  layout();
  draw(performance.now());
  wake();

  rootEl.addEventListener("pointermove", onMove);
  rootEl.addEventListener("pointerleave", onLeave);
  rootEl.addEventListener("pointerdown", onDown);

  const ro = new ResizeObserver(() => {
    layout();
    wake();
  });
  ro.observe(rootEl);

  const io = new IntersectionObserver((entries) => {
    isIntersecting = entries[0] ? entries[0].isIntersecting : true;
    if (isIntersecting) wake();
  });
  io.observe(rootEl);

  // Re-render when theme switches
  const onThemeChange = () => {
    isDark = getIsDark();
    wake();
  };
  document.addEventListener("themechange", onThemeChange);
  const themeObserver = new MutationObserver(onThemeChange);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let alive = true;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (alive) {
        layout();
        wake();
      }
    });
  }

  const cleanup = () => {
    alive = false;
    canvasEl._halftoneCleanup = null;
    cancelAnimationFrame(animFrame);
    ro.disconnect();
    io.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("themechange", onThemeChange);
    rootEl.removeEventListener("pointermove", onMove);
    rootEl.removeEventListener("pointerleave", onLeave);
    rootEl.removeEventListener("pointerdown", onDown);
  };
  canvasEl._halftoneCleanup = cleanup;
  return cleanup;
}

export function initAllHalftoneWordmarks() {
  document.querySelectorAll(".interactive-halftone-wordmark").forEach((root) => {
    const canvas = root.querySelector("canvas");
    if (canvas && !canvas._halftoneCleanup) {
      attachHalftoneCanvas(root, canvas);
    }
  });
}

export function InteractiveHalftoneWordmark(props = {}) {
  const rootRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const {
    text = "Revanth",
    className = "",
    style = {},
    ...rest
  } = props;

  React.useEffect(() => {
    if (!rootRef.current || !canvasRef.current) return;
    const cleanup = attachHalftoneCanvas(rootRef.current, canvasRef.current, {
      text,
      ...rest
    });
    return cleanup;
  }, [text]);

  return React.createElement(
    "div",
    {
      ref: rootRef,
      className: `interactive-halftone-wordmark framer-enlusb ${className}`.trim(),
      style: {
        position: "relative",
        width: "100%",
        height: "clamp(98px, calc(100vw * 0.272), 220px)",
        aspectRatio: "807.7 / 220",
        overflow: "hidden",
        cursor: "crosshair",
        userSelect: "none",
        ...style
      },
      role: "img",
      "aria-label": text
    },
    React.createElement("canvas", {
      ref: canvasRef,
      "aria-hidden": "true",
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block"
      }
    }),
    React.createElement(
      "span",
      {
        className: "rev-sr-only"
      },
      text
    )
  );
}

export default InteractiveHalftoneWordmark;
