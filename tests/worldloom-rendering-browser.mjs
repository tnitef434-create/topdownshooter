import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

// A cold High-quality boot used to compile terrain in the water prepass with
// deprecated PCFSoft samplers. The first shadow update changed filter type,
// leaving invisible/sky-blue terrain despite a valid procedural texture atlas.
const base = process.env.WORLDLOOM_TEST_URL || 'http://127.0.0.1:4187/';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (/WebGLProgram|Shader Error|GL_INVALID|PCFSoftShadowMap has been deprecated/.test(message.text())) errors.push(message.text());
});
const completeFrames = () => page.evaluate(() => new Promise(resolve => {
  let frames = 0;
  function next() { if (++frames >= 4) resolve(); else requestAnimationFrame(next); }
  requestAnimationFrame(next);
}));
const readTerrain = () => page.evaluate(() => {
  const pipeline = window.__worldloomGraphics;
  pipeline.render(0);
  const gl = pipeline.renderer.getContext();
  const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let green = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 1] > 25 && pixels[i + 1] > pixels[i] * 1.14 && pixels[i + 1] > pixels[i + 2] * 1.2) green++;
  }
  return {
    greenFraction: green / (pixels.length / 4),
    shadowType: pipeline.renderer.shadowMap.type,
    shadowRadius: window.__worldloomEnvironment.sunLight.shadow.radius,
    captureRenders: window.__worldloomEnvironment.waterCapture.renders,
  };
});

try {
  await page.setViewport({ width: 900, height: 600, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('worldloom.settings.v1', JSON.stringify({
    viewDistance: 2, graphicsQuality: 'high', renderScale: 1, volume: 0, musicEnabled: false, weatherEffects: false,
  })));
  await page.goto(new URL('worldloom/', base).href, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#loading-screen')?.classList.contains('hidden'), { timeout: 90000 });
  await page.type('#seed-input', '64');
  await page.click('#new-world-button');
  await page.waitForFunction(() => window.__worldloomPlayer && document.querySelector('#loading-screen').classList.contains('hidden'), { timeout: 180000 });
  await completeFrames();
  const coldBoot = await readTerrain();
  assert(coldBoot.captureRenders > 0, 'Regression must exercise the water capture before the beauty pass');
  assert(coldBoot.greenFraction > .18, `Cold High boot lost textured green terrain: ${JSON.stringify(coldBoot)}`);
  if (process.env.WORLDLOOM_SCREENSHOT) await page.screenshot({ path: process.env.WORLDLOOM_SCREENSHOT });
  console.log('Cold High boot retains terrain color through water capture and the full postprocessing pipeline.');

  for (const quality of ['low', 'balanced', 'ultra', 'high']) {
    const immediate = await page.evaluate(async quality => {
      const { GRAPHICS_PRESETS } = await import('/worldloom/src/save.js');
      const THREE = await import('/worldloom/vendor/three.module.min.js');
      window.__worldloomEnvironment.applyGraphicsSettings({ graphicsQuality: quality, weatherEffects: false });
      window.__worldloomGraphics.applyProfile(GRAPHICS_PRESETS[quality]);
      return { actual: window.__worldloomGraphics.renderer.shadowMap.type, supported: THREE.PCFShadowMap };
    }, quality);
    assert.equal(immediate.actual, immediate.supported, `${quality} must select a supported shadow sampler before any capture`);
    await completeFrames();
    const state = await readTerrain();
    assert.equal(state.shadowType, immediate.actual, `${quality} changed shadow sampler type during rendering`);
    assert(state.greenFraction > .18, `${quality} lost terrain after a graphics switch: ${JSON.stringify(state)}`);
    if (quality === 'high' || quality === 'ultra') assert(state.shadowRadius > 1, `${quality} lost soft shadow edges`);
    console.log(`${quality}: rendered green terrain ${(state.greenFraction * 100).toFixed(1)}%, stable shadow filter.`);
  }
  assert.deepEqual(errors, [], 'No shader errors or shadow-filter fallbacks are allowed');
} finally {
  await browser.close();
}
