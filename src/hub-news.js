export function initHubNews() {
  const trigger=document.getElementById('hub-news-trigger'),panel=document.getElementById('hub-news');
  let timer;
  const cancel=()=>clearTimeout(timer);
  function position(){
    const r=trigger.getBoundingClientRect();
    panel.style.left=`${Math.max(12,Math.min(r.left,innerWidth-260))}px`;
    panel.style.top=`${r.bottom+12}px`;
  }
  const open=()=>{cancel();if(!panel.matches(':popover-open'))panel.showPopover();position();};
  const closeLater=()=>{cancel();timer=setTimeout(()=>{if(!panel.contains(document.activeElement)&&document.activeElement!==trigger)panel.hidePopover();},160);};
  trigger.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')open();});
  trigger.addEventListener('pointerleave',closeLater);
  trigger.addEventListener('focus',()=>{if(trigger.matches(':focus-visible'))open();});
  trigger.addEventListener('blur',closeLater);
  panel.addEventListener('pointerenter',cancel);
  panel.addEventListener('pointerleave',closeLater);
  panel.addEventListener('beforetoggle',event=>{
    trigger.setAttribute('aria-expanded',String(event.newState==='open'));
    if(event.newState==='open')position();
  });
  window.addEventListener('resize',position);
  window.addEventListener('pagehide',()=>{cancel();panel.hidePopover();});
}
