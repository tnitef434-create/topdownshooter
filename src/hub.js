import { initHubMotion } from './hub-motion.js';
import { initHubAccount } from './hub-account.js';
import { initGameEntry } from './hub-entry.js';
import { createLoopVideo } from './public/loop-video.js';
import { initHubNews } from './hub-news.js';

initHubMotion();
initHubAccount();
initGameEntry();
initHubNews();

for (const film of document.querySelectorAll('#worldloom-film, #tacticstrike-film')) {
  const source=film.querySelector('source');
  createLoopVideo(film,{source:source.dataset.src,smallSource:source.dataset.smallSrc,
    small:()=>innerWidth<=700||navigator.connection?.saveData});
}
