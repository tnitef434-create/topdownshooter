import { ACCOUNT_SESSION_KEY, ACCOUNT_USER_CACHE_KEY, readAccountSession, storeAccountSession, removeAccountSession, accountRequest } from '../account-client.js';
import { initAccountWorlds } from './worlds.js';

import { mountAccountDialog } from './dialog-markup.js';

let googleIdentityPromise;
function loadGoogleIdentity() {
  if(window.google?.accounts?.id)return Promise.resolve(window.google.accounts.id);
  if(!googleIdentityPromise)googleIdentityPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;
    const finish=(error=null)=>{
      clearTimeout(timeout);script.onload=null;script.onerror=null;
      if(error){script.remove();googleIdentityPromise=null;reject(error);}
      else resolve(window.google.accounts.id);
    };
    const timeout=setTimeout(()=>finish(new Error('Google sign-in timed out')),10000);
    script.onload=()=>finish(window.google?.accounts?.id?null:new Error('Google sign-in unavailable'));
    script.onerror=()=>finish(new Error('Google sign-in unavailable'));
    document.head.append(script);
  });
  return googleIdentityPromise;
}

export function initHubAccount({trigger=document.querySelector('#open-account'),autoOpen=true,onSessionChange=()=>{}}={}) {
  const dialog=mountAccountDialog();
  const form=dialog.querySelector('form');
  const title=dialog.querySelector('#account-title');
  const message=dialog.querySelector('#account-message');
  const profile=dialog.querySelector('#account-profile');
  const password=form.elements.password, confirm=form.elements.confirm;
  const usernameForm=dialog.querySelector('#account-username-form');
  const profileUsername=usernameForm.elements.username;
  let renderedUsername=null;
  const switcher=dialog.querySelector('#account-switch');
  const forgot=dialog.querySelector('#account-forgot');
  const editEmail=dialog.querySelector('#account-edit-email');
  const googleOption=dialog.querySelector('#account-google-option'), googleButton=dialog.querySelector('#account-google');
  let googleIdentity=null,googleButtonWidth=0;
  let googleSetupPromise=null,googleRetryTimer=null,googleAttempts=0,googleLastAttempt=0;
  const submit=form.querySelector('[type="submit"]');
  const logout=dialog.querySelector('#account-logout');
  const params=new URLSearchParams(location.search);
  const fragment=new URLSearchParams(location.hash.slice(1));
  let verificationToken=fragment.get('verify'), resetToken=fragment.get('resetToken');
  if(verificationToken||resetToken){const clean=new URL(location.href);fragment.delete('verify');fragment.delete('resetToken');clean.hash=fragment.toString();history.replaceState(null,'',clean);}
  const generate=dialog.querySelector('#account-generate-code'), copy=dialog.querySelector('#account-copy-code'), resend=dialog.querySelector('#account-resend');
  const destinations={credits:'/tacticstrike/?shop=credits',support:'/tacticstrike/?shop=support'};
  const returnTo=destinations[params.get('return')];
  let session=readAccountSession(), mode=resetToken?'reset-confirm':verificationToken?'verify':params.get('account')==='register'?'register':'login', busy=false;
  const worlds=initAccountWorlds({dialog,getSession:()=>session,notify});

  function notify(text='') { message.textContent=text; }
  function render() {
    const choosingPassword=mode==='verify'||mode==='reset-confirm';
    const requestingEmail=mode==='register'||mode==='reset-request';
    const pendingEmail=mode==='verify-sent'||mode==='reset-sent';
    const signedIn=Boolean(session.user)&&!choosingPassword&&!pendingEmail&&mode!=='reset-request';
    const verified=session.user?.emailVerified===true;
    usernameForm.hidden=!verified;
    if(renderedUsername!==session.user?.username){profileUsername.value=session.user?.username||'';renderedUsername=session.user?.username;}
    profileUsername.disabled=busy;usernameForm.querySelector('button').disabled=busy;
    usernameForm.querySelector('button').textContent=session.user?.username?'SAVE USERNAME':'CREATE USERNAME';
    if(trigger)trigger.textContent=signedIn?'MY ACCOUNT':'ACCOUNT';
    const titles={login:'WELCOME BACK',register:'CREATE ACCOUNT',verify:'VERIFY YOUR EMAIL','reset-request':'RESET YOUR PASSWORD','reset-confirm':'CHOOSE A NEW PASSWORD','verify-sent':'CHECK YOUR INBOX','reset-sent':'CHECK YOUR INBOX'};
    title.textContent=signedIn?'YOUR ACCOUNT':titles[mode];
    form.hidden=signedIn||pendingEmail;profile.hidden=!signedIn;switcher.hidden=signedIn;
    const intros={verify:'Choose a password to verify your email and finish creating your account.',register:'Start with your email. We’ll send a link where you can choose your password.', 'reset-request':'Enter your account email and we’ll send a link to choose a new password.', 'reset-confirm':'Choose a new password for your account. Your other sessions will be signed out.','verify-sent':'Open the verification link in your email to choose your password.','reset-sent':'Follow the instructions in your email to choose a new password.'};
    dialog.querySelector('#account-intro').textContent=intros[mode]||(returnTo?'Your account connects to TacticStrike.':'Your games. Your friends. Your worlds.');
    dialog.querySelector('#account-email').textContent=session.user?.email||'';
    dialog.querySelector('#account-credits').textContent=String(session.user?.credits||0);
    dialog.querySelector('#account-return').href=returnTo||'/tacticstrike/?shop=credits';
    dialog.querySelector('#account-return').textContent=returnTo?'CONTINUE TO TACTICSTRIKE':'TACTICSTRIKE CREDIT SHOP';
    form.elements.email.closest('label').hidden=choosingPassword;form.elements.email.required=!choosingPassword;
    password.closest('label').hidden=requestingEmail;password.required=!requestingEmail;
    password.disabled=requestingEmail||pendingEmail||busy;
    confirm.closest('label').hidden=!choosingPassword;confirm.required=choosingPassword;confirm.disabled=!choosingPassword||busy;
    forgot.hidden=signedIn||mode!=='login';forgot.disabled=busy;
    editEmail.hidden=!pendingEmail;editEmail.disabled=busy;
    googleOption.hidden=!googleIdentity||signedIn||!['login','register'].includes(mode);
    googleOption.inert=busy;
    dialog.querySelector('#account-verification-status').textContent=verified?'Email verified':'Verify your email to activate this account.';
    resend.hidden=verified;resend.disabled=busy;
    dialog.querySelector('#account-return').hidden=!verified;
    dialog.querySelector('#account-friend').hidden=!verified;
    const code=session.user?.friendCode;
    dialog.querySelector('#account-friend-code').textContent=code||'';
    dialog.querySelector('#account-friend-code').hidden=!code;
    generate.hidden=Boolean(code);generate.disabled=busy;copy.hidden=!code;
    generate.textContent=busy?'PLEASE WAIT…':'GENERATE MY CODE';
    password.autocomplete=choosingPassword?'new-password':'current-password';
    const actions={login:'SIGN IN',register:'SEND VERIFICATION EMAIL',verify:'VERIFY & ACTIVATE','reset-request':'SEND RESET LINK','reset-confirm':'SAVE NEW PASSWORD'};
    submit.textContent=busy?'PLEASE WAIT…':actions[mode]||'CONTINUE';
    switcher.textContent=mode==='verify'?'Link expired? Send another verification email':mode==='reset-confirm'?'Link expired? Send another reset link':mode==='register'?'Already a member? Sign in':mode==='login'?'New here? Create an account':'Back to sign in';
    for (const control of [submit,switcher,logout]) control.disabled=busy;
    form.elements.email.disabled=choosingPassword||pendingEmail||busy;
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
  function renderGoogleButton() {
    if(!googleIdentity)return;
    const width=Math.min(360,Math.max(200,innerWidth-100));
    if(width===googleButtonWidth)return;
    googleButtonWidth=width;googleButton.replaceChildren();
    googleIdentity.renderButton(googleButton,{type:'standard',theme:'filled_black',size:'large',text:'continue_with',shape:'rectangular',width});
  }
  async function signInWithGoogle({credential}={}) {
    if(busy||!credential||!['login','register'].includes(mode))return;
    busy=true;notify();render();
    try {
      const result=await accountRequest('/api/auth/google',{method:'POST',body:JSON.stringify({credential})});
      try{storeAccountSession(result);}catch{throw new Error('Allow site storage in your browser to stay signed in.');}
      session={token:result.token,user:result.user};mode='login';form.reset();notify('You’re signed in.');
    } catch(error){notify(error.message);}
    finally{busy=false;render();if(session.user?.emailVerified&&!session.user.username)profileUsername.focus();}
  }
  async function configureGoogle() {
    if(googleIdentity||googleSetupPromise||googleAttempts>=3)return;
    googleAttempts++;googleLastAttempt=Date.now();
    googleSetupPromise=(async()=>{
      try {
        const status=await accountRequest('/api/auth/status');
        if(typeof status.googleClientId!=='string'||!status.googleClientId.trim())return;
        googleIdentity=await loadGoogleIdentity();
        googleIdentity.initialize({client_id:status.googleClientId,callback:signInWithGoogle,auto_select:false,ux_mode:'popup'});
        renderGoogleButton();render();
      } catch {
        googleIdentity=null;googleOption.hidden=true;
        if(dialog.open&&navigator.onLine&&googleAttempts<3){
          clearTimeout(googleRetryTimer);
          googleRetryTimer=setTimeout(()=>{googleRetryTimer=null;configureGoogle();},googleAttempts*5000);
        }
      } finally {googleSetupPromise=null;}
    })();
    await googleSetupPromise;
  }
  function retryGoogle() {
    if(googleIdentity||googleSetupPromise)return;
    googleAttempts=0;clearTimeout(googleRetryTimer);
    googleRetryTimer=setTimeout(()=>{googleRetryTimer=null;configureGoogle();},Math.max(0,5000-(Date.now()-googleLastAttempt)));
  }
  window.addEventListener('resize',renderGoogleButton);
  window.addEventListener('online',retryGoogle);
  function open({tab,mode:requestedMode}={}) {
    if(closing){closing.cancel();closing=null;}
    if(!session.user&&['login','register'].includes(requestedMode))mode=requestedMode;
    if(tab)worlds.showTab(tab);
    render();notify();if(!dialog.open)dialog.showModal();restore();worlds.refresh(true);
    retryGoogle();
  }
  trigger?.addEventListener('click',()=>open());
  dialog.querySelector('#account-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  dialog.addEventListener('close',()=>{
    clearTimeout(googleRetryTimer);googleRetryTimer=null;
    password.value='';confirm.value='';
    const url=new URL(location.href);url.searchParams.delete('account');url.searchParams.delete('return');history.replaceState(null,'',url);
  });
  switcher.addEventListener('click',()=>{mode=mode==='login'||mode==='verify'?'register':mode==='reset-confirm'?'reset-request':'login';verificationToken=null;resetToken=null;password.value='';confirm.value='';notify();render();});
  forgot.addEventListener('click',()=>{mode='reset-request';password.value='';confirm.value='';notify();render();form.elements.email.focus();});
  editEmail.addEventListener('click',()=>{mode=mode==='reset-sent'?'reset-request':'register';notify();render();form.elements.email.focus();});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    if((mode==='verify'||mode==='reset-confirm')&&password.value!==confirm.value){notify('Passwords do not match.');confirm.focus();return;}
    busy=true;notify();render();
    try {
      const email=form.elements.email.value.trim();
      const routes={login:'login',register:'register',verify:'verify-email','reset-request':'password-reset/request','reset-confirm':'password-reset/confirm'};
      const body=mode==='verify'?{token:verificationToken,password:password.value}:mode==='reset-confirm'?{token:resetToken,password:password.value}:mode==='register'||mode==='reset-request'?{email}:{email,password:password.value};
      const result=await accountRequest(`/api/auth/${routes[mode]}`,{method:'POST',body:JSON.stringify(body)});
      if(result.verificationRequired||mode==='register'||mode==='reset-request'){
        notify(result.message||'Check your inbox for your next step.');password.value='';confirm.value='';mode=mode==='reset-request'?'reset-sent':'verify-sent';return;
      }
      if(mode==='reset-confirm'){
        removeAccountSession();session={token:null,user:null};resetToken=null;form.reset();mode='login';
        notify(result.message||'Password updated. Sign in with your new password.');return;
      }
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
    googleIdentity?.disableAutoSelect?.();
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
  configureGoogle();
  if((autoOpen&&params.has('account'))||verificationToken||resetToken)open();else restore();
  return {open,close,dialog};
}
