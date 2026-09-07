import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { buildOffline } from '../tools/build-offline.mjs';

// Exercise the real production worker/client in Chrome on a tiny local fixture.
// No production server, private account, external network or existing browser is used.
const repository = fileURLToPath(new URL('../', import.meta.url));
const temporaryRoot = resolve(repository, 'work');
await mkdir(temporaryRoot, { recursive: true });
const fixture = await mkdtemp(join(temporaryRoot, 'offline-worker-browser-'));
const checks = [], requests = new Map(), errors = [];
const log = message => { checks.push(message); console.log(message); };
const audio = '0123456789abcdefghijklmnopqrstuvwxyz';
const modulePath = '/worldloom/src/main.js';
let missing = true, browser, page;
const put = async (path, contents) => {
  const file = join(fixture, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, contents);
};
await put('offline-client.js', await readFile(new URL('../src/public/offline-client.js', import.meta.url)));
await put('index.html', '<!doctype html><title>Offline hub fixture</title><h1>Unpaused hub</h1><p data-offline-status></p><a href="/worldloom/">Worldloom</a><script src="/offline-client.js" defer></script>');
await put('worldloom/index.html', '<!doctype html><title>Offline game fixture</title><h1>Worldloom fixture</h1><p data-offline-status></p><a href="/">All games</a><script src="/offline-client.js" defer></script><script type="module" src="/worldloom/src/main.js"></script>');
await put(modulePath, 'document.documentElement.dataset.gameReady = "true";');
await put('worldloom/assets/audio/birds.mp3', audio);
await put('hub/clip.mp4', 'first video bytes');
// Sorted last, so a cold failed installation has useful verified files to resume.
await put('z-missing.js', 'export const recovered = true;');
const firstRelease = await buildOffline(fixture);
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://fixture.test').pathname;
  requests.set(path, (requests.get(path) || 0) + 1);
  if (path === '/z-missing.js' && missing) { response.writeHead(503); response.end('Connection interrupted'); return; }
  if (path === '/api/private') { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end('{"private":"never-cache"}'); return; }
  try {
    const file = resolve(fixture, '.' + (path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(fixture + sep)) throw new Error('Outside fixture');
    const bytes = await readFile(file);
    const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4';
    response.writeHead(200, { 'Content-Type': type, 'Content-Length': bytes.length, 'Cache-Control': 'no-store' });
    response.end(bytes);
  } catch { response.writeHead(404); response.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const count = path => requests.get(path) || 0;
const packReady = () => page.waitForFunction(() => window.__unpausedOffline?.ready && navigator.serviceWorker.controller, { timeout: 20000 });
const attach = async () => {
  page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.setCacheEnabled(false);
};

try {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--no-sandbox'],
  });
  await attach();
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__unpausedOffline?.status === 'unavailable' && !navigator.serviceWorker.controller, { timeout: 20000 });
  assert(count('/z-missing.js') > 0, 'The intentional failure was not reached');
  const partial = await page.evaluate(async version => {
    const cache = await caches.open('unpaused-offline-' + version);
    return { home: Boolean(await cache.match('/')), manifest: Boolean(await cache.match('/__unpaused_offline_release__')) };
  }, firstRelease.version);
  assert.equal(partial.home, true);
  assert.equal(partial.manifest, false);
  log('Interrupted cold installation remains unavailable and preserves partial downloads.');

  // Also prove a corrupt partial response cannot be silently accepted on retry.
  await page.evaluate(async ({ version, modulePath }) => {
    const cache = await caches.open('unpaused-offline-' + version);
    await cache.put(modulePath, new Response('corrupt bytes'));
    localStorage.setItem('offline-fixture-save', 'keep-my-world');
  }, { version: firstRelease.version, modulePath });
  const moduleBeforeRetry = count(modulePath), homeBeforeRetry = count('/');
  missing = false;
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await packReady();
  assert.equal(count('/'), homeBeforeRetry, 'A valid partial download was downloaded again');
  assert(count(modulePath) > moduleBeforeRetry, 'A corrupt partial asset was not repaired');
  log('Reconnect retries the actual registration, reuses verified bytes and repairs corrupt partial bytes.');

  await page.evaluate(async () => { await (await fetch('/api/private')).text(); });
  await page.setOfflineMode(true);
  const ranges = await page.evaluate(async () => {
    const results = [];
    for (const range of ['bytes=2-5', 'bytes=30-', 'bytes=-3', 'bytes=-', 'bytes=200-300']) {
      const response = await fetch('/worldloom/assets/audio/birds.mp3', { headers: { Range: range } });
      results.push({ status: response.status, body: await response.text(), range: response.headers.get('Content-Range') });
    }
    let privateAvailable = true;
    try { await fetch('/api/private'); } catch { privateAvailable = false; }
    return { results, privateAvailable };
  });
  assert.deepEqual(ranges.results.map(value => value.status), [206, 206, 206, 416, 416]);
  assert.deepEqual(ranges.results.slice(0, 3).map(value => value.body), ['2345', 'uvwxyz', 'xyz']);
  assert.equal(ranges.results[0].range, 'bytes 2-5/36');
  assert.equal(ranges.privateAvailable, false);
  log('Cached audio serves valid ranges offline and rejects malformed ranges; private API data stays unavailable.');

  await page.goto(base + '/worldloom/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.dataset.gameReady === 'true', { timeout: 10000 });
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }), page.click('a[href="/"]')]);
  assert.equal(await page.$eval('h1', element => element.textContent), 'Unpaused hub');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
  assert.equal(await page.$eval('h1', element => element.textContent), 'Unpaused hub');
  log('Game modules, hub return and full hub reload work with HTTP cache and network disabled.');

  await page.setOfflineMode(false);
  await packReady();
  const moduleBeforeEviction = count(modulePath);
  await page.evaluate(async ({ version, modulePath }) => {
    const cache = await caches.open('unpaused-offline-' + version);
    await cache.delete(modulePath);
    window.dispatchEvent(new Event('pageshow'));
  }, { version: firstRelease.version, modulePath });
  await page.waitForFunction(async ({ version, modulePath }) => {
    const response = await (await caches.open('unpaused-offline-' + version)).match(modulePath);
    return Boolean(response) && window.__unpausedOffline?.ready;
  }, { timeout: 20000 }, { version: firstRelease.version, modulePath });
  assert(count(modulePath) > moduleBeforeEviction);
  assert.equal(await page.evaluate(() => localStorage.getItem('offline-fixture-save')), 'keep-my-world');
  log('An online status check repairs an evicted core asset without touching saved worlds.');

  assert.equal(await page.evaluate(async () => (await fetch('/hub/clip.mp4')).text()), 'first video bytes');
  await page.waitForFunction(async version => Boolean(await (await caches.open('unpaused-media-' + version)).match('/hub/clip.mp4')), { timeout: 10000 }, firstRelease.version);
  await put('hub/clip.mp4', 'updated video bytes');
  const nextRelease = await buildOffline(fixture);
  assert.notEqual(nextRelease.version, firstRelease.version);
  await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting), { timeout: 20000 });
  assert.equal(await page.evaluate(() => window.__unpausedOffline.version), firstRelease.version);
  assert.equal(await page.evaluate(async () => (await fetch('/hub/clip.mp4')).text()), 'first video bytes');
  await page.close();
  await attach();
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(version => window.__unpausedOffline?.ready && window.__unpausedOffline.version === version, { timeout: 20000 }, nextRelease.version);
  assert.equal(await page.evaluate(async () => (await fetch('/hub/clip.mp4')).text()), 'updated video bytes');
  assert.equal(await page.evaluate(version => caches.has('unpaused-media-' + version), firstRelease.version), false);
  log('A media-only deployment waits for open tabs, then replaces the old clip and removes its stale cache.');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, checks }));
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  // Verify the resolved cleanup target stays inside this test's workspace root.
  const cleanup = resolve(fixture);
  if (!cleanup.startsWith(temporaryRoot + sep) || !cleanup.slice(temporaryRoot.length + 1).startsWith('offline-worker-browser-')) throw new Error('Unsafe fixture cleanup path');
  await rm(cleanup, { recursive: true, force: true });
}
