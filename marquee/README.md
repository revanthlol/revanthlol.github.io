# Marquee

Standalone infinite marquee. Two files, no dependencies, no build step.

- Seamless loop, any content (text, images, SVG, links, whole components)
- Drag to scrub, with flick inertia that eases back to cruise speed
- Hover behavior: pause, slow down, speed up, or ignore
- Horizontal or vertical, either direction
- Edge fade, fully themeable through CSS variables
- Pauses off-screen, on keyboard focus, and under `prefers-reduced-motion`
- Runtime API: play, pause, speed, direction, destroy

Extracted from a Framer ticker. All Framer runtime, tracking, hydration markup and the "Made in Framer" badge are gone.

## Files

| File | Purpose |
|---|---|
| `marquee.css` | Layout and every visual knob as CSS custom properties |
| `marquee.js` | Behavior. ES module, auto-initialises `[data-marquee]` |
| `index.html` | Demo and live playground |

Browsers: anything with `ResizeObserver`, `IntersectionObserver`, pointer events and `:where()`. That is all current evergreen browsers.

> ES modules do not load from `file://`. Serve the folder to try the demo:
> `python -m http.server` or `npx serve`.

## Quick start

```html
<link rel="stylesheet" href="marquee.css">
<script type="module" src="marquee.js"></script>

<div class="marquee" data-marquee data-speed="60" aria-label="Partners">
  <span>Helix</span>
  <span>Kosmos</span>
  <span>Vireo</span>
</div>
```

Every direct child of the `.marquee` element is an item. That is the whole contract.

### With a bundler (Vite, Next, etc.)

```js
import "./marquee.css";
import { Marquee } from "./marquee.js";

const m = new Marquee("#logos", { speed: 80, direction: "right" });
```

`marquee.js` also runs `Marquee.init()` on import, so any `[data-marquee]` on the page is picked up. In SSR frameworks, import it only on the client.

## Behavior options

Set as `data-*` attributes or as the second constructor argument. Constructor options win over attributes.

| Attribute | Option | Default | Description |
|---|---|---|---|
| `data-speed` | `speed` | `50` | Cruise speed in px per second |
| `data-direction` | `direction` | `left` | Way the content travels: `left`, `right`, `up`, `down`. `up`/`down` switch to vertical |
| `data-hover-speed` | `hoverSpeed` | `0` | Speed multiplier while a mouse hovers. `0` pauses, `0.3` slows, `1` ignores hover, `3` speeds up |
| `data-draggable` | `draggable` | `true` | Pointer drag with inertia. `false` disables it |
| `data-reduced-motion` | `reducedMotion` | `stop` | `stop` halts auto-scroll when the OS requests reduced motion (dragging still works). `ignore` keeps scrolling |
| `data-easing` | `easing` | `8` | How snappy speed changes feel (hover, release, play/pause). Higher is snappier, lower is floatier |

Hover only applies to a real mouse. Touch input never triggers it.

## CSS variables

Set them on the element, a modifier class, a parent, or `:root`. The defaults have zero specificity, so your override wins regardless of stylesheet order.

| Variable | Default | Description |
|---|---|---|
| `--mq-width` | `100%` | Container width |
| `--mq-height` | `auto` | Container height. Required for vertical mode |
| `--mq-gap` | `48px` | Space between items, including the loop seam |
| `--mq-radius` | `24px` | Container corner radius |
| `--mq-bg` | `transparent` | Container background |
| `--mq-fade` | `10%` | Size of the fade at each end. `0%` disables it |
| `--mq-color` | `#ced1b0` | Text color |
| `--mq-font-family` | `inherit` | Font family |
| `--mq-font-size` | `20px` | Font size |
| `--mq-font-weight` | `600` | Font weight |
| `--mq-letter-spacing` | `-0.015em` | Letter spacing |
| `--mq-line-height` | `1.2` | Line height. Keep above 1 for large type or descenders get clipped |
| `--mq-img-height` | `26px` | Height applied to every `<img>` and `<svg>`. Width follows aspect ratio |
| `--mq-img-filter` | `none` | CSS filter on images, e.g. `grayscale(1) opacity(.6)` |
| `--mq-item-opacity` | `1` | Opacity of every item |

### Examples

```css
/* Pill chips */
.chips {
  --mq-gap: 12px;
  --mq-fade: 6%;
  --mq-font-size: 14px;
  --mq-color: #e8e6e1;
}
.chips > * {
  padding: 8px 16px;
  border: 1px solid #3d3a3a;
  border-radius: 8px;
}

/* Muted logo wall */
.logos {
  --mq-img-height: 32px;
  --mq-img-filter: grayscale(1) opacity(0.6);
  --mq-gap: 72px;
}

/* Hard-edged strip, no fade, no radius */
.strip { --mq-fade: 0%; --mq-radius: 0; }
```

Item styling is just CSS on your own elements. Use `.my-marquee > *` or give items a class.

## JavaScript API

```js
const m = new Marquee(el, options); // el: Element or selector
Marquee.init(root = document);      // init every [data-marquee], returns instances
Marquee.get(el);                    // instance for an element, or null
```

| Member | Description |
|---|---|
| `m.play()` | Resume. Clears a manual pause |
| `m.pause()` | Pause with an eased stop |
| `m.toggle()` | Flip between the two |
| `m.paused` | `true` when manually paused |
| `m.setSpeed(px)` | Change cruise speed |
| `m.setDirection(dir)` | Change direction, including switching axis |
| `m.update(opts)` | Merge any options at runtime |
| `m.refresh()` | Re-measure and rebuild clones |
| `m.destroy()` | Remove listeners and clones, restore your original markup |

Calling `new Marquee(el)` twice on the same element returns the existing instance.

Call `refresh()` after changing `--mq-gap`, font size, or item content from script. Resizes of the container or the item group are detected automatically, including images finishing loading.

```js
// Accessible pause control (WCAG 2.2.2)
btn.addEventListener("click", () => {
  m.toggle();
  btn.setAttribute("aria-pressed", String(m.paused));
});
```

## Recipes

```html
<!-- Reverse, slows to 25% on hover -->
<div class="marquee" data-marquee data-speed="40" data-direction="right" data-hover-speed="0.25">...</div>

<!-- Vertical (needs a height) -->
<div class="marquee" data-marquee data-direction="up" style="--mq-height: 280px; --mq-width: 220px">...</div>

<!-- Logos -->
<div class="marquee logos" data-marquee aria-label="Customers">
  <img src="/a.svg" alt="Acme">
  <img src="/b.svg" alt="Globex">
</div>

<!-- Never stops, even when hovered, not draggable -->
<div class="marquee" data-marquee data-hover-speed="1" data-draggable="false">...</div>

<!-- Two rows, opposite directions -->
<div class="marquee" data-marquee data-direction="left">...</div>
<div class="marquee" data-marquee data-direction="right">...</div>
```

### React

```jsx
import { useEffect, useRef } from "react";
import { Marquee } from "./marquee.js";
import "./marquee.css";

export function Ticker({ children, ...options }) {
  const ref = useRef(null);
  useEffect(() => {
    const m = new Marquee(ref.current, options);
    return () => m.destroy();
  }, []); // options changes: call m.update(options) in a second effect
  return <div ref={ref} className="marquee">{children}</div>;
}
```

The auto-init at the bottom of `marquee.js` is harmless in a client-rendered tree (it finds nothing). If React hydrates server-rendered `[data-marquee]` markup, delete that block: mutating the DOM before hydration causes a mismatch.

Do not let React own the children after init. The component moves them into its own wrapper. Static children are fine. For dynamic lists, `destroy()`, update the list, and construct again.

## How it works

1. On init, the children are moved into a `.marquee__group` inside a `.marquee__track`.
2. The group is measured. The component clones it `ceil(viewport / group) + 1` times so the visible window is always covered.
3. A `requestAnimationFrame` loop moves the track with a single `translate3d`, wrapping the position modulo the group size. Because the group includes a trailing gap, the seam is identical to every other gap.
4. Speed is a velocity that eases toward a target. Hover, pause, focus, release-after-drag and off-screen all just change the target, which is why every transition is smooth.
5. The loop stops completely when settled (paused or off-screen) and restarts on the next event, so an idle marquee costs nothing.

## Accessibility

- Clones get `aria-hidden="true"` and `inert`, so screen readers and Tab skip them. Original items stay normal.
- Auto-scroll stops while focus is inside the marquee, and under `prefers-reduced-motion`.
- Give the container an `aria-label` (and `role="region"` if it carries meaningful content).
- Moving content longer than five seconds should have a pause control. Wire one up with `m.toggle()` as shown above.

## Gotchas

- **IDs inside items are stripped from clones**, so the original keeps the unique ID. Clones are `inert` and never receive clicks or focus.
- **Listeners added to items after init** are not copied to clones. Attach them before constructing, or use event delegation on the container.
- **Vertical mode needs `--mq-height`.** Without it the container grows to fit and nothing scrolls out of view.
- **Zero-size content** (no items, `display: none` parent) renders nothing. It starts as soon as the element has a size.
- **Dragging** only starts after 4px of movement along the scroll axis, so clicks and vertical page scrolling on touch work normally. A completed drag swallows the click that would follow it.
- **Text is not selectable** inside a marquee (`user-select: none`) so drags do not select it. Override on `.marquee` if you need otherwise.

## Differences from the Framer original

- Matched: edge fade (10%), 24px radius, drag cursor, `pan-y` touch behavior, 20px/600/-0.015em type, `#ced1b0` color, 26px logo height.
- Dropped: Framer runtime and hydration, React, the analytics script, the badge, editor-bar loader, all `framer-*` classes and inline `will-change` styles on every item.
- The original's speed and gap lived in Framer's compiled component and could not be recovered from the export, so the defaults (50px/s, 48px) are tuned by eye. Change them to taste.
- The font size is rounded from 20.28px to 20px (a Framer scaling artifact), and the line height moved from 1 to 1.2 so descenders are not clipped.
- The original logo image was hotlinked from Framer's CDN, so the demo uses a plain inline SVG mark instead. Drop your own `<img>` or `<svg>` in as an item.
