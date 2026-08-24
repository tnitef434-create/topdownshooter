export const BOT_SIGHT_MEMORY_MS = 4200;
export const BOT_ASSIGNMENT_HOLD_MS = 900;

const idOf = value => String(value?.id ?? value ?? '');
const distanceSq = (a, b) => {
  const dx = (a?.x || 0) - (b?.x || 0);
  const dy = (a?.y || 0) - (b?.y || 0);
  return dx * dx + dy * dy;
};

export function createTeamBlackboards(players = [], now = 0) {
  const boards = new Map();
  for (const player of players) {
    if (!boards.has(player.team)) {
      boards.set(player.team, {
        team: player.team,
        sightings: new Map(),
        assignments: new Map(),
        coverClaims: new Map(),
        updatedAt: now
      });
    }
  }
  return boards;
}

export function getTeamBlackboard(boards, team) {
  return boards?.get?.(team) || null;
}

export function recordTeamSighting(board, observer, target, now) {
  if (!board || !target || target.health <= 0) return null;
  const targetId = idOf(target);
  const previous = board.sightings.get(targetId);
  const seenBy = new Set(previous?.seenBy || []);
  seenBy.add(idOf(observer));
  const sighting = {
    targetId,
    x: target.x,
    y: target.y,
    vx: Number.isFinite(target.vx) ? target.vx : 0,
    vy: Number.isFinite(target.vy) ? target.vy : 0,
    seenAt: now,
    seenBy
  };
  board.sightings.set(targetId, sighting);
  board.updatedAt = now;
  return sighting;
}

export function getRecentSighting(board, targetId, now, maxAge = BOT_SIGHT_MEMORY_MS) {
  const sighting = board?.sightings?.get?.(idOf(targetId));
  return sighting && now - sighting.seenAt <= maxAge ? sighting : null;
}

export function pruneTeamBlackboard(board, now, aliveEnemyIds = null) {
  if (!board) return;
  const alive = aliveEnemyIds ? new Set([...aliveEnemyIds].map(idOf)) : null;
  for (const [targetId, sighting] of board.sightings) {
    if (now - sighting.seenAt > BOT_SIGHT_MEMORY_MS || (alive && !alive.has(targetId))) {
      board.sightings.delete(targetId);
    }
  }
  for (const [botId, assignment] of board.assignments) {
    if ((alive && !alive.has(assignment.targetId)) || now > assignment.expiresAt + BOT_SIGHT_MEMORY_MS) {
      board.assignments.delete(botId);
    }
  }
  for (const [botId, claim] of board.coverClaims) {
    if (now > claim.expiresAt) board.coverClaims.delete(botId);
  }
}

/** Stable, load-balanced assignments. With two bots/two enemies, each bot gets a distinct target. */
export function assignBotTargets(bots = [], enemies = [], board, now = 0) {
  const livingBots = bots.filter(bot => bot?.health > 0).sort((a, b) => idOf(a).localeCompare(idOf(b)));
  const livingEnemies = enemies.filter(enemy => enemy?.health > 0).sort((a, b) => idOf(a).localeCompare(idOf(b)));
  const result = new Map();
  if (!board || livingBots.length === 0 || livingEnemies.length === 0) return result;

  const enemiesById = new Map(livingEnemies.map(enemy => [idOf(enemy), enemy]));
  pruneTeamBlackboard(board, now, enemiesById.keys());
  const used = new Set();

  // Hold valid assignments briefly so bots do not swap targets every frame.
  for (const bot of livingBots) {
    const botId = idOf(bot);
    const assignment = board.assignments.get(botId);
    const enemy = assignment && enemiesById.get(assignment.targetId);
    if (enemy && assignment.expiresAt >= now && !used.has(assignment.targetId)) {
      result.set(botId, enemy);
      used.add(assignment.targetId);
    }
  }

  for (const bot of livingBots) {
    const botId = idOf(bot);
    if (result.has(botId)) continue;
    let pool = livingEnemies.filter(enemy => !used.has(idOf(enemy)));
    if (pool.length === 0) pool = livingEnemies;
    pool.sort((a, b) => {
      const sightA = getRecentSighting(board, a.id, now) || a;
      const sightB = getRecentSighting(board, b.id, now) || b;
      return distanceSq(bot, sightA) - distanceSq(bot, sightB) || idOf(a).localeCompare(idOf(b));
    });
    const enemy = pool[0];
    const targetId = idOf(enemy);
    result.set(botId, enemy);
    used.add(targetId);
    board.assignments.set(botId, { targetId, assignedAt: now, expiresAt: now + BOT_ASSIGNMENT_HOLD_MS });
  }
  board.updatedAt = now;
  return result;
}

export function getClaimedCoverPoints(board, now, excludingBotId = null) {
  if (!board) return [];
  pruneTeamBlackboard(board, now);
  const excluded = idOf(excludingBotId);
  return [...board.coverClaims.entries()]
    .filter(([botId]) => botId !== excluded)
    .map(([, claim]) => ({ x: claim.x, y: claim.y }));
}

export function claimCoverPoint(board, botId, point, now, ttl = 1600) {
  if (!board || !point) return null;
  const claim = { x: point.x, y: point.y, expiresAt: now + ttl };
  board.coverClaims.set(idOf(botId), claim);
  return claim;
}

export function releaseCoverClaim(board, botId) {
  board?.coverClaims?.delete?.(idOf(botId));
}

export function assignDistinctTeamSpawns(players = [], teamSpawns, startIndices = {}) {
  const counters = new Map();
  const result = new Map();
  for (const player of players) {
    const options = teamSpawns instanceof Map ? teamSpawns.get(player.team) : teamSpawns?.[player.team];
    if (!options?.length) continue;
    const count = counters.get(player.team) || 0;
    const start = startIndices instanceof Map ? (startIndices.get(player.team) || 0) : (startIndices?.[player.team] || 0);
    const slot = (start + count) % options.length;
    const spawn = options[slot];
    result.set(idOf(player), { x: spawn.x, y: spawn.y, slot });
    counters.set(player.team, count + 1);
  }
  return result;
}

export function projectDistinctSpawn(navigation, spawn, occupied = [], radius = 18) {
  const spacing = radius * 2 + 14;
  const offsets = [
    [0, 0], [spacing, 0], [-spacing, 0], [0, spacing], [0, -spacing],
    [spacing, spacing], [-spacing, spacing], [spacing, -spacing], [-spacing, -spacing],
    [spacing * 2, 0], [-spacing * 2, 0], [0, spacing * 2], [0, -spacing * 2]
  ];
  for (const [ox, oy] of offsets) {
    const projected = navigation?.projectPoint?.(spawn.x + ox, spawn.y + oy, radius) || null;
    if (!projected) continue;
    if (navigation?.isPointClear && !navigation.isPointClear(projected.x, projected.y, radius)) continue;
    if (occupied.every(point => Math.hypot(point.x - projected.x, point.y - projected.y) >= spacing)) {
      return { x: projected.x, y: projected.y };
    }
  }
  return null;
}

export function createBotRouteState() {
  return {
    waypoints: [],
    index: 0,
    target: null,
    plannedAt: -Infinity,
    navRevision: null,
    purpose: 'idle',
    complete: false,
    partialEndpoint: null,
    partialSince: null,
    dirty: true
  };
}

export function invalidateBotRoute(route) {
  if (route) route.dirty = true;
}

export function setBotRoute(route, waypoints, target, now, navRevision, purpose = 'move', complete = true) {
  const previousPartialEndpoint = route.partialEndpoint;
  const previousPartialSince = route.partialSince;
  route.waypoints = (waypoints || []).filter(point => Number.isFinite(point?.x) && Number.isFinite(point?.y));
  route.index = 0;
  route.target = target ? { x: target.x, y: target.y } : null;
  route.plannedAt = now;
  route.navRevision = navRevision;
  route.purpose = purpose;
  route.complete = complete;
  const endpoint = route.waypoints.at(-1) || null;
  const samePartialEndpoint = !complete && endpoint && previousPartialEndpoint &&
    Math.hypot(endpoint.x - previousPartialEndpoint.x, endpoint.y - previousPartialEndpoint.y) < 12;
  route.partialEndpoint = complete || !endpoint ? null : { x: endpoint.x, y: endpoint.y };
  route.partialSince = samePartialEndpoint ? previousPartialSince : null;
  route.dirty = false;
  return route;
}

export function getBotRouteEndpointStatus(route, x, y, now, threshold = 24) {
  if (!route || route.complete || !route.partialEndpoint) {
    return { incomplete: false, atEndpoint: false, blockedFor: 0 };
  }
  const atEndpoint = Math.hypot(x - route.partialEndpoint.x, y - route.partialEndpoint.y) <= threshold;
  if (!atEndpoint) {
    route.partialSince = null;
    return { incomplete: true, atEndpoint: false, blockedFor: 0 };
  }
  if (!Number.isFinite(route.partialSince)) route.partialSince = now;
  return { incomplete: true, atEndpoint: true, blockedFor: Math.max(0, now - route.partialSince) };
}

export function routeNeedsReplan(route, target, now, options = {}) {
  if (!route || route.dirty || !route.target || !route.waypoints.length || !target) return true;
  const targetTolerance = options.targetTolerance ?? 42;
  if (Math.hypot(route.target.x - target.x, route.target.y - target.y) > targetTolerance) return true;
  if (now - route.plannedAt > (options.maxAge ?? 1100)) return true;
  if (options.stuck) return true;
  if (options.navRevision != null && route.navRevision !== options.navRevision) return true;
  return false;
}

export function advanceBotRoute(route, x, y, threshold = 24) {
  if (!route?.waypoints?.length) return route?.target || null;
  while (route.index < route.waypoints.length - 1) {
    const point = route.waypoints[route.index];
    if (Math.hypot(x - point.x, y - point.y) > threshold) break;
    route.index++;
  }
  return route.waypoints[Math.min(route.index, route.waypoints.length - 1)] || route.target;
}

export function predictAimPoint(shooter, target, bulletSpeed, maxLeadFrames = 36) {
  const speed = Math.max(1, Number(bulletSpeed) || 1);
  const dx = target.x - shooter.x;
  const dy = target.y - shooter.y;
  const travelFrames = Math.min(maxLeadFrames, Math.max(0, Math.hypot(dx, dy) - 22) / speed);
  return {
    x: target.x + (Number(target.vx) || 0) * travelFrames,
    y: target.y + (Number(target.vy) || 0) * travelFrames
  };
}

export function rotateAngleToward(current, desired, maxStep) {
  let delta = desired - current;
  while (delta < -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  return current + Math.max(-maxStep, Math.min(maxStep, delta));
}

export function getTeammateSeparation(bot, teammates = [], desiredDistance = 72) {
  let x = 0;
  let y = 0;
  for (const teammate of teammates) {
    if (!teammate || teammate === bot || teammate.health <= 0) continue;
    const dx = bot.x - teammate.x;
    const dy = bot.y - teammate.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < desiredDistance) {
      const strength = (desiredDistance - distance) / desiredDistance;
      x += dx / distance * strength;
      y += dy / distance * strength;
    }
  }
  return { x, y };
}
