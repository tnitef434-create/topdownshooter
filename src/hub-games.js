// "All games" menu: opens under its button next to the U mark.
export function initAllGames(){
  const trigger=document.getElementById('all-games-trigger'),panel=document.getElementById('all-games');
  if(!trigger||!panel)return;
  const position=()=>{
    const r=trigger.getBoundingClientRect();
    panel.style.left=`${Math.max(12,Math.min(r.left,innerWidth-panel.offsetWidth-12))}px`;
    panel.style.top=`${r.bottom+10}px`;
  };
  panel.addEventListener('toggle',event=>{
    const open=event.newState==='open';
    trigger.setAttribute('aria-expanded',String(open));
    if(open){position();panel.querySelector('a')?.focus({preventScroll:true});}
  });
  addEventListener('resize',()=>{if(panel.matches(':popover-open'))position();});
}
