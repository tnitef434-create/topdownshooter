import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class FirstPersonController {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.active = false;
    
    // Core Three.js
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    
    // Model Template for players
    this.playerModelTemplate = null;
    this.modelLoaded = false;
    this.playerMeshes = {}; // p.id -> THREE.Group or THREE.Object3D
    
    // Gameplay bobs and times
    this.bobTime = 0;
    
    // Asset references for cleanup
    this.wallMeshes = [];
    this.crateMeshes = {}; // crate.id -> mesh
    this.terminalMeshes = {}; // terminal.id -> mesh
    this.itemMeshes = {}; // item.id -> mesh
    this.bulletMeshes = []; // array of cylinder meshes representing active bullets
    this.pointLights = {}; // lightKey -> pointLight
    
    // Dynamic particle pool
    this.particlePool = null;

    // First person weapon model
    this.gunGroup = null;
    this.muzzleFlashLight = null;
    this.muzzleFlashMesh = null;

    // Active thrown grenades meshes
    this.grenadeMeshes = {};
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
    // 1. Setup Three.js WebGLRenderer on the 3D canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    const size = this.getCanvasSize();
    this.renderer.setSize(size.w, size.h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Setup Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090c, 0.0015); // Dark gritty atmosphere

    // 3. Setup Camera (FOV: 75, Aspect: width/height, Near: 0.05, Far: 4000)
    this.camera = new THREE.PerspectiveCamera(
      75,
      size.w / size.h,
      0.05,
      4000
    );
    this.scene.add(this.camera); // add camera to scene to allow attaching children

    // 4. Setup Ambient, hemisphere, and ceiling directional lights
    const globalAmbient = new THREE.AmbientLight(0xffffff, 0.22);
    this.scene.add(globalAmbient);

    // Hemisphere sky/ground light for realistic color scattering
    const hemiLight = new THREE.HemisphereLight(0x4477aa, 0x111122, 0.7);
    this.scene.add(hemiLight);

    // Directional light from ceiling for general visibility
    const dirLight = new THREE.DirectionalLight(0xaaccff, 0.85);
    dirLight.position.set(500, 1000, 500);
    this.scene.add(dirLight);

    // 5. Setup Particle Pool
    this.particlePool = new ParticlePool(this.scene);

    // 6. Build the First Person View Weapon Model
    this.buildWeaponModel();

    // 7. Load Player 3D Model Template (Elf Girl)
    try {
      this.playerModelTemplate = await this.loadPlayerModel();
      this.modelLoaded = true;
      console.log('[FPM] Player model loaded successfully.');
    } catch (e) {
      console.warn('[FPM] Failed to load 3D player model template. Falling back to placeholder shapes.', e);
      this.playerModelTemplate = this.createPlayerPlaceholder();
      this.modelLoaded = true;
    }

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const size = this.getCanvasSize();
    this.renderer.setSize(size.w, size.h, false);
    this.camera.aspect = size.w / size.h;
    this.camera.updateProjectionMatrix();
  }

  buildWeaponModel() {
    this.gunGroup = new THREE.Group();

    // Main barrel receiver
    const receiverGeo = new THREE.BoxGeometry(0.4, 0.4, 2.0);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.85,
      roughness: 0.2,
      name: 'gun-metal'
    });
    const receiver = new THREE.Mesh(receiverGeo, metalMat);
    receiver.position.set(0, 0, 0);
    this.gunGroup.add(receiver);

    // Barrel extension
    const barrelGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 8);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.05, -1.5);
    this.gunGroup.add(barrel);

    // Scope attachment
    const scopeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const scopeMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
    const scope = new THREE.Mesh(scopeGeo, scopeMat);
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.3, -0.2);
    this.gunGroup.add(scope);

    // Muzzle Flash Spark Mesh (invisible by default, yellow cone)
    const flashGeo = new THREE.ConeGeometry(0.4, 1.2, 6);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.rotation.x = -Math.PI / 2;
    this.muzzleFlashMesh.position.set(0, 0.05, -2.6);
    this.muzzleFlashMesh.visible = false;
    this.gunGroup.add(this.muzzleFlashMesh);

    // Muzzle Flash point light
    this.muzzleFlashLight = new THREE.PointLight(0xffbb44, 0, 150);
    this.muzzleFlashLight.position.set(0, 0.05, -2.6);
    this.gunGroup.add(this.muzzleFlashLight);

    // Attach gun to camera (positioned in the lower right viewport corner)
    // Positive X = right, Positive Y = up, Negative Z = forward (away from camera)
    // Positioning at (0.18, -0.15, -0.32) and scaling to 0.15 gives a sleek, premium AAA FPS view-model.
    this.gunGroup.position.set(0.18, -0.15, -0.32);
    this.gunGroup.scale.set(0.15, 0.15, 0.15);
    this.camera.add(this.gunGroup);

    // Add high-tech glowing neon lines on the receiver
    const lineGeo = new THREE.BoxGeometry(0.02, 0.42, 0.02);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
    const glowLineL = new THREE.Mesh(lineGeo, glowMat);
    glowLineL.position.set(-0.21, 0, 0);
    this.gunGroup.add(glowLineL);

    const glowLineR = new THREE.Mesh(lineGeo, glowMat);
    glowLineR.position.set(0.21, 0, 0);
    this.gunGroup.add(glowLineR);
  }

  createPlayerPlaceholder() {
    const group = new THREE.Group();
    // Cylinder body
    const bodyGeo = new THREE.CylinderGeometry(15, 15, 45, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x66fcf1, metalness: 0.5, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0;
    group.add(body);

    // Front indicator (so we see where bots are facing)
    const eyeGeo = new THREE.BoxGeometry(6, 6, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3c3c });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 15, -12);
    group.add(eye);

    // Placeholder Gun
    const gunGeo = new THREE.BoxGeometry(4, 4, 25);
    const gunMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.set(10, 2, -15);
    group.add(gun);

    return group;
  }

  createCustomRobotModel() {
    const group = new THREE.Group();

    // 1. Armored Torso (Heavy Chestplate)
    const torsoGeo = new THREE.CylinderGeometry(8, 5, 20, 8);
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      metalness: 0.95,
      roughness: 0.15,
      name: 'robot-armor'
    });
    const torso = new THREE.Mesh(torsoGeo, armorMat);
    torso.position.y = 20;
    group.add(torso);

    // Glowing Power Core (in center of chest)
    const coreGeo = new THREE.CylinderGeometry(2, 2, 2, 8);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 23, 7.5);
    group.add(core);

    // 2. Robotic Head (Sleek helmet with visor)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 33, 0);

    const helmetGeo = new THREE.SphereGeometry(4.5, 12, 12);
    const helmet = new THREE.Mesh(helmetGeo, armorMat);
    headGroup.add(helmet);

    // Neon Visor
    const visorGeo = new THREE.BoxGeometry(7, 1.2, 4);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xff3c3c });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1, 3.2);
    headGroup.add(visor);

    // Antennas
    const antGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 4);
    const antennaL = new THREE.Mesh(antGeo, armorMat);
    antennaL.position.set(-3.5, 4, -1);
    antennaL.rotation.z = -0.25;
    headGroup.add(antennaL);

    const antennaR = new THREE.Mesh(antGeo, armorMat);
    antennaR.position.set(3.5, 4, -1);
    antennaR.rotation.z = 0.25;
    headGroup.add(antennaR);

    group.add(headGroup);

    // 3. Heavy Shoulder Pauldrons
    const pauldronGeo = new THREE.SphereGeometry(4, 8, 8);
    const pauldronL = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronL.position.set(-10, 26, 0);
    pauldronL.scale.set(1.2, 1, 1);
    group.add(pauldronL);

    const pauldronR = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronR.position.set(10, 26, 0);
    pauldronR.scale.set(1.2, 1, 1);
    group.add(pauldronR);

    // 4. Mechanical Arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const limbGeo = new THREE.CylinderGeometry(1.5, 1.2, 10, 6);
    
    // Left Arm
    const armL = new THREE.Mesh(limbGeo, armMat);
    armL.position.set(-11, 19, 2);
    armL.rotation.x = 0.4;
    group.add(armL);

    // Right Arm (holding weapon)
    const armR = new THREE.Mesh(limbGeo, armMat);
    armR.position.set(11, 19, -2);
    armR.rotation.x = -0.4;
    group.add(armR);

    // 5. Jetpack / Thrusters on Back
    const packGeo = new THREE.BoxGeometry(8, 14, 5);
    const jetpack = new THREE.Mesh(packGeo, armorMat);
    jetpack.position.set(0, 20, -6);
    
    // Thruster cones
    const coneGeo = new THREE.CylinderGeometry(1, 1.8, 4, 8);
    const coneL = new THREE.Mesh(coneGeo, armMat);
    coneL.position.set(-3, -8, 0);
    jetpack.add(coneL);

    const coneR = new THREE.Mesh(coneGeo, armMat);
    coneR.position.set(3, -8, 0);
    jetpack.add(coneR);

    // Thruster exhaust flames (glowing orange cylinders)
    const flameGeo = new THREE.CylinderGeometry(1.2, 0.1, 5, 8);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-3, -11, 0);
    jetpack.add(flameL);

    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(3, -11, 0);
    jetpack.add(flameR);

    group.add(jetpack);

    // 6. Cybernetic Legs
    const legL = new THREE.Mesh(limbGeo, armMat);
    legL.position.set(-4, 6, 0);
    group.add(legL);

    const legR = new THREE.Mesh(limbGeo, armMat);
    legR.position.set(4, 6, 0);
    group.add(legR);

    // 7. Sci-fi Carbine rifle attached to robot arms
    const rifleGeo = new THREE.BoxGeometry(2, 2.5, 18);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x050c18, metalness: 0.9, roughness: 0.2 });
    const rifle = new THREE.Mesh(rifleGeo, gunMat);
    rifle.position.set(7, 16, -10);
    rifle.rotation.y = 0.1;
    group.add(rifle);

    // Wrap inside a parent group to make rotations clean around origin
    const wrapper = new THREE.Group();
    wrapper.add(group);
    return wrapper;
  }

  loadPlayerModel() {
    // Generate custom premium cyborg model locally (eliminates OBJ file load failures)
    return Promise.resolve(this.createCustomRobotModel());
  }

  // ─── Map Construction (One-time or on Map change) ──────────────────────────
  build3DMap(map) {
    // Clear old map meshes
    this.wallMeshes.forEach(mesh => this.scene.remove(mesh));
    this.wallMeshes = [];
    
    for (const key in this.crateMeshes) {
      this.scene.remove(this.crateMeshes[key]);
    }
    this.crateMeshes = {};

    for (const key in this.terminalMeshes) {
      this.scene.remove(this.terminalMeshes[key]);
    }
    this.terminalMeshes = {};

    // 1. Create Floor Plane
    if (this.floorMesh) this.scene.remove(this.floorMesh);
    const floorGeo = new THREE.PlaneGeometry(map.width, map.height);
    const floorTexture = this.generateGridTexture(map.width, map.height, '#0a0d14', '#22304d', '#00f6ff');
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.18, // highly glossy
      metalness: 0.85  // highly reflective metallic floor
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    // Map coords in 2D go from (0,0) to (width, height). In 3D, floor center should align with 2D center.
    this.floorMesh.position.set(map.width / 2, 0, map.height / 2);
    this.scene.add(this.floorMesh);

    // 2. Create Ceiling Plane
    if (this.ceilingMesh) this.scene.remove(this.ceilingMesh);
    const ceilingGeo = new THREE.PlaneGeometry(map.width, map.height);
    const ceilingTexture = this.generateGridTexture(map.width, map.height, '#030508', '#141c2c', '#c5a059');
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: ceilingTexture,
      roughness: 0.3,
      metalness: 0.7
    });
    this.ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    this.ceilingMesh.rotation.x = Math.PI / 2; // face downwards
    this.ceilingMesh.position.set(map.width / 2, 100, map.height / 2);
    this.scene.add(this.ceilingMesh);

    // 3. Create Walls and Crates from 2D structures
    const wallMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.9,
      roughness: 0.18  // reflective walls
    });

    const crateWoodTexture = this.generateCrateTexture();
    const crateMat = new THREE.MeshStandardMaterial({
      map: crateWoodTexture,
      roughness: 0.8,
      metalness: 0.1
    });

    // Color map for furniture
    const furnitureColors = {
      sofa: 0x261637,
      table: 0x241510,
      bed: 0x152030,
      counter: 0x182215,
      desk: 0x1e1408,
      tub: 0x0a1a2c,
      sink: 0x0a1828,
      tv: 0x0a0a14,
      shelf: 0x1e1006,
      car: 0x1a1a28,
      bench: 0x1c1408,
      fridge: 0x141c24,
      cabinet: 0x18100a,
      dresser: 0x1e1408,
      toilet: 0xeeeeee,
      chair: 0x2b1e16,
      plant: 0x152d18,
      cyber_couch: 0x110a24,
      containment_pod: 0x08181a,
      server_rack: 0x080c10,
      cyber_console: 0x050c18,
      reactor_core: 0x150c05,
      nano_charger: 0x051a0c
    };

    map.walls.forEach(w => {
      if (w.type === 'wall') {
        const wallH = w.material === 'furniture' ? (this.getFurnitureHeight(w.label) || 40) : 100;
        const geo = new THREE.BoxGeometry(w.w, wallH, w.h);
        
        let mat = wallMetalMat;
        if (w.material === 'furniture') {
          const col = furnitureColors[w.label] || 0x1a1a2a;
          mat = new THREE.MeshStandardMaterial({
            color: col,
            metalness: w.label?.startsWith('cyber') || w.label === 'reactor_core' ? 0.8 : 0.2,
            roughness: 0.5
          });
        }

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(w.x + w.w / 2, wallH / 2, w.y + w.h / 2);
        this.scene.add(mesh);
        this.wallMeshes.push(mesh);
      } else if (w.type === 'crate') {
        // Crate cubes
        const crateH = w.w; // make them perfect cubes
        const geo = new THREE.BoxGeometry(w.w, crateH, w.h);
        const mesh = new THREE.Mesh(geo, crateMat);
        mesh.position.set(w.x + w.w / 2, crateH / 2, w.y + w.h / 2);
        this.scene.add(mesh);
        this.crateMeshes[w.id] = mesh;
      }
    });

    // 4. Create Interactive Terminals (chests)
    if (map.terminals) {
      map.terminals.forEach(term => {
        const geo = new THREE.BoxGeometry(24, 32, 24);
        const terminalMat = new THREE.MeshStandardMaterial({
          color: term.hacked ? 0x66fcf1 : 0xff3c3c,
          metalness: 0.8,
          roughness: 0.2,
          emissive: term.hacked ? 0x005555 : 0x550000
        });
        const mesh = new THREE.Mesh(geo, terminalMat);
        mesh.position.set(term.x, 16, term.y);
        this.scene.add(mesh);
        this.terminalMeshes[term.id] = mesh;
      });
    }

    // 5. Initialize Ambient Point Lights
    for (const key in this.pointLights) {
      this.scene.remove(this.pointLights[key]);
    }
    this.pointLights = {};

    for (const key in map.ambientLights) {
      const lightData = map.ambientLights[key];
      const parsed = this.parseRgbaColor(lightData.color);
      
      // PointLight(color, intensity, distance, decay)
      const pLight = new THREE.PointLight(parsed.color, parsed.alpha * 2.8, lightData.radius * 1.5, 1.2);
      pLight.position.set(lightData.x, 70, lightData.y); // Ceiling fixtures at height = 70
      
      // Add light visual fixture mesh
      const fixtureGeo = new THREE.SphereGeometry(4, 8, 8);
      const fixtureMat = new THREE.MeshBasicMaterial({ color: parsed.color });
      const fixtureMesh = new THREE.Mesh(fixtureGeo, fixtureMat);
      pLight.add(fixtureMesh);

      this.scene.add(pLight);
      this.pointLights[key] = pLight;
    }
  }

  getFurnitureHeight(label) {
    const heights = {
      sofa: 25, table: 25, bed: 28, counter: 32, desk: 26, tub: 28,
      sink: 32, tv: 40, shelf: 85, car: 42, bench: 24, fridge: 80,
      cabinet: 75, dresser: 40, toilet: 25, chair: 18, plant: 30,
      cyber_couch: 25, containment_pod: 75, server_rack: 85,
      cyber_console: 45, reactor_core: 75, nano_charger: 50
    };
    return heights[label] || 35;
  }

  generateGridTexture(w, h, bgCol, gridCol, cornerCol) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, 256, 256);
    
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 256, 256);
    
    ctx.strokeStyle = cornerCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 20); ctx.lineTo(0, 0); ctx.lineTo(20, 0);
    ctx.moveTo(256, 20); ctx.lineTo(256, 0); ctx.lineTo(236, 0);
    ctx.moveTo(0, 236); ctx.lineTo(0, 256); ctx.lineTo(20, 256);
    ctx.moveTo(256, 236); ctx.lineTo(256, 256); ctx.lineTo(236, 256);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(w / 80, h / 80);
    return texture;
  }

  generateCrateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8b5a2b'; 
    ctx.fillRect(0, 0, 128, 128);
    
    // Wood grain lines
    ctx.fillStyle = '#5c3a21';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(0, Math.random() * 128, 128, Math.random() * 5);
    }
    
    ctx.strokeStyle = '#3d2516';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 128, 128);
    
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(128, 128);
    ctx.moveTo(128, 0); ctx.lineTo(0, 128);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }

  parseRgbaColor(rgbaStr) {
    const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const r = parseInt(match[1]) / 255;
      const g = parseInt(match[2]) / 255;
      const b = parseInt(match[3]) / 255;
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;
      return { color: new THREE.Color(r, g, b), alpha: a };
    }
    return { color: new THREE.Color(1.0, 1.0, 1.0), alpha: 1.0 };
  }

  // ─── Core FPM Render and Update Loop ───────────────────────────────────────
  render(engine) {
    if (!this.renderer || !this.scene || !this.camera) return;

    const localPlayer = engine.localPlayer;
    if (!localPlayer) return;

    const deltaTime = 0.016; // Approx tick rate
    const time = Date.now();

    // 1. Setup camera coordinates from 2D Local Player
    // Eye height of the player in 3D: let's use Y = 40 (camera height)
    const eyeHeight = localPlayer.inVent ? 12 : 40; 
    this.camera.position.set(localPlayer.x, eyeHeight, localPlayer.y);
    
    // Rotate camera based on the local player angle (inverted for webgl Y-up look)
    // 2D angle: 0 facing +X. In 3D: facing forward is -Z.
    this.camera.rotation.set(0, -localPlayer.angle - Math.PI / 2, 0);

    // 2. Update First Person Weapon bobbing and recoil kickback
    const isMoving = Math.hypot(localPlayer.vx, localPlayer.vy) > 0.3 && localPlayer.health > 0;
    if (isMoving) {
      this.bobTime += 0.28;
    } else {
      this.bobTime *= 0.85; // reset bob
    }
    
    const bobX = Math.sin(this.bobTime) * 0.05;
    const bobY = Math.abs(Math.cos(this.bobTime * 1.5)) * 0.04;
    
    // Recoil kickback from weapon fire (muzzleFlash ranges from 1.0 down to 0)
    const recoilZ = (localPlayer.muzzleFlash || 0) * 0.4;
    const recoilPitch = (localPlayer.muzzleFlash || 0) * 0.08;

    if (this.gunGroup) {
      // Bobbing applied relative to base offset
      this.gunGroup.position.set(0.6 + bobX, -0.6 + bobY, -1.2 + recoilZ);
      this.gunGroup.rotation.set(-recoilPitch, 0, 0);

      // Flash feedback
      const hasFlash = localPlayer.muzzleFlash > 0.05;
      this.muzzleFlashMesh.visible = hasFlash;
      this.muzzleFlashLight.intensity = hasFlash ? localPlayer.muzzleFlash * 5.0 : 0;
    }

    // 3. Update Point Lights (flickers / pulses)
    for (const key in this.pointLights) {
      const lightData = engine.map.ambientLights[key];
      const pLight = this.pointLights[key];
      if (lightData && pLight) {
        // Sync on/off state (flickering ceiling)
        pLight.visible = lightData.on;
        
        // Sync pulse factors
        let pulseFactor = 1.0;
        if (lightData.pulseType === 'garage') {
          pulseFactor = 1.0 + Math.sin(time / 300) * 0.06;
        } else if (lightData.pulseType === 'lantern') {
          pulseFactor = 1.0 + Math.sin(time / 200) * 0.04;
        } else if (lightData.pulseType === 'quantum') {
          pulseFactor = 1.0 + Math.sin(time / 150) * 0.03;
        }

        const baseAlpha = this.parseRgbaColor(lightData.color).alpha;
        pLight.intensity = baseAlpha * 2.8 * pulseFactor;
      }
    }

    // 4. Sync/Update Crates destructible state
    const currentCrateIds = new Set();
    engine.map.walls.forEach(w => {
      if (w.type === 'crate') {
        currentCrateIds.add(w.id);
        const mesh = this.crateMeshes[w.id];
        if (!mesh) {
          // Crate spawned/restored
          const crateH = w.w;
          const geo = new THREE.BoxGeometry(w.w, crateH, w.h);
          const crateWoodTexture = this.generateCrateTexture();
          const crateMat = new THREE.MeshStandardMaterial({ map: crateWoodTexture, roughness: 0.8 });
          const newMesh = new THREE.Mesh(geo, crateMat);
          newMesh.position.set(w.x + w.w / 2, crateH / 2, w.y + w.h / 2);
          this.scene.add(newMesh);
          this.crateMeshes[w.id] = newMesh;
        }
      }
    });

    // Remove crates that have been destroyed in 2D
    for (const crateId in this.crateMeshes) {
      if (!currentCrateIds.has(crateId)) {
        this.scene.remove(this.crateMeshes[crateId]);
        delete this.crateMeshes[crateId];
      }
    }

    // 5. Sync/Update Terminals state
    if (engine.map.terminals) {
      engine.map.terminals.forEach(term => {
        const mesh = this.terminalMeshes[term.id];
        if (mesh) {
          mesh.material.color.setHex(term.hacked ? 0x66fcf1 : 0xff3c3c);
          mesh.material.emissive.setHex(term.hacked ? 0x005555 : 0x550000);
        }
      });
    }

    // 6. Draw other Players (Opponents and Bots)
    const activePlayerIds = new Set();
    if (this.playerModelTemplate) {
      engine.players.forEach(p => {
        // Don't render self in first person (only gun model is visible)
        if (p.id === engine.localPlayerId) return;

        activePlayerIds.add(p.id);

        let model = this.playerMeshes[p.id];
        if (p.health > 0) {
          if (!model) {
            // Instantiate player mesh clone
            model = this.playerModelTemplate.clone();
            this.scene.add(model);
            this.playerMeshes[p.id] = model;
          }

          // Sync coordinates & rotation
          model.position.set(p.x, 22.5, p.y); // centered at height=45, so sits on Y=0
          model.rotation.y = -p.angle + Math.PI / 2;

          // Apply procedural walk swaying to other players in 3D
          const walkSpeed = Math.hypot(p.vx || 0, p.vy || 0);
          const objChild = model.children[0]; // the imported Elf Girl Obj
          if (objChild) {
            if (walkSpeed > 0.3) {
              const phase = (time * 0.012) % (Math.PI * 2);
              objChild.position.y = Math.abs(Math.sin(phase)) * 2; 
              objChild.rotation.z = Math.sin(phase) * 0.08;
              objChild.rotation.x = 0;
            } else if (p.muzzleFlash > 0) {
              objChild.position.y = 0;
              objChild.rotation.z = 0;
              objChild.rotation.x = -0.12; // tilt back slightly recoil
            } else {
              objChild.position.y = 0;
              objChild.rotation.z = 0;
              objChild.rotation.x = 0;
            }
          }
        } else {
          // Dead player, clean up mesh
          if (model) {
            this.scene.remove(model);
            delete this.playerMeshes[p.id];
          }
        }
      });
    }

    // Remove any disconnected players
    for (const pid in this.playerMeshes) {
      if (!activePlayerIds.has(pid)) {
        this.scene.remove(this.playerMeshes[pid]);
        delete this.playerMeshes[pid];
      }
    }

    // 7. Render Bullets (Laser Trails)
    this.bulletMeshes.forEach(b => this.scene.remove(b));
    this.bulletMeshes = [];

    engine.bullets.forEach(b => {
      if (!b.active) return;
      // Re-create as a cylinder stretching along direction
      const len = 40;
      const geo = new THREE.CylinderGeometry(0.5, 0.5, len, 6);
      const isPlasma = b.color === '#ff6ef7';
      const col = isPlasma ? 0xff6ef7 : 0xffea00;
      const mat = new THREE.MeshBasicMaterial({ color: col });
      const mesh = new THREE.Mesh(geo, mat);

      // Bullet height is chest level (Y=40)
      mesh.position.set(b.x - Math.cos(b.angle) * (len / 2), 40, b.y - Math.sin(b.angle) * (len / 2));
      mesh.rotation.y = -b.angle + Math.PI / 2;
      mesh.rotation.x = Math.PI / 2; // point forward
      
      this.scene.add(mesh);
      this.bulletMeshes.push(mesh);
    });

    // 7.5 Render thrown flashbangs (3D cylinder canister with flashing LED and parabolic arc)
    const activeGrenadeKeys = new Set();
    engine.grenades.forEach((g, idx) => {
      const gKey = `${g.throwerId}_${g.creationTime}_${idx}`;
      activeGrenadeKeys.add(gKey);
      
      let mesh = this.grenadeMeshes[gKey];
      if (!mesh) {
        const group = new THREE.Group();
        
        // Main metallic cylinder body
        const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 8);
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x2d332f, metalness: 0.95, roughness: 0.15 });
        const cyl = new THREE.Mesh(cylGeo, metalMat);
        group.add(cyl);
        
        // Glowing cyan rings
        const ringGeo = new THREE.TorusGeometry(1.3, 0.25, 6, 12);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x66fcf1 });
        
        const ringTop = new THREE.Mesh(ringGeo, glowMat);
        ringTop.rotation.x = Math.PI / 2;
        ringTop.position.y = 1.5;
        group.add(ringTop);

        const ringBottom = new THREE.Mesh(ringGeo, glowMat);
        ringBottom.rotation.x = Math.PI / 2;
        ringBottom.position.y = -1.5;
        group.add(ringBottom);
        
        // Flashing LED light on top
        const ledGeo = new THREE.SphereGeometry(0.5, 6, 6);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.y = 2.7;
        group.add(led);
        
        this.scene.add(group);
        mesh = group;
        this.grenadeMeshes[gKey] = mesh;
      }
      
      // Calculate parabolic trajectory
      const elapsed = time - g.creationTime;
      const totalTime = g.timer;
      const t = Math.min(1.0, elapsed / totalTime);
      
      const throwerHeight = 35; // chest level
      const floorHeight = 2.5;
      let y = floorHeight;
      if (t < 1.0) {
        const peakHeight = 25;
        y = floorHeight + (throwerHeight - floorHeight) * (1 - t) + peakHeight * 4 * t * (1 - t);
      }
      
      mesh.position.set(g.x, y, g.y);
      
      // Rotations during flight
      mesh.rotation.x += 0.08;
      mesh.rotation.y += 0.05;
      
      // Pulse red/off LED light
      const led = mesh.children[3];
      if (led) {
        const isRed = Math.floor(time / 150) % 2 === 0;
        led.material.color.setHex(isRed ? 0xff0000 : 0x220000);
      }
    });
    
    // Clean up inactive grenade meshes
    for (const key in this.grenadeMeshes) {
      if (!activeGrenadeKeys.has(key)) {
        this.scene.remove(this.grenadeMeshes[key]);
        delete this.grenadeMeshes[key];
      }
    }

    // 8. Render Floating Items / Pickups (Sleek sci-fi canisters with light beacons)
    const currentItemIds = new Set();
    engine.map.items.forEach(item => {
      if (item.active) {
        currentItemIds.add(item.id);
        let mesh = this.itemMeshes[item.id];
        if (!mesh) {
          const itemGroup = new THREE.Group();
          
          let col = 0xffff00;
          if (item.type === 'health') col = 0xff3c3c;
          else if (item.type === 'adrenaline') col = 0x39db14;
          else if (item.type === 'overdrive') col = 0xff6ef7;
          
          // 1. Central glowing canister core
          const coreGeo = new THREE.CylinderGeometry(2.5, 2.5, 9, 8);
          const coreMat = new THREE.MeshStandardMaterial({
            color: col,
            emissive: col,
            emissiveIntensity: 1.0,
            metalness: 0.1,
            roughness: 0.9
          });
          const core = new THREE.Mesh(coreGeo, coreMat);
          itemGroup.add(core);
          
          // 2. Outer metal support rings/cage
          const ringGeo = new THREE.TorusGeometry(3.2, 0.6, 6, 16);
          const metalMat = new THREE.MeshStandardMaterial({
            color: 0x1f232b,
            metalness: 0.95,
            roughness: 0.15
          });
          
          const ringTop = new THREE.Mesh(ringGeo, metalMat);
          ringTop.rotation.x = Math.PI / 2;
          ringTop.position.y = 3.8;
          itemGroup.add(ringTop);
          
          const ringBottom = new THREE.Mesh(ringGeo, metalMat);
          ringBottom.rotation.x = Math.PI / 2;
          ringBottom.position.y = -3.8;
          itemGroup.add(ringBottom);
          
          // Vertical struts
          const strutGeo = new THREE.BoxGeometry(0.6, 9, 0.6);
          for (let i = 0; i < 4; i++) {
            const strut = new THREE.Mesh(strutGeo, metalMat);
            const angle = (i * Math.PI) / 2;
            strut.position.set(Math.cos(angle) * 3.2, 0, Math.sin(angle) * 3.2);
            itemGroup.add(strut);
          }
          
          // 3. Glowing Light Pillar (Beacon) extending upwards
          const beaconGeo = new THREE.CylinderGeometry(1.2, 2.8, 160, 8, 1, true); // open-ended cylinder
          const beaconMat = new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
          });
          const beacon = new THREE.Mesh(beaconGeo, beaconMat);
          beacon.position.y = 80; // center it relative to canister
          itemGroup.add(beacon);
          
          itemGroup.position.set(item.x, 15, item.y);
          this.scene.add(itemGroup);
          mesh = itemGroup;
          this.itemMeshes[item.id] = mesh;
        }

        // Float & spin animation
        mesh.rotation.y += 0.025;
        mesh.position.y = 14 + Math.sin(time / 200) * 2.5;
        
        // Pulse the beacon opacity slightly
        const beacon = mesh.children[mesh.children.length - 1];
        if (beacon && beacon.material) {
          beacon.material.opacity = 0.10 + Math.sin(time / 150) * 0.04;
        }
      }
    });

    // Remove inactive/collected items
    for (const itemId in this.itemMeshes) {
      if (!currentItemIds.has(itemId)) {
        this.scene.remove(this.itemMeshes[itemId]);
        delete this.itemMeshes[itemId];
      }
    }

    // 9. Particles
    this.particlePool.reset();
    
    // Draw online snapshot particles
    if (engine.frame && engine.frame.particles) {
      engine.frame.particles.forEach(p => {
        const x = p.x;
        const z = p.y;
        const y = 30 + (Math.random() - 0.5) * 12; // float around chest level
        this.particlePool.get(p.color, p.size * 0.4, x, z, y);
      });
    } else if (engine.particles && engine.particles.particles) {
      // Draw offline active particles
      engine.particles.particles.forEach(p => {
        const x = p.x;
        const z = p.y;
        const y = 30 + (Math.random() - 0.5) * 10;
        this.particlePool.get(p.color, p.size * 0.4, x, z, y);
      });
    }

    // 10. Draw and render final 3D context
    this.renderer.render(this.scene, this.camera);
  }

  projectToScreen(x, y, y3d = 40) {
    if (!this.camera || !this.renderer) return null;
    const tempV = new THREE.Vector3(x, y3d, y);
    tempV.project(this.camera);
    
    // Check if behind camera
    if (tempV.z > 1) return null;
    
    const canvas = this.renderer.domElement;
    return {
      x: (tempV.x * 0.5 + 0.5) * canvas.clientWidth,
      y: (-(tempV.y * 0.5) + 0.5) * canvas.clientHeight
    };
  }

  destroy() {
    this.active = false;
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
    this.playerMeshes = {};
    this.wallMeshes = [];
    this.crateMeshes = {};
    this.terminalMeshes = {};
    this.itemMeshes = {};
    this.bulletMeshes = [];
    this.pointLights = {};

    for (const key in this.grenadeMeshes) {
      this.scene.remove(this.grenadeMeshes[key]);
    }
    this.grenadeMeshes = {};

    if (this.particlePool) {
      this.particlePool.reset();
      this.particlePool = null;
    }
  }
}

// Helper Class: Particle Mesh Pool to avoid garbage collection hit
class ParticlePool {
  constructor(scene) {
    this.scene = scene;
    this.pool = [];
    this.active = [];
  }
  
  get(color, size, x, z, y) {
    let mesh;
    if (this.pool.length > 0) {
      mesh = this.pool.pop();
      mesh.material.color.set(color);
    } else {
      const geo = new THREE.SphereGeometry(1.5, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: color });
      mesh = new THREE.Mesh(geo, mat);
    }
    mesh.scale.set(size, size, size);
    mesh.position.set(x, y, z);
    mesh.visible = true;
    this.scene.add(mesh);
    this.active.push(mesh);
    return mesh;
  }
  
  reset() {
    for (const mesh of this.active) {
      mesh.visible = false;
      this.scene.remove(mesh);
      this.pool.push(mesh);
    }
    this.active = [];
  }
}
