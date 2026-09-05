const menu = document.querySelector('#main-menu');
const film = document.querySelector('#menu-film');
let unavailable = false;

function syncMenuFilm() {
  if (unavailable) return;
  if (document.hidden || menu.classList.contains('hidden')) {
    film.pause();
    return;
  }
  if (!film.getAttribute('src')) {
    // Native 4K footage for desktop, a separately encoded HD copy for phones.
    film.src = window.innerWidth <= 1100 || navigator.connection?.saveData
      ? film.dataset.smallSrc : film.dataset.src;
    film.muted = true;
    film.load();
  }
  film.play().catch(() => film.classList.remove('is-playing'));
}

film.addEventListener('playing', () => film.classList.add('is-playing'));
film.addEventListener('error', () => {
  unavailable = true;
  film.classList.remove('is-playing');
});
new MutationObserver(syncMenuFilm).observe(menu, {attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange', syncMenuFilm);
window.addEventListener('pageshow', syncMenuFilm);
window.addEventListener('pointerdown', syncMenuFilm, {once:true});
syncMenuFilm();
