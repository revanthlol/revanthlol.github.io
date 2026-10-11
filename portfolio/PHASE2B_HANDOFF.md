# Phase 2b local handoff

Preview: http://127.0.0.1:8767/

## Run

```sh
python3 portfolio/tools/serve.py --port 8767
```

Rebuild from the immutable Phase 2a snapshot:

```sh
python3 portfolio/tools/patch_phase2b.py
```

The script makes a temporary copy of `_phase2a_baseline/`, applies counted exact-string replacements, generates assets/pages, then publishes into `portfolio/`. Every text operation is logged in `tools/phase2b-replacements.json`; output hashes are in `tools/phase2b-output-manifest.json`. Captured responses and both baseline trees remain untouched. No commits or deployment.

## Where to edit next

- `tools/phase2b-projects.json`: one project record; `href` alone controls the primary card link. Outbound links are separate `links` entries. Removing GILD's record and rerunning removes its generated page/image and updates counts/sitemap.
- `tools/phase2b_components.py`: shared element trees used by prerendered HTML and bundled React. `SOCIALS` is the one-line-per-link list shared by Contact/footer. Add another tuple; it clones the same labelled link element and attributes.
- `tools/patch_phase2b.py`: runtime and matching HTML patches; detail generation is the separate Tier 2 block. It retains template CSS and layout classes but generates approved detail content without runtime/hydration scripts.
- `tools/phase2b_custom.css`: source for `assets/custom.css`. Focus rack variables `--focus-duration` and `--focus-blur` apply only to card images.
- `assets/projects/<slug>.webp`: replace one project file to update every placement. Recommended 1476x1164; masks use 123:97, object-fit cover. Four featured files also appear in the hero carousel.
- `tools/generate_phase2b_assets.py`: local seeded grayscale placeholders, share card and favicon. Re-running the full patch regenerates placeholders, so preserve supplied screenshots or change this generator before the eventual real-image swap.
- Portrait: no image generated. Restore the original About slot through its reversible patch, using `assets/about/revanth.webp`, recommended 1248x1560 for the 4:5 mask.
- `tools/reference/css-reveal-playground.html`: ignored reference, not served.

## Implemented

Home features LePrint, SlotForge, cyclr, erp. Projects lists all eleven. Every card links to its static detail route and has separate GitHub/live links where approved. Tags only Work in progress and Fork. GILD is demo-only, with no private language or repository data.

Approved hero/About/Contact/FAQ/footer text, socials, 24-item text-only Technologies marquee, three-line descriptions and Focus rack. Removed availability, Services, testimonials, rating/stat/client strips, form and old template routes. Designed static 404 is served directly and as the missing-route fallback. SEO metadata, Person JSON-LD, sitemap, robots, llms, local R favicon and 1200x630 share card generated.

## Actual checks

See `tools/phase2b-basic-results.json`. Brief Playwright loads covered Home, Projects, Contact, LePrint/GILD details and direct 404 at375px, plus Projects at1280px. Normal pages had zero console/hydration warnings/errors, external requests or unexpected404s. The deliberate missing nested route returned404 and the designed body; Chromium's resource error for that expected404 is recorded separately. Screenshots are under tools/basic-*.png. This was not the full requested verification matrix.

## Tradeoffs and deferred checks

Custom cards currently have no original Framer scroll-entry reveal. Hero copy is static; hero carousel and Technologies looping are CSS animations. Detail pages and 404 use normal document navigation with plain header/footer; no Framer route transitions, responsive JS variants or scroll/hover reveal variants. Native Home FAQ accordion and native navigation retain Framer logic.

Deferred to Rev: every route at375/768/1280/1920, slow scrolling, hover/keyboard/touch/reduced motion, FAQ opening, carousel/marquee loop feel, history/navigation, all metadata/link checks and comparisons against Phase2a screenshots. Basic checks do not establish those passes.

Original URL-map identities, unused captured CMS/compiled asset data and immutable snapshots remain for provenance. A repository-wide grep includes those and helper reports; do not mistake that for visible site content. Page-specific form rendering is removed; generic shared Framer form support can remain in retained runtime bundles, with no automatic external calls observed.

Publishing this folder as the GitHub Pages root is a later deployment step. The old root TUI is untouched. Share metadata uses local asset paths; live sharing should be checked after publishing.

## Latest visual correction

Rev rejected whole hero/footer/button/layout replacements. Repeatable script now restores native Framer hero, carousel, glowing pill button/hover, page-end CTA, responsive footer, About and Contact wrappers, keeping approved copy, links and removals. Helper: tools/restore_phase2b_native.py. Custom cards and Technologies remain approved exceptions; detail/404 pages retain the documented static runtime-free approach, with closer native footer/button CSS. Native restoration evidence: tools/native-restoration-results.json and restored-*.png. These supersede older screenshots and status describing custom hero/footer. Full detail-page matrix remains deferred.

## Latest critical patch

FAQ now says available for work, per Rev. Discord profile link added. Projects heading has superscript counts. Hero tablet mouse hover repaired; native hover copy is Let's chat. Original animated tabs restored as approved What I work on, Web apps/Browser tools/Linux utilities. Native captured navbar/footer are reused in static details/404 via tools/phase2b_static_shell.py; local mobile menu via assets/static-shell.js. Details match native title/description/fields/outbound button and include two More Work cards. Full60-route/width direct-load check passed with zero console/hydration errors/warnings,external requests,404resources,overflow; see critical-changes-results.json. Supplemental final interaction checks: critical-interactions-results.json. Static details still omit Framer page transitions and scroll reveals.

Supplemental interaction check verified actual visible tab images: Browser tools shows cyclr, Linux utilities shows typd, Web apps shows LePrint, with inactive image opacity0 and active opacity1, at all four widths. Static detail CTA shows Let's chat on hover. All detail navbar/footer links are rooted; copied Home #projects link is explicitly converted to /projects/. The superscript04 and available-for-work FAQ are present. Native Framer motion is retained for the repurposed tabs and homepage CTAs; no additional animation library was required for these existing interactions.

## Embedded original terminal

Rev approved reusing the old TUI before Projects, restyled in black/white/gray. Original root TUI files remain untouched. The repeatable patch copies them to terminal/ and patches the copy via tools/build_embedded_terminal.py; exact source replacement log is tools/terminal-replacements.json. A lazy same-origin iframe isolates the old global CSS, keyboard handlers, window controls and overlays from Framer. Startup autofocus and ambient idle screensavers are disabled; scrolling on touch does not focus the input. Tab on an empty command can leave the frame. The terminal uses local monospace fallback, with no Google Fonts call. Projects use the approved local11-entry data, including demo-only GILD; fake fallback repos, skill percentages, old fabricated filesystem entries and live GitHub fetch were removed in the copy. Bio/contact/filesystem match approved data. Legacy theme aliases map to monochrome; terminal commands remain implemented using the original registry. Root/main GitHub Pages cutover and deployment have not been performed.

Playwright evidence tools/embedded-terminal-results.json:375/768/1280/1920, terminal before Projects, no parent/frame horizontal overflow, no startup focus theft, zero console errors/warnings, external requests and404s. Verified help, whoami, neofetch, projects, cat project/email files, theme, autocomplete, history, Ctrl+L clear and empty-prompt Tab exit. Full easter-egg/window-control tests were not run. No commits.

## Latest image treatment

Project cards now use Scanner reveal from Rev's local CSS playground: fully
visible grayscale base, color layer revealed bottom-to-top, moving 3px white
beam, one-second reference easing. Matching static markup and runtime trees
contain both layers. Touch/mobile shows color immediately; reduced motion hides
the beam and disables the transition. Details remain sharp with grayscale/color
hover. Original Web Design photo is Web apps; supplied fiber-optic photo is
Browser tools; supplied workbench/penguin photo is Linux utilities. Compressed
tab files live in assets/work/. convert_work_images.py reads the supplied
captured image without changing captured/, and archives the PNG under ignored
tools/reference/. generate_phase2b_assets.py retains these choices on rebuild.
