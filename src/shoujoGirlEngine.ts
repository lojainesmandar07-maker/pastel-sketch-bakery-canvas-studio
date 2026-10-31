/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 24-LAYER PROCEDURAL <canvas> SHOUJO ANIME GIRL ENGINE
 * Implements the 5 Mandatory Animation Engineering Rules:
 * 1. Hierarchical Pivot Rigging (`withPivot`)
 * 2. Phase-Lagged Harmonic Overlapping Action
 * 3. True 3-Stage Deforming Eyelid & Sclera-Clipped Round Iris (`drawShoujoEyeDeforming` — ZERO scaleY squashing)
 * 4. Sub-Pixel Hand-Drawn Line Boil on 3s (`B` at 8fps over 24fps motion)
 * 5. Visual Inspection & Interactive Control over All 3 Blink States (`u=0.0`, `u=0.55`, `u=1.0`)
 */

const TAU = Math.PI * 2;
let B = 1; // Global line-boil step (1..4)

type Pt = [number, number];
type CubicSeg = [Pt, Pt, Pt, Pt];

function hash32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wobble(P: Pt[], closed: boolean, amt = 0.25, key = 'w', _step = 9): Pt[] {
  if (!P || P.length < 2 || amt <= 0) return P;
  const rng = mulberry32(hash32(key + ':' + B));
  const out: Pt[] = [];
  const N = P.length;
  for (let i = 0; i < N; i++) {
    const p = P[i];
    if ((!closed && (i === 0 || i === N - 1)) || i % 2 !== 0) {
      out.push([p[0], p[1]]);
    } else {
      const dx = (rng() - 0.5) * 2 * amt;
      const dy = (rng() - 0.5) * 2 * amt;
      out.push([p[0] + dx, p[1] + dy]);
    }
  }
  return out;
}

function trace(ctx: CanvasRenderingContext2D, P: Pt[], closed = false): void {
  if (!P || !P.length) return;
  ctx.beginPath();
  ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]);
  if (closed) ctx.closePath();
}

interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function bbox(P: Pt[], pad = 0): BBox {
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

function ellipsePts(cx: number, cy: number, rx: number, ry: number, rot = 0, n = 32): Pt[] {
  const P: Pt[] = [];
  const c = Math.cos(rot),
    s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const ux = Math.cos(a) * rx,
      uy = Math.sin(a) * ry;
    P.push([cx + ux * c - uy * s, cy + ux * s + uy * c]);
  }
  return P;
}

function bezierPts(segs: CubicSeg[], nPerSeg = 18): Pt[] {
  const P: Pt[] = [];
  for (let s = 0; s < segs.length; s++) {
    const [p0, c1, c2, p1] = segs[s];
    const m = s === segs.length - 1 ? nPerSeg : nPerSeg - 1;
    for (let i = 0; i <= m; i++) {
      const t = i / nPerSeg,
        u = 1 - t;
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

function lerpPt(a: Pt, b: Pt, u: number): Pt {
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
}

function lerpSegs(segsA: CubicSeg[], segsB: CubicSeg[], u: number): CubicSeg[] {
  return segsA.map((sA, idx) => {
    const sB = segsB[idx];
    return [
      lerpPt(sA[0], sB[0], u),
      lerpPt(sA[1], sB[1], u),
      lerpPt(sA[2], sB[2], u),
      lerpPt(sA[3], sB[3], u),
    ];
  });
}

/**
 * Centripetal / Tensioned Catmull-Rom Spline Evaluator
 * Generates smooth C1-continuous curved shoujo hair paths from control points.
 */
export function catmullRomSplinePts(ctrlPts: Pt[], subSteps = 16, tension = 0.5): Pt[] {
  if (!ctrlPts || ctrlPts.length < 2) return ctrlPts ? [...ctrlPts] : [];
  if (ctrlPts.length === 2) {
    const out: Pt[] = [];
    for (let i = 0; i <= subSteps; i++) {
      out.push(lerpPt(ctrlPts[0], ctrlPts[1], i / subSteps));
    }
    return out;
  }
  const P: Pt[] = [];
  const n = ctrlPts.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = i === 0 ? [2 * ctrlPts[0][0] - ctrlPts[1][0], 2 * ctrlPts[0][1] - ctrlPts[1][1]] as Pt : ctrlPts[i - 1];
    const p1 = ctrlPts[i];
    const p2 = ctrlPts[i + 1];
    const p3 = i + 2 < n ? ctrlPts[i + 2] : [2 * ctrlPts[n - 1][0] - ctrlPts[n - 2][0], 2 * ctrlPts[n - 1][1] - ctrlPts[n - 2][1]] as Pt;

    const c1: Pt = [
      p1[0] + ((p2[0] - p0[0]) * tension) / 3,
      p1[1] + ((p2[1] - p0[1]) * tension) / 3,
    ];
    const c2: Pt = [
      p2[0] - ((p3[0] - p1[0]) * tension) / 3,
      p2[1] - ((p3[1] - p1[1]) * tension) / 3,
    ];

    const steps = i === n - 2 ? subSteps : subSteps - 1;
    for (let s = 0; s <= steps; s++) {
      const t = s / subSteps;
      const u = 1 - t;
      const x =
        u * u * u * p1[0] +
        3 * u * u * t * c1[0] +
        3 * u * t * t * c2[0] +
        t * t * t * p2[0];
      const y =
        u * u * u * p1[1] +
        3 * u * u * t * c1[1] +
        3 * u * t * t * c2[1] +
        t * t * t * p2[1];
      P.push([x, y]);
    }
  }
  return P;
}

// =====================================================================
//  1. SHOUJO ANIME GIRL PALETTE (SG) — Sampled from Reference
// =====================================================================
export const SG = {
  bg: '#ffffff',
  ink: '#0e0b0a',           // Crisp manga dip-pen ink
  inkSoft: '#3a2d28',       // Delicate hair/eyelash secondary ink
  inkHatch: '#5e4942',      // Fine diagonal cheek & neck hatching ink

  // Blonde Hair
  hairLight: '#fbf4d4',     // Crown & upper wave highlight
  hairMain: '#f7eec2',      // Main pastel butter-blonde
  hairWarm: '#f2e2ac',      // Mid-lower curl warm blonde
  hairShade: '#e5cf9c',     // Inner curl shadow blonde
  hairDeep: '#d5be97',      // Deep neck-side hair shadow

  // Porcelain Peach Skin & Blush
  skinLight: '#fff3ec',     // Forehead, nose bridge & chin highlight
  skinMain: '#fdebe1',      // Main porcelain-peach skin
  skinWarm: '#f9ded2',      // Soft cheek & shoulder tone
  skinNeckShade: '#f2c6c3', // Pinkish-peach cast shadow under jaw
  earShade: '#eecac5',      // Inner ear shell shadow
  blushRGB: '240,168,162',  // Soft shoujo cheek & shoulder blush RGB

  // Glossy Lips & Eyes
  lipUpper: '#e8a2a1',
  lipLower: '#f3c1bd',
  lipShadow: '#d98e8d',
  lipGloss: '#ffffff',
  sclera: '#ffffff',

  // Accessories & Lace Camisole
  ribbon: '#0e0c0d',        // Velvet black hair bows & choker
  roseLight: '#f7dfe0',     // Pale blush-pink rose petals
  roseMid: '#eccece',       // Main rose pink
  roseShade: '#d9b2b3',     // Inner rose spiral shadow
  heartPink: '#f6cbbd',     // Tiny choker heart pendant fill
  camisole: '#fcf8f2',      // Warm ivory-white camisole fabric
  laceFill: '#f7f3ed',      // Delicate floral lace trim fill
};

// =====================================================================
//  2. RIGGING STATE & INTERFACES FOR 24-LAYER SHOUJO GIRL
// =====================================================================
export type ShoujoAnimationMode = '24layer' | '5layer' | 'static' | 'manual';

export interface ShoujoRigState {
  mode: ShoujoAnimationMode;
  time: number;
  boilFrame: number;

  // Joint / Pose Overrides (Used in 'manual' & Keyframe Loop modes)
  headRot: number;          // degrees (-12..12)
  headDX: number;           // px (-15..15)
  headDY: number;           // px (-15..15)
  blink: number;            // 0.0 (Open) -> 0.55 (Half-Blink) -> 1.0 (Closed)
  gazeDX: number;           // px (-8..8)
  gazeDY: number;           // px (-6..6)
  browLift: number;         // px (-6..6)
  lipPart: number;          // scale (0.85..1.35)
  bangLRot: number;         // degrees (-10..10)
  bangRRot: number;         // degrees (-10..10)
  cheekLockRot: number;     // degrees (-12..12)
  shoulderCurlRot: number;  // degrees (-12..12)
  backHairLRot: number;     // degrees (-10..10)
  backHairRRot: number;     // degrees (-10..10)
  heartRot: number;         // degrees (-25..25)
  strapDropRot: number;     // degrees (-8..8)
  roseSpin: number;         // degrees (-15..15)
  bowFlutter: number;       // degrees (-12..12)
  torsoBreath: number;      // -1..1
  showSparkles: boolean;
  transparentBg?: boolean;
  renderHair?: boolean;
}

export const DEFAULT_SHOUJO_RIG: ShoujoRigState = {
  mode: '24layer',
  time: 0,
  boilFrame: 1,

  headRot: 0,
  headDX: 0,
  headDY: 0,
  blink: 0,
  gazeDX: 0,
  gazeDY: 0,
  browLift: 0,
  lipPart: 1,
  bangLRot: 0,
  bangRRot: 0,
  cheekLockRot: 0,
  shoulderCurlRot: 0,
  backHairLRot: 0,
  backHairRRot: 0,
  heartRot: 0,
  strapDropRot: 0,
  roseSpin: 0,
  bowFlutter: 0,
  torsoBreath: 0,
  showSparkles: true,
  renderHair: true,
};

// =====================================================================
//  3. SHOUJO MANGA / PASTEL-SKETCH PRIMITIVES & PIVOT RIGGING
// =====================================================================
interface LineOpts {
  closed?: boolean;
  key?: string;
  w?: number;
  col?: string;
  amt?: number;
  step?: number;
  cap?: CanvasLineCap;
  join?: CanvasLineJoin;
  a?: number;
  dash?: number[];
}

function sgLine(ctx: CanvasRenderingContext2D, P: Pt[], o: LineOpts = {}): Pt[] {
  const closed = !!o.closed,
    key = o.key ?? 'sgl',
    w = o.w ?? 2.6,
    col = o.col ?? SG.ink,
    amt = o.amt ?? 0.28;
  const Q = amt > 0 ? wobble(P, closed, amt, key, o.step ?? 9) : P;
  ctx.save();
  ctx.lineCap = o.cap ?? 'round';
  ctx.lineJoin = o.join ?? 'round';
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.globalAlpha = o.a ?? 0.98;
  if (o.dash) ctx.setLineDash(o.dash);
  trace(ctx, Q, closed);
  ctx.stroke();
  ctx.restore();
  return Q;
}

function sgTaperLine(
  ctx: CanvasRenderingContext2D,
  P: Pt[],
  wStart = 1.0,
  wMid = 3.2,
  wEnd = 0.8,
  col = SG.ink,
  a = 0.98
): void {
  if (P.length < 2) return;
  const N = P.length;
  const left: Pt[] = [],
    right: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const w =
      t < 0.5
        ? wStart + (wMid - wStart) * Math.sin(t * Math.PI)
        : wMid * Math.sin(t * Math.PI) + wEnd * (1 - Math.sin(t * Math.PI));
    const pPrev = P[Math.max(0, i - 1)];
    const pNext = P[Math.min(N - 1, i + 1)];
    const dx = pNext[0] - pPrev[0],
      dy = pNext[1] - pPrev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len,
      ny = dx / len;
    left.push([P[i][0] + nx * w * 0.5, P[i][1] + ny * w * 0.5]);
    right.push([P[i][0] - nx * w * 0.5, P[i][1] - ny * w * 0.5]);
  }
  ctx.save();
  ctx.fillStyle = col;
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.moveTo(left[0][0], left[0][1]);
  for (let i = 1; i < N; i++) ctx.lineTo(left[i][0], left[i][1]);
  for (let i = N - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

interface ShapeOpts {
  key?: string;
  amt?: number;
  step?: number;
  fillA?: number;
  grad?: (bb: BBox) => void;
  innerFn?: (bb: BBox) => void;
  line?: string | false;
  w?: number;
  lineA?: number;
}

function sgShape(ctx: CanvasRenderingContext2D, P: Pt[], fill: string, o: ShapeOpts = {}): Pt[] {
  const key = o.key ?? 'sgs',
    amt = o.amt ?? 0.28;
  const Q = amt > 0 ? wobble(P, true, amt, key, o.step ?? 9) : P;
  ctx.save();
  trace(ctx, Q, true);
  ctx.fillStyle = fill;
  ctx.globalAlpha = o.fillA ?? 1;
  ctx.fill();
  ctx.restore();

  if (o.grad || o.innerFn) {
    ctx.save();
    trace(ctx, Q, true);
    ctx.clip();
    const bb = bbox(Q, 4);
    if (o.grad) o.grad(bb);
    if (o.innerFn) o.innerFn(bb);
    ctx.restore();
  }

  if (o.line !== false) {
    sgLine(ctx, P, {
      closed: true,
      key: key + 'L',
      w: o.w ?? 2.6,
      col: typeof o.line === 'string' ? o.line : SG.ink,
      amt,
      a: o.lineA ?? 0.98,
    });
  }
  return Q;
}

function sgBlush(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  col = SG.blushRGB,
  a = 0.45,
  rot = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(1, ry / rx);
  const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  gr.addColorStop(0, 'rgba(' + col + ',' + a + ')');
  gr.addColorStop(0.55, 'rgba(' + col + ',' + a * 0.65 + ')');
  gr.addColorStop(1, 'rgba(' + col + ',0)');
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function withPivot(
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

interface CatmullRibbonLockOpts {
  key: string;
  tier?: 'under' | 'mid' | 'over';
  pinchAt?: number;        // 0..1 position of 3D S-wave ribbon twist
  pinchFactor?: number;    // 0.25..0.85 width reduction at twist
  asymBias?: number;       // -0.4..0.4 asymmetric belly swell
  sheen?: boolean;         // draw curved Catmull-Rom angelic halo highlight band
  innerCrease?: boolean;   // draw tapered Catmull-Rom centerline flow crease
  shadowOffset?: [number, number];
}

/**
 * Renders a 3D overlapping curved Catmull-Rom hair ribbon lock with:
 * 1. Under-layer cast shadow for multi-layer volume depth
 * 2. Multi-stop blonde shoujo gradient fill
 * 3. Curved Catmull-Rom valley shadow + luminous angelic sheen band
 * 4. Tapered dip-pen outer boundary splines & internal flow spline
 */
function drawShoujoCatmullRibbonLock(
  ctx: CanvasRenderingContext2D,
  spineCtrlPts: Pt[],
  wRoot: number,
  wBelly: number,
  wTip = 0.5,
  opts: CatmullRibbonLockOpts
): void {
  const spine = catmullRomSplinePts(spineCtrlPts, 16, 0.52);
  const N = spine.length;
  if (N < 3) return;

  const tier = opts.tier ?? 'mid';
  const pinchAt = opts.pinchAt ?? -1;
  const pinchFactor = opts.pinchFactor ?? 0.42;
  const asym = opts.asymBias ?? 0.12;

  const leftEdge: Pt[] = [];
  const rightEdge: Pt[] = [];
  const sheenLeft: Pt[] = [];
  const sheenRight: Pt[] = [];
  const valleyShadePoly: Pt[] = [];
  const valleyInner: Pt[] = [];
  const creaseSpline: Pt[] = [];

  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const pPrev = spine[Math.max(0, i - 1)];
    const pNext = spine[Math.min(N - 1, i + 1)];
    const dx = pNext[0] - pPrev[0];
    const dy = pNext[1] - pPrev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    // Smooth shoujo S-lock envelope: swells from wRoot to wBelly, tapers to silky point wTip
    const bellyEnv = Math.sin(Math.pow(u, 0.78) * Math.PI);
    const tipTaper = Math.pow(1 - u, 0.58);
    let halfW = (wRoot * (1 - u) * 0.65 + wBelly * bellyEnv) * tipTaper + wTip * (1 - bellyEnv) * 0.25;

    // Optional 3D shoujo ribbon twist pinch
    if (pinchAt > 0 && pinchAt < 1) {
      const dist = Math.abs(u - pinchAt);
      if (dist < 0.22) {
        const pEnv = Math.cos((dist / 0.22) * Math.PI * 0.5);
        halfW *= 1 - (1 - pinchFactor) * (pEnv * pEnv);
      }
    }
    if (i === N - 1) halfW = 0.2;

    const wL = halfW * (1 + asym * Math.sin(u * TAU));
    const wR = halfW * (1 - asym * Math.sin(u * TAU));

    const lx = spine[i][0] + nx * wL;
    const ly = spine[i][1] + ny * wL;
    const rx = spine[i][0] - nx * wR;
    const ry = spine[i][1] - ny * wR;

    leftEdge.push([lx, ly]);
    rightEdge.push([rx, ry]);

    // Internal valley shadow crescent along the deeper edge of the ribbon
    if (u >= 0.06 && u <= 0.88) {
      valleyShadePoly.push([rx, ry]);
      valleyInner.push([
        spine[i][0] - nx * (wR * 0.22),
        spine[i][1] - ny * (wR * 0.22),
      ]);
    }

    // Curved Catmull-Rom angelic sheen ribbon band along the upper-mid crest
    if (opts.sheen !== false && u >= 0.16 && u <= 0.64) {
      const uLocal = (u - 0.16) / 0.48;
      const sheenEnv = Math.sin(uLocal * Math.PI);
      const sCenterOff = wL * 0.36;
      const sHalf = wL * 0.24 * sheenEnv;
      sheenLeft.push([
        spine[i][0] + nx * (sCenterOff + sHalf),
        spine[i][1] + ny * (sCenterOff + sHalf),
      ]);
      sheenRight.push([
        spine[i][0] + nx * (sCenterOff - sHalf),
        spine[i][1] + ny * (sCenterOff - sHalf),
      ]);
    }

    // Internal Catmull-Rom flow crease following the ribbon tangent
    if (opts.innerCrease !== false && u >= 0.10 && u <= 0.86) {
      const cOff = (wL - wR) * 0.25 + halfW * 0.12 * Math.cos(u * Math.PI * 1.5);
      creaseSpline.push([
        spine[i][0] + nx * cOff,
        spine[i][1] + ny * cOff,
      ]);
    }
  }

  const ribbonPoly: Pt[] = [...leftEdge, ...rightEdge.slice().reverse()];

  // 1. Multi-layer volume cast shadow onto underlying hair locks
  const [shDX, shDY] = opts.shadowOffset ?? (tier === 'over' ? [2.8, 4.2] : tier === 'mid' ? [2.2, 3.2] : [1.4, 2.2]);
  const shAlpha = tier === 'over' ? 0.42 : tier === 'mid' ? 0.34 : 0.24;
  ctx.save();
  ctx.translate(shDX, shDY);
  trace(ctx, ribbonPoly, true);
  ctx.fillStyle = tier === 'under' ? SG.hairDeep : SG.hairShade;
  ctx.globalAlpha = shAlpha;
  ctx.fill();
  ctx.restore();

  // 2. Main Catmull-Rom Ribbon Volume Fill + Clipped Valley Shadow & Angelic Sheen Band
  sgShape(ctx, ribbonPoly, tier === 'under' ? SG.hairWarm : SG.hairMain, {
    key: opts.key + 'rib',
    line: false,
    amt: 0.16,
    grad: (bb) => {
      const g = ctx.createLinearGradient(spine[0][0], spine[0][1], spine[N - 1][0], spine[N - 1][1]);
      if (tier === 'under') {
        g.addColorStop(0, SG.hairWarm);
        g.addColorStop(0.55, SG.hairShade);
        g.addColorStop(1, SG.hairDeep);
      } else if (tier === 'over') {
        g.addColorStop(0, SG.hairLight);
        g.addColorStop(0.38, '#fdf7de');
        g.addColorStop(0.75, SG.hairMain);
        g.addColorStop(1, SG.hairWarm);
      } else {
        g.addColorStop(0, SG.hairLight);
        g.addColorStop(0.52, SG.hairMain);
        g.addColorStop(0.88, SG.hairWarm);
        g.addColorStop(1, SG.hairShade);
      }
      ctx.fillStyle = g;
      ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
    },
    innerFn: () => {
      if (valleyShadePoly.length > 2) {
        const vPoly = [...valleyShadePoly, ...valleyInner.slice().reverse()];
        ctx.save();
        trace(ctx, vPoly, true);
        ctx.fillStyle = tier === 'under' ? SG.hairDeep : SG.hairShade;
        ctx.globalAlpha = tier === 'over' ? 0.42 : 0.55;
        ctx.fill();
        ctx.restore();
      }
      if (sheenLeft.length > 2 && tier !== 'under') {
        const sPoly = [...sheenLeft, ...sheenRight.slice().reverse()];
        ctx.save();
        trace(ctx, sPoly, true);
        ctx.fillStyle = tier === 'over' ? '#fffef8' : SG.hairLight;
        ctx.globalAlpha = tier === 'over' ? 0.72 : 0.52;
        ctx.fill();
        ctx.restore();
      }
    },
  });

  // 3. Tapered Dip-Pen Catmull-Rom Outer Boundary Splines & Internal Flow Crease
  const wOuterMid = tier === 'over' ? 2.35 : tier === 'mid' ? 2.05 : 1.75;
  sgTaperLine(ctx, leftEdge, 1.1, wOuterMid, 0.35, SG.ink, 0.96);
  sgTaperLine(ctx, rightEdge, 1.0, wOuterMid * 0.92, 0.35, SG.ink, 0.94);

  if (creaseSpline.length > 2) {
    sgTaperLine(ctx, creaseSpline, 0.5, 1.35, 0.3, SG.inkSoft, 0.76);
  }
}

// =====================================================================
//  4. REUSABLE COMPONENTS: ROSES, BOWS, FLORAL LACE & DEFORMING BLINK EYE
// =====================================================================
type LeafSpec = [number, number, number, string];

function drawShoujoRose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r = 26,
  rot = 0,
  rKey = 'rose',
  leaves: LeafSpec[] = []
): void {
  withPivot(ctx, cx, cy, rot, 1, 1, 0, 0, () => {
    const s = r / 26;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s, s);

    for (let i = 0; i < leaves.length; i++) {
      const [ang, len, wid, lCol] = leaves[i];
      ctx.save();
      ctx.rotate(ang);
      const leafP = bezierPts(
        [
          [
            [14, -wid * 0.42],
            [24, -wid * 0.72],
            [18 + len * 0.7, -wid * 0.35],
            [18 + len, 0],
          ],
          [
            [18 + len, 0],
            [18 + len * 0.65, wid * 0.55],
            [24, wid * 0.72],
            [14, wid * 0.35],
          ],
        ],
        10
      );
      sgShape(ctx, leafP, lCol || SG.hairShade, { key: rKey + 'lf' + i, w: 1.6 / s, amt: 0.2 });
      sgLine(
        ctx,
        [
          [16, 0],
          [18 + len * 0.7, 0],
        ],
        { key: rKey + 'lfv' + i, w: 1.1 / s, amt: 0.15 }
      );
      ctx.restore();
    }

    const outerP = bezierPts(
      [
        [
          [0, -18],
          [9, -29],
          [23, -24],
          [19, -8],
        ],
        [
          [19, -8],
          [30, -2],
          [29, 14],
          [15, 16],
        ],
        [
          [15, 16],
          [14, 28],
          [-2, 29],
          [-10, 18],
        ],
        [
          [-10, 18],
          [-24, 24],
          [-30, 8],
          [-19, -2],
        ],
        [
          [-19, -2],
          [-27, -15],
          [-14, -28],
          [0, -18],
        ],
      ],
      10
    );

    sgShape(ctx, outerP, SG.roseMid, {
      key: rKey + 'out',
      w: 1.75 / s,
      amt: 0.2,
      grad: (bb) => {
        const g = ctx.createRadialGradient(-2, -2, 2, 0, 0, 28);
        g.addColorStop(0, SG.roseShade);
        g.addColorStop(0.55, SG.roseMid);
        g.addColorStop(1, SG.roseLight);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
    });

    const pLines: CubicSeg[][] = [
      [
        [
          [0, -18],
          [8, -16],
          [15, -13],
          [19, -8],
        ],
      ],
      [
        [
          [19, -8],
          [16, 2],
          [15, 10],
          [15, 16],
        ],
      ],
      [
        [
          [15, 16],
          [5, 16],
          [-3, 16],
          [-10, 18],
        ],
      ],
      [
        [
          [-10, 18],
          [-14, 10],
          [-17, 4],
          [-19, -2],
        ],
      ],
      [
        [
          [-19, -2],
          [-12, -10],
          [-6, -15],
          [0, -18],
        ],
      ],
      [
        [
          [-11, -8],
          [-4, -15],
          [7, -14],
          [12, -5],
        ],
      ],
      [
        [
          [11, -6],
          [14, 2],
          [9, 11],
          [-2, 11],
        ],
      ],
      [
        [
          [2, 11],
          [-8, 11],
          [-14, 3],
          [-10, -7],
        ],
      ],
      [
        [
          [-6, -2],
          [-3, -7],
          [5, -7],
          [6, -1],
        ],
      ],
      [
        [
          [6, -1],
          [5, 5],
          [-2, 6],
          [-6, 2],
        ],
      ],
      [
        [
          [-3, 1],
          [-2, -3],
          [2, -3],
          [3, 1],
        ],
        [
          [3, 1],
          [1, 3],
          [-1, 2],
          [-1, 0],
        ],
      ],
    ];
    for (let i = 0; i < pLines.length; i++) {
      sgLine(ctx, bezierPts(pLines[i], 10), {
        key: rKey + 'pl' + i,
        w: 1.35 / s,
        col: SG.ink,
        amt: 0.15,
      });
    }
    ctx.restore();
  });
}

function drawBlackBow(
  ctx: CanvasRenderingContext2D,
  knotP: Pt[] | null,
  leftLoopSegs: CubicSeg[] | null,
  rightLoopSegs: CubicSeg[] | null,
  leftTailSegs: CubicSeg[] | null,
  rightTailSegs: CubicSeg[] | null,
  creases: Pt[][],
  bKey = 'bow'
): void {
  if (leftTailSegs)
    sgShape(ctx, bezierPts(leftTailSegs, 12), SG.ribbon, {
      key: bKey + 'tL',
      w: 2.0,
      line: SG.ink,
      amt: 0.22,
    });
  if (rightTailSegs)
    sgShape(ctx, bezierPts(rightTailSegs, 12), SG.ribbon, {
      key: bKey + 'tR',
      w: 2.0,
      line: SG.ink,
      amt: 0.22,
    });
  if (leftLoopSegs)
    sgShape(ctx, bezierPts(leftLoopSegs, 14), SG.ribbon, {
      key: bKey + 'lL',
      w: 2.2,
      line: SG.ink,
      amt: 0.22,
    });
  if (rightLoopSegs)
    sgShape(ctx, bezierPts(rightLoopSegs, 14), SG.ribbon, {
      key: bKey + 'lR',
      w: 2.2,
      line: SG.ink,
      amt: 0.22,
    });
  if (knotP)
    sgShape(ctx, knotP, SG.ribbon, { key: bKey + 'kn', w: 2.0, line: '#252022', amt: 0.18 });
  for (let i = 0; i < creases.length; i++) {
    sgLine(ctx, creases[i], { key: bKey + 'cr' + i, w: 1.3, col: '#3a3235', amt: 0.15 });
  }
}

function drawFloralLaceBand(
  ctx: CanvasRenderingContext2D,
  spinePts: Pt[],
  normalDir: number,
  width: number,
  nScallops: number,
  lKey = 'lace'
): void {
  const N = spinePts.length;
  if (N < 2) return;
  const arc = [0];
  for (let i = 1; i < N; i++) {
    arc.push(
      arc[i - 1] +
        Math.hypot(spinePts[i][0] - spinePts[i - 1][0], spinePts[i][1] - spinePts[i - 1][1])
    );
  }
  const totalLen = arc[N - 1] || 1;

  const sampleAt = (s: number) => {
    const target = Math.max(0, Math.min(totalLen, s));
    let idx = 0;
    while (idx < N - 2 && arc[idx + 1] < target) idx++;
    const segLen = arc[idx + 1] - arc[idx] || 1;
    const t = (target - arc[idx]) / segLen;
    const x = spinePts[idx][0] + (spinePts[idx + 1][0] - spinePts[idx][0]) * t;
    const y = spinePts[idx][1] + (spinePts[idx + 1][1] - spinePts[idx][1]) * t;
    const dx = spinePts[idx + 1][0] - spinePts[idx][0];
    const dy = spinePts[idx + 1][1] - spinePts[idx][1];
    const dLen = Math.hypot(dx, dy) || 1;
    const nx = (-dy / dLen) * normalDir;
    const ny = (dx / dLen) * normalDir;
    return { x, y, nx, ny, tx: dx / dLen, ty: dy / dLen };
  };

  const outerEdge: Pt[] = [];
  const subSteps = 12;
  for (let i = 0; i < nScallops; i++) {
    for (let j = 0; j <= subSteps; j++) {
      if (i > 0 && j === 0) continue;
      const u = j / subSteps;
      const s = ((i + u) / nScallops) * totalLen;
      const pt = sampleAt(s);
      const arch = Math.sin(u * Math.PI);
      const lobe = 0.5 - 0.5 * Math.cos(u * TAU * 3);
      const d = width * (0.56 + 0.34 * arch + 0.08 * lobe * arch);
      outerEdge.push([pt.x + pt.nx * d, pt.y + pt.ny * d]);
    }
  }

  const poly: Pt[] = [...spinePts, ...outerEdge.slice().reverse()];
  sgShape(ctx, poly, SG.laceFill, { key: lKey + 'poly', line: false, amt: 0.16 });

  const cappedOuter: Pt[] = [spinePts[0], ...outerEdge, spinePts[spinePts.length - 1]];
  sgLine(ctx, cappedOuter, { key: lKey + 'outL', w: 1.5, col: SG.ink, amt: 0.2 });
  sgLine(ctx, spinePts, { key: lKey + 'inL', w: 1.5, col: SG.ink, amt: 0.2 });

  const seam2: Pt[] = spinePts.map((_, idx) => {
    const pt = sampleAt(arc[idx]);
    return [pt.x + pt.nx * 4.5, pt.y + pt.ny * 4.5];
  });
  sgLine(ctx, seam2, { key: lKey + 'inL2', w: 1.0, col: SG.inkSoft, amt: 0.18 });

  const midEdge: Pt[] = [];
  for (let i = 0; i < nScallops; i++) {
    for (let j = 0; j <= 8; j++) {
      if (i > 0 && j === 0) continue;
      const u = j / 8;
      const s = ((i + u) / nScallops) * totalLen;
      const pt = sampleAt(s);
      const arch = Math.sin(u * Math.PI);
      const d = width * (0.32 + 0.32 * arch);
      midEdge.push([pt.x + pt.nx * d, pt.y + pt.ny * d]);
    }
    const sMid = ((i + 0.5) / nScallops) * totalLen;
    const pm = sampleAt(sMid);
    const ang = Math.atan2(pm.ty, pm.tx);
    const ex = pm.x + pm.nx * (width * 0.44);
    const ey = pm.y + pm.ny * (width * 0.44);
    sgLine(ctx, ellipsePts(ex, ey, 4.2, 2.8, ang, 8), {
      closed: true,
      key: lKey + 'eye' + i,
      w: 1.05,
      col: SG.inkSoft,
      amt: 0.1,
    });
    const lx = pm.x - pm.tx * 6.5 + pm.nx * (width * 0.34);
    const ly = pm.y - pm.ty * 6.5 + pm.ny * (width * 0.34);
    const rx = pm.x + pm.tx * 6.5 + pm.nx * (width * 0.34);
    const ry = pm.y + pm.ty * 6.5 + pm.ny * (width * 0.34);
    sgLine(ctx, ellipsePts(lx, ly, 3.0, 1.8, ang - 0.4, 6), {
      closed: true,
      key: lKey + 'pl' + i,
      w: 0.9,
      col: SG.inkSoft,
      amt: 0.1,
    });
    sgLine(ctx, ellipsePts(rx, ry, 3.0, 1.8, ang + 0.4, 6), {
      closed: true,
      key: lKey + 'pr' + i,
      w: 0.9,
      col: SG.inkSoft,
      amt: 0.1,
    });
  }
  sgLine(ctx, midEdge, { key: lKey + 'midL', w: 1.05, col: SG.inkSoft, amt: 0.18 });
}

// =====================================================================
//  TRUE DEFORMING EYELID & CLIPPED IRIS SHOUJO EYE (NO SQUASHING!)
// =====================================================================
type UpperLashSpec = [Pt, Pt, Pt, Pt, number, number];
type LowerLashSpec = [Pt, Pt, Pt, Pt];
type OrbSpec = [number, number, number, number, number];

interface DeformingEyeConfig {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  scleraSegsOpen: CubicSeg[];
  scleraSegsMid: CubicSeg[];
  scleraSegsClosed: CubicSeg[];
  upperLidSegsOpen: CubicSeg[];
  upperLidSegsMid: CubicSeg[];
  upperLidSegsClosed: CubicSeg[];
  lowerLidSegs: CubicSeg[];
  creaseSegsOpen: CubicSeg[];
  creaseSegsMid: CubicSeg[];
  creaseSegsClosed: CubicSeg[];
  upperLashesOpen: UpperLashSpec[];
  upperLashesMid: UpperLashSpec[];
  upperLashesClosed: UpperLashSpec[];
  lowerLashes: LowerLashSpec[];
  mainHi: OrbSpec;
  subHi: OrbSpec;
  botHi: OrbSpec;
  sideDots: OrbSpec[];
}

function drawShoujoEyeDeforming(
  ctx: CanvasRenderingContext2D,
  cfg: DeformingEyeConfig,
  eKey = 'eye',
  blink = 0
): void {
  const {
    cx,
    cy,
    rx,
    ry,
    rot,
    scleraSegsOpen,
    scleraSegsMid,
    scleraSegsClosed,
    upperLidSegsOpen,
    upperLidSegsMid,
    upperLidSegsClosed,
    lowerLidSegs,
    creaseSegsOpen,
    creaseSegsMid,
    creaseSegsClosed,
    upperLashesOpen,
    upperLashesMid,
    upperLashesClosed,
    lowerLashes,
    mainHi,
    subHi,
    botHi,
    sideDots,
  } = cfg;

  const u = Math.max(0, Math.min(1, blink));
  const interp3 = (openS: CubicSeg[], midS: CubicSeg[], closedS: CubicSeg[]) => {
    if (u <= 0.55) {
      return lerpSegs(openS, midS, u / 0.55);
    } else {
      return lerpSegs(midS, closedS, (u - 0.55) / 0.45);
    }
  };

  const curScleraSegs = interp3(scleraSegsOpen, scleraSegsMid, scleraSegsClosed);
  const curUpperLidSegs = interp3(upperLidSegsOpen, upperLidSegsMid, upperLidSegsClosed);
  const curCreaseSegs = interp3(creaseSegsOpen, creaseSegsMid, creaseSegsClosed);

  const scleraP = bezierPts(curScleraSegs, 16);
  if (u < 0.94) {
    sgShape(ctx, scleraP, SG.sclera, {
      key: eKey + 'scl',
      line: false,
      amt: 0.15,
      innerFn: () => {
        const lidShadowY = cy - ry * 0.65 + u * (ry * 1.15);
        sgBlush(ctx, cx, lidShadowY, rx * 1.35, ry * 0.55, '185,165,165', 0.38, rot);

        ctx.save();
        const irisP = ellipsePts(cx, cy, rx, ry, rot, 36);
        trace(ctx, irisP, true);
        ctx.clip();

        const ig = ctx.createLinearGradient(cx, cy - ry * 0.2, cx, cy + ry);
        ig.addColorStop(0, '#555555');
        ig.addColorStop(0.42, '#c8c8c8');
        ig.addColorStop(1, '#f4f4f4');
        ctx.fillStyle = ig;
        ctx.fillRect(cx - rx * 1.5, cy - ry * 1.5, rx * 3, ry * 3);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = SG.ink;
        ctx.beginPath();
        ctx.ellipse(0, -ry * 0.28, rx * 1.05, ry * 0.72, 0, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = 'rgba(18,14,14,0.68)';
        ctx.lineWidth = 1.1;
        for (let rStep = 0.54; rStep <= 0.86; rStep += 0.16) {
          ctx.beginPath();
          ctx.ellipse(0, 0, rx * rStep, ry * rStep, 0, 0.16 * Math.PI, 0.84 * Math.PI);
          ctx.stroke();
        }

        for (let aDeg = 10; aDeg <= 170; aDeg += 8) {
          const aRad = (aDeg * Math.PI) / 180;
          const rIn = ry * 0.35;
          const rOut = ry * 0.95;
          ctx.strokeStyle = aDeg % 16 === 0 ? 'rgba(14,11,10,0.9)' : 'rgba(30,25,25,0.58)';
          ctx.lineWidth = aDeg % 16 === 0 ? 1.4 : 0.9;
          ctx.beginPath();
          ctx.moveTo(Math.cos(aRad) * rIn * (rx / ry), Math.sin(aRad) * rIn);
          ctx.lineTo(Math.cos(aRad) * rOut * (rx / ry), Math.sin(aRad) * rOut);
          ctx.stroke();
        }

        ctx.fillStyle = SG.ink;
        ctx.beginPath();
        ctx.ellipse(0, -ry * 0.05, rx * 0.38, ry * 0.38, 0, 0, TAU);
        ctx.fill();
        ctx.restore();

        sgLine(ctx, irisP, { closed: true, key: eKey + 'irRim', w: 3.4, col: SG.ink, amt: 0.15 });
        ctx.restore();

        const drawWhiteOrb = (
          ox: number,
          oy: number,
          orx: number,
          ory: number,
          orot = 0,
          strokeRim = false
        ) => {
          ctx.save();
          ctx.translate(ox, oy);
          ctx.rotate(orot);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, orx, ory, 0, 0, TAU);
          ctx.fill();
          if (strokeRim) {
            ctx.strokeStyle = SG.ink;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
          ctx.restore();
        };
        if (mainHi) drawWhiteOrb(mainHi[0], mainHi[1], mainHi[2], mainHi[3], mainHi[4] || 0);
        if (subHi) drawWhiteOrb(subHi[0], subHi[1], subHi[2], subHi[3], subHi[4] || 0);
        if (botHi) drawWhiteOrb(botHi[0], botHi[1], botHi[2], botHi[3], botHi[4] || 0, true);
        if (sideDots) {
          for (const d of sideDots) drawWhiteOrb(d[0], d[1], d[2], d[3], d[4] || 0);
        }
      },
    });
  }

  if (lowerLidSegs && u < 0.75) {
    sgLine(ctx, bezierPts(lowerLidSegs, 14), {
      key: eKey + 'lLid',
      w: 1.9 * (1 - u / 0.75),
      col: SG.ink,
      amt: 0.2,
    });
  }
  if (lowerLashes && u < 0.65) {
    const lowAlpha = 0.92 * (1 - u / 0.65);
    for (let i = 0; i < lowerLashes.length; i++) {
      const [p0, c1, c2, p1] = lowerLashes[i];
      const lPts = bezierPts([[p0, c1, c2, p1]], 10);
      sgTaperLine(ctx, lPts, 2.0, 1.3, 0.3, SG.ink, lowAlpha);
    }
  }

  const upperLidP = bezierPts(curUpperLidSegs, 16);
  sgShape(ctx, upperLidP, SG.ink, { key: eKey + 'uLid', w: 1.5, line: SG.ink, amt: 0.16 });

  for (let i = 0; i < upperLashesOpen.length; i++) {
    const oL = upperLashesOpen[i];
    const mL = upperLashesMid[i];
    const cL = upperLashesClosed[i];
    let p0: Pt, c1: Pt, c2: Pt, p1: Pt;
    if (u <= 0.55) {
      const uu = u / 0.55;
      p0 = lerpPt(oL[0], mL[0], uu);
      c1 = lerpPt(oL[1], mL[1], uu);
      c2 = lerpPt(oL[2], mL[2], uu);
      p1 = lerpPt(oL[3], mL[3], uu);
    } else {
      const uu = (u - 0.55) / 0.45;
      p0 = lerpPt(mL[0], cL[0], uu);
      c1 = lerpPt(mL[1], cL[1], uu);
      c2 = lerpPt(mL[2], cL[2], uu);
      p1 = lerpPt(mL[3], cL[3], uu);
    }
    const w0 = oL[4] ?? 3.8;
    const wm = oL[5] ?? 2.2;
    const lPts = bezierPts([[p0, c1, c2, p1]], 12);
    sgTaperLine(ctx, lPts, w0, wm, 0.35, SG.ink, 0.98);
  }

  if (curCreaseSegs) {
    sgLine(ctx, bezierPts(curCreaseSegs, 14), {
      key: eKey + 'crs',
      w: 1.8,
      col: SG.ink,
      amt: 0.2,
    });
  }
}

// =====================================================================
//  5. 24-LAYER ANIMATED MASTER CHARACTER: 90s SHOUJO BLONDE ANIME GIRL
// =====================================================================
export function drawShoujoGirl(
  ctx: CanvasRenderingContext2D,
  rig: ShoujoRigState,
  cx: number,
  cy: number,
  sc = 1
): void {
  const key = 'sgHero';
  const t = rig.time;
  const mode = rig.mode;
  B = rig.boilFrame || 1;

  // Fill crisp paper background unless transparentBg is requested
  if (!rig.transparentBg) {
    ctx.save();
    ctx.fillStyle = SG.bg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }

  const w1 = TAU / 6.0; // 1 cycle per 6s
  const w2 = TAU / 3.0; // 2 cycles per 6s
  const w3 = TAU / 2.0; // 3 cycles per 6s

  // Compute drivers based on mode ('24layer' procedural vs '5layer' subtle vs 'static' vs 'manual'/keyframe)
  let breath = 0;
  let torsoSX = 1;
  let torsoSY = 1;
  let torsoDY = 0;
  let headRot = 0;
  let headDX = 0;
  let headDY = 0;
  let backHairLRot = 0;
  let backHairRRot = 0;
  let strapDropRot = 0;
  let strapDropDY = 0;
  let laceBreathSX = 1;
  let heartRot = 0;
  let blink = rig.blink;
  let gazeDX = rig.gazeDX;
  let gazeDY = rig.gazeDY;
  let starPulse = 1;
  let browLift = rig.browLift;
  let browRot = 0;
  let blushPulse = 0.55;
  let lipPart = rig.lipPart;
  let bangLRot = 0;
  let bangRRot = 0;
  let cheekLockRot = 0;
  let shoulderCurlRot = 0;
  let roseRot1 = -0.15;
  let roseRot2 = 0.1;
  let roseRot3 = 0.25;
  let roseRot4 = -0.2;
  let roseScale = 1;
  let bowFlutter1 = 0;
  let bowFlutter2 = 0;
  let bowFlutter3 = 0;
  let bowFlutter4 = 0;

  function blinkEnv(time: number, center: number, width: number): number {
    const d = Math.abs((time % 6.0) - center);
    if (d > width) return 0;
    const u = d / width;
    return Math.pow(Math.cos(u * Math.PI * 0.5), 2.2);
  }

  if (mode === '24layer') {
    breath = Math.sin(t * w2);
    torsoSX = 1 + breath * 0.005;
    torsoSY = 1 + breath * 0.01;
    torsoDY = -breath * 3.5;

    headRot = Math.sin(t * w1 - 0.25) * 0.024 + Math.sin(t * w2 + 0.4) * 0.008;
    headDX = Math.sin(t * w1) * 4.5;
    headDY = Math.cos(t * w2) * 3.0;

    backHairLRot = Math.sin(t * w1 - 0.85) * 0.026 + Math.sin(t * w2 - 0.5) * 0.012;
    backHairRRot = Math.sin(t * w1 - 0.95) * 0.024 + Math.sin(t * w2 - 0.7) * 0.012;

    strapDropRot = Math.sin(t * w2 - 0.6) * 0.018;
    strapDropDY = Math.sin(t * w2 - 0.4) * 2.2;
    laceBreathSX = 1 + Math.sin(t * w2 - 0.2) * 0.008;

    heartRot = Math.sin(t * w2 - 1.1) * 0.14 + Math.sin(t * w3) * 0.05;

    // If user hasn't locked a manual blink override (> 0.01), run natural single + double blink envelope
    const autoBlink = Math.min(
      1,
      blinkEnv(t, 1.65, 0.18) + blinkEnv(t, 4.35, 0.16) + blinkEnv(t, 4.68, 0.14) * 0.85
    );
    blink = rig.blink > 0.01 ? rig.blink : autoBlink;

    gazeDX = Math.sin(t * w1 + 0.5) * 2.8 + rig.gazeDX;
    gazeDY = Math.cos(t * w1 + 0.3) * 1.8 + rig.gazeDY;
    starPulse = 1 + Math.sin(t * w3 * 2) * 0.16;

    browLift = Math.sin(t * w1 - 0.1) * 2.8 + (blink > 0.3 ? -2.0 * blink : 0) + rig.browLift;
    browRot = Math.sin(t * w1) * 0.018;

    blushPulse = 0.54 + Math.sin(t * w2 + 0.8) * 0.09;
    lipPart = 1 + Math.sin(t * w2 - 0.3) * 0.12;

    bangLRot = Math.sin(t * w2 - 0.65) * 0.022;
    bangRRot = Math.sin(t * w2 - 0.75) * 0.02;
    cheekLockRot = Math.sin(t * w2 - 0.95) * 0.032;
    shoulderCurlRot = Math.sin(t * w1 - 1.1) * 0.028 + Math.sin(t * w2 - 0.8) * 0.014;

    roseRot1 = -0.15 + Math.sin(t * w2 - 0.4) * 0.06;
    roseRot2 = 0.1 + Math.sin(t * w2 - 0.9) * 0.07;
    roseRot3 = 0.25 + Math.sin(t * w2 - 1.2) * 0.06;
    roseRot4 = -0.2 + Math.sin(t * w2 - 1.5) * 0.08;
    roseScale = 1 + Math.sin(t * w3) * 0.035;

    bowFlutter1 = Math.sin(t * w3 - 0.3) * 0.045;
    bowFlutter2 = Math.sin(t * w3 - 0.7) * 0.04;
    bowFlutter3 = Math.sin(t * w3 - 1.1) * 0.048;
    bowFlutter4 = Math.sin(t * w3 - 1.4) * 0.042;
  } else if (mode === '5layer') {
    breath = Math.sin(t * w2) * 0.7;
    torsoSX = 1 + breath * 0.004;
    torsoSY = 1 + breath * 0.008;
    torsoDY = -breath * 2.5;
    headRot = Math.sin(t * w1 - 0.25) * 0.015;
    backHairLRot = Math.sin(t * w1 - 0.6) * 0.012;
    backHairRRot = Math.sin(t * w1 - 0.6) * 0.012;
    const autoBlink = Math.min(1, blinkEnv(t, 2.2, 0.18));
    blink = rig.blink > 0.01 ? rig.blink : autoBlink;
  } else if (mode === 'manual') {
    const deg = Math.PI / 180;
    breath = rig.torsoBreath;
    torsoSX = 1 + breath * 0.006;
    torsoSY = 1 + breath * 0.012;
    torsoDY = -breath * 4.0;
    headRot = rig.headRot * deg;
    headDX = rig.headDX;
    headDY = rig.headDY;
    backHairLRot = rig.backHairLRot * deg;
    backHairRRot = rig.backHairRRot * deg;
    strapDropRot = rig.strapDropRot * deg;
    strapDropDY = rig.strapDropRot * 0.35;
    heartRot = rig.heartRot * deg;
    blink = rig.blink;
    gazeDX = rig.gazeDX;
    gazeDY = rig.gazeDY;
    browLift = rig.browLift;
    lipPart = rig.lipPart;
    bangLRot = rig.bangLRot * deg;
    bangRRot = rig.bangRRot * deg;
    cheekLockRot = rig.cheekLockRot * deg;
    shoulderCurlRot = rig.shoulderCurlRot * deg;
    const rSpin = rig.roseSpin * deg;
    roseRot1 = -0.15 + rSpin;
    roseRot2 = 0.1 + rSpin;
    roseRot3 = 0.25 + rSpin;
    roseRot4 = -0.2 + rSpin;
    const bFlut = rig.bowFlutter * deg;
    bowFlutter1 = bFlut;
    bowFlutter2 = bFlut;
    bowFlutter3 = bFlut;
    bowFlutter4 = bFlut;
  } else {
    // 'static' mode: still allow testing the 3 blink states if user clicks them
    blink = rig.blink;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sc, sc);
  ctx.translate(-500, -500);

  const renderHair = rig.renderHair !== false;

  // ===================================================================
  // LAYER 1, 2 & 3: DEEP SHADOW & LEFT/RIGHT CASCADING BACK HAIR MASSES
  // ===================================================================
  if (renderHair) {
  withPivot(
    ctx,
    480,
    520,
    (backHairLRot + backHairRRot) * 0.5,
    1,
    1,
    headDX * 0.4,
    headDY * 0.4,
    () => {
      const hairBackDeepP = bezierPts(
        [
          [
            [325, 480],
            [640, 440],
            [670, 520],
            [645, 620],
          ],
          [
            [645, 620],
            [610, 680],
            [340, 680],
            [285, 630],
          ],
          [
            [285, 630],
            [295, 550],
            [310, 505],
            [325, 480],
          ],
        ],
        14
      );
      sgShape(ctx, hairBackDeepP, SG.hairDeep, { key: key + 'hBackDeep', line: false });
    }
  );

  // LAYER 2: Left Cascading Hair Waves (Pivoted from left temple (340, 220))
  withPivot(ctx, 340, 220, backHairLRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
    const leftHairMassP = bezierPts(
      [
        [
          [380, 62],
          [315, 95],
          [268, 152],
          [266, 218],
        ],
        [
          [266, 218],
          [278, 255],
          [295, 272],
          [272, 316],
        ],
        [
          [272, 316],
          [222, 354],
          [162, 382],
          [162, 434],
        ],
        [
          [162, 434],
          [162, 468],
          [182, 492],
          [202, 492],
        ],
        [
          [202, 492],
          [174, 488],
          [160, 514],
          [164, 536],
        ],
        [
          [164, 536],
          [172, 560],
          [212, 562],
          [240, 540],
        ],
        [
          [240, 540],
          [225, 588],
          [132, 616],
          [78, 654],
        ],
        [
          [78, 654],
          [72, 690],
          [72, 745],
          [96, 756],
        ],
        [
          [96, 756],
          [104, 798],
          [122, 834],
          [100, 845],
        ],
        [
          [100, 845],
          [74, 845],
          [64, 814],
          [72, 790],
        ],
        [
          [72, 790],
          [58, 825],
          [68, 862],
          [114, 858],
        ],
        [
          [114, 858],
          [82, 895],
          [66, 945],
          [74, 988],
        ],
        [
          [74, 988],
          [76, 1000],
          [165, 1000],
          [215, 1000],
        ],
        [
          [215, 1000],
          [240, 750],
          [435, 650],
          [435, 515],
        ],
        [
          [435, 515],
          [420, 320],
          [410, 160],
          [380, 62],
        ],
      ],
      18
    );
    sgShape(ctx, leftHairMassP, SG.hairMain, {
      key: key + 'hMassL',
      line: false,
      grad: (bb) => {
        const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
        g.addColorStop(0, SG.hairLight);
        g.addColorStop(0.55, SG.hairMain);
        g.addColorStop(1, SG.hairWarm);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        const lShade1 = bezierPts(
          [
            [
              [298, 285],
              [260, 355],
              [220, 410],
              [245, 480],
            ],
            [
              [245, 480],
              [275, 540],
              [250, 610],
              [165, 680],
            ],
            [
              [165, 680],
              [130, 730],
              [140, 810],
              [185, 840],
            ],
            [
              [185, 840],
              [220, 740],
              [350, 660],
              [420, 620],
            ],
            [
              [420, 620],
              [435, 560],
              [380, 420],
              [298, 285],
            ],
          ],
          14
        );
        sgShape(ctx, lShade1, SG.hairShade, { key: key + 'hShL1', line: false, fillA: 0.55 });
      },
    });

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [365, 82],
            [302, 98],
            [254, 130],
            [238, 152],
          ],
          [
            [238, 152],
            [272, 120],
            [315, 98],
            [352, 88],
          ],
        ],
        14
      ),
      { key: key + 'flyL1', w: 2.0, amt: 0.25 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [268, 152],
            [232, 174],
            [225, 194],
            [234, 204],
          ],
        ],
        12
      ),
      { key: key + 'flyL2', w: 1.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [294, 274],
            [262, 326],
            [210, 344],
            [185, 305],
          ],
          [
            [185, 305],
            [198, 342],
            [244, 344],
            [278, 312],
          ],
        ],
        14
      ),
      { key: key + 'hCurlL1', w: 2.4, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [272, 316],
            [222, 354],
            [162, 382],
            [162, 434],
          ],
          [
            [162, 434],
            [162, 468],
            [182, 492],
            [202, 492],
          ],
          [
            [202, 492],
            [174, 488],
            [160, 514],
            [164, 536],
          ],
          [
            [164, 536],
            [172, 560],
            [212, 562],
            [246, 534],
          ],
        ],
        16
      ),
      { key: key + 'hCurlL2', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [258, 342],
            [218, 378],
            [206, 422],
            [226, 472],
          ],
          [
            [226, 472],
            [248, 520],
            [218, 560],
            [182, 548],
          ],
        ],
        16
      ),
      { key: key + 'hCurlL3', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [215, 588],
            [132, 616],
            [78, 654],
            [72, 718],
          ],
          [
            [72, 718],
            [72, 745],
            [82, 760],
            [92, 756],
          ],
        ],
        16
      ),
      { key: key + 'hCurlL4', w: 2.5, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [225, 594],
            [148, 634],
            [96, 686],
            [100, 754],
          ],
          [
            [100, 754],
            [104, 798],
            [122, 834],
            [100, 845],
          ],
          [
            [100, 845],
            [74, 845],
            [64, 814],
            [72, 790],
          ],
          [
            [72, 790],
            [58, 825],
            [68, 862],
            [114, 858],
          ],
        ],
        16
      ),
      { key: key + 'hCurlL5', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [114, 860],
            [82, 895],
            [66, 945],
            [74, 988],
          ],
          [
            [74, 988],
            [76, 996],
            [80, 1000],
            [84, 1000],
          ],
        ],
        14
      ),
      { key: key + 'hCurlL6', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [198, 875],
            [150, 910],
            [102, 938],
            [104, 985],
          ],
          [
            [104, 985],
            [106, 995],
            [112, 1000],
            [118, 1000],
          ],
        ],
        14
      ),
      { key: key + 'hCurlL7', w: 2.6, amt: 0.25 }
    );

    // Lower-left Rose 4 & Lower-left Bow 3 ride with the left cascading curls!
    withPivot(ctx, 173, 845, roseRot4, roseScale, roseScale, 0, 0, () => {
      drawShoujoRose(ctx, 173, 845, 25, 0, key + 'rose4', [[2.25, 22, 13, SG.hairShade]]);
    });
    withPivot(
      ctx,
      228,
      588,
      bowFlutter3,
      1 + bowFlutter3 * 0.2,
      1 - bowFlutter3 * 0.15,
      0,
      0,
      () => {
        drawBlackBow(
          ctx,
          bezierPts(
            [
              [
                [220, 578],
                [230, 576],
                [238, 580],
                [238, 590],
              ],
              [
                [238, 590],
                [238, 598],
                [228, 600],
                [220, 596],
              ],
              [
                [220, 596],
                [216, 590],
                [216, 582],
                [220, 578],
              ],
            ],
            8
          ),
          [
            [
              [222, 580],
              [204, 568],
              [186, 558],
              [178, 560],
            ],
            [
              [178, 560],
              [172, 568],
              [170, 584],
              [174, 592],
            ],
            [
              [174, 592],
              [188, 596],
              [206, 596],
              [222, 594],
            ],
          ],
          [
            [
              [235, 580],
              [254, 574],
              [276, 568],
              [288, 572],
            ],
            [
              [288, 572],
              [292, 580],
              [290, 596],
              [284, 604],
            ],
            [
              [284, 604],
              [268, 606],
              [250, 602],
              [235, 594],
            ],
          ],
          [
            [
              [218, 594],
              [194, 608],
              [172, 622],
              [156, 634],
            ],
            [
              [156, 634],
              [166, 640],
              [170, 648],
              [174, 656],
            ],
            [
              [174, 656],
              [192, 636],
              [210, 616],
              [226, 598],
            ],
          ],
          [
            [
              [232, 596],
              [236, 620],
              [240, 645],
              [245, 668],
            ],
            [
              [245, 668],
              [254, 658],
              [262, 650],
              [270, 646],
            ],
            [
              [270, 646],
              [258, 624],
              [246, 606],
              [238, 594],
            ],
          ],
          [
            [
              [206, 584],
              [220, 588],
            ],
            [
              [238, 588],
              [252, 586],
            ],
          ],
          key + 'bow3'
        );
      }
    );
  });

  // LAYER 3: Right Cascading Hair Mass & Crown (Pivoted from right crown (620, 220))
  withPivot(ctx, 620, 220, backHairRRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
    const rightHairMassP = bezierPts(
      [
        [
          [326, 14],
          [308, 42],
          [332, 74],
          [380, 64],
        ],
        [
          [380, 64],
          [442, 34],
          [528, 22],
          [584, 52],
        ],
        [
          [584, 52],
          [648, 46],
          [716, 88],
          [762, 168],
        ],
        [
          [762, 168],
          [788, 218],
          [795, 265],
          [790, 315],
        ],
        [
          [790, 315],
          [802, 372],
          [862, 405],
          [862, 464],
        ],
        [
          [862, 464],
          [862, 512],
          [818, 550],
          [804, 588],
        ],
        [
          [804, 588],
          [848, 612],
          [932, 628],
          [944, 696],
        ],
        [
          [944, 696],
          [948, 725],
          [935, 742],
          [922, 740],
        ],
        [
          [922, 740],
          [946, 772],
          [944, 835],
          [898, 860],
        ],
        [
          [898, 860],
          [872, 875],
          [858, 902],
          [875, 922],
        ],
        [
          [875, 922],
          [902, 938],
          [934, 916],
          [922, 875],
        ],
        [
          [922, 875],
          [942, 902],
          [932, 948],
          [885, 945],
        ],
        [
          [885, 945],
          [895, 972],
          [898, 990],
          [895, 1000],
        ],
        [
          [895, 1000],
          [835, 1000],
          [785, 1000],
          [775, 1000],
        ],
        [
          [775, 1000],
          [785, 820],
          [620, 680],
          [575, 560],
        ],
        [
          [575, 560],
          [550, 420],
          [450, 220],
          [375, 78],
        ],
        [
          [375, 78],
          [332, 82],
          [312, 48],
          [326, 14],
        ],
      ],
      18
    );
    sgShape(ctx, rightHairMassP, SG.hairMain, {
      key: key + 'hMassR',
      line: false,
      grad: (bb) => {
        const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
        g.addColorStop(0, SG.hairLight);
        g.addColorStop(0.5, SG.hairMain);
        g.addColorStop(1, SG.hairWarm);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        const rShade1 = bezierPts(
          [
            [
              [575, 465],
              [645, 450],
              [685, 440],
              [670, 520],
            ],
            [
              [670, 520],
              [650, 600],
              [610, 660],
              [575, 580],
            ],
            [
              [575, 580],
              [565, 520],
              [568, 485],
              [575, 465],
            ],
          ],
          14
        );
        sgShape(ctx, rShade1, SG.hairDeep, { key: key + 'hShR1', line: false, fillA: 0.75 });
      },
    });

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [346, 14],
            [310, 38],
            [322, 74],
            [380, 64],
          ],
          [
            [380, 64],
            [442, 34],
            [528, 22],
            [584, 52],
          ],
          [
            [584, 52],
            [648, 46],
            [716, 88],
            [762, 168],
          ],
          [
            [762, 168],
            [788, 218],
            [795, 265],
            [792, 285],
          ],
        ],
        18
      ),
      { key: key + 'hCrownLine', w: 3.0, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [790, 345],
            [802, 382],
            [862, 405],
            [862, 464],
          ],
          [
            [862, 464],
            [862, 512],
            [818, 550],
            [800, 578],
          ],
        ],
        16
      ),
      { key: key + 'hCurlR1', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [782, 355],
            [798, 405],
            [842, 434],
            [840, 480],
          ],
          [
            [840, 480],
            [835, 525],
            [788, 560],
            [778, 595],
          ],
          [
            [778, 595],
            [795, 622],
            [855, 620],
            [872, 575],
          ],
          [
            [872, 575],
            [875, 558],
            [868, 548],
            [865, 545],
          ],
        ],
        16
      ),
      { key: key + 'hCurlR2', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [810, 618],
            [878, 628],
            [944, 650],
            [944, 712],
          ],
          [
            [944, 712],
            [944, 730],
            [935, 740],
            [928, 738],
          ],
        ],
        16
      ),
      { key: key + 'hCurlR3', w: 2.4, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [804, 625],
            [888, 665],
            [944, 738],
            [940, 804],
          ],
          [
            [940, 804],
            [936, 845],
            [898, 862],
            [875, 882],
          ],
          [
            [875, 882],
            [858, 902],
            [868, 926],
            [895, 928],
          ],
          [
            [895, 928],
            [922, 928],
            [934, 902],
            [922, 875],
          ],
          [
            [922, 875],
            [942, 902],
            [932, 948],
            [885, 945],
          ],
        ],
        18
      ),
      { key: key + 'hCurlR4', w: 2.6, amt: 0.25 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [884, 942],
            [895, 972],
            [898, 990],
            [895, 1000],
          ],
        ],
        10
      ),
      { key: key + 'hCurlR5', w: 2.6, amt: 0.25 }
    );

  });
  } // end if (renderHair) for back hair layers

  // ===================================================================
  // LAYER 4, 5, 6, 7: TORSO BREATHING, CHOKER HEART, STRAPS & LACE TRIM
  // ===================================================================
  withPivot(ctx, 480, 920, 0, torsoSX, torsoSY, 0, torsoDY, () => {
    const torsoSkinP = bezierPts(
      [
        [
          [425, 515],
          [435, 575],
          [435, 622],
          [412, 634],
        ],
        [
          [412, 634],
          [358, 644],
          [254, 650],
          [212, 706],
        ],
        [
          [212, 706],
          [202, 748],
          [206, 835],
          [204, 925],
        ],
        [
          [204, 925],
          [202, 965],
          [202, 990],
          [202, 1000],
        ],
        [
          [202, 1000],
          [450, 1000],
          [650, 1000],
          [788, 1000],
        ],
        [
          [788, 1000],
          [798, 945],
          [818, 865],
          [822, 795],
        ],
        [
          [822, 795],
          [824, 725],
          [778, 675],
          [705, 665],
        ],
        [
          [705, 665],
          [635, 658],
          [588, 610],
          [575, 550],
        ],
        [
          [575, 550],
          [568, 505],
          [562, 475],
          [555, 460],
        ],
        [
          [555, 460],
          [500, 475],
          [455, 495],
          [425, 515],
        ],
      ],
      18
    );

    sgShape(ctx, torsoSkinP, SG.skinMain, {
      key: key + 'torsoSkin',
      line: false,
      amt: 0.2,
      grad: (bb) => {
        const g = ctx.createRadialGradient(475, 740, 40, 485, 760, 340);
        g.addColorStop(0, SG.skinLight);
        g.addColorStop(0.65, SG.skinMain);
        g.addColorStop(1, SG.skinWarm);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        sgBlush(ctx, 255, 708, 65, 48, SG.blushRGB, 0.48, -0.35);
        sgBlush(ctx, 735, 738, 78, 58, SG.blushRGB, 0.52, 0.25);
        sgBlush(ctx, 365, 955, 55, 40, SG.blushRGB, 0.3, 0);

        const neckShadeP = bezierPts(
          [
            [
              [428, 520],
              [478, 518],
              [525, 502],
              [552, 485],
            ],
            [
              [552, 485],
              [552, 515],
              [520, 548],
              [434, 582],
            ],
            [
              [434, 582],
              [432, 555],
              [430, 535],
              [428, 520],
            ],
          ],
          14
        );
        sgShape(ctx, neckShadeP, SG.skinNeckShade, {
          key: key + 'neckSh',
          line: false,
          fillA: 0.85,
        });

        const neckHatch: Pt[][] = [
          [
            [452, 522],
            [433, 536],
          ],
          [
            [466, 520],
            [433, 544],
          ],
          [
            [480, 518],
            [434, 552],
          ],
          [
            [494, 515],
            [442, 554],
          ],
          [
            [508, 512],
            [462, 546],
          ],
          [
            [522, 506],
            [486, 534],
          ],
          [
            [535, 500],
            [508, 520],
          ],
        ];
        for (let i = 0; i < neckHatch.length; i++) {
          sgLine(ctx, neckHatch[i], {
            key: key + 'nHat' + i,
            w: 1.15,
            col: SG.inkHatch,
            amt: 0.15,
          });
        }
      },
    });

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [425, 518],
            [432, 552],
            [435, 595],
            [435, 622],
          ],
          [
            [435, 622],
            [412, 634],
            [378, 638],
            [344, 642],
          ],
        ],
        14
      ),
      { key: key + 'neckL', w: 2.8, amt: 0.22 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [326, 644],
            [254, 654],
            [212, 698],
            [208, 772],
          ],
          [
            [208, 772],
            [206, 822],
            [208, 868],
            [208, 912],
          ],
        ],
        16
      ),
      { key: key + 'shldL', w: 3.0, amt: 0.22 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [720, 666],
            [768, 678],
            [812, 718],
            [822, 782],
          ],
          [
            [822, 782],
            [824, 820],
            [822, 848],
            [820, 864],
          ],
        ],
        16
      ),
      { key: key + 'shldR', w: 3.0, amt: 0.22 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [814, 892],
            [806, 938],
            [796, 972],
            [788, 1000],
          ],
        ],
        12
      ),
      { key: key + 'armR', w: 3.0, amt: 0.22 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [350, 675],
            [372, 686],
            [392, 694],
            [404, 698],
          ],
        ],
        10
      ),
      { key: key + 'clavL1', w: 1.7, amt: 0.2 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [409, 702],
            [415, 709],
            [419, 715],
            [422, 719],
          ],
        ],
        8
      ),
      { key: key + 'clavL2', w: 1.5, amt: 0.2 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [462, 722],
            [474, 712],
            [486, 706],
            [512, 704],
          ],
          [
            [512, 704],
            [542, 702],
            [566, 698],
            [584, 692],
          ],
        ],
        12
      ),
      { key: key + 'clavR', w: 1.7, amt: 0.2 }
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [258, 775],
            [260, 792],
            [262, 804],
            [263, 814],
          ],
        ],
        8
      ),
      { key: key + 'pitL', w: 1.6, amt: 0.2 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [650, 870],
            [648, 912],
            [642, 956],
            [634, 1000],
          ],
        ],
        12
      ),
      { key: key + 'pitR', w: 2.8, amt: 0.22 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [656, 868],
            [654, 892],
            [650, 915],
            [646, 935],
          ],
        ],
        10
      ),
      { key: key + 'pitR2', w: 1.4, amt: 0.2 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [425, 885],
            [406, 914],
            [394, 945],
            [386, 976],
          ],
        ],
        12
      ),
      { key: key + 'cleav', w: 1.6, amt: 0.2 }
    );

    // LAYER 5: Velvet Black Choker & Swinging Pink Heart Pendant!
    const chokerP = bezierPts(
      [
        [
          [433, 584],
          [485, 596],
          [542, 584],
          [586, 566],
        ],
        [
          [586, 566],
          [588, 580],
          [584, 594],
          [578, 602],
        ],
        [
          [578, 602],
          [534, 620],
          [478, 628],
          [434, 614],
        ],
        [
          [434, 614],
          [432, 602],
          [432, 592],
          [433, 584],
        ],
      ],
      16
    );
    sgShape(ctx, chokerP, SG.ribbon, { key: key + 'choker', w: 2.2, line: SG.ink, amt: 0.2 });

    withPivot(ctx, 461, 622, heartRot, 1, 1, 0, 0, () => {
      sgLine(
        ctx,
        [
          [459, 622],
          [459, 632],
        ],
        { key: key + 'hRing1', w: 2.0, amt: 0.1 }
      );
      sgLine(
        ctx,
        [
          [463, 622],
          [463, 632],
        ],
        { key: key + 'hRing2', w: 2.0, amt: 0.1 }
      );
      const heartP = bezierPts(
        [
          [
            [461, 635],
            [456, 629],
            [449, 632],
            [450, 640],
          ],
          [
            [450, 640],
            [451, 647],
            [457, 652],
            [460, 656],
          ],
          [
            [460, 656],
            [465, 652],
            [472, 646],
            [473, 639],
          ],
          [
            [473, 639],
            [474, 632],
            [466, 629],
            [461, 635],
          ],
        ],
        12
      );
      sgShape(ctx, heartP, SG.heartPink, { key: key + 'heart', w: 2.6, line: SG.ink, amt: 0.15 });
    });

    // LAYER 6: Left Camisole Strap & Animated Drooping Off-Shoulder Right Strap
    const strapLP = bezierPts(
      [
        [
          [252, 855],
          [282, 760],
          [316, 668],
          [344, 642],
        ],
        [
          [344, 642],
          [352, 639],
          [360, 639],
          [366, 640],
        ],
        [
          [366, 640],
          [336, 668],
          [302, 760],
          [270, 855],
        ],
        [
          [270, 855],
          [264, 855],
          [258, 855],
          [252, 855],
        ],
      ],
      14
    );
    sgShape(ctx, strapLP, SG.camisole, { key: key + 'strapL', line: false, amt: 0.2 });
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [252, 855],
            [282, 760],
            [316, 668],
            [344, 642],
          ],
          [
            [344, 642],
            [352, 639],
            [360, 639],
            [366, 640],
          ],
          [
            [366, 640],
            [336, 668],
            [302, 760],
            [270, 855],
          ],
        ],
        14
      ),
      { key: key + 'strapLLine', w: 2.4, col: SG.ink, amt: 0.2 }
    );

    withPivot(ctx, 592, 878, strapDropRot, 1, 1, 0, strapDropDY, () => {
      const strapRP = bezierPts(
        [
          [
            [586, 882],
            [628, 834],
            [666, 820],
            [708, 840],
          ],
          [
            [708, 840],
            [755, 864],
            [802, 878],
            [834, 878],
          ],
          [
            [834, 878],
            [838, 868],
            [828, 858],
            [820, 854],
          ],
          [
            [820, 854],
            [834, 860],
            [840, 874],
            [832, 892],
          ],
          [
            [832, 892],
            [822, 898],
            [768, 884],
            [704, 852],
          ],
          [
            [704, 852],
            [666, 832],
            [632, 846],
            [596, 890],
          ],
        ],
        16
      );
      sgShape(ctx, strapRP, SG.camisole, { key: key + 'strapR', line: false, amt: 0.2 });
      sgLine(
        ctx,
        bezierPts(
          [
            [
              [586, 882],
              [628, 834],
              [666, 820],
              [708, 840],
            ],
            [
              [708, 840],
              [755, 864],
              [802, 878],
              [834, 878],
            ],
            [
              [834, 878],
              [838, 868],
              [828, 858],
              [820, 854],
            ],
            [
              [820, 854],
              [834, 860],
              [840, 874],
              [832, 892],
            ],
            [
              [832, 892],
              [822, 898],
              [768, 884],
              [704, 852],
            ],
            [
              [704, 852],
              [666, 832],
              [632, 846],
              [596, 890],
            ],
          ],
          16
        ),
        { key: key + 'strapRLine', w: 2.4, col: SG.ink, amt: 0.2 }
      );
    });

    // LAYER 7: Main White Camisole Bodice & Breathing Scalloped Floral Lace Trim
    const camisoleP = bezierPts(
      [
        [
          [258, 836],
          [284, 898],
          [318, 954],
          [358, 1000],
        ],
        [
          [358, 1000],
          [435, 950],
          [518, 908],
          [592, 876],
        ],
        [
          [592, 876],
          [606, 922],
          [618, 965],
          [630, 1000],
        ],
        [
          [630, 1000],
          [450, 1000],
          [280, 1000],
          [202, 1000],
        ],
        [
          [202, 1000],
          [198, 972],
          [202, 948],
          [214, 908],
        ],
        [
          [214, 908],
          [234, 868],
          [248, 848],
          [258, 836],
        ],
      ],
      16
    );
    sgShape(ctx, camisoleP, SG.camisole, { key: key + 'camisole', line: false, amt: 0.2 });

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [248, 848],
            [234, 868],
            [214, 908],
            [202, 948],
          ],
          [
            [202, 948],
            [198, 972],
            [200, 990],
            [204, 1000],
          ],
        ],
        14
      ),
      { key: key + 'camLeftEdge', w: 2.8, amt: 0.22 }
    );

    const camFolds: CubicSeg[][] = [
      [
        [
          [255, 862],
          [242, 888],
          [232, 912],
          [224, 932],
        ],
      ],
      [
        [
          [295, 958],
          [300, 975],
          [304, 990],
          [306, 1000],
        ],
      ],
      [
        [
          [455, 965],
          [442, 980],
          [432, 992],
          [425, 1000],
        ],
      ],
      [
        [
          [556, 940],
          [550, 962],
          [545, 982],
          [542, 998],
        ],
      ],
      [
        [
          [575, 922],
          [575, 952],
          [574, 978],
          [573, 1000],
        ],
      ],
      [
        [
          [596, 958],
          [597, 975],
          [598, 990],
          [598, 1000],
        ],
      ],
    ];
    for (let i = 0; i < camFolds.length; i++) {
      sgLine(ctx, bezierPts(camFolds[i], 10), {
        key: key + 'cFold' + i,
        w: 1.3,
        col: SG.inkSoft,
        amt: 0.2,
      });
    }

    withPivot(ctx, 358, 960, 0, laceBreathSX, 1, 0, 0, () => {
      const laceLeftSpine = bezierPts(
        [
          [
            [256, 834],
            [284, 898],
            [318, 954],
            [358, 1000],
          ],
        ],
        28
      );
      drawFloralLaceBand(ctx, laceLeftSpine, 1, 36, 7, key + 'laceL');

      const laceRightSpine = bezierPts(
        [
          [
            [358, 1000],
            [435, 950],
            [518, 908],
            [595, 874],
          ],
        ],
        32
      );
      drawFloralLaceBand(ctx, laceRightSpine, -1, 38, 9, key + 'laceR');

      const laceSideRSpine = bezierPts(
        [
          [
            [588, 874],
            [600, 922],
            [614, 964],
            [628, 998],
          ],
        ],
        22
      );
      drawFloralLaceBand(ctx, laceSideRSpine, -1, 28, 5, key + 'laceSR');
    });
  });

  // ===================================================================
  // LAYER 8..23: HEAD HIERARCHY (3/4 TILT, DEFORMING EYES, BROWS, LIPS, BANGS, ROSES & BOWS)
  // ===================================================================
  withPivot(ctx, 465, 485, headRot, 1, 1, headDX, headDY, () => {
    const earP = bezierPts(
      [
        [
          [634, 392],
          [658, 396],
          [676, 412],
          [674, 434],
        ],
        [
          [674, 434],
          [670, 456],
          [642, 472],
          [616, 475],
        ],
        [
          [616, 475],
          [602, 475],
          [594, 466],
          [588, 458],
        ],
        [
          [588, 458],
          [595, 432],
          [612, 408],
          [634, 392],
        ],
      ],
      14
    );
    sgShape(ctx, earP, SG.skinMain, {
      key: key + 'earR',
      w: 2.5,
      line: SG.ink,
      amt: 0.2,
      innerFn: () => {
        const earInP = bezierPts(
          [
            [
              [628, 408],
              [654, 405],
              [664, 422],
              [654, 444],
            ],
            [
              [654, 444],
              [642, 458],
              [618, 458],
              [612, 446],
            ],
            [
              [612, 446],
              [620, 432],
              [624, 418],
              [628, 408],
            ],
          ],
          12
        );
        sgShape(ctx, earInP, SG.earShade, { key: key + 'earInSh', line: false });
      },
    });
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [652, 402],
            [640, 412],
            [636, 425],
            [630, 434],
          ],
          [
            [630, 434],
            [618, 436],
            [612, 444],
            [618, 450],
          ],
          [
            [618, 450],
            [630, 450],
            [644, 444],
            [652, 435],
          ],
        ],
        12
      ),
      { key: key + 'earFold1', w: 1.7, amt: 0.2 }
    );
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [642, 416],
            [654, 418],
            [658, 430],
            [650, 440],
          ],
        ],
        10
      ),
      { key: key + 'earFold2', w: 1.5, amt: 0.2 }
    );

    // Main Face Contour & LAYER 9: Animated Cheek Blush Warmth Pulse
    const faceP = bezierPts(
      [
        [
          [468, 120],
          [555, 135],
          [625, 220],
          [626, 340],
        ],
        [
          [626, 340],
          [626, 415],
          [588, 478],
          [522, 504],
        ],
        [
          [522, 504],
          [462, 520],
          [392, 524],
          [358, 500],
        ],
        [
          [358, 500],
          [334, 476],
          [315, 422],
          [315, 384],
        ],
        [
          [315, 384],
          [315, 355],
          [326, 326],
          [334, 294],
        ],
        [
          [334, 294],
          [344, 255],
          [348, 220],
          [375, 175],
        ],
        [
          [375, 175],
          [405, 135],
          [438, 120],
          [468, 120],
        ],
      ],
      18
    );
    sgShape(ctx, faceP, SG.skinMain, {
      key: key + 'faceBase',
      line: false,
      amt: 0.2,
      grad: (bb) => {
        const g = ctx.createRadialGradient(445, 295, 30, 465, 340, 240);
        g.addColorStop(0, SG.skinLight);
        g.addColorStop(0.65, SG.skinMain);
        g.addColorStop(1, SG.skinWarm);
        ctx.fillStyle = g;
        ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
      },
      innerFn: () => {
        sgBlush(ctx, 344, 368, 42, 28, SG.blushRGB, blushPulse, 0.25);
        sgBlush(ctx, 520, 405, 68, 42, SG.blushRGB, blushPulse + 0.03, 0.22);
        sgBlush(ctx, 396, 368, 18, 14, SG.blushRGB, 0.32, 0);
        sgBlush(ctx, 395, 495, 45, 20, SG.blushRGB, 0.25, 0.15);
      },
    });

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [335, 292],
            [326, 326],
            [315, 355],
            [315, 384],
          ],
          [
            [315, 384],
            [315, 422],
            [334, 476],
            [358, 500],
          ],
          [
            [358, 500],
            [392, 524],
            [462, 520],
            [526, 502],
          ],
        ],
        18
      ),
      { key: key + 'jawLine', w: 3.0, amt: 0.2 }
    );

    const lHatch: Pt[][] = [
      [
        [332, 342],
        [320, 364],
      ],
      [
        [338, 344],
        [324, 372],
      ],
      [
        [344, 346],
        [330, 376],
      ],
      [
        [350, 349],
        [338, 376],
      ],
      [
        [356, 352],
        [345, 376],
      ],
      [
        [362, 355],
        [352, 376],
      ],
      [
        [368, 360],
        [360, 375],
      ],
    ];
    for (let i = 0; i < lHatch.length; i++) {
      sgLine(ctx, lHatch[i], {
        key: key + 'chHL' + i,
        w: 1.15,
        col: SG.inkHatch,
        amt: 0.12,
      });
    }

    const rHatch: Pt[][] = [
      [
        [484, 378],
        [476, 392],
      ],
      [
        [491, 380],
        [481, 398],
      ],
      [
        [498, 382],
        [486, 405],
      ],
      [
        [506, 384],
        [492, 412],
      ],
      [
        [514, 385],
        [499, 416],
      ],
      [
        [522, 386],
        [506, 422],
      ],
      [
        [530, 388],
        [516, 418],
      ],
      [
        [538, 390],
        [526, 418],
      ],
      [
        [545, 392],
        [535, 418],
      ],
      [
        [552, 396],
        [544, 416],
      ],
      [
        [558, 402],
        [553, 414],
      ],
    ];
    for (let i = 0; i < rHatch.length; i++) {
      sgLine(ctx, rHatch[i], {
        key: key + 'chHR' + i,
        w: 1.15,
        col: SG.inkHatch,
        amt: 0.12,
      });
    }

    // Upturned Anime Nose
    const noseShadeP = bezierPts(
      [
        [
          [388, 352],
          [384, 364],
          [388, 378],
          [398, 382],
        ],
        [
          [398, 382],
          [408, 384],
          [412, 376],
          [406, 368],
        ],
        [
          [406, 368],
          [398, 364],
          [392, 358],
          [388, 352],
        ],
      ],
      10
    );
    sgShape(ctx, noseShadeP, SG.skinNeckShade, {
      key: key + 'noseSh',
      line: false,
      fillA: 0.72,
    });

    sgLine(
      ctx,
      [
        [406, 326],
        [395, 338],
      ],
      { key: key + 'noseBr', w: 1.5, amt: 0.15 }
    );
    sgTaperLine(
      ctx,
      bezierPts(
        [
          [
            [388, 352],
            [385, 362],
            [388, 372],
            [394, 378],
          ],
        ],
        10
      ),
      1.2,
      2.8,
      1.0,
      SG.ink
    );
    sgLine(
      ctx,
      [
        [391, 360],
        [394, 372],
      ],
      { key: key + 'nostL', w: 1.5, amt: 0.1 }
    );
    sgLine(
      ctx,
      [
        [408, 374],
        [413, 379],
      ],
      { key: key + 'nostR', w: 1.6, amt: 0.1 }
    );

    // LAYER 15: Softly Parted Glossy Rose-Pink Lips (Gentle Breathing Part!)
    sgLine(
      ctx,
      bezierPts(
        [
          [
            [392, 396],
            [396, 400],
            [402, 401],
            [406, 399],
          ],
        ],
        8
      ),
      { key: key + 'phil', w: 1.3, col: SG.inkSoft, amt: 0.1 }
    );

    withPivot(ctx, 402, 424, 0, 1, lipPart, 0, 0, () => {
      sgBlush(ctx, 396, 412, 22, 9, '232,155,154', 0.72, 0.25);
      sgBlush(ctx, 400, 435, 25, 13, '238,168,165', 0.78, 0.24);
      sgBlush(ctx, 398, 438, 16, 8, '218,128,128', 0.45, 0.22);

      const mouthInP = bezierPts(
        [
          [
            [382, 418],
            [386, 412],
            [400, 416],
            [424, 432],
          ],
          [
            [424, 432],
            [406, 428],
            [390, 424],
            [382, 418],
          ],
        ],
        12
      );
      sgShape(ctx, mouthInP, '#ffffff', { key: key + 'teeth', line: false, amt: 0.12 });

      sgTaperLine(
        ctx,
        bezierPts(
          [
            [
              [370, 419],
              [378, 420],
              [383, 416],
              [387, 412],
            ],
            [
              [387, 412],
              [402, 416],
              [418, 428],
              [435, 436],
            ],
          ],
          16
        ),
        1.5,
        2.8,
        1.5,
        SG.ink
      );

      sgTaperLine(
        ctx,
        bezierPts(
          [
            [
              [381, 417],
              [390, 424],
              [406, 428],
              [426, 433],
            ],
          ],
          12
        ),
        1.2,
        1.8,
        1.0,
        SG.ink
      );

      sgLine(
        ctx,
        [
          [376, 409],
          [382, 405],
        ],
        { key: key + 'cupidL', w: 1.3, col: SG.inkSoft, amt: 0.1 }
      );
      sgTaperLine(
        ctx,
        bezierPts(
          [
            [
              [381, 447],
              [390, 452],
              [400, 455],
              [406, 455],
            ],
          ],
          10
        ),
        1.0,
        2.2,
        0.8,
        SG.ink
      );

      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.beginPath();
      ctx.ellipse(404, 436, 2.4, 4.2, -0.15, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(416, 440, 5.2, 2.2, 0.25, 0, TAU);
      ctx.fill();
      ctx.restore();
    });

    // LAYER 10..13: Expressive 90s Shoujo Starry Eyes (True Deforming Upper Eyelid & Clipped Round Iris — NO SQUASHING!)
    drawShoujoEyeDeforming(
      ctx,
      {
        cx: 368 + gazeDX,
        cy: 298 + gazeDY,
        rx: 28,
        ry: 33,
        rot: 0.12,
        scleraSegsOpen: [
          [
            [338, 294],
            [344, 266],
            [368, 258],
            [390, 274],
          ],
          [
            [390, 274],
            [400, 292],
            [398, 316],
            [384, 326],
          ],
          [
            [384, 326],
            [366, 334],
            [344, 320],
            [338, 294],
          ],
        ],
        scleraSegsMid: [
          [
            [338, 300],
            [348, 292],
            [372, 292],
            [394, 302],
          ],
          [
            [394, 302],
            [400, 310],
            [396, 320],
            [384, 326],
          ],
          [
            [384, 326],
            [366, 334],
            [344, 320],
            [338, 300],
          ],
        ],
        scleraSegsClosed: [
          [
            [338, 308],
            [352, 324],
            [374, 328],
            [394, 318],
          ],
          [
            [394, 318],
            [396, 320],
            [392, 324],
            [384, 326],
          ],
          [
            [384, 326],
            [366, 334],
            [344, 322],
            [338, 308],
          ],
        ],
        upperLidSegsOpen: [
          [
            [328, 292],
            [340, 262],
            [368, 252],
            [392, 272],
          ],
          [
            [392, 272],
            [400, 286],
            [401, 300],
            [399, 308],
          ],
          [
            [399, 308],
            [394, 288],
            [374, 268],
            [352, 272],
          ],
          [
            [352, 272],
            [340, 276],
            [334, 288],
            [328, 292],
          ],
        ],
        upperLidSegsMid: [
          [
            [328, 298],
            [344, 284],
            [372, 284],
            [396, 298],
          ],
          [
            [396, 298],
            [400, 304],
            [401, 310],
            [398, 314],
          ],
          [
            [398, 314],
            [390, 302],
            [372, 294],
            [350, 294],
          ],
          [
            [350, 294],
            [338, 296],
            [332, 300],
            [328, 298],
          ],
        ],
        upperLidSegsClosed: [
          [
            [330, 304],
            [348, 322],
            [374, 326],
            [398, 314],
          ],
          [
            [398, 314],
            [400, 316],
            [400, 320],
            [396, 322],
          ],
          [
            [396, 322],
            [374, 334],
            [348, 330],
            [330, 310],
          ],
          [
            [330, 310],
            [328, 308],
            [328, 306],
            [330, 304],
          ],
        ],
        lowerLidSegs: [
          [
            [342, 314],
            [356, 330],
            [376, 334],
            [392, 324],
          ],
        ],
        creaseSegsOpen: [
          [
            [348, 245],
            [366, 240],
            [386, 250],
            [398, 268],
          ],
        ],
        creaseSegsMid: [
          [
            [344, 272],
            [364, 268],
            [384, 274],
            [398, 288],
          ],
        ],
        creaseSegsClosed: [
          [
            [340, 290],
            [358, 304],
            [380, 308],
            [398, 300],
          ],
        ],
        mainHi: [
          377 + gazeDX * 0.6,
          286 + gazeDY * 0.6,
          10.5 * starPulse,
          11.5 * starPulse,
          -0.1,
        ],
        subHi: [
          358 + gazeDX * 0.8,
          304 + gazeDY * 0.8,
          5.0 / starPulse,
          5.2 / starPulse,
          0,
        ],
        botHi: [373 + gazeDX * 0.5, 321 + gazeDY * 0.5, 5.5, 4.0, 0.15],
        sideDots: [
          [345 + gazeDX * 0.4, 295 + gazeDY * 0.4, 2.8 * starPulse, 3.2 * starPulse, 0],
          [391 + gazeDX * 0.4, 298 + gazeDY * 0.4, 2.2, 2.5, 0],
        ],
        upperLashesOpen: [
          [[336, 292], [328, 293], [320, 290], [314, 285], 4.2, 2.5],
          [[338, 284], [330, 282], [322, 277], [316, 271], 4.0, 2.4],
          [[343, 276], [336, 270], [330, 263], [326, 256], 3.8, 2.2],
          [[350, 268], [346, 260], [343, 252], [341, 245], 3.6, 2.0],
          [[360, 262], [359, 254], [359, 246], [360, 240], 3.4, 1.8],
          [[372, 262], [374, 255], [376, 248], [379, 243], 3.2, 1.6],
          [[384, 268], [387, 261], [391, 255], [394, 251], 3.0, 1.5],
        ],
        upperLashesMid: [
          [[334, 298], [325, 300], [316, 298], [310, 294], 4.0, 2.4],
          [[340, 293], [332, 292], [324, 289], [318, 285], 3.8, 2.2],
          [[348, 289], [342, 285], [336, 280], [332, 275], 3.8, 2.2],
          [[358, 287], [354, 281], [351, 275], [349, 269], 3.6, 2.0],
          [[369, 287], [368, 281], [368, 275], [369, 269], 3.4, 1.8],
          [[380, 290], [382, 284], [385, 279], [388, 274], 3.2, 1.6],
          [[390, 295], [394, 290], [398, 286], [401, 282], 3.0, 1.5],
        ],
        upperLashesClosed: [
          [[332, 308], [324, 312], [316, 314], [310, 313], 4.0, 2.4],
          [[340, 315], [333, 321], [326, 325], [320, 326], 3.8, 2.2],
          [[350, 322], [344, 329], [339, 334], [334, 337], 3.8, 2.2],
          [[360, 326], [356, 334], [353, 340], [350, 344], 3.6, 2.0],
          [[371, 328], [369, 336], [368, 342], [367, 346], 3.4, 1.8],
          [[382, 326], [383, 334], [384, 339], [386, 343], 3.2, 1.6],
          [[392, 321], [395, 327], [398, 332], [401, 335], 3.0, 1.5],
        ],
        lowerLashes: [
          [
            [346, 318],
            [342, 322],
            [338, 326],
            [334, 329],
          ],
          [
            [353, 324],
            [350, 328],
            [347, 332],
            [344, 335],
          ],
          [
            [361, 328],
            [359, 333],
            [357, 336],
            [355, 339],
          ],
          [
            [370, 331],
            [369, 336],
            [368, 339],
            [367, 342],
          ],
          [
            [378, 331],
            [378, 335],
            [378, 339],
            [378, 342],
          ],
          [
            [386, 328],
            [387, 332],
            [389, 335],
            [390, 338],
          ],
        ],
      },
      key + 'eyeL',
      blink
    );

    sgLine(
      ctx,
      bezierPts(
        [
          [
            [412, 260],
            [416, 272],
            [418, 282],
            [419, 290],
          ],
        ],
        8
      ),
      { key: key + 'eyeLCrs2', w: 1.3, amt: 0.15 }
    );

    drawShoujoEyeDeforming(
      ctx,
      {
        cx: 530 + gazeDX,
        cy: 334 + gazeDY,
        rx: 32,
        ry: 36,
        rot: 0.16,
        scleraSegsOpen: [
          [
            [494, 318],
            [508, 296],
            [538, 294],
            [566, 318],
          ],
          [
            [566, 318],
            [576, 336],
            [574, 356],
            [556, 366],
          ],
          [
            [556, 366],
            [530, 372],
            [500, 354],
            [494, 318],
          ],
        ],
        scleraSegsMid: [
          [
            [494, 328],
            [512, 322],
            [542, 324],
            [570, 340],
          ],
          [
            [570, 340],
            [576, 348],
            [570, 360],
            [556, 366],
          ],
          [
            [556, 366],
            [530, 372],
            [500, 354],
            [494, 328],
          ],
        ],
        scleraSegsClosed: [
          [
            [494, 344],
            [514, 360],
            [544, 366],
            [572, 356],
          ],
          [
            [572, 356],
            [574, 358],
            [566, 362],
            [556, 366],
          ],
          [
            [556, 366],
            [530, 372],
            [500, 356],
            [494, 344],
          ],
        ],
        upperLidSegsOpen: [
          [
            [488, 316],
            [506, 290],
            [542, 288],
            [574, 322],
          ],
          [
            [574, 322],
            [584, 338],
            [592, 350],
            [602, 354],
          ],
          [
            [602, 354],
            [582, 354],
            [568, 340],
            [556, 322],
          ],
          [
            [556, 322],
            [536, 304],
            [508, 302],
            [488, 316],
          ],
        ],
        upperLidSegsMid: [
          [
            [488, 326],
            [510, 314],
            [544, 316],
            [576, 338],
          ],
          [
            [576, 338],
            [586, 346],
            [594, 352],
            [603, 353],
          ],
          [
            [603, 353],
            [584, 356],
            [566, 348],
            [552, 336],
          ],
          [
            [552, 336],
            [534, 326],
            [508, 324],
            [488, 326],
          ],
        ],
        upperLidSegsClosed: [
          [
            [490, 342],
            [514, 358],
            [546, 364],
            [578, 354],
          ],
          [
            [578, 354],
            [588, 354],
            [596, 354],
            [604, 352],
          ],
          [
            [604, 352],
            [588, 362],
            [566, 370],
            [542, 370],
          ],
          [
            [542, 370],
            [514, 368],
            [496, 354],
            [490, 342],
          ],
        ],
        lowerLidSegs: [
          [
            [500, 350],
            [518, 366],
            [544, 370],
            [566, 360],
          ],
        ],
        creaseSegsOpen: [
          [
            [502, 280],
            [528, 278],
            [558, 292],
            [578, 316],
          ],
        ],
        creaseSegsMid: [
          [
            [498, 304],
            [524, 302],
            [554, 314],
            [576, 332],
          ],
        ],
        creaseSegsClosed: [
          [
            [496, 326],
            [520, 342],
            [550, 348],
            [576, 342],
          ],
        ],
        mainHi: [
          533 + gazeDX * 0.6,
          321 + gazeDY * 0.6,
          11.5 * starPulse,
          11.5 * starPulse,
          -0.1,
        ],
        subHi: [
          517 + gazeDX * 0.8,
          339 + gazeDY * 0.8,
          5.2 / starPulse,
          5.2 / starPulse,
          0,
        ],
        botHi: [534 + gazeDX * 0.5, 360 + gazeDY * 0.5, 6.5, 4.5, 0.15],
        sideDots: [
          [503 + gazeDX * 0.4, 330 + gazeDY * 0.4, 3.0 * starPulse, 3.5 * starPulse, 0],
          [554 + gazeDX * 0.4, 333 + gazeDY * 0.4, 3.2, 3.5, 0],
        ],
        upperLashesOpen: [
          [[496, 308], [492, 301], [489, 294], [488, 289], 3.2, 1.8],
          [[508, 298], [506, 290], [506, 283], [508, 278], 3.5, 2.0],
          [[522, 294], [524, 286], [526, 279], [529, 274], 3.8, 2.2],
          [[538, 296], [542, 289], [548, 282], [553, 277], 4.0, 2.4],
          [[552, 304], [559, 299], [567, 294], [574, 290], 4.2, 2.5],
          [[564, 316], [573, 313], [582, 310], [590, 306], 4.4, 2.6],
          [[572, 330], [582, 330], [592, 328], [600, 324], 4.5, 2.6],
          [[576, 342], [586, 343], [595, 343], [603, 340], 4.2, 2.4],
        ],
        upperLashesMid: [
          [[494, 322], [489, 317], [485, 313], [482, 309], 3.2, 1.8],
          [[508, 318], [505, 312], [504, 306], [505, 301], 3.5, 2.0],
          [[522, 316], [523, 310], [525, 304], [528, 299], 3.8, 2.2],
          [[538, 318], [542, 313], [547, 308], [552, 304], 4.0, 2.4],
          [[552, 324], [559, 320], [567, 317], [574, 314], 4.2, 2.5],
          [[565, 332], [574, 330], [583, 328], [591, 326], 4.4, 2.6],
          [[574, 341], [584, 342], [594, 341], [602, 339], 4.5, 2.6],
          [[580, 348], [590, 350], [599, 350], [607, 349], 4.2, 2.4],
        ],
        upperLashesClosed: [
          [[496, 348], [491, 353], [486, 357], [482, 360], 3.2, 1.8],
          [[508, 356], [503, 363], [499, 369], [495, 373], 3.5, 2.0],
          [[520, 362], [516, 370], [513, 376], [510, 381], 3.8, 2.2],
          [[534, 366], [532, 375], [530, 382], [529, 387], 4.0, 2.4],
          [[548, 367], [549, 376], [550, 383], [551, 388], 4.2, 2.5],
          [[562, 365], [566, 373], [570, 379], [574, 384], 4.4, 2.6],
          [[575, 360], [582, 366], [589, 371], [596, 374], 4.5, 2.6],
          [[586, 356], [595, 360], [603, 362], [611, 362], 4.2, 2.4],
        ],
        lowerLashes: [
          [
            [502, 352],
            [498, 355],
            [494, 358],
            [491, 360],
          ],
          [
            [512, 358],
            [509, 362],
            [506, 366],
            [504, 369],
          ],
          [
            [522, 364],
            [520, 368],
            [518, 372],
            [516, 375],
          ],
          [
            [532, 367],
            [531, 372],
            [530, 376],
            [530, 379],
          ],
          [
            [542, 368],
            [543, 373],
            [544, 376],
            [545, 379],
          ],
          [
            [552, 366],
            [554, 370],
            [556, 374],
            [558, 377],
          ],
          [
            [560, 362],
            [563, 366],
            [567, 369],
            [570, 372],
          ],
        ],
      },
      key + 'eyeR',
      blink
    );

    // LAYER 14: Expressive Feathered Eyebrows (Soft Lift & Tilt!)
    withPivot(ctx, 370, 232, -browRot, 1, 1, 0, browLift, () => {
      sgLine(
        ctx,
        bezierPts(
          [
            [
              [332, 238],
              [356, 224],
              [384, 225],
              [408, 238],
            ],
          ],
          12
        ),
        { key: key + 'browL1', w: 1.7, amt: 0.15 }
      );
      sgLine(
        ctx,
        bezierPts(
          [
            [
              [336, 242],
              [358, 230],
              [384, 231],
              [406, 243],
            ],
          ],
          12
        ),
        { key: key + 'browL2', w: 1.4, amt: 0.15 }
      );
      for (let i = 0; i < 6; i++) {
        const bx = 345 + i * 9;
        sgLine(
          ctx,
          [
            [bx, 228 + Math.abs(i - 2.5) * 1.5],
            [bx + 6, 233 + Math.abs(i - 2.5) * 1.5],
          ],
          { key: key + 'bhL' + i, w: 1.0, amt: 0.1 }
        );
      }
    });

    withPivot(ctx, 540, 265, browRot, 1, 1, 0, browLift, () => {
      sgLine(
        ctx,
        bezierPts(
          [
            [
              [492, 248],
              [524, 246],
              [558, 260],
              [588, 286],
            ],
          ],
          12
        ),
        { key: key + 'browR1', w: 1.7, amt: 0.15 }
      );
      sgLine(
        ctx,
        bezierPts(
          [
            [
              [494, 253],
              [524, 252],
              [556, 266],
              [584, 290],
            ],
          ],
          12
        ),
        { key: key + 'browR2', w: 1.4, amt: 0.15 }
      );
      for (let i = 0; i < 7; i++) {
        const bx = 502 + i * 11;
        const by = 249 + i * 4.5;
        sgLine(
          ctx,
          [
            [bx, by],
            [bx + 8, by + 5],
          ],
          { key: key + 'bhR' + i, w: 1.0, amt: 0.1 }
        );
      }
    });

    // LAYER 16..19: FRONT BANGS, CHEEK S-LOCK & SHOULDER CURL
    if (renderHair) {
    withPivot(ctx, 485, 115, bangLRot, 1, 1, 0, 0, () => {
      const bangsLeftP = bezierPts(
        [
          [
            [485, 115],
            [442, 102],
            [412, 138],
            [410, 186],
          ],
          [
            [410, 186],
            [410, 218],
            [428, 236],
            [452, 226],
          ],
          [
            [452, 226],
            [424, 238],
            [392, 218],
            [392, 172],
          ],
          [
            [392, 172],
            [385, 208],
            [396, 236],
            [418, 242],
          ],
          [
            [418, 242],
            [382, 236],
            [358, 206],
            [362, 165],
          ],
          [
            [362, 165],
            [344, 205],
            [348, 248],
            [375, 268],
          ],
          [
            [375, 268],
            [342, 258],
            [322, 220],
            [332, 178],
          ],
          [
            [332, 178],
            [312, 220],
            [318, 266],
            [344, 286],
          ],
          [
            [344, 286],
            [308, 278],
            [286, 244],
            [295, 195],
          ],
          [
            [295, 195],
            [272, 225],
            [278, 265],
            [298, 282],
          ],
          [
            [298, 282],
            [268, 258],
            [262, 210],
            [282, 155],
          ],
          [
            [282, 155],
            [312, 96],
            [395, 65],
            [485, 75],
          ],
          [
            [485, 75],
            [488, 95],
            [488, 108],
            [485, 115],
          ],
        ],
        14
      );
      sgShape(ctx, bangsLeftP, SG.hairMain, {
        key: key + 'bangsL',
        w: 2.2,
        line: SG.ink,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
          g.addColorStop(0, SG.hairLight);
          g.addColorStop(0.7, SG.hairMain);
          g.addColorStop(1, SG.hairWarm);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
      });
    });

    withPivot(ctx, 492, 115, bangRRot, 1, 1, 0, 0, () => {
      const bangsRightP = bezierPts(
        [
          [
            [492, 115],
            [534, 108],
            [552, 148],
            [536, 192],
          ],
          [
            [536, 192],
            [516, 228],
            [496, 256],
            [516, 282],
          ],
          [
            [516, 282],
            [504, 258],
            [518, 224],
            [545, 186],
          ],
          [
            [545, 186],
            [530, 228],
            [528, 265],
            [554, 284],
          ],
          [
            [554, 284],
            [544, 255],
            [558, 215],
            [585, 185],
          ],
          [
            [585, 185],
            [582, 235],
            [586, 286],
            [612, 326],
          ],
          [
            [612, 326],
            [625, 365],
            [612, 405],
            [575, 444],
          ],
          [
            [575, 444],
            [542, 476],
            [534, 514],
            [558, 535],
          ],
          [
            [558, 535],
            [544, 512],
            [554, 480],
            [586, 452],
          ],
          [
            [586, 452],
            [568, 495],
            [572, 545],
            [550, 566],
          ],
          [
            [550, 566],
            [534, 574],
            [520, 564],
            [524, 550],
          ],
          [
            [524, 550],
            [518, 568],
            [538, 580],
            [562, 564],
          ],
          [
            [562, 564],
            [586, 542],
            [580, 495],
            [602, 455],
          ],
          [
            [602, 455],
            [634, 412],
            [646, 368],
            [636, 326],
          ],
          [
            [636, 326],
            [652, 368],
            [685, 388],
            [715, 395],
          ],
          [
            [715, 395],
            [750, 320],
            [740, 180],
            [660, 95],
          ],
          [
            [660, 95],
            [595, 58],
            [525, 65],
            [492, 115],
          ],
        ],
        14
      );
      sgShape(ctx, bangsRightP, SG.hairMain, {
        key: key + 'bangsR',
        w: 2.2,
        line: SG.ink,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
          g.addColorStop(0, SG.hairLight);
          g.addColorStop(0.65, SG.hairMain);
          g.addColorStop(1, SG.hairWarm);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
      });
    });

    // LAYER 19: Large Voluminous Right Shoulder S-Wave Curl
    withPivot(ctx, 710, 430, shoulderCurlRot, 1, 1, 0, 0, () => {
      const shoulderCurlRP = bezierPts(
        [
          [
            [678, 425],
            [655, 495],
            [595, 548],
            [580, 616],
          ],
          [
            [580, 616],
            [568, 675],
            [596, 728],
            [642, 728],
          ],
          [
            [642, 728],
            [682, 728],
            [718, 686],
            [738, 666],
          ],
          [
            [738, 666],
            [765, 666],
            [795, 685],
            [818, 725],
          ],
          [
            [818, 725],
            [825, 660],
            [790, 560],
            [760, 460],
          ],
          [
            [760, 460],
            [730, 435],
            [702, 425],
            [678, 425],
          ],
        ],
        16
      );
      sgShape(ctx, shoulderCurlRP, SG.hairMain, {
        key: key + 'shCurlR',
        w: 2.4,
        line: SG.ink,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
          g.addColorStop(0, SG.hairLight);
          g.addColorStop(0.6, SG.hairMain);
          g.addColorStop(1, SG.hairWarm);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          const scShade = bezierPts(
            [
              [
                [632, 575],
                [608, 618],
                [612, 668],
                [652, 682],
              ],
              [
                [652, 682],
                [685, 692],
                [712, 675],
                [725, 658],
              ],
              [
                [725, 658],
                [685, 668],
                [648, 645],
                [652, 595],
              ],
            ],
            12
          );
          sgShape(ctx, scShade, SG.hairShade, { key: key + 'scShR', line: false, fillA: 0.65 });
        },
      });

      // Rose 3 & Bow 4 ride on the Right Shoulder S-Wave Curl!
      withPivot(ctx, 784, 466, roseRot3, roseScale, roseScale, 0, 0, () => {
        drawShoujoRose(ctx, 784, 466, 25, 0, key + 'rose3', []);
      });
      withPivot(
        ctx,
        758,
        568,
        bowFlutter4,
        1 + bowFlutter4 * 0.2,
        1 - bowFlutter4 * 0.15,
        0,
        0,
        () => {
          drawBlackBow(
            ctx,
            bezierPts(
              [
                [
                  [750, 558],
                  [760, 556],
                  [766, 560],
                  [766, 570],
                ],
                [
                  [766, 570],
                  [766, 578],
                  [756, 580],
                  [750, 576],
                ],
                [
                  [750, 576],
                  [746, 570],
                  [746, 562],
                  [750, 558],
                ],
              ],
              8
            ),
            [
              [
                [752, 560],
                [732, 546],
                [712, 536],
                [702, 538],
              ],
              [
                [702, 538],
                [698, 546],
                [698, 562],
                [704, 572],
              ],
              [
                [704, 572],
                [718, 576],
                [736, 576],
                [752, 572],
              ],
            ],
            [
              [
                [764, 560],
                [782, 556],
                [802, 554],
                [812, 558],
              ],
              [
                [812, 558],
                [816, 566],
                [816, 580],
                [812, 588],
              ],
              [
                [812, 588],
                [796, 588],
                [778, 584],
                [764, 574],
              ],
            ],
            [
              [
                [748, 574],
                [732, 590],
                [718, 604],
                [708, 614],
              ],
              [
                [708, 614],
                [716, 620],
                [722, 626],
                [726, 634],
              ],
              [
                [726, 634],
                [738, 612],
                [748, 592],
                [756, 576],
              ],
            ],
            [
              [
                [762, 574],
                [776, 596],
                [790, 618],
                [804, 638],
              ],
              [
                [804, 638],
                [810, 630],
                [818, 626],
                [826, 624],
              ],
              [
                [826, 624],
                [804, 602],
                [782, 584],
                [766, 572],
              ],
            ],
            [
              [
                [736, 564],
                [750, 568],
              ],
              [
                [766, 568],
                [780, 568],
              ],
            ],
            key + 'bow4'
          );
        }
      );
    });

    // LAYER 20..23: UPPER ROSES & BOWS (Individual Blooming & Flutter!)
    withPivot(ctx, 721, 256, roseRot1, roseScale, roseScale, 0, 0, () => {
      drawShoujoRose(ctx, 721, 256, 29, 0, key + 'rose1', []);
    });

    withPivot(ctx, 298, 488, roseRot2, roseScale, roseScale, 0, 0, () => {
      drawShoujoRose(ctx, 298, 488, 27, 0, key + 'rose2', [
        [-1.35, 18, 12, SG.hairShade],
        [0.72, 22, 14, SG.hairShade],
      ]);
    });

    withPivot(
      ctx,
      284,
      262,
      bowFlutter1,
      1 + bowFlutter1 * 0.2,
      1 - bowFlutter1 * 0.15,
      0,
      0,
      () => {
        drawBlackBow(
          ctx,
          null,
          [
            [
              [278, 232],
              [266, 218],
              [256, 214],
              [252, 220],
            ],
            [
              [252, 220],
              [246, 232],
              [244, 244],
              [248, 250],
            ],
            [
              [248, 250],
              [260, 256],
              [276, 260],
              [288, 264],
            ],
            [
              [288, 264],
              [284, 248],
              [280, 238],
              [278, 232],
            ],
          ],
          null,
          [
            [
              [284, 262],
              [262, 270],
              [242, 278],
              [231, 284],
            ],
            [
              [231, 284],
              [238, 294],
              [242, 304],
              [242, 314],
            ],
            [
              [242, 314],
              [262, 296],
              [280, 280],
              [295, 268],
            ],
          ],
          null,
          [],
          key + 'bow1'
        );
      }
    );

    withPivot(
      ctx,
      735,
      296,
      bowFlutter2,
      1 + bowFlutter2 * 0.2,
      1 - bowFlutter2 * 0.15,
      0,
      0,
      () => {
        drawBlackBow(
          ctx,
          bezierPts(
            [
              [
                [726, 286],
                [736, 284],
                [744, 288],
                [744, 298],
              ],
              [
                [744, 298],
                [744, 306],
                [734, 308],
                [726, 305],
              ],
              [
                [726, 305],
                [722, 298],
                [722, 290],
                [726, 286],
              ],
            ],
            8
          ),
          [
            [
              [728, 288],
              [704, 282],
              [682, 278],
              [672, 282],
            ],
            [
              [672, 282],
              [668, 292],
              [670, 308],
              [676, 316],
            ],
            [
              [676, 316],
              [692, 318],
              [712, 312],
              [730, 304],
            ],
          ],
          [
            [
              [740, 288],
              [760, 274],
              [782, 262],
              [792, 264],
            ],
            [
              [792, 264],
              [798, 272],
              [802, 288],
              [800, 298],
            ],
            [
              [800, 298],
              [784, 304],
              [762, 305],
              [742, 302],
            ],
          ],
          [
            [
              [726, 304],
              [710, 326],
              [694, 350],
              [684, 366],
            ],
            [
              [684, 366],
              [694, 372],
              [700, 380],
              [706, 388],
            ],
            [
              [706, 388],
              [718, 362],
              [728, 334],
              [736, 306],
            ],
          ],
          [
            [
              [740, 302],
              [758, 322],
              [778, 344],
              [794, 362],
            ],
            [
              [794, 362],
              [798, 352],
              [804, 344],
              [810, 338],
            ],
            [
              [810, 338],
              [788, 322],
              [764, 308],
              [744, 298],
            ],
          ],
          [
            [
              [712, 294],
              [726, 296],
            ],
            [
              [744, 294],
              [758, 290],
            ],
          ],
          key + 'bow2'
        );
      }
    );
    } // end if (renderHair) for front hair layers
  }); // end head hierarchy

  // ===================================================================
  // LAYER 24: DREAMY 90s SHOUJO FLOATING SPARKLES & PETAL GLINT AMBIENCE
  // ===================================================================
  if (rig.showSparkles) {
    const sparkles: [number, number, number, number][] = [
      [135, 225, 11, 0.0],
      [855, 195, 13, 1.4],
      [125, 495, 9, 2.7],
      [885, 515, 11, 3.8],
      [155, 735, 10, 4.9],
      [865, 815, 12, 2.1],
    ];
    for (let i = 0; i < sparkles.length; i++) {
      const [sx0, sy0, sr0, ph] = sparkles[i];
      const pulse = 0.5 + 0.5 * Math.sin(t * w2 * 2 + ph);
      const sy = sy0 + Math.sin(t * w1 + ph) * 14;
      const sx = sx0 + Math.cos(t * w1 + ph) * 8;
      const r = sr0 * (0.45 + 0.65 * pulse);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = SG.roseLight;
      ctx.strokeStyle = SG.inkSoft;
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.35 + 0.55 * pulse;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.restore();
}
