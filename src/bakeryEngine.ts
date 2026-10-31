/**
 * Pastel-Sketch Engine & 3D Storybook Bakery Scene Renderer
 * Integrates kit/core math, pastel-sketch primitives, and the 12-layer Pretzel Baker Bear.
 */

export interface RenderOptions {
  showRoomEnvelope?: boolean;
  showFloor?: boolean;
  showWindow?: boolean;
  showShelves?: boolean;
  showBear?: boolean;
  showCounter?: boolean;
  showCounterProps?: boolean;
  showSunbeams?: boolean;
  showPaperTooth?: boolean;
  bearMode?: 'static' | '5layer' | '12layer';
  TT?: number;
  F?: number;
}

export const PB = {
  paper: '#faf6ec',
  ink: '#633d2e',
  inkSoft: '#9a6e54',
  inkLight: '#c8a686',
  furLight: '#fef5df',
  furMid: '#f9e7be',
  furShade: '#e4b97e',
  furDeep: '#ca9152',
  snout: '#fffcf5',
  nose: '#e27b8b',
  noseShade: '#c45b6c',
  eye: '#43271c',
  blush: '244,162,92',
  blushCore: '#f4a868',
  blushTick: '#c66a3d',
  apronLight: '#dedfca',
  apronMid: '#ced2b8',
  apronShade: '#b4baa0',
  apronDark: '#8e967a',
  pretzelLight: '#f6c27c',
  pretzelMid: '#e09446',
  pretzelDark: '#b36222',
};

export const BK = {
  wallBase: '#fcf8ee',
  wallWarm: '#f6eedc',
  wallShade: '#e8dbbf',
  wallDeep: '#c9b79c',
  skirtingWood: '#724a2e',
  beamWood: '#7a4e30',
  beamWoodDark: '#4e2d19',
  beamWoodHi: '#9c6a46',
  grout: '#ddceb8',
  tile1: '#d56f4e',
  tile2: '#c66140',
  tile3: '#de7e60',
  tile4: '#ba5032',
  tile5: '#cb6645',
  tileShade: '#96371d',
  windowWood: '#704c32',
  windowWoodDark: '#482f1d',
  windowWoodHi: '#966c4d',
  skyBlue: '#bde2f3',
  skyGlow: '#fff4d4',
  hillGreen: '#9bc47e',
  hillGreenDark: '#759e58',
  glassReflection: 'rgba(255,255,255,0.5)',
  shelfWood: '#c08e58',
  shelfWoodLight: '#dba76f',
  shelfWoodDark: '#82532a',
  shelfWoodDeep: '#563316',
  recessShadow: 'rgba(64,36,18,0.45)',
  counterTopLight: '#f4ce9b',
  counterTopMid: '#e4b67b',
  counterTopDark: '#c89255',
  counterFrontLight: '#b4814e',
  counterFrontMid: '#996736',
  counterFrontDark: '#6c431e',
  wickerLight: '#e6ba7c',
  wickerMid: '#c89452',
  wickerDark: '#865424',
  breadCrust: '#c87a32',
  breadDark: '#8b4516',
  breadLight: '#fae2b4',
  flourDust: '#ffffff',
  brass: '#d8ab44',
  brassDark: '#8a651e',
  brassHi: '#fce692',
  copper: '#c86f4a',
  copperDark: '#8c4224',
  copperHi: '#f09874',
  ceramicCream: '#faf6eb',
  ceramicBlue: '#4b7599',
  potClay: '#c46645',
  plantGreen: '#588850',
  plantGreenDark: '#385f32',
};

// Seeded PRNG and Math primitives
const TAU = Math.PI * 2;
const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const dist = (a: [number, number], b: [number, number]) => Math.hypot(b[0] - a[0], b[1] - a[1]);

export const EZ = {
  io: (t: number) => {
    t = clamp(t);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(...xs: (string | number)[]) {
  let h = 2166136261 >>> 0;
  for (const x of xs) {
    const s = String(x);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= 124;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function RNG(...xs: (string | number)[]) {
  const f = mulberry32(hash(...xs));
  return {
    f,
    r: (a: number, b: number) => a + (b - a) * f(),
    n: (amt: number) => (f() * 2 - 1) * amt,
  };
}

export function bezierPts(segs: [number, number][][], nPerSeg = 16): [number, number][] {
  const P: [number, number][] = [];
  for (let s = 0; s < segs.length; s++) {
    const raw = segs[s];
    let p0: [number, number], c1: [number, number], c2: [number, number], p1: [number, number];
    if (raw.length === 2) {
      p0 = raw[0];
      p1 = raw[1];
      c1 = [p0[0] + (p1[0] - p0[0]) * 0.33, p0[1] + (p1[1] - p0[1]) * 0.33];
      c2 = [p0[0] + (p1[0] - p0[0]) * 0.67, p0[1] + (p1[1] - p0[1]) * 0.67];
    } else if (raw.length === 3) {
      p0 = raw[0];
      c1 = raw[1];
      c2 = raw[1];
      p1 = raw[2];
    } else {
      p0 = raw[0];
      c1 = raw[1];
      c2 = raw[2];
      p1 = raw[3];
    }
    const m = s === segs.length - 1 ? nPerSeg : nPerSeg - 1;
    for (let i = 0; i <= m; i++) {
      const t = i / nPerSeg,
        u = 1 - t;
      const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0];
      const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1];
      P.push([x, y]);
    }
  }
  return P;
}

export function ellipsePts(cx: number, cy: number, rx: number, ry: number, rot = 0, n = 64): [number, number][] {
  const P: [number, number][] = [],
    c = Math.cos(rot),
    s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (TAU * i) / n;
    const x = Math.cos(a) * rx,
      y = Math.sin(a) * ry;
    P.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return P;
}

export function rrectPts(x: number, y: number, w: number, h: number, r: number, n = 6): [number, number][] {
  r = Math.min(r, w / 2, h / 2);
  const P: [number, number][] = [],
    cs: [number, number, number][] = [
      [x + w - r, y + r, -Math.PI / 2],
      [x + w - r, y + h - r, 0],
      [x + r, y + h - r, Math.PI / 2],
      [x + r, y + r, Math.PI],
    ];
  for (const [cx, cy, a0] of cs)
    for (let i = 0; i <= n; i++) {
      const a = a0 + (Math.PI / 2) * (i / n);
      P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  return P;
}

export function bbox(P: [number, number][], pad = 0) {
  let x0 = 1e9,
    y0 = 1e9,
    x1 = -1e9,
    y1 = -1e9;
  for (const [x, y] of P) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
}

function resample(P: [number, number][], closed: boolean, step: number): [number, number][] {
  const out: [number, number][] = [],
    n = P.length,
    m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = P[i],
      b = P[(i + 1) % n],
      k = Math.max(1, Math.ceil(dist(a, b) / step));
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  if (!closed) out.push(P[n - 1]);
  return out;
}

export function wobble(P: [number, number][], closed: boolean, amt: number, key: string, step = 7): [number, number][] {
  const Q = resample(P, closed, step),
    n = Q.length;
  const R = RNG('wob', key, 0);
  const f1 = R.r(0.012, 0.03),
    f2 = R.r(0.05, 0.1),
    p1 = R.r(0, TAU),
    p2 = R.r(0, TAU);
  const sx = R.n(amt * 0.5),
    sy = R.n(amt * 0.5);
  const out: [number, number][] = new Array(n);
  let s = 0;
  for (let i = 0; i < n; i++) {
    const a = Q[closed ? (i - 1 + n) % n : Math.max(0, i - 1)],
      b = Q[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    const nx = a[1] - b[1],
      ny = b[0] - a[0],
      l = Math.hypot(nx, ny) || 1;
    if (i) s += dist(Q[i - 1], Q[i]);
    const o = amt * (0.75 * Math.sin(s * f1 + p1) + 0.35 * Math.sin(s * f2 + p2));
    out[i] = [Q[i][0] + (nx / l) * o + sx, Q[i][1] + (ny / l) * o + sy];
  }
  return out;
}

export function trace(ctx: CanvasRenderingContext2D, P: [number, number][], closed: boolean) {
  ctx.beginPath();
  const n = P.length;
  if (n < 2) return;
  if (closed) {
    ctx.moveTo((P[n - 1][0] + P[0][0]) / 2, (P[n - 1][1] + P[0][1]) / 2);
    for (let i = 0; i < n; i++) {
      const p = P[i],
        q = P[(i + 1) % n];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.closePath();
  } else {
    ctx.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < n - 1; i++) {
      const p = P[i],
        q = P[i + 1];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.lineTo(P[n - 1][0], P[n - 1][1]);
  }
}

export function pencil(
  ctx: CanvasRenderingContext2D,
  bb: { x0: number; y0: number; x1: number; y1: number },
  o: { key?: string; c?: string; al?: number; per?: number; len?: number; a?: number; w?: number; max?: number } = {}
) {
  const w = bb.x1 - bb.x0,
    h = bb.y1 - bb.y0;
  if (w <= 0 || h <= 0) return;
  const count = Math.min(o.max ?? 2000, Math.floor((w * h) / (o.per ?? 90)));
  const R = RNG('pnc', o.key ?? 'p', 0);
  const ang = o.a ?? -0.65,
    ca = Math.cos(ang),
    sa = Math.sin(ang),
    len = o.len ?? 14;
  ctx.save();
  ctx.strokeStyle = o.c || PB.ink;
  ctx.lineWidth = o.w ?? 1.2;
  ctx.globalAlpha = o.al ?? 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const x = R.r(bb.x0, bb.x1),
      y = R.r(bb.y0, bb.y1);
    const l = R.r(len * 0.5, len * 1.3);
    ctx.moveTo(x - (ca * l) / 2, y - (sa * l) / 2);
    ctx.lineTo(x + (ca * l) / 2, y + (sa * l) / 2);
  }
  ctx.stroke();
  ctx.restore();
}

export function psLine(ctx: CanvasRenderingContext2D, P: [number, number][], o: any = {}) {
  const closed = !!o.closed,
    key = o.key ?? 'psl',
    w = o.w ?? 3.5,
    col = o.col ?? PB.ink,
    amt = o.amt ?? 1.15;
  const Q1 = wobble(P, closed, amt, key, o.step ?? 7);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.globalAlpha = o.a ?? 0.92;
  if (o.dash) ctx.setLineDash(o.dash);
  trace(ctx, Q1, closed);
  ctx.stroke();
  if (o.second !== false && !o.dash) {
    const Q2 = wobble(P, closed, amt * 1.45 + 0.35, key + '~', o.step ?? 7);
    ctx.strokeStyle = o.col2 ?? PB.inkSoft;
    ctx.lineWidth = w * 0.55;
    ctx.globalAlpha = (o.a ?? 0.92) * 0.48;
    trace(ctx, Q2, closed);
    ctx.stroke();
  }
  ctx.restore();
  return Q1;
}

export function psShape(ctx: CanvasRenderingContext2D, P: [number, number][], fill: string, o: any = {}) {
  const key = o.key ?? 'pss',
    amt = o.amt ?? 1.1;
  const Q = o.raw ? P : wobble(P, true, amt, key, o.step ?? 7);
  ctx.save();
  if (o.shadow) {
    ctx.shadowColor = o.shCol ?? 'rgba(99,61,46,0.15)';
    ctx.shadowBlur = o.shBlur ?? 10;
    ctx.shadowOffsetX = o.shX ?? 1;
    ctx.shadowOffsetY = o.shY ?? 4;
  }
  trace(ctx, Q, true);
  ctx.fillStyle = fill;
  ctx.globalAlpha = o.fillA ?? 1;
  ctx.fill();
  ctx.restore();

  if (o.grad || o.crayon || o.innerFn) {
    ctx.save();
    trace(ctx, Q, true);
    ctx.clip();
    const bb = bbox(Q, 4);
    if (o.grad) o.grad(bb);
    if (o.crayon) {
      pencil(ctx, bb, {
        key: key + 'cr',
        c: o.crayon,
        al: o.crAl ?? 0.14,
        per: o.crPer ?? 90,
        len: o.crLen ?? 14,
        a: o.crA ?? -0.65,
        w: 1.2,
        max: 2200,
      });
    }
    if (o.innerFn) o.innerFn(bb);
    ctx.restore();
  }

  if (o.line !== false) {
    psLine(ctx, P, {
      closed: true,
      key: key + 'L',
      w: o.w ?? 3.5,
      col: o.line ?? PB.ink,
      col2: o.line2 ?? PB.inkSoft,
      amt,
      a: o.lineA ?? 0.92,
      second: o.second,
    });
  }
  return Q;
}

export function psBlush(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  col = '244,162,92',
  a = 0.68,
  rot = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(1, ry / rx);
  const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  gr.addColorStop(0, `rgba(${col},${a})`);
  gr.addColorStop(0.65, `rgba(${col},${a * 0.72})`);
  gr.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function psHatchArc(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  dx: number,
  dy: number,
  col: string,
  w = 1.4,
  a = 0.36,
  key = 'ha'
) {
  for (let i = 0; i < pts.length; i++) {
    const [sx, sy] = pts[i];
    psLine(ctx, [[sx, sy], [sx + dx, sy + dy]], { key: key + i, w, col, a, second: false, amt: 0.45 });
  }
}

export function withPivot(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  rot = 0,
  sx = 1,
  sy = 1,
  dx = 0,
  dy = 0,
  fn: () => void
) {
  ctx.save();
  ctx.translate(px + dx, py + dy);
  if (rot) ctx.rotate(rot);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.translate(-px, -py);
  fn();
  ctx.restore();
}

// ---------------------------------------------------------------------
//  PRETZEL BAKER BEAR RENDERER
// ---------------------------------------------------------------------
export function drawPretzelBear(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sc = 1,
  o: any = {}
) {
  const key = o.key ?? 'pb';
  const mode = o.mode ?? 'static';
  const isStatic = mode === 'static';
  const is12 = mode === '12layer';
  const wFreq = TAU / 3.0;
  const ttVal = o.TT ?? 0;
  const fVal = o.F ?? 0;

  const proudEnv = is12 ? EZ.io(seg(ttVal, 1.6, 2.3)) * (1 - EZ.io(seg(ttVal, 4.1, 4.8))) : 0;
  const breath = isStatic ? 0 : Math.sin(ttVal * wFreq) * 0.012 + proudEnv * 0.012;
  const bodySway = is12 ? Math.sin(ttVal * wFreq * 0.5) * 0.012 : 0;
  const headTilt = isStatic
    ? 0
    : Math.sin(ttVal * wFreq - 0.3) * 0.028 + (is12 ? Math.sin(ttVal * wFreq * 0.5 + 0.4) * 0.022 : 0);
  const headBobY = isStatic ? 0 : Math.sin(ttVal * wFreq * 2 - 0.2) * 2.2 - proudEnv * 4.5;
  const earRotL = isStatic
    ? 0
    : Math.sin(ttVal * wFreq - 0.85) * 0.025 + (is12 ? Math.sin(ttVal * TAU * 2.0) * proudEnv * 0.022 : 0);
  const earRotR = isStatic
    ? 0
    : -Math.sin(ttVal * wFreq - 1.05) * 0.025 - (is12 ? Math.sin(ttVal * TAU * 2.0 + 0.5) * proudEnv * 0.022 : 0);
  const tailRot = isStatic ? 0 : Math.sin(ttVal * wFreq * (is12 ? 2 : 1) - 0.6) * (is12 ? 0.14 : 0.08);
  const bowRot = isStatic ? 0 : Math.sin(ttVal * wFreq - 0.9) * 0.065;
  const bowTailRot = isStatic ? 0 : is12 ? Math.sin(ttVal * wFreq * 2 - 1.2) * 0.09 : bowRot;
  const tabRot = is12 ? Math.sin(ttVal * wFreq - 0.5) * 0.06 : 0;
  const sniffWave = is12 ? Math.sin(ttVal * TAU * 2.5) * proudEnv : 0;
  const muzzleDy = isStatic ? 0 : -Math.abs(sniffWave) * 3.2 - proudEnv * 1.5;
  const noseScale = isStatic ? 1 : 1 + Math.abs(sniffWave) * 0.08;
  const blushBoost = proudEnv * 0.18;
  const isBlink = !isStatic && ((fVal >= 34 && fVal <= 37) || (fVal >= 112 && fVal <= 115));
  const happyEyes = is12 && ttVal >= 2.2 && ttVal <= 4.1;
  const eyeLookX = is12 ? Math.sin(ttVal * wFreq * 0.5) * 2.2 : 0;
  const eyeLookY = is12 ? -proudEnv * 2.0 : 0;
  const armBobY = isStatic ? 0 : Math.sin(ttVal * wFreq - 0.4) * 3.5 - proudEnv * 11.0;
  const armScale = isStatic ? 1 : 1 + proudEnv * 0.035;
  const pawSqueeze = is12 ? Math.sin(ttVal * wFreq * 2) * 1.5 : 0;
  const pocketDy = armBobY * 0.18;
  const toeTapL = is12 ? Math.max(0, Math.sin(ttVal * wFreq)) * 0.035 : 0;
  const toeTapR = is12 ? Math.max(0, -Math.sin(ttVal * wFreq)) * 0.035 : 0;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sc, sc);
  ctx.translate(-500, -520);

  psBlush(ctx, 495, 878, 175 * (1 + breath * 0.5), 18, '150,105,70', 0.15);

  // 1. Stubby Legs & Feet
  withPivot(ctx, 375, 880, -toeTapL, 1, 1, 0, 0, () => {
    const leftLegP = bezierPts([
      [[302, 622], [294, 685], [306, 775], [338, 852]],
      [[338, 852], [352, 882], [392, 888], [435, 886]],
      [[435, 886], [478, 884], [496, 872], [492, 848]],
      [[492, 848], [488, 832], [478, 818], [482, 780]],
      [[482, 780], [440, 755], [355, 650], [302, 622]],
    ], 16);
    psShape(ctx, leftLegP, PB.furMid, {
      key: key + 'legL',
      w: 3.8,
      line: PB.ink,
      line2: PB.inkSoft,
      amt: 1.15,
      crayon: PB.furShade,
      crAl: 0.18,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y0);
        g.addColorStop(0, PB.furDeep);
        g.addColorStop(0.28, PB.furShade);
        g.addColorStop(0.68, PB.furMid);
        g.addColorStop(1, PB.furLight);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        psBlush(ctx, 420, 782, 85, 26, '198,138,76', 0.68, 0.12);
        psBlush(ctx, 405, 878, 75, 20, '206,148,86', 0.65);
        const hipPts: [number, number][] = [];
        for (let i = 0; i < 18; i++) hipPts.push([304 + i * 2.2, 640 + i * 11.5]);
        psHatchArc(ctx, hipPts, 14, 8, PB.furDeep, 1.5, 0.42, key + 'lhL');
      },
    });
    psLine(ctx, [[433, 884], [431, 862]], { key: key + 'toeL1', w: 3.4, col: PB.ink, col2: PB.inkSoft });
    psLine(ctx, [[470, 881], [465, 859]], { key: key + 'toeL2', w: 3.4, col: PB.ink, col2: PB.inkSoft });
  });

  withPivot(ctx, 575, 880, toeTapR, 1, 1, 0, 0, () => {
    const rightLegP = bezierPts([
      [[524, 780], [526, 822], [532, 858], [548, 874]],
      [[548, 874], [568, 886], [625, 886], [656, 874]],
      [[656, 874], [672, 864], [668, 842], [654, 822]],
      [[654, 822], [652, 798], [664, 772], [672, 752]],
      [[672, 752], [610, 762], [555, 774], [524, 780]],
    ], 16);
    psShape(ctx, rightLegP, PB.furMid, {
      key: key + 'legR',
      w: 3.8,
      line: PB.ink,
      line2: PB.inkSoft,
      amt: 1.15,
      crayon: PB.furShade,
      crAl: 0.18,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y0);
        g.addColorStop(0, PB.furDeep);
        g.addColorStop(0.32, PB.furShade);
        g.addColorStop(0.65, PB.furMid);
        g.addColorStop(1, PB.furLight);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        psBlush(ctx, 600, 778, 85, 28, '195,134,72', 0.78, -0.12);
        psBlush(ctx, 595, 878, 68, 18, '206,148,86', 0.65);
        const rLegPts: [number, number][] = [];
        for (let i = 0; i < 10; i++) rLegPts.push([530 + i * 1.5, 790 + i * 8]);
        psHatchArc(ctx, rLegPts, 14, 6, PB.furDeep, 1.5, 0.45, key + 'lhR');
      },
    });
    psLine(ctx, [[614, 883], [610, 860]], { key: key + 'toeR1', w: 3.4, col: PB.ink, col2: PB.inkSoft });
    psLine(ctx, [[646, 878], [640, 856]], { key: key + 'toeR2', w: 3.4, col: PB.ink, col2: PB.inkSoft });
  });

  // Breathing Torso
  withPivot(ctx, 500, 820, bodySway, 1 - breath * 0.35, 1 + breath, 0, 0, () => {
    withPivot(ctx, 308, 715, tailRot, 1, 1, 0, 0, () => {
      const tailP = bezierPts([
        [[302, 680], [268, 684], [266, 734], [296, 746]],
        [[296, 746], [312, 750], [320, 728], [314, 698]],
      ], 16);
      psShape(ctx, tailP, PB.furShade, {
        key: key + 'tail',
        w: 3.6,
        line: PB.ink,
        line2: PB.inkSoft,
        amt: 1.15,
        grad: (bb: any) => {
          const g = ctx.createRadialGradient(290, 710, 4, 295, 716, 35);
          g.addColorStop(0, PB.furMid);
          g.addColorStop(1, PB.furDeep);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
      });
    });

    withPivot(ctx, 298, 620, bowRot, 1, 1, 0, 0, () => {
      psShape(
        ctx,
        bezierPts([
          [[300, 610], [268, 592], [252, 606], [262, 624]],
          [[262, 624], [270, 634], [288, 628], [300, 620]],
        ], 16),
        PB.apronLight,
        { key: key + 'bowLoop1', w: 2.9, line: PB.ink, line2: PB.inkSoft, crayon: PB.apronShade }
      );
      psShape(
        ctx,
        bezierPts([
          [[298, 620], [272, 626], [262, 648], [270, 658]],
          [[270, 658], [278, 663], [292, 644], [300, 628]],
        ], 16),
        PB.apronMid,
        { key: key + 'bowLoop2', w: 2.9, line: PB.ink, line2: PB.inkSoft }
      );
      withPivot(ctx, 298, 634, bowTailRot, 1, 1, 0, 0, () => {
        psShape(ctx, [[295, 630], [256, 678], [268, 690], [302, 642]], PB.apronLight, {
          key: key + 'bowTail',
          w: 2.9,
          line: PB.ink,
          line2: PB.inkSoft,
        });
      });
      psShape(ctx, [[296, 604], [342, 624], [340, 640], [296, 622]], PB.apronShade, {
        key: key + 'waistTie',
        w: 2.9,
        line: PB.ink,
        line2: PB.inkSoft,
      });
    });

    const chestFurP = bezierPts([
      [[338, 395], [420, 415], [580, 415], [652, 398]],
      [[652, 398], [665, 450], [645, 505], [595, 505]],
      [[595, 505], [500, 510], [405, 510], [345, 495]],
      [[345, 495], [328, 455], [332, 420], [338, 395]],
    ], 16);
    psShape(ctx, chestFurP, PB.furMid, {
      key: key + 'chestFur',
      w: 3.2,
      line: false,
      crayon: PB.furShade,
      crAl: 0.22,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
        g.addColorStop(0, PB.furShade);
        g.addColorStop(0.5, PB.furMid);
        g.addColorStop(1, PB.furLight);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
    });

    withPivot(ctx, 344, 405, tabRot, 1, 1, 0, 0, () => {
      psShape(ctx, [[345, 400], [310, 386], [306, 402], [342, 414]], PB.apronMid, {
        key: key + 'strapTabL',
        w: 2.8,
        line: PB.ink,
        line2: PB.inkSoft,
      });
    });

    const apronP = bezierPts([
      [[352, 404], [364, 432], [378, 460], [385, 495]],
      [[385, 495], [352, 575], [336, 665], [328, 768]],
      [[328, 768], [435, 810], [585, 810], [706, 756]],
      [[706, 756], [696, 662], [682, 582], [642, 495]],
      [[642, 495], [634, 462], [644, 434], [648, 410]],
      [[648, 410], [636, 404], [620, 434], [604, 468]],
      [[604, 468], [545, 476], [465, 478], [412, 474]],
      [[412, 474], [388, 444], [368, 416], [352, 404]],
    ], 16);
    psShape(ctx, apronP, PB.apronMid, {
      key: key + 'apronMain',
      w: 3.5,
      line: PB.ink,
      line2: PB.inkSoft,
      amt: 1.15,
      crayon: PB.apronShade,
      crAl: 0.22,
      crA: 1.48,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y0);
        g.addColorStop(0, PB.apronShade);
        g.addColorStop(0.24, PB.apronMid);
        g.addColorStop(0.72, PB.apronLight);
        g.addColorStop(1, PB.apronMid);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        const apPts: [number, number][] = [];
        for (let i = 0; i < 14; i++) apPts.push([336 + i * 4.5, 632]);
        psHatchArc(ctx, apPts, -5, 125, PB.apronDark, 1.4, 0.22, key + 'apH');
        psBlush(ctx, 510, 582 + armBobY * 0.7, 92, 34, '125,138,112', 0.32);
        psBlush(ctx, 385, 630 + armBobY * 0.7, 55, 18, '125,138,112', 0.35, 0.1);
        psBlush(ctx, 635, 622 + armBobY * 0.7, 52, 16, '125,138,112', 0.32, -0.1);
      },
    });

    psLine(ctx, bezierPts([[[338, 756], [438, 796], [582, 796], [696, 744]]], 24), {
      key: key + 'hemStitch',
      w: 2.0,
      col: PB.inkSoft,
      dash: [6, 7],
      second: false,
      amt: 0.5,
    });
    psLine(ctx, [[344, 635], [336, 752]], {
      key: key + 'sideStitchL',
      w: 1.9,
      col: PB.inkSoft,
      dash: [5, 7],
      second: false,
      amt: 0.45,
    });

    withPivot(ctx, 516, 690, 0, 1, 1, 0, pocketDy, () => {
      psBlush(ctx, 516, 730, 72, 22, '125,135,108', 0.38);
      const pocketP = bezierPts([
        [[438, 642], [490, 648], [545, 646], [596, 638]],
        [[596, 638], [602, 682], [596, 718], [568, 732]],
        [[568, 732], [542, 742], [492, 742], [464, 732]],
        [[464, 732], [438, 718], [434, 682], [438, 642]],
      ], 16);
      psShape(ctx, pocketP, PB.apronMid, {
        key: key + 'pocket',
        w: 2.9,
        line: PB.ink,
        line2: PB.inkSoft,
        amt: 1.15,
        crayon: PB.apronShade,
        crAl: 0.18,
        grad: (bb: any) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
          g.addColorStop(0, PB.apronShade);
          g.addColorStop(0.45, PB.apronMid);
          g.addColorStop(1, PB.apronLight);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
      });
      const pocketStitchP = bezierPts([
        [[448, 652], [445, 682], [448, 712], [470, 724]],
        [[470, 724], [495, 732], [540, 732], [564, 724]],
        [[564, 724], [586, 712], [590, 682], [586, 648]],
      ], 14);
      psLine(ctx, pocketStitchP, { key: key + 'pktStitch', w: 1.9, col: PB.inkSoft, dash: [5, 6], second: false, amt: 0.45 });
    });

    // 5. Head, Ears, Snout, Eyes & Blush
    withPivot(ctx, 500, 420, headTilt, 1, 1, 0, headBobY, () => {
      const earLP = bezierPts([
        [[342, 232], [310, 206], [312, 160], [340, 144]],
        [[340, 144], [366, 128], [400, 146], [408, 174]],
      ], 16);
      const earInLP = bezierPts([
        [[346, 204], [334, 188], [338, 166], [354, 160]],
        [[354, 160], [368, 155], [380, 164], [380, 178]],
      ], 16);
      withPivot(ctx, 375, 198, earRotL, 1, 1, 0, 0, () => {
        psShape(ctx, earLP, PB.furMid, {
          key: key + 'earL',
          line: false,
          crayon: PB.furShade,
          crAl: 0.16,
          grad: (bb: any) => {
            const g = ctx.createRadialGradient(362, 178, 5, 360, 178, 46);
            g.addColorStop(0, PB.furLight);
            g.addColorStop(1, PB.furShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
        });
        psShape(ctx, earInLP, PB.furShade, {
          key: key + 'earInL',
          line: false,
          grad: (bb: any) => {
            const g = ctx.createRadialGradient(358, 180, 2, 358, 180, 24);
            g.addColorStop(0, PB.furDeep);
            g.addColorStop(1, PB.furShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
        });
        psLine(ctx, earInLP, { key: key + 'earInLineL', w: 2.5, col: PB.inkSoft });
      });

      const earRP = bezierPts([
        [[578, 168], [588, 138], [618, 126], [644, 144]],
        [[644, 144], [668, 160], [666, 204], [636, 222]],
      ], 16);
      const earInRP = bezierPts([
        [[604, 174], [606, 158], [620, 152], [634, 162]],
        [[634, 162], [646, 172], [642, 192], [628, 198]],
      ], 16);
      withPivot(ctx, 608, 195, earRotR, 1, 1, 0, 0, () => {
        psShape(ctx, earRP, PB.furMid, {
          key: key + 'earR',
          line: false,
          crayon: PB.furShade,
          crAl: 0.16,
          grad: (bb: any) => {
            const g = ctx.createRadialGradient(622, 174, 5, 622, 174, 46);
            g.addColorStop(0, PB.furLight);
            g.addColorStop(1, PB.furShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
        });
        psShape(ctx, earInRP, PB.furShade, {
          key: key + 'earInR',
          line: false,
          grad: (bb: any) => {
            const g = ctx.createRadialGradient(624, 176, 2, 624, 176, 24);
            g.addColorStop(0, PB.furDeep);
            g.addColorStop(1, PB.furShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
        });
        psLine(ctx, earInRP, { key: key + 'earInLineR', w: 2.5, col: PB.inkSoft });
      });

      const headP = bezierPts([
        [[495, 144], [558, 144], [610, 166], [636, 214]],
        [[636, 214], [662, 260], [676, 306], [670, 346]],
        [[670, 346], [662, 390], [616, 424], [545, 434]],
        [[545, 434], [472, 440], [395, 430], [348, 394]],
        [[348, 394], [312, 366], [312, 312], [332, 246]],
        [[332, 246], [352, 182], [422, 144], [495, 144]],
      ], 20);
      psShape(ctx, headP, PB.furMid, {
        key: key + 'head',
        line: false,
        crayon: PB.furShade,
        crAl: 0.14,
        grad: (bb: any) => {
          const g = ctx.createRadialGradient(505, 265, 30, 500, 290, 210);
          g.addColorStop(0, PB.furLight);
          g.addColorStop(0.68, PB.furMid);
          g.addColorStop(1, PB.furShade);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psBlush(ctx, 365, 378, 68, 45, '224,176,116', 0.48);
          psBlush(ctx, 625, 382, 58, 38, '224,176,116', 0.42);
          psBlush(ctx, 495, 428, 95, 28, '220,170,110', 0.45);
          const jawLPts: [number, number][] = [];
          for (let i = 0; i < 14; i++) {
            const t = i / 13;
            jawLPts.push([322 + t * 95, 348 + t * 76 + Math.sin(t * 3) * 6]);
          }
          psHatchArc(ctx, jawLPts, 10, 6, PB.furDeep, 1.3, 0.38, key + 'jawHL');
          const jawRPts: [number, number][] = [];
          for (let i = 0; i < 12; i++) {
            const t = i / 11;
            jawRPts.push([664 - t * 75, 348 + t * 70 + Math.sin(t * 3) * 5]);
          }
          psHatchArc(ctx, jawRPts, -10, 6, PB.furDeep, 1.3, 0.35, key + 'jawHR');
          const chinPts: [number, number][] = [];
          for (let i = 0; i < 16; i++) chinPts.push([410 + i * 11.5, 430 + Math.sin(i * 0.25) * 5]);
          psHatchArc(ctx, chinPts, -4, 12, PB.furDeep, 1.3, 0.35, key + 'chinH');
        },
      });

      withPivot(ctx, 375, 198, earRotL, 1, 1, 0, 0, () =>
        psLine(ctx, earLP, { key: key + 'earOutL', w: 3.8, col: PB.ink, col2: PB.inkSoft })
      );
      withPivot(ctx, 608, 195, earRotR, 1, 1, 0, 0, () =>
        psLine(ctx, earRP, { key: key + 'earOutR', w: 3.8, col: PB.ink, col2: PB.inkSoft })
      );

      psLine(
        ctx,
        bezierPts([[[396, 422], [346, 398], [314, 358], [318, 306]], [[318, 306], [320, 272], [328, 245], [342, 224]]], 18),
        { key: key + 'headCheekL', w: 3.8, col: PB.ink, col2: PB.inkSoft }
      );
      psLine(ctx, bezierPts([[[398, 162], [428, 146], [460, 143], [488, 143]]], 14), {
        key: key + 'headCrownL',
        w: 3.8,
        col: PB.ink,
        col2: PB.inkSoft,
      });
      const tuftDy = is12 ? Math.sin(ttVal * wFreq * 2 - 0.5) * 1.5 : 0;
      psLine(ctx, [[482, 144], [498, 136 + tuftDy], [492, 145], [512, 139 + tuftDy]], {
        key: key + 'crownTuft',
        w: 3.2,
        col: PB.ink,
        second: false,
      });
      psLine(ctx, bezierPts([[[502, 142], [534, 143], [564, 150], [588, 162]]], 14), {
        key: key + 'headCrownR',
        w: 3.8,
        col: PB.ink,
        col2: PB.inkSoft,
      });
      psLine(
        ctx,
        bezierPts([[[636, 214], [660, 254], [672, 300], [672, 340]], [[672, 340], [670, 380], [644, 408], [604, 424]]], 18),
        { key: key + 'headCheekR', w: 3.8, col: PB.ink, col2: PB.inkSoft }
      );

      psLine(ctx, [[320, 312], [313, 322]], { key: key + 'cTuftL1', w: 2.8, col: PB.ink, second: false });
      psLine(ctx, [[318, 330], [313, 340]], { key: key + 'cTuftL2', w: 2.8, col: PB.ink, second: false });
      psLine(ctx, [[669, 298], [676, 308]], { key: key + 'cTuftR1', w: 2.8, col: PB.ink, second: false });

      psShape(
        ctx,
        ellipsePts(406, 338, 38 * (1 + proudEnv * 0.06), 22 * (1 + proudEnv * 0.06), 0.05, 24),
        PB.blushCore,
        { key: key + 'blushShapeL', line: false, fillA: 0.52 + blushBoost, crayon: '#e88b48', crAl: 0.25 }
      );
      psBlush(ctx, 406, 338, 45, 28, PB.blush, 0.55 + blushBoost, 0.05);
      psShape(
        ctx,
        ellipsePts(608, 332, 36 * (1 + proudEnv * 0.06), 21 * (1 + proudEnv * 0.06), -0.05, 24),
        PB.blushCore,
        { key: key + 'blushShapeR', line: false, fillA: 0.52 + blushBoost, crayon: '#e88b48', crAl: 0.25 }
      );
      psBlush(ctx, 608, 332, 43, 27, PB.blush, 0.55 + blushBoost, -0.05);

      for (let i = 0; i < 4; i++) {
        psLine(ctx, [[387 + i * 9.5, 332], [381 + i * 9.5, 344]], {
          key: key + 'blTickL' + i,
          w: 1.9,
          col: PB.blushTick,
          a: 0.72,
          second: false,
          amt: 0.45,
        });
        psLine(ctx, [[593 + i * 9, 325], [587 + i * 9, 337]], {
          key: key + 'blTickR' + i,
          w: 1.9,
          col: PB.blushTick,
          a: 0.72,
          second: false,
          amt: 0.45,
        });
      }

      withPivot(ctx, 510, 340, 0, 1, 1, 0, muzzleDy, () => {
        const muzzleP = bezierPts([
          [[510, 294], [542, 294], [558, 316], [558, 340]],
          [[558, 340], [558, 366], [536, 380], [510, 380]],
          [[510, 380], [482, 380], [462, 366], [462, 340]],
          [[462, 340], [462, 316], [478, 294], [510, 294]],
        ], 16);
        psShape(ctx, muzzleP, PB.snout, {
          key: key + 'muzzle',
          w: 1.8,
          line: PB.inkLight,
          second: false,
          grad: (bb: any) => {
            const g = ctx.createRadialGradient(510, 330, 8, 510, 342, 52);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.72, PB.snout);
            g.addColorStop(1, '#f3e1c3');
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
        });

        withPivot(ctx, 512, 320, 0, noseScale, noseScale, 0, 0, () => {
          const noseP = bezierPts([
            [[512, 310], [526, 310], [530, 316], [524, 323]],
            [[524, 323], [518, 329], [514, 331], [512, 331]],
            [[512, 331], [510, 331], [506, 329], [500, 323]],
            [[500, 323], [494, 316], [498, 310], [512, 310]],
          ], 16);
          psShape(ctx, noseP, PB.nose, {
            key: key + 'nose',
            w: 2.6,
            line: PB.ink,
            second: false,
            grad: (bb: any) => {
              const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
              g.addColorStop(0, '#f49ca9');
              g.addColorStop(1, PB.noseShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
          });
        });
        psLine(ctx, [[512, 331], [512, 352]], { key: key + 'philtrum', w: 2.6, col: PB.ink, second: false, amt: 0.35 });
        if (proudEnv > 0.35) {
          psLine(ctx, bezierPts([[[503, 351], [508, 356], [516, 356], [521, 351]]], 8), {
            key: key + 'smile',
            w: 2.2,
            col: PB.ink,
            a: proudEnv * 0.85,
            second: false,
            amt: 0.3,
          });
        }
      });

      for (const [s, ex0, ey0] of [[-1, 435, 302], [1, 576, 296]]) {
        const ex = ex0 + eyeLookX,
          ey = ey0 + eyeLookY;
        if (happyEyes) {
          psLine(ctx, bezierPts([[[ex - 11, ey + 4], [ex - 5, ey - 9], [ex + 5, ey - 9], [ex + 11, ey + 4]]], 12), {
            key: key + 'happyEye' + s,
            w: 3.6,
            col: PB.eye,
            col2: PB.inkSoft,
          });
        } else if (isBlink) {
          psLine(ctx, bezierPts([[[ex - 10, ey + 1], [ex - 4, ey + 5], [ex + 4, ey + 5], [ex + 10, ey + 1]]], 10), {
            key: key + 'blinkEye' + s,
            w: 3.4,
            col: PB.eye,
            second: false,
          });
        } else {
          psShape(ctx, ellipsePts(ex, ey, 9.2, 13.0, s * 0.04, 20), PB.eye, {
            key: key + 'eye' + s,
            w: 2.0,
            line: '#311a12',
            second: false,
            grad: (bb: any) => {
              const g = ctx.createRadialGradient(ex - 2, ey - 3, 1, ex, ey, 14);
              g.addColorStop(0, '#5a3628');
              g.addColorStop(0.5, '#3e2319');
              g.addColorStop(1, '#2a160f');
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
          });
        }
      }
    });

    // 6. Bent Arms & Bavarian Pretzel
    withPivot(ctx, 512, 548, 0, armScale, armScale, 0, armBobY, () => {
      const pretzelOuter = bezierPts([
        [[512, 504], [534, 480], [572, 484], [582, 514]],
        [[582, 514], [590, 538], [576, 570], [562, 586]],
        [[562, 586], [542, 610], [480, 610], [460, 586]],
        [[460, 586], [440, 564], [436, 524], [450, 502]],
        [[450, 502], [466, 482], [496, 484], [512, 504]],
      ], 16);
      psShape(ctx, pretzelOuter, PB.pretzelMid, {
        key: key + 'pretzelBody',
        w: 3.3,
        line: PB.ink,
        line2: PB.inkSoft,
        crayon: PB.pretzelDark,
        crAl: 0.2,
        grad: (bb: any) => {
          const g = ctx.createRadialGradient(508, 530, 12, 512, 548, 82);
          g.addColorStop(0, PB.pretzelLight);
          g.addColorStop(0.58, PB.pretzelMid);
          g.addColorStop(1, PB.pretzelDark);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psLine(ctx, [[456, 512], [472, 496], [494, 498]], { key: key + 'pHiL', w: 3.2, col: '#fae0a8', a: 0.65, second: false });
          psLine(ctx, [[528, 498], [552, 495], [568, 510]], { key: key + 'pHiR', w: 3.2, col: '#fae0a8', a: 0.65, second: false });
        },
      });

      psShape(
        ctx,
        bezierPts([[[468, 516], [484, 510], [496, 522], [492, 538]], [[492, 538], [488, 548], [474, 558], [464, 548]], [[464, 548], [456, 538], [458, 522], [468, 516]]], 16),
        PB.apronShade,
        { key: key + 'pHoleTL', w: 2.9, line: PB.ink, line2: PB.inkSoft }
      );
      psShape(
        ctx,
        bezierPts([[[532, 518], [544, 508], [560, 514], [562, 532]], [[562, 532], [564, 546], [554, 554], [542, 546]], [[542, 546], [532, 538], [526, 526], [532, 518]]], 16),
        PB.apronShade,
        { key: key + 'pHoleTR', w: 2.9, line: PB.ink, line2: PB.inkSoft }
      );
      psShape(
        ctx,
        bezierPts([[[495, 574], [512, 566], [527, 574], [523, 583]], [[523, 583], [514, 589], [502, 589], [495, 574]]], 16),
        PB.apronShade,
        { key: key + 'pHoleBot', w: 2.7, line: PB.ink, line2: PB.inkSoft }
      );

      psLine(ctx, bezierPts([[[510, 522], [500, 538], [486, 556], [474, 568]]], 12), {
        key: key + 'twistUnder1',
        w: 2.8,
        col: PB.ink,
        col2: PB.inkSoft,
      });
      psLine(ctx, bezierPts([[[522, 538], [510, 552], [496, 566], [486, 576]]], 12), {
        key: key + 'twistUnder2',
        w: 2.8,
        col: PB.ink,
        col2: PB.inkSoft,
      });

      const overStrandP = bezierPts([
        [[494, 508], [504, 526], [524, 548], [552, 558]],
        [[552, 558], [560, 562], [558, 574], [548, 574]],
        [[548, 574], [520, 568], [498, 546], [486, 526]],
        [[486, 526], [482, 516], [488, 508], [494, 508]],
      ], 16);
      psShape(ctx, overStrandP, PB.pretzelMid, {
        key: key + 'overStrand',
        line: false,
        grad: (bb: any) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
          g.addColorStop(0, PB.pretzelLight);
          g.addColorStop(0.55, PB.pretzelMid);
          g.addColorStop(1, PB.pretzelDark);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
      });
      psLine(ctx, bezierPts([[[494, 512], [506, 528], [526, 548], [552, 558]]], 14), {
        key: key + 'overTop',
        w: 3.0,
        col: PB.ink,
        col2: PB.inkSoft,
      });
      psLine(ctx, bezierPts([[[488, 526], [500, 546], [522, 568], [548, 574]]], 14), {
        key: key + 'overBot',
        w: 3.0,
        col: PB.ink,
        col2: PB.inkSoft,
      });
      psLine(ctx, [[474, 570], [482, 578]], { key: key + 'knotEndL', w: 2.8, col: PB.ink, col2: PB.inkSoft });
      psLine(ctx, [[552, 560], [548, 572]], { key: key + 'knotEndR', w: 2.8, col: PB.ink, col2: PB.inkSoft });

      const saltDots = [
        [468, 500],
        [492, 504],
        [535, 496],
        [558, 504],
        [514, 542],
        [536, 562],
        [482, 572],
        [495, 595],
        [524, 596],
        [544, 588],
      ];
      for (const [sx, sy] of saltDots) {
        ctx.fillStyle = '#fffdf7';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.3, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = 'rgba(168,88,27,0.55)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    });

    const leftArmRot = -armBobY * 0.0045;
    withPivot(ctx, 346, 412, leftArmRot, 1, 1, pawSqueeze * 0.4, armBobY * 0.35, () => {
      const leftArmP = bezierPts([
        [[346, 412], [298, 452], [272, 512], [274, 562]],
        [[274, 562], [278, 616], [322, 636], [378, 632]],
        [[378, 632], [432, 628], [468, 598], [466, 564]],
        [[466, 564], [465, 532], [435, 518], [385, 520]],
        [[385, 520], [386, 488], [382, 458], [346, 412]],
      ], 18);
      psShape(ctx, leftArmP, PB.furMid, {
        key: key + 'armL',
        line: false,
        crayon: PB.furShade,
        crAl: 0.16,
        grad: (bb: any) => {
          const g = ctx.createRadialGradient(388, 552, 15, 370, 540, 120);
          g.addColorStop(0, PB.furLight);
          g.addColorStop(0.62, PB.furMid);
          g.addColorStop(1, PB.furShade);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psBlush(ctx, 335, 612, 75, 28, '214,158,96', 0.62, 0.15);
          psBlush(ctx, 290, 528, 32, 65, '214,158,96', 0.52, 0.2);
          const armLPts: [number, number][] = [];
          for (let i = 0; i < 14; i++) {
            const t = i / 13;
            armLPts.push([282 + t * 95, 558 + Math.sin(t * 1.6) * 66]);
          }
          psHatchArc(ctx, armLPts, 12, 4, PB.furDeep, 1.4, 0.38, key + 'armHL');
        },
      });
      psLine(
        ctx,
        bezierPts([
          [[346, 412], [298, 452], [272, 512], [274, 562]],
          [[274, 562], [278, 616], [322, 636], [378, 632]],
          [[378, 632], [432, 628], [468, 598], [466, 564]],
          [[466, 564], [465, 532], [435, 518], [385, 520]],
        ], 18),
        { key: key + 'armOL', w: 3.8, col: PB.ink, col2: PB.inkSoft }
      );
      psLine(ctx, [[385, 520], [386, 492], [382, 468]], { key: key + 'armInL', w: 3.2, col: PB.ink, col2: PB.inkSoft });
      psLine(ctx, [[462, 548], [446, 545]], { key: key + 'pawTickL1', w: 2.9, col: PB.ink, col2: PB.inkSoft });
      psLine(ctx, [[464, 576], [449, 578]], { key: key + 'pawTickL2', w: 2.9, col: PB.ink, col2: PB.inkSoft });
    });

    const rightArmRot = armBobY * 0.0045;
    withPivot(ctx, 648, 410, rightArmRot, 1, 1, -pawSqueeze * 0.4, armBobY * 0.35, () => {
      const rightArmP = bezierPts([
        [[648, 410], [696, 448], [724, 508], [722, 558]],
        [[722, 558], [718, 608], [678, 626], [632, 620]],
        [[632, 620], [588, 614], [564, 588], [566, 554]],
        [[566, 554], [568, 522], [596, 510], [642, 514]],
        [[642, 514], [638, 484], [636, 456], [648, 410]],
      ], 18);
      psShape(ctx, rightArmP, PB.furMid, {
        key: key + 'armR',
        line: false,
        crayon: PB.furShade,
        crAl: 0.16,
        grad: (bb: any) => {
          const g = ctx.createRadialGradient(615, 545, 15, 630, 540, 120);
          g.addColorStop(0, PB.furLight);
          g.addColorStop(0.62, PB.furMid);
          g.addColorStop(1, PB.furShade);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psBlush(ctx, 655, 604, 68, 26, '214,158,96', 0.62, -0.15);
          const armRPts: [number, number][] = [];
          for (let i = 0; i < 12; i++) {
            const t = i / 11;
            armRPts.push([712 - t * 80, 555 + Math.sin(t * 1.6) * 58]);
          }
          psHatchArc(ctx, armRPts, -12, 4, PB.furDeep, 1.4, 0.38, key + 'armHR');
        },
      });
      psLine(
        ctx,
        bezierPts([
          [[648, 410], [696, 448], [724, 508], [722, 558]],
          [[722, 558], [718, 608], [678, 626], [632, 620]],
          [[632, 620], [588, 614], [564, 588], [566, 554]],
          [[566, 554], [568, 522], [596, 510], [642, 514]],
        ], 18),
        { key: key + 'armOR', w: 3.8, col: PB.ink, col2: PB.inkSoft }
      );
      psLine(ctx, [[642, 514], [636, 484], [632, 462]], { key: key + 'armInR', w: 3.2, col: PB.ink, col2: PB.inkSoft });
      psLine(ctx, [[570, 538], [584, 536]], { key: key + 'pawTickR1', w: 2.9, col: PB.ink, col2: PB.inkSoft });
      psLine(ctx, [[568, 566], [582, 568]], { key: key + 'pawTickR2', w: 2.9, col: PB.ink, col2: PB.inkSoft });
    });
  });

  ctx.restore();
}

// ---------------------------------------------------------------------
//  MAIN 3D STORYBOOK SCENE RENDER FUNCTION
// ---------------------------------------------------------------------
export function renderStorybookBakery(ctx: CanvasRenderingContext2D, options: RenderOptions = {}) {
  const opts = {
    showRoomEnvelope: true,
    showFloor: true,
    showWindow: true,
    showShelves: true,
    showBear: true,
    showCounter: true,
    showCounterProps: true,
    showSunbeams: true,
    showPaperTooth: true,
    bearMode: 'static' as const,
    ...options,
  };

  // Base background fill
  ctx.fillStyle = BK.wallBase;
  ctx.fillRect(0, 0, 1000, 1000);

  // 1. Room Envelope
  if (opts.showRoomEnvelope) {
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 600);
    wallGrad.addColorStop(0, '#faf4e6');
    wallGrad.addColorStop(0.5, '#f4ebd5');
    wallGrad.addColorStop(1, '#e8dcbf');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, 1000, 580);

    psBlush(ctx, 220, 260, 200, 130, '225,200,165', 0.32, -0.1);
    psBlush(ctx, 510, 240, 220, 140, '230,205,170', 0.28, 0.05);
    psBlush(ctx, 830, 320, 190, 150, '210,180,145', 0.38, -0.05);

    const rightWallP: [number, number][] = [
      [670, 50],
      [1000, 25],
      [1000, 680],
      [670, 560],
    ];
    psShape(ctx, rightWallP, BK.wallWarm, {
      key: 'rightWallShade',
      line: false,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(670, 300, 1000, 300);
        g.addColorStop(0, 'rgba(195,170,140,0.22)');
        g.addColorStop(0.45, 'rgba(180,150,120,0.32)');
        g.addColorStop(1, 'rgba(150,120,95,0.48)');
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
    });

    psLine(ctx, [[670, 50], [670, 560]], { key: 'roomCorner', w: 3.4, col: '#7a5a40', col2: PB.inkSoft, a: 0.8 });

    // Skirting
    psShape(ctx, [[0, 545], [670, 545], [670, 565], [0, 565]], BK.skirtingWood, {
      key: 'baseSkirting',
      w: 2.8,
      line: PB.ink,
      line2: PB.inkSoft,
    });

    // Beam
    const beamP = bezierPts([
      [[0, 42], [340, 46], [670, 45], [1000, 22]],
      [[1000, 22], [1000, 56], [670, 80], [0, 78]],
    ], 16);
    psShape(ctx, beamP, BK.beamWood, {
      key: 'ceilingBeam',
      w: 3.4,
      line: PB.ink,
      line2: PB.inkSoft,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
        g.addColorStop(0, BK.beamWoodHi);
        g.addColorStop(0.5, BK.beamWood);
        g.addColorStop(1, BK.beamWoodDark);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
    });
    psLine(ctx, [[0, 78], [670, 80], [1000, 56]], { key: 'beamCastShade', w: 3.8, col: 'rgba(70,42,24,0.42)', second: false });

    // Chalkboard Menu
    const menuX = 265,
      menuY = 210,
      menuW = 95,
      menuH = 130;
    psLine(ctx, [[menuX - 30, 78], [menuX - 30, menuY - menuH / 2]], { key: 'chalkTwineL', w: 1.8, col: '#8a6540', second: false });
    psLine(ctx, [[menuX + 30, 78], [menuX + 30, menuY - menuH / 2]], { key: 'chalkTwineR', w: 1.8, col: '#8a6540', second: false });
    psShape(ctx, rrectPts(menuX - menuW / 2, menuY - menuH / 2, menuW, menuH, 6), BK.shelfWoodDark, {
      key: 'menuFrame',
      w: 3.2,
      line: PB.ink,
      line2: PB.inkSoft,
    });
    psShape(ctx, rrectPts(menuX - menuW / 2 + 7, menuY - menuH / 2 + 7, menuW - 14, menuH - 14, 4), '#2c332e', {
      key: 'menuSlate',
      w: 2.2,
      line: PB.ink,
      second: false,
      innerFn: () => {
        psLine(ctx, [[menuX - 28, menuY - 45], [menuX + 28, menuY - 45]], { key: 'chalkH1', w: 1.8, col: '#faf5e8', a: 0.85, second: false });
        psLine(ctx, [[menuX - 18, menuY - 40], [menuX + 18, menuY - 40]], { key: 'chalkH2', w: 1.2, col: '#f4ebd5', a: 0.7, second: false });
        psLine(ctx, [[menuX - 32, menuY - 22], [menuX - 4, menuY - 22]], { key: 'chalkItem1', w: 2.0, col: '#fff8ea', a: 0.85, second: false });
        psLine(ctx, [[menuX + 16, menuY - 22], [menuX + 30, menuY - 22]], { key: 'chalkPrice1', w: 2.0, col: '#fae0a2', a: 0.85, second: false });
        psLine(ctx, [[menuX - 32, menuY - 4], [menuX - 6, menuY - 4]], { key: 'chalkItem2', w: 2.0, col: '#fff8ea', a: 0.85, second: false });
        psLine(ctx, [[menuX + 16, menuY - 4], [menuX + 30, menuY - 4]], { key: 'chalkPrice2', w: 2.0, col: '#fae0a2', a: 0.85, second: false });
        psLine(ctx, [[menuX - 32, menuY + 14], [menuX - 8, menuY + 14]], { key: 'chalkItem3', w: 2.0, col: '#fff8ea', a: 0.85, second: false });
        psLine(ctx, [[menuX + 16, menuY + 14], [menuX + 30, menuY + 14]], { key: 'chalkPrice3', w: 2.0, col: '#fae0a2', a: 0.85, second: false });
      },
    });

    // Hanging Copper Pan
    const panX = 210,
      panY = 105;
    psShape(ctx, [[panX - 2.5, panY - 20], [panX + 2.5, panY - 20], [panX + 3, panY - 5], [panX - 3, panY - 5]], BK.brass, {
      key: 'panHandle',
      w: 1.8,
      line: PB.ink,
      second: false,
    });
    psShape(ctx, ellipsePts(panX, panY + 12, 19, 19, 0, 24), BK.copper, {
      key: 'copperPan',
      w: 2.8,
      line: PB.ink,
      line2: PB.inkSoft,
    });
  }

  // 2. Terracotta Floor
  if (opts.showFloor) {
    const rowY = [562, 592, 632, 682, 746, 824, 915, 1015];
    const numCols = 9;
    const tileColors = [BK.tile1, BK.tile2, BK.tile3, BK.tile4, BK.tile5];

    for (let r = 0; r < rowY.length - 1; r++) {
      const yTop = rowY[r];
      const yBot = rowY[r + 1];
      const depthT_Top = (yTop - 560) / 440;
      const depthT_Bot = (yBot - 560) / 440;

      const xMinTop = -80 + (0 - -80) * (1 - depthT_Top);
      const xMaxTop = 1080 - (1080 - 1000) * (1 - depthT_Top);
      const xMinBot = -120 + (0 - -120) * (1 - depthT_Bot);
      const xMaxBot = 1120 - (1120 - 1000) * (1 - depthT_Bot);

      for (let c = 0; c < numCols; c++) {
        const u0 = c / numCols;
        const u1 = (c + 1) / numCols;
        const pTL: [number, number] = [lerp(xMinTop, xMaxTop, u0), yTop];
        const pTR: [number, number] = [lerp(xMinTop, xMaxTop, u1), yTop];
        const pBR: [number, number] = [lerp(xMinBot, xMaxBot, u1), yBot];
        const pBL: [number, number] = [lerp(xMinBot, xMaxBot, u0), yBot];
        const inset = 3.5 + depthT_Bot * 2.5;
        const tilePts = bezierPts([
          [[pTL[0] + inset, pTL[1] + inset * 0.7], [pTR[0] - inset, pTR[1] + inset * 0.7]],
          [[pTR[0] - inset, pTR[1] + inset * 0.7], [pBR[0] - inset, pBR[1] - inset * 0.7]],
          [[pBR[0] - inset, pBR[1] - inset * 0.7], [pBL[0] + inset, pBL[1] - inset * 0.7]],
          [[pBL[0] + inset, pBL[1] - inset * 0.7], [pTL[0] + inset, pTL[1] + inset * 0.7]],
        ], 6);

        const colorIdx = (r * 3 + c * 2 + (r % 2)) % tileColors.length;
        const tileCol = tileColors[colorIdx];
        psShape(ctx, tilePts, tileCol, {
          key: `tile_${r}_${c}`,
          w: 2.2,
          line: '#723e2a',
          line2: PB.inkSoft,
          amt: 0.85,
          crayon: '#913b22',
          crAl: 0.16,
          innerFn: (bb: any) => {
            const cx = (bb.x0 + bb.x1) / 2,
              cy = (bb.y0 + bb.y1) / 2;
            psBlush(ctx, cx, cy, (bb.x1 - bb.x0) * 0.35, (bb.y1 - bb.y0) * 0.3, '185,85,55', 0.45);
          },
        });
      }
    }
  }

  // 3. Casement Window
  if (opts.showWindow) {
    const wx = 45,
      wy = 115,
      ww = 175,
      wh = 330;
    const nichePts = bezierPts([
      [[wx - 10, wy + 40], [wx - 10, wy - 5], [wx + 25, wy - 10], [wx + ww / 2, wy - 10]],
      [[wx + ww / 2, wy - 10], [wx + ww - 25, wy - 10], [wx + ww + 10, wy - 5], [wx + ww + 10, wy + 40]],
      [[wx + ww + 10, wy + 40], [wx + ww + 10, wy + wh]],
      [[wx + ww + 10, wy + wh], [wx - 10, wy + wh]],
      [[wx - 10, wy + wh], [wx - 10, wy + 40]],
    ], 12);
    psShape(ctx, nichePts, '#eae0cb', { key: 'winNiche', w: 3.2, line: PB.ink, line2: PB.inkSoft });

    const leftJambP: [number, number][] = [
      [wx - 8, wy - 8],
      [wx + 18, wy + 6],
      [wx + 18, wy + wh - 4],
      [wx - 8, wy + wh],
    ];
    psShape(ctx, leftJambP, '#fcf7eb', { key: 'winLeftJamb', w: 2.6, line: PB.inkSoft, second: false });

    const topRevealP = bezierPts([
      [[wx - 8, wy - 8], [wx + ww / 2, wy - 10], [wx + ww + 8, wy - 8], [wx + ww + 8, wy - 8]],
      [[wx + ww + 8, wy - 8], [wx + ww - 16, wy + 6], [wx + ww / 2, wy + 4], [wx + 18, wy + 6]],
      [[wx + 18, wy + 6], [wx - 8, wy - 8]],
    ], 12);
    psShape(ctx, topRevealP, '#8a684a', { key: 'winTopReveal', w: 2.8, line: PB.ink, line2: PB.inkSoft });

    const glassX0 = wx + 18,
      glassY0 = wy + 6,
      glassW = ww - 34,
      glassH = wh - 10;
    const glassP = rrectPts(glassX0, glassY0, glassW, glassH, 14);

    psShape(ctx, glassP, BK.skyBlue, {
      key: 'winOutdoorView',
      line: false,
      grad: (bb: any) => {
        const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
        g.addColorStop(0, '#8ecde6');
        g.addColorStop(0.55, BK.skyGlow);
        g.addColorStop(0.75, '#fde6b3');
        g.addColorStop(1, '#e3f2cb');
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: (bb: any) => {
        psBlush(ctx, bb.x0 + 35, bb.y0 + 50, 32, 16, '255,255,255', 0.85);
        psBlush(ctx, bb.x0 + 95, bb.y0 + 70, 40, 20, '255,255,255', 0.85);
        const hill1 = bezierPts([
          [[bb.x0 - 10, bb.y1 - 60], [bb.x0 + 50, bb.y1 - 105], [bb.x0 + 100, bb.y1 - 65], [bb.x1 + 10, bb.y1 - 95]],
          [[bb.x1 + 10, bb.y1 - 95], [bb.x1 + 10, bb.y1 + 10]],
          [[bb.x1 + 10, bb.y1 + 10], [bb.x0 - 10, bb.y1 + 10]],
          [[bb.x0 - 10, bb.y1 + 10], [bb.x0 - 10, bb.y1 - 60]],
        ], 14);
        psShape(ctx, hill1, BK.hillGreen, { key: 'hill1', line: false });

        const hill2 = bezierPts([
          [[bb.x0 - 10, bb.y1 - 25], [bb.x0 + 60, bb.y1 - 55], [bb.x0 + 110, bb.y1 - 30], [bb.x1 + 10, bb.y1 - 50]],
          [[bb.x1 + 10, bb.y1 - 50], [bb.x1 + 10, bb.y1 + 10]],
          [[bb.x1 + 10, bb.y1 + 10], [bb.x0 - 10, bb.y1 + 10]],
          [[bb.x0 - 10, bb.y1 + 10], [bb.x0 - 10, bb.y1 - 25]],
        ], 14);
        psShape(ctx, hill2, BK.hillGreenDark, { key: 'hill2', line: false });
      },
    });

    psShape(ctx, glassP, 'transparent', { key: 'winFrameOutline', w: 3.6, line: BK.windowWood, line2: BK.windowWoodDark });

    const midX = glassX0 + glassW / 2;
    psShape(ctx, [[midX - 6, glassY0], [midX + 6, glassY0], [midX + 6, glassY0 + glassH], [midX - 6, glassY0 + glassH]], BK.windowWood, {
      key: 'winCenterStile',
      w: 2.8,
      line: PB.ink,
      line2: PB.inkSoft,
    });
    for (const my of [glassY0 + glassH * 0.33, glassY0 + glassH * 0.66]) {
      psLine(ctx, [[glassX0, my], [glassX0 + glassW, my]], { key: 'muntin_' + Math.round(my), w: 3.2, col: BK.windowWood, col2: BK.windowWoodDark });
    }

    // Cornice & Sill
    const corniceP = bezierPts([
      [[wx - 22, wy - 14], [wx + ww + 22, wy - 14]],
      [[wx + ww + 22, wy - 14], [wx + ww + 16, wy + 2]],
      [[wx + ww + 16, wy + 2], [wx - 16, wy + 2]],
      [[wx - 16, wy + 2], [wx - 22, wy - 14]],
    ], 8);
    psShape(ctx, corniceP, BK.windowWood, { key: 'winCornice', w: 3.4, line: PB.ink, line2: PB.inkSoft });

    const sillTopY = wy + wh;
    const sillBotY = sillTopY + 24;
    psShape(ctx, [[wx - 26, sillTopY], [wx + ww + 26, sillTopY], [wx + ww + 20, sillBotY], [wx - 20, sillBotY]], '#cfa370', {
      key: 'winSill',
      w: 3.6,
      line: PB.ink,
      line2: PB.inkSoft,
    });

    // Plant Pot on Sill
    const potX = wx + 45,
      potY = sillTopY - 4;
    const potPts = bezierPts([
      [[potX - 16, potY], [potX + 16, potY]],
      [[potX + 16, potY], [potX + 12, potY + 32]],
      [[potX + 12, potY + 32], [potX - 12, potY + 32]],
      [[potX - 12, potY + 32], [potX - 16, potY]],
    ], 8);
    psShape(ctx, potPts, BK.potClay, { key: 'winPot', w: 2.8, line: PB.ink, line2: PB.inkSoft });
    psShape(ctx, rrectPts(potX - 18, potY - 7, 36, 9, 3), '#d87654', { key: 'winPotRim', w: 2.4, line: PB.ink, second: false });
    for (let i = 0; i < 9; i++) {
      const ang = -0.4 + (i / 8) * 0.8;
      const len = 22 + (i % 3) * 6;
      const fx = potX + (i - 4) * 3.2;
      const fy = potY - 6;
      psLine(ctx, [[fx, fy], [fx + Math.sin(ang) * len, fy - Math.cos(ang) * len]], { key: 'herbStem_' + i, w: 2.2, col: BK.plantGreenDark, second: false });
    }
  }

  // 4. Wooden Shelves
  if (opts.showShelves) {
    const shelfTiers = [
      { topY: 130, botY: 152, h: 22 },
      { topY: 275, botY: 297, h: 22 },
      { topY: 420, botY: 442, h: 22 },
    ];

    psShape(ctx, [[690, 105], [975, 90], [975, 565], [690, 560]], '#dfcfb6', { key: 'shelfBackWall', line: false });
    psShape(ctx, [[692, 105], [712, 105], [712, 560], [692, 560]], BK.shelfWoodDark, { key: 'shelfUprightL', w: 3.2, line: PB.ink, line2: PB.inkSoft });
    psShape(ctx, [[955, 88], [982, 86], [982, 565], [955, 565]], BK.shelfWood, { key: 'shelfUprightR', w: 3.4, line: PB.ink, line2: PB.inkSoft });

    for (let i = 0; i < shelfTiers.length; i++) {
      const tier = shelfTiers[i];
      const yB = tier.topY;
      const yF = tier.topY + 12;
      psShape(ctx, [[712, yB + tier.h], [955, yF + tier.h], [955, yF + tier.h + 26], [712, yB + tier.h + 22]], BK.recessShadow, {
        key: 'shelfShade_' + i,
        line: false,
      });
      psShape(ctx, [[695, yB - 6], [975, yF - 8], [975, yF], [695, yB]], BK.shelfWoodLight, {
        key: 'shelfTop_' + i,
        w: 2.8,
        line: PB.ink,
        line2: PB.inkSoft,
      });
      psShape(ctx, [[695, yB], [975, yF], [975, yF + tier.h], [695, yB + tier.h]], BK.shelfWood, {
        key: 'shelfFront_' + i,
        w: 3.4,
        line: PB.ink,
        line2: PB.inkSoft,
      });
    }

    // Top shelf props (Ceramic bowl & jar)
    const bowlX = 825,
      bowlY = 125;
    const bowlPts = bezierPts([
      [[bowlX - 35, bowlY], [bowlX - 33, bowlY + 24], [bowlX - 18, bowlY + 35], [bowlX, bowlY + 35]],
      [[bowlX, bowlY + 35], [bowlX + 18, bowlY + 35], [bowlX + 33, bowlY + 24], [bowlX + 35, bowlY]],
      [[bowlX + 35, bowlY], [bowlX - 35, bowlY]],
    ], 12);
    psShape(ctx, bowlPts, BK.ceramicCream, { key: 'shelfBowl', w: 3.2, line: PB.ink, line2: PB.inkSoft });
    psLine(ctx, bezierPts([[[bowlX - 31, bowlY + 14], [bowlX, bowlY + 16], [bowlX + 31, bowlY + 14]]], 14), {
      key: 'bowlBand',
      w: 3.4,
      col: BK.ceramicBlue,
      second: false,
    });

    const jarX = 905,
      jarY = 120;
    psShape(ctx, rrectPts(jarX - 18, jarY - 28, 36, 38, 5), 'rgba(215, 238, 245, 0.55)', {
      key: 'glassJar',
      w: 2.8,
      line: '#5c788a',
      line2: PB.inkSoft,
    });

    // Middle shelf props (Basket of rolls & Cloche)
    const bskX = 770,
      bskY = 268;
    const bskPts = bezierPts([
      [[bskX - 44, bskY - 28], [bskX - 48, bskY - 5], [bskX - 34, bskY + 18], [bskX, bskY + 18]],
      [[bskX, bskY + 18], [bskX + 34, bskY + 18], [bskX + 48, bskY - 5], [bskX + 44, bskY - 28]],
      [[bskX + 44, bskY - 28], [bskX - 44, bskY - 28]],
    ], 14);
    psShape(ctx, bskPts, BK.wickerMid, { key: 'shelfWickerBsk', w: 3.4, line: PB.ink, line2: PB.inkSoft });
    for (const [rx, ry, rot] of [
      [bskX - 19, bskY - 28, -0.15],
      [bskX + 5, bskY - 32, 0.05],
      [bskX + 24, bskY - 26, 0.2],
    ]) {
      psShape(ctx, ellipsePts(rx, ry, 16, 12, rot, 18), BK.breadCrust, { key: 'roll_' + Math.round(rx), w: 2.8, line: PB.ink, line2: PB.inkSoft });
    }

    const clocheX = 880,
      clocheY = 270;
    psShape(ctx, [[clocheX - 28, clocheY - 4], [clocheX + 28, clocheY - 4], [clocheX + 24, clocheY + 8], [clocheX - 24, clocheY + 8]], BK.shelfWoodDark, {
      key: 'clochePed',
      w: 2.8,
      line: PB.ink,
      second: false,
    });
    psShape(
      ctx,
      bezierPts([
        [[clocheX - 24, clocheY - 6], [clocheX - 24, clocheY - 40], [clocheX - 14, clocheY - 50], [clocheX, clocheY - 50]],
        [[clocheX, clocheY - 50], [clocheX + 14, clocheY - 50], [clocheX + 24, clocheY - 40], [clocheX + 24, clocheY - 6]],
        [[clocheX + 24, clocheY - 6], [clocheX - 24, clocheY - 6]],
      ], 16),
      'rgba(220, 240, 250, 0.45)',
      { key: 'clocheGlass', w: 2.8, line: '#6e8fa6', line2: PB.inkSoft }
    );

    // Lower shelf props (Sourdough boule & wheat)
    const bouleX = 772,
      bouleY = 415;
    const bouleP = bezierPts([
      [[bouleX - 38, bouleY], [bouleX - 40, bouleY - 35], [bouleX + 40, bouleY - 35], [bouleX + 38, bouleY]],
      [[bouleX + 38, bouleY], [bouleX - 38, bouleY]],
    ], 16);
    psShape(ctx, bouleP, BK.breadCrust, { key: 'sourdoughBoule', w: 3.4, line: PB.ink, line2: PB.inkSoft });
    psLine(ctx, bezierPts([[[bouleX - 24, bouleY - 14], [bouleX, bouleY - 26], [bouleX + 24, bouleY - 16]]], 14), {
      key: 'scoreCut1',
      w: 3.4,
      col: '#5c2a08',
      second: false,
    });
  }

  // 5. Hero Pretzel Baker Bear
  if (opts.showBear) {
    drawPretzelBear(ctx, 510, 510, 0.96, { mode: opts.bearMode ?? 'static', TT: opts.TT, F: opts.F });
    // Window Morning Rim Light on Bear's Left Side
    psLine(ctx, bezierPts([[[370, 160], [340, 220], [320, 310], [315, 360]]], 16), {
      key: 'bearRimHi1',
      w: 3.4,
      col: '#fff8e2',
      a: 0.65,
      second: false,
    });
    psLine(ctx, bezierPts([[[335, 410], [290, 480], [280, 540]]], 14), {
      key: 'bearRimHi2',
      w: 3.4,
      col: '#fff8e2',
      a: 0.6,
      second: false,
    });
  }

  // 6. Serving Counter
  if (opts.showCounter) {
    psShape(ctx, [[70, 855], [925, 865], [935, 915], [60, 905]], 'rgba(60, 32, 18, 0.42)', { key: 'counterFloorShade', line: false });

    const leftSideP = bezierPts([
      [[145, 642], [75, 715]],
      [[75, 715], [70, 860]],
      [[70, 860], [135, 765]],
      [[135, 765], [145, 642]],
    ], 8);
    psShape(ctx, leftSideP, BK.counterFrontDark, { key: 'counterLeftSide', w: 3.4, line: PB.ink, line2: PB.inkSoft });

    const frontApronP = bezierPts([
      [[75, 715], [500, 722], [925, 718]],
      [[925, 718], [925, 865]],
      [[925, 865], [500, 872], [70, 860]],
      [[70, 860], [75, 715]],
    ], 14);
    psShape(ctx, frontApronP, BK.counterFrontMid, {
      key: 'counterFrontFace',
      w: 3.6,
      line: PB.ink,
      line2: PB.inkSoft,
      innerFn: () => {
        const numPlanks = 16;
        for (let p = 1; p < numPlanks; p++) {
          const u = p / numPlanks;
          const pxTop = lerp(75, 925, u);
          const pyTop = lerp(715, 718, u);
          const pxBot = lerp(70, 925, u);
          const pyBot = lerp(860, 865, u);
          psLine(ctx, [[pxTop, pyTop], [pxBot, pyBot]], { key: 'plankSeam_' + p, w: 2.2, col: '#58361c', second: false });
        }
      },
    });

    const lipBandP = bezierPts([
      [[68, 715], [500, 722], [935, 718]],
      [[935, 718], [935, 732]],
      [[935, 732], [500, 737], [65, 728]],
      [[65, 728], [68, 715]],
    ], 14);
    psShape(ctx, lipBandP, BK.counterFrontDark, { key: 'counterLipBand', w: 3.4, line: PB.ink, line2: PB.inkSoft });

    const counterTopP = bezierPts([
      [[145, 642], [500, 648], [885, 642]],
      [[885, 642], [935, 718]],
      [[935, 718], [500, 722], [68, 715]],
      [[68, 715], [145, 642]],
    ], 16);
    psShape(ctx, counterTopP, BK.counterTopMid, {
      key: 'counterTopSurface',
      w: 3.6,
      line: PB.ink,
      line2: PB.inkSoft,
      innerFn: () => {
        psBlush(ctx, 510, 656, 120, 18, '90,55,30', 0.45);
        psBlush(ctx, 320, 680, 55, 18, '255,255,255', 0.48);
        psBlush(ctx, 700, 685, 58, 20, '255,255,255', 0.45);
      },
    });
  }

  // 7. Countertop Props
  if (opts.showCounterProps) {
    const bagBskX = 175,
      bagBskY = 665;
    for (let b = 0; b < 3; b++) {
      const ang = -0.32 + b * 0.28;
      const bx = bagBskX + (b - 1) * 16;
      const by = bagBskY - 14;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(ang);
      const baguetteP = bezierPts([
        [[-11, 20], [-13, -12], [-13, -48], [-12, -72]],
        [[-12, -72], [-5, -80], [5, -80], [12, -72]],
        [[12, -72], [13, -48], [13, -12], [11, 20]],
        [[11, 20], [4, 21], [-4, 21], [-11, 20]],
      ], 14);
      psShape(ctx, baguetteP, BK.breadCrust, { key: 'baguette_' + b, w: 3.0, line: PB.ink, line2: PB.inkSoft });
      ctx.restore();
    }

    const bskP = bezierPts([
      [[bagBskX - 34, bagBskY - 8], [bagBskX - 38, bagBskY + 12], [bagBskX - 34, bagBskY + 36], [bagBskX - 18, bagBskY + 42]],
      [[bagBskX - 18, bagBskY + 42], [bagBskX, bagBskY + 43], [bagBskX + 18, bagBskY + 42], [bagBskX + 34, bagBskY + 36]],
      [[bagBskX + 34, bagBskY + 36], [bagBskX + 38, bagBskY + 12], [bagBskX + 34, bagBskY - 8]],
      [[bagBskX + 34, bagBskY - 8], [bagBskX - 34, bagBskY - 8]],
    ], 12);
    psShape(ctx, bskP, BK.wickerMid, { key: 'bagBskBody', w: 3.4, line: PB.ink, line2: PB.inkSoft });
    psShape(ctx, ellipsePts(bagBskX, bagBskY - 8, 35, 9, 0, 18), BK.wickerLight, { key: 'bagBskRim', w: 3.0, line: PB.ink, second: false });

    // Cutting board & knife
    const cbX = 310,
      cbY = 684;
    psShape(ctx, [[cbX - 44, cbY - 16], [cbX + 44, cbY - 16], [cbX + 50, cbY + 18], [cbX - 38, cbY + 18]], '#b57c46', {
      key: 'cuttingBoard',
      w: 3.2,
      line: PB.ink,
      line2: PB.inkSoft,
    });
    psLine(ctx, [[cbX - 25, cbY + 8], [cbX + 32, cbY - 4]], { key: 'knifeBlade', w: 2.8, col: '#cbdbe5', second: false });
    psLine(ctx, [[cbX - 40, cbY + 14], [cbX - 25, cbY + 8]], { key: 'knifeHandle', w: 4.2, col: '#5e381b', second: false });

    // Sea salt dish
    const saltDishX = 390,
      saltDishY = 688;
    psShape(ctx, ellipsePts(saltDishX, saltDishY, 17, 8, 0, 16), BK.ceramicCream, { key: 'saltDish', w: 2.4, line: PB.ink, second: false });

    // Croissants on ceramic platter
    const crPlatterX = 745,
      crPlatterY = 688;
    psBlush(ctx, crPlatterX, crPlatterY + 6, 62, 16, '60,35,18', 0.35);
    psShape(ctx, ellipsePts(crPlatterX, crPlatterY, 58, 20, 0, 24), BK.ceramicCream, {
      key: 'crPlatter',
      w: 3.4,
      line: PB.ink,
      line2: PB.inkSoft,
    });

    for (const [cx, cy, ang] of [
      [crPlatterX - 22, crPlatterY - 6, -0.15],
      [crPlatterX + 22, crPlatterY - 8, 0.2],
    ]) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      const croissP = bezierPts([
        [[-26, 7], [-30, -12], [-12, -22], [0, -22]],
        [[0, -22], [12, -22], [30, -12], [26, 7]],
        [[26, 7], [16, 0], [0, 5], [-16, 0]],
        [[-16, 0], [-26, 7]],
      ], 14);
      psShape(ctx, croissP, '#e2953a', { key: 'croissant_' + Math.round(cx), w: 3.0, line: PB.ink, line2: PB.inkSoft });
      ctx.restore();
    }

    // Brass Service Bell
    const bellX = 860,
      bellY = 678;
    psShape(ctx, ellipsePts(bellX, bellY + 7, 18, 7, 0, 16), BK.brassDark, { key: 'bellBase', w: 2.6, line: PB.ink, second: false });
    const bellDomeP = bezierPts([
      [[bellX - 16, bellY + 6], [bellX - 16, bellY - 2], [bellX - 12, bellY - 9], [bellX, bellY - 9]],
      [[bellX, bellY - 9], [bellX + 12, bellY - 9], [bellX + 16, bellY - 2], [bellX + 16, bellY + 6]],
      [[bellX + 16, bellY + 6], [bellX - 16, bellY + 6]],
    ], 12);
    psShape(ctx, bellDomeP, BK.brass, { key: 'bellDome', w: 3.0, line: PB.ink, line2: PB.inkSoft });
    psShape(ctx, [[bellX - 3.5, bellY - 9], [bellX + 3.5, bellY - 9], [bellX + 3.5, bellY - 16], [bellX - 3.5, bellY - 16]], BK.brassDark, {
      key: 'bellPlunger',
      w: 2.2,
      line: PB.ink,
      second: false,
    });
  }

  // 8. Sunbeams & Dust Motes
  if (opts.showSunbeams) {
    for (const [mx, my, rad] of [
      [190, 360, 2.0],
      [240, 410, 2.5],
      [280, 490, 2.2],
      [350, 530, 2.8],
      [420, 580, 2.4],
      [230, 620, 2.0],
      [480, 640, 2.6],
    ]) {
      psBlush(ctx, mx, my, rad * 2, rad * 2, '255,250,220', 0.85);
    }
  }

  // 9. Overall Paper Tooth
  if (opts.showPaperTooth) {
    pencil(ctx, { x0: 0, y0: 0, x1: 1000, y1: 1000 }, { key: 'finalPaperTooth', c: '#6d452a', al: 0.05, per: 120, len: 14, a: -0.65, w: 1.0, max: 2800 });
  }
}
