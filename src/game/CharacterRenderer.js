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

  async _loadModel() {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/';

    // Try MTL + OBJ
    try {
      return await new Promise((resolve, reject) => {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(base);
        mtlLoader.setResourcePath(base);
        mtlLoader.load('elf_girl.mtl', mats => {
          mats.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(mats);
          objLoader.setPath(base);
          objLoader.load('elf_girl.obj', resolve, undefined, reject);
        }, undefined, reject);
      });
    } catch (e) {
      console.warn('[CharacterRenderer] MTL load failed, falling back to OBJ-only:', e);
    }

    // Fallback: OBJ only with default material
    return new Promise((resolve, reject) => {
      const loader = new OBJLoader();
      loader.setPath((import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/');
      loader.load('elf_girl.obj', obj => {
        obj.traverse(child => {
          if (child.isMesh) {
            child.material = new THREE.MeshLambertMaterial({
              color: 0xd4a27f,
              side: THREE.DoubleSide
            });
          }
        });
        resolve(obj);
      }, undefined, reject);
    });
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
