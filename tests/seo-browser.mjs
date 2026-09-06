import assert from 'node:assert/strict';
import express from 'express';
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Exercise the built files without Vite or production account state. Search
// metadata is checked in raw HTML; useful landing copy must also work with JS off.
const siteRoot = resolve(process.env.SEO_TEST_ROOT || 'dist');
const runDir = resolve('work', `seo-browser-${Date.now()}`);
const outputDir = resolve(process.env.SEO_SCREENSHOT_DIR || '../../outputs');
await Promise.all([mkdir(runDir, { recursive: true }), mkdir(outputDir, { recursive: true })]);
const app = express(); app.use(express.static(siteRoot));
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const canonicalOrigin = 'https://unpaused.online';
const indexPaths = ['/', '/worldloom/', '/tacticstrike/', '/games/worldloom/', '/games/tacticstrike/', '/privacy/'];
const landingPaths = ['/', '/games/worldloom/', '/games/tacticstrike/'];
const errors = [], missing = [], results = [], links = new Set();
let browser;
async function fetchLocal(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `Local URL must exist: ${path}`);
  return response;
}
async function pageFor(javascript) {
  const page = await browser.newPage();
  page.setDefaultTimeout(30_000);
  await page.setJavaScriptEnabled(javascript);
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (/\/api\/auth\/status(?:\?|$)/.test(url)) return request.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ available: false, googleClientId: null }) });
    if (/^https?:/.test(url) && !url.startsWith(base)) return request.abort();
    return request.continue();
  });
  return page;
}
try {
  const robots = await (await fetchLocal('/robots.txt')).text();
  assert.match(robots, /Sitemap:\s*https:\/\/unpaused\.online\/sitemap\.xml/i);
  assert(!/User-agent:\s*\*\s+Disallow:\s*\/\s*(?:$|\n)/i.test(robots), 'robots must not block the whole site');
  const sitemap = await (await fetchLocal('/sitemap.xml')).text();
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert(sitemapUrls.length >= 5);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'No duplicate sitemap URLs');
  for (const path of indexPaths) assert(sitemapUrls.includes(canonicalOrigin + path), `Sitemap must include ${path}`);
  assert(sitemapUrls.every(url => new URL(url).origin === canonicalOrigin && !new URL(url).search && !new URL(url).hash), 'Only public canonical URLs belong in sitemap');
  const notFound = await (await fetchLocal('/404.html')).text();
  assert.match(notFound, /name=["']robots["'][^>]*noindex/i, 'The real not-found page must not be indexed');
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const metadataPage = await pageFor(false), titles = new Set();
  for (const path of indexPaths) {
    await metadataPage.goto(base + path, { waitUntil: 'domcontentloaded' });
    const metadata = await metadataPage.evaluate(() => ({
      title: document.title, descriptions: [...document.querySelectorAll('meta[name="description"]')].map(meta => meta.content),
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(link => link.href),
      robots: document.querySelector('meta[name="robots"]')?.content || '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.content,
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent)),
      visibleText: document.body.innerText,
      visibleLinks: [...document.querySelectorAll('a[href]')].filter(anchor => anchor.getBoundingClientRect().height > 0).map(anchor => anchor.getAttribute('href')),
    }));
    assert(metadata.title.length > 12 && metadata.title.length <= 90, `Useful, concise page title: ${path}`);
    assert(!titles.has(metadata.title), `Each public page needs its own title: ${path}`); titles.add(metadata.title);
    assert.equal(metadata.descriptions.length, 1, `One meta description: ${path}`);
    assert(metadata.descriptions[0].length >= 50, `Descriptive page summary: ${path}`);
    assert.deepEqual(metadata.canonical, [canonicalOrigin + path], `Self-canonical on ${path}`);
    assert(!/noindex/i.test(metadata.robots), `Public page must remain indexable: ${path}`);
    assert.equal(metadata.ogUrl, canonicalOrigin + path, `Sharing URL: ${path}`);
    assert.equal(metadata.twitterCard, 'summary_large_image', `Large sharing card: ${path}`);
    assert(metadata.schema.length > 0, `Structured data: ${path}`);
    for (const schema of metadata.schema) assert.equal(schema['@context'], 'https://schema.org');
    if (path === '/worldloom/' || path === '/tacticstrike/') {
      assert(metadata.visibleText.trim().split(/\s+/).length >= 35, `A useful game introduction must replace the JS loading screen: ${path}`);
      assert(metadata.visibleLinks.includes(`/games${path}`), `No-JS game visitors can reach its readable guide: ${path}`);
    }
    if (metadata.ogImage) {
      const imageUrl = new URL(metadata.ogImage); assert.equal(imageUrl.origin, canonicalOrigin);
      const imageResponse = await fetchLocal(imageUrl.pathname); assert.match(imageResponse.headers.get('content-type'), /^image\//);
    }
    results.push({ path, metadata });
  }
  await metadataPage.close();
  for (const path of landingPaths) {
    const page = await pageFor(false);
    for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.goto(base + path, { waitUntil: 'networkidle2' });
      const content = await page.evaluate(() => ({
        heading: [...document.querySelectorAll('h1')].map(heading => heading.textContent.trim()),
        visibleText: document.body.innerText,
        wordCount: document.body.innerText.trim().split(/\s+/).length,
        ids: [...document.querySelectorAll('[id]')].map(element => element.id),
        overflow: document.documentElement.scrollWidth > innerWidth,
        links: [...document.querySelectorAll('a[href]')].map(anchor => ({ href: anchor.getAttribute('href'), label: anchor.textContent.trim() || anchor.getAttribute('aria-label') })),
      }));
      assert(content.heading.some(text => text.length > 4), `Readable HTML H1 with JavaScript off: ${path}`);
      assert(content.wordCount >= (path === '/' ? 60 : 120), `Useful plain HTML game information with JavaScript off: ${path}`);
      assert.equal(content.overflow, false, `No horizontal overflow at ${width}px: ${path}`);
      for (const link of content.links) {
        const url = new URL(link.href, base + path);
        if (url.origin === base && url.pathname === path && url.hash) assert(content.ids.includes(decodeURIComponent(url.hash.slice(1))), `On-page link has a target: ${path}${url.hash}`);
        if (url.origin === base || url.origin === canonicalOrigin) links.add(url.pathname + url.search);
      }
      if (path !== '/') assert(content.links.some(link => link.href === path.replace('/games', '')), `Guide has a real play link: ${path}`);
      else for (const guide of landingPaths.slice(1)) assert(content.links.some(link => link.href === guide), `Hub links to ${guide}`);
      // Trigger any intentionally lazy screenshots before checking source images.
      await page.evaluate(() => { for (const image of document.images) image.loading = 'eager'; });
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      const name = path === '/' ? 'hub' : `${path.split('/')[2]}-guide`;
      await page.screenshot({ path: resolve(outputDir, `seo-${name}-${label}.png`), fullPage: true });
      results.push({ path, viewport: label, javascript: false, heading: content.heading, wordCount: content.wordCount, links: content.links });
    }
    await page.close();
  }
  for (const path of links) await fetchLocal(path);
  const liveHub = await pageFor(true); await liveHub.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await liveHub.goto(base, { waitUntil: 'networkidle2' });
  await liveHub.waitForFunction(() => [...document.querySelectorAll('.poster')].every(image => image.complete && image.naturalWidth > 0));
  assert.equal(await liveHub.$eval('#enter-worldloom', anchor => anchor.getAttribute('href')), '/worldloom/');
  assert.equal(await liveHub.$eval('#enter-tacticstrike', anchor => anchor.getAttribute('href')), '/tacticstrike/');
  await liveHub.hover('#enter-worldloom');
  await liveHub.screenshot({ path: resolve(outputDir, 'seo-hub-interactive.png'), fullPage: true });
  assert.equal(await liveHub.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await liveHub.close();
  assert.deepEqual(errors, [], 'No uncaught page errors'); assert.deepEqual(missing, [], 'No broken local resources');
  const result = { ok: true, siteRoot, sitemapUrls, checkedLinks: [...links], results, errors, missing };
  await writeFile(resolve(runDir, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: true, metadataPages: indexPaths.length, noJsLayoutChecks: landingPaths.length * 2, internalLinks: links.size, errors, missing, evidence: runDir }, null, 2));
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
