/* Procedural lawn textures shared by the pattern studio and the before/after slider. */

/* ── Procedural lawn textures ─────────────────────────────── */

export function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function valueNoise(seed) {
  const rnd = mulberry32(seed);
  const grid = new Float32Array(64 * 64).map(() => rnd());
  const g = (i, j) => grid[(j & 63) * 64 + (i & 63)];
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = x - xi;
    const v = y - yi;
    const su = u * u * (3 - 2 * u);
    const sv = v * v * (3 - 2 * v);
    const a = g(xi, yi);
    const b = g(xi + 1, yi);
    const c = g(xi, yi + 1);
    const d = g(xi + 1, yi + 1);
    return a + (b - a) * su + (c - a) * sv + (a - b - c + d) * su * sv;
  };
}

export const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function isLight(pattern, x, y, s) {
  switch (pattern) {
    case 'plain':
      return true;
    case 'checker':
      return (Math.floor(x / s) + Math.floor(y / s)) % 2 === 0;
    case 'diagonal':
      return Math.floor((x + y) / (s * 1.05)) % 2 === 0;
    case 'diamond':
      return (Math.floor((x + y) / s) + Math.floor((x - y + 100000) / s)) % 2 === 0;
    default:
      return Math.floor(x / s) % 2 === 0;
  }
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Shared per-size noise ("grain") so pattern textures render quickly. */
export function buildGrain(W, H, scale) {
  const big = valueNoise(11);
  const mid = valueNoise(29);
  const grain = new Float32Array(W * H);
  const dry = new Float32Array(W * H);
  const rnd = mulberry32(5);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      grain[i] = mid(x / (26 * scale), y / (26 * scale)) * 0.6 + (rnd() - 0.5) * 0.4;
      dry[i] = smoothstep(0.6, 0.86, big(x / (110 * scale), y / (110 * scale)));
    }
  }
  return { grain, dry };
}

export function paintOvergrown(W, H, scale, noise) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(W, H);
  const px = img.data;
  for (let i = 0; i < W * H; i++) {
    const dry = noise.dry[i];
    const sh = 0.8 + noise.grain[i] * 0.35;
    px[i * 4] = (58 + 92 * dry) * sh;
    px[i * 4 + 1] = (100 + 38 * dry) * sh;
    px[i * 4 + 2] = (40 + 26 * dry) * sh;
    px[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const rnd = mulberry32(42);
  ctx.lineCap = 'round';
  const strokes = Math.round((W * H) / (55 * scale * scale));
  for (let k = 0; k < strokes; k++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const len = (9 + rnd() * 18) * scale;
    const a = -Math.PI / 2 + (rnd() - 0.5) * 1.9;
    const dryish = rnd() < 0.22;
    ctx.strokeStyle = dryish
      ? `rgba(${170 + rnd() * 40},${160 + rnd() * 30},${80 + rnd() * 30},0.55)`
      : `rgba(${50 + rnd() * 60},${100 + rnd() * 70},${35 + rnd() * 30},0.55)`;
    ctx.lineWidth = (0.8 + rnd() * 0.9) * scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (rnd() - 0.5) * 6 * scale, y + Math.sin(a) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  // Clover patches and dandelions: the "before" picture
  for (let k = 0; k < 14; k++) {
    const cx = rnd() * W;
    const cy = rnd() * H;
    for (let j = 0; j < 22; j++) {
      ctx.fillStyle = `rgba(${40 + rnd() * 20},${95 + rnd() * 30},${45 + rnd() * 15},0.8)`;
      ctx.beginPath();
      ctx.arc(cx + (rnd() - 0.5) * 34 * scale, cy + (rnd() - 0.5) * 24 * scale, (2.4 + rnd() * 2) * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let k = 0; k < 46; k++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = (2.6 + rnd() * 2.2) * scale;
    ctx.fillStyle = '#f2c81f';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe680';
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

export function paintPattern(W, H, scale, noise, pattern) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(W, H);
  const px = img.data;
  const s = 58 * scale;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const light = isLight(pattern, x, y, s);
      const sh = 0.94 + noise.grain[i] * 0.16;
      px[i * 4] = (light ? 132 : 60) * sh;
      px[i * 4 + 1] = (light ? 178 : 112) * sh;
      px[i * 4 + 2] = (light ? 78 : 48) * sh;
      px[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const rnd = mulberry32(7);
  ctx.lineCap = 'round';
  const strokes = Math.round((W * H) / (70 * scale * scale));
  for (let k = 0; k < strokes; k++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const light = isLight(pattern, x, y, s);
    const len = (3 + rnd() * 4) * scale;
    const a = -Math.PI / 2 + (light ? -0.45 : 0.45) + (rnd() - 0.5) * 0.5;
    ctx.strokeStyle = light ? 'rgba(178,214,118,0.35)' : 'rgba(28,72,30,0.35)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  return c;
}

export function drawMower(ctx, x, y, dir, colW) {
  const w = colW * 0.8;
  const h = colW * 0.62;
  ctx.save();
  ctx.translate(x, y);
  if (dir < 0) ctx.rotate(Math.PI);
  ctx.fillStyle = 'rgba(8,24,14,0.28)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-w / 2 + 4, -h + 6, w, h, 8) : ctx.rect(-w / 2 + 4, -h + 6, w, h);
  ctx.fill();
  ctx.fillStyle = '#0e2a18';
  [[-w / 2 - 3, -h + 4], [w / 2 - 5, -h + 4], [-w / 2 - 3, -14], [w / 2 - 5, -14]].forEach(([wx, wy]) => ctx.fillRect(wx, wy, 8, 12));
  ctx.fillStyle = '#e4b842';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-w / 2, -h, w, h, 8) : ctx.rect(-w / 2, -h, w, h);
  ctx.fill();
  ctx.fillStyle = 'rgba(14,42,24,0.3)';
  ctx.beginPath();
  ctx.arc(0, -h / 2, Math.min(w, h) * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f3f5ee';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-w * 0.32, -h);
  ctx.lineTo(-w * 0.26, -h - colW * 0.55);
  ctx.lineTo(w * 0.26, -h - colW * 0.55);
  ctx.lineTo(w * 0.32, -h);
  ctx.stroke();
  ctx.restore();
}

