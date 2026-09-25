import { accountRequest } from '../account-client.js';

export function initAccountWorlds({dialog,getSession,notify}) {
  const section=dialog.querySelector('#account-worlds'), list=dialog.querySelector('#world-list'), invites=dialog.querySelector('#received-invites');
  let activeToken=null,loading=false,confirmDelete=null;
  // Tabs follow the games: Profile, Worldloom (worlds + invites), TacticStrike, Aurora.
  // Online features need a verified email; Aurora keeps its progress in this browser.
  const TABS=['profile','worlds','tacticstrike','aurora'];
  const alias={invites:'worlds',credits:'tacticstrike',shop:'tacticstrike'};
  const initial=new URLSearchParams(location.search);
  let tab=alias[initial.get('account')]||initial.get('account')||(initial.get('return')?'tacticstrike':'profile');
  let previousTab=null,focusInvites=initial.get('account')==='invites';
  const lockReason=name=>{
    const user=getSession().user;
    if(!user||name==='profile'||name==='aurora')return '';
    if(!user.emailVerified)return name==='worlds'?'Verify your email to save Worldloom worlds to your account and receive invites.':'Verify your email to use credits and the TacticStrike shop.';
    return '';
  };
  function showTab(next){
    if(next==='invites')focusInvites=true;
    tab=TABS.includes(alias[next]||next)?(alias[next]||next):'profile';
    const lock=lockReason(tab),visibleTab=lock?null:tab;
    const lockEl=dialog.querySelector('#account-tab-lock');lockEl.hidden=!lock;lockEl.textContent=lock;
    dialog.querySelector('#account-details').hidden=visibleTab!=='profile';
    section.hidden=visibleTab!=='worlds';
    dialog.querySelector('#world-library').hidden=visibleTab!=='worlds';
    dialog.querySelector('#tacticstrike-panel').hidden=visibleTab!=='tacticstrike';
    dialog.querySelector('#aurora-panel').hidden=visibleTab!=='aurora';
    if(visibleTab==='aurora')renderAurora();
    dialog.querySelectorAll('[data-account-tab]').forEach(button=>{
      const on=button.dataset.accountTab===tab;
      button.setAttribute('aria-selected',String(on));button.tabIndex=on?0:-1;
      button.classList.toggle('is-locked',Boolean(lockReason(button.dataset.accountTab)));button.disabled=false;
    });
    if(previousTab!==null&&previousTab!==tab&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const panel=lock?lockEl:dialog.querySelector({profile:'#account-details',worlds:'#world-library',tacticstrike:'#tacticstrike-panel',aurora:'#aurora-panel'}[tab]);
      panel.getAnimations().forEach(animation=>animation.cancel());
      panel.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,easing:'cubic-bezier(.2,.7,.3,1)'});
    }
    previousTab=tab;
  }
  function renderAurora(){
    let p={};try{p=JSON.parse(localStorage.getItem('aurora-progress')||'{}')||{};}catch{}
    const cleared=(p.best||[]).filter(x=>x!=null).length,gold=(p.medal||[]).filter(m=>m==='gold').length;
    const relics=Object.values(p.relics||{}).reduce((n,a)=>n+(Array.isArray(a)?a.filter(Boolean).length:0),0);
    dialog.querySelector('#aurora-cleared').textContent=String(cleared);
    dialog.querySelector('#aurora-gold').textContent=String(gold);
    dialog.querySelector('#aurora-relics').textContent=String(relics);
  }
  dialog.querySelectorAll('[data-account-tab]').forEach(button=>{
    button.addEventListener('click',()=>{showTab(button.dataset.accountTab);refresh(true);});
    button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...dialog.querySelectorAll('[data-account-tab]')];const i=tabs.indexOf(button),target=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];target.click();target.focus();});
  });
  const text=(tag,value,className)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
  function localSave(){
    try{return ['worldloom.save.v1','worldloom.save.backup.v1'].map(key=>JSON.parse(localStorage.getItem(key)||'null')).filter(s=>s?.schemaVersion===1&&Number.isInteger(s.seed)&&s.player&&s.inventory).sort((a,b)=>Date.parse(b.updatedAt||0)-Date.parse(a.updatedAt||0))[0]||null;}catch{return null;}
  }
  async function request(path,body={}){const {token}=getSession();return accountRequest(path,{token,method:'POST',body:JSON.stringify(body)});}
  async function join(w){try{const result=await request(`/api/worlds/${w.id}/join`);location.assign(result.url);}catch(e){notify(e.message);}}
  function row(w,invitation=false){
    const el=document.createElement('article');el.className='saved-world';
    const copy=document.createElement('div');copy.append(text('h4',w.name),text('p',invitation?`From ${w.ownerName} · 2 players`:w.owner?`${w.mode==='builder'?'Dreamweaver':'Wayfarer'} · ${w.guestName?(w.accepted?'With ':'Invited ')+w.guestName:'Just you'}`:`Shared by ${w.ownerName}`));
    el.append(copy);
    const actions=document.createElement('div');actions.className='world-actions';
    const play=text('button',invitation?'Join world':'Play','world-play');play.type='button';play.addEventListener('click',()=>join(w));actions.append(play);
    if(w.owner){const remove=text('button','Delete','world-delete');remove.type='button';remove.setAttribute('aria-label',`Delete ${w.name}`);remove.addEventListener('click',()=>{
      if(confirmDelete===w.id)return;
      confirmDelete=w.id;
      const prompt=document.createElement('div');prompt.className='world-delete-confirm';prompt.append(text('p',`Delete “${w.name}” for both players? This cannot be undone.`));
      const yes=text('button','Delete permanently','world-delete'),no=text('button','Keep world','world-play');
      yes.type=no.type='button';
      yes.addEventListener('click',async()=>{yes.disabled=true;try{await request(`/api/worlds/${w.id}/delete`);confirmDelete=null;await refresh(true);notify('World deleted.');}catch(e){notify(e.message);yes.disabled=false;}});
      no.addEventListener('click',()=>{confirmDelete=null;prompt.remove();});prompt.append(yes,no);el.append(prompt);
    });actions.append(remove);}
    el.append(actions);return el;
  }
  async function refresh(force=false){
    const session=getSession(),token=session.user?.emailVerified?session.token:null;
    showTab(tab);
    if(!token){activeToken=null;list.replaceChildren();invites.replaceChildren();return;}
    if(activeToken&&activeToken!==token){activeToken=null;list.replaceChildren();invites.replaceChildren();}
    if(loading||(!force&&activeToken===token))return;loading=true;
    list.setAttribute('aria-busy','true');
    try{
      const data=await accountRequest('/api/worlds',{token});if(getSession().token!==token)return;
      activeToken=token;const owned=data.worlds.filter(w=>w.owner).length;
      dialog.querySelector('#world-count').textContent=`${owned} / 10`;
      dialog.querySelector('#invite-count').textContent=String(data.invites.length);
      dialog.querySelector('#invite-tab-count').textContent=data.invites.length?String(data.invites.length):'';
      list.replaceChildren(...data.worlds.map(w=>row(w)));
      if(!data.worlds.length)list.append(text('p','No worlds yet. Create one in Worldloom with “Save to my account” and it appears here, ready to continue on any device.','world-empty'));
      invites.replaceChildren(...data.invites.map(w=>row(w,true)));
      dialog.querySelector('#invitation-panel').hidden=!data.invites.length;
      if(focusInvites&&data.invites.length){focusInvites=false;dialog.querySelector('#invitation-panel').scrollIntoView({block:'nearest'});}
      dialog.querySelector('#import-local-world').hidden=!localSave()||owned>=10;
    }catch(e){notify(e.message);}finally{loading=false;list.removeAttribute('aria-busy');}
  }
  dialog.querySelector('#refresh-worlds').addEventListener('click',()=>refresh(true));
  dialog.querySelector('#import-local-world').addEventListener('click',async event=>{
    const save=localSave();if(!save)return;
    event.currentTarget.disabled=true;
    try{await request('/api/worlds',{name:save.name||'My saved world',seed:save.seed,mode:save.mode||'survival',importSave:save});await refresh(true);notify('Local world copied to your account. The browser copy is still available.');}
    catch(e){notify(e.message);}finally{dialog.querySelector('#import-local-world').disabled=false;}
  });
  const timer=setInterval(()=>{if(dialog.open&&getSession().user?.emailVerified)refresh(true);},30_000);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
  return {refresh,showTab,renderAurora};
}
