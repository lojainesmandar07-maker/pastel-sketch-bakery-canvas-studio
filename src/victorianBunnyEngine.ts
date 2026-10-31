/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VICTORIAN MAID BONNET BUNNY — MASTER STORYBOOK CHARACTER & ANIMATION ENGINE (`pastel-sketch` <canvas>)
 * Implements the 3-Skill Hybrid Formula:
 * 1. `animate` (`pastel-sketch` 3-pass colored-pencil outlines + deterministic `mulberry32` paper & fur grain)
 * 2. `rig-character` (12-Layer Hierarchical `withPivot` Rigging + Open-Contour Joins)
 * 3. `canvas-design` (1000x1000 Calibrated Coordinates, Triple-Tiered Victorian Bonnet, Satin Ribbons)
 */

const TAU = Math.PI * 2;

// =====================================================================
// 1. DETERMINISTIC PRNG & TEXTURE ENGINE (`pastel-sketch` Primitives)
// =====================================================================
export function hash32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// =====================================================================
// 2. COLOR PALETTE (Sampled from Bunny_wearing_Victorian_maid_bonnet)
// =====================================================================
export const BUNNY_PALETTE = {
  bgPaper: '#F9F6F0',          // Warm antique cream paper

  // 3-Pass Colored Pencil Outlines
  pencilDark: '#6A4C3C',       // Pass 1: Warm espresso-sepia primary outline
  pencilSoft: '#9D7F6E',       // Pass 2: Soft secondary taupe-brown grain
  pencilLace: '#8A6F5E',       // Delicate eyelet lace & stitch line

  // Bunny Fur & Shading
  furBase: '#FDFBF4',          // Creamy ivory bunny fur
  furHighlight: '#FFFFFF',     // Pure white crown/cheek highlight
  furShadow: '#EFE4D2',        // Soft warm biscuit shadow
  furDeepShadow: '#E3D3BC',    // Deeper warm beige under-chin/belly/rump shadow
  furPencilGrain: '#D3BEA3',   // Colored-pencil directional fur strokes

  // Victorian Bonnet Tiers
  bonnetOuterCream: '#F4E9DA', // Outer pleated ruffle warm cream
  bonnetOuterShadow: '#DFCEB7',// Pleat fold shadow
  bonnetLaceWhite: '#FCFBF8',  // Middle & inner crisp white lace tiers
  bonnetLaceShadow: '#E8DEC8', // Soft warm shadow under lace tiers

  // Dusty Rose / Mauve-Pink Satin Ribbons & Bows
  ribbonBase: '#DFB6AD',       // Dusty rose-pink satin base
  ribbonLight: '#F1D6CF',      // Soft pale pink satin sheen highlight
  ribbonMid: '#CE9E94',        // Mid rose-taupe crease
  ribbonDark: '#B9857A',       // Deep antique mauve-brown knot/under-fold shadow
  ribbonOutline: '#6E4F41',    // Warm brown pencil outline for ribbons

  // Facial Features & Paws
  eyeDark: '#483024',          // Deep warm espresso-brown iris/pupil
  eyeWarmRim: '#6B4835',       // Warm chestnut lower iris rim
  nosePink: '#E5ACA2',         // Soft dusty rose nose pad
  noseTopBridge: '#DFB2A6',    // Vertical pencil hatching on nose bridge
  blushPink: '#E3988C',        // Warm rosy cheek oval
  blushSlash: '#C8786B',       // Diagonal blush hatch slashes
  pawPadPink: '#ECC5BC',       // Soft peachy-pink oval footpads & inner ear
  pawPadShadow: '#D7A79C',     // Soft crease line inside footpad/ear
  toeBeanBlush: '#E8B4A8',     // Soft pink blush on toe tips
};

// 3-Pass Colored-Pencil Stroke (`psLine`)
export function psBunnyLine(
  ctx: CanvasRenderingContext2D,
  drawPathFn: (c: CanvasRenderingContext2D) => void,
  width = 3.2,
  color = BUNNY_PALETTE.pencilDark,
  alpha = 0.92,
  softColor = BUNNY_PALETTE.pencilSoft
): void {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Pass 1: Solid primary colored-pencil core
  ctx.beginPath();
  drawPathFn(ctx);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.stroke();

  // Pass 2: Slightly wider soft grain halo
  ctx.beginPath();
  drawPathFn(ctx);
  ctx.strokeStyle = softColor;
  ctx.lineWidth = width + 1.4;
  ctx.globalAlpha = alpha * 0.30;
  ctx.stroke();

  // Pass 3: Stippled dashed dry-pencil tooth
  ctx.beginPath();
  drawPathFn(ctx);
  ctx.setLineDash([1.6, 2.4]);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.0, width * 0.75);
  ctx.globalAlpha = alpha * 0.42;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

// Colored-Pencil Directional Hatching inside a clipped region
function psHatch(
  ctx: CanvasRenderingContext2D,
  seedKey: string,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  angleDeg: number,
  spacing: number,
  color: string,
  alpha = 0.22,
  width = 1.3
): void {
  const rng = mulberry32(hash32(seedKey));
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = (x0 + x1) * 0.5;
  const cy = (y0 + y1) * 0.5;
  const diag = Math.hypot(x1 - x0, y1 - y0) * 0.65;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let offset = -diag; offset <= diag; offset += spacing) {
    const jitter = (rng() - 0.5) * spacing * 0.35;
    const d = offset + jitter;
    const px = cx - sin * d;
    const py = cy + cos * d;
    const len = diag * (0.75 + rng() * 0.25);
    ctx.beginPath();
    ctx.lineWidth = width * (0.8 + rng() * 0.4);
    ctx.globalAlpha = alpha * (0.7 + rng() * 0.5);
    ctx.moveTo(px - cos * len, py - sin * len);
    ctx.lineTo(px + cos * len, py + sin * len);
    ctx.stroke();
  }
  ctx.restore();
}

// Soft radial pastel smudge
function softGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  color: string,
  alpha: number
): void {
  ctx.save();
  const g = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(253, 251, 244, 0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// Non-destructive Hierarchical Pivot Transform Helper
export function withBunnyPivot(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  rotRad = 0,
  sx = 1,
  sy = 1,
  tx = 0,
  ty = 0,
  drawFn: () => void
): void {
  ctx.save();
  ctx.translate(px + tx, py + ty);
  if (rotRad !== 0) ctx.rotate(rotRad);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.translate(-px, -py);
  drawFn();
  ctx.restore();
}

// =====================================================================
// 3. RIGGING STATE & INTERFACES
// =====================================================================
export type BunnyEyeState = 'open' | 'blink' | 'happy';
export type BunnyAnimationMode = '12layer' | '5layer' | 'static' | 'manual';

export interface BunnyRigState {
  mode: BunnyAnimationMode;
  time: number;
  boilFrame: number; // 0 = locked paper grain, 1..N = subtle line-boil

  // Root & Torso
  bodyX: number;
  bodyY: number;
  bodyRot: number; // degrees
  breathScaleX: number;
  breathScaleY: number;

  // Head & Bonnet
  headRot: number; // degrees
  headOffsetX: number;
  headOffsetY: number;
  bonnetFlutter: number; // degrees

  // Lop Ears
  earLeftRot: number; // degrees
  earRightRot: number; // degrees

  // Front Paws
  armLeftRot: number; // degrees
  armRightRot: number; // degrees

  // Hind Feet & Tail
  footLeftRot: number; // degrees
  footRightRot: number; // degrees
  tailWagRot: number; // degrees

  // Satin Ribbons & Bows
  chestBowRot: number; // degrees
  sideBowRot: number; // degrees

  // Face Expressions
  eyeState: BunnyEyeState;
  noseTwitchY: number;
  blushIntensity: number;

  // Optional floating dust motes / petals
  showPetals: boolean;
  showConstructionGuides: boolean;
}

export const DEFAULT_BUNNY_RIG: BunnyRigState = {
  mode: '12layer',
  time: 0,
  boilFrame: 0,

  bodyX: 0,
  bodyY: 0,
  bodyRot: 0,
  breathScaleX: 1,
  breathScaleY: 1,

  headRot: 0,
  headOffsetX: 0,
  headOffsetY: 0,
  bonnetFlutter: 0,

  earLeftRot: 0,
  earRightRot: 0,

  armLeftRot: 0,
  armRightRot: 0,

  footLeftRot: 0,
  footRightRot: 0,
  tailWagRot: 0,

  chestBowRot: 0,
  sideBowRot: 0,

  eyeState: 'open',
  noseTwitchY: 0,
  blushIntensity: 0.76,

  showPetals: false,
  showConstructionGuides: true,
};

// =====================================================================
// 4. PAPER BACKGROUND & FLOATING PETALS
// =====================================================================
export function drawBunnyPaperBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.fillStyle = BUNNY_PALETTE.bgPaper;
  ctx.fillRect(0, 0, width, height);

  const rng = mulberry32(hash32('victorian_bunny_paper_v4'));
  for (let i = 0; i < 3200; i++) {
    const x = rng() * width;
    const y = rng() * height;
    const r = 0.4 + rng() * 1.1;
    ctx.fillStyle = i % 2 === 0 ? '#EAE2D3' : '#FFFDF9';
    ctx.globalAlpha = 0.16 + rng() * 0.14;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

export function drawFloatingPetals(ctx: CanvasRenderingContext2D, width: number, height: number, time: number): void {
  ctx.save();
  const rng = mulberry32(hash32('victorian_rose_petals'));
  for (let i = 0; i < 16; i++) {
    const baseX = rng() * width;
    const baseY = rng() * height;
    const speedY = 22 + rng() * 18;
    const swayAmp = 18 + rng() * 16;
    const phase = rng() * TAU;

    const y = (baseY + time * speedY) % (height + 40) - 20;
    const x = (baseX + Math.sin(time * 1.2 + phase) * swayAmp + width) % width;
    const rot = time * (0.6 + rng() * 0.6) + phase;
    const rx = 5 + rng() * 4;
    const ry = 3 + rng() * 2.5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fillStyle = i % 2 === 0 ? BUNNY_PALETTE.ribbonLight : BUNNY_PALETTE.pawPadPink;
    ctx.globalAlpha = 0.45;
    ctx.fill();
    ctx.strokeStyle = BUNNY_PALETTE.pencilSoft;
    ctx.lineWidth = 0.9;
    ctx.globalAlpha = 0.30;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// =====================================================================
// 5. MAIN CHARACTER RENDERER (`drawVictorianBunny`)
// =====================================================================
export function drawVictorianBunny(
  ctx: CanvasRenderingContext2D,
  rig: BunnyRigState,
  cx: number,
  cy: number,
  scale = 1
): void {
  const t = rig.time;
  const mode = rig.mode;

  // Compute procedural motion offsets based on mode
  let breathX = rig.breathScaleX;
  let breathY = rig.breathScaleY;
  let bodySwayRad = (rig.bodyRot * Math.PI) / 180;
  let headTiltRad = (rig.headRot * Math.PI) / 180;
  let headBobY = rig.headOffsetY;
  let earLRad = (rig.earLeftRot * Math.PI) / 180;
  let earRRad = (rig.earRightRot * Math.PI) / 180;
  let armLRad = (rig.armLeftRot * Math.PI) / 180;
  let armRRad = (rig.armRightRot * Math.PI) / 180;
  let footLRad = (rig.footLeftRot * Math.PI) / 180;
  let footRRad = (rig.footRightRot * Math.PI) / 180;
  let tailRad = (rig.tailWagRot * Math.PI) / 180;
  let chestBowRad = (rig.chestBowRot * Math.PI) / 180;
  let sideBowRad = (rig.sideBowRot * Math.PI) / 180;
  let bonnetRad = (rig.bonnetFlutter * Math.PI) / 180;
  let noseY = rig.noseTwitchY;
  let activeEye: BunnyEyeState = rig.eyeState;

  if (mode === '5layer') {
    const breath = Math.sin(t * 2.2);
    breathX = 1 + breath * 0.009;
    breathY = 1 - breath * 0.011;
    bodySwayRad = Math.sin(t * 1.1) * 0.012;
    headTiltRad = Math.sin(t * 1.1 - 0.4) * 0.020;
    headBobY = Math.sin(t * 2.2 - 0.3) * 2.2;
    earLRad = Math.sin(t * 1.5 - 0.6) * 0.025;
    earRRad = Math.sin(t * 1.5 - 0.8) * -0.025;
    sideBowRad = Math.sin(t * 1.8 - 0.5) * 0.022;
    chestBowRad = Math.sin(t * 2.2 - 0.4) * 0.015;
    // Periodic gentle blink every 4.2s
    if (rig.eyeState === 'open' && t % 4.2 > 4.02) {
      activeEye = 'blink';
    }
  } else if (mode === '12layer') {
    const breath = Math.sin(t * 2.6);
    breathX = 1 + breath * 0.012;
    breathY = 1 - breath * 0.014;
    bodySwayRad = Math.sin(t * 1.3) * 0.016;
    headTiltRad = Math.sin(t * 1.3 - 0.35) * 0.032;
    headBobY = Math.sin(t * 2.6 - 0.25) * 3.0;
    bonnetRad = Math.sin(t * 2.6 - 0.5) * 0.012;

    // Gentle lop ear pendulum + occasional bunny ear flutter
    const earTwitch = Math.pow(Math.max(0, Math.sin(t * 1.9)), 8) * 0.055;
    earLRad = Math.sin(t * 1.3 - 0.6) * 0.035 + earTwitch;
    earRRad = Math.sin(t * 1.3 - 0.7) * -0.035 - earTwitch * 0.7;

    // Cute alternating hind-foot rock & front paw breathe
    footLRad = Math.sin(t * 2.6) * 0.042;
    footRRad = Math.sin(t * 2.6 + Math.PI) * 0.042;
    armLRad = Math.sin(t * 2.6 - 0.3) * 0.035;
    armRRad = -Math.sin(t * 2.6 - 0.3) * 0.035;

    // Fluffy cottontail wiggle
    tailRad = Math.sin(t * 5.2) * 0.065;

    // Satin ribbon follow-through
    chestBowRad = Math.sin(t * 2.6 - 0.6) * 0.025;
    sideBowRad = Math.sin(t * 1.3 - 0.8) * 0.038;

    // Cute rapid bunny nose twitch!
    noseY = Math.sin(t * 9.5) * (Math.sin(t * 1.5) > 0.2 ? 1.8 : 0.4);

    // Periodic blink and happy squint envelope
    const cycle = t % 6.5;
    if (rig.eyeState === 'open') {
      if (cycle > 6.32) activeEye = 'blink';
      else if (cycle > 3.2 && cycle < 4.1) activeEye = 'happy';
    }
  }

  ctx.save();
  // Map 1000x1000 calibrated coordinates to canvas center (cx, cy)
  ctx.translate(cx + rig.bodyX, cy + rig.bodyY);
  ctx.scale(scale, scale);
  ctx.translate(-500, -500);

  // ===================================================================
  // LAYER 0: Ground Shadow & Ambient Sketch Construction Arcs
  // ===================================================================
  ctx.save();
  const sg = ctx.createRadialGradient(485, 868, 25, 485, 868, 255);
  sg.addColorStop(0, 'rgba(130, 102, 84, 0.24)');
  sg.addColorStop(0.55, 'rgba(155, 128, 110, 0.12)');
  sg.addColorStop(1, 'rgba(155, 128, 110, 0)');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.ellipse(485, 868, 250 * breathX, 32, -0.02, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = BUNNY_PALETTE.pencilSoft;
  ctx.lineCap = 'round';
  const shadowStrokes = [
    [355, 864, 465, 865],
    [375, 870, 485, 870],
    [390, 875, 455, 875],
    [580, 882, 742, 848],
    [645, 868, 762, 845],
  ];
  shadowStrokes.forEach(([x1, y1, x2, y2], idx) => {
    ctx.beginPath();
    ctx.lineWidth = idx >= 3 ? 1.5 : 1.3;
    ctx.globalAlpha = idx >= 3 ? 0.42 : 0.32;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.restore();

  if (rig.showConstructionGuides) {
    ctx.save();
    ctx.strokeStyle = BUNNY_PALETTE.pencilSoft;
    ctx.lineWidth = 1.1;
    ctx.globalAlpha = 0.25;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(222, 206);
    ctx.quadraticCurveTo(255, 155, 302, 134);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(204, 286);
    ctx.quadraticCurveTo(192, 345, 208, 405);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(676, 152);
    ctx.quadraticCurveTo(738, 185, 774, 245);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(218, 635);
    ctx.quadraticCurveTo(225, 672, 265, 686);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(240, 742);
    ctx.quadraticCurveTo(220, 795, 255, 845);
    ctx.stroke();
    ctx.restore();
  }

  // ===================================================================
  // ROOT BODY PIVOT (485, 840) — Breathing & Torso Sway
  // ===================================================================
  withBunnyPivot(ctx, 485, 840, bodySwayRad, breathX, breathY, 0, 0, () => {
    // -----------------------------------------------------------------
    // HEAD & BONNET BACK LAYERS (Following Head Pivot at 475, 520)
    // Drawn BEFORE torso/ears where appropriate so depth order is 100% true
    // -----------------------------------------------------------------
    withBunnyPivot(ctx, 475, 520, headTiltRad, 1, 1, rig.headOffsetX, headBobY, () => {
      // LAYER 1: Left Behind-Head Ribbon Bow (Pivot 275, 475)
      withBunnyPivot(ctx, 275, 475, -sideBowRad * 0.85, 1, 1, 0, 0, () => {
        drawLeftBackRibbon(ctx);
      });

      // LAYER 2: Back Bonnet Cap & Scalloped Brim Trim (Upper Right)
      withBunnyPivot(ctx, 640, 320, bonnetRad * 0.6, 1, 1, 0, 0, () => {
        drawBackBonnetCap(ctx);
      });
    });

    // -----------------------------------------------------------------
    // LAYER 3: Fluffy Round Cottontail (Pivot 700, 795)
    // -----------------------------------------------------------------
    withBunnyPivot(ctx, 700, 795, tailRad, 1, 1, 0, 0, () => {
      drawTail(ctx);
    });

    // -----------------------------------------------------------------
    // LAYER 4: Plump Pear-Shaped Sitting Torso & Haunches
    // -----------------------------------------------------------------
    drawBody(ctx);

    // -----------------------------------------------------------------
    // LAYER 5: Hind Feet with 3 Plump Toes & Oval Pink Footpads
    // -----------------------------------------------------------------
    // 5A. Left Hind Foot (Pivot at heel 350, 855)
    withBunnyPivot(ctx, 350, 855, footLRad, 1, 1, 0, 0, () => {
      drawLeftHindFoot(ctx);
    });

    // 5B. Right Hind Foot (Pivot at heel 545, 885)
    withBunnyPivot(ctx, 545, 885, footRRad, 1, 1, 0, 0, () => {
      drawRightHindFoot(ctx);
    });

    // -----------------------------------------------------------------
    // LAYER 6: Center Chest Ribbon Neck Band & Hanging Swallowtail Ribbons
    // -----------------------------------------------------------------
    drawNeckBand(ctx);
    withBunnyPivot(ctx, 450, 585, chestBowRad * 1.15, 1, 1, 0, 0, () => {
      drawChestRibbonTails(ctx);
    });

    // -----------------------------------------------------------------
    // LAYER 7: Front Arms & Paws Resting on Chest
    // -----------------------------------------------------------------
    // 7A. Left Front Arm (Pivot at shoulder 345, 615)
    withBunnyPivot(ctx, 345, 615, armLRad, 1, 1, 0, 0, () => {
      drawLeftFrontArm(ctx);
    });

    // 7B. Right Front Arm (Pivot at shoulder 605, 625)
    withBunnyPivot(ctx, 605, 625, armRRad, 1, 1, 0, 0, () => {
      drawRightFrontArm(ctx);
    });

    // -----------------------------------------------------------------
    // LAYER 8: Big Center Chest Bow Loops & Knot (Pivot at knot 450, 578)
    // -----------------------------------------------------------------
    withBunnyPivot(ctx, 450, 578, chestBowRad, 1, 1, 0, 0, () => {
      drawChestBowLoopsAndKnot(ctx);
    });

    // -----------------------------------------------------------------
    // HEAD, LOP EARS, TRIPLE-TIERED BONNET & RIGHT BOW (Pivot 475, 520)
    // -----------------------------------------------------------------
    withBunnyPivot(ctx, 475, 520, headTiltRad, 1, 1, rig.headOffsetX, headBobY, () => {
      // LAYER 9A: Left Lop Ear (Pivot at temple 332, 420)
      withBunnyPivot(ctx, 332, 420, earLRad, 1, 1, 0, 0, () => {
        drawLeftLopEar(ctx);
      });

      // LAYER 9B: Right Lop Ear (Pivot at temple 632, 425)
      withBunnyPivot(ctx, 632, 425, earRRad, 1, 1, 0, 0, () => {
        drawRightLopEar(ctx);
      });

      // LAYER 10: Chubby Bunny Head, Cheeks, Glossy Eyes, Nose & Mouth
      drawHeadAndFace(ctx, activeEye, noseY, rig.blushIntensity);

      // LAYER 11: Triple-Tiered Victorian Maid Bonnet (Pivot at crown 468, 420)
      withBunnyPivot(ctx, 468, 420, bonnetRad, 1, 1, 0, 0, () => {
        drawVictorianBonnet(ctx);
      });

      // LAYER 12: Right Side Bonnet Bow & Long Swallowtail Ribbons (Pivot at knot 722, 462)
      withBunnyPivot(ctx, 722, 462, sideBowRad, 1, 1, 0, 0, () => {
        drawRightSideBow(ctx);
      });
    });
  });

  ctx.restore();
}

// =====================================================================
// 6. INDIVIDUAL LAYER DRAWING FUNCTIONS (1000x1000 Calibrated)
// =====================================================================

function drawLeftBackRibbon(ctx: CanvasRenderingContext2D): void {
  const traceTopLoop = (c: CanvasRenderingContext2D) => {
    c.moveTo(298, 456);
    c.bezierCurveTo(256, 405, 206, 408, 210, 455);
    c.bezierCurveTo(212, 492, 232, 514, 278, 510);
    c.closePath();
  };

  const traceTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(255, 502);
    c.bezierCurveTo(224, 540, 196, 582, 182, 616);
    c.lineTo(215, 598);
    c.lineTo(234, 634);
    c.bezierCurveTo(252, 592, 272, 544, 292, 502);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'left_tail_h', 180, 500, 295, 640, 118, 4.8, BUNNY_PALETTE.ribbonDark, 0.25, 1.3);
  ctx.restore();
  psBunnyLine(ctx, traceTail, 2.8, BUNNY_PALETTE.ribbonOutline);

  ctx.save();
  ctx.beginPath();
  traceTopLoop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'left_loop_h', 205, 405, 300, 515, 18, 4.8, BUNNY_PALETTE.ribbonDark, 0.22, 1.3);
  softGlow(ctx, 236, 462, 4, 34, BUNNY_PALETTE.ribbonLight, 0.55);
  ctx.restore();
  psBunnyLine(ctx, traceTopLoop, 2.8, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(286, 472);
      c.quadraticCurveTo(246, 462, 218, 474);
      c.moveTo(284, 485);
      c.quadraticCurveTo(252, 486, 226, 496);
    },
    1.8,
    BUNNY_PALETTE.ribbonOutline,
    0.72
  );
}

function drawBackBonnetCap(ctx: CanvasRenderingContext2D): void {
  const traceCap = (c: CanvasRenderingContext2D) => {
    c.moveTo(618, 184);
    c.bezierCurveTo(732, 198, 796, 338, 774, 428);
    c.bezierCurveTo(756, 444, 720, 440, 696, 405);
    c.bezierCurveTo(665, 355, 636, 275, 618, 184);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceCap(ctx);
  ctx.fillStyle = BUNNY_PALETTE.bonnetOuterCream;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'back_cap_grain', 615, 180, 795, 445, 35, 5.0, BUNNY_PALETTE.bonnetOuterShadow, 0.28, 1.4);
  softGlow(ctx, 738, 305, 10, 75, '#FFFDF9', 0.55);
  ctx.restore();
  psBunnyLine(ctx, traceCap, 3.1, BUNNY_PALETTE.pencilDark);

  const traceInnerScallop = (c: CanvasRenderingContext2D) => {
    c.moveTo(676, 214);
    const pts = [
      [694, 220], [705, 238], [718, 256], [730, 276],
      [740, 298], [748, 320], [754, 344], [758, 368], [755, 388]
    ];
    let curX = 676, curY = 214;
    pts.forEach(([nx, ny]) => {
      const mx = (curX + nx) * 0.5 + 8;
      const my = (curY + ny) * 0.5 - 4;
      c.quadraticCurveTo(mx, my, nx, ny);
      curX = nx;
      curY = ny;
    });
    c.lineTo(734, 390);
    c.bezierCurveTo(712, 335, 692, 275, 672, 224);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceInnerScallop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.bonnetLaceWhite;
  ctx.fill();
  ctx.restore();
  psBunnyLine(ctx, traceInnerScallop, 2.0, BUNNY_PALETTE.pencilLace, 0.85);

  ctx.save();
  ctx.strokeStyle = BUNNY_PALETTE.pencilLace;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.75;
  const backEyelets = [
    [689, 226], [702, 245], [715, 265], [726, 286],
    [736, 308], [743, 331], [748, 355], [748, 377]
  ];
  backEyelets.forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(ex, ey, 2.4, 0, TAU);
    ctx.stroke();
  });
  ctx.restore();

  const traceInteriorRecess = (c: CanvasRenderingContext2D) => {
    c.moveTo(665, 342);
    c.bezierCurveTo(682, 385, 704, 412, 728, 415);
    c.lineTo(712, 345);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceInteriorRecess(ctx);
  ctx.fillStyle = BUNNY_PALETTE.bonnetOuterShadow;
  ctx.fill();
  ctx.restore();
  psBunnyLine(ctx, traceInteriorRecess, 2.2, BUNNY_PALETTE.pencilDark, 0.8);

  const traceRightStrap = (c: CanvasRenderingContext2D) => {
    c.moveTo(684, 272);
    c.bezierCurveTo(705, 325, 724, 388, 732, 444);
    c.lineTo(710, 448);
    c.bezierCurveTo(700, 392, 682, 332, 665, 284);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceRightStrap(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'right_strap_h', 665, 270, 735, 450, 75, 4.5, BUNNY_PALETTE.ribbonDark, 0.26, 1.3);
  ctx.restore();
  psBunnyLine(ctx, traceRightStrap, 2.6, BUNNY_PALETTE.ribbonOutline);
}

function drawTail(ctx: CanvasRenderingContext2D): void {
  const traceTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(702, 738);
    c.bezierCurveTo(738, 725, 762, 760, 752, 804);
    c.bezierCurveTo(744, 838, 715, 850, 690, 843);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 715, 825, 5, 48, BUNNY_PALETTE.furDeepShadow, 0.72);
  psHatch(ctx, 'tail_hatch', 690, 730, 760, 850, 135, 5.5, BUNNY_PALETTE.furPencilGrain, 0.25, 1.3);
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(702, 738);
      c.bezierCurveTo(738, 725, 762, 760, 752, 804);
      c.bezierCurveTo(744, 838, 715, 850, 690, 843);
    },
    3.1,
    BUNNY_PALETTE.pencilDark
  );
}

function drawBody(ctx: CanvasRenderingContext2D): void {
  const traceBody = (c: CanvasRenderingContext2D) => {
    c.moveTo(345, 540);
    c.bezierCurveTo(322, 620, 294, 715, 304, 795);
    c.bezierCurveTo(345, 858, 445, 856, 524, 882);
    c.bezierCurveTo(618, 895, 708, 848, 706, 782);
    c.bezierCurveTo(704, 712, 662, 622, 622, 535);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceBody(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();

  softGlow(ctx, 455, 845, 15, 130, BUNNY_PALETTE.furDeepShadow, 0.72);
  softGlow(ctx, 645, 790, 20, 125, BUNNY_PALETTE.furShadow, 0.80);
  softGlow(ctx, 485, 585, 20, 115, BUNNY_PALETTE.furShadow, 0.55);
  softGlow(ctx, 355, 735, 10, 90, BUNNY_PALETTE.furShadow, 0.45);

  psHatch(ctx, 'body_belly_h', 350, 780, 540, 885, 65, 6.0, BUNNY_PALETTE.furPencilGrain, 0.22, 1.3);
  psHatch(ctx, 'body_rump_h', 560, 700, 710, 885, 140, 6.0, BUNNY_PALETTE.furPencilGrain, 0.24, 1.3);
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(328, 692);
      c.bezierCurveTo(312, 715, 303, 734, 300, 750);
      c.moveTo(368, 860);
      c.bezierCurveTo(425, 856, 475, 866, 518, 882);
      c.moveTo(679, 680);
      c.bezierCurveTo(698, 725, 707, 758, 706, 786);
      c.bezierCurveTo(704, 845, 635, 882, 574, 892);
    },
    3.3,
    BUNNY_PALETTE.pencilDark
  );

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(582, 722);
      c.bezierCurveTo(642, 728, 675, 775, 668, 825);
    },
    2.2,
    BUNNY_PALETTE.pencilSoft,
    0.65
  );

  ctx.save();
  ctx.strokeStyle = BUNNY_PALETTE.furPencilGrain;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.58;
  for (let i = 0; i < 9; i++) {
    const y = 745 + i * 13;
    const x = 648 - i * 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 18, y + 12);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const x = 395 + i * 14;
    const y = 846 + (i % 2) * 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y - 14);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLeftHindFoot(ctx: CanvasRenderingContext2D): void {
  const traceLeftFoot = (c: CanvasRenderingContext2D) => {
    c.moveTo(352, 868);
    c.bezierCurveTo(378, 862, 386, 845, 378, 828);
    c.bezierCurveTo(362, 798, 344, 768, 326, 746);
    c.bezierCurveTo(316, 735, 302, 738, 304, 752);
    c.bezierCurveTo(296, 730, 274, 728, 270, 748);
    c.bezierCurveTo(254, 738, 242, 752, 250, 774);
    c.bezierCurveTo(264, 815, 305, 874, 352, 868);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceLeftFoot(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();

  softGlow(ctx, 335, 845, 5, 55, BUNNY_PALETTE.furDeepShadow, 0.72);
  softGlow(ctx, 260, 758, 2, 16, BUNNY_PALETTE.toeBeanBlush, 0.55);
  softGlow(ctx, 286, 744, 2, 16, BUNNY_PALETTE.toeBeanBlush, 0.55);
  softGlow(ctx, 312, 748, 2, 15, BUNNY_PALETTE.toeBeanBlush, 0.55);
  ctx.restore();

  psBunnyLine(ctx, traceLeftFoot, 3.2, BUNNY_PALETTE.pencilDark);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(270, 748);
      c.lineTo(284, 775);
      c.moveTo(304, 752);
      c.lineTo(312, 776);
    },
    2.8,
    BUNNY_PALETTE.pencilDark
  );

  ctx.save();
  ctx.translate(304, 814);
  ctx.rotate(-0.54);
  ctx.beginPath();
  ctx.ellipse(0, 0, 27, 42, 0, 0, TAU);
  ctx.fillStyle = BUNNY_PALETTE.pawPadPink;
  ctx.fill();
  ctx.save();
  ctx.clip();
  psHatch(ctx, 'l_pad_h', -27, -42, 27, 42, 35, 5.0, BUNNY_PALETTE.pawPadShadow, 0.35, 1.3);
  ctx.restore();
  ctx.strokeStyle = BUNNY_PALETTE.pawPadShadow;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();
}

function drawRightHindFoot(ctx: CanvasRenderingContext2D): void {
  const traceRightFoot = (c: CanvasRenderingContext2D) => {
    c.moveTo(548, 904);
    c.bezierCurveTo(576, 902, 588, 868, 584, 828);
    c.bezierCurveTo(580, 795, 574, 772, 566, 762);
    c.bezierCurveTo(558, 752, 546, 756, 546, 770);
    c.bezierCurveTo(542, 744, 520, 744, 518, 768);
    c.bezierCurveTo(506, 754, 496, 764, 498, 788);
    c.bezierCurveTo(500, 835, 516, 905, 548, 904);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceRightFoot(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();

  softGlow(ctx, 555, 865, 5, 55, BUNNY_PALETTE.furDeepShadow, 0.68);
  softGlow(ctx, 508, 772, 2, 15, BUNNY_PALETTE.toeBeanBlush, 0.55);
  softGlow(ctx, 532, 760, 2, 16, BUNNY_PALETTE.toeBeanBlush, 0.55);
  softGlow(ctx, 556, 768, 2, 15, BUNNY_PALETTE.toeBeanBlush, 0.55);
  ctx.restore();

  psBunnyLine(ctx, traceRightFoot, 3.2, BUNNY_PALETTE.pencilDark);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(518, 768);
      c.lineTo(520, 792);
      c.moveTo(546, 770);
      c.lineTo(546, 794);
    },
    2.8,
    BUNNY_PALETTE.pencilDark
  );

  ctx.save();
  ctx.translate(540, 844);
  ctx.rotate(-0.18);
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 44, 0, 0, TAU);
  ctx.fillStyle = BUNNY_PALETTE.pawPadPink;
  ctx.fill();
  ctx.save();
  ctx.clip();
  psHatch(ctx, 'r_pad_h', -26, -44, 26, 44, 25, 5.0, BUNNY_PALETTE.pawPadShadow, 0.35, 1.3);
  ctx.restore();
  ctx.strokeStyle = BUNNY_PALETTE.pawPadShadow;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();
}

function drawNeckBand(ctx: CanvasRenderingContext2D): void {
  const traceNeckBand = (c: CanvasRenderingContext2D) => {
    c.moveTo(338, 505);
    c.bezierCurveTo(405, 554, 520, 548, 614, 516);
    c.lineTo(618, 548);
    c.bezierCurveTo(525, 582, 405, 584, 344, 542);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceNeckBand(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonDark;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'neck_band_h', 338, 505, 620, 585, 12, 4.5, BUNNY_PALETTE.ribbonOutline, 0.24, 1.3);
  ctx.restore();
  psBunnyLine(ctx, traceNeckBand, 2.8, BUNNY_PALETTE.ribbonOutline);
}

function drawChestRibbonTails(ctx: CanvasRenderingContext2D): void {
  const traceLeftTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(436, 594);
    c.bezierCurveTo(416, 655, 390, 715, 369, 765);
    c.lineTo(403, 764);
    c.lineTo(425, 797);
    c.bezierCurveTo(434, 725, 442, 655, 449, 596);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceLeftTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'chest_ltail_h', 368, 590, 450, 800, 102, 4.8, BUNNY_PALETTE.ribbonDark, 0.26, 1.3);
  softGlow(ctx, 412, 710, 5, 45, BUNNY_PALETTE.ribbonLight, 0.45);
  ctx.restore();
  psBunnyLine(ctx, traceLeftTail, 2.8, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(440, 615);
      c.quadraticCurveTo(422, 690, 403, 764);
    },
    1.5,
    BUNNY_PALETTE.ribbonOutline,
    0.55
  );

  const traceRightTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(453, 596);
    c.bezierCurveTo(452, 665, 454, 735, 457, 798);
    c.lineTo(486, 770);
    c.lineTo(514, 765);
    c.bezierCurveTo(509, 705, 496, 645, 484, 594);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceRightTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'chest_rtail_h', 450, 590, 516, 800, 84, 4.8, BUNNY_PALETTE.ribbonDark, 0.26, 1.3);
  softGlow(ctx, 482, 715, 5, 45, BUNNY_PALETTE.ribbonLight, 0.45);
  ctx.restore();
  psBunnyLine(ctx, traceRightTail, 2.8, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(468, 612);
      c.quadraticCurveTo(476, 690, 486, 770);
    },
    1.5,
    BUNNY_PALETTE.ribbonOutline,
    0.55
  );
}

function drawLeftFrontArm(ctx: CanvasRenderingContext2D): void {
  const traceLeftArm = (c: CanvasRenderingContext2D) => {
    c.moveTo(334, 586);
    c.bezierCurveTo(322, 635, 328, 696, 368, 701);
    c.bezierCurveTo(398, 703, 426, 694, 427, 672);
    c.bezierCurveTo(428, 650, 404, 638, 376, 642);
  };

  ctx.save();
  ctx.beginPath();
  traceLeftArm(ctx);
  ctx.closePath();
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 365, 685, 4, 45, BUNNY_PALETTE.furShadow, 0.72);
  ctx.restore();

  psBunnyLine(ctx, traceLeftArm, 3.1, BUNNY_PALETTE.pencilDark);
  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(424, 661);
      c.lineTo(403, 658);
      c.moveTo(423, 676);
      c.lineTo(402, 673);
    },
    2.5,
    BUNNY_PALETTE.pencilDark
  );
}

function drawRightFrontArm(ctx: CanvasRenderingContext2D): void {
  const traceRightArm = (c: CanvasRenderingContext2D) => {
    c.moveTo(615, 600);
    c.bezierCurveTo(632, 648, 634, 702, 586, 712);
    c.bezierCurveTo(542, 718, 492, 708, 466, 695);
    c.bezierCurveTo(448, 686, 448, 650, 472, 644);
    c.bezierCurveTo(494, 639, 522, 646, 545, 646);
  };

  ctx.save();
  ctx.beginPath();
  traceRightArm(ctx);
  ctx.closePath();
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 575, 692, 8, 65, BUNNY_PALETTE.furShadow, 0.76);
  psHatch(ctx, 'r_arm_h', 520, 620, 635, 715, 135, 5.5, BUNNY_PALETTE.furPencilGrain, 0.22, 1.3);
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(629, 648);
      c.bezierCurveTo(632, 688, 614, 708, 582, 712);
      c.bezierCurveTo(540, 718, 492, 708, 466, 695);
      c.bezierCurveTo(448, 686, 448, 650, 472, 644);
      c.bezierCurveTo(486, 641, 500, 643, 512, 646);
    },
    3.1,
    BUNNY_PALETTE.pencilDark
  );

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(454, 661);
      c.lineTo(474, 664);
      c.moveTo(454, 677);
      c.lineTo(474, 679);
    },
    2.5,
    BUNNY_PALETTE.pencilDark
  );
}

function drawChestBowLoopsAndKnot(ctx: CanvasRenderingContext2D): void {
  const traceLeftLoop = (c: CanvasRenderingContext2D) => {
    c.moveTo(434, 560);
    c.bezierCurveTo(388, 542, 336, 558, 334, 574);
    c.bezierCurveTo(332, 594, 355, 646, 378, 645);
    c.bezierCurveTo(402, 644, 428, 616, 442, 596);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceLeftLoop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'chest_lloop_h', 330, 545, 445, 650, 28, 4.8, BUNNY_PALETTE.ribbonDark, 0.25, 1.3);
  softGlow(ctx, 372, 596, 6, 42, BUNNY_PALETTE.ribbonLight, 0.65);
  ctx.restore();
  psBunnyLine(ctx, traceLeftLoop, 3.0, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(432, 575);
      c.quadraticCurveTo(392, 576, 356, 594);
      c.moveTo(434, 586);
      c.quadraticCurveTo(404, 602, 378, 622);
    },
    1.8,
    BUNNY_PALETTE.ribbonOutline,
    0.68
  );

  const traceRightLoop = (c: CanvasRenderingContext2D) => {
    c.moveTo(462, 560);
    c.bezierCurveTo(508, 556, 574, 586, 576, 606);
    c.bezierCurveTo(578, 626, 542, 670, 524, 669);
    c.bezierCurveTo(504, 668, 474, 632, 456, 598);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceRightLoop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'chest_rloop_h', 455, 555, 580, 672, 152, 4.8, BUNNY_PALETTE.ribbonDark, 0.25, 1.3);
  softGlow(ctx, 526, 614, 6, 44, BUNNY_PALETTE.ribbonLight, 0.65);
  ctx.restore();
  psBunnyLine(ctx, traceRightLoop, 3.0, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(466, 575);
      c.quadraticCurveTo(508, 586, 548, 612);
      c.moveTo(464, 586);
      c.quadraticCurveTo(498, 608, 524, 638);
    },
    1.8,
    BUNNY_PALETTE.ribbonOutline,
    0.68
  );

  const traceKnot = (c: CanvasRenderingContext2D) => {
    c.moveTo(434, 555);
    c.bezierCurveTo(448, 550, 464, 556, 467, 576);
    c.bezierCurveTo(468, 594, 456, 604, 442, 601);
    c.bezierCurveTo(429, 597, 426, 572, 434, 555);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceKnot(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonMid;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 448, 575, 2, 18, BUNNY_PALETTE.ribbonLight, 0.55);
  ctx.restore();
  psBunnyLine(ctx, traceKnot, 3.0, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(444, 560);
      c.quadraticCurveTo(452, 578, 448, 596);
    },
    1.8,
    BUNNY_PALETTE.ribbonOutline,
    0.72
  );
}

function drawLeftLopEar(ctx: CanvasRenderingContext2D): void {
  const traceLeftEar = (c: CanvasRenderingContext2D) => {
    c.moveTo(318, 402);
    c.bezierCurveTo(286, 468, 232, 588, 238, 646);
    c.bezierCurveTo(242, 675, 272, 672, 304, 635);
    c.bezierCurveTo(334, 598, 348, 554, 344, 505);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceLeftEar(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 275, 625, 5, 65, BUNNY_PALETTE.furShadow, 0.65);

  ctx.beginPath();
  ctx.moveTo(342, 452);
  ctx.bezierCurveTo(312, 515, 276, 602, 256, 662);
  ctx.bezierCurveTo(286, 656, 336, 595, 345, 512);
  ctx.closePath();
  ctx.fillStyle = BUNNY_PALETTE.pawPadPink;
  ctx.fill();
  psHatch(ctx, 'l_ear_pink', 255, 450, 346, 665, 115, 5.0, BUNNY_PALETTE.pawPadShadow, 0.35, 1.3);
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(315, 412);
      c.bezierCurveTo(284, 475, 232, 588, 238, 646);
      c.bezierCurveTo(242, 675, 272, 672, 304, 635);
      c.bezierCurveTo(328, 605, 342, 568, 344, 525);
    },
    3.2,
    BUNNY_PALETTE.pencilDark
  );

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(338, 468);
      c.bezierCurveTo(308, 528, 274, 604, 256, 660);
    },
    2.0,
    BUNNY_PALETTE.pencilSoft,
    0.78
  );
}

function drawRightLopEar(ctx: CanvasRenderingContext2D): void {
  const traceRightEar = (c: CanvasRenderingContext2D) => {
    c.moveTo(612, 418);
    c.bezierCurveTo(615, 498, 616, 592, 642, 642);
    c.bezierCurveTo(665, 682, 725, 698, 726, 666);
    c.bezierCurveTo(728, 604, 696, 495, 656, 418);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceRightEar(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();
  softGlow(ctx, 688, 625, 10, 75, BUNNY_PALETTE.furShadow, 0.80);
  softGlow(ctx, 682, 605, 5, 45, BUNNY_PALETTE.pawPadPink, 0.32);
  psHatch(ctx, 'r_ear_grain', 612, 420, 728, 695, 68, 5.8, BUNNY_PALETTE.furPencilGrain, 0.25, 1.3);
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(612, 426);
      c.bezierCurveTo(615, 498, 616, 592, 642, 642);
      c.bezierCurveTo(665, 682, 725, 698, 726, 666);
      c.bezierCurveTo(728, 608, 704, 515, 662, 430);
    },
    3.2,
    BUNNY_PALETTE.pencilDark
  );

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(626, 455);
      c.bezierCurveTo(634, 545, 654, 628, 694, 682);
    },
    2.0,
    BUNNY_PALETTE.pencilSoft,
    0.72
  );
}

function drawHeadAndFace(
  ctx: CanvasRenderingContext2D,
  eyeState: BunnyEyeState,
  noseTwitchY: number,
  blushIntensity: number
): void {
  const traceHead = (c: CanvasRenderingContext2D) => {
    c.moveTo(346, 405);
    c.bezierCurveTo(324, 444, 322, 488, 342, 512);
    c.bezierCurveTo(395, 548, 522, 548, 612, 516);
    c.bezierCurveTo(622, 488, 618, 445, 606, 412);
    c.bezierCurveTo(600, 230, 350, 230, 346, 405);
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceHead(ctx);
  ctx.fillStyle = BUNNY_PALETTE.furBase;
  ctx.fill();
  ctx.clip();

  softGlow(ctx, 470, 265, 25, 130, BUNNY_PALETTE.furDeepShadow, 0.72);
  softGlow(ctx, 350, 495, 5, 65, BUNNY_PALETTE.furShadow, 0.58);
  softGlow(ctx, 585, 495, 5, 65, BUNNY_PALETTE.furShadow, 0.58);
  softGlow(ctx, 465, 535, 10, 75, BUNNY_PALETTE.furShadow, 0.48);

  psHatch(ctx, 'head_fur_grain', 325, 260, 620, 545, 32, 6.5, BUNNY_PALETTE.furPencilGrain, 0.14, 1.2);

  ctx.strokeStyle = BUNNY_PALETTE.pencilSoft;
  ctx.lineCap = 'round';
  for (let i = 0; i < 28; i++) {
    const t = i / 27;
    const angle = (-166 + t * 150) * (Math.PI / 180);
    const hx = 468 + Math.cos(angle) * 124;
    const hy = 420 + Math.sin(angle) * 146;
    ctx.beginPath();
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.38;
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx - Math.cos(angle) * 14, hy - Math.sin(angle) * 14 + 4);
    ctx.stroke();
  }
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(346, 405);
      c.bezierCurveTo(324, 444, 322, 488, 342, 512);
      c.bezierCurveTo(395, 548, 522, 548, 612, 516);
      c.bezierCurveTo(618, 492, 615, 452, 608, 418);
    },
    3.2,
    BUNNY_PALETTE.pencilDark
  );

  // Rosy Cheek Blush Ovals + Diagonal Blush Hatching Slashes
  ctx.save();
  ctx.translate(362, 474);
  ctx.rotate(0.06);
  softGlow(ctx, 0, 0, 2, 32, BUNNY_PALETTE.blushPink, blushIntensity);
  ctx.strokeStyle = BUNNY_PALETTE.blushSlash;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.globalAlpha = blushIntensity * 0.82;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 7 - 4, 7);
    ctx.lineTo(i * 7 + 5, -7);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(554, 483);
  ctx.rotate(-0.05);
  softGlow(ctx, 0, 0, 4, 38, BUNNY_PALETTE.blushPink, blushIntensity);
  ctx.strokeStyle = BUNNY_PALETTE.blushSlash;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.globalAlpha = blushIntensity * 0.82;
  for (let i = -3; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 7 - 2, 8);
    ctx.lineTo(i * 7 + 6, -7);
    ctx.stroke();
  }
  ctx.restore();

  // Eyes (Open Glossy Espresso Ovals vs Blink vs Happy Arch)
  if (eyeState === 'open') {
    // Left Eye (384, 434)
    ctx.save();
    ctx.translate(384, 434);
    ctx.rotate(-0.03);
    ctx.beginPath();
    ctx.ellipse(0, 0, 11.5, 22, 0, 0, TAU);
    ctx.fillStyle = BUNNY_PALETTE.eyeDark;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 8, 8.5, 10, 0, 0, TAU);
    ctx.fillStyle = BUNNY_PALETTE.eyeWarmRim;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-3.2, -8.5, 3.8, 5.2, -0.15, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3.2, 5.5, 2.0, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Right Eye (537, 442)
    ctx.save();
    ctx.translate(537, 442);
    ctx.rotate(0.03);
    ctx.beginPath();
    ctx.ellipse(0, 0, 18.5, 23.5, 0, 0, TAU);
    ctx.fillStyle = BUNNY_PALETTE.eyeDark;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 9, 13, 11, 0, 0, TAU);
    ctx.fillStyle = BUNNY_PALETTE.eyeWarmRim;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-5.5, -8.5, 5.2, 6.2, -0.2, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5.5, 6.5, 2.5, 0, TAU);
    ctx.fill();
    ctx.restore();
  } else if (eyeState === 'blink') {
    psBunnyLine(
      ctx,
      (c) => {
        c.moveTo(371, 436);
        c.quadraticCurveTo(384, 446, 397, 437);
        c.moveTo(517, 444);
        c.quadraticCurveTo(537, 456, 557, 445);
      },
      3.2,
      BUNNY_PALETTE.eyeDark
    );
  } else {
    // 'happy' upward smiling arches
    psBunnyLine(
      ctx,
      (c) => {
        c.moveTo(371, 438);
        c.quadraticCurveTo(384, 420, 397, 438);
        c.moveTo(517, 446);
        c.quadraticCurveTo(537, 424, 557, 446);
      },
      3.2,
      BUNNY_PALETTE.eyeDark
    );
  }

  // Eyelid creases & brow ticks
  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(373, 408);
      c.quadraticCurveTo(384, 402, 395, 410);
      c.moveTo(520, 416);
      c.quadraticCurveTo(538, 408, 556, 420);
    },
    1.8,
    BUNNY_PALETTE.pencilSoft,
    0.75
  );
  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(383, 392);
      c.lineTo(388, 384);
      c.moveTo(528, 396);
      c.lineTo(532, 386);
    },
    1.4,
    BUNNY_PALETTE.pencilSoft,
    0.45
  );

  // Sweet Triangular Pink Nose, Bridge Hatching, & Inverted-'Y' Mouth (with Nose Twitch!)
  ctx.save();
  ctx.translate(0, noseTwitchY);
  softGlow(ctx, 439, 463, 2, 22, BUNNY_PALETTE.noseTopBridge, 0.55);
  ctx.strokeStyle = BUNNY_PALETTE.blushSlash;
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.48;
  for (let i = -4; i <= 4; i++) {
    const x = 439 + i * 5.2;
    const h = 9 - Math.abs(i) * 1.1;
    ctx.beginPath();
    ctx.moveTo(x - 2, 468);
    ctx.lineTo(x + 2, 468 - h * 1.6);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(424, 477);
  ctx.quadraticCurveTo(439, 472, 454, 478);
  ctx.quadraticCurveTo(446, 488, 439, 489);
  ctx.quadraticCurveTo(431, 488, 424, 477);
  ctx.closePath();
  ctx.fillStyle = BUNNY_PALETTE.nosePink;
  ctx.fill();

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(424, 478);
      c.quadraticCurveTo(432, 488, 439, 489);
      c.quadraticCurveTo(446, 488, 454, 479);
      c.moveTo(439, 489);
      c.lineTo(439, 515 - noseTwitchY * 0.4);
      c.moveTo(430, 523 - noseTwitchY * 0.4);
      c.quadraticCurveTo(435, 516 - noseTwitchY * 0.4, 439, 515 - noseTwitchY * 0.4);
      c.quadraticCurveTo(444, 516 - noseTwitchY * 0.4, 450, 523 - noseTwitchY * 0.4);
    },
    2.6,
    BUNNY_PALETTE.pencilDark
  );
  ctx.restore();
}

function drawVictorianBonnet(ctx: CanvasRenderingContext2D): void {
  const cx = 468;
  const cy = 420;

  const pt = (deg: number, rx: number, ry: number): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [cx + Math.cos(rad) * rx, cy + Math.sin(rad) * ry];
  };

  // --- TIER 1 (OUTERMOST): Big Warm-Cream Pleated Ruffle ---
  const outerLobes = 12;
  const degStart1 = -188;
  const degEnd1 = -18;
  const step1 = (degEnd1 - degStart1) / outerLobes;

  const traceTier1 = (c: CanvasRenderingContext2D, closeInner = true) => {
    const [sx, sy] = pt(degStart1, 205, 195);
    c.moveTo(sx, sy);

    for (let i = 0; i < outerLobes; i++) {
      const a0 = degStart1 + i * step1;
      const aL = a0 + step1 * 0.27;
      const aMid = a0 + step1 * 0.50;
      const aR = a0 + step1 * 0.73;
      const a1 = a0 + step1;

      const wave = Math.sin(i * 1.7) * 6;
      const peakRx = 268 + wave;
      const peakRy = 320 + wave;
      const dipRx = 258 + wave;
      const dipRy = 308 + wave;
      const valleyRx = 232 + wave * 0.4;
      const valleyRy = 278 + wave * 0.4;

      const [c1x, c1y] = pt(a0 + step1 * 0.12, peakRx, peakRy);
      const [p1x, p1y] = pt(aL, peakRx, peakRy);
      const [dpx, dpy] = pt(aMid, dipRx, dipRy);
      const [p2x, p2y] = pt(aR, peakRx, peakRy);
      const [c2x, c2y] = pt(a0 + step1 * 0.88, peakRx, peakRy);
      const [vx, vy] = pt(a1, i === outerLobes - 1 ? 195 : valleyRx, i === outerLobes - 1 ? 215 : valleyRy);

      c.quadraticCurveTo(c1x, c1y, p1x, p1y);
      c.quadraticCurveTo(dpx, dpy, p2x, p2y);
      c.quadraticCurveTo(c2x, c2y, vx, vy);
    }

    if (closeInner) {
      for (let i = outerLobes; i >= 0; i--) {
        const a = degStart1 + i * step1;
        const [ix, iy] = pt(a, 175, 200);
        c.lineTo(ix, iy);
      }
      c.closePath();
    }
  };

  ctx.save();
  ctx.beginPath();
  traceTier1(ctx, true);
  ctx.fillStyle = BUNNY_PALETTE.bonnetOuterCream;
  ctx.fill();
  ctx.clip();

  for (let i = 0; i <= outerLobes; i++) {
    const a = degStart1 + i * step1;
    const [vx, vy] = pt(a, 240, 286);
    const [ix, iy] = pt(a, 185, 215);
    ctx.beginPath();
    ctx.strokeStyle = BUNNY_PALETTE.bonnetOuterShadow;
    ctx.lineWidth = 6.0;
    ctx.globalAlpha = 0.48;
    ctx.moveTo(vx, vy);
    ctx.lineTo(ix, iy);
    ctx.stroke();

    if (i < outerLobes) {
      const aMid = a + step1 * 0.5;
      const [dx, dy] = pt(aMid, 258, 308);
      const [mx, my] = pt(aMid, 212, 252);
      ctx.beginPath();
      ctx.strokeStyle = BUNNY_PALETTE.bonnetOuterShadow;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.42;
      ctx.moveTo(dx, dy);
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
  }
  psHatch(ctx, 'tier1_pencil', 180, 95, 745, 460, 45, 5.5, BUNNY_PALETTE.bonnetOuterShadow, 0.25, 1.3);
  ctx.restore();

  psBunnyLine(ctx, (c) => traceTier1(c, false), 3.2, BUNNY_PALETTE.pencilDark);

  psBunnyLine(
    ctx,
    (c) => {
      for (let i = 1; i < outerLobes; i++) {
        const a = degStart1 + i * step1;
        const wave = Math.sin(i * 1.7) * 6;
        const [vx, vy] = pt(a, 232 + wave * 0.4, 278 + wave * 0.4);
        const [ix, iy] = pt(a, 192, 232);
        c.moveTo(vx, vy);
        c.lineTo(ix, iy);
      }
    },
    2.2,
    BUNNY_PALETTE.pencilDark,
    0.82
  );

  // --- TIER 2 (MIDDLE): White Scalloped Lace Trim with Broderie Anglaise Eyelets ---
  const midScallops = 17;
  const degStart2 = -184;
  const degEnd2 = 3;
  const step2 = (degEnd2 - degStart2) / midScallops;

  const traceTier2 = (c: CanvasRenderingContext2D) => {
    const [sx, sy] = pt(degStart2, 165, 185);
    c.moveTo(sx, sy);
    for (let i = 0; i < midScallops; i++) {
      const a0 = degStart2 + i * step2;
      const aMid = a0 + step2 * 0.5;
      const a1 = a0 + step2;

      const [mx, my] = pt(aMid, 212, 258);
      const [vx, vy] = pt(a1, 195, 238);
      c.quadraticCurveTo(mx, my, vx, vy);
    }
    const [ex, ey] = pt(degEnd2, 152, 175);
    c.lineTo(ex, ey);
    for (let i = midScallops; i >= 0; i--) {
      const a = degStart2 + i * step2;
      const [ix, iy] = pt(a, 145, 172);
      c.lineTo(ix, iy);
    }
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceTier2(ctx);
  ctx.fillStyle = BUNNY_PALETTE.bonnetLaceWhite;
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < midScallops; i++) {
    const aMid = degStart2 + (i + 0.5) * step2;
    const [mx, my] = pt(aMid, 196, 240);
    const [ix, iy] = pt(aMid, 158, 192);
    ctx.beginPath();
    ctx.strokeStyle = BUNNY_PALETTE.bonnetLaceShadow;
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.55;
    ctx.moveTo(mx, my);
    ctx.lineTo(ix, iy);
    ctx.stroke();
  }
  ctx.restore();

  psBunnyLine(
    ctx,
    (c) => {
      const [sx, sy] = pt(degStart2, 165, 185);
      c.moveTo(sx, sy);
      for (let i = 0; i < midScallops; i++) {
        const a0 = degStart2 + i * step2;
        const aMid = a0 + step2 * 0.5;
        const a1 = a0 + step2;
        const [mx, my] = pt(aMid, 212, 258);
        const [vx, vy] = pt(a1, 195, 238);
        c.quadraticCurveTo(mx, my, vx, vy);
      }
      const [ex, ey] = pt(degEnd2, 152, 175);
      c.lineTo(ex, ey);
    },
    2.7,
    BUNNY_PALETTE.pencilDark
  );

  psBunnyLine(
    ctx,
    (c) => {
      for (let i = 0; i <= midScallops; i++) {
        const a = degStart2 + i * step2;
        const [ix, iy] = pt(a, 176, 216);
        if (i === 0) c.moveTo(ix, iy);
        else c.lineTo(ix, iy);
      }
    },
    1.5,
    BUNNY_PALETTE.pencilSoft,
    0.65
  );

  ctx.save();
  ctx.strokeStyle = BUNNY_PALETTE.pencilLace;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.72;
  for (let i = 0; i < midScallops; i++) {
    const aMid = degStart2 + (i + 0.5) * step2;
    const [ex, ey] = pt(aMid, 192, 235);
    ctx.beginPath();
    ctx.arc(ex, ey, 3.0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // --- TIER 3 (INNERMOST): Tightly Gathered Frilly White Ruffle Framing Forehead ---
  const innerWaves = 18;
  const degStart3 = -179;
  const degEnd3 = -1;
  const step3 = (degEnd3 - degStart3) / innerWaves;

  const traceTier3 = (c: CanvasRenderingContext2D) => {
    const [sx, sy] = pt(degStart3, 148, 172);
    c.moveTo(sx, sy);
    for (let i = 0; i < innerWaves; i++) {
      const a0 = degStart3 + i * step3;
      const aMid = a0 + step3 * 0.5;
      const a1 = a0 + step3;
      const [mx, my] = pt(aMid, 172, 206);
      const [vx, vy] = pt(a1, 158, 190);
      c.quadraticCurveTo(mx, my, vx, vy);
    }
    const [rx, ry] = pt(degEnd3, 122, 144);
    c.lineTo(rx, ry);

    for (let i = innerWaves - 1; i >= 0; i--) {
      const aMid = degStart3 + (i + 0.5) * step3;
      const a0 = degStart3 + i * step3;
      const [mx, my] = pt(aMid, 134, 158);
      const [vx, vy] = pt(a0, 122, 144);
      c.quadraticCurveTo(mx, my, vx, vy);
    }
    c.closePath();
  };

  ctx.save();
  ctx.beginPath();
  traceTier3(ctx);
  ctx.fillStyle = BUNNY_PALETTE.bonnetLaceWhite;
  ctx.fill();
  ctx.clip();

  for (let i = 0; i <= innerWaves; i++) {
    const a = degStart3 + i * step3;
    const [ox, oy] = pt(a, 158, 190);
    const [ix, iy] = pt(a, 122, 144);
    ctx.beginPath();
    ctx.strokeStyle = BUNNY_PALETTE.bonnetOuterShadow;
    ctx.lineWidth = 3.2;
    ctx.globalAlpha = 0.50;
    ctx.moveTo(ox, oy);
    ctx.lineTo(ix, iy);
    ctx.stroke();
  }
  ctx.restore();

  psBunnyLine(ctx, traceTier3, 2.7, BUNNY_PALETTE.pencilDark);

  psBunnyLine(
    ctx,
    (c) => {
      for (let i = 1; i < innerWaves; i++) {
        const a = degStart3 + i * step3;
        const [ox, oy] = pt(a, 156, 187);
        const [ix, iy] = pt(a, 136, 162);
        c.moveTo(ox, oy);
        c.lineTo(ix, iy);
      }
    },
    1.5,
    BUNNY_PALETTE.pencilSoft,
    0.65
  );
}

function drawRightSideBow(ctx: CanvasRenderingContext2D): void {
  const traceBackTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(742, 476);
    c.bezierCurveTo(776, 520, 812, 565, 835, 603);
    c.lineTo(806, 594);
    c.lineTo(796, 632);
    c.bezierCurveTo(772, 585, 748, 535, 728, 488);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceBackTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'r_btail_h', 725, 475, 838, 635, 62, 4.8, BUNNY_PALETTE.ribbonDark, 0.26, 1.3);
  ctx.restore();
  psBunnyLine(ctx, traceBackTail, 2.8, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(745, 495);
      c.quadraticCurveTo(778, 548, 806, 594);
    },
    1.5,
    BUNNY_PALETTE.ribbonOutline,
    0.58
  );

  const traceFrontTail = (c: CanvasRenderingContext2D) => {
    c.moveTo(718, 484);
    c.bezierCurveTo(718, 565, 726, 645, 732, 715);
    c.lineTo(760, 678);
    c.lineTo(786, 704);
    c.bezierCurveTo(778, 632, 762, 555, 744, 482);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceFrontTail(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'r_ftail_h', 715, 480, 788, 718, 84, 4.8, BUNNY_PALETTE.ribbonDark, 0.26, 1.3);
  softGlow(ctx, 752, 615, 4, 45, BUNNY_PALETTE.ribbonLight, 0.48);
  ctx.restore();
  psBunnyLine(ctx, traceFrontTail, 2.8, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(734, 502);
      c.quadraticCurveTo(748, 590, 760, 678);
    },
    1.5,
    BUNNY_PALETTE.ribbonOutline,
    0.58
  );

  const traceLeftLoop = (c: CanvasRenderingContext2D) => {
    c.moveTo(708, 454);
    c.bezierCurveTo(676, 474, 645, 504, 647, 524);
    c.bezierCurveTo(650, 548, 682, 582, 704, 580);
    c.bezierCurveTo(722, 578, 732, 530, 728, 484);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceLeftLoop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'r_lloop_h', 645, 450, 735, 585, 42, 4.8, BUNNY_PALETTE.ribbonDark, 0.25, 1.3);
  softGlow(ctx, 688, 532, 5, 36, BUNNY_PALETTE.ribbonLight, 0.65);
  ctx.restore();
  psBunnyLine(ctx, traceLeftLoop, 2.9, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(712, 470);
      c.quadraticCurveTo(682, 498, 665, 526);
      c.moveTo(718, 478);
      c.quadraticCurveTo(698, 515, 690, 552);
    },
    1.7,
    BUNNY_PALETTE.ribbonOutline,
    0.68
  );

  const traceRightLoop = (c: CanvasRenderingContext2D) => {
    c.moveTo(734, 444);
    c.bezierCurveTo(765, 422, 804, 408, 812, 420);
    c.bezierCurveTo(820, 435, 814, 488, 802, 498);
    c.bezierCurveTo(788, 508, 756, 494, 734, 476);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceRightLoop(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonBase;
  ctx.fill();
  ctx.clip();
  psHatch(ctx, 'r_rloop_h', 730, 408, 820, 505, 165, 4.8, BUNNY_PALETTE.ribbonDark, 0.25, 1.3);
  softGlow(ctx, 782, 456, 5, 36, BUNNY_PALETTE.ribbonLight, 0.65);
  ctx.restore();
  psBunnyLine(ctx, traceRightLoop, 2.9, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(742, 456);
      c.quadraticCurveTo(775, 448, 804, 456);
      c.moveTo(742, 466);
      c.quadraticCurveTo(772, 470, 796, 482);
    },
    1.7,
    BUNNY_PALETTE.ribbonOutline,
    0.68
  );

  const traceKnot = (c: CanvasRenderingContext2D) => {
    c.moveTo(708, 442);
    c.bezierCurveTo(720, 430, 738, 438, 742, 458);
    c.bezierCurveTo(744, 476, 730, 488, 715, 485);
    c.bezierCurveTo(702, 480, 700, 456, 708, 442);
    c.closePath();
  };
  ctx.save();
  ctx.beginPath();
  traceKnot(ctx);
  ctx.fillStyle = BUNNY_PALETTE.ribbonMid;
  ctx.fill();
  ctx.restore();
  psBunnyLine(ctx, traceKnot, 2.9, BUNNY_PALETTE.ribbonOutline);

  psBunnyLine(
    ctx,
    (c) => {
      c.moveTo(718, 446);
      c.quadraticCurveTo(726, 462, 722, 478);
    },
    1.7,
    BUNNY_PALETTE.ribbonOutline,
    0.72
  );
}

// =====================================================================
// 7. STANDALONE CODE EXPORT GENERATOR
// =====================================================================
export function getStandaloneBunnySource(): string {
  return `// =====================================================================
// VICTORIAN MAID BONNET BUNNY — STANDALONE <canvas> 2D MODULE
// Calibrated 1000x1000 Coordinate Grid + 12-Layer Hierarchical Rigging
// =====================================================================
export const BUNNY_PALETTE = ${JSON.stringify(BUNNY_PALETTE, null, 2)};
`;
}
