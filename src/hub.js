import { initHubMotion } from './hub-motion.js';
import { initHubAccount } from './hub-account.js';
import { initGameEntry } from './hub-entry.js';

initHubMotion();
initHubAccount();
initGameEntry();

// Returning to the hub can paint its frame before image decoding finishes.
// Keep the divider transparent until both backgrounds can paint behind it.
Promise.all([...document.querySelectorAll('.poster')].map(async poster => {
  if (!poster.complete) await new Promise(resolve => {
    poster.addEventListener('load', resolve, {once:true});
    poster.addEventListener('error', resolve, {once:true});
  });
  try { await poster.decode(); } catch { /* Keep the background fallback usable. */ }
})).then(() => document.documentElement.classList.add('hub-media-ready'));

for (const film of document.querySelectorAll('#worldloom-film, #tacticstrike-film')) {
let loaded = false;
let unavailable = false;

function syncPlayback() {
  if (unavailable) return;
  if (document.hidden) { film.pause(); return; }
  if (!loaded) {
    const source = film.querySelector('source');
    const small = window.innerWidth <= 700 || navigator.connection?.saveData;
    source.src = small ? source.dataset.smallSrc : source.dataset.src;
    film.muted = true;
    film.load();
    loaded = true;
  }
  film.play().catch(() => {
    // The real scene poster stays visible when autoplay isn't permitted.
    film.classList.remove('is-playing');
  });
}

film.addEventListener('playing', () => film.classList.add('is-playing'));
const onError = () => {
  unavailable = true;
  film.classList.remove('is-playing');
};
film.addEventListener('error', onError);
film.querySelector('source').addEventListener('error', onError);
document.addEventListener('visibilitychange', syncPlayback);
window.addEventListener('pageshow', syncPlayback);
// Retry restricted autoplay on the first interaction; no playback UI is shown.
window.addEventListener('pointerdown', syncPlayback, {once:true});
syncPlayback();
}
