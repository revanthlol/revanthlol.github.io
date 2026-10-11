# Phase 2a report

## Run and repeat

Patched: http://127.0.0.1:8765/  
Baseline: http://127.0.0.1:8766/

```sh
python3 portfolio/tools/serve.py
python3 portfolio/tools/serve.py --port 8766 --root portfolio/_baseline
python3 portfolio/tools/patch_phase2a.py
portfolio/tools/.venv/bin/python portfolio/tools/verify_phase2a.py
portfolio/tools/.venv/bin/python portfolio/tools/verify_phase2a_routes.py
portfolio/tools/.venv/bin/python portfolio/tools/verify_phase2a_routes.py --baseline
portfolio/tools/.venv/bin/python portfolio/tools/content_inventory.py
```

The patch starts from a temporary fresh copy of the 229-file baseline and checks its SHA256 manifest before writing served files. Repeating it produced byte-identical output. Baseline and all 222 captured files passed unchanged-hash checks. No commit or deployment was made. Root changes are `.gitignore` additions only.

## Changes and evidence

169 literal replacement operations, 636 matched occurrences, 12 served files changed: seven route HTML files, three JavaScript modules, two search-index JSON files. Full old/new strings, counts and reasons: [replacement log](tools/phase2a-replacements.json). Exact filenames: [summary](tools/phase2a-summary.json). Helpers/reports live in `tools/`; dependencies are local to `tools/.venv` and `tools/node_modules`.

- Removed Remix/More Templates from SSR HTML and their shared runtime render call. Disabled the runtime badge-mount call and removed the SSR badge container. No CSS hiding fallback.
- Removed pricing section, nav/footer links, anchor metadata and separable search-index pricing data in both SSR and runtime. Remaining shared compiled pricing definitions/styles are dormant; removing dependency initialization would risk shared components. No pricing DOM or anchors returned after hydration, scroll or resize.
- Rebranded identity and textual metadata to Revanth, canonical/og:url to `https://revanthlol.github.io/`, contact email to `personallyrevanth@gmail.com`, and Twitter footer entry to GitHub/revanthlol.
- Renamed the marquee heading Technologies. Existing logos remain placeholders as requested.
- Measured Revanth in the loaded Geist font: advance 807.664px. Increased only the footer SVG viewBox width from 637.8 to 807.7, in SSR and runtime, to prevent clipping. This makes the footer word shorter vertically than the baseline because its text is longer.
- Saved 40 public GitHub repos with the requested fields to [github-data.json](tools/github-data.json). None is used in the site.

[Original Arjuna occurrence list](tools/arjuna-before.md) and [final occurrence list](tools/arjuna-after.md) include grouped context snippets. 53 occurrences remain: original template testimonial quotes and their component labels, plus URL-map keys/resolver provenance. Testimonials retain Arjuna to avoid assigning fake quotes to Revanth. Asset filenames, hashes, original URL-map keys and Framer internal component IDs remain intact. No captured manifest or JSON-LD existed; none was invented. Template OG image content remains for the later asset swap.

## Stubs

No new network stubs in this phase. Badge mount/render calls were neutralized at their source. Existing Phase 1 stubs remain: analytics `events.framer.com/script?v=2` is an empty local script, editor `createEditorBar` returns null, served API responses are sanitized empty JSON. The offline asset/CMS adapters and CSP remain unchanged. Original external social/credit links other than the supplied GitHub contact remain; explicitly following them can leave the site.

## Verification

Playwright used the local venv and system Chromium. Evidence: [home requests/console/DOM/resize logs](verification/phase2a/results.json), [secondary route checks](verification/phase2a/routes.json), [baseline route checks](verification/phase2a/routes-baseline.json), and screenshots in `verification/phase2a/`.

Home at 375, 768, 1280 and 1920: zero external requests, HTTP failures, failed requests, console errors, hydration errors or document overflow. All badge/promotion/pricing DOM checks passed after hydration and full slow scroll, then at 375/768/1280 after resizing. Hover interactions were exercised. Measured footer text fits at all four widths.

| Width | Baseline height | Patched height | Baseline warnings | Patched warnings |
| --- | ---: | ---: | ---: | ---: |
| 375 | 7939 | 6043 | 0 | 0 |
| 768 | 9317 | 7512 | 0 | 0 |
| 1280 | 7373 | 6318 | 7 | 4 |
| 1920 | 7373 | 6318 | 4 | 4 |

Warnings are Framer spring `filter: blur(negative-value)` keyframes. Counts vary with animation timing. Zero warnings was not achieved; the template emits these too. No new warning category was found.

All six secondary routes passed at all four widths: zero external requests, 404s, console errors or overflow; removed elements stayed absent. Some emit the same baseline blur warnings (31 baseline versus 24 patched occurrences across the 24 route checks; no new warning category). Content collection also opened mobile menus, service tabs and FAQs with no external/HTTP/console errors.

Visual comparison: remaining home section widths/heights match the baseline at every width. Expected differences are branding/contact/Technologies text, removed floating controls, pricing removal and downstream upward movement, the removed footer pricing row, and the fitted footer word. Animated carousel positions vary between captures. Full-page captures after returning to the top can omit off-screen reveal elements in both versions; in-view service/footer captures supplement them. No additional stable layout difference was found.

## Inventory and remaining work

[CONTENT_INVENTORY.md](CONTENT_INVENTORY.md) inventories text, images/responsive variants, graphics, forms, metadata and links across home plus all six secondary routes. It records static HTML, runtime chunk/CMS/search sources and flags template claims/placeholders. Expanded menus, service tabs and FAQ states are included; original removed pricing copy is preserved in an appendix.

Fake testimonials are retained by explicit request. Stock project case studies/metrics, portrait, availability date, designer/about/service/client copy, commercial FAQ/payment copy, contact Budget choices, other socials and placeholder logos await the content swap. These are not verified claims about Revanth. Pricing section/links are gone, but commercial wording elsewhere remains in this read-only inventory scope.

221 mapped URLs and all 36 reachable module references resolve. Four unused editor-only asset references remain from Phase 1; no new referenced asset gap was found in exercised page states. Captured authentication responses remain untouched and gitignored.

Skipped: deployment, commit, exhaustive combinations of every animation frame and form submission re-test in this phase. Risk: this is still template content, not publication-ready personal copy; baseline Framer blur warnings remain.
