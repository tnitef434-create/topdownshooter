import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const baseUrl = process.env.WORLDLOOM_TEST_URL || 'http://127.0.0.1:4187/';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const snapshot = () => page.evaluate(() => {
  window.dispatchEvent(new Event('beforeunload'));
  return JSON.parse(localStorage.getItem('worldloom.save.v1'));
});
const count = (save, id) => save.inventory.slots.reduce((sum, slot) => sum + (slot.id === id ? slot.count : 0), 0);

try {
  await page.setViewport({width: 960, height: 640, deviceScaleFactor: 1});
  await page.evaluateOnNewDocument(() => localStorage.setItem('worldloom.settings.v1', JSON.stringify({
    viewDistance: 2, graphicsQuality: 'low', renderScale: 0.6,
    weatherEffects: false, volume: 0, musicEnabled: false,
  })));
  await page.goto(new URL('worldloom/', baseUrl).href, {waitUntil: 'domcontentloaded'});
  await page.waitForFunction(() => !document.querySelector('#main-menu').classList.contains('hidden')
    && document.querySelector('#loading-screen').classList.contains('hidden'));
  await page.type('#seed-input', '64');
  await page.click('#new-world-button');
  await page.waitForFunction(() => !document.querySelector('#hud').classList.contains('hidden')
    && document.querySelector('#loading-screen').classList.contains('hidden'), {timeout: 120_000});

  const spawn = await page.evaluate(async () => {
    const {BLOCK, BLOCKS} = await import('/worldloom/src/blocks.js');
    const p = window.__worldloomPlayer, w = window.__worldloomWorld;
    const eye = p.getEyePosition(), originalYaw = p.yaw;
    const rays = Array.from({length: 12}, (_, index) => {
      p.yaw = index * Math.PI / 6;
      return p.raycast(6)?.distance ?? 6;
    });
    p.yaw = originalYaw;
    const support = w.getBlock(Math.floor(p.position.x), Math.floor(p.position.y - 0.05), Math.floor(p.position.z));
    return {position: p.position.toArray(), eyeBlock: w.getBlock(Math.floor(eye.x), Math.floor(eye.y), Math.floor(eye.z)),
      supportSolid: Boolean(BLOCKS[support]?.solid), supportIsFoliage: [BLOCK.ASH_LEAVES, BLOCK.PINE_NEEDLES].includes(support), rays};
  });
  assert.equal(spawn.eyeBlock, 0, 'Fresh seed64 spawn still puts the camera inside foliage');
  assert.equal(spawn.supportIsFoliage, false, 'Fresh seed64 spawn landed on a tree canopy');
  assert.equal(spawn.supportSolid, true, 'Fresh seed64 spawn has no solid ground');
  assert(Math.min(...spawn.rays) >= 1.49, 'Fresh seed64 spawn has foliage immediately in front of the camera');
  assert.equal(await page.$eval('#title-button', (button) => button.textContent.trim()), 'Save & leave');
  if (process.env.WORLDLOOM_SCREENSHOT_DIR) await page.screenshot({path: `${process.env.WORLDLOOM_SCREENSHOT_DIR}/final-seed64-spawn.png`});

  // A small, deterministic world fixture isolates the input-to-inventory loop.
  // Mining, pickup, crafting, and placement all use the live game controllers.
  await page.click('#game');
  await page.waitForFunction(() => document.pointerLockElement?.id === 'game');
  const fixture = await page.evaluate(async () => {
    const {BLOCK} = await import('/worldloom/src/blocks.js');
    const p = window.__worldloomPlayer, w = window.__worldloomWorld;
    const x = Math.floor(p.position.x), y = Math.ceil(p.position.y) + 2, z = Math.floor(p.position.z);
    for (let dx = -2; dx <= 2; dx++) for (let dz = -4; dz <= 2; dz++) {
      w.setBlock(x + dx, y - 1, z + dz, BLOCK.STONE);
      for (let dy = 0; dy < 4; dy++) w.setBlock(x + dx, y + dy, z + dz, BLOCK.AIR);
    }
    w.setBlock(x, y + 1, z - 3, BLOCK.STONE);
    w.setBlock(x, y + 1, z - 2, BLOCK.ASH_LOG);
    p.position.set(x + 0.5, y + 0.002, z + 0.5);
    p.velocity.set(0, 0, 0); p.yaw = 0; p.pitch = 0;
    return {x, y: y + 1, z: z - 2, log: BLOCK.ASH_LOG, planks: BLOCK.ASH_PLANKS};
  });
  const before = await snapshot();
  assert.equal(count(before, fixture.log), 0, 'The survival fixture should begin without a free log');
  await page.mouse.down({button: 'left'});
  try {
    await page.waitForFunction(({x, y, z}) => window.__worldloomWorld.getBlock(x, y, z) === 0,
      {timeout: 60_000, polling: 100}, fixture);
  } finally { await page.mouse.up({button: 'left'}); }

  await page.keyboard.down('w');
  try {
    await page.waitForFunction((targetZ) => window.__worldloomPlayer.position.z < targetZ,
      {timeout: 10_000, polling: 50}, fixture.z + 1.35);
  } finally { await page.keyboard.up('w'); }
  await page.waitForFunction(() => [...document.querySelectorAll('#hotbar .hotbar-slot')]
    .some((slot) => /Ashwood Log/.test(slot.getAttribute('aria-label'))), {timeout: 10_000});
  const mined = await snapshot();
  assert.equal(count(mined, fixture.log), 1, 'The mined log was not collected into the inventory');
  // Step away after collecting so the replacement block cannot overlap us.
  await page.keyboard.down('s');
  try {
    await page.waitForFunction((targetZ) => window.__worldloomPlayer.position.z > targetZ,
      {timeout: 10_000, polling: 50}, fixture.z + 1.75);
  } finally { await page.keyboard.up('s'); }

  await page.keyboard.press('e');
  await page.waitForSelector('#inventory-panel:not(.hidden)');
  await page.type('#recipe-search', 'Ashwood Planks');
  await page.waitForFunction(() => document.querySelector('[data-recipe-id="ash_planks"]')?.disabled === false);
  await page.click('[data-recipe-id="ash_planks"]');
  const crafted = await snapshot();
  assert.equal(count(crafted, fixture.log), 0, 'Crafting did not consume the log');
  assert.equal(count(crafted, fixture.planks), 4, 'Crafting did not create four planks');
  const plankSlot = crafted.inventory.slots.findIndex((slot) => slot.id === fixture.planks);
  assert(plankSlot >= 0 && plankSlot < 9, 'Crafted planks should occupy the emptied hotbar slot');
  await page.click('#inventory-close');
  await page.waitForFunction(() => document.pointerLockElement?.id === 'game');
  await page.keyboard.press(String(plankSlot + 1));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  console.log('placement readiness:', await page.evaluate(({x, y, z, planks}) => {
    const p = window.__worldloomPlayer;
    window.__gameplayMouseEvents = [];
    window.addEventListener('mousedown', (event) => window.__gameplayMouseEvents.push({button: event.button, prevented: event.defaultPrevented, locked: Boolean(document.pointerLockElement)}));
    return {hit: p.raycast(), overlapsPlayer: p.intersectsBlock(x, y, z, planks), position: p.position.toArray()};
  }, fixture));
  await page.mouse.down({button: 'right'});
  await page.mouse.up({button: 'right'});
  console.log('placement input:', await page.evaluate(() => ({events: window.__gameplayMouseEvents, toast: document.querySelector('#toast-layer')?.textContent})));
  await page.waitForFunction(({x, y, z, planks}) => window.__worldloomWorld.getBlock(x, y, z) === planks,
    {timeout: 10_000}, fixture);
  const placed = await snapshot();
  assert.equal(count(placed, fixture.planks), 3, 'Placing a plank did not consume exactly one item');
  assert.deepEqual(errors, []);
  if (process.env.WORLDLOOM_SCREENSHOT_DIR) await page.screenshot({path: `${process.env.WORLDLOOM_SCREENSHOT_DIR}/final-mine-craft-place.png`});
  console.log(JSON.stringify({ok: true, spawn, minedLogs: 1, craftedPlanks: 4, remainingAfterPlace: 3, input: 'Real pointer lock, LMB hold, W movement, inventory Craft button, hotbar key and RMB'}, null, 2));
} catch (error) {
  console.error('Gameplay diagnostic:', await page.evaluate(() => ({
    position: window.__worldloomPlayer?.position.toArray(),
    target: document.querySelector('#target-label')?.textContent,
    locked: Boolean(document.pointerLockElement),
    toast: document.querySelector('#toast-layer')?.textContent,
    hud: document.querySelector('#hud')?.className,
    loading: document.querySelector('#loading-screen')?.className,
    loadingText: document.querySelector('#loading-text')?.textContent,
  })).catch(() => null));
  if (errors.length) console.error('Browser errors:', errors);
  if (process.env.WORLDLOOM_SCREENSHOT_DIR) await page.screenshot({path: `${process.env.WORLDLOOM_SCREENSHOT_DIR}/final-gameplay-failure.png`}).catch(() => {});
  throw error;
} finally { await browser.close(); }
