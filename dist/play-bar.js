// Small "back to Unpaused" bar for the open-source games hosted on Unpaused, with credit and a source link.
(() => {
  const s = document.currentScript, d = s.dataset;
  const bar = document.createElement('div');
  bar.className = 'u-playbar';
  bar.innerHTML = `<a class="u-home" href="/" aria-label="Back to Unpaused"><svg viewBox="-7 -9 46 46" aria-hidden="true"><path d="M5 5v15c0 6 4 9 9 9s9-3 9-9v-3" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="square"/><path d="m20 2 9 6-9 6z" fill="#ff6339"/></svg><span>Unpaused</span></a>`
    + `<span class="u-credit">${d.game} by ${d.author} \u00b7 <a href="${d.source}" target="_blank" rel="noopener">${d.license} \u00b7 source</a></span>`;
  const css = document.createElement('style');
  css.textContent = `.u-playbar{position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;gap:10px;padding:5px 12px 5px 6px;border-radius:999px;
    background:rgba(10,12,18,.72);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font:600 11px/1.2 Arial,sans-serif;color:#f4f6dcb3;opacity:.55;transition:opacity .2s}
    .u-playbar:hover,.u-playbar:focus-within{opacity:1}
    .u-playbar a{color:inherit;text-decoration:none}.u-playbar a:hover{color:#fff}
    .u-home{display:flex;align-items:center;gap:6px;padding:3px 10px 3px 3px;border-radius:999px;background:#ffffff14;color:#fff!important;font-weight:800;letter-spacing:.5px}
    .u-home svg{width:22px;height:22px}
    @media(max-width:600px){.u-credit{display:none}}`;
  document.head.append(css);
  (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => document.body.append(bar)) : document.body.append(bar));
})();
