import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { buildOffline } from '../tools/build-offline.mjs';

test('release digests match deployed LF bytes and change for replaced media', async () => {
  const parent = resolve(tmpdir());
  const directory = await mkdtemp(resolve(parent, 'unpaused-offline-test-'));
  try {
    await mkdir(resolve(directory, 'worldloom/src'), { recursive: true });
    await mkdir(resolve(directory, 'hub'), { recursive: true });
    await mkdir(resolve(directory, 'account'), { recursive: true });
    await writeFile(resolve(directory, 'index.html'), '<html>\r\r\nhub\r\n</html>');
    await writeFile(resolve(directory, 'worldloom/src/main.js'), 'const x = 1;\r\n');
    await writeFile(resolve(directory, 'hub/loop.mp4'), 'movie-one');
    await writeFile(resolve(directory, 'account/reset.html'), 'private flow');
    const first = await buildOffline(directory);
    assert.equal(first.core.some(item => item.url.includes('reset')), false);
    for (const item of first.core) {
      const bytes = await readFile(resolve(directory, item.url === '/' ? 'index.html' : '.' + item.url));
      assert.equal(bytes.includes(13), false);
      assert.equal(item.size, bytes.length);
      assert.equal(item.revision, createHash('sha256').update(bytes).digest('hex'));
    }
    assert.equal((await buildOffline(directory)).version, first.version, 'repeat builds must be stable');
    await writeFile(resolve(directory, 'hub/loop.mp4'), 'movie-two');
    assert.notEqual((await buildOffline(directory)).version, first.version, 'media-only updates must retire the old video cache');
  } finally {
    if (!directory.startsWith(parent + sep + 'unpaused-offline-test-')) throw new Error('Unexpected temporary test path');
    await rm(directory, { recursive: true, force: true });
  }
});
