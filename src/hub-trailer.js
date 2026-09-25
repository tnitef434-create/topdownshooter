// The AURORA × UNPAUSED trailer. Plays full-screen the first time someone opens the hub,
// then only when asked for again (the "Watch the Aurora trailer" link in What's new, or /?trailer).
const TRAILER_ID='aurora-launch-1';
const SEEN_KEY='unpaused.trailer.seen';
const SRC={large:'/trailer/aurora-trailer-1080p.mp4',small:'/trailer/aurora-trailer-720p.mp4',poster:'/trailer/aurora-trailer-poster.jpg'};

const read=()=>{try{return localStorage.getItem(SEEN_KEY);}catch{return null;}};
const remember=()=>{try{localStorage.setItem(SEEN_KEY,TRAILER_ID);}catch{}};

export function initHubTrailer(){
  for(const link of document.querySelectorAll('[data-play-trailer]'))
    link.addEventListener('click',event=>{event.preventDefault();playTrailer({manual:true});});
  const params=new URLSearchParams(location.search);
  if(params.has('trailer'))return playTrailer({manual:true});
  if(params.has('notrailer')||read()===TRAILER_ID)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData){remember();return;}
  if(navigator.webdriver)return;
  playTrailer({manual:false});
}

let open=null;
export function playTrailer({manual}){
  if(open)return;
  const small=innerWidth<=900||navigator.connection?.saveData;
  const root=document.createElement('div');
  root.className='u-trailer';
  root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Aurora × Unpaused trailer');
  root.innerHTML=`
    <video class="u-trailer__video" playsinline preload="auto" poster="${SRC.poster}"></video>
    <div class="u-trailer__bar" aria-hidden="true"><i></i></div>
    <button class="u-trailer__sound" type="button" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path class="spk" d="M4 9h4l5-4v14l-5-4H4z"/><path class="on" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/><path class="off" d="m16 9 6 6m0-6-6 6"/></svg>
      <span>Sound on</span>
    </button>
    <button class="u-trailer__skip" type="button">${manual?'Close':'Skip'}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>
    <button class="u-trailer__play" type="button" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Play trailer</span></button>`;
  document.body.append(root);
  const video=root.querySelector('video'),sound=root.querySelector('.u-trailer__sound'),skip=root.querySelector('.u-trailer__skip'),
    playBtn=root.querySelector('.u-trailer__play'),fill=root.querySelector('.u-trailer__bar i');
  video.src=small?SRC.small:SRC.large;
  const before=document.activeElement;
  document.documentElement.classList.add('u-trailer-open');
  open=root;

  const setMuted=m=>{video.muted=m;sound.setAttribute('aria-pressed',String(!m));sound.querySelector('span').textContent=m?'Sound on':'Sound off';root.classList.toggle('is-muted',m);};
  function close(failed){
    if(!open)return;
    open=null;if(failed!==true)remember();
    root.classList.add('is-leaving');
    video.pause();
    document.documentElement.classList.remove('u-trailer-open');
    removeEventListener('keydown',onKey,true);
    setTimeout(()=>{root.remove();before?.focus?.({preventScroll:true});},520);
  }
  function onKey(event){
    if(event.key==='Escape'||event.key==='Enter'){event.preventDefault();event.stopPropagation();close();}
    else if(event.key==='m'||event.key==='M')setMuted(!video.muted);
    else if(event.key===' '){event.preventDefault();video.paused?video.play():video.pause();}
    else if(event.key==='Tab'){ // keep focus inside the dialog
      const items=[...root.querySelectorAll('button:not([hidden])')];
      const i=items.indexOf(document.activeElement);
      event.preventDefault();items[(i+(event.shiftKey?items.length-1:1))%items.length]?.focus();
    }
  }
  addEventListener('keydown',onKey,true);
  skip.addEventListener('click',()=>close());
  sound.addEventListener('click',()=>{setMuted(!video.muted);if(video.paused)video.play().catch(()=>{});});
  playBtn.addEventListener('click',()=>{playBtn.hidden=true;setMuted(false);video.play().catch(()=>{});});
  video.addEventListener('click',()=>{if(video.muted)setMuted(false);});
  video.addEventListener('ended',()=>close());
  video.addEventListener('error',()=>close(true));
  video.addEventListener('timeupdate',()=>{if(video.duration)fill.style.transform=`scaleX(${video.currentTime/video.duration})`;});
  requestAnimationFrame(()=>root.classList.add('is-in'));
  skip.focus({preventScroll:true});

  // Try with sound first (browsers allow it after the visitor has interacted with the site before);
  // otherwise start muted and let them turn the sound on.
  setMuted(false);
  video.play().catch(()=>{
    setMuted(true);
    return video.play();
  }).catch(()=>{playBtn.hidden=false;playBtn.focus({preventScroll:true});});
}
