// The world builds behind a separately decoded, native 4K forest recording.
export class LoadingScene {
  constructor() {
    this.video=document.querySelector('#loading-film');
    this.birds=document.querySelector('#loading-birds');
    this.active=false;this.level=.3;
    for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>this.sync(),{passive:true});
    document.addEventListener('visibilitychange',()=>this.sync());
    window.addEventListener('pagehide',()=>this.stop());
    window.addEventListener('pageshow',()=>this.sync());
    this.video.addEventListener('error',()=>{
      if(this.video.src.endsWith('forest-leaves-4k.mp4')){this.video.src=this.video.dataset.smallSrc;this.sync();}
    });
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
    if(this.video.readyState<3)await new Promise(resolve=>{
      const done=()=>{clearTimeout(timer);this.video.removeEventListener('canplay',done);resolve();};
      const timer=setTimeout(done,5000);
      this.video.addEventListener('canplay',done,{once:true});
    });
    if(!document.hidden)await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }
  stop() {this.video.pause();this.birds.pause();}
  sync() {
    if(!this.active||document.hidden){this.stop();return;}
    if(!this.video.getAttribute('src'))this.video.src=innerWidth<=1100||navigator.connection?.saveData?this.video.dataset.smallSrc:this.video.dataset.src;
    this.video.muted=true;
    this.video.play().then(()=>{if(!this.active||document.hidden)this.video.pause();}).catch(()=>{});
    if(this.level>0)this.birds.play().then(()=>{if(!this.active||document.hidden)this.birds.pause();}).catch(()=>{});
    else this.birds.pause();
  }
}
