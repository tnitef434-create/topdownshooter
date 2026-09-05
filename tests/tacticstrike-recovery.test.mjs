import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as connect } from 'socket.io-client';
import { createShooterRoomRecovery, SHOOTER_SOCKET_OPTIONS } from '../shooterRoomRecovery.js';
import { installShooterAccountIdentity } from '../shooterAccountIdentity.js';
import { Engine } from '../src/game/Engine.js';
import { Network } from '../src/game/Network.js';

function event(socket, name, predicate = () => true) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.off(name, receive); reject(new Error(`Timed out waiting for ${name}`)); }, 3000);
    const receive = value => { if (!predicate(value)) return; clearTimeout(timer); socket.off(name, receive); resolve(value); };
    socket.on(name, receive);
  });
}

async function fixture(graceMs = 2000) {
  const http = createServer();
  const io = new Server(http, { ...SHOOTER_SOCKET_OPTIONS });
  const rooms = new Map(), leaves = [], clients = [];
  let authentications = 0;
  const identities = { a: 'Owner', b: 'Friend' };
  installShooterAccountIdentity(io, {
    accounts: {
      findSession: async token => { authentications++; return { userId: token[0], expiresAt: null }; },
      findUserById: async id => ({ username: identities[id], emailVerifiedAt: 'today' }),
    },
    hashToken: value => value,
  });
  const recovery = createShooterRoomRecovery({ io, rooms, graceMs, onLeave(socket, roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    leaves.push(socket.id);
    room.players = room.players.filter(player => player.id !== socket.id);
    socket.leave(roomId);
    if (!room.players.length) rooms.delete(roomId);
    else { room.status = 'lobby'; io.to(roomId).emit('player-left', { players: room.players }); }
  } });
  io.on('connection', socket => {
    recovery.resume(socket);
    socket.on('test-join', (_, acknowledge) => {
      let room = rooms.get('ROOM');
      if (!room) { room = { id: 'ROOM', status: 'playing', players: [], score1: 2, score2: 1, roundNumber: 4 }; rooms.set(room.id, room); }
      room.players.push({ id: socket.id, name: socket.data.accountName });
      socket.join(room.id); recovery.joined(socket, room.id);
      acknowledge({ id: socket.id });
    });
    socket.on('hit', (_, acknowledge) => { socket.to('ROOM').emit('test-damage', { damage: 10 }); acknowledge({ accepted: true }); });
    socket.on('leave-room', (_, acknowledge) => { recovery.leave(socket); acknowledge({ left: true }); });
    socket.on('disconnect', reason => recovery.disconnect(socket, reason));
  });
  await new Promise(resolve => http.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${http.address().port}`;
  async function client(key) {
    const socket = connect(origin, { autoConnect: false, reconnection: false, transports: ['websocket'], auth: { accountToken: key.repeat(43) } });
    clients.push(socket);
    const connected = event(socket, 'connect'); socket.connect(); await connected;
    await socket.timeout(2000).emitWithAck('test-join', {});
    return socket;
  }
  return { io, rooms, leaves, identities, client, get authentications() { return authentications; }, async close() {
    for (const socket of clients) socket.disconnect();
    recovery.close();
    await new Promise(resolve => io.close(resolve));
  } };
}

test('two live sockets retain the match during transport recovery, recheck identity, and resume combat', async () => {
  const f = await fixture();
  try {
    const owner = await f.client('a'), friend = await f.client('b');
    const originalId = owner.id, beforeAuth = f.authentications;
    const paused = event(friend, 'room-connection-state', state => state.paused && state.disconnected.includes(originalId));
    owner.io.engine.close();
    await paused;
    assert.equal(f.rooms.get('ROOM').players.length, 2);
    assert.equal(f.leaves.length, 0, 'a transport interruption must not award a disconnect win');
    await assert.rejects(friend.timeout(100).emitWithAck('hit', {}), 'the remaining player cannot shoot a disconnected player');
    f.identities.a = 'UpdatedOwner';
    const resumed = event(friend, 'room-connection-state', state => !state.paused);
    const connected = event(owner, 'connect'); owner.connect(); await connected; await resumed;
    assert.equal(owner.recovered, true);
    assert.equal(owner.id, originalId, 'the same player identity and remote avatar survive reconnect');
    assert.ok(f.authentications > beforeAuth, 'recovery must rerun account authentication middleware');
    assert.equal(f.rooms.get('ROOM').players[0].name, 'UpdatedOwner');
    assert.equal(f.rooms.get('ROOM').score1, 2);
    assert.equal(f.rooms.get('ROOM').roundNumber, 4);
    const damage = event(owner, 'test-damage');
    assert.equal((await friend.timeout(1000).emitWithAck('hit', {})).accepted, true);
    assert.equal((await damage).damage, 10);
  } finally { await f.close(); }
});

test('two live sockets pause for a hidden tab and an explicit leave is immediate', async () => {
  const f = await fixture();
  try {
    const owner = await f.client('a'), friend = await f.client('b');
    const paused = event(friend, 'room-connection-state', state => state.paused && state.hidden.includes(owner.id));
    owner.emit('match-visibility', { hidden: true }); await paused;
    await assert.rejects(friend.timeout(100).emitWithAck('hit', {}));
    const resumed = event(friend, 'room-connection-state', state => !state.paused);
    owner.emit('match-visibility', { hidden: false }); await resumed;
    const left = event(friend, 'player-left');
    await owner.timeout(1000).emitWithAck('leave-room', {}); await left;
    assert.equal(f.leaves.length, 1);
    assert.equal(f.rooms.get('ROOM').players.length, 1);
    assert.equal(f.rooms.get('ROOM').status, 'lobby');
  } finally { await f.close(); }
});

test('recovery grace expires once and late transport restoration cannot resurrect room membership', async () => {
  const f = await fixture(120);
  try {
    const owner = await f.client('a'), friend = await f.client('b');
    const left = event(friend, 'player-left'); owner.io.engine.close(); await left;
    assert.equal(f.leaves.length, 1);
    assert.equal(f.rooms.get('ROOM').players.length, 1);
    const restoredRoom = event(owner, 'room-recovered');
    const connected = event(owner, 'connect'); owner.connect(); await connected;
    assert.equal((await restoredRoom).roomId, null, 'an expired match explicitly reports unavailable recovery');
    assert.equal(f.rooms.get('ROOM').players.length, 1);
    assert.equal(f.leaves.length, 1);
  } finally { await f.close(); }
});

test('the actual engine freezes game state and preserves countdown, zone, reload, fuse and buff time', () => {
  const originalPerformance = globalThis.performance, originalDocument = globalThis.document;
  let now = 39_000;
  const status = { innerText: 'ENGAGE TARGET', style: {} }, timer = {};
  let resets = 0;
  const engine = Object.assign(Object.create(Engine.prototype), {
    networkPaused: false, mode: 'online', gameState: 'playing', matchMode: '1v1',
    roundStartTime: 1000, countdownStart: 500, lastSprintTime: 1000, matchTime: 82,
    mapWidth: 1400, mapHeight: 1400, zone: { active: false, lastDamageTick: 1000 },
    players: [{ reloadStartTime: 38500, lastFiredTime: 38400, lastDashTime: 35000, adrenalineEndTime: 100000, lastUpdateTime: 38990 }],
    grenades: [{ creationTime: 38500 }], keys: { w: true }, mouse: { clicked: true, buttons: { 0: true } },
    network: { resetInterpolation() { resets++; } }, sound: { stopAllAlarms() {} },
  });
  try {
    globalThis.performance = { now: () => now };
    globalThis.document = { getElementById: id => id === 'hud-status' ? status : timer };
    engine.setNetworkPaused(true);
    assert.deepEqual(engine.keys, {});
    assert.equal(engine.mouse.clicked, false);
    now += 75_000;
    engine.update(now);
    engine.updateRoundClock(now);
    assert.equal(engine.matchTime, 82);
    assert.equal(engine.zone.active, false, 'zone onset cannot fire while disconnected');
    engine.setNetworkPaused(false);
    assert.equal(engine.players[0].reloadStartTime, 113500);
    assert.equal(engine.grenades[0].creationTime, 113500);
    assert.equal(engine.players[0].adrenalineEndTime, 175000);
    assert.equal(engine.countdownStart, 75500);
    assert.equal(resets, 1);
    engine.updateRoundClock(now);
    assert.equal(engine.matchTime, 82, '75 seconds offline must not consume round time');
    assert.equal(engine.zone.active, false);
    engine.updateRoundClock(now + 2000);
    assert.equal(engine.matchTime, 80);
    assert.equal(engine.zone.active, true, 'the zone begins after the remaining two active seconds');
  } finally { globalThis.performance = originalPerformance; if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument; }
});

test('offline or paused network updates cannot queue a movement or shooting burst', () => {
  let sent = 0;
  const network = Object.assign(Object.create(Network.prototype), {
    socket: { connected: false, emit() { sent++; } }, engine: { networkPaused: false },
  });
  network.sendState(10000);
  network.sendShoot({});
  network.socket.connected = true;
  network.engine.networkPaused = true;
  network.sendState(10000);
  network.sendShoot({});
  assert.equal(sent, 0);
  assert.equal(SHOOTER_SOCKET_OPTIONS.pingTimeout, 120000);
  assert.equal(SHOOTER_SOCKET_OPTIONS.connectionStateRecovery.skipMiddlewares, false);
});
