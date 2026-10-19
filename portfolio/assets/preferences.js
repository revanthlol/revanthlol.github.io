// Adapted from the supplied theme-switcher.html, using the portfolio's theme tokens.
const config = window.ThemeSwitcherConfig;
const order = ['system', 'light', 'dark'];
const system = matchMedia('(prefers-color-scheme: dark)');
let current = document.documentElement.dataset.themeMode || 'light';
let transition;
const resolve = mode => mode === 'system' ? (system.matches ? 'dark' : 'light') : mode;

function read() {
  try {
    const value = localStorage.getItem(config.key);
    return order.includes(value) ? value : 'light';
  } catch { return 'light'; }
}
function paint() {
  const resolved = resolve(current);
  document.querySelectorAll('[data-theme-switcher]').forEach(switcher => {
    switcher.style.setProperty('--i', order.indexOf(current));
    switcher.dataset.resolved = resolved;
    switcher.querySelectorAll('[data-mode]').forEach(button => {
      const active = button.dataset.mode === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  });
  document.querySelectorAll('[data-cm]').forEach(menu => { menu.dataset.variant = resolved; });
}
function commit() {
  config.apply(current, resolve(current));
  paint();
  document.dispatchEvent(new CustomEvent('themechange', { detail: { mode: current, resolved: resolve(current) } }));
}
function select(mode, button, keyboard) {
  const changed = resolve(current) !== resolve(mode);
  current = mode;
  try { localStorage.setItem(config.key, mode); } catch {}
  document.documentElement.toggleAttribute('data-theme-instant', keyboard);
  transition?.skipTransition();
  if (!changed || keyboard || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    commit();
    return;
  }
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const host = button.closest('[data-theme-switcher]');
  host.classList.add('ts--vt');
  try {
    const next = document.startViewTransition(commit);
    transition = next;
    next.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
        duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)',
      });
    }).catch(() => {});
    const finish = () => { host.classList.remove('ts--vt'); if (transition === next) transition = null; };
    next.finished.then(finish, finish);
  } catch {
    host.classList.remove('ts--vt');
    commit();
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-theme-switcher] [data-mode]');
  if (button && order.includes(button.dataset.mode) && button.dataset.mode !== current) select(button.dataset.mode, button, event.detail === 0);
});
system.addEventListener('change', () => { if (current === 'system') commit(); });
window.addEventListener('storage', event => {
  if (event.key === config.key || event.key === null) { current = read(); commit(); }
});
window.addEventListener('pageshow', () => { current = read(); commit(); });
commit();
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.querySelectorAll('[data-theme-switcher]').forEach(switcher => switcher.classList.add('ts--ready'));
}));
