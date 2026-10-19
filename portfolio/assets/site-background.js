const wide = matchMedia('(min-width: 1201px)');
const gutters = [...document.querySelectorAll('.site-gutter')];
// Keep the background out of the fixed navbar's foreground stacking context.
document.body.prepend(...gutters);

function recolor() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const page = dark ? '#151515' : '#fcfcfc';
  for (const gutter of gutters) {
    const tiles = gutter.querySelector('tron-tiles');
    if (!tiles) continue;
    tiles.config = {
      cursor: 'default',
      hover: { radius: 600, lift: .25 },
      grid: { cellSize: 72, gap: 10, cornerRadius: 14, lineColor: dark ? '#383838' : '#ffffff', lineOpacity: .5 },
      tile: {
        faceColor: dark ? '#202020' : '#f2f2f2',
        faceLight: dark ? '#303030' : '#ffffff', faceShade: dark ? '#171717' : '#e6e6e6',
        highlightColor: dark ? '#505050' : '#ffffff', highlightOpacity: .5,
        shadeColor: dark ? '#080808' : '#dedede', sheen: .15, brighten: .15,
      },
      shadow: { color: dark ? '#000000' : '#d8d8d8', ambientOpacity: .12, contactOpacity: .2 },
      background: { baseColor: page, vignette: false },
      tint: { enabled: false },
      performance: { dprCap: 1.5 },
    };
  }
}

async function resize() {
  if (wide.matches) {
    await import('./tron-tiles.js');
    if (!wide.matches) return;
    for (const gutter of gutters) {
      if (!gutter.firstElementChild) {
        const tiles = document.createElement('tron-tiles');
        tiles.setAttribute('global-pointer', '');
        gutter.append(tiles);
      }
    }
    recolor();
  } else {
    for (const gutter of gutters) gutter.replaceChildren();
  }
}
wide.addEventListener('change', resize);
new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
resize();
