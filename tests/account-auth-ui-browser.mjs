import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import {mkdir} from 'node:fs/promises';

const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4191/';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Account UI fixtures are local-only');
const output=process.env.ACCOUNT_UI_SCREENSHOT_DIR||'work/account-ui-review';
await mkdir(output,{recursive:true});
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
const errors=[],requests=[];
const email='account-ui@example.invalid', password='A-valid-password-42';
const user={id:'ui-account',email,emailVerified:true,friendCode:null,username:null,credits:0};
const jsonHeaders={'Access-Control-Allow-Origin':new URL(base).origin,'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, OPTIONS'};
async function fixture(fragment='',googleConfigured=false,failures={}) {
  const page=await browser.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.setViewport({width:1440,height:900});
  await page.evaluateOnNewDocument(()=>localStorage.clear());
  await page.setRequestInterception(true);
  page.on('request',request=>{
    const url=new URL(request.url());
    if(request.isNavigationRequest()&&url.origin===new URL(base).origin){
      request.respond({status:200,contentType:'text/html',body:`<!doctype html><html><head><link rel="stylesheet" href="/account/dialog.css"><style>body{margin:0;background:#16110e}#open-account{margin:30px}</style></head><body><button id="open-account">Account</button><script type="module">import {initHubAccount} from '/account/dialog-controller.js';initHubAccount();</script></body></html>`});return;
    }
    if(url.href==='https://accounts.google.com/gsi/client'){
      requests.push({path:'google-script'});
      if(failures.script>0){failures.script--;request.abort('failed');return;}
      request.respond({status:200,contentType:'application/javascript',body:`window.google={accounts:{id:{initialize(options){window.googleOptions=options;},renderButton(element,options){window.googleButtonOptions=options;element.innerHTML='<button type="button" id="google-fixture-button">Continue with Google</button>';element.firstChild.onclick=()=>window.googleOptions.callback({credential:'local-gis-credential'});},disableAutoSelect(){}}}};`});return;
    }
    if(url.pathname.startsWith('/api/')){
      if(request.method()==='OPTIONS'){request.respond({status:204,headers:jsonHeaders});return;}
      const body=request.postData()?JSON.parse(request.postData()):null;
      requests.push({path:url.pathname,body});
      let status=200,data={worlds:[],invites:[]};
      if(url.pathname==='/api/auth/status'){
        if(failures.status>0){failures.status--;request.abort('failed');return;}
        data={googleClientId:googleConfigured?'local-test.apps.googleusercontent.com':null};
      }
      else if(url.pathname==='/api/auth/register'){status=202;data={verificationRequired:true,message:'Check your inbox to choose a password and verify your email.'};}
      else if(url.pathname==='/api/auth/password-reset/request'){status=202;data={message:'If this email has an account, a reset link is on its way.'};}
      else if(url.pathname==='/api/auth/password-reset/confirm'){
        if(body.token==='expired'){status=400;data={error:'RESET_TOKEN_INVALID',message:'This reset link has expired. Request a new one.'};}
        else data={message:'Password updated. Sign in with your new password.'};
      }
      else if(['/api/auth/verify-email','/api/auth/login','/api/auth/google'].includes(url.pathname))data={token:'local-ui-session',user};
      else if(url.pathname==='/api/auth/me')data={user};
      request.respond({status,headers:jsonHeaders,contentType:'application/json',body:JSON.stringify(data)});return;
    }
    request.continue();
  });
  await page.goto(new URL(`?account=login${fragment}`,base).href,{waitUntil:'networkidle0'});
  await page.waitForSelector('#hub-account[open]');
  return page;
}
const activeInputs=page=>page.$eval('#hub-account form',form=>[...form.querySelectorAll('input')].filter(input=>!input.disabled&&!input.closest('label').hidden).map(input=>input.name));
const submit=page=>page.click('.hub-account-form:first-of-type [type="submit"]');
try {
  const page=await fixture();
  assert.equal(await page.$eval('#account-google-option',element=>element.hidden),true);
  assert.equal(requests.some(request=>request.path==='google-script'),false,'Unconfigured Google sign-in must not load Google scripts');
  await page.click('#account-switch');
  assert.deepEqual(await activeInputs(page),['email'],'Signup must ask only for email');
  await page.type('[name="email"]',email);
  await page.screenshot({path:`${output}/email-only-signup-desktop.png`});
  await page.setViewport({width:390,height:844});
  await page.screenshot({path:`${output}/email-only-signup-mobile.png`});
  assert(await page.$eval('#hub-account',element=>element.scrollWidth<=element.clientWidth&&element.getBoundingClientRect().right<=innerWidth));
  await submit(page);
  await page.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('Check your inbox'));
  assert.deepEqual(requests.find(request=>request.path==='/api/auth/register').body,{email});
  assert.equal(await page.evaluate(()=>localStorage.getItem('tacticstrike_account_session')),null);
  assert.equal(await page.$eval('#account-title',element=>element.textContent),'CHECK YOUR INBOX');
  assert.deepEqual(await activeInputs(page),[],'Password fields must not appear before opening the verification link');
  await page.click('#account-switch');
  await page.click('#account-forgot');
  assert.deepEqual(await activeInputs(page),['email']);
  await page.screenshot({path:`${output}/reset-request-mobile.png`});
  await submit(page);
  await page.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('If this email'));
  assert.deepEqual(requests.find(request=>request.path==='/api/auth/password-reset/request').body,{email});
  assert.equal(await page.$eval('#account-title',element=>element.textContent),'CHECK YOUR INBOX');
  await page.close();

  const verify=await fixture('#verify=inbox-proof&keep=anchor');
  assert.equal(new URL(verify.url()).hash,'#keep=anchor');
  assert.deepEqual(await activeInputs(verify),['password','confirm']);
  await verify.type('[name="password"]',password);await verify.type('[name="confirm"]','different-valid-password');
  await submit(verify);
  await verify.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('do not match'));
  assert.equal(requests.some(request=>request.path==='/api/auth/verify-email'),false);
  await verify.$eval('[name="confirm"]',(element,value)=>element.value=value,password);await submit(verify);
  await verify.waitForFunction(()=>!document.querySelector('#account-profile').hidden);
  assert.deepEqual(requests.find(request=>request.path==='/api/auth/verify-email').body,{token:'inbox-proof',password});
  assert.equal(await verify.$eval('#account-username',element=>element.value),'','Username is chosen after email verification');
  await verify.close();

  const reset=await fixture('#resetToken=reset-proof&keep=anchor');
  assert.equal(new URL(reset.url()).hash,'#keep=anchor');
  assert.deepEqual(await activeInputs(reset),['password','confirm']);
  await reset.type('[name="password"]',password);await reset.type('[name="confirm"]',password);
  await reset.screenshot({path:`${output}/reset-confirm-desktop.png`});
  await submit(reset);
  await reset.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('Password updated'));
  assert.deepEqual(requests.find(request=>request.path==='/api/auth/password-reset/confirm').body,{token:'reset-proof',password});
  assert.equal(await reset.evaluate(()=>localStorage.getItem('tacticstrike_account_session')),null);
  assert.equal(await reset.$eval('[name="password"]',element=>element.value),'');
  await reset.close();

  const expired=await fixture('#resetToken=expired');
  await expired.type('[name="password"]',password);await expired.type('[name="confirm"]',password);await submit(expired);
  await expired.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('expired'));
  await expired.click('#account-switch');
  assert.equal(await expired.$eval('#account-title',element=>element.textContent),'RESET YOUR PASSWORD');
  assert.deepEqual(await activeInputs(expired),['email']);
  await expired.close();

  const google=await fixture('',true);
  await google.waitForSelector('#google-fixture-button',{visible:true});
  assert.deepEqual(await google.evaluate(()=>({autoSelect:window.googleOptions.auto_select,ux:window.googleOptions.ux_mode,theme:window.googleButtonOptions.theme})),{autoSelect:false,ux:'popup',theme:'filled_black'});
  await google.click('#google-fixture-button');
  await google.waitForFunction(()=>!document.querySelector('#account-profile').hidden);
  assert.deepEqual(requests.find(request=>request.path==='/api/auth/google').body,{credential:'local-gis-credential'});
  assert.equal(await google.evaluate(()=>localStorage.getItem('tacticstrike_account_session')),'local-ui-session');
  await google.close();
  const failedScript=await fixture('',true,{script:1});
  await failedScript.waitForSelector('#google-fixture-button',{visible:true,timeout:15_000});
  assert.equal(await failedScript.$$eval('script[src="https://accounts.google.com/gsi/client"]',scripts=>scripts.length),1,'Failed GIS script must be removed before retry');
  await failedScript.close();
  const failedStatus=await fixture('',true,{status:1});
  await failedStatus.waitForSelector('#google-fixture-button',{visible:true,timeout:15_000});
  await failedStatus.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,emailOnlySignup:true,verificationPasswordMismatch:true,usernameAfterVerification:true,resetRequest:true,resetConfirmation:true,expiredResetRecovery:true,fragmentScrubbing:true,conditionalGoogle:true,googleCredentialCallback:true,googleScriptRetry:true,googleStatusRetry:true,noProductionEmails:true}));
} finally {await browser.close();}
