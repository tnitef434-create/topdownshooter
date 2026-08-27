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

  await frame.evaluate(() => document.querySelector('#settings-button')?.click());
  await frame.waitForFunction(() => !document.querySelector('#settings-panel')?.classList.contains('hidden'));
  const settingsPresentation = await frame.evaluate(() => {
    const panel = document.querySelector('.settings-window.surface-panel');
    const list = document.querySelector('.settings-list');
    const toggleFace = document.querySelector('.settings-window .toggle > span');
    if (!panel || !list || !toggleFace) return null;
    const thumbRules = [];
    const collectRules = (ruleList) => {
      for (const rule of ruleList || []) {
        if (rule.selectorText?.includes('.settings-list::-webkit-scrollbar-thumb')) thumbRules.push(rule.cssText);
        if (rule.cssRules) collectRules(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      try { collectRules(sheet.cssRules); } catch { /* ignore injected cross-origin styles */ }
    }
    const panelStyle = getComputedStyle(panel);
    const listStyle = getComputedStyle(list);
    const toggleStyle = getComputedStyle(toggleFace);
    return {
      borderWidths: [panelStyle.borderTopWidth, panelStyle.borderRightWidth, panelStyle.borderBottomWidth, panelStyle.borderLeftWidth],
      borderColors: [panelStyle.borderTopColor, panelStyle.borderRightColor, panelStyle.borderBottomColor, panelStyle.borderLeftColor],
      radii: [panelStyle.borderTopLeftRadius, panelStyle.borderTopRightRadius, panelStyle.borderBottomRightRadius, panelStyle.borderBottomLeftRadius],
      backdropFilter: panelStyle.backdropFilter || panelStyle.webkitBackdropFilter || 'none',
      font: panelStyle.fontFamily,
      groupCount: panel.querySelectorAll('.settings-group').length,
      rowCount: panel.querySelectorAll('.setting-row').length,
      blockMark: Boolean(panel.querySelector('.settings-block-mark')),
      overflowY: listStyle.overflowY,
      scrollable: list.scrollHeight > list.clientHeight,
      scrollbarColor: listStyle.scrollbarColor,
      thumbRule: thumbRules.join('\n'),
      toggleRadius: toggleStyle.borderRadius,
    };
  });
  assert(settingsPresentation, 'Settings presentation is missing');
  assert.deepEqual(settingsPresentation.borderWidths, ['4px', '4px', '4px', '4px'], 'Settings lost its 4px block bevel');
  assert(settingsPresentation.radii.every((radius) => Number.parseFloat(radius) <= 2), 'Settings became rounded');
  assert.notEqual(settingsPresentation.borderColors[0], settingsPresentation.borderColors[2], 'Settings lost bevel contrast');
  assert.equal(settingsPresentation.backdropFilter, 'none', 'Settings reintroduced glass blur');
  assert.match(settingsPresentation.font, /Consolas|Courier New|monospace/i);
  assert.equal(settingsPresentation.groupCount, 3, 'Settings controls are no longer grouped into authored control banks');
  assert.equal(settingsPresentation.rowCount, 11, 'A live Settings control disappeared during redesign');
  assert.equal(settingsPresentation.blockMark, true, 'Settings lost its control-block mark');
  assert.match(settingsPresentation.overflowY, /auto|scroll/);
  assert.equal(settingsPresentation.scrollable, true, 'Settings does not expose overflow through its custom scrollbar');
  assert.match(settingsPresentation.scrollbarColor, /119\D+119\D+119|#777/i, 'Settings scrollbar is not block-grey');
  assert.match(settingsPresentation.thumbRule, /(?:#8e8e8e|rgb\(142\s*,\s*142\s*,\s*142\))/i,
    'Settings is missing its custom square WebKit scrollbar thumb');
  assert.equal(Number.parseFloat(settingsPresentation.toggleRadius), 0, 'Settings toggles reverted to pill switches');
  const maximumViewSettings = await frame.evaluate(async () => {
    const input = document.querySelector('#view-distance');
    const output = document.querySelector('#view-distance-value');
    if (!input || !output) return null;
    input.value = '20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const { SaveStore } = await import('/worldloom/src/save.js');
    return {
      minimum: Number(input.min),
      maximum: Number(input.max),
      value: Number(input.value),
      output: output.textContent?.trim() || '',
      persisted: new SaveStore().loadSettings().viewDistance,
    };
  });
  assert(maximumViewSettings, 'The view-distance control is missing');
  assert.equal(maximumViewSettings.minimum, 2);
  assert.equal(maximumViewSettings.maximum, 20, 'The settings UI does not expose the 20-chunk horizon');
  assert.equal(maximumViewSettings.value, 20);
  assert.equal(maximumViewSettings.output, '20 chunks');
  assert.equal(maximumViewSettings.persisted, 20,
    'The maximum view-distance selection did not survive settings persistence');
  await frame.evaluate(() => document.querySelector('#settings-close')?.click());
  await frame.waitForFunction(() => document.querySelector('#settings-panel')?.classList.contains('hidden'));
  await frame.evaluate(() => {
    const seed = document.querySelector('#seed-input');
    if (seed) seed.value = '64';
    document.querySelector('#new-world-button')?.click();
  });
  await frame.waitForFunction(() => !document.querySelector('#hud')?.classList.contains('hidden'), {
    timeout: 60_000,
  });
  await delay(1_500);
  await frame.waitForFunction(() => (
    window.__worldloomSummitCrosses?.getStats?.().crosses > 0
  ), { timeout: 15_000 });

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
    const environment = window.__worldloomEnvironment;
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
    const renderedChunkKeys = new Set(terrain
      .filter((mesh) => mesh.visible && mesh.vertices > 0)
      .map((mesh) => `${Math.round(mesh.position[0] / 16)},${Math.round(mesh.position[2] / 16)}`));
    const centerChunkX = Math.floor((camera?.position?.x || 0) / 16);
    const centerChunkZ = Math.floor((camera?.position?.z || 0) / 16);
    let completeTerrainRadius = -1;
    for (let radius = 0; radius <= 12; radius++) {
      let ringComplete = true;
      for (let dz = -radius; dz <= radius && ringComplete; dz++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (radius > 0 && Math.abs(dx) !== radius && Math.abs(dz) !== radius) continue;
          if (!renderedChunkKeys.has(`${centerChunkX + dx},${centerChunkZ + dz}`)) {
            ringComplete = false;
            break;
          }
        }
      }
      if (!ringComplete) break;
      completeTerrainRadius = radius;
    }
    const localX = (camera?.position?.x || 0) - centerChunkX * 16;
    const localZ = (camera?.position?.z || 0) - centerChunkZ * 16;
    const nearestChunkEdge = Math.min(localX, 16 - localX, localZ, 16 - localZ);
    const safeTerrainFar = Math.max(8, completeTerrainRadius * 16 + nearestChunkEdge - 2);
    return {
      webgl2: Boolean(document.querySelector('#game')?.getContext('webgl2')),
      timeIcon: Boolean(document.querySelector('.time-chip__sun')),
      timeText: document.querySelector('#time-text')?.textContent || '',
      vitality: document.querySelector('[aria-label="Vitality"]')?.getAttribute('aria-valuenow'),
      nourishment: document.querySelector('[aria-label="Nourishment"]')?.getAttribute('aria-valuenow'),
      objective: document.querySelector('#objective-text')?.textContent || '',
      renderer: Boolean(graphics),
      environment: Boolean(window.__worldloomEnvironment),
      summitCrosses: (() => {
        const field = window.__worldloomSummitCrosses;
        const stats = field?.getStats?.() || null;
        return {
          ...stats,
          groupAttached: field?.group?.parent === graphics?.scene,
          twoInstancedMeshes: Boolean(
            field?.meshes?.wood?.isInstancedMesh
            && field?.meshes?.iron?.isInstancedMesh
            && field.group?.children?.length === 2
          ),
          pixelAtlas: Boolean(
            field?.meshes?.wood?.material?.map?.isTexture
            && field.meshes.wood.material.map.magFilter === 1003
            && field.meshes.wood.material.map.minFilter === 1003
            && field.meshes.wood.material.map.generateMipmaps === false
          ),
        };
      })(),
      avatar: Boolean(window.__worldloomPlayerAvatar?.root?.visible),
      avatarParts: (() => {
        let count = 0;
        window.__worldloomPlayerAvatar?.root?.traverse?.((node) => { if (node.userData?.playerAvatarPart) count++; });
        return count;
      })(),
      avatarSelfDrawables: (() => {
        let count = 0;
        window.__worldloomPlayerAvatar?.root?.traverse?.((node) => {
          if (node.isMesh && camera?.layers?.test(node.layers)) count++;
        });
        return count;
      })(),
      avatarShadowCoverage: (() => {
        let casters = 0;
        let shadowVisible = 0;
        const shadowCamera = window.__worldloomEnvironment?.sunLight?.shadow?.camera;
        window.__worldloomPlayerAvatar?.root?.traverse?.((node) => {
          if (!node.isMesh || !node.castShadow) return;
          casters++;
          if (shadowCamera?.layers?.test(node.layers)) shadowVisible++;
        });
        return { casters, shadowVisible };
      })(),
      camera: camera?.position?.toArray() || null,
      cameraForward: forward?.toArray() || null,
      terrain,
      completeTerrainRadius,
      safeTerrainFar,
      fogNear: graphics?.scene?.fog?.near ?? null,
      fogFar: graphics?.scene?.fog?.far ?? null,
      fogClarity: environment?.fogClarity ?? null,
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
  assert.equal(gameState.summitCrosses.ready, true,
    `The Blender summit cross did not load: ${gameState.summitCrosses.error}`);
  assert.equal(gameState.summitCrosses.failed, false);
  assert.match(gameState.summitCrosses.assetUrl, /summit-cross\.glb(?:$|[?#])/i);
  assert.equal(gameState.summitCrosses.groupAttached, true);
  assert.equal(gameState.summitCrosses.twoInstancedMeshes, true,
    'The summit cross exceeded or lost its two-draw instanced render structure');
  assert.equal(gameState.summitCrosses.gptTexture, true);
  assert.equal(gameState.summitCrosses.pixelAtlas, true,
    'The live cross lost its hard nearest-filtered GPT-derived atlas');
  assert(gameState.summitCrosses.crosses > 0 && gameState.summitCrosses.draws === 2,
    `Seed 64 did not render its nearby two-draw summit cross: ${JSON.stringify(gameState.summitCrosses)}`);
  assert.equal(gameState.avatar, true, 'The Wayfarer player avatar is not active');
  assert(gameState.avatarParts >= 25, 'The Wayfarer player avatar lost authored body parts');
  assert.equal(gameState.avatarSelfDrawables, 0,
    'The local avatar body/head still intersects the gameplay/GTAO camera layer');
  assert(gameState.avatarShadowCoverage.casters > 0);
  assert.equal(gameState.avatarShadowCoverage.shadowVisible, gameState.avatarShadowCoverage.casters,
    'The layer fix removed the local avatar from sunlight shadows');
  assert(gameState.terrain.some((mesh) => mesh.visible && mesh.vertices > 0),
    `No visible terrain geometry reached the first playable frame: ${JSON.stringify(gameState.terrain)}`);
  assert(gameState.completeTerrainRadius >= 3,
    `The playable frame opened before its safe seven-by-seven terrain core was ready: ${JSON.stringify(gameState.terrain)}`);
  assert(Number.isFinite(gameState.fogFar) && gameState.fogFar <= gameState.safeTerrainFar + 1.5,
    `Fog exposed unmeshed horizon space (fog ${gameState.fogFar}, safe ${gameState.safeTerrainFar})`);
  assert(Number.isFinite(gameState.fogNear) && gameState.fogNear >= 28,
    `Clear-weather haze still begins too close to the player (${gameState.fogNear}m)`);
  assert(gameState.fogNear < gameState.fogFar,
    `Clear-weather fog has no valid transition band (${gameState.fogNear} -> ${gameState.fogFar})`);
  assert(gameState.fogClarity > 0.8,
    `The open daylight spawn did not select the clear-air fog profile (${gameState.fogClarity})`);

  // Leave the browser idle while the incremental horizon builder runs. The
  // explicit readiness contract avoids a machine-speed timeout masquerading
  // as a graphics regression and proves the published mesh is the requested
  // maximum-distance revision rather than an intermediate terrain shell.
  try {
    await frame.waitForFunction(() => (
      window.__worldloomWorld?.distantTerrain?.ready === true
    ), { timeout: 45_000, polling: 'raf' });
  } catch (error) {
    const diagnostics = await frame.evaluate(() => ({
      world: window.__worldloomWorld?.getStats?.(),
      horizon: window.__worldloomWorld?.distantTerrain?.getStats?.(),
      state: document.querySelector('#hud')?.classList.contains('hidden') ? 'hidden' : 'playing',
      visibility: document.visibilityState,
    }));
    throw new Error(`Distant horizon did not become ready: ${JSON.stringify(diagnostics)}`, {
      cause: error,
    });
  }
  const maxDistanceState = await frame.evaluate(() => {
    const world = window.__worldloomWorld;
    const player = window.__worldloomPlayer;
    const graphics = window.__worldloomGraphics;
    const stats = world?.getStats?.();
    const horizon = world?.distantTerrain;
    const mesh = horizon?.mesh;
    const position = mesh?.geometry?.getAttribute?.('position');
    const normal = mesh?.geometry?.getAttribute?.('normal');
    const color = mesh?.geometry?.getAttribute?.('color');
    const finiteAttribute = (attribute) => {
      if (!attribute?.array?.length) return false;
      for (const value of attribute.array) {
        if (!Number.isFinite(value)) return false;
      }
      return true;
    };
    const safeTerrainFar = world && player
      ? world.getSafeTerrainDistance(player.position)
      : Number.NaN;
    return {
      stats,
      cameraFar: graphics?.camera?.far ?? null,
      fogFar: graphics?.scene?.fog?.far ?? null,
      safeTerrainFar,
      horizon: {
        ready: horizon?.ready === true,
        meshes: horizon?.group?.children?.filter?.((child) => child.isMesh)?.length ?? 0,
        tagged: mesh?.userData?.distantTerrain === true,
        vertices: position?.count || 0,
        triangles: position?.count ? position.count / 3 : 0,
        finiteGeometry: [position, normal, color].every(finiteAttribute),
      },
    };
  });
  assert.equal(maxDistanceState.stats?.visualDistance, 20);
  assert.equal(maxDistanceState.stats?.detailDistance, 8);
  assert.equal(maxDistanceState.stats?.streamDistance, 10);
  assert(maxDistanceState.stats.loaded <= 441,
    `maximum view distance loaded too many full voxel chunks: ${JSON.stringify(maxDistanceState.stats)}`);
  assert.equal(maxDistanceState.horizon.ready, true);
  assert.equal(maxDistanceState.horizon.meshes, 1, 'The distant horizon must remain one merged draw mesh');
  assert.equal(maxDistanceState.horizon.tagged, true, 'The published horizon mesh lost its runtime marker');
  assert.equal(maxDistanceState.horizon.finiteGeometry, true, 'The distant horizon contains invalid geometry data');
  assert(maxDistanceState.horizon.vertices > 0 && maxDistanceState.horizon.triangles > 0,
    `The distant horizon published no visible triangles: ${JSON.stringify(maxDistanceState.horizon)}`);
  assert(Number.isFinite(maxDistanceState.cameraFar) && maxDistanceState.cameraFar >= 400,
    `The camera clips the 20-chunk horizon at ${maxDistanceState.cameraFar}m`);
  assert(maxDistanceState.cameraFar > maxDistanceState.fogFar,
    `Fog extends beyond the camera plane (${maxDistanceState.fogFar} >= ${maxDistanceState.cameraFar})`);
  assert(Number.isFinite(maxDistanceState.safeTerrainFar));
  assert(maxDistanceState.fogFar <= maxDistanceState.safeTerrainFar + 1.5,
    `Fog exposed terrain beyond the live safe horizon (${maxDistanceState.fogFar} > ${maxDistanceState.safeTerrainFar})`);

  const restoredViewSettings = await frame.evaluate(async () => {
    const quality = document.querySelector('#graphics-quality');
    if (quality) {
      quality.value = 'balanced';
      quality.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const { SaveStore } = await import('/worldloom/src/save.js');
    return {
      selectedQuality: quality?.value || '',
      viewDistance: Number(document.querySelector('#view-distance')?.value),
      output: document.querySelector('#view-distance-value')?.textContent?.trim() || '',
      persisted: new SaveStore().loadSettings(),
      world: window.__worldloomWorld?.getStats?.(),
    };
  });
  assert.equal(restoredViewSettings.selectedQuality, 'balanced');
  assert.equal(restoredViewSettings.viewDistance, 4);
  assert.equal(restoredViewSettings.output, '4 chunks');
  assert.equal(restoredViewSettings.persisted.graphicsQuality, 'balanced');
  assert.equal(restoredViewSettings.persisted.viewDistance, 4);
  assert.equal(restoredViewSettings.world.visualDistance, 4,
    'Later browser checks did not return to the balanced streaming footprint');

  const caveLightingState = await frame.evaluate(async () => {
    const THREE = await import('/worldloom/vendor/three.module.min.js');
    const { BLOCK } = await import('/worldloom/src/blocks.js');
    const {
      caveEntranceSkylight,
      directionalSkyAccess,
    } = await import('/worldloom/src/environment.js');
    const { caveLightingDepth, cavePostProcessAmount } = await import('/worldloom/src/graphics.js');
    const { GRAPHICS_PRESETS } = await import('/worldloom/src/save.js');
    const { coverDepthSkylight } = await import('/worldloom/src/mesher.js');
    const environment = window.__worldloomEnvironment;
    const graphics = window.__worldloomGraphics;
    const tunnelWorld = {
      worldHeight: 20,
      getBlock: (x, y) => (x >= 0 && y >= 7 ? BLOCK.STONE : BLOCK.AIR),
      terrainHeight: (x) => (x >= 0 ? 10 : 3),
    };
    const nearMouth = caveEntranceSkylight(tunnelWorld, { x: 0.5, y: 4, z: 0.5 });
    const deepTunnel = caveEntranceSkylight(tunnelWorld, { x: 12.5, y: 4, z: 0.5 });
    const beyondDaylight = caveEntranceSkylight(tunnelWorld, { x: 18.5, y: 4, z: 0.5 });

    environment.applyGraphicsSettings({
      graphicsQuality: 'high',
      weatherEffects: true,
      reducedMotion: false,
    });
    const highShadowType = environment.renderer.shadowMap.type;
    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    const balancedShadowType = environment.renderer.shadowMap.type;
    const forward = new THREE.Vector3();
    graphics.camera.getWorldDirection(forward);
    const centeredSun = graphics.camera.position.clone().addScaledVector(forward, 120);
    graphics.applyProfile(GRAPHICS_PRESETS.high);
    graphics.setEnvironment({
      dayAmount: 1,
      rainAmount: 0,
      caveAmount: 0,
      skyExposure: 1,
      sunVisibility: 1,
      sunWorldPosition: centeredSun,
    });
    graphics.render(1 / 60);
    const highGodRays = graphics.getDiagnostics();
    const passOrder = graphics.composer.passes.map((pass) => pass.name || pass.constructor.name);
    const depthIdentity = graphics.volumetricSunPass?.depthTexture === graphics.gtaoPass?.depthTexture;
    graphics.applyProfile(GRAPHICS_PRESETS.balanced);
    return {
      nearMouth,
      deepTunnel,
      beyondDaylight,
      mouthFace: coverDepthSkylight(1),
      deepFace: coverDepthSkylight(28),
      shallowGrade: cavePostProcessAmount(0.18, 0),
      deepGrade: cavePostProcessAmount(0.9, 0),
      twelveBlockGrade: cavePostProcessAmount(caveLightingDepth(40, 28.5), 0),
      twentyEightBlockGrade: cavePostProcessAmount(caveLightingDepth(40, 13), 0),
      lowDeepDirect: directionalSkyAccess(false, 0),
      highShadowType,
      balancedShadowType,
      pcfSoftShadowType: THREE.PCFSoftShadowMap,
      pcfShadowType: THREE.PCFShadowMap,
      highGodRays,
      passOrder,
      depthIdentity,
    };
  });
  assert(caveLightingState.nearMouth > 0.72,
    `Built cave-mouth skylight is too weak: ${caveLightingState.nearMouth}`);
  assert(caveLightingState.deepTunnel > 0 && caveLightingState.deepTunnel < 0.09,
    `Built cave daylight did not attenuate naturally: ${caveLightingState.deepTunnel}`);
  assert.equal(caveLightingState.beyondDaylight, 0,
    'Built cave skylight continued beyond its natural-light range');
  assert(caveLightingState.mouthFace > caveLightingState.deepFace * 8,
    'Baked cave-face lighting lost its mouth-to-depth contrast');
  assert(caveLightingState.shallowGrade < 0.12 && caveLightingState.deepGrade > 0.95,
    'The live cinematic pipeline no longer distinguishes shallow and deep caves');
  assert(caveLightingState.twelveBlockGrade < 0.5 && caveLightingState.twentyEightBlockGrade > 0.99,
    'The production cave grade no longer follows the twenty-eight-block light range');
  assert.equal(caveLightingState.lowDeepDirect, 0,
    'Low graphics mode can leak unshadowed sunlight into a deep cave');
  assert.equal(caveLightingState.highShadowType, caveLightingState.pcfSoftShadowType,
    'High graphics mode did not enable soft PCF shadows');
  assert.equal(caveLightingState.balancedShadowType, caveLightingState.pcfShadowType,
    'Balanced graphics mode no longer uses its lower-cost shadow filter');
  assert.equal(caveLightingState.highGodRays.volumetricSun, true,
    'High graphics mode did not enable volumetric sunlight');
  assert.equal(caveLightingState.highGodRays.volumetricSunState.active, true,
    'A visible clear-sky sun did not activate the shaft pass');
  assert.equal(caveLightingState.highGodRays.volumetricSunState.depthBound, true,
    'The shaft pass is not bound to the live scene depth texture');
  assert(caveLightingState.highGodRays.volumetricSunState.resolutionScale < 0.6,
    'Volumetric sunlight lost its reduced-resolution performance guard');
  assert.equal(caveLightingState.depthIdentity, true,
    'Volumetric sunlight duplicated or lost GTAO depth instead of reusing it');
  const gtaoIndex = caveLightingState.passOrder.indexOf('GTAOPass');
  const shaftsIndex = caveLightingState.passOrder.indexOf('WorldloomVolumetricSunPass');
  const bloomIndex = caveLightingState.passOrder.indexOf('UnrealBloomPass');
  assert(gtaoIndex >= 0 && shaftsIndex > gtaoIndex && bloomIndex > shaftsIndex,
    `Volumetric pass order is invalid: ${caveLightingState.passOrder.join(' -> ')}`);

  await frame.waitForFunction(() => {
    const stats = window.__worldloomPonds?.getStats?.();
    return stats?.ready && !stats.failed && stats.pads > 0;
  }, { timeout: 10_000 });
  const pondState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    const ponds = window.__worldloomPonds;
    const focus = environment.atmosphere.position.clone();
    const clearContext = { rainIntensity: 0, dayAmount: 1, skyExposure: 1 };
    const matrixPositions = (mesh) => {
      const positions = [];
      const values = mesh?.instanceMatrix?.array;
      for (let index = 0; values && index < mesh.count; index++) {
        const offset = index * 16;
        positions.push([values[offset + 12], values[offset + 13], values[offset + 14]]);
      }
      return positions;
    };
    const maximumDrift = (before, after) => before.reduce((maximum, point, index) => {
      const next = after[index] || [Number.POSITIVE_INFINITY, 0, 0];
      return Math.max(maximum, Math.hypot(
        point[0] - next[0],
        point[1] - next[1],
        point[2] - next[2],
      ));
    }, before.length === after.length ? 0 : Number.POSITIVE_INFINITY);

    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    ponds.update(0, focus, clearContext);
    const initial = ponds.getStats();
    const canonicalBefore = ponds.padAnchors.map(({ x, y, z }) => [x, y, z]);
    const matricesBefore = matrixPositions(ponds.padMesh);
    const nearbyPonds = ponds.world?.getPondsNear?.(focus.x, focus.z, 48) || [];
    const nearestPadDistance = ponds.padAnchors.reduce((distance, anchor) => Math.min(
      distance,
      Math.hypot(anchor.x - focus.x, anchor.z - focus.z),
    ), Number.POSITIVE_INFINITY);

    // Simulate a short player movement without advancing animation time. The
    // ecology may cull against this focus, but its canonical world coordinates
    // and rendered instance translations must never inherit that movement.
    ponds._syncTimer = 1;
    const shiftedFocus = focus.clone();
    shiftedFocus.x += 3.25;
    shiftedFocus.z -= 2.5;
    ponds.update(0, shiftedFocus, clearContext);
    const canonicalAfter = ponds.padAnchors.map(({ x, y, z }) => [x, y, z]);
    const matricesAfter = matrixPositions(ponds.padMesh);

    environment.applyGraphicsSettings({
      graphicsQuality: 'low',
      weatherEffects: true,
      reducedMotion: false,
    });
    ponds.update(0, focus, clearContext);
    const lowQuality = ponds.getStats();

    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    ponds.update(0, focus, clearContext);
    const restoredClear = ponds.getStats();
    ponds.update(0, focus, { rainIntensity: 1, dayAmount: 1, skyExposure: 1 });
    const heavyRain = ponds.getStats();
    ponds.update(0, focus, clearContext);

    return {
      asset: {
        ready: ponds.ready,
        failed: ponds.failed,
        error: ponds.error ? String(ponds.error.message || ponds.error) : '',
        url: initial.assetUrl,
        meshesReady: Boolean(
          ponds.padMesh?.isInstancedMesh
          && ponds.padMesh.geometry?.getAttribute?.('uv')
          && ponds.mistMesh?.isInstancedMesh
          && ponds.mistMesh.geometry
          && ponds.flyMesh?.isPoints
          && ponds.flyMesh.geometry,
        ),
        atlasReady: Boolean(
          ponds.padMesh?.material?.map?.isTexture
          && ponds.padMesh.material.map.magFilter === 1003
          && ponds.padMesh.material.map.minFilter === 1003
          && ponds.padMesh.material.map.generateMipmaps === false
          && ponds.padMesh.material.alphaTest >= 0.5,
        ),
        flyDotsReady: Boolean(
          ponds.flyMesh?.isPoints
          && ponds.flyMesh.material?.isPointsMaterial
          && ponds.flyMesh.userData?.representation === 'unlit-points'
          && ponds.flyMesh.userData?.activePointCount > 0,
        ),
        groupAttached: ponds.group?.parent === environment.scene,
      },
      initial,
      nearbyPondCount: nearbyPonds.length,
      nearestPadDistance,
      anchoring: {
        canonicalCount: canonicalBefore.length,
        canonicalDrift: maximumDrift(canonicalBefore, canonicalAfter),
        matrixDrift: maximumDrift(matricesBefore, matricesAfter),
      },
      lowQuality,
      restoredClear,
      heavyRain,
    };
  });
  assert.equal(pondState.asset.ready, true, 'The Blender pond-detail asset did not finish loading');
  assert.equal(pondState.asset.failed, false, `The Blender pond-detail asset failed: ${pondState.asset.error}`);
  assert.match(pondState.asset.url, /pond-details\.glb(?:$|[?#])/i);
  assert.equal(pondState.asset.meshesReady, true,
    'Pond detail GLB did not produce its instanced lily/mist and point-fly render set');
  assert.equal(pondState.asset.atlasReady, true,
    'The live lily mesh did not preserve its hard nearest-filtered pixel atlas');
  assert.equal(pondState.asset.flyDotsReady, true,
    'The live pond flies are not using the one-draw procedural black-dot representation');
  assert.equal(pondState.asset.groupAttached, true, 'Pond ecology is detached from the live scene');
  assert(pondState.nearbyPondCount > 0, 'The spawned player has no generated pond within the balanced detail radius');
  assert(pondState.initial.pads > 0, 'No visible lily pads were instanced near the spawned player');
  assert(pondState.initial.mist > 0, 'Clear balanced weather has no visible low pond mist');
  assert(pondState.initial.flySwarms > 0, 'Clear daytime balanced weather has no visible pond flies');
  assert(pondState.nearestPadDistance <= 48,
    `The nearest visible lily pad is outside the balanced detail radius: ${pondState.nearestPadDistance}`);
  assert(pondState.initial.draws > 0 && pondState.initial.draws <= 3,
    `Pond ecology exceeded its three-draw budget: ${JSON.stringify(pondState.initial)}`);
  assert(pondState.initial.triangles > 0 && pondState.initial.triangles <= 15_000,
    `Pond ecology exceeded its balanced triangle budget: ${JSON.stringify(pondState.initial)}`);
  assert(pondState.anchoring.canonicalCount > 0);
  assert(pondState.anchoring.canonicalDrift <= 1e-6,
    `Pond anchors followed simulated player movement by ${pondState.anchoring.canonicalDrift}`);
  assert(pondState.anchoring.matrixDrift <= 1e-5,
    `Rendered pond instances followed simulated player movement by ${pondState.anchoring.matrixDrift}`);
  assert(pondState.lowQuality.pads > 0, 'Low quality incorrectly removes the core lily-pad detail');
  assert.equal(pondState.lowQuality.mist, 0, 'Low quality still renders pond mist');
  assert.equal(pondState.lowQuality.flySwarms, 0, 'Low quality still renders animated pond flies');
  assert(pondState.lowQuality.draws <= 1, 'Low quality uses more than the single lily-pad draw');
  assert(pondState.restoredClear.mist > 0 && pondState.restoredClear.flySwarms > 0,
    'Balanced pond ambience did not recover after leaving Low quality');
  assert.equal(pondState.heavyRain.mist, 0, 'Heavy rain did not hide low pond mist');
  assert.equal(pondState.heavyRain.flySwarms, 0, 'Heavy rain did not hide pond flies');
  assert(pondState.heavyRain.pads > 0, 'Heavy rain incorrectly removes solid lily pads');
  assert(pondState.heavyRain.draws <= 1, 'Hidden rain ambience still consumes pond draw calls');

  await frame.waitForFunction(() => {
    const stats = window.__worldloomHangingLeaves?.getStats?.();
    return stats?.ready && !stats.failed && stats.segments > 0;
  }, { timeout: 10_000 });
  const hangingLeafState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    const leaves = window.__worldloomHangingLeaves;
    const focus = environment.atmosphere.position.clone();
    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    leaves._syncTimer = 0;
    leaves.update(0, focus, { playerVelocity: focus.clone().set(0, 0, 0) });
    const initial = leaves.getStats();
    const strand = leaves.strands[0];
    const anchorBefore = strand.anchor.clone();
    const tipBefore = strand.points.at(-1).clone();
    const player = tipBefore.clone();
    player.x -= 0.12;
    player.y -= 0.45;
    const velocity = player.clone().set(4.5, 0, 0);
    let interactions = 0;
    for (let frameIndex = 0; frameIndex < 12; frameIndex++) {
      leaves.update(1 / 60, player, { playerVelocity: velocity });
      interactions = Math.max(interactions, leaves.getStats().interactions);
    }
    const tipAfter = leaves.strands.find((entry) => entry.key === strand.key)?.points.at(-1);
    const anchorAfter = leaves.strands.find((entry) => entry.key === strand.key)?.anchor;
    const finiteMatrices = [...leaves.mesh.instanceMatrix.array].every(Number.isFinite);

    environment.applyGraphicsSettings({
      graphicsQuality: 'low',
      weatherEffects: true,
      reducedMotion: false,
    });
    leaves._syncTimer = 0;
    leaves.update(0, focus, { playerVelocity: velocity.set(0, 0, 0) });
    const low = leaves.getStats();
    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    leaves._syncTimer = 0;
    leaves.update(0, focus, { playerVelocity: velocity });

    return {
      initial,
      low,
      ready: leaves.ready,
      failed: leaves.failed,
      error: leaves.error ? String(leaves.error.message || leaves.error) : '',
      assetUrl: leaves.assetUrl,
      oneMesh: leaves.group.children.length === 1 && leaves.mesh?.isInstancedMesh,
      pixelAtlas: Boolean(
        leaves.mesh?.material?.map?.isTexture
        && leaves.mesh.material.map.magFilter === 1003
        && leaves.mesh.material.map.minFilter === 1003
        && leaves.mesh.material.map.generateMipmaps === false
      ),
      drawBudget: leaves.mesh?.userData?.drawBudget,
      interactions,
      tipDisplacement: tipAfter ? Math.hypot(tipAfter.x - tipBefore.x, tipAfter.z - tipBefore.z) : 0,
      anchorDrift: anchorAfter ? anchorAfter.distanceTo(anchorBefore) : Number.POSITIVE_INFINITY,
      finiteMatrices,
    };
  });
  assert.equal(hangingLeafState.ready, true, 'Blender hanging leaves did not finish loading');
  assert.equal(hangingLeafState.failed, false, `Blender hanging leaves failed: ${hangingLeafState.error}`);
  assert.match(hangingLeafState.assetUrl, /hanging-tree-leaves\.glb(?:$|[?#])/i);
  assert.equal(hangingLeafState.oneMesh, true, 'hanging foliage exceeded its one-mesh render design');
  assert.equal(hangingLeafState.pixelAtlas, true, 'hanging foliage lost its nearest-filtered GPT-image atlas');
  assert.equal(hangingLeafState.drawBudget, 1);
  assert(hangingLeafState.initial.trees > 0 && hangingLeafState.initial.strands > 0,
    `seed 64 produced no selected hanging-leaf trees: ${JSON.stringify(hangingLeafState.initial)}`);
  assert(hangingLeafState.initial.segments > 0 && hangingLeafState.initial.segments <= 240,
    `balanced hanging foliage exceeded its segment cap: ${JSON.stringify(hangingLeafState.initial)}`);
  assert.equal(hangingLeafState.initial.draws, 1);
  assert(hangingLeafState.interactions > 0, 'walking into hanging leaves did not reach their spring physics');
  assert(hangingLeafState.tipDisplacement > 0.025,
    `player contact did not visibly bend the foliage (${hangingLeafState.tipDisplacement})`);
  assert(hangingLeafState.anchorDrift <= 1e-6,
    `tree attachment followed the simulated player by ${hangingLeafState.anchorDrift}`);
  assert.equal(hangingLeafState.finiteMatrices, true, 'leaf physics produced a non-finite GPU transform');
  assert(hangingLeafState.low.segments <= 40,
    `Low graphics exceeded its 40-segment hanging-leaf cap: ${JSON.stringify(hangingLeafState.low)}`);
  assert(hangingLeafState.low.draws <= 1, 'Low graphics used more than one hanging-leaf draw');

  await frame.waitForFunction(() => {
    const stats = window.__worldloomBirds?.getStats?.();
    return stats?.ready && !stats.failed && stats.templateRoots?.length === 2;
  }, { timeout: 10_000 });
  const birdState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    const birds = window.__worldloomBirds;
    const focus = environment.atmosphere.position.clone();
    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    const anchors = birds.debugSyncAnchors(focus);
    const ash = birds.debugSpawn({ habitat: 'tree', breed: 'ash_sparrow' });
    const azure = birds.debugSpawn({ habitat: 'pond', breed: 'pond_azurefin', airborne: true });
    const beforeAnimation = [];
    ash?.model?.traverse?.((node) => {
      beforeAnimation.push([
        node.name,
        ...node.position.toArray(),
        ...node.quaternion.toArray(),
        ...node.scale.toArray(),
      ]);
    });
    ash?.animator?.update?.(0.16, 0);
    let animationDelta = 0;
    let transformIndex = 0;
    ash?.model?.traverse?.((node) => {
      const before = beforeAnimation[transformIndex++] || [];
      const after = [
        node.name,
        ...node.position.toArray(),
        ...node.quaternion.toArray(),
        ...node.scale.toArray(),
      ];
      for (let index = 1; index < after.length; index++) {
        animationDelta = Math.max(animationDelta, Math.abs(Number(after[index]) - Number(before[index])));
      }
    });
    const materials = [];
    for (const bird of [ash, azure]) {
      bird?.model?.traverse?.((node) => {
        if (!node.isMesh) return;
        const entries = Array.isArray(node.material) ? node.material : [node.material];
        materials.push(...entries.filter(Boolean));
      });
    }
    const partSetComplete = [ash, azure].every((bird) => bird && [
      bird.parts.body,
      bird.parts.head,
      bird.parts.leftWing,
      bird.parts.rightWing,
      bird.parts.tail,
      bird.parts.leftLeg,
      bird.parts.rightLeg,
    ].every(Boolean));
    const clipNames = [...birds.templates.values()]
      .flatMap((template) => template.clips.map((clip) => clip.name))
      .sort();
    const initial = birds.getStats();
    const ashStart = ash ? { habitat: ash.anchor?.habitat, state: ash.state } : null;
    const azureStart = azure ? { habitat: azure.route?.destination?.habitat, state: azure.state } : null;
    const startledBefore = initial.startled;
    if (ash) {
      birds._anchorTimer = 60;
      birds.update(1 / 60, ash.root.position.clone(), {
        active: true,
        submerged: false,
        dayAmount: 1,
        rainIntensity: 0,
        skyExposure: 1,
        playerForward: focus.clone().set(0, 0, -1),
      });
    }
    const startled = birds.getStats();
    environment.applyGraphicsSettings({
      graphicsQuality: 'low',
      weatherEffects: true,
      reducedMotion: false,
    });
    const low = birds.getStats();
    environment.applyGraphicsSettings({
      graphicsQuality: 'balanced',
      weatherEffects: true,
      reducedMotion: false,
    });
    return {
      ready: birds.ready,
      failed: birds.failed,
      error: birds.error ? String(birds.error.message || birds.error) : '',
      groupAttached: birds.group?.parent === environment.scene,
      anchors,
      initial,
      low,
      clipNames,
      partSetComplete,
      animationDelta,
      pixelAtlas: materials.length > 0 && materials.every((material) => (
        material.map?.isTexture
        && material.map.magFilter === 1003
        && material.map.minFilter === 1004
        && material.map.generateMipmaps === true
        && material.alphaTest >= 0.35
      )),
      ashStart,
      azureStart,
      startledDelta: startled.startled - startledBefore,
      startledAshState: ash?.state || '',
      finiteTransforms: [ash, azure].filter(Boolean).every((bird) => {
        let finite = true;
        bird.root.traverse((node) => {
          finite &&= [...node.position.toArray(), ...node.quaternion.toArray(), ...node.scale.toArray()].every(Number.isFinite);
        });
        return finite;
      }),
    };
  });
  assert.equal(birdState.ready, true, 'The production Blender bird pack did not finish loading');
  assert.equal(birdState.failed, false, `The production bird pack failed: ${birdState.error}`);
  assert.equal(birdState.groupAttached, true, 'Ambient birds are detached from the live scene');
  assert(birdState.anchors.trees > 0, `seed 64 produced no valid bird tree perches: ${JSON.stringify(birdState)}`);
  assert(birdState.anchors.ponds > 0, `seed 64 produced no valid dry pond-bank landing: ${JSON.stringify(birdState)}`);
  assert.equal(birdState.initial.count, 2, 'The deterministic bird fixture could not render both breeds');
  assert.equal(birdState.initial.breeds.ash_sparrow, 1);
  assert.equal(birdState.initial.breeds.pond_azurefin, 1);
  assert.equal(birdState.initial.residentPondAnchors, 1,
    'Seed 64 no longer assigns birds to exactly half of its two nearby ponds');
  assert.equal(birdState.ashStart?.habitat, 'tree', 'The Ash Sparrow did not begin on a real tree perch');
  assert.equal(birdState.azureStart?.habitat, 'pond', 'The Pond Azurefin did not fly toward a real pond bank');
  assert.equal(birdState.azureStart?.state, 'cruise', 'The airborne debug bird did not enter authored cruise flight');
  assert.equal(birdState.partSetComplete, true, 'A live bird is missing an articulated body part');
  assert.equal(birdState.pixelAtlas, true, 'Live birds lost their hard nearest-filtered GPT-derived atlas');
  assert.equal(birdState.clipNames.length, 12, 'The live bird pack did not expose all twelve Blender clips');
  for (const clip of ['Perch_Idle_Loop', 'Flight_Loop', 'Takeoff', 'Landing', 'Pond_Peck_Loop', 'Ground_Idle_Loop']) {
    assert(birdState.clipNames.some((name) => name.endsWith(clip)), `Live birds are missing ${clip}`);
  }
  assert(birdState.animationDelta > 1e-5,
    `The loaded bird animation did not move its articulated model (${birdState.animationDelta})`);
  assert.equal(birdState.finiteTransforms, true, 'Bird animation produced a non-finite transform');
  assert.equal(birdState.startledDelta, 1, 'Walking close did not startle exactly the perched bird');
  assert.equal(birdState.startledAshState, 'takeoff', 'The startled tree bird did not immediately fly away');
  assert(birdState.initial.draws <= 14 && birdState.initial.triangles <= 700,
    `Balanced birds exceeded their render budget: ${JSON.stringify(birdState.initial)}`);
  assert(birdState.low.count <= 1 && birdState.low.shadowBirds === 0,
    `Low graphics did not enforce its bird budget: ${JSON.stringify(birdState.low)}`);

  const clearState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    const focus = environment.atmosphere.position.clone();
    environment.time = 0.5;
    environment.weatherPhase = 'clear';
    environment.weatherTimer = 60;
    environment.rainTarget = 0;
    environment.rainIntensity = 0;
    environment.overcastAmount = 0;
    environment.cloudCover = 0.72;
    environment.cloudCoverTarget = 0.72;
    environment.localCloudCoverage = 0.72;
    environment.localCloudCount = 5;
    environment.update(0.25, focus, 4);
    return {
      overcast: environment.overcastAmount,
      rain: environment.rainIntensity,
      sunOpacity: environment.sun.material.opacity,
      sunVisibility: environment.atmosphere.material.uniforms.sunVisibility.value,
      sunlight: environment.sunLight.intensity,
      sky: environment.scene.background.toArray(),
      exposure: environment.renderer?.toneMappingExposure,
    };
  });
  assert.equal(clearState.overcast, 0, 'Ordinary clouds incorrectly greyed clear weather');
  assert.equal(clearState.rain, 0);
  assert.equal(clearState.sunOpacity, 1, 'The clear-weather sun disc is not fully visible');
  assert.equal(clearState.sunVisibility, 1, 'The clear-weather atmosphere still masks the sun');
  assert(clearState.sunlight > 2.5, `Clear daytime direct light is too dim: ${clearState.sunlight}`);
  assert(clearState.sky[2] > clearState.sky[0] && clearState.sky[2] > 0.65,
    `Clear daytime sky is not strongly blue: ${JSON.stringify(clearState.sky)}`);

  if (screenshotPath) {
    await frame.evaluate(async () => {
      const { GRAPHICS_PRESETS } = await import('/worldloom/src/save.js');
      const graphics = window.__worldloomGraphics;
      const ponds = window.__worldloomPonds;
      const hangingLeaves = window.__worldloomHangingLeaves;
      const focus = window.__worldloomEnvironment.atmosphere.position;
      const ashStrands = hangingLeaves?.strands?.filter((strand) => !strand.isPine) || [];
      const visibleStrands = ashStrands.length ? ashStrands : hangingLeaves?.strands || [];
      const nearestStrand = visibleStrands.reduce((nearest, strand) => (
        !nearest
          || Math.hypot(strand.anchor.x - focus.x, strand.anchor.z - focus.z)
            < Math.hypot(nearest.anchor.x - focus.x, nearest.anchor.z - focus.z)
          ? strand
          : nearest
      ), null);
      const nearestPond = ponds.mistAnchors.reduce((nearest, anchor) => (
        !nearest
          || Math.hypot(anchor.x - focus.x, anchor.z - focus.z)
            < Math.hypot(nearest.x - focus.x, nearest.z - focus.z)
          ? anchor
          : nearest
      ), null);
      const target = nearestStrand
        ? nearestStrand.anchor.clone().lerp(nearestStrand.points.at(-1), 0.72)
        : nearestPond;
      if (!graphics?.camera || !target) throw new Error('No deterministic pond view is available');

      const world = hangingLeaves?.world || ponds.world;
      const cameraDistance = nearestStrand ? 4.6 : 9;
      const cameraHeight = nearestStrand ? 0.7 : 6.5;

      const candidates = Array.from({ length: 12 }, (_, index) => {
        const angle = index * Math.PI * 2 / 12;
        const position = {
          x: target.x + Math.cos(angle) * cameraDistance,
          y: target.y + cameraHeight,
          z: target.z + Math.sin(angle) * cameraDistance,
        };
        let obstructions = 0;
        for (let step = 0; step <= 14; step++) {
          const blend = step / 18;
          const x = position.x + (target.x - position.x) * blend;
          const y = position.y + (target.y + 0.2 - position.y) * blend;
          const z = position.z + (target.z - position.z) * blend;
          if (world.getBlock(Math.floor(x), Math.floor(y), Math.floor(z)) !== 0) {
            obstructions += step < 3 ? 10 : 1;
          }
        }
        return { position, obstructions, index };
      }).sort((a, b) => a.obstructions - b.obstructions || a.index - b.index);

      const camera = graphics.camera;
      const original = {
        position: camera.position.toArray(),
        quaternion: camera.quaternion.toArray(),
        setPosition: camera.position.set,
        setRotation: camera.quaternion.setFromEuler,
        setEnvironment: graphics.setEnvironment,
        profile: graphics.profile,
      };
      camera.position.set(
        candidates[0].position.x,
        candidates[0].position.y,
        candidates[0].position.z,
      );
      camera.lookAt(target.x, target.y + (nearestStrand ? -0.2 : 0.2), target.z);
      camera.updateMatrixWorld(true);
      const forward = target.clone().sub(camera.position).normalize();
      graphics.applyProfile(GRAPHICS_PRESETS.high);
      graphics.setEnvironment({
        dayAmount: 1,
        rainAmount: 0,
        caveAmount: 0,
        skyExposure: 1,
        sunVisibility: 1,
        sunWorldPosition: camera.position.clone().addScaledVector(forward, 120),
      });
      camera.position.set = function holdPondView() { return this; };
      camera.quaternion.setFromEuler = function holdPondView() { return this; };
      graphics.setEnvironment = function holdClearSunlight() {};
      window.__worldloomSmokeCameraRestore = original;
      graphics.render(0);
    });
    try {
      await delay(120);
      await page.screenshot({ path: screenshotPath, fullPage: false });
    } finally {
      await frame.evaluate(() => {
        const camera = window.__worldloomGraphics?.camera;
        const original = window.__worldloomSmokeCameraRestore;
        if (!camera || !original) return;
        camera.position.set = original.setPosition;
        camera.quaternion.setFromEuler = original.setRotation;
        window.__worldloomGraphics.setEnvironment = original.setEnvironment;
        window.__worldloomGraphics.applyProfile(original.profile);
        camera.position.fromArray(original.position);
        camera.quaternion.fromArray(original.quaternion);
        delete window.__worldloomSmokeCameraRestore;
      });
    }
  }

  const stormState = await frame.evaluate(() => {
    const environment = window.__worldloomEnvironment;
    environment.lightning.timer = 0;
    // The strike system correctly refuses unloaded terrain. Use the live
    // atmosphere/player focus instead of assuming every generated seed spawns
    // inside the origin chunk.
    const focus = environment.atmosphere.position.clone();
    const strike = environment.lightning.update(0.1, focus, 0.9, 0.9, 0.9);
    const boltVertices = environment.lightning.geometry.getAttribute('position')?.count || 0;
    environment.time = 0.5;
    environment.weatherPhase = 'clearing';
    environment.weatherTimer = 60;
    environment.rainTarget = 0;
    environment.rainIntensity = 0.8;
    environment.cloudCover = 1;
    environment.cloudCoverTarget = 1;
    environment.localCloudCoverage = 1;
    environment.localCloudCount = 3;
    environment.overcastAmount = 1;
    environment.update(0.25, focus, 4);
    const clearing = {
      rain: environment.rainIntensity,
      overcast: environment.overcastAmount,
      sunOpacity: environment.sun.material.opacity,
      sunVisibility: environment.atmosphere.material.uniforms.sunVisibility.value,
      sunlight: environment.sunLight.intensity,
    };
    environment.rainTarget = 1;
    environment.rainIntensity = 0.9;
    environment.weatherPhase = 'rain';
    environment.overcastAmount = 0;
    environment.cloudCover = 0;
    environment.localCloudCoverage = 0;
    environment.localCloudCount = 0;
    environment._updateWeather(0.1);
    return {
      strike: Boolean(strike),
      boltVertices,
      clearing,
      cloudlessRain: environment.rainIntensity,
    };
  });
  assert.equal(stormState.strike, true, 'Procedural lightning did not produce a strike');
  assert(stormState.boltVertices >= 32, 'Lightning bolt did not contain a full branching path');
  assert(stormState.clearing.rain > 0 && stormState.clearing.rain < 0.8,
    'Rain did not fade progressively during clearing');
  assert.equal(stormState.clearing.overcast, 1, 'The storm deck dispersed before rain finished');
  assert.equal(stormState.clearing.sunOpacity, 0, 'The sun disc remained visible through overcast rain');
  assert.equal(stormState.clearing.sunVisibility, 0, 'The atmosphere shader still drew a sun through overcast rain');
  assert(stormState.clearing.sunlight < 0.12, 'Direct sunlight remained too strong beneath overcast rain');
  assert.equal(stormState.cloudlessRain, 0, 'Rain continued without local clouds');

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
  assert.equal(closedState.focus, 'btn-deploy-main');
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
    caveLightingState,
    pondState,
    hangingLeafState,
    birdState,
    clearState,
    stormState,
    deployPresentation,
    mainMenuPresentation,
    settingsPresentation,
    maximumViewSettings,
    maxDistanceState,
    restoredViewSettings,
    hudPresentation,
    mobileInventory,
    closeDuration,
    resilience: 'audio and storage failures recovered',
    inventoryDrag: 'multiple block stacks move between slots and persist as visible loose world items',
    exactResume: 'safe fractional X/Z position restored without snapping',
    webglRecovery: 'portal exposed retry and return actions',
  }, null, 2));
} catch (error) {
  if (pageErrors.length) {
    console.error(`Browser errors captured before failure:\n${pageErrors.join('\n\n')}`);
  }
  throw error;
} finally {
  await browser.close();
}
