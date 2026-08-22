import * as THREE from '../vendor/three.module.min.js';

export const CRACK_STAGES = 10;
const STAGE_SIZE = 64;

function seededRandom(seed = 0x51a9d37b) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSegments() {
  const random = seededRandom();
  const points = [{ x: 31 + random() * 4, y: 29 + random() * 6, angle: random() * Math.PI * 2 }];
  const segments = [];
  for (let index = 0; index < 82; index++) {
    const recentStart = Math.max(0, points.length - 18);
    const start = points[recentStart + Math.floor(random() * (points.length - recentStart))];
    const angle = start.angle + (random() - 0.5) * (index < 18 ? 1.1 : 1.75) + (random() > 0.86 ? Math.PI * 0.5 : 0);
    const length = 2.4 + random() * (index < 26 ? 6.2 : 4.3);
    const end = {
      x: THREE.MathUtils.clamp(start.x + Math.cos(angle) * length, 2, STAGE_SIZE - 2),
      y: THREE.MathUtils.clamp(start.y + Math.sin(angle) * length, 2, STAGE_SIZE - 2),
      angle,
    };
    segments.push({ start, end, width: random() > 0.8 ? 2.15 : 1.15 });
    points.push(end);
    if (random() > 0.72) points.push({ ...end, angle: angle + (random() - 0.5) * 1.4 });
  }
  return segments;
}

function drawStage(context, offsetX, stage, segments) {
  context.save();
  context.translate(offsetX, 0);
  const visible = Math.ceil(segments.length * ((stage + 1) / CRACK_STAGES));
  const strength = 0.55 + stage * 0.045;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (let index = 0; index < visible; index++) {
    const segment = segments[index];
    context.beginPath();
    context.moveTo(segment.start.x, segment.start.y);
    context.lineTo(segment.end.x, segment.end.y);
    context.strokeStyle = `rgba(240, 229, 202, ${0.12 + stage * 0.012})`;
    context.lineWidth = segment.width + 1.7;
    context.stroke();
    context.beginPath();
    context.moveTo(segment.start.x, segment.start.y);
    context.lineTo(segment.end.x, segment.end.y);
    context.strokeStyle = `rgba(20, 15, 13, ${strength})`;
    context.lineWidth = segment.width;
    context.stroke();
  }
  context.restore();
}

export function createCrackAtlasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = STAGE_SIZE * CRACK_STAGES;
  canvas.height = STAGE_SIZE;
  const context = canvas.getContext('2d', { alpha: true });
  context.clearRect(0, 0, canvas.width, canvas.height);
  const segments = buildSegments();
  for (let stage = 0; stage < CRACK_STAGES; stage++) drawStage(context, stage * STAGE_SIZE, stage, segments);
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = 'Worldloom progressive fracture atlas';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1 / CRACK_STAGES, 1);
  texture.offset.set(0, 0);
  texture.needsUpdate = true;
  return texture;
}
