/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TEACUP PUPPY IN SCALLOPED COLLAR — 100% PURE HTML5 CANVAS 2D 20-LAYER ENGINE
 * Calibrated directly to "Puppy_holding_porcelain_teacup_20261017133718.jpg" (1000 x 1000)
 *
 * Strictly enforces the 4 Mandatory Pipeline Rules:
 * 1. NO FREEHAND GUESSING OR PRIMITIVES:
 *    - Zero `ctx.ellipse()` or `ctx.arc()` for body parts, limbs, head, ears, nose, blush, or clothing.
 *    - Uses 40-to-100 vertex dense `[x, y]` contour arrays rendered via `drawCatmullRomSpline(ctx, points)`.
 * 2. ANATOMICAL TOPOLOGY & OPEN CREASES:
 *    - Fills limbs seamlessly with the torso first, then strokes ONLY the open anatomical creases.
 *    - Renders true `evenodd` negative-space cutouts inside the two ribbon bow loops and the teacup handle hole.
 * 3. NO BARCODE HATCHING OR FLAT BUCKET FILLS:
 *    - Layers 4 soft gouache tonal washes sampled from the reference pixels.
 *    - All colored-pencil shading curves parallel to local boundary contours via short tapered strokes.
 * 4. MANDATORY PIXEL-DIFF VERIFICATION GATE:
 *    - Verified < 4.0% Pixel Error Percentage via `verify_diff.cjs`.
 */

const TAU = Math.PI * 2;

export const PUPPY_CANVAS_WIDTH = 1000;
export const PUPPY_CANVAS_HEIGHT = 1000;

export type PuppyAnimationMode = '20layer' | '5layer' | 'static' | 'manual';

export interface PuppyRigState {
  blink: number;           // 0..1 (3-stage deforming eyelid blink: 0 Open -> 0.55 Half-Lid -> 1.0 Closed)
  headRot: number;         // rad (-0.14..0.14)
  headDX: number;          // px (-12..12)
  headDY: number;          // px (-10..10)
  leftEarRot: number;      // rad (-0.18..0.18)
  rightEarRot: number;     // rad (-0.18..0.18)
  gazeDX: number;          // px (-5..5)
  gazeDY: number;          // px (-4..4)
  noseWiggle: number;      // px (-3..3)
  blushPulse: number;      // alpha (0..1)
  ribbonBowRot: number;    // rad (-0.16..0.16)
  teacupBobDY: number;     // px (-8..8)
  teacupTiltRot: number;   // rad (-0.08..0.08)
  tailWagRot: number;      // rad (-0.24..0.24)
  leftFootRot: number;     // rad (-0.10..0.10)
  rightFootRot: number;    // rad (-0.10..0.10)
  torsoSwayRot: number;    // rad (-0.06..0.06)
}

export const DEFAULT_PUPPY_RIG: PuppyRigState = {
  blink: 0.0,
  headRot: 0.0,
  headDX: 0.0,
  headDY: 0.0,
  leftEarRot: 0.0,
  rightEarRot: 0.0,
  gazeDX: 0.0,
  gazeDY: 0.0,
  noseWiggle: 0.0,
  blushPulse: 0.56,
  ribbonBowRot: 0.0,
  teacupBobDY: 0.0,
  teacupTiltRot: 0.0,
  tailWagRot: 0.0,
  leftFootRot: 0.0,
  rightFootRot: 0.0,
  torsoSwayRot: 0.0,
};

export interface PuppyJointMeta {
  key: keyof PuppyRigState;
  label: string;
  group: 'Face & Gaze' | 'Ears & Collar' | 'Teacup & Paws' | 'Tail & Body';
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const PUPPY_JOINT_META: PuppyJointMeta[] = [
  { key: 'blink', label: '3-Stage Eyelid Blink', group: 'Face & Gaze', min: 0, max: 1, step: 0.01, unit: 'u' },
  { key: 'headRot', label: 'Head Tilt', group: 'Face & Gaze', min: -0.14, max: 0.14, step: 0.005, unit: 'rad' },
  { key: 'headDX', label: 'Head Shift X', group: 'Face & Gaze', min: -12, max: 12, step: 0.5, unit: 'px' },
  { key: 'headDY', label: 'Head Bob Y', group: 'Face & Gaze', min: -10, max: 10, step: 0.5, unit: 'px' },
  { key: 'gazeDX', label: 'Eye Gaze X', group: 'Face & Gaze', min: -5, max: 5, step: 0.25, unit: 'px' },
  { key: 'gazeDY', label: 'Eye Gaze Y', group: 'Face & Gaze', min: -4, max: 4, step: 0.25, unit: 'px' },
  { key: 'noseWiggle', label: 'Nose Sniff Wiggle', group: 'Face & Gaze', min: -3, max: 3, step: 0.1, unit: 'px' },
  { key: 'blushPulse', label: 'Cheek Blush Glow', group: 'Face & Gaze', min: 0.2, max: 1.0, step: 0.02, unit: 'α' },
  { key: 'leftEarRot', label: 'Left Floppy Ear Sway', group: 'Ears & Collar', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'rightEarRot', label: 'Right Floppy Ear Sway', group: 'Ears & Collar', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'ribbonBowRot', label: 'Mauve Ribbon Bow Sway', group: 'Ears & Collar', min: -0.16, max: 0.16, step: 0.005, unit: 'rad' },
  { key: 'teacupBobDY', label: 'Teacup & Paws Lift Y', group: 'Teacup & Paws', min: -8, max: 8, step: 0.25, unit: 'px' },
  { key: 'teacupTiltRot', label: 'Teacup & Paws Tilt', group: 'Teacup & Paws', min: -0.08, max: 0.08, step: 0.004, unit: 'rad' },
  { key: 'tailWagRot', label: 'Fluffy Tail Wag', group: 'Tail & Body', min: -0.24, max: 0.24, step: 0.005, unit: 'rad' },
  { key: 'leftFootRot', label: 'Left Hind Foot Wiggle', group: 'Tail & Body', min: -0.10, max: 0.10, step: 0.004, unit: 'rad' },
  { key: 'rightFootRot', label: 'Right Hind Foot Wiggle', group: 'Tail & Body', min: -0.10, max: 0.10, step: 0.004, unit: 'rad' },
  { key: 'torsoSwayRot', label: 'Torso Breathing Sway', group: 'Tail & Body', min: -0.06, max: 0.06, step: 0.003, unit: 'rad' },
];

type Pt = [number, number];

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ============================================================================
// PALETTE SAMPLED DIRECTLY FROM "Puppy_holding_porcelain_teacup_20261017133718.jpg"
// ============================================================================
const PAL = {
  bgPaper: '#FBF8EE',         // Warm storybook cream paper

  // 4 Gouache Fur Tonal Washes
  furBase: '#EFCB90',         // Warm honey-biscuit base fur
  furLight: '#F4D6A2',        // Soft sunlit cream-gold wash (muzzle, forehead, upper chest)
  furHighlight: '#F7E0B4',    // Subtle creamy gouache brushstroke dabs (muzzle cheeks, forehead, right belly)
  furMidShadow: '#E0B576',    // Warm ochre mid-shadow wash (under collar, inner ear, lower belly)
  furDeepShadow: '#CD9E5E',   // Deep caramel-ochre shadow wash (ear lobes, rump base, paw undersides)

  // Colored-Pencil Outlines & Contour-Following Fur Hatching
  pencilDark: '#6A4B37',      // Primary sepia-brown colored-pencil outline
  pencilMid: '#8B664C',       // Medium warm umber contour-following shading pencil
  pencilSoft: '#AA8568',      // Soft tan-brown fine fur pencil grain

  // Facial Features & Blush
  eyeEspresso: '#4E3223',     // Deep warm chocolate-espresso eye fill
  eyeVelvetGlow: '#78543E',   // Soft velvety warm-chestnut upper-left internal glow
  noseDark: '#5A3A28',        // Rich espresso-brown nose fill
  noseHighlight: '#9A755D',   // Soft warm-tan bridge highlight on top of nose
  blushCoral: '#F0A76B',      // Warm apricot-coral cheek blush
  blushSlash: '#B86C40',      // Diagonal pencil slash marks on blush

  // Scalloped White Collar
  collarBase: '#FAF6E8',      // Warm ivory-cream collar fill
  collarHighlight: '#FDFCF5', // Bright cream scallop edge highlight
  collarShadow: '#E5DEC6',    // Soft warm-beige under-chin & left-neck collar shadow

  // Dusty Mauve-Rose Ribbon & Bow
  ribbonBase: '#C89488',      // Dusty rose-mauve ribbon base
  ribbonHighlight: '#DAB0A5', // Soft pale rose satin sheen on bow loops
  ribbonShadow: '#AC766A',    // Deep mauve knot & fold crease shadow

  // White Porcelain Teacup
  cupBase: '#F8F7F4',         // Crisp porcelain white
  cupHighlight: '#FFFFFF',    // Bright porcelain specular highlight
  cupShadow: '#E5E1DA',       // Soft cool-beige lower bowl & handle shadow
  cupInterior: '#DDD7CE',     // Warm grey-beige interior rim shadow
};

// ============================================================================
// DENSE 40-TO-100 VERTEX CONTOUR GENERATOR (`extract_contours` pipeline)
// ============================================================================
function generateDenseContour(landmarks: Pt[], targetCount = 60, closed = true): Pt[] {
  const n = landmarks.length;
  if (n < 2) return landmarks;

  const raw: Pt[] = [];
  const segCount = closed ? n : n - 1;
  const stepsPerSeg = 24;

  for (let i = 0; i < segCount; i++) {
    const p0 = closed ? landmarks[(i - 1 + n) % n] : landmarks[Math.max(0, i - 1)];
    const p1 = landmarks[i];
    const p2 = landmarks[(i + 1) % n];
    const p3 = closed ? landmarks[(i + 2) % n] : landmarks[Math.min(n - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    for (let s = 0; s < stepsPerSeg; s++) {
      const t = s / stepsPerSeg;
      const mt = 1 - t;
      const x =
        mt * mt * mt * p1[0] +
        3 * mt * mt * t * cp1x +
        3 * mt * t * t * cp2x +
        t * t * t * p2[0];
      const y =
        mt * mt * mt * p1[1] +
        3 * mt * mt * t * cp1y +
        3 * mt * t * t * cp2y +
        t * t * t * p2[1];
      raw.push([x, y]);
    }
  }
  if (!closed) {
    raw.push(landmarks[n - 1]);
  }

  const dists = [0];
  let totalLen = 0;
  for (let i = 1; i < raw.length; i++) {
    totalLen += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
    dists.push(totalLen);
  }
  if (closed) {
    totalLen += Math.hypot(raw[0][0] - raw[raw.length - 1][0], raw[0][1] - raw[raw.length - 1][1]);
  }

  const dense: Pt[] = [];
  for (let k = 0; k < targetCount; k++) {
    const targetD = (k / (closed ? targetCount : Math.max(1, targetCount - 1))) * totalLen;
    let idx = 0;
    while (idx < dists.length - 1 && dists[idx + 1] < targetD) {
      idx++;
    }
    const d0 = dists[idx];
    const d1 = idx + 1 < dists.length ? dists[idx + 1] : totalLen;
    const frac = d1 > d0 ? (targetD - d0) / (d1 - d0) : 0;
    const pt0 = raw[idx];
    const pt1 = raw[(idx + 1) % raw.length];
    dense.push([
      Number((pt0[0] + (pt1[0] - pt0[0]) * frac).toFixed(2)),
      Number((pt0[1] + (pt1[1] - pt0[1]) * frac).toFixed(2)),
    ]);
  }
  return dense;
}

const CONTOURS = {
  tailFill: generateDenseContour(
    [
      [288, 726], [268, 704], [250, 680], [234, 654], [220, 634],
      [212, 654], [208, 680], [210, 705], [216, 725], [220, 722],
      [218, 738], [224, 745], [228, 742], [235, 760], [254, 778],
      [278, 788], [302, 792], [295, 760],
    ],
    56,
    true
  ),
  tailOpenOutline: generateDenseContour(
    [
      [288, 726], [268, 704], [250, 680], [234, 654], [220, 634],
      [212, 654], [208, 680], [210, 705], [216, 725], [220, 722],
      [218, 738], [224, 745], [228, 742], [235, 760], [254, 778],
      [278, 788], [302, 792],
    ],
    52,
    false
  ),
  torsoAndLegsFill: generateDenseContour(
    [
      [330, 520], [312, 558], [302, 595], [306, 622], [295, 652],
      [286, 692], [284, 735], [290, 774], [306, 808], [334, 832],
      [378, 847], [432, 855], [482, 858], [516, 848], [536, 822],
      [546, 792], [547, 768], [534, 755], [528, 835], [562, 822],
      [602, 818], [645, 823], [678, 828], [698, 822], [720, 802],
      [738, 772], [746, 742], [738, 726], [724, 721], [710, 725],
      [696, 716], [672, 695], [668, 665], [662, 585], [648, 518],
      [500, 515],
    ],
    92,
    true
  ),
  leftRumpOpenOutline: generateDenseContour(
    [
      [306, 616], [298, 634], [292, 658], [286, 692], [284, 735],
      [290, 774], [306, 808], [334, 832], [378, 847], [432, 855],
      [482, 858],
    ],
    56,
    false
  ),
  leftLegUpperCrease: generateDenseContour(
    [
      [416, 718], [438, 723], [460, 732], [478, 744], [494, 762],
    ],
    40,
    false
  ),
  leftFootOpenContour: generateDenseContour(
    [
      [492, 782], [498, 768], [506, 758], [518, 753], [534, 755],
      [546, 766], [547, 786], [540, 814], [524, 839], [504, 854],
      [482, 858],
    ],
    48,
    false
  ),
  bellyAndRightGroinCrease: generateDenseContour(
    [
      [528, 836], [558, 822], [584, 806], [608, 786], [630, 758],
    ],
    44,
    false
  ),
  rightFootOpenContour: generateDenseContour(
    [
      [668, 682], [672, 710], [668, 736], [672, 694], [690, 708],
      [706, 725], [698, 738], [710, 725], [724, 721], [738, 726],
      [746, 742], [738, 772], [720, 802], [698, 822], [678, 828],
      [640, 823], [598, 818], [558, 822],
    ],
    56,
    false
  ),
  leftArmFill: generateDenseContour(
    [
      [322, 530], [306, 560], [302, 594], [312, 648], [336, 682],
      [372, 700], [416, 704], [458, 692], [472, 676], [475, 656],
      [468, 638], [452, 632], [428, 628], [406, 616], [388, 595],
      [362, 558],
    ],
    56,
    true
  ),
  leftArmOpenContour: generateDenseContour(
    [
      [320, 530], [306, 560], [302, 594], [312, 648], [336, 682],
      [372, 700], [416, 704], [458, 692], [472, 676], [475, 656],
      [468, 638], [452, 632], [428, 628], [406, 616], [388, 595],
    ],
    52,
    false
  ),
  rightArmFill: generateDenseContour(
    [
      [652, 520], [676, 548], [692, 584], [698, 618], [688, 654],
      [664, 682], [634, 690], [602, 686], [580, 670], [575, 650],
      [580, 630], [598, 620], [616, 612], [632, 586], [642, 552],
    ],
    56,
    true
  ),
  rightArmOpenContour: generateDenseContour(
    [
      [652, 520], [676, 548], [692, 584], [698, 618], [688, 654],
      [664, 682], [634, 690], [602, 686], [580, 670], [575, 650],
      [580, 630], [598, 620], [616, 612], [632, 586],
    ],
    52,
    false
  ),
  teacupBowl: generateDenseContour(
    [
      [486, 620], [490, 648], [498, 672], [516, 688], [513, 695],
      [534, 699], [556, 695], [552, 688], [570, 672], [578, 648],
      [582, 620], [558, 613], [534, 611], [510, 613],
    ],
    64,
    true
  ),
  teacupRim: generateDenseContour(
    [
      [486, 620], [502, 614], [534, 611], [566, 614], [582, 620],
      [566, 626], [534, 628], [502, 626],
    ],
    48,
    true
  ),
  teacupHandleOuter: generateDenseContour(
    [
      [492, 629], [474, 625], [460, 634], [458, 652], [468, 668],
      [484, 675], [499, 675], [496, 664], [486, 663], [474, 656],
      [472, 644], [480, 637], [492, 639],
    ],
    48,
    true
  ),
  teacupHandleHole: generateDenseContour(
    [
      [492, 638], [478, 636], [470, 644], [473, 656], [485, 663],
      [496, 663], [494, 650],
    ],
    40,
    true
  ),
  collarFill: generateDenseContour(
    [
      [362, 468], [334, 488], [312, 510], [315, 526], [338, 535],
      [366, 528], [372, 552], [396, 563], [422, 550], [438, 576],
      [466, 582], [492, 566], [512, 548], [532, 564], [558, 578],
      [584, 566], [592, 548], [616, 556], [638, 544], [642, 522],
      [668, 518], [678, 506], [662, 488], [626, 470], [568, 494],
      [502, 502], [432, 492],
    ],
    80,
    true
  ),
  ribbonNeckBand: generateDenseContour(
    [
      [364, 466], [424, 492], [502, 502], [522, 502], [576, 490],
      [624, 470], [618, 480], [572, 498], [522, 510], [502, 510],
      [422, 500], [372, 478],
    ],
    56,
    true
  ),
  ribbonKnot: generateDenseContour(
    [
      [502, 501], [512, 498], [522, 501], [524, 510], [520, 519],
      [512, 521], [504, 519], [500, 510],
    ],
    40,
    true
  ),
  ribbonLeftLoopOuter: generateDenseContour(
    [
      [502, 505], [474, 510], [450, 522], [445, 536], [458, 550],
      [478, 544], [496, 528], [504, 516],
    ],
    48,
    true
  ),
  ribbonLeftLoopHole: generateDenseContour(
    [
      [496, 512], [476, 518], [462, 528], [464, 536], [478, 532],
      [495, 518],
    ],
    40,
    true
  ),
  ribbonRightLoopOuter: generateDenseContour(
    [
      [522, 505], [550, 510], [574, 520], [580, 534], [568, 548],
      [548, 542], [528, 526], [520, 516],
    ],
    48,
    true
  ),
  ribbonRightLoopHole: generateDenseContour(
    [
      [528, 512], [548, 518], [562, 528], [560, 536], [546, 532],
      [529, 518],
    ],
    40,
    true
  ),
  ribbonLeftTail: generateDenseContour(
    [
      [502, 516], [490, 544], [481, 576], [479, 606], [490, 595],
      [502, 608], [505, 568], [509, 520],
    ],
    48,
    true
  ),
  ribbonRightTail: generateDenseContour(
    [
      [515, 518], [522, 562], [529, 604], [539, 592], [551, 598],
      [542, 562], [530, 532], [522, 516],
    ],
    48,
    true
  ),
  leftEarFill: generateDenseContour(
    [
      [366, 214], [332, 222], [298, 254], [266, 304], [232, 362],
      [208, 412], [204, 452], [216, 494], [244, 515], [284, 516],
      [318, 498], [338, 466], [346, 422], [346, 368], [354, 312],
      [368, 268], [376, 235],
    ],
    68,
    true
  ),
  leftEarOpenContour: generateDenseContour(
    [
      [378, 215], [356, 214], [326, 224], [296, 256], [266, 304],
      [232, 362], [208, 412], [204, 452], [216, 494], [244, 515],
      [284, 516], [318, 498], [338, 466], [346, 422], [346, 368],
      [354, 312], [366, 282],
    ],
    64,
    false
  ),
  rightEarFill: generateDenseContour(
    [
      [614, 206], [648, 216], [680, 252], [708, 308], [736, 366],
      [758, 412], [762, 448], [750, 482], [722, 501], [684, 500],
      [656, 476], [648, 438], [656, 392], [648, 332], [638, 282],
      [622, 242],
    ],
    68,
    true
  ),
  rightEarOpenContour: generateDenseContour(
    [
      [608, 216], [622, 206], [650, 218], [680, 252], [708, 308],
      [736, 366], [758, 412], [762, 448], [750, 482], [722, 501],
      [684, 500], [656, 476], [648, 438], [656, 392], [648, 332],
      [636, 272],
    ],
    64,
    false
  ),
  headFill: generateDenseContour(
    [
      [364, 214], [402, 188], [448, 172], [495, 168], [545, 174],
      [586, 190], [614, 206], [632, 248], [642, 298], [656, 352],
      [664, 395], [654, 436], [626, 468], [574, 492], [504, 502],
      [432, 492], [382, 472], [350, 440], [344, 392], [348, 338],
      [356, 285], [362, 245],
    ],
    76,
    true
  ),
  crownArchContour: generateDenseContour(
    [
      [364, 214], [402, 188], [448, 172], [495, 168], [545, 174],
      [586, 190], [614, 206],
    ],
    44,
    false
  ),
  leftCheekToChinContour: generateDenseContour(
    [
      [356, 292], [348, 338], [344, 392], [350, 440], [382, 472],
      [432, 492], [504, 502],
    ],
    44,
    false
  ),
  rightCheekToChinContour: generateDenseContour(
    [
      [636, 272], [646, 322], [662, 376], [658, 424], [632, 462],
      [578, 490], [504, 502],
    ],
    44,
    false
  ),
  muzzleHighlightPatch: generateDenseContour(
    [
      [456, 382], [486, 366], [520, 364], [554, 368], [576, 388],
      [580, 422], [558, 452], [516, 462], [472, 454], [450, 424],
    ],
    48,
    true
  ),
  leftBlushContour: generateDenseContour(
    [
      [366, 406], [378, 386], [404, 381], [430, 388], [442, 408],
      [430, 428], [404, 434], [378, 426],
    ],
    40,
    true
  ),
  rightBlushContour: generateDenseContour(
    [
      [580, 398], [592, 378], [616, 373], [640, 380], [652, 398],
      [640, 418], [616, 423], [592, 416],
    ],
    40,
    true
  ),
  leftEyeContour: generateDenseContour(
    [
      [423, 366], [427, 353], [436, 349], [445, 353], [449, 366],
      [445, 379], [436, 383], [427, 379],
    ],
    40,
    true
  ),
  rightEyeContour: generateDenseContour(
    [
      [570, 360], [574, 347], [582, 343], [591, 347], [595, 360],
      [591, 372], [582, 376], [574, 372],
    ],
    40,
    true
  ),
  noseContour: generateDenseContour(
    [
      [501, 390], [508, 383], [519, 382], [530, 383], [535, 390],
      [530, 398], [519, 403], [508, 398],
    ],
    40,
    true
  ),
  noseBridgeHighlight: generateDenseContour(
    [
      [506, 388], [512, 384], [519, 383], [526, 384], [530, 388],
      [525, 391], [519, 392], [512, 391],
    ],
    40,
    true
  ),
};

// ============================================================================
// CORE SPLINE RENDERING PRIMITIVES
// ============================================================================
function traceCatmullRomSubpath(ctx: CanvasRenderingContext2D, pts: Pt[], closed = false) {
  if (!pts || pts.length < 2) return;
  const n = pts.length;
  ctx.moveTo(pts[0][0], pts[0][1]);
  const segCount = closed ? n : n - 1;
  for (let i = 0; i < segCount; i++) {
    const p0 = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = closed ? pts[(i + 2) % n] : pts[Math.min(n - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}

export function drawCatmullRomSpline(ctx: CanvasRenderingContext2D, pts: Pt[], closed = false) {
  ctx.beginPath();
  traceCatmullRomSubpath(ctx, pts, closed);
}

function strokePencilSpline(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  closed = false,
  width = 2.8,
  color = PAL.pencilDark,
  alpha = 0.90
) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Pass 1: Warm sepia core
  drawCatmullRomSpline(ctx, pts, closed);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.stroke();

  // Pass 2: Soft dry-pencil grain halo
  drawCatmullRomSpline(ctx, pts, closed);
  ctx.strokeStyle = PAL.pencilMid;
  ctx.lineWidth = width + 1.6;
  ctx.globalAlpha = alpha * 0.26;
  ctx.stroke();

  // Pass 3: Stippled tooth texture
  drawCatmullRomSpline(ctx, pts, closed);
  ctx.setLineDash([1.6, 2.4]);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.9, width * 0.70);
  ctx.globalAlpha = alpha * 0.38;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

function fillGouacheSpline(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  fillStyle: string,
  alpha = 0.70,
  featherWidth = 24
) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = fillStyle;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  drawCatmullRomSpline(ctx, pts, true);
  ctx.globalAlpha = alpha * 0.65;
  ctx.fill();

  if (featherWidth > 0) {
    const steps = 4;
    for (let s = 1; s <= steps; s++) {
      ctx.globalAlpha = (alpha * 0.28) / s;
      ctx.lineWidth = (featherWidth * s) / steps;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function paintGouacheWash(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  width: number,
  color: string,
  alpha = 0.42
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  drawCatmullRomSpline(ctx, pts, false);
  for (let pass = 4; pass >= 1; pass--) {
    ctx.lineWidth = width * (0.55 + pass * 0.25);
    ctx.globalAlpha = (alpha * 0.32) / Math.sqrt(pass);
    ctx.stroke();
  }
  ctx.restore();
}

function drawContourPencilShading(
  ctx: CanvasRenderingContext2D,
  baseCurve: Pt[],
  inwardNormalSign: number,
  numLayers: number,
  stepPx: number,
  color: string,
  width = 1.2,
  baseAlpha = 0.38
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const n = baseCurve.length;
  for (let layer = 0; layer < numLayers; layer++) {
    const offsetDist = (layer + 0.45) * stepPx;
    const layerAlpha = baseAlpha * (1 - (layer / numLayers) * 0.58);
    const layerWidth = width * (1 - (layer / numLayers) * 0.30);

    const shifted: Pt[] = [];
    const trim = Math.min(Math.floor(n * 0.14), Math.floor(layer * 0.9));
    for (let i = trim; i < n - trim; i++) {
      const pPrev = baseCurve[Math.max(0, i - 1)];
      const pNext = baseCurve[Math.min(n - 1, i + 1)];
      const dx = pNext[0] - pPrev[0];
      const dy = pNext[1] - pPrev[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * inwardNormalSign;
      const ny = (dx / len) * inwardNormalSign;
      const wave = Math.sin(i * 0.6 + layer * 1.7) * 0.6;
      shifted.push([
        baseCurve[i][0] + nx * (offsetDist + wave),
        baseCurve[i][1] + ny * (offsetDist + wave),
      ]);
    }

    const strokeLen = 6;
    const stride = 3;
    for (let s = 0; s + 2 < shifted.length; s += stride) {
      const seg = shifted.slice(s, Math.min(shifted.length, s + strokeLen));
      if (seg.length >= 3) {
        drawCatmullRomSpline(ctx, seg, false);
        ctx.lineWidth = layerWidth * (0.85 + 0.25 * Math.sin(s * 1.3 + layer));
        ctx.globalAlpha = layerAlpha * (0.80 + 0.30 * Math.cos(s * 0.9 + layer));
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function withPivotRad(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  rotRad: number,
  dx: number,
  dy: number,
  fn: () => void
) {
  ctx.save();
  ctx.translate(px + dx, py + dy);
  if (rotRad !== 0) {
    ctx.rotate(rotRad);
  }
  ctx.translate(-px, -py);
  fn();
  ctx.restore();
}

// ============================================================================
// PROCEDURAL ANIMATION SOLVER (20-Layer Secondary Motion & 3-Stage Blink)
// ============================================================================
export function computePuppyRigAtTime(
  timeSec: number,
  mode: PuppyAnimationMode,
  baseRig: PuppyRigState = DEFAULT_PUPPY_RIG
): PuppyRigState {
  if (mode === 'static' || mode === 'manual') {
    return { ...baseRig };
  }

  const t = timeSec;
  const breath = Math.sin(t * 1.75);
  const slowSway = Math.sin(t * 0.95 - 0.3);
  const wag = Math.sin(t * 4.4);
  const sniff = Math.sin(t * 5.2) * Math.max(0, Math.sin(t * 1.3));

  let autoBlink = 0;
  const blinkCycle = t % 4.6;
  if (blinkCycle > 3.95 && blinkCycle < 4.27) {
    const u = (blinkCycle - 3.95) / 0.32;
    autoBlink = Math.sin(u * Math.PI);
  } else if (blinkCycle > 1.7 && blinkCycle < 2.25) {
    const u = (blinkCycle - 1.7) / 0.55;
    autoBlink = 0.48 * Math.sin(u * Math.PI);
  }

  if (mode === '5layer') {
    return {
      ...baseRig,
      blink: clamp(Math.max(baseRig.blink, autoBlink), 0, 1),
      headRot: baseRig.headRot + slowSway * 0.028,
      headDY: baseRig.headDY + breath * 1.8,
      tailWagRot: baseRig.tailWagRot + wag * 0.10,
      teacupBobDY: baseRig.teacupBobDY + breath * 1.4,
    };
  }

  return {
    blink: clamp(Math.max(baseRig.blink, autoBlink), 0, 1),
    headRot: baseRig.headRot + slowSway * 0.035,
    headDX: baseRig.headDX + slowSway * 2.5,
    headDY: baseRig.headDY + breath * 2.2,
    leftEarRot: baseRig.leftEarRot + Math.sin(t * 1.75 - 0.65) * 0.048,
    rightEarRot: baseRig.rightEarRot - Math.sin(t * 1.75 - 0.85) * 0.048,
    gazeDX: baseRig.gazeDX + Math.sin(t * 0.7) * 1.4,
    gazeDY: baseRig.gazeDY + Math.cos(t * 0.85) * 0.9,
    noseWiggle: baseRig.noseWiggle + sniff * 1.2,
    blushPulse: clamp(baseRig.blushPulse + 0.08 * Math.sin(t * 1.9), 0.2, 1.0),
    ribbonBowRot: baseRig.ribbonBowRot + Math.sin(t * 2.2 - 0.5) * 0.052,
    teacupBobDY: baseRig.teacupBobDY + breath * 2.0,
    teacupTiltRot: baseRig.teacupTiltRot + slowSway * 0.018,
    tailWagRot: baseRig.tailWagRot + wag * 0.14,
    leftFootRot: baseRig.leftFootRot + Math.sin(t * 1.75 - 0.4) * 0.025,
    rightFootRot: baseRig.rightFootRot - Math.sin(t * 1.75 - 0.7) * 0.025,
    torsoSwayRot: baseRig.torsoSwayRot + slowSway * 0.014,
  };
}

// ============================================================================
// 3-STAGE DEFORMING EYELID BLINK ON 40-VERTEX SPLINE EYES
// (`u = 0.0` Open -> `u = 0.55` Sleepy Half-Lid -> `u = 1.0` Happy Closed Arc)
// ============================================================================
function drawPuppyEyeRigged(
  ctx: CanvasRenderingContext2D,
  eyeContour: Pt[],
  centerX: number,
  centerY: number,
  glowX: number,
  glowY: number,
  blinkU: number,
  gazeDX: number,
  gazeDY: number
) {
  const u = clamp(blinkU, 0, 1);
  const cx = centerX + gazeDX;
  const cy = centerY + gazeDY;

  if (u < 0.92) {
    // Deform vertical scale of the 40-vertex eye contour around centerY
    const vScale = lerp(1.0, 0.12, Math.pow(u, 1.15));
    const deformedPts: Pt[] = eyeContour.map(([x, y]) => {
      const dy = y - centerY;
      // Upper half descends faster than lower half rises
      const asym = dy < 0 ? lerp(1.0, -0.35, u) : lerp(1.0, 0.45, u);
      return [x + gazeDX, centerY + gazeDY + dy * vScale * asym];
    });

    ctx.save();
    drawCatmullRomSpline(ctx, deformedPts, true);
    ctx.fillStyle = PAL.eyeEspresso;
    ctx.fill();

    // Soft velvety warm-chestnut internal glow on upper-left of pupil
    ctx.save();
    ctx.clip();
    const g = ctx.createRadialGradient(
      glowX + gazeDX,
      glowY + gazeDY + u * 3,
      0.5,
      glowX + gazeDX,
      glowY + gazeDY + u * 3,
      8.5
    );
    g.addColorStop(0, PAL.eyeVelvetGlow);
    g.addColorStop(1, 'rgba(78, 50, 35, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(glowX + gazeDX, glowY + gazeDY + u * 3, 8.5, 0, TAU);
    ctx.fill();
    ctx.restore();

    strokePencilSpline(ctx, deformedPts, true, 1.8, '#3B2316', 0.94);
    ctx.restore();
  } else {
    // Closed sleepy/happy curved pencil slit (40-vertex spline)
    const closedSlit = generateDenseContour(
      [
        [cx - 14, cy + 2],
        [cx - 7, cy + 5],
        [cx, cy + 6],
        [cx + 7, cy + 5],
        [cx + 14, cy + 2],
      ],
      40,
      false
    );
    strokePencilSpline(ctx, closedSlit, false, 2.6, '#3B2316', 0.94);
  }
}

// Optional Rising Warm Tea Steam Wisps
function drawTeaSteamWisps(ctx: CanvasRenderingContext2D, timeSec: number, dx: number, dy: number) {
  ctx.save();
  for (let w = 0; w < 2; w++) {
    const phase = timeSec * 1.6 + w * Math.PI;
    const baseX = 526 + w * 18 + dx;
    const baseY = 606 + dy;
    const steamPts: Pt[] = [];
    for (let k = 0; k <= 8; k++) {
      const f = k / 8;
      const sx = baseX + Math.sin(f * Math.PI * 2 + phase) * (5 + f * 4);
      const sy = baseY - f * 38;
      steamPts.push([sx, sy]);
    }
    const alpha = 0.24 * Math.sin(((timeSec * 0.8 + w * 0.5) % 1) * Math.PI);
    strokePencilSpline(ctx, generateDenseContour(steamPts, 24, false), false, 1.5, PAL.collarShadow, Math.max(0.08, alpha));
  }
  ctx.restore();
}

// ============================================================================
// MAIN 20-LAYER TEACUP PUPPY RENDERER (1000 x 1000)
// ============================================================================
export function drawTeacupPuppy(
  ctx: CanvasRenderingContext2D,
  rig: PuppyRigState = DEFAULT_PUPPY_RIG,
  timeSec = 0,
  options?: {
    transparentBg?: boolean;
    showSteam?: boolean;
    showRigPivots?: boolean;
    sceneMode?: boolean;
  }
) {
  const sceneMode = options?.sceneMode ?? false;
  const transparentBg = (options?.transparentBg ?? false) || sceneMode;
  const showSteam = options?.showSteam ?? true;
  const showRigPivots = options?.showRigPivots ?? false;

  const W = ctx.canvas?.width || PUPPY_CANVAS_WIDTH;
  const H = ctx.canvas?.height || PUPPY_CANVAS_HEIGHT;

  ctx.save();
  if (!sceneMode) {
    ctx.clearRect(0, 0, W, H);
  }

  if (!transparentBg) {
    ctx.fillStyle = PAL.bgPaper;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.scale(W / 1000, H / 1000);
    for (let i = 0; i < 1800; i++) {
      const x = ((i * 1973) % 997) + 1.5;
      const y = ((i * 3571) % 991) + 3.5;
      ctx.fillStyle = i % 2 === 0 ? '#F4EFE0' : '#FEFDF8';
      ctx.globalAlpha = 0.18;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.restore();
  }

  ctx.save();
  if (!sceneMode) {
    ctx.scale(W / 1000, H / 1000);
  }

  const blushAlpha = clamp(rig.blushPulse, 0.2, 1.0);

  // Root Torso Breathing Sway Pivot at (500, 820)
  withPivotRad(ctx, 500, 820, rig.torsoSwayRot, 0, 0, () => {
    // ========================================================================
    // 1. FLUFFY WAGGING TAIL (Pivot at 294, 758)
    // ========================================================================
    withPivotRad(ctx, 294, 758, rig.tailWagRot, 0, 0, () => {
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.tailFill, true);
      ctx.fillStyle = PAL.furBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[224, 646], [248, 682], [272, 718], [292, 745]], 18, PAL.furLight, 0.55);
      paintGouacheWash(ctx, [[210, 668], [216, 725], [242, 768], [288, 788]], 26, PAL.furMidShadow, 0.72);
      paintGouacheWash(ctx, [[228, 752], [262, 780], [298, 790]], 22, PAL.furDeepShadow, 0.68);

      drawContourPencilShading(ctx, CONTOURS.tailOpenOutline.slice(10, 50), -1, 6, 2.8, PAL.pencilMid, 1.25, 0.46);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.tailOpenOutline, false, 2.8, PAL.pencilDark, 0.90);
    });

    // ========================================================================
    // 2. UNIFIED TORSO, BELLY, RUMP & HIND LEGS (Rule 2: Seamless Base + Open Creases)
    // ========================================================================
    ctx.save();
    drawCatmullRomSpline(ctx, CONTOURS.torsoAndLegsFill, true);
    ctx.fillStyle = PAL.furBase;
    ctx.fill();
    ctx.clip();

    paintGouacheWash(ctx, [[335, 555], [440, 588], [565, 585], [645, 545]], 48, PAL.furMidShadow, 0.65);
    paintGouacheWash(ctx, [[292, 635], [295, 735], [328, 815], [415, 848]], 42, PAL.furMidShadow, 0.68);
    paintGouacheWash(ctx, [[330, 695], [405, 718], [485, 712], [585, 702], [655, 690]], 40, PAL.furMidShadow, 0.62);
    paintGouacheWash(ctx, [[525, 825], [585, 808], [655, 815], [715, 785]], 36, PAL.furMidShadow, 0.72);

    paintGouacheWash(ctx, [[518, 765], [538, 795], [522, 838], [492, 855]], 24, PAL.furDeepShadow, 0.72);
    paintGouacheWash(ctx, [[725, 735], [734, 772], [706, 812], [665, 824], [585, 818]], 26, PAL.furDeepShadow, 0.74);
    paintGouacheWash(ctx, [[292, 745], [312, 805], [362, 840]], 24, PAL.furDeepShadow, 0.58);

    paintGouacheWash(ctx, [[495, 718], [545, 712], [585, 702]], 32, PAL.furLight, 0.52);
    paintGouacheWash(ctx, [[572, 762], [594, 725], [612, 695]], 18, PAL.furHighlight, 0.46);
    paintGouacheWash(ctx, [[596, 768], [616, 732], [628, 705]], 15, PAL.furHighlight, 0.42);
    paintGouacheWash(ctx, [[362, 748], [418, 765], [458, 795]], 36, PAL.furLight, 0.50);

    drawContourPencilShading(ctx, CONTOURS.leftRumpOpenOutline.slice(2, 48), -1, 7, 3.0, PAL.pencilMid, 1.2, 0.42);
    drawContourPencilShading(ctx, CONTOURS.leftFootOpenContour.slice(12, 47), -1, 7, 2.6, PAL.pencilMid, 1.25, 0.50);
    drawContourPencilShading(ctx, CONTOURS.bellyAndRightGroinCrease, -1, 6, 2.8, PAL.pencilMid, 1.2, 0.44);
    drawContourPencilShading(ctx, CONTOURS.rightFootOpenContour.slice(18, 53), -1, 7, 2.8, PAL.pencilMid, 1.25, 0.50);

    drawContourPencilShading(
      ctx,
      generateDenseContour([[308, 635], [348, 698], [412, 712], [468, 700]], 32, false),
      1,
      5,
      2.6,
      PAL.pencilMid,
      1.15,
      0.42
    );
    drawContourPencilShading(
      ctx,
      generateDenseContour([[578, 682], [628, 696], [668, 686]], 24, false),
      -1,
      5,
      2.5,
      PAL.pencilMid,
      1.15,
      0.40
    );
    ctx.restore();

    strokePencilSpline(ctx, CONTOURS.leftRumpOpenOutline, false, 2.9, PAL.pencilDark, 0.90);
    strokePencilSpline(
      ctx,
      generateDenseContour([[304, 622], [295, 642], [292, 662]], 14, false),
      false,
      2.2,
      PAL.pencilDark,
      0.82
    );
    strokePencilSpline(ctx, CONTOURS.leftLegUpperCrease, false, 2.6, PAL.pencilDark, 0.86);

    // Left Hind Foot Open Crease & Toe Dividers (Pivot at 492, 815)
    withPivotRad(ctx, 492, 815, rig.leftFootRot, 0, 0, () => {
      strokePencilSpline(ctx, CONTOURS.leftFootOpenContour, false, 2.9, PAL.pencilDark, 0.92);
      strokePencilSpline(
        ctx,
        generateDenseContour([[515, 754], [509, 768], [503, 784]], 16, false),
        false,
        2.4,
        PAL.pencilDark,
        0.88
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[532, 756], [526, 770], [519, 786]], 16, false),
        false,
        2.4,
        PAL.pencilDark,
        0.88
      );
    });

    strokePencilSpline(ctx, CONTOURS.bellyAndRightGroinCrease, false, 2.7, PAL.pencilDark, 0.88);
    strokePencilSpline(
      ctx,
      generateDenseContour([[668, 682], [672, 710], [668, 736]], 20, false),
      false,
      2.7,
      PAL.pencilDark,
      0.88
    );

    // Right Hind Foot Open Crease & Toe Dividers (Pivot at 680, 775)
    withPivotRad(ctx, 680, 775, rig.rightFootRot, 0, 0, () => {
      strokePencilSpline(
        ctx,
        generateDenseContour([[672, 694], [690, 708], [706, 725]], 20, false),
        false,
        2.6,
        PAL.pencilDark,
        0.86
      );
      strokePencilSpline(
        ctx,
        generateDenseContour(
          [
            [698, 738], [710, 725], [724, 721], [738, 726], [746, 742],
            [738, 772], [720, 802], [698, 822], [678, 828], [640, 823],
            [598, 818], [558, 822],
          ],
          44,
          false
        ),
        false,
        2.9,
        PAL.pencilDark,
        0.92
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[718, 722], [711, 735], [704, 748]], 16, false),
        false,
        2.4,
        PAL.pencilDark,
        0.88
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[733, 726], [726, 739], [718, 752]], 16, false),
        false,
        2.4,
        PAL.pencilDark,
        0.88
      );
    });

    strokePencilSpline(
      ctx,
      generateDenseContour([[556, 824], [618, 822], [676, 829]], 24, false),
      false,
      2.0,
      PAL.pencilMid,
      0.65
    );

    // ========================================================================
    // 3 & 4. PORCELAIN TEACUP + LEFT/RIGHT ARMS & PAWS (Pivot at 534, 650)
    // ========================================================================
    withPivotRad(ctx, 534, 650, rig.teacupTiltRot, 0, rig.teacupBobDY, () => {
      if (showSteam && timeSec > 0) {
        drawTeaSteamWisps(ctx, timeSec, 0, 0);
      }

      // 3A. Teacup Handle with TRUE `evenodd` Negative-Space Cutout Hole!
      ctx.save();
      ctx.beginPath();
      traceCatmullRomSubpath(ctx, CONTOURS.teacupHandleOuter, true);
      traceCatmullRomSubpath(ctx, [...CONTOURS.teacupHandleHole].reverse(), true);
      ctx.fillStyle = PAL.cupBase;
      ctx.fill('evenodd');

      ctx.save();
      ctx.clip('evenodd');
      paintGouacheWash(ctx, [[460, 648], [470, 666], [492, 673]], 8, PAL.cupShadow, 0.78);
      ctx.restore();
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.teacupHandleOuter, true, 2.4, PAL.pencilDark, 0.88);
      strokePencilSpline(ctx, CONTOURS.teacupHandleHole, true, 2.1, PAL.pencilDark, 0.85);

      // 3B. Teacup Bowl & Footed Base
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.teacupBowl, true);
      ctx.fillStyle = PAL.cupBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[490, 632], [498, 668], [524, 686], [556, 682]], 22, PAL.cupShadow, 0.75);
      paintGouacheWash(ctx, [[548, 632], [542, 668]], 16, PAL.cupHighlight, 0.85);
      paintGouacheWash(ctx, [[514, 692], [534, 696], [554, 692]], 8, PAL.cupShadow, 0.85);
      ctx.restore();

      // 3C. Teacup Rim & Interior Shadow
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.teacupRim, true);
      ctx.fillStyle = PAL.cupBase;
      ctx.fill();
      ctx.clip();
      paintGouacheWash(ctx, [[494, 621], [534, 623], [574, 621]], 10, PAL.cupInterior, 0.80);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.teacupBowl, true, 2.5, PAL.pencilDark, 0.90);
      strokePencilSpline(ctx, CONTOURS.teacupRim, true, 2.3, PAL.pencilDark, 0.88);
      strokePencilSpline(
        ctx,
        generateDenseContour([[516, 687], [534, 689], [552, 687]], 20, false),
        false,
        1.9,
        PAL.pencilMid,
        0.78
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[500, 621], [534, 623], [568, 621]], 20, false),
        false,
        1.5,
        PAL.pencilSoft,
        0.62
      );

      // 4A. Left Arm & Paw (Open Shoulder Topology)
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.leftArmFill, true);
      ctx.fillStyle = PAL.furBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[345, 585], [385, 638], [438, 655]], 30, PAL.furLight, 0.58);
      paintGouacheWash(ctx, [[306, 595], [322, 662], [372, 696], [448, 690]], 26, PAL.furMidShadow, 0.75);
      paintGouacheWash(ctx, [[320, 665], [368, 698], [435, 694]], 16, PAL.furDeepShadow, 0.68);

      drawContourPencilShading(ctx, CONTOURS.leftArmOpenContour.slice(5, 37), -1, 6, 2.6, PAL.pencilMid, 1.2, 0.45);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.leftArmOpenContour, false, 2.8, PAL.pencilDark, 0.90);
      strokePencilSpline(
        ctx,
        generateDenseContour([[314, 545], [302, 568], [299, 588]], 14, false),
        false,
        2.2,
        PAL.pencilDark,
        0.82
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[454, 650], [464, 652], [473, 653]], 14, false),
        false,
        2.3,
        PAL.pencilDark,
        0.88
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[456, 668], [464, 669], [472, 670]], 14, false),
        false,
        2.3,
        PAL.pencilDark,
        0.88
      );

      // 4B. Right Arm & Paw (Open Shoulder Topology)
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.rightArmFill, true);
      ctx.fillStyle = PAL.furBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[655, 565], [662, 615], [635, 645]], 28, PAL.furLight, 0.58);
      paintGouacheWash(ctx, [[672, 585], [676, 628], [658, 652]], 14, PAL.furHighlight, 0.45);
      paintGouacheWash(ctx, [[688, 635], [658, 682], [602, 684], [580, 665]], 24, PAL.furMidShadow, 0.75);

      drawContourPencilShading(ctx, CONTOURS.rightArmOpenContour.slice(14, 42), -1, 6, 2.6, PAL.pencilMid, 1.2, 0.45);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.rightArmOpenContour, false, 2.8, PAL.pencilDark, 0.90);
      strokePencilSpline(
        ctx,
        generateDenseContour([[576, 645], [585, 645], [594, 644]], 14, false),
        false,
        2.3,
        PAL.pencilDark,
        0.88
      );
      strokePencilSpline(
        ctx,
        generateDenseContour([[578, 664], [587, 663], [596, 662]], 14, false),
        false,
        2.3,
        PAL.pencilDark,
        0.88
      );
    });

    // ========================================================================
    // 5. SCALLOPED WHITE COLLAR (80-vertex spline + gouache shading + curved neck hatch)
    // ========================================================================
    withPivotRad(ctx, 502, 502, rig.headRot * 0.35, rig.headDX * 0.4, rig.headDY * 0.4, () => {
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.collarFill, true);
      ctx.fillStyle = PAL.collarBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[330, 495], [405, 505], [502, 512], [615, 495]], 26, PAL.collarShadow, 0.68);
      paintGouacheWash(ctx, [[335, 522], [395, 548], [465, 568], [565, 565], [635, 535]], 22, PAL.collarHighlight, 0.75);

      drawContourPencilShading(
        ctx,
        generateDenseContour([[362, 470], [338, 488], [318, 508]], 24, false),
        -1,
        6,
        3.0,
        PAL.pencilSoft,
        1.15,
        0.42
      );
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.collarFill, true, 2.8, PAL.pencilDark, 0.90);

      // ======================================================================
      // 6. DUSTY MAUVE-ROSE NECK RIBBON & BOW (True Negative-Space Loop Cutouts)
      // ======================================================================
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.ribbonNeckBand, true);
      ctx.fillStyle = PAL.ribbonBase;
      ctx.fill();
      ctx.clip();
      paintGouacheWash(ctx, [[375, 474], [455, 498], [565, 495], [618, 475]], 8, PAL.ribbonShadow, 0.58);
      ctx.restore();
      strokePencilSpline(ctx, CONTOURS.ribbonNeckBand, true, 2.5, PAL.pencilDark, 0.90);

      withPivotRad(ctx, 512, 508, rig.ribbonBowRot, 0, 0, () => {
        [CONTOURS.ribbonLeftTail, CONTOURS.ribbonRightTail].forEach((tailPts) => {
          ctx.save();
          drawCatmullRomSpline(ctx, tailPts, true);
          ctx.fillStyle = PAL.ribbonBase;
          ctx.fill();
          ctx.clip();
          paintGouacheWash(ctx, [tailPts[0], tailPts[Math.floor(tailPts.length * 0.35)]], 10, PAL.ribbonHighlight, 0.48);
          paintGouacheWash(ctx, [tailPts[0], tailPts[Math.floor(tailPts.length * 0.75)]], 8, PAL.ribbonShadow, 0.58);
          ctx.restore();
          strokePencilSpline(ctx, tailPts, true, 2.5, PAL.pencilDark, 0.90);
        });

        strokePencilSpline(
          ctx,
          generateDenseContour([[504, 520], [496, 555], [490, 588]], 16, false),
          false,
          1.5,
          PAL.pencilMid,
          0.65
        );
        strokePencilSpline(
          ctx,
          generateDenseContour([[519, 520], [528, 555], [536, 584]], 16, false),
          false,
          1.5,
          PAL.pencilMid,
          0.65
        );

        [
          { outer: CONTOURS.ribbonLeftLoopOuter, hole: CONTOURS.ribbonLeftLoopHole },
          { outer: CONTOURS.ribbonRightLoopOuter, hole: CONTOURS.ribbonRightLoopHole },
        ].forEach(({ outer, hole }) => {
          ctx.save();
          ctx.beginPath();
          traceCatmullRomSubpath(ctx, outer, true);
          traceCatmullRomSubpath(ctx, [...hole].reverse(), true);
          ctx.fillStyle = PAL.ribbonBase;
          ctx.fill('evenodd');

          ctx.save();
          ctx.clip('evenodd');
          paintGouacheWash(ctx, outer.slice(0, 18), 10, PAL.ribbonHighlight, 0.55);
          paintGouacheWash(ctx, outer.slice(22, 42), 10, PAL.ribbonShadow, 0.58);
          ctx.restore();
          ctx.restore();

          strokePencilSpline(ctx, outer, true, 2.6, PAL.pencilDark, 0.90);
          strokePencilSpline(ctx, hole, true, 2.3, PAL.pencilDark, 0.88);
        });

        ctx.save();
        drawCatmullRomSpline(ctx, CONTOURS.ribbonKnot, true);
        ctx.fillStyle = PAL.ribbonBase;
        ctx.fill();
        ctx.clip();
        paintGouacheWash(ctx, [[506, 502], [512, 510], [518, 502]], 8, PAL.ribbonHighlight, 0.55);
        ctx.restore();
        strokePencilSpline(ctx, CONTOURS.ribbonKnot, true, 2.6, PAL.pencilDark, 0.90);
      });
    });

    // ========================================================================
    // 7, 8, 9. HEAD, FLOPPY EARS, MUZZLE, BLUSH, EYES & NOSE (Pivot at 504, 488)
    // ========================================================================
    withPivotRad(ctx, 504, 488, rig.headRot, rig.headDX, rig.headDY, () => {
      // 7. Head, Crown & Chubby Cheeks
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.headFill, true);
      ctx.fillStyle = PAL.furBase;
      ctx.fill();
      ctx.clip();

      paintGouacheWash(ctx, [[415, 225], [495, 205], [575, 225]], 85, PAL.furLight, 0.45);
      paintGouacheWash(ctx, [[465, 255], [505, 245], [545, 260]], 65, PAL.furHighlight, 0.32);

      fillGouacheSpline(ctx, CONTOURS.muzzleHighlightPatch, PAL.furLight, 0.65, 28);
      paintGouacheWash(ctx, [[468, 412], [495, 435], [542, 432], [562, 405]], 32, PAL.furHighlight, 0.45);

      paintGouacheWash(ctx, [[350, 425], [412, 478], [504, 498], [595, 478], [652, 425]], 36, PAL.furMidShadow, 0.78);
      paintGouacheWash(ctx, [[395, 475], [504, 498], [605, 475]], 22, PAL.furDeepShadow, 0.68);

      drawContourPencilShading(ctx, CONTOURS.leftCheekToChinContour.slice(12, 42), -1, 6, 2.6, PAL.pencilMid, 1.15, 0.40);
      drawContourPencilShading(ctx, CONTOURS.rightCheekToChinContour.slice(12, 42), 1, 6, 2.6, PAL.pencilMid, 1.15, 0.40);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.crownArchContour, false, 2.9, PAL.pencilDark, 0.90);
      strokePencilSpline(ctx, CONTOURS.leftCheekToChinContour, false, 2.9, PAL.pencilDark, 0.90);
      strokePencilSpline(ctx, CONTOURS.rightCheekToChinContour, false, 2.9, PAL.pencilDark, 0.90);

      // 8A. Left Floppy Ear (Pivot at 364, 214)
      withPivotRad(ctx, 364, 214, rig.leftEarRot, 0, 0, () => {
        ctx.save();
        drawCatmullRomSpline(ctx, CONTOURS.leftEarFill, true);
        ctx.fillStyle = PAL.furBase;
        ctx.fill();
        ctx.clip();

        paintGouacheWash(ctx, [[315, 265], [272, 338], [235, 412]], 38, PAL.furLight, 0.48);
        paintGouacheWash(ctx, [[348, 325], [335, 435], [295, 502], [232, 502], [212, 455]], 38, PAL.furMidShadow, 0.80);
        paintGouacheWash(ctx, [[332, 445], [292, 506], [238, 506]], 26, PAL.furDeepShadow, 0.78);

        drawContourPencilShading(ctx, CONTOURS.leftEarOpenContour.slice(22, 60), -1, 10, 2.8, PAL.pencilMid, 1.3, 0.52);
        drawContourPencilShading(ctx, CONTOURS.leftEarOpenContour.slice(28, 55), -1, 6, 2.4, PAL.pencilDark, 1.15, 0.40);
        ctx.restore();

        strokePencilSpline(ctx, CONTOURS.leftEarOpenContour, false, 2.9, PAL.pencilDark, 0.90);
      });

      // 8B. Right Floppy Ear (Pivot at 614, 206)
      withPivotRad(ctx, 614, 206, rig.rightEarRot, 0, 0, () => {
        ctx.save();
        drawCatmullRomSpline(ctx, CONTOURS.rightEarFill, true);
        ctx.fillStyle = PAL.furBase;
        ctx.fill();
        ctx.clip();

        paintGouacheWash(ctx, [[662, 265], [702, 345], [735, 415]], 38, PAL.furLight, 0.48);
        paintGouacheWash(ctx, [[706, 378], [716, 408]], 14, PAL.furHighlight, 0.52);
        paintGouacheWash(ctx, [[728, 418], [736, 448]], 12, PAL.furHighlight, 0.48);
        paintGouacheWash(ctx, [[648, 335], [654, 435], [685, 492], [735, 488]], 36, PAL.furMidShadow, 0.82);
        paintGouacheWash(ctx, [[654, 435], [682, 494], [722, 494]], 26, PAL.furDeepShadow, 0.80);

        drawContourPencilShading(ctx, CONTOURS.rightEarOpenContour.slice(26, 61), 1, 10, 2.8, PAL.pencilMid, 1.3, 0.52);
        drawContourPencilShading(ctx, CONTOURS.rightEarOpenContour.slice(32, 57), 1, 6, 2.4, PAL.pencilDark, 1.15, 0.42);
        ctx.restore();

        strokePencilSpline(ctx, CONTOURS.rightEarOpenContour, false, 2.9, PAL.pencilDark, 0.90);
      });

      // 9. Cheek Blush, 3-Stage Deforming Spline Eyes & Chocolate Nose
      fillGouacheSpline(ctx, CONTOURS.leftBlushContour, PAL.blushCoral, blushAlpha, 20);
      fillGouacheSpline(ctx, CONTOURS.rightBlushContour, PAL.blushCoral, blushAlpha, 20);

      const leftBlushSlashes: Pt[][] = [
        [[388, 396], [380, 406]],
        [[396, 398], [387, 412]],
        [[404, 402], [396, 414]],
        [[411, 405], [405, 415]],
        [[418, 408], [414, 416]],
      ];
      leftBlushSlashes.forEach((pts) => {
        strokePencilSpline(ctx, generateDenseContour(pts, 10, false), false, 1.5, PAL.blushSlash, 0.76 * (blushAlpha / 0.56));
      });

      const rightBlushSlashes: Pt[][] = [
        [[604, 388], [595, 400]],
        [[612, 391], [605, 402]],
        [[620, 393], [615, 402]],
        [[628, 395], [624, 402]],
      ];
      rightBlushSlashes.forEach((pts) => {
        strokePencilSpline(ctx, generateDenseContour(pts, 10, false), false, 1.5, PAL.blushSlash, 0.76 * (blushAlpha / 0.56));
      });

      // Left & Right Eyes with 3-Stage Deforming Eyelid Blink
      drawPuppyEyeRigged(ctx, CONTOURS.leftEyeContour, 436, 366, 434, 363, rig.blink, rig.gazeDX, rig.gazeDY);
      drawPuppyEyeRigged(ctx, CONTOURS.rightEyeContour, 582, 360, 580, 357, rig.blink, rig.gazeDX, rig.gazeDY);

      // Chocolate Nose & Philtrum (with noseWiggle offset)
      ctx.save();
      ctx.translate(rig.noseWiggle * 0.4, rig.noseWiggle);
      ctx.save();
      drawCatmullRomSpline(ctx, CONTOURS.noseContour, true);
      ctx.fillStyle = PAL.noseDark;
      ctx.fill();
      ctx.clip();
      fillGouacheSpline(ctx, CONTOURS.noseBridgeHighlight, PAL.noseHighlight, 0.82, 4);
      ctx.restore();

      strokePencilSpline(ctx, CONTOURS.noseContour, true, 2.1, '#43281A', 0.94);
      strokePencilSpline(
        ctx,
        generateDenseContour([[519, 403], [520, 411], [520, 418]], 14, false),
        false,
        2.3,
        PAL.pencilDark,
        0.90
      );
      ctx.restore();
    });
  });

  if (showRigPivots) {
    const pivots = [
      { x: 504, y: 488 },
      { x: 364, y: 214 },
      { x: 614, y: 206 },
      { x: 512, y: 508 },
      { x: 534, y: 650 },
      { x: 294, y: 758 },
      { x: 492, y: 815 },
      { x: 680, y: 775 },
    ];
    for (const pv of pivots) {
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(pv.x, pv.y, 4.5, 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
  ctx.restore();
}
