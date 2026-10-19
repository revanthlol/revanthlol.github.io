// Light remains the default; System is an explicit, persistent choice.
(() => {
  window.ThemeSwitcherConfig = {
    key: 'portfolio-theme',
    apply(mode, resolved) {
      const root = document.documentElement;
      root.dataset.themeMode = mode;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    },
  };
  let mode = 'light';
  try {
    const saved = localStorage.getItem(window.ThemeSwitcherConfig.key);
    if (['light', 'dark', 'system'].includes(saved)) mode = saved;
  } catch {}
  const resolved = mode === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
  window.ThemeSwitcherConfig.apply(mode, resolved);
})();
