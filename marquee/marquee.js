/**
 * marquee.js
 * Zero-dependency infinite marquee. Drag, inertia, hover slow-down,
 * any content, horizontal or vertical. ~250 lines, no build step.
 *
 *   import { Marquee } from "./marquee.js";
 *   new Marquee(el, { speed: 80, direction: "right" });
 *
 * Or add `data-marquee` to an element and call Marquee.init().
 */

const DEFAULTS = {
  speed: 50, // px per second
  direction: "left", // left | right | up | down (way the content travels)
  hoverSpeed: 0, // speed multiplier while hovered: 0 pauses, 1 ignores hover
  draggable: true,
  reducedMotion: "stop", // stop | ignore (when the OS asks for reduced motion)
  easing: 8, // higher = snappier speed changes (hover, release, play/pause)
};

const DRAG_THRESHOLD = 4; // px before a press becomes a drag
const MAX_FLICK = 3000; // px/s cap on release velocity
const DIRECTIONS = { left: 1, up: 1, right: -1, down: -1 };

const mod = (n, m) => ((n % m) + m) % m;
const bool = (v, d) => (v == null ? d : v !== "false" && v !== "0");

function readData(el) {
  const d = el.dataset;
  const out = {};
  if (d.speed != null) out.speed = parseFloat(d.speed);
  if (d.direction != null) out.direction = d.direction;
  if (d.hoverSpeed != null) out.hoverSpeed = parseFloat(d.hoverSpeed);
  if (d.draggable != null) out.draggable = bool(d.draggable, true);
  if (d.reducedMotion != null) out.reducedMotion = d.reducedMotion;
  if (d.easing != null) out.easing = parseFloat(d.easing);
  return out;
}

export class Marquee {
  /** Initialise every `[data-marquee]` under `root`. Returns the instances. */
  static init(root = document) {
    return Array.from(root.querySelectorAll("[data-marquee]")).map(
      (el) => new Marquee(el)
    );
  }

  /** Get the instance attached to an element, if any. */
  static get(el) {
    return el.__marquee || null;
  }

  constructor(el, options = {}) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("Marquee: element not found");
    if (el.__marquee) return el.__marquee;

    this.el = el;
    this.options = { ...DEFAULTS, ...readData(el), ...options };
    this.pos = 0;
    this.vel = 0;
    this.hovered = false;
    this.focused = false;
    this.manuallyPaused = false;
    this.visible = true;
    this.dragging = false;
    this.moved = 0;
    this._raf = 0;
    this._last = 0;
    this._groupSize = 0;
    this._scale = 1;

    this._build();
    this._bind();
    this._applyAxis();
    this._measure();
    el.__marquee = this;
    this._wake();
  }

  /* ---------------------------------------------------------------- API */

  play() {
    this.manuallyPaused = false;
    this._wake();
    return this;
  }

  pause() {
    this.manuallyPaused = true;
    this._wake();
    return this;
  }

  toggle() {
    return this.manuallyPaused ? this.play() : this.pause();
  }

  get paused() {
    return this.manuallyPaused;
  }

  /** Merge new options at runtime: speed, direction, hoverSpeed, ... */
  update(options = {}) {
    const prevDir = this.options.direction;
    Object.assign(this.options, options);
    if (this.options.direction !== prevDir) {
      this._applyAxis();
      this._measure();
    }
    this.el.classList.toggle("is-draggable", !!this.options.draggable);
    this._wake();
    return this;
  }

  setSpeed(px) {
    return this.update({ speed: px });
  }

  setDirection(dir) {
    return this.update({ direction: dir });
  }

  /** Re-measure and rebuild clones. Call after changing --mq-gap or content size. */
  refresh() {
    this._measure(true);
    return this;
  }

  /** Remove listeners, clones, and wrapper; put original items back. */
  destroy() {
    cancelAnimationFrame(this._raf);
    this._ro.disconnect();
    this._io.disconnect();
    this._mq.removeEventListener("change", this._onMotionPref);
    const el = this.el;
    el.removeEventListener("pointerdown", this._onDown);
    el.removeEventListener("pointermove", this._onMove);
    el.removeEventListener("pointerup", this._onUp);
    el.removeEventListener("pointercancel", this._onUp);
    el.removeEventListener("pointerenter", this._onEnter);
    el.removeEventListener("pointerleave", this._onLeave);
    el.removeEventListener("focusin", this._onFocusIn);
    el.removeEventListener("focusout", this._onFocusOut);
    el.removeEventListener("click", this._onClick, true);
    el.removeEventListener("dragstart", this._onDragStart);
    this.items.forEach((item) => el.append(item));
    this.track.remove();
    el.classList.remove("is-draggable", "is-dragging");
    el.removeAttribute("data-marquee-ready");
    el.removeAttribute("data-axis");
    delete el.__marquee;
  }

  /* ------------------------------------------------------------- internals */

  get _axis() {
    return /^(up|down)$/.test(this.options.direction) ? "y" : "x";
  }

  _build() {
    const el = this.el;
    this.items = Array.from(el.children);
    this.track = document.createElement("div");
    this.track.className = "marquee__track";
    this.group = document.createElement("div");
    this.group.className = "marquee__group";
    this.items.forEach((item) => this.group.append(item));
    this.track.append(this.group);
    el.append(this.track);
    el.setAttribute("data-marquee-ready", "");
    el.classList.toggle("is-draggable", !!this.options.draggable);
  }

  _applyAxis() {
    this.el.setAttribute("data-axis", this._axis);
  }

  _bind() {
    const el = this.el;

    this._onDown = (e) => {
      if (!this.options.draggable) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      this._press = { id: e.pointerId, x: e.clientX, y: e.clientY, active: false };
      this.moved = 0;
    };

    this._onMove = (e) => {
      const p = this._press;
      if (!p || p.id !== e.pointerId) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const delta = this._axis === "x" ? dx : dy;
      if (!p.active) {
        if (Math.abs(delta) < DRAG_THRESHOLD) return;
        // only a drag along the scroll axis; let the browser own the other one
        p.active = true;
        this.dragging = true;
        this.dragVel = 0;
        el.classList.add("is-dragging");
        try {
          el.setPointerCapture(e.pointerId);
        } catch (_) {}
        p.t = performance.now();
        p.x = e.clientX;
        p.y = e.clientY;
        this.moved = Math.abs(delta);
        this._drag(delta, 0.016);
        return;
      }
      const now = performance.now();
      const step = this._axis === "x" ? e.clientX - p.x : e.clientY - p.y;
      const dt = Math.max((now - p.t) / 1000, 0.001);
      p.x = e.clientX;
      p.y = e.clientY;
      p.t = now;
      this.moved += Math.abs(step);
      this._drag(step, dt);
    };

    this._onUp = (e) => {
      const p = this._press;
      if (!p || p.id !== e.pointerId) return;
      this._press = null;
      if (!p.active) return;
      this.dragging = false;
      el.classList.remove("is-dragging");
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
      // hand release velocity to the physics loop; it eases back to base speed
      const v = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, this.dragVel || 0));
      this.vel = performance.now() - p.t > 80 ? 0 : v;
      this._wake();
    };

    // a drag must not trigger links or handlers inside items
    this._onClick = (e) => {
      if (this.moved > DRAG_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.moved = 0;
    };

    this._onDragStart = (e) => e.preventDefault();

    this._onEnter = (e) => {
      if (e.pointerType !== "mouse") return;
      this.hovered = true;
      this._wake();
    };
    this._onLeave = () => {
      this.hovered = false;
      this._wake();
    };
    this._onFocusIn = () => {
      this.focused = true;
      this._wake();
    };
    this._onFocusOut = () => {
      this.focused = false;
      this._wake();
    };

    el.addEventListener("pointerdown", this._onDown);
    el.addEventListener("pointermove", this._onMove);
    el.addEventListener("pointerup", this._onUp);
    el.addEventListener("pointercancel", this._onUp);
    el.addEventListener("pointerenter", this._onEnter);
    el.addEventListener("pointerleave", this._onLeave);
    el.addEventListener("focusin", this._onFocusIn);
    el.addEventListener("focusout", this._onFocusOut);
    el.addEventListener("click", this._onClick, true);
    el.addEventListener("dragstart", this._onDragStart);

    this._mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this._onMotionPref = () => this._wake();
    this._mq.addEventListener("change", this._onMotionPref);

    let queued = false;
    this._ro = new ResizeObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        this._measure();
      });
    });
    this._ro.observe(el);
    this._ro.observe(this.group);

    // do not burn frames while off-screen
    this._io = new IntersectionObserver((entries) => {
      this.visible = entries[entries.length - 1].isIntersecting;
      this._wake();
    });
    this._io.observe(el);
  }

  _measure(force = false) {
    const el = this.el;
    const horizontal = this._axis === "x";
    const rootRect = el.getBoundingClientRect();
    const rootOwn = horizontal ? el.offsetWidth : el.offsetHeight;
    const rootRendered = horizontal ? rootRect.width : rootRect.height;
    // correct for ancestor CSS scale so px translate stays in local space
    this._scale = rootOwn && rootRendered ? rootRendered / rootOwn : 1;

    const gr = this.group.getBoundingClientRect();
    const size = (horizontal ? gr.width : gr.height) / this._scale;
    const view = rootOwn;
    if (!size || !view) return;

    const total = Math.ceil(view / size) + 1;
    const current = this.track.children.length;
    if (force || total !== current || size !== this._groupSize) {
      while (this.track.children.length > 1) this.track.lastChild.remove();
      for (let i = 1; i < total; i++) this.track.append(this._clone());
    }
    this._groupSize = size;
    this._render();
  }

  _clone() {
    const c = this.group.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("inert", "");
    c.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    return c;
  }

  _drag(delta, dt) {
    // content follows the pointer: moving the pointer left advances position
    this._advance(-delta / this._scale);
    const inst = -delta / this._scale / dt;
    this.dragVel = this.dragVel ? this.dragVel * 0.6 + inst * 0.4 : inst;
  }

  _advance(d) {
    if (!this._groupSize) return;
    this.pos = mod(this.pos + d, this._groupSize);
    this._render();
  }

  _render() {
    const p = -this.pos;
    this.track.style.transform =
      this._axis === "x" ? `translate3d(${p}px,0,0)` : `translate3d(0,${p}px,0)`;
  }

  _target() {
    const o = this.options;
    if (this.manuallyPaused || this.focused || !this.visible) return 0;
    if (o.reducedMotion === "stop" && this._mq.matches) return 0;
    const hover = this.hovered ? o.hoverSpeed : 1;
    return (DIRECTIONS[o.direction] ?? 1) * o.speed * hover;
  }

  _wake() {
    // off-screen: stay stopped, the IntersectionObserver wakes us again
    if (this._raf || !this.visible) return;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this._tick);
  }

  _tick = (now) => {
    this._raf = 0;
    const dt = Math.min((now - this._last) / 1000, 0.05);
    this._last = now;

    if (this.dragging) return; // pointer drives it; _onUp wakes the loop

    const target = this._target();
    this.vel += (target - this.vel) * (1 - Math.exp(-this.options.easing * dt));
    if (Math.abs(this.vel) < 0.01 && target === 0) {
      this.vel = 0; // fully settled, stop the loop until something changes
      return;
    }
    this._advance(this.vel * dt);
    this._raf = requestAnimationFrame(this._tick);
  };
}

export default Marquee;

/* Auto-init for plain <script type="module"> usage. */
if (typeof document !== "undefined") {
  const start = () => Marquee.init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
