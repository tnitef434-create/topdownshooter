import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer';

// Test the production service worker, not HTTP-cache luck or intercepted assets.
const base = process.env.WORLDLOOM_TEST_URL || 'http://127.0.0.1:4187/';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
const networkSession = await page.createCDPSession();
const workerSessions = [];
let offlineRequested = false, networkRestore = Promise.resolve();
async function setOffline(offline) {
  offlineRequested = offline;
  await page.setOfflineMode(offline);
  // Current Chrome separates network throttling from navigator.onLine. Apply
  // both, including to the service worker so its fetches cannot reach localhost.
  await networkSession.send('Network.overrideNetworkState', {
    offline, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
  });
  if (!workerSessions.length) {
    for (const target of browser.targets().filter(target => target.type() === 'service_worker')) {
      workerSessions.push(await target.createCDPSession());
    }
  }
  await Promise.all(workerSessions.map(session => session.send('Network.emulateNetworkConditions', {
    offline, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
  })));
}
page.on('framenavigated', frame => {
  // Chrome resets the renderer's emulated network state on SW navigations.
  // Keep the test's network disconnected across those document replacements.
  if (frame === page.mainFrame() && offlineRequested) networkRestore = setOffline(true);
});
const errors = [], writes = [], checks = [];
const log = message => { checks.push(message); console.log(message); };
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => {
  if (request.method() === 'POST' && /\/api\/(?:worlds|worldloom)(?:[/?]|$)/.test(request.url())) writes.push(request.url());
});
const menuReady = () => page.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden')
  && document.querySelector('#loading-screen')?.classList.contains('hidden'), { timeout: 90000 });
const gameReady = () => page.waitForFunction(() => window.__worldloomPlayer && !document.querySelector('#hud').classList.contains('hidden')
  && document.querySelector('#loading-screen').classList.contains('hidden'), { timeout: 180000 });
const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('worldloom.save.v1')));
const artifacts = new URL('../work/offline-playtest/', import.meta.url);
await mkdir(artifacts, { recursive: true });

try {
  await page.setViewport({ width: 1000, height: 720, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    if (sessionStorage.getItem('offline-fixture-initialized')) return;
    sessionStorage.setItem('offline-fixture-initialized', 'true');
    localStorage.setItem('worldloom.settings.v1', JSON.stringify({ viewDistance: 2, graphicsQuality: 'low', renderScale: .6, volume: 0, musicEnabled: false, weatherEffects: false }));
    // A cached account identity must not force offline solo creation into cloud APIs.
    localStorage.setItem('tacticstrike_account_session', 'offline-fixture-token');
    localStorage.setItem('tacticstrike_account_user', JSON.stringify({ id: 'offline-fixture', email: 'offline@example.invalid', username: 'OfflineTester', emailVerified: true }));
  });
  await page.goto(new URL('worldloom/', base).href, { waitUntil: 'domcontentloaded' });
  await menuReady();
  await page.waitForFunction(() => window.__unpausedOffline?.ready && navigator.serviceWorker.controller, { timeout: 180000 });
  assert.equal(await page.$eval('#world-local-save', input => input.checked), false, 'Signed-in creation should start with account saves while online');
  log('Production offline cache installed and controls the page.');

  await page.setCacheEnabled(false);
  await setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await networkRestore;
  await menuReady();
  assert.equal(await page.evaluate(() => navigator.onLine), false);
  assert.equal(await page.evaluate(async () => {
    try { await fetch('/offline-test-uncached-probe', { cache: 'no-store' }); return true; }
    catch { return false; }
  }), false, 'An uncached network request unexpectedly succeeded offline');
  assert.equal(await page.$eval('#world-local-save', input => input.checked), true);
  assert.match(await page.$eval('#world-save-hint', element => element.textContent), /Local world.*Account worlds stay separate/);
  assert.equal(await page.evaluate(() => localStorage.getItem('tacticstrike_account_session')), 'offline-fixture-token');
  await page.screenshot({ path: new URL('offline-menu.png', artifacts).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
  log('Full reload works with network and browser HTTP cache disabled; account remains signed in and local saving is explicit.');

  await page.type('#world-name', 'Offline camp');
  await page.type('#seed-input', '64');
  await page.click('input[name="mode"][value="builder"]');
  await page.click('#new-world-button');
  await gameReady();
  assert.equal(await page.evaluate(() => window.__worldloomShared), null);
  assert.equal(writes.length, 0, 'Local creation attempted an account-world API write');
  log('Created and entered a new local world offline while signed in.');

  await page.click('#game');
  await page.waitForFunction(() => document.pointerLockElement?.id === 'game');
  const fixture = await page.evaluate(async () => {
    const { BLOCK } = await import('/worldloom/src/blocks.js');
    const world = window.__worldloomWorld, player = window.__worldloomPlayer;
    const x = Math.floor(player.position.x), y = Math.ceil(player.position.y) + 2, z = Math.floor(player.position.z);
    for (let dx = -2; dx <= 2; dx++) for (let dz = -4; dz <= 2; dz++) {
      world.setBlock(x + dx, y - 1, z + dz, BLOCK.STONE);
      for (let dy = 0; dy < 4; dy++) world.setBlock(x + dx, y + dy, z + dz, BLOCK.AIR);
    }
    world.setBlock(x, y + 1, z - 3, BLOCK.STONE);
    player.position.set(x + .5, y + .002, z + .5);
    player.velocity.set(0, 0, 0); player.yaw = 0; player.pitch = 0; player.flying = true;
    player._syncCamera(0, false, 70, true);
    return { x, y: y + 1, z: z - 2 };
  });
  await page.keyboard.press('1');
  await page.mouse.click(500, 360, { button: 'right' });
  await page.waitForFunction(({ x, y, z }) => window.__worldloomWorld.getBlock(x, y, z) !== 0, { timeout: 15000 }, fixture);
  const placedId = await page.evaluate(({ x, y, z }) => window.__worldloomWorld.getBlock(x, y, z), fixture);
  await page.keyboard.press('Escape');
  // Synthetic Escape cannot invoke Chrome's reserved pointer-unlock action.
  // Trigger that browser action; the game's real pointerlockchange handler pauses.
  await page.evaluate(() => document.exitPointerLock());
  await page.waitForFunction(() => !document.querySelector('#pause-menu').classList.contains('hidden'));
  const snapshot = await saved();
  assert.equal(snapshot.name, 'Offline camp');
  assert.equal(snapshot.seed, 64);
  assert(snapshot.world.chunks.length > 0, 'Offline block placement did not reach the save');
  log('Actual block placement and pause autosave work offline; world name, terrain and inventory are persisted.');

  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }), page.click('#title-button')]);
  assert.equal(new URL(page.url()).pathname, '/');
  assert.deepEqual((await saved()).inventory, snapshot.inventory, 'Save & leave changed inventory');
  log('Save & leave returns to the cached hub offline without losing progress.');

  // A shared-world URL must never attach its waiting network client to the
  // existing local save. Continue is an explicit switch back to browser storage.
  await page.goto(new URL('worldloom/?world=00000000-0000-4000-8000-000000000001', base).href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await menuReady();
  await page.waitForFunction(() => Boolean(window.__worldloomShared), { timeout: 20000 });
  assert.equal(await page.evaluate(() => window.__worldloomShared.ready), false);
  assert.equal(await page.$eval('#continue-button', button => button.disabled), false);
  await page.click('#continue-button');
  await gameReady();
  assert.equal(new URL(page.url()).searchParams.has('world'), false);
  assert.equal(await page.evaluate(() => window.__worldloomShared), null);
  assert.equal(await page.evaluate(({ x, y, z }) => window.__worldloomWorld.getBlock(x, y, z), fixture), placedId);
  await page.evaluate(() => window.dispatchEvent(new Event('beforeunload')));
  const restored = await saved();
  assert.equal(restored.name, snapshot.name);
  assert.equal(restored.seed, snapshot.seed);
  assert.deepEqual(restored.inventory, snapshot.inventory);
  assert.equal(writes.length, 0, 'Offline local play attempted a cloud save');
  log('Offline navigation, local Continue and shared-URL isolation preserve the exact saved block and inventory.');

  await setOffline(false);
  assert.equal(await page.evaluate(() => window.__worldloomShared), null, 'Reconnection silently changed local-world ownership');
  assert.deepEqual(errors, [], 'Uncaught browser errors during offline play');
  log('Reconnecting leaves the local world local; no uncaught browser errors.');
  console.log(JSON.stringify({ passed: true, checks, cloudWrites: writes.length }));
} finally {
  await browser.close();
}
