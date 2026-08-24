import test from 'node:test';
import assert from 'node:assert/strict';

import {
  advanceBotRoute,
  assignBotTargets,
  assignDistinctTeamSpawns,
  claimCoverPoint,
  createBotRouteState,
  createTeamBlackboards,
  getClaimedCoverPoints,
  getBotRouteEndpointStatus,
  getRecentSighting,
  getTeamBlackboard,
  projectDistinctSpawn,
  recordTeamSighting,
  routeNeedsReplan,
  setBotRoute
} from '../src/game/BotTactics.js';
import { Map as GameMap } from '../src/game/Map.js';
import { getBotNavigation } from '../src/game/BotNavigation.js';

const operative = (id, team, x, y) => ({ id, team, x, y, vx: 0, vy: 0, health: 100 });

test('2v2 target assignment stays stable and distributes living enemies', () => {
  const bots = [operative('bot-b', 2, 900, 100), operative('bot-a', 2, 900, 900)];
  const enemies = [operative('enemy-a', 1, 100, 100), operative('enemy-b', 1, 100, 900)];
  const boards = createTeamBlackboards([...bots, ...enemies]);
  const board = getTeamBlackboard(boards, 2);

  const first = assignBotTargets(bots, enemies, board, 1000);
  assert.equal(first.size, 2);
  assert.equal(new Set([...first.values()].map(enemy => enemy.id)).size, 2, 'squad must split across two threats');

  const second = assignBotTargets([...bots].reverse(), [...enemies].reverse(), board, 1500);
  for (const bot of bots) assert.equal(second.get(bot.id)?.id, first.get(bot.id)?.id, 'assignment must not thrash each frame');

  enemies[0].health = 0;
  const afterDeath = assignBotTargets(bots, enemies, board, 2000);
  assert.deepEqual([...afterDeath.values()].map(enemy => enemy.id), ['enemy-b', 'enemy-b']);
});

test('team blackboard shares recent sightings and expires old intel and cover claims', () => {
  const observer = operative('spotter', 2, 20, 20);
  const target = { ...operative('target', 1, 300, 320), vx: 2, vy: -1 };
  const board = getTeamBlackboard(createTeamBlackboards([observer, target]), 2);
  recordTeamSighting(board, observer, target, 500);
  assert.deepEqual(
    { ...getRecentSighting(board, target.id, 700), seenBy: undefined },
    { targetId: 'target', x: 300, y: 320, vx: 2, vy: -1, seenAt: 500, seenBy: undefined }
  );
  assert.equal(getRecentSighting(board, target.id, 5000), null);

  claimCoverPoint(board, 'spotter', { x: 80, y: 90 }, 1000, 500);
  claimCoverPoint(board, 'wing', { x: 180, y: 190 }, 1000, 500);
  assert.deepEqual(getClaimedCoverPoints(board, 1200, 'spotter'), [{ x: 180, y: 190 }]);
  assert.deepEqual(getClaimedCoverPoints(board, 1600), []);
});

test('per-team spawn counters give 2v2 teammates distinct corners', () => {
  const players = [
    operative('local', 1, 0, 0), operative('enemy-a', 2, 0, 0),
    operative('ally', 1, 0, 0), operative('enemy-b', 2, 0, 0)
  ];
  const assignments = assignDistinctTeamSpawns(players, {
    1: [{ x: 100, y: 100 }, { x: 100, y: 900 }],
    2: [{ x: 900, y: 900 }, { x: 900, y: 100 }]
  }, { 1: 1, 2: 0 });
  assert.notDeepEqual(assignments.get('local'), assignments.get('ally'));
  assert.notDeepEqual(assignments.get('enemy-a'), assignments.get('enemy-b'));
  assert.equal(assignments.get('local').slot, 1);
  assert.equal(assignments.get('ally').slot, 0);
});

test('spawn projection rejects a teammate overlap and uses a clear offset', () => {
  const navigation = {
    projectPoint: (x, y) => ({ x, y }),
    isPointClear: () => true
  };
  const projected = projectDistinctSpawn(navigation, { x: 100, y: 100 }, [{ x: 100, y: 100 }], 18);
  assert.ok(projected);
  assert.ok(Math.hypot(projected.x - 100, projected.y - 100) >= 50);
});

test('route state advances waypoints and replans for moved goals, revisions and stuck bots', () => {
  const route = createBotRouteState();
  const goal = { x: 120, y: 40 };
  setBotRoute(route, [{ x: 10, y: 10 }, { x: 70, y: 30 }, goal], goal, 1000, 4, 'chase');
  assert.deepEqual(advanceBotRoute(route, 10, 10, 12), { x: 70, y: 30 });
  assert.equal(routeNeedsReplan(route, goal, 1200, { navRevision: 4 }), false);
  assert.equal(routeNeedsReplan(route, { x: 200, y: 40 }, 1200, { navRevision: 4 }), true);
  assert.equal(routeNeedsReplan(route, goal, 1200, { navRevision: 5 }), true);
  assert.equal(routeNeedsReplan(route, goal, 1200, { navRevision: 4, stuck: true }), true);
});

test('partial routes never masquerade as arrival and preserve obstruction time across replans', () => {
  const route = createBotRouteState();
  const requested = { x: 200, y: 40 };
  const partial = [{ x: 20, y: 40 }, { x: 110, y: 40 }];
  setBotRoute(route, partial, requested, 1000, 7, 'chase', false);
  assert.equal(route.complete, false);
  assert.deepEqual(getBotRouteEndpointStatus(route, 110, 40, 1200, 10), {
    incomplete: true, atEndpoint: true, blockedFor: 0
  });

  // Replanning to the same reachable frontier must not erase how long it has been blocked.
  setBotRoute(route, partial, requested, 1400, 7, 'chase', false);
  assert.deepEqual(getBotRouteEndpointStatus(route, 110, 40, 1750, 10), {
    incomplete: true, atEndpoint: true, blockedFor: 550
  });

  setBotRoute(route, [...partial, requested], requested, 1800, 8, 'chase', true);
  assert.deepEqual(getBotRouteEndpointStatus(route, 200, 40, 1850, 10), {
    incomplete: false, atEndpoint: false, blockedFor: 0
  });
});

test('every authored spawn pair has a radius-safe route on every arena', () => {
  for (const mapId of ['manor', 'cyberlab', 'arena']) {
    const size = mapId === 'arena' ? 900 : 1400;
    const map = new GameMap(size, size, 0.42, mapId);
    const spawns = [
      { x: 150, y: 150 }, { x: size - 150, y: size - 150 },
      { x: 150, y: size - 150 }, { x: size - 150, y: 150 }
    ];
    const navigation = getBotNavigation(map, spawns);
    const projected = spawns.map(spawn => navigation.projectPoint(spawn.x, spawn.y, 18));
    assert.ok(projected.every(Boolean), `${mapId} must project every authored spawn`);
    for (let from = 0; from < projected.length; from++) {
      for (let to = from + 1; to < projected.length; to++) {
        const path = navigation.findPath(
          projected[from].x, projected[from].y,
          projected[to].x, projected[to].y,
          { radius: 18 }
        );
        assert.ok(path.length >= 2, `${mapId} spawn ${from} -> ${to} is disconnected`);
        for (let index = 1; index < path.length; index++) {
          assert.equal(navigation.hasClearPath(
            path[index - 1].x, path[index - 1].y,
            path[index].x, path[index].y,
            18
          ), true, `${mapId} returned an unsafe route segment`);
        }
      }
    }
  }
});

test('a target-null bot still patrols through navigation and uses swept movement', async () => {
  globalThis.localStorage ||= { getItem: () => null, setItem: () => {} };
  globalThis.document ||= { getElementById: () => null };
  globalThis.window ||= {};
  window.gameEngine = { matchMode: '1v1', isRanked: false, tasks: [], devCheatActive: false };

  const { Player } = await import('../src/game/Player.js');
  const bot = new Player('bot-patrol', 100, 100, 'Patrol', 'pistol', 'red', false, true);
  let sweptMoves = 0;
  const map = {
    width: 600,
    height: 600,
    rooms: [{ x: 20, y: 20, w: 560, h: 560 }],
    walls: [],
    items: [],
    getLineIntersection: () => null,
    checkCircleCollision: (x, y) => ({ x, y }),
    moveCircle: (x, y, dx, dy) => {
      sweptMoves++;
      return { x: x + dx, y: y + dy, collided: false, normalX: 0, normalY: 0 };
    }
  };
  const navigation = {
    obstacleRevision: 1,
    isPointClear: () => true,
    projectPoint: (x, y) => ({ x, y }),
    choosePatrolPoint: () => ({ x: 420, y: 360 }),
    hasClearPath: () => true,
    findPath: (_sx, _sy, tx, ty) => [{ x: 100, y: 100 }, { x: tx, y: ty }]
  };
  bot.update(null, null, map, null, 1000, null, null, { navigation, blackboard: null, teammates: [] });
  assert.equal(bot.botState, 'patrol');
  assert.deepEqual({ x: bot.botTargetX, y: bot.botTargetY }, { x: 420, y: 360 });
  assert.ok(bot.botRoute.waypoints.length > 0);
  assert.equal(sweptMoves, 1);
});

test('bot combat remains disabled during round countdown', async () => {
  globalThis.localStorage ||= { getItem: () => null, setItem: () => {} };
  globalThis.document ||= { getElementById: () => null };
  globalThis.window ||= {};
  window.gameEngine = { matchMode: '1v1', isRanked: false, tasks: [], devCheatActive: false };
  const { Player } = await import('../src/game/Player.js');
  const bot = new Player('bot-countdown', 100, 100, 'Countdown', 'pistol', 'red', false, true);
  const enemy = new Player('enemy', 300, 100, 'Enemy', 'pistol', 'cyan', true, false);
  enemy.team = 1;
  enemy.flashlightActive = true;
  bot.team = 2;
  const map = {
    width: 600, height: 600, rooms: [], walls: [], items: [],
    getLineIntersection: () => null,
    checkCircleCollision: (x, y) => ({ x, y }),
    moveCircle: (x, y, dx, dy) => ({ x: x + dx, y: y + dy, collided: false, normalX: 0, normalY: 0 })
  };
  const navigation = {
    obstacleRevision: 1,
    isPointClear: () => true,
    projectPoint: (x, y) => ({ x, y }),
    choosePatrolPoint: () => ({ x: 200, y: 200 }),
    hasClearPath: () => true,
    findPath: (_sx, _sy, tx, ty) => [{ x: bot.x, y: bot.y }, { x: tx, y: ty }]
  };
  const ammoBefore = bot.ammoInMag;
  bot.update(null, null, map, null, 1000, enemy, enemy, { navigation, teammates: [], combatEnabled: false });
  bot.update(null, null, map, null, 2000, enemy, enemy, { navigation, teammates: [], combatEnabled: false });
  assert.equal(bot.ammoInMag, ammoBefore, 'countdown bot fired before ENGAGE');
});
