import { createLoopVideo } from '../../loop-video.js';
const menu = document.querySelector('#main-menu');
const film = document.querySelector('#menu-film');
const playback=createLoopVideo(film,{source:film.dataset.src,smallSource:film.dataset.smallSrc,
  small:()=>innerWidth<=1100||navigator.connection?.saveData,
  active:()=>!menu.classList.contains('hidden')});
new MutationObserver(()=>playback.sync()).observe(menu,{attributes:true,attributeFilter:['class']});
