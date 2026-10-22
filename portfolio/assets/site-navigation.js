import './preferences.js';
import './site-background.js';
import { initAllHalftoneWordmarks } from './halftone-wordmark.js';
import { initPreloader } from './preloader-mount.js';
import React, { createRoot } from './react-shim.js';
import ContributionSkyline from './contribution-skyline.js';
import { REVANTH_CONTRIBUTIONS } from './contributions-data.js';

initPreloader();
initAllHalftoneWordmarks();

// Top slim scroll progress bar
const progressBar = document.getElementById('rev-scroll-progress') || (() => {
  const bar = document.createElement('div');
  bar.id = 'rev-scroll-progress';
  bar.className = 'rev-scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  return bar;
})();

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

function ensureSkyline() {
  if (document.getElementById('activity')) return;
  const isHome = location.pathname === '/' || location.pathname === '' || location.pathname === '/index.html' || location.pathname.endsWith('/portfolio/') || location.pathname.endsWith('/portfolio/index.html');
  if (!isHome) return;

  const projects = document.querySelector('.rev-home-projects-wrap') || document.querySelector('#projects');
  if (!projects || !projects.parentNode) return;

  const section = document.createElement('section');
  section.className = 'rev-skyline-section-wrap';
  section.id = 'activity';
  section.setAttribute('aria-label', 'GitHub Contributions');

  const card = document.createElement('div');
  card.className = 'rev-skyline-card';
  section.appendChild(card);

  projects.parentNode.insertBefore(section, projects);

  try {
    const root = createRoot(card);
    root.render(React.createElement(ContributionSkyline, {
      data: REVANTH_CONTRIBUTIONS,
      palette: "github",
      scrollDriven: true,
      title: React.createElement(
        React.Fragment,
        null,
        React.createElement("span", { className: "font-semibold tabular-nums" }, "803"),
        " contributions in the last year"
      ),
      className: "rev-skyline-card"
    }));
  } catch (err) {
    console.warn('Skyline mount notice:', err);
  }
}

ensureSkyline();
const skylineObserver = new MutationObserver(() => {
  ensureSkyline();
});
skylineObserver.observe(document.body, { childList: true, subtree: true });

const header = document.querySelector('[data-site-header]');
const menu = header.querySelector('[data-cm]');
const button = menu.querySelector('.cm__btn');
const panel = menu.querySelector('.cm__panel');
const desktop = matchMedia('(min-width: 810px)');
let open = false;
let overflow = '';

function setOpen(next, restoreFocus = false) {
  if (next === open) return;
  open = next;
  menu.dataset.open = String(open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  panel.inert = !open;
  panel.setAttribute('aria-hidden', String(!open));
  if (open) {
    overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
  } else {
    document.documentElement.style.overflow = overflow;
    menu.removeAttribute('role');
    menu.removeAttribute('aria-modal');
    if (restoreFocus) button.focus();
  }
}
button.addEventListener('click', event => {
  menu.dataset.instant = String(event.detail === 0);
  setOpen(!open);
});
panel.addEventListener('click', event => {
  if (event.target.closest('a[href]')) setOpen(false);
});
document.addEventListener('pointerdown', event => {
  if (open && !menu.contains(event.target)) setOpen(false);
});
document.addEventListener('keydown', event => {
  if (!open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    menu.dataset.instant = 'true';
    setOpen(false, true);
  } else if (event.key === 'Tab') {
    const targets = [...menu.querySelectorAll('a[href], button:not([disabled])')].filter(element => element.getClientRects().length);
    const first = targets[0], last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
desktop.addEventListener('change', () => { if (desktop.matches) setOpen(false); });

function updateRoute() {
  const isContact = location.pathname.replace(/\/$/, '') === '/contact' || location.pathname.includes('/contact');
  if (isContact) {
    document.body.dataset.page = 'contact';
    document.body.classList.add('page-contact');
  } else {
    delete document.body.dataset.page;
    document.body.classList.remove('page-contact');
  }
  header.querySelectorAll('a[href^="/"]').forEach(link => {
    const url = new URL(link.href);
    const current = url.pathname === location.pathname && url.hash === location.hash;
    const project = url.pathname === '/projects/' && location.pathname.startsWith('/projects/');
    if (current || project) link.setAttribute('aria-current', current ? 'page' : 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', updateRoute);
window.addEventListener('popstate', () => { setOpen(false); updateRoute(); });
window.addEventListener('pageshow', () => { setOpen(false); updateRoute(); });
updateRoute();
