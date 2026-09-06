import assert from 'node:assert/strict';
import express from 'express';
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Isolated, local source server and a fresh private Chrome profile. These
// fixtures never contact production accounts or replace a user's saved world.
const root = resolve('.'), runDir = resolve('work', `chest-browser-${Date.now()}`);
await mkdir(runDir, { recursive: true });
const app = express();
app.get('/__chest-fixture', (_request, response) => response.type('html').send('<!doctype html><title>Private chest test fixture</title>'));
app.use(express.static(resolve(root, 'src/public')));
app.use(express.static(resolve(root, 'src')));
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const errors = [], checks = [];
const log = message => { checks.push(message); console.log(message); };
let browser, page;
const snapshot = () => page.evaluate(() => {
  window.dispatchEvent(new Event('beforeunload'));
  return JSON.parse(localStorage.getItem('worldloom.save.v1'));
});
const count = (save, id) => save.inventory.slots.reduce((sum, slot) => sum + (slot.id === id ? slot.count : 0), 0);
const contents = () => page.$$eval('#chest-grid > button', buttons => buttons.filter(button => button.dataset.contents)
  .map(button => { const [id, count] = button.dataset.contents.split(':').map(Number); return { id, count }; }));
const frames = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function menu() {
  await page.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden')
    && document.querySelector('#loading-screen')?.classList.contains('hidden'));
}
async function ready() {
  await page.waitForFunction(() => window.__worldloomPlayer && !document.querySelector('#hud').classList.contains('hidden')
    && document.querySelector('#loading-screen').classList.contains('hidden'), { timeout: 180_000, polling: 100 });
}
async function reloadFixture(save) {
  // Leaving the game first prevents its normal unload save overwriting a fixture.
  await page.goto(`${base}/__chest-fixture`);
  await page.evaluate(save => {
    // SaveStore intentionally prefers a newer valid backup. Both private
    // fixture records must agree, otherwise the previous game wins correctly.
    save.updatedAt = new Date().toISOString();
    localStorage.setItem('worldloom.save.v1', JSON.stringify(save));
    localStorage.setItem('worldloom.save.backup.v1', JSON.stringify(save));
  }, save);
  await page.goto(`${base}/worldloom/`, { waitUntil: 'domcontentloaded' });
  await menu();
  await page.click('#continue-button');
  await ready();
  assert.deepEqual((await snapshot()).inventory, save.inventory, 'The reload must actually load the intended inventory fixture');
}
async function aimAt(cell) {
  const result = await page.evaluate(async cell => {
    const { BLOCK } = await import('/worldloom/src/blocks.js');
    const world = window.__worldloomWorld, player = window.__worldloomPlayer;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) world.ensurePositionGenerated(cell.x + dx * 16, cell.z + dz * 16);
    // An unobstructed standing spot next to the actual generated chest isolates
    // the interaction from uneven terrain. The chest itself is never edited.
    for (let dx = -1; dx <= 1; dx++) for (let dz = 1; dz <= 4; dz++) {
      world.setBlock(cell.x + dx, cell.y - 1, cell.z + dz, BLOCK.STONE);
      for (let dy = 0; dy <= 3; dy++) world.setBlock(cell.x + dx, cell.y + dy, cell.z + dz, BLOCK.AIR);
    }
    player.setPosition(cell.x + 0.5, cell.y + 0.002, cell.z + 3);
    player.velocity.set(0, 0, 0); player.yaw = 0; player.pitch = -0.42;
    player._syncCamera(0, false, 75, true);
    return { block: world.getBlock(cell.x, cell.y, cell.z), chest: BLOCK.CHEST, hit: player.raycast(4.25)?.block };
  }, cell);
  assert.equal(result.block, result.chest, 'The fixture must use a naturally generated discovery chest');
  assert.deepEqual([result.hit?.x, result.hit?.y, result.hit?.z], [cell.x, cell.y, cell.z], 'The actual player ray must aim at the chest');
  await frames();
}
async function open(method = 'right') {
  if (!await page.evaluate(() => Boolean(document.pointerLockElement))) {
    await page.click('#game');
    await page.waitForFunction(() => document.pointerLockElement?.id === 'game');
  }
  // PointerLockElement changes before the queued pointerlockchange listener;
  // wait for real game frames before the subsequent physical button event.
  await frames();
  if (method === 'r') await page.keyboard.press('r');
  else { await page.mouse.down({ button: 'right' }); await page.mouse.up({ button: 'right' }); }
  await page.waitForSelector('#inventory-panel.has-chest:not(.hidden)');
  await page.waitForFunction(() => document.querySelector('#chest-grid')?.getAttribute('aria-busy') === 'false');
}
async function close() {
  await page.click('#inventory-close');
  await page.waitForSelector('#inventory-panel.hidden');
  await page.waitForFunction(() => document.pointerLockElement?.id === 'game');
}
async function unchanged(before, cell) {
  const after = await snapshot();
  assert.deepEqual(after.inventory, before.inventory, 'Opening or closing a chest must not move items into the pack');
  assert.deepEqual(after.discoveryLoot, before.discoveryLoot, 'Inspection must not create or change a loot receipt');
  assert.equal(await page.evaluate(cell => window.__worldloomWorld.getBlock(cell.x, cell.y, cell.z), cell), cell.blockId, 'Opening the chest must preserve its world block');
}

try {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
  page.setDefaultTimeout(45_000);
  page.on('pageerror', error => errors.push(error.message));
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(base)) return request.abort();
    return request.continue();
  });
  await page.evaluateOnNewDocument(() => localStorage.setItem('worldloom.settings.v1', JSON.stringify({
    viewDistance: 2, graphicsQuality: 'low', renderScale: 0.5, weatherEffects: false, volume: 0, musicEnabled: false, reducedMotion: true,
  })));
  await page.goto(`${base}/worldloom/`, { waitUntil: 'domcontentloaded' });
  await menu();
  await page.type('#seed-input', '64');
  await page.click('#new-world-button');
  await ready();
  console.log('Fresh world ready; checking natural discovery chests.');
  const fixture = await page.evaluate(async () => {
    const world = window.__worldloomWorld;
    const { BLOCK } = await import('/worldloom/src/blocks.js');
    const { ITEM } = await import('/worldloom/src/data.js');
    const { discoveryLoot } = await import('/worldloom/src/discovery-loot.js');
    const shrine = world.getLandDiscoveryForRegion(1, -2), quarry = world.getLandDiscoveryForRegion(-4, -4);
    return { shrine: { ...shrine, chest: { ...shrine.chest, blockId: BLOCK.CHEST }, loot: discoveryLoot(world.seed, shrine) },
      quarry: { ...quarry, chest: { ...quarry.chest, blockId: BLOCK.CHEST }, loot: discoveryLoot(world.seed, quarry) }, item: ITEM, filler: BLOCK.STONE };
  });
  assert.equal(fixture.shrine.kind, 'bell_shrine');
  assert.equal(fixture.quarry.kind, 'quarry_rig');
  assert.notDeepEqual(fixture.shrine.loot, fixture.quarry.loot, 'Different discoveries must have different actual loot');
  await aimAt(fixture.shrine.chest);
  const initial = await snapshot();
  assert(initial.inventory.slots.every(slot => slot.id === 0));
  await open();
  assert.deepEqual(await contents(), fixture.shrine.loot);
  await unchanged(initial, fixture.shrine.chest);
  await close();
  await open('r');
  await unchanged(initial, fixture.shrine.chest);
  log('Empty-hand RMB and R open the naturally generated shrine chest; inspection never moves loot or mines the block.');
  const outputDirectory = process.env.WORLDLOOM_SCREENSHOT_DIR || resolve('../../outputs');
  await mkdir(outputDirectory, { recursive: true });
  await page.screenshot({ path: resolve(outputDirectory, 'worldloom-chest-open.png') });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await frames();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Chest view must not overflow a phone viewport');
  await page.screenshot({ path: resolve(outputDirectory, 'worldloom-chest-mobile.png') });
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
  await close();

  const equipped = await snapshot();
  equipped.inventory.slots[0] = { id: fixture.item.COPPER_PICK, count: 1 };
  equipped.inventory.slots[1] = { id: fixture.item.COOKED_MEAT, count: 3 };
  equipped.inventory.selected = 0;
  equipped.survival.nourishment = 0.2; equipped.survival.saturation = 0;
  await reloadFixture(equipped);
  await aimAt(fixture.shrine.chest);
  let before = await snapshot();
  await open();
  await unchanged(before, fixture.shrine.chest);
  await close();
  await page.keyboard.press('2');
  await frames();
  before = await snapshot();
  await open();
  await unchanged(before, fixture.shrine.chest);
  const afterFood = await snapshot();
  assert(afterFood.survival.nourishment <= before.survival.nourishment + 0.001, 'Chest interaction must not eat the selected food even when hungry');
  log('RMB with a held pickaxe and hungry-player steak opens the chest without consuming or placing the held item.');

  const selected = fixture.shrine.loot[1];
  await page.click('#chest-grid > button[data-chest-index="1"]');
  await page.waitForFunction(({ key, itemId }) => window.__worldloomWorld.discoveryLoot[key]?.every(stack => stack.id !== itemId), {}, { key: fixture.shrine.key, itemId: selected.id });
  const partial = await snapshot();
  assert.equal(count(partial, selected.id), count(before, selected.id) + selected.count);
  assert.deepEqual(await contents(), fixture.shrine.loot.filter(stack => stack.id !== selected.id));
  for (const stack of fixture.shrine.loot.filter(stack => stack.id !== selected.id)) assert.equal(count(partial, stack.id), count(before, stack.id));
  await page.click('#chest-take-all');
  await page.waitForFunction(() => document.querySelector('#chest-status')?.dataset.state === 'empty');
  const emptied = await snapshot();
  for (const stack of fixture.shrine.loot) assert.equal(count(emptied, stack.id), count(before, stack.id) + stack.count);
  assert.deepEqual(emptied.discoveryLoot[fixture.shrine.key], []);
  await close(); await open('r');
  assert.deepEqual(await contents(), []);
  assert.equal(await page.$eval('#chest-take-all', element => element.disabled), true);
  assert.equal(count(await snapshot(), fixture.shrine.chest.blockId), 0, 'The chest block itself never enters the inventory');
  log('Taking a selected stack transfers only that item; Take all transfers the rest once, and reopen keeps the chest empty.');

  // Persist the empty receipt, then reload with a deliberately full pack. All
  // filler stacks are legitimate items at their real capacity, not mocked UI.
  const full = await snapshot();
  full.inventory.slots = full.inventory.slots.map(() => ({ id: fixture.filler, count: 99 }));
  await reloadFixture(full);
  await aimAt(fixture.shrine.chest); await open('r');
  assert.deepEqual(await contents(), []);
  await close();
  await aimAt(fixture.quarry.chest);
  const fullBefore = await snapshot();
  await open();
  assert.deepEqual(await contents(), fixture.quarry.loot);
  assert.equal(await page.$eval('#chest-status', element => element.dataset.state), 'full');
  assert.equal(await page.$eval('#chest-take-all', element => element.disabled), true);
  assert(await page.$$eval('#chest-grid button', elements => elements.every(element => element.disabled)));
  await unchanged(fullBefore, fixture.quarry.chest);
  await close(); await open('r');
  assert.deepEqual(await contents(), fixture.quarry.loot);
  await unchanged(fullBefore, fixture.quarry.chest);
  log('Save/reload preserves the empty shrine; a full pack cannot take or erase quarry loot, including after reopen.');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  await writeFile(resolve(runDir, 'result.json'), JSON.stringify({ ok: true, checks, fixture, errors }, null, 2));
  console.log(JSON.stringify({ ok: true, checks, errors, evidence: runDir }, null, 2));
} catch (error) {
  console.error('Chest diagnostic:', await page?.evaluate(() => ({
    location: location.href, position: window.__worldloomPlayer?.position.toArray(), hit: window.__worldloomPlayer?.raycast(4.25)?.block,
    locked: Boolean(document.pointerLockElement), title: document.querySelector('#inventory-title')?.textContent,
    status: document.querySelector('#chest-status')?.textContent, loading: document.querySelector('#loading-text')?.textContent,
    inventory: document.querySelector('#inventory-panel')?.className,
  })).catch(() => null));
  await page?.screenshot({ path: resolve(runDir, 'failure.png') }).catch(() => {});
  console.error('Browser errors:', errors);
  throw error;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
