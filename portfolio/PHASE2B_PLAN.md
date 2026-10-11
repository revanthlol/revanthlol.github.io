# Phase 2b: resumable content-swap plan

Status: implementation authorized by Rev's "ok fine continue for now lets check stuff later". Tier 2 static details selected as stated before implementation. Detailed visual/interaction verification deferred at Rev's request; basic load checks completed.

## Scope and standing rules

- Repository: `/home/rev/Documents/projects/revanthlol.github.io`. Work only in `portfolio/`, except adding `.gitignore` entries. No commits or deployment. Never modify `portfolio/captured/` (contains auth responses; gitignored).
- Preserve the template design, layouts, routing and animation where practical. No redesign, beautifying, or reformatting captured/minified source. Exact-string replacements with expected counts, logged file/old/new/count/reason.
- Implement repeatably in `portfolio/tools/patch_phase2b.py`, on top of reproducible Phase 2a output. Keep the pre-2b served tree as a separate immutable Phase 2a snapshot; `_baseline/` is the original pre-2a tree and must not be overwritten. Snapshot name still to be selected inside portfolio and ignored.
- All helpers/dependencies in `portfolio/tools/`. Phase 2a script is `tools/patch_phase2a.py`; its logs and baseline manifest are there. Existing server: `tools/serve.py`; default 8765, accepts `--root` and `--port`. Current preview: http://127.0.0.1:8765/ ; original baseline: http://127.0.0.1:8766/ . Verify running processes before reusing ports.
- No invented features, proficiency, users, clients, metrics, outcomes, ownership, paid-work claims or availability dates. Plain specific copy, no em dashes. Use public GitHub data only. Do not use private GILD data, even if authenticated `gh` can read it.
- Invoked skills: grill-me (installed wrapper requests an unavailable `Skill("grilling")`; the one-question interview is being followed directly), emil-design-eng, gpt-taste, design-taste-frontend. User's preserve-and-patch brief overrides conflicting redesign, library, random-layout and external-image directives. Ponytail mode remains active. No subagents requested.

## Approved decisions Q1-Q17

### Q1: public email

Source: Rev supplied `personallyrevanth@gmail.com` in Phase 2a, reconfirmed in Q1. Public, no obfuscation. Visible text and `mailto:personallyrevanth@gmail.com` on Contact/footer; use as Connect CTA fallback. Add email to Person JSON-LD. Remove purposeless duplicate search-index copies.

Phase 2a occurrences: index.html, contact/index.html, projects/index.html, 404/index.html, and the three captured project detail HTML files: 6 each. Shared main `assets/framerusercontent.com/e20b170e00af0a816fc7b3e2.mjs`: 6. Search JSONs `aa3809039f5a82dc2f229d25.json` and `315ac781d557ac9dded7ed8a.json`: 8 each. This describes pre-2b source occurrences, not 64 visible instances.

### Q2-Q4: project order and GILD

Home has the first four, in order. Projects page has all 11, same order; count `(11)` where the full collection is labelled. Home heading is approved as Selected projects (04); full list heading Projects (11).

| Order | Repo/slug (approved slug) | Display name | Category/tag (Q18 table authoritative) | Links/content rules |
| --- | --- | --- | --- | --- |
| 1 | LePrint / leprint | LePrint | Approved category in Q18 table | Public GitHub; README-supported copy |
| 2 | SlotForge / slotforge | SlotForge | Approved category in Q18 table | Public GitHub; README-supported copy |
| 3 | cyclr / cyclr | cyclr | Approved category in Q18 table | Public GitHub; README-supported copy |
| 4 | erp / erp | erp | Approved category in Q18 table | Public GitHub; README-supported copy; unofficial college portal wrapper |
| 5 | typd / typd | typd | Work in progress; category approved in Q18 table | Public GitHub; README only; user-supplied WIP tag |
| 6 | TextFX / textfx | TextFX | Approved category in Q18 table | Public GitHub; README-supported copy |
| 7 | focusd / focusd | focusd | Approved category in Q18 table | Public GitHub; say less where docs are thin |
| 8 | socialmesh / socialmesh | SocialMesh (display casing proposed) | Fork; category approved in Q18 table | Public GitHub; explicitly retain Shoutrrr attribution |
| 9 | omrealtor / omrealtor | omrealtor | Website | Public GitHub; exact Q5 copy only; no firm name |
| 10 | fresh360 / fresh360 | Fresh 360 (display casing proposed) | Website | Public GitHub + approved Live site; exact Q6 copy only |
| 11 | gild / gild | GILD (Great Indian Legal Diaries) | Website | Live demo only; no GitHub, language or stack |

Public GitHub URLs: `https://github.com/revanthlol/<repo>` with exact repo spelling from the first column. GILD is excluded from that rule. Its only outbound project link: `https://gild-two.vercel.app`, label `Live demo`.

GILD is approved now; the earlier pending-internship-boss gate is superseded and must not return. Keep the entire GILD entry as one separately removable patch step, including route/card/count effects. Do not read its private source again. Authenticated API reported private; unauthenticated API returned 404. No private metadata goes into project content, stack or language.

### Q5: omrealtor exact copy

`A static website concept for a property advisory firm, with area guides, service pages and contact information.`

Category Website. No firm name in card/detail/alt/metadata. No client, payment, ownership or "in use" claim. Public GitHub link. Rev may update this after it goes live.

### Q6-Q7: Fresh 360 exact copy and live link

`Website for Fresh 360, a Hyderabad drinks company I'm a business partner in. Three brands: Juicera, Fruizy and Fizzo.`

Category Website. Public GitHub link plus `Live site` -> `https://fresh360.vercel.app/`. Read-only check returned HTTP 200, title `Fresh 360 | Three ways to refresh`, with all three brand names. This is a homepage identity check, not a functional audit.

No phone numbers, addresses, support emails, testimonials, health claims, product copy, revenue, customer or usage claims from Fresh 360. Say only what is in the supplied one-liner. Public manifests may source global Technologies items; they must not expand Fresh 360's project narrative.

### GILD exact copy (Q4 update)

Name `GILD (Great Indian Legal Diaries)`.

`Landing page for a podcast on Indian law and criminal justice.`

Category Website. No client, paid or role claims. No pending gate and no missing-one-liner slot: Rev supplied it. Both fresh360 and gild one-liners are now resolved; earlier "needs a one-liner from Rev" requirements are superseded.

### Q8: hero and descriptions

Headline exactly: `Student. Open source developer.`

Subtext exactly: `I build web apps, browser tools and Linux utilities. Most of it is open source.`

Primary CTA `Connect` -> Contact. Check the headline wraps cleanly on two lines at 375/768/1280/1920; responsive adjustments must preserve copy. Reuse the same subtext for home meta description and og:description, with no new claims. Remove every book/call/schedule/hire CTA occurrence or repurpose to Connect. Remove the availability tag entirely, including `Available • End of Dec '25`; check hero spacing.

### Q9: remove Services

Remove the entire Services section, nav references/anchors/tab state and related imagery/data if separable. One reversible patch step; baseline kept. Rev may later reuse the tabbed layout for `What I work with`. No leftover `Services`, `Web Design`, `Framer Development` or `Branding` in served HTML/JS/metadata/search content. Source inventory may contain those original strings as evidence, and immutable baseline/captured data must remain intact. Exact scope of dormant shared generic runtime strings needs investigation rather than wholesale deletion.

### Q10: About and portrait

Heading `About me`.

Copy exactly:

`I'm Revanth, a student and open source developer based in Hyderabad. I build web apps, browser tools and Linux utilities, and I run Arch with Hyprland. I'm also a business partner in Fresh 360, a Hyderabad drinks company, and built its website.`

No other bio claims, school or employer names. Remove the portrait, do not generate a replacement. Layout must work at all four widths. Portrait removal is one reversible step; record original element and future image slot/dimensions. Use this copy in metadata/JSON-LD only where appropriate; Person name/url/GitHub sameAs, omit jobTitle. Q15 later expands sameAs to approved URL-based socials; Q1 adds email.

Original portrait: inside `section#about.framer-1itna2s`, image `assets/framerusercontent.com/b94bba962e2412cb54f1294d.png`, intrinsic 1246 x 1652. Future proposed slot `assets/about/revanth.webp`, recommended 1246 x 1652; no file generated this phase. Exact image-container node/class and rendered box ratio still need recording.

### Q11 and Q15: Contact and socials

Contact heading `Connect`. Updated text (Q15 supersedes Q11): `Email me or find me on GitHub and elsewhere.`

Visible `personallyrevanth@gmail.com` -> mailto, so users can copy it. Remove form, Budget field, commercial copy, page-specific form scripts/endpoints. No leftover budget/project type/send message source content. Do not rip out shared Framer internals without inspecting dependencies. Preserve Contact layout/animations. Adding a social should be one line of data/patch input; record the element to clone.

Same social list in Contact and footer, in this order:

| Label | URL/text |
| --- | --- |
| GitHub | https://github.com/revanthlol |
| X | https://x.com/revanthlol |
| Instagram | https://www.instagram.com/revanthloll/ |
| Reddit | https://www.reddit.com/user/ocusii |
| Pinterest | https://in.pinterest.com/ocuslol/ |
| Discord | plain text `ocusi`, no URL |

Instagram confirmed (two l's), no further confirmation. URL-based socials: text labels, descriptive aria-label, target=_blank, rel="me noopener noreferrer"; local icons or text-only fallback. Discord copy-to-clipboard only if cheap, otherwise plain selectable text. No external requests on page load; deliberate outbound navigation is distinct from automatic loading. Add URL-based socials to Person sameAs, not Discord.

### Q12-Q14: four FAQ items

Keep the existing accordion and open/close animations; template currently has five questions, remove the fifth in the same patch.

1. `Are your projects open source?`
   `Most are public on GitHub, and each project page links to its repository. Some are demo-only.`
2. `Are you available for freelance or paid work?`
   `I'm a student and I'm not taking paid or client work right now. If you'd like to talk about something, you can reach me through the Connect page.`
3. `Can I contribute or report a bug?`
   `Yes. Open an issue or a pull request on the project's GitHub repository.`
4. `What do you build with?`
   `The primary languages across my repos are HTML, Java, JavaScript, Kotlin, Lua, PHP, QML, Rust and TypeScript. I run Arch Linux with Hyprland.`

The Q14 wording above supersedes earlier Q13 wording. No rankings/proficiency, response-time promises, dates or extra contact details. No FAQPage JSON-LD found in served HTML. Do not add one by assumption. Remove old timelines, revisions, payments, agencies, pricing and process copy. The approved FAQ itself mentions paid/client work to decline it, which is intentional.

### Q13-Q14: Technologies marquee

24 approved items: HTML, Java, JavaScript, Kotlin, Lua, PHP, QML, Rust, TypeScript; React, Next.js, Node.js, Python, FastAPI, Supabase, Three.js, Tailwind CSS, Tauri, Linux, Arch Linux, Hyprland; Vite, Express, PostgreSQL.

No ranking, proficiency or expert labels. Local logos only (Simple Icons/CC0 where available, text fallback otherwise), no external requests. Keep one loop reasonably quick with 24 items; test speed, spacing, looping, pause/hover and touch/reduced-motion behavior at every width. Exact duration is a tuning choice, not yet measured.

| Tool/framework | Public source repo | Source file/evidence |
| --- | --- | --- |
| React | LePrint | frontend/package.json: react |
| Next.js | TextFX | package.json: next |
| Node.js | LePrint | backend/package.json: engines.node |
| Python | SlotForge | README.md: Python 3.12+ requirement |
| FastAPI | SlotForge | backend/requirements.txt: fastapi |
| Supabase | SlotForge | frontend/package.json: @supabase/supabase-js |
| Three.js | TryonKit | packages/web/package.json: three |
| Tailwind CSS | erp | package.json: tailwindcss |
| Tauri | focusd | gui/src-tauri/Cargo.toml: tauri |
| Linux | typd | README.md: Linux requirement |
| Arch Linux | typd | README.md: Arch Linux (AUR) installation |
| Hyprland | dots-hyprland | README.md |
| Vite | erp | package.json: vite |
| Express | LePrint | backend/package.json: express |
| PostgreSQL | LePrint | README.md stack |

Language sources: `tools/github-data.json` (40 public repos saved in Phase 2a), primary-language fields only. Tauri's manifest is newer/different from focusd README's old Iced-dashboard wording; final project feature copy stays conservative and must not silently resolve that discrepancy.

TryonKit was rechecked: private=false, visibility=public. SlotForge also public. Its complete recursive main tree was not truncated and had no Flutter-named paths, pubspec files or .dart files. Flutter remains dropped; any new source must be reported and separately approved before adding it.

### Q15: footer and 404

Keep large Revanth wordmark. Email visible with mailto. Footer nav Projects, About, Connect, **404** (keep template link). Copyright exactly `© Revanth`, no year. Remove Made by Velox Themes credit, logo and link. No leftover Velox/Made by/template footer strings in active served source. Social list above replaces earlier GitHub-only proposal. User explicitly instructed credit removal; do not reinstate a speculative approval gate.

404: retain design, add `<meta name="robots" content="noindex">`, exclude from sitemap, support both `/404/` and unknown URLs. Create `portfolio/404.html` for GitHub Pages root fallback when portfolio is the publishing root. Repo-root 404.html is outside scope. Local server needs equivalent fallback, correct status and root-relative assets at nested unknown URLs. Actual deployment to make portfolio the publishing root is outside this phase; do not claim the existing root TUI has been replaced.

### Q16: collection architecture, fallback and detail structure

Investigated sources:
- Project collection has four typed binary records in .framercms chunks + binary indexes, not plain JSON-only data.
- Generated collection reader `assets/framerusercontent.com/aba02741a571e35654223869.mjs`; facade `0dd1bb04ad06400c13a00a00.mjs`; rich text `625db3980b4570324a06432c.mjs`.
- Main route map `e20b170e00af0a816fc7b3e2.mjs`: `/projects/:JAY0WjSmm`, collectionId G6CQli_2A, shared detail component `42f270154bab0bea1700f521.mjs`.
- Projects page chunk `9b477f352fe32a876a1167cd.mjs`: pageSize 4, load-more/paginated query. Home chunk `b9fc670378b67240f73e913e.mjs` also queries the collection.
- Only three detail HTML pages captured (Bima/Mandala/Batavia). Fourth CMS card points to Blockhaus; that HTML wasn't captured. Do not assume all four original detail files exist.
- Static HTML and hydrated runtime must agree. Cardinality changes need collection records, selection limits/count labels, route slugs and prerender output changed together.
- Detail template outbound project CTA does not intrinsically require GitHub. GILD can use that CTA as Live demo; no GitHub button should be generated.

**Spike result and selected choice:** `tools/spike_phase2b.py` uses browser request overrides only, without changing served files. Its first completed viewport (375px) rendered 11 records and round-tripped all 11 slug/id lookups. The copied SSR card markup did not hydrate cleanly: Framer reported React recoverable warnings #418/#422. This does not prove native CMS expansion is impossible, but the experiment does not meet the zero-hydration-warning requirement. Detail navigation in the first run timed out because the test selector required a trailing slash that runtime hrefs omit; no conclusion about detail feasibility follows from that timeout. Evidence: `tools/phase2b-spike-results.json`.

Rev then directed: "fuck the cards then lets make our own one if this sucks". **Select custom static project cards for Home and Projects.** Stop pursuing the native CMS card grid. Keep the requested Focus rack effect, template sizing/spacing/type/radii, four selected home items and 11 full-list items. The rest of the site is not authorized for a wholesale rebuild. Final plan approval still precedes applying changes to the served tree. Q18 below settles card fields and detail-page structure.

Pre-approved fallback: rebuild **only** home/Projects project-card grids as static markup + CSS matching exact card dimensions, spacing, typography/radii. Preserve scroll-in reveal cheaply if feasible; otherwise report the specific lost animation. Do not rebuild the rest of either page. Fallback for detail routing is still unresolved if the native detail component cannot accept new records safely; propose it and its costs instead of guessing.

Q18 below supersedes the earlier proposed detail structure and defines the approved mapping.

### Q16 follow-up: Focus rack card interaction

Reference `portfolio/css-reveal-playground.html` is ~11 MB with embedded images. Read only with base64 data stripped; do not cat or dump it whole. Reference confirmed effect 11:
- Wrapper overflow:hidden, dark background #000.
- Rest: opacity .25, filter blur(18px) brightness(.6), scale(1.08).
- Hover: opacity 1, filter none, scale(1).
- Transitions: filter/opacity/transform .85s ease.

One reusable class in `portfolio/assets/custom.css`, linked from every page head, not injected into minified JS. Expose duration and blur variables. Gate blurred rest effect with @media(hover:hover); touch images sharp. Card-link focus-visible/focus-within also sharpens. Under reduced motion: no transition, no blur, image sharp. No !important or arbitrary z-index.

DOM source: card component `assets/framerusercontent.com/12e83545c455d886f0604cbc.mjs`, `.framer-Ly6lP`; mask `.framer-qs9x1t`, image `.framer-sfg539`. Existing image hover variant `"aKHwsGuJG-hover":{scale:1.1}` exists; remove/neutralize the old image effect before applying Focus rack, do not stack. Inspect other hover shadow/icon variants to decide if they interfere. Detail images sharp.

Move playground to `portfolio/tools/reference/css-reveal-playground.html` and add to .gitignore when applying the approved work. Reference must not deploy/commit. Until implementation approval it remains untouched.

### Q17: deterministic placeholders and hero carousel

One grayscale abstract placeholder per project, no fake UI, brands, mockups, devices or baked text. Generate locally in a deterministic tools script using fixed seeds and PIL or SVG; output WebP <=100 KB each. No external generation services or requests. Reuse each file for card/detail; featured four also hero carousel. object-fit:cover supports arbitrary future screenshot ratios.

Actual mask CSS: aspect-ratio **1.268041237113402 / 1 = 123:97**, not 4:3. Read-only Playwright measurement of first home card after hydration:

| Width | Image mask width | Height |
| --- | ---: | ---: |
| 375 | 319 | 251.5625 |
| 768 | 712 | 561.484375 |
| 1280 | 696 | 548.875 |
| 1920 | 696 | 548.875 |

Recommended source image **1476 x 1164** (123:97), enough for about 2x the widest measured slot. This recommendation is derived from the template, not a redesign. Projects-page mask uses the same component; verify actual rendered widths before finalizing.

| File under portfolio/ | Reused slots | Recommended screenshot size |
| --- | --- | --- |
| assets/projects/leprint.webp | Home card, Projects card, detail, hero carousel | 1476 x 1164 |
| assets/projects/slotforge.webp | Home card, Projects card, detail, hero carousel | 1476 x 1164 |
| assets/projects/cyclr.webp | Home card, Projects card, detail, hero carousel | 1476 x 1164 |
| assets/projects/erp.webp | Home card, Projects card, detail, hero carousel | 1476 x 1164 |
| assets/projects/typd.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/textfx.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/focusd.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/socialmesh.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/omrealtor.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/fresh360.webp | Projects card, detail | 1476 x 1164 |
| assets/projects/gild.webp | Projects card, detail | 1476 x 1164 |

Replace **all** branded template monitor mockups in the hero carousel with the featured four placeholders. Retain/recheck carousel looping and animation. Do not leave original template image srcset variants that can reload old imagery at another breakpoint. Alt text describes a neutral placeholder for the corresponding project, not a fabricated screenshot. Share card and favicon slots are approved in the batch review below.

## Public research completed

- Read public READMEs for cyclr, LePrint, SlotForge, erp, TextFX, omrealtor, socialmesh, typd, focusd. fresh360 README is empty; GILD is private and has no public README. Do not use private contents.
- SlotForge docs describe working scheduling features and separately coming-soon domains; never claim roadmap features are implemented.
- cyclr README currently supports Chromium **and Firefox**, newer than saved repo description.
- erp README describes an unofficial educational college portal proxy; no affiliation claim.
- SocialMesh README explicitly community fork of Shoutrrr preserving upstream history and applying branding; do not imply sole authorship.
- Fresh 360 user-supplied copy supersedes empty README. Omrealtor supplied concept framing supersedes README's production-site wording and company name.
- Data file `tools/github-data.json` is public-only normalized Phase 2a data, not automatically current. Save refreshed public evidence only once authorized; repo metadata must be checked for private visibility before source reads.

## SEO baseline and proposed work (needs final copy/route approval)

Already present: per-route title tags, meta descriptions, canonical, OG/Twitter tags and template share assets; designed 404. Phase 2a canonical/og:url all point to home, so final secondary routes need their own canonical URLs. Captured served HTML contains no Person/FAQPage JSON-LD or manifest. Existing metadata still contains template branding/client wording and must be rewritten.

Required final artifacts under portfolio: sitemap.xml (exclude 404), robots.txt, llms.txt, favicon, Person JSON-LD with real info only, local OG/share assets and metadata for home, Projects, Contact, each project detail and 404. Explicit noindex on both 404 forms. Unknown URL response behavior must match direct /404/ content.

Proposed route structure: `/`, `/projects/`, `/contact/`, `/projects/<lowercase-slug>/` for all 11, `/404/`, `/404.html`. Keep About as `/#about`; no separate About route assumed. All lowercase slugs in the project table are approved by Q18.

Home description/OG description exact hero subtext. Project descriptions use only approved/README-supported copy. Fresh 360/GILD/omrealtor supplied descriptions must not be expanded for SEO. Person: name Revanth, url https://revanthlol.github.io/, email mailto or raw email schema value as appropriate, sameAs URL socials above; omit jobTitle. Title pattern, secondary descriptions and local favicon/share design are approved in the batch review; omit Person address/description fields. Do not invent school/employer/legal business schema.

## Verification plan after implementation approval

- Every route, all widths 375/768/1280/1920, including 11 detail routes, /404/ and nested unknown URLs: collect every request/status/failure, console errors/warnings, hydration messages, overflow, metadata/canonical. Automatic load has zero external requests and zero unexpected 404s. A deliberately unknown route should return HTTP 404 with designed content; distinguish this expected response from missing assets.
- Scroll through slowly, hover/keyboard focus interactive elements, open/close all four FAQ items, Contact/footer social href/target/rel/aria labels and visible copy, carousel loops, 24-item marquee speed/spacing/pause behavior. Check reduced-motion and touch sharp-card rendering.
- Card at-rest/hover screenshots at all four widths; keyboard-focus evidence; compare before/after screenshots against **Phase 2a** snapshot on another port, not original `_baseline`.
- Check exactly four home cards in approved order, 11 Projects entries in order, typd WIP and SocialMesh Fork tags, GILD demo-only, no private metadata. Hero exactly two lines, availability gone, Services/testimonials removed, About no portrait, Contact no form.
- Grep active served content for Arjuna, pricing, testimonial, Logoipsum, lorem, template-brand strings, Services/Web Design/Framer Development/Branding, budget/project type/send message, old commercial FAQ copy, Velox/Made by. List any unavoidable provenance-key/shared-runtime exceptions explicitly. Do not modify immutable captured/baseline files to make a repo-wide grep pass; logs/plan necessarily quote removed strings.
- Phase 2a warning baseline: Framer emits invalid negative blur() spring keyframes. Phase 2b requested zero console/hydration errors; report warnings honestly and compare categories/counts, do not claim zero warnings if they remain.
- Assert patch repeatability, source hashes baseline/captured unchanged, URL-map original identity keys preserved, imports resolve, placeholders dimensions/size deterministic, reference ignored/not served. No commit/deployment.


## Q18: final card and detail architecture

This section supersedes earlier tentative card/detail wording. Implementation remains unapproved.

### Custom cards

Replace only the Home and Projects card grids. Image and project name form one detail-page link. Description follows outside that link, clamped to three lines, aiming for 110 characters. Category and approved tags are plain labels. Separate outbound text-link row follows; no nested anchors. Focus rack affects the image only. Template sizes, typography, spacing and radii remain the reference. Preserve the scroll reveal if feasible; disclose any lost animation.

Patch the runtime card component to consume the same static data array used to generate pre-rendered cards. SSR-only markup replacement is prohibited. Client injection is a fallback only if this fails, requires disclosure and a clean hydration test. No claim that the custom renderer has passed yet.

### Proposed categories and card descriptions for approval

| Project | Category | Description |
| --- | --- | --- |
| LePrint | Web app | A QR-based print, scan and copy kiosk system with a web interface and a local printer agent. |
| SlotForge | Web app | An academic timetable app that models scheduling constraints and generates schedules with OR-Tools. |
| cyclr | Browser extension | A keyboard-driven tab switcher for Chromium and Firefox, with previews and configurable shortcuts. |
| erp | Web app | An unofficial interface for a college student portal, with attendance, results and profile views. |
| typd | Linux utility | A Wayland virtual keyboard with a draggable, resizable interface and on-screen key feedback. |
| TextFX | Developer tool | An animated SVG text generator with per-line fonts, colors, timing and cursor controls. |
| focusd | Linux utility | A Linux window-time tracker with local SQLite storage and support for Hyprland and X11. |
| socialmesh | Web app | A community fork of Shoutrrr, an open source app for self-hosted social publishing and scheduling. |
| omrealtor | Website | A static website concept for a property advisory firm, with area guides, service pages and contact information. |
| Fresh 360 | Website | Website for Fresh 360, a Hyderabad drinks company I'm a business partner in. Three brands: Juicera, Fruizy and Fizzo. |
| GILD (Great Indian Legal Diaries) | Website | Landing page for a podcast on Indian law and criminal justice. |

The three supplied descriptions remain exact. Fresh 360 exceeds the approximate card character target; preserve the text and clamp visually rather than silently shorten it. Only typd has `Work in progress`; only socialmesh has `Fork`. No other badges or skill claims.

### Detail pages: approved structure, feasibility unresolved

Keep the template detail layout, all 11 approved lowercase routes. Shared data drives both prerender and runtime. Header fields: CATEGORY from the fixed vocabulary; LANGUAGE from tools/github-data.json; LINKS as separate GitHub/live anchors. GILD omits Language and GitHub. Fresh 360 and omrealtor show Category and Links only. Outbound button `View on GitHub`, except GILD `View live demo`. Description paragraph plus a brief documented feature summary, one sharp project placeholder hero; remove legacy case-study text, metrics, galleries and mockups. Tags match cards. FAQ answer 1 remains exactly approved.

Proposed feature-summary scope: LePrint QR upload/local printer and scanner agent/job status; SlotForge scheduling constraints/OR-Tools generation/conflict inspection/exports; cyclr keyboard navigation/previews/configurable shortcuts/tab closing; erp attendance/results/profile/unofficial portal interface; typd keyboard/drag and resize/Wayland requirements; TextFX per-line text styling/typing and deletion/cursor controls/SVG export; focusd local SQLite tracking/CLI reports and export/Hyprland and X11 (no GUI claim); socialmesh self-hosted publishing/scheduling/workspaces, retaining Shoutrrr fork attribution. Last three use only their supplied paragraph, with no extra feature summary. Validate against public READMEs again before generating final data.

Detail pages are a separate removable patch step after cards; GILD remains one separately removable entry step. Each detail has `{project name} | Revanth`, approved description, own canonical and OG/Twitter metadata, and sitemap entry. Approved old-template handling: remove Bima, Mandala, Batavia and Blockhaus routes and files; requests fall through to the designed 404. No redirects.

### Revised detail spike: FAIL, not proof of impossibility

Helper: tools/spike_phase2b_details.py. Evidence: tools/phase2b-detail-spike-generation.json and tools/phase2b-detail-spike-results.json. Browser request overrides only; checked served-source hashes remained unchanged. React 18.2 server renderer generated Projects plus all 11 detail HTML bodies from the same runtime fixture collection. This tested fixture expansion, not final content or final custom cards.

At 375px, LePrint direct load, reload, card navigation, back and forward completed, but emitted 45 recoverable hydration warnings (including React #418). One image returned 404 at `/projects/assets/framerusercontent.com/38899e11884aa2f0c84cbc4c.avif`. Card navigation incorrectly reached `/projects/projects/leprint` due to the existing relative href. Zero automatic external requests in this run. Stopped at the first failing route: remaining ten routes and widths 768/1280/1920 were NOT tested. Generating all 11 files does not prove they hydrate cleanly. The browser server-render experiment does not establish equivalence to Framer's production prerender environment; mismatch root cause remains unresolved. Neither warnings nor errors were suppressed.

Per Q18, do not apply or improvise around this failure. Proposed fallback, awaiting Rev's choice: custom cards link directly to public GitHub or approved demo/live URL, with no new detail pages. Cost: lost internal detail navigation, per-project SEO/body/image pages and eleven sitemap entries; visitors leave the portfolio. This fallback contradicts the requested preferred detail experience and is not selected automatically. Alternative decision: authorize further isolated diagnosis of the SSR/runtime mismatch before choosing a fallback. No served edits in either case without final approval.

## Batch approval: remaining decisions 3 to 8

Items 3 to 8 and all 11 categories/descriptions are approved, subject to the review amendments below. Detail feasibility is a separate unresolved gate.

3. All 11 visible on Projects, no pagination. Headings `Selected projects (04)` and `Projects (11)`. Lowercase slugs approved. Remove old template project routes; designed 404, no redirects. Keep About at `/#about`.
4. Proposed live links, each homepage identity checked with HTTP 200, not functionally audited: LePrint https://leprint.in/ ; SlotForge https://slotforge-main.vercel.app/ ; cyclr https://cyclrr.vercel.app/ ; erp https://erp-la.vercel.app/ ; TextFX https://textfxsvg.vercel.app/ . Recommend labels `Live site`. Fresh 360 and GILD links already approved. typd/focusd/socialmesh/omrealtor remain GitHub-only. Do not add new live links without this approval.
5. Titles: `Revanth | Student and open source developer`, `Projects | Revanth`, `Connect | Revanth`, `Page not found | Revanth`; detail titles as above. Projects description `Web apps, browser tools, Linux utilities and websites by Revanth.` Contact description `Contact Revanth by email or through public social profiles.` 404 description `The requested page could not be found. Browse projects or return to the home page.` Home exact approved subtext for meta/OG/Twitter. Newly drafted descriptions have no pronouns. Preserve already approved exact first-person Hero/About/FAQ/Fresh 360 copy as explicit exceptions; otherwise the no-pronouns rule conflicts with prior approvals. Person JSON-LD name/url/email/sameAs only, no jobTitle or invented business schema. Local text-only R monogram favicon and deterministic grayscale 1200x630 share card using Revanth and approved hero headline. sitemap includes /, /projects/, /contact/ and all 11 detail pages if feasible, no 404. robots references canonical sitemap; llms.txt contains factual approved summary and public page links. 404 heading `Page not found`, body `The page does not exist or has moved.`, home and Projects links, noindex, consistent direct and fallback behavior.
6. Page-end CTA heading `Get in touch`, button Connect to Contact. Keep FAQ section heading `Things people often ask`. Footer approved Q15 copy/socials unchanged.
7. Remove all testimonial/rating/stat/client-logo-strip content and separable component/CMS data, retaining only the approved Technologies marquee. Current source scan confirms remnants still exist: home HTML 18 `testimonial`, 1 `rating`, 5 `clients`; home runtime 21 `testimonial`, 3 `rating`, 2 `clients`, 3 `120+`. These are substring evidence, not counts of visible sections. Zero literal Logoipsum in those files does NOT prove the image logos are absent. Audit their image references and runtime renderers during removal; prove absence in DOM, active source/search data and screenshots. Immutable baseline/captured/log evidence remains untouched. Never remove generic numeric strings like 5.0 indiscriminately.
8. Portrait slot: original image under section#about.framer-1itna2s; select the descendant image whose src contains b94bba962e2412cb54f1294d.png, preserve its layout wrapper for the reversible patch. Image's immediate wrapper has no class or data-framer-name. Future `assets/about/revanth.webp`; original intrinsic 1246x1652, rendered mask 4:5: 311x388.75 at375, 704x880 at768, 332x415 at1280/1920. Recommend a 1248x1560 portrait screenshot/photo for the mask; no replacement generated now. Projects masks measured after hydration: 311x245.25 at375, 704x555.1875 at768, 696x548.875 at1280/1920. Card CSS ratio123:97 and recommended1476x1164 project assets remain correct. Evidence tools/phase2b-measurements.json. Details use object-fit:cover; card and detail placements reuse the same file, even if their display masks differ.

## Approval and execution gates

- This is the full review plan, not authorization to modify served files.
- Rev must choose how to proceed after the failing detail spike and approve categories/descriptions, batch defaults and final plan.
- After approval: snapshot current Phase 2a served tree as portfolio/_phase2a_baseline/ and ignore it; write repeatable patch_phase2b.py with expected-count assertions and logs; reversible Services/portrait/card/detail/GILD steps; generate local assets; update shared SSR/runtime data and all active metadata/search references; move and ignore the reference playground; run the full verification matrix already specified above.
- No deployment, root publishing config changes or commits. Do not claim clean hydration, final card interactions, final screenshots or complete remnant removal before checking the applied implementation.

## Latest review approvals and bounded diagnosis

- All 11 categories and descriptions approved. Description clamp is THREE lines, not two. Verify full sentences remain visible at 375/768/1280/1920; CSS line clamp alone does not guarantee no truncation. If any approved paragraph exceeds three lines, report and adjust typography/card text width within the existing design or obtain a copy decision, never silently shorten exact copy.
- Old template Bima/Mandala/Batavia/Blockhaus routes are removed, not redirected; designed 404 handles them. They were never live on this domain.
- Five proposed Live site links approved, separate row items only. Card primary href always comes from one `href` field per project in the shared static array. Switching detail/external destinations is a one-line field change; external row links remain independent. Default href `/projects/<slug>/`, pending detail-tier choice.
- socialmesh README explicitly identifies coollabsio/shoutrrr as upstream, even though GitHub API marks socialmesh fork=false and supplies no parent. Read the linked actual upstream README, not a similarly named library. Public source https://github.com/coollabsio/shoutrrr/blob/main/README.md ; saved evidence tools/socialmesh-upstream-readme.md. That source describes an open source, self-hosted social media publishing and scheduling tool, with connected accounts, drafts, recurring queues and a calendar. The approved SocialMesh description is supported; retain Shoutrrr attribution and Fork tag. No memory-derived product description.
- Further isolated diagnosis authorized, not site implementation. Golden original Bima first, compare normalized markup as well as raw bytes. Original typed record and collectionItemId oX6xGCnGd, no fixture content substitution. Report structural/attribute/URL/srcset/ID/comment/text differences.
- Fix root-relative generated links and assets before a LePrint-only 375px test. At most three focused attempts, no 11x4 matrix until zero hydration warnings. If still failing, stop and propose tier 2, not tier 3 automatically.
- Tier 2 proposal: static detail pages using the template's markup/CSS but loading no Framer runtime. Plain CSS header/footer. Losses and reproduction scope must be inventoried before approval; no forced client injection or suppressed warning counts.
- Tier 3 remains last resort: cards link directly to GitHub/demo. Independent card href field prevents detail feasibility from blocking other content work, once the final plan is approved.
- Final plan approval remains required before any served file edit.

## Golden test and capped diagnosis: latest result (supersedes earlier FAIL gate)

Evidence: tools/phase2b-golden-results.json, tools/golden-bima-generated.html, repeatable isolated helper tools/diagnose_phase2b.py. Served-source hash assertions passed; no served files changed.

Original record golden: generator consumed the unmodified collection, Bima slug and original collectionItemId. Captured Bima control at375 produced ZERO recoverable hydration warnings. Captured #main content was73,254 characters/1,147 parser tokens; generated44,142/745. With whitespace discarded and attribute order sorted,25 changed regions remain. Therefore this browser-based server renderer does not reproduce the captured production prerender.

Diff categories:
- Responsive branch structure: captured nav2/footer2/images12/divs314; generated nav1/footer1/images7/divs195. Captured includes both phone and desktop SSR variants; the browser renderer selects its viewport. This is the major structural mismatch.
- Attributes: hidden-breakpoint classes differ; empty alt/data attributes serialize as bare versus empty-string values. Attribute order is normalized out of the comparison, so it cannot explain the25 remaining regions.
- URLs: captured local asset paths are ../../assets; runtime-generated src uses /assets. Generated srcsets still contain original framerusercontent image URLs in ORIGINAL Bima data, while captured SSR srcsets are local. Golden generation alone is not an offline artifact.
- Image attributes: generated sizes is viewport-specific rather than a multi-media-query expression; some loading=lazy and style attributes differ.
- Suspense: both use completed React boundary comments, but branch removal changes their count and position. Captured has53 completed opening/closing pairs; generated34. Raw evidence records exact counts. No pending streaming markers were observed in these two outputs.
- IDs: both outputs contain the same explicit IDs, overlay and template-overlay. No random-ID difference was found in this comparison.
- Text nodes: omitted responsive branches remove duplicated nav/footer/CTA text. Bima's original main content remains in the generator; this is not a fixture-copy difference or a whitespace-only change.

Path preflight: an ordering bug in the helper's literal replacement originally broke module URLs, so its three preflight rows never tested hydration. They are saved separately in tools/phase2b-path-preflight-invalid.json and excluded from valid attempt counts. Corrected by matching ../../assets and ../assets BEFORE ./assets. Isolated document uses a root base URL. This verifies asset resolution only; it is not the final site URL strategy or proof of card navigation. Final content must use explicit root-relative asset URLs and each project's one-field primary href; do not ship a base-tag workaround that changes unrelated ../ links.

Valid focused attempts at LePrint375:

| Attempt | Change | Runtime loaded | Hydration warnings | Console errors | HTTP404 | External requests |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 1 | Correct paths, generator still1280px | Yes |18|0|0|0|
| 2 | Correct paths, generator375px matching browser | Yes |0|0|0|0|

Stopped after attempt2 succeeded; attempt3 not run. The valid test was direct load only, using a fixture heading [spike] leprint and old layout content. It does not prove final copy, reload, client navigation or history behavior. The earlier navigation result remains invalid because of its duplicated path. Zero hydration warnings applies only to this measured375px direct load.

### Final execution sequence and remaining feasibility gate

1. Await Rev's approval of this plan before served edits. All copy/categories/batch settings are settled, with latest changes authoritative.
2. Cards/content can proceed independently using one primary href field per project. Default remains internal detail URL; no silent external fallback. All approved Live site links remain separate row items.
3. Preferred detail tier remains shared-data Framer rendering. Before shipping it, demonstrate one deployable HTML document per route hydrating across all four widths, and direct/card navigation/reload/back-forward. A separately generated HTML response per browser width would not be a valid static-site solution. No claim that the11x4 matrix passed; it has not run.
4. Further runtime diagnosis beyond the stated capped investigation requires a new decision. The375px single-route condition passed, but reproducing multi-breakpoint production SSR is unresolved. Recommend tier2 if avoiding more runtime reverse engineering is preferred, rather than pretending the single-width pass proves deployment safety.
5. Tier2 proposal, awaiting explicit selection: static detail pages retain template detail markup, fonts, local CSS and approved content/image/header fields; omit all Framer module/preload/hydration/appear scripts. Plain CSS shared header/footer. Card hrefs stay internal. All11 pages, metadata and sitemap still exist. Header/footer are the only allowed additional reconstructed pieces.
6. Exact behaviors lost in tier2: Framer client-side route transitions (normal browser navigation instead), runtime responsive variant switching (CSS media queries instead), mobile nav's runtime menu toggle/animation, scroll-in text/image/header/footer reveals, animated hover variants on outbound buttons and footer links, dynamic previous/next or More Work rendering (static links generated from the shared project data). No form or FAQ accordion appears in the captured detail layout; no replacement for those is needed on details. Template case-study stats/galleries are already approved for removal, so they are not a new tier2 loss. Header menu needs accessible keyboard-operable disclosure, visible focus, Escape/close behavior if an overlay is retained; outbound links need ordinary CSS hover/focus feedback. Restore any initially hidden appear nodes to visible static state. Do not retain both responsive nav/footer copies visibly. Detail hero stays sharp. Verify static route and404 navigation across4widths and compare against the template layout.
7. Tier3 remains last resort, never selected automatically. It loses internal detail pages and per-project SEO; one href data edit switches a card to GitHub/demo.

No implementation approval inferred from review answers. Three-line card fit, full route matrix, final runtime link paths, final placeholder/carousel/marquee behavior and before/after screenshots remain post-implementation checks. No commits or deployment.

## Implementation handoff (latest status)

Rev asked to implement quickly and defer detailed testing. Current preview http://127.0.0.1:8767/ . Repeatable patch tools/patch_phase2b.py; immutable Phase2a snapshot _phase2a_baseline/. Tier2 details use static markup/CSS and plain header/footer; Home/Projects/Contact retain Framer runtime and consume shared static trees for changed sections. Shared project source tools/phase2b-projects.json; primary href is one field. Detail generation is one isolated block in the patch script. Removing GILD's single data entry and rerunning updates cards/details/sitemap/count; the patch's previous-output manifest removes its orphaned generated page/image on rerun.

Correction after Rev's visual feedback: the captured hero heading, four-slot carousel, animated pill CTA, page-end CTA, responsive footer and About/Contact shells are restored. Text, links and hero image URLs are patched inside the native components. Only Technologies and approved project cards use custom layouts. The hero subtext uses shared plain copy inside its original appear-animation parent. Footer social link columns use shared content inside native responsive footer variants. Custom cards have Focus rack but currently no original scroll-entry reveal. Native FAQ accordion and navigation retain Framer logic. Static detail pages lose Framer transitions and reveals as documented. Full 11x4 routing/history/hover/touch/reduced-motion/marquee/FAQ/screenshot-comparison matrix remains deferred, not passed.

Basic browser checks:375px Home4cards, Projects11cards, Contact, LePrint and GILD details, /404/;1280px Projects11cards. At the measured final content state, these normal pages had zero console/hydration warnings/errors, zero unexpected404s and zero external requests. Unknown nested URL returned the expected404 and matching designed body; Chromium logs that deliberate404 as a resource error, which is not a missing asset. Card descriptions in checked375 and1280 layouts fit three lines without overflow. Final padding refinements and navigation-count/route-map edits need the final brief rerun recorded in tools/phase2b-basic-results.json; that file is authoritative for the latest results.

No commit, deployment or repo-root site replacement. Helper reference moved under tools/reference and ignored. Head metadata, Person schema, sitemap, robots, llms, local favicon/share image are generated. URL-map keys and captured/_baseline trees remain unchanged.

Detailed handoff: PHASE2B_HANDOFF.md. Latest request prioritizes implementation and defers comprehensive testing.

## Visual restoration following Rev's screenshots

Whole-section replacements for hero, footer, page-end CTA, About and Contact were a scope error and have been removed from the repeatable patch. Native Framer hierarchy, typography, responsive layouts and button hover variants are retained. About loses only the portrait/extra unapproved biography; Contact loses the form and redundant call button. `tools/restore_phase2b_native.py` contains counted exact patches. Static detail/404 header/footer remain the documented tier2 exception, with their CSS adjusted toward the native footer type/layout and pill CTA. No further redesign is authorized. `tools/native-restoration-results.json` records the four-width Home/Projects/Contact check; full detail/history/accessibility matrix remains outstanding.

Final restoration check: Home, Projects and Contact at375/768/1280/1920,12 renders, all zero console errors, hydration warnings, external requests, missing resources and horizontal overflow. Native hero carousel transform changed at every width. Native page-end Connect hover exercised and href resolved to /contact/ at every width. Scroll traversal and top/footer/CTA screenshots saved. Counts:250 exact patch/write operations,777 replacements. This is not the full11-project detail/history/FAQ/touch/reduced-motion matrix.

## Latest critical changes, approved by Rev

These supersede earlier decisions: Rev is available for work. FAQ question is “Are you available for work?” and answer is “Yes. I'm available for work. Reach me through the Connect page.” No invented role/rate/availability date is added. Discord is now the link https://discord.com/users/1400787457221595230, on Contact/footer and Person sameAs, replacing plain username. Its public endpoint returned HTTP200; logged-in profile content was not inspected. Home heading is Projects with superscript04; Projects index uses superscript11. Native Connect hover ends with “Let's chat”. The original tablet “No hover” variant had mouse-enter disabled; its handler is enabled only for hover/fine-pointer devices, retaining SSR variants.

Rev approved restoring the original tabbed component as “What I work on”, with Web apps, Browser tools and Linux utilities, using LePrint/cyclr/typd neutral images. Native tab state, transitions, selected indicator and reveal wrappers are retained; no commercial service claims. Restoring it is a separate helper step tools/restore_phase2b_tabs.py.

Runtime-free detail and404 pages now reuse actual captured native navbar/footer markup and responsive variants instead of approximated custom headers. A local tiny script supplies the mobile menu toggle, keyboard activation and Escape close. Detail typography/header spacing/description/field hierarchy/outbound outline button now match the template more closely. Two next projects populate More Work using approved static project cards. Static CTA has a local CSS Let’s chat hover. Framer routing/transitions and detail scroll reveals remain absent; this change does not claim to restore those.

Evidence: tools/critical-changes-results.json,60 direct-load route/width renders (Home, Projects, Contact,404,all11details at375/768/1280/1920),zero console/hydration errors/warnings,external requests,missing resources,horizontal overflow. Both native CTAs reached End state with Let's chat at every width. Mobile detail menus opened/closed on every project at375. Final static CTA polish and actual tab-opacity transitions receive the additional check tools/critical-interactions-results.json. No commit/deployment/root site edits.

Supplemental interaction check verified actual visible tab images: Browser tools shows cyclr, Linux utilities shows typd, Web apps shows LePrint, with inactive image opacity0 and active opacity1, at all four widths. Static detail CTA shows Let's chat on hover. All detail navbar/footer links are rooted; copied Home #projects link is explicitly converted to /projects/. The superscript04 and available-for-work FAQ are present. Native Framer motion is retained for the repurposed tabs and homepage CTAs; no additional animation library was required for these existing interactions.

## Embedded original terminal

Rev approved reusing the old TUI before Projects, restyled in black/white/gray. Original root TUI files remain untouched. The repeatable patch copies them to terminal/ and patches the copy via tools/build_embedded_terminal.py; exact source replacement log is tools/terminal-replacements.json. A lazy same-origin iframe isolates the old global CSS, keyboard handlers, window controls and overlays from Framer. Startup autofocus and ambient idle screensavers are disabled; scrolling on touch does not focus the input. Tab on an empty command can leave the frame. The terminal uses local monospace fallback, with no Google Fonts call. Projects use the approved local11-entry data, including demo-only GILD; fake fallback repos, skill percentages, old fabricated filesystem entries and live GitHub fetch were removed in the copy. Bio/contact/filesystem match approved data. Legacy theme aliases map to monochrome; terminal commands remain implemented using the original registry. Root/main GitHub Pages cutover and deployment have not been performed.

Playwright evidence tools/embedded-terminal-results.json:375/768/1280/1920, terminal before Projects, no parent/frame horizontal overflow, no startup focus theft, zero console errors/warnings, external requests and404s. Verified help, whoami, neofetch, projects, cat project/email files, theme, autocomplete, history, Ctrl+L clear and empty-prompt Tab exit. Full easter-egg/window-control tests were not run. No commits.
