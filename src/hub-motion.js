import {createHubFlick} from './hub-sound.js';

export function initHubMotion() {
  const games = document.querySelector('.games');
  const panels = [...games.querySelectorAll('.game')];
  const wide = matchMedia('(min-width:701px)');
  const pointer = matchMedia('(hover:hover) and (pointer:fine)');
  const flick=createHubFlick();
  let lastActive=null;
  let position=.5, velocity=0, target=.5, frame=0, previous=0, hovered=null;

  function tick(now) {
    const dt=Math.max(0,Math.min((now-previous)/1000,.04));previous=now;
    // Critically damped spring: retain velocity when the pointer changes sides.
    // Unlike restarting a CSS transition, a reversal doesn't jerk the divider.
    const frequency=10, offset=position-target, step=(velocity+frequency*offset)*dt;
    const decay=Math.exp(-frequency*dt);
    position=target+(offset+step)*decay;
    velocity=(velocity-frequency*step)*decay;
    games.style.setProperty('--split',`${position*100}%`);
    if(Math.abs(position-target)<.00005&&Math.abs(velocity)<.0005){
      position=target;velocity=0;games.style.setProperty('--split',`${target*100}%`);frame=0;
    }else frame=requestAnimationFrame(tick);
  }
  function select() {
    const focused=panels.find(p=>p.matches(':focus-visible'));
    const active=focused||hovered;
    if(active && active!==lastActive)flick(panels.indexOf(active));
    lastActive=active;
    target=wide.matches && active ? (active===panels[0] ? .62 : .38) : .5;
    games.dataset.active=wide.matches&&active ? (active===panels[0]?'worldloom':'tacticstrike') : '';
    if(!frame){previous=performance.now();frame=requestAnimationFrame(tick);}
  }
  for(const panel of panels)panel.addEventListener('pointerenter',event=>{
    if(event.pointerType==='mouse'&&pointer.matches){hovered=panel;select();}
  });
  games.addEventListener('pointerleave',()=>{hovered=null;select();});
  games.addEventListener('focusin',select);
  games.addEventListener('focusout',()=>queueMicrotask(select));
  wide.addEventListener('change',()=>{hovered=null;select();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;velocity=0;hovered=null;position=target=.5;games.style.setProperty('--split','50%');games.dataset.active='';}
  });
  games.classList.add('motion-ready');
}
