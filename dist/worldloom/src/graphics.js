import * as THREE from '../vendor/three.module.min.js';
import { EffectComposer } from '../vendor/EffectComposer.js';
import { RenderPass } from '../vendor/RenderPass.js';
import { ShaderPass } from '../vendor/ShaderPass.js';
import { GTAOPass } from '../vendor/GTAOPass.js';
import { UnrealBloomPass } from '../vendor/UnrealBloomPass.js';
import { OutputPass } from '../vendor/OutputPass.js';
import { FXAAShader } from '../vendor/FXAAShader.js';
import { VolumetricSunPass } from './volumetric-sun-pass.js';

export const CAVE_LIGHTING_DEPTH_BLOCKS = 28;

export function caveLightingDepth(surfaceHeight, playerY) {
  const surface = Number(surfaceHeight);
  const player = Number(playerY);
  if (!Number.isFinite(surface) || !Number.isFinite(player)) return 0;
  return THREE.MathUtils.clamp((surface + 1 - player) / CAVE_LIGHTING_DEPTH_BLOCKS, 0, 1);
}

export function cavePostProcessAmount(caveDepth = 0, skyExposure = 1) {
  const depth = THREE.MathUtils.clamp(Number(caveDepth) || 0, 0, 1);
  const sky = THREE.MathUtils.clamp(Number(skyExposure) || 0, 0, 1);
  const enclosed = 1 - THREE.MathUtils.smoothstep(sky, 0.025, 0.58);
  const establishedDepth = THREE.MathUtils.smoothstep(depth, 0.08, 0.98);
  return THREE.MathUtils.clamp(enclosed * establishedDepth, 0, 1);
}

export function projectLightToScreen(camera, worldPosition, target = {}) {
  target.uv ||= new THREE.Vector2(0.5, 0.5);
  if (!camera?.isCamera || !worldPosition?.isVector3) {
    target.uv.set(0.5, 0.5);
    target.facing = 0;
    target.screenFade = 0;
    return target;
  }
  camera.updateMatrixWorld(true);
  const cameraForward = target.cameraForward || (target.cameraForward = new THREE.Vector3());
  const cameraToLight = target.cameraToLight || (target.cameraToLight = new THREE.Vector3());
  const projected = target.projected || (target.projected = new THREE.Vector3());
  camera.getWorldDirection(cameraForward);
  cameraToLight.subVectors(worldPosition, camera.position).normalize();
  target.facing = THREE.MathUtils.clamp(cameraForward.dot(cameraToLight), -1, 1);
  projected.copy(worldPosition).project(camera);
  target.uv.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
  const edge = Math.max(Math.abs(projected.x), Math.abs(projected.y));
  target.screenFade = 1 - THREE.MathUtils.smoothstep(edge, 0.92, 1.65);
  return target;
}

export function volumetricSunIntensity(profile = {}, environment = {}, projection = {}) {
  const authoredStrength = THREE.MathUtils.clamp(Number(profile.godRayStrength) || 0, 0, 0.5);
  const day = THREE.MathUtils.smoothstep(Number(environment.dayAmount) || 0, 0.16, 0.86);
  const dry = 1 - THREE.MathUtils.smoothstep(Number(environment.rainAmount) || 0, 0.025, 0.78);
  const openCave = 1 - THREE.MathUtils.smoothstep(Number(environment.caveAmount) || 0, 0.02, 0.82);
  const sky = THREE.MathUtils.smoothstep(Number(environment.skyExposure) || 0, 0.04, 0.72);
  const visibleSun = THREE.MathUtils.clamp(Number(environment.sunVisibility) || 0, 0, 1);
  const facing = THREE.MathUtils.smoothstep(Number(projection.facing) || 0, 0.015, 0.3);
  const onScreen = THREE.MathUtils.clamp(Number(projection.screenFade) || 0, 0, 1);
  return authoredStrength * day * dry * openCave * sky * visibleSun * facing * onScreen;
}

const CinematicShader = {
  name: 'WorldloomCinematicShader',
  uniforms: {
    tDiffuse: { value: null },
    texelSize: { value: new THREE.Vector2(1 / 1280, 1 / 720) },
    time: { value: 0 },
    strength: { value: 0.6 },
    sharpen: { value: 0.2 },
    saturation: { value: 1.06 },
    vignette: { value: 0.14 },
    grain: { value: 0.008 },
    dayAmount: { value: 1 },
    rainAmount: { value: 0 },
    caveAmount: { value: 0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform vec2 texelSize;
    uniform float time;
    uniform float strength;
    uniform float sharpen;
    uniform float saturation;
    uniform float vignette;
    uniform float grain;
    uniform float dayAmount;
    uniform float rainAmount;
    uniform float caveAmount;
    varying vec2 vUv;

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec3 center = texture2D(tDiffuse, vUv).rgb;
      vec3 crossBlur = (
        texture2D(tDiffuse, vUv + vec2(texelSize.x, 0.0)).rgb
        + texture2D(tDiffuse, vUv - vec2(texelSize.x, 0.0)).rgb
        + texture2D(tDiffuse, vUv + vec2(0.0, texelSize.y)).rgb
        + texture2D(tDiffuse, vUv - vec2(0.0, texelSize.y)).rgb
      ) * 0.25;
      vec3 color = center + (center - crossBlur) * sharpen * strength;

      float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(luminance), color, mix(1.0, saturation, strength));
      color = (color - 0.18) * (1.0 + 0.055 * strength) + 0.18;

      float highlight = smoothstep(0.32, 1.15, luminance);
      float shadow = 1.0 - smoothstep(0.025, 0.34, luminance);
      vec3 warmLight = vec3(1.018, 1.003, 0.978);
      vec3 coolShadow = mix(vec3(0.975, 0.992, 1.018), vec3(0.955, 0.98, 1.025), rainAmount);
      color *= mix(vec3(1.0), warmLight, highlight * strength);
      color *= mix(vec3(1.0), coolShadow, shadow * strength);

      // Depth should remove unlit detail instead of applying a grey overlay.
      // Bright torch/lava highlights survive, while low-luminance cave surfaces
      // fall toward black as the player descends.
      float caveVisibility = 0.2 + smoothstep(0.025, 0.3, luminance) * 0.8;
      color *= mix(1.0, caveVisibility, caveAmount * 0.88);

      vec2 centeredUv = vUv * 2.0 - 1.0;
      centeredUv.x *= texelSize.y / max(texelSize.x, 0.000001);
      float edge = smoothstep(0.32, 1.45, dot(centeredUv, centeredUv));
      float adaptiveVignette = vignette + caveAmount * 0.075 + (1.0 - dayAmount) * 0.025;
      color *= 1.0 - edge * adaptiveVignette * strength;

      float noise = hash12(gl_FragCoord.xy + fract(time) * 173.37) - 0.5;
      color += noise * grain * strength * (0.45 + shadow * 0.55);
      gl_FragColor = vec4(max(color, 0.0), 1.0);
    }
  `,
};

export class GraphicsPipeline {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.renderPass = null;
    this.gtaoPass = null;
    this.bloomPass = null;
    this.volumetricSunPass = null;
    this.cinematicPass = null;
    this.outputPass = null;
    this.fxaaPass = null;
    this.enabled = false;
    this.aoEnabled = false;
    this.bloomEnabled = false;
    this.volumetricSunEnabled = false;
    this.width = 1;
    this.height = 1;
    this.pixelRatio = 1;
    this.aoScale = 0.55;
    this.profile = {};
    this.environment = {
      dayAmount: 1,
      rainAmount: 0,
      caveAmount: 0,
      skyExposure: 1,
      sunVisibility: 0,
    };
    this.sunProjection = {
      uv: new THREE.Vector2(0.5, 0.5),
      cameraForward: new THREE.Vector3(),
      cameraToLight: new THREE.Vector3(),
      projected: new THREE.Vector3(),
      facing: 0,
      screenFade: 0,
    };
  }

  _ensureBasePipeline() {
    if (this.composer) return;
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.58, 0.88);
    this.cinematicPass = new ShaderPass(CinematicShader);
    this.outputPass = new OutputPass();
    this.fxaaPass = new ShaderPass(FXAAShader);
  }

  _ensureGtao() {
    if (this.gtaoPass) return;
    this.gtaoPass = new GTAOPass(this.scene, this.camera, 512, 288);
    this.gtaoPass.output = GTAOPass.OUTPUT.Default;
  }

  _ensureVolumetricSun() {
    if (this.volumetricSunPass) return;
    this.volumetricSunPass = new VolumetricSunPass();
    this.volumetricSunPass.setDepthTexture(this.gtaoPass?.depthTexture);
  }

  _rebuildPasses() {
    if (!this.composer) return;
    this.composer.passes.length = 0;
    this.composer.addPass(this.renderPass);
    if (this.aoEnabled && this.gtaoPass) this.composer.addPass(this.gtaoPass);
    if (this.volumetricSunEnabled && this.volumetricSunPass) this.composer.addPass(this.volumetricSunPass);
    if (this.bloomEnabled) this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.cinematicPass);
    // Antialias the linear scene before OutputPass performs the final display
    // color-space conversion; doing it afterwards produced dark edge halos.
    this.composer.addPass(this.fxaaPass);
    this.composer.addPass(this.outputPass);
    this._resizePasses();
  }

  _resizePasses() {
    if (!this.composer) return;
    this.composer.setPixelRatio(this.pixelRatio);
    this.composer.setSize(this.width, this.height);
    const effectiveWidth = Math.max(1, Math.round(this.width * this.pixelRatio));
    const effectiveHeight = Math.max(1, Math.round(this.height * this.pixelRatio));
    if (this.gtaoPass && this.aoEnabled) {
      this.gtaoPass.setSize(
        Math.max(1, Math.round(effectiveWidth * this.aoScale)),
        Math.max(1, Math.round(effectiveHeight * this.aoScale)),
      );
    }
    this.cinematicPass.uniforms.texelSize.value.set(1 / effectiveWidth, 1 / effectiveHeight);
    this.fxaaPass.material.uniforms.resolution.value.set(1 / effectiveWidth, 1 / effectiveHeight);
  }

  applyProfile(profile = {}) {
    this.profile = profile;
    this.enabled = Boolean(profile.postProcessing);
    if (!this.enabled) {
      this.volumetricSunEnabled = false;
      if (this.volumetricSunPass) this.volumetricSunPass.enabled = false;
      return;
    }
    this._ensureBasePipeline();
    this.aoEnabled = Boolean(profile.ambientOcclusion);
    this.bloomEnabled = Number(profile.bloomStrength || 0) > 0;
    if (this.aoEnabled) this._ensureGtao();
    this.volumetricSunEnabled = this.aoEnabled && Number(profile.godRayStrength || 0) > 0;
    if (this.volumetricSunEnabled) {
      this._ensureVolumetricSun();
      this.volumetricSunPass.setDepthTexture(this.gtaoPass?.depthTexture);
      this.volumetricSunPass.configure({
        resolutionScale: profile.godRayScale,
        sourceRadius: profile.godRaySourceRadius,
        density: profile.godRayDensity,
        decay: profile.godRayDecay,
        weight: profile.godRayWeight,
        tint: profile.godRayTint,
      });
    } else if (this.volumetricSunPass) {
      this.volumetricSunPass.enabled = false;
    }
    this.aoScale = Number(profile.aoScale) || 0.55;

    if (this.gtaoPass) {
      const samples = Math.max(4, Math.round(Number(profile.aoSamples) || 8));
      this.gtaoPass.blendIntensity = Number(profile.aoIntensity) || 0.72;
      this.gtaoPass.updateGtaoMaterial({
        radius: Number(profile.aoRadius) || 0.42,
        distanceExponent: 1.35,
        thickness: 1.35,
        distanceFallOff: 0.72,
        scale: 1,
        samples,
        screenSpaceRadius: false,
      });
      this.gtaoPass.updatePdMaterial({
        lumaPhi: 9,
        depthPhi: 2.4,
        normalPhi: 3.2,
        radius: 4,
        radiusExponent: 1.4,
        rings: 2,
        samples,
      });
    }
    this.bloomPass.strength = Number(profile.bloomStrength) || 0;
    this.bloomPass.radius = Number(profile.bloomRadius) || 0.55;
    this.bloomPass.threshold = Number(profile.bloomThreshold) || 0.88;
    this.cinematicPass.uniforms.strength.value = Number(profile.cinematicStrength) || 0.45;
    this.cinematicPass.uniforms.sharpen.value = Number(profile.sharpen) || 0.12;
    this.cinematicPass.uniforms.saturation.value = Number(profile.saturation) || 1.045;
    this.cinematicPass.uniforms.vignette.value = Number(profile.vignette) || 0.1;
    this.cinematicPass.uniforms.grain.value = Number(profile.filmGrain) || 0.004;
    this._rebuildPasses();
  }

  resize(width, height, pixelRatio) {
    this.width = Math.max(1, Number(width) || 1);
    this.height = Math.max(1, Number(height) || 1);
    this.pixelRatio = Math.max(0.5, Number(pixelRatio) || 1);
    this._resizePasses();
  }

  setEnvironment({
    dayAmount = 1,
    rainAmount = 0,
    caveAmount = 0,
    skyExposure = 1,
    sunVisibility = 0,
    sunWorldPosition = null,
  } = {}) {
    this.environment.dayAmount = THREE.MathUtils.clamp(dayAmount, 0, 1);
    this.environment.rainAmount = THREE.MathUtils.clamp(rainAmount, 0, 1);
    this.environment.caveAmount = THREE.MathUtils.clamp(caveAmount, 0, 1);
    this.environment.skyExposure = THREE.MathUtils.clamp(skyExposure, 0, 1);
    this.environment.sunVisibility = THREE.MathUtils.clamp(sunVisibility, 0, 1);
    if (this.volumetricSunPass) {
      const projection = projectLightToScreen(this.camera, sunWorldPosition, this.sunProjection);
      const intensity = volumetricSunIntensity(this.profile, this.environment, projection);
      this.volumetricSunPass.setLight(projection.uv, intensity);
      this.volumetricSunPass.enabled = this.volumetricSunEnabled && intensity > 0.0001;
    }
    if (!this.cinematicPass) return;
    this.cinematicPass.uniforms.dayAmount.value = this.environment.dayAmount;
    this.cinematicPass.uniforms.rainAmount.value = this.environment.rainAmount;
    this.cinematicPass.uniforms.caveAmount.value = this.environment.caveAmount;
  }

  render(dt) {
    if (!this.enabled || !this.composer) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.cinematicPass.uniforms.time.value += Math.max(0, Number(dt) || 0);
    this.composer.render(dt);
  }

  getDiagnostics() {
    return {
      enabled: this.enabled,
      ambientOcclusion: this.aoEnabled,
      bloom: this.bloomEnabled,
      volumetricSun: this.volumetricSunEnabled,
      volumetricSunState: this.volumetricSunPass?.getDiagnostics() || null,
      passes: this.composer?.passes.filter((pass) => pass.enabled !== false).length || 1,
      aoScale: this.aoEnabled ? this.aoScale : 0,
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    };
  }
}
