import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createAccountStore, isAccountSessionActive} from '../accountStore.js';

test('persistent session validation still rejects expired, missing and malformed sessions', () => {
  const now = Date.now();
  for (const session of [null, {}, {expiresAt:undefined}, {expiresAt:NaN}, {expiresAt:0}, {expiresAt:now}, {expiresAt:'never'}]) {
    assert.equal(isAccountSessionActive(session, now), false);
  }
  assert.equal(isAccountSessionActive({expiresAt:now + 1}, now), true);
  assert.equal(isAccountSessionActive({expiresAt:null}, now + 20 * 365 * 86400000), true);
});

for (const backend of ['local', 'postgresql']) test(`${backend}: retain active legacy logins, persist new sessions, honor logout and credential revocation`, async () => {
  const dir = await mkdtemp(join(tmpdir(), 'unpaused-session-'));
  const db = backend === 'postgresql' ? new PGlite() : null;
  const sqlClient = db ? async (strings, ...values) => {
    const query = strings.reduce((text, part, i) => text + (i ? `$${i}` : '') + part, '');
    return (await db.query(query, values)).rows;
  } : null;
  const options = {localFile:join(dir, 'accounts.json'), sqlClient};
  const store = createAccountStore(options);
  try {
    await store.initialize();
    assert.equal(store.isReady, true);
    const id = randomUUID(), now = Date.now();
    const password = {algorithm:'scrypt', salt:'fixture', hash:'fixture'};
    await store.createUser({id, email:`${id}@example.invalid`, displayName:'Player', password,
      credits:0, purchasedWeapons:[], createdAt:new Date(now).toISOString(), updatedAt:new Date(now).toISOString()});
    await store.createSession('valid-legacy', id, now + 86400000);
    await store.createSession('expired-legacy', id, now - 1);
    await store.createSession('logged-out', id, now + 86400000);
    await store.deleteSession('logged-out');
    // Exercise migration from the exact previous PostgreSQL session schema.
    if (db) await db.exec('ALTER TABLE operative_sessions DROP COLUMN persistent');
    const reopened = createAccountStore(options);
    await reopened.initialize();
    await reopened.initialize();
    assert.equal(reopened.isReady, true, 'migration is safe to run repeatedly');
    assert.equal((await reopened.findSession('valid-legacy')).expiresAt, null);
    assert.equal(isAccountSessionActive(await reopened.findSession('expired-legacy')), false, 'never resurrect expired sessions');
    assert.equal(await reopened.findSession('logged-out'), null, 'never resurrect revoked sessions');
    if (db) {
      const oldReader = await db.query('SELECT expires_at FROM operative_sessions WHERE token_hash=$1', ['valid-legacy']);
      assert.ok(new Date(oldReader.rows[0].expires_at).getTime() > now, 'old server remains compatible during deployment');
    }
    await reopened.createSession('persistent-new', id);
    const restart = createAccountStore(options);
    await restart.initialize();
    const session = await restart.findSession('persistent-new');
    assert.equal(session.expiresAt, null);
    assert.equal(isAccountSessionActive(session, now + 20 * 365 * 86400000), true, 'no routine time limit');
    await restart.deleteSession('persistent-new');
    await restart.initialize();
    assert.equal(await restart.findSession('persistent-new'), null, 'logout stays revoked after restart');
    await restart.createSession('before-credential-change', id);
    await restart.reserveEmailVerification(id, 'verification', now + 1800000);
    await restart.consumeEmailVerification('verification', {...password, hash:'new-credential'});
    assert.equal(await restart.findSession('before-credential-change'), null, 'credential replacement still revokes old sessions');
    assert.equal(await restart.findSession('valid-legacy'), null);
  } finally {
    if (db) await db.close();
    await rm(dir, {recursive:true, force:true});
  }
});
