// Seeded random number generator for synchronized crate spawning
class SeededRandom {
  constructor(seed) { this.seed = seed; }
  next() { const x = Math.sin(this.seed++) * 10000; return x - Math.floor(x); }
  range(min, max) { return min + this.next() * (max - min); }
}

export class Map {
  constructor(width, height, seed, mapId = 'manor') {
    this.width  = width;
    this.height = height;
    this.seed   = seed;
    this.rng    = new SeededRandom(seed);
    this.mapId  = mapId;

    this.walls    = [];   // { x, y, w, h, type:'wall'|'crate', material, health, ... }
    this.items    = [];   // { id, x, y, type:'health'|'ammo', active }
    this.zones    = [];   // { x, y, w, h, type:'healing'|'damage', healRate|multiplier, label }
    this.rooms    = [];   // room meta (for drawing)
    this.decorations = [];
    this.segments = [];   // raycasting segments
    this.ambientLights = {};

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
    this.decorations = [];

    if (this.mapId === 'cyberlab') {
      this.generateCyberLabMap();
    } else {
      this.generateManorMap();
    }

    this.initTerminals();
    this.rebuildSegments();
  }

  generateManorMap() {
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
    this._addWallWithDoorway(vx1, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy1+W,   W, rowM, 'v', Math.round(rowM*0.35 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    this._addWallWithDoorway(vx2, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy1+W,   W, rowM, 'v', Math.round(rowM*0.65 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── HORIZONTAL INTERIOR WALLS ───────────────
    this._addWallWithDoorway(iL,    hy1, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy1, colC, W, 'h', Math.round(colC*0.35 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy1, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    this._addWallWithDoorway(iL,    hy2, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy2, colC, W, 'h', Math.round(colC*0.65 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy2, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── FURNITURE PER ROOM ───────────────
    this._addFurniture(rooms);
    this._addDecorations(rooms);

    // ─────────────── HEALING ZONES ───────────────
    { const r = rooms[3];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.06, label:'MEDIC STATION' }); }
    { const r = rooms[5];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.025, label:'REST ZONE' }); }
    { const r = rooms[7];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.04, label:'RECOVERY ZONE' }); }

    // ─────────────── DAMAGE MULTIPLIER ZONES ───────────────
    { const r = rooms[6];
      this.zones.push({ x:r.x+60,y:r.y+60, w:r.w-120, h:r.h-120, type:'damage', multiplier:1.75, label:'EXPLOSIVE ZONE' }); }
    { const r = rooms[1];
      this.zones.push({ x:r.x+r.w/4,y:r.y+r.h/4, w:r.w/2, h:r.h/2, type:'damage', multiplier:1.4, label:'EXPOSED AREA' }); }

    // ─────────────── RANDOMIZED ITEM PICKUPS ───────────────
    const manorConsumables = ['health', 'ammo', 'adrenaline', 'ammo', 'overdrive'];
    this._spawnRandomConsumables(manorConsumables, 'pickup');

    // ─────────────── DESTRUCTIBLE CRATES ───────────────
    this._spawnCrates();

    // ─────────────── AMBIENT LIGHTS ───────────────
    this.ambientLights = {
      brokenCeiling: { x: 731, y: 701, radius: 240, on: true, innerRadius: 20, color: 'rgba(200, 230, 255, 0.25)', colorMid: 'rgba(200, 230, 255, 0.08)', pulseType: 'none', fixtureType: 'brokenCeiling' },
      lantern: { x: 1171, y: 250, radius: 180, on: true, innerRadius: 5, color: 'rgba(255, 140, 40, 0.22)', colorMid: 'rgba(255, 140, 40, 0.10)', pulseType: 'lantern', fixtureType: 'lantern' },
      kitchen: { x: 260, y: 250, radius: 200, on: true, innerRadius: 10, color: 'rgba(102, 252, 241, 0.20)', colorMid: 'rgba(102, 252, 241, 0.08)', pulseType: 'none', fixtureType: 'kitchen' },
      garage: { x: 260, y: 1150, radius: 220, on: true, innerRadius: 10, color: 'rgba(255, 60, 60, 0.22)', colorMid: 'rgba(255, 60, 60, 0.09)', pulseType: 'garage', fixtureType: 'garage' },
      bedroom2: { x: 1171, y: 1150, radius: 190, on: true, innerRadius: 10, color: 'rgba(255, 110, 247, 0.20)', colorMid: 'rgba(255, 110, 247, 0.08)', pulseType: 'none', fixtureType: 'bedroom2' }
    };
  }

  generateCyberLabMap() {
    const B  = 40;   // border/exterior wall thickness
    const W  = 22;   // interior wall thickness
    const DW = 88;   // doorway opening width

    const iL = B, iT = B, iR = this.width - B, iB = this.height - B;

    const vx1 = 450;
    const vx2 = 950;
    const hy1 = 450;
    const hy2 = 950;

    const colL = vx1 - iL;
    const colC = vx2 - vx1 - W;
    const colR = iR - vx2 - W;

    const rowT = hy1 - iT;
    const rowM = hy2 - hy1 - W;
    const rowB = iB - hy2 - W;

    // ─────────────── CYBER LAB ROOMS ───────────────
    const rooms = [
      { x: iL,       y: iT,       w: colL, h: rowT, name: 'Cyber Lounge',    floor: 'cybercarpet' },
      { x: vx1+W,    y: iT,       w: colC, h: rowT, name: 'Quantum Lab',     floor: 'cybergrid'   },
      { x: vx2+W,    y: iT,       w: colR, h: rowT, name: 'Security Hub',    floor: 'nanogrid'    },
      { x: iL,       y: hy1+W,    w: colL, h: rowM, name: 'Server Room',     floor: 'cybergrid'   },
      { x: vx1+W,    y: hy1+W,    w: colC, h: rowM, name: 'AI Core',         floor: 'cybergrid'   },
      { x: vx2+W,    y: hy1+W,    w: colR, h: rowM, name: 'Cryo Chambers',   floor: 'nanogrid'    },
      { x: iL,       y: hy2+W,    w: colL, h: rowB, name: 'Weaponry Depot',  floor: 'concrete'    },
      { x: vx1+W,    y: hy2+W,    w: colC, h: rowB, name: 'Reactor Matrix',  floor: 'reactor'     },
      { x: vx2+W,    y: hy2+W,    w: colR, h: rowB, name: 'Matrix Hall',     floor: 'cybercarpet' },
    ];
    this.rooms = rooms;

    // ─────────────── EXTERIOR WALLS ───────────────
    this._push({ x:0,       y:0,       w:this.width, h:B,   type:'wall', material:'exterior' });
    this._push({ x:0,       y:iB,      w:this.width, h:B,   type:'wall', material:'exterior' });
    this._push({ x:0,       y:B,       w:B,  h:this.height-B*2, type:'wall', material:'exterior' });
    this._push({ x:iR,      y:B,       w:B,  h:this.height-B*2, type:'wall', material:'exterior' });

    // ─────────────── VERTICAL INTERIOR WALLS ───────────────
    this._addWallWithDoorway(vx1, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy1+W,   W, rowM, 'v', Math.round(rowM*0.45 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    this._addWallWithDoorway(vx2, iT,      W, rowT, 'v', Math.round(rowT*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy1+W,   W, rowM, 'v', Math.round(rowM*0.55 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2, hy2+W,   W, rowB, 'v', Math.round(rowB*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── HORIZONTAL INTERIOR WALLS ───────────────
    this._addWallWithDoorway(iL,    hy1, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy1, colC, W, 'h', Math.round(colC*0.45 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy1, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    this._addWallWithDoorway(iL,    hy2, colL, W, 'h', Math.round(colL*0.5  - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx1+W, hy2, colC, W, 'h', Math.round(colC*0.55 - DW/2), DW, 'wall', 'interior');
    this._addWallWithDoorway(vx2+W, hy2, colR, W, 'h', Math.round(colR*0.5  - DW/2), DW, 'wall', 'interior');

    // ─────────────── FURNITURE PER ROOM ───────────────
    this._addCyberLabFurniture(rooms);

    // ─────────────── HEALING ZONES ───────────────
    { const r = rooms[1];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.05, label:'QUANTUM STABILIZER' }); }
    { const r = rooms[5];
      this.zones.push({ x:r.x+30,y:r.y+30, w:r.w-60, h:r.h-60, type:'healing', healRate:0.035, label:'CRYO RECOVERY' }); }

    // ─────────────── DAMAGE MULTIPLIER ZONES ───────────────
    { const r = rooms[7];
      this.zones.push({ x:r.x+50,y:r.y+50, w:r.w-100, h:r.h-100, type:'damage', multiplier:2.0, label:'REACTOR ENERGY CORE' }); }

    // ─────────────── RANDOMIZED ITEM PICKUPS ───────────────
    const cyberConsumables = ['health', 'ammo', 'health', 'adrenaline', 'health', 'ammo', 'overdrive'];
    this._spawnRandomConsumables(cyberConsumables, 'pickup_cyber');

    // ─────────────── DESTRUCTIBLE CRATES ───────────────
    this._spawnCrates();

    // ─────────────── AMBIENT LIGHTS ───────────────
    this.ambientLights = {
      aiCore: { x: 700, y: 700, radius: 260, on: true, innerRadius: 20, color: 'rgba(102, 252, 241, 0.28)', colorMid: 'rgba(102, 252, 241, 0.12)', pulseType: 'quantum', fixtureType: 'reactor_light' },
      quantumLab: { x: 700, y: 250, radius: 220, on: true, innerRadius: 10, color: 'rgba(157, 59, 255, 0.26)', colorMid: 'rgba(157, 59, 255, 0.10)', pulseType: 'none', fixtureType: 'quantum' },
      reactor: { x: 700, y: 1150, radius: 240, on: true, innerRadius: 15, color: 'rgba(255, 127, 59, 0.28)', colorMid: 'rgba(255, 127, 59, 0.12)', pulseType: 'garage', fixtureType: 'reactor_light' },
      serverRoom: { x: 250, y: 700, radius: 220, on: true, innerRadius: 10, color: 'rgba(57, 219, 20, 0.24)', colorMid: 'rgba(57, 219, 20, 0.09)', pulseType: 'none', fixtureType: 'server_rack_light' },
      cryo: { x: 1150, y: 700, radius: 220, on: true, innerRadius: 10, color: 'rgba(102, 252, 241, 0.24)', colorMid: 'rgba(102, 252, 241, 0.09)', pulseType: 'none', fixtureType: 'cryo_light' }
    };
  }

  _addCyberLabFurniture(rooms) {
    const F = (obj) => this._push({ ...obj, type:'wall', material:'furniture' });

    // 0 — Cyber Lounge
    const CL = rooms[0];
    F({ x: CL.x + 50, y: CL.y + 50, w: 90, h: 32, label: 'cyber_couch' });       // Top couch
    F({ x: CL.x + 50, y: CL.y + 120, w: 90, h: 32, label: 'cyber_couch' });      // Mid couch
    F({ x: CL.x + CL.w - 82, y: CL.y + 50, w: 32, h: 100, label: 'cyber_couch' }); // Right couch
    F({ x: CL.x + CL.w - 150, y: CL.y + 80, w: 45, h: 45, label: 'table' });     // Glass coffee table
    F({ x: CL.x + 20, y: CL.y + CL.h - 60, w: 24, h: 24, label: 'plant' });       // Corner plants
    F({ x: CL.x + CL.w - 50, y: CL.y + CL.h - 60, w: 24, h: 24, label: 'plant' });

    // 1 — Quantum Lab
    const QL = rooms[1];
    F({ x: QL.x + 30, y: QL.y + 30, w: 35, h: 35, label: 'containment_pod' });   // Tube 1
    F({ x: QL.x + QL.w - 65, y: QL.y + 30, w: 35, h: 35, label: 'containment_pod' }); // Tube 2
    F({ x: QL.x + QL.w / 2 - 40, y: QL.y + QL.h - 40, w: 80, h: 28, label: 'cyber_console' }); // Lab terminal console
    F({ x: QL.x + 30, y: QL.y + QL.h - 100, w: 35, h: 35, label: 'nano_charger' }); // Nano charge dock

    // 2 — Security Hub
    const SH = rooms[2];
    F({ x: SH.x + 20, y: SH.y + 20, w: 25, h: 180, label: 'shelf' });            // Cyber files / databases
    F({ x: SH.x + 70, y: SH.y + 60, w: 100, h: 40, label: 'desk' });             // Monitor security desk
    F({ x: SH.x + 105, y: SH.y + 110, w: 30, h: 30, label: 'chair' });           // Swivel chair

    // 3 — Server Room
    const SR = rooms[3];
    F({ x: SR.x + 40, y: SR.y + 30, w: 24, h: 100, label: 'server_rack' });
    F({ x: SR.x + 110, y: SR.y + 30, w: 24, h: 100, label: 'server_rack' });
    F({ x: SR.x + 40, y: SR.y + 190, w: 24, h: 100, label: 'server_rack' });
    F({ x: SR.x + 110, y: SR.y + 190, w: 24, h: 100, label: 'server_rack' });
    F({ x: SR.x + SR.w - 50, y: SR.y + SR.h / 2 - 30, w: 32, h: 60, label: 'cyber_console' });

    // 4 — AI Core (Center Room)
    const AC = rooms[4];
    F({ x: AC.x + AC.w / 2 - 40, y: AC.y + AC.h / 2 - 40, w: 80, h: 80, label: 'reactor_core' }); // Big central core
    F({ x: AC.x + 40, y: AC.y + AC.h / 2 - 15, w: 45, h: 30, label: 'cyber_console' });
    F({ x: AC.x + AC.w - 85, y: AC.y + AC.h / 2 - 15, w: 45, h: 30, label: 'cyber_console' });
    F({ x: AC.x + AC.w / 2 - 22, y: AC.y + 40, w: 44, h: 28, label: 'cyber_console' });
    F({ x: AC.x + AC.w / 2 - 22, y: AC.y + AC.h - 68, w: 44, h: 28, label: 'cyber_console' });

    // 5 — Cryo Chambers
    const CC = rooms[5];
    F({ x: CC.x + 30, y: CC.y + 30, w: 35, h: 55, label: 'containment_pod' });
    F({ x: CC.x + 85, y: CC.y + 30, w: 35, h: 55, label: 'containment_pod' });
    F({ x: CC.x + 140, y: CC.y + 30, w: 35, h: 55, label: 'containment_pod' });
    F({ x: CC.x + CC.w - 50, y: CC.y + CC.h - 100, w: 32, h: 65, label: 'cyber_console' });

    // 6 — Weaponry Depot
    const WD = rooms[6];
    F({ x: WD.x + 30, y: WD.y + 30, w: 120, h: 45, label: 'desk' });             // Armory desk/racks
    F({ x: WD.x + 30, y: WD.y + 110, w: 35, h: 80, label: 'cabinet' });          // Ammo storage locker
    F({ x: WD.x + WD.w - 60, y: WD.y + 30, w: 40, h: 100, label: 'shelf' });      // Gun racks

    // 7 — Reactor Matrix
    const RM = rooms[7];
    F({ x: RM.x + RM.w / 2 - 30, y: RM.y + RM.h / 2 - 30, w: 60, h: 60, label: 'reactor_core' }); // secondary power source
    F({ x: RM.x + 30, y: RM.y + 30, w: 24, h: 24, label: 'plant' });             // Synthetic decorative plants
    F({ x: RM.x + RM.w - 54, y: RM.y + 30, w: 24, h: 24, label: 'plant' });

    // 8 — Matrix Hall
    const MH = rooms[8];
    F({ x: MH.x + MH.w / 2 - 25, y: MH.y + 40, w: 50, h: 50, label: 'table' }); // Hologram projector pedestal
    F({ x: MH.x + 50, y: MH.y + MH.h - 70, w: 80, h: 32, label: 'cyber_couch' });
    F({ x: MH.x + MH.w - 130, y: MH.y + MH.h - 70, w: 80, h: 32, label: 'cyber_couch' });
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
    F({ x:K.x+80+42, y:K.y+K.h-138, w:26, h:26, label:'chair' });         // kitchen chair top
    F({ x:K.x+80+42, y:K.y+K.h-48, w:26, h:26, label:'chair' });          // kitchen chair bot
    F({ x:K.x+18, y:K.y+K.h-50, w:24, h:24, label:'plant' });             // corner plant
    F({ x:K.x+K.w-60, y:K.y+12, w:40, h:80, label:'fridge' });            // fridge

    // 1 — Living Room
    const L = rooms[1];
    F({ x:L.x+55, y:L.y+55, w:190, h:42, label:'sofa' });                 // sofa back
    F({ x:L.x+55, y:L.y+97, w:42, h:90, label:'sofa' });                  // sofa arm-L
    F({ x:L.x+18, y:L.y+110, w:38, h:42, label:'sofa' });                 // armchair
    F({ x:L.x+L.w/2-55, y:L.y+130, w:110, h:55, label:'table' });         // coffee table
    F({ x:L.x+L.w-55, y:L.y+65, w:30, h:120, label:'tv' });               // TV cabinet
    F({ x:L.x+L.w-55, y:L.y+L.h-100, w:30, h:80, label:'shelf' });        // bookshelf
    F({ x:L.x+L.w-50, y:L.y+18, w:24, h:24, label:'plant' });             // plant

    // 2 — Office
    const O = rooms[2];
    F({ x:O.x+18, y:O.y+18, w:140, h:52, label:'desk' });                 // desk
    F({ x:O.x+18+55, y:O.y+18+56, w:30, h:30, label:'chair' });           // desk chair
    F({ x:O.x+O.w-38, y:O.y+12, w:22, h:210, label:'shelf' });            // bookshelf
    F({ x:O.x+18, y:O.y+O.h-60, w:80, h:40, label:'cabinet' });           // file cabinet
    F({ x:O.x+O.w-50, y:O.y+O.h-50, w:24, h:24, label:'plant' });         // plant

    // 3 — Bathroom
    const BA = rooms[3];
    F({ x:BA.x+12, y:BA.y+12, w:90, h:130, label:'tub' });                // bathtub
    F({ x:BA.x+12, y:BA.y+BA.h-58, w:65, h:38, label:'sink' });           // sink
    F({ x:BA.x+BA.w-50, y:BA.y+12, w:35, h:55, label:'cabinet' });        // medicine cabinet
    F({ x:BA.x+BA.w-45, y:BA.y+BA.h-60, w:28, h:38, label:'toilet' });    // toilet

    // 4 — Hallway / Dining
    const H = rooms[4];
    F({ x:H.x+H.w/2-80, y:H.y+H.h/2-45, w:160, h:90, label:'table' });   // dining table
    F({ x:H.x+H.w/2-60, y:H.y+H.h/2-80, w:26, h:26, label:'chair' });     // chair TL
    F({ x:H.x+H.w/2+30, y:H.y+H.h/2-80, w:26, h:26, label:'chair' });     // chair TR
    F({ x:H.x+H.w/2-60, y:H.y+H.h/2+90, w:26, h:26, label:'chair' });     // chair BL
    F({ x:H.x+H.w/2+30, y:H.y+H.h/2+90, w:26, h:26, label:'chair' });     // chair BR

    // 5 — Bedroom 1
    const B1 = rooms[5];
    F({ x:B1.x+12, y:B1.y+20, w:115, h:80, label:'bed' });                // bed
    F({ x:B1.x+12+120, y:B1.y+20, w:32, h:32, label:'dresser' });         // nightstand
    F({ x:B1.x+B1.w-52, y:B1.y+12, w:36, h:55, label:'dresser' });        // dresser
    F({ x:B1.x+B1.w-52, y:B1.y+80, w:36, h:55, label:'cabinet' });        // wardrobe
    F({ x:B1.x+12, y:B1.y+B1.h-90, w:80, h:40, label:'desk' });            // desk
    F({ x:B1.x+12+27, y:B1.y+B1.h-46, w:26, h:26, label:'chair' });       // chair

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
    F({ x:MB.x+MB.w/2-130, y:MB.y+18, w:32, h:32, label:'dresser' });     // nightstand L
    F({ x:MB.x+MB.w/2+100, y:MB.y+18, w:32, h:32, label:'dresser' });     // nightstand R
    F({ x:MB.x+12, y:MB.y+12, w:45, h:65, label:'dresser' });             // dresser L
    F({ x:MB.x+MB.w-60, y:MB.y+12, w:45, h:65, label:'dresser' });        // dresser R
    F({ x:MB.x+18, y:MB.y+MB.h-50, w:24, h:24, label:'plant' });          // plant

    // 8 — Bedroom 2
    const B2 = rooms[8];
    F({ x:B2.x+12, y:B2.y+20, w:130, h:90, label:'bed' });                // bed
    F({ x:B2.x+12+135, y:B2.y+20, w:32, h:32, label:'dresser' });         // nightstand
    F({ x:B2.x+B2.w-55, y:B2.y+12, w:38, h:110, label:'shelf' });         // tall shelf
    F({ x:B2.x+B2.w-110, y:B2.y+B2.h-60, w:90, h:40, label:'desk' });     // computer desk
    F({ x:B2.x+B2.w-78, y:B2.y+B2.h-95, w:26, h:26, label:'chair' });     // desk chair
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

  _spawnRandomConsumables(itemsList, prefix) {
    const safetyDist = 30; // safety margin from walls
    
    itemsList.forEach((type, index) => {
      let spawned = false;
      let attempts = 0;
      
      while (!spawned && attempts < 150) {
        attempts++;
        // Pick a random room
        const roomIdx = Math.floor(this.rng.next() * this.rooms.length);
        const room = this.rooms[roomIdx];
        
        // Pick a random spot in the room (with some padding)
        const pad = 40;
        const rx = this.rng.range(room.x + pad, room.x + room.w - pad);
        const ry = this.rng.range(room.y + pad, room.y + room.h - pad);
        
        // Check overlap with walls (including crates and furniture)
        let overlap = false;
        for (const w of this.walls) {
          if (rx + safetyDist > w.x && rx - safetyDist < w.x + w.w &&
              ry + safetyDist > w.y && ry - safetyDist < w.y + w.h) {
            overlap = true;
            break;
          }
        }
        
        // Keep spawn corners clear (250px safety radius)
        if (rx < 250 && ry < 250) overlap = true;
        if (rx > this.width-250 && ry > this.height-250) overlap = true;
        if (rx < 250 && ry > this.height-250) overlap = true;
        if (rx > this.width-250 && ry < 250) overlap = true;
        
        if (!overlap) {
          this.items.push({
            id: `${prefix}_${index}`,
            x: rx,
            y: ry,
            type: type,
            active: true
          });
          spawned = true;
        }
      }
      
      // Fallback: if it couldn't find a non-overlapping spot, spawn it at the center of a random room
      if (!spawned) {
        const roomIdx = Math.floor(this.rng.next() * this.rooms.length);
        const room = this.rooms[roomIdx];
        this.items.push({
          id: `${prefix}_${index}`,
          x: room.x + room.w / 2,
          y: room.y + room.h / 2,
          type: type,
          active: true
        });
      }
    });
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
        const roll = this.rng.next();
        let t = 'health';
        if (roll < 0.40) t = 'health';
        else if (roll < 0.70) t = 'ammo';
        else if (roll < 0.85) t = 'adrenaline';
        else t = 'overdrive';
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
  computeVisibilityPolygon(lx, ly, maxR, coneCenterAngle = null, coneWidth = null) {
    const angles = new Set();
    const normalizeAngle = (ang) => {
      let a = ang;
      while (a < -Math.PI) a += Math.PI * 2;
      while (a > Math.PI) a -= Math.PI * 2;
      return a;
    };

    const isInsideCone = (ang) => {
      if (coneCenterAngle === null || coneWidth === null) return true;
      let diff = ang - coneCenterAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      return Math.abs(diff) <= coneWidth / 2;
    };

    this.walls.forEach(w => {
      [{x:w.x,y:w.y},{x:w.x+w.w,y:w.y},{x:w.x+w.w,y:w.y+w.h},{x:w.x,y:w.y+w.h}]
        .forEach(v => {
          const a = Math.atan2(v.y-ly, v.x-lx);
          if (isInsideCone(a)) {
            angles.add(normalizeAngle(a-0.0001)); 
            angles.add(a); 
            angles.add(normalizeAngle(a+0.0001));
          }
        });
    });

    if (coneCenterAngle !== null && coneWidth !== null) {
      // Flashlight cone: cast rays along the cone boundary and inside it
      const startA = coneCenterAngle - coneWidth / 2;
      const endA = coneCenterAngle + coneWidth / 2;
      angles.add(normalizeAngle(startA));
      angles.add(normalizeAngle(endA));
      
      // Cast intermediate rays inside the cone
      for (let a = startA; a < endA; a += Math.PI / 18) {
        angles.add(normalizeAngle(a));
      }
    } else {
      // Add circle partitions in [-PI, PI] range
      for (let a = -Math.PI; a < Math.PI; a += Math.PI / 10) {
        angles.add(a);
      }
    }

    const ends = [];
    angles.forEach(angle => {
      const rEnd = { x:lx+Math.cos(angle)*maxR, y:ly+Math.sin(angle)*maxR };
      const hit  = this.getLineIntersection({x:lx,y:ly}, rEnd);
      ends.push(hit && hit.dist < maxR ? {x:hit.x,y:hit.y,angle} : {...rEnd,angle});
    });
    
    // Sort angles relative to center to avoid wrap-around sorting bugs
    const center = coneCenterAngle !== null ? coneCenterAngle : 0;
    ends.sort((a,b) => {
      let diffA = a.angle - center;
      while (diffA < -Math.PI) diffA += Math.PI * 2;
      while (diffA > Math.PI) diffA -= Math.PI * 2;
      
      let diffB = b.angle - center;
      while (diffB < -Math.PI) diffB += Math.PI * 2;
      while (diffB > Math.PI) diffB -= Math.PI * 2;
      
      return diffA - diffB;
    });
    
    if (coneCenterAngle !== null && coneWidth !== null) {
      // Prepend and append player center to close the wedge
      ends.unshift({ x: lx, y: ly, angle: -999 });
      ends.push({ x: lx, y: ly, angle: 999 });
    }
    
    return ends;
  }

  draw(ctx, configSettings = { shadows:true }, players = [], localPlayer = null, bullets = []) {
    // 1. Draw room floors
    this.rooms.forEach(r => this._drawFloor(ctx, r));

    // Draw decorations (rugs)
    this.decorations.forEach(d => this._drawDecoration(ctx, d));

    // 2. Zone overlays (before walls so walls render on top)
    this.zones.forEach(z => this._drawZone(ctx, z));

    // 3. Items
    this.items.forEach(item => { if (item.active) this._drawItem(ctx, item); });

    ctx.save();
    let camX = this.width / 2;
    let camY = this.height / 2;
    if (localPlayer) {
      camX = localPlayer.x;
      camY = localPlayer.y;
    }
    this.walls.forEach(w => this._drawWall(ctx, w, camX, camY));
    ctx.restore();

    // Draw Hacking Terminals
    if (this.terminals) {
      this.terminals.forEach(term => {
        if (term.active) {
          this._drawTerminal(ctx, term);
        }
      });
    }

    // 5. Fog of war & Light rendering
    if (configSettings.shadows && players && players.length > 0) {
      if (!this.maskCanvas) {
        this.maskCanvas = document.createElement('canvas');
        this.maskCtx = this.maskCanvas.getContext('2d');
      }
      
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      
      if (this.maskCanvas.width !== width || this.maskCanvas.height !== height) {
        this.maskCanvas.width = width;
        this.maskCanvas.height = height;
      }

      // Fill mask with near pitch black
      this.maskCtx.fillStyle = 'rgba(3, 4, 6, 0.995)';
      this.maskCtx.fillRect(0, 0, width, height);

      // Save mask state and apply the current transform of the main context
      this.maskCtx.save();
      this.maskCtx.setTransform(ctx.getTransform());

      const time = Date.now();
      const rawFlicker = Math.sin(time * 0.04) * Math.cos(time * 0.007) + Math.sin(time * 0.1) * 0.5;
      const brokenLightOn = rawFlicker > -0.45;
      if (this.ambientLights.brokenCeiling) this.ambientLights.brokenCeiling.on = brokenLightOn;

      // Cut out light fields using destination-out
      this.maskCtx.globalCompositeOperation = 'destination-out';
      this.maskCtx.fillStyle = 'white'; // Color doesn't matter for cutout

      for (const [key, light] of Object.entries(this.ambientLights)) {
        if (!light.on) continue;
        const pulse = light.pulseType === 'garage'
          ? 1.0 + Math.sin(time / 300) * 0.05
          : light.pulseType === 'lantern'
            ? 1.0 + Math.sin(time / 200) * 0.04
            : light.pulseType === 'quantum'
              ? 1.0 + Math.sin(time / 150) * 0.03
              : 1.0;
        const rad = light.radius * pulse;
        const grad = this.maskCtx.createRadialGradient(light.x, light.y, light.innerRadius || 10, light.x, light.y, rad);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        this.maskCtx.fillStyle = grad;
        this.maskCtx.beginPath();
        this.maskCtx.arc(light.x, light.y, rad, 0, Math.PI * 2);
        this.maskCtx.fill();
      }

      players.forEach(p => {
        if (p.health <= 0) return;

        // C. Flashlight cone cutout (if active)
        if (p.flashlightActive && p.lightPoly && p.lightPoly.length > 0) {
          this.maskCtx.beginPath();
          this.maskCtx.moveTo(p.lightPoly[0].x, p.lightPoly[0].y);
          for (let i = 1; i < p.lightPoly.length; i++) {
            this.maskCtx.lineTo(p.lightPoly[i].x, p.lightPoly[i].y);
          }
          this.maskCtx.closePath();
          this.maskCtx.fillStyle = 'white';
          this.maskCtx.fill();
        }

        // C2. Sabotage Mode: give local player a small vision cutout in the dark
        if (window.gameEngine && window.gameEngine.matchMode === 'sabotage') {
          if (p.isLocal) {
            const visionGrad = this.maskCtx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 150);
            visionGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            visionGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.45)');
            visionGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
            this.maskCtx.fillStyle = visionGrad;
            this.maskCtx.beginPath();
            this.maskCtx.arc(p.x, p.y, 150, 0, Math.PI * 2);
            this.maskCtx.fill();
          }
        }
      });

      // D. Bullet tracer cutout (reveal brief light trails in dark rooms)
      if (bullets && bullets.length > 0) {
        bullets.forEach(b => {
          if (!b.active) return;
          const bulletGrad = this.maskCtx.createRadialGradient(b.x, b.y, 5, b.x, b.y, 60);
          bulletGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
          bulletGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
          bulletGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          this.maskCtx.fillStyle = bulletGrad;
          this.maskCtx.beginPath();
          this.maskCtx.arc(b.x, b.y, 60, 0, Math.PI * 2);
          this.maskCtx.fill();
        });
      }

      // E. Muzzle flash lighting cutouts
      players.forEach(p => {
        if (p.health > 0 && p.muzzleFlash > 0.15) {
          const bx = p.x + Math.cos(p.angle) * 28;
          const by = p.y + Math.sin(p.angle) * 28;
          const flashGrad = this.maskCtx.createRadialGradient(bx, by, 10, bx, by, 180 * p.muzzleFlash);
          flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
          flashGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
          flashGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          this.maskCtx.fillStyle = flashGrad;
          this.maskCtx.beginPath();
          this.maskCtx.arc(bx, by, 180 * p.muzzleFlash, 0, Math.PI * 2);
          this.maskCtx.fill();
        }
      });

      this.maskCtx.restore();

      // Draw the mask on the main canvas (reset transform to draw screen-space mask)
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity
      ctx.drawImage(this.maskCanvas, 0, 0);
      ctx.restore();

      // 6. Draw soft yellow/warm flashlight beam gradients on the main canvas (only inside the light fields)
      players.forEach(p => {
        if (p.health > 0 && p.flashlightActive && p.lightPoly && p.lightPoly.length > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p.lightPoly[0].x, p.lightPoly[0].y);
          for (let i = 1; i < p.lightPoly.length; i++) {
            ctx.lineTo(p.lightPoly[i].x, p.lightPoly[i].y);
          }
          ctx.closePath();
          ctx.clip();

          // Flashlight beam linear gradient
          const lx = p.x;
          const ly = p.y;
          const beamLength = 700;
          const endX = lx + Math.cos(p.angle) * beamLength;
          const endY = ly + Math.sin(p.angle) * beamLength;

          const beamGrad = ctx.createLinearGradient(lx, ly, endX, endY);
          beamGrad.addColorStop(0, 'rgba(255, 255, 230, 0.18)'); // Bright near player
          beamGrad.addColorStop(0.35, 'rgba(255, 255, 245, 0.10)');
          beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          
          ctx.fillStyle = beamGrad;
          ctx.fill();
          
          // Add a soft radial ambient glow near the player
          const ambientGrad = ctx.createRadialGradient(lx, ly, 10, lx, ly, 100);
          ambientGrad.addColorStop(0, 'rgba(255, 255, 220, 0.08)');
          ambientGrad.addColorStop(1, 'rgba(255, 255, 220, 0.0)');
          ctx.fillStyle = ambientGrad;
          ctx.fill();

          ctx.restore();
        }
      });

      // 7. Draw ambient light color glow on the main canvas
      ctx.save();
      for (const [key, light] of Object.entries(this.ambientLights)) {
        if (!light.on) continue;
        const pulse = light.pulseType === 'garage'
          ? 1.0 + Math.sin(time / 300) * 0.05
          : light.pulseType === 'lantern'
            ? 1.0 + Math.sin(time / 200) * 0.04
            : light.pulseType === 'quantum'
              ? 1.0 + Math.sin(time / 150) * 0.03
              : 1.0;
        const rad = light.radius * pulse;
        const grad = ctx.createRadialGradient(light.x, light.y, light.innerRadius || 5, light.x, light.y, rad);
        
        grad.addColorStop(0, light.color);
        grad.addColorStop(0.5, light.colorMid);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, rad, 0, Math.PI * 2);
        ctx.fill();

        this._drawLightFixture(ctx, light, time);
      }
      ctx.restore();
    }
  }

  _drawLightFixture(ctx, light, time) {
    const type = light.fixtureType;
    ctx.save();
    if (type === 'lantern') {
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#d4af37'; // gold trim
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 180, 50, 0.9)'; // flame core
      ctx.beginPath();
      ctx.arc(light.x, light.y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'brokenCeiling') {
      ctx.fillStyle = '#333';
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.fillRect(light.x - 16, light.y - 4, 32, 8);
      ctx.strokeRect(light.x - 16, light.y - 4, 32, 8);
      ctx.fillStyle = light.on ? '#fff' : '#111';
      ctx.shadowColor = light.on ? '#6cf' : 'transparent';
      ctx.shadowBlur = light.on ? 10 : 0;
      ctx.fillRect(light.x - 12, light.y - 2, 24, 4);
      ctx.shadowBlur = 0; // reset shadow
    } else if (type === 'kitchen') {
      ctx.fillStyle = '#333';
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.fillRect(light.x - 12, light.y - 12, 24, 24);
      ctx.strokeRect(light.x - 12, light.y - 12, 24, 24);
      ctx.fillStyle = '#66fcf1';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'garage') {
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#ff3c3c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff3c3c';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'bedroom2') {
      ctx.fillStyle = '#2d1822';
      ctx.strokeStyle = '#ff6ef7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff6ef7';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'quantum') {
      ctx.fillStyle = '#100c1e';
      ctx.strokeStyle = '#9d3bff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      const beamRot = (time / 100) % (Math.PI * 2);
      ctx.strokeStyle = '#d473ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(light.x - Math.cos(beamRot) * 8, light.y - Math.sin(beamRot) * 8);
      ctx.lineTo(light.x + Math.cos(beamRot) * 8, light.y + Math.sin(beamRot) * 8);
      ctx.stroke();
    } else if (type === 'reactor_light') {
      ctx.fillStyle = '#201005';
      ctx.strokeStyle = '#ff7f3b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 6 + Math.sin(time / 200) * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'server_rack_light' || type === 'cryo_light') {
      ctx.fillStyle = '#111';
      ctx.strokeStyle = type === 'cryo_light' ? '#66fcf1' : '#39db14';
      ctx.lineWidth = 1.5;
      ctx.fillRect(light.x - 6, light.y - 6, 12, 12);
      ctx.strokeRect(light.x - 6, light.y - 6, 12, 12);
      
      ctx.fillStyle = type === 'cryo_light' ? '#66fcf1' : '#39db14';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  isPointInAmbientLight(x, y, r = 0) {
    for (const [key, light] of Object.entries(this.ambientLights)) {
      if (!light.on) continue;
      const dist = Math.hypot(x - light.x, y - light.y);
      if (dist < light.radius + r) {
        if (!this.getLineIntersection({ x: light.x, y: light.y }, { x, y })) {
          return true;
        }
      }
    }
    return false;
  }

  _addDecorations(rooms) {
    this.decorations = [];
    
    // Kitchen Mat
    const K = rooms[0];
    this.decorations.push({ x: K.x + 50, y: K.y + 55, w: 120, h: 40, type: 'rug', style: 'kitchen' });
    
    // Living Room Rug
    const L = rooms[1];
    this.decorations.push({ x: L.x + L.w/2 - 120, y: L.y + 110, w: 240, h: 160, type: 'rug', style: 'living' });
    
    // Office Rug
    const O = rooms[2];
    this.decorations.push({ x: O.x + 40, y: O.y + 80, w: 160, h: 120, type: 'rug', style: 'office' });
    
    // Bathroom Mat
    const BA = rooms[3];
    this.decorations.push({ x: BA.x + 110, y: BA.y + 40, w: 60, h: 90, type: 'rug', style: 'bath' });
    
    // Hallway Runner
    const H = rooms[4];
    this.decorations.push({ x: H.x + H.w/2 - 180, y: H.y + 40, w: 360, h: 60, type: 'rug', style: 'runner' });
    
    // Bedroom 1 Rug
    const B1 = rooms[5];
    this.decorations.push({ x: B1.x + 30, y: B1.y + 110, w: 140, h: 160, type: 'rug', style: 'bedroom' });
    
    // Master Bedroom Rug
    const MB = rooms[7];
    this.decorations.push({ x: MB.x + MB.w/2 - 120, y: MB.y + 80, w: 240, h: 220, type: 'rug', style: 'master' });
    
    // Bedroom 2 Rug
    const B2 = rooms[8];
    this.decorations.push({ x: B2.x + B2.w/2 - 70, y: B2.y + B2.h/2 - 70, w: 140, h: 140, type: 'rug', style: 'circular' });
  }

  _drawDecoration(ctx, d) {
    ctx.save();
    if (d.type === 'rug') {
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; // base shadow
      ctx.fillRect(d.x + 2, d.y + 2, d.w, d.h);
      
      const styles = {
        kitchen:  { bg: '#3a2d1f', border: '#aa8c66', text: '#55422d' },
        living:   { bg: '#3b1c1c', border: '#d4af37', text: '#802020' },
        office:   { bg: '#1c2d3b', border: '#66fcf1', text: '#204060' },
        bath:     { bg: '#1f3c3a', border: '#39db14', text: '#152b2a' },
        runner:   { bg: '#2b203c', border: '#9d3bff', text: '#4c2e73' },
        bedroom:  { bg: '#3c3020', border: '#ffe6a3', text: '#5c4930' },
        master:   { bg: '#222d32', border: '#66fcf1', text: '#435e6a' },
        circular: { bg: '#2d1822', border: '#ff6ef7', text: '#5e2540' },
      };
      
      const theme = styles[d.style] || { bg: '#222', border: '#444', text: '#333' };
      
      ctx.fillStyle = theme.bg;
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      
      if (d.style === 'circular') {
        ctx.beginPath();
        ctx.arc(d.x + d.w/2, d.y + d.h/2, d.w/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Inner detail ring
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(d.x + d.w/2, d.y + d.h/2, d.w/3, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(d.x, d.y, d.w, d.h, 6);
        } else {
          ctx.rect(d.x, d.y, d.w, d.h);
        }
        ctx.fill();
        ctx.stroke();
        
        // Fringes on the ends
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (d.w > d.h) {
          for (let fy = d.y + 4; fy < d.y + d.h; fy += 6) {
            ctx.moveTo(d.x, fy); ctx.lineTo(d.x - 4, fy);
            ctx.moveTo(d.x + d.w, fy); ctx.lineTo(d.x + d.w + 4, fy);
          }
        } else {
          for (let fx = d.x + 4; fx < d.x + d.w; fx += 6) {
            ctx.moveTo(fx, d.y); ctx.lineTo(fx, d.y - 4);
            ctx.moveTo(fx, d.y + d.h); ctx.lineTo(fx, d.y + d.h + 4);
          }
        }
        ctx.stroke();
      }
    }
    ctx.restore();
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
      // Oil/grease stain patches in garage or yellow stripes in cyber weaponry depot
      if (r.name === 'Garage') {
        ctx.fillStyle = 'rgba(30,25,10,0.4)';
        ctx.beginPath();
        ctx.ellipse(r.x+150, r.y+230, 60, 30, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.ellipse(r.x+80,  r.y+150, 40, 20, -0.2, 0, Math.PI*2); ctx.fill();
      } else if (r.name === 'Weaponry Depot') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        for (let tx = r.x; tx < r.x + r.w; tx += 60) {
          ctx.moveTo(tx, r.y);
          ctx.lineTo(tx + 40, r.y + 40);
          ctx.moveTo(tx, r.y + r.h - 40);
          ctx.lineTo(tx + 40, r.y + r.h);
        }
        ctx.stroke();
      }
    } else if (r.floor === 'cybergrid') {
      ctx.fillStyle = '#060a12'; // Carbon black
      ctx.fillRect(r.x, r.y, r.w, r.h);
      
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.08)';
      ctx.lineWidth = 1;
      const step = 50;
      for (let tx = r.x; tx <= r.x + r.w; tx += step) {
        ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
      }
      for (let ty = r.y; ty <= r.y + r.h; ty += step) {
        ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
      }
      
      const time = Date.now();
      const nodePulse = 2 + Math.sin(time / 400) * 0.8;
      ctx.fillStyle = 'rgba(102, 252, 241, 0.45)';
      for (let tx = r.x + step; tx < r.x + r.w; tx += step) {
        for (let ty = r.y + step; ty < r.y + r.h; ty += step) {
          ctx.beginPath();
          ctx.arc(tx, ty, nodePulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (r.floor === 'reactor') {
      ctx.fillStyle = '#0f0a07'; // Deep dark copper background
      ctx.fillRect(r.x, r.y, r.w, r.h);
      
      const time = Date.now();
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      
      ctx.strokeStyle = 'rgba(255, 127, 59, 0.15)';
      ctx.lineWidth = 4;
      ctx.strokeRect(r.x + 8, r.y + 8, r.w - 16, r.h - 16);
      
      ctx.lineWidth = 2.5;
      const numRings = 5;
      for (let i = 1; i <= numRings; i++) {
        const radius = i * 28;
        const ringPulse = Math.sin(time / 250 - i * 0.5) * 0.15 + 0.85;
        ctx.strokeStyle = `rgba(255, 127, 59, ${0.08 + (1 - i / numRings) * 0.22})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * ringPulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.strokeStyle = 'rgba(255, 150, 80, 0.4)';
      ctx.lineWidth = 1.5;
      const arcRot = (time / 800) % (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, 70, arcRot, arcRot + Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 110, arcRot + Math.PI, arcRot + Math.PI * 1.4);
      ctx.stroke();
    } else if (r.floor === 'nanogrid') {
      ctx.fillStyle = '#050c08'; // Deep forest tech green
      ctx.fillRect(r.x, r.y, r.w, r.h);
      
      ctx.strokeStyle = 'rgba(57, 219, 20, 0.08)';
      ctx.lineWidth = 1;
      const laneStep = 60;
      for (let tx = r.x + 30; tx < r.x + r.w; tx += laneStep) {
        ctx.beginPath();
        ctx.moveTo(tx, r.y);
        ctx.lineTo(tx, r.y + r.h);
        ctx.stroke();
      }
      
      ctx.strokeStyle = 'rgba(57, 219, 20, 0.05)';
      for (let ty = r.y + 40; ty < r.y + r.h; ty += 80) {
        ctx.beginPath();
        ctx.moveTo(r.x, ty);
        ctx.lineTo(r.x + r.w * 0.35, ty);
        ctx.lineTo(r.x + r.w * 0.45, ty - 25);
        ctx.lineTo(r.x + r.w, ty - 25);
        ctx.stroke();
      }
      
      const time = Date.now();
      ctx.fillStyle = 'rgba(57, 219, 20, 0.6)';
      const seed = Math.floor(r.x * 0.7 + r.y * 1.3);
      for (let i = 0; i < 6; i++) {
        const nodex = r.x + 30 + ((seed + i * 39) % (r.w - 60));
        const nodey = r.y + 30 + ((seed * 11 + i * 87) % (r.h - 60));
        const active = Math.floor(time / 200 + i) % 3 === 0;
        if (active) {
          ctx.fillRect(nodex - 2, nodey - 2, 4, 4);
        }
      }
    } else if (r.floor === 'cybercarpet') {
      ctx.fillStyle = '#0f081d'; // Hex deep purple
      ctx.fillRect(r.x, r.y, r.w, r.h);
      
      ctx.strokeStyle = 'rgba(157, 59, 255, 0.04)';
      ctx.lineWidth = 1.5;
      const size = 30;
      const hWidth = size * Math.sqrt(3);
      const hHeight = size * 2;
      
      for (let tx = r.x - hWidth; tx < r.x + r.w + hWidth; tx += hWidth) {
        for (let ty = r.y - hHeight; ty < r.y + r.h + hHeight; ty += hHeight * 0.75) {
          const offsetX = (Math.floor(ty / (hHeight * 0.75)) % 2) * (hWidth / 2);
          const cx = tx + offsetX;
          const cy = ty;
          
          ctx.beginPath();
          for (let side = 0; side < 6; side++) {
            const angle = (side * Math.PI) / 3;
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            if (side === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      
      ctx.strokeStyle = 'rgba(157, 59, 255, 0.12)';
      ctx.lineWidth = 3;
      ctx.strokeRect(r.x + 20, r.y + 20, r.w - 40, r.h - 40);
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
    } else if (item.type === 'ammo') {
      ctx.shadowColor = '#ffcc00'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#cc9900';
      ctx.fillRect(item.x-7, item.y-7, 14, 14);
      // Bullet icon
      ctx.fillStyle = '#ffe060';
      ctx.fillRect(item.x-2, item.y-5, 4, 8);
      ctx.beginPath();
      ctx.arc(item.x, item.y-5, 2, Math.PI, 0);
      ctx.fill();
    } else if (item.type === 'adrenaline') {
      ctx.shadowColor = '#39db14'; ctx.shadowBlur = 15;
      ctx.fillStyle = '#1b7d05';
      ctx.beginPath(); ctx.arc(item.x, item.y, 11*sc, 0, Math.PI*2); ctx.fill();
      // Lightning bolt icon
      ctx.fillStyle = '#39db14';
      ctx.beginPath();
      ctx.moveTo(item.x - 1, item.y - 6*sc);
      ctx.lineTo(item.x - 4, item.y + 1);
      ctx.lineTo(item.x - 1, item.y + 1);
      ctx.lineTo(item.x - 2.5, item.y + 7*sc);
      ctx.lineTo(item.x + 3.5, item.y - 1);
      ctx.lineTo(item.x + 0.5, item.y - 1);
      ctx.closePath();
      ctx.fill();
    } else if (item.type === 'overdrive') {
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 15;
      ctx.fillStyle = '#aa7c11';
      ctx.beginPath();
      // Diamond shape
      ctx.moveTo(item.x, item.y - 12*sc);
      ctx.lineTo(item.x + 10*sc, item.y);
      ctx.lineTo(item.x, item.y + 12*sc);
      ctx.lineTo(item.x - 10*sc, item.y);
      ctx.closePath();
      ctx.fill();
      // Double chevron ">>" symbol
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Left chevron
      ctx.beginPath();
      ctx.moveTo(item.x - 4, item.y - 4);
      ctx.lineTo(item.x - 1, item.y);
      ctx.lineTo(item.x - 4, item.y + 4);
      ctx.stroke();
      // Right chevron
      ctx.beginPath();
      ctx.moveTo(item.x + 1, item.y - 4);
      ctx.lineTo(item.x + 4, item.y);
      ctx.lineTo(item.x + 1, item.y + 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Wall / furniture / crate rendering ──
  initTerminals() {
    this.terminals = [
      { id: 'term_1', x: this.mapId === 'cyberlab' ? 700 : 720, y: 620, radius: 24, hacked: false, progress: 0, active: true, label: 'REACTOR DATA CORE' },
      { id: 'term_2', x: 1220, y: 1120, radius: 24, hacked: false, progress: 0, active: true, label: 'SECURE CACHE SUPPLY' }
    ];
  }

  _drawTerminal(ctx, term) {
    ctx.save();
    const pulse = 1.0 + Math.sin(Date.now() / 200) * 0.08;
    
    // Ambient floor glow
    const glowGrad = ctx.createRadialGradient(term.x, term.y, 5, term.x, term.y, term.radius * 1.5 * pulse);
    glowGrad.addColorStop(0, term.hacked ? 'rgba(57, 255, 20, 0.25)' : 'rgba(102, 252, 241, 0.25)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(term.x, term.y, term.radius * 1.8 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Draw terminal stand
    ctx.fillStyle = '#1c1e24';
    ctx.strokeStyle = '#2b2e38';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(term.x, term.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw keyboard/monitor console
    ctx.fillStyle = '#0b0c10';
    ctx.strokeStyle = term.hacked ? 'rgba(57, 255, 20, 0.8)' : 'rgba(102, 252, 241, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(term.x - 12, term.y - 12, 24, 16, 3);
    } else {
      ctx.rect(term.x - 12, term.y - 12, 24, 16);
    }
    ctx.fill();
    ctx.stroke();

    // Screen text/bars
    ctx.fillStyle = term.hacked ? '#39ff14' : '#66fcf1';
    ctx.font = 'bold 5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(term.hacked ? 'SECURE' : 'ACCESS', term.x, term.y - 4);

    // Glowing core indicator
    ctx.fillStyle = term.hacked ? '#39ff14' : '#ffd700';
    ctx.beginPath();
    ctx.arc(term.x - 6, term.y + 7, 2, 0, Math.PI * 2);
    ctx.arc(term.x + 6, term.y + 7, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Wall / furniture / crate rendering ──
  _drawExtrudedObject(ctx, w, camX, camY, scale, drawTopFaceCallback) {
    // Base corners
    const b0 = { x: w.x, y: w.y };
    const b1 = { x: w.x + w.w, y: w.y };
    const b2 = { x: w.x + w.w, y: w.y + w.h };
    const b3 = { x: w.x, y: w.y + w.h };
    
    // Top corners (extruded outward from the camera/player center)
    const t0 = {
      x: b0.x + (b0.x - camX) * scale,
      y: b0.y + (b0.y - camY) * scale
    };
    const t1 = {
      x: b1.x + (b1.x - camX) * scale,
      y: b1.y + (b1.y - camY) * scale
    };
    const t2 = {
      x: b2.x + (b2.x - camX) * scale,
      y: b2.y + (b2.y - camY) * scale
    };
    const t3 = {
      x: b3.x + (b3.x - camX) * scale,
      y: b3.y + (b3.y - camY) * scale
    };

    // Draw base shadow
    ctx.save();
    ctx.fillStyle = 'rgba(2, 3, 5, 0.45)';
    ctx.beginPath();
    ctx.moveTo(b0.x, b0.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw side panels connecting base to top
    const drawSide = (p0, p1, tp0, tp1, shadowColor) => {
      ctx.save();
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(tp1.x, tp1.y);
      ctx.lineTo(tp0.x, tp0.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    // North side (b0 -> b1)
    drawSide(b0, b1, t0, t1, camY > w.y ? '#090a0d' : '#17181c');
    // East side (b1 -> b2)
    drawSide(b1, b2, t1, t2, camX < w.x + w.w ? '#0d0e12' : '#1b1c21');
    // South side (b2 -> b3)
    drawSide(b2, b3, t2, t3, camY < w.y + w.h ? '#090a0d' : '#17181c');
    // West side (b3 -> b0)
    drawSide(b3, b0, t3, t0, camX > w.x ? '#0d0e12' : '#1b1c21');

    // Draw top face
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.clip(); // Clip top face drawings to the 3D polygon face

    // Shift context origin temporarily to draw the face styled as a normal flat rectangle
    const offsetX = t0.x - w.x;
    const offsetY = t0.y - w.y;
    ctx.translate(offsetX, offsetY);
    drawTopFaceCallback(ctx, w);
    ctx.restore();
    
    // Draw top face border stroke to cover raw clipped edges
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawExtrudedBarrel(ctx, w, camX, camY) {
    const scale = 0.04;
    const cx = w.x + w.w/2;
    const cy = w.y + w.h/2;
    const r = w.w/2;
    
    // Top circle center
    const tx = cx + (cx - camX) * scale;
    const ty = cy + (cy - camY) * scale;

    // Draw base shadow
    ctx.save();
    ctx.fillStyle = 'rgba(2, 3, 5, 0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw connecting side body
    const angle = Math.atan2(ty - cy, tx - cx) + Math.PI/2;
    const dx = Math.cos(angle) * r;
    const dy = Math.sin(angle) * r;
    
    ctx.save();
    ctx.fillStyle = '#1c1000'; // Darker side shade
    ctx.beginPath();
    ctx.moveTo(cx - dx, cy - dy);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.lineTo(tx + dx, ty - dy);
    ctx.lineTo(tx - dx, ty - dy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a2000';
    ctx.stroke();
    ctx.restore();

    // Draw top face
    ctx.save();
    ctx.translate(tx - cx, ty - cy);
    this._drawBarrel(ctx, w);
    ctx.restore();
  }

  _drawWall(ctx, w, camX, camY) {
    ctx.save();
    const wallScale = 0.08;
    const furnitureScale = 0.04;
    
    switch (w.material) {
      case 'exterior':
        this._drawExtrudedObject(ctx, w, camX, camY, wallScale, (c, obj) => this._drawExteriorWall(c, obj));
        break;
      case 'interior':
        this._drawExtrudedObject(ctx, w, camX, camY, wallScale, (c, obj) => this._drawInteriorWall(c, obj));
        break;
      case 'furniture':
        this._drawExtrudedObject(ctx, w, camX, camY, furnitureScale, (c, obj) => this._drawFurniturePiece(c, obj));
        break;
      case 'barrel':
        this._drawExtrudedBarrel(ctx, w, camX, camY);
        break;
      case 'crate':
        this._drawExtrudedObject(ctx, w, camX, camY, furnitureScale, (c, obj) => this._drawCratePiece(c, obj));
        break;
      default:
        this._drawExtrudedObject(ctx, w, camX, camY, wallScale, (c, obj) => this._drawInteriorWall(c, obj));
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
      toilet:  { fill:'#eee',    stroke:'#555' },
      chair:   { fill:'#2b1e16', stroke:'#5c402d' },
      plant:   { fill:'#152d18', stroke:'#345a3a' },
      cyber_couch:     { fill:'#110a24', stroke:'#9d3bff' },
      containment_pod: { fill:'#08181a', stroke:'#66fcf1' },
      server_rack:     { fill:'#080c10', stroke:'#39db14' },
      cyber_console:   { fill:'#050c18', stroke:'#1a7cd8' },
      reactor_core:    { fill:'#150c05', stroke:'#ff7f3b' },
      nano_charger:    { fill:'#051a0c', stroke:'#39db14' }
    };
    const sc = schemes[lbl] || { fill:'#1a1a2a', stroke:'#4a4a80' };

    ctx.fillStyle = sc.fill;
    ctx.strokeStyle = sc.stroke;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(w.x, w.y, w.w, w.h, 4);
    } else {
      ctx.rect(w.x, w.y, w.w, w.h);
    }
    ctx.fill();
    ctx.stroke();

    // Extra decorative details per type
    if (lbl === 'bed') {
      // Headboard
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(w.x, w.y, w.w, 10);
      ctx.strokeStyle = sc.stroke;
      ctx.strokeRect(w.x, w.y, w.w, 10);

      // Pillows
      ctx.fillStyle = '#223040';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      const pillowW = Math.min(32, (w.w - 16) / 2);
      const pillowH = Math.min(18, w.h * 0.18);
      const pillowY = w.y + 16;
      if (w.w > 80) {
        ctx.fillRect(w.x + 8, pillowY, pillowW, pillowH);
        ctx.strokeRect(w.x + 8, pillowY, pillowW, pillowH);
        ctx.fillRect(w.x + w.w - 8 - pillowW, pillowY, pillowW, pillowH);
        ctx.strokeRect(w.x + w.w - 8 - pillowW, pillowY, pillowW, pillowH);
      } else {
        ctx.fillRect(w.x + w.w/2 - pillowW/2, pillowY, pillowW, pillowH);
        ctx.strokeRect(w.x + w.w/2 - pillowW/2, pillowY, pillowW, pillowH);
      }

      // Blanket lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w.x + 4, w.y + w.h * 0.45);
      ctx.lineTo(w.x + w.w - 4, w.y + w.h * 0.45);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(w.x + 4, w.y + w.h * 0.45);
      ctx.lineTo(w.x + w.w/3, w.y + w.h * 0.65);
      ctx.moveTo(w.x + w.w - 4, w.y + w.h * 0.45);
      ctx.lineTo(w.x + w.w * 0.66, w.y + w.h * 0.65);
      ctx.stroke();

    } else if (lbl === 'sofa') {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      const padding = 10;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      
      if (w.w > w.h) {
        ctx.fillRect(w.x, w.y, padding, w.h);
        ctx.strokeRect(w.x, w.y, padding, w.h);
        ctx.fillRect(w.x + w.w - padding, w.y, padding, w.h);
        ctx.strokeRect(w.x + w.w - padding, w.y, padding, w.h);
        ctx.fillRect(w.x + padding, w.y, w.w - padding*2, padding);
        ctx.strokeRect(w.x + padding, w.y, w.w - padding*2, padding);
        
        const seatW = (w.w - padding * 2) / 3;
        for (let i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(w.x + padding + seatW * i, w.y + padding);
          ctx.lineTo(w.x + padding + seatW * i, w.y + w.h);
          ctx.stroke();
        }
      } else {
        ctx.fillRect(w.x, w.y, w.w, padding);
        ctx.strokeRect(w.x, w.y, w.w, padding);
        ctx.fillRect(w.x, w.y + w.h - padding, w.w, padding);
        ctx.strokeRect(w.x, w.y + w.h - padding, w.w, padding);
        ctx.fillRect(w.x, w.y + padding, padding, w.h - padding*2);
        ctx.strokeRect(w.x, w.y + padding, padding, w.h - padding*2);
        
        const seatH = (w.h - padding * 2) / 2;
        for (let i = 1; i < 2; i++) {
          ctx.beginPath();
          ctx.moveTo(w.x + padding, w.y + padding + seatH * i);
          ctx.lineTo(w.x + w.w, w.y + padding + seatH * i);
          ctx.stroke();
        }
      }

    } else if (lbl === 'counter') {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      
      if (w.w > w.h) {
        ctx.fillStyle = '#111b22';
        ctx.fillRect(w.x + w.w*0.2, w.y + 4, 30, w.h - 8);
        ctx.strokeRect(w.x + w.w*0.2, w.y + 4, 30, w.h - 8);
        ctx.strokeStyle = '#8fa4b3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w.x + w.w*0.2 + 15, w.y + 2);
        ctx.lineTo(w.x + w.w*0.2 + 15, w.y + 8);
        ctx.stroke();
        
        ctx.strokeStyle = '#ff5c28';
        ctx.lineWidth = 1;
        const bx = w.x + w.w*0.7;
        const by = w.y + w.h/2;
        ctx.beginPath();
        ctx.arc(bx - 12, by - 6, 4, 0, Math.PI*2);
        ctx.arc(bx + 12, by - 6, 5, 0, Math.PI*2);
        ctx.arc(bx - 12, by + 6, 5, 0, Math.PI*2);
        ctx.arc(bx + 12, by + 6, 4, 0, Math.PI*2);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#111b22';
        ctx.fillRect(w.x + 4, w.y + w.h*0.3, w.w - 8, 30);
        ctx.strokeRect(w.x + 4, w.y + w.h*0.3, w.w - 8, 30);
        ctx.strokeStyle = '#8fa4b3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w.x + 2, w.y + w.h*0.3 + 15);
        ctx.lineTo(w.x + 8, w.y + w.h*0.3 + 15);
        ctx.stroke();
      }

    } else if (lbl === 'desk') {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(w.x + 4, w.y + 4, w.w - 8, w.h - 8);
      
      ctx.fillStyle = '#05050a';
      ctx.strokeStyle = '#66fcf1';
      ctx.lineWidth = 1.5;
      
      if (w.w > w.h) {
        ctx.fillRect(w.x + w.w/2 - 25, w.y + 6, 50, 4);
        ctx.strokeRect(w.x + w.w/2 - 25, w.y + 6, 50, 4);
        ctx.fillStyle = '#222';
        ctx.fillRect(w.x + w.w/2 - 20, w.y + 15, 40, 10);
      } else {
        ctx.fillRect(w.x + 6, w.y + w.h/2 - 25, 4, 50);
        ctx.strokeRect(w.x + 6, w.y + w.h/2 - 25, 4, 50);
        ctx.fillStyle = '#222';
        ctx.fillRect(w.x + 15, w.y + w.h/2 - 20, 10, 40);
      }

    } else if (lbl === 'shelf') {
      ctx.fillStyle = '#3c2415';
      ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);
      
      const bookColors = ['#9e2a2b', '#3e5c76', '#ffe066', '#a3b18a', '#9b5de5', '#ff9f1c'];
      ctx.lineWidth = 1;
      
      const seed = Math.round(w.x * 13 + w.y * 37);
      const rng = new SeededRandom(seed);
      
      if (w.w > w.h) {
        let currX = w.x + 4;
        while (currX < w.x + w.w - 6) {
          const bookW = Math.floor(rng.next() * 4) + 3;
          const bookH = Math.floor(rng.next() * 8) + 12;
          ctx.fillStyle = bookColors[Math.floor(rng.next() * bookColors.length)];
          ctx.fillRect(currX, w.y + w.h - 2 - bookH, bookW, bookH);
          ctx.strokeRect(currX, w.y + w.h - 2 - bookH, bookW, bookH);
          currX += bookW + 1;
        }
      } else {
        let currY = w.y + 4;
        while (currY < w.y + w.h - 6) {
          const bookH = Math.floor(rng.next() * 4) + 3;
          const bookW = Math.floor(rng.next() * 8) + 12;
          ctx.fillStyle = bookColors[Math.floor(rng.next() * bookColors.length)];
          ctx.fillRect(w.x + 2, currY, bookW, bookH);
          ctx.strokeRect(w.x + 2, currY, bookW, bookH);
          currY += bookH + 1;
        }
      }

    } else if (lbl === 'dresser' || lbl === 'cabinet') {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      
      if (w.w > w.h) {
        const numDrawers = 2;
        const dw = w.w / numDrawers;
        for (let i = 0; i < numDrawers; i++) {
          ctx.strokeRect(w.x + dw * i + 2, w.y + 2, dw - 4, w.h - 4);
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(w.x + dw * i + dw/2, w.y + w.h - 5, 2, 0, Math.PI*2);
          ctx.fill();
        }
      } else {
        const numDrawers = 3;
        const dh = w.h / numDrawers;
        for (let i = 0; i < numDrawers; i++) {
          ctx.strokeRect(w.x + 2, w.y + dh * i + 2, w.w - 4, dh - 4);
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(w.x + w.w - 5, w.y + dh * i + dh/2, 2, 0, Math.PI*2);
          ctx.fill();
        }
      }

    } else if (lbl === 'toilet') {
      ctx.fillStyle = '#eee';
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5;
      
      ctx.fillRect(w.x + 4, w.y, w.w - 8, 12);
      ctx.strokeRect(w.x + 4, w.y, w.w - 8, 12);
      
      ctx.beginPath();
      ctx.arc(w.x + w.w/2, w.y + 24, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#66c0f4';
      ctx.beginPath();
      ctx.arc(w.x + w.w/2, w.y + 24, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (lbl === 'chair') {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(w.x + 4, w.y + 4, w.w - 8, w.h - 8);
      
      ctx.strokeStyle = sc.stroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w.x + 2, w.y + 2);
      ctx.lineTo(w.x + w.w - 2, w.y + 2);
      ctx.stroke();

    } else if (lbl === 'plant') {
      const cx = w.x + w.w/2;
      const cy = w.y + w.h/2;
      
      ctx.fillStyle = '#8c5a3c';
      ctx.strokeStyle = '#5c3a26';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#2a7c36';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 4, 7, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy - 4, 6, 0, Math.PI * 2);
      ctx.arc(cx, cy + 6, 8, 0, Math.PI * 2);
      ctx.arc(cx - 3, cy + 5, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#4ea35b';
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 2, 4, 0, Math.PI * 2);
      ctx.arc(cx + 4, cy - 2, 3, 0, Math.PI * 2);
      ctx.arc(cx, cy + 3, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (lbl === 'tub') {
      ctx.fillStyle='#0d2535'; ctx.fillRect(w.x+7,w.y+7,w.w-14,w.h-14);
      ctx.strokeStyle='rgba(50,170,255,0.25)'; ctx.strokeRect(w.x+7,w.y+7,w.w-14,w.h-14);
    } else if (lbl === 'car') {
      ctx.fillStyle='#0a1828';
      ctx.fillRect(w.x+28,w.y+18,65,38);
      ctx.fillRect(w.x+w.w-95,w.y+18,65,38);
      ctx.strokeStyle='rgba(80,120,200,0.3)';
      ctx.strokeRect(w.x+28,w.y+18,65,38);
      ctx.strokeRect(w.x+w.w-95,w.y+18,65,38);
      ctx.strokeStyle='rgba(100,100,180,0.4)'; ctx.lineWidth=2;
      ctx.strokeRect(w.x+10,w.y+10,w.w-20,w.h-20);
    } else if (lbl === 'cyber_couch') {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(w.x + 4, w.y + 4, w.w - 8, w.h - 8);
      ctx.strokeStyle = 'rgba(157, 59, 255, 0.25)';
      ctx.lineWidth = 1;
      
      if (w.w > w.h) {
        ctx.strokeRect(w.x + 6, w.y + 4, w.w - 12, 6);
        ctx.beginPath();
        ctx.moveTo(w.x + 4, w.y + w.h - 4);
        ctx.lineTo(w.x + w.w - 4, w.y + w.h - 4);
        ctx.strokeStyle = '#9d3bff';
        ctx.stroke();
      } else {
        ctx.strokeRect(w.x + 4, w.y + 6, 6, w.h - 12);
        ctx.beginPath();
        ctx.moveTo(w.x + w.w - 4, w.y + 4);
        ctx.lineTo(w.x + w.w - 4, w.y + w.h - 4);
        ctx.strokeStyle = '#9d3bff';
        ctx.stroke();
      }
    } else if (lbl === 'containment_pod') {
      ctx.fillStyle = 'rgba(102, 252, 241, 0.05)';
      ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);
      
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#66fcf1';
      ctx.lineWidth = 1.5;
      
      if (w.w > w.h) {
        ctx.fillRect(w.x, w.y, 8, w.h);
        ctx.strokeRect(w.x, w.y, 8, w.h);
        ctx.fillRect(w.x + w.w - 8, w.y, 8, w.h);
        ctx.strokeRect(w.x + w.w - 8, w.y, 8, w.h);
      } else {
        ctx.fillRect(w.x, w.y, w.w, 8);
        ctx.strokeRect(w.x, w.y, w.w, 8);
        ctx.fillRect(w.x, w.y + w.h - 8, w.w, 8);
        ctx.strokeRect(w.x, w.y + w.h - 8, w.w, 8);
      }
      
      const time = Date.now();
      ctx.fillStyle = 'rgba(102, 252, 241, 0.4)';
      const bubbleSeed = Math.floor(w.x * 2.3 + w.y * 1.7);
      for (let i = 0; i < 4; i++) {
        const bubbleX = w.x + 10 + ((bubbleSeed + i * 29) % (w.w - 20));
        const bubbleY = w.y + 10 + ((bubbleSeed * 7 + i * 41 - (time * 0.04)) % (w.h - 20) + (w.h - 20)) % (w.h - 20);
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 1.5 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (lbl === 'server_rack') {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      
      const time = Date.now();
      const numModules = Math.floor(w.h / 14);
      
      if (w.h > w.w) {
        for (let i = 0; i < numModules; i++) {
          const my = w.y + 4 + i * 14;
          ctx.strokeRect(w.x + 3, my, w.w - 6, 10);
          
          const activeGreen = Math.floor(time / 200 + i) % 4 !== 0;
          const activeRed = Math.floor(time / 450 + i * 2) % 6 === 0;
          const activeBlue = Math.floor(time / 300 - i) % 5 === 0;
          
          ctx.fillStyle = activeGreen ? '#39db14' : '#053005';
          ctx.fillRect(w.x + 6, my + 4, 3, 3);
          
          ctx.fillStyle = activeRed ? '#ff3c3c' : '#400505';
          ctx.fillRect(w.x + 12, my + 4, 3, 3);
          
          ctx.fillStyle = activeBlue ? '#66fcf1' : '#052028';
          ctx.fillRect(w.x + 18, my + 4, 3, 3);
        }
      } else {
        const numModulesW = Math.floor(w.w / 14);
        for (let i = 0; i < numModulesW; i++) {
          const mx = w.x + 4 + i * 14;
          ctx.strokeRect(mx, w.y + 3, 10, w.h - 6);
          
          const activeGreen = Math.floor(time / 200 + i) % 4 !== 0;
          const activeRed = Math.floor(time / 450 + i * 2) % 6 === 0;
          
          ctx.fillStyle = activeGreen ? '#39db14' : '#053005';
          ctx.fillRect(mx + 4, w.y + 6, 3, 3);
          
          ctx.fillStyle = activeRed ? '#ff3c3c' : '#400505';
          ctx.fillRect(mx + 4, w.y + 12, 3, 3);
        }
      }
    } else if (lbl === 'cyber_console') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(w.x + 3, w.y + 3, w.w - 6, w.h - 6);
      
      ctx.fillStyle = '#09152b';
      ctx.strokeStyle = '#1a7cd8';
      ctx.lineWidth = 1.5;
      
      if (w.w > w.h) {
        ctx.fillRect(w.x + 5, w.y + w.h - 12, w.w - 10, 8);
        ctx.strokeRect(w.x + 5, w.y + w.h - 12, w.w - 10, 8);
        
        ctx.fillStyle = 'rgba(26, 124, 216, 0.15)';
        ctx.fillRect(w.x + 10, w.y + 4, w.w - 20, w.h - 18);
        ctx.strokeRect(w.x + 10, w.y + 4, w.w - 20, w.h - 18);
        
        ctx.strokeStyle = '#66fcf1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const time = Date.now();
        for (let sx = w.x + 14; sx < w.x + w.w - 14; sx += 4) {
          const sy = w.y + 10 + Math.sin(time * 0.005 + sx * 0.1) * 3;
          if (sx === w.x + 14) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      } else {
        ctx.fillRect(w.x + 4, w.y + 5, 8, w.h - 10);
        ctx.strokeRect(w.x + 4, w.y + 5, 8, w.h - 10);
        
        ctx.fillStyle = 'rgba(26, 124, 216, 0.15)';
        ctx.fillRect(w.x + 14, w.y + 10, w.w - 18, w.h - 20);
        ctx.strokeRect(w.x + 14, w.y + 10, w.w - 18, w.h - 20);
      }
    } else if (lbl === 'reactor_core') {
      const cx = w.x + w.w / 2;
      const cy = w.y + w.h / 2;
      const r = Math.min(w.w, w.h) / 2;
      const time = Date.now();
      
      ctx.fillStyle = '#100a05';
      ctx.strokeStyle = '#ff7f3b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      const cells = 3;
      const baseRot = (time / 400) % (Math.PI * 2);
      ctx.fillStyle = '#ff7f3b';
      for (let i = 0; i < cells; i++) {
        const rot = baseRot + (i * Math.PI * 2) / cells;
        const cellX = cx + Math.cos(rot) * (r - 12);
        const cellY = cy + Math.sin(rot) * (r - 12);
        ctx.beginPath();
        ctx.arc(cellX, cellY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cellX, cellY);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ff7f3b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, 6 + Math.sin(time / 150) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (lbl === 'nano_charger') {
      ctx.fillStyle = '#06100a';
      ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);
      
      ctx.fillStyle = 'rgba(57, 219, 20, 0.1)';
      ctx.strokeStyle = '#39db14';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w.x + 4, w.y + 4, w.w - 8, w.h - 8);
      
      const time = Date.now();
      const barH = (w.h - 12) * (0.5 + Math.sin(time / 250) * 0.35);
      ctx.fillStyle = '#39db14';
      ctx.fillRect(w.x + 6, w.y + w.h - 6 - barH, w.w - 12, barH);
    } else if (lbl === 'fridge') {
      ctx.strokeStyle='rgba(160,200,255,0.4)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(w.x+w.w/2-10,w.y+12); ctx.lineTo(w.x+w.w/2+10,w.y+12); ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(w.x + 3, w.y + 3, w.w - 6, w.h - 6);
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
