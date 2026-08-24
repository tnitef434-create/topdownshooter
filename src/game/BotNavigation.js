const DEFAULT_CELL_SIZE = 26;
const DEFAULT_AGENT_RADIUS = 18;
const EPSILON = 1e-6;

const NAVIGATION_CACHE = new WeakMap();

const CARDINAL_DIRECTIONS = Object.freeze([
  { dx: 1, dy: 0, cost: 1, bit: 1 },
  { dx: -1, dy: 0, cost: 1, bit: 2 },
  { dx: 0, dy: 1, cost: 1, bit: 4 },
  { dx: 0, dy: -1, cost: 1, bit: 8 },
]);

const DIAGONAL_DIRECTIONS = Object.freeze([
  { dx: 1, dy: 1, cost: Math.SQRT2, bit: 16 },
  { dx: -1, dy: 1, cost: Math.SQRT2, bit: 32 },
  { dx: 1, dy: -1, cost: Math.SQRT2, bit: 64 },
  { dx: -1, dy: -1, cost: Math.SQRT2, bit: 128 },
]);

const ALL_DIRECTIONS = Object.freeze([
  ...CARDINAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS,
]);

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function popcount8(value) {
  let count = 0;
  let remaining = value & 0xff;
  while (remaining) {
    remaining &= remaining - 1;
    count++;
  }
  return count;
}

function pointCircleIntersectsRect(x, y, radius, rect) {
  const closestX = clamp(x, rect.x, rect.x + rect.w);
  const closestY = clamp(y, rect.y, rect.y + rect.h);
  const dx = x - closestX;
  const dy = y - closestY;
  return dx * dx + dy * dy < radius * radius - EPSILON;
}

function segmentIntersectsExpandedRect(sx, sy, tx, ty, rect, padding) {
  const minimumX = rect.x - padding;
  const maximumX = rect.x + rect.w + padding;
  const minimumY = rect.y - padding;
  const maximumY = rect.y + rect.h + padding;
  const dx = tx - sx;
  const dy = ty - sy;
  let start = 0;
  let end = 1;

  const clip = (numerator, denominator) => {
    if (Math.abs(denominator) < EPSILON) return numerator <= 0;
    const ratio = numerator / denominator;
    if (denominator > 0) {
      if (ratio > end) return false;
      if (ratio > start) start = ratio;
    } else {
      if (ratio < start) return false;
      if (ratio < end) end = ratio;
    }
    return true;
  };

  return clip(minimumX - sx, dx)
    && clip(sx - maximumX, -dx)
    && clip(minimumY - sy, dy)
    && clip(sy - maximumY, -dy)
    && start <= end;
}

function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const ordered = intervals
    .map(([start, end]) => [Math.min(start, end), Math.max(start, end)])
    .sort((left, right) => left[0] - right[0] || left[1] - right[1]);
  const merged = [ordered[0].slice()];
  for (let index = 1; index < ordered.length; index++) {
    const current = ordered[index];
    const previous = merged[merged.length - 1];
    if (current[0] <= previous[1] + EPSILON) previous[1] = Math.max(previous[1], current[1]);
    else merged.push(current.slice());
  }
  return merged;
}

function deterministicFraction(x, y, revision) {
  let hash = 2166136261;
  for (const value of [Math.round(x * 10), Math.round(y * 10), revision | 0]) {
    hash ^= value;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function pointToSegmentDistance(px, py, sx, sy, tx, ty) {
  const dx = tx - sx;
  const dy = ty - sy;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < EPSILON) return Math.hypot(px - sx, py - sy);
  const amount = clamp(((px - sx) * dx + (py - sy) * dy) / lengthSquared, 0, 1);
  return Math.hypot(px - (sx + dx * amount), py - (sy + dy * amount));
}

function segmentCircleIntersectsRect(sx, sy, tx, ty, radius, rect) {
  if (segmentIntersectsExpandedRect(sx, sy, tx, ty, rect, 0)) return true;
  if (pointCircleIntersectsRect(sx, sy, radius, rect)
    || pointCircleIntersectsRect(tx, ty, radius, rect)) return true;
  const corners = [
    [rect.x, rect.y],
    [rect.x + rect.w, rect.y],
    [rect.x + rect.w, rect.y + rect.h],
    [rect.x, rect.y + rect.h],
  ];
  return corners.some(([x, y]) => pointToSegmentDistance(x, y, sx, sy, tx, ty) < radius - EPSILON);
}

class MinHeap {
  constructor() {
    this.values = [];
  }

  get size() {
    return this.values.length;
  }

  push(node) {
    const values = this.values;
    values.push(node);
    let index = values.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (!MinHeap.before(values[index], values[parent])) break;
      [values[index], values[parent]] = [values[parent], values[index]];
      index = parent;
    }
  }

  pop() {
    const values = this.values;
    if (values.length === 0) return null;
    const root = values[0];
    const tail = values.pop();
    if (values.length > 0) {
      values[0] = tail;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let best = index;
        if (left < values.length && MinHeap.before(values[left], values[best])) best = left;
        if (right < values.length && MinHeap.before(values[right], values[best])) best = right;
        if (best === index) break;
        [values[index], values[best]] = [values[best], values[index]];
        index = best;
      }
    }
    return root;
  }

  static before(left, right) {
    return left.f < right.f
      || (left.f === right.f && (left.h < right.h || (left.h === right.h && left.index < right.index)));
  }
}

export class BotNavigation {
  constructor(map, spawns = [], options = {}) {
    if (!map) throw new TypeError('BotNavigation requires a map');
    this.map = map;
    this.cellSize = clamp(options.cellSize || DEFAULT_CELL_SIZE, 24, 28);
    this.agentRadius = Math.max(1, finite(options.agentRadius, DEFAULT_AGENT_RADIUS));
    this.obstacleRevision = -1;
    this.cols = 0;
    this.rows = 0;
    this.walkable = new Uint8Array(0);
    this.components = new Int32Array(0);
    this.neighborMask = new Uint8Array(0);
    this.componentCount = 0;
    this.rooms = [];
    this.connections = [];
    this.doorways = [];
    this.deadEnds = [];
    this.deadEndRooms = [];
    this.spawns = [];
    this.safePatrolPoints = [];
    this.coverCandidates = [];
    this._spawnInputs = [];
    this.sync(spawns);
  }

  sync(spawns = this._spawnInputs) {
    if (Array.isArray(spawns)) this._spawnInputs = spawns.map((spawn) => ({ ...spawn }));
    const revision = Number.isFinite(this.map.navigationRevision)
      ? this.map.navigationRevision
      : 0;
    if (revision !== this.obstacleRevision
      || this.cols !== Math.ceil(this.map.width / this.cellSize)
      || this.rows !== Math.ceil(this.map.height / this.cellSize)) {
      this.obstacleRevision = revision;
      this._rebuild();
    }
    this._syncSpawns();
    return this;
  }

  isPointClear(x, y, radius = this.agentRadius) {
    this._ensureCurrent();
    return this._pointClear(finite(x), finite(y), Math.max(0, finite(radius, this.agentRadius)));
  }

  hasClearPath(sx, sy, tx, ty, radius = this.agentRadius) {
    this._ensureCurrent();
    return this._segmentClear(
      finite(sx),
      finite(sy),
      finite(tx),
      finite(ty),
      Math.max(0, finite(radius, this.agentRadius)),
    );
  }

  projectPoint(x, y, radius = this.agentRadius) {
    this._ensureCurrent();
    return this._projectPointInternal(
      finite(x),
      finite(y),
      Math.max(0, finite(radius, this.agentRadius)),
    );
  }

  findPath(sx, sy, tx, ty, options = {}) {
    this._ensureCurrent();
    const radius = Math.max(0, finite(options.radius, this.agentRadius));
    const avoidPoints = this._normalizeAvoidPoints(options.avoidPoints, options.avoidRadius, options.avoidWeight);
    const start = this._projectPointInternal(finite(sx), finite(sy), radius);
    if (!start) return [];
    const target = this._projectPointInternal(finite(tx), finite(ty), radius, start.component);
    if (!target || start.component !== target.component) return [];
    if (this._segmentClear(start.x, start.y, target.x, target.y, radius)
      && !this._segmentTouchesAvoidance(start.x, start.y, target.x, target.y, avoidPoints)) {
      return this._dedupePath([start, target]);
    }

    const cellCount = this.walkable.length;
    const costs = new Float64Array(cellCount);
    costs.fill(Number.POSITIVE_INFINITY);
    const cameFrom = new Int32Array(cellCount);
    cameFrom.fill(-1);
    const closed = new Uint8Array(cellCount);
    const heap = new MinHeap();
    costs[start.index] = 0;
    const initialHeuristic = this._heuristic(start.index, target.index);
    heap.push({ index: start.index, f: initialHeuristic, h: initialHeuristic });
    const maxIterations = Math.max(1, Math.floor(finite(options.maxIterations, cellCount * 4)));
    let iterations = 0;
    let found = false;
    // The grid mask was built with exact swept clearance at agentRadius. It is
    // therefore an exact edge cache for the normal bot and a conservative safe
    // cache for smaller callers. Larger movers still need their radius-specific
    // point, corner and swept-segment checks below.
    const useCachedNeighbors = radius <= this.agentRadius + EPSILON;

    while (heap.size > 0 && iterations++ < maxIterations) {
      const current = heap.pop();
      if (!current || closed[current.index]) continue;
      if (current.index === target.index) {
        found = true;
        break;
      }
      closed[current.index] = 1;
      const column = current.index % this.cols;
      const row = Math.floor(current.index / this.cols);
      const cachedNeighbors = useCachedNeighbors ? this.neighborMask[current.index] : 0;

      for (const direction of ALL_DIRECTIONS) {
        if (useCachedNeighbors && !(cachedNeighbors & direction.bit)) continue;
        const nextColumn = column + direction.dx;
        const nextRow = row + direction.dy;
        if (!useCachedNeighbors && !this._cellInBounds(nextColumn, nextRow)) continue;
        const nextIndex = this._index(nextColumn, nextRow);
        if (closed[nextIndex]) continue;
        if (!useCachedNeighbors) {
          if (!this._cellWalkable(nextIndex, radius)) continue;
          if (direction.dx !== 0 && direction.dy !== 0) {
            const horizontal = this._index(column + direction.dx, row);
            const vertical = this._index(column, row + direction.dy);
            if (!this._cellWalkable(horizontal, radius) || !this._cellWalkable(vertical, radius)) continue;
          }
          const currentPoint = this._pointForIndex(current.index);
          const nextPoint = this._pointForIndex(nextIndex);
          if (!this._segmentClear(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y, radius)) continue;
        }
        const avoidanceCost = this._avoidanceCost(nextIndex, avoidPoints);
        if (!Number.isFinite(avoidanceCost)) continue;
        const tentativeCost = costs[current.index] + direction.cost + avoidanceCost;
        if (tentativeCost + EPSILON >= costs[nextIndex]) continue;
        costs[nextIndex] = tentativeCost;
        cameFrom[nextIndex] = current.index;
        const heuristic = this._heuristic(nextIndex, target.index);
        heap.push({ index: nextIndex, f: tentativeCost + heuristic, h: heuristic });
      }
    }

    if (!found) return [];
    const indices = [];
    let cursor = target.index;
    while (cursor !== -1) {
      indices.push(cursor);
      if (cursor === start.index) break;
      cursor = cameFrom[cursor];
    }
    if (indices[indices.length - 1] !== start.index) return [];
    indices.reverse();

    const rawPath = [start];
    for (let index = 1; index < indices.length - 1; index++) {
      rawPath.push(this._pointForIndex(indices[index]));
    }
    rawPath.push(target);
    const path = options.smooth === false ? rawPath : this._smoothPath(rawPath, radius, avoidPoints);
    const result = this._dedupePath(path);
    if (this._pathClear(result, radius)) return result;
    const rawResult = this._dedupePath(rawPath);
    return this._pathClear(rawResult, radius) ? rawResult : [];
  }

  choosePatrolPoint(x, y, random) {
    this._ensureCurrent();
    const origin = this._projectPointInternal(finite(x), finite(y), this.agentRadius);
    if (!origin) return null;
    let candidates = this.safePatrolPoints.filter((point) => point.component === origin.component);
    const distant = candidates.filter((point) => Math.hypot(point.x - origin.x, point.y - origin.y) >= this.cellSize * 2);
    if (distant.length > 0) candidates = distant;
    if (candidates.length === 0) return { ...origin };
    const value = typeof random === 'function'
      ? finite(random(), 0)
      : Number.isFinite(Number(random))
        ? Number(random)
        : deterministicFraction(origin.x, origin.y, this.obstacleRevision);
    const index = Math.min(candidates.length - 1, Math.floor(clamp(value, 0, 0.999999999) * candidates.length));
    return { ...candidates[index] };
  }

  findCoverPoint(sx, sy, threatX, threatY, options = {}) {
    this._ensureCurrent();
    const radius = Math.max(0, finite(options.radius, this.agentRadius));
    const origin = this._projectPointInternal(finite(sx), finite(sy), radius);
    if (!origin) return null;
    const maxDistance = Math.max(this.cellSize, finite(options.maxDistance, 650));
    const minThreatDistance = Math.max(0, finite(options.minThreatDistance, 60));
    const preferredDistance = Math.max(0, finite(options.preferredDistance, 180));
    const claimed = options.claimed || [];
    const claimRadius = Math.max(0, finite(options.claimRadius, this.cellSize * 1.5));
    const candidates = [];

    for (const candidate of this.coverCandidates) {
      if (candidate.component !== origin.component || !this._pointClear(candidate.x, candidate.y, radius)) continue;
      if (this._coverClaimed(candidate, claimed, claimRadius)) continue;
      const travelDistance = Math.hypot(candidate.x - origin.x, candidate.y - origin.y);
      if (travelDistance > maxDistance) continue;
      const threatDistance = Math.hypot(candidate.x - threatX, candidate.y - threatY);
      if (threatDistance < minThreatDistance) continue;
      const hit = this.map.getLineIntersection(
        { x: finite(threatX), y: finite(threatY) },
        { x: candidate.x, y: candidate.y },
      );
      if (!hit || hit.dist >= threatDistance - Math.max(2, radius * 0.35)) continue;
      const score = travelDistance + Math.abs(threatDistance - preferredDistance) * 0.18;
      candidates.push({ candidate, score });
    }

    candidates.sort((left, right) => left.score - right.score || left.candidate.index - right.candidate.index);
    for (const entry of candidates.slice(0, 16)) {
      const path = this.findPath(origin.x, origin.y, entry.candidate.x, entry.candidate.y, {
        radius,
        smooth: options.smooth !== false,
        avoidPoints: options.avoidPoints,
        avoidRadius: options.avoidRadius,
        avoidWeight: options.avoidWeight,
      });
      if (path.length > 0) return { ...entry.candidate, path };
    }
    return null;
  }

  snapshot() {
    this._ensureCurrent();
    return {
      cellSize: this.cellSize,
      agentRadius: this.agentRadius,
      cols: this.cols,
      rows: this.rows,
      obstacleRevision: this.obstacleRevision,
      componentCount: this.componentCount,
      memory: {
        walkable: this.walkable.slice(),
        components: this.components.slice(),
        neighborMask: this.neighborMask.slice(),
      },
      rooms: this.rooms.map((room) => ({ ...room })),
      connections: this.connections.map((connection) => ({ ...connection, rooms: [...connection.rooms] })),
      doorways: this.doorways.map((doorway) => ({ ...doorway, rooms: [...doorway.rooms] })),
      deadEnds: this.deadEnds.map((point) => ({ ...point })),
      deadEndRooms: [...this.deadEndRooms],
      spawns: this.spawns.map((spawn) => ({ ...spawn })),
      safePatrolPoints: this.safePatrolPoints.map((point) => ({ ...point })),
      coverCandidates: this.coverCandidates.map((point) => ({ ...point })),
    };
  }

  _ensureCurrent() {
    const revision = Number.isFinite(this.map.navigationRevision) ? this.map.navigationRevision : 0;
    if (revision !== this.obstacleRevision) this.sync(this._spawnInputs);
  }

  _rebuild() {
    this.cols = Math.ceil(this.map.width / this.cellSize);
    this.rows = Math.ceil(this.map.height / this.cellSize);
    const cellCount = this.cols * this.rows;
    this.walkable = new Uint8Array(cellCount);
    this.components = new Int32Array(cellCount);
    this.components.fill(-1);
    this.neighborMask = new Uint8Array(cellCount);
    this.rooms = (this.map.rooms || []).map((room, index) => ({
      index,
      x: room.x,
      y: room.y,
      w: room.w,
      h: room.h,
      name: room.name || `Room ${index + 1}`,
      floor: room.floor || '',
    }));

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.cols; column++) {
        const index = this._index(column, row);
        const point = this._pointForCell(column, row);
        if (this._pointClear(point.x, point.y, this.agentRadius)) this.walkable[index] = 1;
      }
    }
    this._buildComponentsAndNeighbors();
    this._inferConnections();
    this._buildDeadEnds();
    this._buildPatrolPoints();
    this._buildCoverCandidates();
  }

  _pointClear(x, y, radius) {
    if (x < radius || y < radius || x > this.map.width - radius || y > this.map.height - radius) return false;
    for (const wall of this.map.walls || []) {
      if (pointCircleIntersectsRect(x, y, radius, wall)) return false;
    }
    return true;
  }

  _segmentClear(sx, sy, tx, ty, radius) {
    if (!this._pointClear(sx, sy, radius) || !this._pointClear(tx, ty, radius)) return false;
    for (const wall of this.map.walls || []) {
      if (segmentCircleIntersectsRect(sx, sy, tx, ty, radius, wall)) return false;
    }
    return true;
  }

  _index(column, row) {
    return row * this.cols + column;
  }

  _cellInBounds(column, row) {
    return column >= 0 && row >= 0 && column < this.cols && row < this.rows;
  }

  _pointForCell(column, row) {
    return {
      x: Math.min(this.map.width - this.agentRadius, (column + 0.5) * this.cellSize),
      y: Math.min(this.map.height - this.agentRadius, (row + 0.5) * this.cellSize),
    };
  }

  _pointForIndex(index) {
    const column = index % this.cols;
    const row = Math.floor(index / this.cols);
    const point = this._pointForCell(column, row);
    return {
      ...point,
      index,
      column,
      row,
      component: this.components[index],
      projected: true,
    };
  }

  _cellWalkable(index, radius = this.agentRadius) {
    if (index < 0 || index >= this.walkable.length || !this.walkable[index]) return false;
    if (radius <= this.agentRadius + EPSILON) return true;
    const point = this._pointForIndex(index);
    return this._pointClear(point.x, point.y, radius);
  }

  _locateWalkableCell(x, y, radius, component = null) {
    const preferredColumn = clamp(Math.floor(x / this.cellSize), 0, this.cols - 1);
    const preferredRow = clamp(Math.floor(y / this.cellSize), 0, this.rows - 1);
    const preferredIndex = this._index(preferredColumn, preferredRow);
    if (this._cellWalkable(preferredIndex, radius)
      && (component == null || this.components[preferredIndex] === component)) return preferredIndex;

    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < this.walkable.length; index++) {
      if (!this._cellWalkable(index, radius)) continue;
      if (component != null && this.components[index] !== component) continue;
      const point = this._pointForIndex(index);
      const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
      if (distance < bestDistance - EPSILON || (Math.abs(distance - bestDistance) <= EPSILON && index < bestIndex)) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    return bestIndex;
  }

  _projectPointInternal(x, y, radius, component = null) {
    const pointIsClear = this._pointClear(x, y, radius);
    const index = this._locateWalkableCell(x, y, radius, component);
    if (index === -1) return null;
    const cell = this._pointForIndex(index);
    const preferredColumn = clamp(Math.floor(x / this.cellSize), 0, this.cols - 1);
    const preferredRow = clamp(Math.floor(y / this.cellSize), 0, this.rows - 1);
    const preferredIndex = this._index(preferredColumn, preferredRow);
    if (pointIsClear
      && index === preferredIndex
      && (component == null || cell.component === component)
      && this._segmentClear(cell.x, cell.y, x, y, radius)) {
      return { ...cell, x, y, projected: false };
    }
    return { ...cell, projected: true };
  }

  _buildComponentsAndNeighbors() {
    let component = 0;
    const queue = new Int32Array(this.walkable.length);
    for (let start = 0; start < this.walkable.length; start++) {
      if (!this.walkable[start] || this.components[start] !== -1) continue;
      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      this.components[start] = component;
      while (head < tail) {
        const index = queue[head++];
        const column = index % this.cols;
        const row = Math.floor(index / this.cols);
        const point = this._pointForIndex(index);
        for (const direction of CARDINAL_DIRECTIONS) {
          const nextColumn = column + direction.dx;
          const nextRow = row + direction.dy;
          if (!this._cellInBounds(nextColumn, nextRow)) continue;
          const nextIndex = this._index(nextColumn, nextRow);
          if (!this.walkable[nextIndex] || this.components[nextIndex] !== -1) continue;
          const nextPoint = this._pointForIndex(nextIndex);
          if (!this._segmentClear(point.x, point.y, nextPoint.x, nextPoint.y, this.agentRadius)) continue;
          this.components[nextIndex] = component;
          queue[tail++] = nextIndex;
        }
      }
      component++;
    }
    this.componentCount = component;

    for (let index = 0; index < this.walkable.length; index++) {
      if (!this.walkable[index]) continue;
      const column = index % this.cols;
      const row = Math.floor(index / this.cols);
      let mask = 0;
      for (const direction of CARDINAL_DIRECTIONS) {
        const nextColumn = column + direction.dx;
        const nextRow = row + direction.dy;
        if (!this._cellInBounds(nextColumn, nextRow)) continue;
        const nextIndex = this._index(nextColumn, nextRow);
        if (this.walkable[nextIndex]) {
          const point = this._pointForIndex(index);
          const nextPoint = this._pointForIndex(nextIndex);
          if (this._segmentClear(point.x, point.y, nextPoint.x, nextPoint.y, this.agentRadius)) {
            mask |= direction.bit;
          }
        }
      }
      for (const direction of DIAGONAL_DIRECTIONS) {
        const nextColumn = column + direction.dx;
        const nextRow = row + direction.dy;
        if (!this._cellInBounds(nextColumn, nextRow)) continue;
        const nextIndex = this._index(nextColumn, nextRow);
        const horizontal = this._index(column + direction.dx, row);
        const vertical = this._index(column, row + direction.dy);
        if (this.walkable[nextIndex] && this.walkable[horizontal] && this.walkable[vertical]) {
          const point = this._pointForIndex(index);
          const nextPoint = this._pointForIndex(nextIndex);
          if (this._segmentClear(point.x, point.y, nextPoint.x, nextPoint.y, this.agentRadius)) {
            mask |= direction.bit;
          }
        }
      }
      this.neighborMask[index] = mask;
    }
  }

  _inferConnections() {
    this.connections = [];
    this.doorways = [];
    const maximumDivider = this.cellSize * 1.5;
    for (let first = 0; first < this.rooms.length; first++) {
      for (let second = first + 1; second < this.rooms.length; second++) {
        const roomA = this.rooms[first];
        const roomB = this.rooms[second];
        let orientation = '';
        let dividerStart = 0;
        let dividerEnd = 0;
        let spanStart = 0;
        let spanEnd = 0;
        let roomBefore = roomA;
        let roomAfter = roomB;

        const aRight = roomA.x + roomA.w;
        const bRight = roomB.x + roomB.w;
        const aBottom = roomA.y + roomA.h;
        const bBottom = roomB.y + roomB.h;
        const verticalOverlapStart = Math.max(roomA.y, roomB.y);
        const verticalOverlapEnd = Math.min(aBottom, bBottom);
        const horizontalOverlapStart = Math.max(roomA.x, roomB.x);
        const horizontalOverlapEnd = Math.min(aRight, bRight);

        if (verticalOverlapEnd > verticalOverlapStart) {
          if (aRight <= roomB.x && roomB.x - aRight <= maximumDivider) {
            orientation = 'vertical';
            dividerStart = aRight;
            dividerEnd = roomB.x;
            spanStart = verticalOverlapStart;
            spanEnd = verticalOverlapEnd;
          } else if (bRight <= roomA.x && roomA.x - bRight <= maximumDivider) {
            orientation = 'vertical';
            dividerStart = bRight;
            dividerEnd = roomA.x;
            spanStart = verticalOverlapStart;
            spanEnd = verticalOverlapEnd;
            roomBefore = roomB;
            roomAfter = roomA;
          }
        }
        if (!orientation && horizontalOverlapEnd > horizontalOverlapStart) {
          if (aBottom <= roomB.y && roomB.y - aBottom <= maximumDivider) {
            orientation = 'horizontal';
            dividerStart = aBottom;
            dividerEnd = roomB.y;
            spanStart = horizontalOverlapStart;
            spanEnd = horizontalOverlapEnd;
          } else if (bBottom <= roomA.y && roomA.y - bBottom <= maximumDivider) {
            orientation = 'horizontal';
            dividerStart = bBottom;
            dividerEnd = roomA.y;
            spanStart = horizontalOverlapStart;
            spanEnd = horizontalOverlapEnd;
            roomBefore = roomB;
            roomAfter = roomA;
          }
        }
        if (!orientation) continue;

        const dividerMiddle = (dividerStart + dividerEnd) * 0.5;
        const intervals = [];
        for (const wall of this.map.walls || []) {
          if (wall.material !== 'interior') continue;
          if (orientation === 'vertical') {
            if (dividerMiddle < wall.x - EPSILON || dividerMiddle > wall.x + wall.w + EPSILON) continue;
            const start = Math.max(spanStart, wall.y);
            const end = Math.min(spanEnd, wall.y + wall.h);
            if (end > start) intervals.push([start, end]);
          } else {
            if (dividerMiddle < wall.y - EPSILON || dividerMiddle > wall.y + wall.h + EPSILON) continue;
            const start = Math.max(spanStart, wall.x);
            const end = Math.min(spanEnd, wall.x + wall.w);
            if (end > start) intervals.push([start, end]);
          }
        }

        const merged = mergeIntervals(intervals);
        const gaps = [];
        let cursor = spanStart;
        for (const [start, end] of merged) {
          if (start - cursor >= this.agentRadius * 2 + 2) gaps.push([cursor, start]);
          cursor = Math.max(cursor, end);
        }
        if (spanEnd - cursor >= this.agentRadius * 2 + 2) gaps.push([cursor, spanEnd]);

        for (const [gapStart, gapEnd] of gaps) {
          const doorway = orientation === 'vertical'
            ? { x: dividerMiddle, y: (gapStart + gapEnd) * 0.5 }
            : { x: (gapStart + gapEnd) * 0.5, y: dividerMiddle };
          const inset = this.agentRadius + 3;
          const approachA = orientation === 'vertical'
            ? { x: roomBefore.x + roomBefore.w - inset, y: doorway.y }
            : { x: doorway.x, y: roomBefore.y + roomBefore.h - inset };
          const approachB = orientation === 'vertical'
            ? { x: roomAfter.x + inset, y: doorway.y }
            : { x: doorway.x, y: roomAfter.y + inset };
          const traversable = this._pointClear(doorway.x, doorway.y, this.agentRadius)
            && this._segmentClear(approachA.x, approachA.y, approachB.x, approachB.y, this.agentRadius);
          const record = {
            id: `door-${first}-${second}-${this.doorways.length}`,
            rooms: [first, second],
            orientation,
            x: doorway.x,
            y: doorway.y,
            width: gapEnd - gapStart,
            thickness: dividerEnd - dividerStart,
            gapStart,
            gapEnd,
            traversable,
            blocked: !traversable,
          };
          this.doorways.push(record);
          this.connections.push({ ...record });
        }
      }
    }
  }

  _buildDeadEnds() {
    this.deadEnds = [];
    for (let index = 0; index < this.walkable.length; index++) {
      if (!this.walkable[index]) continue;
      const cardinalMask = this.neighborMask[index] & 15;
      if (popcount8(cardinalMask) <= 1) this.deadEnds.push(this._pointForIndex(index));
    }
    const degrees = new Uint8Array(this.rooms.length);
    for (const connection of this.connections) {
      if (!connection.traversable) continue;
      degrees[connection.rooms[0]]++;
      degrees[connection.rooms[1]]++;
    }
    this.deadEndRooms = [...degrees]
      .map((degree, index) => ({ degree, index }))
      .filter(({ degree }) => degree <= 1)
      .map(({ index }) => index);
  }

  _buildPatrolPoints() {
    this.safePatrolPoints = [];
    for (const room of this.rooms) {
      const candidates = [];
      for (let index = 0; index < this.walkable.length; index++) {
        if (!this.walkable[index] || popcount8(this.neighborMask[index]) < 5) continue;
        const point = this._pointForIndex(index);
        if (point.x < room.x + this.agentRadius || point.x > room.x + room.w - this.agentRadius
          || point.y < room.y + this.agentRadius || point.y > room.y + room.h - this.agentRadius) continue;
        const centerDistance = Math.hypot(
          point.x - (room.x + room.w * 0.5),
          point.y - (room.y + room.h * 0.5),
        );
        candidates.push({ ...point, roomIndex: room.index, centerDistance });
      }
      candidates.sort((left, right) => left.centerDistance - right.centerDistance || left.index - right.index);
      const chosen = [];
      for (const candidate of candidates) {
        if (chosen.every((point) => Math.hypot(point.x - candidate.x, point.y - candidate.y) >= this.cellSize * 2.5)) {
          const { centerDistance: _centerDistance, ...point } = candidate;
          chosen.push(point);
        }
        if (chosen.length >= 6) break;
      }
      if (chosen.length === 0) {
        const fallback = this._projectPointInternal(room.x + room.w * 0.5, room.y + room.h * 0.5, this.agentRadius);
        if (fallback) chosen.push({ ...fallback, roomIndex: room.index });
      }
      this.safePatrolPoints.push(...chosen);
    }
  }

  _buildCoverCandidates() {
    const seen = new Set();
    const candidates = [];
    const offset = this.agentRadius + 7;
    for (let wallIndex = 0; wallIndex < (this.map.walls || []).length; wallIndex++) {
      const wall = this.map.walls[wallIndex];
      for (const amount of [0.25, 0.5, 0.75]) {
        const alongX = wall.x + wall.w * amount;
        const alongY = wall.y + wall.h * amount;
        const rawPoints = [
          { x: alongX, y: wall.y - offset, side: 'north' },
          { x: alongX, y: wall.y + wall.h + offset, side: 'south' },
          { x: wall.x - offset, y: alongY, side: 'west' },
          { x: wall.x + wall.w + offset, y: alongY, side: 'east' },
        ];
        for (const raw of rawPoints) {
          if (!this._pointClear(raw.x, raw.y, this.agentRadius)) continue;
          const index = this._locateWalkableCell(raw.x, raw.y, this.agentRadius);
          if (index === -1 || seen.has(index) || popcount8(this.neighborMask[index]) < 3) continue;
          seen.add(index);
          const point = this._pointForIndex(index);
          candidates.push({
            ...point,
            wallIndex,
            wallType: wall.type || 'wall',
            material: wall.material || '',
            side: raw.side,
          });
          if (candidates.length >= 640) break;
        }
        if (candidates.length >= 640) break;
      }
      if (candidates.length >= 640) break;
    }
    this.coverCandidates = candidates;
  }

  _syncSpawns() {
    this.spawns = [];
    for (let index = 0; index < this._spawnInputs.length; index++) {
      const input = this._spawnInputs[index] || {};
      const projected = this._projectPointInternal(finite(input.x), finite(input.y), this.agentRadius);
      if (!projected) continue;
      this.spawns.push({
        ...input,
        index: input.index ?? index,
        x: projected.x,
        y: projected.y,
        cellIndex: projected.index,
        component: projected.component,
        projected: projected.projected,
      });
    }
  }

  _heuristic(first, second) {
    const firstColumn = first % this.cols;
    const firstRow = Math.floor(first / this.cols);
    const secondColumn = second % this.cols;
    const secondRow = Math.floor(second / this.cols);
    const dx = Math.abs(firstColumn - secondColumn);
    const dy = Math.abs(firstRow - secondRow);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  }

  _smoothPath(path, radius, avoidPoints = []) {
    if (path.length <= 2) return path;
    const smoothed = [path[0]];
    let anchor = 0;
    while (anchor < path.length - 1) {
      let next = anchor + 1;
      for (let candidate = path.length - 1; candidate > anchor + 1; candidate--) {
        if (this._segmentClear(path[anchor].x, path[anchor].y, path[candidate].x, path[candidate].y, radius)
          && !this._segmentTouchesAvoidance(
            path[anchor].x,
            path[anchor].y,
            path[candidate].x,
            path[candidate].y,
            avoidPoints,
          )) {
          next = candidate;
          break;
        }
      }
      smoothed.push(path[next]);
      anchor = next;
    }
    return smoothed;
  }

  _dedupePath(path) {
    const result = [];
    for (const point of path) {
      const previous = result[result.length - 1];
      if (previous && Math.hypot(previous.x - point.x, previous.y - point.y) < EPSILON) continue;
      result.push({ ...point });
    }
    return result;
  }

  _pathClear(path, radius) {
    for (let index = 1; index < path.length; index++) {
      if (!this._segmentClear(
        path[index - 1].x,
        path[index - 1].y,
        path[index].x,
        path[index].y,
        radius,
      )) return false;
    }
    return true;
  }

  _normalizeAvoidPoints(points, defaultRadius, defaultWeight) {
    if (!Array.isArray(points)) return [];
    const fallbackRadius = Math.max(1, finite(defaultRadius, this.cellSize * 1.35));
    const fallbackWeight = Math.max(0, finite(defaultWeight, 12));
    return points
      .filter((point) => point && Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y)))
      .map((point) => ({
        x: Number(point.x),
        y: Number(point.y),
        radius: Math.max(1, finite(point.radius, fallbackRadius)),
        weight: Math.max(0, finite(point.weight, fallbackWeight)),
        hard: point.hard === true,
      }));
  }

  _avoidanceCost(index, avoidPoints) {
    if (avoidPoints.length === 0) return 0;
    const point = this._pointForIndex(index);
    let cost = 0;
    for (const avoid of avoidPoints) {
      const distance = Math.hypot(point.x - avoid.x, point.y - avoid.y);
      if (distance >= avoid.radius) continue;
      if (avoid.hard) return Number.POSITIVE_INFINITY;
      cost += (1 - distance / avoid.radius) * avoid.weight;
    }
    return cost;
  }

  _segmentTouchesAvoidance(sx, sy, tx, ty, avoidPoints) {
    return avoidPoints.some((avoid) => (
      pointToSegmentDistance(avoid.x, avoid.y, sx, sy, tx, ty) < avoid.radius
    ));
  }

  _coverClaimed(candidate, claimed, claimRadius) {
    if (claimed instanceof Set) {
      if (claimed.has(candidate.index) || claimed.has(String(candidate.index))
        || claimed.has(`${candidate.x},${candidate.y}`)) return true;
      for (const value of claimed) {
        if (value && typeof value === 'object'
          && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y))
          && Math.hypot(candidate.x - Number(value.x), candidate.y - Number(value.y)) < claimRadius) return true;
      }
      return false;
    }
    if (!Array.isArray(claimed)) return false;
    return claimed.some((value) => {
      if (Number(value) === candidate.index) return true;
      return value && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y))
        && Math.hypot(candidate.x - Number(value.x), candidate.y - Number(value.y)) < claimRadius;
    });
  }
}

export function getBotNavigation(map, spawns) {
  if (!map || (typeof map !== 'object' && typeof map !== 'function')) {
    throw new TypeError('getBotNavigation requires a map object');
  }
  let navigation = NAVIGATION_CACHE.get(map);
  if (!navigation) {
    navigation = new BotNavigation(map, spawns);
    NAVIGATION_CACHE.set(map, navigation);
  } else {
    navigation.sync(spawns);
  }
  return navigation;
}
