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
  }

  async init() {
    // 1. Setup Three.js WebGLRenderer on the 3D canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Setup Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090c, 0.0015); // Dark gritty atmosphere

    // 3. Setup Camera (FOV: 75, Aspect: width/height, Near: 0.1, Far: 3000)
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      1,
      4000
    );
    this.scene.add(this.camera); // add camera to scene to allow attaching children

    // 4. Setup Ambient and Global Light
    const globalAmbient = new THREE.AmbientLight(0xffffff, 0.12);
    this.scene.add(globalAmbient);

    // Directional light from ceiling for general visibility
    const dirLight = new THREE.DirectionalLight(0xaaccff, 0.25);
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
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
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
    this.gunGroup.position.set(0.6, -0.6, -1.2);
    this.gunGroup.scale.set(0.8, 0.8, 0.8);
    this.camera.add(this.gunGroup);
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

  async loadPlayerModel() {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/';
    return await new Promise((resolve, reject) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath(base);
      mtlLoader.setResourcePath(base);
      mtlLoader.load('elf_girl.mtl', mats => {
        mats.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mats);
        objLoader.setPath(base);
        objLoader.load('elf_girl.obj', obj => {
          // Adjust model scaling and pivots to match 45 unit height
          const box = new THREE.Box3().setFromObject(obj);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 45 / maxDim; // Make it 45 units tall
          obj.scale.setScalar(scale);

          // Center bounding box horizontally, but place feet at local y=0
          const centeredBox = new THREE.Box3().setFromObject(obj);
          const center = new THREE.Vector3();
          centeredBox.getCenter(center);
          obj.position.set(-center.x, -centeredBox.min.y, -center.z);

          // Wrap inside a parent group to make rotations clean around origin
          const wrapper = new THREE.Group();
          wrapper.add(obj);

          // Add simple gun box attached to the model
          const gunGeo = new THREE.BoxGeometry(2.5, 2.5, 20);
          const gunMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
          const gun = new THREE.Mesh(gunGeo, gunMat);
          gun.position.set(7, 20, -10);
          wrapper.add(gun);

          resolve(wrapper);
        }, undefined, reject);
      }, undefined, reject);
    });
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
      roughness: 0.6,
      metalness: 0.2
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
      roughness: 0.8,
      metalness: 0.3
    });
    this.ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    this.ceilingMesh.rotation.x = Math.PI / 2; // face downwards
    this.ceilingMesh.position.set(map.width / 2, 100, map.height / 2);
    this.scene.add(this.ceilingMesh);

    // 3. Create Walls and Crates from 2D structures
    const wallMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.7,
      roughness: 0.45
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

    // 8. Render Floating Items / Pickups
    const currentItemIds = new Set();
    engine.map.items.forEach(item => {
      if (item.active) {
        currentItemIds.add(item.id);
        let mesh = this.itemMeshes[item.id];
        if (!mesh) {
          // Spawn item pickup in 3D (Torus or Cylinder for sci-fi vibe)
          const geo = new THREE.TorusGeometry(6, 1.8, 8, 24);
          let col = 0xffff00;
          if (item.type === 'health') col = 0xff3c3c;
          else if (item.type === 'adrenaline') col = 0x39db14;
          else if (item.type === 'overdrive') col = 0xff6ef7;

          const mat = new THREE.MeshStandardMaterial({
            color: col,
            emissive: col,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(item.x, 18, item.y);
          this.scene.add(mesh);
          this.itemMeshes[item.id] = mesh;
        }

        // Float & spin animation
        mesh.rotation.y += 0.03;
        mesh.rotation.x += 0.01;
        mesh.position.y = 15 + Math.sin(time / 220) * 3;
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
