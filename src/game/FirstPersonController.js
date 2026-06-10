import * as THREE from 'three';

export class FirstPersonController {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.active = false;

    // Core Three.js
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    // Player model template
    this.playerModelTemplate = null;
    this.modelLoaded = false;
    this.playerMeshes = {}; // p.id -> THREE.Group

    // Gameplay bobs and times
    this.bobTime = 0;
    this._recoilOffset = 0;
    this._recoilVel = 0;

    // Asset references for cleanup
    this.wallMeshes = [];
    this.crateMeshes = {};
    this.terminalMeshes = {};
    this.itemMeshes = {};
    this.bulletMeshes = [];
    this.pointLights = {};
    this.grenadeMeshes = {};

    // Dynamic particle pool
    this.particlePool = null;

    // First person weapon model
    this.gunGroup = null;
    this.weaponPivot = null;    // pivot for recoil/bob
    this.muzzleFlashLight = null;
    this.muzzleFlashMesh = null;
    this.muzzleSprite = null;

    // Cached map reference
    this._lastMapSeed = null;

    // Render clock
    this._clock = { then: Date.now() };
  }

  getCanvasSize() {
    let w = this.canvas.clientWidth;
    let h = this.canvas.clientHeight;
    if (w === 0 || h === 0) {
      const parent = this.canvas.parentElement;
      if (parent && parent.clientWidth > 0 && parent.clientHeight > 0) {
        w = parent.clientWidth;
        h = parent.clientHeight;
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
    }
    return { w, h };
  }

  async init() {
    const size = this.getCanvasSize();

    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(size.w, size.h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010204);
    this.scene.fog = new THREE.FogExp2(0x010204, 0.0008);

    // 3. Camera  FOV 80 for realistic FPS feel
    this.camera = new THREE.PerspectiveCamera(80, size.w / size.h, 0.1, 5000);
    this.scene.add(this.camera);

    // 4. Lighting setup – cinematic, moody
    this._setupLighting();

    // 5. Particle Pool
    this.particlePool = new ParticlePool(this.scene);

    // 6. Weapon viewmodel
    this._buildWeaponModel();

    // 7. Player template
    this.playerModelTemplate = this._createSoldierModel();
    this.modelLoaded = true;

    // 8. Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  _setupLighting() {
    // Very dark ambient – let point lights and the weapon flash do the work
    const ambient = new THREE.AmbientLight(0x0a0f1a, 0.6);
    this.scene.add(ambient);

    // Cool-toned hemisphere for ceiling bounce
    const hemi = new THREE.HemisphereLight(0x112244, 0x050508, 0.4);
    this.scene.add(hemi);

    // Camera-attached fill light (very faint torch effect)
    this._playerLight = new THREE.PointLight(0x3399ff, 0.35, 400, 2);
    this._playerLight.position.set(0, 30, 0);
    this.camera.add(this._playerLight);
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const size = this.getCanvasSize();
    this.renderer.setSize(size.w, size.h, false);
    this.camera.aspect = size.w / size.h;
    this.camera.updateProjectionMatrix();
  }

  // ─── Weapon viewmodel ────────────────────────────────────────────────────────
  _buildWeaponModel() {
    // Pivot wraps the whole gun – we animate this for bob/recoil
    this.weaponPivot = new THREE.Group();
    this.camera.add(this.weaponPivot);

    this.gunGroup = new THREE.Group();
    this.weaponPivot.add(this.gunGroup);

    // Slightly right of center, lower-right, close to camera
    this.weaponPivot.position.set(0.22, -0.22, -0.45);
    this.weaponPivot.scale.setScalar(1);

    // Materials
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x14181f, metalness: 0.92, roughness: 0.12 });
    const midMetal  = new THREE.MeshStandardMaterial({ color: 0x252c38, metalness: 0.80, roughness: 0.25 });
    const grip      = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.0,  roughness: 0.85 });
    const neon      = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
    const neonOrange= new THREE.MeshBasicMaterial({ color: 0xff6600 });

    // ── Receiver body ────────────────────────────────────────────
    const recvGeo = new THREE.BoxGeometry(0.07, 0.06, 0.38);
    const recv = new THREE.Mesh(recvGeo, darkMetal);
    recv.position.set(0, 0, 0);
    this.gunGroup.add(recv);

    // ── Picatinny rail on top ─────────────────────────────────────
    const railGeo = new THREE.BoxGeometry(0.015, 0.01, 0.36);
    const rail = new THREE.Mesh(railGeo, midMetal);
    rail.position.set(0, 0.035, 0);
    this.gunGroup.add(rail);

    // ── Barrel  ───────────────────────────────────────────────────
    const barrelGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.30, 10);
    const barrel = new THREE.Mesh(barrelGeo, darkMetal);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.005, -0.33);
    this.gunGroup.add(barrel);

    // Suppressor ring
    const suppGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.10, 12);
    const supp = new THREE.Mesh(suppGeo, midMetal);
    supp.rotation.x = Math.PI / 2;
    supp.position.set(0, 0.005, -0.455);
    this.gunGroup.add(supp);

    // ── Foregrip underbarrel ──────────────────────────────────────
    const fgGeo = new THREE.BoxGeometry(0.045, 0.05, 0.25);
    const fg = new THREE.Mesh(fgGeo, midMetal);
    fg.position.set(0, -0.055, -0.10);
    this.gunGroup.add(fg);

    // ── Pistol grip ───────────────────────────────────────────────
    const pgGeo = new THREE.BoxGeometry(0.055, 0.09, 0.06);
    const pg = new THREE.Mesh(pgGeo, grip);
    pg.position.set(0, -0.075, 0.1);
    pg.rotation.x = 0.25;
    this.gunGroup.add(pg);

    // ── Magazine ──────────────────────────────────────────────────
    const magGeo = new THREE.BoxGeometry(0.04, 0.10, 0.035);
    const mag = new THREE.Mesh(magGeo, darkMetal);
    mag.position.set(0, -0.065, 0.05);
    this.gunGroup.add(mag);

    // ── Scope ─────────────────────────────────────────────────────
    const scopeBody = new THREE.CylinderGeometry(0.018, 0.018, 0.15, 10);
    const scopeMesh = new THREE.Mesh(scopeBody, darkMetal);
    scopeMesh.rotation.x = Math.PI / 2;
    scopeMesh.position.set(0, 0.052, -0.06);
    this.gunGroup.add(scopeMesh);

    // Scope lens glow
    const lensGeo = new THREE.CircleGeometry(0.013, 12);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x001aff, transparent: true, opacity: 0.7 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0.052, -0.135);
    this.gunGroup.add(lens);

    // ── Neon accent lines ─────────────────────────────────────────
    const accentGeo = new THREE.BoxGeometry(0.003, 0.06, 0.003);
    for (let i = -1; i <= 1; i += 2) {
      const accent = new THREE.Mesh(accentGeo, neon);
      accent.position.set(i * 0.037, -0.01, 0);
      this.gunGroup.add(accent);
    }

    // ── Muzzle flash ──────────────────────────────────────────────
    const flashGeo = new THREE.SphereGeometry(0.04, 8, 6);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffbb44, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.position.set(0, 0.005, -0.51);
    this.gunGroup.add(this.muzzleFlashMesh);

    // Muzzle flash point light
    this.muzzleFlashLight = new THREE.PointLight(0xffcc66, 0, 80, 2);
    this.muzzleFlashLight.position.set(0, 0.005, -0.51);
    this.gunGroup.add(this.muzzleFlashLight);

    // ── Left-hand fingers peeking from foregrip (stylised) ───────
    const fingerMat = new THREE.MeshStandardMaterial({ color: 0x2a1f18, roughness: 0.8 });
    for (let i = 0; i < 3; i++) {
      const fGeo = new THREE.BoxGeometry(0.012, 0.012, 0.04);
      const f = new THREE.Mesh(fGeo, fingerMat);
      f.position.set(-0.025 + i * 0.014, -0.08, -0.12 + i * 0.025);
      f.rotation.z = -0.2;
      this.gunGroup.add(f);
    }

    // ── Tactical light under barrel ───────────────────────────────
    const torchGeo = new THREE.CylinderGeometry(0.012, 0.008, 0.06, 8);
    const torch = new THREE.Mesh(torchGeo, midMetal);
    torch.rotation.x = Math.PI / 2;
    torch.position.set(-0.025, -0.065, -0.22);
    this.gunGroup.add(torch);

    const torchLens = new THREE.CircleGeometry(0.009, 10);
    const torchLensMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    const torchLensMesh = new THREE.Mesh(torchLens, torchLensMat);
    torchLensMesh.position.set(-0.025, -0.065, -0.252);
    this.gunGroup.add(torchLensMesh);
  }

  // ─── Soldier enemy model ─────────────────────────────────────────────────────
  _createSoldierModel() {
    const group = new THREE.Group();

    const armorMat  = new THREE.MeshStandardMaterial({ color: 0x1c2230, metalness: 0.75, roughness: 0.35 });
    const darkMat   = new THREE.MeshStandardMaterial({ color: 0x0d0f14, metalness: 0.5,  roughness: 0.6  });
    const neonMat   = new THREE.MeshBasicMaterial({ color: 0xff3c3c });
    const visorMat  = new THREE.MeshBasicMaterial({ color: 0x66fcf1, transparent: true, opacity: 0.85 });

    // ── Torso (armored chest plate) ───────────────────────────────────
    const torsoGeo = new THREE.BoxGeometry(18, 22, 10);
    const torso = new THREE.Mesh(torsoGeo, armorMat);
    torso.position.y = 24;
    group.add(torso);

    // Chest detail panels
    const panelGeo = new THREE.BoxGeometry(6, 8, 1);
    for (let side = -1; side <= 1; side += 2) {
      const panel = new THREE.Mesh(panelGeo, darkMat);
      panel.position.set(side * 5, 25, 5.5);
      group.add(panel);
    }

    // Chest power core (glowing)
    const coreGeo = new THREE.BoxGeometry(4, 4, 1.5);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 26, 5.5);
    group.add(core);

    // ── Helmet ────────────────────────────────────────────────────────
    const helmGeo = new THREE.BoxGeometry(14, 13, 12);
    const helm = new THREE.Mesh(helmGeo, armorMat);
    helm.position.y = 40;
    group.add(helm);

    // Visor strip
    const visorGeo = new THREE.BoxGeometry(12, 3, 2);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 41, 6.5);
    group.add(visor);

    // Antenna nubs on helmet
    const antGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 6);
    const antL = new THREE.Mesh(antGeo, armorMat);
    antL.position.set(-5, 47, -2);
    group.add(antL);
    const antR = new THREE.Mesh(antGeo, armorMat);
    antR.position.set(5, 47, -2);
    group.add(antR);

    // ── Shoulders ─────────────────────────────────────────────────────
    const shoulderGeo = new THREE.BoxGeometry(6, 8, 9);
    const sL = new THREE.Mesh(shoulderGeo, armorMat);
    sL.position.set(-12, 30, 0);
    group.add(sL);
    const sR = new THREE.Mesh(shoulderGeo, armorMat);
    sR.position.set(12, 30, 0);
    group.add(sR);

    // ── Arms ──────────────────────────────────────────────────────────
    const armGeo = new THREE.BoxGeometry(5, 14, 6);
    const armL = new THREE.Mesh(armGeo, darkMat);
    armL.position.set(-13, 18, 1);
    group.add(armL);
    const armR = new THREE.Mesh(armGeo, darkMat);
    armR.position.set(13, 18, -1);
    group.add(armR);

    // Hands
    const handGeo = new THREE.BoxGeometry(4, 5, 5);
    const handL = new THREE.Mesh(handGeo, darkMat);
    handL.position.set(-13, 10, 2);
    group.add(handL);
    const handR = new THREE.Mesh(handGeo, darkMat);
    handR.position.set(13, 10, -2);
    group.add(handR);

    // ── Torso lower / belt ────────────────────────────────────────────
    const beltGeo = new THREE.BoxGeometry(16, 5, 9);
    const belt = new THREE.Mesh(beltGeo, darkMat);
    belt.position.y = 13;
    group.add(belt);

    // Belt pouches
    for (let p = -1; p <= 1; p += 2) {
      const pGeo = new THREE.BoxGeometry(3, 4, 2);
      const pMesh = new THREE.Mesh(pGeo, armorMat);
      pMesh.position.set(p * 6, 13, 5.5);
      group.add(pMesh);
    }

    // ── Legs ──────────────────────────────────────────────────────────
    const thighGeo = new THREE.BoxGeometry(7, 12, 8);
    const shinGeo  = new THREE.BoxGeometry(6, 12, 7);
    const bootGeo  = new THREE.BoxGeometry(7, 5, 10);

    [-1, 1].forEach(side => {
      const thigh = new THREE.Mesh(thighGeo, armorMat);
      thigh.position.set(side * 5, 4, 0);
      group.add(thigh);

      const shin = new THREE.Mesh(shinGeo, darkMat);
      shin.position.set(side * 5, -7, 0);
      group.add(shin);

      const boot = new THREE.Mesh(bootGeo, darkMat);
      boot.position.set(side * 5, -14, 1);
      group.add(boot);
    });

    // ── Tactical rifle carried in both hands ──────────────────────────
    const rifleBody = new THREE.BoxGeometry(3, 3, 22);
    const rifleMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, metalness: 0.9, roughness: 0.2 });
    const rifle = new THREE.Mesh(rifleBody, rifleMat);
    rifle.position.set(8, 14, -10);
    rifle.rotation.y = 0.08;
    group.add(rifle);

    const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 8);
    const barrelMesh = new THREE.Mesh(barrelGeo, rifleMat);
    barrelMesh.rotation.x = Math.PI / 2;
    barrelMesh.position.set(8, 14, -22);
    group.add(barrelMesh);

    // Rifle neon accent
    const rifleAccent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), coreMat);
    rifleAccent.position.set(8, 14, -5);
    group.add(rifleAccent);

    // Wrap in outer group for clean rotation around origin
    const wrapper = new THREE.Group();
    wrapper.add(group);
    return wrapper;
  }

  // ─── Map Construction ────────────────────────────────────────────────────────
  build3DMap(map) {
    // Clear old meshes
    this.wallMeshes.forEach(m => this.scene.remove(m));
    this.wallMeshes = [];
    Object.values(this.crateMeshes).forEach(m => this.scene.remove(m));
    this.crateMeshes = {};
    Object.values(this.terminalMeshes).forEach(m => this.scene.remove(m));
    this.terminalMeshes = {};
    Object.values(this.pointLights).forEach(l => this.scene.remove(l));
    this.pointLights = {};

    const W = map.width, H = map.height;

    // ── 1. Floor ─────────────────────────────────────────────────────────────
    if (this.floorMesh) this.scene.remove(this.floorMesh);
    const floorGeo = new THREE.PlaneGeometry(W, H, 1, 1);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this._makeFloorTexture(W, H),
      roughness: 0.25,
      metalness: 0.65,
      envMapIntensity: 0.8
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.set(W / 2, 0, H / 2);
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    // ── 2. Ceiling ───────────────────────────────────────────────────────────
    if (this.ceilingMesh) this.scene.remove(this.ceilingMesh);
    const ceilGeo = new THREE.PlaneGeometry(W, H, 1, 1);
    const ceilMat = new THREE.MeshStandardMaterial({
      map: this._makeCeilingTexture(W, H),
      roughness: 0.7,
      metalness: 0.3
    });
    this.ceilingMesh = new THREE.Mesh(ceilGeo, ceilMat);
    this.ceilingMesh.rotation.x = Math.PI / 2;
    this.ceilingMesh.position.set(W / 2, 100, H / 2);
    this.scene.add(this.ceilingMesh);

    // ── 3. Walls and Crates ───────────────────────────────────────────────────
    const wallMat = new THREE.MeshStandardMaterial({
      map: this._makeWallTexture(),
      roughness: 0.30,
      metalness: 0.70
    });

    const crateTex = this._makeCrateTexture();
    const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.75, metalness: 0.05 });

    const furniturePalette = {
      sofa: 0x251224, table: 0x1e1005, bed: 0x0d1e2e, counter: 0x152010,
      desk: 0x1c1208, tub: 0x08182a, sink: 0x091525, tv: 0x060610,
      shelf: 0x1c0e04, car: 0x181827, bench: 0x1a1205, fridge: 0x111b22,
      cabinet: 0x160e08, dresser: 0x1a1105, toilet: 0xddeeff, chair: 0x2a1c14,
      plant: 0x122810, cyber_couch: 0x0e0820, containment_pod: 0x061617,
      server_rack: 0x070b0e, cyber_console: 0x040b16, reactor_core: 0x130b04,
      nano_charger: 0x041608
    };

    map.walls.forEach(w => {
      if (w.type === 'wall') {
        let wallH;
        let mat = wallMat;

        if (w.material === 'furniture') {
          wallH = this._getFurnitureH(w.label);
          const col = furniturePalette[w.label] || 0x18181f;
          const isCyber = w.label?.startsWith('cyber') || w.label === 'reactor_core' || w.label === 'server_rack';
          mat = new THREE.MeshStandardMaterial({
            color: col, metalness: isCyber ? 0.85 : 0.25, roughness: isCyber ? 0.2 : 0.65
          });
          // Add emissive glow for tech furniture
          if (isCyber) {
            mat.emissive = new THREE.Color(col).multiplyScalar(0.3);
            mat.emissiveIntensity = 0.4;
          }
        } else {
          wallH = 100;
        }

        const geo = new THREE.BoxGeometry(w.w, wallH, w.h);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(w.x + w.w / 2, wallH / 2, w.y + w.h / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.wallMeshes.push(mesh);

      } else if (w.type === 'crate') {
        const ch = w.w;
        const geo = new THREE.BoxGeometry(w.w, ch, w.h);
        const mesh = new THREE.Mesh(geo, crateMat);
        mesh.position.set(w.x + w.w / 2, ch / 2, w.y + w.h / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.crateMeshes[w.id] = mesh;
      }
    });

    // ── 4. Terminals (objective chests) ───────────────────────────────────────
    if (map.terminals) {
      map.terminals.forEach(term => {
        const group = new THREE.Group();

        const bodyGeo = new THREE.BoxGeometry(24, 32, 24);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x101820, metalness: 0.9, roughness: 0.15
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);

        const screenGeo = new THREE.BoxGeometry(18, 14, 1);
        const screenMat = new THREE.MeshBasicMaterial({
          color: term.hacked ? 0x66fcf1 : 0xff3c3c,
          transparent: true, opacity: 0.92
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 6, 12.5);
        group.add(screen);

        // Glow point light
        const glow = new THREE.PointLight(term.hacked ? 0x66fcf1 : 0xff3c3c, 1.5, 80, 2);
        glow.position.set(0, 6, 20);
        group.add(glow);

        group.position.set(term.x, 16, term.y);
        this.scene.add(group);
        this.terminalMeshes[term.id] = group;
      });
    }

    // ── 5. Map Point Lights ───────────────────────────────────────────────────
    for (const key in map.ambientLights) {
      const ld = map.ambientLights[key];
      const parsed = this._parseRgba(ld.color);
      const pLight = new THREE.PointLight(parsed.color, parsed.alpha * 3.0, ld.radius * 1.4, 1.5);
      pLight.position.set(ld.x, 75, ld.y);

      // Ceiling fixture mesh
      const fixGeo = new THREE.CylinderGeometry(5, 3, 4, 8);
      const fixMat = new THREE.MeshBasicMaterial({ color: parsed.color });
      const fixMesh = new THREE.Mesh(fixGeo, fixMat);
      pLight.add(fixMesh);

      // Hanging cable
      const cableGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 6);
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.position.y = 12;
      pLight.add(cable);

      pLight.castShadow = false; // cheap – too many shadows
      this.scene.add(pLight);
      this.pointLights[key] = pLight;
    }
  }

  _getFurnitureH(label) {
    const map = {
      sofa: 25, table: 25, bed: 28, counter: 32, desk: 26, tub: 28,
      sink: 32, tv: 40, shelf: 85, car: 42, bench: 24, fridge: 80,
      cabinet: 75, dresser: 40, toilet: 25, chair: 18, plant: 30,
      cyber_couch: 25, containment_pod: 75, server_rack: 85,
      cyber_console: 45, reactor_core: 75, nano_charger: 50
    };
    return map[label] || 35;
  }

  // ─── Procedural Textures ─────────────────────────────────────────────────────
  _makeFloorTexture(W, H) {
    const s = 512;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d');

    // Base dark steel
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, s, s);

    // Grid lines
    ctx.strokeStyle = '#0d1629';
    ctx.lineWidth = 1.5;
    const cell = 64;
    for (let x = 0; x < s; x += cell) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke();
    }
    for (let y = 0; y < s; y += cell) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
    }

    // Cyan corner accents at grid intersections
    ctx.fillStyle = 'rgba(102,252,241,0.2)';
    for (let x = 0; x <= s; x += cell) {
      for (let y = 0; y <= s; y += cell) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    // Subtle wear scratches
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const sx = Math.random() * s, sy = Math.random() * s;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 80, sy + (Math.random() - 0.5) * 80);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(W / 120, H / 120);
    return tex;
  }

  _makeWallTexture() {
    const s = 256;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d');

    // Dark titanium base
    ctx.fillStyle = '#0e1118';
    ctx.fillRect(0, 0, s, s);

    // Horizontal panel seams
    ctx.strokeStyle = '#1d2535';
    ctx.lineWidth = 2;
    for (let y = 0; y < s; y += 48) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
    }

    // Vertical segment lines
    ctx.strokeStyle = '#161c28';
    ctx.lineWidth = 1;
    for (let x = 0; x < s; x += 96) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke();
    }

    // Rivets
    ctx.fillStyle = '#22293a';
    [[8, 8], [s - 8, 8], [8, s - 8], [s - 8, s - 8]].forEach(([rx, ry]) => {
      ctx.beginPath(); ctx.arc(rx, ry, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Cyan bottom trim glow strip
    const grad = ctx.createLinearGradient(0, s - 14, 0, s);
    grad.addColorStop(0, 'rgba(102,252,241,0.3)');
    grad.addColorStop(1, 'rgba(102,252,241,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, s - 14, s, 14);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }

  _makeCeilingTexture(W, H) {
    const s = 256;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#04060b';
    ctx.fillRect(0, 0, s, s);

    // Ceiling panel lines
    ctx.strokeStyle = '#0c1018';
    ctx.lineWidth = 2;
    for (let x = 0; x < s; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke();
    }
    for (let y = 0; y < s; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
    }

    // Light fixture outlines
    [[40, 40], [40, 200], [200, 40], [200, 200], [120, 120]].forEach(([lx, ly]) => {
      ctx.strokeStyle = 'rgba(200,180,100,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(lx - 14, ly - 6, 28, 12);
    });

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(W / 160, H / 160);
    return tex;
  }

  _makeCrateTexture() {
    const s = 128;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d');

    // Worn wood planks
    ctx.fillStyle = '#6b4120';
    ctx.fillRect(0, 0, s, s);

    // Grain lines
    ctx.strokeStyle = '#4a2c13';
    ctx.lineWidth = 1;
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * s);
      ctx.lineTo(s, Math.random() * s + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }

    // Black border
    ctx.strokeStyle = '#1a0a04';
    ctx.lineWidth = 7;
    ctx.strokeRect(3, 3, s - 6, s - 6);

    // Cross brace
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s, s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(0, s); ctx.stroke();

    return new THREE.CanvasTexture(c);
  }

  _parseRgba(rgbaStr) {
    const m = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (m) {
      return {
        color: new THREE.Color(+m[1] / 255, +m[2] / 255, +m[3] / 255),
        alpha: m[4] !== undefined ? +m[4] : 1.0
      };
    }
    return { color: new THREE.Color(1, 1, 1), alpha: 1.0 };
  }

  // ─── Core render loop ────────────────────────────────────────────────────────
  render(engine) {
    if (!this.renderer || !this.scene || !this.camera) return;
    const lp = engine.localPlayer;
    if (!lp) return;

    const time = Date.now();
    const dt = Math.min((time - this._clock.then) / 1000, 0.05);
    this._clock.then = time;

    // ── Camera position & orientation ────────────────────────────────
    const eyeH = lp.inVent ? 12 : 42;
    this.camera.position.set(lp.x, eyeH, lp.y);
    // Map 2D angle (0 = +X, CW) to Three.js Y-rotation
    this.camera.rotation.set(0, -lp.angle - Math.PI / 2, 0);
    this.camera.rotation.order = 'YXZ';

    // ── Weapon Bob + Recoil ───────────────────────────────────────────
    const spd = Math.hypot(lp.vx || 0, lp.vy || 0);
    const isMoving = spd > 0.3 && lp.health > 0;
    const isSprinting = spd > 3.0;

    if (isMoving) {
      this.bobTime += dt * (isSprinting ? 12 : 8);
    } else {
      this.bobTime *= 0.88;
    }

    const bobAmp = isSprinting ? 0.012 : 0.007;
    const bobX = Math.sin(this.bobTime) * bobAmp;
    const bobY = Math.abs(Math.cos(this.bobTime)) * bobAmp * 0.6;

    // Recoil spring
    const flash = lp.muzzleFlash || 0;
    this._recoilVel += flash * 0.08;
    this._recoilVel *= 0.75;
    this._recoilOffset += this._recoilVel;
    this._recoilOffset *= 0.80;

    if (this.weaponPivot) {
      this.weaponPivot.position.set(
        0.22 + bobX,
        -0.22 + bobY - this._recoilOffset * 0.5,
        -0.45 + this._recoilOffset * 0.4
      );
      this.weaponPivot.rotation.x = this._recoilOffset * 0.12;
    }

    // Muzzle flash
    if (this.muzzleFlashMesh && this.muzzleFlashLight) {
      const hasFlash = flash > 0.05;
      this.muzzleFlashMesh.material.opacity = hasFlash ? flash * 0.9 : 0.0;
      this.muzzleFlashLight.intensity = hasFlash ? flash * 8.0 : 0.0;
      if (hasFlash) {
        this.muzzleFlashMesh.scale.setScalar(0.8 + Math.random() * 0.5);
        this.muzzleFlashMesh.rotation.z = Math.random() * Math.PI;
      }
    }

    // ── Point Lights ─────────────────────────────────────────────────
    for (const key in this.pointLights) {
      const ld = engine.map.ambientLights[key];
      const pl = this.pointLights[key];
      if (!ld || !pl) continue;
      pl.visible = ld.on !== false;
      let pulse = 1.0;
      if (ld.pulseType === 'garage')  pulse = 1 + Math.sin(time / 300) * 0.06;
      else if (ld.pulseType === 'lantern') pulse = 1 + Math.sin(time / 200) * 0.05;
      else if (ld.pulseType === 'quantum') pulse = 1 + Math.sin(time / 120) * 0.04;
      const alpha = this._parseRgba(ld.color).alpha;
      pl.intensity = alpha * 3.0 * pulse;
    }

    // ── Sync Crates ───────────────────────────────────────────────────
    const activeCrateIds = new Set();
    engine.map.walls.forEach(w => {
      if (w.type !== 'crate') return;
      activeCrateIds.add(w.id);
      if (!this.crateMeshes[w.id]) {
        const ch = w.w;
        const geo = new THREE.BoxGeometry(w.w, ch, w.h);
        const tex = this._makeCrateTexture();
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(w.x + w.w / 2, ch / 2, w.y + w.h / 2);
        this.scene.add(mesh);
        this.crateMeshes[w.id] = mesh;
      }
    });
    for (const id in this.crateMeshes) {
      if (!activeCrateIds.has(id)) {
        this.scene.remove(this.crateMeshes[id]);
        delete this.crateMeshes[id];
      }
    }

    // ── Sync Terminals ────────────────────────────────────────────────
    if (engine.map.terminals) {
      engine.map.terminals.forEach(term => {
        const group = this.terminalMeshes[term.id];
        if (!group) return;
        const screen = group.children[1];
        const glow   = group.children[2];
        if (screen) screen.material.color.setHex(term.hacked ? 0x66fcf1 : 0xff3c3c);
        if (glow)   glow.color.setHex(term.hacked ? 0x66fcf1 : 0xff3c3c);
      });
    }

    // ── Sync Enemy Players ────────────────────────────────────────────
    const activePids = new Set();
    if (this.playerModelTemplate) {
      engine.players.forEach(p => {
        if (p.id === engine.localPlayerId) return;
        activePids.add(p.id);

        if (p.health > 0) {
          if (!this.playerMeshes[p.id]) {
            const clone = this.playerModelTemplate.clone();
            this.scene.add(clone);
            this.playerMeshes[p.id] = clone;
          }
          const model = this.playerMeshes[p.id];
          // Offset to sit cleanly on ground (model origin ≈ center)
          model.position.set(p.x, 16, p.y);
          model.rotation.y = -p.angle + Math.PI / 2;

          // Walk sway
          const inner = model.children[0];
          if (inner) {
            const wspd = Math.hypot(p.vx || 0, p.vy || 0);
            if (wspd > 0.3) {
              const phase = (time * 0.01) % (Math.PI * 2);
              inner.position.y = Math.abs(Math.sin(phase)) * 2.5;
              inner.rotation.z = Math.sin(phase) * 0.07;
            } else {
              inner.position.y = 0;
              inner.rotation.z = 0;
            }
          }
        } else {
          if (this.playerMeshes[p.id]) {
            this.scene.remove(this.playerMeshes[p.id]);
            delete this.playerMeshes[p.id];
          }
        }
      });
    }
    for (const pid in this.playerMeshes) {
      if (!activePids.has(pid)) {
        this.scene.remove(this.playerMeshes[pid]);
        delete this.playerMeshes[pid];
      }
    }

    // ── Render Bullets (laser trails) ────────────────────────────────
    this.bulletMeshes.forEach(b => this.scene.remove(b));
    this.bulletMeshes = [];
    engine.bullets.forEach(b => {
      if (!b.active) return;
      const len = 50;
      const geo = new THREE.CylinderGeometry(0.8, 0.8, len, 6);
      const isPlasma = b.color === '#ff6ef7';
      const col = isPlasma ? 0xff6ef7 : 0xffe040;
      const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        b.x - Math.cos(b.angle) * (len / 2),
        42,
        b.y - Math.sin(b.angle) * (len / 2)
      );
      mesh.rotation.y = -b.angle + Math.PI / 2;
      mesh.rotation.x = Math.PI / 2;
      this.scene.add(mesh);
      this.bulletMeshes.push(mesh);

      // Small light on bullet for dramatic illumination
      const bLight = new THREE.PointLight(col, 0.8, 60, 2);
      bLight.position.set(b.x, 42, b.y);
      this.scene.add(bLight);
      this.bulletMeshes.push(bLight);
    });

    // ── Render Flashbangs ─────────────────────────────────────────────
    const activeGKeys = new Set();
    engine.grenades.forEach((g, idx) => {
      const gKey = `${g.throwerId}_${g.creationTime}_${idx}`;
      activeGKeys.add(gKey);

      if (!this.grenadeMeshes[gKey]) {
        const grp = new THREE.Group();

        // Main cylinder body
        const cylGeo = new THREE.CylinderGeometry(2.5, 2.5, 9, 12);
        const cylMat = new THREE.MeshStandardMaterial({ color: 0x2a3228, metalness: 0.9, roughness: 0.15 });
        grp.add(new THREE.Mesh(cylGeo, cylMat));

        // Safety ring
        const ringGeo = new THREE.TorusGeometry(3, 0.5, 8, 16);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xccaa00, metalness: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 3.5;
        grp.add(ring);

        // Bottom band
        const bandGeo = new THREE.TorusGeometry(2.7, 0.4, 8, 16);
        const bandMat = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.rotation.x = Math.PI / 2;
        band.position.y = -3.5;
        grp.add(band);

        // Blinking LED on top
        const ledGeo = new THREE.SphereGeometry(1, 8, 8);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.y = 5;
        grp.add(led);

        // Point light for glow
        const gLight = new THREE.PointLight(0xff2200, 2.0, 60, 2);
        gLight.position.y = 5;
        grp.add(gLight);

        this.scene.add(grp);
        this.grenadeMeshes[gKey] = grp;
      }

      const grp = this.grenadeMeshes[gKey];
      const elapsed = time - g.creationTime;
      const t = Math.min(1.0, elapsed / g.timer);

      // Parabolic arc
      const peakH = 30;
      const groundH = 3;
      const throwH = 38;
      let y = groundH;
      if (t < 1.0) {
        y = throwH * (1 - t) + groundH * t + peakH * 4 * t * (1 - t);
      }
      grp.position.set(g.x, y, g.y);
      grp.rotation.x += dt * 4;
      grp.rotation.y += dt * 3;

      // Blink LED faster as it approaches detonation
      const blinkRate = 150 + (1 - t) * 450;
      const led = grp.children[3];
      const gLight = grp.children[4];
      if (led && gLight) {
        const isOn = Math.floor(time / blinkRate) % 2 === 0;
        led.material.color.setHex(isOn ? 0xff2200 : 0x220000);
        gLight.intensity = isOn ? 3.0 : 0.0;
      }
    });
    for (const key in this.grenadeMeshes) {
      if (!activeGKeys.has(key)) {
        this.scene.remove(this.grenadeMeshes[key]);
        delete this.grenadeMeshes[key];
      }
    }

    // ── Render Pickups ────────────────────────────────────────────────
    const activeItemIds = new Set();
    engine.map.items.forEach(item => {
      if (!item.active) return;
      activeItemIds.add(item.id);

      if (!this.itemMeshes[item.id]) {
        const grp = new THREE.Group();

        // Colour by type
        let col = 0xffdd00;
        if (item.type === 'health') col = 0xff2244;
        else if (item.type === 'adrenaline') col = 0x22ff66;
        else if (item.type === 'overdrive') col = 0xff44ff;

        // Floating orb core
        const orbGeo = new THREE.SphereGeometry(5, 16, 12);
        const orbMat = new THREE.MeshStandardMaterial({
          color: col, emissive: new THREE.Color(col).multiplyScalar(0.6),
          emissiveIntensity: 1.0, roughness: 0.05, metalness: 0.5,
          transparent: true, opacity: 0.92
        });
        grp.add(new THREE.Mesh(orbGeo, orbMat));

        // Spinning outer ring (halo)
        const haloGeo = new THREE.TorusGeometry(8, 0.8, 10, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 3;
        grp.add(halo);

        // Second ring (tilted other way)
        const halo2 = halo.clone();
        halo2.rotation.x = -Math.PI / 3;
        halo2.rotation.y = Math.PI / 4;
        grp.add(halo2);

        // Vertical light beacon
        const beaconGeo = new THREE.CylinderGeometry(1.5, 4, 200, 8, 1, true);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: col, transparent: true, opacity: 0.08,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.y = 100;
        grp.add(beacon);

        // Small point light
        const iLight = new THREE.PointLight(col, 2.0, 120, 2);
        grp.add(iLight);

        grp.position.set(item.x, 12, item.y);
        this.scene.add(grp);
        this.itemMeshes[item.id] = grp;
      }

      const grp = this.itemMeshes[item.id];
      // Float
      grp.position.y = 12 + Math.sin(time / 500) * 3;
      // Spin halos
      const halo1 = grp.children[1];
      const halo2 = grp.children[2];
      if (halo1) halo1.rotation.z += dt * 1.8;
      if (halo2) halo2.rotation.z -= dt * 1.2;
      // Pulse beacon
      const beacon = grp.children[3];
      if (beacon) beacon.material.opacity = 0.06 + Math.sin(time / 250) * 0.03;
      // Pulse light
      const iLight = grp.children[4];
      if (iLight) iLight.intensity = 1.5 + Math.sin(time / 300) * 0.5;
    });
    for (const id in this.itemMeshes) {
      if (!activeItemIds.has(id)) {
        this.scene.remove(this.itemMeshes[id]);
        delete this.itemMeshes[id];
      }
    }

    // ── Particles ─────────────────────────────────────────────────────
    this.particlePool.reset();
    const pSrc = (engine.frame && engine.frame.particles) ? engine.frame.particles
               : (engine.particles && engine.particles.particles) ? engine.particles.particles : null;
    if (pSrc) {
      pSrc.forEach(p => {
        const y = 30 + (Math.random() - 0.5) * 14;
        this.particlePool.get(p.color, p.size * 0.35, p.x, p.y, y);
      });
    }

    // ── Render ────────────────────────────────────────────────────────
    this.renderer.render(this.scene, this.camera);
  }

  // Project 3-D world-space point to 2-D canvas screen-space (used for floating numbers)
  projectToScreen(x, y, y3d = 40) {
    if (!this.camera || !this.renderer) return null;
    const v = new THREE.Vector3(x, y3d, y);
    v.project(this.camera);
    if (v.z > 1) return null;
    const el = this.renderer.domElement;
    return {
      x: (v.x * 0.5 + 0.5) * el.clientWidth,
      y: (-(v.y * 0.5) + 0.5) * el.clientHeight
    };
  }

  destroy() {
    this.active = false;
    if (this.particlePool) { this.particlePool.reset(); this.particlePool = null; }
    this.wallMeshes = [];
    this.crateMeshes = {};
    this.terminalMeshes = {};
    this.itemMeshes = {};
    this.bulletMeshes = [];
    this.grenadeMeshes = {};
    this.pointLights = {};
    this.playerMeshes = {};
    this.scene = null;
    this.camera = null;
    if (this.renderer) { this.renderer.dispose(); this.renderer = null; }
  }
}

// ─── Particle Mesh Pool ───────────────────────────────────────────────────────
class ParticlePool {
  constructor(scene) {
    this.scene = scene;
    this.pool = [];
    this.active = [];
  }

  get(color, size, worldX, worldZ, worldY) {
    let mesh;
    if (this.pool.length > 0) {
      mesh = this.pool.pop();
      mesh.material.color.set(color);
    } else {
      const geo = new THREE.SphereGeometry(2, 5, 5);
      const mat = new THREE.MeshBasicMaterial({ color });
      mesh = new THREE.Mesh(geo, mat);
    }
    mesh.scale.setScalar(size);
    mesh.position.set(worldX, worldY, worldZ);
    mesh.visible = true;
    this.scene.add(mesh);
    this.active.push(mesh);
    return mesh;
  }

  reset() {
    for (const m of this.active) {
      m.visible = false;
      this.scene.remove(m);
      this.pool.push(m);
    }
    this.active = [];
  }
}
