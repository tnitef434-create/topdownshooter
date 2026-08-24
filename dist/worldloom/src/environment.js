import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, blockShapeHeight } from './blocks.js';
import { CRACK_STAGES, createCrackAtlasTexture } from './crack-texture.js';
import { GRAPHICS_PRESETS } from './save.js';
import { PondEcologyField } from './pond-ecology.js';
import { HangingLeavesField } from './hanging-leaves.js';
import { RedFlowerField } from './red-flowers.js';
import { atmosphericFogRange } from './fog.js';

const LIGHT_BLOCKS = new Set([BLOCK.TORCH, BLOCK.LUMEN_CRYSTAL, BLOCK.KILN, BLOCK.FURNACE]);
const FOLIAGE_BLOCKS = new Set([BLOCK.ASH_LEAVES, BLOCK.PINE_NEEDLES]);
const CLOUD_WORLD_REPEAT = 310;

export function skylightTransmission(blockId, definition = BLOCKS[blockId]) {
  if (!definition?.solid || definition.liquid) return 1;
  if (!definition.transparent) return 0;
  // Foliage casts a proper directional shadow, but it must not globally switch
  // off the sky/IBL as if the player had entered a stone room. Pine needles are
  // a little denser than broad ash leaves; glass and other transparent solids
  // retain their own stronger attenuation.
  if (blockId === BLOCK.ASH_LEAVES) return 0.88;
  if (blockId === BLOCK.PINE_NEEDLES) return 0.84;
  if (blockId === BLOCK.GLASS) return 0.76;
  return 0.7;
}

export function outdoorBounceIntensity(dayAmount, skyExposure, overcastAmount) {
  const day = THREE.MathUtils.clamp(Number(dayAmount) || 0, 0, 1);
  const sky = THREE.MathUtils.clamp(Number(skyExposure) || 0, 0, 1);
  const overcast = THREE.MathUtils.clamp(Number(overcastAmount) || 0, 0, 1);
  return (0.012 + day * 0.18) * (0.02 + sky * 0.98) * (1 - overcast * 0.38);
}

export function weatherLightingState(phase, overcastAmount = 0, rainIntensity = 0) {
  const normalizedPhase = String(phase || 'clear');
  const overcast = THREE.MathUtils.clamp(Number(overcastAmount) || 0, 0, 1);
  const rain = THREE.MathUtils.clamp(Number(rainIntensity) || 0, 0, 1);
  // The storm deck belongs to precipitation, not merely to a high cloud count.
  // Clearing keeps it locked only for the audible/visible rain tail; once the
  // final drops are gone the same phase becomes the smooth return to blue.
  const stormLocked = normalizedPhase === 'rain'
    || (normalizedPhase === 'clearing' && rain > 0.006);
  return {
    stormLocked,
    overcastTarget: stormLocked ? 1 : 0,
    stormAmount: overcast,
    sunVisibility: 1 - THREE.MathUtils.smoothstep(overcast, 0.38, 0.92),
  };
}

export function nearestPeriodicCloudCoordinate(worldCoordinate, focusCoordinate, repeat = CLOUD_WORLD_REPEAT) {
  const world = Number(worldCoordinate) || 0;
  const focus = Number(focusCoordinate) || 0;
  const safeRepeat = Math.max(1, Number(repeat) || CLOUD_WORLD_REPEAT);
  return world + Math.round((focus - world) / safeRepeat) * safeRepeat;
}

function makeAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    name: 'Worldloom atmosphere',
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    toneMapped: true,
    uniforms: {
      zenithColor: { value: new THREE.Color('#70bce8') },
      horizonColor: { value: new THREE.Color('#acd6df') },
      lowerColor: { value: new THREE.Color('#5b8794') },
      sunDirection: { value: new THREE.Vector3(0, 1, 0) },
      sunColor: { value: new THREE.Color('#fff1c2') },
      sunVisibility: { value: 1 },
      twilight: { value: 0 },
      dayAmount: { value: 1 },
      atmosphereDetail: { value: 0.72 },
    },
    vertexShader: `
      varying vec3 vSkyDirection;
      void main() {
        vSkyDirection = normalize(position);
        vec4 clipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = clipPosition.xyww;
      }
    `,
    fragmentShader: `
      uniform vec3 zenithColor;
      uniform vec3 horizonColor;
      uniform vec3 lowerColor;
      uniform vec3 sunDirection;
      uniform vec3 sunColor;
      uniform float sunVisibility;
      uniform float twilight;
      uniform float dayAmount;
      uniform float atmosphereDetail;
      varying vec3 vSkyDirection;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec3 direction = normalize(vSkyDirection);
        float height = direction.y;
        float upperBlend = smoothstep(-0.04, 0.78, height);
        float lowerBlend = smoothstep(-0.58, 0.02, height);
        vec3 sky = mix(lowerColor, horizonColor, lowerBlend);
        sky = mix(sky, zenithColor, upperBlend);

        float sunDot = max(dot(direction, normalize(sunDirection)), 0.0);
        float sunHalo = pow(sunDot, 18.0) * (0.16 + twilight * 0.28);
        float sunCore = pow(sunDot, 620.0) * 1.4;
        float horizonGlow = exp(-abs(height) * 9.0) * twilight * 0.28;
        sky += sunColor * (sunHalo + sunCore + horizonGlow) * sunVisibility;

        // Tiny ordered-looking noise prevents visible color bands in dark skies.
        float grain = hash21(gl_FragCoord.xy) - 0.5;
        sky += grain * mix(0.0012, 0.0042, atmosphereDetail);
        gl_FragColor = vec4(sky, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

function injectWorldPosition(shader, vertexPrelude = '') {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      '#include <common>\nuniform float worldloomTime;\nuniform float worldloomDayAmount;\nuniform float worldloomWindStrength;\nvarying vec3 vWorldloomPosition;',
    )
    .replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n${vertexPrelude}\nvWorldloomPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
    );
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
      uniform float worldloomTime;
      uniform float worldloomDayAmount;
      varying vec3 vWorldloomPosition;
      float worldloomHash(vec3 p) {
        p = fract(p * 0.1031);
        p += dot(p, p.yzx + 33.33);
        return fract((p.x + p.y) * p.z);
      }
    `,
  );
}

function enhanceTerrainMaterial(material, sharedUniforms) {
  if (!material || material.userData.worldloomEnhanced) return;
  material.userData.worldloomEnhanced = true;
  material.dithering = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.worldloomTime = sharedUniforms.time;
    shader.uniforms.worldloomDayAmount = sharedUniforms.dayAmount;
    shader.uniforms.worldloomWindStrength = sharedUniforms.windStrength;
    injectWorldPosition(shader, `
      vec2 worldloomAtlasCell = floor(uv * 7.0);
      float worldloomTile = worldloomAtlasCell.x + (6.0 - worldloomAtlasCell.y) * 7.0;
      float worldloomLeafMask = max(
        1.0 - step(0.45, abs(worldloomTile - 8.0)),
        1.0 - step(0.45, abs(worldloomTile - 38.0))
      );
      float worldloomPlantMask = max(
        1.0 - step(0.45, abs(worldloomTile - 24.0)),
        max(
          1.0 - step(0.45, abs(worldloomTile - 25.0)),
          max(1.0 - step(0.45, abs(worldloomTile - 34.0)), 1.0 - step(0.45, abs(worldloomTile - 39.0)))
        )
      );
      float worldloomPlantTip = smoothstep(0.08, 0.92, fract(uv.y * 7.0));
      vec3 worldloomWindPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      float worldloomWind = sin(worldloomTime * 1.45 + worldloomWindPosition.x * 0.37 + worldloomWindPosition.z * 0.29)
        + sin(worldloomTime * 2.1 + worldloomWindPosition.z * 0.53) * 0.38;
      transformed.x += worldloomWind * worldloomWindStrength * (worldloomLeafMask * 0.014 + worldloomPlantMask * worldloomPlantTip * 0.052);
      transformed.z += worldloomWind * worldloomWindStrength * (worldloomLeafMask * 0.008 + worldloomPlantMask * worldloomPlantTip * 0.024);
    `);
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
        float microVariation = worldloomHash(floor(vWorldloomPosition * 4.0));
        float broadVariation = worldloomHash(floor(vWorldloomPosition * 0.18));
        diffuseColor.rgb *= 0.965 + microVariation * 0.035 + broadVariation * 0.025;
      `,
    );
    material.userData.worldloomShader = shader;
  };
  material.customProgramCacheKey = () => 'worldloom-terrain-wind-v4';
  material.needsUpdate = true;
}

function enhanceWaterMaterial(material, sharedUniforms) {
  if (!material || material.userData.worldloomEnhanced) return;
  material.userData.worldloomEnhanced = true;
  material.dithering = true;
  material.opacity = 0.72;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.worldloomTime = sharedUniforms.time;
    shader.uniforms.worldloomDayAmount = sharedUniforms.dayAmount;
    injectWorldPosition(shader, `
      float worldloomWaveMask = step(0.55, objectNormal.y);
      float worldloomWave = sin((position.x + modelMatrix[3].x) * 0.73 + worldloomTime * 1.45)
        + sin((position.z + modelMatrix[3].z) * 0.91 - worldloomTime * 1.13);
      transformed.y += worldloomWave * 0.018 * worldloomWaveMask;
    `);
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
        float waterBands = sin(vWorldloomPosition.x * 1.1 + worldloomTime * 1.6)
          * sin(vWorldloomPosition.z * 0.83 - worldloomTime * 1.15);
        float waterGlint = pow(max(0.0, waterBands), 9.0);
        vec3 deepWater = vec3(0.055, 0.24, 0.40);
        vec3 daylightWater = vec3(0.22, 0.62, 0.78);
        vec3 waterTint = mix(deepWater, daylightWater, 0.32 + worldloomDayAmount * 0.50);
        diffuseColor.rgb = mix(diffuseColor.rgb * waterTint, diffuseColor.rgb, 0.38);
        diffuseColor.rgb += vec3(0.22, 0.48, 0.54) * waterGlint * (0.22 + worldloomDayAmount * 0.32);
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      `#include <normal_fragment_begin>
        float worldloomFresnel = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 3.0);
        diffuseColor.rgb += vec3(0.16, 0.34, 0.42) * worldloomFresnel * (0.35 + worldloomDayAmount * 0.30);
      `,
    );
    material.userData.worldloomShader = shader;
  };
  material.customProgramCacheKey = () => 'worldloom-animated-water-v2';
  material.needsUpdate = true;
}

function enhanceGlassMaterial(material, sharedUniforms) {
  if (!material || material.userData.worldloomEnhanced) return;
  material.userData.worldloomEnhanced = true;
  material.dithering = true;
  material.opacity = 0.54;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.worldloomTime = sharedUniforms.time;
    shader.uniforms.worldloomDayAmount = sharedUniforms.dayAmount;
    injectWorldPosition(shader);
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      `#include <normal_fragment_begin>
        float worldloomGlassEdge = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);
        diffuseColor.rgb += vec3(0.25, 0.55, 0.62) * worldloomGlassEdge * 0.3;
      `,
    );
    material.userData.worldloomShader = shader;
  };
  material.customProgramCacheKey = () => 'worldloom-riverglass-v2';
  material.needsUpdate = true;
}

function makeDiscTexture(inner, outer) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.35, inner);
  gradient.addColorStop(0.72, outer);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeWorldEnvironmentMap(renderer) {
  if (!renderer || typeof document === 'undefined' || !THREE.PMREMGenerator) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#173b66');
    gradient.addColorStop(0.36, '#78b9d6');
    gradient.addColorStop(0.51, '#d8d2b0');
    gradient.addColorStop(0.63, '#6b7555');
    gradient.addColorStop(1, '#182117');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const sunGlow = context.createRadialGradient(374, 86, 2, 374, 86, 56);
    sunGlow.addColorStop(0, 'rgba(255,250,220,1)');
    sunGlow.addColorStop(0.12, 'rgba(255,223,158,.85)');
    sunGlow.addColorStop(1, 'rgba(255,196,110,0)');
    context.fillStyle = sunGlow;
    context.fillRect(300, 12, 148, 148);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const generator = new THREE.PMREMGenerator(renderer);
    generator.compileEquirectangularShader();
    const target = generator.fromEquirectangular(texture);
    generator.dispose();
    texture.dispose();
    return target;
  } catch (error) {
    console.warn('Worldloom environment lighting fallback:', error);
    return null;
  }
}

const MAX_RAIN_DROPS = 2600;
const MAX_RAIN_SPLASHES = 160;

class RainField {
  constructor(scene) {
    this.scene = scene;
    this.world = null;
    this.enabled = true;
    this.density = GRAPHICS_PRESETS.balanced.rainDensity;
    this.reducedMotion = false;
    this.initializedCount = 0;
    this.sheltered = false;
    this.shelterTimer = 0;
    this.groundCache = new Map();
    this.windX = 4.8;
    this.windZ = 1.9;
    this.heads = new Float32Array(MAX_RAIN_DROPS * 3);
    this.grounds = new Float32Array(MAX_RAIN_DROPS);
    this.groundCellX = new Int32Array(MAX_RAIN_DROPS);
    this.groundCellZ = new Int32Array(MAX_RAIN_DROPS);
    this.speeds = new Float32Array(MAX_RAIN_DROPS);
    this.positions = new Float32Array(MAX_RAIN_DROPS * 6);
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(this.positions, 3);
    position.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', position);
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({
      color: 0xb9d7df,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: true,
      toneMapped: false,
      blending: THREE.NormalBlending,
    });
    this.streaks = new THREE.LineSegments(geometry, material);
    this.streaks.name = 'Wind swept rain';
    this.streaks.frustumCulled = false;
    this.streaks.renderOrder = 8;
    scene.add(this.streaks);

    this.splashPositions = new Float32Array(MAX_RAIN_SPLASHES * 3);
    this.splashLife = new Float32Array(MAX_RAIN_SPLASHES);
    this.splashCursor = 0;
    const splashGeometry = new THREE.BufferGeometry();
    const splashPosition = new THREE.BufferAttribute(this.splashPositions, 3);
    const splashLife = new THREE.BufferAttribute(this.splashLife, 1);
    splashPosition.setUsage(THREE.DynamicDrawUsage);
    splashLife.setUsage(THREE.DynamicDrawUsage);
    splashGeometry.setAttribute('position', splashPosition);
    splashGeometry.setAttribute('aLife', splashLife);
    const splashMaterial = new THREE.ShaderMaterial({
      name: 'Rain splash rings',
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      fog: false,
      uniforms: { opacity: { value: 0 } },
      vertexShader: `
        attribute float aLife;
        varying float vLife;
        void main() {
          vLife = aLife;
          vec4 view = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (4.0 + (1.0 - aLife) * 10.0) * min(2.2, 12.0 / max(2.0, -view.z));
          gl_Position = projectionMatrix * view;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying float vLife;
        void main() {
          float radius = length(gl_PointCoord - vec2(0.5));
          float ring = smoothstep(0.5, 0.38, radius) * smoothstep(0.22, 0.34, radius);
          float alpha = ring * sin(clamp(vLife, 0.0, 1.0) * 3.14159) * opacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(0.72, 0.88, 0.92, alpha);
        }
      `,
    });
    this.splashes = new THREE.Points(splashGeometry, splashMaterial);
    this.splashes.name = 'Rain ground splashes';
    this.splashes.frustumCulled = false;
    this.splashes.renderOrder = 9;
    scene.add(this.splashes);
  }

  setWorld(world) {
    this.world = world || null;
    this.initializedCount = 0;
    this.groundCache.clear();
    if (!world) {
      this.streaks.visible = false;
      this.splashes.visible = false;
    }
  }

  setQuality(profile, effectsEnabled = true, reducedMotion = false) {
    this.density = Number(profile?.rainDensity) || GRAPHICS_PRESETS.balanced.rainDensity;
    this.enabled = effectsEnabled !== false;
    this.reducedMotion = Boolean(reducedMotion);
  }

  _groundAt(x, z, fallback, maxY = null) {
    if (!this.world?.getBlock) return fallback;
    const blockX = Math.floor(x);
    const blockZ = Math.floor(z);
    const key = `${blockX},${blockZ}`;
    const now = performance.now();
    const worldHeight = Number(this.world.worldHeight) || 96;
    const scanTop = Number.isFinite(maxY)
      ? Math.max(0, Math.min(worldHeight - 1, Math.ceil(maxY)))
      : worldHeight - 1;
    const cached = this.groundCache.get(key);
    if (cached && cached.expires > now && cached.scanTop >= scanTop && cached.height <= scanTop + 1.05) {
      return cached.height;
    }
    let height = Number(this.world.terrainHeight?.(blockX, blockZ)) + 1.03;
    for (let y = scanTop; y >= 0; y--) {
      const id = this.world.getBlock(blockX, y, blockZ);
      const definition = BLOCKS[id];
      if (!definition?.solid && !definition?.liquid && !definition?.hazard) continue;
      const liquidSurface = definition.liquid ? this.world.getFluidSurfaceY?.(blockX, y, blockZ) : null;
      height = (liquidSurface ?? (y + blockShapeHeight(id))) + 0.025;
      break;
    }
    if (this.groundCache.size > 2048) this.groundCache.delete(this.groundCache.keys().next().value);
    this.groundCache.set(key, { height, scanTop, expires: now + 750 });
    return Number.isFinite(height) ? height : fallback;
  }

  _spawn(index, focus, fromTop = true) {
    const offset = index * 3;
    const radius = this.reducedMotion ? 15 : 23;
    const x = focus.x + (Math.random() * 2 - 1) * radius;
    const z = focus.z + (Math.random() * 2 - 1) * radius;
    const ground = this._groundAt(x, z, focus.y - 3);
    this.heads[offset] = x;
    this.heads[offset + 1] = fromTop ? Math.max(focus.y + 12, ground + 12) + Math.random() * 22 : ground + Math.random() * 28;
    this.heads[offset + 2] = z;
    this.grounds[index] = ground;
    this.groundCellX[index] = Math.floor(x);
    this.groundCellZ[index] = Math.floor(z);
    this.speeds[index] = 19 + Math.random() * 12;
  }

  _checkShelter(focus) {
    if (!this.world?.getBlock) return false;
    const x = Math.floor(focus.x);
    const z = Math.floor(focus.z);
    const startY = Math.max(0, Math.floor(focus.y + 1.8));
    const endY = Number(this.world.worldHeight) || 128;
    for (let y = startY; y < endY; y++) {
      const id = this.world.getBlock(x, y, z);
      if (BLOCKS[id]?.solid) return true;
    }
    return false;
  }

  _splash(x, y, z) {
    if (Math.random() > (this.reducedMotion ? 0.05 : 0.17)) return;
    const index = this.splashCursor++ % MAX_RAIN_SPLASHES;
    const offset = index * 3;
    this.splashPositions[offset] = x;
    this.splashPositions[offset + 1] = y + 0.025;
    this.splashPositions[offset + 2] = z;
    this.splashLife[index] = 1;
  }

  update(dt, focus, intensity) {
    const visibleIntensity = this.enabled && this.world ? clamp(intensity, 0, 1) : 0;
    this.shelterTimer -= dt;
    if (this.shelterTimer <= 0) {
      this.shelterTimer = 0.42;
      this.sheltered = this._checkShelter(focus);
    }
    // Keep precipitation outside a roof visible from beneath it. Per-column
    // ground probing stops each streak on the actual roof/leaf/water surface;
    // deep-cave rain remains naturally occluded by terrain.
    const raining = visibleIntensity > 0.012;
    this.streaks.visible = raining;
    this.splashes.visible = raining;
    if (!raining) return;

    const density = this.density * (this.reducedMotion ? 0.62 : 1);
    const active = Math.min(MAX_RAIN_DROPS, Math.max(90, Math.round(1720 * density * visibleIntensity)));
    if (active > this.initializedCount) {
      for (let index = this.initializedCount; index < active; index++) this._spawn(index, focus, false);
      this.initializedCount = active;
    }
    const gust = Math.sin(performance.now() * 0.00023) * 1.1;
    const windX = this.windX + gust;
    const windZ = this.windZ + gust * 0.28;
    for (let index = 0; index < active; index++) {
      const headOffset = index * 3;
      const vertexOffset = index * 6;
      this.heads[headOffset] += windX * dt;
      this.heads[headOffset + 1] -= this.speeds[index] * dt;
      this.heads[headOffset + 2] += windZ * dt;
      const cellX = Math.floor(this.heads[headOffset]);
      const cellZ = Math.floor(this.heads[headOffset + 2]);
      if (cellX !== this.groundCellX[index] || cellZ !== this.groundCellZ[index]) {
        this.grounds[index] = this._groundAt(
          this.heads[headOffset],
          this.heads[headOffset + 2],
          this.grounds[index],
          this.heads[headOffset + 1],
        );
        this.groundCellX[index] = cellX;
        this.groundCellZ[index] = cellZ;
      }
      if (this.heads[headOffset + 1] <= this.grounds[index]
        || Math.abs(this.heads[headOffset] - focus.x) > 27
        || Math.abs(this.heads[headOffset + 2] - focus.z) > 27) {
        this._splash(this.heads[headOffset], this.grounds[index], this.heads[headOffset + 2]);
        this._spawn(index, focus, true);
      }
      const length = 0.58 + this.speeds[index] * 0.026;
      this.positions[vertexOffset] = this.heads[headOffset];
      this.positions[vertexOffset + 1] = this.heads[headOffset + 1];
      this.positions[vertexOffset + 2] = this.heads[headOffset + 2];
      this.positions[vertexOffset + 3] = this.heads[headOffset] - windX * 0.035;
      this.positions[vertexOffset + 4] = this.heads[headOffset + 1] + length;
      this.positions[vertexOffset + 5] = this.heads[headOffset + 2] - windZ * 0.035;
    }
    for (let index = 0; index < MAX_RAIN_SPLASHES; index++) {
      this.splashLife[index] = Math.max(0, this.splashLife[index] - dt * 2.4);
    }
    this.streaks.geometry.setDrawRange(0, active * 2);
    this.streaks.geometry.attributes.position.needsUpdate = true;
    this.streaks.material.opacity = 0.16 + visibleIntensity * 0.42;
    this.splashes.geometry.attributes.position.needsUpdate = true;
    this.splashes.geometry.attributes.aLife.needsUpdate = true;
    this.splashes.material.uniforms.opacity.value = 0.26 + visibleIntensity * 0.42;
  }
}

const MAX_FALLING_LEAVES = 180;

function makeLeafTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const context = canvas.getContext('2d');
  context.translate(16, 16);
  context.rotate(-0.55);
  const gradient = context.createLinearGradient(-9, 0, 9, 0);
  gradient.addColorStop(0, '#8a6d32');
  gradient.addColorStop(0.48, '#d8b24f');
  gradient.addColorStop(1, '#567a39');
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(-11, 0);
  context.quadraticCurveTo(0, -7, 11, 0);
  context.quadraticCurveTo(0, 7, -11, 0);
  context.fill();
  context.strokeStyle = 'rgba(244,225,151,.72)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(-9, 0);
  context.lineTo(9, 0);
  context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

class FallingLeaves {
  constructor(scene) {
    this.world = null;
    this.enabled = true;
    this.reducedMotion = false;
    this.spawnTimer = 0;
    this.cursor = 0;
    this.positions = new Float32Array(MAX_FALLING_LEAVES * 3);
    this.velocities = new Float32Array(MAX_FALLING_LEAVES * 3);
    this.life = new Float32Array(MAX_FALLING_LEAVES);
    this.phase = new Float32Array(MAX_FALLING_LEAVES);
    this.positions.fill(-9999);
    const geometry = new THREE.BufferGeometry();
    const attribute = new THREE.BufferAttribute(this.positions, 3);
    attribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', attribute);
    const material = new THREE.PointsMaterial({
      map: makeLeafTexture(),
      color: 0xffffff,
      size: 0.23,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.82,
      alphaTest: 0.08,
      depthWrite: false,
      fog: true,
    });
    this.points = new THREE.Points(geometry, material);
    this.points.name = 'Falling leaves near trees';
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    scene.add(this.points);
  }

  setWorld(world) {
    this.world = world || null;
    this.points.visible = Boolean(world);
    if (!world) {
      this.life.fill(0);
      this.positions.fill(-9999);
      this.points.geometry.attributes.position.needsUpdate = true;
    }
  }

  setQuality(profile, enabled = true, reducedMotion = false) {
    this.enabled = enabled !== false && Number(profile?.cloudAmount || 0) >= 0.2;
    this.reducedMotion = Boolean(reducedMotion);
    this.points.material.size = this.reducedMotion ? 0.18 : 0.23;
  }

  _spawn(x, y, z) {
    const index = this.cursor++ % MAX_FALLING_LEAVES;
    const offset = index * 3;
    this.positions[offset] = x + Math.random();
    this.positions[offset + 1] = y + 0.2 + Math.random() * 0.8;
    this.positions[offset + 2] = z + Math.random();
    this.velocities[offset] = 0.08 + Math.random() * 0.18;
    this.velocities[offset + 1] = -(0.35 + Math.random() * 0.5);
    this.velocities[offset + 2] = (Math.random() - 0.5) * 0.16;
    this.life[index] = 5 + Math.random() * 7;
    this.phase[index] = Math.random() * Math.PI * 2;
  }

  _seedNearTrees(focus) {
    if (!this.world?.getBlock) return;
    const attempts = this.reducedMotion ? 5 : 13;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 14;
      const x = Math.floor(focus.x + Math.cos(angle) * radius);
      const z = Math.floor(focus.z + Math.sin(angle) * radius);
      const ground = Math.floor(this.world.terrainHeight?.(x, z) ?? focus.y - 1);
      for (let y = ground + 3; y <= Math.min(ground + 10, Number(this.world.worldHeight) - 1); y++) {
        if (this.world.getBlock(x, y, z) !== BLOCK.ASH_LEAVES) continue;
        this._spawn(x, y - Math.random() * 1.4, z);
        if (!this.reducedMotion && Math.random() > 0.68) this._spawn(x, y, z);
        break;
      }
    }
  }

  update(dt, focus, windStrength = 1, rainIntensity = 0) {
    this.points.visible = Boolean(this.enabled && this.world);
    if (!this.points.visible) return;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = (this.reducedMotion ? 1.3 : 0.58) + rainIntensity * 0.4;
      this._seedNearTrees(focus);
    }
    for (let index = 0; index < MAX_FALLING_LEAVES; index++) {
      if (this.life[index] <= 0) continue;
      const offset = index * 3;
      this.life[index] -= dt;
      this.phase[index] += dt * (1.4 + windStrength);
      this.positions[offset] += (this.velocities[offset] + Math.sin(this.phase[index]) * 0.24 * windStrength) * dt;
      this.positions[offset + 1] += this.velocities[offset + 1] * dt;
      this.positions[offset + 2] += (this.velocities[offset + 2] + Math.cos(this.phase[index] * 0.73) * 0.14 * windStrength) * dt;
      const ground = this.world.terrainHeight?.(this.positions[offset], this.positions[offset + 2]) ?? -100;
      if (this.life[index] <= 0 || this.positions[offset + 1] <= ground + 1.02) {
        this.life[index] = 0;
        this.positions[offset + 1] = -9999;
      }
    }
    this.points.material.opacity = 0.8 * (1 - rainIntensity * 0.4);
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

class LightningField {
  constructor(scene) {
    this.scene = scene;
    this.world = null;
    this.timer = 10;
    this.age = 10;
    this.duration = 0.24;
    this.intensity = 0;
    this.distance = 0;
    this.reducedMotion = false;
    this.enabled = true;
    this.randomState = 0x6d2b79f5;
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.LineBasicMaterial({
      color: 0xe8f2ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
      fog: true,
    });
    this.bolt = new THREE.LineSegments(this.geometry, this.material);
    this.bolt.name = 'Procedural storm lightning';
    this.bolt.visible = false;
    this.bolt.renderOrder = 20;
    this.flash = new THREE.SpotLight(0xdcecff, 0, 210, Math.PI * 0.42, 0.48, 1.35);
    this.flash.name = 'Lightning flash';
    this.flash.castShadow = true;
    this.flash.shadow.mapSize.set(512, 512);
    this.flash.shadow.camera.near = 1;
    this.flash.shadow.camera.far = 210;
    this.flash.shadow.bias = -0.0015;
    this.flash.shadow.normalBias = 0.035;
    this.flash.target.name = 'Lightning flash target';
    scene.add(this.bolt, this.flash, this.flash.target);
  }

  setWorld(world) {
    this.world = world || null;
    this.randomState = ((Number(world?.seed) >>> 0) ^ 0xa511e9b3) || 0x6d2b79f5;
    this.timer = 7 + this._random() * 14;
    this.age = 10;
    this.bolt.visible = false;
    this.flash.intensity = 0;
  }

  setQuality(enabled, reducedMotion) {
    this.enabled = Boolean(enabled);
    this.reducedMotion = Boolean(reducedMotion);
    this.flash.castShadow = this.enabled && !this.reducedMotion;
    if (!this.enabled) {
      this.bolt.visible = false;
      this.flash.intensity = 0;
    }
  }

  _random() {
    this.randomState = (this.randomState + 0x6d2b79f5) >>> 0;
    let value = this.randomState;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  _strike(focus, stormIntensity) {
    let angle = 0;
    let distance = 0;
    let targetX = focus.x;
    let targetZ = focus.z;
    let targetReady = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      angle = this._random() * Math.PI * 2;
      distance = 28 + this._random() * 76;
      targetX = focus.x + Math.cos(angle) * distance;
      targetZ = focus.z + Math.sin(angle) * distance;
      if (this.world?.isPositionReady?.(targetX, targetZ)) {
        targetReady = true;
        break;
      }
    }
    if (!targetReady) {
      for (const fallbackDistance of [22, 14, 7, 0]) {
        angle = this._random() * Math.PI * 2;
        distance = fallbackDistance;
        targetX = focus.x + Math.cos(angle) * distance;
        targetZ = focus.z + Math.sin(angle) * distance;
        if (this.world?.isPositionReady?.(targetX, targetZ)) {
          targetReady = true;
          break;
        }
      }
    }
    if (!targetReady) return null;
    let targetY = (Number(this.world?.terrainHeight?.(targetX, targetZ)) || 0) + 1;
    const blockX = Math.floor(targetX);
    const blockZ = Math.floor(targetZ);
    for (let y = (Number(this.world.worldHeight) || 96) - 1; y >= 0; y--) {
      const id = this.world.getBlock(blockX, y, blockZ);
      const definition = BLOCKS[id];
      if (definition?.liquid) {
        targetY = this.world.getFluidSurfaceY?.(blockX, y, blockZ) ?? y + 0.92;
        break;
      }
      if (definition?.solid) {
        targetY = y + blockShapeHeight(id);
        break;
      }
    }
    const cloudY = Math.max(targetY + 30, 76 + this._random() * 22);
    const vertices = [];
    let previous = new THREE.Vector3(targetX + (this._random() - 0.5) * 5, cloudY, targetZ + (this._random() - 0.5) * 5);
    const segments = 16;
    for (let index = 1; index <= segments; index++) {
      const amount = index / segments;
      const spread = (1 - amount) * 6.5;
      const next = new THREE.Vector3(
        THREE.MathUtils.lerp(previous.x, targetX, 0.32) + (this._random() - 0.5) * spread,
        THREE.MathUtils.lerp(cloudY, targetY, amount),
        THREE.MathUtils.lerp(previous.z, targetZ, 0.32) + (this._random() - 0.5) * spread,
      );
      vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
      if (index > 3 && index < segments - 2 && this._random() < 0.3) {
        const branchLength = 3 + this._random() * 8;
        vertices.push(
          next.x, next.y, next.z,
          next.x + (this._random() - 0.5) * branchLength,
          next.y - 2 - this._random() * 5,
          next.z + (this._random() - 0.5) * branchLength,
        );
      }
      previous = next;
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.computeBoundingSphere();
    this.age = 0;
    this.intensity = clamp(stormIntensity, 0.35, 1);
    this.distance = distance;
    this.bolt.visible = true;
    this.flash.position.set(targetX, targetY + 38, targetZ);
    this.flash.target.position.set(targetX, targetY, targetZ);
    this.flash.target.updateMatrixWorld();
    return { distance, intensity: this.intensity };
  }

  update(dt, focus, rainIntensity, cloudCover, localCoverage, sheltered = false) {
    if (!this.enabled || !this.world) return null;
    if (dt <= 0) {
      this.age = this.duration + 1;
      this.bolt.visible = false;
      this.flash.intensity = 0;
      return null;
    }
    const stormReady = rainIntensity > 0.52 && cloudCover > 0.76 && localCoverage > 0.22;
    if (stormReady) this.timer -= dt;
    else this.timer = Math.max(this.timer, 3.5);
    let event = null;
    if (stormReady && this.timer <= 0) {
      event = this._strike(focus, rainIntensity);
      this.timer = 7 + this._random() * 19;
    }
    this.age += dt;
    if (this.age <= this.duration) {
      const firstPulse = Math.exp(-Math.pow((this.age - 0.035) / 0.027, 2));
      const secondPulse = Math.exp(-Math.pow((this.age - 0.13) / 0.045, 2)) * 0.48;
      const pulse = Math.min(1, firstPulse + secondPulse);
      const safePulse = this.reducedMotion ? pulse * 0.28 : pulse;
      this.material.opacity = safePulse;
      // The sky flash is occluded while underground or beneath a roof, avoiding
      // the old point-light leak through cave walls.
      this.flash.intensity = sheltered ? 0 : safePulse * this.intensity * (this.reducedMotion ? 38 : 180);
    } else {
      this.bolt.visible = false;
      this.flash.intensity = 0;
    }
    return event;
  }
}

export class Environment {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.time = 0.31;
    this.cycleSeconds = 1200;
    this.dayAmount = 1;
    this.rainIntensity = 0;
    this.rainTarget = 0;
    this.cloudCover = 0.34;
    this.cloudCoverTarget = 0.34;
    this.overcastAmount = 0;
    this.localCloudCoverage = 0;
    this.localCloudCount = 0;
    this.nearestCloudDistance = Number.POSITIVE_INFINITY;
    this.weatherPhase = 'clear';
    this.stormIntensity = 0.72;
    this.weatherBuildAge = 0;
    this.pendingStormDuration = 100;
    this.weatherTimer = 6 + Math.random() * 14;
    this.weatherWorld = null;
    this.onLightning = null;
    this.weatherEnabled = true;
    this.graphicsQuality = 'balanced';
    this.graphicsProfile = GRAPHICS_PRESETS.balanced;
    this.localLightLimit = this.graphicsProfile.localLights;
    this.localShadowLightLimit = 0;
    this.shadowExtent = 46;
    this.skyExposure = 1;
    this.skyExposureTarget = 1;
    this.skyExposureTimer = 0;
    this.fogClarity = 0;
    this.skyColor = new THREE.Color();
    this.fogColor = new THREE.Color();
    this.daySky = new THREE.Color('#70bce8');
    this.dawnSky = new THREE.Color('#e79b72');
    this.nightSky = new THREE.Color('#08152c');
    this.dayFog = new THREE.Color('#acd6df');
    this.dawnFog = new THREE.Color('#d89a7c');
    this.nightFog = new THREE.Color('#101b32');
    this._colorA = new THREE.Color();
    this._colorB = new THREE.Color();
    this._sunDawn = new THREE.Color('#ffd0a0');
    this._sunDay = new THREE.Color('#fff5d6');
    this._cloudNight = new THREE.Color('#68748d');
    this._cloudDay = new THREE.Color('#fff7df');
    this._cloudDawn = new THREE.Color('#f3a37e');
    this._stormSky = new THREE.Color('#354b5d');
    this._stormFog = new THREE.Color('#5d7178');
    this._sunDirection = new THREE.Vector3();
    this._shadowFocus = new THREE.Vector3();
    this.graphicsUniforms = {
      time: { value: 0 },
      dayAmount: { value: 1 },
      windStrength: { value: 1 },
    };

    scene.background = this.skyColor;
    scene.fog = new THREE.Fog(this.fogColor, 25, 112);
    this.environmentTarget = makeWorldEnvironmentMap(renderer);
    if (this.environmentTarget?.texture) {
      scene.environment = this.environmentTarget.texture;
      scene.environmentIntensity = 0.42;
    }

    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(176, 32, 18),
      makeAtmosphereMaterial(),
    );
    this.atmosphere.name = 'Gradient sky atmosphere';
    this.atmosphere.frustumCulled = false;
    this.atmosphere.renderOrder = -1000;
    scene.add(this.atmosphere);

    this.hemisphere = new THREE.HemisphereLight(0xbfe8ff, 0x334124, 1.55);
    scene.add(this.hemisphere);
    // Soft sky bounce keeps downward-facing leaf and bark faces readable under
    // a canopy. Its intensity follows measured sky access, so sealed rooms and
    // deep caves still fall to black while outdoor shade retains natural detail.
    this.bounceLight = new THREE.AmbientLight(0xc4d5ca, 0.12);
    this.bounceLight.name = 'Diffuse outdoor sky bounce';
    scene.add(this.bounceLight);
    this.sunLight = new THREE.DirectionalLight(0xfff3d1, 2.45);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.left = -38;
    this.sunLight.shadow.camera.right = 38;
    this.sunLight.shadow.camera.top = 38;
    this.sunLight.shadow.camera.bottom = -38;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 140;
    this.sunLight.shadow.bias = -0.00035;
    this.sunLight.shadow.normalBias = 0.045;
    this.sunLight.shadow.camera.updateProjectionMatrix();
    scene.add(this.sunLight, this.sunLight.target);
    this.moonLight = new THREE.DirectionalLight(0x9dbdff, 0.16);
    this.moonLight.castShadow = false;
    scene.add(this.moonLight, this.moonLight.target);

    if (renderer?.shadowMap && THREE.PCFShadowMap != null) {
      renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    const sunMat = new THREE.SpriteMaterial({
      map: makeDiscTexture('rgba(255,252,220,1)', 'rgba(255,194,94,0.25)'),
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending,
    });
    this.sun = new THREE.Sprite(sunMat);
    this.sun.scale.set(13, 13, 1);
    scene.add(this.sun);

    const moonMat = new THREE.SpriteMaterial({
      map: makeDiscTexture('rgba(222,235,255,0.95)', 'rgba(102,150,255,0.16)'),
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending,
    });
    this.moon = new THREE.Sprite(moonMat);
    this.moon.scale.set(8, 8, 1);
    scene.add(this.moon);

    this.stars = this._createStars();
    scene.add(this.stars);
    this.clouds = this._createClouds();
    scene.add(this.clouds);
    this.rain = new RainField(scene);
    this.fallingLeaves = new FallingLeaves(scene);
    this.lightning = new LightningField(scene);
    this.pondEcology = new PondEcologyField(scene, this.graphicsUniforms);
    this.hangingLeaves = new HangingLeavesField(scene, this.graphicsUniforms);
    this.redFlowers = new RedFlowerField(scene);
    this.localLights = Array.from({ length: 8 }, (_, index) => {
      const light = new THREE.PointLight(0xffb45f, 0, 10, 2);
      light.name = `Nearby voxel light ${index + 1}`;
      light.visible = false;
      light.castShadow = false;
      light.userData.baseIntensity = 0;
      light.shadow.bias = -0.00035;
      light.shadow.normalBias = 0.035;
      light.shadow.camera.near = 0.08;
      scene.add(light);
      return light;
    });
    this.applyGraphicsSettings({ graphicsQuality: 'balanced' });
  }

  setWeatherContext(world) {
    this.weatherWorld = world || null;
    this.rain.setWorld(this.weatherWorld);
    this.fallingLeaves.setWorld(this.weatherWorld);
    this.lightning.setWorld(this.weatherWorld);
    this.pondEcology.setWorld(this.weatherWorld);
    this.hangingLeaves.setWorld(this.weatherWorld);
    this.redFlowers.setWorld(this.weatherWorld);
  }

  preparePondEcology() {
    return this.pondEcology.prepare();
  }

  prepareHangingLeaves() {
    return this.hangingLeaves.prepare();
  }

  prepareRedFlowers() {
    return this.redFlowers.prepare();
  }

  forceWeather(kind = 'rain', intensity = 0.78, duration = 120) {
    const raining = kind === 'rain';
    // Forced storms still obey the visual contract: visible cloud banks gather
    // first, then precipitation switches on the contiguous grey storm deck.
    this.weatherPhase = raining
      ? 'building'
      : this.rainIntensity > 0.004 || this.overcastAmount > 0.015 ? 'clearing' : 'clear';
    // A clearing storm keeps its cloud deck until precipitation has audibly
    // and visibly faded. This avoids the old blue-sky cut caused by clouds
    // dispersing faster than the rain recording's gain envelope.
    this.cloudCoverTarget = raining ? 0.96 : this.weatherPhase === 'clearing' ? 0.9 : 0.32;
    this.stormIntensity = raining ? clamp(intensity, 0, 1) : this.stormIntensity;
    this.pendingStormDuration = Math.max(12, Number(duration) || 120);
    this.weatherBuildAge = 0;
    this.rainTarget = 0;
    this.weatherTimer = raining ? 12 : Math.max(1, Number(duration) || 120);
  }

  getWeatherState() {
    return {
      kind: this.rainIntensity > 0.06 ? 'rain' : 'clear',
      intensity: this.rainIntensity,
      sheltered: this.rain.sheltered,
      cloudCover: this.cloudCover,
      overcastAmount: this.overcastAmount,
      localCloudCoverage: this.localCloudCoverage,
      localCloudCount: this.localCloudCount,
      skyExposure: this.skyExposure,
    };
  }

  applyGraphicsSettings(settings = {}) {
    const quality = Object.hasOwn(GRAPHICS_PRESETS, settings.graphicsQuality)
      ? settings.graphicsQuality
      : this.graphicsQuality;
    const profile = GRAPHICS_PRESETS[quality] || GRAPHICS_PRESETS.balanced;
    this.graphicsQuality = quality;
    this.graphicsProfile = profile;
    this.weatherEnabled = settings.weatherEffects !== false;
    this.localLightLimit = profile.localLights;
    this.localShadowLightLimit = Number(profile.localShadowLights) || 0;
    this.shadowExtent = Number(profile.shadowExtent) || 46;
    this.rain.setQuality(profile, this.weatherEnabled, settings.reducedMotion);
    this.fallingLeaves.setQuality(profile, true, settings.reducedMotion);
    this.lightning.setQuality(this.weatherEnabled && profile.atmosphereDetail >= 0.6, settings.reducedMotion);
    this.pondEcology.setQuality(profile, settings.reducedMotion);
    this.hangingLeaves.setQuality(profile, settings.reducedMotion);
    this.graphicsUniforms.windStrength.value = settings.reducedMotion ? 0.22 : 1;

    if (this.renderer?.shadowMap) {
      this.renderer.shadowMap.enabled = Boolean(profile.shadows);
      if (THREE.PCFShadowMap != null) this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }
    this.sunLight.castShadow = Boolean(profile.shadows);
    this.sunLight.shadow.camera.left = -this.shadowExtent;
    this.sunLight.shadow.camera.right = this.shadowExtent;
    this.sunLight.shadow.camera.top = this.shadowExtent;
    this.sunLight.shadow.camera.bottom = -this.shadowExtent;
    this.sunLight.shadow.camera.far = Math.max(140, this.shadowExtent * 2.8);
    this.sunLight.shadow.radius = Number(profile.shadowRadius) || 1;
    this.sunLight.shadow.camera.updateProjectionMatrix();
    if (this.sunLight.shadow.mapSize.x !== profile.shadowSize) {
      this.sunLight.shadow.mapSize.set(profile.shadowSize, profile.shadowSize);
      this.sunLight.shadow.map?.dispose?.();
      this.sunLight.shadow.map = null;
      this.sunLight.shadow.needsUpdate = true;
    }
    const cloudCount = Math.max(2, Math.round(this.clouds.children.length * this.cloudCover * Math.min(1, profile.cloudAmount + 0.25)));
    this.clouds.children.forEach((cloud, index) => {
      cloud.userData.targetVisible = index < cloudCount;
    });
    this.atmosphere.material.uniforms.atmosphereDetail.value = profile.atmosphereDetail;
    if (this.renderer) this.renderer.toneMappingExposure = quality === 'low' ? 0.96 : quality === 'ultra' ? 1.04 : 1.01;
    this.localLights.forEach((light, index) => {
      if (index >= this.localLightLimit) light.visible = false;
      light.castShadow = Boolean(profile.shadows && index < this.localShadowLightLimit);
      const localShadowSize = Number(profile.localShadowSize) || 256;
      if (light.shadow.mapSize.x !== localShadowSize) {
        light.shadow.mapSize.set(localShadowSize, localShadowSize);
        light.shadow.map?.dispose?.();
        light.shadow.map = null;
        light.shadow.needsUpdate = true;
      }
    });
  }

  /**
   * Applies the optional shader pass to a newly-created World. Keeping this as
   * an explicit hook means worlds can still be constructed in headless tests.
   */
  enhanceWorldMaterials(world) {
    if (!world) return;
    enhanceTerrainMaterial(world.opaqueMaterial, this.graphicsUniforms);
    enhanceGlassMaterial(world.glassMaterial, this.graphicsUniforms);
    enhanceWaterMaterial(world.waterMaterial, this.graphicsUniforms);
    if (world.glowMaterial) {
      world.glowMaterial.dithering = true;
      world.glowMaterial.toneMapped = true;
      world.glowMaterial.needsUpdate = true;
    }
    const texture = world.opaqueMaterial?.map;
    if (texture?.isTexture && this.renderer?.capabilities?.getMaxAnisotropy) {
      texture.anisotropy = Math.min(this.graphicsProfile.anisotropy, this.renderer.capabilities.getMaxAnisotropy());
      texture.needsUpdate = true;
    }
  }

  _createStars() {
    const positions = [];
    let state = 0x7f4a7c15;
    const random = () => {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
    for (let i = 0; i < 520; i++) {
      const theta = random() * Math.PI * 2;
      const y = 0.15 + random() * 0.85;
      const radius = Math.sqrt(1 - y * y);
      positions.push(Math.cos(theta) * radius * 180, y * 180, Math.sin(theta) * radius * 180);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xcde4ff,
      size: 0.62,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    });
    return new THREE.Points(geometry, material);
  }

  _createClouds() {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xf4f1e5, transparent: true, opacity: 0.68, depthWrite: false });
    let state = 0x12da93f;
    const random = () => {
      state = Math.imul(state ^ (state >>> 15), 1 | state);
      state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
      return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < 22; i++) {
      const cloud = new THREE.Group();
      const pieces = 3 + Math.floor(random() * 4);
      for (let p = 0; p < pieces; p++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (p - (pieces - 1) * 0.5) * 5 + (random() - 0.5) * 2,
          random() * 1.4,
          (random() - 0.5) * 5,
        );
        mesh.scale.set(8 + random() * 8, 1.1 + random() * 1.4, 4 + random() * 5);
        cloud.add(mesh);
      }
      const angle = random() * Math.PI * 2;
      const radius = 25 + random() * 110;
      cloud.position.set(Math.cos(angle) * radius, 78 + random() * 22, Math.sin(angle) * radius);
      cloud.userData.speed = 0.35 + random() * 0.45;
      // Canonical coordinates never depend on the camera/player. Rendering
      // selects the nearest periodic world-space copy only when a bank reaches
      // the far horizon, preserving an effectively unbounded cloud field.
      cloud.userData.worldX = cloud.position.x;
      cloud.userData.worldZ = cloud.position.z;
      cloud.userData.centerOffsetX = 0;
      cloud.userData.coverageRadius = 18 + pieces * 3.4;
      cloud.userData.appearance = i < 3 ? 1 : 0;
      cloud.userData.targetVisible = i < 3;
      cloud.scale.setScalar(Math.max(0.001, cloud.userData.appearance));
      group.add(cloud);
    }
    group.renderOrder = -1;
    return group;
  }

  _updateCloudField(dt, focus) {
    const cloudRange = 155;
    const ranked = [];
    this.clouds.children.forEach((cloud, index) => {
      const canonicalX = Number.isFinite(cloud.userData.worldX)
        ? cloud.userData.worldX
        : cloud.position.x;
      const canonicalZ = Number.isFinite(cloud.userData.worldZ)
        ? cloud.userData.worldZ
        : cloud.position.z;
      cloud.userData.worldX = canonicalX + dt * cloud.userData.speed;
      cloud.userData.worldZ = canonicalZ;
      cloud.position.x = nearestPeriodicCloudCoordinate(
        cloud.userData.worldX,
        focus.x,
        cloudRange * 2,
      );
      cloud.position.z = nearestPeriodicCloudCoordinate(
        cloud.userData.worldZ,
        focus.z,
        cloudRange * 2,
      );
      const cloudX = cloud.position.x + cloud.userData.centerOffsetX;
      const distance = Math.hypot(cloudX - focus.x, cloud.position.z - focus.z);
      ranked.push({ cloud, index, distance });
    });
    const visibleClouds = Math.max(2, Math.round(
      this.clouds.children.length * this.cloudCover * Math.min(1, this.graphicsProfile.cloudAmount + 0.25),
    ));
    // Storm fronts prioritize physically nearby cloud banks. Their independent
    // world positions and wind motion do not follow the player, but this makes
    // the visible buildup happen overhead before rain is permitted.
    if (this.weatherPhase === 'building' || this.weatherPhase === 'rain' || this.weatherPhase === 'clearing') {
      ranked.sort((a, b) => a.distance - b.distance);
    }
    const selected = new Set(ranked.slice(0, visibleClouds).map(({ cloud }) => cloud));
    for (const { cloud } of ranked) {
      const target = selected.has(cloud) ? 1 : 0;
      cloud.userData.targetVisible = target > 0;
      const response = target > cloud.userData.appearance ? 2.6 : 4.8;
      cloud.userData.appearance += (target - cloud.userData.appearance) * (1 - Math.exp(-dt / response));
      const appearance = clamp(cloud.userData.appearance, 0, 1);
      cloud.visible = appearance > 0.018;
      cloud.scale.set(
        Math.max(0.001, appearance),
        Math.max(0.001, 0.32 + appearance * 0.68),
        Math.max(0.001, appearance),
      );
    }

    const localRadius = 105;
    let weightedCoverage = 0;
    let nearbyCount = 0;
    let nearest = Number.POSITIVE_INFINITY;
    ranked.forEach(({ cloud, distance }) => {
      const appearance = Number(cloud.userData.appearance) || 0;
      if (!cloud.visible || appearance < 0.12) return;
      if (distance >= localRadius) return;
      nearest = Math.min(nearest, distance);
      if (distance < 88 && appearance > 0.55) nearbyCount++;
      weightedCoverage += (1 - distance / localRadius)
        * (Number(cloud.userData.coverageRadius) || 25) / 25
        * appearance;
    });
    const overheadPermission = Number.isFinite(nearest)
      ? 1 - THREE.MathUtils.smoothstep(nearest, 34, 78)
      : 0;
    const areaCoverage = clamp(weightedCoverage / 2.1, 0, 1);
    // Once a verified local front has become a continuous overcast deck, the
    // low-poly cloud banks are depth cues rather than the sole source of cloud
    // coverage. Do not let one bank crossing an arbitrary radius toggle rain
    // off for a frame while the entire atmospheric dome is still overcast.
    const continuousStormDeck = (this.weatherPhase === 'rain' || this.weatherPhase === 'clearing')
      && this.overcastAmount >= 0.9
      && this.cloudCover >= 0.8;
    this.localCloudCount = continuousStormDeck ? Math.max(3, nearbyCount) : nearbyCount;
    this.nearestCloudDistance = nearest;
    const measuredCoverage = nearbyCount >= 3 ? Math.min(areaCoverage, overheadPermission) : 0;
    this.localCloudCoverage = continuousStormDeck
      ? Math.max(0.82, measuredCoverage)
      : measuredCoverage;
  }

  _updateWeather(dt) {
    if (!Number.isFinite(this.overcastAmount)) this.overcastAmount = 0;
    if (this.weatherPhase === 'building') this.weatherBuildAge += dt;
    if (this.weatherWorld && this.weatherEnabled) {
      // Clearing is a real state rather than an instant switch to clear. Its
      // timer is deliberately held so another front cannot begin while the
      // outgoing rain and cloud audio envelopes are still fading.
      if (this.weatherPhase !== 'clearing') this.weatherTimer -= dt;
      if (this.weatherPhase === 'clearing') {
        this.rainTarget = 0;
        if (this.rainIntensity > 0.006) {
          this.cloudCoverTarget = Math.max(this.cloudCoverTarget, 0.9);
        } else {
          this.rainIntensity = 0;
          // Rain has ended. Keep the clearing phase while the grey dome and
          // cloud density ease back to a sunny baseline instead of snapping.
          if (this.cloudCoverTarget >= 0.8) {
            this.cloudCoverTarget = 0.22 + Math.random() * 0.28;
          }
        }
      } else if (this.weatherTimer <= 0) {
        if (this.weatherPhase === 'rain') {
          this.weatherPhase = 'clearing';
          this.rainTarget = 0;
          this.cloudCoverTarget = Math.max(0.9, this.cloudCover);
          this.weatherTimer = 105 + Math.random() * 210;
        } else if (this.weatherPhase === 'building') {
          if (
            this.weatherBuildAge >= 10
            && this.cloudCover >= 0.8
            && this.localCloudCount >= 3
            && this.localCloudCoverage >= 0.58
          ) {
            this.weatherPhase = 'rain';
            this.rainTarget = this.stormIntensity;
            this.weatherTimer = this.pendingStormDuration || (65 + Math.random() * 145);
          } else {
            this.weatherTimer = 2.5;
          }
        } else {
          this.weatherPhase = 'building';
          this.stormIntensity = 0.48 + Math.random() * 0.5;
          this.pendingStormDuration = 65 + Math.random() * 145;
          this.weatherBuildAge = 0;
          this.cloudCoverTarget = 0.84 + Math.random() * 0.16;
          this.rainTarget = 0;
          this.weatherTimer = 14 + Math.random() * 12;
        }
      }
    } else if (!this.weatherEnabled) {
      this.rainTarget = 0;
      if (this.rainIntensity > 0.006 || this.overcastAmount > 0.015) {
        this.weatherPhase = 'clearing';
        this.cloudCoverTarget = this.rainIntensity > 0.006
          ? Math.max(0.9, this.cloudCover)
          : 0.32;
      } else {
        this.rainIntensity = 0;
        this.weatherPhase = 'clear';
        this.cloudCoverTarget = 0.32;
      }
    }
    this.cloudCover += (this.cloudCoverTarget - this.cloudCover) * (1 - Math.exp(-dt / 8.5));

    // Cloud banks may gather beneath a blue sky, but the full grey atmospheric
    // layer begins only with precipitation. It stays locked through the rain
    // tail, then fades smoothly while the phase remains `clearing`.
    const lightingState = weatherLightingState(
      this.weatherPhase,
      this.overcastAmount,
      this.rainIntensity,
    );
    const overcastTarget = lightingState.overcastTarget;
    const overcastResponse = overcastTarget > this.overcastAmount ? 0.2 : 2.8;
    this.overcastAmount += (overcastTarget - this.overcastAmount)
      * (1 - Math.exp(-dt / overcastResponse));
    if (lightingState.stormLocked) this.overcastAmount = 1;
    this.overcastAmount = clamp(this.overcastAmount, 0, 1);

    const cloudPermission = THREE.MathUtils.smoothstep(this.cloudCover, 0.7, 0.86);
    const localPermission = this.localCloudCount >= 3
      ? THREE.MathUtils.smoothstep(this.localCloudCoverage, 0.54, 0.78)
      : 0;
    const permittedRain = this.rainTarget * cloudPermission * localPermission;
    // Rain takes several seconds to trail off, matching the WebAudio gain
    // ramp. Do not clamp every frame to the fluctuating local-coverage score:
    // that was the source of apparently random, single-frame rain cut-outs.
    // A ~1s release constant gives a visible five-second tail before the
    // epsilon cutoff, rather than either a pop or a half-minute drizzle.
    const response = permittedRain > this.rainIntensity ? 7 : 1.05;
    this.rainIntensity += (permittedRain - this.rainIntensity) * (1 - Math.exp(-dt / response));
    this.rainIntensity = clamp(this.rainIntensity, 0, Math.max(0, cloudPermission));
    // Preserve the hard invariant for a genuinely cloudless local sky. A
    // partial bank now produces a graceful tail instead of the old abrupt cap.
    if (this.localCloudCount <= 0 || this.cloudCover <= 0.02) this.rainIntensity = 0;
    if (this.rainIntensity < 0.0005) this.rainIntensity = 0;
    if (
      this.weatherPhase === 'clearing'
      && this.rainIntensity === 0
      && this.overcastAmount <= 0.015
    ) {
      this.overcastAmount = 0;
      this.weatherPhase = 'clear';
    }
  }

  _updateSkyExposure(dt, focus) {
    this.skyExposureTimer -= dt;
    if (this.skyExposureTimer <= 0) {
      this.skyExposureTimer = 0.18;
      const world = this.weatherWorld;
      if (!world?.getBlock || !focus) {
        this.skyExposureTarget = 1;
      } else {
        const startY = Math.floor(focus.y + 1.55);
        const maxY = Math.max(startY, (Number(world.worldHeight) || 96) - 1);
        // Most outdoor skylight arrives through the column directly above the
        // player. Keep a small peripheral contribution for cave mouths, while
        // ensuring a one-block roof cannot remain almost as bright as open sky.
        const samples = [
          [0, 0, 0.84],
          [0.62, 0, 0.04],
          [-0.62, 0, 0.04],
          [0, 0.62, 0.04],
          [0, -0.62, 0.04],
        ];
        let exposure = 0;
        let centerTransmission = 1;
        for (const [offsetX, offsetZ, weight] of samples) {
          const x = Math.floor(focus.x + offsetX);
          const z = Math.floor(focus.z + offsetZ);
          let transmission = 1;
          let foliageOnly = true;
          let sawFoliage = false;
          for (let y = startY; y <= maxY; y++) {
            const blockId = world.getBlock(x, y, z);
            const definition = BLOCKS[blockId];
            if (!definition?.solid || definition.liquid) continue;
            const blockTransmission = skylightTransmission(blockId, definition);
            if (blockTransmission <= 0) {
              transmission = 0;
              foliageOnly = false;
              break;
            }
            sawFoliage ||= FOLIAGE_BLOCKS.has(blockId);
            foliageOnly &&= FOLIAGE_BLOCKS.has(blockId);
            transmission *= blockTransmission;
          }
          // A generated crown can contain several overlapping leaf voxels.
          // Preserve enough diffuse skylight to read the ground and nearby
          // forms while the shadow map still supplies convincing canopy shade.
          if (sawFoliage && foliageOnly) {
            transmission = Math.max(0.46, transmission);
          }
          if (offsetX === 0 && offsetZ === 0) centerTransmission = transmission;
          exposure += transmission * weight;
        }
        if (centerTransmission <= 0.001) {
          const centerX = Math.floor(focus.x);
          const centerZ = Math.floor(focus.z);
          const enclosureY = Math.floor(focus.y + 0.85);
          const wallCount = [[-1, 0], [1, 0], [0, -1], [0, 1]].reduce((count, [dx, dz]) => {
            const definition = BLOCKS[world.getBlock(centerX + dx, enclosureY, centerZ + dz)];
            return count + Number(Boolean(definition?.solid && !definition.liquid && !definition.transparent));
          }, 0);
          if (wallCount >= 4) exposure = 0;
          else if (wallCount === 3) exposure *= 0.08;
          else if (wallCount === 2) exposure *= 0.28;
        }
        const surface = Number(world.terrainHeight?.(focus.x, focus.z));
        const depth = Number.isFinite(surface)
          ? clamp((surface + 1 - focus.y) / 18, 0, 1)
          : 0;
        const depthTransmission = 1 - THREE.MathUtils.smoothstep(depth, 0.04, 1) * 0.8;
        this.skyExposureTarget = clamp(exposure * depthTransmission, 0, 1);
      }
    }
    const response = this.skyExposureTarget < this.skyExposure ? 0.18 : 0.62;
    this.skyExposure += (this.skyExposureTarget - this.skyExposure) * (1 - Math.exp(-dt / response));
    if (this.skyExposure < 0.002) this.skyExposure = 0;
  }

  update(dt, focus, viewDistance = 4, context = {}) {
    this.graphicsUniforms.time.value += dt;
    this.time = (this.time + dt / this.cycleSeconds) % 1;
    this._updateCloudField(dt, focus);
    this._updateWeather(dt);
    this._updateSkyExposure(dt, focus);
    const angle = this.time * Math.PI * 2 - Math.PI * 0.5;
    const solar = Math.sin(angle);
    this.dayAmount = THREE.MathUtils.smoothstep(solar, -0.18, 0.22);
    this.graphicsUniforms.dayAmount.value = this.dayAmount;
    const twilight = 1 - THREE.MathUtils.smoothstep(Math.abs(solar), 0.04, 0.42);

    this._colorA.copy(this.nightSky).lerp(this.daySky, this.dayAmount);
    this.skyColor.copy(this._colorA).lerp(this.dawnSky, twilight * 0.62);
    this._colorB.copy(this.nightFog).lerp(this.dayFog, this.dayAmount);
    this.fogColor.copy(this._colorB).lerp(this.dawnFog, twilight * 0.7);
    const lightingState = weatherLightingState(
      this.weatherPhase,
      this.overcastAmount,
      this.rainIntensity,
    );
    const stormAmount = lightingState.stormAmount;
    this.skyColor.lerp(this._stormSky, stormAmount);
    this.fogColor.lerp(this._stormFog, stormAmount * 0.82);
    this.scene.background.copy(this.skyColor);
    this.scene.fog.color.copy(this.fogColor);
    const fogRange = atmosphericFogRange(viewDistance, {
      rainIntensity: this.rainIntensity,
      overcastAmount: this.overcastAmount,
      skyExposure: this.skyExposure,
      dayAmount: this.dayAmount,
      submerged: Boolean(context.submerged),
    });
    this.fogClarity = fogRange.clarity;
    this.scene.fog.near = fogRange.near;
    this.scene.fog.far = fogRange.far;

    this.atmosphere.position.copy(focus);
    const skyUniforms = this.atmosphere.material.uniforms;
    skyUniforms.zenithColor.value.copy(this.skyColor).multiplyScalar(0.92);
    skyUniforms.horizonColor.value.copy(this.fogColor).lerp(this.skyColor, 0.18);
    skyUniforms.lowerColor.value.copy(this.fogColor).multiplyScalar(0.52 + this.dayAmount * 0.25);
    skyUniforms.twilight.value = twilight;
    skyUniforms.dayAmount.value = this.dayAmount;
    const sunVisibility = lightingState.sunVisibility;
    skyUniforms.sunVisibility.value = sunVisibility;

    // Keep skylight subordinate to the directional sources so form is defined
    // by light and shadow instead of the previous flat ambient wash.
    const skyAccess = 0.02 + this.skyExposure * 0.98;
    // Keep a small global directional component so a cave entrance remains
    // visibly brighter than its interior; roof shadows and baked cover lighting
    // still remove that component from enclosed surfaces.
    const directSky = 0.08 + THREE.MathUtils.smoothstep(this.skyExposure, 0.08, 0.62) * 0.92;
    this.hemisphere.intensity = (0.2 + this.dayAmount * 0.72)
      * (1 - this.overcastAmount * 0.34)
      * skyAccess;
    this.hemisphere.color.setRGB(0.34 + this.dayAmount * 0.44, 0.42 + this.dayAmount * 0.45, 0.66 + this.dayAmount * 0.34);
    this.hemisphere.groundColor.setRGB(0.055 + this.dayAmount * 0.09, 0.07 + this.dayAmount * 0.11, 0.095 + this.dayAmount * 0.035);
    this.bounceLight.intensity = outdoorBounceIntensity(
      this.dayAmount,
      this.skyExposure,
      this.overcastAmount,
    );
    this.sunLight.intensity = (0.015 + this.dayAmount * 3.65)
      * (0.025 + sunVisibility * 0.975)
      * directSky;
    this.sunLight.color.copy(this._sunDawn).lerp(this._sunDay, this.dayAmount);
    this.moonLight.intensity = Math.pow(1 - this.dayAmount, 1.55) * 0.24 * directSky;
    if ('environmentIntensity' in this.scene) {
      this.scene.environmentIntensity = (0.035 + this.dayAmount * 0.43)
        * (1 - this.overcastAmount * 0.46)
        * (0.025 + this.skyExposure * 0.975);
    }
    if (this.renderer) {
      const baseExposure = this.graphicsQuality === 'low' ? 0.96 : this.graphicsQuality === 'ultra' ? 1.04 : 1.01;
      const targetExposure = baseExposure * (0.96 + (1 - this.dayAmount) * 0.12 - this.overcastAmount * 0.08);
      this.renderer.toneMappingExposure += (targetExposure - this.renderer.toneMappingExposure) * (1 - Math.exp(-dt / 1.8));
    }

    const radius = 92;
    const sunPosition = new THREE.Vector3(Math.cos(angle) * radius, solar * radius, Math.sin(angle) * radius * 0.35);
    this.sun.position.copy(focus).add(sunPosition);
    this.moon.position.copy(focus).sub(sunPosition);
    this.sun.material.opacity = THREE.MathUtils.smoothstep(solar, -0.16, 0.03) * sunVisibility;
    this.moon.material.opacity = THREE.MathUtils.smoothstep(-solar, -0.12, 0.05) * 0.88 * sunVisibility;
    this._sunDirection.copy(sunPosition).normalize();
    const shadowMapSize = Math.max(1, this.sunLight.shadow.mapSize.x);
    const shadowTexel = (this.shadowExtent * 2) / shadowMapSize;
    this._shadowFocus.set(
      Math.round(focus.x / shadowTexel) * shadowTexel,
      focus.y,
      Math.round(focus.z / shadowTexel) * shadowTexel,
    );
    this.sunLight.position.copy(this._shadowFocus).addScaledVector(this._sunDirection, 120);
    this.sunLight.target.position.copy(this._shadowFocus);
    this.sunLight.shadow.normalBias = 0.018 + (1 - Math.max(0, solar)) * 0.042;
    this.sunLight.target.updateMatrixWorld();
    this.moonLight.position.copy(this._shadowFocus).addScaledVector(this._sunDirection, -80);
    this.moonLight.target.position.copy(this._shadowFocus);
    this.moonLight.target.updateMatrixWorld();
    skyUniforms.sunDirection.value.copy(this._sunDirection);
    skyUniforms.sunColor.value.copy(this.sunLight.color);

    this.stars.position.set(focus.x, 0, focus.z);
    this.stars.material.opacity = Math.pow(1 - this.dayAmount, 1.7) * 0.88 * sunVisibility;
    this.stars.rotation.y += dt * 0.003;
    const cloudMaterial = this.clouds.children[0]?.children[0]?.material;
    if (cloudMaterial) {
      cloudMaterial.color.copy(this._cloudNight).lerp(this._cloudDay, this.dayAmount).lerp(this._cloudDawn, twilight * 0.25);
      cloudMaterial.color.lerp(this._stormSky, this.overcastAmount * 0.82);
      cloudMaterial.opacity = Math.min(0.96, (0.34 + this.dayAmount * 0.2 + this.cloudCover * 0.34 + this.overcastAmount * 0.14) * Math.min(1, this.graphicsProfile.cloudAmount + 0.28));
    }
    const clock = performance.now();
    this.localLights.forEach((light, index) => {
      if (!light.visible) return;
      const flicker = 0.94 + Math.sin(clock * 0.007 + index * 2.3) * 0.045
        + Math.sin(clock * 0.017 + index) * 0.018;
      light.intensity = light.userData.baseIntensity * flicker;
    });
    this.rain.update(dt, focus, this.rainIntensity);
    this.fallingLeaves.update(dt, focus, this.graphicsUniforms.windStrength.value, this.rainIntensity);
    this.pondEcology.update(dt, focus, {
      rainIntensity: this.rainIntensity,
      dayAmount: this.dayAmount,
      skyExposure: this.skyExposure,
    });
    this.hangingLeaves.update(dt, focus, context);
    this.redFlowers.update(dt, focus);
    const lightningEvent = this.lightning.update(
      dt,
      focus,
      this.rainIntensity,
      this.cloudCover,
      this.localCloudCoverage,
      this.rain.sheltered,
    );
    if (lightningEvent) this.onLightning?.(lightningEvent);
  }

  updateLocalLights(world, focus) {
    if (!world || !focus) {
      this.localLights.forEach((light) => { light.visible = false; });
      return;
    }
    const px = Math.floor(focus.x);
    const py = Math.floor(focus.y);
    const pz = Math.floor(focus.z);
    const found = [];
    const maxY = Math.max(1, (Number(world.worldHeight) || 64) - 1);
    const scanRadius = this.localLightLimit <= 1 ? 5 : this.localLightLimit <= 3 ? 7 : 9;
    const verticalRadius = this.localLightLimit <= 1 ? 4 : this.localLightLimit <= 3 ? 5 : 7;
    for (let y = Math.max(0, py - verticalRadius); y <= Math.min(maxY, py + verticalRadius); y++) {
      for (let z = pz - scanRadius; z <= pz + scanRadius; z++) {
        for (let x = px - scanRadius; x <= px + scanRadius; x++) {
          const id = world.getBlock(x, y, z);
          if (!LIGHT_BLOCKS.has(id)) continue;
          const distanceSq = (x + 0.5 - focus.x) ** 2 + (y + 0.5 - focus.y) ** 2 + (z + 0.5 - focus.z) ** 2;
          found.push({ x, y, z, id, distanceSq });
        }
      }
    }
    found.sort((a, b) => a.distanceSq - b.distanceSq);
    const visibleSources = found.filter((source) => this._lightReachesFocus(world, source, focus));
    this.localLights.forEach((light, index) => {
      if (index >= this.localLightLimit) {
        light.visible = false;
        return;
      }
      const source = visibleSources[index];
      if (!source) {
        light.visible = false;
        return;
      }
      light.visible = true;
      light.position.set(source.x + 0.5, source.y + (source.id === BLOCK.TORCH ? 0.72 : 0.5), source.z + 0.5);
      if (source.id === BLOCK.LUMEN_CRYSTAL) {
        light.color.set(0x69ffe2);
        light.userData.baseIntensity = 52;
        light.distance = 11;
      } else if (source.id === BLOCK.KILN || source.id === BLOCK.FURNACE) {
        light.color.set(0xff7a3d);
        light.userData.baseIntensity = 28;
        light.distance = 8;
      } else {
        light.color.set(0xffb05d);
        light.userData.baseIntensity = 42;
        light.distance = 10;
      }
    });
  }

  _lightReachesFocus(world, source, focus) {
    if (!world?.getBlock) return true;
    const start = new THREE.Vector3(source.x + 0.5, source.y + 0.58, source.z + 0.5);
    const end = new THREE.Vector3(focus.x, focus.y + 0.9, focus.z);
    const direction = end.clone().sub(start);
    const distance = direction.length();
    if (distance < 1.2) return true;
    direction.multiplyScalar(1 / distance);
    for (let step = 0.75; step < distance - 0.45; step += 0.38) {
      const x = Math.floor(start.x + direction.x * step);
      const y = Math.floor(start.y + direction.y * step);
      const z = Math.floor(start.z + direction.z * step);
      const id = world.getBlock(x, y, z);
      const definition = BLOCKS[id];
      if (definition?.solid && !definition.transparent) return false;
    }
    return true;
  }

  getTimeLabel() {
    const totalMinutes = Math.floor(this.time * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const phase = this.dayAmount < 0.12 ? 'Night' : this.time < 0.3 ? 'Morning' : this.time < 0.55 ? 'Day' : this.time < 0.7 ? 'Dusk' : 'Night';
    return `${phase} · ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

export class BlockEffects {
  constructor(scene) {
    this.scene = scene;
    const outlineGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.008, 1.008, 1.008));
    this.outline = new THREE.LineSegments(outlineGeometry, new THREE.LineBasicMaterial({ color: 0xf8e6a9, transparent: true, opacity: 0.9, depthTest: true }));
    this.outline.visible = false;
    this.outline.renderOrder = 20;
    scene.add(this.outline);

    this.crackTexture = createCrackAtlasTexture();
    this.crack = new THREE.Mesh(
      new THREE.BoxGeometry(1.012, 1.012, 1.012),
      new THREE.MeshBasicMaterial({
        map: this.crackTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.94,
        alphaTest: 0.025,
        depthWrite: false,
        depthTest: true,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      }),
    );
    this.crack.visible = false;
    this.crack.renderOrder = 21;
    scene.add(this.crack);
    this.crackStage = -1;
    this.crackTarget = '';

    this.preview = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x9de2c1, transparent: true, opacity: 0.2, depthWrite: false }),
    );
    this.preview.visible = false;
    this.preview.renderOrder = 19;
    scene.add(this.preview);
    this.particles = [];
    this.particleGeometry = new THREE.BoxGeometry(0.11, 0.11, 0.11);
  }

  setTarget(hit, progress = 0, placementValid = false, placementPreviewEnabled = false) {
    if (!hit) {
      this.outline.visible = false;
      this.crack.visible = false;
      this.preview.visible = false;
      this.crackStage = -1;
      this.crackTarget = '';
      return;
    }
    const { x, y, z, id } = hit.block;
    const targetKey = `${x},${y},${z}`;
    if (targetKey !== this.crackTarget) {
      this.crackTarget = targetKey;
      this.crackStage = -1;
    }
    this.outline.visible = true;
    this.outline.position.set(x + 0.5, y + 0.5, z + 0.5);
    this.crack.visible = progress > 0.01;
    this.crack.position.copy(this.outline.position);
    const nextStage = progress > 0.01 ? Math.min(CRACK_STAGES - 1, Math.floor(progress * CRACK_STAGES)) : -1;
    if (nextStage !== this.crackStage) {
      if (nextStage > this.crackStage && this.crackStage >= 0) {
        this.burst(new THREE.Vector3(x, y, z), id, nextStage >= 7 ? 3 : 2);
      }
      this.crackStage = nextStage;
      if (nextStage >= 0) {
        this.crackTexture.offset.x = nextStage / CRACK_STAGES;
        this.crackTexture.updateMatrix();
      }
    }
    this.crack.material.opacity = 0.66 + Math.max(0, nextStage) * 0.028;
    this.crack.scale.setScalar(1 + Math.max(0, nextStage) * 0.0007);
    this.outline.material.opacity = 0.9 - Math.min(0.3, progress * 0.3);
    // Invalid placement is already explained by the interaction toast. Keeping
    // a red cube on every invalid target looked like a permanent world artifact,
    // so the spatial preview exists only when it represents a real placement.
    this.preview.visible = Boolean(placementPreviewEnabled && placementValid);
    if (this.preview.visible) {
      this.preview.position.set(hit.adjacent.x + 0.5, hit.adjacent.y + 0.5, hit.adjacent.z + 0.5);
      this.preview.material.color.set(0x94edbf);
      this.preview.material.opacity = 0.16;
    }
  }

  burst(position, blockId, count = 12) {
    const color = new THREE.Color(BLOCKS[blockId]?.color || '#9aa09b');
    for (let i = 0; i < count; i++) {
      const material = new THREE.MeshLambertMaterial({ color: color.clone().offsetHSL((Math.random() - 0.5) * 0.03, 0, (Math.random() - 0.5) * 0.16) });
      const mesh = new THREE.Mesh(this.particleGeometry, material);
      mesh.position.set(position.x + 0.5 + (Math.random() - 0.5) * 0.7, position.y + 0.5 + (Math.random() - 0.5) * 0.7, position.z + 0.5 + (Math.random() - 0.5) * 0.7);
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 3.2, 1.2 + Math.random() * 3.1, (Math.random() - 0.5) * 3.2);
      mesh.rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4);
      this.scene.add(mesh);
      this.particles.push({ mesh, velocity, life: 0.45 + Math.random() * 0.45 });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= dt;
      particle.velocity.y -= 11 * dt;
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.mesh.rotation.x += dt * 7;
      particle.mesh.rotation.y += dt * 5;
      particle.mesh.scale.setScalar(Math.min(1, particle.life * 3));
      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        particle.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }
}
