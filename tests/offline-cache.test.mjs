import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';

const origin = 'https://unpaused.test';
const template = await readFile(new URL('../tools/offline-worker-template.js', import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const entry = (url, value = '0123456789') => ({ url, revision: digest(value), size: value.length });
const release = (version = 'one') => ({ version, core: [
  entry('/', version === 'one' ? '0123456789' : 'new'),
  entry('/worldloom/', version === 'one' ? '0123456789' : 'new'),
  entry('/worldloom/src/main.js'),
  entry('/worldloom/assets/audio/birds.mp3'),
], media: ['/hub/clip.mp4'] });

function storage() {
  const entries = new Map();
  const key = request => new URL(typeof request === 'string' ? request : request.url, origin).href;
  return {
    async keys() { return [...entries.keys()]; },
    async delete(name) { return entries.delete(name); },
    async open(name) {
      if (!entries.has(name)) entries.set(name, new Map());
      const data = entries.get(name);
      return {
        async match(request) { return data.get(key(request))?.clone(); },
        async put(request, response) { data.set(key(request), response.clone()); },
        async keys() { return [...data.keys()].map(url => new Request(url)); },
        async delete(request) { return data.delete(key(request)); },
      };
    },
  };
}
function worker(pack = release(), caches = storage(), network = async path => new Response(pack.core.find(item => item.url === path)?.size === 3 ? 'new' : '0123456789')) {
  const handlers = new Map(), requests = [], sent = [];
  let claimed = 0;
  const context = vm.createContext({ URL, Request, Response, Headers, AbortSignal, Map, Set, console, crypto: webcrypto,
    caches, fetch: async (...args) => { requests.push(args[0]); return network(...args); },
    self: { location: { origin }, clients: { claim: async () => { claimed++; } }, addEventListener: (type, handler) => handlers.set(type, handler) },
  });
  vm.runInContext(template.replace('/* OFFLINE_RELEASE */', JSON.stringify(pack)), context);
  async function event(type, props = {}) {
    const pending = []; let response;
    handlers.get(type)({ ...props, waitUntil: promise => pending.push(promise), respondWith: promise => { response = promise; } });
    const value = response ? await response : undefined;
    await Promise.all(pending);
    return value;
  }
  return { caches, requests, sent, get claimed() { return claimed; },
    install: () => event('install'), activate: () => event('activate'),
    status: async (repair = false) => { await event('message', { data: { type: 'UNPAUSED_OFFLINE_STATUS', repair }, source: { postMessage: data => sent.push(data) } }); return sent.at(-1); },
    get: (path, options) => event('fetch', { request: new Request(new URL(path, origin), options) }),
  };
}

test('complete pack serves game navigation and code offline, including index aliases', async () => {
  let offline = false;
  const w = worker(release(), storage(), async () => { if (offline) throw new TypeError('offline'); return new Response('0123456789'); });
  await w.install(); await w.activate(); offline = true;
  assert.equal((await w.status()).ready, true);
  for (const path of ['/', '/index.html', '/worldloom', '/worldloom/', '/worldloom/index.html', '/worldloom/src/main.js']) {
    assert.equal(await (await w.get(path)).text(), '0123456789');
  }
  assert.equal(w.requests.length, 4);
});

test('incomplete installation never reports ready and resumes missing files after reconnection', async () => {
  const caches = storage();
  const broken = worker(release(), caches, async url => { if (url === '/worldloom/src/main.js') return new Response('Unavailable', { status: 503 }); return new Response('0123456789'); });
  await assert.rejects(broken.install());
  assert.equal((await broken.status()).ready, false);
  const retry = worker(release(), caches);
  await retry.install();
  assert.equal((await retry.status()).ready, true);
  assert.ok(retry.requests.length < 4, 'partial download should be reused');
});

test('failed update retains previous complete release; successful update reuses unchanged assets', async () => {
  const caches = storage(), old = worker(release(), caches);
  await old.install(); await old.activate();
  const broken = worker(release('two'), caches, async () => new Response('', { status: 503 }));
  await assert.rejects(broken.install());
  assert.equal((await old.status()).ready, true);
  const next = worker(release('two'), caches);
  await next.install();
  assert.equal(next.requests.includes('/worldloom/src/main.js'), false);
  assert.equal((await old.status()).ready, true, 'old game must stay intact until new worker activates');
  await next.activate();
  assert.deepEqual(await caches.keys(), ['unpaused-offline-two']);
});

test('account/API, tokens, cross-origin and writes never enter offline handling', async () => {
  const w = worker(); await w.install();
  for (const [path, options] of [
    ['/api/worlds', {}], ['/account/?token=private', {}], ['/?code=private', {}],
    ['https://backend.test/api/auth/me', {}], ['/', { method: 'POST', body: 'private' }],
    ['/worldloom/src/main.js', { headers: { Authorization: 'Bearer private' } }],
    ['/missing-page/', {}],
  ]) assert.equal(await w.get(path, options), undefined);
});

test('cached audio supports bounded, open-ended, suffix and invalid byte ranges', async () => {
  const w = worker(); await w.install();
  for (const [range, value] of [['bytes=2-5', '2345'], ['bytes=7-', '789'], ['bytes=-3', '789']]) {
    const response = await w.get('/worldloom/assets/audio/birds.mp3', { headers: { Range: range } });
    assert.equal(response.status, 206); assert.equal(await response.text(), value);
  }
  assert.equal((await w.get('/worldloom/assets/audio/birds.mp3', { headers: { Range: 'bytes=20-30' } })).status, 416);
  assert.equal((await w.get('/worldloom/assets/audio/birds.mp3', { headers: { Range: 'bytes=-' } })).status, 416);
});

test('partial video ranges are never cached as complete playable movies', async () => {
  const w = worker(release(), storage(), async () => new Response('123', { status: 206, headers: { 'Content-Range': 'bytes 0-2/10', 'Content-Length': '3' } }));
  await w.get('/hub/clip.mp4', { headers: { Range: 'bytes=0-2' } });
  assert.equal(await (await w.caches.open('unpaused-media-one')).match('/hub/clip.mp4'), undefined);
});

test('changed or corrupted release bytes cannot make a mixed offline pack ready', async () => {
  const caches = storage();
  const corrupt = worker(release(), caches, async () => new Response('abcdefghij'));
  await assert.rejects(corrupt.install(), /release changed/);
  assert.equal((await corrupt.status()).ready, false);
  await (await caches.open('unpaused-offline-one')).put('/', new Response('bad partial download'));
  const retry = worker(release(), caches);
  await retry.install();
  assert.equal((await retry.status()).ready, true);
  assert.equal(await (await retry.get('/')).text(), '0123456789');
});

test('a new release does not reuse outdated cached movies', async () => {
  const caches = storage();
  await (await caches.open('unpaused-media-one')).put('/hub/clip.mp4', new Response('old movie'));
  const next = worker(release('two'), caches);
  await next.install(); await next.activate();
  assert.equal((await caches.keys()).includes('unpaused-media-one'), false);
  assert.equal(await (await next.get('/hub/clip.mp4')).text(), '0123456789');
});

test('an active registration repairs evicted files online without discarding its intact cache', async () => {
  const w = worker(); await w.install(); await w.activate();
  await (await w.caches.open('unpaused-offline-one')).delete('/worldloom/src/main.js');
  assert.equal((await w.status()).ready, false);
  const before = w.requests.length;
  assert.equal((await w.status(true)).ready, true);
  assert.equal(w.requests.length, before + 1, 'repair should only download the evicted asset');
});
