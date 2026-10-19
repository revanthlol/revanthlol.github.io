import './preferences.js';
import './site-background.js';

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
