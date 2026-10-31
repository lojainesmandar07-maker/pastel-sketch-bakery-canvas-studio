/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MASTER STORYBOOK CHARACTER & ANIMATION ENGINE (`pastel-sketch` <canvas>)
 * Implements the 3-Skill Hybrid Formula:
 * 1. `animate` (`pastel-sketch` 3-pass colored-pencil outlines + deterministic wobble/pencil/grain)
 * 2. `svg-illustration` (Cubic Bézier sampling + Open-Contour Joins)
 * 3. `canvas-design` (Split depth layers, inner shadow cavities, and `evenodd` hood ring cutout)
 */

export const TAU = Math.PI * 2;

// =====================================================================
//  1. RAINCOAT CALICO CAT PALETTE (RC) — Sampled from Reference
// =====================================================================
export const RC = {
  bg: '#d8e6e6',             // Soft misty rain-blue background
  ink: '#4a3022',            // Deep warm espresso-umber colored-pencil outline
  inkSoft: '#7d5b46',        // Secondary softer pencil pass
  inkLight: '#a68972',       // Subtle crease / inner detail line

  // Buttercup Yellow Raincoat
  coatLight: '#fff5c8',      // Bright butter-cream highlight
  coatMid: '#ffecad',        // Main buttercup yellow raincoat
  coatWarm: '#fce59c',       // Warm lower coat tone
  coatShade: '#f0d37e',      // Soft fold shadow
  coatDeep: '#59402a',       // Deep inner hood & sleeve cavity shadow

  // Calico Cat Fur
  furLight: '#f4eae0',       // Forehead & bridge highlight
  furCream: '#eadccf',       // Main warm oatmeal-cream face fur
  furShade: '#dfd0c1',       // Lower cheek & chin shadow
  furOrange: '#d89658',      // Ginger-caramel orange patch & right ear
  furOrangeLight: '#e5b888', // Soft apricot transition edge
  furTan: '#e2c39d',         // Soft buff-apricot patch around right eye
  furGrey: '#7c8085',        // Slate blue-grey patch & left ear
  furGreyDark: '#63676c',
  furBrown: '#ac957f',       // Left foot taupe-brown patch

  // Features
  earPink: '#f4c4b6',        // Soft peach-pink inner ear
  nose: '#f8b3b0',           // Sweet pink triangular nose
  noseLine: '#a6625e',       // Delicate rose-brown nose outline
  eye: '#47271c',            // Deep espresso closed eye crescent
  blush: '238,172,156',      // Soft rosy-peach cheek blush RGB
  blushCore: '#edb5a5',

  // Duffle Toggles
  cord: '#f5dd98',           // Toggle rope strap fill
  toggleLight: '#e6be94',    // Wooden barrel toggle highlight
  toggleMid: '#d5a676',      // Wooden barrel toggle base
  toggleDark: '#ab794a',     // Wooden barrel toggle shadow

  // Folded Umbrella
  umbLight: '#dceae6',       // Pale ice-blue umbrella highlight
  umbMid: '#cadad5',         // Main pale ice-blue umbrella fabric
  umbShade: '#b2c4bf',       // Umbrella pleat shadow
  umbHandle: '#4d504b',      // Charcoal J-hook handle & ferrule tip
  umbHandleHi: '#6e736c',
};

export const CK = RC;
export const PAL = {
  paper: RC.bg,
  ink: RC.ink
};

export type AnimationMode = 'static' | '5layer' | '12layer' | 'manual';

export interface CatLayerVisibility {
  feet: boolean;
  rightPaw: boolean;
  umbBack: boolean;
  coatRight: boolean;
  coatLeft: boolean;
  umbFrontAndSleeveL: boolean;
  toggles: boolean;
  hoodCavityAndFace: boolean;
  eyesAndNose: boolean;
  hoodRing: boolean;
  earsAndSlits: boolean;
  whiskers: boolean;
}

export interface CatRigState {
  mode: AnimationMode;
  breath: number;
  bodySway: number;
  headTilt: number;
  headBobY: number;
  earRotL: number;
  earRotR: number;
  armLRot: number;
  armRRot: number;
  umbTilt: number;
  toggleSway: number;
  whiskerTwitch: number;
  footTapL: number;
  footTapR: number;
  boilFrame: number;
  showRain: boolean;
  showPuddle: boolean;
  showPaperGrain: boolean;
  layers: CatLayerVisibility;
}

export const DEFAULT_CAT_RIG: CatRigState = {
  mode: '12layer',
  breath: 0,
  bodySway: 0,
  headTilt: 0,
  headBobY: 0,
  earRotL: 0,
  earRotR: 0,
  armLRot: 0,
  armRRot: 0,
  umbTilt: 0,
  toggleSway: 0,
  whiskerTwitch: 0,
  footTapL: 0,
  footTapR: 0,
  boilFrame: 0,
  showRain: false,
  showPuddle: false,
  showPaperGrain: true,
  layers: {
    feet: true,
    rightPaw: true,
    umbBack: true,
    coatRight: true,
    coatLeft: true,
    umbFrontAndSleeveL: true,
    toggles: true,
    hoodCavityAndFace: true,
    eyesAndNose: true,
    hoodRing: true,
    earsAndSlits: true,
    whiskers: true,
  }
};

// =====================================================================
//  DETERMINISTIC CORE KIT (`animate/kit/core.js` equivalents)
// =====================================================================
export type Pt = [number, number];

export function h32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngKey(key: string): () => number {
  return mulberry32(h32(key));
}

export function vnoise(x: number, s = 1): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = mulberry32((i * 374761393 + s * 668265263) >>> 0)() * 2 - 1;
  const b = mulberry32(((i + 1) * 374761393 + s * 668265263) >>> 0)() * 2 - 1;
  return a * (1 - u) + b * u;
}

export const EZ = {
  io: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out3: (t: number) => 1 - Math.pow(1 - t, 3),
  in3: (t: number) => t * t * t,
};

export function clamp(v: number, a = 0, b = 1): number {
  return Math.max(a, Math.min(b, v));
}

export function seg(t: number, a: number, b: number): number {
  return clamp((t - a) / (b - a), 0, 1);
}

export function resample(P: Pt[], closed: boolean, step = 6): Pt[] {
  const out: Pt[] = [];
  const N = P.length;
  const M = closed ? N : N - 1;
  for (let i = 0; i < M; i++) {
    const [x0, y0] = P[i];
    const [x1, y1] = P[(i + 1) % N];
    const d = Math.hypot(x1 - x0, y1 - y0);
    const k = Math.max(1, Math.round(d / step));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
  }
  if (!closed && N > 0) out.push([P[N - 1][0], P[N - 1][1]]);
  return out;
}

export function wobble(
  P: Pt[],
  closed = false,
  amt = 1.15,
  key = 'w',
  step = 6,
  bIdx = 0
): Pt[] {
  const R = resample(P, closed, step);
  const N = R.length;
  const s = (h32(key) + bIdx * 1009) & 0xffff;
  const out: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const prev = R[(i - 1 + N) % N];
    const next = R[(i + 1) % N];
    const tx = next[0] - prev[0];
    const ty = next[1] - prev[1];
    const l = Math.hypot(tx, ty) || 1;
    const nx = -ty / l;
    const ny = tx / l;
    const endFade = closed ? 1 : Math.min(1, (i / N) * 5, ((N - 1 - i) / N) * 5);
    const d =
      (vnoise(i * 0.28, s) * 0.7 + vnoise(i * 0.75, s + 97) * 0.3) * amt * endFade;
    out.push([R[i][0] + nx * d, R[i][1] + ny * d]);
  }
  return out;
}

export function trace(ctx: CanvasRenderingContext2D, Q: Pt[], closed = false): void {
  const N = Q.length;
  if (!N) return;
  ctx.beginPath();
  if (closed) {
    const mx = (Q[N - 1][0] + Q[0][0]) / 2;
    const my = (Q[N - 1][1] + Q[0][1]) / 2;
    ctx.moveTo(mx, my);
    for (let i = 0; i < N; i++) {
      const p = Q[i];
      const q = Q[(i + 1) % N];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.closePath();
  } else {
    ctx.moveTo(Q[0][0], Q[0][1]);
    for (let i = 1; i < N - 1; i++) {
      const p = Q[i];
      const q = Q[i + 1];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    if (N > 1) ctx.lineTo(Q[N - 1][0], Q[N - 1][1]);
  }
}

export function bbox(P: Pt[], pad = 0) {
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  for (const [x, y] of P) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
}

export function ellipsePts(cx: number, cy: number, rx: number, ry: number, rot = 0, n = 28): Pt[] {
  const P: Pt[] = [];
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    P.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return P;
}

export function pencil(
  ctx: CanvasRenderingContext2D,
  bb: { x0: number; y0: number; x1: number; y1: number },
  o: {
    key?: string;
    a?: number;
    c?: string;
    al?: number;
    w?: number;
    len?: number;
    per?: number;
    max?: number;
  } = {}
) {
  const rng = rngKey('pc:' + (o.key ?? 'k'));
  const ang = o.a ?? -0.65;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const w = bb.x1 - bb.x0;
  const h = bb.y1 - bb.y0;
  const n = Math.min(o.max ?? 2200, Math.round(((w * h) / (o.per ?? 90)) * 1.1));
  const L = o.len ?? 14;
  ctx.save();
  ctx.strokeStyle = o.c ?? '#000';
  ctx.globalAlpha = o.al ?? 0.14;
  ctx.lineWidth = o.w ?? 1.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = bb.x0 + rng() * w;
    const y = bb.y0 + rng() * h;
    const l = L * (0.45 + rng() * 0.9);
    const da = (rng() - 0.5) * 0.22;
    const dx = Math.cos(ang + da) * l;
    const dy = Math.sin(ang + da) * l;
    const cx = x + dx * 0.5 - sa * (rng() - 0.5) * 2.5;
    const cy = y + dy * 0.5 + ca * (rng() - 0.5) * 2.5;
    ctx.moveTo(x - dx * 0.5, y - dy * 0.5);
    ctx.quadraticCurveTo(cx, cy, x + dx * 0.5, y + dy * 0.5);
  }
  ctx.stroke();
  ctx.restore();
}

// =====================================================================
//  2. PASTEL-SKETCH PRIMITIVES (3-Pass Colored Pencil & Clipped Wash)
// =====================================================================
export function psLine(
  ctx: CanvasRenderingContext2D,
  P: Pt[],
  o: {
    closed?: boolean;
    key?: string;
    w?: number;
    col?: string;
    col2?: string;
    amt?: number;
    step?: number;
    a?: number;
    dash?: number[];
    second?: boolean;
    B?: number;
  } = {}
): Pt[] {
  const closed = !!o.closed;
  const key = o.key ?? 'psl';
  const w = o.w ?? 4.6;
  const col = o.col ?? RC.ink;
  const amt = o.amt ?? 1.25;
  const bIdx = o.B ?? 0;
  const Q1 = wobble(P, closed, amt, key, o.step ?? 5, bIdx);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.globalAlpha = o.a ?? 0.96;
  if (o.dash) ctx.setLineDash(o.dash);
  trace(ctx, Q1, closed);
  ctx.stroke();
  if (o.second !== false && !o.dash) {
    const Q2 = wobble(P, closed, amt * 1.38 + 0.25, key + '~', o.step ?? 5, bIdx);
    ctx.strokeStyle = o.col2 ?? RC.inkSoft;
    ctx.lineWidth = w * 0.78;
    ctx.globalAlpha = (o.a ?? 0.96) * 0.55;
    trace(ctx, Q2, closed);
    ctx.stroke();

    const Q3 = wobble(P, closed, amt * 1.15 + 0.15, key + '~~', 4, bIdx);
    ctx.strokeStyle = col;
    ctx.lineWidth = w * 0.5;
    ctx.globalAlpha = (o.a ?? 0.96) * 0.48;
    ctx.setLineDash([1.5, 2.2]);
    trace(ctx, Q3, closed);
    ctx.stroke();
  }
  ctx.restore();
  return Q1;
}

export function psShape(
  ctx: CanvasRenderingContext2D,
  P: Pt[],
  fill: string,
  o: {
    key?: string;
    amt?: number;
    step?: number;
    raw?: boolean;
    fillA?: number;
    shadow?: boolean;
    shCol?: string;
    shBlur?: number;
    shX?: number;
    shY?: number;
    grad?: (bb: { x0: number; y0: number; x1: number; y1: number }) => void;
    crayon?: string;
    crAl?: number;
    crPer?: number;
    crLen?: number;
    crA?: number;
    innerFn?: (bb: { x0: number; y0: number; x1: number; y1: number }) => void;
    line?: string | false;
    line2?: string;
    w?: number;
    lineA?: number;
    second?: boolean;
    B?: number;
  } = {}
): Pt[] {
  const key = o.key ?? 'pss';
  const amt = o.amt ?? 1.15;
  const bIdx = o.B ?? 0;
  const Q = o.raw ? P : wobble(P, true, amt, key, o.step ?? 6, bIdx);
  ctx.save();
  if (o.shadow) {
    ctx.shadowColor = o.shCol ?? 'rgba(74,48,34,0.14)';
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
        max: 2200
      });
    }
    if (o.innerFn) o.innerFn(bb);
    ctx.restore();
  }

  if (o.line !== false) {
    psLine(ctx, P, {
      closed: true,
      key: key + 'L',
      w: o.w ?? 4.6,
      col: typeof o.line === 'string' ? o.line : RC.ink,
      col2: o.line2 ?? RC.inkSoft,
      amt,
      a: o.lineA ?? 0.96,
      second: o.second,
      B: bIdx
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
  col = RC.blush,
  a = 0.68,
  rot = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(1, ry / rx);
  const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  gr.addColorStop(0, 'rgba(' + col + ',' + a + ')');
  gr.addColorStop(0.62, 'rgba(' + col + ',' + a * 0.72 + ')');
  gr.addColorStop(1, 'rgba(' + col + ',0)');
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function bezierPts(segs: Pt[][], nPerSeg = 16): Pt[] {
  const P: Pt[] = [];
  for (let s = 0; s < segs.length; s++) {
    const [p0, c1, c2, p1] = segs[s];
    const m = s === segs.length - 1 ? nPerSeg : nPerSeg - 1;
    for (let i = 0; i <= m; i++) {
      const t = i / nPerSeg;
      const u = 1 - t;
      const x =
        u * u * u * p0[0] +
        3 * u * u * t * c1[0] +
        3 * u * t * t * c2[0] +
        t * t * t * p1[0];
      const y =
        u * u * u * p0[1] +
        3 * u * u * t * c1[1] +
        3 * u * t * t * c2[1] +
        t * t * t * p1[1];
      P.push([x, y]);
    }
  }
  return P;
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
): void {
  ctx.save();
  ctx.translate(px + dx, py + dy);
  if (rot) ctx.rotate(rot);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.translate(-px, -py);
  fn();
  ctx.restore();
}

// =====================================================================
//  PAPER TOOTH GRAIN & RAIN ENVIRONMENT
// =====================================================================
let cachedPaperCanvas: HTMLCanvasElement | null = null;

export function drawPaperTooth(ctx: CanvasRenderingContext2D, W = 1000, H = 1000): void {
  if (typeof document !== 'undefined') {
    if (!cachedPaperCanvas) {
      cachedPaperCanvas = document.createElement('canvas');
      cachedPaperCanvas.width = W;
      cachedPaperCanvas.height = H;
      const gctx = cachedPaperCanvas.getContext('2d');
      if (gctx) {
        const rng = rngKey('rc-paper-tooth');
        for (let i = 0; i < 6500; i++) {
          const x = rng() * W;
          const y = rng() * H;
          const r = 0.5 + rng() * 1.1;
          gctx.fillStyle =
            rng() < 0.5
              ? `rgba(255,253,245,${0.045 + rng() * 0.05})`
              : `rgba(74,48,34,${0.02 + rng() * 0.035})`;
          gctx.beginPath();
          gctx.arc(x, y, r, 0, TAU);
          gctx.fill();
        }
      }
    }
    ctx.drawImage(cachedPaperCanvas, 0, 0, W, H);
  }
}

export function drawRainEnvironment(
  ctx: CanvasRenderingContext2D,
  time: number,
  showPuddle: boolean,
  showRain: boolean,
  bIdx = 0
): void {
  if (showPuddle) {
    ctx.save();
    const pPts = ellipsePts(500, 855, 255, 30, 0, 32);
    psShape(ctx, pPts, '#c2d6d6', {
      key: 'puddleBase',
      w: 2.4,
      line: '#8faaaa',
      fillA: 0.55,
      amt: 0.8,
      B: bIdx
    });
    for (let r = 0; r < 2; r++) {
      const phase = (time * 0.85 + r * 0.5) % 1;
      const rx = 55 + phase * 165;
      const ry = 7 + phase * 18;
      ctx.save();
      ctx.globalAlpha = (1 - phase) * 0.45;
      psLine(ctx, ellipsePts(500, 855, rx, ry, 0, 24), {
        closed: true,
        key: 'rip' + r,
        w: 2.0,
        col: '#eef7f7',
        second: false,
        B: bIdx
      });
      ctx.restore();
    }
    ctx.restore();
  }

  if (showRain) {
    ctx.save();
    const rng = rngKey('pastel-rain-drops');
    ctx.strokeStyle = 'rgba(244, 250, 250, 0.68)';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 28; i++) {
      const bx = rng() * 960 + 20;
      const by = rng() * 920;
      const speed = 260 + rng() * 140;
      const len = 18 + rng() * 14;
      const y = ((by + time * speed) % 940) - 20;
      const x = bx - (y - by) * 0.12;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - len * 0.14, y + len);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// =====================================================================
//  3. MASTER CHARACTER: RAINCOAT CALICO CAT (1000x1000 Calibrated)
// =====================================================================
export function drawRaincoatCat(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sc = 1,
  o: {
    key?: string;
    mode?: AnimationMode;
    tt?: number;
    bIdx?: number;
    rig?: CatRigState;
  } = {}
): void {
  const key = o.key ?? 'rc';
  const mode = o.rig?.mode ?? o.mode ?? 'static';
  const isStatic = mode === 'static';
  const is12 = mode === '12layer';
  const isManual = mode === 'manual';
  const wFreq = TAU / 3.0;
  const ttVal = o.tt ?? 0;
  const bIdx = o.rig?.boilFrame ?? o.bIdx ?? 0;
  const L = o.rig?.layers ?? DEFAULT_CAT_RIG.layers;

  const happyEnv = is12
    ? EZ.io(seg(ttVal % 6, 1.5, 2.2)) * (1 - EZ.io(seg(ttVal % 6, 4.2, 4.9)))
    : 0;

  const breath = isManual
    ? o.rig!.breath
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq) * 0.012 + happyEnv * 0.01;
  const bodySway = isManual
    ? o.rig!.bodySway
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq * 0.5) * 0.014;
  const headTilt = isManual
    ? o.rig!.headTilt
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq - 0.3) * 0.024 +
        (is12 ? Math.sin(ttVal * wFreq * 0.5 + 0.4) * 0.02 : 0);
  const headBobY = isManual
    ? o.rig!.headBobY
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq * 2 - 0.2) * 2.0 - happyEnv * 3.5;
  const earRotL = isManual
    ? o.rig!.earRotL
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq - 0.8) * 0.032 +
        (is12 ? Math.sin(ttVal * TAU * 2.0) * happyEnv * 0.028 : 0);
  const earRotR = isManual
    ? o.rig!.earRotR
    : isStatic
      ? 0
      : -Math.sin(ttVal * wFreq - 1.1) * 0.032 -
        (is12 ? Math.sin(ttVal * TAU * 2.0 + 0.5) * happyEnv * 0.028 : 0);
  const armLRot = isManual
    ? o.rig!.armLRot
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq - 0.4) * 0.025 - happyEnv * 0.045;
  const armRRot = isManual
    ? o.rig!.armRRot
    : isStatic
      ? 0
      : -Math.sin(ttVal * wFreq - 0.6) * 0.022;
  const umbTilt = isManual
    ? o.rig!.umbTilt
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq * 2 - 0.3) * 0.018 + happyEnv * 0.035;
  const toggleSway = isManual
    ? o.rig!.toggleSway
    : isStatic
      ? 0
      : Math.sin(ttVal * wFreq - 0.7) * 0.035;
  const whiskerTwitch = isManual
    ? o.rig!.whiskerTwitch
    : isStatic
      ? 0
      : Math.sin(ttVal * TAU * 2.0) * (0.012 + happyEnv * 0.022);
  const footTapL = isManual
    ? o.rig!.footTapL
    : is12
      ? Math.max(0, Math.sin(ttVal * wFreq)) * 0.035
      : 0;
  const footTapR = isManual
    ? o.rig!.footTapR
    : is12
      ? Math.max(0, -Math.sin(ttVal * wFreq)) * 0.035
      : 0;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sc, sc);
  ctx.translate(-500, -500);

  // -------------------------------------------------------------------
  // LAYER 1: LITTLE ROUND CALICO FEET PEEKING UNDER HEM
  // -------------------------------------------------------------------
  if (L.feet) {
    // Left Foot (x: 344..448, y: 814..858)
    withPivot(ctx, 396, 825, -footTapL, 1, 1, 0, 0, () => {
      const footLP = bezierPts(
        [
          [[344, 814], [350, 842], [374, 858], [402, 858]],
          [[402, 858], [428, 858], [444, 844], [449, 828]],
          [[449, 828], [415, 820], [375, 816], [344, 814]]
        ],
        16
      );
      psShape(ctx, footLP, RC.furCream, {
        key: key + 'footL',
        w: 4.8,
        line: RC.ink,
        line2: RC.inkSoft,
        crayon: RC.furShade,
        crAl: 0.16,
        B: bIdx,
        innerFn: () => {
          const patchLP = bezierPts(
            [
              [[340, 810], [346, 846], [372, 860], [398, 856]],
              [[398, 856], [402, 838], [392, 820], [376, 812]],
              [[376, 812], [358, 810], [346, 810], [340, 810]]
            ],
            12
          );
          psShape(ctx, patchLP, RC.furBrown, { key: key + 'footLPatch', line: false, B: bIdx });
          psBlush(ctx, 396, 820, 55, 14, '90,65,45', 0.35);
        }
      });
    });

    // Right Foot (x: 595..684, y: 804..848)
    withPivot(ctx, 638, 815, footTapR, 1, 1, 0, 0, () => {
      const footRP = bezierPts(
        [
          [[595, 828], [606, 846], [632, 850], [656, 842]],
          [[656, 842], [674, 834], [682, 818], [685, 804]],
          [[685, 804], [650, 812], [618, 822], [595, 828]]
        ],
        16
      );
      psShape(ctx, footRP, RC.furTan, {
        key: key + 'footR',
        w: 4.8,
        line: RC.ink,
        line2: RC.inkSoft,
        crayon: RC.furShade,
        crAl: 0.16,
        B: bIdx,
        innerFn: () => {
          const patchRP = bezierPts(
            [
              [[646, 844], [652, 822], [662, 806], [686, 802]],
              [[686, 802], [684, 826], [668, 842], [646, 844]]
            ],
            12
          );
          psShape(ctx, patchRP, RC.furGrey, { key: key + 'footRPatch', line: false, B: bIdx });
          psBlush(ctx, 638, 812, 48, 12, '90,65,45', 0.32);
        }
      });
    });
  }

  // -------------------------------------------------------------------
  // BREATHING TORSO HIERARCHY
  // -------------------------------------------------------------------
  withPivot(ctx, 500, 810, bodySway, 1 - breath * 0.35, 1 + breath, 0, 0, () => {
    // -----------------------------------------------------------------
    // LAYER 2: RIGHT PAW PEEKING UNDER RIGHT SLEEVE CUFF
    // -----------------------------------------------------------------
    if (L.rightPaw) {
      withPivot(ctx, 750, 660, armRRot, 1, 1, 0, 0, () => {
        const pawRP = bezierPts(
          [
            [[752, 682], [764, 668], [778, 660], [786, 668]],
            [[786, 668], [790, 682], [780, 702], [764, 706]],
            [[764, 706], [756, 707], [752, 696], [752, 682]]
          ],
          14
        );
        psShape(ctx, pawRP, RC.furCream, {
          key: key + 'pawR',
          w: 4.4,
          line: RC.ink,
          line2: RC.inkSoft,
          B: bIdx,
          innerFn: () => {
            psShape(
              ctx,
              [
                [750, 660],
                [788, 660],
                [788, 688],
                [750, 692]
              ],
              RC.furGrey,
              { key: key + 'pawRGrey', line: false, B: bIdx }
            );
          }
        });
      });
    }

    // -----------------------------------------------------------------
    // LAYER 3: BACK HALF OF FOLDED UMBRELLA (Sticking out left behind sleeve)
    // -----------------------------------------------------------------
    if (L.umbBack) {
      withPivot(ctx, 345, 675, armLRot + umbTilt, 1, 1, 0, 0, () => {
        const ferruleP = bezierPts(
          [
            [[184, 681], [166, 683], [153, 685], [153, 690]],
            [[153, 690], [153, 695], [166, 697], [184, 698]],
            [[184, 698], [186, 690], [186, 685], [184, 681]]
          ],
          12
        );
        psShape(ctx, ferruleP, RC.umbHandle, {
          key: key + 'umbTip',
          w: 4.0,
          line: RC.ink,
          B: bIdx
        });

        const umbBackP = bezierPts(
          [
            [[180, 680], [202, 666], [224, 656], [244, 652]],
            [[244, 652], [252, 672], [258, 692], [265, 710]],
            [[265, 710], [234, 708], [202, 704], [180, 696]],
            [[180, 696], [178, 690], [178, 684], [180, 680]]
          ],
          14
        );
        psShape(ctx, umbBackP, RC.umbMid, {
          key: key + 'umbBack',
          w: 4.0,
          line: RC.ink,
          line2: RC.inkSoft,
          crayon: RC.umbShade,
          B: bIdx,
          grad: (bb) => {
            const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
            g.addColorStop(0, RC.umbLight);
            g.addColorStop(0.6, RC.umbMid);
            g.addColorStop(1, RC.umbShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          }
        });
        psLine(ctx, [[182, 686], [244, 672]], {
          key: key + 'umbRibL1',
          w: 2.6,
          col: RC.ink,
          second: false,
          B: bIdx
        });
        psLine(ctx, [[182, 691], [254, 694]], {
          key: key + 'umbRibL2',
          w: 2.6,
          col: RC.ink,
          second: false,
          B: bIdx
        });
      });
    }

    // -----------------------------------------------------------------
    // LAYER 4: BUTTERCUP YELLOW RAINCOAT BODY & RIGHT PANEL/SLEEVE
    // -----------------------------------------------------------------
    // 4A. Right Half of Coat + Right Sleeve
    if (L.coatRight) {
      const coatRightP = bezierPts(
        [
          [[535, 545], [605, 520], [668, 505], [710, 502]],
          [[710, 502], [748, 546], [782, 600], [801, 642]],
          [[801, 642], [803, 652], [782, 668], [748, 692]],
          [[748, 692], [760, 725], [770, 754], [768, 772]],
          [[768, 772], [762, 792], [722, 804], [665, 814]],
          [[665, 814], [620, 824], [592, 834], [576, 830]],
          [[576, 830], [566, 824], [562, 795], [556, 750]],
          [[556, 750], [550, 660], [545, 590], [535, 545]]
        ],
        18
      );
      psShape(ctx, coatRightP, RC.coatMid, {
        key: key + 'coatRight',
        line: false,
        crayon: RC.coatShade,
        crAl: 0.16,
        B: bIdx,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
          g.addColorStop(0, RC.coatLight);
          g.addColorStop(0.55, RC.coatMid);
          g.addColorStop(1, RC.coatWarm);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psBlush(ctx, 660, 795, 110, 35, '235,198,105', 0.45, -0.15);
          psBlush(ctx, 575, 680, 35, 140, '232,192,98', 0.38);
        }
      });

      const coatRightStroke = bezierPts(
        [
          [[710, 502], [748, 546], [782, 600], [801, 642]],
          [[801, 642], [803, 652], [782, 668], [748, 692]]
        ],
        16
      );
      psLine(ctx, coatRightStroke, {
        key: key + 'coatRSlvLine',
        w: 4.8,
        col: RC.ink,
        col2: RC.inkSoft,
        B: bIdx
      });

      psLine(ctx, bezierPts([[[718, 572], [734, 612], [744, 654], [748, 692]]], 14), {
        key: key + 'coatRCrease',
        w: 4.2,
        col: RC.ink,
        col2: RC.inkSoft,
        B: bIdx
      });

      const coatRightSkirtStroke = bezierPts(
        [
          [[749, 682], [762, 724], [770, 754], [768, 772]],
          [[768, 772], [762, 792], [722, 804], [665, 814]],
          [[665, 814], [620, 824], [592, 834], [576, 830]],
          [[576, 830], [566, 824], [563, 800], [561, 782]]
        ],
        18
      );
      psLine(ctx, coatRightSkirtStroke, {
        key: key + 'coatRSkirtLine',
        w: 4.8,
        col: RC.ink,
        col2: RC.inkSoft,
        B: bIdx
      });
    }

    // 4B. Left Half of Coat Body (Overlapping Center Placket! With bouncy wavy bottom hem!)
    if (L.coatLeft) {
      const coatLeftP = bezierPts(
        [
          [[282, 504], [360, 520], [450, 528], [534, 548]],
          [[534, 548], [552, 566], [556, 615], [560, 685]],
          [[560, 685], [564, 755], [562, 815], [542, 842]],
          [[542, 842], [526, 850], [486, 844], [435, 830]],
          [[435, 830], [392, 816], [358, 812], [320, 812]],
          [[320, 812], [278, 812], [238, 794], [218, 766]],
          [[218, 766], [208, 750], [214, 726], [228, 694]],
          [[228, 694], [242, 620], [256, 550], [282, 504]]
        ],
        18
      );
      psShape(ctx, coatLeftP, RC.coatMid, {
        key: key + 'coatLeft',
        line: false,
        crayon: RC.coatShade,
        crAl: 0.16,
        B: bIdx,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
          g.addColorStop(0, RC.coatLight);
          g.addColorStop(0.5, RC.coatMid);
          g.addColorStop(1, RC.coatWarm);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          psBlush(ctx, 325, 735, 95, 42, '232,192,98', 0.45, 0.15);
          psBlush(ctx, 420, 805, 120, 32, '235,198,105', 0.4, 0.12);
        }
      });

      const coatLeftSkirtStroke = bezierPts(
        [
          [[228, 694], [214, 726], [208, 750], [218, 766]],
          [[218, 766], [238, 794], [278, 812], [320, 812]],
          [[320, 812], [358, 812], [392, 816], [435, 830]],
          [[435, 830], [486, 844], [526, 850], [542, 842]],
          [[542, 842], [562, 815], [564, 755], [560, 685]],
          [[560, 685], [556, 615], [552, 566], [534, 548]]
        ],
        20
      );
      psLine(ctx, coatLeftSkirtStroke, {
        key: key + 'coatLSkirtLine',
        w: 4.8,
        col: RC.ink,
        col2: RC.inkSoft,
        B: bIdx
      });

      // Collar fold detail lines near neck placket
      psLine(ctx, bezierPts([[[462, 550], [492, 553], [510, 560], [520, 568]]], 10), {
        key: key + 'colCreaseL',
        w: 3.6,
        col: RC.ink,
        second: false,
        B: bIdx
      });
      psLine(ctx, bezierPts([[[584, 552], [598, 543], [610, 539], [622, 538]]], 10), {
        key: key + 'colCreaseR',
        w: 3.6,
        col: RC.ink,
        second: false,
        B: bIdx
      });
    }

    // -----------------------------------------------------------------
    // LAYER 5: FRONT HALF OF UMBRELLA + CALICO PAW + LEFT SLEEVE
    // -----------------------------------------------------------------
    if (L.umbFrontAndSleeveL) {
      withPivot(ctx, 315, 555, armLRot, 1, 1, 0, 0, () => {
        // 5A. Front half of Umbrella (Pleated blue canopy ruff + J-hook handle)
        withPivot(ctx, 380, 668, umbTilt, 1, 1, 0, 0, () => {
          const handleP = bezierPts(
            [
              [[432, 654], [462, 648], [486, 646], [500, 654]],
              [[500, 654], [514, 664], [512, 688], [496, 698]],
              [[496, 698], [482, 704], [471, 694], [474, 682]],
              [[474, 682], [476, 676], [484, 676], [488, 680]],
              [[488, 680], [494, 680], [494, 668], [484, 666]],
              [[484, 666], [466, 665], [448, 668], [432, 670]]
            ],
            14
          );
          psShape(ctx, handleP, RC.umbHandle, {
            key: key + 'umbHandle',
            w: 4.0,
            line: RC.ink,
            B: bIdx,
            innerFn: () => {
              psLine(
                ctx,
                [
                  [442, 656],
                  [485, 654],
                  [502, 666]
                ],
                { key: key + 'umbHHi', w: 2.2, col: RC.umbHandleHi, second: false, B: bIdx }
              );
            }
          });

          const umbFrontP = bezierPts(
            [
              [[376, 654], [398, 642], [420, 632], [438, 626]],
              [[438, 626], [434, 636], [432, 644], [446, 650]],
              [[446, 650], [436, 658], [434, 668], [446, 678]],
              [[446, 678], [438, 686], [438, 694], [442, 701]],
              [[442, 701], [416, 698], [394, 695], [376, 694]],
              [[376, 694], [376, 678], [376, 666], [376, 654]]
            ],
            12
          );
          psShape(ctx, umbFrontP, RC.umbMid, {
            key: key + 'umbFront',
            w: 4.0,
            line: RC.ink,
            line2: RC.inkSoft,
            crayon: RC.umbShade,
            B: bIdx,
            grad: (bb) => {
              const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
              g.addColorStop(0, RC.umbLight);
              g.addColorStop(0.55, RC.umbMid);
              g.addColorStop(1, RC.umbShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });
          psLine(ctx, [[393, 644], [395, 695]], {
            key: key + 'umbBand',
            w: 2.8,
            col: RC.ink,
            second: false,
            B: bIdx
          });
          psLine(ctx, [[395, 658], [442, 650]], {
            key: key + 'umbRibR1',
            w: 2.4,
            col: RC.ink,
            second: false,
            B: bIdx
          });
          psLine(ctx, [[395, 676], [442, 678]], {
            key: key + 'umbRibR2',
            w: 2.4,
            col: RC.ink,
            second: false,
            B: bIdx
          });
        });

        // 5B. Dark Inner Sleeve Cuff Cavity behind the Paw
        const cuffCavityP = bezierPts(
          [
            [[302, 738], [318, 736], [334, 726], [344, 714]],
            [[344, 714], [328, 700], [314, 706], [302, 738]]
          ],
          10
        );
        psShape(ctx, cuffCavityP, RC.coatDeep, {
          key: key + 'cuffCavL',
          w: 3.8,
          line: RC.ink,
          B: bIdx
        });

        // 5C. Cute Calico Left Paw Holding the Umbrella
        const pawLP = bezierPts(
          [
            [[318, 706], [334, 722], [358, 726], [376, 716]],
            [[376, 716], [390, 706], [394, 680], [382, 656]],
            [[382, 656], [362, 660], [336, 680], [318, 706]]
          ],
          16
        );
        psShape(ctx, pawLP, RC.furOrange, {
          key: key + 'pawL',
          w: 4.6,
          line: RC.ink,
          line2: RC.inkSoft,
          crayon: '#bf793d',
          crAl: 0.16,
          B: bIdx,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y1, bb.x1, bb.y0);
            g.addColorStop(0, RC.furOrange);
            g.addColorStop(0.65, '#dfa872');
            g.addColorStop(1, RC.furCream);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          }
        });

        // 5D. Left Raincoat Sleeve Sweeping Over the Shoulder & Wrist
        const sleeveLP = bezierPts(
          [
            [[282, 504], [248, 538], [228, 588], [230, 636]],
            [[230, 636], [234, 682], [262, 732], [294, 744]],
            [[294, 744], [304, 746], [312, 724], [324, 700]],
            [[324, 700], [344, 672], [368, 656], [391, 652]],
            [[391, 652], [394, 638], [378, 616], [358, 594]],
            [[358, 594], [345, 578], [335, 540], [282, 504]]
          ],
          18
        );
        psShape(ctx, sleeveLP, RC.coatMid, {
          key: key + 'sleeveL',
          line: false,
          crayon: RC.coatShade,
          crAl: 0.15,
          B: bIdx,
          grad: (bb) => {
            const g = ctx.createRadialGradient(285, 595, 15, 305, 620, 130);
            g.addColorStop(0, RC.coatLight);
            g.addColorStop(0.65, RC.coatMid);
            g.addColorStop(1, RC.coatWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          }
        });

        const sleeveLOutline = bezierPts(
          [
            [[282, 504], [248, 538], [228, 588], [230, 636]],
            [[230, 636], [234, 682], [262, 732], [294, 744]],
            [[294, 744], [304, 746], [312, 724], [324, 700]],
            [[324, 700], [344, 672], [368, 656], [391, 652]],
            [[391, 652], [394, 638], [376, 616], [336, 578]]
          ],
          18
        );
        psLine(ctx, sleeveLOutline, {
          key: key + 'slvLineL',
          w: 4.8,
          col: RC.ink,
          col2: RC.inkSoft,
          B: bIdx
        });
        psLine(ctx, [[354, 574], [365, 604]], {
          key: key + 'slvFoldL',
          w: 3.6,
          col: RC.ink,
          second: false,
          B: bIdx
        });
      });
    }

    // -----------------------------------------------------------------
    // LAYER 6: TWO WOODEN DUFFLE COAT TOGGLES & CORD LOOPS
    // -----------------------------------------------------------------
    if (L.toggles) {
      const drawDuffleToggle = (ty: number, tKey: string) => {
        withPivot(ctx, 560, ty, toggleSway, 1, 1, 0, 0, () => {
          const tabP = bezierPts(
            [
              [[528, ty - 14], [516, ty - 14], [512, ty - 4], [514, ty + 8]],
              [[514, ty + 8], [516, ty + 18], [526, ty + 19], [530, ty + 14]],
              [[530, ty + 14], [526, ty + 6], [526, ty - 4], [528, ty - 14]]
            ],
            10
          );
          psShape(ctx, tabP, RC.coatWarm, {
            key: key + tKey + 'Tab',
            w: 3.4,
            line: RC.ink,
            B: bIdx
          });

          const cordP = bezierPts(
            [
              [[524, ty - 7], [552, ty - 6], [585, ty - 10], [606, ty - 6]],
              [[606, ty - 6], [612, ty], [608, ty + 8], [598, ty + 8]],
              [[598, ty + 8], [568, ty + 10], [542, ty + 10], [524, ty + 7]],
              [[524, ty + 7], [524, ty + 2], [524, ty - 2], [524, ty - 7]]
            ],
            12
          );
          psShape(ctx, cordP, RC.cord, {
            key: key + tKey + 'Cord',
            w: 3.4,
            line: RC.ink,
            B: bIdx
          });
          psLine(ctx, [[526, ty + 1], [578, ty]], {
            key: key + tKey + 'CordMid',
            w: 2.8,
            col: RC.ink,
            second: false,
            B: bIdx
          });

          const pegP = bezierPts(
            [
              [[576, ty - 28], [586, ty - 31], [596, ty - 29], [598, ty - 24]],
              [[598, ty - 24], [599, ty - 4], [599, ty + 16], [596, ty + 28]],
              [[596, ty + 28], [592, ty + 32], [585, ty + 32], [582, ty + 26]],
              [[582, ty + 26], [578, ty + 10], [576, ty - 10], [576, ty - 28]]
            ],
            14
          );
          psShape(ctx, pegP, RC.toggleMid, {
            key: key + tKey + 'Peg',
            w: 3.8,
            line: RC.ink,
            crayon: RC.toggleDark,
            crAl: 0.22,
            B: bIdx,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
              g.addColorStop(0, RC.toggleLight);
              g.addColorStop(0.5, RC.toggleMid);
              g.addColorStop(1, RC.toggleDark);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });
          psLine(
            ctx,
            bezierPts([[[577, ty - 25], [584, ty - 21], [592, ty - 21], [597, ty - 25]]], 8),
            { key: key + tKey + 'Cap', w: 2.4, col: RC.ink, second: false, B: bIdx }
          );
        });
      };

      drawDuffleToggle(612, 'tog1');
      drawDuffleToggle(716, 'tog2');
    }

    // -----------------------------------------------------------------
    // LAYER 7: RAINCOAT HOOD, EAR SLITS & CALICO CAT HEAD
    // -----------------------------------------------------------------
    withPivot(ctx, 515, 480, headTilt, 1, 1, 0, headBobY, () => {
      if (L.hoodCavityAndFace) {
        // 7A. Deep Inner Hood Shadow Cavity (Behind the Cat's Face)
        const hoodCavityP = bezierPts(
          [
            [[522, 234], [610, 260], [692, 320], [730, 385]],
            [[730, 385], [740, 440], [700, 490], [542, 558]],
            [[542, 558], [465, 535], [320, 490], [304, 425]],
            [[304, 425], [308, 365], [375, 295], [522, 234]]
          ],
          16
        );
        psShape(ctx, hoodCavityP, RC.coatDeep, { key: key + 'hoodCav', line: false, B: bIdx });

        // 7B. Plump Mochi Cat Head & Clipped Calico Fur Patches
        const faceP = bezierPts(
          [
            [[522, 236], [598, 256], [674, 314], [708, 378]],
            [[708, 378], [724, 434], [692, 488], [615, 518]],
            [[615, 518], [568, 536], [552, 548], [540, 556]],
            [[540, 556], [522, 542], [488, 528], [425, 520]],
            [[425, 520], [348, 492], [318, 444], [320, 388]],
            [[320, 388], [326, 326], [420, 262], [522, 236]]
          ],
          20
        );
        psShape(ctx, faceP, RC.furCream, {
          key: key + 'faceBase',
          w: 4.5,
          line: RC.ink,
          line2: RC.inkSoft,
          crayon: RC.furShade,
          crAl: 0.18,
          B: bIdx,
          grad: (bb) => {
            const g = ctx.createRadialGradient(520, 380, 25, 520, 410, 210);
            g.addColorStop(0, RC.furLight);
            g.addColorStop(0.72, RC.furCream);
            g.addColorStop(1, RC.furShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // 1. Left Forehead Soft Apricot Under-Wash
            const leftApricotP = bezierPts(
              [
                [[525, 234], [520, 295], [492, 344], [468, 342]],
                [[468, 342], [455, 318], [418, 378], [358, 398]],
                [[358, 398], [326, 405], [318, 390], [322, 340]],
                [[322, 340], [380, 260], [460, 234], [525, 234]]
              ],
              14
            );
            psShape(ctx, leftApricotP, RC.furOrangeLight, {
              key: key + 'patchLApr',
              line: false,
              B: bIdx
            });

            // 2. Left Forehead Ginger-Orange Patch (with 2 fluffy fur lobes!)
            const leftOrangeP = bezierPts(
              [
                [[522, 234], [516, 286], [490, 336], [472, 334]],
                [[472, 334], [460, 332], [458, 304], [450, 304]],
                [[450, 304], [435, 338], [392, 372], [342, 386]],
                [[342, 386], [322, 390], [320, 340], [360, 280]],
                [[360, 280], [420, 240], [480, 234], [522, 234]]
              ],
              16
            );
            psShape(ctx, leftOrangeP, RC.furOrange, {
              key: key + 'patchLOrg',
              line: false,
              crayon: '#bf793d',
              crAl: 0.26,
              B: bIdx
            });
            psBlush(ctx, 482, 326, 22, 14, '216,150,88', 0.65, -0.35);
            psBlush(ctx, 405, 355, 38, 16, '216,150,88', 0.65, -0.42);

            // 3. Right Eye & Temple Soft Buff-Apricot Patch
            const rightTanP = bezierPts(
              [
                [[546, 240], [552, 292], [556, 344], [585, 384]],
                [[585, 384], [618, 412], [672, 410], [716, 398]],
                [[716, 398], [720, 330], [650, 255], [546, 240]]
              ],
              16
            );
            psShape(ctx, rightTanP, RC.furTan, { key: key + 'patchRTan', line: false, B: bIdx });

            // 4. Right Forehead & Temple Slate Blue-Grey Calico Patch
            const rightGreyP = bezierPts(
              [
                [[526, 234], [534, 278], [558, 308], [596, 314]],
                [[596, 314], [638, 320], [666, 346], [662, 366]],
                [[662, 366], [658, 386], [682, 400], [716, 398]],
                [[716, 398], [720, 325], [645, 255], [526, 234]]
              ],
              16
            );
            psShape(ctx, rightGreyP, RC.furGrey, {
              key: key + 'patchRGrey',
              line: false,
              crayon: RC.furGreyDark,
              crAl: 0.26,
              B: bIdx
            });
            psBlush(ctx, 595, 314, 34, 14, '124,128,133', 0.55, 0.35);
          }
        });

        // 7C. Soft Rosy-Peach Cheek Blushes
        const blushBoost = happyEnv * 0.16;
        psShape(ctx, ellipsePts(434, 432, 32, 21, 0.05, 20), RC.blushCore, {
          key: key + 'blCoreL',
          line: false,
          fillA: 0.52 + blushBoost,
          B: bIdx
        });
        psBlush(ctx, 434, 432, 38, 25, RC.blush, 0.54 + blushBoost, 0.05);

        psShape(ctx, ellipsePts(648, 422, 31, 20, -0.05, 20), RC.blushCore, {
          key: key + 'blCoreR',
          line: false,
          fillA: 0.52 + blushBoost,
          B: bIdx
        });
        psBlush(ctx, 648, 422, 37, 24, RC.blush, 0.54 + blushBoost, -0.05);
      }

      // 7D. Peaceful Closed U-Crescent Eyes & Tiny Pink Nose
      if (L.eyesAndNose) {
        const eyeLP = bezierPts(
          [
            [[432, 392], [430, 386], [438, 384], [446, 388]],
            [[446, 388], [454, 392], [462, 388], [468, 380]],
            [[468, 380], [473, 375], [480, 380], [477, 388]],
            [[477, 388], [472, 402], [456, 408], [442, 404]],
            [[442, 404], [433, 401], [432, 396], [432, 392]]
          ],
          14
        );
        psShape(ctx, eyeLP, RC.eye, {
          key: key + 'eyeL',
          w: 2.4,
          line: RC.eye,
          second: false,
          B: bIdx
        });

        const eyeRP = bezierPts(
          [
            [[601, 380], [599, 372], [606, 369], [612, 375]],
            [[612, 375], [618, 382], [626, 384], [635, 381]],
            [[635, 381], [642, 378], [647, 382], [644, 389]],
            [[644, 389], [638, 399], [622, 402], [609, 395]],
            [[609, 395], [603, 391], [602, 385], [601, 380]]
          ],
          14
        );
        psShape(ctx, eyeRP, RC.eye, {
          key: key + 'eyeR',
          w: 2.4,
          line: RC.eye,
          second: false,
          B: bIdx
        });

        const noseP = bezierPts(
          [
            [[546, 398], [556, 398], [559, 403], [554, 409]],
            [[554, 409], [550, 413], [548, 415], [546, 415]],
            [[546, 415], [544, 415], [542, 413], [538, 409]],
            [[538, 409], [533, 403], [536, 398], [546, 398]]
          ],
          12
        );
        psShape(ctx, noseP, RC.nose, {
          key: key + 'nose',
          w: 2.8,
          line: RC.noseLine,
          second: false,
          B: bIdx
        });
        psLine(ctx, [[547, 415], [548, 430]], {
          key: key + 'mouthTick',
          w: 3.8,
          col: RC.eye,
          second: false,
          B: bIdx
        });
      }

      // 7E. Buttercup Yellow Raincoat Hood Ring (Framed cleanly around the face via 'evenodd'!)
      if (L.hoodRing) {
        const hoodOuterPts = bezierPts(
          [
            [[495, 138], [572, 144], [638, 186], [698, 240]],
            [[698, 240], [748, 312], [772, 388], [766, 446]],
            [[766, 446], [758, 488], [716, 512], [674, 526]],
            [[674, 526], [620, 535], [568, 540], [542, 558]],
            [[542, 558], [516, 538], [450, 528], [388, 540]],
            [[388, 540], [312, 532], [254, 496], [232, 444]],
            [[232, 444], [218, 392], [248, 312], [312, 232]],
            [[312, 232], [362, 184], [422, 144], [495, 138]]
          ],
          20
        );

        const hoodInnerPts = bezierPts(
          [
            [[522, 236], [598, 258], [682, 318], [722, 378]],
            [[722, 378], [736, 428], [705, 478], [625, 514]],
            [[625, 514], [572, 536], [552, 548], [542, 558]],
            [[542, 558], [520, 540], [478, 526], [405, 516]],
            [[405, 516], [332, 482], [304, 432], [312, 378]],
            [[312, 378], [322, 322], [435, 260], [522, 236]]
          ],
          20
        );

        const QOut = wobble(hoodOuterPts, true, 1.15, key + 'hOutFill', 6, bIdx);
        const QIn = wobble(hoodInnerPts, true, 1.15, key + 'hInFill', 6, bIdx);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(QOut[0][0], QOut[0][1]);
        for (let i = 1; i < QOut.length; i++) ctx.lineTo(QOut[i][0], QOut[i][1]);
        ctx.closePath();
        ctx.moveTo(QIn[0][0], QIn[0][1]);
        for (let i = 1; i < QIn.length; i++) ctx.lineTo(QIn[i][0], QIn[i][1]);
        ctx.closePath();

        const hGrad = ctx.createRadialGradient(485, 220, 30, 500, 340, 290);
        hGrad.addColorStop(0, RC.coatLight);
        hGrad.addColorStop(0.65, RC.coatMid);
        hGrad.addColorStop(1, RC.coatWarm);
        ctx.fillStyle = hGrad;
        ctx.fill('evenodd');

        ctx.clip('evenodd');
        pencil(
          ctx,
          { x0: 215, y0: 135, x1: 775, y1: 560 },
          {
            key: key + 'hoodCr',
            c: RC.coatShade,
            al: 0.16,
            per: 90,
            len: 14,
            a: -0.65,
            w: 1.2,
            max: 2000
          }
        );
        ctx.restore();

        psLine(ctx, hoodInnerPts, {
          closed: true,
          key: key + 'hoodInLine',
          w: 4.8,
          col: RC.ink,
          col2: RC.inkSoft,
          B: bIdx
        });

        psLine(
          ctx,
          bezierPts(
            [
              [[358, 198], [412, 152], [454, 138], [495, 138]],
              [[495, 138], [546, 138], [595, 158], [636, 194]]
            ],
            18
          ),
          { key: key + 'hoodTopLine', w: 4.8, col: RC.ink, col2: RC.inkSoft, B: bIdx }
        );

        psLine(
          ctx,
          bezierPts(
            [
              [[312, 232], [254, 304], [224, 372], [232, 444]],
              [[232, 444], [244, 494], [295, 524], [388, 540]]
            ],
            18
          ),
          { key: key + 'hoodLeftLine', w: 4.8, col: RC.ink, col2: RC.inkSoft, B: bIdx }
        );

        psLine(
          ctx,
          bezierPts(
            [
              [[702, 242], [748, 314], [772, 388], [766, 446]],
              [[766, 446], [758, 488], [716, 512], [674, 526]]
            ],
            18
          ),
          { key: key + 'hoodRightLine', w: 4.8, col: RC.ink, col2: RC.inkSoft, B: bIdx }
        );
      }

      // 7F. Ears Poking Through the Hood Slit Holes!
      if (L.earsAndSlits) {
        withPivot(ctx, 355, 255, earRotL, 1, 1, 0, 0, () => {
          const earLP = bezierPts(
            [
              [[316, 286], [310, 252], [312, 214], [326, 196]],
              [[326, 196], [338, 188], [372, 202], [402, 224]],
              [[402, 224], [376, 254], [346, 274], [316, 286]]
            ],
            16
          );
          psShape(ctx, earLP, RC.furGrey, {
            key: key + 'earL',
            w: 4.8,
            line: RC.ink,
            line2: RC.inkSoft,
            crayon: RC.furGreyDark,
            crAl: 0.2,
            B: bIdx,
            innerFn: () => {
              const earInLP = bezierPts(
                [
                  [[334, 278], [334, 250], [338, 224], [346, 222]],
                  [[346, 222], [358, 222], [374, 236], [380, 246]],
                  [[380, 246], [362, 264], [346, 274], [334, 278]]
                ],
                12
              );
              psShape(ctx, earInLP, RC.earPink, { key: key + 'earInL', line: false, B: bIdx });
            }
          });
        });
        psLine(
          ctx,
          bezierPts(
            [
              [[312, 268], [302, 274], [302, 286], [316, 286]],
              [[316, 286], [350, 272], [382, 250], [404, 224]],
              [[404, 224], [410, 214], [402, 206], [390, 210]]
            ],
            14
          ),
          { key: key + 'earSlitL', w: 4.5, col: RC.ink, col2: RC.inkSoft, B: bIdx }
        );

        withPivot(ctx, 658, 245, earRotR, 1, 1, 0, 0, () => {
          const earRP = bezierPts(
            [
              [[614, 216], [642, 192], [674, 180], [688, 186]],
              [[688, 186], [702, 196], [702, 236], [696, 272]],
              [[696, 272], [666, 256], [636, 236], [614, 216]]
            ],
            16
          );
          psShape(ctx, earRP, RC.furOrange, {
            key: key + 'earR',
            w: 4.8,
            line: RC.ink,
            line2: RC.inkSoft,
            crayon: '#bf793d',
            crAl: 0.2,
            B: bIdx,
            innerFn: () => {
              psBlush(ctx, 696, 235, 18, 28, '248,238,225', 0.85);
              const earInRP = bezierPts(
                [
                  [[642, 236], [656, 218], [670, 210], [678, 214]],
                  [[678, 214], [684, 224], [684, 248], [682, 266]],
                  [[682, 266], [664, 256], [650, 246], [642, 236]]
                ],
                12
              );
              psShape(ctx, earInRP, RC.earPink, { key: key + 'earInR', line: false, B: bIdx });
            }
          });
        });
        psLine(
          ctx,
          bezierPts(
            [
              [[624, 202], [610, 202], [606, 212], [616, 220]],
              [[616, 220], [642, 242], [672, 262], [698, 274]],
              [[698, 274], [708, 276], [710, 264], [700, 250]]
            ],
            14
          ),
          { key: key + 'earSlitR', w: 4.5, col: RC.ink, col2: RC.inkSoft, B: bIdx }
        );
      }

      // 7G. 6 Expressive Curved Whiskers (Extending Out Across the Hood Rim!)
      if (L.whiskers) {
        withPivot(ctx, 402, 434, whiskerTwitch, 1, 1, 0, 0, () => {
          psLine(
            ctx,
            bezierPts([[[400, 422], [356, 418], [332, 422], [312, 428]]], 10),
            { key: key + 'whL1', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
          psLine(
            ctx,
            bezierPts([[[402, 434], [362, 440], [338, 448], [320, 458]]], 10),
            { key: key + 'whL2', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
          psLine(
            ctx,
            bezierPts([[[405, 446], [372, 462], [348, 476], [332, 492]]], 10),
            { key: key + 'whL3', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
        });

        withPivot(ctx, 680, 418, -whiskerTwitch, 1, 1, 0, 0, () => {
          psLine(
            ctx,
            bezierPts([[[678, 405], [712, 394], [734, 391], [754, 392]]], 10),
            { key: key + 'whR1', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
          psLine(
            ctx,
            bezierPts([[[680, 418], [714, 414], [734, 416], [750, 422]]], 10),
            { key: key + 'whR2', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
          psLine(
            ctx,
            bezierPts([[[680, 430], [710, 434], [728, 440], [744, 450]]], 10),
            { key: key + 'whR3', w: 2.8, col: RC.ink, second: false, B: bIdx }
          );
        });
      }
    }); // end head hierarchy
  }); // end torso hierarchy

  ctx.restore();
}

export function drawRiggedCalicoKitten(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sc: number,
  rig: CatRigState,
  tt = 0
): void {
  drawRaincoatCat(ctx, cx, cy, sc, {
    key: 'rcHero',
    mode: rig.mode,
    tt,
    bIdx: rig.boilFrame,
    rig
  });
}
