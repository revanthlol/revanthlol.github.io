# GitHub Pages

The Actions workflow in `.github/workflows/pages.yml` publishes `portfolio/` as
the domain root. Original root TUI files remain archived in the repository.

Public pages and assets are already generated. Deployment needs only Python's
standard library, not the local patch baseline, HAR, Node modules or Playwright.

`tools/` contains patch sources and local verification scripts. `captured/`,
baselines and verification artifacts are ignored and never deployed. The build
script explicitly copies only public routes, assets, stubs and terminal files.

Preview the exact static artifact (using an empty directory):

```sh
python3 portfolio/tools/build_pages.py --output /tmp/portfolio-pages
python3 -m http.server 8770 --directory /tmp/portfolio-pages
```

Push changes to `main` to deploy, or run the Pages workflow manually. Repository
Settings > Pages must use GitHub Actions. `/404.html` provides the Pages fallback.
The patch scripts require the locally retained ignored baseline to regenerate
the site; a fresh clone can deploy the generated output without that baseline.
