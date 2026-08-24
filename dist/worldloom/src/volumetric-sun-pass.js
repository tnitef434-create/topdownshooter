import * as THREE from '../vendor/three.module.min.js';
import { Pass, FullScreenQuad } from '../vendor/Pass.js';

const FULLSCREEN_VERTEX = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SunMaskShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    sourceRadius: { value: 0.42 },
  },
  vertexShader: FULLSCREEN_VERTEX,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform vec2 resolution;
    uniform vec2 lightPosition;
    uniform float sourceRadius;
    varying vec2 vUv;

    void main() {
      vec3 sceneColor = texture2D(tDiffuse, vUv).rgb;
      float depth = texture2D(tDepth, vUv).x;
      // The atmosphere and sun deliberately do not write depth. Exact far
      // depth is therefore open air; terrain, leaves, clouds and roofs remain
      // black in the mask and carve clean shafts from the radial blur.
      float depthSky = step(0.99999, depth);
      vec2 aspect = vec2(resolution.x / max(resolution.y, 1.0), 1.0);
      float sourceDistance = length((vUv - lightPosition) * aspect);
      float sourceFalloff = 1.0 - smoothstep(0.025, sourceRadius, sourceDistance);
      float luminance = dot(sceneColor, vec3(0.2126, 0.7152, 0.0722));
      // GTAO's shared normal pass cannot retain every atlas alpha cutout. The
      // beauty buffer does: pixels in a leaf/grass hole contain the bright blue
      // or neutral atmosphere behind it. Recover those pixels without turning
      // green terrain into a light source; glass naturally receives a partial
      // transmission instead of becoming an opaque rectangle.
      float blueBalance = sceneColor.b - max(sceneColor.r, sceneColor.g);
      float atmosphericColor = smoothstep(-0.16, 0.05, blueBalance);
      float recoveredSky = smoothstep(0.42, 0.82, luminance) * atmosphericColor;
      float openSky = max(depthSky, recoveredSky * (1.0 - depthSky));
      float skyEnergy = 0.22 + smoothstep(0.24, 1.15, luminance) * 0.78;
      gl_FragColor = vec4(sceneColor * openSky * sourceFalloff * skyEnergy, 1.0);
    }
  `,
};

const RadialScatterShader = {
  uniforms: {
    tMask: { value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    density: { value: 0.9 },
    decay: { value: 0.955 },
    weight: { value: 0.046 },
  },
  vertexShader: FULLSCREEN_VERTEX,
  fragmentShader: /* glsl */`
    uniform sampler2D tMask;
    uniform vec2 lightPosition;
    uniform float density;
    uniform float decay;
    uniform float weight;
    varying vec2 vUv;

    const int SAMPLE_COUNT = 24;

    void main() {
      vec2 sampleUv = vUv;
      vec2 delta = (vUv - lightPosition) * (density / float(SAMPLE_COUNT));
      float illumination = 1.0;
      vec3 scattered = vec3(0.0);
      for (int index = 0; index < SAMPLE_COUNT; index++) {
        sampleUv -= delta;
        float inside = step(0.0, sampleUv.x) * step(sampleUv.x, 1.0)
          * step(0.0, sampleUv.y) * step(sampleUv.y, 1.0);
        scattered += texture2D(tMask, clamp(sampleUv, 0.0, 1.0)).rgb
          * illumination * weight * inside;
        illumination *= decay;
      }
      gl_FragColor = vec4(scattered, 1.0);
    }
  `,
};

const SunCompositeShader = {
  uniforms: {
    tDiffuse: { value: null },
    tShafts: { value: null },
    intensity: { value: 0 },
    tint: { value: new THREE.Color('#ffe2a3') },
  },
  vertexShader: FULLSCREEN_VERTEX,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform sampler2D tShafts;
    uniform float intensity;
    uniform vec3 tint;
    varying vec2 vUv;

    void main() {
      vec4 sceneColor = texture2D(tDiffuse, vUv);
      vec3 shafts = texture2D(tShafts, vUv).rgb;
      // Soft compression keeps a white sun from producing clipped flat bands.
      shafts /= 1.0 + max(max(shafts.r, shafts.g), shafts.b);
      gl_FragColor = vec4(sceneColor.rgb + shafts * tint * intensity, sceneColor.a);
    }
  `,
};

function makeTarget(name) {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });
  target.texture.name = name;
  target.texture.generateMipmaps = false;
  return target;
}

function makeMaterial(shader, name) {
  return new THREE.ShaderMaterial({
    name,
    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
    toneMapped: false,
  });
}

/**
 * A conservative screen-space volumetric sunlight pass. It reuses GTAO's
 * current depth texture, extracts only open sky near the sun at reduced
 * resolution, radially scatters that mask, then composites it into the linear
 * scene before bloom and display conversion.
 */
export class VolumetricSunPass extends Pass {
  constructor() {
    super();
    this.name = 'WorldloomVolumetricSunPass';
    this.enabled = false;
    this.needsSwap = true;
    this.resolutionScale = 0.42;
    this.fullWidth = 1;
    this.fullHeight = 1;
    this.maskTarget = makeTarget('Worldloom sun mask');
    this.scatterTarget = makeTarget('Worldloom sun shafts');
    this.maskMaterial = makeMaterial(SunMaskShader, 'Worldloom sun mask material');
    this.scatterMaterial = makeMaterial(RadialScatterShader, 'Worldloom radial sunlight material');
    this.compositeMaterial = makeMaterial(SunCompositeShader, 'Worldloom sun shaft composite');
    this.maskQuad = new FullScreenQuad(this.maskMaterial);
    this.scatterQuad = new FullScreenQuad(this.scatterMaterial);
    this.compositeQuad = new FullScreenQuad(this.compositeMaterial);
    this.depthTexture = null;
    this.intensity = 0;
  }

  setDepthTexture(depthTexture) {
    this.depthTexture = depthTexture || null;
    this.maskMaterial.uniforms.tDepth.value = this.depthTexture;
  }

  configure({ resolutionScale, sourceRadius, density, decay, weight, tint } = {}) {
    const nextScale = THREE.MathUtils.clamp(Number(resolutionScale) || this.resolutionScale, 0.25, 0.65);
    if (Math.abs(nextScale - this.resolutionScale) > 0.001) {
      this.resolutionScale = nextScale;
      this.setSize(this.fullWidth, this.fullHeight);
    }
    this.maskMaterial.uniforms.sourceRadius.value = THREE.MathUtils.clamp(Number(sourceRadius) || 0.42, 0.18, 0.7);
    this.scatterMaterial.uniforms.density.value = THREE.MathUtils.clamp(Number(density) || 0.9, 0.3, 1.2);
    this.scatterMaterial.uniforms.decay.value = THREE.MathUtils.clamp(Number(decay) || 0.955, 0.8, 0.99);
    this.scatterMaterial.uniforms.weight.value = THREE.MathUtils.clamp(Number(weight) || 0.046, 0.015, 0.09);
    if (tint) this.compositeMaterial.uniforms.tint.value.set(tint);
  }

  setLight(lightPosition, intensity) {
    this.maskMaterial.uniforms.lightPosition.value.copy(lightPosition);
    this.scatterMaterial.uniforms.lightPosition.value.copy(lightPosition);
    this.intensity = THREE.MathUtils.clamp(Number(intensity) || 0, 0, 0.5);
    this.compositeMaterial.uniforms.intensity.value = this.intensity;
  }

  setSize(width, height) {
    this.fullWidth = Math.max(1, Math.round(Number(width) || 1));
    this.fullHeight = Math.max(1, Math.round(Number(height) || 1));
    const targetWidth = Math.max(1, Math.round(this.fullWidth * this.resolutionScale));
    const targetHeight = Math.max(1, Math.round(this.fullHeight * this.resolutionScale));
    this.maskTarget.setSize(targetWidth, targetHeight);
    this.scatterTarget.setSize(targetWidth, targetHeight);
    this.maskMaterial.uniforms.resolution.value.set(targetWidth, targetHeight);
  }

  render(renderer, writeBuffer, readBuffer) {
    if (!this.depthTexture || this.intensity <= 0.0001) return;

    this.maskMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.maskTarget);
    this.maskQuad.render(renderer);

    this.scatterMaterial.uniforms.tMask.value = this.maskTarget.texture;
    renderer.setRenderTarget(this.scatterTarget);
    this.scatterQuad.render(renderer);

    this.compositeMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    this.compositeMaterial.uniforms.tShafts.value = this.scatterTarget.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.compositeQuad.render(renderer);
  }

  getDiagnostics() {
    return {
      active: this.enabled && this.intensity > 0.0001,
      depthBound: Boolean(this.depthTexture),
      resolutionScale: this.resolutionScale,
      width: this.maskTarget.width,
      height: this.maskTarget.height,
      samples: 24,
      intensity: this.intensity,
    };
  }

  dispose() {
    this.maskTarget.dispose();
    this.scatterTarget.dispose();
    this.maskMaterial.dispose();
    this.scatterMaterial.dispose();
    this.compositeMaterial.dispose();
    this.maskQuad.dispose();
    this.scatterQuad.dispose();
    this.compositeQuad.dispose();
  }
}
