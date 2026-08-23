function randomFor(seed) {
  let state = (Number(seed) || 1) >>> 0;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function roundedStroke(context, color, width) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = 'round';
  context.lineJoin = 'round';
}

function path(context, points, close = true) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index++) context.lineTo(points[index][0], points[index][1]);
  if (close) context.closePath();
}

function drawHandle(context, from, to) {
  roundedStroke(context, '#3d2b23', 10);
  context.beginPath();
  context.moveTo(...from);
  context.lineTo(...to);
  context.stroke();
  const gradient = context.createLinearGradient(...from, ...to);
  gradient.addColorStop(0, '#d49b62');
  gradient.addColorStop(0.42, '#9a6844');
  gradient.addColorStop(1, '#64402f');
  roundedStroke(context, gradient, 6);
  context.beginPath();
  context.moveTo(...from);
  context.lineTo(...to);
  context.stroke();
  roundedStroke(context, 'rgba(255,226,178,.46)', 1.2);
  context.beginPath();
  context.moveTo(from[0] + 1.3, from[1] - 1);
  context.lineTo(to[0] + 1.3, to[1] - 1);
  context.stroke();
}

function drawPick(context, item, random) {
  drawHandle(context, [24, 56], [38, 21]);
  const gradient = context.createLinearGradient(10, 9, 55, 30);
  gradient.addColorStop(0, '#f1e6d0');
  gradient.addColorStop(0.28, item.color || '#9ca5a1');
  gradient.addColorStop(1, '#39403f');
  path(context, [[8, 18], [18, 10], [36, 7], [53, 14], [58, 22], [51, 27], [44, 21], [34, 18], [22, 20], [13, 27]]);
  context.fillStyle = gradient;
  context.fill();
  roundedStroke(context, '#25302e', 2.5);
  context.stroke();
  for (let index = 0; index < 14; index++) {
    context.fillStyle = random() > 0.5 ? 'rgba(255,255,255,.22)' : 'rgba(15,24,22,.18)';
    context.fillRect(16 + random() * 35, 12 + random() * 10, 1 + random() * 2, 1 + random() * 1.5);
  }
}

function drawAxe(context, item, random) {
  drawHandle(context, [40, 57], [25, 18]);
  const gradient = context.createLinearGradient(10, 8, 49, 35);
  gradient.addColorStop(0, '#f1dfc2');
  gradient.addColorStop(0.33, item.color || '#b88862');
  gradient.addColorStop(1, '#4c443c');
  path(context, [[12, 10], [31, 7], [43, 14], [46, 25], [35, 35], [21, 32], [15, 24]]);
  context.fillStyle = gradient;
  context.fill();
  roundedStroke(context, '#28312f', 2.5);
  context.stroke();
  roundedStroke(context, 'rgba(255,244,218,.62)', 1.5);
  context.beginPath();
  context.moveTo(14, 13);
  context.quadraticCurveTo(30, 9, 40, 17);
  context.stroke();
  for (let index = 0; index < 8; index++) {
    context.fillStyle = 'rgba(39,45,42,.2)';
    context.fillRect(18 + random() * 21, 14 + random() * 13, 1.4, 1.4);
  }
}

function drawIngot(context, item, random) {
  const gradient = context.createLinearGradient(13, 14, 52, 52);
  gradient.addColorStop(0, '#ffe0c0');
  gradient.addColorStop(0.3, item.color || '#d98759');
  gradient.addColorStop(1, '#6f3c31');
  path(context, [[8, 39], [18, 18], [45, 15], [57, 37], [47, 51], [17, 53]]);
  context.fillStyle = gradient;
  context.fill();
  roundedStroke(context, '#4b302a', 2.8);
  context.stroke();
  path(context, [[18, 18], [25, 30], [52, 28]], false);
  roundedStroke(context, 'rgba(255,232,205,.72)', 2.2);
  context.stroke();
  for (let index = 0; index < 18; index++) {
    context.fillStyle = random() > 0.55 ? 'rgba(255,223,193,.28)' : 'rgba(81,41,34,.14)';
    context.fillRect(17 + random() * 34, 27 + random() * 18, 1 + random() * 1.8, 1 + random() * 1.2);
  }
}

function drawCore(context, item) {
  context.save();
  context.shadowColor = item.color || '#6fffe1';
  context.shadowBlur = 16;
  const glow = context.createRadialGradient(32, 32, 3, 32, 32, 27);
  glow.addColorStop(0, '#f3fffc');
  glow.addColorStop(0.24, item.color || '#6fffe1');
  glow.addColorStop(0.66, '#246f69');
  glow.addColorStop(1, 'rgba(8,32,34,0)');
  context.fillStyle = glow;
  context.fillRect(3, 3, 58, 58);
  path(context, [[32, 5], [40, 21], [57, 32], [40, 42], [32, 59], [23, 42], [7, 32], [23, 21]]);
  context.fillStyle = item.color || '#6fffe1';
  context.fill();
  roundedStroke(context, '#d9fff7', 2.1);
  context.stroke();
  context.fillStyle = '#f7fffd';
  context.beginPath();
  context.arc(32, 32, 6.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawRod(context, item) {
  drawHandle(context, [22, 57], [41, 8]);
  roundedStroke(context, item.color || '#a8754d', 2.2);
  context.beginPath();
  context.moveTo(23, 53);
  context.lineTo(40, 10);
  context.stroke();
}

function drawSword(context, item) {
  const blade = context.createLinearGradient(12, 8, 51, 48);
  blade.addColorStop(0, '#fff0dd');
  blade.addColorStop(0.3, item.color || '#dc8453');
  blade.addColorStop(0.72, '#9a4f39');
  blade.addColorStop(1, '#4b3130');
  path(context, [[9, 8], [19, 10], [49, 40], [43, 47], [13, 18]]);
  context.fillStyle = blade;
  context.fill();
  roundedStroke(context, '#342d2c', 2.2);
  context.stroke();
  roundedStroke(context, 'rgba(255,244,226,.75)', 1.3);
  context.beginPath();
  context.moveTo(15, 13);
  context.lineTo(43, 41);
  context.stroke();
  roundedStroke(context, '#d3b061', 6);
  context.beginPath();
  context.moveTo(36, 47);
  context.lineTo(51, 32);
  context.stroke();
  roundedStroke(context, '#5a352a', 7);
  context.beginPath();
  context.moveTo(45, 47);
  context.lineTo(56, 58);
  context.stroke();
  roundedStroke(context, '#b9844d', 2);
  context.beginPath();
  context.moveTo(46, 46);
  context.lineTo(57, 57);
  context.stroke();
}

function drawFood(context, item, cooked = false, random = Math.random) {
  context.save();
  context.shadowColor = 'rgba(18, 10, 8, .48)';
  context.shadowBlur = 5;
  context.shadowOffsetY = 3;
  path(context, [[7, 30], [11, 19], [22, 10], [38, 8], [53, 17], [58, 29], [54, 43], [43, 54], [26, 58], [12, 49], [6, 39]]);
  const fat = context.createLinearGradient(9, 9, 55, 55);
  fat.addColorStop(0, cooked ? '#e8b66f' : '#f2c9b6');
  fat.addColorStop(0.48, cooked ? '#b96e3f' : '#dd8d83');
  fat.addColorStop(1, cooked ? '#5a3025' : '#81333b');
  context.fillStyle = fat;
  context.fill();
  roundedStroke(context, cooked ? '#45271f' : '#642b32', 2.8);
  context.stroke();
  context.restore();

  // The inset cut and pale fat cap make the icon read as a steak rather than a
  // generic red blob, even at the 32px size used by the hotbar.
  path(context, [[12, 29], [16, 20], [27, 14], [39, 13], [50, 20], [53, 30], [48, 41], [38, 49], [25, 52], [15, 45], [10, 37]]);
  const meat = context.createRadialGradient(26, 22, 2, 33, 34, 27);
  meat.addColorStop(0, cooked ? '#dc8b4d' : '#f28e8d');
  meat.addColorStop(0.5, cooked ? '#a95732' : '#c84f59');
  meat.addColorStop(1, cooked ? '#633127' : '#792d38');
  context.fillStyle = meat;
  context.fill();
  roundedStroke(context, cooked ? '#7d402d' : '#9a414b', 1.8);
  context.stroke();

  // Bone, marrow and a small highlight.
  context.save();
  context.translate(39, 37);
  context.rotate(-0.42);
  context.fillStyle = cooked ? '#e4c390' : '#f1d6c4';
  context.strokeStyle = cooked ? '#7a5037' : '#9c6c68';
  context.lineWidth = 1.8;
  context.beginPath();
  context.ellipse(0, 0, 8, 5.2, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = cooked ? '#8f5437' : '#b96f72';
  context.beginPath();
  context.ellipse(0.5, 0.2, 3.5, 2.1, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  if (cooked) {
    roundedStroke(context, 'rgba(54, 27, 21, .72)', 2.2);
    [[16, 28, 28, 21], [17, 38, 31, 29], [24, 47, 34, 41], [32, 20, 44, 26]].forEach(([x1, y1, x2, y2]) => {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    });
    for (let index = 0; index < 12; index++) {
      context.fillStyle = random() > 0.45 ? 'rgba(255,191,105,.32)' : 'rgba(52,24,18,.24)';
      context.fillRect(14 + random() * 35, 18 + random() * 29, 0.8 + random(), 0.8 + random());
    }
  } else {
    roundedStroke(context, 'rgba(255, 205, 196, .58)', 1.45);
    [[16, 27, 30, 20], [14, 38, 29, 31], [23, 48, 34, 42]].forEach(([x1, y1, x2, y2]) => {
      context.beginPath();
      context.moveTo(x1, y1);
      context.bezierCurveTo(x1 + 4, y1 - 2, x2 - 5, y2 + 3, x2, y2);
      context.stroke();
    });
  }
}

export function createItemArtwork(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 144;
  canvas.height = 144;
  canvas.className = 'item-art item-art--canvas';
  canvas.dataset.itemId = `${item.id || 0}`;
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  context.scale(2.25, 2.25);
  context.imageSmoothingEnabled = true;
  const random = randomFor((item.id || 1) * 0x9e3779b1);
  if (item.tool === 'pickaxe') drawPick(context, item, random);
  else if (item.tool === 'axe') drawAxe(context, item, random);
  else if (item.tool === 'sword') drawSword(context, item);
  else if (item.category === 'relic') drawCore(context, item);
  else if (item.category === 'food') drawFood(context, item, item.cooked === true || /roast|cook/i.test(item.name || ''), random);
  else if (/ingot/i.test(item.name || '')) drawIngot(context, item, random);
  else drawRod(context, item);
  return canvas;
}
