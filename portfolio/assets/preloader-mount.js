import React, { createRoot } from './react-shim.js';
import SlatCountPreloader from './slat-count-preloader.js';

export function initPreloader() {
  const preloaderEl = document.getElementById('rev-preloader');
  if (!preloaderEl) return;

  // Only run preloader on first cold session visit while loading assets.
  // Bypass completely on reloads, internal page navigations, and cached sessions.
  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem('rev_preloader_done') === '1';
  } catch (_) {}

  if (alreadyShown) {
    preloaderEl.remove();
    return;
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.hasAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const palette = isDark
    ? { background: '#151515', ink: '#ededed', accent: '#ffffff' }
    : { background: '#fcfcfc', ink: '#171717', accent: '#000000' };

  try {
    const root = createRoot(preloaderEl);
    root.render(
      React.createElement(SlatCountPreloader, {
        durationMs: 1200,
        stepMs: 120,
        palette,
        label: 'REVANTH / 2026',
        caption: 'SYSTEM INITIALIZED · REACT HYDRATION READY',
        exit: 'blinds',
        onComplete: () => {
          try {
            sessionStorage.setItem('rev_preloader_done', '1');
          } catch (_) {}
          setTimeout(() => {
            try { preloaderEl.remove(); } catch (_) {}
          }, 120);
        }
      })
    );
  } catch (err) {
    console.error('Preloader initialization error:', err);
    preloaderEl.remove();
  }
}
