import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const baseUrl = process.argv[3] || process.env.WORLDLOOM_TEST_URL || 'http://127.0.0.1:4178/';
const executablePath = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotPath = process.argv[2] || process.env.WORLDLOOM_SCREENSHOT || '';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

const pageErrors = [];

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  page.on('pageerror', (error) => pageErrors.push(`portal: ${error.stack || error.message}`));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForSelector('#btn-deploy-main', { timeout: 15_000 });
  await page.evaluate(() => document.querySelector('#btn-deploy-main')?.click());
  await page.waitForFunction(() => document.querySelector('#deploy-modal')?.classList.contains('active'));
  const deployPresentation = await page.evaluate(() => {
    const card = document.querySelector('.modal-card.deploy-card');
    const operation = document.querySelector('.worldloom-operation');
    const badge = operation?.querySelector('.worldloom-operation-badge');
    if (!card || !operation || !badge) return null;

    const rules = [];
    const collectRules = (ruleList) => {
      for (const rule of ruleList || []) {
        if (rule.selectorText?.includes('.modal-card.deploy-card::-webkit-scrollbar-thumb')) {
          rules.push(rule.cssText);
        }
        if (rule.cssRules) collectRules(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        collectRules(sheet.cssRules);
      } catch {
        // All application styles are same-origin, but ignore an injected sheet
        // if the browser declines access to it.
      }
    }

    const style = getComputedStyle(card);
    return {
      overflowY: style.overflowY,
      scrollbarColor: style.scrollbarColor,
      scrollbarGutter: style.scrollbarGutter,
      scrollable: card.scrollHeight > card.clientHeight,
      thumbRule: rules.join('\n'),
      badge: badge.textContent?.trim() || '',
      updateCopy: operation.textContent?.replace(/\s+/g, ' ').trim() || '',
    };
  });
  assert(deployPresentation, 'Enter Battlefield deploy presentation is missing');
  assert.match(deployPresentation.overflowY, /auto|scroll/, 'Deploy panel is not a scroll container');
  assert.equal(deployPresentation.scrollable, true, 'Deploy panel does not expose its overflow through the custom scrollbar');
  assert.match(deployPresentation.scrollbarColor, /212\D+175\D+55/, 'Deploy panel scrollbar is not TacticStrike gold');
  assert.match(deployPresentation.scrollbarGutter, /stable/, 'Deploy panel scrollbar has no stable gutter');
  assert.match(deployPresentation.thumbRule, /(?:#d4af37|rgb\(212\s*,\s*175\s*,\s*55\))/i,
    'Deploy panel is missing its custom gold WebKit scrollbar thumb');
  assert.match(deployPresentation.badge, /MAJOR UPDATE LIVE/i, 'Enter Battlefield does not badge the Worldloom update');
  assert.match(deployPresentation.updateCopy, /rebuilt block interface/i, 'Enter Battlefield is missing the Worldloom interface update copy');
  assert.match(deployPresentation.updateCopy, /faster terrain streaming/i, 'Enter Battlefield is missing the Worldloom performance update copy');
  await page.evaluate(() => document.querySelector('#btn-play-worldloom')?.click());
  await page.waitForFunction(() => document.body.classList.contains('is-worldloom-open'));

  await page.waitForFunction(() => {
    const loader = document.querySelector('#worldloom-frame-loading');
    return loader?.getAttribute('aria-busy') === 'false' && loader?.classList.contains('is-hidden');
  }, { timeout: 30_000 });

  const frameHandle = await page.$('#worldloom-frame');
  const frame = await frameHandle?.contentFrame();
  assert(frame, 'Worldloom iframe did not become available');
  await frame.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden'));
  const mainMenuPresentation = await frame.evaluate(() => {
    const menu = document.querySelector('.menu-card.surface-panel');
    const titlePlate = document.querySelector('.brand--hero');
    const title = document.querySelector('#main-title');
    if (!menu || !titlePlate || !title) return null;
    const inspectPlate = (element) => {
      const style = getComputedStyle(element);
      return {
        borderWidths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
        borderColors: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor],
        radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius],
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter || 'none',
      };
    };
    return {
      menu: inspectPlate(menu),
      titlePlate: inspectPlate(titlePlate),
      titleFont: getComputedStyle(title).fontFamily,
      hasBlockMark: Boolean(titlePlate.querySelector('.brand__block-mark')),
    };
  });
  assert(mainMenuPresentation, 'Worldloom main menu presentation is missing');
  for (const [plateName, plate] of [
    ['menu card', mainMenuPresentation.menu],
    ['title plate', mainMenuPresentation.titlePlate],
  ]) {
    assert.deepEqual(plate.borderWidths, ['4px', '4px', '4px', '4px'], `${plateName} lost its 4px block bevel`);
    assert(plate.radii.every((radius) => Number.parseFloat(radius) <= 2), `${plateName} is no longer square-edged`);
    assert.notEqual(plate.borderColors[0], plate.borderColors[2], `${plateName} lost its light/shadow bevel contrast`);
    assert.equal(plate.backdropFilter, 'none', `${plateName} reintroduced backdrop blur`);
  }
  assert.match(mainMenuPresentation.titleFont, /Consolas|Courier New|monospace/i,
    'Worldloom title is no longer rendered in the approved block-built monospace style');
  assert.equal(mainMenuPresentation.hasBlockMark, true, 'Worldloom title plate lost its voxel block mark');
  await frame.evaluate(() => document.querySelector('#new-world-button')?.click());
  await frame.waitForFunction(() => !document.querySelector('#hud')?.classList.contains('hidden'), {
    timeout: 60_000,
  });
  await delay(1_500);

  const hudPresentation = await frame.evaluate(() => {
    const inspectPlate = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const style = getComputedStyle(element);
      return {
        borderWidths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
        borderColors: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor],
        radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius],
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter || 'none',
      };
    };
    return {
      objective: inspectPlate('.objective-card'),
      time: inspectPlate('.time-chip'),
    };
  });
  for (const [plateName, plate] of [
    ['objective HUD plate', hudPresentation.objective],
    ['time HUD plate', hudPresentation.time],
  ]) {
    assert(plate, `${plateName} is missing`);
    assert.deepEqual(plate.borderWidths, ['3px', '3px', '3px', '3px'], `${plateName} lost its square bevel`);
    assert(plate.radii.every((radius) => Number.parseFloat(radius) <= 1), `${plateName} became rounded`);
    assert.notEqual(plate.borderColors[0], plate.borderColors[2], `${plateName} lost its light/shadow bevel contrast`);
    assert.equal(plate.backdropFilter, 'none', `${plateName} reintroduced glass blur`);
  }

  const gameState = await frame.evaluate(() => {
    const graphics = window.__worldloomGraphics;
    const terrain = graphics?.scene?.children
      ?.filter((child) => child.name?.startsWith('Terrain '))
      .map((mesh) => ({
        name: mesh.name,
        visible: mesh.visible,
        vertices: mesh.geometry?.getAttribute('position')?.count || 0,
        position: mesh.position.toArray(),
      })) || [];
    const camera = graphics?.camera;
    const forward = camera?.position?.clone();
    if (camera && forward) camera.getWorldDirection(forward);
    return {
      webgl2: Boolean(document.querySelector('#game')?.getContext('webgl2')),
      timeIcon: Boolean(document.querySelector('.time-chip__sun')),
      timeText: document.querySelector('#time-text')?.textContent || '',
      vitality: document.querySelector('[aria-label="Vitality"]')?.getAttribute('aria-valuenow'),
      nourishment: document.querySelector('[aria-label="Nourishment"]')?.getAttribute('aria-valuenow'),
      objective: document.querySelector('#objective-text')?.textContent || '',
      renderer: Boolean(graphics),
      environment: Boolean(window.__worldloomEnvironment),
      camera: camera?.position?.toArray() || null,
      cameraForward: forward?.toArray() || null,
      terrain,
    };
  });
  assert.equal(gameState.webgl2, true, 'WebGL 2 did not initialize');
  assert.equal(gameState.timeIcon, true, 'HUD updates removed the sun icon');
  assert.match(gameState.timeText, /Day 1/);
  assert.equal(gameState.vitality, '100');
  assert.equal(gameState.nourishment, '90');
  assert.notEqual(gameState.objective.trim(), '');
  assert.equal(gameState.renderer, true);
  assert.equal(gameState.environment, true);
  assert(gameState.terrain.some((mesh) => mesh.visible && mesh.vertices > 0),
    `No visible terrain geometry reached the first playable frame: ${JSON.stringify(gameState.terrain)}`);
  assert(gameState.terrain.filter((mesh) => mesh.visible && mesh.vertices > 0).length >= 9,
    `The playable frame opened before its immediate terrain neighborhood was ready: ${JSON.stringify(gameState.terrain)}`);

  const stormState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    environment.lightning.timer = 0;
    // The strike system correctly refuses unloaded terrain. Use the live
    // atmosphere/player focus instead of assuming every generated seed spawns
    // inside the origin chunk.
    const focus = environment.atmosphere.position.clone();
    const strike = environment.lightning.update(0.1, focus, 0.9, 0.9, 0.9);
    const boltVertices = environment.lightning.geometry.getAttribute('position')?.count || 0;
    environment.rainTarget = 1;
    environment.rainIntensity = 0.9;
    environment.cloudCover = 0;
    environment.localCloudCoverage = 0;
    environment.localCloudCount = 0;
    environment._updateWeather(0.1);
    return {
      strike: Boolean(strike),
      boltVertices,
      cloudlessRain: environment.rainIntensity,
    };
  });
  assert.equal(stormState.strike, true, 'Procedural lightning did not produce a strike');
  assert(stormState.boltVertices >= 32, 'Lightning bolt did not contain a full branching path');
  assert.equal(stormState.cloudlessRain, 0, 'Rain continued without local clouds');

  if (screenshotPath) {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  await page.setViewport({ width: 320, height: 640, deviceScaleFactor: 1 });
  await delay(250);
  await frame.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', bubbles: true }));
  });
  await frame.waitForFunction(() => !document.querySelector('#inventory-panel')?.classList.contains('hidden'));
  const mobileInventory = await frame.evaluate(() => {
    const grid = document.querySelector('#inventory-grid');
    const panel = document.querySelector('.inventory-window');
    const hotbar = document.querySelector('#hotbar').getBoundingClientRect();
    return {
      columns: getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panelOverflow: panel.scrollWidth - panel.clientWidth,
      hotbarLeft: hotbar.left,
      hotbarRight: hotbar.right,
      viewportWidth: innerWidth,
    };
  });
  assert.equal(mobileInventory.columns, 6, 'Mobile inventory did not collapse to six columns');
  assert(mobileInventory.pageOverflow <= 1, 'Mobile game page overflows horizontally');
  assert(mobileInventory.panelOverflow <= 2, 'Mobile inventory panel overflows horizontally');
  assert(mobileInventory.hotbarLeft >= -1 && mobileInventory.hotbarRight <= mobileInventory.viewportWidth + 1,
    'Mobile hotbar is clipped outside the viewport');

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await frame.evaluate(() => {
    window.__worldloomOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function failWorldSave(key, value) {
      if (String(key).startsWith('worldloom.save')) throw new DOMException('full', 'QuotaExceededError');
      return window.__worldloomOriginalSetItem.call(this, key, value);
    };
  });
  await page.evaluate(() => document.querySelector('#btn-close-worldloom')?.click());
  await page.waitForFunction(() => {
    const leave = document.querySelector('#btn-leave-worldloom-unsaved');
    return document.body.classList.contains('is-worldloom-open') && leave && !leave.hidden;
  }, { timeout: 4_000 });
  assert.match(await page.$eval('#worldloom-portal-status', (element) => element.textContent), /SAVE FAILED/);
  await frame.evaluate(() => {
    Storage.prototype.setItem = window.__worldloomOriginalSetItem;
    delete window.__worldloomOriginalSetItem;
  });
  const closeStarted = Date.now();
  await page.evaluate(() => document.querySelector('#btn-close-worldloom')?.click());
  await page.waitForFunction(() => !document.body.classList.contains('is-worldloom-open'), {
    timeout: 3_000,
  });
  const closeDuration = Date.now() - closeStarted;
  const closedState = await page.evaluate(() => ({
    src: document.querySelector('#worldloom-frame')?.getAttribute('src'),
    focus: document.activeElement?.id,
    backgroundInert: [...document.querySelector('#app').children]
      .filter((element) => element.id !== 'worldloom-site-screen')
      .some((element) => element.hasAttribute('inert')),
  }));
  assert.equal(closedState.src, null);
  assert.equal(closedState.focus, 'btn-play-worldloom');
  assert.equal(closedState.backgroundInert, false);
  console.log(`portal close handshake: ${closeDuration}ms`);
  assert(closeDuration < 2_500, 'Portal save acknowledgement timed out during close');

  await page.evaluate(() => document.querySelector('#btn-play-worldloom')?.click());
  await page.waitForFunction(() => document.querySelector('#worldloom-frame-loading')?.getAttribute('aria-busy') === 'false'
    && document.querySelector('#worldloom-frame-loading')?.classList.contains('is-hidden'), {
    timeout: 30_000,
  });
  const reopenedHandle = await page.$('#worldloom-frame');
  const reopenedFrame = await reopenedHandle?.contentFrame();
  assert(reopenedFrame, 'Worldloom iframe did not reopen');
  await reopenedFrame.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden'));
  assert.equal(await reopenedFrame.$eval('#continue-button', (button) => button.disabled), false);
  const exactResumeTarget = await reopenedFrame.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('worldloom.save.v1') || 'null');
    save.player.position[0] = Math.floor(save.player.position[0]) + 0.37;
    save.player.position[2] = Math.floor(save.player.position[2]) + 0.63;
    save.player.velocity = [0, 0, 0];
    save.updatedAt = new Date(Date.now() + 1_000).toISOString();
    localStorage.setItem('worldloom.save.v1', JSON.stringify(save));
    return [save.player.position[0], save.player.position[2]];
  });
  await reopenedFrame.evaluate(() => document.querySelector('#continue-button')?.click());
  await reopenedFrame.waitForFunction(() => !document.querySelector('#hud')?.classList.contains('hidden'), {
    timeout: 60_000,
  });
  await delay(250);
  await reopenedFrame.evaluate(() => window.dispatchEvent(new Event('beforeunload')));
  const resumedPosition = await reopenedFrame.evaluate(() => (
    JSON.parse(localStorage.getItem('worldloom.save.v1') || 'null')?.player?.position
  ));
  assert(Math.abs(resumedPosition[0] - exactResumeTarget[0]) < 1e-6, 'Continue snapped the saved X coordinate');
  assert(Math.abs(resumedPosition[2] - exactResumeTarget[1]) < 1e-6, 'Continue snapped the saved Z coordinate');

  await page.evaluate(() => document.querySelector('#btn-close-worldloom')?.click());
  await page.waitForFunction(() => !document.body.classList.contains('is-worldloom-open'), { timeout: 3_000 });

  const inventoryPage = await browser.newPage();
  inventoryPage.on('pageerror', (error) => pageErrors.push(`inventory-drag: ${error.stack || error.message}`));
  await inventoryPage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await inventoryPage.goto(new URL('worldloom/index.html', baseUrl).href, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await inventoryPage.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden'));
  await inventoryPage.evaluate(() => {
    const builder = document.querySelector('input[name="mode"][value="builder"]');
    if (builder) builder.checked = true;
    document.querySelector('#new-world-button')?.click();
  });
  await inventoryPage.waitForFunction(() => !document.querySelector('#hud')?.classList.contains('hidden'), {
    timeout: 60_000,
  });
  await inventoryPage.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', bubbles: true }));
  });
  await inventoryPage.waitForFunction(() => !document.querySelector('#inventory-panel')?.classList.contains('hidden'));
  const dragSlot = async (from, to = null) => {
    const source = await inventoryPage.$(`#inventory-grid .inventory-slot[data-index="${from}"]`);
    const sourceBox = await source?.boundingBox();
    assert(sourceBox, `Inventory slot ${from} has no drag bounds`);
    let destination = { x: 3, y: 3 };
    if (to != null) {
      const target = await inventoryPage.$(`#inventory-grid .inventory-slot[data-index="${to}"]`);
      const targetBox = await target?.boundingBox();
      assert(targetBox, `Inventory slot ${to} has no drag bounds`);
      destination = { x: targetBox.x + targetBox.width / 2, y: targetBox.y + targetBox.height / 2 };
    }
    await inventoryPage.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await inventoryPage.mouse.down();
    await inventoryPage.mouse.move(destination.x, destination.y, { steps: 8 });
    await inventoryPage.mouse.up();
    await delay(120);
  };
  await dragSlot(0, 20);
  const movedStack = await inventoryPage.evaluate(() => ({
    source: document.querySelector('#inventory-grid [data-index="0"]')?.getAttribute('aria-label'),
    target: document.querySelector('#inventory-grid [data-index="20"]')?.getAttribute('aria-label'),
  }));
  assert.match(movedStack.source, /Empty/);
  assert.match(movedStack.target, /Meadow Turf/);
  await dragSlot(20);

  const secondStackBefore = await inventoryPage.evaluate(() => {
    const slot = document.querySelector('#inventory-grid [data-index="1"]');
    const label = slot?.getAttribute('aria-label') || '';
    return {
      label,
      name: label.replace(/,\s*\d+\s*$/, ''),
      hasBlockIcon: Boolean(slot?.querySelector('.item-cube')),
    };
  });
  assert.doesNotMatch(secondStackBefore.label, /Empty/, 'second inventory block stack is unexpectedly empty');
  assert.match(secondStackBefore.label, /,\s*99\s*$/, 'second inventory block stack does not contain a full stack');
  assert.equal(secondStackBefore.hasBlockIcon, true, 'second inventory stack is not a placeable block');
  await dragSlot(1, 21);
  const movedSecondStack = await inventoryPage.evaluate(() => ({
    source: document.querySelector('#inventory-grid [data-index="1"]')?.getAttribute('aria-label'),
    target: document.querySelector('#inventory-grid [data-index="21"]')?.getAttribute('aria-label'),
  }));
  assert.match(movedSecondStack.source, /Empty/, 'non-first block stack remained in its source slot');
  assert.equal(movedSecondStack.target, secondStackBefore.label, 'non-first block stack did not move intact to the target slot');
  await dragSlot(21);
  const visibleLooseItems = await inventoryPage.evaluate(() => {
    const graphics = window.__worldloomGraphics;
    const items = [];
    for (const root of graphics?.scene?.children || []) {
      if (!root.name?.startsWith('Loose ')) continue;
      let visibleMeshCount = 0;
      root.traverse?.((child) => {
        if (child.isMesh && child.visible) visibleMeshCount++;
      });
      items.push({
        name: root.name,
        attachedToScene: root.parent === graphics.scene,
        visible: root.visible,
        visibleMeshCount,
        finitePosition: root.position.toArray().every(Number.isFinite),
      });
    }
    return items;
  });
  const meadowLooseItem = visibleLooseItems.find((item) => /Loose Meadow Turf x99/i.test(item.name));
  const secondLooseItem = visibleLooseItems.find((item) => item.name === `Loose ${secondStackBefore.name} x99`);
  for (const [itemName, item] of [['Meadow Turf', meadowLooseItem], [secondStackBefore.name, secondLooseItem]]) {
    assert(item, `${itemName} drop did not create a loose world object`);
    assert.equal(item.attachedToScene, true, `${itemName} loose object is detached from the live scene`);
    assert.equal(item.visible, true, `${itemName} loose object is hidden`);
    assert(item.visibleMeshCount > 0, `${itemName} loose object has no visible model`);
    assert.equal(item.finitePosition, true, `${itemName} loose object spawned at an invalid position`);
  }
  await inventoryPage.evaluate(() => window.dispatchEvent(new Event('beforeunload')));
  const looseItemSave = await inventoryPage.evaluate(() => JSON.parse(localStorage.getItem('worldloom.save.v1') || 'null'));
  assert.equal(looseItemSave?.inventory?.slots?.[20]?.id, 0, 'dropped stack remained in its inventory slot');
  assert.equal(looseItemSave?.droppedItems?.[0]?.count, 99, 'dropped stack was not persisted as a world item');
  assert.equal(looseItemSave?.inventory?.slots?.[21]?.id, 0, 'second dropped stack remained in its inventory slot');
  assert(looseItemSave?.droppedItems?.length >= 2, 'second dropped stack was not persisted');
  assert.equal(new Set(looseItemSave.droppedItems.map((item) => item.id)).size >= 2, true,
    'persisted loose items did not retain both distinct block types');
  assert.equal(looseItemSave.droppedItems.filter((item) => item.count === 99).length >= 2, true,
    'persisted loose items did not retain both full block stacks');
  await inventoryPage.close();

  const resilientPage = await browser.newPage();
  resilientPage.on('pageerror', (error) => pageErrors.push(`resilience: ${error.stack || error.message}`));
  await resilientPage.evaluateOnNewDocument(() => {
    class BrokenAudioContext {
      constructor() {
        throw new DOMException('Audio disabled by browser policy', 'NotAllowedError');
      }
    }
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: BrokenAudioContext });
    Object.defineProperty(window, 'webkitAudioContext', { configurable: true, value: BrokenAudioContext });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await resilientPage.goto(new URL('worldloom/index.html', baseUrl).href, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await resilientPage.waitForFunction(() => !document.querySelector('#main-menu')?.classList.contains('hidden'), {
    timeout: 30_000,
  });
  await resilientPage.evaluate(() => document.querySelector('#new-world-button')?.click());
  await resilientPage.waitForFunction(() => !document.querySelector('#hud')?.classList.contains('hidden'), {
    timeout: 60_000,
  });
  assert.equal(await resilientPage.$eval('#unsupported', (element) => element.classList.contains('hidden')), true);
  await resilientPage.close();

  const failurePage = await browser.newPage();
  failurePage.on('pageerror', (error) => pageErrors.push(`webgl-recovery: ${error.stack || error.message}`));
  await failurePage.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await failurePage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await failurePage.waitForSelector('#btn-deploy-main');
  await failurePage.evaluate(() => document.querySelector('#btn-deploy-main')?.click());
  await failurePage.evaluate(() => document.querySelector('#btn-play-worldloom')?.click());
  await failurePage.waitForFunction(() => {
    const loader = document.querySelector('#worldloom-frame-loading');
    const actions = loader?.querySelector('.worldloom-frame-actions');
    return loader?.classList.contains('has-error')
      && loader.getAttribute('aria-busy') === 'false'
      && actions && !actions.hidden;
  }, { timeout: 30_000 });
  await failurePage.evaluate(() => document.querySelector('#btn-return-worldloom')?.click());
  await delay(250);
  const failureReturnState = await failurePage.evaluate(() => ({
    open: document.body.classList.contains('is-worldloom-open'),
    closeDisabled: document.querySelector('#btn-close-worldloom')?.disabled,
    returnHidden: document.querySelector('#btn-return-worldloom')?.closest('.worldloom-frame-actions')?.hidden,
  }));
  assert.equal(failureReturnState.open, false, `WebGL recovery return failed: ${JSON.stringify(failureReturnState)}`);
  await failurePage.close();

  assert.deepEqual(pageErrors, [], `Unhandled browser errors:\n${pageErrors.join('\n\n')}`);
  console.log(JSON.stringify({
    ok: true,
    gameState,
    stormState,
    deployPresentation,
    mainMenuPresentation,
    hudPresentation,
    mobileInventory,
    closeDuration,
    resilience: 'audio and storage failures recovered',
    inventoryDrag: 'multiple block stacks move between slots and persist as visible loose world items',
    exactResume: 'safe fractional X/Z position restored without snapping',
    webglRecovery: 'portal exposed retry and return actions',
  }, null, 2));
} finally {
  await browser.close();
}
