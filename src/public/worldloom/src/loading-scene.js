import { createLoopVideo } from '../../loop-video.js';

// The world builds behind a separately decoded, native 4K forest recording.
export class LoadingScene {
  constructor() {
    this.video=document.querySelector('#loading-film');
    this.birds=document.querySelector('#loading-birds');
    this.active=false;this.level=.3;
    this.playback=createLoopVideo(this.video,{source:this.video.dataset.src,smallSource:this.video.dataset.smallSrc,
      active:()=>this.active,small:()=>innerWidth<=1100||navigator.connection?.saveData});
    for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>this.sync(),{passive:true});
    document.addEventListener('visibilitychange',()=>this.sync());
    window.addEventListener('pagehide',()=>this.stop());
    window.addEventListener('pageshow',()=>this.sync());
  }
  setSettings(settings) {
    const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
    this.level=clamp(settings.volume??.72)*clamp(settings.ambienceVolume??.68)*.7;
    this.birds.volume=this.level;
    this.sync();
  }
  setActive(active) {this.active=Boolean(active);this.sync();}
  async ready() {
    // Let the first video frame decode before chunk generation competes for CPU.
    // A slow/unsupported video falls back to its poster without blocking a world.
    await this.playback.ready();
    if(!document.hidden)await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }
  stop() {this.playback.pause();this.birds.pause();}
  sync() {
    if(!this.active||document.hidden){this.stop();return;}
    this.playback.sync();
    if(this.level>0)this.birds.play().then(()=>{if(!this.active||document.hidden)this.birds.pause();}).catch(()=>{});
    else this.birds.pause();
  }
}
