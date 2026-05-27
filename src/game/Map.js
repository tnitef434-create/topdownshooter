// Seeded random number generator for synchronized crate spawning
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  // Returns 0 to 1
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  // Range: min to max
  range(min, max) {
    return min + this.next() * (max - min);
  }
}

export class Map {
  constructor(width, height, seed) {
    this.width = width;
    this.height = height;
    this.rng = new SeededRandom(seed);
    
    this.walls = []; // Array of Wall objects {x, y, w, h, type: 'wall'|'crate', health: 100, maxHealth: 100}
    this.items = []; // Array of Items {id, x, y, type: 'health'|'ammo', active: true}
    
    this.segments = []; // Pre-computed line segments for raycasting
    
    this.generateMap();
  }

  generateMap() {
    this.walls = [];
    this.items = [];

    // 1. Boundary Walls
    const borderThickness = 40;
    // Top
    this.walls.push({ x: 0, y: 0, w: this.width, h: borderThickness, type: 'wall' });
    // Bottom
    this.walls.push({ x: 0, y: this.height - borderThickness, w: this.width, h: borderThickness, type: 'wall' });
    // Left
    this.walls.push({ x: 0, y: borderThickness, w: borderThickness, h: this.height - borderThickness * 2, type: 'wall' });
    // Right
    this.walls.push({ x: this.width - borderThickness, y: borderThickness, w: borderThickness, h: this.height - borderThickness * 2, type: 'wall' });

    // 2. Static Level Obstacles (columns and structures)
    const columns = [
      // Central Columns
      { x: 300, y: 300, w: 80, h: 80 },
      { x: this.width - 380, y: 300, w: 80, h: 80 },
      { x: 300, y: this.height - 380, w: 80, h: 80 },
      { x: this.width - 380, y: this.height - 380, w: 80, h: 80 },
      
      // Central Block
      { x: this.width / 2 - 100, y: this.height / 2 - 100, w: 200, h: 40 },
      { x: this.width / 2 - 100, y: this.height / 2 + 60, w: 200, h: 40 },
      
      // Corridors / Dividers
      { x: 120, y: this.height / 2 - 80, w: 120, h: 40 },
      { x: this.width - 240, y: this.height / 2 - 80, w: 120, h: 40 }
    ];

    columns.forEach(col => {
      this.walls.push({ ...col, type: 'wall' });
    });

    // 3. Destructible Crates (spawns synchronized via seed)
    // We will attempt to spawn crates in valid grid cells that don't overlap static obstacles
    const crateSize = 50;
    const gridCols = Math.floor(this.width / crateSize);
    const gridRows = Math.floor(this.height / crateSize);

    // Let's spawn 15-20 crates
    const numCrates = Math.floor(this.rng.range(16, 22));
    let spawnedCrates = 0;
    let attempts = 0;

    while (spawnedCrates < numCrates && attempts < 200) {
      attempts++;
      // Get a random grid location (avoiding spawn zones of P1 & P2)
      // Player 1 spawns around (150, 150), Player 2 around (width-150, height-150)
      const gx = Math.floor(this.rng.range(2, gridCols - 2));
      const gy = Math.floor(this.rng.range(2, gridRows - 2));

      const cx = gx * crateSize;
      const cy = gy * crateSize;

      // Check Spawn Zones
      if (cx < 250 && cy < 250) continue; // P1 Zone
      if (cx > this.width - 250 && cy > this.height - 250) continue; // P2 Zone

      // Check Overlap with existing walls
      let overlaps = false;
      const margin = 10;
      for (const wall of this.walls) {
        if (
          cx + crateSize + margin > wall.x &&
          cx - margin < wall.x + wall.w &&
          cy + crateSize + margin > wall.y &&
          cy - margin < wall.y + wall.h
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        this.walls.push({
          x: cx,
          y: cy,
          w: crateSize,
          h: crateSize,
          type: 'crate',
          health: 50,
          maxHealth: 50,
          id: `crate_${spawnedCrates}`
        });
        spawnedCrates++;
      }
    }

    this.rebuildSegments();
  }

  // Pre-calculate line segments of all active walls for the raycaster
  rebuildSegments() {
    this.segments = [];
    this.walls.forEach(wall => {
      // 4 edges of the rectangle
      this.segments.push({ p1: { x: wall.x, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y } }); // Top
      this.segments.push({ p1: { x: wall.x + wall.w, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y + wall.h } }); // Right
      this.segments.push({ p1: { x: wall.x + wall.w, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y + wall.h } }); // Bottom
      this.segments.push({ p1: { x: wall.x, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y } }); // Left
    });
  }

  // Break a crate (damage it, remove if health <= 0)
  damageCrate(crateId, damage) {
    const crateIdx = this.walls.findIndex(w => w.id === crateId);
    if (crateIdx === -1) return null;

    const crate = this.walls[crateIdx];
    crate.health -= damage;

    if (crate.health <= 0) {
      // Remove crate
      this.walls.splice(crateIdx, 1);
      this.rebuildSegments();
      
      // Spawn items from crate (seeded probabilities)
      // 40% chance of item spawn
      const itemRoll = this.rng.next();
      let spawnedItem = null;
      
      if (itemRoll < 0.45) {
        const itemType = this.rng.next() < 0.5 ? 'health' : 'ammo';
        spawnedItem = {
          id: `item_${crateId}_${Date.now()}`,
          x: crate.x + crate.w / 2,
          y: crate.y + crate.h / 2,
          type: itemType,
          active: true
        };
        this.items.push(spawnedItem);
      }
      
      return { broken: true, item: spawnedItem, crateX: crate.x + crate.w/2, crateY: crate.y + crate.h/2 };
    }
    
    return { broken: false, health: crate.health };
  }

  // Sync crate breaking for network events
  syncBreakCrate(crateId, spawnedItem) {
    const crateIdx = this.walls.findIndex(w => w.id === crateId);
    if (crateIdx !== -1) {
      this.walls.splice(crateIdx, 1);
      this.rebuildSegments();
    }
    if (spawnedItem) {
      // Avoid duplicate spawning
      if (!this.items.some(i => i.id === spawnedItem.id)) {
        this.items.push(spawnedItem);
      }
    }
  }

  // Check Circle vs Rectangle Collision
  checkCircleCollision(cx, cy, r, playerX = 0, playerY = 0) {
    let correctedX = cx;
    let correctedY = cy;
    let collided = false;

    for (const wall of this.walls) {
      // Find closest point on wall to circle center
      const closestX = Math.max(wall.x, Math.min(correctedX, wall.x + wall.w));
      const closestY = Math.max(wall.y, Math.min(correctedY, wall.y + wall.h));

      // Distance between closest point and circle center
      const distPercentX = correctedX - closestX;
      const distPercentY = correctedY - closestY;
      const distSqr = distPercentX * distPercentX + distPercentY * distPercentY;

      if (distSqr < r * r) {
        collided = true;
        const dist = Math.sqrt(distSqr);
        
        if (dist === 0) continue; // safety check

        // Push circle away from the closest point
        const overlap = r - dist;
        correctedX += (distPercentX / dist) * overlap;
        correctedY += (distPercentY / dist) * overlap;
      }
    }

    return { x: correctedX, y: correctedY, collided };
  }

  // Check Line vs Rectangle (Raycasting for Bullets/Walls)
  // Returns intersection point {x, y, dist, wallRef} or null
  getLineIntersection(p1, p2) {
    let closestIntersection = null;

    for (const wall of this.walls) {
      const wallEdges = [
        { p1: { x: wall.x, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y } }, // Top
        { p1: { x: wall.x + wall.w, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y + wall.h } }, // Right
        { p1: { x: wall.x + wall.w, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y + wall.h } }, // Bottom
        { p1: { x: wall.x, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y } } // Left
      ];

      for (const edge of wallEdges) {
        const intersect = this.getLineSegmentIntersection(p1, p2, edge.p1, edge.p2);
        if (intersect) {
          const dx = intersect.x - p1.x;
          const dy = intersect.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!closestIntersection || dist < closestIntersection.dist) {
            closestIntersection = { x: intersect.x, y: intersect.y, dist, wall };
          }
        }
      }
    }

    return closestIntersection;
  }

  getLineSegmentIntersection(line1_p1, line1_p2, line2_p1, line2_p2) {
    const s1_x = line1_p2.x - line1_p1.x;
    const s1_y = line1_p2.y - line1_p1.y;
    const s2_x = line2_p2.x - line2_p1.x;
    const s2_y = line2_p2.y - line2_p1.y;

    const s = (-s1_y * (line1_p1.x - line2_p1.x) + s1_x * (line1_p1.y - line2_p1.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (line1_p1.y - line2_p1.y) - s2_y * (line1_p1.x - line2_p1.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        x: line1_p1.x + (t * s1_x),
        y: line1_p1.y + (t * s1_y)
      };
    }

    return null;
  }

  // --- Dynamic Lighting Engine (2D Raycaster Shadows) ---
  // Computes the visibility polygon from lightX, lightY
  computeVisibilityPolygon(lightX, lightY, maxRadius) {
    const points = [];
    
    // Gather all wall vertices, including boundary points
    const vertices = [];
    this.walls.forEach(wall => {
      vertices.push({ x: wall.x, y: wall.y });
      vertices.push({ x: wall.x + wall.w, y: wall.y });
      vertices.push({ x: wall.x + wall.w, y: wall.y + wall.h });
      vertices.push({ x: wall.x, y: wall.y + wall.h });
    });

    // Extract unique angles to vertices from the light source
    const angles = new Set();
    vertices.forEach(v => {
      const angle = Math.atan2(v.y - lightY, v.x - lightX);
      angles.add(angle);
      angles.add(angle - 0.0001); // cast ray slightly left
      angles.add(angle + 0.0001); // cast ray slightly right
    });

    // Add standard 4 corners of screen radius angles to fill gaps
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      angles.add(a);
    }

    // Cast rays and check intersections
    const rayEndList = [];
    angles.forEach(angle => {
      // Calculate ray target end coordinates
      const rayEnd = {
        x: lightX + Math.cos(angle) * maxRadius,
        y: lightY + Math.sin(angle) * maxRadius
      };

      // Find closest wall intersection
      const intersect = this.getLineIntersection({ x: lightX, y: lightY }, rayEnd);
      
      if (intersect && intersect.dist < maxRadius) {
        rayEndList.push({ x: intersect.x, y: intersect.y, angle });
      } else {
        rayEndList.push({ x: rayEnd.x, y: rayEnd.y, angle });
      }
    });

    // Sort endpoints by angle to form a clean clockwise polygon
    rayEndList.sort((a, b) => a.angle - b.angle);

    return rayEndList;
  }

  // Draw the entire map: Static Walls, Crates, and Items
  draw(ctx, configSettings = { shadows: true }, visibilityPolygon = null) {
    // 1. Draw floor tiling grid
    ctx.strokeStyle = '#121620';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // 2. Draw Items
    this.items.forEach(item => {
      if (!item.active) return;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
      
      // Floating glowing animation
      const scale = 1 + Math.sin(Date.now() / 150) * 0.15;
      
      if (item.type === 'health') {
        // Red Cross
        ctx.fillStyle = '#ff2e2e';
        ctx.shadowColor = '#ff2e2e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillRect(item.x - 2, item.y - 6, 4, 12);
        ctx.fillRect(item.x - 6, item.y - 2, 12, 4);
      } else {
        // Yellow Ammo Pack
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        // Draw bullet shape
        ctx.fillRect(item.x - 4, item.y - 4, 8, 8);
        ctx.moveTo(item.x - 4, item.y - 4);
        ctx.lineTo(item.x, item.y - 8);
        ctx.lineTo(item.x + 4, item.y - 4);
        ctx.fill();
      }
      ctx.restore();
    });

    // 3. Draw static elements: Walls and Crates
    this.walls.forEach(wall => {
      ctx.save();

      if (wall.type === 'wall') {
        // Futuristic Concrete Wall with Cyber Neon lines
        ctx.fillStyle = '#10141d';
        ctx.strokeStyle = '#45a29e';
        ctx.lineWidth = 2;
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

        // Pattern inside wall to look heavy
        ctx.fillStyle = 'rgba(69, 162, 158, 0.05)';
        ctx.fillRect(wall.x + 4, wall.y + 4, wall.w - 8, wall.h - 8);
      } else {
        // Destructible Wooden/Metal Crate
        ctx.fillStyle = '#4e3629';
        ctx.strokeStyle = '#d79e69';
        ctx.lineWidth = 1.5;
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

        // Inner bracing details
        ctx.beginPath();
        ctx.moveTo(wall.x + 2, wall.y + 2);
        ctx.lineTo(wall.x + wall.w - 2, wall.y + wall.h - 2);
        ctx.moveTo(wall.x + wall.w - 2, wall.y + 2);
        ctx.lineTo(wall.x + 2, wall.y + wall.h - 2);
        ctx.stroke();

        // Draw Health bar on damaged crates
        if (wall.health < wall.maxHealth) {
          const hpPercent = wall.health / wall.maxHealth;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(wall.x + 5, wall.y + 5, wall.w - 10, 5);
          ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : '#ff0000';
          ctx.fillRect(wall.x + 5, wall.y + 5, (wall.w - 10) * hpPercent, 5);
        }
      }

      ctx.restore();
    });

    // 4. Render Dynamic Visibility Shadow Overlay (Fog of War)
    if (configSettings.shadows && visibilityPolygon && visibilityPolygon.length > 0) {
      // To overlay dark shadows outside visibility polygon:
      // We draw shadows on an offscreen canvas or use clip.
      // Easiest inline trick:
      // Draw a black screen, but clip it to exclude the visibility polygon
      
      // Save canvas state
      ctx.save();
      
      // Create shadow paths covering the map, except the polygon
      ctx.beginPath();
      // Outer rect (counter-clockwise)
      ctx.rect(this.width, 0, -this.width, this.height);
      
      // Inner polygon (clockwise)
      const startPt = visibilityPolygon[0];
      ctx.moveTo(startPt.x, startPt.y);
      for (let i = 1; i < visibilityPolygon.length; i++) {
        ctx.lineTo(visibilityPolygon[i].x, visibilityPolygon[i].y);
      }
      ctx.closePath();
      
      // Fill the remainder (shadows)
      ctx.fillStyle = 'rgba(4, 5, 8, 0.94)'; // Dark tactical fog of war
      ctx.fill();
      
      ctx.restore();
    }
  }
}
