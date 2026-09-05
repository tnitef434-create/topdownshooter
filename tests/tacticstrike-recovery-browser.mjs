import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer';

const baseUrl = process.argv[2] || process.env.TACTICSTRIKE_TEST_URL || 'http://127.0.0.1:4178/tacticstrike/';
const executablePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browsers = [], errors = [], dialogs = [], results = {};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function participant(label) {
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  browsers.push(browser);
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  page.on('pageerror', error => errors.push(`${label}: ${error.stack || error.message}`));
  page.on('dialog', async dialog => { dialogs.push(`${label}: ${dialog.message()}`); await dialog.accept(); });
  await page.evaluateOnNewDocument(() => {
    HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('Media disabled in browser test', 'NotAllowedError')); };
  });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#btn-deploy-main');
  await page.waitForFunction(() => window.AppSocket?.connected);
  await page.waitForFunction(() => !document.getElementById('startup-overlay'));
  await page.evaluate(() => document.querySelectorAll('.modal-overlay.active').forEach(modal => modal.classList.remove('active')));
  await page.click('#btn-deploy-main');
  await page.waitForFunction(() => document.querySelector('#deploy-modal')?.classList.contains('active'));
  return { browser, page };
}

const snapshot = page => page.evaluate(() => {
  const engine = window.gameEngine;
  const banner = document.getElementById('match-connection-status');
  return { id: window.AppSocket.id, active: engine?.active, state: engine?.gameState, paused: engine?.networkPaused,
    time: engine?.matchTime, health: engine?.localPlayer.health, x: engine?.localPlayer.x, y: engine?.localPlayer.y,
    round: engine?.roundNumber, scoreSelf: engine?.scoreSelf, scoreOpponent: engine?.scoreOpponent,
    hidden: document.hidden, bannerVisible: Boolean(banner && !banner.hidden && getComputedStyle(banner).display !== 'none'), banner: banner?.textContent || '' };
});

try {
  const owner = await participant('owner');
  const friend = await participant('friend');
  await owner.page.click('#btn-create-room');
  await owner.page.waitForFunction(() => document.getElementById('room-code-display')?.textContent.trim().length === 5 && document.querySelector('#lobby-screen')?.classList.contains('active'));
  const roomId = await owner.page.$eval('#room-code-display', element => element.textContent.trim());
  await friend.page.type('#room-code-input', roomId);
  await friend.page.click('#btn-join-room');
  await friend.page.waitForFunction(() => document.querySelector('#lobby-screen')?.classList.contains('active'));
  await owner.page.click('#btn-ready-toggle');
  await friend.page.click('#btn-ready-toggle');
  for (const { page } of [owner, friend]) await page.waitForFunction(() => window.gameEngine?.mode === 'online' && window.gameEngine.gameState === 'playing', { timeout: 20000 });
  const initial = await snapshot(owner.page);
  await owner.page.keyboard.down('w'); await delay(300); await owner.page.keyboard.up('w');
  const moved = await snapshot(owner.page);
  assert.ok(Math.hypot(moved.x - initial.x, moved.y - initial.y) > 5, 'real keyboard movement works before pausing');

  const background = await owner.browser.newPage();
  await background.goto('about:blank'); await background.bringToFront();
  await owner.page.waitForFunction(() => document.hidden && window.gameEngine.networkPaused);
  await friend.page.waitForFunction(() => window.gameEngine.networkPaused && !document.getElementById('match-connection-status').hidden);
  const hiddenBefore = await snapshot(friend.page);
  await delay(1400);
  const hiddenAfter = await snapshot(friend.page);
  assert.equal(hiddenAfter.time, hiddenBefore.time, 'background tab pauses the opponent round clock too');
  assert.equal(hiddenAfter.health, hiddenBefore.health);
  assert.match(hiddenAfter.banner, /away from the tab/);
  await mkdir('work', { recursive: true });
  await friend.page.screenshot({ path: 'work/tacticstrike-tab-pause.png' });
  await owner.page.bringToFront();
  for (const { page } of [owner, friend]) await page.waitForFunction(() => !window.gameEngine.networkPaused && document.getElementById('match-connection-status').hidden);
  results.visibility = { roomId, pausedClock: hiddenAfter.time, banner: hiddenAfter.banner, resumed: true };
  await background.close();

  const beforeRecovery = await snapshot(owner.page);
  await owner.page.evaluate(() => { window.AppSocket.io.reconnection(false); window.AppSocket.io.engine.close(); });
  for (const { page } of [owner, friend]) await page.waitForFunction(() => window.gameEngine.networkPaused && !document.getElementById('match-connection-status').hidden);
  const disconnectedBefore = await snapshot(friend.page);
  await delay(1400);
  const disconnectedAfter = await snapshot(friend.page);
  assert.equal(disconnectedAfter.time, disconnectedBefore.time);
  assert.equal(disconnectedAfter.health, disconnectedBefore.health);
  assert.match(disconnectedAfter.banner, /reconnect/);
  await friend.page.screenshot({ path: 'work/tacticstrike-connection-pause.png' });
  await owner.page.evaluate(() => window.AppSocket.connect());
  await owner.page.waitForFunction(() => window.AppSocket.connected && window.AppSocket.recovered && !window.gameEngine.networkPaused);
  await friend.page.waitForFunction(() => !window.gameEngine.networkPaused);
  const afterRecovery = await snapshot(owner.page);
  assert.equal(afterRecovery.id, beforeRecovery.id);
  assert.equal(afterRecovery.health, beforeRecovery.health);
  assert.equal(afterRecovery.round, beforeRecovery.round);
  assert.equal(afterRecovery.scoreSelf, beforeRecovery.scoreSelf);
  assert.equal(afterRecovery.scoreOpponent, beforeRecovery.scoreOpponent);
  assert.equal(afterRecovery.bannerVisible, false);
  assert.equal(afterRecovery.active, true);
  await delay(1200);
  assert.ok((await snapshot(owner.page)).time < afterRecovery.time, 'round clock advances again after transport recovery');
  results.recovery = { samePlayer: true, sameRound: afterRecovery.round, health: afterRecovery.health, resumedClock: true };

  await owner.page.click('#btn-game-menu');
  await owner.page.click('#btn-game-leave');
  await owner.page.waitForSelector('.insite-dialog-overlay.active [data-dialog-confirm]');
  await owner.page.click('.insite-dialog-overlay.active [data-dialog-confirm]');
  await owner.page.waitForFunction(() => !window.gameEngine?.active || document.querySelector('#menu-screen')?.classList.contains('active'));
  await friend.page.waitForFunction(() => !window.gameEngine?.active || document.querySelector('#lobby-screen')?.classList.contains('active'), { timeout: 5000 });
  results.explicitLeave = { immediate: true, dialogs };
  assert.deepEqual(errors, [], `Browser runtime errors: ${errors.join('\n')}`);
  console.log(JSON.stringify({ ok: true, ...results, browserErrors: errors }, null, 2));
} catch (error) {
  for (let index = 0; index < browsers.length; index++) {
    const pages = await browsers[index].pages();
    for (const page of pages) if (page.url().includes('/tacticstrike/')) {
      await page.screenshot({ path: `work/tacticstrike-browser-failure-${index}.png` });
      console.error(JSON.stringify(await page.evaluate(() => ({ active: document.querySelector('.screen.active')?.id, overlays: [...document.querySelectorAll('.modal-overlay.active')].map(element => element.id), text: document.body.innerText.slice(-1500), socket: window.AppSocket?.connected, error: window.gameEngine?.active === false })), null, 2));
    }
  }
  throw error;
} finally {
  for (const browser of browsers) await browser.close();
}
