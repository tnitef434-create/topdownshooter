import { ACCOUNT_SESSION_KEY, ACCOUNT_USER_CACHE_KEY, readAccountSession, storeAccountSession, removeAccountSession, accountRequest } from '../account-client.js';
import { initAccountWorlds } from './worlds.js';

import { mountAccountDialog } from './dialog-markup.js';

export function initHubAccount({trigger=document.querySelector('#open-account'),autoOpen=true,onSessionChange=()=>{}}={}) {
  const dialog=mountAccountDialog();
  const form=dialog.querySelector('form');
  const title=dialog.querySelector('#account-title');
  const message=dialog.querySelector('#account-message');
  const profile=dialog.querySelector('#account-profile');
  const password=form.elements.password, confirm=form.elements.confirm;
  const username=form.elements.username;
  const usernameForm=dialog.querySelector('#account-username-form');
  const profileUsername=usernameForm.elements.username;
  let renderedUsername=null;
  const switcher=dialog.querySelector('#account-switch');
  const submit=form.querySelector('[type="submit"]');
  const logout=dialog.querySelector('#account-logout');
  const params=new URLSearchParams(location.search);
  let verificationToken=new URLSearchParams(location.hash.slice(1)).get('verify');
  if(verificationToken){const clean=new URL(location.href);clean.hash='';history.replaceState(null,'',clean);}
  const generate=dialog.querySelector('#account-generate-code'), copy=dialog.querySelector('#account-copy-code'), resend=dialog.querySelector('#account-resend');
  const destinations={credits:'/tacticstrike/?shop=credits',support:'/tacticstrike/?shop=support'};
  const returnTo=destinations[params.get('return')];
  let session=readAccountSession(), mode=verificationToken?'verify':params.get('account')==='register'?'register':'login', busy=false;
  const worlds=initAccountWorlds({dialog,getSession:()=>session,notify});

  function notify(text='') { message.textContent=text; }
  function render() {
    const signedIn=Boolean(session.user)&&mode!=='verify';
    const verified=session.user?.emailVerified===true;
    username.closest('label').hidden=mode!=='register';username.required=mode==='register';username.disabled=mode!=='register'||busy;
    usernameForm.hidden=!verified;
    if(renderedUsername!==session.user?.username){profileUsername.value=session.user?.username||'';renderedUsername=session.user?.username;}
    profileUsername.disabled=busy;usernameForm.querySelector('button').disabled=busy;
    usernameForm.querySelector('button').textContent=session.user?.username?'SAVE USERNAME':'CREATE USERNAME';
    if(trigger)trigger.textContent=signedIn?'MY ACCOUNT':'ACCOUNT';
    title.textContent=signedIn?'YOUR ACCOUNT':mode==='verify'?'VERIFY YOUR EMAIL':mode==='register'?'CREATE ACCOUNT':'WELCOME BACK';
    form.hidden=signedIn;profile.hidden=!signedIn;switcher.hidden=signedIn;
    dialog.querySelector('#account-intro').textContent=mode==='verify'?'Choose a password to finish verifying your account.':mode==='register'?'Verify your email, then generate your permanent four-digit friend code.':returnTo?'Your account connects to TacticStrike.':'Your games. Your friends. Your worlds.';
    dialog.querySelector('#account-email').textContent=session.user?.email||'';
    dialog.querySelector('#account-credits').textContent=String(session.user?.credits||0);
    dialog.querySelector('#account-return').href=returnTo||'/tacticstrike/?shop=credits';
    dialog.querySelector('#account-return').textContent=returnTo?'CONTINUE TO TACTICSTRIKE':'TACTICSTRIKE CREDIT SHOP';
    const newPassword=mode==='register'||mode==='verify';
    form.elements.email.closest('label').hidden=mode==='verify';form.elements.email.required=mode!=='verify';
    confirm.closest('label').hidden=!newPassword;confirm.required=newPassword;confirm.disabled=!newPassword||busy;
    dialog.querySelector('#account-verification-status').textContent=verified?'Email verified':'Verify your email to activate this account.';
    resend.hidden=verified;resend.disabled=busy;
    dialog.querySelector('#account-return').hidden=!verified;
    dialog.querySelector('#account-friend').hidden=!verified;
    const code=session.user?.friendCode;
    dialog.querySelector('#account-friend-code').textContent=code||'';
    dialog.querySelector('#account-friend-code').hidden=!code;
    generate.hidden=Boolean(code);generate.disabled=busy;copy.hidden=!code;
    generate.textContent=busy?'PLEASE WAIT…':'GENERATE MY CODE';
    password.autocomplete=newPassword?'new-password':'current-password';
    submit.textContent=busy?'PLEASE WAIT…':mode==='verify'?'VERIFY & ACTIVATE':mode==='register'?'CREATE ACCOUNT':'SIGN IN';
    switcher.textContent=mode==='verify'?'Link expired? Request another by signing in':mode==='register'?'Already a member? Sign in':'New here? Create an account';
    for (const control of [form.elements.email,password,submit,switcher,logout]) control.disabled=busy;
    dialog.setAttribute('aria-busy',String(busy));
    worlds.refresh();
    onSessionChange(session);
  }
  async function restore() {
    const token=session.token;
    if(!token){render();return;}
    try {
      const result=await accountRequest('/api/auth/me',{token});
      if(session.token!==token)return;
      session.user=result.user;
      storeAccountSession(session);
    } catch(error) {
      if(session.token!==token)return;
      if(error.status===401){removeAccountSession();session={token:null,user:null};notify('Please sign in again.');}
      else if(dialog.open)notify(error.message);
    }
    render();
  }
  let closing=null;
  function close() {
    if(!dialog.open||closing)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.close();return;}
    const animation=dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(8px)'}],{duration:160,easing:'ease-in',fill:'forwards'});
    closing=animation;
    animation.finished.then(()=>{if(closing===animation){dialog.close();closing=null;animation.cancel();}}).catch(()=>{});
  }
  function open({tab,mode:requestedMode}={}) {
    if(closing){closing.cancel();closing=null;}
    if(!session.user&&['login','register'].includes(requestedMode))mode=requestedMode;
    if(tab)worlds.showTab(tab);
    render();notify();if(!dialog.open)dialog.showModal();restore();worlds.refresh(true);
  }
  trigger?.addEventListener('click',()=>open());
  dialog.querySelector('#account-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  dialog.addEventListener('close',()=>{
    password.value='';confirm.value='';
    const url=new URL(location.href);url.searchParams.delete('account');url.searchParams.delete('return');history.replaceState(null,'',url);
  });
  switcher.addEventListener('click',()=>{mode=mode==='login'?'register':'login';verificationToken=null;password.value='';confirm.value='';notify();render();});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    if((mode==='register'||mode==='verify')&&password.value!==confirm.value){notify('Passwords do not match.');confirm.focus();return;}
    busy=true;notify();render();
    try {
      const result=await accountRequest(`/api/auth/${mode==='verify'?'verify-email':mode}`,{method:'POST',body:JSON.stringify({email:form.elements.email.value.trim(),password:password.value,...(mode==='register'?{username:username.value.trim()}:{}),...(mode==='verify'?{token:verificationToken}:{})})});
      if(result.verificationRequired){notify(result.message);password.value='';confirm.value='';mode='login';return;}
      try {storeAccountSession(result);} catch {throw new Error('Allow site storage in your browser to stay signed in.');}
      session={token:result.token,user:result.user};form.reset();
      if(mode==='verify'){const clean=new URL(location.href);clean.searchParams.delete('account');history.replaceState(null,'',clean);}
      notify(mode==='verify'?'Email verified. Your account is ready. Generate your friend code below.':'You’re signed in.');mode='login';verificationToken=null;
    } catch(error){notify(error.message);}
    finally{busy=false;render();if(session.user?.emailVerified)(!session.user.username?profileUsername:session.user.friendCode?dialog.querySelector('#account-return'):generate).focus();}
  });
  usernameForm.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    const value=profileUsername.value.trim(), token=session.token;
    busy=true;notify();render();
    try {
      const result=await accountRequest('/api/auth/username',{method:'POST',token,body:JSON.stringify({username:value})});
      if(session.token!==token)return;
      session.user=result.user;storeAccountSession(session);notify('Username saved. Both games will use this name.');
    } catch(error){notify(error.message);}
    finally{busy=false;render();}
  });
  logout.addEventListener('click',async()=>{
    if(busy)return;busy=true;render();
    try {await accountRequest('/api/auth/logout',{method:'POST',token:session.token});}
    catch(error){if(error.status!==401){busy=false;notify(error.message);render();return;}}
    removeAccountSession();session={token:null,user:null};mode='login';busy=false;notify('You’re signed out.');render();
  });
  generate.addEventListener('click',async()=>{
    if(busy)return;busy=true;notify();render();const token=session.token;
    try{const result=await accountRequest('/api/auth/friend-code',{method:'POST',token});if(session.token!==token)return;session.user=result.user;storeAccountSession(session);notify('Your permanent friend code is ready.');}
    catch(error){notify(error.message);}finally{busy=false;render();}
  });
  copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(session.user.friendCode);notify('Friend code copied.');}catch{notify('Select your friend code to copy it.');}});
  resend.addEventListener('click',async()=>{
    if(busy)return;busy=true;render();
    try{const result=await accountRequest('/api/auth/resend-verification',{method:'POST',token:session.token});notify(result.message);}
    catch(error){notify(error.message);}finally{busy=false;render();}
  });
  window.addEventListener('storage',event=>{
    if(event.key===null||[ACCOUNT_SESSION_KEY,ACCOUNT_USER_CACHE_KEY].includes(event.key)){
      session=readAccountSession();render();
    }
  });
  render();
  if(autoOpen&&params.has('account'))open();else restore();
  return {open,close,dialog};
}
