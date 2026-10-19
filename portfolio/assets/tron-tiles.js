/*!
 * <tron-tiles>: interactive glass tile grid background (canvas 2D, no WebGL).
 *
 * Standalone port of the "Tron Tiles" Framer component by Quzmo Studios
 * (https://tron-tiles.framer.website/). The original is a commercial product;
 * check its license before using this in production or redistributing it.
 * Default config below equals the values used on the published demo page.
 *
 * Usage: load this file with a plain script tag (src="tron-tiles.js"), then:
 *   <div style="position:relative;height:100vh">
 *     <tron-tiles></tron-tiles>
 *   </div>
 *
 * The element fills its parent (width/height 100%), so give the parent a size.
 *
 * Override any value, either way (deep-merged over the defaults):
 *   el.config = { grid: { cellSize: 60 }, tint: { enabled: true } };
 *   <tron-tiles config='{"wave":{"speed":900}}'></tron-tiles>
 *
 * API:
 *   el.config                 get/set the merged config
 *   el.pulse(x, y, strength)  trigger a click pulse at element-local px (strength 0..1)
 *
 * Behaviour notes:
 *   - Clicks anywhere in the window that land inside the element's box fire a
 *     pulse, so overlaid content does not swallow them.
 *   - prefers-reduced-motion: reduce renders the static grid only. Add the
 *     attribute `ignore-reduced-motion` to opt out.
 */
(() => {
  'use strict';
  if (typeof window === 'undefined' || customElements.get('tron-tiles')) return;

  /* ------------------------------------------------------------------ */
  /* Defaults (values taken from the live page instance)                 */
  /* ------------------------------------------------------------------ */
  const DEFAULTS = {
    cursor: 'pointer',
    grid: {
      cellSize: 80, gap: 10, cornerRadius: 19,
      lineWidth: 0.5, lineColor: 'rgb(255, 255, 255)', lineOpacity: 1,
      majorEvery: 0, majorLineWidth: 2, majorLineColor: 'rgb(0, 89, 255)', majorLineOpacity: 0.5,
    },
    tile: {
      faceColor: 'rgba(255, 255, 255, 0.67)', faceOpacity: 1,
      faceLight: 'rgb(255, 255, 255)', faceShade: 'rgb(213, 218, 226)', faceGrad: 0.5,
      sheen: 0.4,
      highlightColor: 'rgb(255, 255, 255)', highlightOpacity: 1,
      shadeColor: 'rgb(222, 222, 222)', shadeOpacity: 0.26,
      raise: 30, scale: 0.135, brighten: 0.5, cursorShine: 0.72,
    },
    shadow: {
      color: 'rgb(227, 227, 227)', recess: 0.3,
      ambientOpacity: 0.17, ambientGrow: 1.05,
      contactOpacity: 0.33, contactGrow: 0.71,
      blur: 0, offsetX: 0, offsetY: 0, soften: 1,
    },
    wave: {
      enabled: true, amplitude: 0.51, speed: 665, falloff: 900,
      duration: 3.7, dip: 0.22, impact: 0.35, pressRadius: 180, maxWaves: 8,
    },
    tint: { enabled: false, color: 'rgb(38, 0, 255)', strength: 1, falloff: 900, duration: 8 },
    hover: { enabled: true, radius: 101, lift: 0.4, smoothing: 0.95 },
    demo: { enabled: false, interval: 10, strength: 0.85 },
    background: {
      gradient: false, topColor: 'rgb(255, 255, 255)', bottomColor: 'rgb(222, 224, 227)', angle: 49,
      baseColor: 'rgb(242, 242, 242)',
      vignette: true, vignetteColor: 'rgb(255, 255, 255)', vignetteStrength: 0.35,
    },
    performance: { dprCap: 2 },
  };

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const gauss = (x, mean, sigma) => Math.exp(-((x - mean) * (x - mean)) / (2 * sigma * sigma));
  const smooth = (x) => x * x * (3 - 2 * x);

  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const merge = (base, over) => {
    for (const k in over) {
      if (isObj(over[k]) && isObj(base[k])) merge(base[k], over[k]);
      else if (over[k] !== undefined) base[k] = over[k];
    }
    return base;
  };

  /** Return `color` with its alpha multiplied by `k`, as an rgba() string. */
  function withAlpha(color, k) {
    if (color.startsWith('#')) {
      let h = color.slice(1);
      if (h.length === 3) h = h.split('').map((c) => c + c).join('');
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return `rgba(${r}, ${g}, ${b}, ${clamp(a * k, 0, 1).toFixed(3)})`;
    }
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(',').map(parseFloat);
      return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${clamp((p[3] ?? 1) * k, 0, 1).toFixed(3)})`;
    }
    return color;
  }

  function parseRgba(color) {
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(parseFloat);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }

  /** Linear mix of two rgb(a) colour strings; t = 0 gives a, t = 1 gives b. */
  function mix(a, b, t) {
    const ca = parseRgba(a);
    const cb = parseRgba(b);
    if (!ca || !cb) return a;
    return `rgba(${Math.round(ca[0] * (1 - t) + cb[0] * t)}, ${Math.round(ca[1] * (1 - t) + cb[1] * t)}, ${Math.round(ca[2] * (1 - t) + cb[2] * t)}, ${(ca[3] * (1 - t) + cb[3] * t).toFixed(3)})`;
  }

  /** Rounded-rect path with arcTo corners (radius clamped to half the size). */
  function roundRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function makeCanvas(w, h, dpr) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w * dpr));
    c.height = Math.max(1, Math.ceil(h * dpr));
    const x = c.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { c, x };
  }

  /* ------------------------------------------------------------------ */
  /* Sprite builders (cached by a config key, rebuilt only when it moves) */
  /* ------------------------------------------------------------------ */

  /** Three-layer bevel stroke shared by the rest, lift and tint sprites. */
  function strokeBevel(ctx, size, radius, strength, innerAlpha, shadeColor, lightColor) {
    ctx.strokeStyle = withAlpha(lightColor, innerAlpha);
    ctx.lineWidth = 1.75;
    roundRect(ctx, 3.5, 3.5, size - 3, size - 3, Math.max(0, radius - 1.5));
    ctx.stroke();

    const g = ctx.createLinearGradient(2, 2, 2 + size, 2 + size);
    g.addColorStop(0, withAlpha(lightColor, 0.95 * strength));
    g.addColorStop(0.3, withAlpha(lightColor, 0.35 * strength));
    g.addColorStop(0.62, withAlpha(lightColor, 0.12 * strength));
    g.addColorStop(1, withAlpha(lightColor, 0.42 * strength));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    roundRect(ctx, 2.5, 2.5, size - 1, size - 1, Math.max(0, radius - 0.5));
    ctx.stroke();

    ctx.strokeStyle = withAlpha(shadeColor, 0.14);
    ctx.lineWidth = 1;
    roundRect(ctx, 1.5, 1.5, size + 1, size + 1, radius + 0.5);
    ctx.stroke();
  }

  /** Resting tile face (translucent glass). */
  function buildRestSprite(cfg, st, dpr) {
    const t = cfg.tile;
    const size = cfg.grid.cellSize - cfg.grid.gap;
    const radius = cfg.grid.cornerRadius;
    const key = `r|${size}|${radius}|${dpr}|${t.faceColor}|${t.faceLight}|${t.faceShade}|${t.faceGrad}|${t.faceOpacity}|${t.sheen}|${t.highlightColor}|${t.shadeColor}`;
    if (key === st.restKey && st.restSpr) return;
    st.restKey = key;

    const { c, x } = makeCanvas(size + 4, size + 4, dpr);
    const a = t.faceOpacity * 0.55;
    const g = x.createLinearGradient(0, 2, 0, 2 + size);
    g.addColorStop(0, mix(withAlpha(t.faceColor, a), withAlpha(t.faceLight, a), 0.5 * t.faceGrad));
    g.addColorStop(0.55, withAlpha(t.faceColor, a));
    g.addColorStop(1, mix(withAlpha(t.faceColor, a), withAlpha(t.faceShade, a), 0.6 * t.faceGrad));
    x.fillStyle = g;
    roundRect(x, 2, 2, size, size, radius);
    x.fill();
    strokeBevel(x, size, radius, 0.5, 0.05 + t.sheen * 0.05, t.shadeColor, t.highlightColor);
    st.restSpr = { c };
  }

  /** Raised tile face, cross-faded over the rest sprite as a tile lifts. */
  function buildLiftSprite(cfg, st, dpr) {
    const t = cfg.tile;
    const size = cfg.grid.cellSize - cfg.grid.gap;
    const radius = cfg.grid.cornerRadius;
    const key = `l|${size}|${radius}|${dpr}|${t.faceColor}|${t.faceLight}|${t.faceShade}|${t.faceGrad}|${t.faceOpacity}|${t.sheen}|${t.highlightColor}|${t.shadeColor}`;
    if (key === st.liftKey && st.liftSpr) return;
    st.liftKey = key;

    const { c, x } = makeCanvas(size + 4, size + 4, dpr);
    const a = t.faceOpacity * 0.88;
    const g = x.createLinearGradient(0, 2, 0, 2 + size);
    g.addColorStop(0, mix(withAlpha(t.faceColor, a), withAlpha(t.faceLight, a), 0.4 + t.faceGrad * 0.25));
    g.addColorStop(0.5, mix(withAlpha(t.faceColor, a), withAlpha(t.faceLight, a), 0.16));
    g.addColorStop(1, mix(withAlpha(t.faceColor, a), withAlpha(t.faceShade, a), 0.3));
    x.fillStyle = g;
    roundRect(x, 2, 2, size, size, radius);
    x.fill();
    if (t.sheen > 0.001) {
      const s = x.createLinearGradient(0, 2, 0, 2 + size);
      s.addColorStop(0, withAlpha(t.highlightColor, t.sheen * 0.5));
      s.addColorStop(0.4, withAlpha(t.highlightColor, 0));
      x.fillStyle = s;
      roundRect(x, 2, 2, size, size, radius);
      x.fill();
    }
    strokeBevel(x, size, radius, 0.95, 0.1 + t.sheen * 0.07, t.shadeColor, t.highlightColor);
    st.liftSpr = { c };
  }

  /** Tint overlay tile (drawn with the `color` composite op). */
  function buildTintSprite(cfg, st, dpr) {
    const tint = cfg.tint;
    const t = cfg.tile;
    const size = cfg.grid.cellSize - cfg.grid.gap;
    const radius = cfg.grid.cornerRadius;
    const key = `t|${size}|${radius}|${dpr}|${tint.color}|${t.faceGrad}|${t.sheen}|${t.shadeColor}|${t.highlightColor}`;
    if (key === st.tintKey && st.tintSpr) return;
    st.tintKey = key;

    const { c, x } = makeCanvas(size + 4, size + 4, dpr);
    const base = withAlpha(tint.color, 1);
    const light = mix(base, withAlpha('#ffffff', 1), 0.55);
    const dark = mix(base, withAlpha(t.shadeColor, 1), 0.35);
    const g = x.createLinearGradient(0, 2, 0, 2 + size);
    g.addColorStop(0, mix(base, light, 0.5 + t.faceGrad * 0.2));
    g.addColorStop(0.5, base);
    g.addColorStop(1, mix(base, dark, 0.55));
    x.fillStyle = g;
    roundRect(x, 2, 2, size, size, radius);
    x.fill();
    strokeBevel(x, size, radius, 0.85, 0.12, t.shadeColor, t.highlightColor);
    st.tintSpr = { c };
  }

  /** Blurred rounded-square used for contact and ambient shadows. */
  function buildShadowSprite(cfg, st, dpr) {
    const sh = cfg.shadow;
    const size = cfg.grid.cellSize - cfg.grid.gap;
    const key = `${size}|${cfg.grid.cornerRadius}|${sh.blur}|${sh.color}|${dpr}`;
    if (key === st.spriteKey && st.sprite) return;
    st.spriteKey = key;

    const pad = Math.max(sh.blur * 2.5, 8);
    const cssW = size + pad * 2;
    const { c, x } = makeCanvas(cssW, cssW, dpr);
    x.shadowColor = sh.color;
    x.shadowBlur = sh.blur * 1.2 * dpr;
    x.shadowOffsetY = sh.blur * 0.3 * dpr;
    x.fillStyle = sh.color;
    roundRect(x, pad, pad, size, size, cfg.grid.cornerRadius);
    x.fill();
    x.shadowBlur = sh.blur * 0.6 * dpr;
    x.shadowOffsetY = sh.blur * 0.15 * dpr;
    roundRect(x, pad, pad, size, size, cfg.grid.cornerRadius);
    x.fill();
    st.sprite = { c, cssW };
  }

  /** Full-size static layer: every resting tile plus the optional grid lines. */
  function buildStaticLayer(cfg, st, dpr) {
    const key = `${JSON.stringify(cfg.grid)}|${st.restKey}|${st.w}x${st.h}|${dpr}`;
    if (key === st.staticKey && st.staticCanvas) return;
    st.staticKey = key;

    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(st.w * dpr));
    cv.height = Math.max(1, Math.round(st.h * dpr));
    const x = cv.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = cfg.grid;
    const size = g.cellSize - g.gap;
    const off = g.gap / 2 - 2;
    for (let row = 0; row <= st.rows; row++) {
      for (let col = 0; col <= st.cols; col++) {
        x.drawImage(st.restSpr.c, col * g.cellSize + off, row * g.cellSize + off, size + 4, size + 4);
      }
    }

    if (g.lineWidth > 0 && g.lineOpacity > 0) {
      x.lineWidth = g.lineWidth;
      x.strokeStyle = withAlpha(g.lineColor, g.lineOpacity);
      x.beginPath();
      for (let col = 0; col <= st.cols; col++) {
        const px = col * g.cellSize + 0.5;
        x.moveTo(px, 0);
        x.lineTo(px, st.h);
      }
      for (let row = 0; row <= st.rows; row++) {
        const py = row * g.cellSize + 0.5;
        x.moveTo(0, py);
        x.lineTo(st.w, py);
      }
      x.stroke();
    }

    if (g.majorEvery > 1 && g.majorLineWidth > 0 && g.majorLineOpacity > 0) {
      x.lineWidth = g.majorLineWidth;
      x.strokeStyle = withAlpha(g.majorLineColor, g.majorLineOpacity);
      x.beginPath();
      for (let col = 0; col <= st.cols; col++) {
        if (col % g.majorEvery === 0) {
          const px = col * g.cellSize + 0.5;
          x.moveTo(px, 0);
          x.lineTo(px, st.h);
        }
      }
      for (let row = 0; row <= st.rows; row++) {
        if (row % g.majorEvery === 0) {
          const py = row * g.cellSize + 0.5;
          x.moveTo(0, py);
          x.lineTo(st.w, py);
        }
      }
      x.stroke();
    }
    st.staticCanvas = cv;
  }

  /* ------------------------------------------------------------------ */
  /* Physics: per-tile lift (waves + hover) and tint                     */
  /* ------------------------------------------------------------------ */

  /** Fill st.lifts (one float per tile, row-major) for time `now` (ms). */
  function computeLifts(cfg, st, now) {
    const cell = cfg.grid.cellSize;
    const w = cfg.wave;
    const falloff = Math.max(40, w.falloff);
    const pressK = 2 * Math.max(10, w.pressRadius) ** 2;
    const waves = st.waves.map((p) => ({
      x: p.x, y: p.y, s: p.s,
      age: (now - p.t0) / 1000,
      fade: clamp(1 - (now - p.t0) / 1000 / w.duration, 0, 1),
    }));
    const hoverOn = cfg.hover.enabled && st.hoverFade > 0.01;
    const hoverVar = cfg.hover.radius * cfg.hover.radius;
    const speed = Math.max(60, w.speed);

    let i = 0;
    for (let row = 0; row <= st.rows; row++) {
      const cy = row * cell + cell / 2;
      for (let col = 0; col <= st.cols; col++) {
        const cx = col * cell + cell / 2;
        let lift = 0;
        for (let k = 0; k < waves.length; k++) {
          const p = waves[k];
          const dist = Math.hypot(cx - p.x, cy - p.y);
          const atten = Math.exp(-dist / falloff) * p.fade * p.s;
          const t = p.age - dist / speed; // time since the front reached this tile
          if (t > 0) {
            const env = (1 - Math.exp(-t / 0.04)) * Math.exp(-t / 0.4);
            lift += w.amplitude * atten * env * 2;
            lift -= w.dip * atten * gauss(t, 0.5, 0.2);
          }
          lift -= w.impact * p.s * Math.exp(-(dist * dist) / pressK) * Math.exp(-p.age * 14);
        }
        if (hoverOn) {
          const dx = cx - st.sx;
          const dy = cy - st.sy;
          lift += cfg.hover.lift * st.hoverFade * Math.exp(-(dx * dx + dy * dy) / (2 * hoverVar));
        }
        st.lifts[i++] = clamp(lift, -0.55, 1.25);
      }
    }
  }

  /** Fill st.tints (one float per tile) from the active click stains. */
  function computeTints(cfg, st, now) {
    const cell = cfg.grid.cellSize;
    const tint = cfg.tint;
    const out = st.tints;
    if (!tint.enabled || st.stains.length === 0) {
      out.fill(0);
      return;
    }
    const radius = Math.max(30, tint.falloff);
    const spread = Math.max(60, cfg.wave.speed) * 1.6;
    const stains = st.stains.map((p) => {
      const t = (now - p.t0) / 1000;
      return {
        x: p.x, y: p.y, s: p.s,
        fade: smooth(clamp(1 - t / tint.duration, 0, 1)),
        reach: Math.min(t * spread, radius),
      };
    });

    let i = 0;
    for (let row = 0; row <= st.rows; row++) {
      const cy = row * cell + cell / 2;
      for (let col = 0; col <= st.cols; col++) {
        const cx = col * cell + cell / 2;
        let best = 0;
        for (let k = 0; k < stains.length; k++) {
          const p = stains[k];
          const dist = Math.hypot(cx - p.x, cy - p.y);
          if (dist > p.reach) continue;
          const v = tint.strength * p.s * p.fade * smooth(clamp(1 - dist / radius, 0, 1));
          if (v > best) best = v;
        }
        out[i++] = best;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Drawing                                                             */
  /* ------------------------------------------------------------------ */

  /** Erase the static tiles under lifted ones, then draw sockets and shadows. */
  function drawShadows(cfg, st, ctx) {
    const cell = cfg.grid.cellSize;
    const size = cell - cfg.grid.gap;
    const tile = cfg.tile;
    const sh = cfg.shadow;
    const radius = cfg.grid.cornerRadius;
    const half = size / 2;
    const stride = st.cols + 1;
    const order = st.order;

    ctx.globalCompositeOperation = 'destination-out';
    for (let k = 0; k < order.length; k++) {
      const idx = order[k];
      const lift = st.lifts[idx];
      if (lift <= 0.03) continue;
      const col = idx % stride;
      const row = (idx / stride) | 0;
      ctx.globalAlpha = Math.min(1, lift * 2.5);
      ctx.fillStyle = '#000';
      roundRect(ctx, col * cell + cell / 2 - half - 1, row * cell + cell / 2 - half - 1, size + 2, size + 2, radius + 1);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    for (let k = 0; k < order.length; k++) {
      const idx = order[k];
      const lift = st.lifts[idx];
      if (lift <= 0.03) continue;
      const p = Math.min(1, lift);
      const cx = (idx % stride) * cell + cell / 2;
      const cy = ((idx / stride) | 0) * cell + cell / 2;

      if (sh.recess > 0.001) {
        ctx.fillStyle = withAlpha(tile.shadeColor, sh.recess * p);
        roundRect(ctx, cx - half, cy - half, size, size, radius);
        ctx.fill();
      }
      if (st.sprite) {
        const base = st.sprite.cssW;
        const soft = 1 - sh.soften * 0.55 * p;

        const contact = base * (1 + sh.contactGrow * p);
        ctx.globalAlpha = sh.contactOpacity * p * soft;
        ctx.drawImage(st.sprite.c, cx - contact / 2 + sh.offsetX * 0.4 * p, cy - contact / 2 + sh.offsetY * 0.5 * p + 1.5, contact, contact);

        const ambient = base * (1 + sh.ambientGrow * p);
        ctx.globalAlpha = sh.ambientOpacity * p * soft;
        ctx.drawImage(st.sprite.c, cx - ambient / 2 + sh.offsetX * p, cy - ambient / 2 + sh.offsetY * 1.1 * p, ambient, ambient);
        ctx.globalAlpha = 1;
      }
    }

    // Tiles pressed below rest show as a darker socket.
    for (let k = 0; k < st.dips.length; k++) {
      const idx = st.dips[k];
      const depth = -st.lifts[idx];
      const col = idx % stride;
      const row = (idx / stride) | 0;
      ctx.fillStyle = withAlpha(tile.shadeColor, depth * tile.shadeOpacity * 0.9);
      roundRect(ctx, col * cell + cell / 2 - half, row * cell + cell / 2 - half, size, size, radius);
      ctx.fill();
    }
  }

  /** Draw raised tiles (low to high), then tint overlay, then cursor shine. */
  function drawTiles(cfg, st, ctx, shine) {
    const cell = cfg.grid.cellSize;
    const size = cell - cfg.grid.gap;
    const tile = cfg.tile;
    const radius = cfg.grid.cornerRadius;
    const stride = st.cols + 1;
    const dpr = st.dpr;
    const snap = (v) => Math.round(v * dpr) / dpr;
    const order = st.order;

    for (let k = 0; k < order.length; k++) {
      const idx = order[k];
      const lift = st.lifts[idx];
      if (lift <= 0.03) continue;
      const f = Math.min(1, lift);
      const cx = (idx % stride) * cell + cell / 2;
      const cy = ((idx / stride) | 0) * cell + cell / 2;
      const s = size * (1 + tile.scale * lift);
      const x = cx - s / 2;
      const y = cy - s / 2 - tile.raise * lift;

      ctx.drawImage(st.restSpr.c, x - 2, y - 2, s + 4, s + 4);
      ctx.globalAlpha = Math.min(1, lift * 1.8);
      ctx.drawImage(st.liftSpr.c, x - 2, y - 2, s + 4, s + 4);
      ctx.globalAlpha = 1;

      if (tile.brighten > 0.001 && f > 0.2) {
        ctx.fillStyle = withAlpha(tile.highlightColor, tile.brighten * (f - 0.2) * 0.35);
        roundRect(ctx, x, y, s, s, radius);
        ctx.fill();
      }
      if (tile.highlightOpacity > 0) {
        ctx.strokeStyle = withAlpha(tile.highlightColor, tile.highlightOpacity * f * 0.8);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + radius, snap(y + 0.75));
        ctx.lineTo(x + s - radius, snap(y + 0.75));
        ctx.stroke();
      }
      if (tile.shadeOpacity > 0) {
        ctx.strokeStyle = withAlpha(tile.shadeColor, tile.shadeOpacity * f * 0.8);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + radius, snap(y + s - 0.75));
        ctx.lineTo(x + s - radius, snap(y + s - 0.75));
        ctx.stroke();
      }
    }

    let anyTint = false;
    for (let k = 0; k < order.length; k++) {
      if (st.tints[order[k]] > 0.02) { anyTint = true; break; }
    }
    if (anyTint && st.tintSpr) {
      ctx.globalCompositeOperation = 'color';
      for (let k = 0; k < order.length; k++) {
        const idx = order[k];
        const amount = st.tints[idx];
        if (amount <= 0.02) continue;
        const lift = st.lifts[idx];
        const cx = (idx % stride) * cell + cell / 2;
        const cy = ((idx / stride) | 0) * cell + cell / 2;
        let s, x, y;
        if (lift > 0.03) {
          s = size * (1 + tile.scale * lift);
          x = cx - s / 2;
          y = cy - s / 2 - tile.raise * Math.min(1.25, lift);
        } else {
          s = size;
          x = cx - s / 2;
          y = cy - s / 2;
        }
        ctx.globalAlpha = Math.min(1, amount);
        ctx.drawImage(st.tintSpr.c, x - 2, y - 2, s + 4, s + 4);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    if (shine) {
      for (let k = 0; k < order.length; k++) {
        const idx = order[k];
        const lift = st.lifts[idx];
        const cx = (idx % stride) * cell + cell / 2;
        const cy = ((idx / stride) | 0) * cell + cell / 2;
        let near = clamp(1 - Math.hypot(cx - st.sx, cy - st.sy) / 120, 0, 1);
        near *= near;
        if (near <= 0.08) continue;
        const l01 = clamp(lift, 0, 1);
        let s, x, y;
        if (lift > 0.03) {
          s = size * (1 + tile.scale * lift);
          x = cx - s / 2;
          y = cy - s / 2 - tile.raise * lift;
        } else {
          s = size;
          x = cx - s / 2;
          y = cy - s / 2;
        }
        const alpha = near * tile.cursorShine * st.hoverFade * (0.45 + l01 * 0.55);
        if (alpha <= 0.02) continue;
        let dx = st.sx - cx;
        let dy = st.sy - cy;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const g = ctx.createLinearGradient(cx + dx * s * 0.62, cy + dy * s * 0.62, cx - dx * s * 0.62, cy - dy * s * 0.62);
        g.addColorStop(0, withAlpha(tile.highlightColor, alpha * 0.9));
        g.addColorStop(0.45, withAlpha(tile.highlightColor, alpha * 0.35));
        g.addColorStop(1, withAlpha(tile.highlightColor, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.25;
        roundRect(ctx, x + 1, y + 1, s - 2, s - 2, Math.max(0, radius - 1));
        ctx.stroke();
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Custom element                                                      */
  /* ------------------------------------------------------------------ */
  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
    <style>
      :host { display: block; position: relative; width: 100%; height: 100%; }
      .root { position: relative; overflow: hidden; width: 100%; height: 100%; user-select: none; -webkit-user-select: none; }
      .fill, .vignette { position: absolute; inset: 0; }
      .vignette { pointer-events: none; }
      canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    </style>
    <div class="root" part="root">
      <div class="fill"></div>
      <canvas aria-hidden="true"></canvas>
      <div class="vignette" aria-hidden="true"></div>
    </div>`;

  const newState = () => ({
    waves: [], stains: [],
    px: 0, py: 0, active: false, sx: 0, sy: 0, hoverFade: 0,
    lastDown: -1, lastTime: -1,
    dpr: 1, w: 0, h: 0, cols: 0, rows: 0,
    lifts: new Float32Array(0), tints: new Float32Array(0),
    order: [], dips: [],
    staticCanvas: null, staticKey: '',
    sprite: null, spriteKey: '',
    restSpr: null, restKey: '',
    liftSpr: null, liftKey: '',
    tintSpr: null, tintKey: '',
    dirty: true, wasDynamic: false, visible: true,
    handleProps: null, onDown: null, pulse: null,
  });

  class TronTiles extends HTMLElement {
    static get observedAttributes() { return ['config']; }

    constructor() {
      super();
      this._cfg = clone(DEFAULTS);
      this._st = newState();
      this._teardown = null;
      this._mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._onMq = () => { if (this.isConnected) { this._unmount(); this._mount(); } };

      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(TEMPLATE.content.cloneNode(true));
      this._rootEl = root.querySelector('.root');
      this._fill = root.querySelector('.fill');
      this._canvas = root.querySelector('canvas');
      this._vignette = root.querySelector('.vignette');
      this._applyLayout();
    }

    get config() { return this._cfg; }
    set config(value) {
      this._cfg = merge(clone(DEFAULTS), isObj(value) ? clone(value) : {});
      this._applyLayout();
      if (this._st.handleProps) this._st.handleProps();
    }

    /** Trigger a click pulse at element-local pixel coordinates. */
    pulse(x, y, strength = 1) {
      if (this._st.pulse) this._st.pulse(x, y, strength);
    }

    attributeChangedCallback(name, _old, val) {
      if (name !== 'config' || val == null) return;
      try { this.config = JSON.parse(val); } catch (e) { console.warn('<tron-tiles>: invalid JSON in config attribute'); }
    }

    connectedCallback() {
      this._mq.addEventListener('change', this._onMq);
      this._mount();
    }

    disconnectedCallback() {
      this._mq.removeEventListener('change', this._onMq);
      this._unmount();
    }

    _applyLayout() {
      const bg = this._cfg.background;
      this._rootEl.style.cursor = this._cfg.cursor;
      this._rootEl.style.background = bg.baseColor;
      this._fill.style.background = bg.gradient
        ? `linear-gradient(${bg.angle}deg, ${bg.topColor} 0%, ${bg.bottomColor} 100%)`
        : bg.baseColor;
      this._vignette.style.display = bg.vignette ? '' : 'none';
      this._vignette.style.background = `radial-gradient(120% 120% at 50% 50%, transparent 55%, ${withAlpha(bg.vignetteColor, bg.vignetteStrength)} 100%)`;
    }

    _unmount() {
      if (this._teardown) { this._teardown(); this._teardown = null; }
    }

    _mount() {
      if (this._teardown) return;
      const host = this;
      const canvas = this._canvas;
      const st = this._st = newState();
      const cfg = () => this._cfg;
      const isStatic = this._mq.matches && !this.hasAttribute('ignore-reduced-motion');

      let raf = 0;
      let looping = false;
      let demoTimer = null;
      let resizeObs = null;
      let visObs = null;

      /** Size the backing store and (re)compute the grid dimensions. */
      const resize = (w, h) => {
        const c = cfg();
        const dpr = Math.min(window.devicePixelRatio || 1, c.performance.dprCap);
        st.dpr = dpr;
        st.w = w;
        st.h = h;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        st.cols = Math.ceil(w / c.grid.cellSize);
        st.rows = Math.ceil(h / c.grid.cellSize);
        const n = (st.cols + 1) * (st.rows + 1);
        st.lifts = new Float32Array(n);
        st.tints = new Float32Array(n);
        st.staticKey = '';
        st.dirty = true;
      };

      const addPulse = (x, y, strength) => {
        const c = cfg();
        const now = performance.now();
        if (c.wave.enabled) {
          st.waves.push({ x, y, t0: now, s: strength });
          if (st.waves.length > c.wave.maxWaves) st.waves.shift();
        }
        if (c.tint.enabled) {
          st.stains.push({ x, y, t0: now, s: strength });
          if (st.stains.length > 10) st.stains.shift();
        }
        st.dirty = true;
      };

      const stopLoop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        looping = false;
      };

      const frame = (now) => {
        raf = 0;
        looping = false;
        const c = cfg();
        if (!st.visible) return;
        if (st.lastTime < 0) { st.lastTime = now; st.sx = st.px; st.sy = st.py; }
        const dt = Math.min(48, now - st.lastTime);
        st.lastTime = now;

        const dpr = Math.min(window.devicePixelRatio || 1, c.performance.dprCap);
        if (canvas.width !== Math.max(1, Math.round(st.w * dpr))) resize(st.w, st.h);
        const ctx = canvas.getContext('2d');
        if (!ctx || st.w === 0) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildRestSprite(c, st, dpr);
        buildStaticLayer(c, st, dpr);
        buildShadowSprite(c, st, dpr);
        buildLiftSprite(c, st, dpr);
        buildTintSprite(c, st, dpr);

        // Cursor smoothing and hover fade are frame-rate independent.
        const follow = 1 - (1 - clamp(c.hover.smoothing, 0.02, 0.95)) ** (dt / 16);
        st.sx += (st.px - st.sx) * follow;
        st.sy += (st.py - st.sy) * follow;
        st.hoverFade += ((st.active ? 1 : 0) - st.hoverFade) * (1 - 0.85 ** (dt / 16));

        st.waves = st.waves.filter((p) => (now - p.t0) / 1000 < c.wave.duration);
        st.stains = st.stains.filter((p) => (now - p.t0) / 1000 < c.tint.duration);

        const shine = c.tile.cursorShine > 0.01 && c.hover.enabled && st.hoverFade > 0.01;
        const dynamic = st.waves.length > 0 || st.stains.length > 0 || (c.hover.enabled && st.hoverFade > 0.01);

        if (!dynamic && !st.dirty) return; // idle: stop the loop
        if (st.wasDynamic && !dynamic) st.dirty = true;
        st.wasDynamic = dynamic;

        ctx.clearRect(0, 0, st.w, st.h);
        if (st.staticCanvas) ctx.drawImage(st.staticCanvas, 0, 0, st.w, st.h);

        if (dynamic) {
          computeLifts(c, st, now);
          computeTints(c, st, now);
          const order = st.order;
          const dips = st.dips;
          order.length = 0;
          dips.length = 0;
          const stride = st.cols + 1;
          const cell = c.grid.cellSize;
          for (let i = 0; i < st.lifts.length; i++) {
            const lift = st.lifts[i];
            if (lift > 0.03 || st.tints[i] > 0.02) { order.push(i); continue; }
            if (lift < -0.03) { dips.push(i); continue; }
            if (shine) {
              const dx = (i % stride) * cell + cell / 2 - st.sx;
              const dy = ((i / stride) | 0) * cell + cell / 2 - st.sy;
              if (dx * dx + dy * dy < 14400) order.push(i); // within 120px of the cursor
            }
          }
          order.sort((a, b) => st.lifts[a] - st.lifts[b]);
          drawShadows(c, st, ctx);
          drawTiles(c, st, ctx, shine);
        }
        if (!dynamic) st.dirty = false;
        raf = requestAnimationFrame(frame);
        looping = true;
      };

      const kick = () => {
        if (!looping && st.visible && !isStatic) {
          looping = true;
          raf = requestAnimationFrame(frame);
        }
      };

      /** Paint the static grid once (reduced-motion path). */
      const drawStatic = () => {
        const c = cfg();
        const dpr = Math.min(window.devicePixelRatio || 1, c.performance.dprCap);
        st.dpr = dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx || st.w === 0) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildRestSprite(c, st, dpr);
        buildStaticLayer(c, st, dpr);
        ctx.clearRect(0, 0, st.w, st.h);
        if (st.staticCanvas) ctx.drawImage(st.staticCanvas, 0, 0, st.w, st.h);
      };

      const syncDemo = () => {
        const c = cfg();
        const want = c.demo.enabled && st.visible && !isStatic;
        if (want && demoTimer === null) {
          demoTimer = window.setInterval(() => {
            if (!st.visible) return;
            const cc = cfg();
            const m = cc.grid.cellSize * 2;
            addPulse(m + Math.random() * Math.max(1, st.w - m * 2), m + Math.random() * Math.max(1, st.h - m * 2), cc.demo.strength);
            kick();
          }, Math.max(0.5, c.demo.interval) * 1000);
        } else if (!want && demoTimer !== null) {
          clearInterval(demoTimer);
          demoTimer = null;
        }
      };

      st.handleProps = () => {
        if (st.w > 0) resize(st.w, st.h);
        st.dirty = true;
        st.staticKey = st.restKey = st.liftKey = st.tintKey = st.spriteKey = '';
        syncDemo();
        if (isStatic) drawStatic(); else kick();
      };

      let rect = host.getBoundingClientRect();
      resize(rect.width, rect.height);

      if (isStatic) {
        drawStatic();
        // Keep the static grid correct if the box changes size.
        if (typeof ResizeObserver !== 'undefined') {
          resizeObs = new ResizeObserver((entries) => {
            for (const en of entries) resize(en.contentRect.width, en.contentRect.height);
            drawStatic();
          });
          resizeObs.observe(host);
        }
        this._teardown = () => {
          if (resizeObs) resizeObs.disconnect();
          st.handleProps = null;
        };
        return;
      }

      const press = (clientX, clientY, stamp) => {
        if (stamp === st.lastDown) return; // same event seen by two listeners
        st.lastDown = stamp;
        const r = host.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        if (x < 0 || y < 0 || x > r.width || y > r.height) return;
        addPulse(x, y, 1);
        kick();
      };
      const onWindowDown = (e) => press(e.clientX, e.clientY, e.timeStamp);
      const onHostDown = (e) => press(e.clientX, e.clientY, e.timeStamp);
      const onMove = (e) => {
        const r = host.getBoundingClientRect();
        st.px = e.clientX - r.left;
        st.py = e.clientY - r.top;
        st.active = true;
        kick();
      };
      const onLeave = () => { st.active = false; kick(); };

      st.pulse = (x, y, strength) => { addPulse(x, y, strength); kick(); };

      window.addEventListener('pointerdown', onWindowDown);
      host.addEventListener('pointerdown', onHostDown);
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerenter', onMove);
      host.addEventListener('pointerleave', onLeave);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObs = new ResizeObserver((entries) => {
          for (const en of entries) {
            const cr = en.contentRect;
            if (Math.abs(cr.width - st.w) > 0.5 || Math.abs(cr.height - st.h) > 0.5) resize(cr.width, cr.height);
          }
          kick();
        });
        resizeObs.observe(host);
      }
      if (typeof IntersectionObserver !== 'undefined') {
        visObs = new IntersectionObserver((entries) => {
          for (const en of entries) st.visible = en.isIntersecting;
          if (st.visible) { st.lastTime = -1; syncDemo(); kick(); }
          else { stopLoop(); syncDemo(); }
        }, { threshold: 0 });
        visObs.observe(host);
      }

      syncDemo();
      kick();

      this._teardown = () => {
        stopLoop();
        if (demoTimer !== null) clearInterval(demoTimer);
        if (resizeObs) resizeObs.disconnect();
        if (visObs) visObs.disconnect();
        window.removeEventListener('pointerdown', onWindowDown);
        host.removeEventListener('pointerdown', onHostDown);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerenter', onMove);
        host.removeEventListener('pointerleave', onLeave);
        st.handleProps = null;
        st.pulse = null;
      };
    }
  }

  customElements.define('tron-tiles', TronTiles);
})();
