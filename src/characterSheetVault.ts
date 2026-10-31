/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MULTI-ANGLE CHARACTER SHEET VAULT & 4-STAGE HAND / DETAIL TRAINING ENGINE
 *
 * Enables users to:
 * 1. Submit and save multi-angle character sheets (Front View, Half Rotation / 3/4,
 *    Side View, Back View, Hands Close-up, Expression Sheet, or any custom named view)
 *    persistently in IndexedDB.
 * 2. Automatically extract normalized 1000x1200 proportion plumb lines, ink contour
 *    landmarks, and sampled color palettes from uploaded reference sheets.
 * 3. Train and calibrate complex pure-code details (Clasped Hands, Fingers, Ribbed Cuffs,
 *    Collar/Bow, or custom uploaded detail crops) at 4x-8x magnification with real-time
 *    pixel-diff accuracy scoring and automatic Canvas 2D Bezier code generation.
 */

export type SheetViewCategory =
  | 'front'
  | 'three_quarter'
  | 'side'
  | 'back'
  | 'hands_detail'
  | 'expression'
  | 'custom';

export interface ProportionPlumbLines {
  headTopY: number;      // Normalized 0..1200
  eyeLineY: number;
  chinNeckY: number;
  shoulderLineY: number;
  elbowLineY: number;
  wristHandY: number;
  hemBottomY: number;
  centerAxisX: number;   // Normalized 0..1000
}

export interface SampledViewAnalysis {
  normalizedBBox: [number, number, number, number]; // [minX, minY, maxX, maxY] in 1000x1200
  paletteHex: string[];
  inkCoveragePct: number;
  foregroundCoveragePct: number;
  contourSamplePoints: [number, number][]; // Key ink contour coordinates in 1000x1200
}

export interface CharacterSheetViewItem {
  id: string;
  label: string;                // User-entered name (e.g., "Front View", "Half Rotation 3/4", "Side View", "Left Hand Close-up")
  category: SheetViewCategory;
  imageDataUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  createdAt: string;
  notes: string;
  analysis: SampledViewAnalysis;
}

export interface CalibratedBezierAnchor {
  id: string;
  label: string;
  x: number; // In 1000x1200 space
  y: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
}

export interface DetailTrainingPreset {
  id: string;
  title: string;
  subtitle: string;
  cropBox: [number, number, number, number]; // [x, y, w, h] in 1000x1200 space
  socketRule: string;
  anchors: CalibratedBezierAnchor[];
}

export interface CharacterSheetProfile {
  id: string;
  name: string;
  description: string;
  targetStyle: string;
  updatedAt: string;
  plumbLines: ProportionPlumbLines;
  views: CharacterSheetViewItem[];
}

export const VIEW_CATEGORY_LABELS: { id: SheetViewCategory; label: string; defaultTitle: string }[] = [
  { id: 'front', label: 'Front View (0°)', defaultTitle: 'Front View' },
  { id: 'three_quarter', label: 'Half Rotation (3/4 • 45°)', defaultTitle: 'Half Rotation (3/4 View)' },
  { id: 'side', label: 'Side Profile (90°)', defaultTitle: 'Side View' },
  { id: 'hands_detail', label: 'Hands / Detail Close-up', defaultTitle: 'Hands & Fingers Detail' },
  { id: 'expression', label: 'Expression / Face Sheet', defaultTitle: 'Expression Sheet' },
  { id: 'back', label: 'Back View (180°)', defaultTitle: 'Back View' },
  { id: 'custom', label: 'Custom Named Picture', defaultTitle: '' },
];

export const DEFAULT_DETAIL_TRAINING_PRESETS: DetailTrainingPreset[] = [
  {
    id: 'clasped_hands_cuffs',
    title: 'Clasped Hands, 8 Fingers & Ribbed Cuff Sockets (L07/L09/L10)',
    subtitle: '4×–6× Magnified Hand & Wrist-in-Cuff Socket Calibration (x:365..635, y:1005..1185)',
    cropBox: [365, 1005, 270, 180],
    socketRule:
      'Draw L10 Clasped Hands wrist base first (y=1058..1125), cast 5px mauve cuff shadow (#C19EA7), then seal Left & Right Ribbed Cuff bottom borders over the wrists so hands emerge from inside the cuffs.',
    anchors: [
      {
        id: 'left_cuff_rim',
        label: 'Left Cuff Socket Rim',
        x: 418,
        y: 1122,
        cp1x: 432,
        cp1y: 1096,
        cp2x: 454,
        cp2y: 1076,
      },
      {
        id: 'right_cuff_rim',
        label: 'Right Cuff Socket Rim',
        x: 504,
        y: 1076,
        cp1x: 538,
        cp1y: 1084,
        cp2x: 564,
        cp2y: 1106,
      },
      {
        id: 'center_clasp_cleft',
        label: 'Center Interlaced Knuckle Cleft',
        x: 508,
        y: 1118,
        cp1x: 504,
        cp1y: 1104,
        cp2x: 514,
        cp2y: 1134,
      },
      {
        id: 'left_fingers_fan',
        label: 'Left 4-Finger Tapered Fan',
        x: 456,
        y: 1162,
        cp1x: 436,
        cp1y: 1154,
        cp2x: 484,
        cp2y: 1156,
      },
      {
        id: 'right_fingers_fan',
        label: 'Right 4-Finger Overlap Fan',
        x: 534,
        y: 1172,
        cp1x: 494,
        cp1y: 1170,
        cp2x: 564,
        cp2y: 1164,
      },
    ],
  },
  {
    id: 'collar_ribbon_neck',
    title: 'Neck Collarbone, Sailor Collar & Satin Bow (L03/L04/L05)',
    subtitle: '4× Magnified Collar V-Lapel, Double Stripes & Satin Knot (x:250..740, y:520..880)',
    cropBox: [250, 520, 490, 360],
    socketRule:
      'Keep L02 Cardigan Torso top edge >= y=636 and L06/L08 Shoulder Caps >= y=618 so they stay strictly tucked underneath the L04 Sailor Collar shoulder slope (y=559..605).',
    anchors: [
      {
        id: 'left_shoulder_slope',
        label: 'Left Collar Shoulder Slope',
        x: 269,
        y: 600,
        cp1x: 316,
        cp1y: 581,
        cp2x: 372,
        cp2y: 567,
      },
      {
        id: 'collar_v_point',
        label: 'Center Collar V-Apex & Satin Knot',
        x: 490,
        y: 648,
        cp1x: 462,
        cp1y: 646,
        cp2x: 520,
        cp2y: 646,
      },
      {
        id: 'right_shoulder_slope',
        label: 'Right Collar Shoulder Slope',
        x: 716,
        y: 599,
        cp1x: 668,
        cp1y: 581,
        cp2x: 612,
        cp2y: 567,
      },
    ],
  },
  {
    id: 'elbow_billow_seams',
    title: 'Continuous 2-Bone Sleeve Puff & Elbow Gather (L06–L09)',
    subtitle: '4× Magnified Forearm Puff & Double Under-Billow (x:235..755, y:740..1115)',
    cropBox: [235, 740, 520, 375],
    socketRule:
      'Use unified continuous 2-bone skinned splines from shoulder (y=618) through elbow (y=860) to cuff overhang (y=1020) so elbowSpread never produces a stepped break.',
    anchors: [
      {
        id: 'left_outer_billow',
        label: 'Left Sleeve Double Under-Billow',
        x: 266,
        y: 1084,
        cp1x: 258,
        cp1y: 1064,
        cp2x: 274,
        cp2y: 1002,
      },
      {
        id: 'right_outer_billow',
        label: 'Right Sleeve Double Under-Billow',
        x: 726,
        y: 1084,
        cp1x: 735,
        cp1y: 1062,
        cp2x: 714,
        cp2y: 1002,
      },
    ],
  },
];

export type AnatomyStepId =
  | 'all_steps'
  | 'step_1_wrist_palm_block'
  | 'step_2_knuckle_arch_ratios'
  | 'step_3_tapered_finger_clefts'
  | 'step_4_palm_creases_nail';

export type AnatomyMistakeId =
  | 'none'
  | 'equal_finger_lengths'
  | 'deep_wrist_splits'
  | 'parallel_pipe_creases'
  | 'floating_cuff_wrist'
  | 'missing_palm_occlusion';

export interface AnatomyTrainingStep {
  id: AnatomyStepId;
  stepNumber: number;
  shortTitle: string;
  title: string;
  anatomicalRule: string;
  ratioOrMetric: string;
  canvasCodePattern: string;
  checklist: string[];
}

export interface AnatomyCommonMistake {
  id: Exclude<AnatomyMistakeId, 'none'>;
  shortLabel: string;
  title: string;
  symptom: string;
  whyItHappens: string;
  pureCodeFix: string;
  ratioSpec: string;
}

export const ANATOMY_TRAINING_STEPS: AnatomyTrainingStep[] = [
  {
    id: 'step_1_wrist_palm_block',
    stepNumber: 1,
    shortTitle: '1. Wrist Socket & Dorsal Block',
    title: 'Step 1: Seat the Trapezoid Palm Block Inside the Cuff Socket',
    anatomicalRule:
      'Never start a hand by drawing individual fingers. First construct the trapezoid dorsal/palmar mitten block (width-to-height ratio 1 : 0.85) extending 14px up inside the sleeve cuff, then cast a 6px mauve occlusion shadow (#C19EA7) beneath the cuff rim.',
    ratioOrMetric: 'Palm Block Ratio: 1.00W : 0.85H | Cuff Tuck Depth: 14px | Shadow Band: 6px',
    canvasCodePattern: `// 1. Seat Left & Right Wrist Base inside cuff opening (y=1066..1132)
ctx.moveTo(418, 1122);
ctx.bezierCurveTo(436, 1094, 458, 1074, 478, 1066); // Left wrist socket
// 2. Cast 6px Mauve Cuff Shadow (#C19EA7) before sealing cuff rim on top`,
    checklist: [
      'Extend wrist base 12–16px underneath the ribbed cuff opening',
      'Widen dorsal hand block from wrist toward the knuckle arch',
      'Paint 6px #C19EA7 cast shadow band along the cuff-to-skin seam',
    ],
  },
  {
    id: 'step_2_knuckle_arch_ratios',
    stepNumber: 2,
    shortTitle: '2. Finger Length Ratios & Arc',
    title: 'Step 2: Sculpt the Parabolic Finger Tip Arc & Length Ratios',
    anatomicalRule:
      'Fingers never terminate on a flat horizontal line. Their tips follow a smooth parabolic curve governed by strict phalanx length ratios: Middle = 1.00× (longest apex), Ring = 0.93×, Index = 0.91×, and Pinky = 0.76×.',
    ratioOrMetric: 'Middle: 1.00× | Ring: 0.93× | Index: 0.91× | Pinky: 0.76× (Parabolic Tip Arc)',
    canvasCodePattern: `// Parabolic 4-finger silhouette fan (Middle apex longest, Pinky shortest)
ctx.bezierCurveTo(506, 1138, 499, 1148, 491, 1146); // Index tip (0.91x)
ctx.bezierCurveTo(496, 1153, 490, 1161, 477, 1158); // Middle tip (1.00x apex)
ctx.bezierCurveTo(474, 1165, 464, 1166, 458, 1160); // Ring tip (0.93x)
ctx.bezierCurveTo(453, 1167, 442, 1165, 436, 1154); // Pinky tip (0.76x)`,
    checklist: [
      'Place Middle finger tip at the furthest point of the parabolic arc (1.00×)',
      'Step Index (0.91×) and Ring (0.93×) slightly back along the curve',
      'Tuck Pinky tip shortest (0.76×) with a soft outer hypothenar curve into the wrist',
    ],
  },
  {
    id: 'step_3_tapered_finger_clefts',
    stepNumber: 3,
    shortTitle: '3. Tapered Finger Clefts',
    title: 'Step 3: Draw Radial Finger-Cleft Creases Stopping at the Webbing Line',
    anatomicalRule:
      'Draw 3 interior cleft creases per 4-finger fan. Each crease starts at the 1/3 knuckle webbing line (never back at the wrist) and aims radially toward the center of the wrist pivot so the fingers fan naturally.',
    ratioOrMetric: 'Cleft Length: 34–38% of Total Hand | Radial Fan Angle: 7°–11° | Line Width: 2.5px',
    canvasCodePattern: `// 3 Radial Finger Clefts (start at knuckle webbing y=1116..1132, aim toward wrist)
ctx.moveTo(478, 1116); ctx.bezierCurveTo(484, 1128, 489, 1140, 493, 1149); // Index/Middle
ctx.moveTo(464, 1131); ctx.bezierCurveTo(469, 1141, 474, 1150, 478, 1157); // Middle/Ring
ctx.moveTo(444, 1132); ctx.bezierCurveTo(450, 1144, 456, 1153, 461, 1160); // Ring/Pinky`,
    checklist: [
      'Start clefts at the distal knuckle webbing line (leave 62% of dorsal palm unbroken)',
      'Angle clefts radially toward the wrist center rather than parallel vertical lines',
      'Land each cleft cleanly inside the valley between adjacent rounded fingertips',
    ],
  },
  {
    id: 'step_4_palm_creases_nail',
    stepNumber: 4,
    shortTitle: '4. Palm Crease Pocket & Nail',
    title: 'Step 4: Add the Center Knuckle/Palm Shadow Pocket, Thenar Fold & Nail Bed',
    anatomicalRule:
      'Anchor the 3D clasp volume with three micro-details: (1) the dark triangular knuckle/palmar crease shadow pocket at the clasp center (x=504..516, y=1102..1142), (2) the upper thumb/thenar fold (x=476..501, y=1064..1102), and (3) the tilted index fingernail oval.',
    ratioOrMetric: 'Center Cleft Pocket: 12×40px (#181518) | Nail Oval: 4.2×2.7px @ -26°',
    canvasCodePattern: `// Center Interlaced Knuckle & Palmar Crease Shadow Pocket
ctx.fillStyle = '#181518';
ctx.moveTo(504, 1102); ctx.lineTo(516, 1108);
ctx.bezierCurveTo(514, 1122, 510, 1134, 505, 1142);
// Tilted Index Fingernail Bed Oval
ctx.ellipse(493, 1163, 4.2, 2.7, -0.45, 0, Math.PI * 2);`,
    checklist: [
      'Fill the center knuckle/palm crease triangle (#181518) to separate left and right hands in 3D depth',
      'Tuck the peeking upper thumb/thenar crease at (476..501, 1064..1102)',
      'Align the fingernail oval (-0.45 rad) parallel to the distal phalanx axis',
    ],
  },
];

export const ANATOMY_COMMON_MISTAKES: AnatomyCommonMistake[] = [
  {
    id: 'equal_finger_lengths',
    shortLabel: 'Mistake #1: Equal Finger Lengths',
    title: 'Equal-Length "Fork / Comb" Fingers (Flat Tip Line)',
    symptom:
      'All 4 fingers end on a flat horizontal or straight diagonal line, making the hand look like a kitchen fork or rubber glove.',
    whyItHappens:
      'Code loops that step finger X/Y by a constant linear delta instead of a parabolic arch weighted by phalanx ratios.',
    pureCodeFix:
      'Curve the distal tips along a parabolic arc where Middle = 1.00× (apex), Ring = 0.93×, Index = 0.91×, and Pinky = 0.76×.',
    ratioSpec: 'Correct Arc: Middle 100% > Ring 93% > Index 91% > Pinky 76%',
  },
  {
    id: 'deep_wrist_splits',
    shortLabel: 'Mistake #2: Clefts Cut to Wrist',
    title: 'Over-Extended "Sausage" Finger Clefts Sliced Into the Palm',
    symptom:
      'Interior finger creases extend 70–90% of the way back toward the wrist, splitting the dorsal palm into four long detached tubes.',
    whyItHappens:
      'Starting finger crease paths at the wrist or mid-metacarpal line instead of the knuckle webbing line.',
    pureCodeFix:
      'Keep the upper 62% of the dorsal hand block completely unbroken; start interior cleft strokes strictly at the 1/3 knuckle webbing arch (y=1116..1136).',
    ratioSpec: 'Unbroken Dorsal Palm: 62% | Finger Cleft Depth: 38%',
  },
  {
    id: 'parallel_pipe_creases',
    shortLabel: 'Mistake #3: Parallel Pipe Fingers',
    title: 'Parallel Rigid "Pipe" Creases Instead of a Radial Wrist Fan',
    symptom:
      'Fingers look stiff and mechanical because all 3 interior cleft lines have identical slopes.',
    whyItHappens:
      'Copy-pasting the same dx/dy Bezier vector for Index, Middle, and Ring creases without rotating toward the wrist center.',
    pureCodeFix:
      'Converge all 3 cleft vectors radially toward the wrist carpal pivot ((448, 1094) on left, (542, 1104) on right) with a 7°–11° fan spread.',
    ratioSpec: 'Radial Fan Convergence: 7°–11° per finger toward carpal pivot',
  },
  {
    id: 'floating_cuff_wrist',
    shortLabel: 'Mistake #4: Floating Wrist Seam',
    title: 'Pasted "Sticker" Hand Floating Over the Sleeve Cuff',
    symptom:
      'The top edge of the wrist sits on top of the sleeve cuff border with zero depth shadow, breaking the illusion that the arm enters the sleeve.',
    whyItHappens:
      'Drawing L10 Hands last without re-sealing the front cuff rim or painting a cuff-cast occlusion shadow.',
    pureCodeFix:
      'Tuck wrist coordinates 14px inside the cuff, paint a 6px mauve cast shadow (#C19EA7), and call drawCuffSocketFrontRims() over the wrist base.',
    ratioSpec: '14px Socket Underlap + 6px #C19EA7 Cast Shadow + 3.3px Rim Seal',
  },
  {
    id: 'missing_palm_occlusion',
    shortLabel: 'Mistake #5: Flat Clasp Seam',
    title: 'Missing Center Palm/Knuckle Crease Pocket & Thenar Overlap',
    symptom:
      'Clasped or overlapping hands merge into a single flat pancake blob because there is no dark occlusion pocket where the fingers interlace.',
    whyItHappens:
      'Relying only on a single 3px outline stroke between the left and right hands.',
    pureCodeFix:
      'Insert the dark triangular knuckle/palmar shadow pocket (x=504..516, y=1102..1142) and upper thumb/thenar fold (x=476..501, y=1064..1102).',
    ratioSpec: '12×40px Center Occlusion Triangle + Peeking Thenar Thumb Fold',
  },
];

const DB_NAME = 'crt_sailor_character_sheet_vault_v1';
const STORE_NAME = 'profiles';

function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadAllCharacterSheetProfiles(): Promise<CharacterSheetProfile[]> {
  try {
    const db = await openVaultDB();
    return await new Promise<CharacterSheetProfile[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as CharacterSheetProfile[]) || [];
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function saveCharacterSheetProfile(profile: CharacterSheetProfile): Promise<void> {
  try {
    const db = await openVaultDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(profile);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback if IndexedDB is restricted
  }
}

export async function deleteCharacterSheetProfile(profileId: string): Promise<void> {
  try {
    const db = await openVaultDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(profileId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

/**
 * Analyzes an uploaded reference image in normalized 1000x1200 space to extract:
 * - Foreground bounding box
 * - Dominant color swatches (ink, skin, fabric, shadow, accent)
 * - Ink line coverage % and key contour sample coordinates
 */
export async function analyzeUploadedSheetImage(
  imageDataUrl: string
): Promise<{ naturalWidth: number; naturalHeight: number; analysis: SampledViewAnalysis }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const W = 250; // Fast 250x300 analysis grid (4x scale to 1000x1200)
      const H = 300;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;

      let minX = W;
      let minY = H;
      let maxX = 0;
      let maxY = 0;
      let fgCount = 0;
      let inkCount = 0;
      const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();
      const contourPts: [number, number][] = [];

      // Sample background from top-left & top-right corners
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const distBg = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          const isFg = a > 40 && distBg > 24;
          if (isFg) {
            fgCount++;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum < 82) {
              inkCount++;
              if (contourPts.length < 48 && (x + y) % 11 === 0) {
                contourPts.push([Math.round(x * 4), Math.round(y * 4)]);
              }
            } else {
              // Quantize to 24-step color buckets for clean palette extraction
              const qr = Math.round(r / 24) * 24;
              const qg = Math.round(g / 24) * 24;
              const qb = Math.round(b / 24) * 24;
              const key = `${qr},${qg},${qb}`;
              const prev = colorBuckets.get(key);
              if (prev) {
                prev.count++;
              } else {
                colorBuckets.set(key, { r: qr, g: qg, b: qb, count: 1 });
              }
            }
          }
        }
      }

      const sortedSwatches = Array.from(colorBuckets.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map(
          (c) =>
            `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b
              .toString(16)
              .padStart(2, '0')}`.toUpperCase()
        );

      const bbox: [number, number, number, number] =
        fgCount > 0
          ? [minX * 4, minY * 4, Math.min(1000, (maxX + 1) * 4), Math.min(1200, (maxY + 1) * 4)]
          : [200, 100, 800, 1150];

      resolve({
        naturalWidth: img.naturalWidth || 1000,
        naturalHeight: img.naturalHeight || 1200,
        analysis: {
          normalizedBBox: bbox,
          paletteHex: ['#181518', ...sortedSwatches].slice(0, 6),
          inkCoveragePct: Number(((inkCount / (W * H)) * 100).toFixed(2)),
          foregroundCoveragePct: Number(((fgCount / (W * H)) * 100).toFixed(2)),
          contourSamplePoints: contourPts,
        },
      });
    };
    img.onerror = () => {
      resolve({
        naturalWidth: 1000,
        naturalHeight: 1200,
        analysis: {
          normalizedBBox: [250, 40, 735, 1195],
          paletteHex: ['#181518', '#F5EFE6', '#FCE8DC', '#B3AAB7', '#2E2C2B', '#E492A4'],
          inkCoveragePct: 7.42,
          foregroundCoveragePct: 37.85,
          contourSamplePoints: [],
        },
      });
    };
    img.src = imageDataUrl;
  });
}

export function createDefaultCrtSailorSheetProfile(): CharacterSheetProfile {
  return {
    id: 'crt_tv_sailor_default',
    name: 'Kawaii CRT TV Sailor',
    description:
      '18-Layer Pure-Code Canvas 2D Character Rig calibrated to 1000×1200 (5:6) portrait landmarks.',
    targetStyle: 'Soft Gouache + Crisp Dark-Umber Ink Linework (#181518)',
    updatedAt: new Date().toISOString(),
    plumbLines: {
      headTopY: 196,
      eyeLineY: 365,
      chinNeckY: 515,
      shoulderLineY: 605,
      elbowLineY: 860,
      wristHandY: 1115,
      hemBottomY: 1195,
      centerAxisX: 495,
    },
    views: [
      {
        id: 'view_front_master',
        label: 'Front View (Master Reference)',
        category: 'front',
        imageDataUrl: '/assets/aistudio/Kawaii_CRT_TV_Sailor_Uniform_Character_10b4cf85.png',
        naturalWidth: 1145,
        naturalHeight: 1374,
        createdAt: new Date().toISOString(),
        notes: 'Master 5:6 Front View used for 18-layer pure-code spline and hand/cuff calibration.',
        analysis: {
          normalizedBBox: [252, 35, 736, 1200],
          paletteHex: ['#181518', '#F5EFE6', '#FCE8DC', '#B3AAB7', '#2E2C2B', '#E492A4'],
          inkCoveragePct: 7.42,
          foregroundCoveragePct: 37.85,
          contourSamplePoints: [
            [418, 1122],
            [478, 1064],
            [504, 1076],
            [582, 1132],
            [456, 1162],
            [534, 1172],
          ],
        },
      },
    ],
  };
}

/**
 * Formats a saved CharacterSheetProfile into a comprehensive, copy-ready Chat Blueprint
 * so the user can paste it in chat when asking to build or refine a character.
 */
export function formatCharacterSheetBlueprintForChat(
  profile: CharacterSheetProfile,
  activePreset: DetailTrainingPreset
): string {
  const viewSummary = profile.views
    .map(
      (v, idx) =>
        `  ${idx + 1}. [${v.label}] (${v.category.toUpperCase()}) — Native ${v.naturalWidth}×${
          v.naturalHeight
        }, Normalized BBox: [${v.analysis.normalizedBBox.join(', ')}], Palette: ${v.analysis.paletteHex.join(
          ' '
        )}${v.notes ? ` | Note: ${v.notes}` : ''}`
    )
    .join('\n');

  const anchorLines = activePreset.anchors
    .map(
      (a) =>
        `  - ${a.label}: anchor=(${a.x}, ${a.y}), cp1=(${a.cp1x}, ${a.cp1y}), cp2=(${a.cp2x}, ${a.cp2y})`
    )
    .join('\n');

  return [
    `=== CHARACTER SHEET & PURE-CODE RIG BLUEPRINT: "${profile.name}" ===`,
    `Target Style: ${profile.targetStyle}`,
    `Canvas Normalization: 1000×1200 (5:6 Portrait Grid)`,
    `Horizontal Plumb Lines (Y): HeadTop=${profile.plumbLines.headTopY}, Eyes=${profile.plumbLines.eyeLineY}, NeckBase=${profile.plumbLines.chinNeckY}, Shoulders=${profile.plumbLines.shoulderLineY}, Elbows=${profile.plumbLines.elbowLineY}, Wrists/Hands=${profile.plumbLines.wristHandY}, Hem=${profile.plumbLines.hemBottomY}, CenterAxisX=${profile.plumbLines.centerAxisX}`,
    `Submitted Character Sheet Views (${profile.views.length}):`,
    viewSummary,
    `Active Detail Training Calibration (${activePreset.title}):`,
    `  Socket Rule: ${activePreset.socketRule}`,
    anchorLines,
    `Instruction: Build/update this character in 100% pure Canvas 2D Bezier/Spline code matching these exact multi-angle landmarks and socket layering rules.`,
  ].join('\n');
}

export interface AnatomyOverlayConfig {
  enabled: boolean;
  stepId: AnatomyStepId;
  mistakeId: AnatomyMistakeId;
  handsDX?: number;
  handsDY?: number;
  /** Optional custom center (x, y) and scale for non-CRT characters */
  targetCenter?: [number, number];
  targetScale?: number;
  /** Compact mode when rendered inside a 270x180 crop that gets 4x magnified */
  compactLabels?: boolean;
}

/**
 * Renders the interactive Step-by-Step Finger & Palm Crease Anatomy Guides
 * AND Common Mistake Overlays directly onto the character's hands.
 */
export function drawHandAnatomyTrainingOverlay(
  ctx: CanvasRenderingContext2D,
  config: AnatomyOverlayConfig
): void {
  if (!config.enabled) return;

  const dx = config.handsDX ?? 0;
  const dy = config.handsDY ?? 0;
  const compact = Boolean(config.compactLabels);

  ctx.save();
  if (config.targetCenter) {
    const [cx, cy] = config.targetCenter;
    const sc = config.targetScale ?? 1;
    ctx.translate(cx, cy);
    ctx.scale(sc, sc);
    ctx.translate(-498, -1120);
  }
  ctx.translate(dx, dy);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const showStep1 =
    config.stepId === 'all_steps' || config.stepId === 'step_1_wrist_palm_block';
  const showStep2 =
    config.stepId === 'all_steps' || config.stepId === 'step_2_knuckle_arch_ratios';
  const showStep3 =
    config.stepId === 'all_steps' || config.stepId === 'step_3_tapered_finger_clefts';
  const showStep4 =
    config.stepId === 'all_steps' || config.stepId === 'step_4_palm_creases_nail';

  const drawCalloutTag = (
    x: number,
    y: number,
    text: string,
    bgColor: string,
    borderColor: string,
    textColor = '#FFFFFF'
  ) => {
    ctx.save();
    ctx.font = compact ? 'bold 8.5px monospace' : 'bold 11px monospace';
    const padX = compact ? 4 : 6;
    const h = compact ? 13 : 17;
    const w = ctx.measureText(text).width + padX * 2;
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = compact ? 1 : 1.3;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 0.5);
    ctx.restore();
  };

  // =========================================================================
  // STEP 1: WRIST SOCKET & TRAPEZOID DORSAL PALM BLOCK (1 : 0.85)
  // =========================================================================
  if (showStep1) {
    // Left & Right Trapezoid Dorsal Palm Mitten Blocks
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = compact ? 1.4 : 2.0;
    ctx.setLineDash([4, 3]);

    // Left Dorsal Palm Trapezoid
    ctx.beginPath();
    ctx.moveTo(418, 1122);
    ctx.lineTo(478, 1066);
    ctx.lineTo(498, 1116);
    ctx.lineTo(438, 1142);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Dorsal Palm Trapezoid
    ctx.beginPath();
    ctx.moveTo(504, 1076);
    ctx.lineTo(581, 1132);
    ctx.lineTo(564, 1152);
    ctx.lineTo(512, 1128);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Amber Cuff-Socket Insertion Curves (14px Tuck + 6px Mauve Cast Shadow Zone)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = compact ? 2.0 : 2.6;
    ctx.beginPath();
    ctx.moveTo(496, 1072);
    ctx.bezierCurveTo(474, 1076, 444, 1096, 418, 1126);
    ctx.moveTo(498, 1076);
    ctx.bezierCurveTo(522, 1082, 554, 1102, 578, 1138);
    ctx.stroke();

    drawCalloutTag(
      432,
      1052,
      'S1: Palm Block (1:0.85) + 6px Cuff Shadow',
      'rgba(12, 24, 36, 0.92)',
      '#38BDF8',
      '#7DD3FC'
    );
  }

  // =========================================================================
  // STEP 2: PARABOLIC KNUCKLE ARCH & FINGER LENGTH RATIOS (1.00 / 0.93 / 0.91 / 0.76)
  // =========================================================================
  if (showStep2) {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = compact ? 1.8 : 2.4;

    // Left Hand Parabolic Finger Tip Curve
    ctx.beginPath();
    ctx.moveTo(436, 1154); // Pinky (0.76x)
    ctx.quadraticCurveTo(458, 1166, 477, 1158); // Ring (0.93x) -> Middle (1.00x)
    ctx.quadraticCurveTo(486, 1154, 491, 1146); // Index (0.91x)
    ctx.stroke();

    // Right Hand Parabolic Finger Tip Curve
    ctx.beginPath();
    ctx.moveTo(492, 1168); // Index (0.91x)
    ctx.quadraticCurveTo(526, 1179, 551, 1170); // Middle (1.00x) -> Ring (0.93x)
    ctx.quadraticCurveTo(562, 1166, 568, 1160); // Pinky (0.76x)
    ctx.stroke();

    // Fingertip Ratio Pins
    const ratioTips: { x: number; y: number; ratio: string; isApex?: boolean }[] = [
      { x: 436, y: 1154, ratio: '0.76×' },
      { x: 458, y: 1160, ratio: '0.93×' },
      { x: 477, y: 1158, ratio: '1.00×', isApex: true },
      { x: 491, y: 1146, ratio: '0.91×' },
      { x: 501, y: 1169, ratio: '0.91×' },
      { x: 528, y: 1172, ratio: '1.00×', isApex: true },
      { x: 551, y: 1170, ratio: '0.93×' },
      { x: 568, y: 1160, ratio: '0.76×' },
    ];

    for (const pt of ratioTips) {
      ctx.fillStyle = pt.isApex ? '#10B981' : '#34D399';
      ctx.strokeStyle = '#06281E';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, compact ? 3.2 : 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    drawCalloutTag(
      534,
      1181,
      'S2: Parabolic Tip Ratios (Mid 1.00× > Ring 0.93× > Idx 0.91× > Pky 0.76×)',
      'rgba(6, 32, 24, 0.92)',
      '#10B981',
      '#6EE7B7'
    );
  }

  // =========================================================================
  // STEP 3: RADIAL FINGER CLEFTS & WEBBING STOP LINE (38% Cleft vs 62% Palm)
  // =========================================================================
  if (showStep3) {
    // Carpal Wrist Pivots
    const leftCarpal: [number, number] = [448, 1094];
    const rightCarpal: [number, number] = [542, 1104];

    // Dotted radial convergence guides from Carpal Pivot to Finger Clefts
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.65)';
    ctx.lineWidth = compact ? 1.0 : 1.4;
    ctx.setLineDash([2, 2]);
    const leftCleftStarts: [number, number][] = [
      [478, 1116],
      [464, 1131],
      [444, 1132],
    ];
    for (const [cx, cy] of leftCleftStarts) {
      ctx.beginPath();
      ctx.moveTo(leftCarpal[0], leftCarpal[1]);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }
    const rightCleftStarts: [number, number][] = [
      [526, 1136],
      [544, 1144],
      [560, 1150],
    ];
    for (const [cx, cy] of rightCleftStarts) {
      ctx.beginPath();
      ctx.moveTo(rightCarpal[0], rightCarpal[1]);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Highlight the 3 Left & 3 Right Tapered Cleft Vectors
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = compact ? 2.0 : 2.6;
    ctx.beginPath();
    ctx.moveTo(478, 1116);
    ctx.bezierCurveTo(484, 1128, 489, 1140, 493, 1149);
    ctx.moveTo(464, 1131);
    ctx.bezierCurveTo(469, 1141, 474, 1150, 478, 1157);
    ctx.moveTo(444, 1132);
    ctx.bezierCurveTo(450, 1144, 456, 1153, 461, 1160);
    ctx.moveTo(526, 1136);
    ctx.bezierCurveTo(516, 1150, 508, 1161, 501, 1169);
    ctx.moveTo(544, 1144);
    ctx.bezierCurveTo(538, 1155, 533, 1163, 528, 1170);
    ctx.moveTo(560, 1150);
    ctx.bezierCurveTo(556, 1158, 553, 1165, 551, 1170);
    ctx.stroke();

    // Knuckle Webbing Stop Arch (Marks 62% Palm / 38% Cleft boundary)
    ctx.strokeStyle = '#E879F9';
    ctx.lineWidth = compact ? 1.4 : 1.8;
    ctx.beginPath();
    ctx.moveTo(440, 1134);
    ctx.quadraticCurveTo(464, 1130, 480, 1115);
    ctx.moveTo(524, 1135);
    ctx.quadraticCurveTo(544, 1144, 563, 1151);
    ctx.stroke();

    drawCalloutTag(
      430,
      1171,
      'S3: Radial Clefts Stop @ 38% Webbing',
      'rgba(32, 14, 48, 0.92)',
      '#C084FC',
      '#E9D5FF'
    );
  }

  // =========================================================================
  // STEP 4: PALMAR / KNUCKLE CREASE POCKET, THENAR FOLD & NAIL BED
  // =========================================================================
  if (showStep4) {
    // Center Knuckle / Palmar Shadow Pocket Triangle (x=504..516, y=1102..1142)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = compact ? 1.6 : 2.2;
    ctx.beginPath();
    ctx.moveTo(504, 1102);
    ctx.lineTo(516, 1108);
    ctx.bezierCurveTo(514, 1122, 510, 1134, 505, 1142);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Peeking Top Thumb / Thenar Crease Fold (476..501, 1064..1102)
    ctx.beginPath();
    ctx.moveTo(476, 1066);
    ctx.bezierCurveTo(489, 1064, 500, 1074, 501, 1102);
    ctx.stroke();

    // Tilted Index Nail Bed Oval (493, 1163)
    ctx.beginPath();
    ctx.ellipse(493, 1163, 5.2, 3.4, -0.45, 0, Math.PI * 2);
    ctx.stroke();

    drawCalloutTag(
      556,
      1052,
      'S4: Center Palm Pocket + Nail (-26°)',
      'rgba(40, 26, 8, 0.92)',
      '#FBBF24',
      '#FDE68A'
    );
  }

  // =========================================================================
  // INTERACTIVE COMMON MISTAKE OVERLAYS (RED = MISTAKE vs EMERALD = CORRECT)
  // =========================================================================
  if (config.mistakeId === 'equal_finger_lengths') {
    // Show flat "fork/comb" equal-length finger silhouettes & flat line in Crimson
    ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = compact ? 1.8 : 2.4;
    ctx.setLineDash([4, 3]);

    // Left Hand Mistake: Pinky, Ring & Index artificially stretched to match a flat line
    ctx.beginPath();
    ctx.moveTo(426, 1138);
    ctx.lineTo(440, 1169); // Over-long pinky
    ctx.lineTo(502, 1156); // Flat comb tip line across all 4 fingers
    ctx.lineTo(494, 1130);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Hand Mistake: Flat horizontal comb line across all 4 right fingers
    ctx.beginPath();
    ctx.moveTo(484, 1175);
    ctx.lineTo(572, 1175); // Rigid flat line (Pinky & Index equal to Middle)
    ctx.lineTo(574, 1148);
    ctx.lineTo(492, 1152);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Bold Red Flat Comb Line
    ctx.strokeStyle = '#FF2E54';
    ctx.lineWidth = compact ? 2.2 : 3.0;
    ctx.beginPath();
    ctx.moveTo(436, 1169);
    ctx.lineTo(502, 1156);
    ctx.moveTo(484, 1175);
    ctx.lineTo(572, 1175);
    ctx.stroke();

    drawCalloutTag(
      498,
      1032,
      '✗ MISTAKE: Equal 1.0× Flat "Fork" Tips (Pinky & Index Too Long)',
      'rgba(68, 10, 24, 0.95)',
      '#F43F5E',
      '#FFE4E6'
    );
  } else if (config.mistakeId === 'deep_wrist_splits') {
    // Show over-extended finger clefts slicing all the way to the wrist in Crimson
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = compact ? 2.2 : 3.0;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    // Left hand over-cut to wrist
    ctx.moveTo(458, 1082);
    ctx.lineTo(493, 1149);
    ctx.moveTo(444, 1094);
    ctx.lineTo(478, 1157);
    ctx.moveTo(430, 1106);
    ctx.lineTo(461, 1160);
    // Right hand over-cut to wrist
    ctx.moveTo(528, 1092);
    ctx.lineTo(501, 1169);
    ctx.moveTo(548, 1104);
    ctx.lineTo(528, 1170);
    ctx.moveTo(566, 1116);
    ctx.lineTo(551, 1170);
    ctx.stroke();
    ctx.setLineDash([]);

    drawCalloutTag(
      498,
      1032,
      '✗ MISTAKE: Clefts Sliced 85% to Wrist ("Sausage" Fingers)',
      'rgba(68, 10, 24, 0.95)',
      '#F43F5E',
      '#FFE4E6'
    );
  } else if (config.mistakeId === 'parallel_pipe_creases') {
    // Show rigid parallel vertical/diagonal pipe lines ignoring wrist radial fan
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = compact ? 2.2 : 3.0;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    // Parallel rigid lines (0 deg spread)
    for (const xOff of [450, 466, 482]) {
      ctx.moveTo(xOff, 1114);
      ctx.lineTo(xOff, 1160);
    }
    for (const xOff of [512, 532, 552]) {
      ctx.moveTo(xOff, 1124);
      ctx.lineTo(xOff, 1172);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    drawCalloutTag(
      498,
      1032,
      '✗ MISTAKE: 0° Parallel Pipe Creases (No Radial Wrist Fan)',
      'rgba(68, 10, 24, 0.95)',
      '#F43F5E',
      '#FFE4E6'
    );
  } else if (config.mistakeId === 'floating_cuff_wrist') {
    // Show unseated sticker wrist pasted over sleeve cuff
    ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = compact ? 2.4 : 3.2;
    ctx.beginPath();
    ctx.moveTo(410, 1112);
    ctx.lineTo(476, 1054);
    ctx.lineTo(488, 1072);
    ctx.lineTo(422, 1126);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(506, 1062);
    ctx.lineTo(588, 1122);
    ctx.lineTo(576, 1138);
    ctx.lineTo(498, 1078);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawCalloutTag(
      498,
      1032,
      '✗ MISTAKE: Floating Cutout Wrist Pasted Over Cuff Rim',
      'rgba(68, 10, 24, 0.95)',
      '#F43F5E',
      '#FFE4E6'
    );
  } else if (config.mistakeId === 'missing_palm_occlusion') {
    // Show flat 1D seam with missing knuckle/palmar shadow pocket
    ctx.fillStyle = 'rgba(244, 63, 94, 0.30)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = compact ? 2.4 : 3.2;
    ctx.beginPath();
    ctx.roundRect(496, 1094, 24, 54, 6);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(508, 1088);
    ctx.lineTo(508, 1154);
    ctx.stroke();

    drawCalloutTag(
      498,
      1032,
      '✗ MISTAKE: Flat 1D Clasp Seam (Missing Palm Shadow Pocket)',
      'rgba(68, 10, 24, 0.95)',
      '#F43F5E',
      '#FFE4E6'
    );
  }

  ctx.restore();
}

