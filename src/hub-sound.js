// Hover sound for the game panels: a soft glassy tap — a tiny click for the attack, a
// short sine "pluck" that settles a few cents downward, and a quiet octave shimmer.
// Each game gets its own note (Worldloom, TacticStrike, Aurora) so moving between
// panels sounds like a small chord rather than repeated noise.
const NOTES=[523.25,587.33,659.25];   // C5 · D5 · E5
const PAN=[-.2,.2,0];
export function createHubFlick() {
  let context,out,last=-Infinity;
  function prepare() {
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return;
    if(!context){
      context=new Context();
      // gentle master chain: soften the top end and keep peaks polite
      const shelf=context.createBiquadFilter();shelf.type='highshelf';shelf.frequency.value=5000;shelf.gain.value=-6;
      const comp=context.createDynamicsCompressor();comp.threshold.value=-20;comp.ratio.value=3;comp.attack.value=.002;comp.release.value=.12;
      out=context.createGain();out.gain.value=.9;
      out.connect(shelf).connect(comp).connect(context.destination);
    }
  }
  function unlock(event) {
    if(!event.isTrusted)return;
    try {prepare();if(context?.state==='suspended')context.resume().catch(()=>{});}catch{}
  }
  document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
  document.addEventListener('keydown',unlock,{capture:true,passive:true});
  window.addEventListener('pagehide',()=>context?.suspend().catch(()=>{}));
  function voice(now,{f,to=f,type='sine',vol,attack=.003,dur,pan}){
    const o=context.createOscillator(),g=context.createGain(),p=context.createStereoPanner();
    o.type=type;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(to,now+dur*.6);
    g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(vol,now+attack);g.gain.exponentialRampToValueAtTime(.0001,now+dur);
    p.pan.value=pan;
    o.connect(g).connect(p).connect(out);
    o.onended=()=>{o.disconnect();g.disconnect();p.disconnect();};
    o.start(now);o.stop(now+dur+.02);
  }
  return side=>{
    if(document.hidden||performance.now()-last<90)return;
    try {
      prepare();
      // A hover cannot unlock audio in every browser. Never queue stale sounds.
      if(context?.state!=='running')return;
      last=performance.now();
      const now=context.currentTime,f=NOTES[side]??NOTES[0],pan=PAN[side]??0;
      voice(now,{f:f*4,to:f*2,type:'triangle',vol:.018,attack:.001,dur:.025,pan});   // click
      voice(now,{f:f*1.004,to:f,vol:.07,dur:.32,pan});                               // body
      voice(now+.012,{f:f*2,to:f*2*.998,vol:.018,dur:.22,pan:-pan});                // shimmer
    } catch { /* Optional audio never interrupts navigation. */ }
  };
}
