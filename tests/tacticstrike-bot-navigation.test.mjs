import test from 'node:test';
import assert from 'node:assert/strict';

import { Map } from '../src/game/Map.js';
import { getBotNavigation } from '../src/game/BotNavigation.js';

const MAP_FIXTURES = Object.freeze([
  { id: 'manor', size: 1400 },
  { id: 'cyberlab', size: 1400 },
  { id: 'arena', size: 900 },
]);

const EXPECTED_CONNECTIONS = Object.freeze([
  '0-1', '0-3', '1-2', '1-4', '2-5', '3-4',
  '3-6', '4-5', '4-7', '5-8', '6-7', '7-8',
]);

function connectionKey(connection) {
  return connection.rooms.join('-');
}

function assertApproximately(actual, expected, epsilon = 1e-6, message = '') {
  assert.ok(Math.abs(actual - expected) <= epsilon, message || `${actual} was not within ${epsilon} of ${expected}`);
}

function assertPathClear(navigation, path, radius = navigation.agentRadius) {
  assert.ok(path.length > 0, 'expected a non-empty navigation path');
  for (const point of path) {
    assert.equal(navigation.isPointClear(point.x, point.y, radius), true,
      `path point ${point.x},${point.y} overlaps an obstacle`);
  }
  for (let index = 1; index < path.length; index++) {
    const previous = path[index - 1];
    const point = path[index];
    assert.equal(navigation.hasClearPath(previous.x, previous.y, point.x, point.y, radius), true,
      `path segment ${previous.x},${previous.y} -> ${point.x},${point.y} clips an obstacle`);
  }
}

function crateSignature(map) {
  return map.walls
    .filter((wall) => wall.type === 'crate')
    .map((wall) => [wall.id, wall.x, wall.y, wall.w, wall.h]);
}

function cornerSpawns(size) {
  return [
    { x: 150, y: 150 },
    { x: size - 150, y: size - 150 },
    { x: 150, y: size - 150 },
    { x: size - 150, y: 150 },
  ];
}

test('shared typed navigation memory describes all authored rooms, doors and tactical fields', () => {
  for (const fixture of MAP_FIXTURES) {
    const map = new Map(fixture.size, fixture.size, 2, fixture.id);
    const spawns = [
      { id: 'alpha', x: 150, y: 150 },
      { id: 'omega', x: fixture.size - 150, y: fixture.size - 150 },
    ];
    const navigation = getBotNavigation(map, spawns);
    assert.equal(getBotNavigation(map, spawns), navigation, `${fixture.id} did not reuse its map-shared cache`);
    assert.equal(getBotNavigation(map), navigation, `${fixture.id} did not reuse its read-only map cache`);
    const snapshot = navigation.snapshot();

    assert.ok(snapshot.cellSize >= 24 && snapshot.cellSize <= 28);
    assert.equal(snapshot.obstacleRevision, map.navigationRevision);
    assert.equal(snapshot.rooms.length, 9);
    assert.deepEqual(snapshot.rooms.map(({ x, y, w, h, name }) => ({ x, y, w, h, name })),
      map.rooms.map(({ x, y, w, h, name }) => ({ x, y, w, h, name })));
    assert.deepEqual(snapshot.connections.map(connectionKey).sort(), [...EXPECTED_CONNECTIONS].sort(),
      `${fixture.id} room graph lost or invented a connection`);
    assert.equal(snapshot.doorways.length, 12);
    assert.ok(snapshot.memory.walkable instanceof Uint8Array);
    assert.ok(snapshot.memory.components instanceof Int32Array);
    assert.ok(snapshot.memory.neighborMask instanceof Uint8Array);
    assert.equal(snapshot.memory.walkable.length, snapshot.cols * snapshot.rows);
    assert.equal(snapshot.memory.components.length, snapshot.memory.walkable.length);
    assert.equal(snapshot.spawns.length, 2);
    assert.ok(snapshot.spawns.every((spawn) => navigation.isPointClear(spawn.x, spawn.y)));
    assert.ok(snapshot.safePatrolPoints.length >= snapshot.rooms.length);
    assert.ok(snapshot.safePatrolPoints.every((point) => navigation.isPointClear(point.x, point.y)));
    assert.ok(snapshot.coverCandidates.length > 0);
    assert.ok(snapshot.coverCandidates.every((point) => navigation.isPointClear(point.x, point.y)));
    assert.ok(Array.isArray(snapshot.deadEnds));
    assert.ok(Array.isArray(snapshot.deadEndRooms));
  }
});

test('off-centre Manor doorway metadata is inferred from the authored wall openings', () => {
  const map = new Map(1400, 1400, 2, 'manor');
  const navigation = getBotNavigation(map);
  const expected = new globalThis.Map([
    ['3-4', { x: 491, y: 635 }],
    ['1-4', { x: 662, y: 471 }],
    ['4-5', { x: 971, y: 767 }],
    ['4-7', { x: 800, y: 931 }],
  ]);
  for (const [rooms, point] of expected) {
    const doorway = navigation.doorways.find((candidate) => connectionKey(candidate) === rooms);
    assert.ok(doorway, `missing Manor doorway ${rooms}`);
    assertApproximately(doorway.x, point.x);
    assertApproximately(doorway.y, point.y);
    assert.ok(doorway.width >= 80 && doorway.width <= 88);
  }
});

test('radius-clear A* crosses vertical room rows on every map and smoothing preserves safe segments', () => {
  for (const fixture of MAP_FIXTURES) {
    const map = new Map(fixture.size, fixture.size, 2, fixture.id);
    const navigation = getBotNavigation(map);
    const start = navigation.safePatrolPoints.find((point) => point.roomIndex === 0);
    const target = navigation.safePatrolPoints.find((point) => point.roomIndex === 6);
    assert.ok(start && target, `${fixture.id} lacks room patrol fixtures`);
    const rawPath = navigation.findPath(start.x, start.y, target.x, target.y, { smooth: false });
    const smoothPath = navigation.findPath(start.x, start.y, target.x, target.y);
    assertPathClear(navigation, rawPath);
    assertPathClear(navigation, smoothPath);
    assert.ok(smoothPath.length <= rawPath.length, `${fixture.id} smoothing added waypoints`);
    assert.equal(smoothPath.at(-1).x, target.x);
    assert.equal(smoothPath.at(-1).y, target.y);
    assert.ok(smoothPath.some((point) => point.y > map.rooms[3].y),
      `${fixture.id} route never crossed into a lower room row`);
  }
});

test('the runtime radius returns a safe route for every authored spawn pair', () => {
  const radius = 18;
  for (const fixture of MAP_FIXTURES) {
    const map = new Map(fixture.size, fixture.size, 2, fixture.id);
    const spawns = cornerSpawns(fixture.size);
    const navigation = getBotNavigation(map, spawns);
    for (let startIndex = 0; startIndex < spawns.length; startIndex++) {
      for (let targetIndex = startIndex + 1; targetIndex < spawns.length; targetIndex++) {
        const path = navigation.findPath(
          spawns[startIndex].x,
          spawns[startIndex].y,
          spawns[targetIndex].x,
          spawns[targetIndex].y,
          { radius },
        );
        assertPathClear(navigation, path, radius);
        const projectedStart = navigation.projectPoint(spawns[startIndex].x, spawns[startIndex].y, radius);
        const projectedTarget = navigation.projectPoint(spawns[targetIndex].x, spawns[targetIndex].y, radius);
        if (projectedStart.component === projectedTarget.component) {
          assertApproximately(path.at(-1).x, projectedTarget.x, 1e-6,
            `${fixture.id} spawn ${startIndex}-${targetIndex} stopped short of its reachable target`);
          assertApproximately(path.at(-1).y, projectedTarget.y, 1e-6,
            `${fixture.id} spawn ${startIndex}-${targetIndex} stopped short of its reachable target`);
        }
      }
    }
  }
});

test('runtime-radius A* consumes cached neighbor edges while larger movers keep exact checks', () => {
  const map = new Map(1400, 1400, 2, 'cyberlab');
  const navigation = getBotNavigation(map);
  const start = navigation.projectPoint(150, 150, 18);
  const target = navigation.projectPoint(1250, 1250, 18);

  const measuredPath = (radius) => {
    const originalSegmentClear = navigation._segmentClear;
    const originalCellWalkable = navigation._cellWalkable;
    let segmentChecks = 0;
    let cellChecks = 0;
    navigation._segmentClear = (...args) => {
      segmentChecks++;
      return originalSegmentClear.call(navigation, ...args);
    };
    navigation._cellWalkable = (...args) => {
      cellChecks++;
      return originalCellWalkable.call(navigation, ...args);
    };
    try {
      return {
        path: navigation.findPath(start.x, start.y, target.x, target.y, { radius, smooth: false }),
        get segmentChecks() { return segmentChecks; },
        get cellChecks() { return cellChecks; },
      };
    } finally {
      navigation._segmentClear = originalSegmentClear;
      navigation._cellWalkable = originalCellWalkable;
    }
  };

  const cached = measuredPath(18);
  const larger = measuredPath(19);
  assertPathClear(navigation, cached.path, 18);
  assertPathClear(navigation, larger.path, 19);
  assert.ok(cached.segmentChecks <= cached.path.length + 4,
    `cached A* repeated ${cached.segmentChecks} wall scans for ${cached.path.length} path points`);
  assert.ok(cached.cellChecks <= 4,
    `cached A* repeated ${cached.cellChecks} cell-clearance checks`);
  assert.ok(larger.segmentChecks > cached.segmentChecks * 5,
    'larger-radius routing did not retain its exact swept-clearance fallback');
  assert.ok(larger.cellChecks > cached.cellChecks * 5,
    'larger-radius routing did not retain its point-clearance fallback');
});

test('blocked raw Cyberlab spawns project safely and never append a wall-crossing endpoint', () => {
  const map = new Map(1400, 1400, 2, 'cyberlab');
  const navigation = getBotNavigation(map, [
    { x: 150, y: 150 },
    { x: 1250, y: 1250 },
  ]);
  assert.equal(navigation.isPointClear(150, 150), false, 'fixture must begin inside authored furniture clearance');
  assert.equal(navigation.spawns[0].projected, true);
  const path = navigation.findPath(150, 150, 1250, 1250);
  assertPathClear(navigation, path);
  assert.ok(path.length >= 3, 'cross-map Cyberlab route was not meaningfully navigated');
  assert.equal(path.at(-1).x, 1250);
  assert.equal(path.at(-1).y, 1250);
});

test('swept circle movement prevents low-FPS and dash tunnelling while preserving door slides', () => {
  const map = new Map(900, 900, 2, 'arena');
  const navigation = getBotNavigation(map);

  const blocked = map.moveCircle(220, 100, 180, 0, 18);
  assert.equal(blocked.collided, true);
  assert.ok(blocked.x <= 262 + 1e-5, `dash crossed the 20px divider (${blocked.x})`);
  assert.equal(navigation.isPointClear(blocked.x, blocked.y, 18), true);

  const doorway = map.moveCircle(250, 160, 80, 0, 18);
  assert.equal(doorway.collided, false);
  assertApproximately(doorway.x, 330);
  assertApproximately(doorway.y, 160);

  const jamb = map.moveCircle(250, 137, 80, 0, 18);
  assert.equal(jamb.collided, true, 'door jamb was not detected by the swept circle');
  assert.equal(navigation.isPointClear(jamb.x, jamb.y, 18), true, 'jamb slide ended embedded');
});

test('circle depenetration recovers wall centres and exterior-wall starts', () => {
  const map = new Map(900, 900, 2, 'arena');
  const navigation = getBotNavigation(map);
  const divider = map.moveCircle(290, 100, 0, 0, 18);
  assert.equal(divider.collided, true);
  assert.equal(navigation.isPointClear(divider.x, divider.y, 18), true);
  assert.ok(divider.x <= 262 + 1e-5 || divider.x >= 318 - 1e-5);

  const exterior = map.moveCircle(20, 100, 0, 0, 18);
  assert.equal(exterior.collided, true);
  assert.ok(exterior.x >= 58 - 1e-5, `exterior depenetration remained in the border wall (${exterior.x})`);
  assert.equal(navigation.isPointClear(exterior.x, exterior.y, 18), true);

  const legacyEndpoint = map.checkCircleCollision(20, 100, 18);
  assert.ok(legacyEndpoint.x >= 58 - 1e-5, 'legacy endpoint resolver did not inherit reliable depenetration');

  const manor = new Map(1400, 1400, 1, 'manor');
  const manorNavigation = getBotNavigation(manor);
  for (const [x, y] of [[460, 70], [475, 100], [491, 100]]) {
    const recovered = manor.moveCircle(x, y, 0, 0, 18);
    assert.equal(recovered.collided, true);
    assert.equal(manorNavigation.isPointClear(recovered.x, recovered.y, 18), true,
      `narrow-gap depenetration left ${x},${y} embedded at ${recovered.x},${recovered.y}`);
  }
});

test('crate destruction invalidates shared memory and opens the sealed Arena doorway', () => {
  const map = new Map(900, 900, 1, 'arena');
  const navigation = getBotNavigation(map);
  const initialRevision = map.navigationRevision;
  const initialMemory = navigation.walkable;
  const connection = navigation.connections.find((candidate) => connectionKey(candidate) === '6-7');
  assert.ok(connection?.blocked, 'seed 1 must reproduce the crate_8 sealed doorway');
  assert.equal(navigation.hasClearPath(230, 741, 330, 741), false);
  assert.equal(navigation.walkable, initialMemory, 'read-only queries rebuilt shared navigation memory');
  const survivingCrate = map.walls.find((wall) => wall.type === 'crate' && wall.id !== 'crate_8');
  assert.ok(survivingCrate);
  map.damageCrate(survivingCrate.id, 1);
  assert.equal(map.navigationRevision, initialRevision, 'non-breaking crate damage changed topology revision');
  assert.equal(navigation.walkable, initialMemory, 'non-breaking damage rebuilt shared navigation memory');
  const blockedPath = navigation.findPath(230, 741, 330, 741);
  assertPathClear(navigation, blockedPath);
  assert.notDeepEqual([blockedPath.at(-1).x, blockedPath.at(-1).y], [330, 741]);

  const result = map.damageCrate('crate_8', 50);
  assert.equal(result?.broken, true);
  assert.equal(map.navigationRevision, initialRevision + 1);
  assert.equal(navigation.hasClearPath(230, 741, 330, 741), true,
    'held navigation object did not synchronize after topology revision');
  assert.equal(navigation.obstacleRevision, map.navigationRevision);
  assert.notEqual(navigation.walkable, initialMemory, 'topology change retained stale typed navigation memory');
  const opened = navigation.connections.find((candidate) => connectionKey(candidate) === '6-7');
  assert.equal(opened?.blocked, false);
  const directPath = navigation.findPath(230, 741, 330, 741);
  assertPathClear(navigation, directPath);
  assert.equal(directPath.length, 2);
});

test('round-index layouts are reproducible and isolated from gameplay drop randomness', () => {
  const map = new Map(900, 900, 3, 'arena');
  map.generateMap(4);
  const first = crateSignature(map);
  const crate = map.walls.find((wall) => wall.type === 'crate');
  assert.ok(crate);
  map.damageCrate(crate.id, 100);
  map.generateMap(4);
  assert.deepEqual(crateSignature(map), first,
    'rebuilding the same round changed after gameplay RNG was consumed');
});

test('projection, patrol, avoidance and claimed cover outputs remain navigable', () => {
  const map = new Map(1400, 1400, 2, 'manor');
  const navigation = getBotNavigation(map);
  const room = map.rooms[4];
  const blockedCenter = { x: room.x + room.w / 2, y: room.y + room.h / 2 };
  assert.equal(navigation.isPointClear(blockedCenter.x, blockedCenter.y), false);
  const projected = navigation.projectPoint(blockedCenter.x, blockedCenter.y);
  assert.ok(projected?.projected);
  assert.equal(navigation.isPointClear(projected.x, projected.y), true);

  const patrol = navigation.choosePatrolPoint(projected.x, projected.y, () => 0.5);
  assert.ok(patrol);
  assert.equal(navigation.isPointClear(patrol.x, patrol.y), true);
  assertPathClear(navigation, navigation.findPath(projected.x, projected.y, patrol.x, patrol.y));

  const avoidanceMap = new Map(900, 900, 2, 'arena');
  const avoidanceNavigation = getBotNavigation(avoidanceMap);
  const direct = avoidanceNavigation.findPath(100, 160, 220, 160);
  const avoided = avoidanceNavigation.findPath(100, 160, 220, 160, {
    avoidPoints: [{ x: 160, y: 160, radius: 55, hard: true }],
  });
  assert.equal(direct.length, 2);
  assertPathClear(avoidanceNavigation, avoided);
  assert.ok(avoided.length > direct.length);
  assert.ok(avoided.every((point) => Math.hypot(point.x - 160, point.y - 160) >= 55 - 1e-6));

  const cover = navigation.findCoverPoint(150, 150, 1250, 1250, { maxDistance: 900 });
  assert.ok(cover);
  assert.equal(navigation.isPointClear(cover.x, cover.y), true);
  assertPathClear(navigation, cover.path);
  const alternate = navigation.findCoverPoint(150, 150, 1250, 1250, {
    maxDistance: 900,
    claimed: [cover],
    claimRadius: 40,
  });
  assert.ok(alternate);
  assert.notEqual(alternate.index, cover.index);
  assert.ok(Math.hypot(alternate.x - cover.x, alternate.y - cover.y) >= 40);
});
