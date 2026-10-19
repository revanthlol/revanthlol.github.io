# Editing the portfolio

The current site is a Framer export with shared editable components. It has not been fully migrated away from Framer. Keep `captured/` unchanged; it is provenance, not publishable source.

## Daily edits

| Change | Source |
| --- | --- |
| Technology names, marquee items, project cards, shared component copy | `assets/components/content.mjs` |
| Marquee speed, gap, sizing | `tech` tree in `content.mjs`, `.rev-technology-marquee` in `assets/refinements.css` |
| Shell width, responsive layout, dark palette | `assets/refinements.css` |
| Default theme | `assets/theme-init.js` (currently light) |
| Shared desktop and mobile navigation | `assets/components/site-header.html`, `assets/site-navigation.js`, `assets/navigation.css` |
| Corner expansion | `assets/corner-menu.css`, adapted from the supplied Desktop component |
| Theme switcher | `assets/theme-switcher.css` and `assets/preferences.js`, adapted from the supplied Desktop component |
| Theme toggle behavior | `assets/preferences.js` |
| Marquee behavior | `assets/marquee/marquee.js`, copied from repository `marquee/` with auto-init removed so React owns its lifecycle |
| Terminal commands and content | `terminal/script.js` and its imported modules |
| Terminal viewport and appearance | `terminal/embed.css` |

`content.mjs` exports a JSON-compatible tree: `[tag, properties, children]`. Edit strings and properties directly. The tiny `assets/phase2b-components.mjs` bridge renders these trees through the same React instance as the export. Do not install a second React runtime.

After editing component trees, sync prerendered HTML:

```sh
python3 portfolio/tools/sync_components.py
python3 portfolio/tools/serve.py
```

Visit http://127.0.0.1:8765/. The root repository `index.html` is the older terminal project, not the deployed portfolio entrypoint.

The old `patch_phase2b.py` and `build_embedded_terminal.py` scripts reconstruct earlier versions. Do not run them for normal editing: they can overwrite later work. `sync_components.py` updates only the current named slots and preserves unrelated changes.

## Structure and remaining Framer dependency

- Homepage runtime: `assets/framerusercontent.com/b9fc670378b67240f73e913e.mjs`.
- One shared `site-header.html` sits outside Framer’s hydration root on every public page. Desktop preserves the original navbar markup and visual treatment; mobile uses the supplied corner menu. Its scripts and CSS are shared by home, listing, contact, project details, terminal and both 404 documents. The old Framer navbar slot is disabled to prevent duplicate menus and route-dependent behavior.
- Router/bootstrap: `assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs`.
- Shared React instance: `assets/framerusercontent.com/8d44bc9696caad172d1da6d5.mjs`.
- Editable replacement slots: `home-projects`, `tech`, `hero-copy`, contact/social blocks, project list, and work tabs in `assets/components/content.mjs`.
- Hero gallery, FAQ and some page structure still use Framer. Their selectors are isolated in `refinements.css`; replacing those components is a separate migration.
- Theme tokens map the export's opaque token IDs to `--page`, `--surface`, `--ink`, `--muted`, `--line` in one place. Project screenshots retain their original artwork in either theme.
- Homepage no longer embeds the terminal. `/terminal/` is standalone and linked from the shared navbar. Its desktop width follows the same 1200px shell as the rest of the site.

## REA investigation

REA MCP analyzed copies of the served homepage module and replacement-component module without executing them. Evidence parent: `ev_bb145dc2c7925f603da8d9aff0621be54294122240acb8aee77872c12021b449`. Both files parsed, 183,554 text bytes, zero parse failures. Semantic graph coverage is partial: the homepage graph exceeded REA's result budget and dependencies outside the focused copy were not resolved. A first attempt over the entire assets directory exhausted the analysis worker's heap. This is a focused inspection, not proof of complete recovery or runtime equivalence.

Repository source inspection and Chromium checks supply the implementation evidence. Build the public artifact with:

```sh
python3 portfolio/tools/build_pages.py --output /tmp/portfolio-pages-review
```

The output directory must be empty. This stages public files and excludes captures/tools. Nothing is pushed or deployed by these commands.

## Verification of this refinement

`verification/refinements-results.json` records 60 route/width/theme combinations (320, 390, 768, 1024, 1440 and 1920px), plus staged-artifact route, metadata, theme persistence and terminal checks. The supplied marquee was exercised for auto movement, repeated-group seam spacing, pointer drag, pause/resume and reduced motion. Chromium viewport emulation was used; physical phones and Lighthouse were not tested.

Shell and navigation checks: `portfolio/tools/.venv/bin/python portfolio/tools/verify_shell.py` with the local server running. This checks actual navbar/content/footer edges at six viewport widths in both themes, the three work-tab accents, keyboard menu operation, theme persistence, and terminal input/maximising.

Current requested refinements: 1200px desktop shell including 404 and terminal, original navbar restored, 48px of desktop hero top space, 64px before Projects (28px and 48px respectively on mobile), R/Y Connect hover avatars with “Let's chat!”, hover-revealed marquee pause icon, and 2.5% project image zoom on fine-pointer hover. The existing Scanner reveal is retained; reduced motion disables the zoom. These latest changes are implementation-only at the user's request; browser/build checks have not been run.

## Supplied navigation components

`/home/rev/Desktop/corner-menu.html` supplied the corner expansion, menu surface, bars and spring easing. `/home/rev/Desktop/theme-switcher.html` supplied the three icon buttons, sliding indicator and circular theme reveal. Component CSS was copied without demo layout, sample contact information or embedded replacement fonts. The existing Geist family is retained.

Edit `assets/components/site-header.html`, then run `python3 portfolio/tools/sync_components.py` to copy the same header into every public page. All navigation uses absolute site paths: `/`, `/projects/`, `/#about`, `/contact/`, `/terminal/`. Internal Connect buttons stay in the current tab. Project details mark Projects as the current section. The mobile panel closes for navigation, Escape and desktop resizing, keeps focus inside while open, and locks background scrolling.

Theme preferences use `portfolio-theme`. Missing storage means Light, preserving the user's chosen default. System is an explicit stored choice that follows OS changes. Desktop and mobile switchers stay synchronized; the resolved mode always reaches the site's `data-theme` tokens before first paint.

The hero headline is now: Building things instead of accepting that the existing tool is “good enough.” Its original Framer `effect:Ca` word reveal, wrappers and breakpoint configuration are retained. Prerendered words are updated in every breakpoint variant. The old special rule forcing only the first word onto its own line is overridden so the longer copy wraps naturally.

This integration is not browser-tested or build-tested at the user's request. Existing earlier verification records describe prior versions.

The optional `tools/verify_shell.py` script was updated for the shared header and three-way theme controls. It has not been executed for this integration.

The shared desktop navbar now uses `site-brand`, `site-nav-links`, and
`site-nav-link` styles in `assets/navigation.css`; it does not depend on a
page's captured Framer styles. Edit `assets/components/site-header.html`, then
run `python3 portfolio/tools/sync_components.py` to copy it to every route.

`assets/site-background.js` mounts the supplied `tron-tiles.js` component only
in the two gutters outside 1200px. It updates its grayscale palette with the
resolved site theme and removes the canvases at smaller widths. The supplied
component retains its reduced-motion fallback and attribution header.
The gutter blending and latest navbar changes have not been browser-tested.

The gutter elements move out of the header into the body at startup, below
`#main`, so they cannot cover the hero entrance. The supplied tile component's
opt-in `global-pointer` attribute listens across the window and accepts pulse
origins outside its own box. Coordinates remain relative to each gutter so
waves travel outward from the actual click. Reduced-motion stays static.
Gutter tile opacity is 45% in light mode and 25% in dark mode.
