# Arjuna offline replica

Run from the repository root:

```sh
python3 portfolio/tools/serve.py
```

Open **http://127.0.0.1:8765/**. Stop with Ctrl+C. No build or server dependencies are required. This server treats `portfolio/` as the site root; the extracted runtime uses root-relative local asset URLs. Mounting it at `/portfolio/` on another server needs base-path work and has not been verified.

## Files

```text
portfolio/
  index.html                    Captured home page, URL substitutions
  contact/index.html
  projects/index.html
  projects/<captured-slug>/index.html  Three referenced project pages
  404/index.html
  assets/<original-host>/<URL-hash>.<mime-extension>
  remote/                       Static aliases for constructed CMS/icon URLs
  stubs/                        Offline URL map, image URL adapter, analytics no-op
  captured/                     Unmodified extracted response bodies and fetched originals
  url-map.json                  Original URL -> served local file
  tools/                        Scripts, inspection, inventories, local Playwright venv
  verification/                 Request/console logs, screenshots, pixel differences
```

221 URLs are mapped. Query strings participate in the hash; duplicate image encoding variants remain in `captured/`. The URL map selects the last captured response for a duplicated URL. Source code is not formatted or beautified.

## HAR findings

90 entries. Missing: failed analytics script (status 0) and editor API OPTIONS (204). The editor access API has a captured 404 response. No 206/304 responses or video responses. Five CMS binary responses contain Unicode replacement characters and byte lengths inconsistent with the HAR's advertised sizes. Their raw captures are retained; complete referenced CMS files were fetched as bytes and used for playback. The designed `/404` page was fetched and retained despite the live HTTP 404 status.

`tools/har-inspection.txt` lists every entry and summaries. `tools/source-map.json` locates original bodies separately from served files. All supplemental downloads were URLs referenced by captured source, imported modules, runtime requests, or linked pages; there was no site crawl.

## Exact deviations and stubs

- `events.framer.com/script?v=2`: local empty script. No analytics event transmission.
- `framer.com/edit/init.mjs`: exports a `createEditorBar` component returning null. Removes the authenticated editor iframe/API path, with no visible page-layout element removed in the compared screenshots.
- Served `api.framer.com` response files: empty JSON, excluding captured authentication material.
- Removed HTML preconnect/DNS-prefetch hints. Added an offline Content Security Policy to reject uncaptured connections.
- URL substitutions use a map and single-pass exact-string replacement. Static/dynamic module imports are resolved relative to their original module URL before replacement.
- Constructed CMS URL bases resolve against the local origin. The CMS reader maps image strings and can slice complete local CMS responses when a static server ignores byte-range query strings. The included server also supports combined range queries.
- Framer's responsive-image URL helper and a native image URL adapter resolve generated URLs through the same map, retaining responsive variants. Animation/layout functions were retained.
- Contact form has no configured submission action in this template. Filling its required fields and submitting produced no POST or external request. No form stub or fake success state was added.
- Social, booking, purchase and external credit links retain their original destinations. Following them leaves the offline site.

Captured editor API responses are ignored by Git and denied by this server. Do not publish `captured/` or `tools/`; the former contains original authentication responses. The `.venv` is ignored too.

## Verification

Playwright was installed in `tools/.venv`, using the existing system Chrome executable. `verification/results.json` contains every observed request, failed request, HTTP failure, console error/warning, hovered link and page dimension for local/live runs.

| Width | Local page height | Local requests | External requests | HTTP failures | Console errors | Warnings |
| --- | --- | --- | --- | --- | --- | --- |
| 375 | 7939 | 53 | 0 | 0 | 0 | 0 |
| 768 | 9317 | 53 | 0 | 0 | 0 | 0 |
| 1280 | 7373 | 53 | 0 | 0 | 0 | 7 |
| 1920 | 7373 | 55 | 0 | 0 | 0 | 5 |

Live and local page heights match at all four widths. No horizontal document overflow. The page was scrolled in 350px increments with waits, and visible links/buttons were hovered. Top and full-page screenshots were taken for local/live at each width. Desktop warnings are negative `blur()` spring keyframes; the live template produced the same warning class (3 at 1280, 7 at 1920). These source warnings were not repaired.

Visual comparison: typography, content, project artwork and layout match in reviewed desktop/mobile captures. Screenshots are not pixel identical: continuously moving carousels have different positions, and appear animations have different states in full-page captures. Top-frame mean absolute RGB differences (0–255) are 20.57, 5.46, 5.50 and 19.16 respectively. In the live 1920 top capture the hero carousel was still invisible, while it was visible locally; some headings were also in different reveal states in the live full-page capture. These are frame comparisons, not proof that every animation timeline matches. Separate user testing remains appropriate.

All six captured secondary routes loaded/scrolled without external requests or console/HTTP errors: contact, projects, three project details, and designed 404. The home contact link successfully navigated locally. Evidence: `verification/routes.json`. Valid contact-form submission was checked separately: `verification/form.json`.

36 reachable modules resolve. Four remaining concrete asset references are exclusively unused editor UI: `EditButton-JSBAOQB4.mjs`, `render-JJMTHWIT.mjs`, `editorbar.HHTQ5KZB.css`, and `sites/icons/writing-hand-favicon.png`. Exact URLs and referencing files are in `tools/referenced-but-missing.json`; all external literals are inventoried in `tools/external-reference-inventory.json`. No missing active asset was observed in tested routes/states. Source maps were not fetched.

Re-run checks while the server is running:

```sh
python3 portfolio/tools/check_assets.py
portfolio/tools/.venv/bin/python portfolio/tools/smoke.py
portfolio/tools/.venv/bin/python portfolio/tools/verify.py
portfolio/tools/.venv/bin/python portfolio/tools/verify_routes.py
portfolio/tools/.venv/bin/python portfolio/tools/verify_form.py
```

Re-extract from the HAR (overwrites generated portfolio files only):

```sh
python3 portfolio/tools/extract_har.py
python3 portfolio/tools/complete_assets.py
python3 portfolio/tools/rewrite_urls.py
python3 portfolio/tools/check_assets.py
```

No Git commit or deployment was performed. Existing portfolio files were not modified. Only `.gitignore` entries were added at the repository root.
