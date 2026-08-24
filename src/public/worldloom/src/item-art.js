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

function paintPixelRows(context, rows, color, offsetX = 0, offsetY = 0) {
  context.fillStyle = color;
  for (const [y, x, width] of rows) context.fillRect(x + offsetX, y + offsetY, width, 1);
}

/**
 * An original 36px bone-in game cut built one scanline at a time. Keeping the
 * silhouette, marbling and sear marks on the same integer grid makes the art
 * stay crisp in the hotbar instead of turning into a soft red blob when scaled.
 */
function drawFood(context, item, cooked = false, random = Math.random) {
  const palette = cooked
    ? {
      shadow: '#261512', outline: '#3b1b16', rind: '#71301f', dark: '#8a3b25',
      meat: '#ad542e', light: '#d47a3d', fat: '#e6a761', boneShade: '#8d5b39',
      bone: '#e7c78d', marrow: '#744127', char: '#2b1713', sparkle: '#f0a75a',
    }
    : {
      shadow: '#32151d', outline: '#541f2b', rind: '#a64c57', dark: '#b63e4e',
      meat: '#d45762', light: '#f0837e', fat: '#f4b7aa', boneShade: '#9f665f',
      bone: '#f3d3bb', marrow: '#ad5861', char: '#6d2734', sparkle: '#ffc0ad',
    };
  const outline = [
    [7, 15, 7], [8, 12, 13], [9, 10, 17], [10, 8, 21], [11, 7, 23],
    [12, 6, 25], [13, 5, 27], [14, 4, 28], [15, 4, 29], [16, 3, 30],
    [17, 3, 30], [18, 3, 31], [19, 3, 31], [20, 4, 30], [21, 4, 29],
    [22, 5, 28], [23, 5, 27], [24, 6, 26], [25, 7, 24], [26, 8, 22],
    [27, 10, 19], [28, 12, 15], [29, 15, 9],
  ];
  const rind = [
    [9, 14, 9], [10, 11, 15], [11, 9, 19], [12, 8, 21], [13, 7, 23],
    [14, 6, 25], [15, 5, 27], [16, 5, 27], [17, 5, 28], [18, 5, 28],
    [19, 5, 28], [20, 6, 27], [21, 6, 26], [22, 7, 24], [23, 8, 22],
    [24, 9, 20], [25, 10, 18], [26, 12, 14], [27, 14, 10],
  ];
  const muscle = [
    [12, 14, 10], [13, 11, 15], [14, 9, 19], [15, 8, 21], [16, 7, 23],
    [17, 7, 23], [18, 7, 23], [19, 7, 23], [20, 8, 21], [21, 8, 20],
    [22, 9, 18], [23, 10, 16], [24, 12, 12], [25, 14, 8],
  ];

  paintPixelRows(context, outline, palette.shadow, 2, 3);
  paintPixelRows(context, outline, palette.outline);
  paintPixelRows(context, rind, palette.rind);
  paintPixelRows(context, muscle, palette.meat);

  // Stepped colour fields describe the cut's grain without anti-aliasing.
  context.fillStyle = palette.dark;
  context.fillRect(7, 17, 4, 5);
  context.fillRect(10, 22, 5, 3);
  context.fillRect(23, 13, 5, 3);
  context.fillRect(25, 21, 4, 3);
  context.fillStyle = palette.light;
  context.fillRect(12, 13, 7, 2);
  context.fillRect(10, 15, 5, 2);
  context.fillRect(9, 18, 4, 2);
  context.fillRect(15, 23, 5, 2);

  // A broken fat cap and two embedded seams keep raw and roasted variants
  // recognisable as the same item while still giving each a distinct finish.
  context.fillStyle = palette.fat;
  context.fillRect(12, 9, 8, 1);
  context.fillRect(9, 10, 8, 1);
  context.fillRect(7, 11, 5, 3);
  context.fillRect(5, 14, 2, 6);
  context.fillRect(6, 21, 2, 3);
  context.fillRect(13, 18, 2, 1);
  context.fillRect(14, 19, 4, 1);
  context.fillRect(17, 20, 3, 1);
  context.fillRect(18, 21, 2, 1);

  // T-shaped bone with a shaded marrow channel.
  context.fillStyle = palette.boneShade;
  context.fillRect(20, 15, 7, 2);
  context.fillRect(22, 16, 5, 8);
  context.fillRect(20, 22, 8, 3);
  context.fillStyle = palette.bone;
  context.fillRect(21, 15, 5, 2);
  context.fillRect(23, 17, 3, 6);
  context.fillRect(21, 22, 6, 2);
  context.fillStyle = palette.marrow;
  context.fillRect(23, 16, 2, 2);
  context.fillRect(24, 18, 1, 4);
  context.fillRect(22, 22, 3, 1);

  if (cooked) {
    context.fillStyle = palette.char;
    [[11, 15], [14, 17], [10, 20], [14, 22]].forEach(([x, y], index) => {
      context.fillRect(x, y, 8, 1);
      context.fillRect(x + 1, y + 1, 7 - (index % 2), 1);
    });
    context.fillStyle = palette.sparkle;
    context.fillRect(8, 14, 2, 1);
    context.fillRect(27, 18, 2, 1);
    context.fillRect(12, 25, 2, 1);
  } else {
    context.fillStyle = palette.sparkle;
    context.fillRect(10, 14, 4, 1);
    context.fillRect(8, 19, 3, 1);
    context.fillRect(15, 24, 3, 1);
    context.fillRect(27, 17, 2, 2);
    // Deterministic single-pixel moisture highlights prevent cloned stacks from
    // looking mechanically stamped without sacrificing the fixed pixel grid.
    for (let index = 0; index < 4; index++) {
      const x = 10 + Math.floor(random() * 9);
      const y = 16 + Math.floor(random() * 7);
      context.fillRect(x, y, 1, 1);
    }
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
  const random = randomFor((item.id || 1) * 0x9e3779b1);
  if (item.category === 'food') {
    context.imageSmoothingEnabled = false;
    context.scale(4, 4);
    drawFood(context, item, item.cooked === true || /roast|cook/i.test(item.name || ''), random);
  } else {
    context.scale(2.25, 2.25);
    context.imageSmoothingEnabled = true;
  }
  if (item.category === 'food') return canvas;
  if (item.tool === 'pickaxe') drawPick(context, item, random);
  else if (item.tool === 'axe') drawAxe(context, item, random);
  else if (item.tool === 'sword') drawSword(context, item);
  else if (item.category === 'relic') drawCore(context, item);
  else if (/ingot/i.test(item.name || '')) drawIngot(context, item, random);
  else drawRod(context, item);
  return canvas;
}
