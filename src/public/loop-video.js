// Native looping footage with bounded recovery after a network/decoder stall.
// All three presentations (hub, title and chunk loading) use this lifecycle.
export function createLoopVideo(video, { source, smallSource, active = () => true, small = () => false } = {}) {
  let disposed=false, pending=null, current='', fallback=false, retryAt=0;
  let lastTime=-1, lastFrames=-1, lastProgress=performance.now(), failures=0;
  const shouldPlay=()=>!disposed&&!document.hidden&&active();
  const url=()=>fallback||small()?smallSource:source;
  function pause(){video.pause();lastProgress=performance.now();}
  function sync(){
    if(!shouldPlay()){pause();return;}
    if(performance.now()<retryAt)return;
    if(current&&!video.getAttribute('src'))current='';
    if(!current){
      current=url();video.src=current;video.muted=true;video.loop=true;
      video.playsInline=true;video.preload='auto';video.load();
      lastTime=-1;lastFrames=-1;lastProgress=performance.now();
    }
    if(pending)return;
    const attempt=video.play();pending=attempt;
    attempt.then(()=>{if(!shouldPlay())pause();}).catch(()=>{
      // Autoplay denial is retried on trusted interaction. Offline/media errors
      // recover through the watchdog without permanently hiding the footage.
    }).finally(()=>{if(pending===attempt)pending=null;});
  }
  function recover(){
    if(!shouldPlay()||navigator.onLine===false||performance.now()<retryAt)return;
    fallback=Boolean(smallSource);failures++;
    retryAt=performance.now()+Math.min(10000,failures*750);
    video.pause();current='';pending=null;lastTime=-1;lastProgress=performance.now();
  }
  const playing=()=>{video.classList.add('is-playing');lastProgress=performance.now();};
  const wake=()=>{retryAt=0;lastProgress=performance.now();sync();};
  const tick=()=>{
    if(!shouldPlay())return;
    const now=performance.now();
    const quality=video.getVideoPlaybackQuality?.(),frames=quality?quality.totalVideoFrames-quality.droppedVideoFrames:null;
    if(Math.abs(video.currentTime-lastTime)>.035&&(frames===null||frames!==lastFrames)){lastTime=video.currentTime;lastFrames=frames;lastProgress=now;failures=0;}
    else if(current&&now-lastProgress>4500)recover();
    sync();
  };
  video.addEventListener('playing',playing);
  video.addEventListener('error',recover);
  video.addEventListener('ended',sync);
  video.addEventListener('canplay',sync);
  document.addEventListener('visibilitychange',wake);
  window.addEventListener('pageshow',wake);
  window.addEventListener('pagehide',pause);
  window.addEventListener('online',wake);
  window.addEventListener('pointerdown',wake,{passive:true});
  window.addEventListener('keydown',wake,{passive:true});
  const timer=setInterval(tick,1000);
  async function ready(timeout=5000){
    sync();if(video.readyState>=3)return;
    await new Promise(resolve=>{
      const done=()=>{clearTimeout(wait);video.removeEventListener('canplay',done);resolve();};
      const wait=setTimeout(done,timeout);video.addEventListener('canplay',done,{once:true});
    });
  }
  function dispose(){
    disposed=true;pause();clearInterval(timer);
    video.removeEventListener('playing',playing);video.removeEventListener('error',recover);
    video.removeEventListener('ended',sync);video.removeEventListener('canplay',sync);
    document.removeEventListener('visibilitychange',wake);window.removeEventListener('pageshow',wake);
    window.removeEventListener('pagehide',pause);window.removeEventListener('online',wake);
    window.removeEventListener('pointerdown',wake);window.removeEventListener('keydown',wake);
  }
  sync();
  return {sync,pause,ready,dispose};
}
