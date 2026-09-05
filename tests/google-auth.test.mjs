import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID, generateKeyPairSync, sign } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { createAccountStore } from '../accountStore.js';
import { createGoogleAuth, createGoogleTokenVerifier, validateGoogleClaims } from '../google-auth.js';

const clientId = 'test-client.apps.googleusercontent.com';
const now = 1788566400000;
const claims = (patch = {}) => ({
  iss: 'https://accounts.google.com', aud: clientId, sub: 'google-subject-1',
  iat: now / 1000 - 20, exp: now / 1000 + 3000,
  email: 'Owner@gmail.com', email_verified: true, ...patch
});
const password = { algorithm: 'scrypt', salt: 'known-salt', hash: 'known-hash' };
const userRecord = email => ({
  id: randomUUID(), email, displayName: 'Player', password: { ...password },
  credits: 450, purchasedWeapons: ['starter'],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
});
const identity = (subject, email, emailAuthoritative = true) => ({
  subject, email, emailAuthoritative, emailVerifiedAt: new Date().toISOString()
});

async function createPostgres() {
  // The full in-process suite includes browser fixtures. Emscripten inspects
  // window dynamically, so initialize its Node runtime without those stubs and
  // restore the exact descriptors for the remaining tests.
  const globals = ['window', 'document'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  try {
    for (const [key] of globals) delete globalThis[key];
    const db = new PGlite();
    await db.waitReady;
    return db;
  } finally {
    for (const [key, descriptor] of globals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
}

test('Google claims require issuer, audience, expiry, verified email, and a stable subject', () => {
  const valid = validateGoogleClaims(claims(), clientId, now);
  assert.equal(valid.subject, 'google-subject-1');
  assert.equal(valid.email, 'owner@gmail.com');
  assert.equal(valid.emailAuthoritative, true);
  assert.equal(validateGoogleClaims(claims({ iss: 'accounts.google.com' }), clientId, now).subject, valid.subject);
  for (const patch of [
    { iss: 'https://accounts.google.com.attacker.invalid' }, { aud: 'other-client' },
    { aud: [clientId, 'other-client'] }, { azp: 'other-client' }, { exp: now / 1000 },
    { exp: '2000000000' }, { iat: now / 1000 + 61 }, { iat: undefined },
    { sub: '' }, { sub: ' '.repeat(4) }, { sub: 'x'.repeat(256) },
    { email_verified: false }, { email_verified: 'true' },
    { email: 'bad-email' }, { email: 'owner@gmail.com\n' }
  ]) assert.throws(() => validateGoogleClaims(claims(patch), clientId, now), { code: 'INVALID_GOOGLE_CREDENTIAL' });
  assert.equal(validateGoogleClaims(claims({ email: 'owner@company.example', hd: 'company.example' }), clientId, now).emailAuthoritative, true);
  for (const patch of [
    { email: 'owner@outlook.com' }, { email: 'owner@gmail.com.attacker.invalid' },
    { email: 'owner@company.example', hd: '' }, { email: 'owner@company.example', hd: true },
    { email: 'owner@company.example', hd: 'invalid domain' }
  ]) assert.equal(validateGoogleClaims(claims(patch), clientId, now).emailAuthoritative, false);
});

test('official Google verifier checks real RSA signatures, audience, issuer, and token lifetime with offline keys', async () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const client = new OAuth2Client(clientId);
  client.getFederatedSignonCertsAsync = async () => ({ certs: { fixture: publicKey.export({ type: 'spki', format: 'pem' }) } });
  const verify = createGoogleTokenVerifier(clientId, client);
  const seconds = Math.floor(Date.now() / 1000);
  const signed = (patch = {}, key = privateKey) => {
    const head = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'fixture' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(claims({ iat: seconds - 20, exp: seconds + 3000, ...patch }))).toString('base64url');
    return `${head}.${body}.${sign('RSA-SHA256', Buffer.from(`${head}.${body}`), key).toString('base64url')}`;
  };
  assert.equal((await verify(signed())).sub, 'google-subject-1');
  const { privateKey: attackerKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  for (const token of [
    signed({}, attackerKey), signed({ aud: 'another-client' }), signed({ iss: 'https://attacker.invalid' }),
    signed({ exp: seconds - 1000, iat: seconds - 2000 }), signed({ iat: seconds + 1000 }), 'a.b.c'
  ]) await assert.rejects(verify(token), { code: 'INVALID_GOOGLE_CREDENTIAL' });
  client.getFederatedSignonCertsAsync = async () => { throw Object.assign(new Error('private network diagnostic'), { code: 'ETIMEDOUT' }); };
  await assert.rejects(verify(signed()), error => error.code === 'GOOGLE_UNAVAILABLE' && !error.message.includes('private'));
});

for (const backend of ['local', 'postgresql']) test(`${backend}: Google identities link once, preserve ownership, and revoke unverified credentials`, async () => {
  const directory = await mkdtemp(join(tmpdir(), 'unpaused-google-'));
  const db = backend === 'postgresql' ? await createPostgres() : null;
  const sqlClient = db ? async (strings, ...values) => {
    const query = strings.reduce((text, part, index) => text + (index ? `$${index}` : '') + part, '');
    return (await db.query(query, values)).rows;
  } : null;
  const options = { localFile: join(directory, 'accounts.json'), sqlClient };
  const store = createAccountStore(options);
  try {
    await store.initialize();
    assert.equal(store.isReady, true);
    await store.initialize();
    assert.equal(store.isReady, true, 'Google schema migration is repeatable');

    const created = await Promise.all(Array.from({ length: 6 }, () => store.findOrCreateGoogleUser(identity('new-sub', 'new@gmail.com'))));
    assert.equal(new Set(created.map(user => user.id)).size, 1, 'concurrent first sign-ins create one account');
    assert.ok(created[0].emailVerifiedAt);
    assert.equal(created[0].username, null);
    assert.equal(created[0].credits, 0);
    assert.deepEqual(created[0].password, { algorithm: 'google', salt: '', hash: '' });
    assert.equal(created[0].googleSubject, 'new-sub');
    const changedEmail = await store.findOrCreateGoogleUser(identity('new-sub', 'different@outlook.com', false));
    assert.equal(changedEmail.id, created[0].id, 'subject persists when Google email changes');
    assert.equal(changedEmail.email, 'new@gmail.com', 'returning Google subject cannot silently replace stored email');
    assert.equal(await store.findUserByEmail('different@outlook.com'), null);
    await assert.rejects(store.findOrCreateGoogleUser(identity('impostor', 'new@gmail.com')), { code: 'GOOGLE_ACCOUNT_CONFLICT' });
    await assert.rejects(store.findOrCreateGoogleUser(identity('third-party', 'owner@outlook.com', false)), { code: 'GOOGLE_EMAIL_VERIFICATION_REQUIRED' });
    assert.equal(await store.findUserByEmail('owner@outlook.com'), null);

    const verified = await store.createUser(userRecord('verified@gmail.com'));
    await store.reserveEmailVerification(verified.id, 'verified-email-token', Date.now() + 1800000);
    await store.consumeEmailVerification('verified-email-token', password);
    await store.setUsername(verified.id, 'ExistingOwner');
    const friend = await store.generateFriendCode(verified.id);
    await store.createSession('verified-session', verified.id);
    await store.reservePasswordReset(verified.id, 'verified-reset-token', Date.now() + 1800000);
    const linked = await store.findOrCreateGoogleUser(identity('verified-sub', verified.email));
    assert.equal(linked.id, verified.id);
    assert.equal(linked.credits, 450);
    assert.deepEqual(linked.purchasedWeapons, ['starter']);
    assert.deepEqual(linked.password, password, 'already verified owners retain their email password');
    assert.equal(linked.username, 'ExistingOwner');
    assert.equal(linked.friendCode, friend.friendCode);
    assert.ok(await store.findSession('verified-session'));
    assert.ok(await store.findPasswordReset('verified-reset-token'));

    const pending = await store.createUser(userRecord('pending@gmail.com'));
    await store.reserveEmailVerification(pending.id, 'planted-verification-token', Date.now() + 1800000);
    await store.createSession('planted-session', pending.id);
    // Simulate a legacy reset row for an unverified account. Adoption must erase
    // it even though current reset requests only permit verified accounts.
    if (db) {
      await db.query('INSERT INTO operative_password_resets(user_id,token_hash,expires_at) VALUES($1,$2,NOW()+interval \'1 day\')', [pending.id, 'planted-reset-token']);
    } else {
      const persisted = JSON.parse(await readFile(options.localFile, 'utf8'));
      persisted.passwordResets ||= {};
      persisted.passwordResets[pending.id] = { tokenHash: 'planted-reset-token', expiresAt: Date.now() + 1800000 };
      await writeFile(options.localFile, JSON.stringify(persisted));
      await store.initialize();
    }
    const adopted = await store.findOrCreateGoogleUser(identity('pending-sub', pending.email));
    assert.equal(adopted.id, pending.id);
    assert.equal(adopted.credits, 450);
    assert.ok(adopted.emailVerifiedAt);
    assert.deepEqual(adopted.password, { algorithm: 'google', salt: '', hash: '' }, 'preregistered attacker password is disabled');
    assert.equal(await store.findSession('planted-session'), null);
    assert.equal(await store.findEmailVerification('planted-verification-token'), null);
    assert.equal(await store.findPasswordReset('planted-reset-token'), null);
    assert.equal(await store.consumeEmailVerification('planted-verification-token', password), null);

    const thirdParty = await store.createUser(userRecord('existing@outlook.com'));
    await assert.rejects(store.findOrCreateGoogleUser(identity('non-authoritative-sub', thirdParty.email, false)), { code: 'GOOGLE_EMAIL_VERIFICATION_REQUIRED' });
    assert.deepEqual((await store.findUserById(thirdParty.id)).password, password);
    assert.equal((await store.findUserById(thirdParty.id)).emailVerifiedAt || null, null);

    const competition = await Promise.allSettled(['first-owner', 'second-owner'].map(subject => store.findOrCreateGoogleUser(identity(subject, 'compete@gmail.com'))));
    assert.equal(competition.filter(result => result.status === 'fulfilled').length, 1);
    assert.equal(competition.find(result => result.status === 'rejected').reason.code, 'GOOGLE_ACCOUNT_CONFLICT');
    const migrating = await Promise.all(['alias-one@gmail.com', 'alias-two@gmail.com'].map(email => store.findOrCreateGoogleUser(identity('same-subject', email))));
    assert.equal(migrating[0].id, migrating[1].id, 'unique subject also prevents two simultaneous emails creating two accounts');

    const reopened = createAccountStore(options);
    await reopened.initialize();
    const returning = await reopened.findOrCreateGoogleUser(identity('verified-sub', 'changed@outlook.com', false));
    assert.equal(returning.id, verified.id);
    assert.equal(returning.username, 'ExistingOwner');
    assert.equal(returning.friendCode, friend.friendCode);
  } finally {
    if (db) await db.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('Google JSON endpoint rejects cross-origin, invalid, and disabled requests without issuing sessions', async () => {
  const origin = 'https://unpaused.online';
  let payload = claims(), verificationCalls = 0, stored, sessionCalls = 0;
  const google = createGoogleAuth({
    clientId, allowedOrigins: [origin], now: () => now,
    verifyIdToken: async (credential, audience) => {
      verificationCalls++;
      assert.equal(credential, 'signed.payload.signature');
      assert.equal(audience, clientId);
      return payload;
    },
    store: { findOrCreateGoogleUser: async identity => {
      stored = identity;
      if (!identity.emailAuthoritative) throw Object.assign(new Error('private store error'), { code: 'GOOGLE_EMAIL_VERIFICATION_REQUIRED' });
      return { id: 'account-1', email: identity.email, secret: 'never expose' };
    } },
    createSession: async id => { assert.equal(id, 'account-1'); sessionCalls++; return { token: 'session-token', expiresAt: null }; },
    publicAccount: user => ({ id: user.id, email: user.email })
  });
  assert.equal(google.clientId, clientId);
  const app = express();
  app.use(express.json());
  app.post('/google', google.handle);
  const disabled = createGoogleAuth({ clientId: '' });
  assert.equal(disabled.clientId, null);
  app.post('/disabled', disabled.handle);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = (path = '/google', headers = {}, body = { credential: 'signed.payload.signature' }) => fetch(url + path, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body)
  });
  try {
    let response = await request();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { token: 'session-token', expiresAt: null, user: { id: 'account-1', email: 'owner@gmail.com' } });
    assert.equal(stored.subject, 'google-subject-1');
    assert.equal(sessionCalls, 1);
    for (const badOrigin of ['https://attacker.invalid', 'https://unpaused.online.attacker.invalid', 'null', '']) {
      assert.equal((await request('/google', { Origin: badOrigin })).status, 403);
    }
    assert.equal((await request('/google', { 'Content-Type': 'text/plain' })).status, 415);
    for (const body of [{}, { credential: 'unsigned-token' }, { credential: 'a.b.' + 'c'.repeat(17000) }, { credential: 42 }]) {
      assert.equal((await request('/google', {}, body)).status, 400);
    }
    assert.equal(verificationCalls, 1, 'untrusted or malformed requests never reach the verifier');
    payload = claims({ aud: 'body-client-id-cannot-override' });
    assert.equal((await request('/google', {}, { credential: 'signed.payload.signature', clientId: payload.aud })).status, 401);
    payload = claims({ email: 'owner@outlook.com' });
    response = await request();
    assert.equal(response.status, 403);
    assert.equal((await response.json()).error, 'GOOGLE_EMAIL_VERIFICATION_REQUIRED');
    assert.equal(sessionCalls, 1, 'failed policy or token checks never issue a session');
    assert.equal((await request('/disabled')).status, 503);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
