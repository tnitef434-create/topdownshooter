/**
 * CharacterRenderer.js
 * Uses Three.js to render the Elf Girl 3D model from a top-down perspective
 * in real-time onto an offscreen canvas, then draws those pixels onto the
 * main 2D game canvas each frame.
 *
 * Exposes:
 *   CharacterRenderer.init()  → Promise  (call once on game start)
 *   CharacterRenderer.ready   → boolean
 *   CharacterRenderer.draw(ctx, id, x, y, angle, speed, isShooting)
 *                              → boolean (true if drawn)
 */

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

const SPRITE_SIZE = 80; // px, size of the offscreen render target

class CharacterRendererClass {
  constructor() {
    this.ready = false;
    this.loadPromise = null;

    // Three.js objects
    this._renderer = null;
    this._scene    = null;
    this._camera   = null;
    this._model    = null;      // the root Object3D
    this._tmpCanvas = null;     // 2D canvas used to transfer pixels

    // Per-player walk phase
    this._phases = {};
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  init() {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this._setup().catch(err => {
      console.error('[CharacterRenderer] Failed to load model:', err);
    });
    return this.loadPromise;
  }

  /**
   * Draw the elf girl at world position (x, y) facing `angle` radians.
   * `speed`     – current movement speed magnitude (0 = idle)
   * `isShooting` – play shoot animation frames
   * Returns true if drawn, false if model not loaded yet.
   */
  draw(ctx, id, x, y, angle, speed, isShooting) {
    if (!this.ready) return false;

    // ── 1. Advance walk phase ───────────────────────────────────────────
    if (!this._phases[id]) this._phases[id] = 0;
    const isWalking = speed > 0.3;
    if (isWalking) {
      this._phases[id] = (this._phases[id] + speed * 0.09) % (Math.PI * 2);
    } else {
      this._phases[id] *= 0.88; // dampen to idle
    }
    const phase = this._phases[id];

    // ── 2. Pose the model ────────────────────────────────────────────────
    const model = this._model;

    // Rotate model so it faces the game angle
    // Three.js Y-up: game angle 0 = facing right (+X world).
    // Three.js model faces +Z by default (from OBJ). We need to map.
    model.rotation.y = -angle + Math.PI / 2;

    // Procedural body bob (walk/idle)
    if (isWalking) {
      model.position.y = Math.abs(Math.sin(phase)) * 0.04; // bounce up only
      model.rotation.z = Math.sin(phase) * 0.08;            // sway side-to-side
    } else if (isShooting) {
      model.position.y = 0;
      model.rotation.z = 0;
      // Recoil: tilt back slightly on shot frame
      model.rotation.x = -0.12;
    } else {
      model.position.y *= 0.85;
      model.rotation.z *= 0.85;
      model.rotation.x *= 0.85;
    }

    // ── 3. Render offscreen ──────────────────────────────────────────────
    this._renderer.render(this._scene, this._camera);

    // Copy WebGL framebuffer → 2D canvas
    const tCtx = this._tmpCanvas.getContext('2d');
    tCtx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    tCtx.drawImage(this._renderer.domElement, 0, 0);

    // ── 4. Draw onto game canvas ─────────────────────────────────────────
    const half = SPRITE_SIZE / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(this._tmpCanvas, -half, -half - 4); // -4 to centre vertically on feet
    ctx.restore();

    return true;
  }

  // ─── Private setup ──────────────────────────────────────────────────────

  async _setup() {
    // Offscreen WebGL renderer
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true // needed so toDataURL / drawImage works
    });
    this._renderer.setSize(SPRITE_SIZE, SPRITE_SIZE);
    this._renderer.setPixelRatio(1);
    this._renderer.setClearColor(0x000000, 0);
    this._renderer.shadowMap.enabled = false;

    // 2D proxy canvas for pixel copy
    this._tmpCanvas = document.createElement('canvas');
    this._tmpCanvas.width  = SPRITE_SIZE;
    this._tmpCanvas.height = SPRITE_SIZE;

    // Scene
    this._scene = new THREE.Scene();

    // Top-down orthographic camera – shows roughly 1.2 × 1.2 world units
    const s = 0.65;
    this._camera = new THREE.OrthographicCamera(-s, s, s, -s, 0.01, 30);
    this._camera.position.set(0, 9, 0);
    this._camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    this._scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(1, 8, 2);
    this._scene.add(sun);

    const fill = new THREE.DirectionalLight(0xaaccff, 0.4);
    fill.position.set(-2, 5, -3);
    this._scene.add(fill);

    // Load model
    this._model = await this._loadModel();

    // Fit model in frame
    this._fitModel(this._model);

    this._scene.add(this._model);
    this.ready = true;
    console.log('[CharacterRenderer] elf girl model loaded ✓');
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

    const wrapper = new THREE.Group();
    wrapper.add(group);
    return wrapper;
  }

  _loadModel() {
    return Promise.resolve(this.createCustomRobotModel());
  }

  _fitModel(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 1.1 / maxDim;
    obj.scale.setScalar(scale);

    // Re-centre after scaling
    const scaledBox = new THREE.Box3().setFromObject(obj);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    obj.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);
  }
}

export const CharacterRenderer = new CharacterRendererClass();
