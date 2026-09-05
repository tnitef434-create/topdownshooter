import { ACCOUNT_SESSION_KEY, ACCOUNT_USER_CACHE_KEY, readAccountSession, storeAccountSession, removeAccountSession, accountRequest } from './account-session.js';

export function initHubAccount() {
  const dialog=document.querySelector('#hub-account');
  const trigger=document.querySelector('#open-account');
  const form=dialog.querySelector('form');
  const title=dialog.querySelector('#account-title');
  const message=dialog.querySelector('#account-message');
  const profile=dialog.querySelector('#account-profile');
  const password=form.elements.password, confirm=form.elements.confirm;
  const switcher=dialog.querySelector('#account-switch');
  const submit=form.querySelector('[type="submit"]');
  const logout=dialog.querySelector('#account-logout');
  const params=new URLSearchParams(location.search);
  const destinations={credits:'/tacticstrike/?shop=credits',support:'/tacticstrike/?shop=support'};
  const returnTo=destinations[params.get('return')];
  let session=readAccountSession(), mode=params.get('account')==='register'?'register':'login', busy=false;

  function notify(text='') { message.textContent=text; }
  function render() {
    const signedIn=Boolean(session.user);
    trigger.textContent=signedIn?'MY ACCOUNT':'ACCOUNT';
    title.textContent=signedIn?'YOUR ACCOUNT':mode==='register'?'JOIN UNPAUSED':'WELCOME BACK';
    form.hidden=signedIn;profile.hidden=!signedIn;switcher.hidden=signedIn;
    dialog.querySelector('#account-intro').textContent=returnTo?'Your Unpaused account connects to TacticStrike.':'One place for your Unpaused account.';
    dialog.querySelector('#account-email').textContent=session.user?.email||'';
    dialog.querySelector('#account-credits').textContent=String(session.user?.credits||0);
    dialog.querySelector('#account-return').href=returnTo||'/tacticstrike/?shop=credits';
    dialog.querySelector('#account-return').textContent=returnTo?'CONTINUE TO TACTICSTRIKE':'TACTICSTRIKE CREDIT SHOP';
    confirm.closest('label').hidden=mode!=='register';confirm.required=mode==='register';confirm.disabled=mode!=='register'||busy;
    password.autocomplete=mode==='register'?'new-password':'current-password';
    submit.textContent=busy?'PLEASE WAIT…':mode==='register'?'CREATE ACCOUNT':'SIGN IN';
    switcher.textContent=mode==='register'?'Already a member? Sign in':'New here? Create an account';
    for (const control of [form.elements.email,password,submit,switcher,logout]) control.disabled=busy;
    dialog.setAttribute('aria-busy',String(busy));
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
      if(error.status===401){removeAccountSession();session={token:null,user:null};notify('Your session expired. Please sign in again.');}
      else if(dialog.open)notify(error.message);
    }
    render();
  }
  function open() {render();notify();dialog.showModal();restore();}
  trigger.addEventListener('click',open);
  dialog.querySelector('#account-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{
    password.value='';confirm.value='';
    const url=new URL(location.href);url.searchParams.delete('account');url.searchParams.delete('return');history.replaceState(null,'',url);
  });
  switcher.addEventListener('click',()=>{mode=mode==='login'?'register':'login';password.value='';confirm.value='';notify();render();});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    if(mode==='register'&&password.value!==confirm.value){notify('Passwords do not match.');confirm.focus();return;}
    busy=true;notify();render();
    try {
      const result=await accountRequest(`/api/auth/${mode}`,{method:'POST',body:JSON.stringify({email:form.elements.email.value.trim(),password:password.value})});
      try {storeAccountSession(result);} catch {throw new Error('Allow site storage in your browser to stay signed in.');}
      session={token:result.token,user:result.user};form.reset();
      notify(mode==='register'?'Your account is ready.':'You’re signed in.');
    } catch(error){notify(error.message);}
    finally{busy=false;render();if(session.user)dialog.querySelector('#account-return').focus();}
  });
  logout.addEventListener('click',async()=>{
    if(busy)return;busy=true;render();
    try {await accountRequest('/api/auth/logout',{method:'POST',token:session.token});}
    catch(error){if(error.status!==401){busy=false;notify(error.message);render();return;}}
    removeAccountSession();session={token:null,user:null};mode='login';busy=false;notify('You’re signed out.');render();
  });
  window.addEventListener('storage',event=>{
    if(event.key===null||[ACCOUNT_SESSION_KEY,ACCOUNT_USER_CACHE_KEY].includes(event.key)){
      session=readAccountSession();render();
    }
  });
  render();
  if(params.has('account'))open();else restore();
}
