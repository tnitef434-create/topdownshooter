import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const baseUrl = process.argv[2] || process.env.TACTICSTRIKE_TEST_URL || 'http://127.0.0.1:4178/';
const executablePath = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

const pageErrors = [];
const results = [];

try {
  const scenarios = [
    { mode: '1v1', mapId: 'manor' },
    { mode: '2v2', mapId: 'manor' },
    { mode: '2v2', mapId: 'cyberlab' },
    { mode: '2v2', mapId: 'arena' },
  ];
  for (const { mode, mapId } of scenarios) {
    const scenario = `${mode}-${mapId}`;
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    page.on('pageerror', (error) => pageErrors.push(`${scenario}: ${error.stack || error.message}`));
    await page.evaluateOnNewDocument((selectedMap) => {
      localStorage.setItem('tacticstrike_selected_map', selectedMap);
      localStorage.setItem('tacticstrike_player_weapon', 'rifle');
      // Skip the deployment movie and audio in deterministic headless QA.
      HTMLMediaElement.prototype.play = function playForTest() {
        return Promise.reject(new DOMException('Media disabled by browser smoke test', 'NotAllowedError'));
      };
    }, mapId);

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForSelector('#btn-deploy-main', { timeout: 15_000 });
    await page.evaluate(({ selectedMap, selectedMode }) => {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => modal.classList.remove('active'));
      const modeInput = document.querySelector(`.match-mode-input[value="${selectedMode}"]`);
      modeInput.checked = true;
      modeInput.dispatchEvent(new Event('change', { bubbles: true }));
      const mapSelect = document.querySelector('#qp-map-select');
      if (![...mapSelect.options].some((option) => option.value === selectedMap)) {
        mapSelect.add(new Option(selectedMap.toUpperCase(), selectedMap));
      }
      mapSelect.value = selectedMap;
      mapSelect.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('#btn-deploy-main').click();
    }, { selectedMap: mapId, selectedMode: mode });
    await page.waitForFunction(() => document.querySelector('#deploy-modal')?.classList.contains('active'));
    await page.evaluate(() => document.querySelector('#btn-practice-bot')?.click());
    await page.waitForFunction((expectedPlayers) => (
      window.gameEngine?.mode === 'offline'
      && window.gameEngine.players?.length === expectedPlayers
      && window.gameEngine.botNavigation
    ), { timeout: 20_000 }, mode === '2v2' ? 4 : 2);

    const initial = await page.evaluate(() => {
      const engine = window.gameEngine;
      engine.gameState = 'countdown';
      engine.countdownStart = performance.now() + 1_000_000;
      const snapshot = engine.botNavigation.snapshot();
      return {
        bots: engine.players.filter((player) => player.isBot).map((player) => ({
          id: player.id,
          x: player.x,
          y: player.y,
        })),
        memory: {
          rooms: snapshot.rooms.length,
          doors: snapshot.doorways.length,
          connections: snapshot.connections.length,
          cover: snapshot.coverCandidates.length,
          spawns: snapshot.spawns.length,
        },
      };
    });

    const expectedBots = mode === '2v2' ? 3 : 1;
    assert.equal(initial.bots.length, expectedBots, `${scenario}: unexpected training bot count`);
    assert.equal(initial.memory.rooms, 9, `${scenario}: map memory lost authored rooms`);
    assert.equal(initial.memory.doors, 12, `${scenario}: map memory lost doorways`);
    assert.equal(initial.memory.connections, 12, `${scenario}: map memory lost room connections`);
    assert.ok(initial.memory.cover > 0, `${scenario}: map memory has no cover positions`);
    assert.equal(initial.memory.spawns, 4, `${scenario}: map memory lost projected spawns`);

    const samples = [];
    for (let index = 0; index < 42; index++) {
      await delay(100);
      samples.push(await page.evaluate(() => {
        const engine = window.gameEngine;
        engine.gameState = 'countdown';
        engine.countdownStart = performance.now() + 1_000_000;
        return engine.players.filter((player) => player.isBot).map((player) => ({
          id: player.id,
          x: player.x,
          y: player.y,
          vx: player.vx,
          vy: player.vy,
          clear: engine.botNavigation.isPointClear(player.x, player.y, player.radius),
          routePoints: player.botRoute?.waypoints?.length || 0,
          routeFinite: (player.botRoute?.waypoints || []).every((point) => (
            Number.isFinite(point.x) && Number.isFinite(point.y)
          )),
        }));
      }));
    }

    for (const frame of samples) {
      for (const bot of frame) {
        assert.equal(bot.clear, true, `${scenario}: ${bot.id} overlapped a wall`);
        assert.equal(bot.routeFinite, true, `${scenario}: ${bot.id} produced an invalid route`);
        assert.ok(Number.isFinite(bot.x) && Number.isFinite(bot.y), `${scenario}: ${bot.id} position became invalid`);
      }
    }

    const lastById = new Map(samples.at(-1).map((bot) => [bot.id, bot]));
    for (const bot of initial.bots) {
      const last = lastById.get(bot.id);
      assert(last, `${scenario}: ${bot.id} disappeared during simulation`);
      const distance = Math.hypot(last.x - bot.x, last.y - bot.y);
      assert.ok(distance > 8, `${scenario}: ${bot.id} failed to navigate (${distance.toFixed(2)}px)`);
    }

    const combatSetup = await page.evaluate(() => {
      const engine = window.gameEngine;
      const local = engine.localPlayer;
      const shooter = engine.players.find((player) => player.isBot && player.team !== local.team && player.health > 0);
      if (!shooter) return null;
      engine.players.forEach((player) => {
        player.takeDamage = () => {};
      });
      const nav = engine.botNavigation;
      let firingLane = null;
      for (const radius of [170, 120, 220]) {
        for (let index = 0; index < 12; index++) {
          const angle = index / 12 * Math.PI * 2;
          const point = nav.projectPoint(
            shooter.x + Math.cos(angle) * radius,
            shooter.y + Math.sin(angle) * radius,
            local.radius,
          );
          if (point && nav.hasClearPath(shooter.x, shooter.y, point.x, point.y, 1)) {
            firingLane = point;
            break;
          }
        }
        if (firingLane) break;
      }
      if (!firingLane) return null;
      local.x = firingLane.x;
      local.y = firingLane.y;
      local.vx = 0.8;
      local.vy = 0;
      local.flashlightActive = true;
      engine.gameState = 'playing';
      engine.roundStartTime = performance.now();
      engine.matchTime = 999;
      return { shooterId: shooter.id, previousShot: shooter.lastFiredTime };
    });
    assert(combatSetup, `${scenario}: could not establish a safe combat lane`);
    await page.waitForFunction(({ shooterId, previousShot }) => {
      const shooter = window.gameEngine?.players?.find((player) => player.id === shooterId);
      return shooter && shooter.lastFiredTime > previousShot;
    }, { timeout: 5_000 }, combatSetup);
    await page.evaluate(() => {
      window.gameEngine.gameState = 'countdown';
      window.gameEngine.countdownStart = performance.now() + 1_000_000;
    });

    const tactical = await page.evaluate(() => {
      const engine = window.gameEngine;
      const enemyBoard = engine.botBlackboards.get(2);
      const assignments = [...(enemyBoard?.assignments?.values() || [])];
      const nav = engine.botNavigation;
      const patrol = nav.safePatrolPoints;
      const started = performance.now();
      let completed = 0;
      for (let index = 0; index < 120; index++) {
        const from = patrol[index % patrol.length];
        const to = patrol[(index * 17 + 11) % patrol.length];
        if (nav.findPath(from.x, from.y, to.x, to.y, { radius: 18 }).length) completed++;
      }
      return {
        assignmentCount: assignments.length,
        distinctTargets: new Set(assignments.map((assignment) => assignment.targetId)).size,
        completed,
        averagePathMs: (performance.now() - started) / 120,
      };
    });
    const expectedAssignments = mode === '2v2' ? 2 : 1;
    assert.equal(tactical.assignmentCount, expectedAssignments, `${scenario}: enemy assignment count is wrong`);
    assert.equal(tactical.distinctTargets, expectedAssignments, `${scenario}: enemy target coordination is wrong`);
    assert.equal(tactical.completed, 120, `${scenario}: browser path benchmark found an unreachable patrol pair`);
    assert.ok(tactical.averagePathMs < 8,
      `${scenario}: path planning is too slow (${tactical.averagePathMs.toFixed(2)}ms average)`);

    results.push({ mode, mapId, ...tactical });
    await page.close();
  }

  assert.deepEqual(pageErrors, [], `Browser errors:\n${pageErrors.join('\n')}`);
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
