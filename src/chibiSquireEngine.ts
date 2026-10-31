// ============================================================================
// CHIBI SQUIRE BOY WITH PRACTICE SWORD — MULTI-VIEW & ACTION RIGGING ENGINE
// Calibrated 1000x1000 Coordinate System + Front / 3/4 / Side / Back Views
// + Full Expression System & Sword Slash / Walk / Sit / Wave / Jump / Idle
// Enforces:
// - Semantic Layer Separation (image-to-svg & svg-portrait-mode)
// - Verified Bone Skeleton & Joint Constraints (rigc-rigging)
// - Morph State Blinks & Secondary Motion (svg-character-animator)
// - Zero floating shadow, tightly hugged boot contact
// ============================================================================

export type SquireViewAngle = 'front' | 'three_quarter' | 'side_right' | 'side_left' | 'back';

export type SquireAction =
  | 'idle'
  | 'walk'
  | 'slash'
  | 'sit'
  | 'wave'
  | 'jump'
  | 'look_around'
  | 'breeze'
  | 'static';

export type SquireExpression =
  | 'wonder'     // Default from reference artwork: wide curious eyes, slight upward tilt
  | 'determined' // Focused training stance, angled brows
  | 'happy'      // Arched brows, cheerful warm smile
  | 'surprised'  // High brows, wide pupils, round mouth
  | 'sleepy'     // Half-closed lids, calm peaceful look
  | 'proud';     // Happy closed-eye ^ ^ smirk

export interface ChibiSquireRigState {
  viewAngle: SquireViewAngle;
  action: SquireAction;
  expression: SquireExpression;
  time: number;
  renderHair: boolean;
  transparentBg: boolean;

  // Joint / Keyframe Offsets
  headTilt: number;       // radians (-0.35..0.35)
  headTurnX: number;      // px (-25..25)
  headNodY: number;       // px (-20..20)
  hairSway: number;       // radians (-0.35..0.35)
  blink: number;          // 0..1 (0=open, 0.5=half, 1=closed)
  gazeX: number;          // px (-8..8)
  gazeY: number;          // px (-6..6)
  armRightRot: number;    // radians (-2.0..2.0) — Bare arm
  armLeftRot: number;     // radians (-2.0..2.0) — Gauntlet arm
  swordTilt: number;      // radians (-0.6..0.6) — Training sword angle
  swordDraw: number;      // px (-10..30) — Drawing sword out of scabbard
  legLeftRot: number;     // radians (-0.6..0.6)
  legRightRot: number;    // radians (-0.6..0.6)
  legLeftLiftY: number;   // px (-25..15)
  legRightLiftY: number;  // px (-25..15)
  torsoBobY: number;      // px (-45..45)
  torsoSwayRot: number;   // radians (-0.25..0.25)
}

export type SquireJointKey =
  | 'headTilt'
  | 'headTurnX'
  | 'headNodY'
  | 'hairSway'
  | 'blink'
  | 'gazeX'
  | 'gazeY'
  | 'armRightRot'
  | 'armLeftRot'
  | 'swordTilt'
  | 'swordDraw'
  | 'legLeftRot'
  | 'legRightRot'
  | 'legLeftLiftY'
  | 'legRightLiftY'
  | 'torsoBobY'
  | 'torsoSwayRot';

export const SQUIRE_JOINT_SLIDER_META: {
  key: SquireJointKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'headTilt', label: 'Head Tilt', min: -0.35, max: 0.35, step: 0.01, unit: 'rad' },
  { key: 'headTurnX', label: 'Head Turn (X)', min: -25, max: 25, step: 0.5, unit: 'px' },
  { key: 'headNodY', label: 'Head Nod (Y)', min: -20, max: 20, step: 0.5, unit: 'px' },
  { key: 'hairSway', label: 'Ash Hair Locks Sway', min: -0.35, max: 0.35, step: 0.01, unit: 'rad' },
  { key: 'blink', label: 'Eyelid Blink (0..1)', min: 0, max: 1, step: 0.02, unit: '' },
  { key: 'gazeX', label: 'Eye Gaze Horizontal', min: -8, max: 8, step: 0.5, unit: 'px' },
  { key: 'gazeY', label: 'Eye Gaze Vertical', min: -6, max: 6, step: 0.5, unit: 'px' },
  { key: 'armRightRot', label: 'Right Bare Arm Swing', min: -2.0, max: 2.0, step: 0.02, unit: 'rad' },
  { key: 'armLeftRot', label: 'Left Gauntlet Arm / Slash', min: -2.5, max: 2.0, step: 0.02, unit: 'rad' },
  { key: 'swordTilt', label: 'Practice Sword Tilt', min: -0.6, max: 0.6, step: 0.01, unit: 'rad' },
  { key: 'swordDraw', label: 'Draw Sword from Scabbard', min: -10, max: 30, step: 0.5, unit: 'px' },
  { key: 'legLeftRot', label: 'Left Leg Stride', min: -0.6, max: 0.6, step: 0.01, unit: 'rad' },
  { key: 'legRightRot', label: 'Right Leg Stride', min: -0.6, max: 0.6, step: 0.01, unit: 'rad' },
  { key: 'legLeftLiftY', label: 'Left Boot Lift (Y)', min: -30, max: 15, step: 0.5, unit: 'px' },
  { key: 'legRightLiftY', label: 'Right Boot Lift (Y)', min: -30, max: 15, step: 0.5, unit: 'px' },
  { key: 'torsoBobY', label: 'Torso Bounce (Y)', min: -45, max: 45, step: 0.5, unit: 'px' },
  { key: 'torsoSwayRot', label: 'Torso Sway Tilt', min: -0.25, max: 0.25, step: 0.01, unit: 'rad' },
];

export const DEFAULT_CHIBI_SQUIRE_RIG: ChibiSquireRigState = {
  viewAngle: 'three_quarter',
  action: 'idle',
  expression: 'wonder',
  time: 0,
  renderHair: true,
  transparentBg: false,

  headTilt: 0,
  headTurnX: 0,
  headNodY: 0,
  hairSway: 0,
  blink: 0,
  gazeX: 0,
  gazeY: 0,
  armRightRot: 0,
  armLeftRot: 0,
  swordTilt: 0,
  swordDraw: 0,
  legLeftRot: 0,
  legRightRot: 0,
  legLeftLiftY: 0,
  legRightLiftY: 0,
  torsoBobY: 0,
  torsoSwayRot: 0,
};

export function extractSquireJoints(rig: ChibiSquireRigState): Record<SquireJointKey, number> {
  return {
    headTilt: rig.headTilt,
    headTurnX: rig.headTurnX,
    headNodY: rig.headNodY,
    hairSway: rig.hairSway,
    blink: rig.blink,
    gazeX: rig.gazeX,
    gazeY: rig.gazeY,
    armRightRot: rig.armRightRot,
    armLeftRot: rig.armLeftRot,
    swordTilt: rig.swordTilt,
    swordDraw: rig.swordDraw,
    legLeftRot: rig.legLeftRot,
    legRightRot: rig.legRightRot,
    legLeftLiftY: rig.legLeftLiftY,
    legRightLiftY: rig.legRightLiftY,
    torsoBobY: rig.torsoBobY,
    torsoSwayRot: rig.torsoSwayRot,
  };
}

export interface SquireKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<SquireJointKey, number>;
}

export const DEFAULT_SQUIRE_KEYFRAMES: SquireKeyframe[] = [
  {
    id: 'start',
    label: 'Start Frame (0%)',
    progress: 0,
    joints: {
      ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
      headTilt: -0.04,
      headTurnX: -4,
      headNodY: 2,
      hairSway: -0.04,
      armRightRot: 0.12,
      armLeftRot: -0.15,
      swordTilt: -0.06,
      swordDraw: 0,
      torsoBobY: -3,
      torsoSwayRot: -0.02,
    },
  },
  {
    id: 'end',
    label: 'Target Keyframe (100%)',
    progress: 1,
    joints: {
      ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
      headTilt: 0.04,
      headTurnX: 4,
      headNodY: -2,
      hairSway: 0.04,
      armRightRot: -0.12,
      armLeftRot: 0.15,
      swordTilt: 0.06,
      swordDraw: 0,
      torsoBobY: 3,
      torsoSwayRot: 0.02,
    },
  },
];

export type SquirePresetId =
  | 'idle_breath'
  | 'practice_slash'
  | 'squire_stride'
  | 'cheerful_wave'
  | 'scout_scan'
  | 'combat_stance';

export const SQUIRE_PALETTE = {
  bgPaper: '#F6F1E3',
  ink: '#3B2A20',
  inkSoft: '#5A463B',
  inkLight: '#857165',
  hairAsh: '#A79D93',
  hairShadow: '#8C8278',
  hairHighlight: '#C0B7AE',
  hairPencil: '#685E55',
  skinPeach: '#FCEBDD',
  skinShade: '#F0D5C3',
  blushOrange: '#F6AC7A',
  eyeDark: '#2B1B15',
  tunicBlue: '#7E98A8',
  tunicShadow: '#678090',
  tunicHighlight: '#92ABC0',
  tunicLace: '#3B2A20',
  beltLeather: '#744733',
  beltShadow: '#563223',
  buckleBronze: '#4A3024',
  buckleMetal: '#9E7459',
  gauntletLeather: '#6F4330',
  gauntletShadow: '#533122',
  swordPommel: '#EDEAE3',
  swordGuard: '#D8D4CC',
  swordWood: '#E3DAC9',
  swordScabbard: '#EDE6DA',
  shortsCharcoal: '#35332F',
  shortsShadow: '#262422',
  bootsLeather: '#633E2F',
  bootsShadow: '#472B20',
};

// ============================================================================
// HELPER FUNCTIONS (CRAYON SHAPES & STROKES)
// ============================================================================
function hashStr(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withPivot(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  rotRad: number,
  dx = 0,
  dy = 0,
  renderFn: () => void
): void {
  ctx.save();
  ctx.translate(px + dx, py + dy);
  if (rotRad !== 0) {
    ctx.rotate(rotRad);
  }
  ctx.translate(-px, -py);
  renderFn();
  ctx.restore();
}

function drawCrayonShape(
  ctx: CanvasRenderingContext2D,
  seedKey: string,
  pathFn: (c: CanvasRenderingContext2D) => void,
  fillColor: string,
  strokeWidth = 5.2,
  strokeColor = SQUIRE_PALETTE.ink,
  clipBounds?: [number, number, number, number]
): void {
  ctx.save();
  ctx.beginPath();
  pathFn(ctx);
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Subtle watercolor/pencil paper tooth texture inside shape
  if (clipBounds) {
    ctx.save();
    ctx.clip();
    const rng = mulberry32(hashStr(seedKey));
    const [x0, y0, x1, y1] = clipBounds;
    const w = x1 - x0;
    const h = y1 - y0;
    const count = Math.min(220, Math.floor((w * h) / 360));
    for (let i = 0; i < count; i++) {
      const sx = x0 + rng() * w;
      const sy = y0 + rng() * h;
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#2A1C16';
      ctx.globalAlpha = 0.055;
      ctx.fillRect(sx, sy, 1.8, 1.8);
    }
    ctx.restore();
  }

  if (strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  ctx.restore();
}

function drawCrayonStroke(
  ctx: CanvasRenderingContext2D,
  _seedKey: string,
  pathFn: (c: CanvasRenderingContext2D) => void,
  strokeWidth = 5.0,
  strokeColor = SQUIRE_PALETTE.ink
): void {
  ctx.save();
  ctx.beginPath();
  pathFn(ctx);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

// ============================================================================
// MOTION SOLVER — PROCEDURAL ANIMATION ENGINE FOR CHIBI SQUIRE
// ============================================================================
export function computeChibiSquireRigAtTime(
  t: number,
  action: SquireAction,
  baseRig: ChibiSquireRigState = DEFAULT_CHIBI_SQUIRE_RIG
): ChibiSquireRigState {
  const b = baseRig;
  const rig: ChibiSquireRigState = {
    ...b,
    time: t,
  };

  // Periodic natural blink
  if (b.blink > 0.05) {
    rig.blink = b.blink;
  } else if (rig.expression !== 'sleepy' && rig.expression !== 'proud' && action !== 'static') {
    const cyc = t % 4.5;
    if (cyc > 4.15 && cyc < 4.45) {
      rig.blink = Math.sin(((cyc - 4.15) / 0.3) * Math.PI);
    }
  } else if (rig.expression === 'sleepy') {
    rig.blink = 0.65 + Math.sin(t * 1.5) * 0.1;
  } else if (rig.expression === 'proud') {
    rig.blink = 1.0;
  }

  if (action === 'static') {
    return rig;
  }

  if (action === 'idle') {
    // Gentle curious breathing, slight head tilt and hair follow-through
    rig.torsoBobY = b.torsoBobY + Math.sin(t * 2.2) * 3.0;
    rig.torsoSwayRot = b.torsoSwayRot + Math.sin(t * 1.1) * 0.015;
    rig.headTilt = b.headTilt + Math.sin(t * 1.1 - 0.4) * 0.025;
    rig.headNodY = b.headNodY + Math.sin(t * 2.2 - 0.3) * 2.0;
    rig.hairSway = b.hairSway + Math.sin(t * 2.0 - 0.4) * 0.025;
    rig.armRightRot = b.armRightRot + Math.sin(t * 2.2 - 0.3) * 0.03;
    rig.armLeftRot = b.armLeftRot - Math.sin(t * 2.2 - 0.3) * 0.03;
    rig.swordTilt = b.swordTilt + Math.sin(t * 2.2 - 0.5) * 0.02;
  } else if (action === 'walk') {
    const w = t * 5.4;
    const stride = Math.sin(w);
    const bounce = Math.abs(Math.cos(w));
    rig.torsoBobY = b.torsoBobY - bounce * 11 + 3;
    rig.torsoSwayRot = b.torsoSwayRot + stride * 0.035;
    rig.headNodY = b.headNodY - bounce * 4.0;
    rig.headTilt = b.headTilt + stride * 0.03;
    rig.hairSway = b.hairSway + Math.sin(w * 2 - 0.4) * 0.045;
    rig.armRightRot = b.armRightRot - stride * 0.28;
    rig.armLeftRot = b.armLeftRot + stride * 0.22;
    rig.legLeftRot = b.legLeftRot + stride * 0.26;
    rig.legRightRot = b.legRightRot - stride * 0.26;
    rig.legLeftLiftY = b.legLeftLiftY + Math.max(0, stride) * -18;
    rig.legRightLiftY = b.legRightLiftY + Math.max(0, -stride) * -18;
    rig.swordTilt = b.swordTilt + Math.sin(w) * 0.08;
  } else if (action === 'slash') {
    // Practice Sword Slash Sequence!
    const cycle = (t * 2.4) % (Math.PI * 2);
    const windup = Math.sin(cycle);
    if (cycle < Math.PI) {
      // Windup: raises left gauntlet arm and draws sword
      rig.armLeftRot = b.armLeftRot - 0.9 * Math.sin(cycle);
      rig.swordDraw = 18 * Math.sin(cycle);
      rig.swordTilt = -0.35 * Math.sin(cycle);
      rig.torsoSwayRot = 0.04 * Math.sin(cycle);
      rig.headTilt = -0.05 * Math.sin(cycle);
    } else {
      // Powerful clean slash forward!
      const slashArc = Math.sin(cycle - Math.PI);
      rig.armLeftRot = b.armLeftRot + 1.2 * slashArc;
      rig.swordDraw = 25 * slashArc;
      rig.swordTilt = 0.45 * slashArc;
      rig.torsoBobY = 6 * slashArc;
      rig.torsoSwayRot = -0.06 * slashArc;
      rig.armRightRot = b.armRightRot - 0.4 * slashArc;
    }
    rig.hairSway = Math.sin(cycle * 2) * 0.06;
  } else if (action === 'sit') {
    // Sitting with legs resting forward and sword resting by his side
    rig.torsoBobY = b.torsoBobY + 44 + Math.sin(t * 2.0) * 2.0;
    rig.headTilt = b.headTilt + Math.sin(t * 1.2) * 0.03;
    rig.headNodY = b.headNodY + Math.sin(t * 2.0 - 0.3) * 1.8;
    rig.armRightRot = b.armRightRot + 0.15;
    rig.armLeftRot = b.armLeftRot - 0.15;
    rig.swordTilt = b.swordTilt + 0.18;
  } else if (action === 'wave') {
    rig.torsoBobY = b.torsoBobY + Math.sin(t * 2.4) * 3.0;
    rig.torsoSwayRot = b.torsoSwayRot - 0.02 + Math.sin(t * 2.4) * 0.02;
    rig.headTilt = b.headTilt - 0.05 + Math.sin(t * 2.4) * 0.03;
    // Right bare arm waving cheerful hello
    rig.armRightRot = b.armRightRot - 2.1 + Math.sin(t * 7.5) * 0.28;
    rig.hairSway = b.hairSway + Math.sin(t * 3.5) * 0.06;
  } else if (action === 'jump') {
    const jPhase = (t * 2.4) % (Math.PI * 2);
    const jumpArc = Math.max(0, Math.sin(jPhase));
    rig.torsoBobY = b.torsoBobY - jumpArc * 46 + (jumpArc === 0 ? Math.sin(jPhase * 2) * 3 : 0);
    rig.armRightRot = b.armRightRot + jumpArc * 0.45;
    rig.armLeftRot = b.armLeftRot - jumpArc * 0.45;
    rig.legLeftLiftY = b.legLeftLiftY - jumpArc * 14;
    rig.legRightLiftY = b.legRightLiftY - jumpArc * 14;
    rig.swordTilt = b.swordTilt - jumpArc * 0.15;
    rig.hairSway = b.hairSway - jumpArc * 0.1;
  } else if (action === 'look_around') {
    const scan = Math.sin(t * 1.4);
    rig.headTurnX = b.headTurnX + scan * 18;
    rig.gazeX = b.gazeX + scan * 6.5;
    rig.headTilt = b.headTilt + scan * 0.05;
    rig.torsoSwayRot = b.torsoSwayRot + scan * 0.02;
    rig.torsoBobY = b.torsoBobY + Math.sin(t * 2.8) * 2.0;
  } else if (action === 'breeze') {
    rig.torsoBobY = b.torsoBobY + Math.sin(t * 2.0) * 2.8;
    rig.hairSway = b.hairSway + 0.06 + Math.sin(t * 3.8) * 0.08;
    rig.headTilt = b.headTilt + Math.sin(t * 1.3 - 0.3) * 0.03;
    rig.armRightRot = b.armRightRot + 0.04 + Math.sin(t * 2.5) * 0.04;
    rig.armLeftRot = b.armLeftRot - 0.03 + Math.sin(t * 2.5) * 0.04;
    rig.swordTilt = b.swordTilt + Math.sin(t * 2.5) * 0.04;
  }

  return rig;
}

// ============================================================================
// FACIAL FEATURES (EYES, BROWS, NOSE, CHEEKS, MOUTH)
// ============================================================================
function drawSquireFaceFeatures(
  ctx: CanvasRenderingContext2D,
  centerOffsetX: number,
  rig: ChibiSquireRigState
) {
  const expr = rig.expression;
  const gx = rig.gazeX + centerOffsetX;
  const gy = rig.gazeY;
  const blink = Math.max(0, Math.min(1, rig.blink));

  // The boy faces slightly 3/4 left in the reference image
  const leftEyeX = 432 + gx * 0.85;
  const leftEyeY = 328 + gy;
  const rightEyeX = 528 + gx * 0.85;
  const rightEyeY = 328 + gy;

  // 1. Warm Soft Orange-Peach Blush (#F6AC7A)
  ctx.save();
  ctx.fillStyle = SQUIRE_PALETTE.blushOrange;
  ctx.globalAlpha = expr === 'happy' || expr === 'proud' ? 0.88 : 0.78;
  ctx.beginPath();
  ctx.ellipse(420 + centerOffsetX * 0.7, 348 + gy * 0.35, 20, 13, 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(542 + centerOffsetX * 0.7, 356 + gy * 0.35, 22, 14, -0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Tiny Dot Nose (#3B2A20)
  ctx.save();
  ctx.fillStyle = SQUIRE_PALETTE.ink;
  ctx.beginPath();
  ctx.arc(468 + centerOffsetX * 0.95 + rig.gazeX * 0.35, 335 + gy * 0.45, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Large Expressive Dark Brown Bean Eyes
  const drawSingleEye = (ex: number, ey: number, isLeft: boolean) => {
    if (expr === 'proud' || blink > 0.85) {
      drawCrayonStroke(
        ctx,
        `sq_eye_closed_${isLeft ? 'L' : 'R'}`,
        (c) => {
          if (expr === 'proud' || expr === 'happy') {
            c.moveTo(ex - 12, ey + 2);
            c.quadraticCurveTo(ex, ey - 10, ex + 12, ey + 2);
          } else {
            c.moveTo(ex - 12, ey + 2);
            c.quadraticCurveTo(ex, ey + 6, ex + 12, ey + 2);
          }
        },
        5.4,
        SQUIRE_PALETTE.eyeDark
      );
      return;
    }

    const ry = (expr === 'surprised' || expr === 'wonder' ? 18.0 : 15.5) * (1 - blink * 0.8);
    const rx = expr === 'surprised' ? 14.0 : 12.5;

    ctx.save();
    ctx.fillStyle = SQUIRE_PALETTE.eyeDark;
    ctx.beginPath();
    ctx.ellipse(ex, ey, rx, Math.max(2.5, ry), isLeft ? -0.04 : 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Top Specular Catchlight Sparkle (Reference Art style)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ex - 3.4, ey - 4.5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 3.8, ey + 3.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawSingleEye(leftEyeX, leftEyeY, true);
  drawSingleEye(rightEyeX, rightEyeY, false);

  // 4. Gentle Chibi Eyebrows
  const lbX = leftEyeX;
  const lbY = leftEyeY - 26;
  const rbX = rightEyeX;
  const rbY = rightEyeY - 26;

  if (expr === 'wonder' || expr === 'determined') {
    // Reference artwork: gentle soft arched brows with slight wonder tilt
    drawCrayonStroke(
      ctx,
      'sq_brow_L',
      (c) => {
        c.moveTo(lbX - 12, lbY - (expr === 'determined' ? 2 : 4));
        c.quadraticCurveTo(lbX, lbY - 8, lbX + 13, lbY + (expr === 'determined' ? 4 : 1));
      },
      4.8,
      SQUIRE_PALETTE.inkSoft
    );
    drawCrayonStroke(
      ctx,
      'sq_brow_R',
      (c) => {
        c.moveTo(rbX - 13, rbY + (expr === 'determined' ? 4 : 1));
        c.quadraticCurveTo(rbX, rbY - 8, rbX + 13, rbY - (expr === 'determined' ? 2 : 4));
      },
      4.8,
      SQUIRE_PALETTE.inkSoft
    );
  } else if (expr === 'happy' || expr === 'proud') {
    drawCrayonStroke(
      ctx,
      'sq_brow_L_hap',
      (c) => {
        c.moveTo(lbX - 13, lbY + 2);
        c.quadraticCurveTo(lbX, lbY - 8, lbX + 13, lbY);
      },
      4.6,
      SQUIRE_PALETTE.inkSoft
    );
    drawCrayonStroke(
      ctx,
      'sq_brow_R_hap',
      (c) => {
        c.moveTo(rbX - 13, rbY);
        c.quadraticCurveTo(rbX, rbY - 8, rbX + 13, rbY + 2);
      },
      4.6,
      SQUIRE_PALETTE.inkSoft
    );
  } else if (expr === 'surprised') {
    drawCrayonStroke(
      ctx,
      'sq_brow_L_sur',
      (c) => {
        c.moveTo(lbX - 13, lbY - 8);
        c.quadraticCurveTo(lbX, lbY - 16, lbX + 13, lbY - 8);
      },
      4.8,
      SQUIRE_PALETTE.inkSoft
    );
    drawCrayonStroke(
      ctx,
      'sq_brow_R_sur',
      (c) => {
        c.moveTo(rbX - 13, rbY - 8);
        c.quadraticCurveTo(rbX, rbY - 16, rbX + 13, rbY - 8);
      },
      4.8,
      SQUIRE_PALETTE.inkSoft
    );
  } else if (expr === 'sleepy') {
    drawCrayonStroke(
      ctx,
      'sq_brow_L_slp',
      (c) => {
        c.moveTo(lbX - 12, lbY + 4);
        c.lineTo(lbX + 12, lbY - 2);
      },
      4.6,
      SQUIRE_PALETTE.inkSoft
    );
    drawCrayonStroke(
      ctx,
      'sq_brow_R_slp',
      (c) => {
        c.moveTo(rbX - 12, rbY - 2);
        c.lineTo(rbX + 12, rbY + 4);
      },
      4.6,
      SQUIRE_PALETTE.inkSoft
    );
  }

  // 5. Mouth
  const mx = 472 + centerOffsetX * 0.9 + rig.gazeX * 0.25;
  const my = 370 + gy * 0.35;

  if (expr === 'wonder' || expr === 'determined') {
    // Signature tiny cute curious mouth from reference image
    drawCrayonStroke(
      ctx,
      'sq_mouth_won',
      (c) => {
        c.moveTo(mx - 8, my);
        c.quadraticCurveTo(mx, my - 2, mx + 8, my);
      },
      4.8,
      SQUIRE_PALETTE.ink
    );
  } else if (expr === 'happy' || expr === 'proud') {
    drawCrayonStroke(
      ctx,
      'sq_mouth_hap',
      (c) => {
        c.moveTo(mx - 14, my - 2);
        c.quadraticCurveTo(mx, my + 11, mx + 14, my - 2);
      },
      5.2,
      SQUIRE_PALETTE.ink
    );
  } else if (expr === 'surprised') {
    drawCrayonShape(
      ctx,
      'sq_mouth_sur',
      (c) => {
        c.ellipse(mx, my + 2, 6.5, 8.5, 0, 0, Math.PI * 2);
      },
      '#995147',
      4.8,
      SQUIRE_PALETTE.ink
    );
  } else if (expr === 'sleepy') {
    drawCrayonStroke(
      ctx,
      'sq_mouth_slp',
      (c) => {
        c.moveTo(mx - 7, my);
        c.lineTo(mx + 7, my);
      },
      4.6,
      SQUIRE_PALETTE.ink
    );
  }
}

// ============================================================================
// 1. FRONT & 3/4 VIEW RENDERER (Exact Match to Reference Artwork)
// ============================================================================
function drawSquireFrontOrThreeQuarter(
  ctx: CanvasRenderingContext2D,
  rig: ChibiSquireRigState,
  isThreeQuarter: boolean
) {
  const turnX = (isThreeQuarter ? 20 : 0) + rig.headTurnX;
  const isSitting = rig.action === 'sit';

  // Body root pivot at waist/hips (500, 700)
  withPivot(ctx, 500, 700, rig.torsoSwayRot, 0, rig.torsoBobY, () => {
    // ------------------------------------------------------------------------
    // LAYER 1: TRAINING SWORD & SCABBARD (Behind Legs/Tunic)
    // ------------------------------------------------------------------------
    withPivot(ctx, 560, 610, rig.swordTilt, 0, 0, () => {
      // Slender Scabbard Hanging Down behind left leg
      drawCrayonShape(
        ctx,
        'sq_scabbard',
        (c) => {
          c.moveTo(546, 595);
          c.lineTo(638, 762);
          c.quadraticCurveTo(644, 772, 638, 778);
          c.quadraticCurveTo(630, 782, 624, 775);
          c.lineTo(534, 608);
          c.closePath();
        },
        SQUIRE_PALETTE.swordScabbard,
        4.6,
        SQUIRE_PALETTE.ink,
        [530, 590, 646, 785]
      );

      // Scabbard Metal Collar
      drawCrayonShape(
        ctx,
        'sq_scabbard_collar',
        (c) => {
          c.moveTo(538, 604);
          c.lineTo(558, 602);
          c.lineTo(564, 616);
          c.lineTo(544, 618);
          c.closePath();
        },
        SQUIRE_PALETTE.swordGuard,
        4.4,
        SQUIRE_PALETTE.ink
      );

      // Wooden Sword Blade & Pommel (Slides out on slash action!)
      withPivot(ctx, 546, 595, 0, -rig.swordDraw * 0.4, -rig.swordDraw * 0.8, () => {
        // Crossguard
        drawCrayonShape(
          ctx,
          'sq_sword_guard',
          (c) => {
            c.moveTo(524, 612);
            c.lineTo(568, 592);
            c.lineTo(574, 602);
            c.lineTo(530, 622);
            c.closePath();
          },
          SQUIRE_PALETTE.swordPommel,
          4.6,
          SQUIRE_PALETTE.ink
        );

        // Grip Handle
        drawCrayonStroke(
          ctx,
          'sq_sword_grip',
          (c) => {
            c.moveTo(546, 602);
            c.lineTo(534, 552);
          },
          5.6,
          SQUIRE_PALETTE.swordPommel
        );

        // Round Pommel Ball
        drawCrayonShape(
          ctx,
          'sq_sword_pommel',
          (c) => {
            c.arc(532, 546, 7.5, 0, Math.PI * 2);
          },
          SQUIRE_PALETTE.swordPommel,
          4.8,
          SQUIRE_PALETTE.ink
        );
      });
    });

    // ------------------------------------------------------------------------
    // LAYER 2: SHORTS, LEGS & LEATHER ANKLE BOOTS
    // ------------------------------------------------------------------------
    if (isSitting) {
      // Sitting Shorts
      drawCrayonShape(
        ctx,
        'sq_shorts_sit',
        (c) => {
          c.moveTo(418, 670);
          c.lineTo(412, 735);
          c.quadraticCurveTo(462, 746, 502, 735);
          c.quadraticCurveTo(542, 746, 590, 735);
          c.lineTo(584, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink,
        [410, 670, 592, 748]
      );

      // Left Sitting Boot
      withPivot(ctx, 452, 740, rig.legLeftRot, 0, 0, () => {
        drawCrayonShape(
          ctx,
          'sq_leg_L_sit',
          (c) => {
            c.moveTo(436, 732);
            c.lineTo(430, 770);
            c.lineTo(476, 770);
            c.lineTo(480, 732);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          4.8,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_boot_L_sit',
          (c) => {
            c.ellipse(450, 785, 26, 20, -0.1, 0, Math.PI * 2);
          },
          SQUIRE_PALETTE.bootsLeather,
          5.2,
          SQUIRE_PALETTE.ink
        );
      });

      // Right Sitting Boot
      withPivot(ctx, 550, 740, rig.legRightRot, 0, 0, () => {
        drawCrayonShape(
          ctx,
          'sq_leg_R_sit',
          (c) => {
            c.moveTo(530, 732);
            c.lineTo(534, 770);
            c.lineTo(578, 770);
            c.lineTo(572, 732);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          4.8,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_boot_R_sit',
          (c) => {
            c.ellipse(562, 785, 26, 20, 0.1, 0, Math.PI * 2);
          },
          SQUIRE_PALETTE.bootsLeather,
          5.2,
          SQUIRE_PALETTE.ink
        );
      });
    } else {
      // Standing / Walking Legs & Cuffed Leather Boots
      // Left Leg (viewer's left: x ~ 455)
      withPivot(ctx, 455, 730, rig.legLeftRot, 0, rig.legLeftLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_leg_L',
          (c) => {
            c.moveTo(438, 735);
            c.lineTo(444, 795);
            c.lineTo(486, 795);
            c.lineTo(484, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          5.0,
          SQUIRE_PALETTE.ink
        );

        // Left Boot (facing slightly left)
        drawCrayonShape(
          ctx,
          'sq_boot_L',
          (c) => {
            c.moveTo(436, 792);
            c.lineTo(430, 835);
            c.quadraticCurveTo(458, 846, 490, 836);
            c.lineTo(488, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsLeather,
          5.4,
          SQUIRE_PALETTE.ink,
          [428, 790, 492, 848]
        );
        // Boot top fold collar
        drawCrayonStroke(
          ctx,
          'sq_boot_L_fold',
          (c) => {
            c.moveTo(434, 804);
            c.quadraticCurveTo(462, 808, 490, 804);
          },
          4.6,
          SQUIRE_PALETTE.ink
        );
      });

      // Right Leg (viewer's right: x ~ 550)
      withPivot(ctx, 550, 730, rig.legRightRot, 0, rig.legRightLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_leg_R',
          (c) => {
            c.moveTo(530, 735);
            c.lineTo(532, 795);
            c.lineTo(574, 795);
            c.lineTo(570, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          5.0,
          SQUIRE_PALETTE.ink
        );

        // Right Boot
        drawCrayonShape(
          ctx,
          'sq_boot_R',
          (c) => {
            c.moveTo(526, 792);
            c.lineTo(524, 835);
            c.quadraticCurveTo(554, 846, 580, 835);
            c.lineTo(576, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsLeather,
          5.4,
          SQUIRE_PALETTE.ink,
          [522, 790, 582, 848]
        );
        drawCrayonStroke(
          ctx,
          'sq_boot_R_fold',
          (c) => {
            c.moveTo(524, 804);
            c.quadraticCurveTo(552, 808, 578, 804);
          },
          4.6,
          SQUIRE_PALETTE.ink
        );
      });

      // Charcoal Shorts (#35332F)
      drawCrayonShape(
        ctx,
        'sq_shorts',
        (c) => {
          c.moveTo(420, 670);
          c.lineTo(418, 736);
          c.quadraticCurveTo(460, 746, 496, 740);
          c.lineTo(502, 712);
          c.lineTo(512, 740);
          c.quadraticCurveTo(552, 746, 586, 736);
          c.lineTo(584, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink,
        [415, 668, 588, 748]
      );
    }

    // ------------------------------------------------------------------------
    // LAYER 3: RIGHT BARE ARM & HAND (Viewer's left: x ~ 370..425)
    // ------------------------------------------------------------------------
    withPivot(ctx, 428, 470, rig.armRightRot, 0, 0, () => {
      // Right Bare Chibi Hand (relaxed, fingers defined)
      drawCrayonShape(
        ctx,
        'sq_hand_R',
        (c) => {
          c.moveTo(374, 576);
          c.bezierCurveTo(364, 608, 362, 652, 372, 678);
          c.quadraticCurveTo(386, 686, 398, 680);
          c.bezierCurveTo(412, 656, 416, 612, 412, 576);
          c.closePath();
        },
        SQUIRE_PALETTE.skinPeach,
        5.0,
        SQUIRE_PALETTE.ink
      );

      // Little finger notch crease
      drawCrayonStroke(
        ctx,
        'sq_finger_R',
        (c) => {
          c.moveTo(378, 642);
          c.lineTo(386, 672);
          c.moveTo(394, 648);
          c.lineTo(398, 674);
        },
        4.2,
        SQUIRE_PALETTE.inkSoft
      );

      // Bare Forearm
      drawCrayonShape(
        ctx,
        'sq_forearm_R',
        (c) => {
          c.moveTo(386, 545);
          c.lineTo(380, 586);
          c.lineTo(418, 586);
          c.lineTo(418, 545);
          c.closePath();
        },
        SQUIRE_PALETTE.skinPeach,
        4.8,
        SQUIRE_PALETTE.ink
      );

      // Rolled-up Blue Sleeve Cuff on Right Arm
      drawCrayonShape(
        ctx,
        'sq_sleeve_cuff_R',
        (c) => {
          c.moveTo(384, 540);
          c.quadraticCurveTo(402, 548, 424, 542);
          c.lineTo(426, 560);
          c.quadraticCurveTo(404, 566, 384, 558);
          c.closePath();
        },
        SQUIRE_PALETTE.tunicShadow,
        4.8,
        SQUIRE_PALETTE.ink
      );

      // Upper Blue Sleeve
      drawCrayonShape(
        ctx,
        'sq_sleeve_upper_R',
        (c) => {
          c.moveTo(428, 460);
          c.bezierCurveTo(395, 482, 380, 510, 384, 542);
          c.lineTo(426, 542);
          c.bezierCurveTo(434, 510, 436, 485, 438, 460);
          c.closePath();
        },
        SQUIRE_PALETTE.tunicBlue,
        5.2,
        SQUIRE_PALETTE.ink,
        [378, 458, 440, 545]
      );
    });

    // ------------------------------------------------------------------------
    // LAYER 4: SLATE-BLUE TUNIC BODY & LEATHER BELT WITH BUCKLE
    // ------------------------------------------------------------------------
    // Main Blue Tunic Body (#7E98A8)
    drawCrayonShape(
      ctx,
      'sq_tunic_main',
      (c) => {
        // Neckline
        c.moveTo(456, 438);
        c.lineTo(430, 465);
        // Left side down to hem
        c.bezierCurveTo(414, 524, 408, 610, 408, 680);
        // Hem curve across hips
        c.quadraticCurveTo(498, 695, 588, 678);
        // Right side up
        c.bezierCurveTo(595, 612, 606, 524, 582, 465);
        c.lineTo(544, 438);
        // V-collar cutout
        c.lineTo(518, 462);
        c.lineTo(495, 492);
        c.lineTo(484, 462);
        c.closePath();
      },
      SQUIRE_PALETTE.tunicBlue,
      5.4,
      SQUIRE_PALETTE.ink,
      [406, 436, 608, 696]
    );

    // Collar V-Neck Stitching / Lacing detail
    drawCrayonStroke(
      ctx,
      'sq_collar_lace',
      (c) => {
        c.moveTo(482, 465);
        c.lineTo(512, 478);
        c.moveTo(482, 478);
        c.lineTo(512, 465);
        c.moveTo(495, 478);
        c.lineTo(495, 492);
      },
      4.6,
      SQUIRE_PALETTE.tunicLace
    );

    // Subtle Tunic Creases
    drawCrayonStroke(
      ctx,
      'sq_tunic_crease',
      (c) => {
        c.moveTo(434, 595);
        c.quadraticCurveTo(464, 612, 494, 605);
        c.moveTo(540, 592);
        c.quadraticCurveTo(564, 602, 586, 595);
      },
      4.2,
      SQUIRE_PALETTE.inkSoft
    );

    // Rich Brown Leather Belt around waist (#744733)
    drawCrayonShape(
      ctx,
      'sq_belt',
      (c) => {
        c.moveTo(428, 574);
        c.quadraticCurveTo(500, 586, 576, 575);
        c.lineTo(574, 614);
        c.quadraticCurveTo(498, 626, 426, 612);
        c.closePath();
      },
      SQUIRE_PALETTE.beltLeather,
      5.2,
      SQUIRE_PALETTE.ink,
      [424, 572, 578, 628]
    );

    // Oval Bronze/Pewter Buckle (#4A3024)
    drawCrayonShape(
      ctx,
      'sq_buckle',
      (c) => {
        c.ellipse(484, 595, 22, 17, 0.05, 0, Math.PI * 2);
      },
      SQUIRE_PALETTE.buckleBronze,
      5.0,
      SQUIRE_PALETTE.ink
    );
    drawCrayonShape(
      ctx,
      'sq_buckle_hole',
      (c) => {
        c.ellipse(484, 595, 12, 9, 0.05, 0, Math.PI * 2);
      },
      SQUIRE_PALETTE.beltLeather,
      4.0,
      SQUIRE_PALETTE.ink
    );
    // Buckle prong
    drawCrayonStroke(
      ctx,
      'sq_buckle_prong',
      (c) => {
        c.moveTo(474, 595);
        c.lineTo(495, 595);
      },
      4.5,
      SQUIRE_PALETTE.ink
    );

    // Hanging Belt Strap End
    drawCrayonShape(
      ctx,
      'sq_belt_strap_end',
      (c) => {
        c.moveTo(505, 588);
        c.quadraticCurveTo(535, 595, 548, 614);
        c.lineTo(536, 624);
        c.quadraticCurveTo(518, 608, 495, 604);
        c.closePath();
      },
      SQUIRE_PALETTE.beltLeather,
      4.8,
      SQUIRE_PALETTE.ink
    );

    // ------------------------------------------------------------------------
    // LAYER 5: LEFT GAUNTLET ARM & GLOVE (Viewer's right: x ~ 560..645)
    // ------------------------------------------------------------------------
    withPivot(ctx, 570, 470, rig.armLeftRot, 0, 0, () => {
      // Upper Blue Sleeve on Left Arm
      drawCrayonShape(
        ctx,
        'sq_sleeve_upper_L',
        (c) => {
          c.moveTo(562, 460);
          c.bezierCurveTo(564, 490, 574, 520, 582, 545);
          c.lineTo(622, 545);
          c.bezierCurveTo(616, 508, 600, 480, 574, 460);
          c.closePath();
        },
        SQUIRE_PALETTE.tunicBlue,
        5.2,
        SQUIRE_PALETTE.ink,
        [560, 458, 625, 548]
      );

      // Rolled Cuff on Left Sleeve
      drawCrayonShape(
        ctx,
        'sq_sleeve_cuff_L',
        (c) => {
          c.moveTo(580, 542);
          c.quadraticCurveTo(602, 548, 624, 542);
          c.lineTo(622, 560);
          c.quadraticCurveTo(600, 566, 578, 560);
          c.closePath();
        },
        SQUIRE_PALETTE.tunicShadow,
        4.8,
        SQUIRE_PALETTE.ink
      );

      // Oversized Brown Leather Gauntlet & Glove (#6F4330)
      drawCrayonShape(
        ctx,
        'sq_gauntlet_cuff',
        (c) => {
          c.moveTo(566, 572);
          c.lineTo(560, 616);
          c.quadraticCurveTo(605, 628, 646, 614);
          c.lineTo(638, 568);
          c.closePath();
        },
        SQUIRE_PALETTE.gauntletLeather,
        5.4,
        SQUIRE_PALETTE.ink,
        [558, 566, 648, 630]
      );

      // Gauntlet Wrist Strap & Buckle
      drawCrayonShape(
        ctx,
        'sq_gauntlet_strap',
        (c) => {
          c.moveTo(568, 605);
          c.lineTo(644, 605);
          c.lineTo(642, 626);
          c.lineTo(570, 626);
          c.closePath();
        },
        SQUIRE_PALETTE.beltShadow,
        4.8,
        SQUIRE_PALETTE.ink
      );
      // Tiny wrist buckle
      drawCrayonShape(
        ctx,
        'sq_gauntlet_buckle',
        (c) => {
          c.rect(604, 603, 18, 22);
        },
        SQUIRE_PALETTE.buckleBronze,
        4.4,
        SQUIRE_PALETTE.ink
      );

      // Leather Glove Fingers (curled around sword/resting at waist)
      drawCrayonShape(
        ctx,
        'sq_glove_fingers',
        (c) => {
          c.moveTo(574, 626);
          c.bezierCurveTo(574, 668, 584, 698, 602, 700);
          c.bezierCurveTo(628, 702, 646, 672, 642, 626);
          c.closePath();
        },
        SQUIRE_PALETTE.gauntletLeather,
        5.2,
        SQUIRE_PALETTE.ink,
        [572, 624, 648, 705]
      );
      // Glove knuckle crease lines
      drawCrayonStroke(
        ctx,
        'sq_glove_creases',
        (c) => {
          c.moveTo(588, 650);
          c.lineTo(592, 686);
          c.moveTo(606, 652);
          c.lineTo(610, 688);
          c.moveTo(624, 648);
          c.lineTo(626, 680);
        },
        4.4,
        SQUIRE_PALETTE.ink
      );
    });

    // ------------------------------------------------------------------------
    // LAYER 6: HEAD, CHUBBY CHEEKS, EAR & FLUFFY ASH HAIR
    // ------------------------------------------------------------------------
    withPivot(ctx, 490, 440, rig.headTilt, turnX * 0.4, rig.headNodY, () => {
      // 6A. Right Chibi Ear (Viewer's right: x ~ 585..635)
      drawCrayonShape(
        ctx,
        'sq_ear_R',
        (c) => {
          c.moveTo(578, 332);
          c.bezierCurveTo(628, 320, 646, 372, 616, 405);
          c.bezierCurveTo(602, 418, 582, 412, 574, 400);
          c.closePath();
        },
        SQUIRE_PALETTE.skinPeach,
        5.4,
        SQUIRE_PALETTE.ink
      );
      // Inner ear swirl
      drawCrayonStroke(
        ctx,
        'sq_ear_R_inner',
        (c) => {
          c.moveTo(595, 348);
          c.bezierCurveTo(615, 355, 618, 386, 598, 394);
        },
        4.4,
        SQUIRE_PALETTE.inkSoft
      );

      // 6B. Chubby Peach Face Contour (#FCEBDD)
      drawCrayonShape(
        ctx,
        'sq_head_face_fill',
        (c) => {
          // Left temple -> soft chubby jawline -> chin -> right cheek
          c.moveTo(384, 280);
          c.bezierCurveTo(376, 340, 380, 395, 395, 425);
          c.bezierCurveTo(414, 458, 456, 475, 498, 472);
          c.bezierCurveTo(544, 468, 582, 444, 595, 398);
          c.bezierCurveTo(605, 360, 600, 305, 586, 260);
          // High cranium dome tucked under hair
          c.bezierCurveTo(560, 185, 410, 195, 384, 280);
          c.closePath();
        },
        SQUIRE_PALETTE.skinPeach,
        0,
        SQUIRE_PALETTE.ink,
        [370, 190, 608, 476]
      );

      // Open Jawline & Cheek Outlines (Leaves neck open & forehead clean)
      drawCrayonStroke(
        ctx,
        'sq_jaw_outline',
        (c) => {
          c.moveTo(384, 320);
          c.bezierCurveTo(378, 365, 382, 402, 398, 428);
          c.bezierCurveTo(416, 460, 456, 475, 498, 472);
          c.bezierCurveTo(544, 468, 582, 444, 595, 398);
          c.bezierCurveTo(602, 368, 600, 335, 592, 305);
        },
        5.6,
        SQUIRE_PALETTE.ink
      );

      // 6C. Facial Features (Blush, Nose, Eyes, Brows, Mouth)
      drawSquireFaceFeatures(ctx, isThreeQuarter ? 14 : 0, rig);

      // 6D. Fluffy Ash-Taupe Hair (#A79D93) with Layered Bangs & Tufts
      if (rig.renderHair) {
        withPivot(ctx, 490, 260, rig.hairSway, 0, 0, () => {
          // Main Fluffy Hair Volume
          drawCrayonShape(
            ctx,
            'sq_hair_main',
            (c) => {
              // Top Crown & Feathered Tufts
              c.moveTo(384, 275);
              // Left tufts
              c.lineTo(362, 285);
              c.lineTo(378, 252);
              c.lineTo(396, 218);
              c.lineTo(434, 185);
              // Crown spikes
              c.lineTo(460, 158);
              c.lineTo(456, 178);
              c.lineTo(518, 162);
              c.lineTo(558, 156);
              c.lineTo(584, 182);
              // Top-right cowlick tuft
              c.lineTo(596, 168);
              c.lineTo(610, 195);
              c.lineTo(636, 192);
              c.lineTo(618, 224);
              c.lineTo(654, 245);
              c.lineTo(630, 275);
              c.lineTo(662, 305);
              c.lineTo(642, 332);
              c.lineTo(650, 355);
              c.lineTo(628, 368);
              c.lineTo(608, 412);
              c.lineTo(590, 424);
              c.lineTo(574, 386);

              // Forehead Bangs (cutting softly across forehead as in reference)
              c.lineTo(564, 334);
              c.lineTo(552, 305);
              c.lineTo(534, 342);
              c.lineTo(518, 308);
              c.lineTo(496, 350);
              c.lineTo(478, 312);
              c.lineTo(456, 356);
              c.lineTo(438, 315);
              c.lineTo(418, 352);
              c.lineTo(404, 318);
              c.lineTo(388, 356);
              c.lineTo(380, 332);
              c.lineTo(372, 352);
              c.closePath();
            },
            SQUIRE_PALETTE.hairAsh,
            5.2,
            SQUIRE_PALETTE.ink,
            [358, 154, 666, 428]
          );

          // Fine Colored-Pencil Sketch Strands on Hair (Matching Reference Style)
          ctx.save();
          ctx.strokeStyle = SQUIRE_PALETTE.hairPencil;
          ctx.lineWidth = 1.8;
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.55;
          const hairStrands: [number, number, number, number][] = [
            [440, 205, 455, 255],
            [468, 185, 484, 245],
            [492, 195, 506, 260],
            [528, 185, 538, 248],
            [558, 202, 565, 262],
            [415, 235, 428, 280],
            [478, 245, 494, 298],
            [518, 248, 532, 296],
            [585, 245, 595, 290],
          ];
          for (const [x1, y1, x2, y2] of hairStrands) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          // Soft highlight sheen on crown
          ctx.strokeStyle = SQUIRE_PALETTE.hairHighlight;
          ctx.lineWidth = 2.4;
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.moveTo(438, 192);
          ctx.quadraticCurveTo(498, 178, 558, 182);
          ctx.stroke();
          ctx.restore();
        });
      }
    });
  });
}

// ============================================================================
// 2. SIDE PROFILE VIEW RENDERER (Right Profile & Mirrored Left Profile)
// ============================================================================
function drawSquireSideProfile(
  ctx: CanvasRenderingContext2D,
  rig: ChibiSquireRigState,
  facingLeft: boolean
) {
  ctx.save();
  if (facingLeft) {
    ctx.translate(1000, 0);
    ctx.scale(-1, 1);
  }

  // Drawn facing RIGHT in 1000x1000 coordinate space
  withPivot(ctx, 500, 700, rig.torsoSwayRot, 0, rig.torsoBobY, () => {
    // ------------------------------------------------------------------------
    // 1. PRACTICE SWORD IN PROFILE
    // ------------------------------------------------------------------------
    withPivot(ctx, 480, 610, rig.swordTilt, 0, 0, () => {
      drawCrayonShape(
        ctx,
        'sq_side_scabbard',
        (c) => {
          c.moveTo(465, 590);
          c.lineTo(440, 770);
          c.lineTo(456, 772);
          c.lineTo(480, 592);
          c.closePath();
        },
        SQUIRE_PALETTE.swordScabbard,
        4.6,
        SQUIRE_PALETTE.ink
      );
      drawCrayonShape(
        ctx,
        'sq_side_pommel',
        (c) => {
          c.arc(488, 550, 7.5, 0, Math.PI * 2);
        },
        SQUIRE_PALETTE.swordPommel,
        4.8,
        SQUIRE_PALETTE.ink
      );
    });

    // ------------------------------------------------------------------------
    // 2. PROFILE LEGS, BOOTS & SHORTS
    // ------------------------------------------------------------------------
    if (rig.action === 'sit') {
      drawCrayonShape(
        ctx,
        'sq_side_shorts_sit',
        (c) => {
          c.moveTo(442, 670);
          c.lineTo(440, 735);
          c.quadraticCurveTo(510, 746, 560, 735);
          c.lineTo(556, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink
      );
      withPivot(ctx, 520, 740, rig.legRightRot, 0, 0, () => {
        drawCrayonShape(
          ctx,
          'sq_side_leg_sit',
          (c) => {
            c.moveTo(505, 730);
            c.lineTo(555, 735);
            c.lineTo(560, 775);
            c.lineTo(508, 770);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          4.8,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_side_boot_sit',
          (c) => {
            c.ellipse(572, 778, 28, 18, 0.2, 0, Math.PI * 2);
          },
          SQUIRE_PALETTE.bootsLeather,
          5.2,
          SQUIRE_PALETTE.ink
        );
      });
    } else {
      // Back Leg
      withPivot(ctx, 518, 730, rig.legLeftRot, 0, rig.legLeftLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_side_leg_back',
          (c) => {
            c.moveTo(502, 735);
            c.lineTo(506, 795);
            c.lineTo(540, 795);
            c.lineTo(536, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinShade,
          4.8,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_side_boot_back',
          (c) => {
            c.moveTo(502, 792);
            c.lineTo(500, 835);
            c.quadraticCurveTo(530, 846, 558, 836);
            c.lineTo(554, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsShadow,
          5.2,
          SQUIRE_PALETTE.ink
        );
      });

      // Front Leg
      withPivot(ctx, 490, 730, rig.legRightRot, 0, rig.legRightLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_side_leg_front',
          (c) => {
            c.moveTo(474, 735);
            c.lineTo(478, 795);
            c.lineTo(516, 795);
            c.lineTo(512, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          5.0,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_side_boot_front',
          (c) => {
            c.moveTo(474, 792);
            c.lineTo(472, 835);
            c.quadraticCurveTo(506, 846, 536, 836);
            c.lineTo(532, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsLeather,
          5.4,
          SQUIRE_PALETTE.ink
        );
      });

      // Profile Shorts
      drawCrayonShape(
        ctx,
        'sq_side_shorts',
        (c) => {
          c.moveTo(448, 670);
          c.lineTo(444, 736);
          c.quadraticCurveTo(505, 746, 560, 736);
          c.lineTo(558, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink
      );
    }

    // ------------------------------------------------------------------------
    // 3. PROFILE TUNIC & BELT
    // ------------------------------------------------------------------------
    drawCrayonShape(
      ctx,
      'sq_side_tunic',
      (c) => {
        c.moveTo(462, 450);
        c.lineTo(540, 452);
        c.bezierCurveTo(564, 510, 574, 610, 570, 678);
        c.quadraticCurveTo(502, 692, 434, 678);
        c.bezierCurveTo(438, 610, 448, 510, 462, 450);
        c.closePath();
      },
      SQUIRE_PALETTE.tunicBlue,
      5.4,
      SQUIRE_PALETTE.ink
    );

    // Profile Belt
    drawCrayonShape(
      ctx,
      'sq_side_belt',
      (c) => {
        c.moveTo(436, 576);
        c.lineTo(568, 576);
        c.lineTo(566, 614);
        c.lineTo(438, 614);
        c.closePath();
      },
      SQUIRE_PALETTE.beltLeather,
      5.0,
      SQUIRE_PALETTE.ink
    );

    // ------------------------------------------------------------------------
    // 4. FOREGROUND GAUNTLET ARM IN PROFILE
    // ------------------------------------------------------------------------
    withPivot(ctx, 510, 470, rig.armLeftRot, 0, 0, () => {
      drawCrayonShape(
        ctx,
        'sq_side_gauntlet',
        (c) => {
          c.moveTo(502, 570);
          c.lineTo(558, 570);
          c.bezierCurveTo(572, 620, 564, 690, 532, 695);
          c.bezierCurveTo(502, 695, 492, 620, 502, 570);
          c.closePath();
        },
        SQUIRE_PALETTE.gauntletLeather,
        5.2,
        SQUIRE_PALETTE.ink
      );
    });

    // ------------------------------------------------------------------------
    // 5. PROFILE HEAD, CHUBBY CHEEK & HAIR
    // ------------------------------------------------------------------------
    withPivot(ctx, 495, 440, rig.headTilt, 0, rig.headNodY, () => {
      // Profile Face
      drawCrayonShape(
        ctx,
        'sq_side_face',
        (c) => {
          c.moveTo(432, 280);
          c.bezierCurveTo(415, 345, 428, 425, 468, 460);
          c.lineTo(534, 462);
          c.bezierCurveTo(595, 455, 626, 420, 624, 380);
          c.quadraticCurveTo(642, 365, 624, 350);
          c.bezierCurveTo(618, 305, 595, 255, 575, 230);
          c.bezierCurveTo(540, 185, 445, 195, 432, 280);
          c.closePath();
        },
        SQUIRE_PALETTE.skinPeach,
        0,
        SQUIRE_PALETTE.ink
      );
      drawCrayonStroke(
        ctx,
        'sq_side_jaw',
        (c) => {
          c.moveTo(434, 320);
          c.bezierCurveTo(422, 365, 432, 425, 468, 460);
          c.lineTo(534, 462);
          c.bezierCurveTo(595, 455, 626, 420, 624, 380);
          c.quadraticCurveTo(642, 365, 624, 350);
        },
        5.4,
        SQUIRE_PALETTE.ink
      );

      // Cheek blush in profile
      ctx.save();
      ctx.fillStyle = SQUIRE_PALETTE.blushOrange;
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.ellipse(565, 368, 20, 13, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Profile Eye & Brow
      const eyeX = 574;
      const eyeY = 332;
      if (rig.expression === 'proud' || rig.blink > 0.85) {
        drawCrayonStroke(
          ctx,
          'sq_side_eye_closed',
          (c) => {
            c.moveTo(eyeX - 10, eyeY + 2);
            c.quadraticCurveTo(eyeX, eyeY - 6, eyeX + 10, eyeY + 2);
          },
          5.2,
          SQUIRE_PALETTE.eyeDark
        );
      } else {
        ctx.save();
        ctx.fillStyle = SQUIRE_PALETTE.eyeDark;
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, 11, 15 * (1 - rig.blink * 0.75), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX - 3.2, eyeY - 4.2, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Profile Brow & Tiny mouth
      drawCrayonStroke(
        ctx,
        'sq_side_brow',
        (c) => {
          c.moveTo(eyeX - 12, eyeY - 24);
          c.quadraticCurveTo(eyeX, eyeY - 28, eyeX + 10, eyeY - 22);
        },
        4.8,
        SQUIRE_PALETTE.inkSoft
      );
      drawCrayonStroke(
        ctx,
        'sq_side_mouth',
        (c) => {
          c.moveTo(598, 380);
          c.lineTo(615, 380);
        },
        4.6,
        SQUIRE_PALETTE.ink
      );

      // Profile Hair
      if (rig.renderHair) {
        drawCrayonShape(
          ctx,
          'sq_side_hair',
          (c) => {
            c.moveTo(415, 275);
            c.bezierCurveTo(445, 195, 545, 185, 608, 235);
            c.lineTo(632, 265);
            c.lineTo(618, 290);
            c.lineTo(635, 320);
            c.lineTo(612, 345);
            c.lineTo(584, 320);
            c.lineTo(558, 356);
            c.lineTo(534, 320);
            c.lineTo(495, 362);
            c.lineTo(468, 330);
            c.lineTo(438, 375);
            c.lineTo(418, 335);
            c.closePath();
          },
          SQUIRE_PALETTE.hairAsh,
          5.0,
          SQUIRE_PALETTE.ink
        );
      }
    });
  });

  ctx.restore();
}

// ============================================================================
// 3. BACK VIEW RENDERER (Showing Scabbard, Belts, Back of Tunic, Fluffy Hair)
// ============================================================================
function drawSquireBackView(ctx: CanvasRenderingContext2D, rig: ChibiSquireRigState) {
  withPivot(ctx, 500, 700, rig.torsoSwayRot, 0, rig.torsoBobY, () => {
    // ------------------------------------------------------------------------
    // 1. LEGS, BOOTS & SHORTS FROM BEHIND
    // ------------------------------------------------------------------------
    if (rig.action === 'sit') {
      drawCrayonShape(
        ctx,
        'sq_back_shorts_sit',
        (c) => {
          c.moveTo(418, 670);
          c.lineTo(412, 735);
          c.quadraticCurveTo(500, 746, 588, 735);
          c.lineTo(584, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink
      );
      drawCrayonShape(
        ctx,
        'sq_back_boots_sit',
        (c) => {
          c.ellipse(452, 775, 26, 18, -0.1, 0, Math.PI * 2);
          c.ellipse(550, 775, 26, 18, 0.1, 0, Math.PI * 2);
        },
        SQUIRE_PALETTE.bootsLeather,
        5.2,
        SQUIRE_PALETTE.ink
      );
    } else {
      withPivot(ctx, 455, 730, rig.legLeftRot, 0, rig.legLeftLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_back_leg_L',
          (c) => {
            c.moveTo(438, 735);
            c.lineTo(444, 795);
            c.lineTo(486, 795);
            c.lineTo(484, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          5.0,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_back_boot_L',
          (c) => {
            c.moveTo(436, 792);
            c.lineTo(432, 835);
            c.quadraticCurveTo(460, 846, 488, 835);
            c.lineTo(486, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsLeather,
          5.4,
          SQUIRE_PALETTE.ink
        );
      });

      withPivot(ctx, 550, 730, rig.legRightRot, 0, rig.legRightLiftY, () => {
        drawCrayonShape(
          ctx,
          'sq_back_leg_R',
          (c) => {
            c.moveTo(530, 735);
            c.lineTo(532, 795);
            c.lineTo(574, 795);
            c.lineTo(570, 735);
            c.closePath();
          },
          SQUIRE_PALETTE.skinPeach,
          5.0,
          SQUIRE_PALETTE.ink
        );
        drawCrayonShape(
          ctx,
          'sq_back_boot_R',
          (c) => {
            c.moveTo(528, 792);
            c.lineTo(526, 835);
            c.quadraticCurveTo(554, 846, 580, 835);
            c.lineTo(576, 792);
            c.closePath();
          },
          SQUIRE_PALETTE.bootsLeather,
          5.4,
          SQUIRE_PALETTE.ink
        );
      });

      drawCrayonShape(
        ctx,
        'sq_back_shorts',
        (c) => {
          c.moveTo(420, 670);
          c.lineTo(418, 736);
          c.quadraticCurveTo(500, 746, 586, 736);
          c.lineTo(584, 670);
          c.closePath();
        },
        SQUIRE_PALETTE.shortsCharcoal,
        5.4,
        SQUIRE_PALETTE.ink
      );
    }

    // ------------------------------------------------------------------------
    // 2. BACK OF BLUE TUNIC & LEATHER BELT & SCABBARD
    // ------------------------------------------------------------------------
    drawCrayonShape(
      ctx,
      'sq_back_tunic',
      (c) => {
        c.moveTo(446, 438);
        c.lineTo(422, 465);
        c.bezierCurveTo(410, 524, 408, 610, 408, 680);
        c.quadraticCurveTo(498, 695, 588, 678);
        c.bezierCurveTo(594, 612, 604, 524, 582, 465);
        c.lineTo(554, 438);
        c.closePath();
      },
      SQUIRE_PALETTE.tunicBlue,
      5.4,
      SQUIRE_PALETTE.ink
    );

    // Back of Belt
    drawCrayonShape(
      ctx,
      'sq_back_belt',
      (c) => {
        c.moveTo(418, 576);
        c.lineTo(584, 576);
        c.lineTo(582, 614);
        c.lineTo(420, 614);
        c.closePath();
      },
      SQUIRE_PALETTE.beltLeather,
      5.2,
      SQUIRE_PALETTE.ink
    );

    // Scabbard hanging along left hip from behind
    drawCrayonShape(
      ctx,
      'sq_back_scabbard',
      (c) => {
        c.moveTo(442, 590);
        c.lineTo(418, 765);
        c.lineTo(434, 768);
        c.lineTo(458, 592);
        c.closePath();
      },
      SQUIRE_PALETTE.swordScabbard,
      4.6,
      SQUIRE_PALETTE.ink
    );

    // ------------------------------------------------------------------------
    // 3. BACK OF ARMS
    // ------------------------------------------------------------------------
    withPivot(ctx, 428, 470, rig.armRightRot, 0, 0, () => {
      drawCrayonShape(
        ctx,
        'sq_back_arm_R',
        (c) => {
          c.ellipse(394, 620, 18, 36, 0.1, 0, Math.PI * 2);
        },
        SQUIRE_PALETTE.skinPeach,
        4.8,
        SQUIRE_PALETTE.ink
      );
    });
    withPivot(ctx, 570, 470, rig.armLeftRot, 0, 0, () => {
      drawCrayonShape(
        ctx,
        'sq_back_gauntlet_L',
        (c) => {
          c.ellipse(608, 620, 24, 42, -0.1, 0, Math.PI * 2);
        },
        SQUIRE_PALETTE.gauntletLeather,
        5.2,
        SQUIRE_PALETTE.ink
      );
    });

    // ------------------------------------------------------------------------
    // 4. BACK OF HEAD & FLUFFY ASH HAIR
    // ------------------------------------------------------------------------
    withPivot(ctx, 490, 440, rig.headTilt, 0, rig.headNodY, () => {
      // Head base
      drawCrayonShape(
        ctx,
        'sq_back_head',
        (c) => {
          c.ellipse(490, 360, 110, 95, 0, 0, Math.PI * 2);
        },
        SQUIRE_PALETTE.skinPeach,
        5.4,
        SQUIRE_PALETTE.ink
      );

      // Fluffy Back Hair with Cowlick Spikes
      if (rig.renderHair) {
        drawCrayonShape(
          ctx,
          'sq_back_hair',
          (c) => {
            c.moveTo(375, 275);
            c.lineTo(355, 305);
            c.lineTo(370, 335);
            c.lineTo(395, 385);
            c.lineTo(430, 420);
            c.lineTo(465, 435);
            c.lineTo(515, 435);
            c.lineTo(555, 420);
            c.lineTo(588, 385);
            c.lineTo(615, 335);
            c.lineTo(630, 295);
            c.lineTo(615, 255);
            c.lineTo(635, 215);
            c.lineTo(595, 175);
            c.lineTo(560, 155);
            c.lineTo(520, 165);
            c.lineTo(465, 155);
            c.lineTo(425, 185);
            c.lineTo(385, 225);
            c.closePath();
          },
          SQUIRE_PALETTE.hairAsh,
          5.2,
          SQUIRE_PALETTE.ink
        );
      }
    });
  });
}

// ============================================================================
// MAIN EXPORTED RENDERER (`drawChibiSquire`)
// ============================================================================
export function drawChibiSquire(
  ctx: CanvasRenderingContext2D,
  rig: ChibiSquireRigState = DEFAULT_CHIBI_SQUIRE_RIG,
  cx = 500,
  cy = 500,
  scale = 1
): void {
  const W = ctx.canvas?.width || 1000;
  const H = ctx.canvas?.height || 1000;

  ctx.save();
  if (!rig.transparentBg) {
    ctx.fillStyle = SQUIRE_PALETTE.bgPaper;
    ctx.fillRect(0, 0, W, H);

    // Warm organic paper grain matching reference artwork
    const rng = mulberry32(hashStr('squire_paper_bg'));
    for (let i = 0; i < 1500; i++) {
      const px = rng() * W;
      const py = rng() * H;
      ctx.fillStyle = i % 2 === 0 ? '#EFE9DA' : '#FCF8EE';
      ctx.globalAlpha = 0.22;
      ctx.fillRect(px, py, 1.8, 1.8);
    }
  }
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-500, -500);

  if (!rig.transparentBg) {
    // Tightly hugged ground contact shadow touching boot soles (ZERO floating gap!)
    const shY = rig.action === 'sit' ? 805 : 842;
    const shRx = rig.action === 'sit' ? 128 : 105;
    const shRy = 14;
    const sg = ctx.createRadialGradient(506, shY, 4, 506, shY, shRx);
    sg.addColorStop(0, 'rgba(59, 42, 32, 0.24)');
    sg.addColorStop(0.65, 'rgba(59, 42, 32, 0.08)');
    sg.addColorStop(1, 'rgba(59, 42, 32, 0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(506, shY, shRx, shRy, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (rig.viewAngle === 'front') {
    drawSquireFrontOrThreeQuarter(ctx, rig, false);
  } else if (rig.viewAngle === 'three_quarter') {
    drawSquireFrontOrThreeQuarter(ctx, rig, true);
  } else if (rig.viewAngle === 'side_right') {
    drawSquireSideProfile(ctx, rig, false);
  } else if (rig.viewAngle === 'side_left') {
    drawSquireSideProfile(ctx, rig, true);
  } else if (rig.viewAngle === 'back') {
    drawSquireBackView(ctx, rig);
  }

  ctx.restore();
}

/**
 * Procedural Storybook Castle Courtyard & Training Yard Background
 * Calibrated for Chibi Squire Boy
 */
export function drawSquireCastleYardBG(
  ctx: CanvasRenderingContext2D,
  t: number,
  sceneW = 1000,
  sceneH = 1000
): void {
  ctx.save();

  // 1. Warm Golden Hour Medieval Sky
  const skyG = ctx.createLinearGradient(0, 0, 0, sceneH * 0.65);
  skyG.addColorStop(0, '#EBD8C1');
  skyG.addColorStop(0.5, '#F4E7D3');
  skyG.addColorStop(1, '#F8F1E4');
  ctx.fillStyle = skyG;
  ctx.fillRect(0, 0, sceneW, sceneH);

  // Soft drifting clouds
  ctx.fillStyle = 'rgba(255, 250, 240, 0.6)';
  for (let i = 0; i < 3; i++) {
    const cx = (((i * 450 + t * 10 * (0.7 + i * 0.2)) % (sceneW + 300)) - 150);
    const cy = sceneH * (0.12 + (i % 2) * 0.08);
    const r = sceneH * 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.8, cy - r * 0.18, r * 1.1, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.7, cy + r * 0.05, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Distant Stone Fortress Ramparts & Battlements
  ctx.fillStyle = '#A3998F';
  ctx.strokeStyle = '#4A3D35';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, sceneH * 0.52);
  // Left wall & tower
  ctx.lineTo(sceneW * 0.22, sceneH * 0.52);
  ctx.lineTo(sceneW * 0.22, sceneH * 0.36);
  // Battlements on tower
  for (let b = 0; b < 4; b++) {
    const bx = sceneW * 0.22 + b * (sceneW * 0.04);
    ctx.lineTo(bx, sceneH * 0.36);
    ctx.lineTo(bx, sceneH * 0.33);
    ctx.lineTo(bx + sceneW * 0.022, sceneH * 0.33);
    ctx.lineTo(bx + sceneW * 0.022, sceneH * 0.36);
  }
  ctx.lineTo(sceneW * 0.38, sceneH * 0.36);
  ctx.lineTo(sceneW * 0.38, sceneH * 0.5);
  // Archway / Gate
  ctx.lineTo(sceneW * 0.62, sceneH * 0.5);
  ctx.lineTo(sceneW * 0.62, sceneH * 0.38);
  // Right tower battlements
  for (let b = 0; b < 5; b++) {
    const bx = sceneW * 0.62 + b * (sceneW * 0.045);
    ctx.lineTo(bx, sceneH * 0.38);
    ctx.lineTo(bx, sceneH * 0.34);
    ctx.lineTo(bx + sceneW * 0.024, sceneH * 0.34);
    ctx.lineTo(bx + sceneW * 0.024, sceneH * 0.38);
  }
  ctx.lineTo(sceneW, sceneH * 0.38);
  ctx.lineTo(sceneW, sceneH * 0.65);
  ctx.lineTo(0, sceneH * 0.65);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Knight Pennants / Banners Fluttering on Towers
  const drawBanner = (bx: number, by: number, color: string) => {
    const sway = Math.sin(t * 3.2 + bx) * 12;
    ctx.save();
    ctx.strokeStyle = '#382A22';
    ctx.lineWidth = 3;
    // Flagpole
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, by - 55);
    ctx.stroke();
    // Banner cloth
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(bx, by - 55);
    ctx.quadraticCurveTo(bx + 28, by - 50 + sway * 0.3, bx + 55, by - 48 + sway);
    ctx.lineTo(bx + 40, by - 32 + sway * 0.7);
    ctx.lineTo(bx + 55, by - 16 + sway * 0.5);
    ctx.quadraticCurveTo(bx + 26, by - 22, bx, by - 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  drawBanner(sceneW * 0.3, sceneH * 0.33, '#A83B30'); // Crimson
  drawBanner(sceneW * 0.76, sceneH * 0.34, '#D69E2E'); // Gold lion yellow

  // 4. Cobblestone Courtyard Floor
  const floorG = ctx.createLinearGradient(0, sceneH * 0.62, 0, sceneH);
  floorG.addColorStop(0, '#D3CBBF');
  floorG.addColorStop(0.5, '#C6BEB2');
  floorG.addColorStop(1, '#B3ABA0');
  ctx.fillStyle = floorG;
  ctx.beginPath();
  ctx.moveTo(0, sceneH * 0.62);
  ctx.lineTo(sceneW, sceneH * 0.62);
  ctx.lineTo(sceneW, sceneH);
  ctx.lineTo(0, sceneH);
  ctx.closePath();
  ctx.fill();

  // Cobblestone paving lines & organic stones
  ctx.strokeStyle = 'rgba(74, 61, 53, 0.28)';
  ctx.lineWidth = 2.2;
  for (let row = 0; row < 7; row++) {
    const ry = sceneH * (0.64 + row * 0.052);
    ctx.beginPath();
    ctx.moveTo(0, ry);
    for (let x = 0; x <= sceneW; x += 40) {
      const offset = (Math.sin(x * 0.05 + row) * 3);
      ctx.lineTo(x, ry + offset);
    }
    ctx.stroke();
  }

  // 5. Wooden Training Dummy in Background Left
  ctx.save();
  const dummyX = sceneW * 0.16;
  const dummyY = sceneH * 0.68;
  // Wooden post
  ctx.fillStyle = '#6E4E37';
  ctx.strokeStyle = '#38281D';
  ctx.lineWidth = 3;
  ctx.fillRect(dummyX - 6, dummyY - 60, 12, 60);
  ctx.strokeRect(dummyX - 6, dummyY - 60, 12, 60);
  // Straw padded body
  ctx.fillStyle = '#C8B084';
  ctx.beginPath();
  ctx.ellipse(dummyX, dummyY - 42, 18, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Straw head
  ctx.beginPath();
  ctx.arc(dummyX, dummyY - 74, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Crossbar arms
  ctx.fillStyle = '#6E4E37';
  ctx.fillRect(dummyX - 32, dummyY - 50, 64, 8);
  ctx.strokeRect(dummyX - 32, dummyY - 50, 64, 8);
  ctx.restore();

  ctx.restore();
}
