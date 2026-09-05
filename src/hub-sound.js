// A brief brushed flick, with a soft low click rather than a pitched UI beep.
export function createHubFlick() {
  let context,buffer,last=-Infinity;
  function prepare() {
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return;
    context ||= new Context();
    if(!buffer) {
      buffer=context.createBuffer(1,Math.round(context.sampleRate*.085),context.sampleRate);
      const data=buffer.getChannelData(0);
      let smoothed=0,seed=8137;
      for(let i=0;i<data.length;i++) {
        seed=(Math.imul(seed,1664525)+1013904223)>>>0;
        smoothed=smoothed*.63+(seed/2147483648-1)*.37;
        const t=i/context.sampleRate;
        data[i]=smoothed*.8+Math.sin(2*Math.PI*170*t)*Math.exp(-t*180)*.32;
      }
    }
  }
  function unlock(event) {
    if(!event.isTrusted)return;
    try {prepare();if(context?.state==='suspended')context.resume().catch(()=>{});}catch{}
  }
  document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
  document.addEventListener('keydown',unlock,{capture:true,passive:true});
  window.addEventListener('pagehide',()=>context?.suspend().catch(()=>{}));
  return side=>{
    if(document.hidden||performance.now()-last<100)return;
    try {
      prepare();
      // A hover cannot unlock audio in every browser. Never queue stale sounds.
      if(context?.state!=='running')return;
      last=performance.now();
      const now=context.currentTime,source=context.createBufferSource(),gain=context.createGain();
      const filter=context.createBiquadFilter(),pan=context.createStereoPanner();
      source.buffer=buffer;source.playbackRate.value=side===0?1:1.07;
      filter.type='lowpass';filter.frequency.setValueAtTime(3300,now);filter.frequency.exponentialRampToValueAtTime(650,now+.075);
      pan.pan.value=side===0?-.18:.18;
      gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.24,now+.004);gain.gain.exponentialRampToValueAtTime(.0001,now+.08);
      source.connect(filter).connect(gain).connect(pan).connect(context.destination);
      source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};
      source.start(now);source.stop(now+.085);
    } catch { /* Optional audio never interrupts navigation. */ }
  };
}
