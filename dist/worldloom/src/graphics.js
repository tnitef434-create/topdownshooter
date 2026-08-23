import * as THREE from '../vendor/three.module.min.js';
import { EffectComposer } from '../vendor/EffectComposer.js';
import { RenderPass } from '../vendor/RenderPass.js';
import { ShaderPass } from '../vendor/ShaderPass.js';
import { GTAOPass } from '../vendor/GTAOPass.js';
import { UnrealBloomPass } from '../vendor/UnrealBloomPass.js';
import { OutputPass } from '../vendor/OutputPass.js';
import { FXAAShader } from '../vendor/FXAAShader.js';

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
    this.cinematicPass = null;
    this.outputPass = null;
    this.fxaaPass = null;
    this.enabled = false;
    this.aoEnabled = false;
    this.bloomEnabled = false;
    this.width = 1;
    this.height = 1;
    this.pixelRatio = 1;
    this.aoScale = 0.55;
    this.environment = { dayAmount: 1, rainAmount: 0, caveAmount: 0 };
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

  _rebuildPasses() {
    if (!this.composer) return;
    this.composer.passes.length = 0;
    this.composer.addPass(this.renderPass);
    if (this.aoEnabled && this.gtaoPass) this.composer.addPass(this.gtaoPass);
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
    this.enabled = Boolean(profile.postProcessing);
    if (!this.enabled) return;
    this._ensureBasePipeline();
    this.aoEnabled = Boolean(profile.ambientOcclusion);
    this.bloomEnabled = Number(profile.bloomStrength || 0) > 0;
    if (this.aoEnabled) this._ensureGtao();
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

  setEnvironment({ dayAmount = 1, rainAmount = 0, caveAmount = 0 } = {}) {
    this.environment.dayAmount = THREE.MathUtils.clamp(dayAmount, 0, 1);
    this.environment.rainAmount = THREE.MathUtils.clamp(rainAmount, 0, 1);
    this.environment.caveAmount = THREE.MathUtils.clamp(caveAmount, 0, 1);
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
      passes: this.composer?.passes.filter((pass) => pass.enabled !== false).length || 1,
      aoScale: this.aoEnabled ? this.aoScale : 0,
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    };
  }
}
