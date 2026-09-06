import assert from 'node:assert/strict';
import express from 'express';
import puppeteer from 'puppeteer';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

// All account and payment responses below are local fixtures. No payment URL is
// returned, and every request outside this private static server is intercepted.
const evidence = resolve('work', `checkout-browser-${Date.now()}`);
const output = resolve('../../outputs');
await mkdir(evidence, {recursive:true});
await mkdir(output, {recursive:true});
const app = express();
app.use(express.static(resolve('dist')));
const server = app.listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}`;
const user = {id:'checkout-fixture', email:'checkout@example.invalid', emailVerified:true, username:'CheckoutQA', friendCode:'1234', credits:250};
const errors = [], unexpectedWrites = [], checkoutRequests = [], statusRequests = [], checks = [];
const fixture = {availability:false, failStatus:false};
let browser, page;
const cors = {'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'Content-Type, Authorization', 'Access-Control-Allow-Methods':'GET, POST, OPTIONS'};
const settle = async page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

async function createPage(authenticated = false) {
  const next = await browser.newPage();
  next.setDefaultTimeout(15000);
  await next.setViewport({width:1365, height:1000});
  next.on('pageerror', error => errors.push(error.message));
  if (authenticated) {
    await next.evaluateOnNewDocument(user => {
      localStorage.setItem('tacticstrike_account_session', 'local-checkout-fixture');
      localStorage.setItem('tacticstrike_account_user', JSON.stringify(user));
      localStorage.setItem('tacticstrike_credits', '250');
      localStorage.setItem(`tacticstrike_server_credits_seen_${user.id}`, '250');
    }, user);
  }
  await next.setRequestInterception(true);
  next.on('request', async request => {
    const url = new URL(request.url());
    const json = (body, status = 200) => request.respond({status, contentType:'application/json', headers:cors, body:JSON.stringify(body)});
    if (url.pathname.startsWith('/api/')) {
      if (request.method() === 'OPTIONS') return request.respond({status:204, headers:cors});
      if (url.pathname === '/api/credits/status') {
        statusRequests.push({available:fixture.availability, failed:fixture.failStatus});
        if (fixture.failStatus) return request.abort('failed');
        return json({available:fixture.availability});
      }
      if (url.pathname === '/api/credits/checkout' && request.method() === 'POST') {
        checkoutRequests.push(JSON.parse(request.postData()));
        return json({error:'CHECKOUT_PAUSED', message:'Credit purchases are temporarily unavailable.'}, 503);
      }
      if (!['GET', 'HEAD'].includes(request.method())) {
        unexpectedWrites.push({path:url.pathname, method:request.method()});
        return json({error:'UNEXPECTED_TEST_WRITE'}, 400);
      }
      if (url.pathname === '/api/auth/status') return json({available:true, googleClientId:null});
      if (url.pathname === '/api/auth/me') return json({user});
      if (url.pathname === '/api/purchase-support/cases') return json({user, cases:[]});
      return json({worlds:[], invites:[], cases:[]});
    }
    if (/^https?:$/.test(url.protocol) && url.origin !== base) return request.abort();
    return request.continue();
  });
  await next.goto(`${base}/tacticstrike/`, {waitUntil:'networkidle2'});
  await next.waitForFunction(() => !document.body.classList.contains('is-starting') && !document.querySelector('#startup-overlay'));
  return next;
}

async function paused(label) {
  await page.waitForFunction(() => [...document.querySelectorAll('[data-buy-credit-pack]')].every(b => b.disabled));
  await settle(page);
  const state = await page.evaluate(() => ({
    heading:document.querySelector('#credit-checkout-heading').textContent,
    notice:document.querySelector('#credit-checkout-status').textContent,
    itemShopNotice:document.querySelector('#shop-credit-purchase-status').textContent,
    buttons:[...document.querySelectorAll('[data-buy-credit-pack]')].map(b => ({id:b.dataset.buyCreditPack, disabled:b.disabled, text:b.textContent.trim()}))
  }));
  assert.deepEqual(state.buttons.map(b => b.id), ['50', '500', '50', '500'], `${label}: credit modal and item-shop shortcuts`);
  assert(state.buttons.every(b => b.disabled && b.text === 'PURCHASES PAUSED'), `${label}: paused button state and copy`);
  assert.match(state.heading, /PURCHASES PAUSED/);
  assert.match(state.notice, /temporarily unavailable/);
  assert.match(state.notice, /Existing credits and purchase support are still available/);
  assert.equal(state.itemShopNotice, state.notice, 'Item shop must explain the same pause');
  checks.push(label);
}

async function openShop() {
  const before = statusRequests.length;
  await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/credits/status')),
    page.click('#btn-open-credit-shop')
  ]);
  await page.waitForSelector('#credit-shop-modal.active');
  await page.waitForFunction(() => document.querySelector('#credit-checkout-status').textContent.length > 0);
  assert(statusRequests.length > before, 'Opening the shop must fetch fresh availability');
  await settle(page);
}

async function restorePage() {
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true}));
  });
  // Let the intercepted response (or network rejection) reach its UI handler.
  await new Promise(r => setTimeout(r, 200));
  await settle(page);
}

try {
  browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true,
    args:['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required']});
  page = await createPage();
  assert.equal(await page.$('#news-modal'), null, 'Fresh startup must not contain the old automatic news modal');
  assert.doesNotMatch(await page.$eval('body', b => b.textContent), /BANKZITTERSRATINGS|Battlepasses will be added later today/i);
  assert.equal(await page.$eval('#btn-deploy-main', b => b.disabled), false);
  await page.click('#btn-open-whats-new');
  await page.waitForSelector('#whats-new-modal.active');
  assert((await page.$eval('#whats-new-modal', e => e.innerText)).length > 40);
  await page.click('#btn-close-whats-new');
  await page.waitForFunction(() => !document.querySelector('#whats-new-modal').classList.contains('active'));
  checks.push('Fresh startup has no obsolete popup; normal menu and manual What’s New work');

  await openShop();
  await paused('Server pause disables both packs with clear notice');
  await restorePage();
  await paused('Focus and restored page do not restore paused checkout');
  const other = await browser.newPage();
  await other.bringToFront();
  await page.waitForFunction(() => document.hidden);
  await page.bringToFront();
  await page.waitForFunction(() => !document.hidden);
  await paused('Switching browser tabs does not restore paused checkout');
  await other.close();

  fixture.availability = true;
  await restorePage();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-buy-credit-pack]')].every(b => !b.disabled));
  fixture.failStatus = true;
  await restorePage();
  await paused('Availability network failure fails closed even after an enabled response');
  fixture.failStatus = false;
  fixture.availability = 'true';
  await restorePage();
  await paused('Only boolean true can enable checkout');
  fixture.availability = false;
  await restorePage();
  await page.click('#credit-shop-account-status');
  await page.waitForSelector('#hub-account[open]');
  assert.equal(page.url(), `${base}/tacticstrike/`, 'Account must open in place');
  await page.click('#account-close');
  await page.waitForFunction(() => !document.querySelector('#hub-account').open);
  await paused('Guest account access remains usable during the pause');
  assert.equal(checkoutRequests.length, 0, 'Paused shop cannot attempt a payment');
  await page.click('#btn-close-credit-shop');
  await page.click('#btn-open-shop');
  await page.waitForSelector('#shop-modal.active');
  await paused('Item-shop purchase shortcuts also stay disabled during the pause');
  await page.click('#shop-modal [data-buy-credit-pack="50"]');
  assert.equal(checkoutRequests.length, 0, 'Disabled item-shop shortcuts cannot attempt payment');
  await page.click('#btn-close-shop');
  await page.close();

  page = await createPage(true);
  await page.waitForFunction(() => document.querySelector('#operative-name').textContent === 'CheckoutQA');
  await openShop();
  await paused('Signed-in account still sees purchases paused');
  await page.click('#credit-shop-account-status');
  await page.waitForSelector('#hub-account[open]');
  await page.waitForFunction(() => document.querySelector('#account-credits').textContent === '250');
  await page.click('#account-close');
  await page.waitForFunction(() => !document.querySelector('#hub-account').open);
  await paused('Account refresh keeps pause copy and existing credit balance');
  await page.click('#btn-open-purchase-support');
  await page.waitForSelector('#purchase-support-modal.active');
  await page.waitForFunction(() => document.querySelector('#purchase-support-cases').textContent.includes('No purchase-verification chats yet'));
  await page.click('#btn-close-purchase-support');
  await page.waitForFunction(() => !document.querySelector('#purchase-support-modal').classList.contains('active'));
  await paused('Existing purchase support opens and closes without enabling purchases');
  assert.equal(await page.evaluate(() => localStorage.getItem('tacticstrike_credits')), '250');

  for (const packageId of ['50', '500']) {
    fixture.availability = true;
    await page.click('#btn-close-credit-shop');
    await openShop();
    await page.waitForFunction(() => [...document.querySelectorAll('[data-buy-credit-pack]')].every(b => !b.disabled));
    const before = checkoutRequests.length;
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/credits/checkout') && response.status() === 503),
      page.click(`[data-buy-credit-pack="${packageId}"]`)
    ]);
    await page.waitForFunction(() => document.querySelector('#credit-checkout-heading').textContent.includes('PAUSED'));
    await settle(page);
    assert.equal(checkoutRequests.length, before + 1, `${packageId}: exactly one mocked checkout request`);
    assert.deepEqual(checkoutRequests.at(-1), {packageId});
    await paused(`${packageId} pack: checkout 503 returns to paused without redirect`);
    await restorePage();
    await paused(`${packageId} pack: stale available status cannot undo checkout 503`);
    assert.equal(page.url(), `${base}/tacticstrike/`);
  }
  await page.$eval('#credit-shop-modal', e => e.scrollTop = 0);
  await page.screenshot({path:resolve(output, 'tacticstrike-checkout-paused.png')});
  assert.deepEqual(errors, [], 'No browser JavaScript errors');
  assert.deepEqual(unexpectedWrites, [], 'No account writes or other API mutations');
  const result = {ok:true, checks, checkoutRequests, statusRequests:statusRequests.length, errors, unexpectedWrites, screenshot:resolve(output, 'tacticstrike-checkout-paused.png')};
  await writeFile(resolve(evidence, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({...result, evidence}, null, 2));
} catch (error) {
  const state = await page?.evaluate(() => ({url:location.href, body:document.body.className,
    active:[...document.querySelectorAll('.modal-overlay.active')].map(e => e.id),
    notice:document.querySelector('#credit-checkout-status')?.textContent,
    buttons:[...document.querySelectorAll('[data-buy-credit-pack]')].map(e => ({id:e.dataset.buyCreditPack, disabled:e.disabled, text:e.textContent}))})).catch(() => null);
  await page?.screenshot({path:resolve(evidence, 'failure.png')}).catch(() => {});
  await writeFile(resolve(evidence, 'failure.json'), JSON.stringify({message:error.message, state, checks, errors, checkoutRequests, statusRequests}, null, 2));
  console.error(JSON.stringify({evidence, state, checks, errors}, null, 2));
  throw error;
} finally {
  await browser?.close();
  await new Promise(r => server.close(r));
}
