// Seeded random number generator for synchronized crate spawning
class SeededRandom {
  constructor(seed) { this.seed = seed; }
  next() { const x = Math.sin(this.seed++) * 10000; return x - Math.floor(x); }
  range(min, max) { return min + this.next() * (max - min); }
}

export class Map {
  constructor(width, height, seed) {
    this.width  = width;
    this.height = height;
    this.rng    = new SeededRandom(seed);

    this.walls    = [];   // { x, y, w, h, type:'wall'|'crate', material, health, ... }
    this.items    = [];   // { id, x, y, type:'health'|'ammo', active }
    this.zones    = [];   // { x, y, w, h, type:'healing'|'damage', healRate|multiplier, label }
    this.rooms    = [];   // room meta (for drawing)
    this.segments = [];   // raycasting segments

    this.generateMap();
  }

  // ─────────────────────────────────────────────────────────────────
  //  MAP GENERATION
  // ─────────────────────────────────────────────────────────────────
  generateMap() {
    this.walls  = [];
    this.items  = [];
    this.zones  = [];
    this.rooms  = [];

    const B  = 40;   // border/exterior wall thickness
    const W  = 22;   // interior wall thickness
    const DW = 88;   // doorway opening width

    const iL = B, iT = B, iR = this.width - B, iB = this.height - B;

    // ── Vertical dividers (x-positions of left edge of wall) ──
    const vx1 = 480;   // between left & centre columns
    const vx2 = 960;   // between centre & right columns

    // ── Horizontal dividers (y-positions of top edge of wall) ──
    const hy1 = 460;   // between top & mid rows
    const hy2 = 920;   // between mid & bottom rows

    // ── Column / row metrics ──
    const colL = vx1 - iL;              // left column width  = 440
    const colC = vx2 - vx1 - W;        // centre column width = 458
    const colR = iR  - vx2 - W;        // right column width  = 378

    const rowT = hy1 - iT;             // top row height    = 420
    const rowM = hy2 - hy1 - W;        // mid row height    = 438
    const rowB = iB  - hy2 - W;        // bot row height    = 418

    // ─────────────── ROOM DEFINITIONS ───────────────
    //  index: 0=Kitchen  1=Living Room  2=Office
    //         3=Bathroom 4=Hallway      5=Bedroom 1
    //         6=Garage   7=Master Bed   8=Bedroom 2
    const rooms = [
      { x: iL,       y: iT,       w: colL, h: rowT, name: 'Kitchen',         floor: 'tiles'    },
      { x: vx1+W,    y: iT,       w: colC, h: rowT, name: 'Living Room',     floor: 'carpet'   },
      { x: vx2+W,    y: iT,       w: colR, h: rowT, name: 'Office',          floor: 'wood'     },
      { x: iL,       y: hy1+W,    w: colL, h: rowM, name: 'Bathroom',        floor: 'tiles'    },
      { x: vx1+W,    y: hy1+W,    w: colC, h: rowM, name: 'Hallway',         floor: 'concrete' },
      { x: vx2+W,    y: hy1+W,    w: colR, h: rowM, name: 'Bedroom 1',       floor: 'carpet'   },
      { x: iL,       y: hy2+W,    w: colL, h: rowB, name: 'Garage',          floor: 'concrete' },
      { x: vx1+W,    y: hy2+W,    w: colC, h: rowB, name: 'Master Bedroom',  floor: 'carpet'   },
      { x: vx2+W,    y: hy2+W,    w: colR, h: rowB, name: 'Bedroom 2',       floor: 'wood'     },
    ];
    this.rooms = rooms;

    // ─────────────── EXTERIOR WALLS ───────────────
    this._push({ x:0,       y:0,       w:this.width, h:B,   type:'wall', material:'exterior' });
    this._push({ x:0,       y:iB,      w:this.width, h:B,   type:'wall', material:'exterior' });
    this._push({ x:0,       y:B,       w:B,  h:this.height-B*2, type:'wall', material:'exterior' });
    this._push({ x:iR,      y:B,       w:B,  h:this.height-B*2, type:'wall', material:'exterior' });

    // ─────────────── VERTICAL INTERIOR WALLS ───────────────
    // Wall at vx1 — 3 sections (top, mid, bot)
    this._addWallWithDoorway(vx1, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy1+W,   W, rowM, 'v', Math.round(rowM*0.35 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    // Wall at vx2
    this._addWallWithDoorway(vx2, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy1+W,   W, rowM, 'v', Math.round(rowM*0.65 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── HORIZONTAL INTERIOR WALLS ───────────────
    // Wall at hy1 — 3 sections
    this._addWallWithDoorway(iL,    hy1, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy1, colC, W, 'h', Math.round(colC*0.35 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy1, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    // Wall at hy2
    this._addWallWithDoorway(iL,    hy2, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy2, colC, W, 'h', Math.round(colC*0.65 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy2, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── FURNITURE PER ROOM ───────────────
    this._addFurniture(rooms);

    // ─────────────── HEALING ZONES ───────────────
    // Bathroom — fast heal
    { const r = rooms[3];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.06, label:'MEDIC STATION' }); }
    // Bedroom 1 — slow heal
    { const r = rooms[5];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.025, label:'REST ZONE' }); }
    // Master Bedroom — medium heal
    { const r = rooms[7];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.04, label:'RECOVERY ZONE' }); }

    // ─────────────── DAMAGE MULTIPLIER ZONES ───────────────
    // Garage — explosive barrels area
    { const r = rooms[6];
      this.zones.push({ x:r.x+60,y:r.y+60, w:r.w-120, h:r.h-120, type:'damage', multiplier:1.75, label:'EXPLOSIVE ZONE' }); }
    // Living Room centre — open field exposure
    { const r = rooms[1];
      this.zones.push({ x:r.x+r.w/4,y:r.y+r.h/4, w:r.w/2, h:r.h/2, type:'damage', multiplier:1.4, label:'EXPOSED AREA' }); }

    // ─────────────── FIXED ITEM PICKUPS ───────────────
    [
      { x: rooms[0].x + rooms[0].w/2, y: rooms[0].y + rooms[0].h/2, type:'health' },
      { x: rooms[2].x + rooms[2].w/2, y: rooms[2].y + rooms[2].h/2, type:'ammo'   },
      { x: rooms[4].x + rooms[4].w/2, y: rooms[4].y + rooms[4].h/2, type:'health' },
      { x: rooms[6].x + rooms[6].w/2, y: rooms[6].y + rooms[6].h/2, type:'ammo'   },
      { x: rooms[8].x + rooms[8].w/2, y: rooms[8].y + rooms[8].h/2, type:'health' },
    ].forEach((s, i) => {
      this.items.push({ id:`pickup_${i}`, x:s.x, y:s.y, type:s.type, active:true });
    });

    // ─────────────── DESTRUCTIBLE CRATES ───────────────
    this._spawnCrates();

    this.rebuildSegments();
  }

  _push(wall) { this.walls.push(wall); }

  // Split a wall rect into 2 pieces with a doorway gap
  _addWallWithDoorway(x, y, w, h, orientation, doorOffset, doorWidth, type, material) {
    if (orientation === 'v') {
      // w = thickness, h = length along Y
      const len = h;
      const d0 = Math.max(12, Math.min(len - doorWidth - 12, doorOffset));
      const d1 = d0 + doorWidth;
      if (d0 > 0)       this._push({ x, y,      w, h: d0,      type, material });
      if (d1 < len)     this._push({ x, y: y+d1, w, h: len-d1, type, material });
    } else {
      // h = thickness, w = length along X
      const len = w;
      const d0 = Math.max(12, Math.min(len - doorWidth - 12, doorOffset));
      const d1 = d0 + doorWidth;
      if (d0 > 0)       this._push({ x,      y, w: d0,      h, type, material });
      if (d1 < len)     this._push({ x: x+d1, y, w: len-d1, h, type, material });
    }
  }

  _addFurniture(rooms) {
    const F = (obj) => this._push({ ...obj, type:'wall', material:'furniture' });
    const Crate = (obj) => this._push({ ...obj, type:'crate', health:40, maxHealth:40, material:'barrel' });

    // 0 — Kitchen
    const K = rooms[0];
    F({ x:K.x+12, y:K.y+12, w:K.w-24, h:28, label:'counter' });          // top counter
    F({ x:K.x+12, y:K.y+40, w:28, h:K.h/2-10, label:'counter' });         // left counter
    F({ x:K.x+80, y:K.y+K.h-110, w:110, h:60, label:'table' });           // kitchen table
    F({ x:K.x+K.w-60, y:K.y+12, w:40, h:80, label:'fridge' });            // fridge

    // 1 — Living Room
    const L = rooms[1];
    F({ x:L.x+55, y:L.y+55, w:190, h:42, label:'sofa' });                 // sofa back
    F({ x:L.x+55, y:L.y+97, w:42, h:90, label:'sofa' });                  // sofa arm-L
    F({ x:L.x+L.w/2-55, y:L.y+130, w:110, h:55, label:'table' });         // coffee table
    F({ x:L.x+L.w-55, y:L.y+65, w:30, h:120, label:'tv' });               // TV cabinet
    F({ x:L.x+L.w-55, y:L.y+L.h-100, w:30, h:80, label:'shelf' });        // bookshelf

    // 2 — Office
    const O = rooms[2];
    F({ x:O.x+18, y:O.y+18, w:140, h:52, label:'desk' });                 // desk
    F({ x:O.x+O.w-38, y:O.y+12, w:22, h:210, label:'shelf' });            // bookshelf
    F({ x:O.x+18, y:O.y+O.h-60, w:80, h:40, label:'cabinet' });           // file cabinet

    // 3 — Bathroom
    const BA = rooms[3];
    F({ x:BA.x+12, y:BA.y+12, w:90, h:130, label:'tub' });                // bathtub
    F({ x:BA.x+12, y:BA.y+BA.h-58, w:65, h:38, label:'sink' });           // sink
    F({ x:BA.x+BA.w-50, y:BA.y+12, w:35, h:55, label:'cabinet' });        // medicine cabinet

    // 4 — Hallway / Dining
    const H = rooms[4];
    F({ x:H.x+H.w/2-80, y:H.y+H.h/2-45, w:160, h:90, label:'table' });   // dining table

    // 5 — Bedroom 1
    const B1 = rooms[5];
    F({ x:B1.x+12, y:B1.y+20, w:115, h:80, label:'bed' });                // bed
    F({ x:B1.x+B1.w-52, y:B1.y+12, w:36, h:55, label:'dresser' });        // dresser
    F({ x:B1.x+B1.w-52, y:B1.y+80, w:36, h:55, label:'cabinet' });        // wardrobe

    // 6 — Garage
    const G = rooms[6];
    F({ x:G.x+40,  y:G.y+75,       w:210, h:130, label:'car' });          // parked car
    F({ x:G.x+12,  y:G.y+G.h-48,   w:160, h:30,  label:'bench' });        // workbench
    Crate({ x:G.x+G.w-65, y:G.y+45,  w:38, h:38, id:'barrel_0' });        // explosive barrel A
    Crate({ x:G.x+G.w-65, y:G.y+93,  w:38, h:38, id:'barrel_1' });        // explosive barrel B
    Crate({ x:G.x+G.w-65, y:G.y+141, w:38, h:38, id:'barrel_2' });        // explosive barrel C

    // 7 — Master Bedroom
    const MB = rooms[7];
    F({ x:MB.x+MB.w/2-90, y:MB.y+18, w:180, h:110, label:'bed' });        // king bed
    F({ x:MB.x+12, y:MB.y+12, w:45, h:65, label:'dresser' });             // dresser L
    F({ x:MB.x+MB.w-60, y:MB.y+12, w:45, h:65, label:'dresser' });        // dresser R

    // 8 — Bedroom 2
    const B2 = rooms[8];
    F({ x:B2.x+12, y:B2.y+20, w:130, h:90, label:'bed' });                // bed
    F({ x:B2.x+B2.w-55, y:B2.y+12, w:38, h:110, label:'shelf' });         // tall shelf
    F({ x:B2.x+12, y:B2.y+B2.h-55, w:80, h:38, label:'cabinet' });        // toy box / cabinet
  }

  _spawnCrates() {
    const CS = 44; // crate size
    const NUM = 14;
    let spawned = 0, attempts = 0;

    while (spawned < NUM && attempts < 400) {
      attempts++;
      const cx = this.rng.range(60, this.width - 100);
      const cy = this.rng.range(60, this.height - 100);

      // Keep spawn corners clear (250px safety radius)
      if (cx < 250 && cy < 250)                               continue;
      if (cx > this.width-250 && cy > this.height-250)        continue;
      if (cx < 250 && cy > this.height-250)                   continue;
      if (cx > this.width-250 && cy < 250)                    continue;

      let overlap = false;
      const M = 14;
      for (const w of this.walls) {
        if (cx+CS+M > w.x && cx-M < w.x+w.w && cy+CS+M > w.y && cy-M < w.y+w.h) {
          overlap = true; break;
        }
      }
      if (!overlap) {
        this._push({ x:cx, y:cy, w:CS, h:CS, type:'crate', health:50, maxHealth:50,
                     id:`crate_${spawned}`, material:'crate' });
        spawned++;
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  ZONE QUERY
  // ─────────────────────────────────────────────────────────────────
  checkZone(px, py) {
    for (const z of this.zones) {
      if (px >= z.x && px <= z.x+z.w && py >= z.y && py <= z.y+z.h) return z;
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────
  //  PHYSICS & COLLISION
  // ─────────────────────────────────────────────────────────────────
  rebuildSegments() {
    this.segments = [];
    this.walls.forEach(w => {
      this.segments.push({ p1:{x:w.x,    y:w.y},    p2:{x:w.x+w.w, y:w.y}    });
      this.segments.push({ p1:{x:w.x+w.w,y:w.y},    p2:{x:w.x+w.w, y:w.y+w.h}});
      this.segments.push({ p1:{x:w.x+w.w,y:w.y+w.h},p2:{x:w.x,     y:w.y+w.h}});
      this.segments.push({ p1:{x:w.x,    y:w.y+w.h},p2:{x:w.x,     y:w.y}    });
    });
  }

  checkCircleCollision(cx, cy, r) {
    let x = cx, y = cy;
    for (const w of this.walls) {
      const clX = Math.max(w.x, Math.min(x, w.x+w.w));
      const clY = Math.max(w.y, Math.min(y, w.y+w.h));
      const dX = x - clX, dY = y - clY;
      const d2 = dX*dX + dY*dY;
      if (d2 < r*r) {
        const d = Math.sqrt(d2);
        if (d === 0) continue;
        const ov = r - d;
        x += (dX/d)*ov;
        y += (dY/d)*ov;
      }
    }
    return { x, y };
  }

  getLineIntersection(p1, p2) {
    let closest = null;
    for (const w of this.walls) {
      const edges = [
        {p1:{x:w.x,y:w.y},          p2:{x:w.x+w.w,y:w.y}    },
        {p1:{x:w.x+w.w,y:w.y},      p2:{x:w.x+w.w,y:w.y+w.h}},
        {p1:{x:w.x+w.w,y:w.y+w.h},  p2:{x:w.x,y:w.y+w.h}    },
        {p1:{x:w.x,y:w.y+w.h},      p2:{x:w.x,y:w.y}         }
      ];
      for (const e of edges) {
        const pt = this.getLineSegmentIntersection(p1, p2, e.p1, e.p2);
        if (pt) {
          const dx = pt.x-p1.x, dy = pt.y-p1.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (!closest || dist < closest.dist)
            closest = { x:pt.x, y:pt.y, dist, wall:w };
        }
      }
    }
    return closest;
  }

  getLineSegmentIntersection(a1, a2, b1, b2) {
    const s1x=a2.x-a1.x, s1y=a2.y-a1.y, s2x=b2.x-b1.x, s2y=b2.y-b1.y;
    const d = -s2x*s1y + s1x*s2y;
    if (Math.abs(d) < 1e-9) return null;
    const s = (-s1y*(a1.x-b1.x)+s1x*(a1.y-b1.y))/d;
    const t = ( s2x*(a1.y-b1.y)-s2y*(a1.x-b1.x))/d;
    if (s>=0&&s<=1&&t>=0&&t<=1) return { x:a1.x+t*s1x, y:a1.y+t*s1y };
    return null;
  }

  damageCrate(crateId, damage) {
    const idx = this.walls.findIndex(w => w.id === crateId);
    if (idx === -1) return null;
    const c = this.walls[idx];
    c.health -= damage;
    if (c.health <= 0) {
      this.walls.splice(idx, 1);
      this.rebuildSegments();
      let spawnedItem = null;
      if (this.rng.next() < 0.5) {
        const t = this.rng.next() < 0.55 ? 'health' : 'ammo';
        spawnedItem = { id:`item_${crateId}_${Date.now()}`, x:c.x+c.w/2, y:c.y+c.h/2, type:t, active:true };
        this.items.push(spawnedItem);
      }
      return { broken:true, item:spawnedItem, crateX:c.x+c.w/2, crateY:c.y+c.h/2 };
    }
    return { broken:false, health:c.health };
  }

  syncBreakCrate(crateId, spawnedItem) {
    const idx = this.walls.findIndex(w => w.id === crateId);
    if (idx !== -1) { this.walls.splice(idx, 1); this.rebuildSegments(); }
    if (spawnedItem && !this.items.some(i => i.id === spawnedItem.id))
      this.items.push(spawnedItem);
  }

  // ─────────────────────────────────────────────────────────────────
  //  RAYCASTING (Visibility polygon)
  // ─────────────────────────────────────────────────────────────────
  computeVisibilityPolygon(lx, ly, maxR) {
    const angles = new Set();
    this.walls.forEach(w => {
      [{x:w.x,y:w.y},{x:w.x+w.w,y:w.y},{x:w.x+w.w,y:w.y+w.h},{x:w.x,y:w.y+w.h}]
        .forEach(v => {
          const a = Math.atan2(v.y-ly, v.x-lx);
          angles.add(a-0.0001); angles.add(a); angles.add(a+0.0001);
        });
    });
    for (let a=0; a<Math.PI*2; a+=Math.PI/10) angles.add(a);

    const ends = [];
    angles.forEach(angle => {
      const rEnd = { x:lx+Math.cos(angle)*maxR, y:ly+Math.sin(angle)*maxR };
      const hit  = this.getLineIntersection({x:lx,y:ly}, rEnd);
      ends.push(hit && hit.dist < maxR ? {x:hit.x,y:hit.y,angle} : {...rEnd,angle});
    });
    ends.sort((a,b) => a.angle-b.angle);
    return ends;
  }

  // ─────────────────────────────────────────────────────────────────
  //  RENDERING
  // ─────────────────────────────────────────────────────────────────
  draw(ctx, configSettings = { shadows:true }, visibilityPolygon = null, px = null, py = null) {
    // 1. Draw room floors
    this.rooms.forEach(r => this._drawFloor(ctx, r));

    // 2. Zone overlays (before walls so walls render on top)
    this.zones.forEach(z => this._drawZone(ctx, z));

    // 3. Items
    this.items.forEach(item => { if (item.active) this._drawItem(ctx, item); });

    // 4. Walls / furniture / crates
    this.walls.forEach(w => this._drawWall(ctx, w));

    // 5. Fog of war & Light rendering
    if (configSettings.shadows && visibilityPolygon && visibilityPolygon.length > 0) {
      // Draw Fog of War (everything outside the visibility polygon is dark)
      ctx.save();
      ctx.beginPath();
      // Bounding box covering a huge area around the map to handle camera pans/zooms
      ctx.rect(-3000, -3000, 7400, 7400);
      
      // Draw visibility polygon
      ctx.moveTo(visibilityPolygon[0].x, visibilityPolygon[0].y);
      for (let i = 1; i < visibilityPolygon.length; i++) {
        ctx.lineTo(visibilityPolygon[i].x, visibilityPolygon[i].y);
      }
      ctx.closePath();
      
      ctx.fillStyle = 'rgba(4, 5, 8, 0.94)';
      ctx.fill('evenodd');
      ctx.restore();

      // Draw subtle light glow inside the visibility polygon (flashlight effect)
      if (px !== null && py !== null) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(visibilityPolygon[0].x, visibilityPolygon[0].y);
        for (let i = 1; i < visibilityPolygon.length; i++) {
          ctx.lineTo(visibilityPolygon[i].x, visibilityPolygon[i].y);
        }
        ctx.closePath();
        ctx.clip();

        const lightGrad = ctx.createRadialGradient(px, py, 20, px, py, 650);
        lightGrad.addColorStop(0, 'rgba(255, 255, 225, 0.12)'); // Soft warm light near player
        lightGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
        lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        ctx.fillStyle = lightGrad;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ── Floor textures ──
  _drawFloor(ctx, r) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();

    if (r.floor === 'tiles') {
      ctx.fillStyle = '#121a28';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      const TS = 44;
      // Alternating tile shade
      for (let tx = r.x; tx < r.x+r.w; tx += TS) {
        for (let ty = r.y; ty < r.y+r.h; ty += TS) {
          const even = (Math.floor((tx-r.x)/TS) + Math.floor((ty-r.y)/TS)) % 2 === 0;
          ctx.fillStyle = even ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';
          ctx.fillRect(tx, ty, TS, TS);
        }
      }
      // Grout lines
      ctx.strokeStyle = 'rgba(40,80,120,0.25)';
      ctx.lineWidth = 1;
      for (let tx = r.x; tx <= r.x+r.w; tx += TS) {
        ctx.beginPath(); ctx.moveTo(tx,r.y); ctx.lineTo(tx,r.y+r.h); ctx.stroke();
      }
      for (let ty = r.y; ty <= r.y+r.h; ty += TS) {
        ctx.beginPath(); ctx.moveTo(r.x,ty); ctx.lineTo(r.x+r.w,ty); ctx.stroke();
      }

    } else if (r.floor === 'carpet') {
      ctx.fillStyle = '#16102a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = 'rgba(80,50,140,0.12)';
      ctx.lineWidth = 1;
      for (let tx = r.x; tx <= r.x+r.w; tx += 9) {
        ctx.beginPath(); ctx.moveTo(tx,r.y); ctx.lineTo(tx,r.y+r.h); ctx.stroke();
      }
      for (let ty = r.y; ty <= r.y+r.h; ty += 9) {
        ctx.beginPath(); ctx.moveTo(r.x,ty); ctx.lineTo(r.x+r.w,ty); ctx.stroke();
      }
      // Rug border trim
      ctx.strokeStyle = 'rgba(120,80,200,0.15)';
      ctx.lineWidth = 3;
      ctx.strokeRect(r.x+15, r.y+15, r.w-30, r.h-30);

    } else if (r.floor === 'wood') {
      ctx.fillStyle = '#1a1208';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      const PH = 32;
      for (let ty = r.y; ty < r.y+r.h; ty += PH) {
        const idx = Math.floor((ty-r.y)/PH);
        ctx.fillStyle = idx%2===0 ? 'rgba(180,110,50,0.055)':'rgba(130,75,30,0.055)';
        ctx.fillRect(r.x, ty, r.w, PH-1);
        // plank divider
        ctx.strokeStyle = 'rgba(70,45,18,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(r.x,ty+PH-1); ctx.lineTo(r.x+r.w,ty+PH-1); ctx.stroke();
        // grain
        ctx.strokeStyle = 'rgba(140,90,40,0.07)';
        for (let gx = r.x+10; gx < r.x+r.w-10; gx += r.w/5) {
          ctx.beginPath(); ctx.moveTo(gx,ty); ctx.lineTo(gx+12,ty+PH-1); ctx.stroke();
        }
      }

    } else if (r.floor === 'concrete') {
      ctx.fillStyle = '#10101a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = 'rgba(55,55,80,0.25)';
      ctx.lineWidth = 1;
      const CS2 = 64;
      for (let tx = r.x; tx <= r.x+r.w; tx += CS2) {
        ctx.beginPath(); ctx.moveTo(tx,r.y); ctx.lineTo(tx,r.y+r.h); ctx.stroke();
      }
      for (let ty = r.y; ty <= r.y+r.h; ty += CS2) {
        ctx.beginPath(); ctx.moveTo(r.x,ty); ctx.lineTo(r.x+r.w,ty); ctx.stroke();
      }
      // Oil/grease stain patches in garage
      if (r.name === 'Garage') {
        ctx.fillStyle = 'rgba(30,25,10,0.4)';
        ctx.beginPath();
        ctx.ellipse(r.x+150, r.y+230, 60, 30, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.ellipse(r.x+80,  r.y+150, 40, 20, -0.2, 0, Math.PI*2); ctx.fill();
      }
    }

    // Room label
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Orbitron';
    ctx.fillStyle = 'rgba(120,200,240,0.15)';
    ctx.fillText(r.name.toUpperCase(), r.x+r.w/2, r.y+22);

    ctx.restore();
  }

  // ── Zone glow overlay ──
  _drawZone(ctx, z) {
    ctx.save();
    const pulse = Math.sin(Date.now()/600)*0.12 + 0.12;
    const heal = z.type === 'healing';

    // Fill
    ctx.fillStyle = heal
      ? `rgba(30,255,100,${pulse})`
      : `rgba(255,60,20,${pulse})`;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    // Animated border
    ctx.strokeStyle = heal
      ? `rgba(60,255,130,${pulse*2})`
      : `rgba(255,90,40,${pulse*2})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.lineDashOffset = -(Date.now()/60 % 16);
    ctx.strokeRect(z.x, z.y, z.w, z.h);
    ctx.setLineDash([]);

    // Corner markers
    const cs = 14;
    ctx.lineWidth = 2.5;
    [[z.x,z.y,1,1],[z.x+z.w,z.y,-1,1],[z.x,z.y+z.h,1,-1],[z.x+z.w,z.y+z.h,-1,-1]]
      .forEach(([cx,cy,dx,dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy+dy*cs); ctx.lineTo(cx,cy); ctx.lineTo(cx+dx*cs,cy);
        ctx.stroke();
      });

    // Label text
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillStyle = heal ? 'rgba(80,255,140,0.55)' : 'rgba(255,110,60,0.55)';
    ctx.fillText(z.label, z.x+z.w/2, z.y+z.h/2-6);

    // Multiplier / heal rate annotation
    const ann = heal ? `+${(z.healRate*60).toFixed(0)} HP/s` : `×${z.multiplier} DMG`;
    ctx.font = '9px Orbitron';
    ctx.fillStyle = heal ? 'rgba(80,255,140,0.4)' : 'rgba(255,110,60,0.4)';
    ctx.fillText(ann, z.x+z.w/2, z.y+z.h/2+10);

    ctx.restore();
  }

  // ── Item pickups ──
  _drawItem(ctx, item) {
    ctx.save();
    const sc = 1 + Math.sin(Date.now()/180)*0.14;

    if (item.type === 'health') {
      ctx.shadowColor = '#ff2e2e'; ctx.shadowBlur = 14;
      ctx.fillStyle = '#cc2020';
      ctx.beginPath(); ctx.arc(item.x, item.y, 11*sc, 0, Math.PI*2); ctx.fill();
      // White cross
      ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff';
      ctx.fillRect(item.x-2.5, item.y-6.5*sc, 5, 13*sc);
      ctx.fillRect(item.x-6.5*sc, item.y-2.5, 13*sc, 5);
    } else {
      ctx.shadowColor = '#ffcc00'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#cc9900';
      ctx.fillRect(item.x-7, item.y-7, 14, 14);
      // Bullet icon
      ctx.fillStyle = '#ffe060';
      ctx.fillRect(item.x-2, item.y-5, 4, 8);
      ctx.beginPath();
      ctx.arc(item.x, item.y-5, 2, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── Wall / furniture / crate rendering ──
  _drawWall(ctx, w) {
    ctx.save();
    switch (w.material) {
      case 'exterior':  this._drawExteriorWall(ctx, w); break;
      case 'interior':  this._drawInteriorWall(ctx, w); break;
      case 'furniture': this._drawFurniturePiece(ctx, w); break;
      case 'barrel':    this._drawBarrel(ctx, w); break;
      case 'crate':     this._drawCratePiece(ctx, w); break;
      default:          this._drawInteriorWall(ctx, w);
    }
    ctx.restore();
  }

  _drawExteriorWall(ctx, w) {
    // Dark brick exterior
    ctx.fillStyle = '#0b0b12';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = 'rgba(60,50,90,0.4)';
    ctx.lineWidth = 1;
    const bW=32, bH=13;
    for (let bx=w.x; bx<w.x+w.w; bx+=bW) {
      for (let by=w.y; by<w.y+w.h; by+=bH) {
        const off = (Math.floor((by-w.y)/bH)%2)*(bW/2);
        ctx.strokeRect(bx+off, by, bW, bH);
      }
    }
    // Inner neon border glow
    ctx.strokeStyle = 'rgba(102,252,241,0.28)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  }

  _drawInteriorWall(ctx, w) {
    ctx.fillStyle = '#1b1c22';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = 'rgba(90,130,170,0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
    // Baseboard trim
    ctx.strokeStyle = 'rgba(170,130,70,0.25)';
    ctx.lineWidth = 1;
    if (w.w > w.h) {
      ctx.beginPath(); ctx.moveTo(w.x,w.y+3);    ctx.lineTo(w.x+w.w,w.y+3);    ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w.x,w.y+w.h-3);ctx.lineTo(w.x+w.w,w.y+w.h-3);ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(w.x+3,w.y);    ctx.lineTo(w.x+3,w.y+w.h);    ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w.x+w.w-3,w.y);ctx.lineTo(w.x+w.w-3,w.y+w.h);ctx.stroke();
    }
  }

  _drawFurniturePiece(ctx, w) {
    const lbl = w.label || '';
    // Pick colour scheme by furniture type
    const schemes = {
      sofa:    { fill:'#261637', stroke:'#4a2a70' },
      table:   { fill:'#241510', stroke:'#7a4a22' },
      bed:     { fill:'#152030', stroke:'#2a5080' },
      counter: { fill:'#182215', stroke:'#3a7050' },
      desk:    { fill:'#1e1408', stroke:'#5a3a18' },
      tub:     { fill:'#0a1a2c', stroke:'#1a5a8a' },
      sink:    { fill:'#0a1828', stroke:'#2a6090' },
      tv:      { fill:'#0a0a14', stroke:'#4a4a70' },
      shelf:   { fill:'#1e1006', stroke:'#5a3010' },
      car:     { fill:'#1a1a28', stroke:'#3a3a5c' },
      bench:   { fill:'#1c1408', stroke:'#5c4018' },
      fridge:  { fill:'#141c24', stroke:'#3a5a78' },
      cabinet: { fill:'#18100a', stroke:'#5a3a1a' },
      dresser: { fill:'#1e1408', stroke:'#6a4020' },
    };
    const sc = schemes[lbl] || { fill:'#1a1a2a', stroke:'#4a4a80' };

    ctx.fillStyle = sc.fill;
    ctx.strokeStyle = sc.stroke;
    ctx.lineWidth = 1.5;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeRect(w.x, w.y, w.w, w.h);

    // Extra decorative details per type
    if (lbl === 'bed') {
      // Pillow
      ctx.fillStyle = 'rgba(60,100,150,0.4)';
      const pw = Math.min(50,w.w-16);
      ctx.fillRect(w.x+8, w.y+8, pw, Math.floor(w.h*0.35));
      // Blanket lines
      ctx.strokeStyle = 'rgba(60,110,180,0.3)'; ctx.lineWidth=1;
      for (let i=1;i<4;i++) { const ly=w.y+(w.h/4)*i; ctx.beginPath(); ctx.moveTo(w.x+5,ly); ctx.lineTo(w.x+w.w-5,ly); ctx.stroke(); }
    } else if (lbl === 'sofa' && w.w > w.h) {
      // Cushion dividers
      ctx.strokeStyle = 'rgba(110,65,170,0.4)'; ctx.lineWidth=1;
      for (let i=1;i<3;i++) { const lx=w.x+w.w*i/3; ctx.beginPath(); ctx.moveTo(lx,w.y+4); ctx.lineTo(lx,w.y+w.h-4); ctx.stroke(); }
    } else if (lbl === 'desk') {
      // Monitor
      ctx.fillStyle='#060612'; ctx.fillRect(w.x+w.w-52,w.y+6,36,24);
      ctx.strokeStyle='rgba(80,180,255,0.35)'; ctx.strokeRect(w.x+w.w-52,w.y+6,36,24);
    } else if (lbl === 'tub') {
      // Inner basin
      ctx.fillStyle='#0d2535'; ctx.fillRect(w.x+7,w.y+7,w.w-14,w.h-14);
      ctx.strokeStyle='rgba(50,170,255,0.25)'; ctx.strokeRect(w.x+7,w.y+7,w.w-14,w.h-14);
    } else if (lbl === 'car') {
      // Windshields
      ctx.fillStyle='#0a1828';
      ctx.fillRect(w.x+28,w.y+18,65,38);
      ctx.fillRect(w.x+w.w-95,w.y+18,65,38);
      ctx.strokeStyle='rgba(80,120,200,0.3)';
      ctx.strokeRect(w.x+28,w.y+18,65,38);
      ctx.strokeRect(w.x+w.w-95,w.y+18,65,38);
      // Roof outline
      ctx.strokeStyle='rgba(100,100,180,0.4)'; ctx.lineWidth=2;
      ctx.strokeRect(w.x+10,w.y+10,w.w-20,w.h-20);
    } else if (lbl === 'fridge') {
      // Handle
      ctx.strokeStyle='rgba(160,200,255,0.4)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(w.x+w.w/2-10,w.y+12); ctx.lineTo(w.x+w.w/2+10,w.y+12); ctx.stroke();
    } else if (lbl === 'shelf') {
      // Shelf planks
      ctx.fillStyle='rgba(100,60,20,0.5)';
      for (let i=1;i<4;i++) ctx.fillRect(w.x,w.y+(w.h/4)*i,w.w,3);
    }
  }

  _drawBarrel(ctx, w) {
    const cx = w.x+w.w/2, cy = w.y+w.h/2, r = w.w/2;
    ctx.fillStyle = '#2a1800';
    ctx.strokeStyle = '#9a4800';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Warning ring
    ctx.strokeStyle = 'rgba(255,120,0,0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx,cy,r-5,0,Math.PI*2); ctx.stroke();
    // Hazard X
    ctx.strokeStyle = 'rgba(255,160,0,0.4)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(cx-r*0.4,cy-r*0.4); ctx.lineTo(cx+r*0.4,cy+r*0.4);
    ctx.moveTo(cx+r*0.4,cy-r*0.4); ctx.lineTo(cx-r*0.4,cy+r*0.4);
    ctx.stroke();

    if (w.health < w.maxHealth) {
      const hp = w.health/w.maxHealth;
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(w.x,w.y+2,w.w,4);
      ctx.fillStyle = hp>0.5?'#39ff14':'#ff3c3c';
      ctx.fillRect(w.x,w.y+2,w.w*hp,4);
    }
  }

  _drawCratePiece(ctx, w) {
    ctx.fillStyle = '#3a2b1e';
    ctx.strokeStyle = '#b8865c';
    ctx.lineWidth = 1.5;
    ctx.fillRect(w.x,w.y,w.w,w.h);
    ctx.strokeRect(w.x,w.y,w.w,w.h);
    // Cross braces
    ctx.strokeStyle='rgba(170,110,60,0.4)'; ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(w.x+3,w.y+3);    ctx.lineTo(w.x+w.w-3,w.y+w.h-3);
    ctx.moveTo(w.x+w.w-3,w.y+3);ctx.lineTo(w.x+3,w.y+w.h-3);
    ctx.stroke();
    // Corner brackets
    ctx.strokeStyle='rgba(210,150,80,0.7)'; ctx.lineWidth=1.5;
    const cs2=8;
    [[w.x,w.y,1,1],[w.x+w.w,w.y,-1,1],[w.x,w.y+w.h,1,-1],[w.x+w.w,w.y+w.h,-1,-1]]
      .forEach(([bx,by,dx,dy]) => {
        ctx.beginPath();
        ctx.moveTo(bx,by+dy*cs2); ctx.lineTo(bx,by); ctx.lineTo(bx+dx*cs2,by);
        ctx.stroke();
      });

    if (w.health < w.maxHealth) {
      const hp = w.health/w.maxHealth;
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(w.x+4,w.y+4,w.w-8,5);
      ctx.fillStyle = hp>0.5?'#39ff14':'#ff3c3c';
      ctx.fillRect(w.x+4,w.y+4,(w.w-8)*hp,5);
    }
  }
}
