/* Generated from the complete production build; do not edit dist by hand. */
const RELEASE = /* OFFLINE_RELEASE */;
const PREFIX = 'unpaused-offline-';
const CACHE = PREFIX + RELEASE.version;
const MEDIA_PREFIX = 'unpaused-media-';
const MEDIA_CACHE = MEDIA_PREFIX + RELEASE.version;
const META = '/__unpaused_offline_release__';
const core = new Map(RELEASE.core.map(item => [item.url, item]));
const media = new Set(RELEASE.media);
const MAX_MEDIA_BYTES = 16 * 1024 * 1024;

async function verified(response, item) {
  if (!response || response.status !== 200 || response.type === 'opaque') return false;
  const bytes = await response.clone().arrayBuffer();
  if (bytes.byteLength !== item.size) return false;
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, value => value.toString(16).padStart(2, '0')).join('') === item.revision;
}

function canonicalPath(path) {
  if (path.endsWith('/index.html')) return path.slice(0, -10);
  if (['/worldloom', '/tacticstrike'].includes(path)) return path + '/';
  return path;
}

async function installPack() {
  const cache = await caches.open(CACHE);
  const previous = [];
  for (const name of await caches.keys()) {
    if (!name.startsWith(PREFIX) || name === CACHE) continue;
    const old = await caches.open(name);
    const manifest = await old.match(META);
    if (manifest) previous.push({ cache: old, entries: new Map((await manifest.json()).core.map(item => [item.url, item.revision])) });
  }
  let cursor = 0;
  async function download() {
    while (cursor < RELEASE.core.length) {
      const item = RELEASE.core[cursor++];
      const partial = await cache.match(item.url);
      if (await verified(partial, item)) continue; // Resume only matching release bytes.
      if (partial) await cache.delete(item.url);
      let response;
      for (const old of previous) {
        if (old.entries.get(item.url) === item.revision) response = await old.cache.match(item.url);
        if (await verified(response, item)) break;
        response = undefined;
      }
      if (!response) {
        response = await fetch(item.url, { cache: 'no-cache', credentials: 'omit', priority: 'low', signal: AbortSignal.timeout(120000) });
        if (response.status !== 200 || response.type === 'opaque') throw new Error('Offline file unavailable: ' + item.url);
        // A failed asset URL must not silently store an HTML fallback as JS/model.
        if (!item.url.endsWith('/') && !item.url.endsWith('.html') && /text\/html/.test(response.headers.get('Content-Type') || '')) throw new Error('Unexpected offline response');
        if (!await verified(response, item)) throw new Error('Offline release changed during download');
      }
      await cache.put(item.url, response);
    }
  }
  // Do not flood a poor connection with background asset downloads.
  await Promise.all([download(), download()]);
  await cache.put(META, new Response(JSON.stringify(RELEASE), { headers: { 'Content-Type': 'application/json' } }));
}

self.addEventListener('install', event => {
  // No skipWaiting: an open game keeps a coherent release until its tabs close.
  event.waitUntil(installPack());
});
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) {
    if ((name.startsWith(PREFIX) && name !== CACHE) || (name.startsWith(MEDIA_PREFIX) && name !== MEDIA_CACHE)) await caches.delete(name);
  }
  await self.clients.claim();
})()));

async function packStatus() {
  const cache = await caches.open(CACHE);
  const keys = new Set((await cache.keys()).map(request => new URL(request.url).pathname));
  return { type: 'UNPAUSED_OFFLINE_STATUS', version: RELEASE.version,
    ready: keys.has(META) && RELEASE.core.every(item => keys.has(item.url)) };
}
let repair;
self.addEventListener('message', event => {
  if (event.data?.type === 'UNPAUSED_OFFLINE_STATUS') event.waitUntil((async () => {
    const status = await packStatus();
    event.source?.postMessage(status);
    // Cache Storage can be evicted independently of a worker registration.
    // Repair only on an online client request; never touch local world saves.
    if (!status.ready && event.data.repair === true) {
      repair ||= installPack().finally(() => { repair = null; });
      try { await repair; event.source?.postMessage(await packStatus()); } catch { /* Retry after the next connection. */ }
    }
  })());
});

async function ranged(response, header) {
  if (!header) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  const bytes = await response.arrayBuffer();
  let start = Number(match?.[1] || 0), end = match?.[2] ? Number(match[2]) : bytes.byteLength - 1;
  if (match && !match[1] && match[2]) { start = Math.max(0, bytes.byteLength - Number(match[2])); end = bytes.byteLength - 1; }
  if (!match || (!match[1] && !match[2]) || start > end || start >= bytes.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.byteLength}` } });
  end = Math.min(end, bytes.byteLength - 1);
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.set('Content-Range', `bytes ${start}-${end}/${bytes.byteLength}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}

async function rememberMedia(path, response) {
  const length = Number(response.headers.get('Content-Length'));
  const range = /^bytes 0-(\d+)\/(\d+)$/.exec(response.headers.get('Content-Range') || '');
  // Never treat a partial video segment as a complete offline file.
  if (!(response.status === 200 || (response.status === 206 && range && Number(range[1]) + 1 === Number(range[2])))) return;
  if (!length || length > MAX_MEDIA_BYTES) return;
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_MEDIA_BYTES || (range && bytes.byteLength !== Number(range[2]))) return;
  const headers = new Headers(response.headers);
  headers.delete('Content-Range'); headers.delete('Content-Encoding');
  headers.set('Content-Length', String(bytes.byteLength));
  const cache = await caches.open(MEDIA_CACHE);
  await cache.put(path, new Response(bytes, { status: 200, headers }));
  const keys = await cache.keys();
  // A small, bounded collection of completely downloaded loops/music.
  for (const key of keys.slice(0, Math.max(0, keys.length - 6))) await cache.delete(key);
}

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('Authorization')) return;
  // No API responses, account tokens, cloud saves, sign-in pages or unknown routes.
  if (/token|code|verify|reset/i.test(url.search) || url.pathname.startsWith('/api/')) return;
  const path = canonicalPath(url.pathname);
  if (!core.has(path) && !media.has(path)) return;
  event.respondWith((async () => {
    const cache = await caches.open(core.has(path) ? CACHE : MEDIA_CACHE);
    const cached = await cache.match(path);
    if (cached) return ranged(cached, request.headers.get('Range'));
    const response = await fetch(request);
    if (media.has(path)) event.waitUntil(rememberMedia(path, response.clone()).catch(() => {}));
    return response;
  })());
});
