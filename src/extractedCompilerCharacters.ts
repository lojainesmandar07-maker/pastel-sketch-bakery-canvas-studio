// @ts-nocheck
/**
 * src/extractedCompilerCharacters.ts
 * Exact-Fidelity 2D Character & Scene Renderers extracted 1:1 from
 * exact_fidelity_2d_character_code_compiler_multi_engine_rigging_studio_9d3f4837.html
 */

export type ExtractedCompilerCharacterId =
  | 'auburn_girl'
  | 'black_bob_girl'
  | 'strawberry_mouse'
  | 'acorn_lamb'
  | 'watering_bunny'
  | 'postman_duckling'
  | 'lantern_kitten'
  | 'meadow_bg'
  | 'meadow_with_mouse'
  | 'meadow_with_lamb'
  | 'meadow_with_bunny'
  | 'meadow_with_duckling'
  | 'meadow_with_kitten'
  | 'porcelain_bjd';

export const EXTRACTED_COMPILER_CHAR_LIST: {
  id: ExtractedCompilerCharacterId;
  label: string;
  shortLabel: string;
  ratio: '1:1' | '16:9' | '2:3';
}[] = [
  { id: 'auburn_girl', label: '★ 1. Auburn Wavy Girl w/ Black Bow & Eyelet Blouse', shortLabel: 'Auburn Wavy Girl', ratio: '1:1' },
  { id: 'black_bob_girl', label: '★ 2. Black Bob Girl w/ Lavender Flowers & Bows', shortLabel: 'Black Bob Girl', ratio: '1:1' },
  { id: 'strawberry_mouse', label: 'Field Mouse Hugging Strawberry (1:1 Pro Rig)', shortLabel: 'Strawberry Mouse', ratio: '1:1' },
  { id: 'acorn_lamb', label: 'Fluffy Baby Lamb w/ Acorn & Knit Scarf (1:1 Pro Rig)', shortLabel: 'Acorn Baby Lamb', ratio: '1:1' },
  { id: 'watering_bunny', label: 'Lop-Eared Bunny w/ Overalls & Watering Can (1:1 Pro Rig)', shortLabel: 'Watering Can Bunny', ratio: '1:1' },
  { id: 'postman_duckling', label: 'Postman Duckling w/ Tweed Cap & Love Letter (1:1 Pro Rig)', shortLabel: 'Postman Duckling', ratio: '1:1' },
  { id: 'lantern_kitten', label: 'Nightcap Kitten w/ Candle Lantern (1:1 Master Rig)', shortLabel: 'Lantern Kitten', ratio: '1:1' },
  { id: 'meadow_bg', label: '16:9 Storybook Meadow Picnic BG (Engine C Scene)', shortLabel: 'Meadow Picnic BG (16:9)', ratio: '16:9' },
  { id: 'meadow_with_mouse', label: '★ Meadow BG + Strawberry Mouse (16:9 Scene)', shortLabel: 'Meadow + Mouse (16:9)', ratio: '16:9' },
  { id: 'meadow_with_lamb', label: '★ Meadow BG + Acorn Baby Lamb (16:9 Scene)', shortLabel: 'Meadow + Lamb (16:9)', ratio: '16:9' },
  { id: 'meadow_with_bunny', label: '★ Meadow BG + Watering Can Bunny (16:9 Scene)', shortLabel: 'Meadow + Bunny (16:9)', ratio: '16:9' },
  { id: 'meadow_with_duckling', label: '★ Meadow BG + Postman Duckling (16:9 Scene)', shortLabel: 'Meadow + Duckling (16:9)', ratio: '16:9' },
  { id: 'meadow_with_kitten', label: '★ Meadow BG + Nightcap Kitten (16:9 Scene)', shortLabel: 'Meadow + Kitten (16:9)', ratio: '16:9' },
  { id: 'porcelain_bjd', label: 'Photorealistic Porcelain BJD (2:3 Cutout Rig)', shortLabel: 'Porcelain BJD (2:3)', ratio: '2:3' },
];

export function isExtractedCompilerChar(charId: string): charId is ExtractedCompilerCharacterId {
  return EXTRACTED_COMPILER_CHAR_LIST.some((c) => c.id === charId);
}

export type CompilerJointKey =
  | 'headTilt'
  | 'headNod'
  | 'headTurn'
  | 'blink'
  | 'gazeX'
  | 'gazeY'
  | 'browLift'
  | 'mouthOpen'
  | 'smile'
  | 'breath'
  | 'torsoSway'
  | 'leftArmLift'
  | 'leftElbowBend'
  | 'leftWristRot'
  | 'rightArmLift'
  | 'rightElbowBend'
  | 'rightWristRot'
  | 'leftHipRot'
  | 'leftKneeBend'
  | 'rightHipRot'
  | 'rightKneeBend'
  | 'hairSwayL'
  | 'hairSwayR'
  | 'bangsSway'
  | 'ruffleBounce';

export type CompilerRigState = Record<CompilerJointKey, number>;

export const DEFAULT_COMPILER_RIG: CompilerRigState = {
  headTilt: 0,
  headNod: 0,
  headTurn: 0,
  blink: 0,
  gazeX: 0,
  gazeY: 0,
  browLift: 0,
  mouthOpen: 0,
  smile: 0.58,
  breath: 0,
  torsoSway: 0,
  leftArmLift: 0,
  leftElbowBend: 0,
  leftWristRot: 0,
  rightArmLift: 0,
  rightElbowBend: 0,
  rightWristRot: 0,
  leftHipRot: 0,
  leftKneeBend: 0,
  rightHipRot: 0,
  rightKneeBend: 0,
  hairSwayL: 0,
  hairSwayR: 0,
  bangsSway: 0,
  ruffleBounce: 0,
};

export const COMPILER_JOINT_SLIDER_META: {
  key: CompilerJointKey;
  label: string;
  pivotLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'blink', label: '1. 3-Stage Eyelid Blink', pivotLabel: 'Bezier Lid (0 → 0.55 → 1)', min: 0, max: 1, step: 0.01, unit: 'u' },
  { key: 'headTilt', label: '2. Head Tilt (Neck Ball)', pivotLabel: 'Neck Pivot', min: -0.22, max: 0.22, step: 0.005, unit: 'rad' },
  { key: 'headNod', label: '3. Head Nod (Pitch Y)', pivotLabel: 'Neck Pivot', min: -20, max: 20, step: 0.5, unit: 'px' },
  { key: 'headTurn', label: '4. Head Turn (Yaw X)', pivotLabel: 'Neck Pivot', min: -20, max: 20, step: 0.5, unit: 'px' },
  { key: 'gazeX', label: '5. Iris Gaze X', pivotLabel: 'Eye Clip Mask', min: -10, max: 10, step: 0.2, unit: 'px' },
  { key: 'gazeY', label: '6. Iris Gaze Y', pivotLabel: 'Eye Clip Mask', min: -8, max: 8, step: 0.2, unit: 'px' },
  { key: 'browLift', label: '7. Feathered Brow Lift', pivotLabel: 'Brow Arch', min: -8, max: 8, step: 0.2, unit: 'px' },
  { key: 'mouthOpen', label: '8. Lip Parting', pivotLabel: 'Mouth Center', min: -0.15, max: 0.5, step: 0.01, unit: '×' },
  { key: 'smile', label: '9. Blush Glow Intensity', pivotLabel: 'Cheeks', min: 0, max: 1, step: 0.01, unit: 'α' },
  { key: 'breath', label: '10. Chest Breathing', pivotLabel: 'Torso Root', min: -0.03, max: 0.04, step: 0.002, unit: '×' },
  { key: 'torsoSway', label: '11. Upper Torso Sway', pivotLabel: 'Waist Pivot', min: -0.1, max: 0.1, step: 0.002, unit: 'rad' },
  { key: 'leftArmLift', label: '12. Left Shoulder / Arm', pivotLabel: 'Left Shoulder', min: -0.45, max: 0.45, step: 0.005, unit: 'rad' },
  { key: 'leftElbowBend', label: '13. Left Elbow Joint', pivotLabel: 'Left Elbow', min: -0.55, max: 0.55, step: 0.005, unit: 'rad' },
  { key: 'leftWristRot', label: '14. Left Wrist & Hand', pivotLabel: 'Left Wrist', min: -0.45, max: 0.45, step: 0.005, unit: 'rad' },
  { key: 'rightArmLift', label: '15. Right Shoulder / Arm', pivotLabel: 'Right Shoulder', min: -0.45, max: 0.45, step: 0.005, unit: 'rad' },
  { key: 'rightElbowBend', label: '16. Right Elbow Joint', pivotLabel: 'Right Elbow', min: -0.55, max: 0.55, step: 0.005, unit: 'rad' },
  { key: 'rightWristRot', label: '17. Right Wrist & Hand', pivotLabel: 'Right Wrist', min: -0.45, max: 0.45, step: 0.005, unit: 'rad' },
  { key: 'leftHipRot', label: '18. Left Hip / Thigh', pivotLabel: 'Left Hip', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'leftKneeBend', label: '19. Left Knee & Shin', pivotLabel: 'Left Knee', min: -0.35, max: 0.35, step: 0.005, unit: 'rad' },
  { key: 'rightHipRot', label: '20. Right Hip / Thigh', pivotLabel: 'Right Hip', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'rightKneeBend', label: '21. Right Knee & Shin', pivotLabel: 'Right Knee', min: -0.35, max: 0.35, step: 0.005, unit: 'rad' },
  { key: 'hairSwayL', label: '22. Left Hair / Ear Sway', pivotLabel: 'Left Crown', min: -0.2, max: 0.2, step: 0.005, unit: 'rad' },
  { key: 'hairSwayR', label: '23. Right Hair / Ear Sway', pivotLabel: 'Right Crown', min: -0.2, max: 0.2, step: 0.005, unit: 'rad' },
  { key: 'bangsSway', label: '24. Wispy Bangs / Whiskers', pivotLabel: 'Forehead', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'ruffleBounce', label: '25. Lace Bows / Props Sway', pivotLabel: 'Accessory Pivot', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
];

export type CompilerAnimPreset = 'breeze' | 'idle' | 'glance' | 'nod' | 'static' | 'manual';

export function computeCompilerRigAtTime(
  t: number,
  preset: CompilerAnimPreset,
  manualRig: CompilerRigState = DEFAULT_COMPILER_RIG
): CompilerRigState {
  if (preset === 'static') {
    return { ...DEFAULT_COMPILER_RIG };
  }
  if (preset === 'manual') {
    return { ...manualRig };
  }
  const TAU = Math.PI * 2;
  const w1 = TAU / 6.0,
    w2 = TAU / 3.0,
    w3 = TAU / 2.0;
  const blinkEnv = (time: number, center: number, width: number) => {
    const tc = time % 6.0;
    const d = Math.abs(tc - center);
    if (d > width) return 0;
    return Math.pow(Math.cos((d / width) * Math.PI * 0.5), 2.2);
  };
  const autoBlink = Math.min(
    1,
    blinkEnv(t, 1.65, 0.18) + blinkEnv(t, 4.35, 0.16) + blinkEnv(t, 4.68, 0.14) * 0.85
  );
  const scale = preset === 'idle' ? 0.55 : 1.0;

  return {
    breath: Math.sin(t * w2) * 0.018 * scale,
    torsoSway: Math.sin(t * w1) * 0.016 * scale,
    headTilt: Math.sin(t * w1 - 0.25) * 0.032 * scale + Math.sin(t * w2 + 0.4) * 0.01 * scale,
    headTurn: Math.sin(t * w1) * 4.5 * scale,
    headNod: preset === 'nod' ? Math.sin(t * w3) * 10.0 : Math.cos(t * w2) * 3.0 * scale,
    blink: autoBlink,
    gazeX: preset === 'glance' ? Math.sin(t * w2) * 6.5 : Math.sin(t * w1 + 0.5) * 2.8 * scale,
    gazeY: Math.cos(t * w1 + 0.3) * 1.8 * scale,
    browLift: Math.sin(t * w1 - 0.1) * 2.8 * scale - (autoBlink > 0.3 ? 2.0 * autoBlink : 0),
    mouthOpen: Math.sin(t * w2 - 0.3) * 0.12 * scale,
    smile: 0.58 + Math.sin(t * w2 + 0.8) * 0.09 * scale,
    leftArmLift: Math.sin(t * w2 - 0.4) * 0.035 * scale,
    leftElbowBend: Math.sin(t * w2 - 0.75) * 0.045 * scale,
    leftWristRot: Math.sin(t * w2 - 1.1) * 0.055 * scale,
    rightArmLift: -Math.sin(t * w2 - 0.6) * 0.032 * scale,
    rightElbowBend: -Math.sin(t * w2 - 0.95) * 0.042 * scale,
    rightWristRot: -Math.sin(t * w2 - 1.25) * 0.052 * scale,
    leftHipRot: Math.sin(t * w1 - 0.3) * 0.012 * scale,
    leftKneeBend: -Math.sin(t * w1 - 0.6) * 0.015 * scale,
    rightHipRot: -Math.sin(t * w1 - 0.3) * 0.012 * scale,
    rightKneeBend: Math.sin(t * w1 - 0.6) * 0.015 * scale,
    hairSwayL: Math.sin(t * w1 - 0.85) * 0.038 * scale + Math.sin(t * w2 - 0.5) * 0.018 * scale,
    hairSwayR: Math.sin(t * w1 - 0.95) * 0.036 * scale + Math.sin(t * w2 - 0.7) * 0.018 * scale,
    bangsSway: Math.sin(t * w2 - 0.65) * 0.03 * scale,
    ruffleBounce: Math.sin(t * w2 - 1.1) * 0.14 * scale + Math.sin(t * w3) * 0.05 * scale,
  };
}

    const TAU = Math.PI * 2;
    let B = 1; // Deterministic wobble seed (1..4 stepped every 3 frames for 8fps boil on 24fps motion)
    let ctx = null; // Global active 2D context pointer used by your exact master functions

    const JOINT_DEFS = [
      { id: 'headTilt',      label: '1. Head Tilt (Neck Ball)',  min: -0.22, max: 0.22, step: 0.005, def: 0 },
      { id: 'headNod',       label: '2. Head Nod (Pitch Y)',     min: -20,   max: 20,   step: 0.5,   def: 0 },
      { id: 'headTurn',      label: '3. Head Turn (Yaw X)',      min: -20,   max: 20,   step: 0.5,   def: 0 },
      { id: 'blink',         label: '4. 3-Stage Eyelid Blink',   min: 0,     max: 1,    step: 0.01,  def: 0 },
      { id: 'gazeX',         label: '5. Glass Iris Gaze X',      min: -10,   max: 10,   step: 0.2,   def: 0 },
      { id: 'gazeY',         label: '6. Glass Iris Gaze Y',      min: -8,    max: 8,    step: 0.2,   def: 0 },
      { id: 'browLift',      label: '7. Feathered Brow Lift',    min: -8,    max: 8,    step: 0.2,   def: 0 },
      { id: 'mouthOpen',     label: '8. Rosebud Lip Parting',    min: -0.15, max: 0.50, step: 0.01,  def: 0 },
      { id: 'smile',         label: '9. Porcelain Blush Glow',   min: 0,     max: 1,    step: 0.01,  def: 0.58 },
      { id: 'breath',        label: '10. Chest Breathing',       min: -0.03, max: 0.04, step: 0.002, def: 0 },
      { id: 'torsoSway',     label: '11. Upper Torso Sway',      min: -0.10, max: 0.10, step: 0.002, def: 0 },
      { id: 'leftArmLift',   label: '12. Left Shoulder Ball',    min: -0.45, max: 0.45, step: 0.005, def: 0 },
      { id: 'leftElbowBend', label: '13. Left Peanut Elbow',     min: -0.55, max: 0.55, step: 0.005, def: 0 },
      { id: 'leftWristRot',  label: '14. Left Wrist & Hand',     min: -0.45, max: 0.45, step: 0.005, def: 0 },
      { id: 'rightArmLift',  label: '15. Right Shoulder Ball',   min: -0.45, max: 0.45, step: 0.005, def: 0 },
      { id: 'rightElbowBend',label: '16. Right Peanut Elbow',    min: -0.55, max: 0.55, step: 0.005, def: 0 },
      { id: 'rightWristRot', label: '17. Right Wrist & Hand',    min: -0.45, max: 0.45, step: 0.005, def: 0 },
      { id: 'leftHipRot',    label: '18. Left Hip / Thigh',      min: -0.25, max: 0.25, step: 0.005, def: 0 },
      { id: 'leftKneeBend',  label: '19. Left Knee & Shin',      min: -0.35, max: 0.35, step: 0.005, def: 0 },
      { id: 'rightHipRot',   label: '20. Right Hip / Thigh',     min: -0.25, max: 0.25, step: 0.005, def: 0 },
      { id: 'rightKneeBend', label: '21. Right Knee & Shin',     min: -0.35, max: 0.35, step: 0.005, def: 0 },
      { id: 'hairSwayL',     label: '22. Left Hair Waves',       min: -0.20, max: 0.20, step: 0.005, def: 0 },
      { id: 'hairSwayR',     label: '23. Right Hair Waves',      min: -0.20, max: 0.20, step: 0.005, def: 0 },
      { id: 'bangsSway',     label: '24. Wispy Bangs Sway',      min: -0.18, max: 0.18, step: 0.005, def: 0 },
      { id: 'ruffleBounce',  label: '25. Lace Bows & Skirt',     min: -0.25, max: 0.25, step: 0.005, def: 0 }
    ];

    const StudioState = {
      activeCharacter: 'auburn_girl',
      aspectRatio: '1:1',            // '1:1' (1000x1000) | '16:9' (1600x900) | '2:3' (1000x1500 BJD)
      stageW: 1000,
      stageH: 1000,
      transparentBg: false,
      activeEngine: 'hybrid_spline', // Default to Engine C (Exact Multi-Layer Procedural Code)
      viewMode: 'single',            // 'single' | 'split_wipe' | 'quad_compare' | 'diff_heatmap'
      animPreset: 'breeze',          // 'breeze' | 'idle' | 'glance' | 'nod' | 'pose_ab' | 'manual'
      playing: true,
      t: 0,
      wipePercent: 50,
      showMeshWireframe: false,
      cursorLookAt: true,
      showGrid: false,
      pointerX: 0,
      pointerY: 0,
      smoothPointerX: 0,
      smoothPointerY: 0,
      rigState: {},
      manualRig: {},
      poseA: {},
      poseB: {},
      bjdWardrobe: {
        outfit: 'ivory_camisole',
        customImg: null,
        scaleX: 1.0,
        scaleY: 1.0,
        offsetX: 0,
        offsetY: 0
      },
      // Offline Atmospheric & Post-Processing Effects
      fx: {
        sunbeams: false,
        pollen: false,
        petals: false,
        rain: false,
        vignette: false,
        paperGrain: false,
        intensity: 1.0
      }
    };

    JOINT_DEFS.forEach(j => {
      StudioState.rigState[j.id] = j.def;
      StudioState.manualRig[j.id] = j.def;
      StudioState.poseA[j.id] = j.def;
      StudioState.poseB[j.id] = j.id === 'headTilt' ? 0.05 : (j.id === 'blink' ? 1.0 : (j.id === 'hairSwayL' ? 0.06 : j.def));
    });

    const CharacterBundles = {};

    // =========================================================================
    // 2. DETERMINISTIC ENGINE & GEOMETRY PRIMITIVES (EXACT MASTER KIT)
    // =========================================================================
    function hash32(str) {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    }

    function mulberry32(a) {
      return function() {
        let t = (a += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function wobble(P, closed, amt = 0.25, key = 'w', step = 9) {
      if (!P || P.length < 2 || amt <= 0) return P;
      const rng = mulberry32(hash32(key + ':' + B));
      const out = [];
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

    function trace(P, closed = false) {
      if (!P || !P.length) return;
      ctx.beginPath();
      ctx.moveTo(P[0][0], P[0][1]);
      for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]);
      if (closed) ctx.closePath();
    }

    function bbox(P, pad = 0) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of P) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
      return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
    }

    function ellipsePts(cx, cy, rx, ry, rot = 0, n = 32) {
      const P = [];
      const c = Math.cos(rot), s = Math.sin(rot);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU;
        const ux = Math.cos(a) * rx, uy = Math.sin(a) * ry;
        P.push([cx + ux * c - uy * s, cy + ux * s + uy * c]);
      }
      return P;
    }

    function bezierPts(segs, nPerSeg = 18) {
      const P = [];
      for (let s = 0; s < segs.length; s++) {
        const [p0, c1, c2, p1] = segs[s];
        const m = s === segs.length - 1 ? nPerSeg : nPerSeg - 1;
        for (let i = 0; i <= m; i++) {
          const t = i / nPerSeg, u = 1 - t;
          const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0];
          const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1];
          P.push([x, y]);
        }
      }
      return P;
    }

    function lerpPt(a, b, u) {
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }

    function lerpSegs(segsA, segsB, u) {
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

    function seg(t, a, b) {
      return Math.max(0, Math.min(1, (t - a) / ((b - a) || 1)));
    }

    const EZ = {
      io: (u) => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
    };

    function pencil(bb, o = {}) {
      const rng = mulberry32(hash32((o.key ?? 'p') + ':' + B));
      const c = o.c ?? '#886644';
      const al = o.al ?? 0.14;
      const a = o.a ?? -0.65;
      const len = o.len ?? 14;
      const w = o.w ?? 1.2;
      const count = Math.min(o.max ?? 2200, Math.floor(((bb.x1 - bb.x0) * (bb.y1 - bb.y0)) / (o.per ?? 90)));
      const ca = Math.cos(a) * len * 0.5, sa = Math.sin(a) * len * 0.5;
      ctx.save();
      ctx.strokeStyle = c;
      ctx.globalAlpha = al;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const x = bb.x0 + rng() * (bb.x1 - bb.x0);
        const y = bb.y0 + rng() * (bb.y1 - bb.y0);
        ctx.moveTo(x - ca, y - sa);
        ctx.lineTo(x + ca, y + sa);
      }
      ctx.stroke();
      ctx.restore();
    }

    function withPivot(px, py, rot = 0, sx = 1, sy = 1, dx = 0, dy = 0, fn) {
      ctx.save();
      ctx.translate(px + dx, py + dy);
      if (rot) ctx.rotate(rot);
      if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
      ctx.translate(-px, -py);
      fn();
      ctx.restore();
    }

    // =========================================================================
    // 3A. SHOUJO MANGA PRIMITIVES & 90s SHOUJO BLONDE GIRL MASTER RIG
    // =========================================================================
    const SG = {
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

    function sgLine(P, o = {}) {
      const closed = !!o.closed, key = o.key ?? 'sgl', w = o.w ?? 2.6, col = o.col ?? SG.ink, amt = o.amt ?? 0.28;
      const Q = amt > 0 ? wobble(P, closed, amt, key, o.step ?? 9) : P;
      ctx.save();
      ctx.lineCap = o.cap ?? 'round';
      ctx.lineJoin = o.join ?? 'round';
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.globalAlpha = o.a ?? 0.98;
      if (o.dash) ctx.setLineDash(o.dash);
      trace(Q, closed);
      ctx.stroke();
      ctx.restore();
      return Q;
    }

    function sgTaperLine(P, wStart = 1.0, wMid = 3.2, wEnd = 0.8, col = SG.ink, a = 0.98) {
      if (!P || P.length < 2) return;
      const N = P.length;
      const left = [], right = [];
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const w = t < 0.5
          ? wStart + (wMid - wStart) * Math.sin(t * Math.PI)
          : wMid * Math.sin(t * Math.PI) + wEnd * (1 - Math.sin(t * Math.PI));
        const pPrev = P[Math.max(0, i - 1)];
        const pNext = P[Math.min(N - 1, i + 1)];
        let dx = pNext[0] - pPrev[0], dy = pNext[1] - pPrev[1];
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
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

    function sgShape(P, fill, o = {}) {
      const key = o.key ?? 'sgs', amt = o.amt ?? 0.28;
      const Q = amt > 0 ? wobble(P, true, amt, key, o.step ?? 9) : P;
      ctx.save();
      trace(Q, true);
      ctx.fillStyle = fill;
      ctx.globalAlpha = o.fillA ?? 1;
      ctx.fill();
      ctx.restore();

      if (o.grad || o.innerFn) {
        ctx.save();
        trace(Q, true);
        ctx.clip();
        const bb = bbox(Q, 4);
        if (o.grad) o.grad(bb);
        if (o.innerFn) o.innerFn(bb);
        ctx.restore();
      }

      if (o.line !== false) {
        sgLine(P, { closed: true, key: key + 'L', w: o.w ?? 2.6, col: o.line ?? SG.ink, amt, a: o.lineA ?? 0.98 });
      }
      return Q;
    }

    function sgBlush(x, y, rx, ry, col = SG.blushRGB, a = 0.45, rot = 0) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, ry / rx);
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      gr.addColorStop(0, 'rgba(' + col + ',' + a + ')');
      gr.addColorStop(0.55, 'rgba(' + col + ',' + (a * 0.65) + ')');
      gr.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    function drawShoujoRose(cx, cy, r = 26, rot = 0, rKey = 'rose', leaves = []) {
      withPivot(cx, cy, rot, 1, 1, 0, 0, () => {
        const s = r / 26;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, s);

        for (let i = 0; i < leaves.length; i++) {
          const [ang, len, wid, lCol] = leaves[i];
          ctx.save();
          ctx.rotate(ang);
          const leafP = bezierPts([
            [[14, -wid * 0.42], [24, -wid * 0.72], [18 + len * 0.7, -wid * 0.35], [18 + len, 0]],
            [[18 + len, 0], [18 + len * 0.65, wid * 0.55], [24, wid * 0.72], [14, wid * 0.35]],
          ], 10);
          sgShape(leafP, lCol || SG.hairShade, { key: rKey + 'lf' + i, w: 1.6 / s, amt: 0.2 });
          sgLine([[16, 0], [18 + len * 0.7, 0]], { key: rKey + 'lfv' + i, w: 1.1 / s, amt: 0.15 });
          ctx.restore();
        }

        const outerP = bezierPts([
          [[0, -18], [9, -29], [23, -24], [19, -8]],
          [[19, -8], [30, -2], [29, 14], [15, 16]],
          [[15, 16], [14, 28], [-2, 29], [-10, 18]],
          [[-10, 18], [-24, 24], [-30, 8], [-19, -2]],
          [[-19, -2], [-27, -15], [-14, -28], [0, -18]],
        ], 10);

        sgShape(outerP, SG.roseMid, {
          key: rKey + 'out', w: 1.75 / s, amt: 0.2,
          grad: (bb) => {
            const g = ctx.createRadialGradient(-2, -2, 2, 0, 0, 28);
            g.addColorStop(0, SG.roseShade);
            g.addColorStop(0.55, SG.roseMid);
            g.addColorStop(1, SG.roseLight);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          }
        });

        const pLines = [
          [[[0, -18], [8, -16], [15, -13], [19, -8]]],
          [[[19, -8], [16, 2], [15, 10], [15, 16]]],
          [[[15, 16], [5, 16], [-3, 16], [-10, 18]]],
          [[[-10, 18], [-14, 10], [-17, 4], [-19, -2]]],
          [[[-19, -2], [-12, -10], [-6, -15], [0, -18]]],
          [[[-11, -8], [-4, -15], [7, -14], [12, -5]]],
          [[[11, -6], [14, 2], [9, 11], [-2, 11]]],
          [[[2, 11], [-8, 11], [-14, 3], [-10, -7]]],
          [[[-6, -2], [-3, -7], [5, -7], [6, -1]]],
          [[[6, -1], [5, 5], [-2, 6], [-6, 2]]],
          [[[-3, 1], [-2, -3], [2, -3], [3, 1]], [[3, 1], [1, 3], [-1, 2], [-1, 0]]],
        ];
        for (let i = 0; i < pLines.length; i++) {
          sgLine(bezierPts(pLines[i], 10), { key: rKey + 'pl' + i, w: 1.35 / s, col: SG.ink, amt: 0.15 });
        }
        ctx.restore();
      });
    }

    function drawBlackBow(knotP, leftLoopSegs, rightLoopSegs, leftTailSegs, rightTailSegs, creases, bKey = 'bow') {
      if (leftTailSegs) sgShape(bezierPts(leftTailSegs, 12), SG.ribbon, { key: bKey + 'tL', w: 2.0, line: SG.ink, amt: 0.22 });
      if (rightTailSegs) sgShape(bezierPts(rightTailSegs, 12), SG.ribbon, { key: bKey + 'tR', w: 2.0, line: SG.ink, amt: 0.22 });
      if (leftLoopSegs) sgShape(bezierPts(leftLoopSegs, 14), SG.ribbon, { key: bKey + 'lL', w: 2.2, line: SG.ink, amt: 0.22 });
      if (rightLoopSegs) sgShape(bezierPts(rightLoopSegs, 14), SG.ribbon, { key: bKey + 'lR', w: 2.2, line: SG.ink, amt: 0.22 });
      if (knotP) sgShape(knotP, SG.ribbon, { key: bKey + 'kn', w: 2.0, line: '#252022', amt: 0.18 });
      if (creases) {
        for (let i = 0; i < creases.length; i++) {
          sgLine(creases[i], { key: bKey + 'cr' + i, w: 1.3, col: '#3a3235', amt: 0.15 });
        }
      }
    }

    function drawFloralLaceBand(spinePts, normalDir, width, nScallops, lKey = 'lace') {
      const N = spinePts.length;
      if (N < 2) return;
      const arc = [0];
      for (let i = 1; i < N; i++) {
        arc.push(arc[i - 1] + Math.hypot(spinePts[i][0] - spinePts[i - 1][0], spinePts[i][1] - spinePts[i - 1][1]));
      }
      const totalLen = arc[N - 1] || 1;

      const sampleAt = (s) => {
        const target = Math.max(0, Math.min(totalLen, s));
        let idx = 0;
        while (idx < N - 2 && arc[idx + 1] < target) idx++;
        const segLen = (arc[idx + 1] - arc[idx]) || 1;
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

      const outerEdge = [];
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

      const poly = [...spinePts, ...outerEdge.slice().reverse()];
      sgShape(poly, SG.laceFill, { key: lKey + 'poly', line: false, amt: 0.16 });

      const cappedOuter = [spinePts[0], ...outerEdge, spinePts[spinePts.length - 1]];
      sgLine(cappedOuter, { key: lKey + 'outL', w: 1.5, col: SG.ink, amt: 0.2 });
      sgLine(spinePts, { key: lKey + 'inL', w: 1.5, col: SG.ink, amt: 0.2 });

      const seam2 = spinePts.map((_, idx) => {
        const pt = sampleAt(arc[idx]);
        return [pt.x + pt.nx * 4.5, pt.y + pt.ny * 4.5];
      });
      sgLine(seam2, { key: lKey + 'inL2', w: 1.0, col: SG.inkSoft, amt: 0.18 });
    }

    function drawShoujoEyeDeforming(cfg, eKey = 'eye', blink = 0) {
      const {
        cx, cy, rx, ry, rot,
        scleraSegsOpen, scleraSegsMid, scleraSegsClosed,
        upperLidSegsOpen, upperLidSegsMid, upperLidSegsClosed,
        lowerLidSegs, creaseSegsOpen, creaseSegsMid, creaseSegsClosed,
        upperLashesOpen, upperLashesMid, upperLashesClosed,
        lowerLashes,
        mainHi, subHi, botHi, sideDots
      } = cfg;

      const u = Math.max(0, Math.min(1, blink));
      const interp3 = (openS, midS, closedS) => {
        if (u <= 0.55) return lerpSegs(openS, midS, u / 0.55);
        return lerpSegs(midS, closedS, (u - 0.55) / 0.45);
      };

      const curScleraSegs = interp3(scleraSegsOpen, scleraSegsMid, scleraSegsClosed);
      const curUpperLidSegs = interp3(upperLidSegsOpen, upperLidSegsMid, upperLidSegsClosed);
      const curCreaseSegs = interp3(creaseSegsOpen, creaseSegsMid, creaseSegsClosed);

      const scleraP = bezierPts(curScleraSegs, 16);
      if (u < 0.94) {
        sgShape(scleraP, SG.sclera, {
          key: eKey + 'scl', line: false, amt: 0.15,
          innerFn: () => {
            const lidShadowY = cy - ry * 0.65 + u * (ry * 1.15);
            sgBlush(cx, lidShadowY, rx * 1.35, ry * 0.55, '185,165,165', 0.38, rot);

            ctx.save();
            const irisP = ellipsePts(cx, cy, rx, ry, rot, 36);
            trace(irisP, true);
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

            ctx.fillStyle = SG.ink;
            ctx.beginPath();
            ctx.ellipse(0, -ry * 0.05, rx * 0.38, ry * 0.38, 0, 0, TAU);
            ctx.fill();
            ctx.restore();

            sgLine(irisP, { closed: true, key: eKey + 'irRim', w: 3.4, col: SG.ink, amt: 0.15 });
            ctx.restore();

            const drawWhiteOrb = (ox, oy, orx, ory, orot = 0) => {
              ctx.save();
              ctx.translate(ox, oy);
              ctx.rotate(orot);
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.ellipse(0, 0, orx, ory, 0, 0, TAU);
              ctx.fill();
              ctx.restore();
            };
            if (mainHi) drawWhiteOrb(mainHi[0], mainHi[1], mainHi[2], mainHi[3], mainHi[4] || 0);
            if (subHi) drawWhiteOrb(subHi[0], subHi[1], subHi[2], subHi[3], subHi[4] || 0);
            if (botHi) drawWhiteOrb(botHi[0], botHi[1], botHi[2], botHi[3], botHi[4] || 0);
            if (sideDots) {
              for (const d of sideDots) drawWhiteOrb(d[0], d[1], d[2], d[3], d[4] || 0);
            }
          }
        });
      }

      if (lowerLidSegs && u < 0.75) {
        sgLine(bezierPts(lowerLidSegs, 14), { key: eKey + 'lLid', w: 1.9 * (1 - u / 0.75), col: SG.ink, amt: 0.2 });
      }
      if (lowerLashes && u < 0.65) {
        const lowAlpha = 0.92 * (1 - u / 0.65);
        for (let i = 0; i < lowerLashes.length; i++) {
          const [p0, c1, c2, p1] = lowerLashes[i];
          const lPts = bezierPts([[p0, c1, c2, p1]], 10);
          sgTaperLine(lPts, 2.0, 1.3, 0.3, SG.ink, lowAlpha);
        }
      }

      const upperLidP = bezierPts(curUpperLidSegs, 16);
      sgShape(upperLidP, SG.ink, { key: eKey + 'uLid', w: 1.5, line: SG.ink, amt: 0.16 });

      for (let i = 0; i < upperLashesOpen.length; i++) {
        const oL = upperLashesOpen[i];
        const mL = upperLashesMid[i];
        const cL = upperLashesClosed[i];
        let p0, c1, c2, p1;
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
        sgTaperLine(lPts, w0, wm, 0.35, SG.ink, 0.98);
      }

      if (curCreaseSegs) {
        sgLine(bezierPts(curCreaseSegs, 14), { key: eKey + 'crs', w: 1.8, col: SG.ink, amt: 0.2 });
      }
    }

    function drawShoujoGirlAnimated(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'sg';
      const isRest = !rig;
      const breath = isRest ? 0 : (rig.breath / 0.018);
      const torsoSX = 1 + breath * 0.005;
      const torsoSY = 1 + breath * 0.010;
      const torsoDY = -breath * 3.5;
      const headRot = isRest ? 0 : rig.headTilt;
      const headDX = isRest ? 0 : rig.headTurn;
      const headDY = isRest ? 0 : rig.headNod;
      const backHairLRot = isRest ? 0 : rig.hairSwayL;
      const backHairRRot = isRest ? 0 : rig.hairSwayR;
      const blink = isRest ? 0 : rig.blink;
      const gazeDX = isRest ? 0 : rig.gazeX;
      const gazeDY = isRest ? 0 : rig.gazeY;
      const browLift = isRest ? 0 : rig.browLift;
      const lipPart = 1 + (isRest ? 0 : rig.mouthOpen);
      const blushPulse = isRest ? 0.54 : rig.smile;
      const bangLRot = isRest ? 0 : rig.bangsSway;
      const bangRRot = isRest ? 0 : rig.bangsSway * 0.9;
      const heartRot = isRest ? 0 : rig.ruffleBounce;

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = SG.bg;
        ctx.fillRect(0, 0, 1000, 1000);
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      withPivot(480, 520, (backHairLRot + backHairRRot) * 0.5, 1, 1, headDX * 0.4, headDY * 0.4, () => {
        const hairBackDeepP = bezierPts([
          [[325, 480], [640, 440], [670, 520], [645, 620]],
          [[645, 620], [610, 680], [340, 680], [285, 630]],
          [[285, 630], [295, 550], [310, 505], [325, 480]],
        ], 14);
        sgShape(hairBackDeepP, SG.hairDeep, { key: key + 'hBackDeep', line: false });
      });

      withPivot(340, 220, backHairLRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
        const leftHairMassP = bezierPts([
          [[380, 62], [315, 95], [268, 152], [266, 218]],
          [[266, 218], [278, 255], [295, 272], [272, 316]],
          [[272, 316], [222, 354], [162, 382], [162, 434]],
          [[162, 434], [162, 468], [182, 492], [202, 492]],
          [[202, 492], [174, 488], [160, 514], [164, 536]],
          [[164, 536], [172, 560], [212, 562], [240, 540]],
          [[240, 540], [225, 588], [132, 616], [78, 654]],
          [[78, 654], [72, 690], [72, 745], [96, 756]],
          [[96, 756], [104, 798], [122, 834], [100, 845]],
          [[100, 845], [74, 845], [64, 814], [72, 790]],
          [[72, 790], [58, 825], [68, 862], [114, 858]],
          [[114, 858], [82, 895], [66, 945], [74, 988]],
          [[74, 988], [76, 1000], [165, 1000], [215, 1000]],
          [[215, 1000], [240, 750], [435, 650], [435, 515]],
          [[435, 515], [420, 320], [410, 160], [380, 62]],
        ], 18);
        sgShape(leftHairMassP, SG.hairMain, { key: key + 'hMassL', w: 2.4, line: SG.ink });
        drawShoujoRose(173, 845, 25, -0.2, key + 'rose4', [[2.25, 22, 13, SG.hairShade]]);
      });

      withPivot(620, 220, backHairRRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
        const rightHairMassP = bezierPts([
          [[326, 14], [308, 42], [332, 74], [380, 64]],
          [[380, 64], [442, 34], [528, 22], [584, 52]],
          [[584, 52], [648, 46], [716, 88], [762, 168]],
          [[762, 168], [788, 218], [795, 265], [790, 315]],
          [[790, 315], [802, 372], [862, 405], [862, 464]],
          [[862, 464], [862, 512], [818, 550], [804, 588]],
          [[804, 588], [848, 612], [932, 628], [944, 696]],
          [[944, 696], [948, 725], [935, 742], [922, 740]],
          [[922, 740], [946, 772], [944, 835], [898, 860]],
          [[898, 860], [872, 875], [858, 902], [875, 922]],
          [[875, 922], [902, 938], [934, 916], [922, 875]],
          [[922, 875], [942, 902], [932, 948], [885, 945]],
          [[885, 945], [895, 972], [898, 990], [895, 1000]],
          [[895, 1000], [835, 1000], [785, 1000], [775, 1000]],
          [[775, 1000], [785, 820], [620, 680], [575, 560]],
          [[575, 560], [550, 420], [450, 220], [375, 78]],
          [[375, 78], [332, 82], [312, 48], [326, 14]],
        ], 18);
        sgShape(rightHairMassP, SG.hairMain, { key: key + 'hMassR', w: 2.5, line: SG.ink });
      });

      withPivot(480, 920, 0, torsoSX, torsoSY, 0, torsoDY, () => {
        const torsoSkinP = bezierPts([
          [[425, 515], [435, 575], [435, 622], [412, 634]],
          [[412, 634], [358, 644], [254, 650], [212, 706]],
          [[212, 706], [202, 748], [206, 835], [204, 925]],
          [[204, 925], [202, 965], [202, 990], [202, 1000]],
          [[202, 1000], [450, 1000], [650, 1000], [788, 1000]],
          [[788, 1000], [798, 945], [818, 865], [822, 795]],
          [[822, 795], [824, 725], [778, 675], [705, 665]],
          [[705, 665], [635, 658], [588, 610], [575, 550]],
          [[575, 550], [568, 505], [562, 475], [555, 460]],
          [[555, 460], [500, 475], [455, 495], [425, 515]],
        ], 18);
        sgShape(torsoSkinP, SG.skinMain, { key: key + 'torsoSkin', w: 2.6, line: SG.ink });

        const chokerP = bezierPts([
          [[433, 584], [485, 596], [542, 584], [586, 566]],
          [[586, 566], [588, 580], [584, 594], [578, 602]],
          [[578, 602], [534, 620], [478, 628], [434, 614]],
          [[434, 614], [432, 602], [432, 592], [433, 584]],
        ], 16);
        sgShape(chokerP, SG.ribbon, { key: key + 'choker', w: 2.2, line: SG.ink });

        withPivot(461, 622, heartRot, 1, 1, 0, 0, () => {
          const heartP = bezierPts([
            [[461, 635], [456, 629], [449, 632], [450, 640]],
            [[450, 640], [451, 647], [457, 652], [460, 656]],
            [[460, 656], [465, 652], [472, 646], [473, 639]],
            [[473, 639], [474, 632], [466, 629], [461, 635]],
          ], 12);
          sgShape(heartP, SG.heartPink, { key: key + 'heart', w: 2.4, line: SG.ink });
        });

        const camisoleP = bezierPts([
          [[258, 836], [284, 898], [318, 954], [358, 1000]],
          [[358, 1000], [435, 950], [518, 908], [592, 876]],
          [[592, 876], [606, 922], [618, 965], [630, 1000]],
          [[630, 1000], [450, 1000], [280, 1000], [202, 1000]],
          [[202, 1000], [198, 972], [202, 948], [214, 908]],
          [[214, 908], [234, 868], [248, 848], [258, 836]],
        ], 16);
        sgShape(camisoleP, SG.camisole, { key: key + 'camisole', w: 2.4, line: SG.ink });
        drawFloralLaceBand(bezierPts([[[256, 834], [284, 898], [318, 954], [358, 1000]]], 24), 1, 36, 7, key + 'laceL');
        drawFloralLaceBand(bezierPts([[[358, 1000], [435, 950], [518, 908], [595, 874]]], 28), -1, 38, 9, key + 'laceR');
      });

      withPivot(465, 485, headRot, 1, 1, headDX, headDY, () => {
        const faceP = bezierPts([
          [[468, 120], [555, 135], [625, 220], [626, 340]],
          [[626, 340], [626, 415], [588, 478], [522, 504]],
          [[522, 504], [462, 520], [392, 524], [358, 500]],
          [[358, 500], [334, 476], [315, 422], [315, 384]],
          [[315, 384], [315, 355], [326, 326], [334, 294]],
          [[334, 294], [344, 255], [348, 220], [375, 175]],
          [[375, 175], [405, 135], [438, 120], [468, 120]],
        ], 18);
        sgShape(faceP, SG.skinMain, {
          key: key + 'faceBase', w: 2.8, line: SG.ink,
          innerFn: () => {
            sgBlush(344, 368, 42, 28, SG.blushRGB, blushPulse, 0.25);
            sgBlush(520, 405, 68, 42, SG.blushRGB, blushPulse + 0.03, 0.22);
          }
        });

        drawShoujoEyeDeforming({
          cx: 368 + gazeDX, cy: 298 + gazeDY, rx: 28, ry: 33, rot: 0.12,
          scleraSegsOpen: [[[338, 294], [344, 266], [368, 258], [390, 274]], [[390, 274], [400, 292], [398, 316], [384, 326]], [[384, 326], [366, 334], [344, 320], [338, 294]]],
          scleraSegsMid: [[[338, 300], [348, 292], [372, 292], [394, 302]], [[394, 302], [400, 310], [396, 320], [384, 326]], [[384, 326], [366, 334], [344, 320], [338, 300]]],
          scleraSegsClosed: [[[338, 308], [352, 324], [374, 328], [394, 318]], [[394, 318], [396, 320], [392, 324], [384, 326]], [[384, 326], [366, 334], [344, 322], [338, 308]]],
          upperLidSegsOpen: [[[328, 292], [340, 262], [368, 252], [392, 272]], [[392, 272], [400, 286], [401, 300], [399, 308]], [[399, 308], [394, 288], [374, 268], [352, 272]], [[352, 272], [340, 276], [334, 288], [328, 292]]],
          upperLidSegsMid: [[[328, 298], [344, 284], [372, 284], [396, 298]], [[396, 298], [400, 304], [401, 310], [398, 314]], [[398, 314], [390, 302], [372, 294], [350, 294]], [[350, 294], [338, 296], [332, 300], [328, 298]]],
          upperLidSegsClosed: [[[330, 304], [348, 322], [374, 326], [398, 314]], [[398, 314], [400, 316], [400, 320], [396, 322]], [[396, 322], [374, 334], [348, 330], [330, 310]], [[330, 310], [328, 308], [328, 306], [330, 304]]],
          lowerLidSegs: [[[342, 314], [356, 330], [376, 334], [392, 324]]],
          creaseSegsOpen: [[[348, 245], [366, 240], [386, 250], [398, 268]]],
          creaseSegsMid: [[[344, 272], [364, 268], [384, 274], [398, 288]]],
          creaseSegsClosed: [[[340, 290], [358, 304], [380, 308], [398, 300]]],
          mainHi: [377 + gazeDX * 0.6, 286 + gazeDY * 0.6, 10.5, 11.5, -0.1],
          subHi: [358 + gazeDX * 0.8, 304 + gazeDY * 0.8, 5.0, 5.2, 0],
          botHi: [373 + gazeDX * 0.5, 321 + gazeDY * 0.5, 5.5, 4.0, 0.15],
          upperLashesOpen: [[[336, 292], [328, 293], [320, 290], [314, 285], 4.2, 2.5], [[350, 268], [346, 260], [343, 252], [341, 245], 3.6, 2.0]],
          upperLashesMid: [[[334, 298], [325, 300], [316, 298], [310, 294], 4.0, 2.4], [[358, 287], [354, 281], [351, 275], [349, 269], 3.6, 2.0]],
          upperLashesClosed: [[[332, 308], [324, 312], [316, 314], [310, 313], 4.0, 2.4], [[360, 326], [356, 334], [353, 340], [350, 344], 3.6, 2.0]],
          lowerLashes: [[[346, 318], [342, 322], [338, 326], [334, 329]]]
        }, key + 'eyeL', blink);

        drawShoujoEyeDeforming({
          cx: 530 + gazeDX, cy: 334 + gazeDY, rx: 32, ry: 36, rot: 0.16,
          scleraSegsOpen: [[[494, 318], [508, 296], [538, 294], [566, 318]], [[566, 318], [576, 336], [574, 356], [556, 366]], [[556, 366], [530, 372], [500, 354], [494, 318]]],
          scleraSegsMid: [[[494, 328], [512, 322], [542, 324], [570, 340]], [[570, 340], [576, 348], [570, 360], [556, 366]], [[556, 366], [530, 372], [500, 354], [494, 328]]],
          scleraSegsClosed: [[[494, 344], [514, 360], [544, 366], [572, 356]], [[572, 356], [574, 358], [566, 362], [556, 366]], [[556, 366], [530, 372], [500, 356], [494, 344]]],
          upperLidSegsOpen: [[[488, 316], [506, 290], [542, 288], [574, 322]], [[574, 322], [584, 338], [592, 350], [602, 354]], [[602, 354], [582, 354], [568, 340], [556, 322]], [[556, 322], [536, 304], [508, 302], [488, 316]]],
          upperLidSegsMid: [[[488, 326], [510, 314], [544, 316], [576, 338]], [[576, 338], [586, 346], [594, 352], [603, 353]], [[603, 353], [584, 356], [566, 348], [552, 336]], [[552, 336], [534, 326], [508, 324], [488, 326]]],
          upperLidSegsClosed: [[[490, 342], [514, 358], [546, 364], [578, 354]], [[578, 354], [588, 354], [596, 354], [604, 352]], [[604, 352], [588, 362], [566, 370], [542, 370]], [[542, 370], [514, 368], [496, 354], [490, 342]]],
          lowerLidSegs: [[[500, 350], [518, 366], [544, 370], [566, 360]]],
          creaseSegsOpen: [[[502, 280], [528, 278], [558, 292], [578, 316]]],
          creaseSegsMid: [[[498, 304], [524, 302], [554, 314], [576, 332]]],
          creaseSegsClosed: [[[496, 326], [520, 342], [550, 348], [576, 342]]],
          mainHi: [533 + gazeDX * 0.6, 321 + gazeDY * 0.6, 11.5, 11.5, -0.1],
          subHi: [517 + gazeDX * 0.8, 339 + gazeDY * 0.8, 5.2, 5.2, 0],
          botHi: [534 + gazeDX * 0.5, 360 + gazeDY * 0.5, 6.5, 4.5, 0.15],
          upperLashesOpen: [[[508, 298], [506, 290], [506, 283], [508, 278], 3.5, 2.0], [[564, 316], [573, 313], [582, 310], [590, 306], 4.4, 2.6]],
          upperLashesMid: [[[508, 318], [505, 312], [504, 306], [505, 301], 3.5, 2.0], [[565, 332], [574, 330], [583, 328], [591, 326], 4.4, 2.6]],
          upperLashesClosed: [[[508, 356], [503, 363], [499, 369], [495, 373], 3.5, 2.0], [[562, 365], [566, 373], [570, 379], [574, 384], 4.4, 2.6]],
          lowerLashes: [[[502, 352], [498, 355], [494, 358], [491, 360]]]
        }, key + 'eyeR', blink);

        withPivot(485, 115, bangLRot, 1, 1, 0, 0, () => {
          const bangsLeftP = bezierPts([
            [[485, 115], [442, 102], [412, 138], [410, 186]],
            [[410, 186], [410, 218], [428, 236], [452, 226]],
            [[452, 226], [424, 238], [392, 218], [392, 172]],
            [[392, 172], [385, 208], [396, 236], [418, 242]],
            [[418, 242], [382, 236], [358, 206], [362, 165]],
            [[362, 165], [344, 205], [348, 248], [375, 268]],
            [[375, 268], [342, 258], [322, 220], [332, 178]],
            [[332, 178], [312, 220], [318, 266], [344, 286]],
            [[344, 286], [308, 278], [286, 244], [295, 195]],
            [[295, 195], [272, 225], [278, 265], [298, 282]],
            [[298, 282], [268, 258], [262, 210], [282, 155]],
            [[282, 155], [312, 96], [395, 65], [485, 75]],
            [[485, 75], [488, 95], [488, 108], [485, 115]],
          ], 14);
          sgShape(bangsLeftP, SG.hairMain, { key: key + 'bangsL', w: 2.2, line: SG.ink });

          const bangsRightP = bezierPts([
            [[492, 115], [534, 108], [552, 148], [536, 192]],
            [[536, 192], [516, 228], [496, 256], [516, 282]],
            [[516, 282], [504, 258], [518, 224], [545, 186]],
            [[545, 186], [530, 228], [528, 265], [554, 284]],
            [[554, 284], [544, 255], [558, 215], [585, 185]],
            [[585, 185], [582, 235], [586, 286], [612, 326]],
            [[612, 326], [625, 365], [612, 405], [575, 444]],
            [[575, 444], [542, 476], [534, 514], [558, 535]],
            [[558, 535], [544, 512], [554, 480], [586, 452]],
            [[586, 452], [568, 495], [572, 545], [550, 566]],
            [[550, 566], [534, 574], [520, 564], [524, 550]],
            [[524, 550], [518, 568], [538, 580], [562, 564]],
            [[562, 564], [586, 542], [580, 495], [602, 455]],
            [[602, 455], [634, 412], [646, 368], [636, 326]],
            [[636, 326], [652, 368], [685, 388], [715, 395]],
            [[715, 395], [750, 320], [740, 180], [660, 95]],
            [[660, 95], [595, 58], [525, 65], [492, 115]],
          ], 14);
          sgShape(bangsRightP, SG.hairMain, { key: key + 'bangsR', w: 2.2, line: SG.ink });
        });

        drawShoujoRose(721, 256, 29, -0.15, key + 'rose1', []);
        drawShoujoRose(298, 488, 27, 0.1, key + 'rose2', [[-1.35, 18, 12, SG.hairShade]]);
      });

      ctx.restore();
    }

    // =========================================================================
    // CATMULL-ROM SPLINE & MULTI-LAYER SHOUJO HAIR RIBBON VOLUME ENGINE
    // =========================================================================
    function catmullRomPts(ctrlPts, subSteps = 16, tension = 0.52) {
      if (!ctrlPts || ctrlPts.length < 2) return ctrlPts ? [...ctrlPts] : [];
      if (ctrlPts.length === 2) {
        const out = [];
        for (let i = 0; i <= subSteps; i++) {
          out.push(lerpPt(ctrlPts[0], ctrlPts[1], i / subSteps));
        }
        return out;
      }
      const P = [];
      const n = ctrlPts.length;
      for (let i = 0; i < n - 1; i++) {
        const p0 = i === 0 ? [2 * ctrlPts[0][0] - ctrlPts[1][0], 2 * ctrlPts[0][1] - ctrlPts[1][1]] : ctrlPts[i - 1];
        const p1 = ctrlPts[i];
        const p2 = ctrlPts[i + 1];
        const p3 = i + 2 < n ? ctrlPts[i + 2] : [2 * ctrlPts[n - 1][0] - ctrlPts[n - 2][0], 2 * ctrlPts[n - 1][1] - ctrlPts[n - 2][1]];

        const c1 = [
          p1[0] + ((p2[0] - p0[0]) * tension) / 3,
          p1[1] + ((p2[1] - p0[1]) * tension) / 3,
        ];
        const c2 = [
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

    function drawCatmullHairRibbonLock(spineCtrlPts, wRoot, wBelly, wTip, pal, opts: any = {}) {
      const spine = catmullRomPts(spineCtrlPts, 16, 0.52);
      const N = spine.length;
      if (N < 3) return;

      const tier = opts.tier ?? 'mid';
      const pinchAt = opts.pinchAt ?? -1;
      const pinchFactor = opts.pinchFactor ?? 0.45;
      const asym = opts.asymBias ?? 0.12;
      const rKey = opts.key ?? 'cmRib';

      const leftEdge = [];
      const rightEdge = [];
      const sheenLeft = [];
      const sheenRight = [];
      const valleyOuter = [];
      const valleyInner = [];
      const creaseSpline = [];

      for (let i = 0; i < N; i++) {
        const u = i / (N - 1);
        const pPrev = spine[Math.max(0, i - 1)];
        const pNext = spine[Math.min(N - 1, i + 1)];
        const dx = pNext[0] - pPrev[0];
        const dy = pNext[1] - pPrev[1];
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const bellyEnv = Math.sin(Math.pow(u, 0.78) * Math.PI);
        const tipTaper = Math.pow(1 - u, 0.58);
        let halfW = (wRoot * (1 - u) * 0.65 + wBelly * bellyEnv) * tipTaper + wTip * (1 - bellyEnv) * 0.25;

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

        if (u >= 0.06 && u <= 0.88) {
          valleyOuter.push([rx, ry]);
          valleyInner.push([
            spine[i][0] - nx * (wR * 0.22),
            spine[i][1] - ny * (wR * 0.22),
          ]);
        }

        if (opts.sheen !== false && u >= 0.16 && u <= 0.65) {
          const uLocal = (u - 0.16) / 0.49;
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

        if (opts.innerCrease !== false && u >= 0.10 && u <= 0.86) {
          const cOff = (wL - wR) * 0.25 + halfW * 0.12 * Math.cos(u * Math.PI * 1.5);
          creaseSpline.push([
            spine[i][0] + nx * cOff,
            spine[i][1] + ny * cOff,
          ]);
        }
      }

      const ribbonPoly = [...leftEdge, ...rightEdge.slice().reverse()];

      // 1. Under-lock volume cast shadow
      const [shDX, shDY] = opts.shadowOffset ?? (tier === 'over' ? [2.6, 4.0] : tier === 'mid' ? [2.0, 3.0] : [1.4, 2.0]);
      ctx.save();
      ctx.translate(shDX, shDY);
      trace(ribbonPoly, true);
      ctx.fillStyle = pal.deep;
      ctx.globalAlpha = tier === 'over' ? 0.42 : tier === 'mid' ? 0.34 : 0.24;
      ctx.fill();
      ctx.restore();

      // 2. Multi-stop volume gradient fill + valley shade + sheen band
      sgShape(ribbonPoly, tier === 'under' ? pal.warm : pal.main, {
        key: rKey + 'fill',
        line: false,
        amt: 0.15,
        grad: (bb) => {
          const g = ctx.createLinearGradient(spine[0][0], spine[0][1], spine[N - 1][0], spine[N - 1][1]);
          if (tier === 'under') {
            g.addColorStop(0, pal.warm);
            g.addColorStop(0.55, pal.shade);
            g.addColorStop(1, pal.deep);
          } else if (tier === 'over') {
            g.addColorStop(0, pal.light);
            g.addColorStop(0.42, pal.sheen || pal.light);
            g.addColorStop(0.76, pal.main);
            g.addColorStop(1, pal.warm);
          } else {
            g.addColorStop(0, pal.light);
            g.addColorStop(0.52, pal.main);
            g.addColorStop(0.86, pal.warm);
            g.addColorStop(1, pal.shade);
          }
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          if (valleyOuter.length > 2) {
            const vPoly = [...valleyOuter, ...valleyInner.slice().reverse()];
            ctx.save();
            trace(vPoly, true);
            ctx.fillStyle = tier === 'under' ? pal.deep : pal.shade;
            ctx.globalAlpha = tier === 'over' ? 0.45 : 0.58;
            ctx.fill();
            ctx.restore();
          }
          if (sheenLeft.length > 2 && tier !== 'under') {
            const sPoly = [...sheenLeft, ...sheenRight.slice().reverse()];
            ctx.save();
            trace(sPoly, true);
            ctx.fillStyle = pal.sheen || pal.light;
            ctx.globalAlpha = tier === 'over' ? (pal.sheenAlpha ?? 0.58) : (pal.sheenAlpha ?? 0.42);
            ctx.fill();
            ctx.restore();
          }
        },
      });

      // 3. Tapered dip-pen Catmull-Rom outer edges & internal flow crease
      const wOuterMid = tier === 'over' ? 2.3 : tier === 'mid' ? 2.0 : 1.75;
      sgTaperLine(leftEdge, 1.0, wOuterMid, 0.35, pal.ink, 0.96);
      sgTaperLine(rightEdge, 0.95, wOuterMid * 0.92, 0.35, pal.ink, 0.94);

      if (creaseSpline.length > 2) {
        sgTaperLine(creaseSpline, 0.45, 1.3, 0.3, pal.inkSoft, 0.78);
      }
    }

    // =========================================================================
    // 3B. EXACT MASTER CHARACTER: AUBURN WAVY GIRL W/ BLACK BOW & EYELET BLOUSE
    // =========================================================================
    const AG = {
      bg: '#ffffff',
      ink: '#0e0a09',           // Crisp manga dip-pen ink
      inkSoft: '#3b2822',       // Warm dark-brown secondary line
      inkHatch: '#593e38',      // Fine parallel blush & nose-bridge hatch ink

      // Auburn / Terracotta Wavy Hair
      hairLight: '#d88358',     // Crown & upper wave highlight
      hairMain: '#c56e44',      // Main warm terracotta-auburn
      hairWarm: '#b45c34',      // Mid-lower wave warm auburn
      hairShade: '#9a4926',     // Inner curl shadow
      hairDeep: '#783418',      // Deep neck-side hair shadow underlay

      // Porcelain-Peach Skin & Mauve Cast Shadow
      skinLight: '#fff6f2',     // Forehead, nose bridge & chin highlight
      skinMain: '#fdede6',      // Main porcelain-peach skin
      skinWarm: '#f8dfd5',      // Soft cheek & shoulder tone
      neckShadow: '#9e7781',    // Characteristic mauve-taupe cast shadow under jaw
      earShade: '#eabfb5',      // Inner ear shell shadow
      blushRGB: '236,154,142',  // Soft warm coral-rose cheek blush

      // Eyes, Brows & Lips
      eyeInk: '#0d0908',
      browFill: '#9e5030',
      lipUpper: '#d48779',      // Warm rose-terracotta upper lip
      lipLower: '#e49d90',      // Plush lower lip
      lipInner: '#6b342e',      // Inner mouth corner shadow

      // Bow, Flowers & Eyelet Ruffle Blouse
      bowBlack: '#0e0c0d',      // Velvet black hair bow & string choker
      bowCrease: '#383235',     // Subtle satin bow fold line
      flowerFill: '#fbd4b4',    // Warm peach-apricot 5-petal hair flowers
      flowerCenter: '#e09868',
      blouseWhite: '#fcfaf7',   // Crisp warm-white off-shoulder peasant blouse
      blouseShade: '#e4dfd7',   // Gathered ruffle & sleeve fold shadow
    };

    function drawSmallHairFlower(fx, fy, r, rot, fillCol, centerCol, fKey, sway = 0) {
      withPivot(fx, fy, rot + sway, 1, 1, 0, 0, () => {
        ctx.save();
        ctx.translate(fx, fy);
        const outerP = [];
        const nPetals = 5;
        const subSteps = 10;
        for (let i = 0; i < nPetals; i++) {
          const a0 = (i / nPetals) * TAU - Math.PI / 2;
          const a1 = ((i + 1) / nPetals) * TAU - Math.PI / 2;
          for (let j = 0; j <= subSteps; j++) {
            const u = j / subSteps;
            const a = a0 + (a1 - a0) * u;
            const arch = Math.sin(u * Math.PI);
            const rad = r * (0.28 + 0.72 * Math.pow(arch, 0.75));
            outerP.push([Math.cos(a) * rad, Math.sin(a) * rad]);
          }
        }
        sgShape(outerP, fillCol, { key: fKey + 'pet', w: 1.7, line: AG.ink, amt: 0.14 });
        for (let i = 0; i < nPetals; i++) {
          const a = (i / nPetals) * TAU - Math.PI / 2;
          sgLine([[Math.cos(a) * r * 0.16, Math.sin(a) * r * 0.16], [Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42]], {
            key: fKey + 'cr' + i, w: 1.1, col: AG.inkSoft, amt: 0.08
          });
        }
        sgShape(ellipsePts(0, 0, r * 0.18, r * 0.18, 0, 10), centerCol, {
          key: fKey + 'cnt', w: 1.4, line: AG.ink, amt: 0.08
        });
        ctx.restore();
      });
    }

    function drawEyeletRuffleBand(topSpinePts, width, nScallops, rKey = 'eyelet') {
      const N = topSpinePts.length;
      if (N < 2) return;
      const arc = [0];
      for (let i = 1; i < N; i++) {
        arc.push(arc[i - 1] + Math.hypot(topSpinePts[i][0] - topSpinePts[i - 1][0], topSpinePts[i][1] - topSpinePts[i - 1][1]));
      }
      const totalLen = arc[N - 1] || 1;

      const sampleAt = (s) => {
        const target = Math.max(0, Math.min(totalLen, s));
        let idx = 0;
        while (idx < N - 2 && arc[idx + 1] < target) idx++;
        const segLen = (arc[idx + 1] - arc[idx]) || 1;
        const t = (target - arc[idx]) / segLen;
        const x = topSpinePts[idx][0] + (topSpinePts[idx + 1][0] - topSpinePts[idx][0]) * t;
        const y = topSpinePts[idx][1] + (topSpinePts[idx + 1][1] - topSpinePts[idx][1]) * t;
        const dx = topSpinePts[idx + 1][0] - topSpinePts[idx][0];
        const dy = topSpinePts[idx + 1][1] - topSpinePts[idx][1];
        const dLen = Math.hypot(dx, dy) || 1;
        // Outward normal pointing downward & outward along the ruffle drape
        const nx = -dy / dLen;
        const ny = dx / dLen;
        return { x, y, nx, ny, tx: dx / dLen, ty: dy / dLen };
      };

      // 1. Build scalloped bottom edge of the wide eyelet flounce
      const botEdge = [];
      const subSteps = 12;
      for (let i = 0; i < nScallops; i++) {
        for (let j = 0; j <= subSteps; j++) {
          if (i > 0 && j === 0) continue;
          const u = j / subSteps;
          const s = ((i + u) / nScallops) * totalLen;
          const pt = sampleAt(s);
          const arch = Math.sin(u * Math.PI);
          // Slight radial fan at left & right off-shoulder ends
          const uGlobal = (i + u) / nScallops;
          const fanX = (uGlobal - 0.52) * 58;
          const d = width * (0.82 + 0.18 * arch);
          botEdge.push([pt.x + pt.nx * d + fanX, pt.y + pt.ny * d]);
        }
      }

      // 2. Build standing mini-frill top edge above topSpinePts
      const topFrill = [];
      const frillWaves = nScallops * 2;
      for (let i = 0; i <= frillWaves * 6; i++) {
        const u = i / (frillWaves * 6);
        const s = u * totalLen;
        const pt = sampleAt(s);
        const wave = Math.sin(u * frillWaves * Math.PI);
        const dUp = -16 - 9 * Math.abs(wave);
        topFrill.push([pt.x + pt.nx * dUp, pt.y + pt.ny * dUp]);
      }

      // Fill standing mini-frill
      const frillPoly = [...topFrill, ...topSpinePts.slice().reverse()];
      sgShape(frillPoly, AG.blouseWhite, {
        key: rKey + 'topFrill', w: 2.0, line: AG.ink, amt: 0.18,
        innerFn: () => {
          for (let i = 1; i < frillWaves; i += 2) {
            const pt = sampleAt((i / frillWaves) * totalLen);
            sgLine([[pt.x, pt.y], [pt.x - pt.nx * 14, pt.y - pt.ny * 14]], {
              key: rKey + 'tfCr' + i, w: 1.2, col: AG.inkSoft, amt: 0.12
            });
          }
        }
      });

      // Fill main wide eyelet ruffle flounce
      const flouncePoly = [...topSpinePts, ...botEdge.slice().reverse()];
      sgShape(flouncePoly, AG.blouseWhite, {
        key: rKey + 'flounce', line: false, amt: 0.18,
        innerFn: () => {
          // Soft gathered shadow shapes under the top seam and between pleats
          for (let i = 0; i < nScallops; i++) {
            const uGlobal = (i + 0.5) / nScallops;
            const sMid = uGlobal * totalLen;
            const pm = sampleAt(sMid);
            const fanX = (uGlobal - 0.52) * 58;
            // Soft grey-beige pleat shadow wedge
            if (i % 2 === 0) {
              const shP = [
                [pm.x - pm.tx * 8, pm.y - pm.ty * 8],
                [pm.x + pm.tx * 10, pm.y + pm.ty * 10],
                [pm.x + pm.nx * (width * 0.65) + fanX * 0.7, pm.y + pm.ny * (width * 0.65)],
              ];
              sgShape(shP, AG.blouseShade, { key: rKey + 'shW' + i, line: false, fillA: 0.75 });
            }
          }
        }
      });

      // Top gathering seam line & vertical drape pleat lines
      sgLine(topSpinePts, { key: rKey + 'seamTop', w: 2.1, col: AG.ink, amt: 0.18 });
      sgLine([topSpinePts[0], ...botEdge, topSpinePts[topSpinePts.length - 1]], {
        key: rKey + 'botHem', w: 2.3, col: AG.ink, amt: 0.18
      });

      // Broderie Anglaise Eyelet Holes & Vertical Pleat Folds inside each scallop
      for (let i = 0; i < nScallops; i++) {
        const uGlobal = (i + 0.5) / nScallops;
        const sMid = uGlobal * totalLen;
        const pm = sampleAt(sMid);
        const fanX = (uGlobal - 0.52) * 58;

        // Vertical pleat crease from top seam or bottom valley
        if (i > 0 && i < nScallops) {
          const uVal = i / nScallops;
          const pv = sampleAt(uVal * totalLen);
          const vFanX = (uVal - 0.52) * 58;
          sgLine([
            [pv.x + pv.nx * 8, pv.y + pv.ny * 8],
            [pv.x + pv.nx * (width * 0.68) + vFanX * 0.75, pv.y + pv.ny * (width * 0.68)]
          ], { key: rKey + 'pleat' + i, w: 1.45, col: AG.ink, amt: 0.15 });
        }

        // 3-hole broderie anglaise floral eyelet cluster near the scalloped hem
        const ex = pm.x + pm.nx * (width * 0.70) + fanX * 0.82;
        const ey = pm.y + pm.ny * (width * 0.70);
        const ang = Math.atan2(pm.ty, pm.tx);
        sgShape(ellipsePts(ex, ey, 3.2, 5.2, ang + Math.PI / 2, 10), AG.blouseShade, {
          key: rKey + 'eyM' + i, w: 1.25, line: AG.ink, amt: 0.08
        });
        sgShape(ellipsePts(ex - pm.tx * 7.5, ey - pm.ty * 7.5 + 3, 2.4, 3.8, ang + 1.1, 8), AG.blouseShade, {
          key: rKey + 'eyL' + i, w: 1.15, line: AG.ink, amt: 0.08
        });
        sgShape(ellipsePts(ex + pm.tx * 7.5, ey + pm.ty * 7.5 + 3, 2.4, 3.8, ang + 2.0, 8), AG.blouseShade, {
          key: rKey + 'eyR' + i, w: 1.15, line: AG.ink, amt: 0.08
        });
        // Tiny pin-dot above eyelet
        ctx.save();
        ctx.fillStyle = AG.ink;
        ctx.beginPath();
        ctx.arc(ex - pm.nx * 10, ey - pm.ny * 10, 1.5, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawMinimalMangaEyeDeforming(cfg, eKey = 'mEye', blink = 0) {
      const {
        cx, cy, rx, ry, rot,
        upperOpen, upperMid, upperClosed,
        lowerSegs, creaseOpen, creaseMid, creaseClosed,
        lashesOpen, lashesMid, lashesClosed,
        lowerTicks, catchlights
      } = cfg;

      const u = Math.max(0, Math.min(1, blink));
      const interp3 = (oS, mS, cS) => (u <= 0.55 ? lerpSegs(oS, mS, u / 0.55) : lerpSegs(mS, cS, (u - 0.55) / 0.45));

      const curUpper = interp3(upperOpen, upperMid, upperClosed);
      const curCrease = creaseOpen ? interp3(creaseOpen, creaseMid, creaseClosed) : null;

      // 1. Sclera & Clipped Dark Obsidian Iris (Never squashed!)
      if (u < 0.92) {
        const upperP = bezierPts(curUpper, 14);
        const lowerP = bezierPts(lowerSegs, 14);
        const scleraPoly = [...upperP, ...lowerP.slice().reverse()];

        sgShape(scleraPoly, '#ffffff', {
          key: eKey + 'scl', line: false, amt: 0.12,
          innerFn: () => {
            const irisP = ellipsePts(cx, cy, rx, ry, rot || 0, 28);
            sgShape(irisP, AG.eyeInk, { key: eKey + 'iris', w: 1.5, line: AG.eyeInk, amt: 0.08 });
            if (catchlights) {
              ctx.save();
              ctx.fillStyle = '#ffffff';
              for (const [hx, hy, hrx, hry, hrot] of catchlights) {
                ctx.beginPath();
                ctx.ellipse(hx, hy, hrx, hry, hrot || 0, 0, TAU);
                ctx.fill();
              }
              ctx.restore();
            }
          }
        });
      }

      // 2. Lower Eyelid Line & Subtle Lower Lash Ticks
      if (lowerSegs && u < 0.78) {
        sgTaperLine(bezierPts(lowerSegs, 12), 1.0, 2.0 * (1 - u), 1.0, AG.ink, 0.92);
      }
      if (lowerTicks && u < 0.65) {
        for (let i = 0; i < lowerTicks.length; i++) {
          sgLine(lowerTicks[i], { key: eKey + 'lt' + i, w: 1.4, col: AG.ink, a: 0.85 * (1 - u / 0.65), amt: 0.08 });
        }
      }

      // 3. Thick Winged Upper Eyelash Line
      const upperStrokeP = bezierPts(curUpper, 16);
      sgTaperLine(upperStrokeP, 2.2, 5.2, 2.6, AG.ink, 0.99);

      // 4. Individual Winged Lash Spikes
      if (lashesOpen) {
        for (let i = 0; i < lashesOpen.length; i++) {
          const oL = lashesOpen[i], mL = lashesMid[i], cL = lashesClosed[i];
          const uu = u <= 0.55 ? u / 0.55 : (u - 0.55) / 0.45;
          const A = u <= 0.55 ? oL : mL;
          const Bseg = u <= 0.55 ? mL : cL;
          const lPts = bezierPts([[
            lerpPt(A[0], Bseg[0], uu),
            lerpPt(A[1], Bseg[1], uu),
            lerpPt(A[2], Bseg[2], uu),
            lerpPt(A[3], Bseg[3], uu)
          ]], 10);
          sgTaperLine(lPts, oL[4] || 3.4, oL[5] || 2.0, 0.4, AG.ink, 0.98);
        }
      }

      // 5. Upper Eyelid Fold Crease
      if (curCrease) {
        sgTaperLine(bezierPts(curCrease, 14), 1.1, 2.1, 1.1, AG.ink, 0.92);
      }
    }

    function drawAuburnGirlMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'ag';
      const isRest = !rig;

      const breath = isRest ? 0 : (rig.breath / 0.018);
      const torsoSX = 1 + breath * 0.005;
      const torsoSY = 1 + breath * 0.010;
      const torsoDY = -breath * 3.2;
      const torsoSway = isRest ? 0 : rig.torsoSway;

      const headRot = isRest ? 0 : rig.headTilt;
      const headDX = isRest ? 0 : rig.headTurn;
      const headDY = isRest ? 0 : rig.headNod;

      const hairLRot = isRest ? 0 : rig.hairSwayL;
      const hairRRot = isRest ? 0 : rig.hairSwayR;
      const bangsRot = isRest ? 0 : rig.bangsSway;
      const bowBounce = isRest ? 0 : rig.ruffleBounce;

      const blink = isRest ? 0 : rig.blink;
      const gazeDX = isRest ? 0 : rig.gazeX * 0.65;
      const gazeDY = isRest ? 0 : rig.gazeY * 0.65;
      const browLift = isRest ? 0 : rig.browLift;
      const lipPart = 1 + (isRest ? 0 : rig.mouthOpen);
      const blushAlpha = isRest ? 0.42 : (0.34 + rig.smile * 0.22);

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = AG.bg;
        ctx.fillRect(0, 0, 1000, 1000);
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      const renderHair = (StudioState as any).renderHair !== false;

      // ===================================================================
      // LAYER 1, 2 & 3: DEEP NECK SHADOW & BACK CASCADING WAVY AUBURN HAIR
      // ===================================================================
      if (renderHair) {
      withPivot(510, 480, (hairLRot + hairRRot) * 0.5, 1, 1, headDX * 0.4, headDY * 0.4, () => {
        const backDeepP = bezierPts([
          [[360, 440], [660, 440], [690, 620], [650, 740]],
          [[650, 740], [350, 740], [310, 620], [360, 440]]
        ], 12);
        sgShape(backDeepP, AG.hairDeep, { key: key + 'hDeep', line: false });
      });

      // LAYER 2: Left Cascading Wavy Auburn Hair Mass (Pivoted at (365, 260))
      withPivot(365, 260, hairLRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
        // Upper Ponytail Crown Puff behind Black Bow (x: 228..442, y: 42..355)
        const ponyPuffP = bezierPts([
          [[412, 92], [435, 66], [428, 42], [400, 42]],
          [[400, 42], [422, 54], [418, 72], [398, 74]],
          [[398, 74], [364, 52], [318, 66], [296, 108]],
          [[296, 108], [272, 134], [254, 178], [262, 224]],
          [[262, 224], [234, 248], [222, 292], [238, 326]],
          [[238, 326], [248, 302], [244, 272], [266, 252]],
          [[266, 252], [256, 286], [258, 325], [284, 344]],
          [[284, 344], [274, 320], [275, 294], [292, 278]],
          [[292, 278], [298, 328], [335, 365], [385, 368]],
          [[385, 368], [425, 260], [435, 160], [412, 92]]
        ], 16);
        sgShape(ponyPuffP, AG.hairMain, {
          key: key + 'ponyPuff', w: 2.5, line: AG.ink, amt: 0.2,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, AG.hairLight);
            g.addColorStop(0.6, AG.hairMain);
            g.addColorStop(1, AG.hairShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          }
        });

        // Main Left Cascading Wavy Hair Mass (x: 132..465, y: 318..818)
        const leftHairP = bezierPts([
          [[312, 336], [285, 392], [248, 434], [228, 488]],
          [[228, 488], [214, 526], [225, 560], [198, 588]],
          [[198, 588], [174, 614], [176, 654], [202, 672]],
          [[202, 672], [178, 696], [164, 738], [172, 778]],
          [[172, 778], [156, 800], [134, 804], [132, 782]],
          [[132, 782], [134, 812], [162, 818], [192, 792]],
          [[192, 792], [245, 735], [350, 725], [468, 695]],
          [[468, 695], [475, 560], [455, 420], [395, 345]],
          [[395, 345], [355, 340], [330, 338], [312, 336]]
        ], 18);

        sgShape(leftHairP, AG.hairMain, {
          key: key + 'hMassL', line: false, amt: 0.2,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, AG.hairMain);
            g.addColorStop(0.65, AG.hairWarm);
            g.addColorStop(1, AG.hairShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            const shP = bezierPts([
              [[345, 445], [315, 535], [295, 625], [345, 685]],
              [[345, 685], [425, 685], [465, 620], [455, 495]],
              [[455, 495], [415, 455], [375, 445], [345, 445]]
            ], 12);
            sgShape(shP, AG.hairShade, { key: key + 'hShL', line: false, fillA: 0.65 });
          }
        });

        // Left Outer Hair Wave Contours & Internal S-Wave Strand Lines
        sgLine(bezierPts([
          [[312, 336], [285, 392], [248, 434], [228, 488]],
          [[228, 488], [214, 526], [225, 560], [198, 588]],
          [[198, 588], [174, 614], [176, 654], [202, 672]],
          [[202, 672], [178, 696], [164, 738], [172, 778]],
          [[172, 778], [156, 800], [134, 804], [132, 782]],
          [[132, 782], [134, 812], [162, 818], [192, 792]]
        ], 18), { key: key + 'hOutL', w: 2.6, col: AG.ink, amt: 0.22 });

        // Fine left flyaway wave wisps
        sgLine(bezierPts([[[302, 76], [336, 46], [378, 46], [404, 64]]], 12), { key: key + 'flyTop', w: 2.0, col: AG.ink, amt: 0.2 });
        sgLine(bezierPts([[[254, 422], [225, 448], [228, 485], [212, 512]]], 12), { key: key + 'flyM1', w: 1.8, col: AG.ink, amt: 0.2 });
        sgLine(bezierPts([[[218, 535], [195, 542], [192, 558], [206, 566]]], 10), { key: key + 'flyM2', w: 1.6, col: AG.ink, amt: 0.2 });

        const leftStrands = [
          [[[332, 355], [308, 428], [268, 482], [262, 552]], [[262, 552], [256, 612], [218, 658], [212, 725]]],
          [[[352, 378], [326, 452], [292, 512], [286, 582]], [[286, 582], [280, 642], [244, 686], [232, 742]]],
          [[[372, 435], [354, 512], [332, 578], [344, 645]], [[344, 645], [352, 675], [324, 696], [292, 692]]],
          [[[392, 468], [376, 538], [362, 602], [378, 658]]],
          [[[416, 488], [405, 552], [398, 615], [412, 668]]],
          [[[435, 505], [428, 565], [424, 622], [435, 672]]],
        ];
        for (let i = 0; i < leftStrands.length; i++) {
          sgLine(bezierPts(leftStrands[i], 14), { key: key + 'lStr' + i, w: 1.75, col: AG.ink, amt: 0.2 });
        }

        // Flower #6 tucked into mid-left cascading waves at (302, 495)
        drawSmallHairFlower(302, 495, 19, -0.15, AG.flowerFill, AG.flowerCenter, key + 'flw6', bowBounce * 0.4);
      });

      // LAYER 3: Right Back Wavy Hair Mass (Behind right cheek & shoulder, Pivoted at (635, 290))
      withPivot(635, 290, hairRRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
        const rightHairP = bezierPts([
          [[595, 485], [645, 455], [692, 445], [708, 505]],
          [[708, 505], [724, 568], [732, 632], [748, 668]],
          [[748, 668], [755, 692], [735, 708], [695, 708]],
          [[695, 708], [625, 708], [588, 655], [586, 565]],
          [[586, 565], [585, 520], [588, 495], [595, 485]]
        ], 16);
        sgShape(rightHairP, AG.hairWarm, {
          key: key + 'hMassR', w: 2.5, line: AG.ink, amt: 0.2,
          innerFn: () => {
            sgShape([[585, 490], [655, 490], [650, 660], [585, 660]], AG.hairDeep, {
              key: key + 'hDeepR', line: false, fillA: 0.55
            });
          }
        });

        const rightBackStrands = [
          [[[602, 515], [598, 565], [602, 615], [614, 655]]],
          [[[618, 510], [616, 565], [620, 618], [634, 662]]],
          [[[636, 505], [635, 565], [642, 618], [656, 665]]],
        ];
        for (let i = 0; i < rightBackStrands.length; i++) {
          sgLine(bezierPts(rightBackStrands[i], 12), { key: key + 'rBStr' + i, w: 1.65, col: AG.ink, amt: 0.18 });
        }
      });
      } // end if (renderHair)

      // ===================================================================
      // LAYER 4..7: TORSO, MAUVE NECK SHADOW, DOUBLE-CORD CHOKER & EYELET BLOUSE
      // ===================================================================
      withPivot(505, 920, torsoSway, torsoSX, torsoSY, 0, torsoDY, () => {
        // 4A. Bare Shoulders, Neck & Chest Porcelain-Peach Base (x: 212..772, y: 465..785)
        const torsoSkinP = bezierPts([
          [[448, 468], [456, 535], [452, 598], [422, 646]],
          [[422, 646], [368, 676], [285, 665], [238, 705]],
          [[238, 705], [214, 728], [212, 755], [220, 775]],
          [[220, 775], [410, 815], [610, 815], [768, 765]],
          [[768, 765], [772, 725], [755, 682], [705, 672]],
          [[705, 672], [635, 658], [592, 622], [588, 565]],
          [[588, 565], [586, 520], [588, 495], [588, 478]],
          [[588, 478], [535, 480], [485, 475], [448, 468]]
        ], 16);

        sgShape(torsoSkinP, AG.skinMain, {
          key: key + 'torsoSkin', line: false, amt: 0.18,
          grad: (bb) => {
            const g = ctx.createRadialGradient(505, 675, 30, 505, 695, 290);
            g.addColorStop(0, AG.skinLight);
            g.addColorStop(0.68, AG.skinMain);
            g.addColorStop(1, AG.skinWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // FIXED: Mauve-Rose Cast Shadow anchored at y=440 so it tucks 100% flush under the jawline with ZERO gap!
            const jawShadowP = bezierPts([
              [[444, 440], [500, 440], [560, 440], [590, 440]],
              [[590, 440], [588, 558], [582, 574], [556, 572]],
              [[556, 572], [516, 564], [478, 528], [448, 494]],
              [[448, 494], [445, 470], [444, 452], [444, 440]]
            ], 14);
            sgShape(jawShadowP, AG.neckShadow, { key: key + 'jawSh', line: false, fillA: 0.92 });

            // Subtle shoulder warmth blush
            sgBlush(285, 705, 58, 35, AG.blushRGB, 0.25, -0.2);
            sgBlush(715, 702, 55, 34, AG.blushRGB, 0.25, 0.2);
          }
        });

        // Neck, Shoulders & Collarbone Ink Contours (tucked up to y=462 under jaw)
        sgLine(bezierPts([[[448, 462], [456, 535], [452, 598], [428, 642]]], 14), { key: key + 'neckL', w: 2.6, col: AG.ink, amt: 0.18 });
        sgLine(bezierPts([[[588, 505], [586, 565], [588, 608], [602, 636]]], 14), { key: key + 'neckR', w: 2.6, col: AG.ink, amt: 0.18 });
        sgLine(bezierPts([[[388, 674], [308, 668], [244, 692], [214, 750]]], 14), { key: key + 'shldL', w: 2.6, col: AG.ink, amt: 0.18 });
        sgLine(bezierPts([[[698, 672], [744, 678], [768, 706], [766, 752]]], 14), { key: key + 'shldR', w: 2.6, col: AG.ink, amt: 0.18 });

        // Collarbones & Sternocleidomastoid Tendon Lines
        sgLine(bezierPts([[[474, 552], [468, 572], [466, 588], [466, 598]]], 8), { key: key + 'tendon', w: 1.5, col: AG.ink, amt: 0.15 });
        sgLine(bezierPts([[[378, 702], [428, 712], [472, 718], [506, 725]]], 12), { key: key + 'clavL', w: 1.8, col: AG.ink, amt: 0.16 });
        sgLine(bezierPts([[[588, 724], [612, 716], [634, 708], [648, 702]]], 10), { key: key + 'clavR', w: 1.7, col: AG.ink, amt: 0.16 });

        // LAYER 5: Double-Cord Black Choker & Tied Front Bow at (554, 626)
        sgLine(bezierPts([[[430, 586], [488, 618], [548, 626], [588, 600]]], 14), { key: key + 'chkCord1', w: 3.2, col: AG.bowBlack, amt: 0.15 });
        sgLine(bezierPts([[[430, 598], [488, 622], [548, 628], [588, 606]]], 14), { key: key + 'chkCord2', w: 3.0, col: AG.bowBlack, amt: 0.15 });

        withPivot(554, 626, bowBounce * 0.45, 1, 1, 0, 0, () => {
          // Left & Right Open String Loops
          sgLine(bezierPts([
            [[552, 626], [526, 634], [508, 658], [516, 672]],
            [[516, 672], [526, 680], [544, 656], [554, 628]]
          ], 14), { key: key + 'chkLoopL', w: 3.6, col: AG.bowBlack, amt: 0.14 });
          sgLine(bezierPts([
            [[556, 626], [578, 636], [596, 656], [592, 670]],
            [[592, 670], [584, 678], [566, 656], [554, 628]]
          ], 14), { key: key + 'chkLoopR', w: 3.6, col: AG.bowBlack, amt: 0.14 });
          // Hanging String Ends
          sgTaperLine(bezierPts([[[552, 628], [545, 668], [546, 712], [554, 750]]], 12), 3.6, 3.2, 1.5, AG.bowBlack);
          sgTaperLine(bezierPts([[[556, 628], [566, 668], [570, 708], [572, 738]]], 12), 3.6, 3.2, 1.5, AG.bowBlack);
        });

        // LAYER 6 & 7: WHITE OFF-SHOULDER PEASANT BLOUSE, PUFF SLEEVES & EYELET RUFFLE
        const blouseBodyP = bezierPts([
          [[204, 755], [405, 815], [610, 815], [785, 745]],
          [[785, 745], [828, 835], [858, 925], [854, 1000]],
          [[854, 1000], [500, 1000], [160, 1000], [160, 1000]],
          [[160, 1000], [138, 945], [148, 868], [204, 755]]
        ], 16);

        sgShape(blouseBodyP, AG.blouseWhite, {
          key: key + 'blouseBase', line: false, amt: 0.18,
          innerFn: () => {
            // Soft shadow under the eyelet ruffle overhang
            const underShP = bezierPts([
              [[175, 875], [360, 955], [640, 955], [825, 865]],
              [[825, 865], [835, 915], [640, 985], [360, 985]],
              [[360, 985], [165, 920], [165, 895], [175, 875]]
            ], 14);
            sgShape(underShP, AG.blouseShade, { key: key + 'blUnderSh', line: false, fillA: 0.72 });
          }
        });

        // Puff Sleeve Outlines & Folds (Left & Right)
        sgLine(bezierPts([[[166, 882], [140, 928], [148, 968], [162, 1000]]], 12), { key: key + 'slvOutL', w: 2.6, col: AG.ink, amt: 0.2 });
        sgLine(bezierPts([[[824, 868], [855, 918], [858, 962], [852, 1000]]], 12), { key: key + 'slvOutR', w: 2.6, col: AG.ink, amt: 0.2 });
        sgLine(bezierPts([[[356, 928], [364, 958], [366, 982], [366, 1000]]], 10), { key: key + 'slvInL', w: 2.2, col: AG.ink, amt: 0.18 });
        sgLine(bezierPts([[[764, 902], [772, 945], [770, 978], [768, 1000]]], 10), { key: key + 'slvInR', w: 2.4, col: AG.ink, amt: 0.18 });

        const lowerDrapeFolds = [
          [[[172, 948], [186, 972], [198, 988], [206, 1000]]],
          [[[192, 938], [205, 966], [216, 986], [224, 1000]]],
          [[[234, 948], [228, 975], [226, 990], [226, 1000]]],
          [[[392, 955], [398, 978], [404, 992], [408, 1000]]],
          [[[414, 962], [420, 982], [425, 994], [428, 1000]]],
          [[[804, 952], [798, 976], [792, 992], [788, 1000]]],
          [[[832, 942], [822, 970], [812, 988], [804, 1000]]],
        ];
        for (let i = 0; i < lowerDrapeFolds.length; i++) {
          sgLine(bezierPts(lowerDrapeFolds[i], 8), { key: key + 'lDrp' + i, w: 1.5, col: AG.ink, amt: 0.15 });
        }

        // Arc-Length Parameterized Broderie Anglaise Eyelet Ruffle Band across Shoulders & Chest!
        const ruffleTopSpine = bezierPts([
          [[204, 755], [312, 788], [435, 814], [556, 814]],
          [[556, 814], [655, 796], [730, 765], [785, 742]]
        ], 24);
        drawEyeletRuffleBand(ruffleTopSpine, 134, 12, key + 'mainRuffle');

        // Center-Front Vertical Ruffled Button Placket (x: 552..642, y: 812..1000) over the flounce!
        const placketFrillLP = bezierPts([
          [[562, 814], [548, 824], [558, 838], [552, 852]],
          [[552, 852], [564, 866], [554, 882], [566, 898]],
          [[566, 898], [558, 914], [570, 930], [564, 946]],
          [[564, 946], [574, 962], [566, 980], [576, 1000]],
          [[576, 1000], [592, 1000], [584, 900], [574, 814]]
        ], 10);
        sgShape(placketFrillLP, AG.blouseWhite, { key: key + 'plkFrL', w: 1.7, line: AG.ink, amt: 0.14 });

        const placketFrillRP = bezierPts([
          [[596, 814], [610, 824], [602, 838], [614, 852]],
          [[614, 852], [606, 866], [620, 882], [612, 898]],
          [[612, 898], [626, 914], [618, 930], [630, 946]],
          [[630, 946], [622, 962], [634, 980], [628, 1000]],
          [[628, 1000], [612, 1000], [602, 900], [596, 814]]
        ], 10);
        sgShape(placketFrillRP, AG.blouseWhite, { key: key + 'plkFrR', w: 1.7, line: AG.ink, amt: 0.14 });

        const placketCenterP = [
          [570, 814], [598, 814], [620, 1000], [588, 1000]
        ];
        sgShape(placketCenterP, AG.blouseWhite, { key: key + 'plkCnt', w: 1.9, line: AG.ink, amt: 0.12 });

        // 3 Dainty Placket Buttons
        const btnCoords = [[585, 842], [600, 912], [606, 980]];
        for (let i = 0; i < btnCoords.length; i++) {
          const [bx, by] = btnCoords[i];
          sgShape(ellipsePts(bx, by, 4.8, 5.2, 0, 12), AG.blouseWhite, {
            key: key + 'btn' + i, w: 1.7, line: AG.ink, amt: 0.08
          });
        }
      });

      // ===================================================================
      // LAYER 8..24: HEAD HIERARCHY (EAR, FACE, EYES, LIPS, BANGS, BOW & FLOWERS)
      // ===================================================================
      withPivot(510, 495, headRot, 1, 1, headDX, headDY, () => {
        // 8A. Left Ear (Viewer Left, x: 362..418, y: 355..445)
        const earLP = bezierPts([
          [[402, 360], [378, 348], [362, 365], [365, 396]],
          [[365, 396], [370, 426], [392, 444], [412, 442]],
          [[412, 442], [418, 415], [412, 382], [402, 360]]
        ], 14);
        sgShape(earLP, AG.skinMain, {
          key: key + 'earL', w: 2.4, line: AG.ink, amt: 0.18,
          innerFn: () => {
            const earShP = bezierPts([
              [[376, 372], [372, 395], [384, 422], [404, 424]],
              [[404, 424], [406, 398], [395, 375], [376, 372]]
            ], 10);
            sgShape(earShP, AG.earShade, { key: key + 'earSh', line: false });
          }
        });
        sgLine(bezierPts([[[375, 372], [388, 378], [395, 398], [388, 418]]], 10), { key: key + 'earIn1', w: 1.7, col: AG.ink, amt: 0.14 });
        sgLine(bezierPts([[[384, 395], [396, 398], [402, 410], [395, 422]]], 8), { key: key + 'earIn2', w: 1.5, col: AG.ink, amt: 0.14 });

        // 8B. Main 3/4 Right-Turned Face Contour (x: 412..682, y: 175..520)
        const faceP = bezierPts([
          [[552, 168], [625, 182], [672, 245], [674, 315]],
          [[674, 315], [676, 345], [682, 378], [675, 415]],
          [[675, 415], [666, 464], [642, 508], [604, 518]],
          [[604, 518], [556, 524], [492, 496], [448, 466]],
          [[448, 466], [420, 444], [412, 405], [416, 355]],
          [[416, 355], [422, 265], [478, 178], [552, 168]]
        ], 18);

        sgShape(faceP, AG.skinMain, {
          key: key + 'faceBase', line: false, amt: 0.18,
          grad: (bb) => {
            const g = ctx.createRadialGradient(565, 335, 25, 555, 355, 220);
            g.addColorStop(0, AG.skinLight);
            g.addColorStop(0.68, AG.skinMain);
            g.addColorStop(1, AG.skinWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // Soft Cheek Blushes & Nose Tip Warmth
            sgBlush(512, 392, 46, 26, AG.blushRGB, blushAlpha, -0.08);
            sgBlush(654, 368, 32, 22, AG.blushRGB, blushAlpha, -0.12);
            sgBlush(608, 366, 18, 12, AG.blushRGB, blushAlpha * 0.65, 0);
          }
        });

        // Crisp Jawline & Right Cheek Contour Stroke
        sgLine(bezierPts([
          [[664, 268], [674, 312], [682, 368], [675, 415]],
          [[675, 415], [666, 464], [642, 508], [604, 518]],
          [[604, 518], [556, 524], [492, 496], [448, 466]]
        ], 18), { key: key + 'jawStroke', w: 2.8, col: AG.ink, amt: 0.18 });

        // 8C. Characteristic Parallel Vertical/Diagonal Cheek & Nose-Bridge Blush Hatching!
        for (let i = 0; i < 9; i++) {
          const hx = 480 + i * 7.5;
          const len = 22 - Math.abs(i - 4) * 2.4;
          const yTop = 382 - Math.sin((i / 8) * Math.PI) * 5;
          sgLine([[hx, yTop], [hx + 2, yTop + len]], { key: key + 'chHL' + i, w: 1.25, col: AG.inkHatch, amt: 0.1 });
        }
        for (let i = 0; i < 6; i++) {
          const hx = 636 + i * 6.5;
          const len = 20 - Math.abs(i - 2.5) * 2.5;
          const yTop = 355 - Math.sin((i / 5) * Math.PI) * 4;
          sgLine([[hx, yTop], [hx + 3, yTop + len]], { key: key + 'chHR' + i, w: 1.25, col: AG.inkHatch, amt: 0.1 });
        }
        // 5 Tiny Nose-Bridge Hatch Ticks
        for (let i = 0; i < 5; i++) {
          const nx = 594 + i * 3.8;
          const ny = 338 - (i % 2) * 2;
          sgLine([[nx, ny], [nx + 1.5, ny + 9]], { key: key + 'nbH' + i, w: 1.15, col: AG.inkHatch, amt: 0.08 });
        }

        // 8D. Delicate 3/4 Right-Turned Nose (x: 578..630, y: 315..392)
        sgTaperLine(bezierPts([
          [[605, 326], [614, 344], [628, 362], [628, 375]],
          [[628, 375], [628, 386], [618, 392], [610, 392]]
        ], 14), 1.4, 2.6, 1.4, AG.ink);
        sgLine(bezierPts([[[580, 368], [576, 378], [580, 386], [588, 388]]], 8), { key: key + 'nWingL', w: 1.7, col: AG.ink, amt: 0.12 });
        sgLine([[594, 385], [602, 383]], { key: key + 'nostril', w: 2.0, col: AG.ink, amt: 0.08 });

        // 8E. Softly Parted Rose-Terracotta Lips & Upper Teeth Peek (x: 568..638, y: 418..466)
        withPivot(606, 442, 0, 1, lipPart, 0, 0, () => {
          // Upper Lip Fill
          const upLipP = bezierPts([
            [[570, 444], [584, 430], [596, 420], [605, 424]],
            [[605, 424], [612, 418], [624, 422], [636, 436]],
            [[636, 436], [622, 435], [606, 432], [570, 444]]
          ], 12);
          sgShape(upLipP, AG.lipUpper, { key: key + 'upLip', line: false, amt: 0.12 });

          // Lower Lip Plush Fill
          const lowLipP = bezierPts([
            [[574, 445], [596, 446], [620, 442], [634, 437]],
            [[634, 437], [632, 456], [616, 466], [596, 464]],
            [[596, 464], [582, 460], [576, 452], [574, 445]]
          ], 12);
          sgShape(lowLipP, AG.lipLower, { key: key + 'lowLip', line: false, amt: 0.12 });

          // Inner Mouth & White Upper Teeth Peek
          const mouthInP = bezierPts([
            [[574, 444], [595, 432], [618, 432], [634, 436]],
            [[634, 436], [618, 446], [595, 448], [574, 444]]
          ], 10);
          sgShape(mouthInP, '#ffffff', { key: key + 'teeth', w: 1.8, line: AG.ink, amt: 0.1 });

          // Crisp Lip Contours & Under-Lip Shadow Line
          sgTaperLine(bezierPts([
            [[584, 428], [596, 419], [605, 424], [614, 419]],
            [[614, 419], [624, 420], [632, 428], [636, 436]]
          ], 12), 1.0, 2.0, 1.0, AG.ink);
          sgTaperLine(bezierPts([
            [[568, 445], [588, 436], [606, 432], [636, 436]]
          ], 12), 1.8, 2.6, 1.6, AG.ink);
          sgTaperLine(bezierPts([
            [[582, 456], [596, 465], [616, 466], [632, 448]]
          ], 12), 1.1, 2.2, 1.1, AG.ink);
        });

        // 8F. 3-Stage Deforming Dark Obsidian Eyes (Left: 512, 336 | Right: 642, 314)
        drawMinimalMangaEyeDeforming({
          cx: 512 + gazeDX, cy: 336 + gazeDY, rx: 16.5, ry: 18.5, rot: -0.05,
          upperOpen: [
            [[476, 344], [492, 320], [518, 316], [538, 336]]
          ],
          upperMid: [
            [[476, 345], [494, 332], [518, 330], [538, 340]]
          ],
          upperClosed: [
            [[476, 346], [496, 354], [518, 354], [538, 344]]
          ],
          lowerSegs: [
            [[486, 348], [504, 354], [522, 352], [534, 344]]
          ],
          creaseOpen: [
            [[484, 318], [504, 304], [526, 305], [542, 320]]
          ],
          creaseMid: [
            [[484, 326], [504, 316], [526, 317], [542, 328]]
          ],
          creaseClosed: [
            [[484, 336], [504, 342], [526, 342], [542, 336]]
          ],
          lashesOpen: [
            [[476, 344], [472, 343], [468, 341], [465, 338], 3.6, 2.0],
            [[486, 332], [482, 328], [478, 324], [475, 320], 3.2, 1.8]
          ],
          lashesMid: [
            [[476, 345], [471, 345], [467, 344], [464, 342], 3.6, 2.0],
            [[486, 338], [481, 336], [477, 334], [474, 332], 3.2, 1.8]
          ],
          lashesClosed: [
            [[476, 346], [471, 349], [467, 351], [463, 352], 3.6, 2.0],
            [[488, 350], [483, 354], [479, 357], [475, 359], 3.2, 1.8]
          ],
          lowerTicks: [
            [[491, 352], [489, 357]],
            [[497, 354], [496, 359]]
          ]
        }, key + 'eyeL', blink);

        drawMinimalMangaEyeDeforming({
          cx: 642 + gazeDX, cy: 314 + gazeDY, rx: 14.5, ry: 17.0, rot: -0.08,
          upperOpen: [
            [[616, 322], [628, 300], [650, 296], [668, 308]]
          ],
          upperMid: [
            [[616, 323], [628, 310], [650, 308], [668, 314]]
          ],
          upperClosed: [
            [[616, 324], [630, 330], [650, 328], [668, 318]]
          ],
          lowerSegs: [
            [[622, 326], [638, 330], [654, 326], [664, 318]]
          ],
          creaseOpen: [
            [[618, 298], [634, 286], [652, 286], [665, 294]]
          ],
          creaseMid: [
            [[618, 306], [634, 296], [652, 296], [665, 302]]
          ],
          creaseClosed: [
            [[618, 315], [634, 320], [652, 318], [665, 312]]
          ],
          lashesOpen: [
            [[664, 306], [669, 305], [673, 303], [676, 300], 3.4, 1.8]
          ],
          lashesMid: [
            [[664, 312], [669, 312], [673, 311], [676, 309], 3.4, 1.8]
          ],
          lashesClosed: [
            [[664, 318], [669, 321], [673, 323], [677, 324], 3.4, 1.8]
          ],
          lowerTicks: [
            [[656, 328], [659, 332]]
          ]
        }, key + 'eyeR', blink);

        // 8G. Sculpted Auburn Eyebrows
        withPivot(510, 276, 0, 1, 1, 0, browLift, () => {
          const browLP = bezierPts([
            [[465, 284], [492, 268], [528, 266], [552, 272]],
            [[552, 272], [552, 280], [526, 278], [492, 280]],
            [[492, 280], [476, 282], [468, 285], [465, 284]]
          ], 12);
          sgShape(browLP, AG.browFill, { key: key + 'browL', w: 1.8, line: AG.ink, amt: 0.14 });
        });

        withPivot(638, 260, 0, 1, 1, 0, browLift, () => {
          const browRP = bezierPts([
            [[608, 266], [628, 254], [650, 254], [665, 260]],
            [[665, 260], [662, 266], [646, 264], [626, 266]],
            [[626, 266], [615, 268], [610, 268], [608, 266]]
          ], 10);
          sgShape(browRP, AG.browFill, { key: key + 'browR', w: 1.8, line: AG.ink, amt: 0.14 });
        });

        // =================================================================
        // LAYER 16..20: CENTER-PARTED S-WAVE FOREHEAD BANGS, CHEEK CURLS & LONG RIGHT LOCK
        // =================================================================
        if (renderHair) {
        withPivot(552, 168, bangsRot, 1, 1, 0, 0, () => {
          // Left Crown & Curtain Bangs + Left Cheek-Framing S-Wave Tendrils
          const bangsLeftP = bezierPts([
            [[555, 168], [534, 178], [516, 195], [528, 240]],
            [[528, 240], [535, 266], [520, 294], [498, 305]],
            [[498, 305], [516, 286], [522, 260], [514, 228]],
            [[514, 228], [492, 255], [486, 308], [452, 336]],
            [[452, 336], [426, 355], [420, 398], [456, 434]],
            [[456, 434], [484, 462], [468, 505], [442, 535]],
            [[442, 535], [422, 558], [435, 598], [462, 622]],
            [[462, 622], [426, 598], [408, 558], [428, 520]],
            [[428, 520], [452, 488], [456, 456], [428, 428]],
            [[428, 428], [402, 452], [405, 495], [418, 522]],
            [[418, 522], [388, 492], [385, 442], [405, 395]],
            [[405, 395], [382, 360], [335, 352], [304, 315]],
            [[304, 315], [285, 275], [312, 195], [382, 142]],
            [[382, 142], [445, 98], [518, 92], [568, 108]],
            [[568, 108], [562, 140], [558, 158], [555, 168]]
          ], 16);

          sgShape(bangsLeftP, AG.hairMain, {
            key: key + 'bangsL', line: false, amt: 0.18,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
              g.addColorStop(0, AG.hairLight);
              g.addColorStop(0.55, AG.hairMain);
              g.addColorStop(1, AG.hairWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });

          // Right Curtain Bangs & Long Flowing Right Front S-Lock (Reaching y=982 over blouse!)
          const bangsRightP = bezierPts([
            [[555, 168], [585, 174], [614, 205], [602, 246]],
            [[602, 246], [592, 275], [610, 298], [634, 304]],
            [[634, 304], [612, 286], [608, 262], [618, 234]],
            [[618, 234], [638, 258], [656, 295], [685, 315]],
            [[685, 315], [708, 330], [702, 365], [682, 398]],
            [[682, 398], [668, 445], [648, 505], [634, 565]],
            [[634, 565], [625, 635], [655, 705], [662, 775]],
            [[662, 775], [668, 845], [698, 905], [688, 955]],
            [[688, 955], [685, 972], [702, 984], [716, 982]],
            [[716, 982], [696, 965], [718, 915], [714, 868]],
            [[714, 868], [708, 805], [685, 745], [695, 675]],
            [[695, 675], [708, 605], [728, 540], [712, 465]],
            [[712, 465], [698, 412], [728, 365], [718, 315]],
            [[718, 315], [712, 282], [695, 250], [678, 198]],
            [[678, 198], [656, 138], [612, 96], [568, 108]],
            [[568, 108], [562, 138], [558, 155], [555, 168]]
          ], 16);

          sgShape(bangsRightP, AG.hairMain, {
            key: key + 'bangsR', line: false, amt: 0.18,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
              g.addColorStop(0, AG.hairLight);
              g.addColorStop(0.55, AG.hairMain);
              g.addColorStop(1, AG.hairWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });

          // Center Parting & Crown Strand Ink Lines
          const crownBangsLines = [
            // Crown outer arch
            [[[425, 114], [488, 88], [548, 92], [568, 108]], [[568, 108], [614, 96], [656, 138], [678, 198]]],
            // Center parting root ticks
            [[[556, 118], [548, 142], [548, 158], [555, 168]]],
            [[[548, 128], [534, 148], [532, 162], [542, 172]]],
            [[[564, 128], [575, 148], [576, 162], [566, 172]]],
            // Left forehead S-lock
            [[[542, 172], [516, 195], [528, 240], [534, 268]], [[534, 268], [532, 290], [514, 304], [498, 305]]],
            [[[528, 178], [504, 206], [518, 250], [518, 278]], [[518, 278], [516, 294], [504, 302], [495, 302]]],
            // Left temple sweeping waves
            [[[512, 165], [456, 185], [435, 245], [426, 305]], [[426, 305], [420, 342], [448, 342], [474, 318]]],
            [[[488, 148], [422, 168], [405, 238], [398, 308]], [[398, 308], [392, 362], [422, 405], [456, 434]], [[456, 434], [484, 462], [468, 505], [442, 535]], [[442, 535], [422, 558], [435, 598], [462, 622]]],
            [[[442, 132], [368, 158], [344, 224], [362, 278]], [[362, 278], [378, 326], [352, 355], [312, 336]]],
            // Left ear-side curly tendril
            [[[412, 352], [385, 392], [385, 445], [408, 495]], [[408, 495], [418, 518], [405, 535], [392, 526]]],
            // Right forehead S-lock
            [[[562, 170], [596, 182], [612, 218], [602, 252]], [[602, 252], [592, 278], [610, 298], [634, 304]]],
            [[[576, 168], [612, 185], [626, 222], [615, 258]], [[615, 258], [608, 282], [622, 298], [642, 300]]],
            // Right outer wave & long shoulder lock
            [[[678, 198], [692, 248], [716, 282], [718, 318]], [[718, 318], [720, 355], [695, 385], [708, 435]], [[708, 435], [722, 485], [702, 535], [732, 588]], [[732, 588], [755, 625], [755, 658], [742, 675]]],
            // Long right front lock over white blouse
            [[[674, 425], [652, 495], [634, 565], [636, 635]], [[636, 635], [640, 705], [662, 765], [666, 835]], [[666, 835], [670, 895], [695, 945], [688, 968]], [[688, 968], [685, 978], [702, 984], [716, 982]]],
            [[[692, 435], [675, 505], [658, 575], [662, 645]], [[662, 645], [668, 715], [688, 775], [695, 845]], [[695, 845], [702, 905], [715, 948], [708, 976]]],
            [[[708, 455], [695, 525], [680, 595], [688, 665]], [[688, 665], [696, 735], [712, 805], [714, 868]]]
          ];
          for (let i = 0; i < crownBangsLines.length; i++) {
            sgLine(bezierPts(crownBangsLines[i], 14), { key: key + 'cBng' + i, w: 2.2, col: AG.ink, amt: 0.18 });
          }

          // LAYER 21: Large Velvet Black Hair Bow at Top-Left Crown (x: 280..524, y: 24..228)
          withPivot(418, 108, bowBounce * 0.35, 1, 1, 0, 0, () => {
            drawBlackBow(
              // Knot
              bezierPts([
                [[402, 100], [418, 92], [434, 98], [436, 110]],
                [[436, 110], [422, 120], [408, 120], [402, 100]]
              ], 8),
              // Left Loop
              [
                [[405, 102], [365, 82], [316, 76], [304, 96]],
                [[304, 96], [296, 118], [312, 148], [332, 158]],
                [[332, 158], [362, 154], [392, 134], [412, 116]]
              ],
              // Right Loop
              [
                [[428, 95], [456, 62], [484, 30], [498, 32]],
                [[498, 32], [514, 42], [525, 68], [522, 84]],
                [[522, 84], [496, 92], [462, 98], [434, 106]]
              ],
              // Left notched ribbon tail
              [
                [[336, 152], [312, 178], [292, 202], [282, 212]],
                [[282, 212], [298, 214], [306, 216], [316, 228]],
                [[316, 228], [332, 198], [352, 165], [374, 140]]
              ],
              null,
              [
                [[345, 128], [398, 112]],
                [[442, 92], [482, 68]]
              ],
              key + 'topBow'
            );
          });

          // LAYER 22: 7 Remaining Peach 5-Petal Hair Flowers (Calibrated to exact 1000x1000 coordinates!)
          drawSmallHairFlower(602, 92,  14, 0.20,  AG.flowerFill, AG.flowerCenter, key + 'flw1', bowBounce * 0.3);
          drawSmallHairFlower(646, 124, 16, 0.35,  AG.flowerFill, AG.flowerCenter, key + 'flw2', -bowBounce * 0.3);
          drawSmallHairFlower(398, 178, 14, -0.25, AG.flowerFill, AG.flowerCenter, key + 'flw3', bowBounce * 0.4);
          drawSmallHairFlower(368, 248, 21, 0.12,  AG.flowerFill, AG.flowerCenter, key + 'flw4', -bowBounce * 0.35);
          drawSmallHairFlower(344, 294, 12, -0.18, AG.flowerFill, AG.flowerCenter, key + 'flw5', bowBounce * 0.45);
          drawSmallHairFlower(692, 524, 13, 0.22,  AG.flowerFill, AG.flowerCenter, key + 'flw7', -bowBounce * 0.4);
          drawSmallHairFlower(676, 576, 18, -0.14, AG.flowerFill, AG.flowerCenter, key + 'flw8', bowBounce * 0.35);
        });
        } // end if (renderHair)
      });

      ctx.restore();
    }

    // =========================================================================
    // 3C. EXACT MASTER CHARACTER: BLACK BOB GIRL W/ LAVENDER FLOWERS & BOWS
    // =========================================================================
    const BG = {
      bg: '#ffffff',
      ink: '#090809',           // Crisp jet-black manga ink
      inkSoft: '#2e272a',       // Delicate brow/lash secondary ink
      inkHatch: '#3d3135',      // Crisp vertical cheek blush hatch lines

      // Jet-Black Wavy Bob Hair & Charcoal Satin Bows
      hairBlack: '#090809',     // Solid velvet jet-black hair mass
      bowFill: '#282529',       // Dark charcoal satin bow fill (visible over black hair!)
      bowEdge: '#090809',       // Crisp black bow outline & knot crease

      // Pale Porcelain Skin & Cool Mauve Cast Shadow
      skinLight: '#fff8f6',
      skinMain: '#fdf0ec',      // Cool pale porcelain-blush skin
      skinWarm: '#f7e2dc',
      neckShadow: '#a78691',    // Cool mauve-rose cast shadow under jaw & hair
      blushRGB: '238,168,168',  // Subtle pink cheek glow behind vertical hatch lines

      // Lavender Hair Blossoms & White Camisole
      flowerLav: '#d7ccf0',     // Pastel periwinkle-lavender 5-petal flowers
      flowerCenter: '#f5e8aa',  // Soft pale-yellow flower center dot
      camisole: '#ffffff',
      camisoleShade: '#eae6e8'
    };

    function drawCharcoalMiniBow(cx, cy, r = 32, rot = 0, bKey = 'cBow', flutter = 0) {
      withPivot(cx, cy, rot + flutter, 1, 1, 0, 0, () => {
        const s = r / 32;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, s);

        const lTail = bezierPts([
          [[-4, 4], [-14, 18], [-22, 32], [-26, 42]],
          [[-26, 42], [-18, 44], [-14, 46], [-10, 46]],
          [[-10, 46], [-6, 30], [-2, 16], [0, 6]]
        ], 8);
        const rTail = bezierPts([
          [[4, 4], [14, 18], [22, 32], [26, 42]],
          [[26, 42], [18, 44], [14, 46], [10, 46]],
          [[10, 46], [6, 30], [2, 16], [0, 6]]
        ], 8);
        const lLoop = bezierPts([
          [[-4, -4], [-18, -14], [-34, -18], [-38, -12]],
          [[-38, -12], [-42, -2], [-38, 10], [-32, 14]],
          [[-32, 14], [-18, 12], [-8, 8], [-4, 4]]
        ], 10);
        const rLoop = bezierPts([
          [[4, -4], [18, -14], [34, -18], [38, -12]],
          [[38, -12], [42, -2], [38, 10], [32, 14]],
          [[32, 14], [18, 12], [8, 8], [4, 4]]
        ], 10);
        const knot = ellipsePts(0, 0, 6.5, 7.5, 0, 10);

        sgShape(lTail, BG.bowFill, { key: bKey + 'tL', w: 1.8 / s, line: BG.bowEdge, amt: 0.12 });
        sgShape(rTail, BG.bowFill, { key: bKey + 'tR', w: 1.8 / s, line: BG.bowEdge, amt: 0.12 });
        sgShape(lLoop, BG.bowFill, { key: bKey + 'lL', w: 1.8 / s, line: BG.bowEdge, amt: 0.12 });
        sgShape(rLoop, BG.bowFill, { key: bKey + 'lR', w: 1.8 / s, line: BG.bowEdge, amt: 0.12 });
        sgShape(knot,  BG.bowFill, { key: bKey + 'kn', w: 1.8 / s, line: BG.bowEdge, amt: 0.10 });
        sgLine([[-18, -2], [-6, 0]], { key: bKey + 'crL', w: 1.4 / s, col: BG.bowEdge, amt: 0.08 });
        sgLine([[6, 0], [18, -2]],   { key: bKey + 'crR', w: 1.4 / s, col: BG.bowEdge, amt: 0.08 });

        ctx.restore();
      });
    }

    function drawBlackBobGirlMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'bg';
      const isRest = !rig;

      const breath = isRest ? 0 : (rig.breath / 0.018);
      const torsoSX = 1 + breath * 0.005;
      const torsoSY = 1 + breath * 0.010;
      const torsoDY = -breath * 3.0;
      const torsoSway = isRest ? 0 : rig.torsoSway;

      const headRot = isRest ? 0 : rig.headTilt;
      const headDX = isRest ? 0 : rig.headTurn;
      const headDY = isRest ? 0 : rig.headNod;

      const hairLRot = isRest ? 0 : rig.hairSwayL;
      const hairRRot = isRest ? 0 : rig.hairSwayR;
      const bangsRot = isRest ? 0 : rig.bangsSway;
      const bowBounce = isRest ? 0 : rig.ruffleBounce;

      const blink = isRest ? 0 : rig.blink;
      const gazeDX = isRest ? 0 : rig.gazeX * 0.6;
      const gazeDY = isRest ? 0 : rig.gazeY * 0.6;
      const browLift = isRest ? 0 : rig.browLift;
      const lipPart = 1 + (isRest ? 0 : rig.mouthOpen * 0.8);
      const blushAlpha = isRest ? 0.35 : (0.28 + rig.smile * 0.22);

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = BG.bg;
        ctx.fillRect(0, 0, 1000, 1000);
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      const renderHair = (StudioState as any).renderHair !== false;

      // ===================================================================
      // LAYER 1: LEFT & BACK JET-BLACK WAVY BOB HAIR MASS (Behind Face & Neck)
      // ===================================================================
      if (renderHair) {
      withPivot(345, 340, hairLRot, 1, 1, headDX * 0.5, headDY * 0.5, () => {
        // Silhouette Edge Hair Loops on Left (Top-left clip bow & mid-left clip tab)
        sgShape(bezierPts([
          [[300, 165], [292, 142], [296, 134], [308, 134]],
          [[308, 134], [322, 136], [332, 145], [336, 154]],
          [[336, 154], [318, 162], [308, 165], [300, 165]]
        ], 10), BG.bowFill, { key: key + 'edgeBow1', w: 2.0, line: BG.ink });

        sgShape(bezierPts([
          [[272, 342], [248, 340], [238, 342], [240, 355]],
          [[240, 355], [244, 368], [248, 372], [272, 364]]
        ], 10), BG.bowFill, { key: key + 'edgeBow2', w: 2.0, line: BG.ink });

        // Left Wavy Bob Hair Silhouette (x: 212..465, y: 145..668)
        const leftBobP = bezierPts([
          [[350, 145], [285, 195], [248, 268], [256, 326]],
          [[256, 326], [268, 365], [242, 412], [222, 462]],
          [[222, 462], [208, 505], [218, 552], [252, 578]],
          [[252, 578], [242, 595], [226, 608], [212, 600]],
          [[212, 600], [222, 618], [248, 622], [274, 608]],
          [[274, 608], [262, 628], [248, 642], [234, 638]],
          [[234, 638], [254, 654], [285, 652], [308, 636]],
          [[308, 636], [312, 656], [334, 666], [358, 658]],
          [[358, 658], [385, 668], [428, 668], [458, 652]],
          [[458, 652], [462, 520], [435, 320], [350, 145]]
        ], 18);
        sgShape(leftBobP, BG.hairBlack, { key: key + 'leftBob', w: 2.4, line: BG.ink, amt: 0.16 });

        // Left Bob Accessories: 2 Lavender Flowers & 1 Charcoal Bow
        drawSmallHairFlower(268, 464, 15, -0.2, BG.flowerLav, BG.flowerCenter, key + 'lFlw1', bowBounce * 0.4);
        drawCharcoalMiniBow(268, 512, 28, -0.08, key + 'lBow1', bowBounce * 0.35);
        drawSmallHairFlower(306, 565, 14, 0.15, BG.flowerLav, BG.flowerCenter, key + 'lFlw2', -bowBounce * 0.4);
      });
      }

      // ===================================================================
      // LAYER 2..5: SIDE-PROFILE TORSO, MAUVE NECK SHADOW, CHOKER & LACE CAMISOLE
      // ===================================================================
      withPivot(510, 920, torsoSway, torsoSX, torsoSY, 0, torsoDY, () => {
        // 2A. Neck, Back, Right Shoulder & Chest Skin Silhouette (x: 285..708, y: 535..1000)
        const bodySkinP = bezierPts([
          [[445, 585], [456, 636], [462, 675], [452, 718]],
          [[452, 718], [412, 805], [335, 895], [285, 1000]],
          [[285, 1000], [500, 1000], [705, 1000], [705, 1000]],
          [[705, 1000], [706, 912], [696, 812], [665, 725]],
          [[665, 725], [642, 668], [625, 620], [608, 555]],
          [[608, 555], [550, 540], [485, 555], [445, 585]]
        ], 18);

        sgShape(bodySkinP, BG.skinMain, {
          key: key + 'bodySkin', line: false, amt: 0.18,
          grad: (bb) => {
            const g = ctx.createRadialGradient(525, 785, 30, 525, 800, 280);
            g.addColorStop(0, BG.skinLight);
            g.addColorStop(0.7, BG.skinMain);
            g.addColorStop(1, BG.skinWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // Characteristic Cool Mauve Cast Shadow under Jawline (x: 444..565, y: 540..645)
            const neckShP = bezierPts([
              [[445, 598], [488, 585], [532, 560], [558, 540]],
              [[558, 540], [545, 578], [504, 622], [455, 645]],
              [[455, 645], [450, 625], [446, 610], [445, 598]]
            ], 12);
            sgShape(neckShP, BG.neckShadow, { key: key + 'neckSh', line: false, fillA: 0.88 });
            sgBlush(535, 765, 65, 45, BG.blushRGB, 0.22, 0.2);
          }
        });

        // Neck, Chest & Back Contour Lines
        sgLine(bezierPts([[[446, 598], [456, 636], [462, 675], [452, 718]]], 12), { key: key + 'neckFront', w: 2.6, col: BG.ink, amt: 0.18 });
        sgLine(bezierPts([[[636, 668], [665, 725], [696, 812], [705, 982]]], 16), { key: key + 'backLine', w: 2.6, col: BG.ink, amt: 0.18 });
        // Front right arm contour descending from shoulder (x: 392..540, y: 712..1000)
        sgLine(bezierPts([
          [[540, 712], [488, 716], [446, 755], [420, 845]],
          [[420, 845], [404, 912], [396, 965], [392, 1000]]
        ], 16), { key: key + 'armFront', w: 2.6, col: BG.ink, amt: 0.18 });
        sgLine(bezierPts([[[614, 960], [608, 978], [605, 992], [604, 1000]]], 8), { key: key + 'armBackFold', w: 2.2, col: BG.ink, amt: 0.16 });

        // LAYER 3: Velvet Black Choker & Teardrop Loop Pendant at (458, 675)
        const chokerP = bezierPts([
          [[455, 652], [505, 645], [562, 626], [608, 602]],
          [[608, 602], [612, 616], [614, 625], [608, 632]],
          [[608, 632], [562, 656], [505, 672], [456, 676]],
          [[456, 676], [455, 666], [455, 658], [455, 652]]
        ], 14);
        sgShape(chokerP, BG.ink, { key: key + 'choker', w: 2.0, line: BG.ink, amt: 0.14 });

        withPivot(456, 676, bowBounce * 0.55, 1, 1, 0, 0, () => {
          const dropLoopP = bezierPts([
            [[456, 676], [448, 690], [446, 706], [454, 712]],
            [[454, 712], [462, 712], [464, 694], [456, 676]]
          ], 10);
          sgLine(dropLoopP, { closed: true, key: key + 'pendLoop', w: 2.4, col: BG.ink, amt: 0.1 });
        });

        // LAYER 4 & 5: White Camisole Straps, Looped Lace Trim & Bodice
        // Left Bust Lace Trim (x: 306..398, y: 882..960)
        const laceDots = 8;
        for (let i = 0; i < laceDots; i++) {
          const u = i / (laceDots - 1);
          const lx = 310 + u * 82;
          const ly = 948 - u * 64 + Math.sin(u * Math.PI) * 6;
          sgShape(ellipsePts(lx, ly, 6.5, 4.5, -0.65, 8), BG.camisole, {
            key: key + 'lcL' + i, w: 1.5, line: BG.ink, amt: 0.1
          });
        }

        // Front Left Camisole Strap (leading down from shoulder over bust)
        const strapFrontLP = bezierPts([
          [[452, 742], [418, 795], [368, 868], [308, 956]],
          [[308, 956], [316, 962], [322, 964], [328, 960]],
          [[328, 960], [382, 875], [426, 805], [442, 765]]
        ], 14);
        sgShape(strapFrontLP, BG.camisole, { key: key + 'strpFL', w: 2.0, line: BG.ink, amt: 0.15 });

        // Main Over-Shoulder Right Camisole Strap (arching over the shoulder from (452, 742) to (680, 998))
        const strapArchRP = bezierPts([
          [[445, 750], [488, 704], [552, 704], [602, 752]],
          [[602, 752], [642, 804], [662, 912], [656, 1000]],
          [[656, 1000], [678, 1000], [692, 1000], [704, 996]],
          [[704, 996], [674, 982], [668, 895], [652, 805]],
          [[652, 805], [634, 738], [568, 696], [505, 706]],
          [[505, 706], [472, 714], [452, 732], [445, 750]]
        ], 16);
        sgShape(strapArchRP, BG.camisole, { key: key + 'strpAR', w: 2.1, line: BG.ink, amt: 0.16 });

        // Lower White Camisole Bodice Cup on Left (x: 284..402, y: 888..1000)
        const camCupP = bezierPts([
          [[402, 888], [362, 918], [322, 948], [298, 976]],
          [[298, 976], [290, 988], [286, 996], [284, 1000]],
          [[284, 1000], [340, 1000], [392, 1000], [392, 1000]],
          [[392, 1000], [396, 955], [400, 915], [402, 888]]
        ], 12);
        sgShape(camCupP, BG.camisole, { key: key + 'camCup', w: 2.4, line: BG.ink, amt: 0.16 });
      });

      // ===================================================================
      // LAYER 6..22: HEAD, FACE, EYES, BANGS & VOLUMINOUS RIGHT BLACK BOB
      // ===================================================================
      withPivot(485, 555, headRot, 1, 1, headDX, headDY, () => {
        // 6A. 3/4 Left-Turned Pale Porcelain Face Contour (x: 298..585, y: 215..606)
        const faceP = bezierPts([
          [[425, 208], [340, 225], [298, 295], [302, 368]],
          [[302, 368], [305, 428], [312, 488], [336, 542]],
          [[336, 542], [358, 588], [388, 608], [435, 602]],
          [[435, 602], [492, 592], [548, 556], [575, 512]],
          [[575, 512], [595, 445], [592, 340], [555, 248]],
          [[555, 248], [512, 212], [465, 205], [425, 208]]
        ], 18);

        sgShape(faceP, BG.skinMain, {
          key: key + 'faceBase', line: false, amt: 0.16,
          grad: (bb) => {
            const g = ctx.createRadialGradient(415, 405, 25, 435, 420, 210);
            g.addColorStop(0, BG.skinLight);
            g.addColorStop(0.7, BG.skinMain);
            g.addColorStop(1, BG.skinWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            sgBlush(326, 444, 28, 20, BG.blushRGB, blushAlpha, 0.15);
            sgBlush(482, 456, 42, 24, BG.blushRGB, blushAlpha, 0.1);
          }
        });

        // Crisp Left Cheek, Chin & Jawline Ink Contour
        sgLine(bezierPts([
          [[302, 345], [304, 415], [312, 485], [336, 542]],
          [[336, 542], [358, 588], [388, 608], [435, 602]],
          [[435, 602], [492, 592], [548, 556], [568, 525]]
        ], 18), { key: key + 'jawLine', w: 2.6, col: BG.ink, amt: 0.16 });

        // 6B. Characteristic Parallel Diagonal/Vertical Cheek Blush Hatching!
        for (let i = 0; i < 8; i++) {
          const hx = 308 + i * 5.2;
          const len = 24 - Math.abs(i - 3.5) * 2.5;
          const yTop = 430 + i * 1.2;
          sgLine([[hx, yTop], [hx - 4, yTop + len]], { key: key + 'chHL' + i, w: 1.3, col: BG.inkHatch, amt: 0.08 });
        }
        for (let i = 0; i < 11; i++) {
          const hx = 450 + i * 6.5;
          const len = 32 - Math.abs(i - 5) * 3.2;
          const yTop = 440 - Math.sin((i / 10) * Math.PI) * 6;
          sgLine([[hx, yTop], [hx - 5, yTop + len]], { key: key + 'chHR' + i, w: 1.3, col: BG.inkHatch, amt: 0.08 });
        }

        // 6C. Delicate Nose Bridge, Tip & Nostrils (x: 355..398, y: 372..482)
        sgTaperLine(bezierPts([[[368, 372], [374, 388], [374, 404], [370, 416]]], 10), 1.0, 2.0, 1.0, BG.ink);
        sgTaperLine(bezierPts([[[356, 460], [358, 470], [364, 476], [372, 478]]], 10), 1.4, 2.5, 1.4, BG.ink);
        sgLine([[388, 475], [396, 473]], { key: key + 'nostR', w: 2.2, col: BG.ink, amt: 0.08 });

        // 6D. Subtle Cool-Neutral Parted Lips (x: 358..426, y: 505..546)
        withPivot(386, 524, 0, 1, lipPart, 0, 0, () => {
          sgLine(bezierPts([[[372, 506], [378, 508], [384, 508], [388, 506]]], 8), { key: key + 'cupid', w: 1.5, col: BG.ink, amt: 0.1 });
          sgTaperLine(bezierPts([
            [[358, 524], [368, 518], [378, 522], [386, 520]],
            [[386, 520], [398, 520], [412, 524], [426, 528]]
          ], 14), 1.4, 2.5, 1.4, BG.ink);
          sgTaperLine(bezierPts([[[372, 542], [382, 545], [394, 545], [402, 543]]], 10), 1.2, 2.4, 1.2, BG.ink);
        });

        // 6E. 3-Stage Deforming Dark Manga Eyes with Tiny Catchlights (Left: 344, 390 | Right: 486, 394)
        drawMinimalMangaEyeDeforming({
          cx: 344 + gazeDX, cy: 390 + gazeDY, rx: 14.0, ry: 15.5, rot: 0.08,
          upperOpen: [
            [[305, 382], [322, 372], [348, 375], [365, 394]]
          ],
          upperMid: [
            [[305, 386], [322, 382], [348, 384], [365, 396]]
          ],
          upperClosed: [
            [[305, 392], [324, 400], [348, 400], [365, 398]]
          ],
          lowerSegs: [
            [[315, 395], [332, 402], [350, 401], [362, 396]]
          ],
          creaseOpen: [
            [[308, 368], [326, 362], [348, 366], [364, 382]]
          ],
          creaseMid: [
            [[308, 375], [326, 372], [348, 375], [364, 386]]
          ],
          creaseClosed: [
            [[308, 384], [326, 390], [348, 390], [364, 388]]
          ],
          lashesOpen: [
            [[305, 382], [300, 380], [297, 378], [295, 376], 3.2, 1.8]
          ],
          lashesMid: [
            [[305, 386], [300, 385], [297, 384], [295, 382], 3.2, 1.8]
          ],
          lashesClosed: [
            [[305, 392], [300, 394], [297, 395], [294, 396], 3.2, 1.8]
          ],
          lowerTicks: [
            [[316, 400], [314, 404]],
            [[322, 402], [320, 406]]
          ],
          catchlights: [
            [335 + gazeDX * 0.5, 388 + gazeDY * 0.5, 2.2, 2.5, 0]
          ]
        }, key + 'eyeL', blink);

        drawMinimalMangaEyeDeforming({
          cx: 486 + gazeDX, cy: 394 + gazeDY, rx: 16.0, ry: 16.5, rot: 0.04,
          upperOpen: [
            [[446, 396], [468, 376], [502, 376], [534, 392]]
          ],
          upperMid: [
            [[446, 398], [468, 386], [502, 386], [534, 395]]
          ],
          upperClosed: [
            [[446, 400], [472, 406], [504, 406], [534, 398]]
          ],
          lowerSegs: [
            [[454, 401], [476, 406], [504, 405], [524, 396]]
          ],
          creaseOpen: [
            [[448, 380], [472, 368], [502, 368], [526, 378]]
          ],
          creaseMid: [
            [[448, 386], [472, 378], [502, 378], [526, 384]]
          ],
          creaseClosed: [
            [[448, 394], [472, 398], [502, 398], [526, 392]]
          ],
          lashesOpen: [
            [[524, 390], [530, 391], [534, 390], [537, 388], 3.4, 1.8]
          ],
          lashesMid: [
            [[524, 393], [530, 394], [534, 394], [537, 393], 3.4, 1.8]
          ],
          lashesClosed: [
            [[524, 398], [530, 400], [534, 401], [538, 402], 3.4, 1.8]
          ],
          lowerTicks: [
            [[505, 406], [508, 411]],
            [[511, 405], [514, 409]]
          ],
          catchlights: [
            [479 + gazeDX * 0.5, 393 + gazeDY * 0.5, 2.5, 2.8, 0]
          ]
        }, key + 'eyeR', blink);

        // 6F. Feathered Dark Eyebrows (Partially peeking through wispy bangs)
        withPivot(330, 342, 0, 1, 1, 0, browLift, () => {
          sgTaperLine(bezierPts([[[302, 336], [318, 336], [336, 342], [354, 350]]], 10), 1.5, 2.8, 1.2, BG.ink);
        });
        withPivot(485, 344, 0, 1, 1, 0, browLift, () => {
          sgTaperLine(bezierPts([[[428, 348], [458, 338], [495, 338], [528, 346]]], 12), 1.4, 2.8, 1.4, BG.ink);
        });

        // =================================================================
        // LAYER 14..22: VOLUMINOUS CROWN, WISPY FOREHEAD BANGS & RIGHT BOB MASS
        // =================================================================
        if (renderHair) {
        withPivot(495, 160, bangsRot, 1, 1, 0, 0, () => {
          // Right Edge Silhouette Hair Bow Tab at (772, 345)
          sgShape(bezierPts([
            [[752, 338], [776, 330], [788, 328], [790, 338]],
            [[790, 338], [792, 350], [792, 360], [786, 362]],
            [[786, 362], [772, 360], [756, 355], [752, 338]]
          ], 10), BG.bowFill, { key: key + 'edgeBowR', w: 2.0, line: BG.ink });

          // Main Upper Crown + Voluminous Right Wavy Bob Silhouette (x: 278..815, y: 84..678)
          const rightBobMassP = bezierPts([
            [[332, 162], [382, 108], [448, 84], [504, 92]],
            [[504, 92], [556, 78], [634, 104], [692, 168]],
            [[692, 168], [738, 224], [754, 295], [762, 358]],
            [[762, 358], [776, 405], [812, 445], [810, 505]],
            [[810, 505], [808, 548], [795, 578], [808, 595]],
            [[808, 595], [816, 602], [824, 592], [825, 584]],
            [[825, 584], [824, 606], [804, 616], [782, 608]],
            [[782, 608], [776, 622], [768, 632], [752, 624]],
            [[752, 624], [758, 645], [742, 662], [716, 658]],
            [[716, 658], [695, 672], [662, 676], [642, 662]],
            [[642, 662], [620, 675], [595, 676], [575, 668]],
            [[575, 668], [588, 655], [602, 636], [608, 612]],
            [[608, 612], [588, 618], [568, 618], [548, 612]],
            [[548, 612], [578, 604], [596, 586], [592, 558]],
            [[592, 558], [575, 528], [558, 495], [568, 456]],
            [[568, 456], [578, 418], [588, 385], [574, 356]],
            [[574, 356], [545, 328], [516, 285], [504, 225]],
            [[504, 225], [445, 212], [385, 222], [332, 260]],
            [[332, 260], [312, 225], [318, 188], [332, 162]]
          ], 18);

          sgShape(rightBobMassP, BG.hairBlack, { key: key + 'rightBob', w: 2.2, line: BG.ink, amt: 0.14 });

          // Wispy Individual Forehead Bang Strands Sweeping Down Across Forehead!
          const bangClumps = [
            // Far-left temple lock
            [[[340, 215], [312, 258], [298, 305], [302, 348]], [[302, 348], [318, 308], [335, 265], [358, 225]]],
            // Left-mid wispy bang 1
            [[[358, 220], [335, 268], [326, 315], [332, 346]], [[332, 346], [342, 310], [356, 265], [374, 220]]],
            // Left-mid wispy bang 2
            [[[376, 218], [358, 268], [350, 316], [355, 348]], [[355, 348], [365, 312], [378, 268], [392, 218]]],
            // Center-left split bang clump
            [[[394, 215], [375, 272], [368, 322], [376, 352]], [[376, 352], [388, 318], [402, 268], [414, 215]]],
            // Center-right longest sweeping bang clump
            [[[422, 212], [412, 275], [418, 325], [435, 355]], [[435, 355], [442, 320], [440, 268], [448, 212]]],
            // Right-mid bang clump 1
            [[[452, 212], [448, 272], [458, 322], [478, 350]], [[478, 350], [482, 316], [475, 268], [478, 215]]],
            // Right-mid bang clump 2
            [[[482, 215], [486, 276], [504, 326], [532, 352]], [[532, 352], [530, 315], [514, 268], [510, 218]]],
            // Far-right temple transition bang clump
            [[[512, 218], [524, 282], [548, 334], [576, 362]], [[576, 362], [575, 318], [556, 268], [542, 218]]]
          ];
          for (let i = 0; i < bangClumps.length; i++) {
            sgShape(bezierPts(bangClumps[i], 12), BG.hairBlack, {
              key: key + 'bClmp' + i, w: 1.5, line: BG.ink, amt: 0.12
            });
          }

          // Fine individual hair filaments between the bang clumps
          const fineBangHairs = [
            [[[325, 245], [314, 295], [312, 330], [315, 348]]],
            [[[348, 238], [338, 290], [338, 328], [344, 348]]],
            [[[368, 238], [360, 292], [362, 330], [368, 350]]],
            [[[405, 222], [392, 282], [392, 325], [400, 348]]],
            [[[438, 225], [434, 286], [444, 328], [458, 352]]],
            [[[468, 225], [468, 285], [484, 328], [505, 352]]],
            [[[498, 228], [508, 288], [532, 334], [558, 358]]]
          ];
          for (let i = 0; i < fineBangHairs.length; i++) {
            sgTaperLine(bezierPts(fineBangHairs[i], 12), 2.4, 1.6, 0.3, BG.ink, 0.96);
          }

          // Delicate White Hair-Gap Cutout Slivers near Right Ear/Cheek & Outer Flyaway Loops!
          const cheekSliverP = bezierPts([
            [[572, 468], [562, 495], [562, 522], [574, 542]],
            [[574, 542], [568, 518], [568, 495], [572, 468]]
          ], 10);
          sgShape(cheekSliverP, BG.bg, { key: key + 'chkSliv', line: false });

          const rightFlyaways = [
            [[[692, 165], [735, 212], [755, 272], [762, 328]]],
            [[[772, 365], [798, 412], [818, 465], [812, 525]], [[812, 525], [806, 565], [792, 595], [772, 608]]],
            [[[798, 565], [808, 588], [818, 596], [825, 584]]],
            [[[752, 624], [748, 650], [732, 662], [712, 656]]],
            [[[655, 658], [634, 674], [612, 676], [595, 668]]]
          ];
          for (let i = 0; i < rightFlyaways.length; i++) {
            sgLine(bezierPts(rightFlyaways[i], 14), { key: key + 'rFly' + i, w: 1.5, col: BG.ink, amt: 0.16 });
          }

          // LAYER 20..22: 2 Charcoal Bows & 6 Pastel Lavender 5-Petal Blossoms on Right Bob!
          drawCharcoalMiniBow(625, 222, 42, -0.32, key + 'rBow1', -bowBounce * 0.35);
          drawCharcoalMiniBow(748, 464, 34,  0.08, key + 'rBow2',  bowBounce * 0.35);

          drawSmallHairFlower(695, 274, 15,  0.18, BG.flowerLav, BG.flowerCenter, key + 'rFlw1',  bowBounce * 0.4);
          drawSmallHairFlower(635, 330, 17, -0.15, BG.flowerLav, BG.flowerCenter, key + 'rFlw2', -bowBounce * 0.35);
          drawSmallHairFlower(714, 332, 16,  0.25, BG.flowerLav, BG.flowerCenter, key + 'rFlw3',  bowBounce * 0.3);
          drawSmallHairFlower(672, 412, 16, -0.12, BG.flowerLav, BG.flowerCenter, key + 'rFlw4', -bowBounce * 0.4);
          drawSmallHairFlower(756, 512, 14,  0.20, BG.flowerLav, BG.flowerCenter, key + 'rFlw5',  bowBounce * 0.35);
          drawSmallHairFlower(642, 526, 17, -0.22, BG.flowerLav, BG.flowerCenter, key + 'rFlw6', -bowBounce * 0.3);
          drawSmallHairFlower(718, 586, 15,  0.14, BG.flowerLav, BG.flowerCenter, key + 'rFlw7',  bowBounce * 0.4);
        });
        } // end if (renderHair)
      });

      ctx.restore();
    }


    // =========================================================================
    // 4. EXACT MASTER CHARACTER 2: RAINCOAT CALICO CAT (12 LAYERS, 3-PASS PENCIL)
    // =========================================================================
    const RC = {
      bg: '#d8e6e6',             // Soft misty rain-blue background
      ink: '#4a3022',            // Deep warm espresso-umber colored-pencil outline
      inkSoft: '#7d5b46',        // Secondary softer pencil pass
      inkLight: '#a68972',       // Subtle crease / inner detail line

      coatLight: '#fff5c8',      // Bright butter-cream highlight
      coatMid: '#ffecad',        // Main buttercup yellow raincoat
      coatWarm: '#fce59c',       // Warm lower coat tone
      coatShade: '#f0d37e',      // Soft fold shadow
      coatDeep: '#59402a',       // Deep inner hood & sleeve cavity shadow

      furLight: '#f4eae0',       // Forehead & bridge highlight
      furCream: '#eadccf',       // Main warm oatmeal-cream face fur
      furShade: '#dfd0c1',       // Lower cheek & chin shadow
      furOrange: '#d89658',      // Ginger-caramel orange patch & right ear
      furOrangeLight: '#e5b888', // Soft apricot transition edge
      furTan: '#e2c39d',         // Soft buff-apricot patch around right eye
      furGrey: '#7c8085',        // Slate blue-grey patch & left ear
      furGreyDark: '#63676c',
      furBrown: '#ac957f',       // Left foot taupe-brown patch

      earPink: '#f4c4b6',        // Soft peach-pink inner ear
      nose: '#f8b3b0',           // Sweet pink triangular nose
      noseLine: '#a6625e',       // Delicate rose-brown nose outline
      eye: '#47271c',            // Deep espresso closed eye crescent
      blush: '238,172,156',      // Soft rosy-peach cheek blush RGB
      blushCore: '#edb5a5',

      cord: '#f5dd98',           // Toggle rope strap fill
      toggleLight: '#e6be94',    // Wooden barrel toggle highlight
      toggleMid: '#d5a676',      // Wooden barrel toggle base
      toggleDark: '#ab794a',     // Wooden barrel toggle shadow

      umbLight: '#dceae6',       // Pale ice-blue umbrella highlight
      umbMid: '#cadad5',         // Main pale ice-blue umbrella fabric
      umbShade: '#b2c4bf',       // Umbrella pleat shadow
      umbHandle: '#4d504b',      // Charcoal J-hook handle & ferrule tip
      umbHandleHi: '#6e736c',
    };

    function psLine(P, o = {}) {
      const closed = !!o.closed, key = o.key ?? 'psl', w = o.w ?? 4.6, col = o.col ?? RC.ink, amt = o.amt ?? 1.25;
      const Q1 = wobble(P, closed, amt, key, o.step ?? 5);
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.globalAlpha = o.a ?? 0.96;
      if (o.dash) ctx.setLineDash(o.dash);
      trace(Q1, closed); ctx.stroke();
      if (o.second !== false && !o.dash) {
        const Q2 = wobble(P, closed, amt * 1.38 + 0.25, key + '~', o.step ?? 5);
        ctx.strokeStyle = o.col2 ?? RC.inkSoft;
        ctx.lineWidth = w * 0.78; ctx.globalAlpha = (o.a ?? 0.96) * 0.55;
        trace(Q2, closed); ctx.stroke();

        const Q3 = wobble(P, closed, amt * 1.15 + 0.15, key + '~~', 4);
        ctx.strokeStyle = col;
        ctx.lineWidth = w * 0.50; ctx.globalAlpha = (o.a ?? 0.96) * 0.48;
        ctx.setLineDash([1.5, 2.2]);
        trace(Q3, closed); ctx.stroke();
      }
      ctx.restore();
      return Q1;
    }

    function psShape(P, fill, o = {}) {
      const key = o.key ?? 'pss', amt = o.amt ?? 1.15;
      const Q = o.raw ? P : wobble(P, true, amt, key, o.step ?? 6);
      ctx.save();
      if (o.shadow) {
        ctx.shadowColor = o.shCol ?? 'rgba(74,48,34,0.14)';
        ctx.shadowBlur = o.shBlur ?? 10;
        ctx.shadowOffsetX = o.shX ?? 1;
        ctx.shadowOffsetY = o.shY ?? 4;
      }
      trace(Q, true);
      ctx.fillStyle = fill;
      ctx.globalAlpha = o.fillA ?? 1;
      ctx.fill();
      ctx.restore();

      if (o.grad || o.crayon || o.innerFn) {
        ctx.save();
        trace(Q, true); ctx.clip();
        const bb = bbox(Q, 4);
        if (o.grad) o.grad(bb);
        if (o.crayon) {
          pencil(bb, { key: key + 'cr', c: o.crayon, al: o.crAl ?? 0.14, per: o.crPer ?? 90, len: o.crLen ?? 14, a: o.crA ?? -0.65, w: 1.2, max: 2200 });
        }
        if (o.innerFn) o.innerFn(bb);
        ctx.restore();
      }

      if (o.line !== false) {
        psLine(P, { closed: true, key: key + 'L', w: o.w ?? 4.6, col: o.line ?? RC.ink, col2: o.line2 ?? RC.inkSoft, amt, a: o.lineA ?? 0.96, second: o.second });
      }
      return Q;
    }

    function psBlush(x, y, rx, ry, col = RC.blush, a = 0.68, rot = 0) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, ry / rx);
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      gr.addColorStop(0, 'rgba(' + col + ',' + a + ')');
      gr.addColorStop(0.62, 'rgba(' + col + ',' + (a * 0.72) + ')');
      gr.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill();
      ctx.restore();
    }

    function drawRaincoatCatMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'rcHero';
      const isStatic = !rig;

      const breath = isStatic ? 0 : rig.breath * 0.9;
      const bodySway = isStatic ? 0 : rig.torsoSway;
      const headTilt = isStatic ? 0 : rig.headTilt;
      const headBobY = isStatic ? 0 : rig.headNod;
      const headDX = isStatic ? 0 : rig.headTurn;
      const earRotL = isStatic ? 0 : rig.hairSwayL;
      const earRotR = isStatic ? 0 : rig.hairSwayR;
      const armLRot = isStatic ? 0 : rig.leftArmLift;
      const armRRot = isStatic ? 0 : rig.rightArmLift;
      const umbTilt = isStatic ? 0 : rig.leftArmLift * 0.65;
      const toggleSway = isStatic ? 0 : rig.ruffleBounce * 0.35;
      const whiskerTwitch = isStatic ? 0 : rig.bangsSway * 0.5;
      const footTapL = isStatic ? 0 : Math.max(0, rig.ruffleBounce * 0.25);
      const footTapR = isStatic ? 0 : Math.max(0, -rig.ruffleBounce * 0.25);
      const happyEnv = isStatic ? 0 : Math.max(0, (rig.smile - 0.54) * 2);

      ctx.save();
      ctx.fillStyle = RC.bg;
      ctx.fillRect(0, 0, 1000, 1000);
      pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'rcPaper', c: '#bdd2d2', al: 0.16, per: 850, len: 12 });

      // LAYER 1: LITTLE ROUND CALICO FEET PEEKING UNDER HEM
      withPivot(396, 825, -footTapL, 1, 1, 0, 0, () => {
        const footLP = bezierPts([
          [[344, 814], [350, 842], [374, 858], [402, 858]],
          [[402, 858], [428, 858], [444, 844], [449, 828]],
          [[449, 828], [415, 820], [375, 816], [344, 814]],
        ], 16);
        psShape(footLP, RC.furCream, {
          key: key + 'footL', w: 4.8, line: RC.ink, line2: RC.inkSoft, crayon: RC.furShade, crAl: 0.16,
          innerFn: () => {
            const patchLP = bezierPts([
              [[340, 810], [346, 846], [372, 860], [398, 856]],
              [[398, 856], [402, 838], [392, 820], [376, 812]],
              [[376, 812], [358, 810], [346, 810], [340, 810]],
            ], 12);
            psShape(patchLP, RC.furBrown, { key: key + 'footLPatch', line: false });
            psBlush(396, 820, 55, 14, '90,65,45', 0.35);
          }
        });
      });

      withPivot(638, 815, footTapR, 1, 1, 0, 0, () => {
        const footRP = bezierPts([
          [[595, 828], [606, 846], [632, 850], [656, 842]],
          [[656, 842], [674, 834], [682, 818], [685, 804]],
          [[685, 804], [650, 812], [618, 822], [595, 828]],
        ], 16);
        psShape(footRP, RC.furTan, {
          key: key + 'footR', w: 4.8, line: RC.ink, line2: RC.inkSoft, crayon: RC.furShade, crAl: 0.16,
          innerFn: () => {
            const patchRP = bezierPts([
              [[646, 844], [652, 822], [662, 806], [686, 802]],
              [[686, 802], [684, 826], [668, 842], [646, 844]],
            ], 12);
            psShape(patchRP, RC.furGrey, { key: key + 'footRPatch', line: false });
            psBlush(638, 812, 48, 12, '90,65,45', 0.32);
          }
        });
      });

      // BREATHING TORSO HIERARCHY
      withPivot(500, 810, bodySway, 1 - breath * 0.35, 1 + breath, 0, 0, () => {
        // LAYER 2: RIGHT PAW PEEKING UNDER RIGHT SLEEVE CUFF
        withPivot(750, 660, armRRot, 1, 1, 0, 0, () => {
          const pawRP = bezierPts([
            [[752, 682], [764, 668], [778, 660], [786, 668]],
            [[786, 668], [790, 682], [780, 702], [764, 706]],
            [[764, 706], [756, 707], [752, 696], [752, 682]],
          ], 14);
          psShape(pawRP, RC.furCream, {
            key: key + 'pawR', w: 4.4, line: RC.ink, line2: RC.inkSoft,
            innerFn: () => {
              psShape([[750, 660], [788, 660], [788, 688], [750, 692]], RC.furGrey, { key: key + 'pawRGrey', line: false });
            }
          });
        });

        // LAYER 3: BACK HALF OF FOLDED UMBRELLA
        withPivot(345, 675, armLRot + umbTilt, 1, 1, 0, 0, () => {
          const ferruleP = bezierPts([
            [[184, 681], [166, 683], [153, 685], [153, 690]],
            [[153, 690], [153, 695], [166, 697], [184, 698]],
            [[184, 698], [186, 690], [186, 685], [184, 681]],
          ], 12);
          psShape(ferruleP, RC.umbHandle, { key: key + 'umbTip', w: 4.0, line: RC.ink });

          const umbBackP = bezierPts([
            [[180, 680], [202, 666], [224, 656], [244, 652]],
            [[244, 652], [252, 672], [258, 692], [265, 710]],
            [[265, 710], [234, 708], [202, 704], [180, 696]],
            [[180, 696], [178, 690], [178, 684], [180, 680]],
          ], 14);
          psShape(umbBackP, RC.umbMid, {
            key: key + 'umbBack', w: 4.0, line: RC.ink, line2: RC.inkSoft, crayon: RC.umbShade,
            grad: (bb) => {
              const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
              g.addColorStop(0, RC.umbLight); g.addColorStop(0.6, RC.umbMid); g.addColorStop(1, RC.umbShade);
              ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });
          psLine([[182, 686], [244, 672]], { key: key + 'umbRibL1', w: 2.6, col: RC.ink, second: false });
          psLine([[182, 691], [254, 694]], { key: key + 'umbRibL2', w: 2.6, col: RC.ink, second: false });
        });

        // LAYER 4: BUTTERCUP YELLOW RAINCOAT BODY & RIGHT PANEL/SLEEVE
        const coatRightP = bezierPts([
          [[535, 545], [605, 520], [668, 505], [710, 502]],
          [[710, 502], [748, 546], [782, 600], [801, 642]],
          [[801, 642], [803, 652], [782, 668], [748, 692]],
          [[748, 692], [760, 725], [770, 754], [768, 772]],
          [[768, 772], [762, 792], [722, 804], [665, 814]],
          [[665, 814], [620, 824], [592, 834], [576, 830]],
          [[576, 830], [566, 824], [562, 795], [556, 750]],
          [[556, 750], [550, 660], [545, 590], [535, 545]],
        ], 18);
        psShape(coatRightP, RC.coatMid, {
          key: key + 'coatRight', line: false, crayon: RC.coatShade, crAl: 0.16,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, RC.coatLight);
            g.addColorStop(0.55, RC.coatMid);
            g.addColorStop(1, RC.coatWarm);
            ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(660, 795, 110, 35, '235,198,105', 0.45, -0.15);
            psBlush(575, 680, 35, 140, '232,192,98', 0.38);
          }
        });

        const coatRightStroke = bezierPts([
          [[710, 502], [748, 546], [782, 600], [801, 642]],
          [[801, 642], [803, 652], [782, 668], [748, 692]],
        ], 16);
        psLine(coatRightStroke, { key: key + 'coatRSlvLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

        psLine(bezierPts([[[718, 572], [734, 612], [744, 654], [748, 692]]], 14), {
          key: key + 'coatRCrease', w: 4.2, col: RC.ink, col2: RC.inkSoft
        });

        const coatRightSkirtStroke = bezierPts([
          [[749, 682], [762, 724], [770, 754], [768, 772]],
          [[768, 772], [762, 792], [722, 804], [665, 814]],
          [[665, 814], [620, 824], [592, 834], [576, 830]],
          [[576, 830], [566, 824], [563, 800], [561, 782]],
        ], 18);
        psLine(coatRightSkirtStroke, { key: key + 'coatRSkirtLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

        // 4B. Left Half of Coat Body
        const coatLeftP = bezierPts([
          [[282, 504], [360, 520], [450, 528], [534, 548]],
          [[534, 548], [552, 566], [556, 615], [560, 685]],
          [[560, 685], [564, 755], [562, 815], [542, 842]],
          [[542, 842], [526, 850], [486, 844], [435, 830]],
          [[435, 830], [392, 816], [358, 812], [320, 812]],
          [[320, 812], [278, 812], [238, 794], [218, 766]],
          [[218, 766], [208, 750], [214, 726], [228, 694]],
          [[228, 694], [242, 620], [256, 550], [282, 504]],
        ], 18);
        psShape(coatLeftP, RC.coatMid, {
          key: key + 'coatLeft', line: false, crayon: RC.coatShade, crAl: 0.16,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, RC.coatLight);
            g.addColorStop(0.5, RC.coatMid);
            g.addColorStop(1, RC.coatWarm);
            ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(325, 735, 95, 42, '232,192,98', 0.45, 0.15);
            psBlush(420, 805, 120, 32, '235,198,105', 0.40, 0.12);
          }
        });

        const coatLeftSkirtStroke = bezierPts([
          [[228, 694], [214, 726], [208, 750], [218, 766]],
          [[218, 766], [238, 794], [278, 812], [320, 812]],
          [[320, 812], [358, 812], [392, 816], [435, 830]],
          [[435, 830], [486, 844], [526, 850], [542, 842]],
          [[542, 842], [562, 815], [564, 755], [560, 685]],
          [[560, 685], [556, 615], [552, 566], [534, 548]],
        ], 20);
        psLine(coatLeftSkirtStroke, { key: key + 'coatLSkirtLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

        psLine(bezierPts([[[462, 550], [492, 553], [510, 560], [520, 568]]], 10), { key: key + 'colCreaseL', w: 3.6, col: RC.ink, second: false });
        psLine(bezierPts([[[584, 552], [598, 543], [610, 539], [622, 538]]], 10), { key: key + 'colCreaseR', w: 3.6, col: RC.ink, second: false });

        // LAYER 5: FRONT HALF OF UMBRELLA + CALICO PAW + LEFT SLEEVE
        withPivot(315, 555, armLRot, 1, 1, 0, 0, () => {
          withPivot(380, 668, umbTilt, 1, 1, 0, 0, () => {
            const handleP = bezierPts([
              [[432, 654], [462, 648], [486, 646], [500, 654]],
              [[500, 654], [514, 664], [512, 688], [496, 698]],
              [[496, 698], [482, 704], [471, 694], [474, 682]],
              [[474, 682], [476, 676], [484, 676], [488, 680]],
              [[488, 680], [494, 680], [494, 668], [484, 666]],
              [[484, 666], [466, 665], [448, 668], [432, 670]],
            ], 14);
            psShape(handleP, RC.umbHandle, {
              key: key + 'umbHandle', w: 4.0, line: RC.ink,
              innerFn: () => {
                psLine([[442, 656], [485, 654], [502, 666]], { key: key + 'umbHHi', w: 2.2, col: RC.umbHandleHi, second: false });
              }
            });

            const umbFrontP = bezierPts([
              [[376, 654], [398, 642], [420, 632], [438, 626]],
              [[438, 626], [434, 636], [432, 644], [446, 650]],
              [[446, 650], [436, 658], [434, 668], [446, 678]],
              [[446, 678], [438, 686], [438, 694], [442, 701]],
              [[442, 701], [416, 698], [394, 695], [376, 694]],
              [[376, 694], [376, 678], [376, 666], [376, 654]],
            ], 12);
            psShape(umbFrontP, RC.umbMid, {
              key: key + 'umbFront', w: 4.0, line: RC.ink, line2: RC.inkSoft, crayon: RC.umbShade,
              grad: (bb) => {
                const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
                g.addColorStop(0, RC.umbLight); g.addColorStop(0.55, RC.umbMid); g.addColorStop(1, RC.umbShade);
                ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
              }
            });
            psLine([[393, 644], [395, 695]], { key: key + 'umbBand', w: 2.8, col: RC.ink, second: false });
            psLine([[395, 658], [442, 650]], { key: key + 'umbRibR1', w: 2.4, col: RC.ink, second: false });
            psLine([[395, 676], [442, 678]], { key: key + 'umbRibR2', w: 2.4, col: RC.ink, second: false });
          });

          const cuffCavityP = bezierPts([
            [[302, 738], [318, 736], [334, 726], [344, 714]],
            [[344, 714], [328, 700], [314, 706], [302, 738]],
          ], 10);
          psShape(cuffCavityP, RC.coatDeep, { key: key + 'cuffCavL', w: 3.8, line: RC.ink });

          const pawLP = bezierPts([
            [[318, 706], [334, 722], [358, 726], [376, 716]],
            [[376, 716], [390, 706], [394, 680], [382, 656]],
            [[382, 656], [362, 660], [336, 680], [318, 706]],
          ], 16);
          psShape(pawLP, RC.furOrange, {
            key: key + 'pawL', w: 4.6, line: RC.ink, line2: RC.inkSoft, crayon: '#bf793d', crAl: 0.16,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, bb.y1, bb.x1, bb.y0);
              g.addColorStop(0, RC.furOrange);
              g.addColorStop(0.65, '#dfa872');
              g.addColorStop(1, RC.furCream);
              ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });

          const sleeveLP = bezierPts([
            [[282, 504], [248, 538], [228, 588], [230, 636]],
            [[230, 636], [234, 682], [262, 732], [294, 744]],
            [[294, 744], [304, 746], [312, 724], [324, 700]],
            [[324, 700], [344, 672], [368, 656], [391, 652]],
            [[391, 652], [394, 638], [378, 616], [358, 594]],
            [[358, 594], [345, 578], [335, 540], [282, 504]],
          ], 18);
          psShape(sleeveLP, RC.coatMid, {
            key: key + 'sleeveL', line: false, crayon: RC.coatShade, crAl: 0.15,
            grad: (bb) => {
              const g = ctx.createRadialGradient(285, 595, 15, 305, 620, 130);
              g.addColorStop(0, RC.coatLight);
              g.addColorStop(0.65, RC.coatMid);
              g.addColorStop(1, RC.coatWarm);
              ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });

          const sleeveLOutline = bezierPts([
            [[282, 504], [248, 538], [228, 588], [230, 636]],
            [[230, 636], [234, 682], [262, 732], [294, 744]],
            [[294, 744], [304, 746], [312, 724], [324, 700]],
            [[324, 700], [344, 672], [368, 656], [391, 652]],
            [[391, 652], [394, 638], [376, 616], [336, 578]],
          ], 18);
          psLine(sleeveLOutline, { key: key + 'slvLineL', w: 4.8, col: RC.ink, col2: RC.inkSoft });
          psLine([[354, 574], [365, 604]], { key: key + 'slvFoldL', w: 3.6, col: RC.ink, second: false });
        });

        // LAYER 6: TWO WOODEN DUFFLE COAT TOGGLES & CORD LOOPS
        const drawDuffleToggle = (ty, tKey) => {
          withPivot(560, ty, toggleSway, 1, 1, 0, 0, () => {
            const tabP = bezierPts([
              [[528, ty - 14], [516, ty - 14], [512, ty - 4], [514, ty + 8]],
              [[514, ty + 8], [516, ty + 18], [526, ty + 19], [530, ty + 14]],
              [[530, ty + 14], [526, ty + 6], [526, ty - 4], [528, ty - 14]],
            ], 10);
            psShape(tabP, RC.coatWarm, { key: key + tKey + 'Tab', w: 3.4, line: RC.ink });

            const cordP = bezierPts([
              [[524, ty - 7], [552, ty - 6], [585, ty - 10], [606, ty - 6]],
              [[606, ty - 6], [612, ty], [608, ty + 8], [598, ty + 8]],
              [[598, ty + 8], [568, ty + 10], [542, ty + 10], [524, ty + 7]],
              [[524, ty + 7], [524, ty + 2], [524, ty - 2], [524, ty - 7]],
            ], 12);
            psShape(cordP, RC.cord, { key: key + tKey + 'Cord', w: 3.4, line: RC.ink });
            psLine([[526, ty + 1], [578, ty]], { key: key + tKey + 'CordMid', w: 2.8, col: RC.ink, second: false });

            const pegP = bezierPts([
              [[576, ty - 28], [586, ty - 31], [596, ty - 29], [598, ty - 24]],
              [[598, ty - 24], [599, ty - 4], [599, ty + 16], [596, ty + 28]],
              [[596, ty + 28], [592, ty + 32], [585, ty + 32], [582, ty + 26]],
              [[582, ty + 26], [578, ty + 10], [576, ty - 10], [576, ty - 28]],
            ], 14);
            psShape(pegP, RC.toggleMid, {
              key: key + tKey + 'Peg', w: 3.8, line: RC.ink, crayon: RC.toggleDark, crAl: 0.22,
              grad: (bb) => {
                const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
                g.addColorStop(0, RC.toggleLight); g.addColorStop(0.5, RC.toggleMid); g.addColorStop(1, RC.toggleDark);
                ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
              }
            });
            psLine(bezierPts([[[577, ty - 25], [584, ty - 21], [592, ty - 21], [597, ty - 25]]], 8), {
              key: key + tKey + 'Cap', w: 2.4, col: RC.ink, second: false
            });
          });
        };

        drawDuffleToggle(612, 'tog1');
        drawDuffleToggle(716, 'tog2');

        // LAYER 7: RAINCOAT HOOD, EAR SLITS & CALICO CAT HEAD
        withPivot(515, 480, headTilt, 1, 1, headDX, headBobY, () => {
          const hoodCavityP = bezierPts([
            [[522, 234], [610, 260], [692, 320], [730, 385]],
            [[730, 385], [740, 440], [700, 490], [542, 558]],
            [[542, 558], [465, 535], [320, 490], [304, 425]],
            [[304, 425], [308, 365], [375, 295], [522, 234]],
          ], 16);
          psShape(hoodCavityP, RC.coatDeep, { key: key + 'hoodCav', line: false });

          const faceP = bezierPts([
            [[522, 236], [598, 256], [674, 314], [708, 378]],
            [[708, 378], [724, 434], [692, 488], [615, 518]],
            [[615, 518], [568, 536], [552, 548], [540, 556]],
            [[540, 556], [522, 542], [488, 528], [425, 520]],
            [[425, 520], [348, 492], [318, 444], [320, 388]],
            [[320, 388], [326, 326], [420, 262], [522, 236]],
          ], 20);
          psShape(faceP, RC.furCream, {
            key: key + 'faceBase', w: 4.5, line: RC.ink, line2: RC.inkSoft, crayon: RC.furShade, crAl: 0.18,
            grad: (bb) => {
              const g = ctx.createRadialGradient(520, 380, 25, 520, 410, 210);
              g.addColorStop(0, RC.furLight);
              g.addColorStop(0.72, RC.furCream);
              g.addColorStop(1, RC.furShade);
              ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              const leftApricotP = bezierPts([
                [[525, 234], [520, 295], [492, 344], [468, 342]],
                [[468, 342], [455, 318], [418, 378], [358, 398]],
                [[358, 398], [326, 405], [318, 390], [322, 340]],
                [[322, 340], [380, 260], [460, 234], [525, 234]],
              ], 14);
              psShape(leftApricotP, RC.furOrangeLight, { key: key + 'patchLApr', line: false });

              const leftOrangeP = bezierPts([
                [[522, 234], [516, 286], [490, 336], [472, 334]],
                [[472, 334], [460, 332], [458, 304], [450, 304]],
                [[450, 304], [435, 338], [392, 372], [342, 386]],
                [[342, 386], [322, 390], [320, 340], [360, 280]],
                [[360, 280], [420, 240], [480, 234], [522, 234]],
              ], 16);
              psShape(leftOrangeP, RC.furOrange, {
                key: key + 'patchLOrg', line: false, crayon: '#bf793d', crAl: 0.26
              });
              psBlush(482, 326, 22, 14, '216,150,88', 0.65, -0.35);
              psBlush(405, 355, 38, 16, '216,150,88', 0.65, -0.42);

              const rightTanP = bezierPts([
                [[546, 240], [552, 292], [556, 344], [585, 384]],
                [[585, 384], [618, 412], [672, 410], [716, 398]],
                [[716, 398], [720, 330], [650, 255], [546, 240]],
              ], 16);
              psShape(rightTanP, RC.furTan, { key: key + 'patchRTan', line: false });

              const rightGreyP = bezierPts([
                [[526, 234], [534, 278], [558, 308], [596, 314]],
                [[596, 314], [638, 320], [666, 346], [662, 366]],
                [[662, 366], [658, 386], [682, 400], [716, 398]],
                [[716, 398], [720, 325], [645, 255], [526, 234]],
              ], 16);
              psShape(rightGreyP, RC.furGrey, {
                key: key + 'patchRGrey', line: false, crayon: RC.furGreyDark, crAl: 0.26
              });
              psBlush(595, 314, 34, 14, '124,128,133', 0.55, 0.35);
            }
          });

          const blushBoost = happyEnv * 0.16;
          psShape(ellipsePts(434, 432, 32, 21, 0.05, 20), RC.blushCore, {
            key: key + 'blCoreL', line: false, fillA: 0.52 + blushBoost
          });
          psBlush(434, 432, 38, 25, RC.blush, 0.54 + blushBoost, 0.05);

          psShape(ellipsePts(648, 422, 31, 20, -0.05, 20), RC.blushCore, {
            key: key + 'blCoreR', line: false, fillA: 0.52 + blushBoost
          });
          psBlush(648, 422, 37, 24, RC.blush, 0.54 + blushBoost, -0.05);

          const eyeLP = bezierPts([
            [[432, 392], [430, 386], [438, 384], [446, 388]],
            [[446, 388], [454, 392], [462, 388], [468, 380]],
            [[468, 380], [473, 375], [480, 380], [477, 388]],
            [[477, 388], [472, 402], [456, 408], [442, 404]],
            [[442, 404], [433, 401], [432, 396], [432, 392]],
          ], 14);
          psShape(eyeLP, RC.eye, { key: key + 'eyeL', w: 2.4, line: RC.eye, second: false });

          const eyeRP = bezierPts([
            [[601, 380], [599, 372], [606, 369], [612, 375]],
            [[612, 375], [618, 382], [626, 384], [635, 381]],
            [[635, 381], [642, 378], [647, 382], [644, 389]],
            [[644, 389], [638, 399], [622, 402], [609, 395]],
            [[609, 395], [603, 391], [602, 385], [601, 380]],
          ], 14);
          psShape(eyeRP, RC.eye, { key: key + 'eyeR', w: 2.4, line: RC.eye, second: false });

          const noseP = bezierPts([
            [[546, 398], [556, 398], [559, 403], [554, 409]],
            [[554, 409], [550, 413], [548, 415], [546, 415]],
            [[546, 415], [544, 415], [542, 413], [538, 409]],
            [[538, 409], [533, 403], [536, 398], [546, 398]],
          ], 12);
          psShape(noseP, RC.nose, { key: key + 'nose', w: 2.8, line: RC.noseLine, second: false });
          psLine([[547, 415], [548, 430]], { key: key + 'mouthTick', w: 3.8, col: RC.eye, second: false });

          // 7E. Buttercup Yellow Raincoat Hood Ring (Framed cleanly around the face via 'evenodd'!)
          const hoodOuterPts = bezierPts([
            [[495, 138], [572, 144], [638, 186], [698, 240]],
            [[698, 240], [748, 312], [772, 388], [766, 446]],
            [[766, 446], [758, 488], [716, 512], [674, 526]],
            [[674, 526], [620, 535], [568, 540], [542, 558]],
            [[542, 558], [516, 538], [450, 528], [388, 540]],
            [[388, 540], [312, 532], [254, 496], [232, 444]],
            [[232, 444], [218, 392], [248, 312], [312, 232]],
            [[312, 232], [362, 184], [422, 144], [495, 138]],
          ], 20);

          const hoodInnerPts = bezierPts([
            [[522, 236], [598, 258], [682, 318], [722, 378]],
            [[722, 378], [736, 428], [705, 478], [625, 514]],
            [[625, 514], [572, 536], [552, 548], [542, 558]],
            [[542, 558], [520, 540], [478, 526], [405, 516]],
            [[405, 516], [332, 482], [304, 432], [312, 378]],
            [[312, 378], [322, 322], [435, 260], [522, 236]],
          ], 20);

          const QOut = wobble(hoodOuterPts, true, 1.15, key + 'hOutFill', 6);
          const QIn = wobble(hoodInnerPts, true, 1.15, key + 'hInFill', 6);
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
          pencil({ x0: 215, y0: 135, x1: 775, y1: 560 }, {
            key: key + 'hoodCr', c: RC.coatShade, al: 0.16, per: 90, len: 14, a: -0.65, w: 1.2, max: 2000
          });
          ctx.restore();

          psLine(hoodInnerPts, { closed: true, key: key + 'hoodInLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

          psLine(bezierPts([
            [[358, 198], [412, 152], [454, 138], [495, 138]],
            [[495, 138], [546, 138], [595, 158], [636, 194]],
          ], 18), { key: key + 'hoodTopLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

          psLine(bezierPts([
            [[312, 232], [254, 304], [224, 372], [232, 444]],
            [[232, 444], [244, 494], [295, 524], [388, 540]],
          ], 18), { key: key + 'hoodLeftLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

          psLine(bezierPts([
            [[702, 242], [748, 314], [772, 388], [766, 446]],
            [[766, 446], [758, 488], [716, 512], [674, 526]],
          ], 18), { key: key + 'hoodRightLine', w: 4.8, col: RC.ink, col2: RC.inkSoft });

          // 7F. Ears Poking Through the Hood Slit Holes
          withPivot(355, 255, earRotL, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[316, 286], [310, 252], [312, 214], [326, 196]],
              [[326, 196], [338, 188], [372, 202], [402, 224]],
              [[402, 224], [376, 254], [346, 274], [316, 286]],
            ], 16);
            psShape(earLP, RC.furGrey, {
              key: key + 'earL', w: 4.8, line: RC.ink, line2: RC.inkSoft, crayon: RC.furGreyDark, crAl: 0.20,
              innerFn: () => {
                const earInLP = bezierPts([
                  [[334, 278], [334, 250], [338, 224], [346, 222]],
                  [[346, 222], [358, 222], [374, 236], [380, 246]],
                  [[380, 246], [362, 264], [346, 274], [334, 278]],
                ], 12);
                psShape(earInLP, RC.earPink, { key: key + 'earInL', line: false });
              }
            });
          });
          psLine(bezierPts([
            [[312, 268], [302, 274], [302, 286], [316, 286]],
            [[316, 286], [350, 272], [382, 250], [404, 224]],
            [[404, 224], [410, 214], [402, 206], [390, 210]],
          ], 14), { key: key + 'earSlitL', w: 4.5, col: RC.ink, col2: RC.inkSoft });

          withPivot(658, 245, earRotR, 1, 1, 0, 0, () => {
            const earRP = bezierPts([
              [[614, 216], [642, 192], [674, 180], [688, 186]],
              [[688, 186], [702, 196], [702, 236], [696, 272]],
              [[696, 272], [666, 256], [636, 236], [614, 216]],
            ], 16);
            psShape(earRP, RC.furOrange, {
              key: key + 'earR', w: 4.8, line: RC.ink, line2: RC.inkSoft, crayon: '#bf793d', crAl: 0.20,
              innerFn: () => {
                psBlush(696, 235, 18, 28, '248,238,225', 0.85);
                const earInRP = bezierPts([
                  [[642, 236], [656, 218], [670, 210], [678, 214]],
                  [[678, 214], [684, 224], [684, 248], [682, 266]],
                  [[682, 266], [664, 256], [650, 246], [642, 236]],
                ], 12);
                psShape(earInRP, RC.earPink, { key: key + 'earInR', line: false });
              }
            });
          });
          psLine(bezierPts([
            [[624, 202], [610, 202], [606, 212], [616, 220]],
            [[616, 220], [642, 242], [672, 262], [698, 274]],
            [[698, 274], [708, 276], [710, 264], [700, 250]],
          ], 14), { key: key + 'earSlitR', w: 4.5, col: RC.ink, col2: RC.inkSoft });

          // 7G. 6 Expressive Curved Whiskers
          withPivot(402, 434, whiskerTwitch, 1, 1, 0, 0, () => {
            psLine(bezierPts([[[400, 422], [356, 418], [332, 422], [312, 428]]], 10), { key: key + 'whL1', w: 2.8, col: RC.ink, second: false });
            psLine(bezierPts([[[402, 434], [362, 440], [338, 448], [320, 458]]], 10), { key: key + 'whL2', w: 2.8, col: RC.ink, second: false });
            psLine(bezierPts([[[405, 446], [372, 462], [348, 476], [332, 492]]], 10), { key: key + 'whL3', w: 2.8, col: RC.ink, second: false });
          });

          withPivot(680, 418, -whiskerTwitch, 1, 1, 0, 0, () => {
            psLine(bezierPts([[[678, 405], [712, 394], [734, 391], [754, 392]]], 10), { key: key + 'whR1', w: 2.8, col: RC.ink, second: false });
            psLine(bezierPts([[[680, 418], [714, 414], [734, 416], [750, 422]]], 10), { key: key + 'whR2', w: 2.8, col: RC.ink, second: false });
            psLine(bezierPts([[[680, 430], [710, 434], [728, 440], [744, 450]]], 10), { key: key + 'whR3', w: 2.8, col: RC.ink, second: false });
          });
        });
      });

      ctx.restore();
    }

    // =========================================================================
    // 5. CHARACTER 3: TEACUP GOLDEN PUPPY (FULL 3-PASS COLORED-PENCIL ENGINE)
    // =========================================================================
    const TP = {
      bg: '#faf6ec',
      ink: '#5c3d2e',
      inkSoft: '#845d48',
      inkHatch: '#9b725b',
      furLight: '#f6dca8',
      furMain: '#eec88b',
      furWarm: '#e3b774',
      furShade: '#c59558',
      furDeep: '#a97942',
      muzzle: '#f7e2b8',
      eye: '#472a1e',
      noseTop: '#754c39',
      blush: '236,152,98',
      collar: '#fbf6e9',
      collarShade: '#e5dcc5',
      ribbon: '#c4877b',
      ribbonDeep: '#9e6358',
      cup: '#ffffff',
      cupShade: '#e8e4dc',
      teaRim: '#c9b9a6'
    };

    function tpLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? TP.ink, col2: o.col2 ?? TP.inkSoft, w: o.w ?? 4.2, amt: o.amt ?? 1.05 });
    }

    function tpShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? TP.ink), line2: o.line2 ?? TP.inkSoft, w: o.w ?? 4.2, amt: o.amt ?? 1.0 });
    }

    function drawTeacupPuppyMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'tpHero';
      const isStatic = !rig;

      const breath = isStatic ? 0 : rig.breath;
      const bodySway = isStatic ? 0 : rig.torsoSway;
      const headTilt = isStatic ? 0 : rig.headTilt;
      const headDX = isStatic ? 0 : rig.headTurn;
      const headDY = isStatic ? 0 : rig.headNod;
      const earLRot = isStatic ? 0 : rig.hairSwayL;
      const earRRot = isStatic ? 0 : rig.hairSwayR;
      const armLRot = isStatic ? 0 : rig.leftArmLift;
      const armRRot = isStatic ? 0 : rig.rightArmLift;
      const tailWag = isStatic ? 0 : rig.ruffleBounce * 1.2 + rig.hairSwayL * 0.5;
      const blink = isStatic ? 0 : rig.blink;
      const gazeX = isStatic ? 0 : rig.gazeX * 0.5;
      const gazeY = isStatic ? 0 : rig.gazeY * 0.5;

      ctx.save();
      ctx.fillStyle = TP.bg;
      ctx.fillRect(0, 0, 1000, 1000);
      pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'tpPaper', c: '#e6decb', al: 0.16, per: 850, len: 10 });

      // Layer 1: Soft Contact Ground Shadow
      psBlush(505, 838, 255, 38, '135,100,72', 0.24, 0);

      // Layer 2: Wagging Tufted Tail on Left (3 fluffy outer notches + pencil shading)
      withPivot(292, 775, tailWag, 1, 1, 0, 0, () => {
        const tailP = bezierPts([
          [[295, 788], [262, 782], [234, 762], [220, 740]],
          [[220, 740], [208, 742], [204, 725], [214, 710]],
          [[214, 710], [205, 695], [206, 668], [220, 640]],
          [[220, 640], [238, 672], [262, 706], [302, 742]],
          [[302, 742], [300, 765], [298, 778], [295, 788]]
        ], 14);
        tpShape(tailP, TP.furWarm, {
          key: key + 'tail', crayon: TP.furDeep, crAl: 0.24,
          innerFn: (bb) => {
            pencil(bb, { key: key + 'tSh', c: TP.furDeep, al: 0.26, per: 75, len: 14, a: 0.9 });
          }
        });
      });

      // Layer 3: Plump Sitting Body & Hind Feet
      withPivot(500, 815, bodySway, 1 + breath * 0.45, 1 + breath, 0, -breath * 32, () => {
        const bodyP = bezierPts([
          [[338, 495], [290, 565], [278, 695], [308, 795]],
          [[308, 795], [348, 852], [475, 860], [608, 845]],
          [[608, 845], [678, 825], [712, 765], [705, 685]],
          [[705, 685], [698, 595], [675, 535], [642, 495]],
          [[642, 495], [550, 515], [430, 515], [338, 495]]
        ], 18);
        tpShape(bodyP, TP.furMain, {
          key: key + 'body', line: false, crayon: TP.furShade, crAl: 0.18,
          grad: (bb) => {
            const g = ctx.createRadialGradient(505, 645, 30, 505, 680, 240);
            g.addColorStop(0, TP.furLight);
            g.addColorStop(0.65, TP.furMain);
            g.addColorStop(1, TP.furWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(360, 765, 85, 65, '182,130,74', 0.42, 0.3);
            psBlush(525, 795, 130, 45, '182,130,74', 0.38, 0);
          }
        });

        // Open-contour body sides & fluffy hip tufts
        tpLine(bezierPts([
          [[318, 532], [292, 588], [282, 685], [308, 792]],
          [[308, 792], [338, 842], [412, 858], [488, 858]]
        ], 16), { key: key + 'bLineL', w: 4.4 });
        tpLine(bezierPts([
          [[676, 545], [702, 615], [708, 695], [698, 765]]
        ], 14), { key: key + 'bLineR', w: 4.4 });

        // Left & Right Sitting Hind Paws (with 2 toe-division lines & heel pencil shading)
        const footLP = bezierPts([
          [[352, 778], [415, 852], [498, 862], [532, 835]],
          [[532, 835], [552, 795], [538, 745], [505, 748]],
          [[505, 748], [472, 756], [428, 718], [375, 708]]
        ], 16);
        tpShape(footLP, TP.furMain, {
          key: key + 'footL', line: false, crayon: TP.furShade, crAl: 0.22,
          innerFn: () => {
            psBlush(508, 812, 38, 42, '168,118,64', 0.55, -0.25);
          }
        });
        tpLine(bezierPts([
          [[375, 708], [425, 718], [462, 748], [475, 772]],
          [[475, 772], [498, 742], [535, 742], [546, 782]],
          [[546, 782], [545, 832], [502, 862], [435, 854]]
        ], 16), { key: key + 'fLOut', w: 4.2 });
        tpLine([[508, 750], [496, 778]], { key: key + 'fLToe1', w: 3.2, second: false });
        tpLine([[526, 752], [515, 782]], { key: key + 'fLToe2', w: 3.2, second: false });

        const footRP = bezierPts([
          [[602, 822], [658, 838], [718, 818], [742, 772]],
          [[742, 772], [750, 735], [722, 715], [688, 732]],
          [[688, 732], [655, 748], [622, 765], [602, 822]]
        ], 16);
        tpShape(footRP, TP.furMain, {
          key: key + 'footR', line: false, crayon: TP.furShade, crAl: 0.22,
          innerFn: () => {
            psBlush(715, 775, 36, 40, '168,118,64', 0.55, 0.35);
          }
        });
        tpLine(bezierPts([
          [[612, 715], [648, 725], [672, 742], [685, 755]],
          [[685, 755], [705, 718], [742, 722], [745, 765]],
          [[745, 765], [732, 815], [665, 838], [585, 832]]
        ], 16), { key: key + 'fROut', w: 4.2 });
        tpLine([[708, 724], [696, 750]], { key: key + 'fRToe1', w: 3.2, second: false });
        tpLine([[726, 728], [714, 756]], { key: key + 'fRToe2', w: 3.2, second: false });

        // Layer 5: 7-Lobe Scalloped Ivory Collar & Dusty-Rose Ribbon Bow
        withPivot(505, 495, rig ? rig.ruffleBounce * 0.12 : 0, 1, 1, 0, 0, () => {
          const collarP = bezierPts([
            [[358, 468], [322, 492], [305, 515], [315, 532]],
            [[315, 532], [328, 545], [355, 542], [375, 534]],
            [[375, 534], [372, 558], [398, 574], [428, 560]],
            [[428, 560], [442, 582], [478, 585], [502, 562]],
            [[502, 562], [528, 585], [568, 584], [584, 560]],
            [[584, 560], [608, 572], [634, 558], [630, 532]],
            [[630, 532], [652, 538], [678, 526], [678, 508]],
            [[678, 508], [668, 488], [642, 472], [625, 465]],
            [[625, 465], [545, 498], [445, 498], [358, 468]]
          ], 14);
          tpShape(collarP, TP.collar, {
            key: key + 'collar', w: 4.0, crayon: TP.collarShade, crAl: 0.2,
            innerFn: () => {
              psBlush(505, 495, 145, 28, '195,175,148', 0.45, 0);
            }
          });

          // Dusty-Rose Neck Ribbon Strap & 2-Loop Bow with V-Notched Tails
          const neckBandP = bezierPts([
            [[375, 468], [445, 505], [555, 505], [622, 465]],
            [[622, 465], [612, 482], [552, 516], [498, 516]],
            [[498, 516], [442, 516], [385, 484], [375, 468]]
          ], 12);
          tpShape(neckBandP, TP.ribbon, { key: key + 'nBand', w: 3.4 });

          // Left & Right V-Notched Ribbon Tails
          tpShape(bezierPts([
            [[504, 515], [486, 555], [478, 588], [478, 610]],
            [[478, 610], [488, 598], [494, 598], [500, 608]],
            [[500, 608], [506, 572], [510, 540], [512, 516]]
          ], 12), TP.ribbon, { key: key + 'rTailL', w: 3.4 });

          tpShape(bezierPts([
            [[516, 516], [520, 548], [526, 580], [532, 608]],
            [[532, 608], [540, 596], [545, 596], [554, 605]],
            [[554, 605], [546, 568], [535, 536], [524, 515]]
          ], 12), TP.ribbon, { key: key + 'rTailR', w: 3.4 });

          // Left & Right Bow Loops + Inner Darker Loop Hollows
          tpShape(bezierPts([
            [[505, 504], [468, 506], [442, 526], [446, 544]],
            [[446, 544], [452, 560], [482, 548], [508, 522]]
          ], 14), TP.ribbon, {
            key: key + 'rLoopL', w: 3.6,
            innerFn: () => {
              tpShape(bezierPts([[[496, 514], [465, 520], [458, 536], [496, 522]]], 8), TP.ribbonDeep, { key: key + 'rInL', w: 2.2 });
            }
          });

          tpShape(bezierPts([
            [[520, 504], [556, 508], [582, 526], [578, 544]],
            [[578, 544], [572, 558], [544, 548], [518, 522]]
          ], 14), TP.ribbon, {
            key: key + 'rLoopR', w: 3.6,
            innerFn: () => {
              tpShape(bezierPts([[[528, 514], [558, 520], [564, 536], [528, 522]]], 8), TP.ribbonDeep, { key: key + 'rInR', w: 2.2 });
            }
          });

          // Center Bow Knot
          tpShape(ellipsePts(512, 512, 10, 12, 0, 14), TP.ribbon, { key: key + 'rKnot', w: 3.6 });
        });

        // Layer 6: Porcelain Teacup (C-handle on left, flared rim, foot ring)
        withPivot(533, 655, armLRot * 0.25, 1, 1, 0, 0, () => {
          // Left C-Handle
          tpShape(bezierPts([
            [[490, 634], [458, 628], [456, 672], [494, 675]],
            [[494, 675], [496, 665], [468, 662], [470, 644]],
            [[470, 644], [472, 638], [488, 642], [490, 634]]
          ], 12), TP.cup, { key: key + 'cupH', w: 3.6 });

          // Cup Pedestal Foot
          tpShape(bezierPts([
            [[508, 686], [502, 696], [518, 700], [534, 700]],
            [[534, 700], [552, 700], [564, 696], [558, 686]]
          ], 10), TP.cupShade, { key: key + 'cupFoot', w: 3.6 });

          // Cup Main Porcelain Bowl
          const cupBodyP = bezierPts([
            [[484, 622], [488, 668], [504, 690], [533, 690]],
            [[533, 690], [562, 690], [578, 668], [582, 622]],
            [[582, 622], [556, 630], [510, 630], [484, 622]]
          ], 16);
          tpShape(cupBodyP, TP.cup, {
            key: key + 'cupBody', w: 3.8,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
              g.addColorStop(0, '#ffffff');
              g.addColorStop(0.7, '#f7f4ee');
              g.addColorStop(1, TP.cupShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });

          // Cup Top Rim & Inner Tea Shading
          tpShape(ellipsePts(533, 622, 49, 10, 0, 24), TP.cup, {
            key: key + 'cupRim', w: 3.6,
            innerFn: () => {
              tpShape(ellipsePts(533, 624, 42, 6, 0, 20), TP.teaRim, { key: key + 'teaIn', line: false, fillA: 0.55 });
            }
          });
        });

        // Layer 7: Left & Right Front Arms with Open-Contour Shoulder Joins & 3-Toed Paws
        withPivot(345, 575, armLRot, 1, 1, 0, 0, () => {
          const armLP = bezierPts([
            [[320, 545], [302, 608], [312, 672], [368, 695]],
            [[368, 695], [418, 706], [468, 692], [476, 662]],
            [[476, 662], [480, 636], [455, 622], [412, 624]],
            [[412, 624], [388, 602], [375, 572], [368, 548]]
          ], 16);
          tpShape(armLP, TP.furMain, {
            key: key + 'armL', line: false, crayon: TP.furShade, crAl: 0.22,
            innerFn: () => {
              psBlush(395, 672, 62, 26, '175,122,68', 0.48, 0.15);
            }
          });
          tpLine(bezierPts([
            [[318, 545], [302, 608], [312, 672], [368, 695]],
            [[368, 695], [418, 706], [468, 692], [476, 662]],
            [[476, 662], [480, 636], [455, 622], [412, 624]],
            [[412, 624], [392, 605], [382, 585], [376, 568]]
          ], 16), { key: key + 'armLOut', w: 4.2 });
          tpLine([[455, 646], [474, 650]], { key: key + 'pawLT1', w: 3.2, second: false });
          tpLine([[452, 666], [472, 670]], { key: key + 'pawLT2', w: 3.2, second: false });
        });

        withPivot(655, 575, armRRot, 1, 1, 0, 0, () => {
          const armRP = bezierPts([
            [[668, 545], [698, 605], [692, 668], [642, 688]],
            [[642, 688], [602, 695], [576, 675], [576, 648]],
            [[576, 648], [576, 624], [598, 616], [625, 618]],
            [[625, 618], [636, 595], [644, 572], [648, 548]]
          ], 16);
          tpShape(armRP, TP.furMain, {
            key: key + 'armR', line: false, crayon: TP.furShade, crAl: 0.22,
            innerFn: () => {
              psBlush(635, 665, 52, 24, '175,122,68', 0.48, -0.2);
            }
          });
          tpLine(bezierPts([
            [[670, 545], [698, 605], [692, 668], [642, 688]],
            [[642, 688], [602, 695], [576, 675], [576, 648]],
            [[576, 648], [576, 624], [598, 616], [625, 618]],
            [[625, 618], [634, 600], [640, 582], [644, 568]]
          ], 16), { key: key + 'armROut', w: 4.2 });
          tpLine([[598, 642], [578, 646]], { key: key + 'pawRT1', w: 3.2, second: false });
          tpLine([[600, 662], [580, 666]], { key: key + 'pawRT2', w: 3.2, second: false });
        });

        // Rising Warm Tea Steam Wisps (Animated when not in static rest pose)
        if (!isStatic) {
          const t = StudioState.t;
          for (let s = 0; s < 2; s++) {
            const ph = s * 2.4;
            const driftY = ((t * 18 + s * 20) % 42);
            const alpha = Math.sin((driftY / 42) * Math.PI) * 0.42;
            const sx = 524 + s * 18 + Math.sin(t * 2.5 + ph) * 5;
            const sy = 608 - driftY;
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.0;
            ctx.lineCap = 'round';
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.bezierCurveTo(sx - 8, sy - 12, sx + 8, sy - 24, sx - 2, sy - 36);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Layer 8..12: Plump Mochi Puppy Head, Floppy Spaniel Ears, Muzzle & 3-Stage Blink Eyes
        withPivot(505, 455, headTilt, 1, 1, headDX, headDY, () => {
          // Left Floppy Spaniel Ear (Behind/Joined to Crown with Heavy Shaded Tip)
          withPivot(345, 225, earLRot, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[358, 212], [312, 205], [278, 250], [248, 325]],
              [[248, 325], [212, 395], [196, 445], [212, 495]],
              [[212, 495], [228, 535], [285, 532], [322, 488]],
              [[322, 488], [352, 445], [355, 365], [358, 295]]
            ], 18);
            tpShape(earLP, TP.furMain, {
              key: key + 'earL', line: false, crayon: TP.furShade, crAl: 0.22,
              grad: (bb) => {
                const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
                g.addColorStop(0, TP.furLight);
                g.addColorStop(0.55, TP.furMain);
                g.addColorStop(1, TP.furShade);
                ctx.fillStyle = g;
                ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
              },
              innerFn: () => {
                psBlush(268, 468, 65, 52, '162,108,54', 0.62, -0.25);
                pencil({ x0: 202, y0: 415, x1: 335, y1: 530 }, {
                  key: key + 'earLTipCr', c: TP.furDeep, al: 0.34, per: 55, len: 18, a: -1.15, w: 1.5
                });
              }
            });
            tpLine(bezierPts([
              [[358, 212], [312, 205], [278, 250], [248, 325]],
              [[248, 325], [212, 395], [196, 445], [212, 495]],
              [[212, 495], [228, 535], [285, 532], [322, 488]],
              [[322, 488], [348, 450], [352, 385], [352, 315]]
            ], 18), { key: key + 'earLOut', w: 4.4 });
          });

          // Right Floppy Spaniel Ear
          withPivot(625, 225, earRRot, 1, 1, 0, 0, () => {
            const earRP = bezierPts([
              [[612, 208], [652, 206], [685, 252], [712, 325]],
              [[712, 325], [742, 395], [765, 445], [752, 492]],
              [[752, 492], [738, 530], [682, 522], [650, 478]],
              [[650, 478], [628, 435], [625, 365], [612, 208]]
            ], 18);
            tpShape(earRP, TP.furMain, {
              key: key + 'earR', line: false, crayon: TP.furShade, crAl: 0.22,
              grad: (bb) => {
                const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
                g.addColorStop(0, TP.furLight);
                g.addColorStop(0.55, TP.furMain);
                g.addColorStop(1, TP.furShade);
                ctx.fillStyle = g;
                ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
              },
              innerFn: () => {
                psBlush(702, 465, 62, 50, '162,108,54', 0.62, 0.25);
                pencil({ x0: 642, y0: 412, x1: 760, y1: 525 }, {
                  key: key + 'earRTipCr', c: TP.furDeep, al: 0.34, per: 55, len: 18, a: 1.15, w: 1.5
                });
              }
            });
            tpLine(bezierPts([
              [[612, 208], [652, 206], [685, 252], [712, 325]],
              [[712, 325], [742, 395], [765, 445], [752, 492]],
              [[752, 492], [738, 530], [682, 522], [650, 478]],
              [[650, 478], [632, 440], [628, 375], [628, 315]]
            ], 18), { key: key + 'earROut', w: 4.4 });
          });

          // Main Round Mochi Head Base (Open-Contour Crown + Lower Cheek Curve)
          const headP = bezierPts([
            [[355, 212], [412, 162], [552, 160], [615, 208]],
            [[615, 208], [648, 258], [662, 345], [658, 412]],
            [[658, 412], [652, 468], [588, 504], [505, 504]],
            [[505, 504], [418, 504], [352, 468], [344, 412]],
            [[344, 412], [338, 345], [348, 265], [355, 212]]
          ], 20);
          tpShape(headP, TP.furMain, {
            key: key + 'headBase', line: false, crayon: TP.furShade, crAl: 0.16,
            grad: (bb) => {
              const g = ctx.createRadialGradient(495, 315, 25, 500, 355, 195);
              g.addColorStop(0, TP.furLight);
              g.addColorStop(0.68, TP.furMain);
              g.addColorStop(1, TP.furWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Soft lighter cream muzzle glow
              const muzP = ellipsePts(512, 416, 76, 54, 0, 28);
              psShape(muzP, TP.muzzle, { key: key + 'muz', line: false, fillA: 0.78 });
            }
          });

          // Top Crown Arch & Lower Cheek/Chin Contour Lines (Open-Contour Joins at Ear Bases!)
          tpLine(bezierPts([
            [[356, 210], [418, 162], [548, 160], [614, 208]]
          ], 16), { key: key + 'crownL', w: 4.4 });

          tpLine(bezierPts([
            [[348, 285], [340, 352], [342, 418], [358, 458]],
            [[358, 458], [392, 496], [452, 504], [508, 504]],
            [[508, 504], [568, 504], [628, 488], [652, 445]],
            [[652, 445], [664, 405], [654, 345], [634, 278]]
          ], 20), { key: key + 'jawL', w: 4.4 });

          // Warm Apricot-Coral Cheek Blushes + 5 Diagonal Colored-Pencil Hatch Ticks per Cheek
          psBlush(405, 412, 42, 26, TP.blush, 0.68, 0.05);
          psBlush(615, 405, 40, 25, TP.blush, 0.68, -0.05);

          for (let i = 0; i < 5; i++) {
            const lx = 382 + i * 8;
            const ly = 408 + (i % 2) * 2;
            tpLine([[lx, ly + 8], [lx + 7, ly - 5]], { key: key + 'bhL' + i, w: 1.9, col: TP.inkHatch, second: false });
            const rx = 594 + i * 8;
            const ry = 400 + (i % 2) * 2;
            tpLine([[rx, ry + 8], [rx + 7, ry - 5]], { key: key + 'bhR' + i, w: 1.9, col: TP.inkHatch, second: false });
          }

          // 3-Stage Deforming Eyelid Blink for Left & Right Espresso Oval Eyes (Never squashed!)
          const drawPuppyEye = (ex, ey, erx, ery, eKey) => {
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              // Clip the un-squashed oval eye inside a descending eyelid mask
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 8, clipTop, (erx + 8) * 2, ery * 2.5);
              ctx.clip();

              const eyeP = ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 20);
              psShape(eyeP, TP.eye, { key: key + eKey, w: 2.2, line: TP.eye, second: false });

              // Subtle warm specular glint
              ctx.fillStyle = 'rgba(255,248,238,0.85)';
              ctx.beginPath();
              ctx.ellipse(ex + gazeX - erx * 0.28, ey + gazeY - ery * 0.28, 3.2, 4.0, -0.2, 0, TAU);
              ctx.fill();
              ctx.restore();
            }
            if (u > 0.12) {
              // Deforming upper eyelid arch sweeping down into a happy sleeping crescent
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 10;
              tpLine(bezierPts([
                [[ex - erx - 3, ey + u * 3], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 3]]
              ], 10), { key: key + eKey + 'Lid', w: 3.8, col: TP.eye, second: false });
            }
          };

          drawPuppyEye(436, 365, 13.5, 16.5, 'pEyeL');
          drawPuppyEye(582, 360, 12.5, 15.5, 'pEyeR');

          // Two-Tone Roasted-Cocoa Triangular Nose & Vertical Philtrum Tick
          const noseP = bezierPts([
            [[518, 384], [534, 384], [536, 394], [526, 402]],
            [[526, 402], [521, 406], [516, 406], [510, 402]],
            [[510, 402], [500, 394], [502, 384], [518, 384]]
          ], 12);
          psShape(noseP, TP.eye, {
            key: key + 'nose', w: 2.6, line: TP.eye, second: false,
            innerFn: () => {
              psShape(ellipsePts(518, 388, 12, 5, 0, 12), TP.noseTop, { key: key + 'nHi', line: false });
            }
          });
          tpLine([[518, 405], [519, 421]], { key: key + 'phil', w: 3.4, col: TP.eye, second: false });
        });
      });

      ctx.restore();
    }

    // =========================================================================
    // 5B. CHARACTER 4: SLEEPY NIGHTCAP KITTEN HOLDING CANDLE LANTERN (ENGINE C)
    // =========================================================================
    const LK = {
      bg: '#faf7ef',             // Warm cream storybook paper
      ink: '#594336',            // Warm cocoa-taupe colored-pencil outline
      inkSoft: '#846958',        // Secondary soft pencil pass
      inkLight: '#a78e7b',       // Subtle forehead fur & fabric fold line

      furLight: '#fff9e8',       // Forehead & upper cheek highlight
      furMain: '#f9ecc9',        // Main buttermilk-cream fur
      furWarm: '#f2dfb3',        // Lower cheek & paw warm cream
      furShade: '#e4cba0',       // Under-chin & neck shadow
      muzzle: '#fffdf7',         // Soft snowy-white muzzle halo

      earPink: '#f0bfb0',        // Soft rosy-peach inner ear triangle
      earPinkShade: '#df9f8e',   // Inner ear fold shade
      eye: '#462c1e',            // Deep espresso oval eye
      nose: '#ea9b96',           // Sweet salmon-pink triangular nose
      blush: '234,148,122',      // Warm coral-peach cheek blush RGB
      blushTick: '#b5634b',      // Diagonal cheek hatch lines

      gownCream: '#f7eed8',      // Nightgown & nightcap cream stripe base
      gownShade: '#e5d9be',      // Nightgown lower hem & fold shadow
      stripeBlue: '#9ca5ca',     // Dusty periwinkle-lavender stripe fill
      stripeBlueDark: '#818ab2', // Periwinkle stripe fold shadow
      cavityDark: '#5c493c',     // Dark sleeve & hem interior cavity

      brassLight: '#ecd08b',     // Lantern brass highlight
      brassMain: '#cfa258',      // Main antique brass body
      brassDark: '#9e7232',      // Brass rim & base shadow
      candleWax: '#f8f3e8',      // White-cream wax candle cylinder
      candleShade: '#dfd6c3',
      flameCore: '#fffbe0',      // Bright white-gold flame center
      flameOuter: '#ffba42',     // Warm amber-orange outer flame
      glowRGB: '255,218,120'     // Radial lantern light glow
    };

    function lkLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? LK.ink, col2: o.col2 ?? LK.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 1.0 });
    }

    function lkShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? LK.ink), line2: o.line2 ?? LK.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }

    function drawPeriwinkleStripe(P, sKey, crAngle = -1.1) {
      lkShape(P, LK.stripeBlue, {
        key: sKey,
        line: false,
        crayon: LK.stripeBlueDark,
        crAl: 0.24,
        crPer: 65,
        crLen: 15,
        crA: crAngle,
        innerFn: (bb) => {
          // Subtle cream colored-pencil paper tooth showing through the periwinkle stripe
          pencil(bb, { key: sKey + 'tooth', c: LK.gownCream, al: 0.22, per: 85, len: 12, a: crAngle + 0.25, w: 1.1 });
        }
      });
      // Soft colored-pencil border along the stripe edges
      lkLine(P, { closed: true, key: sKey + 'Edge', w: 1.6, col: LK.stripeBlueDark, a: 0.55, second: false });
    }

    function drawLanternKittenMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'lkHero';
      const isStatic = !rig;
      const t = StudioState.t;

      // Map 17-joint StudioState rig to anatomical pivots with phase-lagged overlapping action
      const breath = isStatic ? 0 : rig.breath;
      const bodySway = isStatic ? 0 : rig.torsoSway;
      const headTilt = isStatic ? 0 : rig.headTilt;
      const headDX = isStatic ? 0 : rig.headTurn;
      const headDY = isStatic ? 0 : rig.headNod;
      const earLRot = isStatic ? 0 : rig.hairSwayL * 0.75;
      const capTailRot = isStatic ? 0 : (rig.hairSwayR * 1.35 + rig.ruffleBounce * 0.55);
      const armLRot = isStatic ? 0 : rig.leftArmLift;
      const armRRot = isStatic ? 0 : rig.rightArmLift;
      const lanternSwing = isStatic ? 0 : (-rig.leftArmLift * 0.65 + rig.ruffleBounce * 0.85);
      const whiskerTwitch = isStatic ? 0 : rig.bangsSway * 0.55;
      const blink = isStatic ? 0 : rig.blink;
      const gazeX = isStatic ? 0 : rig.gazeX * 0.45;
      const gazeY = isStatic ? 0 : rig.gazeY * 0.45;
      const blushAlpha = isStatic ? 0.68 : (0.58 + rig.smile * 0.22);
      const flamePulse = isStatic ? 1.0 : (1.0 + Math.sin(t * TAU * 2.0) * 0.08 + Math.cos(t * TAU * 3.0) * 0.05);

      ctx.save();
      ctx.fillStyle = LK.bg;
      ctx.fillRect(0, 0, 1000, 1000);
      pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'lkPaper', c: '#e6dfd0', al: 0.16, per: 850, len: 11 });

      // -----------------------------------------------------------------
      // LAYER 1: SOFT GROUND SHADOW & PEEKING BOTTOM FEET (x: 365..620, y: 835..892)
      // -----------------------------------------------------------------
      psBlush(515, 875, 210, 28, '130,105,82', 0.22, 0);

      // Left Foot (3 rounded toes peeking under nightgown hem)
      withPivot(405, 855, isStatic ? 0 : -rig.torsoSway * 0.4, 1, 1, 0, 0, () => {
        const footLP = bezierPts([
          [[368, 840], [364, 864], [378, 882], [406, 884]],
          [[406, 884], [434, 884], [448, 872], [448, 852]],
          [[448, 852], [425, 842], [392, 838], [368, 840]]
        ], 14);
        lkShape(footLP, LK.furWarm, {
          key: key + 'footL', w: 4.2, crayon: LK.furShade, crAl: 0.22,
          innerFn: () => {
            psBlush(408, 848, 42, 14, '145,112,82', 0.38, 0);
          }
        });
        lkLine(bezierPts([[[392, 858], [390, 872], [392, 880], [395, 883]]], 8), { key: key + 'fLT1', w: 3.2, second: false });
        lkLine(bezierPts([[[418, 858], [418, 872], [420, 880], [422, 883]]], 8), { key: key + 'fLT2', w: 3.2, second: false });
      });

      // Right Foot (3 rounded toes peeking under nightgown hem)
      withPivot(575, 858, isStatic ? 0 : rig.torsoSway * 0.4, 1, 1, 0, 0, () => {
        const footRP = bezierPts([
          [[534, 855], [534, 878], [552, 892], [580, 892]],
          [[580, 892], [608, 890], [622, 874], [618, 852]],
          [[618, 852], [592, 846], [558, 848], [534, 855]]
        ], 14);
        lkShape(footRP, LK.furWarm, {
          key: key + 'footR', w: 4.2, crayon: LK.furShade, crAl: 0.22,
          innerFn: () => {
            psBlush(576, 854, 44, 14, '145,112,82', 0.38, 0);
          }
        });
        lkLine(bezierPts([[[560, 864], [558, 878], [560, 886], [562, 890]]], 8), { key: key + 'fRT1', w: 3.2, second: false });
        lkLine(bezierPts([[[586, 862], [588, 876], [590, 884], [592, 888]]], 8), { key: key + 'fRT2', w: 3.2, second: false });
      });

      // -----------------------------------------------------------------
      // BREATHING TORSO & STRIPED NIGHTGOWN HIERARCHY
      // -----------------------------------------------------------------
      withPivot(510, 840, bodySway, 1 + breath * 0.35, 1 + breath, 0, -breath * 28, () => {

        // Dark hem under-cavity (visible at bottom-left & bottom-right corners of hem)
        lkShape([[326, 825], [358, 845], [330, 848]], LK.cavityDark, { key: key + 'hemCavL', w: 3.5 });
        lkShape([[695, 835], [732, 845], [708, 860]], LK.cavityDark, { key: key + 'hemCavR', w: 3.5 });

        // LAYER 2: FLOWING A-LINE STRIPED NIGHTGOWN BODY (x: 325..734, y: 445..868)
        const gownBodyP = bezierPts([
          [[395, 446], [448, 488], [525, 492], [588, 452]],
          [[588, 452], [625, 442], [658, 470], [668, 545]],
          [[668, 545], [675, 645], [692, 745], [718, 812]],
          [[718, 812], [736, 835], [738, 855], [715, 862]],
          [[715, 862], [678, 868], [635, 850], [582, 852]],
          [[582, 852], [534, 855], [505, 872], [462, 864]],
          [[462, 864], [418, 852], [385, 842], [345, 846]],
          [[345, 846], [322, 845], [324, 818], [336, 785]],
          [[336, 785], [328, 745], [344, 685], [356, 565]],
          [[356, 565], [362, 495], [375, 455], [395, 446]]
        ], 18);

        lkShape(gownBodyP, LK.gownCream, {
          key: key + 'gownBase', line: false, crayon: LK.gownShade, crAl: 0.16,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, '#fffaf0');
            g.addColorStop(0.65, LK.gownCream);
            g.addColorStop(1, LK.gownShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // 8 Vertical Periwinkle-Blue Stripes Clipped Inside Nightgown Body
            const bodyStripes = [
              // Stripe 1 (Far Left)
              [
                [[364, 465], [356, 575], [342, 705], [332, 838]],
                [[332, 838], [344, 842], [352, 842], [360, 842]],
                [[360, 842], [368, 705], [376, 575], [382, 458]]
              ],
              // Stripe 2
              [
                [[394, 462], [385, 580], [372, 715], [365, 842]],
                [[365, 842], [378, 844], [388, 846], [398, 848]],
                [[398, 848], [402, 715], [408, 580], [414, 472]]
              ],
              // Stripe 3
              [
                [[428, 478], [420, 595], [408, 725], [404, 852]],
                [[404, 852], [418, 856], [430, 860], [442, 864]],
                [[442, 864], [442, 725], [444, 595], [448, 486]]
              ],
              // Stripe 4 (Center-Left)
              [
                [[462, 488], [456, 605], [452, 735], [455, 866]],
                [[455, 866], [468, 868], [480, 868], [492, 868]],
                [[492, 868], [484, 735], [478, 605], [482, 492]]
              ],
              // Stripe 5 (Center-Right)
              [
                [[498, 492], [494, 608], [498, 738], [510, 866]],
                [[510, 866], [522, 864], [534, 860], [545, 858]],
                [[545, 858], [534, 735], [522, 605], [520, 492]]
              ],
              // Stripe 6
              [
                [[535, 488], [538, 605], [552, 735], [568, 854]],
                [[568, 854], [582, 854], [595, 854], [608, 856]],
                [[608, 856], [586, 730], [566, 600], [556, 480]]
              ],
              // Stripe 7
              [
                [[570, 472], [582, 595], [608, 728], [634, 858]],
                [[634, 858], [648, 860], [662, 864], [674, 865]],
                [[674, 865], [642, 725], [612, 590], [590, 462]]
              ],
              // Stripe 8 (Far Right Edge)
              [
                [[604, 456], [628, 585], [662, 720], [692, 864]],
                [[692, 864], [706, 864], [718, 860], [728, 854]],
                [[728, 854], [692, 715], [658, 580], [628, 450]]
              ]
            ];

            for (let i = 0; i < bodyStripes.length; i++) {
              drawPeriwinkleStripe(bezierPts(bodyStripes[i], 14), key + 'bStr' + i, -1.35);
            }

            // Soft fabric fold shadows & diagonal drape creases across the lower gown
            psBlush(495, 765, 95, 85, '150,138,118', 0.24, 0.25);
            psBlush(515, 845, 185, 26, '140,126,105', 0.32, 0);

            lkLine(bezierPts([[[448, 675], [472, 722], [504, 762], [538, 792]]], 12), {
              key: key + 'drape1', w: 2.2, col: LK.inkLight, second: false
            });
            lkLine(bezierPts([[[445, 738], [468, 772], [496, 800], [522, 818]]], 12), {
              key: key + 'drape2', w: 2.0, col: LK.inkLight, second: false
            });
          }
        });

        // Double-stitched wavy bottom hem line & outer gown contour (Open-Contour at shoulders!)
        lkLine(bezierPts([
          [[332, 822], [358, 820], [395, 825], [435, 840]],
          [[435, 840], [478, 855], [512, 854], [552, 838]],
          [[552, 838], [602, 834], [655, 850], [718, 842]]
        ], 16), { key: key + 'hemSeam', w: 2.2, col: LK.inkSoft, second: false });

        lkLine(bezierPts([
          [[352, 578], [344, 685], [328, 745], [336, 785]],
          [[336, 785], [324, 818], [322, 845], [345, 846]],
          [[345, 846], [385, 842], [418, 852], [462, 864]],
          [[462, 864], [505, 872], [534, 855], [582, 852]],
          [[582, 852], [635, 850], [678, 868], [715, 862]],
          [[715, 862], [738, 855], [736, 835], [718, 812]],
          [[718, 812], [692, 745], [675, 645], [668, 565]]
        ], 18), { key: key + 'gownOut', w: 4.2 });

        // Collar neckline curve under chin
        lkLine(bezierPts([
          [[402, 452], [452, 492], [518, 495], [578, 456]]
        ], 14), { key: key + 'neckCollar', w: 4.0 });

        // ---------------------------------------------------------------
        // LAYER 3: LEFT EXTENDED ARM, PAW & SWINGING CANDLE LANTERN
        // ---------------------------------------------------------------
        withPivot(385, 485, armLRot, 1, 1, 0, 0, () => {

          // 3A. Swinging Antique Brass Candle Lantern (Pivoted from Paw/Ring at (278, 555))
          withPivot(278, 555, lanternSwing, 1, 1, 0, 0, () => {
            // Soft Warm Radial Candlelight Halo Behind & Around Lantern
            psBlush(278, 668, 92 * flamePulse, 92 * flamePulse, LK.glowRGB, 0.38, 0);
            psBlush(278, 668, 52 * flamePulse, 58 * flamePulse, '255,242,175', 0.65, 0);

            // Top Brass Hanging Ring (x: 248..308, y: 534..584)
            const ringOuterP = ellipsePts(278, 558, 28, 24, 0, 24);
            const ringInnerP = ellipsePts(278, 558, 17, 14, 0, 20);
            const QROut = wobble(ringOuterP, true, 0.8, key + 'rngO', 5);
            const QRIn = wobble(ringInnerP, true, 0.8, key + 'rngI', 5);
            ctx.save();
            ctx.beginPath();
            trace(QROut, true);
            ctx.moveTo(QRIn[0][0], QRIn[0][1]);
            for (let i = 1; i < QRIn.length; i++) ctx.lineTo(QRIn[i][0], QRIn[i][1]);
            ctx.closePath();
            ctx.fillStyle = LK.brassMain;
            ctx.fill('evenodd');
            ctx.restore();
            lkLine(ringOuterP, { closed: true, key: key + 'rngOL', w: 3.6 });
            lkLine(ringInnerP, { closed: true, key: key + 'rngIL', w: 3.2 });

            // Lantern Top Cap Neck & 2-Tiered Dome Hood (x: 234..322, y: 576..632)
            lkShape(bezierPts([
              [[264, 580], [278, 576], [292, 580], [294, 592]],
              [[294, 592], [278, 594], [262, 592], [264, 580]]
            ], 10), LK.brassDark, { key: key + 'lanNeck', w: 3.4 });

            const domeUpperP = bezierPts([
              [[246, 614], [252, 592], [264, 586], [278, 586]],
              [[278, 586], [292, 586], [304, 592], [310, 614]],
              [[310, 614], [294, 618], [262, 618], [246, 614]]
            ], 12);
            lkShape(domeUpperP, LK.brassMain, {
              key: key + 'lanDome1', w: 3.6,
              grad: (bb) => {
                const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
                g.addColorStop(0, LK.brassLight);
                g.addColorStop(0.5, LK.brassMain);
                g.addColorStop(1, LK.brassDark);
                ctx.fillStyle = g;
                ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
              }
            });

            const domeBrimP = bezierPts([
              [[234, 624], [244, 612], [262, 610], [278, 610]],
              [[278, 610], [294, 610], [312, 612], [322, 624]],
              [[322, 624], [324, 632], [302, 634], [278, 634]],
              [[278, 634], [254, 634], [232, 632], [234, 624]]
            ], 14);
            lkShape(domeBrimP, LK.brassMain, { key: key + 'lanBrim', w: 3.6 });

            // Glass Globe Chamber & Glowing Candle Inside (x: 242..314, y: 632..708)
            const glassP = bezierPts([
              [[248, 632], [238, 662], [238, 690], [248, 706]],
              [[248, 706], [264, 710], [292, 710], [308, 706]],
              [[308, 706], [318, 690], [318, 662], [308, 632]],
              [[308, 632], [292, 634], [264, 634], [248, 632]]
            ], 14);
            lkShape(glassP, '#fff6d8', {
              key: key + 'lanGlass', w: 3.4, fillA: 0.78,
              innerFn: () => {
                // Warm inner radial glow
                psBlush(278, 668, 40, 44, '255,205,95', 0.55, 0);

                // White Wax Candle Cylinder (x: 266..291, y: 678..706) with melting wax drip!
                const candleP = bezierPts([
                  [[266, 680], [278, 677], [290, 680], [290, 706]],
                  [[290, 706], [278, 708], [266, 706], [266, 680]]
                ], 10);
                lkShape(candleP, LK.candleWax, { key: key + 'wax', w: 2.8, crayon: LK.candleShade, crAl: 0.2 });
                // Little wax drip on front of candle
                lkLine(bezierPts([[[272, 681], [274, 690], [278, 690], [280, 682]]], 8), { key: key + 'drip', w: 2.2, second: false });

                // Candle Wick
                lkLine([[278, 678], [278, 671]], { key: key + 'wick', w: 2.2, second: false });

                // Teardrop Candle Flame (Scaled with flamePulse!)
                withPivot(278, 670, isStatic ? 0 : Math.sin(t * TAU * 2) * 0.08, flamePulse, flamePulse, 0, 0, () => {
                  const flameP = bezierPts([
                    [[278, 646], [286, 656], [287, 668], [278, 672]],
                    [[278, 672], [269, 668], [270, 656], [278, 646]]
                  ], 12);
                  lkShape(flameP, LK.flameOuter, {
                    key: key + 'flame', w: 2.4, line: '#b57428', second: false,
                    innerFn: () => {
                      lkShape(ellipsePts(278, 663, 4.5, 7.5, 0, 12), LK.flameCore, { key: key + 'flCore', line: false });
                    }
                  });
                });
              }
            });

            // Curved Outer Brass Cage Guard Struts (Left & Right)
            const strutLP = bezierPts([
              [[242, 631], [226, 662], [226, 692], [244, 712]],
              [[244, 712], [250, 708], [250, 704], [248, 702]],
              [[248, 702], [236, 688], [236, 662], [248, 633]]
            ], 12);
            lkShape(strutLP, LK.brassMain, { key: key + 'strutL', w: 3.2 });

            const strutRP = bezierPts([
              [[314, 631], [330, 662], [330, 692], [312, 712]],
              [[312, 712], [306, 708], [306, 704], [308, 702]],
              [[308, 702], [320, 688], [320, 662], [308, 633]]
            ], 12);
            lkShape(strutRP, LK.brassMain, { key: key + 'strutR', w: 3.2 });

            // Tiered Brass Lantern Base Pedestal (x: 238..318, y: 704..734)
            const baseTopP = bezierPts([
              [[244, 704], [278, 700], [312, 704], [315, 716]],
              [[315, 716], [278, 720], [241, 716], [244, 704]]
            ], 12);
            lkShape(baseTopP, LK.brassMain, { key: key + 'lanBase1', w: 3.4 });

            const baseBotP = bezierPts([
              [[238, 716], [278, 714], [318, 716], [318, 728]],
              [[318, 728], [298, 734], [258, 734], [238, 728]],
              [[238, 728], [237, 722], [237, 718], [238, 716]]
            ], 12);
            lkShape(baseBotP, LK.brassDark, { key: key + 'lanBase2', w: 3.6 });
          });

          // 3B. Left Striped Sleeve Extending Out to Hold Lantern (x: 266..395, y: 452..578)
          const sleeveLP = bezierPts([
            [[392, 448], [362, 452], [342, 475], [318, 482]],
            [[318, 482], [295, 482], [272, 488], [268, 512]],
            [[268, 512], [265, 542], [285, 575], [308, 574]],
            [[308, 574], [328, 572], [348, 558], [368, 554]]
          ], 16);

          lkShape(sleeveLP, LK.gownCream, {
            key: key + 'slvLBase', line: false, crayon: LK.gownShade, crAl: 0.16,
            innerFn: () => {
              const slvLStripes = [
                [
                  [[284, 486], [304, 515], [306, 548], [296, 572]],
                  [[296, 572], [308, 574], [316, 572], [322, 568]],
                  [[322, 568], [325, 540], [322, 508], [304, 482]]
                ],
                [
                  [[322, 482], [336, 508], [340, 538], [335, 564]],
                  [[335, 564], [345, 560], [354, 556], [360, 554]],
                  [[360, 554], [362, 528], [356, 496], [340, 474]]
                ],
                [
                  [[352, 464], [368, 492], [375, 525], [372, 552]],
                  [[372, 552], [382, 548], [388, 544], [392, 538]],
                  [[392, 538], [392, 508], [385, 476], [370, 452]]
                ]
              ];
              for (let i = 0; i < slvLStripes.length; i++) {
                drawPeriwinkleStripe(bezierPts(slvLStripes[i], 12), key + 'sLStr' + i, -0.8);
              }
            }
          });

          // Dark Left Sleeve Cuff Opening Behind Left Paw
          lkShape(ellipsePts(288, 534, 22, 32, -0.15, 18), LK.cavityDark, { key: key + 'cuffCavL', w: 3.6 });

          // Sleeve Outline (Open-Contour at Shoulder!)
          lkLine(bezierPts([
            [[392, 448], [362, 452], [342, 475], [318, 482]],
            [[318, 482], [295, 482], [272, 488], [268, 512]],
            [[268, 512], [265, 542], [285, 575], [308, 574]],
            [[308, 574], [328, 572], [348, 558], [362, 554]]
          ], 16), { key: key + 'slvLOut', w: 4.0 });

          // 3C. Plump 4-Fingered Left Paw Gripping the Lantern Ring (x: 245..312, y: 494..556)
          const pawLP = bezierPts([
            [[256, 502], [244, 516], [246, 542], [260, 548]],
            [[260, 548], [268, 556], [282, 556], [290, 548]],
            [[290, 548], [302, 554], [312, 542], [310, 522]],
            [[310, 522], [306, 504], [280, 492], [256, 502]]
          ], 14);
          lkShape(pawLP, LK.furMain, {
            key: key + 'pawL', w: 3.8, crayon: LK.furShade, crAl: 0.2,
            innerFn: () => {
              psBlush(282, 512, 26, 16, '255,250,235', 0.75, 0);
            }
          });
          lkLine(bezierPts([[[264, 526], [263, 538], [264, 546], [266, 550]]], 8), { key: key + 'pLT1', w: 2.8, second: false });
          lkLine(bezierPts([[[280, 526], [280, 538], [281, 546], [282, 550]]], 8), { key: key + 'pLT2', w: 2.8, second: false });
          lkLine(bezierPts([[[295, 524], [295, 536], [296, 544], [296, 548]]], 8), { key: key + 'pLT3', w: 2.8, second: false });
        });

        // ---------------------------------------------------------------
        // LAYER 4: RIGHT BENT STRIPED SLEEVE & COZY PAW ON BELLY
        // ---------------------------------------------------------------
        withPivot(615, 485, armRRot, 1, 1, 0, 0, () => {
          const sleeveRP = bezierPts([
            [[618, 448], [652, 462], [685, 504], [692, 560]],
            [[692, 560], [696, 612], [662, 662], [612, 672]],
            [[612, 672], [588, 675], [575, 658], [562, 625]],
            [[562, 625], [546, 595], [548, 575], [572, 568]],
            [[572, 568], [588, 542], [586, 505], [618, 448]]
          ], 16);

          lkShape(sleeveRP, LK.gownCream, {
            key: key + 'slvRBase', line: false, crayon: LK.gownShade, crAl: 0.18,
            innerFn: () => {
              const slvRStripes = [
                [
                  [[612, 456], [635, 476], [656, 502], [664, 522]],
                  [[664, 522], [652, 534], [632, 522], [596, 488]]
                ],
                [
                  [[592, 515], [628, 536], [662, 560], [688, 582]],
                  [[688, 582], [682, 604], [652, 588], [588, 542]]
                ],
                [
                  [[582, 560], [622, 582], [656, 612], [674, 636]],
                  [[674, 636], [656, 654], [628, 632], [572, 582]]
                ]
              ];
              for (let i = 0; i < slvRStripes.length; i++) {
                drawPeriwinkleStripe(bezierPts(slvRStripes[i], 12), key + 'sRStr' + i, -0.45);
              }
              psBlush(625, 645, 48, 22, '145,132,112', 0.35, -0.3);
            }
          });

          // Right Cuff Inner Fold & Cozy Right Paw Resting on Belly (x: 530..596, y: 585..658)
          const cuffFoldRP = bezierPts([
            [[546, 586], [568, 578], [595, 608], [602, 642]],
            [[602, 642], [604, 664], [588, 672], [576, 660]],
            [[576, 660], [562, 635], [548, 605], [546, 586]]
          ], 12);
          lkShape(cuffFoldRP, LK.gownCream, {
            key: key + 'cuffR', w: 3.8, crayon: LK.gownShade, crAl: 0.22
          });

          const pawRP = bezierPts([
            [[556, 592], [538, 596], [528, 614], [534, 630]],
            [[534, 630], [536, 648], [554, 658], [576, 655]],
            [[576, 655], [592, 652], [596, 634], [588, 614]],
            [[588, 614], [578, 598], [566, 592], [556, 592]]
          ], 14);
          lkShape(pawRP, LK.furMain, {
            key: key + 'pawR', w: 3.8, crayon: LK.furShade, crAl: 0.2
          });
          lkLine(bezierPts([[[533, 622], [544, 620], [552, 622], [556, 625]]], 8), { key: key + 'pRT1', w: 2.8, second: false });
          lkLine(bezierPts([[[536, 638], [546, 636], [554, 638], [558, 640]]], 8), { key: key + 'pRT2', w: 2.8, second: false });

          // Right Sleeve Outer Contour + Elbow Fold Creases
          lkLine(bezierPts([
            [[618, 448], [652, 462], [685, 504], [692, 560]],
            [[692, 560], [696, 612], [662, 662], [612, 672]],
            [[612, 672], [594, 674], [584, 666], [578, 656]]
          ], 16), { key: key + 'slvROut', w: 4.0 });

          lkLine(bezierPts([[[596, 488], [588, 525], [584, 554], [572, 574]]], 12), { key: key + 'slvRIn', w: 3.6 });
          lkLine(bezierPts([[[574, 542], [592, 554], [608, 564], [618, 568]]], 10), { key: key + 'elbCr1', w: 2.8, second: false });
        });

        // ---------------------------------------------------------------
        // LAYER 5..10: PLUMP MOCHI KITTEN HEAD, EARS, FACIAL FEATURES & STRIPED NIGHTCAP
        // ---------------------------------------------------------------
        withPivot(502, 445, headTilt, 1, 1, headDX, headDY, () => {

          // 5A. Left Pointed Kitten Ear (Pivoted at (368, 235), with Peach Inner Ear & Tuft Lines)
          withPivot(368, 235, earLRot, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[348, 276], [336, 236], [332, 194], [344, 178]],
              [[344, 178], [358, 170], [396, 184], [428, 210]],
              [[428, 210], [398, 245], [372, 265], [348, 276]]
            ], 14);
            lkShape(earLP, LK.furMain, {
              key: key + 'earL', line: false, crayon: LK.furShade, crAl: 0.16,
              innerFn: () => {
                const earInP = bezierPts([
                  [[356, 258], [348, 228], [348, 200], [356, 194]],
                  [[356, 194], [368, 192], [392, 208], [404, 224]],
                  [[404, 224], [385, 242], [368, 252], [356, 258]]
                ], 12);
                lkShape(earInP, LK.earPink, {
                  key: key + 'earInL', line: false, crayon: LK.earPinkShade, crAl: 0.25
                });
                // Delicate inner ear fur tuft strokes
                lkLine([[365, 244], [384, 230]], { key: key + 'eTuft1', w: 2.0, col: LK.inkSoft, second: false });
                lkLine([[362, 254], [380, 242]], { key: key + 'eTuft2', w: 2.0, col: LK.inkSoft, second: false });
                lkLine([[368, 202], [388, 216]], { key: key + 'eRimIn', w: 2.2, col: LK.inkSoft, second: false });
              }
            });
            // Open-contour outer ear line (seamless join into head cheek & crown!)
            lkLine(bezierPts([
              [[348, 276], [336, 236], [332, 194], [344, 178]],
              [[344, 178], [358, 170], [396, 184], [425, 206]]
            ], 14), { key: key + 'earLOut', w: 4.2 });
          });

          // 5B. Plump Mochi Kitten Head Base (x: 328..676, y: 190..484)
          const headP = bezierPts([
            [[405, 196], [475, 186], [568, 212], [638, 285]],
            [[638, 285], [678, 338], [682, 398], [648, 442]],
            [[648, 442], [612, 478], [552, 488], [496, 486]],
            [[496, 486], [435, 484], [368, 456], [340, 412]],
            [[340, 412], [322, 368], [330, 315], [350, 274]],
            [[350, 274], [368, 235], [385, 208], [405, 196]]
          ], 20);

          lkShape(headP, LK.furMain, {
            key: key + 'headBase', line: false, crayon: LK.furShade, crAl: 0.16,
            grad: (bb) => {
              const g = ctx.createRadialGradient(485, 335, 20, 495, 355, 195);
              g.addColorStop(0, LK.furLight);
              g.addColorStop(0.68, LK.furMain);
              g.addColorStop(1, LK.furWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Soft snowy-white round muzzle glow around nose & mouth
              const muzP = ellipsePts(482, 405, 64, 48, 0, 28);
              lkShape(muzP, LK.muzzle, { key: key + 'muzHalo', line: false, fillA: 0.88 });
              psBlush(482, 405, 72, 54, '255,253,246', 0.85, 0);

              // Subtle lower chin & neck warm shading
              psBlush(498, 475, 115, 24, '215,186,138', 0.55, 0);

              // Delicate vertical forehead & nose-bridge fur texture ticks
              const fhTicks = [
                [[456, 258], [459, 282]],
                [[468, 252], [470, 280]],
                [[482, 260], [481, 284]],
                [[495, 264], [492, 282]],
                [[508, 270], [504, 284]]
              ];
              for (let i = 0; i < fhTicks.length; i++) {
                lkLine(fhTicks[i], { key: key + 'fhT' + i, w: 1.7, col: LK.inkLight, second: false });
              }

              // Subtle nose-bridge fur ticks just above nose
              const nbTicks = [
                [[466, 352], [464, 360]],
                [[474, 350], [473, 359]],
                [[482, 351], [481, 359]],
                [[490, 353], [488, 360]]
              ];
              for (let i = 0; i < nbTicks.length; i++) {
                lkLine(nbTicks[i], { key: key + 'nbT' + i, w: 1.6, col: LK.inkLight, second: false });
              }
            }
          });

          // Left & Right Cheek/Jaw Contour Lines (Open-Contour at Ear & Nightcap!)
          lkLine(bezierPts([
            [[350, 274], [330, 315], [322, 368], [340, 412]],
            [[340, 412], [368, 456], [435, 484], [496, 486]],
            [[496, 486], [552, 488], [612, 478], [648, 442]],
            [[648, 442], [676, 405], [678, 365], [665, 332]]
          ], 18), { key: key + 'jawLine', w: 4.2 });

          // 5C. Rosy-Coral Cheek Blushes + 4 Diagonal Colored-Pencil Hatch Ticks per Cheek
          psBlush(388, 392, 38, 25, LK.blush, blushAlpha, 0.05);
          psBlush(576, 396, 38, 25, LK.blush, blushAlpha, -0.05);

          for (let i = 0; i < 4; i++) {
            const lx = 368 + i * 9;
            const ly = 388 + (i % 2) * 2;
            lkLine([[lx, ly + 6], [lx + 7, ly - 5]], { key: key + 'chL' + i, w: 2.0, col: LK.blushTick, second: false });

            const rx = 556 + i * 9;
            const ry = 392 + (i % 2) * 2;
            lkLine([[rx, ry + 6], [rx + 7, ry - 5]], { key: key + 'chR' + i, w: 2.0, col: LK.blushTick, second: false });
          }

          // 5D. 3-Stage Deforming Eyelid Blink for Left & Right Espresso Oval Eyes (No scaleY squashing!)
          const drawKittenEye = (ex, ey, erx, ery, eKey) => {
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 8, clipTop, (erx + 8) * 2, ery * 2.5);
              ctx.clip();

              const eyeP = ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 22);
              lkShape(eyeP, LK.eye, { key: key + eKey, w: 2.2, line: LK.eye, second: false });

              // Subtle warm specular glint
              ctx.fillStyle = 'rgba(255,248,235,0.78)';
              ctx.beginPath();
              ctx.ellipse(ex + gazeX - erx * 0.28, ey + gazeY - ery * 0.28, 2.8, 3.4, -0.2, 0, TAU);
              ctx.fill();
              ctx.restore();
            }
            if (u > 0.12) {
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 9;
              lkLine(bezierPts([
                [[ex - erx - 3, ey + u * 2], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 2]]
              ], 10), { key: key + eKey + 'Lid', w: 3.8, col: LK.eye, second: false });
            }
          };

          drawKittenEye(424, 355, 14.5, 16.0, 'kEyeL');
          drawKittenEye(544, 360, 14.5, 16.0, 'kEyeR');

          // 5E. Sweet Pink Triangular Nose & Inverted-Y ('ㅅ') Kitten Mouth
          const noseP = bezierPts([
            [[478, 372], [490, 372], [492, 378], [484, 386]],
            [[484, 386], [480, 390], [476, 390], [472, 386]],
            [[472, 386], [464, 378], [466, 372], [478, 372]]
          ], 12);
          lkShape(noseP, LK.nose, { key: key + 'nose', w: 2.8, line: LK.eye, second: false });

          // Philtrum & inverted-Y mouth
          const lipDrop = isStatic ? 0 : Math.max(0, rig.mouthOpen * 8);
          lkLine([[478, 389], [478, 398]], { key: key + 'phil', w: 3.2, col: LK.eye, second: false });
          lkLine(bezierPts([[[478, 397], [474, 402], [471, 406], [469, 408 + lipDrop]]], 8), { key: key + 'mthL', w: 3.2, col: LK.eye, second: false });
          lkLine(bezierPts([[[478, 397], [483, 402], [486, 406], [488, 408 + lipDrop]]], 8), { key: key + 'mthR', w: 3.2, col: LK.eye, second: false });

          // 5F. 6 Delicate Whiskers (3 on Left Cheek, 3 on Right Cheek)
          withPivot(345, 392, whiskerTwitch, 1, 1, 0, 0, () => {
            lkLine(bezierPts([[[345, 380], [326, 378], [312, 379], [302, 382]]], 8), { key: key + 'whL1', w: 2.2, col: LK.ink, second: false });
            lkLine(bezierPts([[[342, 392], [324, 394], [312, 398], [304, 402]]], 8), { key: key + 'whL2', w: 2.2, col: LK.ink, second: false });
            lkLine(bezierPts([[[346, 404], [330, 410], [318, 416], [310, 422]]], 8), { key: key + 'whL3', w: 2.2, col: LK.ink, second: false });
          });

          withPivot(605, 398, -whiskerTwitch, 1, 1, 0, 0, () => {
            lkLine(bezierPts([[[600, 386], [616, 382], [628, 380], [636, 380]]], 8), { key: key + 'whR1', w: 2.2, col: LK.ink, second: false });
            lkLine(bezierPts([[[602, 398], [618, 398], [628, 400], [635, 402]]], 8), { key: key + 'whR2', w: 2.2, col: LK.ink, second: false });
            lkLine(bezierPts([[[598, 410], [614, 414], [624, 418], [632, 422]]], 8), { key: key + 'whR3', w: 2.2, col: LK.ink, second: false });
          });

          // -------------------------------------------------------------
          // LAYER 6: 2-PART STRIPED SLEEPY NIGHTCAP (CROWN BRIM + SWAYING DROOPING TAIL)
          // -------------------------------------------------------------
          // 6A. Drooping Right Tail of the Nightcap (Pivoted at (678, 225) for Phase-Lagged Pendulum Sway!)
          withPivot(678, 225, capTailRot, 1, 1, 0, 0, () => {
            const capTailP = bezierPts([
              [[555, 114], [622, 114], [685, 165], [728, 240]],
              [[728, 240], [755, 295], [748, 340], [735, 392]],
              [[735, 392], [726, 434], [738, 476], [734, 498]],
              [[734, 498], [730, 512], [718, 512], [712, 494]],
              [[712, 494], [706, 474], [708, 456], [696, 424]],
              [[696, 424], [684, 392], [682, 368], [674, 342]],
              [[674, 342], [660, 295], [610, 215], [555, 114]]
            ], 18);

            lkShape(capTailP, LK.gownCream, {
              key: key + 'capTail', line: false, crayon: LK.gownShade, crAl: 0.18,
              innerFn: () => {
                // Longitudinal periwinkle stripes flowing down into the pointed tip!
                const tailStripes = [
                  [
                    [[585, 122], [652, 165], [708, 250], [722, 338]],
                    [[722, 338], [714, 398], [718, 458], [722, 505]],
                    [[722, 505], [734, 502], [736, 465], [730, 398]],
                    [[730, 398], [742, 332], [732, 242], [662, 148]]
                  ],
                  [
                    [[625, 195], [678, 265], [695, 335], [696, 405]],
                    [[696, 405], [708, 450], [712, 482], [716, 498]],
                    [[716, 498], [708, 488], [696, 445], [684, 395]],
                    [[684, 395], [674, 342], [658, 280], [608, 212]]
                  ]
                ];
                for (let i = 0; i < tailStripes.length; i++) {
                  drawPeriwinkleStripe(bezierPts(tailStripes[i], 14), key + 'cTStr' + i, -1.2);
                }
              }
            });

            lkLine(bezierPts([
              [[565, 114], [625, 116], [685, 165], [728, 240]],
              [[728, 240], [755, 295], [748, 340], [735, 392]],
              [[735, 392], [726, 434], [738, 476], [734, 498]],
              [[734, 498], [730, 512], [718, 512], [712, 494]],
              [[712, 494], [706, 474], [708, 456], [696, 424]],
              [[696, 424], [684, 392], [682, 368], [676, 346]]
            ], 18), { key: key + 'capTailOut', w: 4.0 });
          });

          // 6B. Main Nightcap Crown Dome & Rolled Striped Brim Band (x: 396..692, y: 112..365)
          const capCrownP = bezierPts([
            [[432, 165], [478, 122], [532, 110], [585, 116]],
            [[585, 116], [638, 128], [678, 178], [694, 242]],
            [[694, 242], [696, 278], [692, 315], [682, 348]],
            [[682, 348], [648, 285], [568, 215], [405, 188]],
            [[405, 188], [412, 174], [422, 168], [432, 165]]
          ], 16);

          lkShape(capCrownP, LK.gownCream, {
            key: key + 'capCrown', line: false, crayon: LK.gownShade, crAl: 0.18,
            innerFn: () => {
              const crownStripes = [
                [
                  [[445, 162], [488, 132], [534, 118], [568, 114]],
                  [[568, 114], [545, 112], [495, 118], [432, 155]]
                ],
                [
                  [[475, 182], [525, 145], [575, 126], [615, 126]],
                  [[615, 126], [635, 135], [595, 152], [505, 198]]
                ],
                [
                  [[535, 212], [585, 172], [632, 152], [662, 156]],
                  [[662, 156], [674, 172], [632, 194], [565, 232]]
                ],
                [
                  [[595, 255], [638, 218], [672, 198], [688, 204]],
                  [[688, 204], [694, 224], [662, 246], [618, 278]]
                ],
                [
                  [[642, 302], [672, 272], [690, 258], [696, 268]],
                  [[696, 268], [694, 292], [675, 312], [656, 326]]
                ]
              ];
              for (let i = 0; i < crownStripes.length; i++) {
                drawPeriwinkleStripe(bezierPts(crownStripes[i], 12), key + 'cCStr' + i, -0.65);
              }
            }
          });

          // Rolled Front Headband Brim of the Nightcap (Diagonal Stripes Across Forehead!)
          const capBrimP = bezierPts([
            [[398, 186], [420, 158], [488, 168], [572, 218]],
            [[572, 218], [642, 262], [688, 316], [685, 355]],
            [[685, 355], [678, 368], [666, 364], [655, 345]],
            [[655, 345], [618, 292], [545, 236], [462, 205]],
            [[462, 205], [428, 194], [408, 192], [398, 186]]
          ], 16);

          lkShape(capBrimP, LK.gownCream, {
            key: key + 'capBrim', line: false, crayon: LK.gownShade, crAl: 0.18,
            innerFn: () => {
              const brimStripes = [
                [
                  [[412, 192], [435, 166], [455, 166], [435, 198]]
                ],
                [
                  [[458, 204], [485, 174], [512, 182], [484, 215]]
                ],
                [
                  [[508, 224], [538, 196], [565, 210], [534, 240]]
                ],
                [
                  [[558, 250], [588, 226], [614, 244], [582, 270]]
                ],
                [
                  [[605, 284], [635, 262], [656, 282], [626, 308]]
                ],
                [
                  [[644, 324], [672, 304], [686, 326], [660, 348]]
                ]
              ];
              for (let i = 0; i < brimStripes.length; i++) {
                const sPts = bezierPts([
                  [brimStripes[i][0][0], brimStripes[i][0][1], brimStripes[i][0][2], brimStripes[i][0][2]],
                  [brimStripes[i][0][2], brimStripes[i][0][3], brimStripes[i][0][0], brimStripes[i][0][0]]
                ], 8);
                drawPeriwinkleStripe(sPts, key + 'cBStr' + i, -0.95);
              }
              psBlush(555, 255, 125, 22, '135,120,102', 0.25, 0.55);
            }
          });

          // Nightcap Brim & Crown Colored-Pencil Outlines
          lkLine(bezierPts([
            [[398, 186], [408, 192], [428, 194], [462, 205]],
            [[462, 205], [545, 236], [618, 292], [655, 345]],
            [[655, 345], [666, 364], [678, 368], [685, 355]],
            [[685, 355], [688, 316], [642, 262], [572, 218]],
            [[572, 218], [488, 168], [420, 158], [398, 186]]
          ], 16), { key: key + 'capBrimOut', w: 4.0 });

          lkLine(bezierPts([
            [[430, 164], [478, 122], [532, 110], [585, 116]]
          ], 14), { key: key + 'capTopOut', w: 4.0 });

        }); // end head hierarchy
      }); // end torso hierarchy

      ctx.restore();
    }

    // =========================================================================
    // 5C. 16:9 STORYBOOK MEADOW PICNIC LANDSCAPE BACKGROUND (1600×900 ENGINE C)
    // =========================================================================
    const MBG = {
      skyTop: '#fbf4de',         // Warm sunlit cream-butter sky top
      skyBot: '#fdf9ec',         // Soft ivory horizon glow
      cloudFill: '#fffdf7',      // Puffy storybook cloud fill
      cloudShade: '#f0e6d2',     // Subtle warm cloud under-rim
      cloudLine: '#9e8c78',      // Delicate taupe-grey cloud pencil outline

      ink: '#584738',            // Warm umber-sepia colored-pencil outline
      inkSoft: '#87725e',        // Soft secondary pencil pass
      inkLight: '#a6927d',       // Distant horizon & grass tick line

      hillRose: '#f2d8c9',       // Distant peach-rose mountain wash
      hillLav: '#e8d5cb',        // Soft mauve-cream distant ridge
      hillCream: '#f5ebd1',      // Sunlit distant hill slope

      meadowLight: '#e8e4b5',    // Sunlit upper meadow yellow-sage
      meadowMid: '#d5d89e',      // Main soft sage-olive meadow grass
      meadowWarm: '#dfc48b',     // Warm golden-ochre earth path patches
      meadowShade: '#b7c082',    // Mid-ground grass shadow
      meadowDeep: '#94a368',     // Deep under-tree & foreground grass shadow

      treeTrunk: '#9c7e5e',      // Warm weathered oak bark
      treeTrunkLight: '#b59774', // Sunlit left bark highlight
      treeTrunkDark: '#73583e',  // Deep root & branch crevice shadow

      foliageCream: '#ede8c4',   // Sunlit top cream-sage puff highlight
      foliageLight: '#d5dbb0',   // Upper-mid soft sage foliage
      foliageMid: '#b5c294',     // Main muted sage-green oak canopy
      foliageDark: '#8fa172',    // Deep inner & lower canopy shadow

      stumpTop: '#e8cfa6',       // Cut wood top surface
      stumpBark: '#c49a6c',      // Warm caramel-oak stump bark
      stumpShade: '#9e764c',     // Stump root shadow

      clothWhite: '#fcf8f0',     // Warm ivory picnic cloth base
      clothRed: '#d95b52',       // Classic storybook gingham cherry-red
      clothRedDark: '#b33e36',   // Gingham fold shadow

      flowerWhite: '#ffffff',    // White daisy petals
      flowerYellow: '#f7d054',   // Golden buttercup petals & daisy centers
      flowerOrange: '#e09f3e',   // Buttercup center shade
      stemGreen: '#687848',      // Wildflower stems & narrow leaves
      cloverGreen: '#889e58'     // 3-leaf clover fill
    };

    function mbgLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? MBG.ink, col2: o.col2 ?? MBG.inkSoft, w: o.w ?? 2.8, amt: o.amt ?? 0.85 });
    }

    function mbgShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? MBG.ink), line2: o.line2 ?? MBG.inkSoft, w: o.w ?? 2.8, amt: o.amt ?? 0.85 });
    }

    function drawStorybookCloud(cx, cy, sx = 1, sy = 1, cKey = 'cld') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sx, sy);
      const cloudP = bezierPts([
        [[-145, 22], [-175, 22], [-185, -2], [-152, -12]],
        [[-152, -12], [-158, -38], [-115, -52], [-88, -32]],
        [[-88, -32], [-72, -68], [-8, -72], [18, -36]],
        [[18, -36], [48, -56], [98, -44], [105, -14]],
        [[105, -14], [142, -18], [168, 4], [148, 22]],
        [[148, 22], [65, 28], [-55, 28], [-145, 22]]
      ], 14);
      mbgShape(cloudP, MBG.cloudFill, {
        key: cKey, w: 2.0, line: MBG.cloudLine, line2: MBG.cloudShade, amt: 0.65,
        innerFn: () => {
          psBlush(0, 18, 145, 18, '232,216,192', 0.55, 0);
        }
      });
      // Inner fluffy cloud puff arcs
      mbgLine(bezierPts([[[-95, -8], [-78, -28], [-42, -28], [-28, -6]]], 10), { key: cKey + 'in1', w: 1.6, col: MBG.cloudLine, second: false });
      mbgLine(bezierPts([[[12, -12], [35, -30], [68, -24], [78, -4]]], 10), { key: cKey + 'in2', w: 1.6, col: MBG.cloudLine, second: false });
      ctx.restore();
    }

    function drawFoliageCluster(cx, cy, rx, ry, rot, fillMain, fillHi, fKey, breezeRot = 0) {
      withPivot(cx, cy + ry * 0.5, breezeRot, 1, 1, 0, 0, () => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        const sX = rx / 100, sY = ry / 75;
        ctx.scale(sX, sY);

        const puffP = bezierPts([
          [[-88, 28], [-112, 10], [-108, -28], [-74, -42]],
          [[-74, -42], [-62, -74], [-14, -84], [18, -62]],
          [[18, -62], [54, -82], [98, -58], [96, -20]],
          [[96, -20], [118, 4], [104, 42], [68, 48]],
          [[68, 48], [28, 66], [-32, 64], [-68, 46]],
          [[-68, 46], [-82, 42], [-86, 35], [-88, 28]]
        ], 14);

        mbgShape(puffP, fillMain, {
          key: fKey, w: 2.4 / Math.min(sX, sY), line: false, crayon: MBG.foliageDark, crAl: 0.22,
          grad: (bb) => {
            const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
            g.addColorStop(0, fillHi);
            g.addColorStop(0.58, fillMain);
            g.addColorStop(1, MBG.foliageDark);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(-18, -28, 65, 38, '248,244,218', 0.55, -0.15);
            psBlush(15, 38, 78, 32, '118,138,92', 0.45, 0.1);
          }
        });

        // Scalloped outer leaf-puff colored-pencil strokes (Open-contour segments for airy hand-drawn look)
        mbgLine(bezierPts([
          [[-88, 28], [-112, 10], [-108, -28], [-74, -42]],
          [[-74, -42], [-62, -74], [-14, -84], [18, -62]],
          [[18, -62], [54, -82], [98, -58], [96, -20]],
          [[96, -20], [118, 4], [104, 42], [68, 48]]
        ], 14), { key: fKey + 'Out1', w: 2.3 / Math.min(sX, sY), col: MBG.ink });

        mbgLine(bezierPts([
          [[48, 52], [12, 65], [-35, 62], [-68, 46]]
        ], 10), { key: fKey + 'Out2', w: 2.0 / Math.min(sX, sY), col: MBG.inkSoft });

        // Inner C-curve foliage dimples
        mbgLine(bezierPts([[[-35, -18], [-18, -34], [12, -32], [25, -14]]], 8), { key: fKey + 'In1', w: 1.8 / Math.min(sX, sY), col: MBG.inkSoft, second: false });
        mbgLine(bezierPts([[[28, 12], [45, 2], [65, 8], [72, 24]]], 8), { key: fKey + 'In2', w: 1.7 / Math.min(sX, sY), col: MBG.inkSoft, second: false });

        ctx.restore();
      });
    }

    function drawDaisyFlower(fx, fy, r, rot, sway, fKey) {
      withPivot(fx, fy + r * 2.2, sway, 1, 1, 0, 0, () => {
        // Stem
        mbgLine(bezierPts([[[fx, fy + r * 2.4], [fx - r * 0.2, fy + r * 1.2], [fx + r * 0.1, fy + r * 0.5], [fx, fy]]], 8), {
          key: fKey + 'stm', w: 2.4, col: MBG.stemGreen, second: false
        });
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(rot);
        const nPetals = 10;
        for (let i = 0; i < nPetals; i++) {
          const a = (i / nPetals) * TAU;
          ctx.save();
          ctx.rotate(a);
          const petP = ellipsePts(r * 0.62, 0, r * 0.48, r * 0.19, 0, 12);
          mbgShape(petP, MBG.flowerWhite, { key: fKey + 'p' + i, w: 1.7, line: MBG.ink, second: false, amt: 0.35 });
          ctx.restore();
        }
        mbgShape(ellipsePts(0, 0, r * 0.26, r * 0.22, 0, 12), MBG.flowerYellow, { key: fKey + 'c', w: 1.8, line: MBG.ink, second: false });
        ctx.restore();
      });
    }

    function drawButtercupFlower(fx, fy, r, rot, sway, fKey) {
      withPivot(fx, fy + r * 2.4, sway, 1, 1, 0, 0, () => {
        mbgLine(bezierPts([[[fx, fy + r * 2.5], [fx + r * 0.15, fy + r * 1.3], [fx - r * 0.1, fy + r * 0.5], [fx, fy]]], 8), {
          key: fKey + 'stm', w: 2.3, col: MBG.stemGreen, second: false
        });
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(rot);
        const cupP = bezierPts([
          [[0, r * 0.35], [-r * 0.75, r * 0.25], [-r * 0.95, -r * 0.45], [-r * 0.45, -r * 0.65]],
          [[-r * 0.45, -r * 0.65], [-r * 0.15, -r * 0.35], [-r * 0.15, -r * 0.78], [0, -r * 0.78]],
          [[0, -r * 0.78], [r * 0.18, -r * 0.78], [r * 0.2, -r * 0.35], [r * 0.48, -r * 0.65]],
          [[r * 0.48, -r * 0.65], [r * 0.95, -r * 0.45], [r * 0.75, r * 0.25], [0, r * 0.35]]
        ], 10);
        mbgShape(cupP, MBG.flowerYellow, {
          key: fKey + 'cup', w: 1.9, line: MBG.ink, second: false,
          innerFn: () => {
            psBlush(0, r * 0.1, r * 0.45, r * 0.25, '224,159,62', 0.65, 0);
          }
        });
        mbgLine([[0, r * 0.25], [-r * 0.22, -r * 0.25]], { key: fKey + 'cr1', w: 1.4, col: MBG.inkSoft, second: false });
        mbgLine([[0, r * 0.25], [r * 0.22, -r * 0.25]], { key: fKey + 'cr2', w: 1.4, col: MBG.inkSoft, second: false });
        ctx.restore();
      });
    }

    function drawCloverSprig(cx, cy, r, sway, cKey) {
      withPivot(cx, cy + r * 1.8, sway, 1, 1, 0, 0, () => {
        mbgLine([[cx, cy + r * 1.8], [cx, cy]], { key: cKey + 'st', w: 1.9, col: MBG.stemGreen, second: false });
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI * 0.5 + (i - 1) * 1.05;
          const lx = cx + Math.cos(a) * r * 0.55;
          const ly = cy + Math.sin(a) * r * 0.55;
          mbgShape(ellipsePts(lx, ly, r * 0.42, r * 0.32, a, 10), MBG.cloverGreen, {
            key: cKey + 'lf' + i, w: 1.6, line: MBG.ink, second: false
          });
        }
      });
    }

    function drawStorybookMeadowBG(targetCtx, rig = null, companionFn = null) {
      ctx = targetCtx;
      const key = 'mbg';
      const isStatic = !rig;
      const t = StudioState.t;
      const w1 = TAU / 6.0, w2 = TAU / 3.0;

      // Map rig sliders + harmonic breeze to background elements
      const windBase = isStatic ? 0 : (Math.sin(t * w1) * 0.022 + (rig.hairSwayL || 0) * 0.35 + (rig.headTilt || 0) * 0.25);
      const windFast = isStatic ? 0 : (Math.sin(t * w2 - 0.5) * 0.032 + (rig.ruffleBounce || 0) * 0.35);
      const cloudDrift = isStatic ? 0 : (Math.sin(t * w1) * 18 + (rig.headTurn || 0) * 1.5);

      ctx.save();

      // Automatically fit 1600x900 scene onto whatever canvas dimensions are active
      const cW = targetCtx.canvas ? targetCtx.canvas.width : 1600;
      const cH = targetCtx.canvas ? targetCtx.canvas.height : 900;
      if (cW !== 1600 || cH !== 900) {
        ctx.scale(cW / 1600, cH / 900);
      }

      // -----------------------------------------------------------------
      // LAYER 1: WARM SUNLIT CREAM SKY & PAPER TEXTURE (1600×900)
      // -----------------------------------------------------------------
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 520);
      skyGrad.addColorStop(0, MBG.skyTop);
      skyGrad.addColorStop(1, MBG.skyBot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1600, 900);
      pencil({ x0: 10, y0: 10, x1: 1590, y1: 500 }, { key: key + 'skyTx', c: '#e8dec5', al: 0.15, per: 1400, len: 14, a: -0.35 });

      // -----------------------------------------------------------------
      // LAYER 2: DRIFTING PUFFY STORYBOOK CLOUDS
      // -----------------------------------------------------------------
      drawStorybookCloud(335 + cloudDrift, 195, 1.18, 1.05, key + 'cld1');
      drawStorybookCloud(825 + cloudDrift * 0.7, 92, 0.92, 0.85, key + 'cld2');
      drawStorybookCloud(645 - cloudDrift * 0.5, 342, 0.58, 0.45, key + 'cld3');

      // -----------------------------------------------------------------
      // LAYER 3: DISTANT PEACH-LAVENDER MOUNTAINS & SUNLIT HORIZON HILLS
      // -----------------------------------------------------------------
      const distMountLP = bezierPts([
        [[0, 415], [140, 418], [265, 430], [340, 438]],
        [[340, 438], [412, 402], [488, 398], [585, 428]],
        [[585, 428], [645, 444], [692, 452], [740, 458]],
        [[740, 458], [740, 540], [0, 540], [0, 415]]
      ], 16);
      mbgShape(distMountLP, MBG.hillRose, {
        key: key + 'dMntL', w: 1.8, line: MBG.inkLight, second: false,
        grad: (bb) => {
          const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
          g.addColorStop(0, MBG.hillRose);
          g.addColorStop(0.55, MBG.hillLav);
          g.addColorStop(1, MBG.hillCream);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        }
      });

      // Distant right pink-cream bush ridge along horizon
      const distBushRP = bezierPts([
        [[1080, 436], [1125, 415], [1175, 412], [1225, 425]],
        [[1225, 425], [1285, 405], [1365, 408], [1445, 428]],
        [[1445, 428], [1510, 415], [1565, 418], [1600, 432]],
        [[1600, 432], [1600, 510], [1080, 510], [1080, 436]]
      ], 14);
      mbgShape(distBushRP, MBG.hillRose, { key: key + 'dBshR', w: 1.7, line: MBG.inkLight, second: false });

      // -----------------------------------------------------------------
      // LAYER 4: DISTANT LEFT TREE TRIO & MID-GROUND SAPLING DUO
      // -----------------------------------------------------------------
      const drawDistantTree = (tx, ty, trX, trY, rot, tKey) => {
        withPivot(tx, ty + trY, windBase * 0.7, 1, 1, 0, 0, () => {
          const crownP = bezierPts([
            [[tx - trX * 0.65, ty + trY * 0.65], [tx - trX * 1.05, ty + trY * 0.2], [tx - trX * 0.95, ty - trY * 0.45], [tx - trX * 0.45, ty - trY * 0.78]],
            [[tx - trX * 0.45, ty - trY * 0.78], [tx - trX * 0.1, ty - trY * 1.08], [tx + trX * 0.45, ty - trY * 0.95], [tx + trX * 0.68, ty - trY * 0.48]],
            [[tx + trX * 0.68, ty - trY * 0.48], [tx + trX * 1.02, ty - trY * 0.1], [tx + trX * 0.92, ty + trY * 0.55], [tx + trX * 0.42, ty + trY * 0.72]],
            [[tx + trX * 0.42, ty + trY * 0.72], [tx, ty + trY * 0.82], [tx - trX * 0.35, ty + trY * 0.78], [tx - trX * 0.65, ty + trY * 0.65]]
          ], 12);
          mbgShape(crownP, MBG.foliageCream, {
            key: tKey, w: 1.8, line: MBG.inkSoft, second: false,
            innerFn: () => {
              psBlush(tx - trX * 0.2, ty - trY * 0.3, trX * 0.7, trY * 0.6, '244,220,195', 0.45, 0);
              psBlush(tx + trX * 0.2, ty + trY * 0.3, trX * 0.7, trY * 0.6, '195,208,162', 0.5, 0);
            }
          });
          // Delicate trunk & Y-branches
          mbgLine([[tx, ty + trY * 1.28], [tx, ty + trY * 0.25]], { key: tKey + 'tk', w: 2.2, col: MBG.ink, second: false });
          mbgLine([[tx, ty + trY * 0.55], [tx - trX * 0.28, ty + trY * 0.25]], { key: tKey + 'b1', w: 1.6, col: MBG.inkSoft, second: false });
          mbgLine([[tx, ty + trY * 0.45], [tx + trX * 0.28, ty + trY * 0.18]], { key: tKey + 'b2', w: 1.6, col: MBG.inkSoft, second: false });
        });
      };

      drawDistantTree(116, 378, 28, 38, -0.05, key + 'dTr1');
      drawDistantTree(182, 345, 42, 58, 0.02, key + 'dTr2');
      drawDistantTree(268, 382, 28, 42, 0.06, key + 'dTr3');

      // Mid-ground small trees near center-right horizon (x: 870..940, y: 405..458)
      drawDistantTree(882, 418, 26, 22, -0.04, key + 'mTr1');
      drawDistantTree(922, 424, 22, 18, 0.05, key + 'mTr2');

      // -----------------------------------------------------------------
      // LAYER 5: ROLLING MEADOW HILLS, WATERCOLOR WASHES & EARTH PATCHES
      // -----------------------------------------------------------------
      // Mid-ground right-to-left sweeping hill
      const midHillP = bezierPts([
        [[360, 488], [620, 438], [920, 412], [1600, 436]],
        [[1600, 436], [1600, 900], [0, 900], [0, 412]],
        [[0, 412], [165, 428], [320, 462], [360, 488]]
      ], 20);

      mbgShape(midHillP, MBG.meadowMid, {
        key: key + 'meadowBase', line: false, crayon: MBG.meadowShade, crAl: 0.22, crPer: 140, crLen: 22, crA: -0.12,
        grad: (bb) => {
          const g = ctx.createLinearGradient(0, 410, 0, 900);
          g.addColorStop(0, MBG.meadowLight);
          g.addColorStop(0.45, MBG.meadowMid);
          g.addColorStop(0.82, MBG.meadowShade);
          g.addColorStop(1, MBG.meadowDeep);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        },
        innerFn: () => {
          // Warm golden-ochre & peach sunlit meadow patches
          psBlush(220, 495, 260, 68, '238,202,158', 0.65, 0.12);
          psBlush(420, 615, 320, 95, '222,192,126', 0.62, -0.08);
          psBlush(960, 520, 290, 75, '232,208,152', 0.55, -0.05);
          psBlush(1150, 725, 280, 68, '218,186,122', 0.58, -0.15);

          // Deep cool olive-sage cast shadow under the giant oak tree & stump
          psBlush(1180, 585, 360, 82, '122,138,88', 0.62, -0.04);
          psBlush(1380, 560, 240, 65, '108,125,76', 0.58, 0.05);

          // Foreground soft green depression washes
          psBlush(680, 845, 380, 75, '142,160,98', 0.52, 0);
          psBlush(150, 820, 260, 85, '135,152,92', 0.55, 0.1);
        }
      });

      // Rolling hill contour lines
      mbgLine(bezierPts([[[0, 412], [235, 436], [485, 488], [662, 528]]], 16), { key: key + 'hLineL', w: 2.2, col: MBG.inkSoft, second: false });
      mbgLine(bezierPts([[[512, 466], [785, 422], [1120, 418], [1600, 438]]], 16), { key: key + 'hLineR', w: 2.2, col: MBG.inkSoft, second: false });
      mbgLine(bezierPts([[[585, 556], [725, 532], [845, 515], [965, 504]]], 12), { key: key + 'hLineM', w: 1.8, col: MBG.inkLight, second: false });

      // Scattered mid-ground grass tufts & tiny white/yellow distant meadow dots
      const grassTufts = [
        [92, 548], [135, 542], [448, 532], [608, 558], [768, 518], [825, 622],
        [912, 568], [1005, 765], [1345, 622], [1482, 598], [1518, 495], [532, 748]
      ];
      for (let i = 0; i < grassTufts.length; i++) {
        const [gx, gy] = grassTufts[i];
        mbgLine([[gx - 6, gy], [gx - 2, gy - 11]], { key: key + 'gtA' + i, w: 1.8, col: MBG.inkSoft, second: false });
        mbgLine([[gx, gy], [gx + 3, gy - 13]], { key: key + 'gtB' + i, w: 1.8, col: MBG.inkSoft, second: false });
        mbgLine([[gx + 6, gy], [gx + 9, gy - 9]], { key: key + 'gtC' + i, w: 1.8, col: MBG.inkSoft, second: false });
      }

      // Tiny distant white & yellow blossom specks across mid-ground
      const midSpecks = [
        [152, 622, '#ffffff'], [188, 636, '#ffffff'], [216, 618, '#ffffff'], [242, 624, '#ffffff'],
        [458, 682, '#ffffff'], [478, 690, '#ffffff'], [495, 678, '#ffffff'], [518, 694, '#ffffff'],
        [785, 548, '#ffffff'], [802, 555, '#ffffff'], [918, 645, '#ffffff'], [948, 652, '#ffffff'],
        [1082, 755, '#ffffff'], [1112, 768, '#ffffff'], [1142, 752, '#ffffff'], [1225, 745, '#ffffff']
      ];
      for (let i = 0; i < midSpecks.length; i++) {
        const [sx, sy, scol] = midSpecks[i];
        mbgShape(ellipsePts(sx, sy, 5.5, 4.0, 0, 8), scol, { key: key + 'sp' + i, w: 1.2, line: MBG.inkSoft, second: false });
      }

      // -----------------------------------------------------------------
      // LAYER 6: ANCIENT OAK TREE TRUNK, GNARLED ROOTS & CANOPY BRANCHES
      // -----------------------------------------------------------------
      const trunkP = bezierPts([
        [[1292, 412], [1302, 465], [1295, 508], [1268, 535]],
        [[1268, 535], [1312, 542], [1345, 548], [1382, 558]],
        [[1382, 558], [1418, 548], [1448, 552], [1478, 560]],
        [[1478, 560], [1495, 548], [1512, 546], [1530, 548]],
        [[1530, 548], [1482, 512], [1452, 468], [1442, 405]],
        [[1442, 405], [1395, 402], [1345, 405], [1292, 412]]
      ], 16);

      mbgShape(trunkP, MBG.treeTrunk, {
        key: key + 'oakTrunk', line: false, crayon: MBG.treeTrunkDark, crAl: 0.26, crA: -1.35,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
          g.addColorStop(0, MBG.treeTrunkLight);
          g.addColorStop(0.55, MBG.treeTrunk);
          g.addColorStop(1, MBG.treeTrunkDark);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        }
      });

      // Upper spreading oak branches reaching into the canopy
      const branches = [
        // Left horizontal bough
        [[[1315, 368], [1235, 345], [1165, 338], [1115, 342]], [[1115, 342], [1165, 315], [1245, 318], [1325, 342]]],
        // Upper-left main fork
        [[[1285, 318], [1235, 255], [1195, 198], [1165, 162]], [[1165, 162], [1205, 158], [1255, 218], [1325, 295]]],
        // Center-right thick fork
        [[[1335, 315], [1365, 245], [1398, 195], [1435, 155]], [[1435, 155], [1468, 168], [1425, 238], [1385, 325]]],
        // Far right lower branch
        [[[1415, 345], [1468, 305], [1518, 282], [1565, 275]], [[1565, 275], [1572, 302], [1515, 328], [1432, 375]]]
      ];
      for (let i = 0; i < branches.length; i++) {
        mbgShape(bezierPts(branches[i], 12), MBG.treeTrunk, {
          key: key + 'oakBr' + i, w: 2.6, line: MBG.ink, crayon: MBG.treeTrunkDark, crAl: 0.25
        });
      }

      // Trunk outer contour & bark vertical grain lines
      mbgLine(bezierPts([[[1292, 412], [1302, 465], [1295, 508], [1268, 535]]], 12), { key: key + 'tkOutL', w: 3.0 });
      mbgLine(bezierPts([[[1442, 405], [1452, 468], [1482, 512], [1530, 548]]], 12), { key: key + 'tkOutR', w: 3.0 });
      mbgLine(bezierPts([[[1338, 422], [1345, 472], [1338, 515], [1318, 542]]], 10), { key: key + 'bkL1', w: 2.0, col: MBG.inkSoft, second: false });
      mbgLine(bezierPts([[[1382, 418], [1388, 478], [1402, 522], [1438, 554]]], 10), { key: key + 'bkL2', w: 2.2, col: MBG.ink, second: false });
      mbgLine(bezierPts([[[1415, 425], [1426, 475], [1448, 518], [1478, 558]]], 10), { key: key + 'bkL3', w: 2.0, col: MBG.inkSoft, second: false });

      // -----------------------------------------------------------------
      // LAYER 7: LUSH TWO-TONE OAK FOLIAGE CANOPY (Back & Mid-Layer Puffs)
      // -----------------------------------------------------------------
      // Deep inner shadow foliage mass behind branches
      drawFoliageCluster(1180, 285, 195, 115, -0.08, MBG.foliageDark, MBG.foliageMid, key + 'folBg1', windBase * 0.5);
      drawFoliageCluster(1465, 245, 175, 120, 0.06, MBG.foliageDark, MBG.foliageMid, key + 'folBg2', windBase * 0.5);

      // Mid & Foreground Fluffy Storybook Foliage Clusters
      drawFoliageCluster(965, 295, 165, 105, -0.12, MBG.foliageMid, MBG.foliageCream, key + 'fol1', windBase * 0.85);
      drawFoliageCluster(1055, 125, 185, 118, -0.05, MBG.foliageLight, MBG.foliageCream, key + 'fol2', windBase * 0.95);
      drawFoliageCluster(1285, 78, 175, 108, 0.04, MBG.foliageLight, MBG.foliageCream, key + 'fol3', windBase * 1.0);
      drawFoliageCluster(1505, 82, 165, 112, 0.08, MBG.foliageLight, MBG.foliageCream, key + 'fol4', windBase * 0.9);
      drawFoliageCluster(1535, 255, 145, 98, 0.10, MBG.foliageMid, MBG.foliageLight, key + 'fol5', windBase * 0.8);
      drawFoliageCluster(1045, 298, 155, 96, -0.06, MBG.foliageLight, MBG.foliageCream, key + 'fol6', windBase * 1.05);
      drawFoliageCluster(1395, 348, 152, 86, 0.04, MBG.foliageLight, MBG.foliageCream, key + 'fol7', windBase * 0.92);

      // -----------------------------------------------------------------
      // LAYER 8: WOODEN TREE STUMP PICNIC TABLE & RED GINGHAM TABLECLOTH
      // -----------------------------------------------------------------
      // Stump Wooden Base & Flared Roots (x: 985..1332, y: 472..615)
      const stumpBodyP = bezierPts([
        [[1036, 495], [1030, 538], [1012, 566], [988, 578]],
        [[988, 578], [998, 586], [1018, 585], [1042, 574]],
        [[1042, 574], [1045, 592], [1052, 595], [1088, 582]],
        [[1088, 582], [1128, 572], [1165, 598], [1202, 612]],
        [[1202, 612], [1218, 615], [1228, 612], [1232, 608]],
        [[1232, 608], [1222, 588], [1238, 585], [1268, 595]],
        [[1268, 595], [1285, 595], [1292, 584], [1308, 586]],
        [[1308, 586], [1322, 588], [1330, 584], [1332, 578]],
        [[1332, 578], [1308, 552], [1294, 524], [1288, 492]],
        [[1288, 492], [1215, 512], [1110, 512], [1036, 495]]
      ], 16);

      mbgShape(stumpBodyP, MBG.stumpBark, {
        key: key + 'stumpBase', w: 2.8, line: MBG.ink, crayon: MBG.stumpShade, crAl: 0.25, crA: -1.4,
        grad: (bb) => {
          const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
          g.addColorStop(0, '#d8b084');
          g.addColorStop(0.5, MBG.stumpBark);
          g.addColorStop(1, MBG.stumpShade);
          ctx.fillStyle = g;
          ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
        }
      });

      // Vertical bark grain lines on stump
      const stumpGrains = [
        [[1055, 515], [1044, 574]],
        [[1082, 525], [1076, 568]],
        [[1192, 528], [1212, 608]],
        [[1215, 525], [1228, 605]],
        [[1258, 518], [1278, 590]],
        [[1276, 512], [1302, 582]]
      ];
      for (let i = 0; i < stumpGrains.length; i++) {
        mbgLine(stumpGrains[i], { key: key + 'stGr' + i, w: 1.8, col: MBG.inkSoft, second: false });
      }

      // Stump Top Oval Wood Cut Surface
      const stumpTopP = ellipsePts(1162, 495, 126, 22, 0, 32);
      mbgShape(stumpTopP, MBG.stumpTop, {
        key: key + 'stumpTop', w: 2.6, line: MBG.ink,
        innerFn: () => {
          mbgLine(ellipsePts(1162, 495, 102, 15, 0, 24), { closed: true, key: key + 'stRing', w: 1.4, col: MBG.inkLight, second: false });
        }
      });

      // RED-AND-WHITE GINGHAM PICNIC CLOTH DRAPED OVER STUMP
      const clothFlutter = windFast * 45;
      const clothP = bezierPts([
        [[1075, 482], [1135, 474], [1208, 478], [1264, 494]],
        [[1264, 494], [1242, 506], [1222, 522], [1202, 542 + clothFlutter * 0.25]],
        [[1202, 542 + clothFlutter * 0.25], [1185, 535], [1165, 554], [1142, 574 + clothFlutter * 0.35]],
        [[1142, 574 + clothFlutter * 0.35], [1124, 558], [1106, 538], [1092, 534]],
        [[1092, 534], [1072, 532], [1062, 522], [1058, 508 + clothFlutter * 0.2]],
        [[1058, 508 + clothFlutter * 0.2], [1064, 494], [1068, 486], [1075, 482]]
      ], 16);

      mbgShape(clothP, MBG.clothWhite, {
        key: key + 'picnicCloth', w: 2.6, line: MBG.ink,
        innerFn: (bb) => {
          // Clipped Red Gingham Checkered Stripes following the drape perspective!
          ctx.save();
          ctx.strokeStyle = MBG.clothRed;
          ctx.lineWidth = 9.5;
          ctx.globalAlpha = 0.58;
          // Diagonal Set A
          for (let s = -6; s <= 10; s++) {
            ctx.beginPath();
            ctx.moveTo(1050 + s * 22, 470);
            ctx.lineTo(1120 + s * 22, 580);
            ctx.stroke();
          }
          // Diagonal Set B
          for (let s = -4; s <= 12; s++) {
            ctx.beginPath();
            ctx.moveTo(1050 + s * 22, 575);
            ctx.lineTo(1180 + s * 22, 470);
            ctx.stroke();
          }
          ctx.restore();
          psBlush(1145, 545, 65, 28, '145,45,38', 0.22, 0.2);
        }
      });

      // -----------------------------------------------------------------
      // LAYER 9: OPTIONAL COMPANION CHARACTER PLACED IN THE MEADOW
      // -----------------------------------------------------------------
      if (typeof companionFn === 'function') {
        ctx.save();
        // Place the companion character standing/sitting cozily on the sunlit meadow grass at (740, 625)
        psBlush(740, 795, 115, 24, '115,130,82', 0.45, 0);
        ctx.translate(740, 610);
        ctx.scale(0.46, 0.46);
        ctx.translate(-500, -500);

        // Save & restore background transparency so the character's 1000x1000 paper fill doesn't overwrite the meadow!
        const origFillRect = ctx.fillRect;
        let skippedBgRect = false;
        ctx.fillRect = function(x, y, w, h) {
          if (!skippedBgRect && w >= 980 && h >= 980) {
            skippedBgRect = true;
            return;
          }
          return origFillRect.apply(this, arguments);
        };
        companionFn(ctx, rig);
        ctx.fillRect = origFillRect;
        ctx.restore();
      }

      // -----------------------------------------------------------------
      // LAYER 10: FOREGROUND LUSH GRASS BLADES, DAISIES, BUTTERCUPS & CLOVERS
      // -----------------------------------------------------------------
      // Left Foreground Grass & Leaf Cluster (x: 0..320, y: 650..900)
      const leftBlades = [
        [[18, 900], [32, 780], [45, 685]],
        [[48, 900], [58, 810], [72, 735]],
        [[85, 900], [112, 815], [148, 728]],
        [[128, 900], [168, 825], [218, 745]],
        [[165, 900], [215, 835], [268, 775]],
        [[235, 900], [262, 845], [295, 792]]
      ];
      for (let i = 0; i < leftBlades.length; i++) {
        const [p0, p1, p2] = leftBlades[i];
        const sw = windFast * 180;
        const leafP = bezierPts([
          [p0, [p1[0] - 8, p1[1]], [p2[0] + sw - 4, p2[1]], [p2[0] + sw, p2[1]]],
          [[p2[0] + sw, p2[1]], [p2[0] + sw + 6, p2[1] + 15], [p1[0] + 10, p1[1] + 12], [p0[0] + 16, p0[1]]]
        ], 10);
        mbgShape(leafP, MBG.stemGreen, { key: key + 'fgLfL' + i, w: 2.0, line: MBG.ink, second: false });
      }

      // Left Foreground White Daisies & Golden Buttercups
      drawDaisyFlower(76, 735, 28, -0.2, windFast * 1.1, key + 'dsy1');
      drawDaisyFlower(142, 682, 26, 0.15, windFast * 1.25, key + 'dsy2');
      drawDaisyFlower(114, 808, 34, 0.05, windFast * 0.95, key + 'dsy3');
      drawDaisyFlower(248, 692, 27, 0.25, windFast * 1.15, key + 'dsy4');

      drawButtercupFlower(308, 792, 24, -0.15, windFast * 1.05, key + 'bcupL1');
      drawButtercupFlower(348, 755, 25, 0.12, windFast * 1.2, key + 'bcupL2');
      drawButtercupFlower(378, 796, 20, 0.28, windFast * 1.1, key + 'bcupL3');

      // Bottom-Center 3-Leaf Clovers & Little White Meadow Blossoms
      drawCloverSprig(452, 868, 22, windFast * 0.8, key + 'clv1');
      drawCloverSprig(498, 838, 24, windFast * 0.9, key + 'clv2');
      drawCloverSprig(538, 865, 21, windFast * 0.85, key + 'clv3');
      drawCloverSprig(1195, 868, 20, windFast * 0.85, key + 'clv4');
      drawCloverSprig(1218, 825, 22, windFast * 0.95, key + 'clv5');

      // Right Foreground Buttercups, White Flowers & Swaying Stems (x: 1250..1580, y: 660..900)
      const rightBlades = [
        [[1385, 900], [1395, 820], [1412, 745]],
        [[1435, 900], [1448, 815], [1465, 735]],
        [[1492, 900], [1512, 825], [1538, 748]],
        [[1545, 900], [1562, 835], [1582, 765]]
      ];
      for (let i = 0; i < rightBlades.length; i++) {
        const [p0, p1, p2] = rightBlades[i];
        const sw = windFast * 160;
        const leafP = bezierPts([
          [p0, [p1[0] - 7, p1[1]], [p2[0] + sw - 4, p2[1]], [p2[0] + sw, p2[1]]],
          [[p2[0] + sw, p2[1]], [p2[0] + sw + 6, p2[1] + 14], [p1[0] + 9, p1[1] + 12], [p0[0] + 14, p0[1]]]
        ], 10);
        mbgShape(leafP, MBG.stemGreen, { key: key + 'fgLfR' + i, w: 2.0, line: MBG.ink, second: false });
      }

      drawButtercupFlower(1295, 798, 22, -0.25, windFast * 1.1, key + 'bcupR1');
      drawButtercupFlower(1348, 725, 26, -0.1, windFast * 1.25, key + 'bcupR2');
      drawButtercupFlower(1395, 672, 27, 0.08, windFast * 1.3, key + 'bcupR3');
      drawDaisyFlower(1485, 708, 22, 0.15, windFast * 1.15, key + 'dsyR1');
      drawDaisyFlower(1555, 722, 21, -0.18, windFast * 1.2, key + 'dsyR2');

      ctx.restore();
    }

    // Composite wrappers for 16:9 Meadow + Characters
    function drawMeadowWithKitten(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawLanternKittenMaster);
    }
    function drawMeadowWithPuppy(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawTeacupPuppyMaster);
    }
    function drawMeadowWithCat(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawRaincoatCatMaster);
    }
    function drawMeadowWithMouse(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawStrawberryMouseMaster);
    }
    function drawMeadowWithLamb(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawAcornLambMaster);
    }
    function drawMeadowWithBunny(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawWateringCanBunnyMaster);
    }
    function drawMeadowWithDuckling(targetCtx, rig = null) {
      drawStorybookMeadowBG(targetCtx, rig, drawPostmanDucklingMaster);
    }

    // =========================================================================
    // 5C-NEW. 4 CALIBRATED STORYBOOK ANIMAL CHARACTERS (1000×1000 ENGINE C)
    // =========================================================================

    // -------------------------------------------------------------------------
    // CHARACTER A: FIELD MOUSE IN KNIT VEST HUGGING GIANT STRAWBERRY
    // -------------------------------------------------------------------------
    const SM = {
      bg: '#faf7ed',
      ink: '#523626',
      inkSoft: '#7d5844',
      inkLight: '#a3816c',
      furLight: '#f3cfa0',
      furMain: '#e4b882',
      furWarm: '#d4a269',
      furShade: '#b8844c',
      creamLight: '#fffdf7',
      creamMain: '#fbf4e4',
      creamShade: '#e8dec8',
      earPink: '#edd2be',
      earShade: '#d9b59c',
      footPink: '#ecc4b2',
      vestBase: '#e4dccb',
      vestShade: '#cbc0ab',
      vestStitch: '#8c7a65',
      ginghamRed: '#c95e58',
      ginghamDark: '#a6423c',
      berryLight: '#d8696c',
      berryMain: '#bc474b',
      berryDeep: '#963236',
      seedGold: '#eed272',
      leafLight: '#9cb068',
      leafMain: '#7f9452',
      leafDark: '#5d7036',
      eye: '#472a1c',
      nose: '#e69891',
      blush: '226,124,96'
    };

    function smLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? SM.ink, col2: o.col2 ?? SM.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }
    function smShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? SM.ink), line2: o.line2 ?? SM.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }

    function drawStrawberryMouseMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'smHero';
      const isStatic = !rig;

      const breath     = isStatic ? 0 : (rig.breath || 0);
      const bodySway   = isStatic ? 0 : (rig.torsoSway || 0);
      const headTilt   = isStatic ? 0 : (rig.headTilt || 0);
      const headDX     = isStatic ? 0 : (rig.headTurn || 0);
      const headDY     = isStatic ? 0 : (rig.headNod || 0);
      const earLRot    = isStatic ? 0 : (rig.hairSwayL || 0);
      const earRRot    = isStatic ? 0 : (rig.hairSwayR || 0);
      const armLRot    = isStatic ? 0 : (rig.leftArmLift || 0);
      const armRRot    = isStatic ? 0 : (rig.rightArmLift || 0);
      const kerchiefFl = isStatic ? 0 : (rig.ruffleBounce || 0) * 0.65;
      const berryHug   = isStatic ? 0 : (rig.leftArmLift || 0) * 0.35;
      const whiskerTw  = isStatic ? 0 : (rig.bangsSway || 0) * 0.55;
      const blink      = isStatic ? 0 : (rig.blink || 0);
      const gazeX      = isStatic ? 0 : (rig.gazeX || 0) * 0.45;
      const gazeY      = isStatic ? 0 : (rig.gazeY || 0) * 0.45;

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = SM.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'smPaper', c: '#e5dec9', al: 0.15, per: 850, len: 11 });
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      // LAYER 1: Soft Ground Contact Shadow & 4-Toed Pink Feet
      psBlush(495, 868, 195, 26, '135,105,78', 0.22, 0);

      // Left Foot (x: 365..434, y: 842..896)
      withPivot(412, 852, isStatic ? 0 : -bodySway * 0.5, 1, 1, 0, 0, () => {
        const footLP = bezierPts([
          [[396, 848], [372, 862], [362, 882], [372, 892]],
          [[372, 892], [382, 898], [405, 898], [418, 888]],
          [[418, 888], [430, 876], [436, 860], [426, 848]]
        ], 12);
        smShape(footLP, SM.footPink, { key: key + 'ftL', w: 3.8, crayon: SM.earShade, crAl: 0.22 });
        smLine([[376, 890], [392, 870]], { key: key + 'ftLt1', w: 2.8, second: false });
        smLine([[390, 895], [404, 874]], { key: key + 'ftLt2', w: 2.8, second: false });
        smLine([[406, 894], [416, 876]], { key: key + 'ftLt3', w: 2.8, second: false });
      });

      // Right Foot (x: 568..654, y: 838..888)
      withPivot(595, 848, isStatic ? 0 : bodySway * 0.5, 1, 1, 0, 0, () => {
        const footRP = bezierPts([
          [[572, 850], [588, 872], [612, 888], [634, 886]],
          [[634, 886], [652, 882], [656, 866], [638, 852]],
          [[638, 852], [618, 840], [592, 838], [572, 850]]
        ], 12);
        smShape(footRP, SM.footPink, { key: key + 'ftR', w: 3.8, crayon: SM.earShade, crAl: 0.22 });
        smLine([[644, 876], [618, 862]], { key: key + 'ftRt1', w: 2.8, second: false });
        smLine([[635, 884], [608, 868]], { key: key + 'ftRt2', w: 2.8, second: false });
      });

      // BREATHING TORSO HIERARCHY
      withPivot(490, 845, bodySway, 1 + breath * 0.38, 1 + breath, 0, -breath * 26, () => {

        // LAYER 2: Plump Lower Belly & Fluffy Hip Fur (x: 278..705, y: 645..865)
        const lowerBodyP = bezierPts([
          [[284, 668], [272, 735], [295, 808], [362, 845]],
          [[362, 845], [428, 868], [545, 866], [622, 835]],
          [[622, 835], [678, 804], [704, 745], [696, 685]],
          [[696, 685], [600, 650], [390, 650], [284, 668]]
        ], 18);

        smShape(lowerBodyP, SM.furMain, {
          key: key + 'lowBody', line: false, crayon: SM.furShade, crAl: 0.22,
          grad: (bb) => {
            const g = ctx.createRadialGradient(505, 765, 30, 495, 765, 220);
            g.addColorStop(0, SM.furLight);
            g.addColorStop(0.65, SM.furMain);
            g.addColorStop(1, SM.furWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // Soft Cream Belly Patch with furry top arch
            const bellyP = bezierPts([
              [[406, 718], [455, 705], [565, 708], [628, 735]],
              [[628, 735], [648, 778], [625, 832], [552, 858]],
              [[552, 858], [485, 866], [422, 845], [404, 795]],
              [[404, 795], [396, 755], [398, 732], [406, 718]]
            ], 16);
            smShape(bellyP, SM.creamMain, {
              key: key + 'belly', line: false, crayon: SM.creamShade, crAl: 0.18
            });
            // Fur transition ticks along left edge of cream belly
            for (let i = 0; i < 6; i++) {
              const fy = 725 + i * 18;
              const fx = 404 + Math.sin(i) * 4;
              smLine([[fx - 6, fy], [fx + 6, fy + 8]], { key: key + 'bTk' + i, w: 2.0, col: SM.inkSoft, second: false });
            }
            psBlush(345, 785, 68, 55, '168,114,62', 0.42, 0.3);
          }
        });

        // Fluffy Hip Contour with Fur Notches
        smLine(bezierPts([
          [[282, 675], [278, 705], [285, 725], [278, 734]],
          [[278, 734], [288, 765], [298, 785], [294, 795]],
          [[294, 795], [318, 828], [362, 852], [435, 864]],
          [[435, 864], [518, 868], [595, 852], [648, 818]],
          [[648, 818], [685, 788], [702, 742], [696, 695]]
        ], 16), { key: key + 'hipOut', w: 4.2 });

        // LAYER 3: Gingham Kerchief Fluttering Left Knot & Tails (Behind Vest Shoulder!)
        withPivot(336, 462, kerchiefFl, 1, 1, 0, 0, () => {
          const drawGinghamPart = (pts, gKey) => {
            smShape(pts, SM.creamMain, {
              key: gKey, w: 3.6,
              innerFn: (bb) => {
                ctx.save();
                ctx.strokeStyle = SM.ginghamRed;
                ctx.lineWidth = 7.5;
                ctx.globalAlpha = 0.62;
                for (let x = bb.x0 - 20; x <= bb.x1 + 20; x += 15) {
                  ctx.beginPath(); ctx.moveTo(x, bb.y0); ctx.lineTo(x + 12, bb.y1); ctx.stroke();
                }
                for (let y = bb.y0 - 10; y <= bb.y1 + 10; y += 15) {
                  ctx.beginPath(); ctx.moveTo(bb.x0, y); ctx.lineTo(bb.x1, y + 8); ctx.stroke();
                }
                ctx.restore();
              }
            });
          };

          // Upper Left Tail Leaf
          drawGinghamPart(bezierPts([
            [[328, 452], [304, 428], [278, 415], [260, 415]],
            [[260, 415], [266, 436], [288, 456], [324, 464]]
          ], 10), key + 'kTailU');

          // Lower Left Tail Leaf
          drawGinghamPart(bezierPts([
            [[324, 465], [294, 465], [268, 478], [258, 496]],
            [[258, 496], [278, 506], [308, 495], [332, 476]]
          ], 10), key + 'kTailD');

          // Knot
          drawGinghamPart(ellipsePts(336, 464, 15, 18, -0.2, 14), key + 'kKnot');
        });

        // LAYER 4: Oatmeal Cable-Knit Sweater Vest (x: 274..565, y: 468..732)
        const vestP = bezierPts([
          [[334, 474], [302, 528], [278, 605], [275, 658]],
          [[275, 658], [272, 682], [298, 698], [362, 712]],
          [[362, 712], [435, 726], [512, 730], [562, 725]],
          [[562, 725], [555, 640], [545, 565], [532, 512]],
          [[532, 512], [455, 495], [385, 482], [334, 474]]
        ], 16);

        smShape(vestP, SM.vestBase, {
          key: key + 'vest', w: 4.0, crayon: SM.vestShade, crAl: 0.22,
          innerFn: () => {
            // Ribbed Bottom Hem Band & Vertical Rib Ticks
            const hemLine = bezierPts([[[276, 655], [358, 682], [458, 696], [558, 695]]], 14);
            smLine(hemLine, { key: key + 'vHemL', w: 2.6, col: SM.inkSoft, second: false });
            for (let i = 0; i < 14; i++) {
              const hx = 288 + i * 19;
              const hy = 662 + Math.sin(i * 0.18) * 28;
              smLine([[hx, hy], [hx - 4, hy + 24]], { key: key + 'vRib' + i, w: 2.0, col: SM.vestStitch, second: false });
            }

            // V-Shaped Cable-Knit Stitch Pattern Rows across Vest Body
            const vRows = [
              [315, 515], [332, 505], [302, 545], [322, 558], [295, 582], [316, 596],
              [288, 622], [312, 635], [338, 646], [365, 655], [395, 662], [425, 668],
              [455, 672], [485, 674], [515, 674], [382, 628], [412, 636], [445, 642], [478, 646]
            ];
            for (let i = 0; i < vRows.length; i++) {
              const [vx, vy] = vRows[i];
              smLine([[vx - 5, vy - 6], [vx, vy + 5], [vx + 6, vy - 5]], {
                key: key + 'vst' + i, w: 1.8, col: SM.vestStitch, second: false
              });
            }
          }
        });

        // Red-and-White Gingham Bandana Triangle Collar Over Vest Neckline
        const bandanaP = bezierPts([
          [[342, 464], [412, 516], [475, 556], [528, 582]],
          [[528, 582], [542, 545], [552, 515], [558, 495]],
          [[558, 495], [475, 492], [398, 478], [342, 464]]
        ], 14);
        smShape(bandanaP, SM.creamMain, {
          key: key + 'bandana', w: 3.8,
          innerFn: (bb) => {
            ctx.save();
            ctx.strokeStyle = SM.ginghamRed;
            ctx.lineWidth = 10;
            ctx.globalAlpha = 0.62;
            for (let x = bb.x0 - 20; x <= bb.x1 + 20; x += 20) {
              ctx.beginPath(); ctx.moveTo(x, bb.y0); ctx.lineTo(x - 14, bb.y1); ctx.stroke();
            }
            for (let y = bb.y0 - 10; y <= bb.y1 + 10; y += 20) {
              ctx.beginPath(); ctx.moveTo(bb.x0, y); ctx.lineTo(bb.x1, y + 12); ctx.stroke();
            }
            ctx.restore();
          }
        });

        // LAYER 5: Giant Ripe Strawberry Hugged Against Chest (x: 522..768, y: 435..748)
        withPivot(642, 595, berryHug, 1, 1, 0, 0, () => {
          const berryP = bezierPts([
            [[618, 468], [555, 472], [522, 526], [525, 595]],
            [[525, 595], [528, 668], [555, 738], [598, 748]],
            [[598, 748], [648, 756], [718, 704], [752, 636]],
            [[752, 636], [776, 585], [762, 522], [712, 486]],
            [[712, 486], [678, 468], [645, 466], [618, 468]]
          ], 18);

          smShape(berryP, SM.berryMain, {
            key: key + 'berry', w: 4.2, crayon: SM.berryDeep, crAl: 0.25,
            grad: (bb) => {
              const g = ctx.createRadialGradient(595, 545, 20, 635, 595, 165);
              g.addColorStop(0, SM.berryLight);
              g.addColorStop(0.55, SM.berryMain);
              g.addColorStop(1, SM.berryDeep);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Soft white-pink highlight sheen on upper left shoulder of strawberry
              psBlush(575, 525, 48, 35, '248,185,185', 0.42, -0.4);

              // 24 Golden Teardrop Strawberry Seeds (Achenes) in organic diagonal rows
              const seeds = [
                [558, 525], [595, 518], [635, 528], [685, 535], [728, 542],
                [548, 565], [582, 562], [620, 568], [662, 574], [708, 578], [742, 576],
                [565, 612], [602, 610], [642, 615], [684, 618], [725, 616],
                [555, 658], [588, 656], [626, 662], [668, 664], [704, 658],
                [576, 702], [612, 706], [652, 702], [596, 730]
              ];
              for (let i = 0; i < seeds.length; i++) {
                const [sx, sy] = seeds[i];
                smShape(ellipsePts(sx, sy, 3.4, 6.2, 0.22, 10), SM.seedGold, {
                  key: key + 'sd' + i, w: 1.6, line: SM.berryDeep, second: false
                });
              }
            }
          });

          // Green Leafy Calyx & Stem Crown on Top of Strawberry
          const stemP = bezierPts([
            [[682, 482], [696, 458], [712, 442], [718, 436]],
            [[718, 436], [728, 442], [726, 448], [716, 456]],
            [[716, 456], [704, 468], [695, 480], [688, 488]]
          ], 10);
          smShape(stemP, SM.leafMain, { key: key + 'bStem', w: 3.4 });

          const calyxLeaves = [
            // Left leaf
            [[[676, 482], [645, 476], [622, 464], [614, 452]], [[614, 452], [636, 488], [656, 496], [682, 490]]],
            // Front-left drooping leaf
            [[[678, 488], [652, 496], [634, 512], [632, 520]], [[632, 520], [658, 516], [676, 505], [686, 492]]],
            // Center-front large leaf
            [[[684, 490], [678, 515], [688, 538], [712, 552]], [[712, 552], [722, 528], [714, 504], [692, 488]]],
            // Right spreading leaf
            [[[692, 486], [722, 496], [748, 512], [766, 512]], [[766, 512], [748, 492], [724, 480], [692, 482]]],
            // Upper-back leaf
            [[[678, 478], [668, 462], [666, 448], [674, 446]], [[674, 446], [684, 456], [688, 468], [686, 480]]]
          ];
          for (let i = 0; i < calyxLeaves.length; i++) {
            smShape(bezierPts(calyxLeaves[i], 10), SM.leafMain, {
              key: key + 'cLf' + i, w: 3.2, crayon: SM.leafDark, crAl: 0.24
            });
          }

          // Right Paw 3 Pink Fingers Peeking Around Far Right Edge of Strawberry
          withPivot(752, 608, armRRot, 1, 1, 0, 0, () => {
            const rFingers = [
              [758, 592, 14, 8, -0.2],
              [760, 608, 15, 8.5, 0.0],
              [755, 624, 13, 8, 0.25]
            ];
            for (let i = 0; i < rFingers.length; i++) {
              const [fx, fy, rx, ry, rot] = rFingers[i];
              smShape(ellipsePts(fx, fy, rx, ry, rot, 12), SM.footPink, { key: key + 'rFg' + i, w: 3.4 });
            }
          });
        });

        // LAYER 6: Left Arm Emerging from Vest Armhole & 4-Fingered Paw Hugging Strawberry
        withPivot(385, 575, armLRot, 1, 1, 0, 0, () => {
          // Ribbed Vest Armhole Cuff Ring
          const armholeP = bezierPts([
            [[388, 518], [352, 526], [336, 568], [346, 616]],
            [[346, 616], [358, 650], [385, 662], [408, 654]],
            [[408, 654], [375, 636], [362, 595], [368, 558]],
            [[368, 558], [375, 535], [392, 524], [388, 518]]
          ], 14);
          smShape(armholeP, SM.vestBase, { key: key + 'armHole', w: 3.6, crayon: SM.vestShade });

          // Plump Golden-Tan Left Arm & 4 Pink-Tipped Fingers Resting on Berry
          const armLP = bezierPts([
            [[374, 528], [412, 534], [462, 572], [516, 580]],
            [[516, 580], [532, 568], [546, 562], [552, 568]],
            [[552, 568], [556, 574], [546, 582], [536, 586]],
            [[536, 586], [558, 582], [572, 584], [572, 592]],
            [[572, 592], [572, 598], [558, 602], [542, 604]],
            [[542, 604], [562, 604], [576, 606], [575, 614]],
            [[575, 614], [574, 620], [558, 622], [540, 620]],
            [[540, 620], [556, 625], [566, 630], [562, 636]],
            [[562, 636], [556, 642], [538, 638], [516, 628]],
            [[516, 628], [472, 658], [418, 665], [376, 645]],
            [[376, 645], [352, 618], [352, 562], [374, 528]]
          ], 14);
          smShape(armLP, SM.furMain, {
            key: key + 'armL', line: false, crayon: SM.furShade, crAl: 0.22,
            innerFn: () => {
              psBlush(548, 602, 32, 26, '236,196,178', 0.78, 0);
              psBlush(435, 638, 58, 22, '178,124,70', 0.45, 0.15);
            }
          });
          // Open-Contour Arm Stroke (Softly open at shoulder top)
          smLine(bezierPts([
            [[382, 530], [418, 538], [462, 572], [516, 580]],
            [[516, 580], [532, 568], [546, 562], [552, 568]],
            [[552, 568], [556, 574], [546, 582], [536, 586]],
            [[536, 586], [558, 582], [572, 584], [572, 592]],
            [[572, 592], [572, 598], [558, 602], [542, 604]],
            [[542, 604], [562, 604], [576, 606], [575, 614]],
            [[575, 614], [574, 620], [558, 622], [540, 620]],
            [[540, 620], [556, 625], [566, 630], [562, 636]],
            [[562, 636], [556, 642], [538, 638], [516, 628]],
            [[516, 628], [472, 658], [418, 665], [376, 645]]
          ], 14), { key: key + 'armLOut', w: 3.8 });
        });

        // LAYER 7..12: FIELD MOUSE HEAD, BIG ROUND EARS, TWO-TONE MUZZLE & DEFORMING EYES
        withPivot(495, 425, headTilt, 1, 1, headDX, headDY, () => {

          // 7A. Large Round Left Mouse Ear (Pivoted at (358, 265))
          withPivot(358, 265, earLRot, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[372, 272], [326, 298], [268, 292], [238, 250]],
              [[238, 250], [218, 208], [234, 152], [282, 132]],
              [[282, 132], [332, 114], [388, 138], [408, 186]],
              [[408, 186], [416, 208], [414, 224], [408, 236]]
            ], 16);
            smShape(earLP, SM.furMain, {
              key: key + 'earL', line: false, crayon: SM.furShade, crAl: 0.2,
              innerFn: () => {
                const earInLP = ellipsePts(320, 212, 66, 58, -0.25, 24);
                smShape(earInLP, SM.earPink, {
                  key: key + 'earInL', line: false, crayon: SM.earShade, crAl: 0.28, crA: -0.95
                });
                smLine(bezierPts([[[268, 175], [308, 152], [358, 165], [378, 208]]], 12), {
                  key: key + 'earRimL', w: 2.2, col: SM.inkSoft, second: false
                });
              }
            });
            smLine(earLP, { key: key + 'earLOut', w: 4.2 });
          });

          // 7B. Large Round Right Mouse Ear (Pivoted at (595, 228))
          withPivot(595, 228, earRRot, 1, 1, 0, 0, () => {
            const earRP = bezierPts([
              [[552, 212], [548, 165], [568, 118], [614, 108]],
              [[614, 108], [664, 98], [708, 138], [712, 192]],
              [[712, 192], [715, 242], [685, 276], [648, 282]]
            ], 16);
            smShape(earRP, SM.furMain, {
              key: key + 'earR', line: false, crayon: SM.furShade, crAl: 0.2,
              innerFn: () => {
                const earInRP = ellipsePts(636, 196, 56, 62, 0.18, 24);
                smShape(earInRP, SM.earPink, {
                  key: key + 'earInR', line: false, crayon: SM.earShade, crAl: 0.28, crA: -0.65
                });
                smLine(bezierPts([[[586, 172], [612, 136], [658, 138], [684, 178]]], 12), {
                  key: key + 'earRimR', w: 2.2, col: SM.inkSoft, second: false
                });
              }
            });
            smLine(earRP, { key: key + 'earROut', w: 4.2 });
          });

          // 7C. Main Field Mouse Head with Crown Fur Tuft & Two-Tone Cream Muzzle/Cheeks
          const headP = bezierPts([
            [[384, 236], [428, 212], [468, 206], [492, 188]],
            [[492, 188], [496, 196], [488, 208], [486, 212]],
            [[486, 212], [504, 198], [516, 192], [518, 200]],
            [[518, 200], [514, 208], [508, 214], [516, 214]],
            [[516, 214], [568, 212], [628, 248], [658, 308]],
            [[658, 308], [686, 355], [692, 405], [658, 452]],
            [[658, 452], [595, 498], [465, 504], [358, 456]],
            [[358, 456], [326, 412], [332, 355], [358, 302]],
            [[358, 302], [368, 272], [374, 252], [384, 236]]
          ], 16);

          smShape(headP, SM.furMain, {
            key: key + 'headBase', line: false, crayon: SM.furShade, crAl: 0.18,
            grad: (bb) => {
              const g = ctx.createRadialGradient(512, 315, 25, 505, 345, 195);
              g.addColorStop(0, SM.furLight);
              g.addColorStop(0.65, SM.furMain);
              g.addColorStop(1, SM.furWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Inverted-V Cream Lower Face & Cheek Muzzle Area
              const muzzleAreaP = bezierPts([
                [[352, 438], [412, 408], [488, 398], [568, 378]],
                [[568, 378], [625, 385], [668, 392], [688, 412]],
                [[688, 412], [662, 468], [575, 505], [465, 505]],
                [[465, 505], [385, 488], [348, 462], [352, 438]]
              ], 16);
              smShape(muzzleAreaP, SM.creamMain, {
                key: key + 'muzArea', line: false, crayon: SM.creamShade, crAl: 0.16
              });

              // Warm Coral-Rose Cheek Blushes
              psBlush(436, 422, 40, 26, SM.blush, 0.68, 0.08);
              psBlush(652, 392, 34, 24, SM.blush, 0.68, -0.12);

              // Forehead & Nose Bridge Fur Texture Ticks
              const fhTicks = [
                [[502, 268], [505, 282]], [[518, 262], [520, 278]], [[536, 258], [538, 275]],
                [[518, 294], [520, 308]], [[530, 292], [532, 306]], [[542, 292], [544, 306]],
                [[544, 358], [542, 372]], [[554, 355], [553, 370]], [[564, 355], [564, 370]], [[574, 358], [575, 372]]
              ];
              for (let i = 0; i < fhTicks.length; i++) {
                smLine(fhTicks[i], { key: key + 'fhT' + i, w: 1.8, col: SM.inkSoft, second: false });
              }
            }
          });

          // Open-Contour Head & Tuft Outlines (With little ear-base fur tufts!)
          smLine(bezierPts([
            [[362, 284], [374, 268], [362, 262], [378, 255]],
            [[378, 255], [368, 246], [386, 236], [428, 212]],
            [[428, 212], [468, 206], [485, 194], [492, 188]],
            [[492, 188], [494, 198], [488, 208], [486, 212]],
            [[486, 212], [504, 198], [516, 192], [518, 200]],
            [[518, 200], [514, 208], [508, 214], [516, 214]],
            [[516, 214], [556, 212], [595, 228], [612, 240]]
          ], 14), { key: key + 'crnLine', w: 4.0 });

          // Left & Right Cheek Tuft Contours
          smLine(bezierPts([
            [[362, 292], [344, 338], [332, 378], [338, 392]],
            [[338, 392], [328, 412], [342, 442], [365, 462]]
          ], 14), { key: key + 'chkLineL', w: 4.0 });

          smLine(bezierPts([
            [[618, 242], [656, 295], [685, 358], [688, 405]],
            [[688, 405], [684, 434], [668, 456], [648, 468]]
          ], 14), { key: key + 'chkLineR', w: 4.0 });

          // Expressive Eyebrows
          smLine(bezierPts([[[450, 322], [456, 315], [464, 314], [470, 316]]], 8), { key: key + 'brwL', w: 2.6, second: false });
          smLine(bezierPts([[[606, 298], [614, 296], [622, 300], [626, 306]]], 8), { key: key + 'brwR', w: 2.6, second: false });

          // 7D. 3-Stage Deforming Eyelid Blink Eyes with Warm Cream Eye-Ring Halo
          const drawMouseEye = (ex, ey, erx, ery, eKey) => {
            // Cream eye-ring halo
            smShape(ellipsePts(ex, ey, erx + 5, ery + 5, 0, 20), SM.creamMain, { key: key + eKey + 'Halo', line: false });
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 8, clipTop, (erx + 8) * 2, ery * 2.5);
              ctx.clip();
              smShape(ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 20), SM.eye, {
                key: key + eKey, w: 2.2, line: SM.eye, second: false
              });
              ctx.fillStyle = 'rgba(255,250,240,0.85)';
              ctx.beginPath();
              ctx.ellipse(ex + gazeX - erx * 0.28, ey + gazeY - ery * 0.28, 2.8, 3.5, -0.2, 0, TAU);
              ctx.fill();
              ctx.restore();
            }
            if (u > 0.12) {
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 9;
              smLine(bezierPts([
                [[ex - erx - 3, ey + u * 2], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 2]]
              ], 10), { key: key + eKey + 'Lid', w: 3.8, col: SM.eye, second: false });
            }
          };

          drawMouseEye(473, 372, 14.5, 17.5, 'mEyeL');
          drawMouseEye(618, 355, 13.5, 16.5, 'mEyeR');

          // 7E. Sweet Pink Heart-Triangle Nose & Philtrum
          const noseP = bezierPts([
            [[572, 388], [585, 386], [588, 394], [580, 404]],
            [[580, 404], [576, 408], [572, 408], [568, 404]],
            [[568, 404], [558, 396], [560, 388], [572, 388]]
          ], 12);
          smShape(noseP, SM.nose, { key: key + 'nose', w: 2.8, line: SM.eye, second: false });
          smLine([[575, 408], [578, 428]], { key: key + 'phil', w: 3.0, col: SM.eye, second: false });

          // 7F. Long Delicate Field Mouse Whiskers
          withPivot(455, 432, whiskerTw, 1, 1, 0, 0, () => {
            smLine(bezierPts([[[472, 422], [435, 428], [402, 436], [372, 446]]], 10), { key: key + 'whL1', w: 1.9, second: false });
            smLine(bezierPts([[[478, 434], [442, 452], [412, 468], [386, 488]]], 10), { key: key + 'whL2', w: 1.9, second: false });
          });
          withPivot(668, 385, -whiskerTw, 1, 1, 0, 0, () => {
            smLine(bezierPts([[[658, 375], [692, 362], [722, 354], [748, 348]]], 10), { key: key + 'whR1', w: 1.9, second: false });
            smLine(bezierPts([[[662, 388], [698, 382], [728, 380], [755, 382]]], 10), { key: key + 'whR2', w: 1.9, second: false });
          });

        }); // end head
      }); // end torso

      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // CHARACTER B: FLUFFY BABY LAMB IN MUSTARD KNIT SCARF HOLDING ACORN
    // -------------------------------------------------------------------------
    const AL = {
      bg: '#faf7ef',
      ink: '#5a4232',
      inkSoft: '#876852',
      inkLight: '#ab8f79',
      woolLight: '#ffffff',
      woolMain: '#fcf9f2',
      woolWarm: '#f4ece0',
      woolShade: '#e3d5c0',
      skinLight: '#fbf0e4',
      skinMain: '#f5e5d2',
      skinShade: '#dfc9b0',
      earPink: '#f0cfc2',
      hoofMain: '#846b5a',
      hoofDark: '#634d3e',
      scarfLight: '#e5c26e',
      scarfMain: '#d4ac54',
      scarfShade: '#b38936',
      scarfStitch: '#8f6822',
      acornNut: '#be8358',
      acornCap: '#7d5034',
      eye: '#472c1e',
      nose: '#f0b2aa',
      blush: '238,162,112'
    };

    function alLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? AL.ink, col2: o.col2 ?? AL.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }
    function alShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? AL.ink), line2: o.line2 ?? AL.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }

    // Helper to build a multi-scalloped fluffy cloud contour around an ellipse/polygon spine
    function buildScallopRingPts(cx, cy, rx, ry, nLobes = 16, amp = 14) {
      const P = [];
      const steps = nLobes * 10;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const a = u * TAU;
        const lobe = Math.abs(Math.sin(u * Math.PI * nLobes));
        const rMod = 1 + (lobe * amp) / Math.max(rx, ry);
        P.push([
          cx + Math.cos(a) * rx * rMod,
          cy + Math.sin(a) * ry * rMod
        ]);
      }
      return P;
    }

    function drawAcornLambMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'alHero';
      const isStatic = !rig;

      const breath   = isStatic ? 0 : (rig.breath || 0);
      const bodySway = isStatic ? 0 : (rig.torsoSway || 0);
      const headTilt = isStatic ? 0 : (rig.headTilt || 0);
      const headDX   = isStatic ? 0 : (rig.headTurn || 0);
      const headDY   = isStatic ? 0 : (rig.headNod || 0);
      const earLRot  = isStatic ? 0 : (rig.hairSwayL || 0);
      const earRRot  = isStatic ? 0 : (rig.hairSwayR || 0);
      const armLRot  = isStatic ? 0 : (rig.leftArmLift || 0);
      const armRRot  = isStatic ? 0 : (rig.rightArmLift || 0);
      const scarfSway= isStatic ? 0 : (rig.ruffleBounce || 0) * 0.75;
      const blink    = isStatic ? 0 : (rig.blink || 0);
      const gazeX    = isStatic ? 0 : (rig.gazeX || 0) * 0.45;
      const gazeY    = isStatic ? 0 : (rig.gazeY || 0) * 0.45;

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = AL.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'alPaper', c: '#e6dfd0', al: 0.15, per: 850, len: 11 });
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      // LAYER 1: Ground Shadow & Dainty Cloven-Hoofed Legs
      psBlush(505, 895, 165, 24, '135,108,82', 0.22, 0);

      // Left Leg & Cloven Hoof (x: 400..468, y: 838..914)
      withPivot(435, 845, isStatic ? 0 : -bodySway * 0.4, 1, 1, 0, 0, () => {
        const legLP = bezierPts([
          [[402, 838], [408, 875], [414, 902], [426, 912]],
          [[426, 912], [442, 915], [458, 914], [465, 905]],
          [[465, 905], [464, 878], [462, 855], [465, 838]]
        ], 12);
        alShape(legLP, AL.skinMain, {
          key: key + 'legL', w: 4.0, crayon: AL.skinShade, crAl: 0.25,
          innerFn: () => {
            alShape([[412, 890], [466, 890], [466, 916], [412, 916]], AL.hoofMain, { key: key + 'hfL', line: false });
          }
        });
        alLine(bezierPts([[[414, 892], [438, 886], [452, 888], [464, 894]]], 8), { key: key + 'hfRimL', w: 3.0, second: false });
        alLine([[446, 892], [446, 913]], { key: key + 'hfClfL', w: 2.8, second: false });
      });

      // Right Leg & Cloven Hoof (x: 558..614, y: 832..898)
      withPivot(585, 838, isStatic ? 0 : bodySway * 0.4, 1, 1, 0, 0, () => {
        const legRP = bezierPts([
          [[558, 835], [562, 868], [568, 890], [580, 898]],
          [[580, 898], [595, 900], [608, 898], [612, 888]],
          [[612, 888], [610, 865], [608, 845], [610, 832]]
        ], 12);
        alShape(legRP, AL.skinMain, {
          key: key + 'legR', w: 4.0, crayon: AL.skinShade, crAl: 0.25,
          innerFn: () => {
            alShape([[564, 876], [614, 876], [614, 902], [564, 902]], AL.hoofMain, { key: key + 'hfR', line: false });
          }
        });
        alLine(bezierPts([[[568, 878], [588, 874], [602, 875], [611, 880]]], 8), { key: key + 'hfRimR', w: 3.0, second: false });
        alLine([[594, 878], [594, 898]], { key: key + 'hfClfR', w: 2.8, second: false });
      });

      // BREATHING TORSO HIERARCHY
      withPivot(495, 835, bodySway, 1 + breath * 0.42, 1 + breath, 0, -breath * 26, () => {

        // LAYER 2: Left Scarf Back Tail & Fringe (Behind Wool Body!)
        withPivot(295, 485, scarfSway * 0.85, 1, 1, 0, 0, () => {
          const scarfLeftTailP = bezierPts([
            [[285, 482], [252, 535], [222, 595], [196, 646]],
            [[196, 646], [218, 668], [248, 684], [274, 692]],
            [[274, 692], [285, 620], [295, 550], [308, 495]]
          ], 14);
          alShape(scarfLeftTailP, AL.scarfMain, {
            key: key + 'scfTailL', w: 3.8, crayon: AL.scarfShade, crAl: 0.25
          });
          // 4 Tassel Fringes on Left Scarf Tail
          const lTassels = [[196, 648], [212, 664], [232, 678], [252, 688]];
          for (let i = 0; i < lTassels.length; i++) {
            const [tx, ty] = lTassels[i];
            alShape(ellipsePts(tx - 6, ty + 14, 6, 15, 0.45, 10), AL.scarfMain, { key: key + 'tsL' + i, w: 3.0 });
          }
        });

        // Fluffy Little Wool Tail Puff on Left Hip
        const tailWoolP = buildScallopRingPts(278, 752, 36, 32, 8, 8);
        alShape(tailWoolP, AL.woolWarm, { key: key + 'tailWool', w: 3.6, crayon: AL.woolShade, crAl: 0.25 });

        // LAYER 3: Fluffy Scalloped Cloud-Wool Body (x: 262..728, y: 485..858)
        const bodyWoolP = buildScallopRingPts(492, 668, 206, 178, 22, 14);
        alShape(bodyWoolP, AL.woolMain, {
          key: key + 'woolBody', w: 4.2, crayon: AL.woolShade, crAl: 0.18,
          grad: (bb) => {
            const g = ctx.createRadialGradient(495, 645, 30, 495, 675, 235);
            g.addColorStop(0, AL.woolLight);
            g.addColorStop(0.68, AL.woolMain);
            g.addColorStop(1, AL.woolWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(345, 735, 85, 95, '218,198,172', 0.55, 0.25);
            psBlush(495, 815, 165, 45, '212,190,162', 0.55, 0);
            // Soft inner wool C-curl dimples
            const curls = [
              [[358, 745], [375, 762], [398, 758]],
              [[425, 762], [445, 776], [468, 768]],
              [[532, 785], [555, 796], [578, 782]],
              [[572, 695], [588, 712], [602, 702]],
              [[322, 638], [336, 658], [355, 652]]
            ];
            for (let i = 0; i < curls.length; i++) {
              const [p0, p1, p2] = curls[i];
              alLine(bezierPts([[p0, p1, p1, p2]], 8), { key: key + 'wCrl' + i, w: 2.0, col: AL.inkLight, second: false });
            }
          }
        });

        // LAYER 4: Baby Lamb Head, Horizontal Ears & Fluffy Cloud Wool Cap (Pivoted at (505, 365))
        withPivot(505, 365, headTilt, 1, 1, headDX, headDY, () => {

          // Left Horizontal Drooping Lamb Ear (Pivoted at (358, 285))
          withPivot(358, 285, earLRot, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[356, 268], [312, 282], [272, 298], [262, 318]],
              [[262, 318], [258, 336], [285, 344], [322, 334]],
              [[322, 334], [348, 326], [362, 312], [368, 296]]
            ], 14);
            alShape(earLP, AL.skinMain, {
              key: key + 'earL', w: 3.8,
              innerFn: () => {
                alShape(bezierPts([[[348, 288], [304, 304], [278, 320], [322, 324]]], 10), AL.earPink, {
                  key: key + 'earInL', line: false
                });
              }
            });
            alLine(bezierPts([[[352, 288], [312, 302], [285, 315], [275, 322]]], 10), { key: key + 'eFoldL', w: 2.4, second: false });
          });

          // Right Horizontal Drooping Lamb Ear (Pivoted at (652, 258))
          withPivot(652, 258, earRRot, 1, 1, 0, 0, () => {
            const earRP = bezierPts([
              [[652, 245], [688, 256], [722, 268], [728, 284]],
              [[728, 284], [730, 300], [705, 306], [676, 298]],
              [[676, 298], [658, 292], [648, 278], [646, 265]]
            ], 14);
            alShape(earRP, AL.skinMain, {
              key: key + 'earR', w: 3.8,
              innerFn: () => {
                alShape(bezierPts([[[656, 262], [688, 272], [712, 284], [678, 288]]], 10), AL.earPink, {
                  key: key + 'earInR', line: false
                });
              }
            });
            alLine(bezierPts([[[656, 262], [685, 272], [706, 280], [715, 286]]], 10), { key: key + 'eFoldR', w: 2.4, second: false });
          });

          // Fluffy Top Wool Crown Cap (16 Scalloped Cloud Puffs Framing the Face!)
          const crownWoolP = buildScallopRingPts(495, 248, 178, 136, 16, 15);
          alShape(crownWoolP, AL.woolMain, {
            key: key + 'crnWool', w: 4.2, crayon: AL.woolShade, crAl: 0.16
          });

          // Cream Bisque Lamb Face Window (Framed by Scalloped Wool Forehead!)
          const faceP = bezierPts([
            [[442, 238], [465, 265], [516, 265], [548, 236]],
            [[548, 236], [568, 262], [595, 262], [612, 242]],
            [[612, 242], [635, 285], [656, 332], [645, 378]],
            [[645, 378], [625, 412], [565, 422], [505, 420]],
            [[505, 420], [442, 418], [405, 392], [392, 342]],
            [[392, 342], [418, 326], [435, 295], [442, 238]]
          ], 16);
          alShape(faceP, AL.skinMain, {
            key: key + 'face', w: 4.0, crayon: AL.skinShade, crAl: 0.16,
            grad: (bb) => {
              const g = ctx.createRadialGradient(525, 330, 20, 525, 340, 140);
              g.addColorStop(0, AL.skinLight);
              g.addColorStop(0.7, AL.skinMain);
              g.addColorStop(1, AL.skinShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Warm Peach Cheek Blushes + 4 Diagonal Hatch Lines
              psBlush(458, 368, 34, 22, AL.blush, 0.72, 0.08);
              psBlush(624, 348, 28, 20, AL.blush, 0.72, -0.08);
            }
          });

          for (let i = 0; i < 4; i++) {
            alLine([[442 + i * 7, 372], [449 + i * 7, 360]], { key: key + 'bhL' + i, w: 1.9, col: '#b86d43', second: false });
            alLine([[612 + i * 6, 352], [618 + i * 6, 340]], { key: key + 'bhR' + i, w: 1.9, col: '#b86d43', second: false });
          }

          // 3-Stage Deforming Eyelid Blink Eyes
          const drawLambEye = (ex, ey, erx, ery, eKey) => {
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 6, clipTop, (erx + 6) * 2, ery * 2.5);
              ctx.clip();
              alShape(ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 18), AL.eye, {
                key: key + eKey, w: 2.0, line: AL.eye, second: false
              });
              ctx.restore();
            }
            if (u > 0.12) {
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 8;
              alLine(bezierPts([
                [[ex - erx - 3, ey + u * 2], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 2]]
              ], 8), { key: key + eKey + 'Lid', w: 3.6, col: AL.eye, second: false });
            }
          };

          drawLambEye(471, 333, 11.5, 14.0, 'lEyeL');
          drawLambEye(608, 318, 11.0, 13.5, 'lEyeR');

          // Soft Pink Triangular Nose & Y-Mouth
          const noseP = bezierPts([
            [[534, 338], [556, 335], [574, 340], [568, 350]],
            [[568, 350], [560, 356], [555, 358], [552, 355]],
            [[552, 355], [542, 348], [532, 344], [534, 338]]
          ], 10);
          alShape(noseP, AL.nose, { key: key + 'nose', w: 2.8, line: AL.eye, second: false });
          alLine([[556, 356], [560, 372]], { key: key + 'phil', w: 3.0, col: AL.eye, second: false });
        });

        // LAYER 5: Chunky Mustard Cable-Knit Scarf Wrapped Around Neck + Front Hanging Fringe Tail
        // Upper & Lower Coiled Neck Scarf Wraps (x: 278..722, y: 335..548)
        const scarfNeckP = bezierPts([
          [[324, 344], [302, 362], [292, 398], [302, 422]],
          [[302, 422], [276, 442], [274, 482], [298, 504]],
          [[298, 504], [375, 542], [492, 554], [608, 535]],
          [[608, 535], [685, 515], [724, 476], [718, 434]],
          [[718, 434], [708, 398], [712, 362], [676, 336]],
          [[676, 336], [648, 378], [568, 412], [468, 412]],
          [[468, 412], [385, 405], [336, 378], [324, 344]]
        ], 16);

        alShape(scarfNeckP, AL.scarfMain, {
          key: key + 'scfNeck', w: 4.2, crayon: AL.scarfShade, crAl: 0.25,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0, bb.y1);
            g.addColorStop(0, AL.scarfLight);
            g.addColorStop(0.55, AL.scarfMain);
            g.addColorStop(1, AL.scarfShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            // Horizontal fold seam dividing upper and lower scarf coils
            alLine(bezierPts([[[298, 424], [395, 468], [505, 482], [602, 475]]], 14), {
              key: key + 'scfCoilSeam', w: 3.6, col: AL.ink
            });
            // Braided cable-knit chevron waves along scarf coils
            for (let row = 0; row < 2; row++) {
              const baseY = row === 0 ? 432 : 498;
              for (let i = 0; i < 7; i++) {
                const bx = 325 + i * 38;
                const by = baseY + Math.sin(i * 0.45) * 18;
                alLine(bezierPts([[[bx - 14, by - 6], [bx, by + 4], [bx + 14, by - 4], [bx + 24, by + 4]]], 8), {
                  key: key + 'sBraid' + row + '_' + i, w: 1.9, col: AL.scarfStitch, second: false
                });
              }
            }
          }
        });

        // LAYER 6: Cradled Two-Tone Roasted Acorn & Fluffy Wool Arms (x: 338..620, y: 495..668)
        withPivot(565, 558, armLRot * 0.4, 1, 1, 0, 0, () => {
          // Acorn Nut Body
          const nutP = bezierPts([
            [[535, 548], [538, 582], [554, 604], [574, 606]],
            [[574, 606], [588, 596], [600, 572], [596, 540]]
          ], 12);
          alShape(nutP, AL.acornNut, { key: key + 'acNut', w: 3.6, crayon: AL.acornCap, crAl: 0.22 });

          // Acorn Cross-Hatched Cap & Stem
          const capP = bezierPts([
            [[528, 552], [525, 526], [546, 510], [568, 512]],
            [[568, 512], [590, 514], [604, 528], [600, 544]],
            [[600, 544], [575, 554], [548, 556], [528, 552]]
          ], 12);
          alShape(capP, AL.acornCap, {
            key: key + 'acCap', w: 3.6,
            innerFn: (bb) => {
              ctx.save();
              ctx.strokeStyle = AL.ink;
              ctx.lineWidth = 1.6;
              for (let x = bb.x0; x <= bb.x1; x += 9) {
                ctx.beginPath(); ctx.moveTo(x, bb.y0); ctx.lineTo(x + 8, bb.y1); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x + 8, bb.y0); ctx.lineTo(x, bb.y1); ctx.stroke();
              }
              ctx.restore();
            }
          });
          // Acorn Stem
          alShape(bezierPts([[[556, 512], [546, 498], [552, 494], [564, 512]]], 8), AL.acornCap, { key: key + 'acStm', w: 3.0 });
        });

        // Left Fluffy Wool Arm & Cloven Hoof Touching Acorn
        withPivot(412, 585, armLRot, 1, 1, 0, 0, () => {
          // Cloven Hoof Tip
          const hoofLP = bezierPts([
            [[512, 575], [536, 560], [555, 565], [556, 582]],
            [[556, 582], [548, 602], [528, 612], [508, 608]]
          ], 10);
          alShape(hoofLP, AL.skinMain, {
            key: key + 'armHfL', w: 3.6,
            innerFn: () => {
              alShape([[534, 558], [558, 558], [558, 606], [534, 606]], AL.hoofMain, { key: key + 'aHfTipL', line: false });
            }
          });
          // Scalloped Fluffy Wool Arm Puff
          const armWoolLP = buildScallopRingPts(432, 598, 86, 56, 10, 10);
          alShape(armWoolLP, AL.woolMain, { key: key + 'armWlL', w: 4.0, crayon: AL.woolShade, crAl: 0.22 });
        });

        // Right Cloven Hoof Peeking Next to Acorn
        withPivot(605, 575, armRRot, 1, 1, 0, 0, () => {
          alShape(bezierPts([
            [[612, 556], [592, 558], [584, 576], [596, 596]],
            [[596, 596], [608, 604], [618, 598], [618, 575]]
          ], 10), AL.skinMain, { key: key + 'armHfR', w: 3.6 });
        });

        // LAYER 7: Front Hanging Mustard Cable-Knit Scarf Tail & 5 Tassel Fringes (Over Right Chest!)
        withPivot(605, 412, -scarfSway, 1, 1, 0, 0, () => {
          const frontScarfP = bezierPts([
            [[522, 412], [568, 382], [618, 385], [656, 435]],
            [[656, 435], [696, 515], [724, 612], [742, 695]],
            [[742, 695], [708, 718], [662, 732], [625, 730]],
            [[625, 730], [612, 635], [602, 535], [575, 458]],
            [[575, 458], [552, 425], [535, 415], [522, 412]]
          ], 16);

          alShape(frontScarfP, AL.scarfMain, {
            key: key + 'scfFront', w: 4.0, crayon: AL.scarfShade, crAl: 0.25,
            innerFn: () => {
              // Vertical Cable-Knit Rib Columns & Braid Chevrons
              alLine(bezierPts([[[585, 402], [625, 495], [648, 615], [662, 728]]], 14), { key: key + 'sRib1', w: 2.2, col: AL.scarfStitch, second: false });
              alLine(bezierPts([[[620, 405], [662, 498], [688, 612], [705, 718]]], 14), { key: key + 'sRib2', w: 2.2, col: AL.scarfStitch, second: false });
              for (let j = 0; j < 7; j++) {
                const cy = 445 + j * 38;
                const cx1 = 612 + j * 6;
                const cx2 = 652 + j * 7;
                alLine([[cx1 - 10, cy - 8], [cx1, cy + 6], [cx1 + 10, cy - 8]], { key: key + 'fBrA' + j, w: 1.8, col: AL.scarfStitch, second: false });
                alLine([[cx2 - 10, cy - 8], [cx2, cy + 6], [cx2 + 10, cy - 8]], { key: key + 'fBrB' + j, w: 1.8, col: AL.scarfStitch, second: false });
              }
            }
          });

          // 5 Hanging Tassel Fringes at Bottom of Front Scarf Tail
          const rTassels = [
            [638, 742, 0.08], [665, 740, 0.05], [696, 735, -0.05], [724, 725, -0.15], [744, 712, -0.25]
          ];
          for (let i = 0; i < rTassels.length; i++) {
            const [tx, ty, rot] = rTassels[i];
            alShape(ellipsePts(tx, ty, 7.5, 19, rot, 12), AL.scarfMain, { key: key + 'tsR' + i, w: 3.2 });
          }
        });

      }); // end torso

      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // CHARACTER C: LOP-EARED BUNNY IN DENIM OVERALLS HOLDING MINT WATERING CAN
    // -------------------------------------------------------------------------
    const WB = {
      bg: '#faf7ef',
      ink: '#573d2d',
      inkSoft: '#82624e',
      inkLight: '#a68872',
      furLight: '#fffdf8',
      furMain: '#f8f1e4',
      furWarm: '#ede1cc',
      furShade: '#d8c5a8',
      earPink: '#eabfb0',
      earShade: '#d4a392',
      denimLight: '#9ab2c2',
      denimMain: '#7d96a6',
      denimShade: '#5d7484',
      denimStitch: '#e8e2d5',
      buttonGold: '#d89e48',
      canLight: '#d2e8d0',
      canMain: '#bad4b8',
      canShade: '#94b492',
      canDark: '#637a62',
      eye: '#472b1d',
      nose: '#eda89c',
      blush: '238,164,112'
    };

    function wbLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? WB.ink, col2: o.col2 ?? WB.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }
    function wbShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? WB.ink), line2: o.line2 ?? WB.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }

    function drawWateringCanBunnyMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'wbHero';
      const isStatic = !rig;

      const breath   = isStatic ? 0 : (rig.breath || 0);
      const bodySway = isStatic ? 0 : (rig.torsoSway || 0);
      const headTilt = isStatic ? 0 : (rig.headTilt || 0);
      const headDX   = isStatic ? 0 : (rig.headTurn || 0);
      const headDY   = isStatic ? 0 : (rig.headNod || 0);
      const earLRot  = isStatic ? 0 : (rig.hairSwayL || 0);
      const earRRot  = isStatic ? 0 : (rig.hairSwayR || 0);
      const armLRot  = isStatic ? 0 : (rig.leftArmLift || 0);
      const armRRot  = isStatic ? 0 : (rig.rightArmLift || 0);
      const canSwing = isStatic ? 0 : (rig.ruffleBounce || 0) * 0.55;
      const blink    = isStatic ? 0 : (rig.blink || 0);
      const gazeX    = isStatic ? 0 : (rig.gazeX || 0) * 0.45;
      const gazeY    = isStatic ? 0 : (rig.gazeY || 0) * 0.45;

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = WB.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'wbPaper', c: '#e6dfd0', al: 0.15, per: 850, len: 11 });
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      // LAYER 1: Ground Contact Shadow & 3-Toed Cream Bunny Feet
      psBlush(505, 882, 185, 25, '135,108,82', 0.22, 0);

      // Left Foot (x: 368..498, y: 825..896)
      withPivot(425, 835, isStatic ? 0 : -bodySway * 0.4, 1, 1, 0, 0, () => {
        const footLP = bezierPts([
          [[368, 832], [374, 868], [412, 892], [456, 896]],
          [[456, 896], [488, 896], [502, 878], [492, 855]],
          [[492, 855], [482, 838], [475, 830], [368, 832]]
        ], 14);
        wbShape(footLP, WB.furMain, { key: key + 'ftL', w: 4.0, crayon: WB.furShade, crAl: 0.24 });
        wbLine(bezierPts([[[455, 865], [462, 880], [465, 890], [466, 895]]], 8), { key: key + 'fLt1', w: 3.0, second: false });
        wbLine(bezierPts([[[476, 860], [484, 875], [488, 885], [488, 890]]], 8), { key: key + 'fLt2', w: 3.0, second: false });
      });

      // Right Foot (x: 530..654, y: 818..884)
      withPivot(585, 828, isStatic ? 0 : bodySway * 0.4, 1, 1, 0, 0, () => {
        const footRP = bezierPts([
          [[532, 825], [546, 858], [585, 880], [625, 882]],
          [[625, 882], [652, 880], [656, 860], [642, 838]],
          [[642, 838], [630, 824], [622, 818], [532, 825]]
        ], 14);
        wbShape(footRP, WB.furMain, { key: key + 'ftR', w: 4.0, crayon: WB.furShade, crAl: 0.24 });
        wbLine(bezierPts([[[612, 852], [620, 868], [624, 876], [625, 880]]], 8), { key: key + 'fRt1', w: 3.0, second: false });
        wbLine(bezierPts([[[630, 846], [638, 862], [642, 870], [644, 875]]], 8), { key: key + 'fRt2', w: 3.0, second: false });
      });

      // BREATHING TORSO HIERARCHY
      withPivot(495, 830, bodySway, 1 + breath * 0.38, 1 + breath, 0, -breath * 26, () => {

        // LAYER 2: Fluffy Cream Cottontail Puff on Left Hip (x: 275..318, y: 652..748)
        withPivot(315, 705, isStatic ? 0 : (rig.ruffleBounce || 0), 1, 1, 0, 0, () => {
          const tailP = buildScallopRingPts(304, 702, 26, 38, 7, 6);
          wbShape(tailP, WB.furWarm, { key: key + 'tail', w: 3.8, crayon: WB.furShade, crAl: 0.25 });
        });

        // Upper Chest & Side Cream Fur Base Under Overalls
        const torsoFurP = bezierPts([
          [[368, 418], [325, 488], [316, 565], [318, 615]],
          [[318, 615], [480, 625], [648, 615], [642, 545]],
          [[642, 545], [635, 475], [615, 425], [595, 415]],
          [[595, 415], [515, 435], [440, 435], [368, 418]]
        ], 14);
        wbShape(torsoFurP, WB.furMain, { key: key + 'torsoFur', w: 4.0, crayon: WB.furShade, crAl: 0.2 });

        // LAYER 3: Dusty Slate-Blue Denim Overalls (Bib, Straps, Brass Buttons, Daisy Pocket & Rolled Cuffs)
        const overallsP = bezierPts([
          [[368, 418], [392, 414], [408, 418], [442, 462]],
          [[442, 462], [462, 485], [525, 485], [574, 478]],
          [[574, 478], [586, 442], [596, 416], [618, 418]],
          [[618, 418], [630, 425], [625, 456], [610, 498]],
          [[610, 498], [614, 545], [635, 595], [658, 622]],
          [[658, 622], [666, 688], [658, 765], [644, 822]],
          [[644, 822], [602, 832], [552, 832], [524, 822]],
          [[524, 822], [522, 804], [505, 802], [492, 804]],
          [[492, 804], [488, 822], [484, 838], [458, 842]],
          [[458, 842], [405, 842], [358, 834], [344, 822]],
          [[344, 822], [322, 775], [308, 712], [308, 642]],
          [[308, 642], [308, 612], [312, 602], [338, 612]],
          [[338, 612], [385, 625], [418, 580], [428, 520]],
          [[428, 520], [402, 482], [382, 452], [368, 418]]
        ], 16);

        wbShape(overallsP, WB.denimMain, {
          key: key + 'overalls', w: 4.0, crayon: WB.denimShade, crAl: 0.28, crA: -1.35,
          grad: (bb) => {
            const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, WB.denimLight);
            g.addColorStop(0.5, WB.denimMain);
            g.addColorStop(1, WB.denimShade);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: (bb) => {
            // White denim cross-grain pencil tooth
            pencil(bb, { key: key + 'dTooth', c: '#e8eff4', al: 0.22, per: 85, len: 15, a: -1.45, w: 1.1 });

            // Left & Right Shoulder Straps Overlapping Bib Corners + Brass Buttons
            const strapLP = bezierPts([
              [[368, 418], [408, 416], [456, 468], [466, 495]],
              [[466, 495], [468, 512], [454, 518], [438, 512]],
              [[438, 512], [412, 478], [385, 448], [368, 418]]
            ], 12);
            wbShape(strapLP, WB.denimLight, { key: key + 'strpL', w: 3.4 });
            wbShape(ellipsePts(450, 498, 9.5, 9.5, 0, 14), WB.buttonGold, { key: key + 'btnL', w: 2.8 });

            const strapRP = bezierPts([
              [[596, 416], [625, 418], [624, 462], [608, 504]],
              [[608, 504], [600, 516], [584, 514], [578, 500]],
              [[578, 500], [584, 468], [590, 438], [596, 416]]
            ], 12);
            wbShape(strapRP, WB.denimLight, { key: key + 'strpR', w: 3.4 });
            wbShape(ellipsePts(594, 492, 9.5, 9.5, 0, 14), WB.buttonGold, { key: key + 'btnR', w: 2.8 });

            // Center Bib Shield Pocket & Embroidered White Daisy
            const pocketP = bezierPts([
              [[472, 515], [525, 515], [574, 512], [576, 558]],
              [[576, 558], [576, 588], [552, 608], [526, 612]],
              [[526, 612], [496, 608], [472, 586], [472, 515]]
            ], 12);
            wbShape(pocketP, WB.denimMain, { key: key + 'bibPkt', w: 3.0 });
            // Dashed white stitching inside pocket
            ctx.save();
            ctx.strokeStyle = WB.denimStitch;
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 4]);
            trace(bezierPts([[[478, 522], [570, 518], [568, 584], [526, 605]]], 10), false);
            ctx.stroke();
            ctx.restore();

            // Embroidered 8-Petal Daisy on Bib Pocket at (528, 556)
            for (let p = 0; p < 8; p++) {
              const a = (p / 8) * TAU;
              wbShape(ellipsePts(528 + Math.cos(a) * 16, 556 + Math.sin(a) * 16, 9, 4.5, a, 10), '#ffffff', {
                key: key + 'dsyP' + p, w: 1.8, second: false
              });
            }
            wbShape(ellipsePts(528, 556, 7.5, 7.5, 0, 12), WB.buttonGold, { key: key + 'dsyC', w: 2.0, second: false });

            // Side Pocket Seam Curves & Rolled Ankle Cuffs
            wbLine(bezierPts([[[336, 612], [334, 652], [352, 678], [385, 642]]], 10), { key: key + 'sPktL', w: 3.0, second: false });
            wbLine(bezierPts([[[342, 800], [402, 808], [456, 808], [488, 802]]], 10), { key: key + 'cuffL', w: 3.2, second: false });
            wbLine(bezierPts([[[524, 798], [568, 802], [612, 800], [648, 792]]], 10), { key: key + 'cuffR', w: 3.2, second: false });
          }
        });

        // LAYER 4: Sage-Mint Watering Can Held in Front of Overalls (Pivoted at (532, 635))
        withPivot(532, 635, canSwing, 1, 1, 0, 0, () => {
          // Curved Top Wire Handle & Side D-Handle
          const topHandleP = bezierPts([
            [[465, 665], [462, 622], [508, 608], [552, 622]],
            [[552, 622], [588, 635], [596, 668], [588, 695]],
            [[588, 695], [580, 695], [582, 668], [574, 646]],
            [[574, 646], [552, 625], [508, 618], [478, 636]],
            [[478, 636], [468, 652], [468, 678], [475, 725]],
            [[475, 725], [465, 722], [458, 695], [465, 665]]
          ], 14);
          wbShape(topHandleP, WB.canMain, { key: key + 'canHdl', w: 3.2 });

          // Tubular Spout & Sprinkler Rose Head on Right (x: 568..656, y: 686..765)
          const spoutP = bezierPts([
            [[568, 735], [595, 718], [622, 704], [634, 698]],
            [[634, 698], [638, 706], [642, 714], [636, 718]],
            [[636, 718], [612, 736], [588, 754], [565, 766]]
          ], 10);
          wbShape(spoutP, WB.canMain, { key: key + 'canSpout', w: 3.2, crayon: WB.canShade });

          // Sprinkler Rose Cone & Oval Face with 5 Holes
          wbShape(ellipsePts(644, 706, 8, 19, -0.45, 14), WB.canLight, {
            key: key + 'canRose', w: 3.0,
            innerFn: () => {
              const holes = [[641, 696], [645, 702], [642, 707], [647, 711], [644, 716]];
              for (let h = 0; h < holes.length; h++) {
                ctx.fillStyle = WB.ink;
                ctx.beginPath(); ctx.arc(holes[h][0], holes[h][1], 1.6, 0, TAU); ctx.fill();
              }
            }
          });

          // Main Cylindrical Mint Watering Can Body
          const canBodyP = bezierPts([
            [[492, 665], [482, 705], [474, 738], [468, 756]],
            [[468, 756], [492, 776], [534, 786], [568, 782]],
            [[568, 782], [576, 748], [584, 712], [590, 682]],
            [[590, 682], [556, 678], [520, 672], [492, 665]]
          ], 14);
          wbShape(canBodyP, WB.canMain, {
            key: key + 'canBody', w: 3.6, crayon: WB.canShade, crAl: 0.22,
            grad: (bb) => {
              const g = ctx.createLinearGradient(bb.x0, 0, bb.x1, 0);
              g.addColorStop(0, WB.canLight);
              g.addColorStop(0.55, WB.canMain);
              g.addColorStop(1, WB.canShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Embossed horizontal rib bands around cylinder
              wbLine(bezierPts([[[484, 696], [518, 712], [556, 718], [584, 714]]], 10), { key: key + 'cRib1', w: 2.0, col: WB.inkSoft, second: false });
              wbLine(bezierPts([[[472, 748], [505, 766], [542, 772], [570, 768]]], 10), { key: key + 'cRib2', w: 2.0, col: WB.inkSoft, second: false });
            }
          });

          // Top Opening Rim & Half-Cover Shield
          wbShape(ellipsePts(542, 674, 49, 13, 0.16, 20), WB.canDark, { key: key + 'canTopIn', w: 3.2 });
          const shieldP = bezierPts([
            [[534, 686], [552, 668], [562, 660], [578, 668]],
            [[578, 668], [592, 676], [592, 688], [576, 692]],
            [[576, 692], [556, 692], [542, 688], [534, 686]]
          ], 10);
          wbShape(shieldP, WB.canLight, { key: key + 'canShld', w: 3.0 });
        });

        // LAYER 5: Left & Right Cream Arms Gripping Watering Can Handle (Open-Contour Shoulder Joins!)
        withPivot(365, 485, armLRot, 1, 1, 0, 0, () => {
          const armLP = bezierPts([
            [[342, 458], [318, 525], [336, 602], [405, 646]],
            [[405, 646], [456, 672], [498, 665], [506, 636]],
            [[506, 636], [512, 608], [485, 582], [452, 562]],
            [[452, 562], [428, 525], [408, 485], [395, 456]]
          ], 16);
          wbShape(armLP, WB.furMain, {
            key: key + 'armL', line: false, crayon: WB.furShade, crAl: 0.22,
            innerFn: () => {
              psBlush(425, 628, 65, 28, '212,190,158', 0.55, 0.25);
            }
          });
          wbLine(bezierPts([
            [[342, 465], [318, 525], [336, 602], [405, 646]],
            [[405, 646], [456, 672], [498, 665], [506, 636]],
            [[506, 636], [512, 608], [485, 582], [452, 562]],
            [[452, 562], [434, 535], [418, 505], [408, 482]]
          ], 16), { key: key + 'armLOut', w: 4.0 });
          wbLine([[478, 646], [498, 638]], { key: key + 'pLt1', w: 2.8, second: false });
        });

        withPivot(625, 478, armRRot, 1, 1, 0, 0, () => {
          const armRP = bezierPts([
            [[632, 452], [678, 512], [688, 578], [652, 625]],
            [[652, 625], [618, 658], [572, 658], [562, 632]],
            [[562, 632], [552, 605], [575, 575], [602, 548]],
            [[602, 548], [612, 515], [618, 482], [622, 455]]
          ], 16);
          wbShape(armRP, WB.furMain, {
            key: key + 'armR', line: false, crayon: WB.furShade, crAl: 0.22,
            innerFn: () => {
              psBlush(620, 615, 55, 26, '212,190,158', 0.55, -0.25);
            }
          });
          wbLine(bezierPts([
            [[634, 458], [678, 512], [688, 578], [652, 625]],
            [[652, 625], [618, 658], [572, 658], [562, 632]],
            [[562, 632], [552, 605], [575, 575], [602, 548]],
            [[602, 548], [610, 522], [615, 495], [618, 478]]
          ], 16), { key: key + 'armROut', w: 4.0 });
          wbLine([[582, 625], [566, 642]], { key: key + 'pRt1', w: 2.8, second: false });
        });

        // LAYER 6..10: LOP-EARED BUNNY HEAD, FLOPPY EARS, Y-NOSE & DEFORMING EYES
        withPivot(500, 425, headTilt, 1, 1, headDX, headDY, () => {

          // Right Floppy Lop Ear (Tucked slightly behind right cheek, Pivoted at (618, 215))
          withPivot(618, 215, earRRot, 1, 1, 0, 0, () => {
            const earRP = bezierPts([
              [[602, 186], [638, 212], [676, 285], [705, 368]],
              [[705, 368], [728, 434], [732, 488], [708, 504]],
              [[708, 504], [685, 512], [652, 475], [634, 418]],
              [[634, 418], [620, 355], [612, 275], [602, 186]]
            ], 16);
            wbShape(earRP, WB.furMain, {
              key: key + 'earR', w: 4.0, crayon: WB.furShade, crAl: 0.22,
              innerFn: () => {
                const earInRP = bezierPts([
                  [[642, 325], [678, 368], [702, 435], [696, 482]],
                  [[696, 482], [676, 495], [652, 456], [642, 398]]
                ], 12);
                wbShape(earInRP, WB.earPink, { key: key + 'earInR', line: false, crayon: WB.earShade, crAl: 0.28 });
              }
            });
          });

          // Main Round Mochi Bunny Head (x: 358..664, y: 122..448)
          const headP = bezierPts([
            [[362, 195], [418, 138], [492, 122], [568, 138]],
            [[568, 138], [618, 165], [648, 238], [658, 326]],
            [[658, 326], [666, 388], [625, 434], [545, 446]],
            [[545, 446], [462, 452], [388, 428], [368, 368]],
            [[368, 368], [358, 305], [358, 245], [362, 195]]
          ], 18);

          wbShape(headP, WB.furMain, {
            key: key + 'headBase', line: false, crayon: WB.furShade, crAl: 0.16,
            grad: (bb) => {
              const g = ctx.createRadialGradient(515, 285, 25, 515, 315, 185);
              g.addColorStop(0, WB.furLight);
              g.addColorStop(0.7, WB.furMain);
              g.addColorStop(1, WB.furWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Snowy-White Muzzle Glow & Warm Chin Shade
              psBlush(538, 358, 65, 52, '255,253,248', 0.88, 0);
              psBlush(495, 435, 115, 28, '212,190,158', 0.65, 0);

              // Warm Apricot Cheek Blushes + 4 Diagonal Hatch Lines
              psBlush(432, 362, 42, 26, WB.blush, 0.72, 0.08);
              psBlush(634, 344, 30, 22, WB.blush, 0.72, -0.08);
            }
          });

          for (let i = 0; i < 4; i++) {
            wbLine([[408 + i * 8, 364], [416 + i * 8, 350]], { key: key + 'chL' + i, w: 1.9, col: '#b86d43', second: false });
            wbLine([[622 + i * 6, 346], [628 + i * 6, 334]], { key: key + 'chR' + i, w: 1.9, col: '#b86d43', second: false });
          }

          // Top Crown Tuft & Lower Jaw Open-Contour Line
          wbLine(bezierPts([
            [[358, 198], [415, 142], [468, 128], [508, 118]],
            [[508, 118], [500, 126], [496, 130], [525, 122]],
            [[525, 122], [575, 138], [618, 168], [642, 225]]
          ], 14), { key: key + 'crnLine', w: 4.0 });

          wbLine(bezierPts([
            [[374, 368], [388, 428], [462, 452], [545, 446]],
            [[545, 446], [625, 434], [666, 388], [658, 326]]
          ], 16), { key: key + 'jawLine', w: 4.0 });

          // Delicate Eyebrows & Nose-Bridge Fur Ticks
          wbLine([[442, 256], [452, 246]], { key: key + 'brwL', w: 1.9, col: WB.inkSoft, second: false });
          wbLine([[602, 240], [610, 248]], { key: key + 'brwR', w: 1.9, col: WB.inkSoft, second: false });
          for (let i = 0; i < 5; i++) {
            wbLine([[528 + i * 8, 304], [528 + i * 8, 314]], { key: key + 'nbT' + i, w: 1.6, col: WB.inkLight, second: false });
          }

          // 3-Stage Deforming Eyelid Blink Eyes
          const drawBunnyEye = (ex, ey, erx, ery, eKey) => {
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 6, clipTop, (erx + 6) * 2, ery * 2.5);
              ctx.clip();
              wbShape(ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 18), WB.eye, {
                key: key + eKey, w: 2.0, line: WB.eye, second: false
              });
              ctx.fillStyle = 'rgba(255,250,242,0.85)';
              ctx.beginPath();
              ctx.ellipse(ex + gazeX + erx * 0.25, ey + gazeY - ery * 0.22, 2.5, 3.2, 0, 0, TAU);
              ctx.fill();
              ctx.restore();
            }
            if (u > 0.12) {
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 8;
              wbLine(bezierPts([
                [[ex - erx - 3, ey + u * 2], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 2]]
              ], 8), { key: key + eKey + 'Lid', w: 3.6, col: WB.eye, second: false });
            }
          };

          drawBunnyEye(454, 314, 12.5, 16.0, 'bEyeL');
          drawBunnyEye(608, 300, 11.5, 15.0, 'bEyeR');

          // Soft Pink V-Nose & Inverted-Y Mouth ('ㅅ')
          psBlush(550, 326, 22, 14, '237,168,156', 0.78, 0);
          wbLine(bezierPts([[[536, 332], [546, 338], [552, 344], [554, 346]]], 8), { key: key + 'nV1', w: 3.2, col: WB.eye, second: false });
          wbLine(bezierPts([[[568, 328], [560, 336], [555, 342], [554, 346]]], 8), { key: key + 'nV2', w: 3.2, col: WB.eye, second: false });
          wbLine([[554, 345], [554, 368]], { key: key + 'phil', w: 3.0, col: WB.eye, second: false });
          wbLine([[554, 366], [544, 376]], { key: key + 'mthL', w: 2.8, col: WB.eye, second: false });
          wbLine([[554, 366], [562, 375]], { key: key + 'mthR', w: 2.8, col: WB.eye, second: false });

          // Long Left Floppy Lop Ear (Overlapping Left Temple, Pivoted at (375, 225))
          withPivot(375, 225, earLRot, 1, 1, 0, 0, () => {
            const earLP = bezierPts([
              [[365, 192], [322, 228], [285, 308], [254, 392]],
              [[254, 392], [234, 456], [244, 518], [272, 535]],
              [[272, 535], [302, 536], [344, 495], [362, 434]],
              [[362, 434], [374, 368], [376, 302], [392, 248]]
            ], 18);
            wbShape(earLP, WB.furMain, {
              key: key + 'earL', line: false, crayon: WB.furShade, crAl: 0.22,
              innerFn: () => {
                psBlush(295, 455, 42, 68, '222,198,166', 0.65, 0.25);
              }
            });
            wbLine(earLP, { key: key + 'earLOut', w: 4.2 });
            wbLine(bezierPts([[[390, 252], [374, 312], [366, 375], [358, 435]]], 12), {
              key: key + 'earFoldL', w: 2.6, col: WB.inkSoft, second: false
            });
          });

        }); // end head
      }); // end torso

      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // CHARACTER D: POSTMAN DUCKLING IN TWEED NEWSBOY CAP & SATCHEL W/ LOVE LETTER
    // -------------------------------------------------------------------------
    const PD = {
      bg: '#faf7ef',
      ink: '#543928',
      inkSoft: '#7e5b45',
      inkLight: '#a6856e',
      downLight: '#fff6d4',
      downMain: '#fae39c',
      downWarm: '#f0cc75',
      downShade: '#d9ae52',
      billLight: '#f6ad62',
      billMain: '#eb9448',
      billShade: '#c76e28',
      capLight: '#cbb396',
      capMain: '#b89f82',
      capDark: '#8c7258',
      strapBrown: '#684732',
      bagLight: '#a3a078',
      bagMain: '#8c8962',
      bagDark: '#6d6a48',
      envPaper: '#fbf6eb',
      envShade: '#e3dac6',
      heartRed: '#c94a38',
      eye: '#462a1b',
      blush: '234,136,88'
    };

    function pdLine(P, o = {}) {
      return psLine(P, { ...o, col: o.col ?? PD.ink, col2: o.col2 ?? PD.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }
    function pdShape(P, fill, o = {}) {
      return psShape(P, fill, { ...o, line: o.line === false ? false : (o.line ?? PD.ink), line2: o.line2 ?? PD.inkSoft, w: o.w ?? 4.0, amt: o.amt ?? 0.95 });
    }

    function drawPostmanDucklingMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const key = 'pdHero';
      const isStatic = !rig;

      const breath   = isStatic ? 0 : (rig.breath || 0);
      const bodySway = isStatic ? 0 : (rig.torsoSway || 0);
      const headTilt = isStatic ? 0 : (rig.headTilt || 0);
      const headDX   = isStatic ? 0 : (rig.headTurn || 0);
      const headDY   = isStatic ? 0 : (rig.headNod || 0);
      const capTilt  = isStatic ? 0 : (rig.hairSwayL || 0) * 0.45;
      const wingLRot = isStatic ? 0 : (rig.leftArmLift || 0);
      const wingRRot = isStatic ? 0 : (rig.rightArmLift || 0);
      const letterWob= isStatic ? 0 : (rig.ruffleBounce || 0) * 0.65;
      const blink    = isStatic ? 0 : (rig.blink || 0);
      const gazeX    = isStatic ? 0 : (rig.gazeX || 0) * 0.45;
      const gazeY    = isStatic ? 0 : (rig.gazeY || 0) * 0.45;

      ctx.save();
      if (!StudioState.transparentBg) {
        ctx.fillStyle = PD.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        pencil({ x0: 20, y0: 20, x1: 980, y1: 980 }, { key: 'pdPaper', c: '#e6dfd0', al: 0.15, per: 850, len: 11 });
      } else {
        ctx.clearRect(0, 0, 1000, 1000);
      }

      // LAYER 1: Ground Shadow & Webbed Orange Duckling Feet
      psBlush(500, 848, 175, 24, '135,108,82', 0.22, 0);

      // Left Webbed Foot (x: 380..462, y: 788..855)
      withPivot(438, 795, isStatic ? 0 : -bodySway * 0.5, 1, 1, 0, 0, () => {
        const footLP = bezierPts([
          [[430, 788], [432, 812], [412, 822], [382, 834]],
          [[382, 834], [398, 842], [404, 838], [392, 848]],
          [[392, 848], [412, 848], [424, 844], [430, 854]],
          [[430, 854], [442, 856], [456, 842], [458, 825]],
          [[458, 825], [454, 808], [452, 795], [452, 788]]
        ], 12);
        pdShape(footLP, PD.billMain, { key: key + 'ftL', w: 3.8, crayon: PD.billShade, crAl: 0.25 });
      });

      // Right Webbed Foot (x: 534..618, y: 788..855)
      withPivot(568, 795, isStatic ? 0 : bodySway * 0.5, 1, 1, 0, 0, () => {
        const footRP = bezierPts([
          [[558, 788], [558, 812], [546, 828], [534, 844]],
          [[534, 844], [552, 848], [564, 844], [574, 854]],
          [[574, 854], [586, 854], [595, 844], [616, 845]],
          [[616, 845], [608, 830], [590, 818], [582, 808]],
          [[582, 808], [580, 796], [580, 790], [580, 788]]
        ], 12);
        pdShape(footRP, PD.billMain, { key: key + 'ftR', w: 3.8, crayon: PD.billShade, crAl: 0.25 });
      });

      // BREATHING TORSO HIERARCHY
      withPivot(495, 790, bodySway, 1 + breath * 0.4, 1 + breath, 0, -breath * 25, () => {

        // LAYER 2: Left Wing Flipper (Pivoted at (345, 505))
        withPivot(345, 505, wingLRot, 1, 1, 0, 0, () => {
          const wingLP = bezierPts([
            [[348, 478], [308, 515], [274, 565], [264, 604]],
            [[264, 604], [262, 624], [282, 628], [304, 605]],
            [[304, 605], [322, 582], [336, 555], [348, 535]]
          ], 14);
          pdShape(wingLP, PD.downMain, { key: key + 'wingL', w: 3.8, crayon: PD.downShade, crAl: 0.25 });
        });

        // LAYER 3: Plump Fluffy Buttercup-Yellow Duckling Body (x: 295..695, y: 455..798)
        const bodyP = bezierPts([
          [[352, 468], [312, 535], [295, 625], [314, 708]],
          [[314, 708], [336, 768], [412, 798], [502, 798]],
          [[502, 798], [595, 798], [662, 765], [685, 705]],
          [[685, 705], [702, 635], [685, 540], [642, 468]],
          [[642, 468], [560, 485], [435, 485], [352, 468]]
        ], 18);

        pdShape(bodyP, PD.downMain, {
          key: key + 'body', line: false, crayon: PD.downShade, crAl: 0.22,
          grad: (bb) => {
            const g = ctx.createRadialGradient(465, 615, 25, 485, 635, 215);
            g.addColorStop(0, PD.downLight);
            g.addColorStop(0.65, PD.downMain);
            g.addColorStop(1, PD.downWarm);
            ctx.fillStyle = g;
            ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
          },
          innerFn: () => {
            psBlush(495, 765, 155, 42, '217,174,82', 0.55, 0);
            // Soft feather texture ticks across chest & belly
            const downTicks = [
              [[352, 552], [344, 566]], [[368, 565], [362, 578]], [[412, 618], [410, 634]],
              [[426, 624], [425, 638]], [[502, 554], [506, 568]], [[515, 558], [520, 570]],
              [[368, 708], [375, 722]], [[382, 714], [390, 726]], [[468, 738], [476, 752]]
            ];
            for (let i = 0; i < downTicks.length; i++) {
              pdLine(downTicks[i], { key: key + 'dTk' + i, w: 1.7, col: PD.inkLight, second: false });
            }
          }
        });

        // Fluffy Feathered Body Contour with Soft Downy Tufts
        pdLine(bezierPts([
          [[312, 555], [298, 615], [298, 675], [318, 725]],
          [[318, 725], [344, 775], [415, 798], [502, 798]],
          [[502, 798], [588, 798], [652, 772], [678, 725]]
        ], 16), { key: key + 'bOut', w: 4.0 });

        // LAYER 4: Crossbody Leather Strap, Olive Messenger Satchel & Love Letter Envelope
        // Brown Leather Crossbody Strap (x: 348..556, y: 462..642)
        const strapP = bezierPts([
          [[348, 472], [398, 535], [468, 595], [538, 640]],
          [[538, 640], [552, 632], [558, 622], [546, 614]],
          [[546, 614], [478, 574], [412, 515], [362, 462]],
          [[362, 462], [354, 464], [348, 468], [348, 472]]
        ], 14);
        pdShape(strapP, PD.strapBrown, { key: key + 'strap', w: 3.6 });

        // Olive-Moss Messenger Bag Satchel on Right Hip (x: 534..716, y: 592..748)
        withPivot(615, 655, letterWob * 0.35, 1, 1, 0, 0, () => {
          const bagBodyP = bezierPts([
            [[534, 635], [538, 688], [548, 735], [568, 745]],
            [[568, 745], [612, 750], [678, 738], [708, 714]],
            [[708, 714], [718, 695], [712, 645], [696, 602]],
            [[696, 602], [642, 592], [575, 602], [534, 635]]
          ], 14);
          pdShape(bagBodyP, PD.bagMain, {
            key: key + 'bagBody', w: 3.8, crayon: PD.bagDark, crAl: 0.25,
            innerFn: () => {
              // Side Gusset Seam & Strap Tab
              pdLine(bezierPts([[[558, 622], [568, 678], [582, 725], [596, 744]]], 10), { key: key + 'bgGus', w: 3.0, second: false });
              pdShape([[534, 632], [556, 626], [560, 662], [538, 666]], PD.bagLight, { key: key + 'bgTab', w: 2.8 });
            }
          });

          // Bag Top Flap with Dashed Stitching
          const bagFlapP = bezierPts([
            [[546, 614], [595, 592], [648, 590], [685, 602]],
            [[685, 602], [688, 638], [678, 676], [645, 685]],
            [[645, 685], [602, 692], [582, 684], [572, 656]],
            [[572, 656], [562, 628], [554, 616], [546, 614]]
          ], 14);
          pdShape(bagFlapP, PD.bagLight, { key: key + 'bgFlap', w: 3.6, crayon: PD.bagMain });
          ctx.save();
          ctx.strokeStyle = PD.ink;
          ctx.lineWidth = 2.0;
          ctx.setLineDash([5, 5]);
          trace(bezierPts([[[566, 620], [582, 674], [625, 680], [672, 668]]], 10), false);
          ctx.stroke();
          ctx.restore();

          // Cream Love-Letter Envelope Tucked Under Wing w/ Red Heart Wax Seal!
          withPivot(712, 638, letterWob, 1, 1, 0, 0, () => {
            const envP = bezierPts([
              [[642, 628], [692, 598], [732, 578], [748, 572]],
              [[748, 572], [762, 604], [776, 636], [785, 652]],
              [[785, 652], [748, 675], [708, 696], [680, 708]],
              [[680, 708], [666, 682], [652, 652], [642, 628]]
            ], 12);
            pdShape(envP, PD.envPaper, {
              key: key + 'env', w: 3.4, crayon: PD.envShade, crAl: 0.2,
              innerFn: () => {
                // Envelope Flap V-Fold Lines
                pdLine([[644, 630], [722, 646], [748, 574]], { key: key + 'envFlp', w: 2.4, col: PD.inkSoft, second: false });
                pdLine([[680, 706], [712, 644]], { key: key + 'envBot1', w: 2.0, col: PD.inkLight, second: false });
                pdLine([[784, 652], [730, 634]], { key: key + 'envBot2', w: 2.0, col: PD.inkLight, second: false });
              }
            });

            // Red Heart Wax Seal on Envelope Center (722, 640)
            const heartP = bezierPts([
              [[720, 636], [724, 626], [734, 626], [735, 636]],
              [[735, 636], [736, 646], [728, 654], [722, 656]],
              [[722, 656], [714, 654], [706, 646], [708, 638]],
              [[708, 638], [710, 632], [716, 632], [720, 636]]
            ], 10);
            pdShape(heartP, PD.heartRed, { key: key + 'heartSeal', w: 2.6, second: false });
          });
        });

        // LAYER 5: Right Fluffy Wing Resting Over the Envelope (Pivoted at (635, 495))
        withPivot(635, 495, wingRRot, 1, 1, 0, 0, () => {
          const wingRP = bezierPts([
            [[638, 468], [685, 498], [722, 548], [728, 592]],
            [[728, 592], [730, 616], [708, 626], [682, 612]],
            [[682, 612], [648, 594], [618, 566], [602, 538]]
          ], 14);
          pdShape(wingRP, PD.downMain, {
            key: key + 'wingR', line: false, crayon: PD.downShade, crAl: 0.22
          });
          pdLine(wingRP, { key: key + 'wingROut', w: 3.8 });
        });

        // LAYER 6..10: FLUFFY DUCKLING HEAD, ORANGE BILL, DEFORMING EYES & TWEED NEWSBOY CAP
        withPivot(495, 435, headTilt, 1, 1, headDX, headDY, () => {

          // Plump Pear-Shaped Fluffy Duckling Head (x: 326..668, y: 225..482)
          const headP = bezierPts([
            [[388, 245], [455, 225], [545, 232], [618, 275]],
            [[618, 275], [656, 326], [672, 388], [654, 438]],
            [[654, 438], [625, 476], [558, 488], [492, 486]],
            [[492, 486], [420, 484], [352, 456], [332, 405]],
            [[332, 405], [322, 355], [352, 292], [388, 245]]
          ], 18);

          pdShape(headP, PD.downMain, {
            key: key + 'head', line: false, crayon: PD.downShade, crAl: 0.18,
            grad: (bb) => {
              const g = ctx.createRadialGradient(485, 345, 20, 495, 365, 185);
              g.addColorStop(0, PD.downLight);
              g.addColorStop(0.68, PD.downMain);
              g.addColorStop(1, PD.downWarm);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            },
            innerFn: () => {
              // Warm Coral-Apricot Cheek Blushes + 5 Diagonal Hatch Ticks
              psBlush(372, 388, 36, 24, PD.blush, 0.72, 0.12);
              psBlush(592, 395, 38, 25, PD.blush, 0.72, -0.08);
            }
          });

          for (let i = 0; i < 5; i++) {
            pdLine([[352 + i * 7, 392], [359 + i * 7, 378]], { key: key + 'chL' + i, w: 1.9, col: '#b55b32', second: false });
            pdLine([[572 + i * 7, 398], [579 + i * 7, 384]], { key: key + 'chR' + i, w: 1.9, col: '#b55b32', second: false });
          }

          // Fluffy Cheek Outlines with Downy Fur Tufts
          pdLine(bezierPts([
            [[388, 248], [355, 295], [332, 355], [326, 385]],
            [[326, 385], [332, 425], [362, 458], [412, 476]]
          ], 14), { key: key + 'hLineL', w: 3.8 });

          pdLine(bezierPts([
            [[628, 288], [662, 342], [668, 395], [652, 442]],
            [[652, 442], [634, 466], [602, 478], [568, 484]]
          ], 14), { key: key + 'hLineR', w: 3.8 });

          // 3-Stage Deforming Eyelid Blink Eyes
          const drawDuckEye = (ex, ey, erx, ery, eKey) => {
            const u = Math.max(0, Math.min(1, blink));
            if (u < 0.88) {
              ctx.save();
              const clipTop = ey - ery - 2 + u * (ery * 2.1);
              ctx.beginPath();
              ctx.rect(ex - erx - 6, clipTop, (erx + 6) * 2, ery * 2.5);
              ctx.clip();
              pdShape(ellipsePts(ex + gazeX, ey + gazeY, erx, ery, 0, 18), PD.eye, {
                key: key + eKey, w: 2.0, line: PD.eye, second: false
              });
              ctx.restore();
            }
            if (u > 0.12) {
              const lidY = ey - ery * (1 - u * 1.15);
              const arch = (u - 0.5) * 8;
              pdLine(bezierPts([
                [[ex - erx - 3, ey + u * 2], [ex - erx * 0.4, lidY + arch], [ex + erx * 0.4, lidY + arch], [ex + erx + 3, ey + u * 2]]
              ], 8), { key: key + eKey + 'Lid', w: 3.6, col: PD.eye, second: false });
            }
          };

          drawDuckEye(404, 354, 11.5, 15.0, 'dEyeL');
          drawDuckEye(560, 358, 11.5, 15.0, 'dEyeR');

          // Tangerine-Orange Duckling Bill (Upper Mandible + Smiling Lower Lip + Nostrils)
          const lowerBillP = bezierPts([
            [[426, 396], [455, 422], [492, 422], [518, 398]],
            [[518, 398], [488, 395], [456, 395], [426, 396]]
          ], 10);
          pdShape(lowerBillP, PD.billShade, { key: key + 'billLow', w: 3.4 });

          const upperBillP = bezierPts([
            [[418, 392], [424, 378], [442, 374], [456, 360]],
            [[456, 360], [472, 348], [492, 358], [506, 374]],
            [[506, 374], [520, 380], [528, 386], [526, 395]],
            [[526, 395], [504, 405], [442, 404], [418, 392]]
          ], 14);
          pdShape(upperBillP, PD.billMain, {
            key: key + 'billUp', w: 3.6,
            grad: (bb) => {
              const g = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
              g.addColorStop(0, PD.billLight);
              g.addColorStop(0.65, PD.billMain);
              g.addColorStop(1, PD.billShade);
              ctx.fillStyle = g;
              ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
            }
          });
          // Nostrils
          ctx.fillStyle = PD.ink;
          ctx.beginPath();
          ctx.arc(456, 376, 2.4, 0, TAU);
          ctx.arc(488, 377, 2.4, 0, TAU);
          ctx.fill();

          // Herringbone Tweed Newsboy Cap (Pivoted at (515, 225))
          withPivot(515, 225, capTilt, 1, 1, 0, 0, () => {
            // Cap Crown Dome
            const capCrownP = bezierPts([
              [[396, 228], [388, 198], [428, 165], [495, 154]],
              [[495, 154], [568, 148], [628, 188], [652, 244]],
              [[652, 244], [662, 272], [652, 290], [634, 290]],
              [[634, 290], [568, 275], [468, 250], [396, 228]]
            ], 16);

            pdShape(capCrownP, PD.capMain, {
              key: key + 'capCrown', w: 4.0, crayon: PD.capDark, crAl: 0.25,
              innerFn: (bb) => {
                // Curved Tweed Panel Seams radiating from top button (568, 158)
                pdLine(bezierPts([[[565, 158], [505, 172], [448, 195], [412, 228]]], 10), { key: key + 'cSm1', w: 2.6, col: PD.ink, second: false });
                pdLine(bezierPts([[[568, 158], [558, 192], [538, 228], [516, 262]]], 10), { key: key + 'cSm2', w: 2.6, col: PD.ink, second: false });
                pdLine(bezierPts([[[572, 158], [596, 195], [602, 238], [594, 278]]], 10), { key: key + 'cSm3', w: 2.6, col: PD.ink, second: false });

                // Herringbone Chevron Texture Ticks across Panels
                for (let p = 0; p < 18; p++) {
                  const tx = 425 + (p % 6) * 36;
                  const ty = 178 + Math.floor(p / 6) * 26 + (p % 2) * 8;
                  pdLine([[tx - 6, ty + 4], [tx, ty - 4], [tx + 6, ty + 4]], {
                    key: key + 'twd' + p, w: 1.6, col: PD.capDark, second: false
                  });
                }
              }
            });

            // Top Button on Cap Crown
            pdShape(ellipsePts(568, 156, 14, 7.5, 0.25, 14), PD.capLight, { key: key + 'capBtn', w: 3.2 });

            // Curved Newsboy Cap Visor Brim
            const visorP = bezierPts([
              [[372, 256], [398, 228], [468, 226], [534, 245]],
              [[534, 245], [575, 258], [594, 268], [588, 275]],
              [[588, 275], [534, 274], [456, 252], [385, 258]],
              [[385, 258], [374, 260], [370, 258], [372, 256]]
            ], 14);
            pdShape(visorP, PD.capLight, { key: key + 'capVisor', w: 3.8, crayon: PD.capDark });
          });

        }); // end head
      }); // end torso

      ctx.restore();
    }

    // =========================================================================
    // 5D. PHOTOREALISTIC PORCELAIN BJD ENGINE (AUTO WHITE-BG REMOVAL + 18-PART PHOTO RIG + 3D AIRBRUSHED FALLBACK)
    // =========================================================================
    const BJDPhotoRig = {
      loaded: false,
      cleanCanvas: null, // 1000x1500 background-free photorealistic plate
      parts: {}          // Pre-sliced feathered anatomical cutout canvases
    };

    // Automatically removes the studio white background (#FFFFFF) from the BJD photo while preserving soft hair wisps and ivory silk camisole!
    function removeWhiteBackgroundFloodFill(imgElement) {
      const W = 1000, H = 1500;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const cctx = c.getContext('2d');

      // Fit uploaded image into 1000x1500 preserving aspect ratio
      const scale = Math.min(W / imgElement.width, H / imgElement.height);
      const dw = imgElement.width * scale;
      const dh = imgElement.height * scale;
      const dx = (W - dw) * 0.5;
      const dy = (H - dh) * 0.5;

      cctx.fillStyle = '#ffffff';
      cctx.fillRect(0, 0, W, H);
      cctx.drawImage(imgElement, dx, dy, dw, dh);

      const imgData = cctx.getImageData(0, 0, W, H);
      const data = imgData.data;
      const visited = new Uint8Array(W * H);
      const isBg = new Uint8Array(W * H);
      const queue = new Int32Array(W * H);
      let qHead = 0, qTail = 0;

      const pushSeed = (x, y) => {
        const idx = y * W + x;
        if (!visited[idx]) {
          visited[idx] = 1;
          queue[qTail++] = idx;
        }
      };

      // Seed all 4 borders of the 1000x1500 studio photo
      for (let x = 0; x < W; x++) { pushSeed(x, 0); pushSeed(x, H - 1); }
      for (let y = 0; y < H; y++) { pushSeed(0, y); pushSeed(W - 1, y); }

      // Flood-fill exterior studio white background (protects interior ivory silk camisole & eye catchlights!)
      while (qHead < qTail) {
        const curr = queue[qHead++];
        const p = curr * 4;
        const r = data[p], g = data[p + 1], b = data[p + 2];
        const lum = (r + g + b) / 3;
        const sat = Math.max(r, g, b) - Math.min(r, g, b);

        // Studio background is bright neutral white (lum > 236, sat < 18)
        if (lum > 235 && sat < 20) {
          isBg[curr] = 1;
          const cx = curr % W;
          const cy = (curr / W) | 0;
          if (cx > 0 && !visited[curr - 1]) { visited[curr - 1] = 1; queue[qTail++] = curr - 1; }
          if (cx < W - 1 && !visited[curr + 1]) { visited[curr + 1] = 1; queue[qTail++] = curr + 1; }
          if (cy > 0 && !visited[curr - W]) { visited[curr - W] = 1; queue[qTail++] = curr - W; }
          if (cy < H - 1 && !visited[curr + W]) { visited[curr + W] = 1; queue[qTail++] = curr + W; }
        }
      }

      // Also clear trapped white negative space between arms/hair and between the legs
      for (let y = 320; y < 1420; y++) {
        for (let x = 180; x < 820; x++) {
          const idx = y * W + x;
          if (isBg[idx]) continue;
          // Between legs (x: 472..528, y: 745..1420) or outer under-arm gaps
          const inLegGap = (x > 475 && x < 525 && y > 745);
          if (inLegGap) {
            const p = idx * 4;
            const r = data[p], g = data[p + 1], b = data[p + 2];
            if ((r + g + b) / 3 > 240 && (Math.max(r, g, b) - Math.min(r, g, b)) < 14) {
              isBg[idx] = 1;
            }
          }
        }
      }

      // Apply smooth alpha matting & soft hair-edge feathering
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const idx = y * W + x;
          const p = idx * 4;
          if (isBg[idx]) {
            data[p + 3] = 0;
          } else {
            // Check if adjacent to background for anti-aliased edge feathering
            const bgNeighbors = isBg[idx - 1] + isBg[idx + 1] + isBg[idx - W] + isBg[idx + W];
            if (bgNeighbors > 0) {
              const r = data[p], g = data[p + 1], b = data[p + 2];
              const lum = (r + g + b) / 3;
              // Dark hair wisps against white background: de-halo white fringe and compute true alpha
              if (lum > 180) {
                const alpha = Math.max(0, Math.min(255, (250 - lum) * 3.2));
                data[p + 3] = alpha;
              } else {
                data[p + 3] = 235;
              }
            }
          }
        }
      }

      cctx.putImageData(imgData, 0, 0);
      return c;
    }

    // Helper to extract a feathered polygonal cutout layer from the clean photo plate
    function sliceFeatheredPhotoPart(sourceCanvas, polyPts, featherPx = 4) {
      const W = sourceCanvas.width, H = sourceCanvas.height;
      const partCanvas = document.createElement('canvas');
      partCanvas.width = W; partCanvas.height = H;
      const pctx = partCanvas.getContext('2d');

      pctx.save();
      if (featherPx > 0) {
        pctx.filter = `blur(${featherPx}px)`;
      }
      pctx.beginPath();
      pctx.moveTo(polyPts[0][0], polyPts[0][1]);
      for (let i = 1; i < polyPts.length; i++) pctx.lineTo(polyPts[i][0], polyPts[i][1]);
      pctx.closePath();
      pctx.fillStyle = '#ffffff';
      pctx.fill();
      pctx.restore();

      pctx.globalCompositeOperation = 'source-in';
      pctx.drawImage(sourceCanvas, 0, 0);
      return partCanvas;
    }

    function compilePhotorealisticBJDLayers(imgElement) {
      const clean = removeWhiteBackgroundFloodFill(imgElement);
      BJDPhotoRig.cleanCanvas = clean;

      // Slice anatomical photo layers on the 1000x1500 grid so every joint rotates cleanly!
      BJDPhotoRig.parts = {
        // 1. Left & Right Flowing Wavy Hair Masses (Behind shoulders & arms)
        hairBackL: sliceFeatheredPhotoPart(clean, [
          [180, 180], [420, 180], [395, 760], [180, 760]
        ], 6),
        hairBackR: sliceFeatheredPhotoPart(clean, [
          [580, 180], [820, 180], [820, 760], [605, 760]
        ], 6),

        // 2. Left Leg: Thigh (y: 720..1030) & Lower Shin/Foot (y: 1010..1460)
        thighL: sliceFeatheredPhotoPart(clean, [
          [350, 725], [498, 725], [498, 1035], [360, 1035]
        ], 4),
        shinL: sliceFeatheredPhotoPart(clean, [
          [365, 1015], [498, 1015], [498, 1465], [365, 1465]
        ], 3),

        // 3. Right Leg: Thigh (y: 720..1030) & Lower Shin/Foot (y: 1010..1460)
        thighR: sliceFeatheredPhotoPart(clean, [
          [502, 725], [650, 725], [640, 1035], [502, 1035]
        ], 4),
        shinR: sliceFeatheredPhotoPart(clean, [
          [502, 1015], [635, 1015], [635, 1465], [502, 1465]
        ], 3),

        // 4. Left Arm: Upper Arm (y: 365..575), Forearm (y: 555..735), Hand (y: 715..835)
        upperArmL: sliceFeatheredPhotoPart(clean, [
          [295, 365], [395, 365], [378, 578], [285, 578]
        ], 4),
        forearmL: sliceFeatheredPhotoPart(clean, [
          [220, 558], [375, 558], [305, 738], [215, 738]
        ], 4),
        handL: sliceFeatheredPhotoPart(clean, [
          [125, 718], [302, 718], [285, 835], [125, 835]
        ], 2),

        // 5. Right Arm: Upper Arm (y: 365..575), Forearm (y: 555..735), Hand (y: 715..835)
        upperArmR: sliceFeatheredPhotoPart(clean, [
          [605, 365], [705, 365], [715, 578], [622, 578]
        ], 4),
        forearmR: sliceFeatheredPhotoPart(clean, [
          [625, 558], [780, 558], [785, 738], [695, 738]
        ], 4),
        handR: sliceFeatheredPhotoPart(clean, [
          [698, 718], [875, 718], [875, 835], [715, 835]
        ], 2),

        // 6. Central Torso, Neck, Ivory Silk Camisole & Bloomers (x: 345..655, y: 310..765)
        torso: sliceFeatheredPhotoPart(clean, [
          [385, 305], [615, 305], [658, 765], [342, 765]
        ], 5),

        // 7. Porcelain Head, Wispy Bangs & Pink Lace Hair Bows (x: 305..695, y: 50..335)
        head: sliceFeatheredPhotoPart(clean, [
          [305, 50], [695, 50], [645, 332], [355, 332]
        ], 5),

        // 8. Left & Right Lace Hair Bows (for independent ribbon flutter)
        bowL: sliceFeatheredPhotoPart(clean, [
          [310, 95], [405, 95], [402, 265], [310, 265]
        ], 3),
        bowR: sliceFeatheredPhotoPart(clean, [
          [595, 95], [690, 95], [690, 265], [598, 265]
        ], 3)
      };

      BJDPhotoRig.loaded = true;
      const banner = document.getElementById('bjd-photo-banner');
      if (banner) banner.classList.add('hidden');
      CharacterBundles['porcelain_bjd'] = compileCharacterBundle('porcelain_bjd', drawPorcelainBJDMaster, '2:3');
      renderMainStage();
    }

    function handleBJDPhotoUpload(ev) {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          compilePhotorealisticBJDLayers(img);
          if (StudioState.activeCharacter !== 'porcelain_bjd') {
            const sel = document.getElementById('select-character');
            if (sel) sel.value = 'porcelain_bjd';
            switchCharacter('porcelain_bjd');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    // Draws the Wardrobe Dress Overlay (Rose Lolita / Noir Velvet / Swan Lake Tutu / Custom Uploaded Dress)
    function renderBJDDressOverlay(targetCtx, wd, skirtSway) {
      if (!wd || wd.outfit === 'ivory_camisole' || wd.outfit === 'none') return;
      const prevCtx = ctx;
      ctx = targetCtx;

      withPivot(500, 560, skirtSway * 0.25, wd.scaleX, wd.scaleY, wd.offsetX, wd.offsetY, () => {
        if (wd.outfit === 'custom_dress' && wd.customImg) {
          const img = wd.customImg;
          const targetW = 480;
          const targetH = (img.height / (img.width || 1)) * targetW;
          targetCtx.drawImage(img, 500 - targetW * 0.5, 365, targetW, targetH);
          return;
        }

        const isNoir = wd.outfit === 'noir_velvet';
        const isBallet = wd.outfit === 'pastel_ballet';
        const cTop = isNoir ? '#2c2430' : (isBallet ? '#fff9fb' : '#fae0e6');
        const cMid = isNoir ? '#1a151c' : (isBallet ? '#f7e6ee' : '#eebec9');
        const cBot = isNoir ? '#0d0a0e' : (isBallet ? '#e3cad6' : '#cf92a0');
        const cLace = '#fdf9f2';

        // Soft 3D Couture Bell Skirt with Multi-Stop Cylindrical Shading (Zero cartoon outlines!)
        const skirtPts = bezierPts([
          [[412, 568], [500, 584], [588, 568], [648, 675]],
          [[648, 675], [702, 775], [742, 875], [755, 938 + skirtSway * 25]],
          [[755, 938 + skirtSway * 25], [625, 976], [375, 976], [245, 938 - skirtSway * 25]],
          [[245, 938 - skirtSway * 25], [258, 875], [298, 775], [352, 675]],
          [[352, 675], [382, 615], [398, 585], [412, 568]]
        ], 20);

        targetCtx.save();
        targetCtx.shadowColor = 'rgba(20, 12, 15, 0.28)';
        targetCtx.shadowBlur = 18;
        targetCtx.shadowOffsetY = 8;
        trace(skirtPts, true);
        const sg = targetCtx.createLinearGradient(250, 570, 750, 960);
        sg.addColorStop(0, cBot);
        sg.addColorStop(0.28, cMid);
        sg.addColorStop(0.5, cTop);
        sg.addColorStop(0.72, cMid);
        sg.addColorStop(1, cBot);
        targetCtx.fillStyle = sg;
        targetCtx.fill();
        targetCtx.restore();

        // Soft pleated satin folds
        targetCtx.save();
        trace(skirtPts, true);
        targetCtx.clip();
        for (let i = -3; i <= 3; i++) {
          const fx = 500 + i * 52;
          const fg = targetCtx.createLinearGradient(fx - 22, 580, fx + 22, 960);
          fg.addColorStop(0, 'rgba(0,0,0,0)');
          fg.addColorStop(0.5, isNoir ? 'rgba(255,255,255,0.07)' : 'rgba(120,65,80,0.12)');
          fg.addColorStop(1, 'rgba(0,0,0,0)');
          targetCtx.fillStyle = fg;
          targetCtx.beginPath();
          targetCtx.moveTo(500 + i * 18, 575);
          targetCtx.lineTo(fx + 28, 975);
          targetCtx.lineTo(fx - 28, 975);
          targetCtx.closePath();
          targetCtx.fill();
        }
        targetCtx.restore();

        // Fitted Silk Corset Bodice
        const bodicePts = bezierPts([
          [[402, 392], [452, 428], [548, 428], [598, 392]],
          [[598, 392], [595, 475], [586, 535], [590, 574]],
          [[590, 574], [500, 594], [410, 574], [414, 535]],
          [[414, 535], [405, 475], [402, 392], [402, 392]]
        ], 16);
        targetCtx.save();
        trace(bodicePts, true);
        const bg = targetCtx.createRadialGradient(500, 465, 15, 500, 485, 130);
        bg.addColorStop(0, cTop);
        bg.addColorStop(0.65, cMid);
        bg.addColorStop(1, cBot);
        targetCtx.fillStyle = bg;
        targetCtx.fill();
        targetCtx.restore();

        // Delicate ruffled lace hem & neckline
        targetCtx.save();
        targetCtx.strokeStyle = cLace;
        targetCtx.lineWidth = 5.5;
        targetCtx.setLineDash([6, 4]);
        trace(bezierPts([[[248, 938], [375, 974], [625, 974], [752, 938]]], 24), false);
        targetCtx.stroke();
        trace(bezierPts([[[402, 392], [452, 428], [548, 428], [598, 392]]], 16), false);
        targetCtx.stroke();
        targetCtx.restore();
      });

      ctx = prevCtx;
    }

    // Master Porcelain BJD Renderer: Uses 100% Photorealistic Cutout Layers when photo is loaded, or Soft 3D Airbrushed Porcelain Sculpt (Zero Cartoon Outlines!)
    function drawPorcelainBJDMaster(targetCtx, rig = null) {
      ctx = targetCtx;
      const isRest = !rig;
      const r = rig || StudioState.rigState;

      const breath = isRest ? 0 : (r.breath || 0);
      const torsoSway = isRest ? 0 : (r.torsoSway || 0);
      const headTilt = isRest ? 0 : (r.headTilt || 0);
      const headDX = isRest ? 0 : (r.headTurn || 0);
      const headDY = isRest ? 0 : (r.headNod || 0);
      const blink = isRest ? 0 : (r.blink || 0);
      const gazeX = isRest ? 0 : (r.gazeX || 0);
      const gazeY = isRest ? 0 : (r.gazeY || 0);
      const browLift = isRest ? 0 : (r.browLift || 0);
      const lipPart = isRest ? 0 : (r.mouthOpen || 0);
      const blushInt = isRest ? 0.58 : (r.smile ?? 0.58);

      const shldL = isRest ? 0 : (r.leftArmLift || 0);
      const elbL  = isRest ? 0 : (r.leftElbowBend || 0);
      const wrstL = isRest ? 0 : (r.leftWristRot || 0);

      const shldR = isRest ? 0 : (r.rightArmLift || 0);
      const elbR  = isRest ? 0 : (r.rightElbowBend || 0);
      const wrstR = isRest ? 0 : (r.rightWristRot || 0);

      const hipL  = isRest ? 0 : (r.leftHipRot || 0);
      const kneeL = isRest ? 0 : (r.leftKneeBend || 0);
      const hipR  = isRest ? 0 : (r.rightHipRot || 0);
      const kneeR = isRest ? 0 : (r.rightKneeBend || 0);

      const hairL = isRest ? 0 : (r.hairSwayL || 0);
      const hairR = isRest ? 0 : (r.hairSwayR || 0);
      const bangs = isRest ? 0 : (r.bangsSway || 0);
      const bowBounce = isRest ? 0 : (r.ruffleBounce || 0);

      const cW = targetCtx.canvas ? targetCtx.canvas.width : 1000;
      const cH = targetCtx.canvas ? targetCtx.canvas.height : 1500;

      targetCtx.save();
      if (StudioState.transparentBg) {
        targetCtx.clearRect(0, 0, cW, cH);
      } else {
        targetCtx.fillStyle = '#ffffff';
        targetCtx.fillRect(0, 0, cW, cH);
      }

      if (cW !== 1000 || cH !== 1500) {
        const scaleFit = Math.min(cW / 1000, cH / 1500);
        const offX = (cW - 1000 * scaleFit) * 0.5;
        const offY = (cH - 1500 * scaleFit) * 0.5;
        targetCtx.translate(offX, offY);
        targetCtx.scale(scaleFit, scaleFit);
      }

      // =====================================================================
      // PATH A: 100% PHOTOREALISTIC AUTO-MATTED CUTOUT RIG (When Photo Loaded)
      // =====================================================================
      if (BJDPhotoRig.loaded && BJDPhotoRig.parts.torso) {
        const P = BJDPhotoRig.parts;

        // 1. Back Wavy Hair Masses
        withPivot(385, 220, hairL + torsoSway * 0.4, 1, 1, headDX * 0.4, headDY * 0.4, () => {
          targetCtx.drawImage(P.hairBackL, 0, 0);
        });
        withPivot(615, 220, hairR + torsoSway * 0.4, 1, 1, headDX * 0.4, headDY * 0.4, () => {
          targetCtx.drawImage(P.hairBackR, 0, 0);
        });

        // 2. Left & Right Articulated Legs (Thigh -> Knee Ball -> Shin & Foot)
        withPivot(436, 745, hipL, 1, 1, 0, 0, () => {
          targetCtx.drawImage(P.thighL, 0, 0);
          withPivot(446, 1025, kneeL, 1, 1, 0, 0, () => {
            targetCtx.drawImage(P.shinL, 0, 0);
          });
        });
        withPivot(564, 745, hipR, 1, 1, 0, 0, () => {
          targetCtx.drawImage(P.thighR, 0, 0);
          withPivot(554, 1025, kneeR, 1, 1, 0, 0, () => {
            targetCtx.drawImage(P.shinR, 0, 0);
          });
        });

        // 3. Left & Right Articulated Arms (Shoulder -> Peanut Elbow -> Wrist & Hand)
        withPivot(368, 395, shldL, 1, 1, 0, -breath * 16, () => {
          targetCtx.drawImage(P.upperArmL, 0, 0);
          withPivot(336, 568, elbL, 1, 1, 0, 0, () => {
            targetCtx.drawImage(P.forearmL, 0, 0);
            withPivot(258, 728, wrstL, 1, 1, 0, 0, () => {
              targetCtx.drawImage(P.handL, 0, 0);
            });
          });
        });
        withPivot(632, 395, shldR, 1, 1, 0, -breath * 16, () => {
          targetCtx.drawImage(P.upperArmR, 0, 0);
          withPivot(664, 568, elbR, 1, 1, 0, 0, () => {
            targetCtx.drawImage(P.forearmR, 0, 0);
            withPivot(742, 728, wrstR, 1, 1, 0, 0, () => {
              targetCtx.drawImage(P.handR, 0, 0);
            });
          });
        });

        // 4. Breathing Torso, Silk Camisole & Bloomers + Scalable Wardrobe Dress Overlay
        withPivot(500, 660, torsoSway, 1 + breath * 0.35, 1 + breath * 0.65, 0, -breath * 20, () => {
          targetCtx.drawImage(P.torso, 0, 0);
          renderBJDDressOverlay(targetCtx, StudioState.bjdWardrobe, bowBounce);
        });

        // 5. Porcelain Head, Deforming Eyelid Blink Overlay & Twin Pink Lace Bows
        withPivot(500, 305, headTilt, 1, 1, headDX, headDY - breath * 14, () => {
          targetCtx.drawImage(P.head, 0, 0);

          // Subtle Lace Bow Flutter
          if (Math.abs(bowBounce) > 0.005) {
            withPivot(365, 155, bowBounce * 0.45, 1, 1, 0, 0, () => {
              targetCtx.drawImage(P.bowL, 0, 0);
            });
            withPivot(635, 155, -bowBounce * 0.45, 1, 1, 0, 0, () => {
              targetCtx.drawImage(P.bowR, 0, 0);
            });
          }

          // Smooth Photographic Eyelid Blink & Gaze Shimmer Overlay at Left (448, 224) & Right (552, 224)
          if (blink > 0.04) {
            const drawPhotoBlinkLid = (ex, ey) => {
              const u = Math.min(1, blink);
              targetCtx.save();
              // Soft porcelain eyelid skin descending over the glass eye
              const lidGrad = targetCtx.createLinearGradient(ex, ey - 20, ex, ey + 18);
              lidGrad.addColorStop(0, '#e3bfb5');
              lidGrad.addColorStop(0.6, '#f2dad2');
              lidGrad.addColorStop(1, '#d4a69c');
              targetCtx.fillStyle = lidGrad;
              targetCtx.beginPath();
              targetCtx.ellipse(ex, ey - 16 + u * 16, 27, 4 + u * 15, 0, 0, TAU);
              targetCtx.fill();

              // Feathered dark lash line along bottom of descending eyelid
              targetCtx.strokeStyle = '#1a1210';
              targetCtx.lineWidth = 3.2;
              targetCtx.beginPath();
              targetCtx.arc(ex, ey - 8 + u * 12, 25, 0.15 * Math.PI, 0.85 * Math.PI);
              targetCtx.stroke();
              targetCtx.restore();
            };
            drawPhotoBlinkLid(448, 224);
            drawPhotoBlinkLid(552, 224);
          }
        });

        targetCtx.restore();
        return;
      }

      // =====================================================================
      // PATH B: SOFT 3D AIRBRUSHED PORCELAIN SCULPT (Zero Cartoon Outlines!)
      // Used before the photo file is selected so she looks like a 3D porcelain doll, never a flat cartoon!
      // =====================================================================
      const fillSoft3D = (pts, gradFn, shadowBlur = 10, shadowCol = 'rgba(75,45,38,0.18)') => {
        targetCtx.save();
        if (shadowBlur > 0) {
          targetCtx.shadowColor = shadowCol;
          targetCtx.shadowBlur = shadowBlur;
          targetCtx.shadowOffsetY = 3;
        }
        trace(pts, true);
        const bb = bbox(pts, 2);
        targetCtx.fillStyle = gradFn(bb);
        targetCtx.fill();
        targetCtx.restore();
      };

      const cylSkinGrad = (bb) => {
        const g = targetCtx.createLinearGradient(bb.x0, 0, bb.x1, 0);
        g.addColorStop(0, '#dcbfb5');
        g.addColorStop(0.22, '#f2dfd8');
        g.addColorStop(0.5, '#fcf3ef');
        g.addColorStop(0.78, '#f2dfd8');
        g.addColorStop(1, '#d6b6ac');
        return g;
      };

      const renderHair = (StudioState as any).renderHair !== false;

      // 1. Soft Multi-Strand Wavy Dark Espresso Back Hair (Airbrushed volume + 60 individual silk strands)
      if (renderHair) {
      withPivot(500, 220, (hairL + hairR) * 0.5 + torsoSway * 0.35, 1, 1, headDX * 0.4, headDY * 0.4, () => {
        const hairSilP = bezierPts([
          [[410, 82], [320, 118], [285, 215], [275, 305]],
          [[275, 305], [238, 395], [232, 495], [255, 605]],
          [[255, 605], [275, 685], [315, 748], [355, 780]],
          [[355, 780], [450, 760], [550, 760], [645, 780]],
          [[645, 780], [685, 748], [725, 685], [745, 605]],
          [[745, 605], [768, 495], [762, 395], [725, 305]],
          [[725, 305], [715, 215], [680, 118], [590, 82]],
          [[590, 82], [530, 68], [470, 68], [410, 82]]
        ], 20);
        fillSoft3D(hairSilP, (bb) => {
          const g = targetCtx.createRadialGradient(500, 260, 40, 500, 420, 380);
          g.addColorStop(0, '#2a1e1b');
          g.addColorStop(0.55, '#1a1210');
          g.addColorStop(1, '#0e0908');
          return g;
        }, 16, 'rgba(15,10,10,0.35)');

        // 50 Delicate Silky Wavy Hair Wisps on Left & Right
        for (let s = -1; s <= 1; s += 2) {
          for (let i = 0; i < 24; i++) {
            const u = i / 23;
            const x0 = 500 + s * (105 + u * 85);
            const y0 = 140 + u * 80;
            const wave1 = Math.sin(u * 5 + i) * 18;
            const wave2 = Math.cos(u * 4 + i) * 22;
            const strandPts = bezierPts([
              [[x0, y0], [x0 + s * (35 + wave1), y0 + 140], [x0 + s * (15 - wave2), y0 + 290], [x0 + s * (42 + wave1), y0 + 430]],
              [[x0 + s * (42 + wave1), y0 + 430], [x0 + s * (25 - wave1), y0 + 510], [x0 + s * 10, y0 + 560], [x0 - s * 8, y0 + 595]]
            ], 12);
            targetCtx.save();
            targetCtx.strokeStyle = i % 4 === 0 ? 'rgba(92, 68, 60, 0.45)' : (i % 2 === 0 ? 'rgba(45, 32, 28, 0.65)' : 'rgba(22, 15, 14, 0.75)');
            targetCtx.lineWidth = i % 4 === 0 ? 2.2 : 1.3;
            trace(strandPts, false);
            targetCtx.stroke();
            targetCtx.restore();
          }
        }
      });
      }

      // 2. 3D Airbrushed Porcelain Legs (Soft Cylindrical Shading + Recessed Ball-Joint Creases)
      const draw3DPorcelainLeg = (isRight, hipRot, kneeBend) => {
        const s = isRight ? 1 : -1;
        const hipX = 500 + s * 62, hipY = 742;
        const kneeX = 500 + s * 52, kneeY = 1022;
        const ankleX = 500 + s * 50, ankleY = 1335;

        withPivot(hipX, hipY, hipRot, 1, 1, 0, 0, () => {
          const thighP = bezierPts([
            [[500 + s * 130, 730], [500 + s * 124, 850], [500 + s * 106, 955], [500 + s * 92, 1018]],
            [[500 + s * 92, 1018], [500 + s * 68, 1038], [500 + s * 36, 1038], [500 + s * 14, 1018]],
            [[500 + s * 14, 1018], [500 + s * 12, 940], [500 + s * 12, 840], [500 + s * 12, 740]],
            [[500 + s * 12, 740], [500 + s * 50, 730], [500 + s * 90, 730], [500 + s * 130, 730]]
          ], 16);
          fillSoft3D(thighP, cylSkinGrad, 8);
          psBlush(kneeX, 1005, 34, 24, '232,148,142', 0.32);

          withPivot(kneeX, kneeY, kneeBend, 1, 1, 0, 0, () => {
            // Soft recessed knee ball-joint crease
            targetCtx.save();
            targetCtx.strokeStyle = 'rgba(145, 98, 88, 0.55)';
            targetCtx.lineWidth = 2.2;
            trace(bezierPts([[[500 + s * 16, 1016], [500 + s * 36, 1038], [500 + s * 68, 1038], [500 + s * 90, 1016]]], 12), false);
            targetCtx.stroke();
            targetCtx.restore();

            const calfP = bezierPts([
              [[500 + s * 90, 1024], [500 + s * 100, 1110], [500 + s * 94, 1215], [500 + s * 78, 1332]],
              [[500 + s * 78, 1332], [500 + s * 60, 1342], [500 + s * 38, 1342], [500 + s * 22, 1332]],
              [[500 + s * 22, 1332], [500 + s * 14, 1215], [500 + s * 12, 1110], [500 + s * 16, 1024]],
              [[500 + s * 16, 1024], [500 + s * 38, 1040], [500 + s * 68, 1040], [500 + s * 90, 1024]]
            ], 16);
            fillSoft3D(calfP, cylSkinGrad, 8);

            // Ankle ball joint & tiny pin slot
            fillSoft3D(ellipsePts(ankleX, 1338, 28, 12, 0, 20), cylSkinGrad, 4);
            targetCtx.fillStyle = 'rgba(92, 58, 50, 0.75)';
            targetCtx.beginPath();
            targetCtx.arc(ankleX - s * 3, 1336, 3.8, 0, TAU);
            targetCtx.fill();

            // Porcelain Foot
            const footP = bezierPts([
              [[500 + s * 22, 1340], [500 + s * 15, 1375], [500 + s * 12, 1405], [500 + s * 20, 1422]],
              [[500 + s * 20, 1422], [500 + s * 40, 1430], [500 + s * 70, 1428], [500 + s * 84, 1414]],
              [[500 + s * 84, 1414], [500 + s * 88, 1392], [500 + s * 82, 1365], [500 + s * 78, 1340]]
            ], 14);
            fillSoft3D(footP, cylSkinGrad, 6);
            psBlush(ankleX, 1415, 32, 12, '232,148,142', 0.38);
          });
        });
      };

      draw3DPorcelainLeg(false, hipL, kneeL);
      draw3DPorcelainLeg(true, hipR, kneeR);

      // 3. 3D Airbrushed Porcelain Arms & Peanut Elbows
      const draw3DPorcelainArm = (isRight, shldRot, elbRot, wrstRot) => {
        const s = isRight ? 1 : -1;
        const shldX = 500 + s * 122, shldY = 405;
        const elbX  = 500 + s * 156, elbY  = 576;
        const wrstX = 500 + s * 238, wrstY = 732;

        withPivot(shldX, shldY, shldRot, 1, 1, 0, -breath * 16, () => {
          const upperArmP = bezierPts([
            [[500 + s * 102, 395], [500 + s * 136, 385], [500 + s * 156, 415], [500 + s * 166, 480]],
            [[500 + s * 166, 480], [500 + s * 174, 528], [500 + s * 178, 558], [500 + s * 172, 570]],
            [[500 + s * 172, 570], [500 + s * 155, 558], [500 + s * 140, 560], [500 + s * 130, 574]],
            [[500 + s * 130, 574], [500 + s * 122, 525], [500 + s * 110, 465], [500 + s * 102, 395]]
          ], 14);
          fillSoft3D(upperArmP, cylSkinGrad, 8);

          withPivot(elbX, elbY, elbRot, 1, 1, 0, 0, () => {
            fillSoft3D(ellipsePts(elbX, elbY, 20, 24, -s * 0.18, 20), cylSkinGrad, 5);
            psBlush(elbX, elbY, 18, 18, '232,148,142', 0.35);
            targetCtx.fillStyle = 'rgba(92, 58, 50, 0.78)';
            targetCtx.beginPath();
            targetCtx.ellipse(500 + s * 154, 564, 3.5, 5.5, -s * 0.2, 0, TAU);
            targetCtx.ellipse(500 + s * 160, 596, 3.5, 4.8, -s * 0.2, 0, TAU);
            targetCtx.fill();

            const forearmP = bezierPts([
              [[500 + s * 138, 598], [500 + s * 154, 590], [500 + s * 174, 594], [500 + s * 184, 606]],
              [[500 + s * 184, 606], [500 + s * 210, 648], [500 + s * 234, 690], [500 + s * 252, 726]],
              [[500 + s * 252, 726], [500 + s * 242, 738], [500 + s * 230, 740], [500 + s * 220, 734]],
              [[500 + s * 220, 734], [500 + s * 192, 694], [500 + s * 162, 648], [500 + s * 138, 598]]
            ], 14);
            fillSoft3D(forearmP, cylSkinGrad, 8);

            withPivot(wrstX, wrstY, wrstRot, 1, 1, 0, 0, () => {
              const handP = bezierPts([
                [[500 + s * 224, 736], [500 + s * 240, 728], [500 + s * 254, 732], [500 + s * 276, 750]],
                [[500 + s * 276, 750], [500 + s * 316, 772], [500 + s * 354, 792], [500 + s * 360, 802]],
                [[500 + s * 360, 802], [500 + s * 352, 810], [500 + s * 326, 792], [500 + s * 304, 782]],
                [[500 + s * 304, 782], [500 + s * 328, 800], [500 + s * 342, 812], [500 + s * 334, 818]],
                [[500 + s * 334, 818], [500 + s * 316, 810], [500 + s * 290, 788], [500 + s * 270, 778]],
                [[500 + s * 270, 778], [500 + s * 260, 795], [500 + s * 250, 806], [500 + s * 242, 800]],
                [[500 + s * 242, 800], [500 + s * 244, 782], [500 + s * 238, 760], [500 + s * 224, 736]]
              ], 14);
              fillSoft3D(handP, cylSkinGrad, 6);
              psBlush(500 + s * 310, 788, 34, 16, '232,148,142', 0.42);
            });
          });
        });
      };

      draw3DPorcelainArm(false, shldL, elbL, wrstL);
      draw3DPorcelainArm(true, shldR, elbR, wrstR);

      // 4. 3D Airbrushed Porcelain Torso, Ivory Silk Camisole & Bloomers + Dress Overlay
      withPivot(500, 660, torsoSway, 1 + breath * 0.35, 1 + breath * 0.65, 0, -breath * 20, () => {
        const torsoP = bezierPts([
          [[462, 298], [462, 340], [450, 372], [395, 388]],
          [[395, 388], [374, 395], [386, 450], [398, 520]],
          [[398, 520], [408, 572], [382, 628], [362, 708]],
          [[362, 708], [362, 748], [435, 760], [500, 760]],
          [[500, 760], [565, 760], [638, 748], [638, 708]],
          [[638, 708], [618, 628], [592, 572], [602, 520]],
          [[602, 520], [614, 450], [626, 395], [605, 388]],
          [[605, 388], [550, 372], [538, 340], [538, 298]]
        ], 16);
        fillSoft3D(torsoP, cylSkinGrad, 10);
        psBlush(500, 318, 46, 24, '168,118,108', 0.55);

        const wd = StudioState.bjdWardrobe;
        if (wd.outfit === 'ivory_camisole') {
          const silkGrad = (bb) => {
            const g = targetCtx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
            g.addColorStop(0, '#e5d9c5');
            g.addColorStop(0.3, '#f7f0e2');
            g.addColorStop(0.55, '#fffdf7');
            g.addColorStop(0.8, '#f2e8d5');
            g.addColorStop(1, '#d6c7b0');
            return g;
          };
          const bloomersP = bezierPts([
            [[384, 622], [445, 636], [555, 636], [616, 622]],
            [[616, 622], [642, 662], [652, 718], [642, 764]],
            [[642, 764], [595, 776], [535, 776], [512, 765]],
            [[512, 765], [504, 746], [500, 734], [496, 746]],
            [[496, 746], [488, 765], [465, 776], [405, 776]],
            [[405, 776], [358, 764], [348, 718], [358, 662]]
          ], 16);
          fillSoft3D(bloomersP, silkGrad, 10);

          // Straps & Camisole Top
          fillSoft3D([[400, 380], [415, 378], [422, 432], [406, 434]], silkGrad, 3);
          fillSoft3D([[600, 380], [585, 378], [578, 432], [594, 434]], silkGrad, 3);
          const camP = bezierPts([
            [[406, 424], [442, 444], [475, 460], [500, 470]],
            [[500, 470], [525, 460], [558, 444], [594, 424]],
            [[594, 424], [606, 458], [596, 510], [592, 560]],
            [[592, 560], [598, 592], [614, 616], [620, 630]],
            [[620, 630], [565, 646], [435, 646], [380, 630]],
            [[380, 630], [386, 616], [402, 592], [408, 560]],
            [[408, 560], [404, 510], [394, 458], [406, 424]]
          ], 16);
          fillSoft3D(camP, silkGrad, 10);
        } else {
          renderBJDDressOverlay(targetCtx, wd, bowBounce);
      }
      });

      // 5. 3D Airbrushed Porcelain Doll Head, Realistic Glass Eyes & Soft Wispy Bangs
      withPivot(500, 305, headTilt, 1, 1, headDX, headDY - breath * 14, () => {
        fillSoft3D(ellipsePts(386, 234, 15, 24, -0.15, 16), cylSkinGrad, 4);
        fillSoft3D(ellipsePts(614, 234, 15, 24, 0.15, 16), cylSkinGrad, 4);

        const faceP = bezierPts([
          [[500, 112], [574, 115], [614, 164], [612, 228]],
          [[612, 228], [610, 274], [570, 298], [524, 308]],
          [[524, 308], [500, 312], [476, 308], [430, 298]],
          [[430, 298], [390, 274], [388, 228], [386, 164]],
          [[386, 164], [426, 115], [500, 112], [500, 112]]
        ], 20);
        fillSoft3D(faceP, (bb) => {
          const g = targetCtx.createRadialGradient(500, 210, 15, 500, 220, 132);
          g.addColorStop(0, '#fff9f6');
          g.addColorStop(0.55, '#f8e7e0');
          g.addColorStop(0.85, '#edd2c8');
          g.addColorStop(1, '#d4b0a4');
          return g;
        }, 14, 'rgba(65,38,32,0.22)');

        // Airbrushed Porcelain Blush (Cheeks, Nose Tip, Chin)
        psBlush(426, 248, 36, 24, '234,142,138', blushInt);
        psBlush(574, 248, 36, 24, '234,142,138', blushInt);
        psBlush(500, 238, 16, 11, '234,142,138', blushInt * 0.85);
        psBlush(500, 296, 20, 10, '234,142,138', blushInt * 0.6);

        // Realistic Deep Glass Doll Eyes (Large dark obsidian-brown iris filling the eye socket!)
        drawBJDGlassEye(448, 222, 25, 18, false, blink, gazeX, gazeY, 'bjdEyeL');
        drawBJDGlassEye(552, 222, 25, 18, true,  blink, gazeX, gazeY, 'bjdEyeR');

        // Soft 3D Button Nose (Shaded with radial gradients, NO dark cartoon circles!)
        psBlush(500, 242, 13, 8, '175,120,112', 0.48);
        psBlush(494, 245, 4.2, 2.5, '115,72,66', 0.72);
        psBlush(506, 245, 4.2, 2.5, '115,72,66', 0.72);
        targetCtx.fillStyle = 'rgba(255,255,255,0.75)';
        targetCtx.beginPath();
        targetCtx.ellipse(500, 238, 3.5, 2.2, 0, 0, TAU);
        targetCtx.fill();

        // Soft Airbrushed Rosebud Doll Lips
        withPivot(500, 272, 0, 1, 1 + lipPart, 0, 0, () => {
          psBlush(500, 272, 22, 11, '224,128,125', 0.85);
          const lipMidP = bezierPts([
            [[481, 272], [492, 269], [508, 269], [519, 272]],
            [[519, 272], [508, 275], [492, 275], [481, 272]]
          ], 10);
          fillSoft3D(lipMidP, () => '#7a3b39', 0);
          targetCtx.fillStyle = 'rgba(255,255,255,0.78)';
          targetCtx.beginPath();
          targetCtx.ellipse(495, 276, 3.0, 1.3, 0, 0, TAU);
          targetCtx.ellipse(505, 276, 2.8, 1.2, 0, 0, TAU);
          targetCtx.fill();
        });

        // Soft Feathered Dark Espresso Bangs (Airbrushed dome + 45 fine translucent hair strands!)
        if (renderHair) {
        withPivot(500, 100, bangs, 1, 1, 0, 0, () => {
          const crownP = bezierPts([
            [[500, 68], [422, 72], [372, 115], [362, 190]],
            [[362, 190], [388, 165], [418, 138], [500, 132]],
            [[500, 132], [582, 138], [612, 165], [638, 190]],
            [[638, 190], [628, 115], [578, 72], [500, 68]]
          ], 16);
          fillSoft3D(crownP, () => '#181110', 8);

          for (let i = 0; i < 46; i++) {
            const u = i / 45;
            const sx = 392 + u * 216;
            const sy = 104 + Math.abs(u - 0.5) * 18;
            const curveX = (u - 0.5) * 28 + Math.sin(i * 2.1) * 4;
            const lenY = 88 + Math.sin(i * 1.7) * 14 - Math.abs(u - 0.5) * 18;
            const strandP = bezierPts([
              [[sx, sy], [sx + curveX * 0.4, sy + lenY * 0.45], [sx + curveX * 0.8, sy + lenY * 0.8], [sx + curveX, sy + lenY]]
            ], 10);
            sgTaperLine(strandP, 4.2, 2.4, 0.2, i % 4 === 0 ? '#3a2924' : '#181110', 0.86);
          }
        });

        // Twin Pale-Pink Floral Lace Hair Bows
        drawPinkLaceBow(368, 158, -0.18, false, bowBounce * 0.65, 'bjdBowL');
        drawPinkLaceBow(632, 158,  0.18, true,  bowBounce * 0.65, 'bjdBowR');
        }
      });

      targetCtx.restore();
    }

    function drawBJDGlassEye(cx, cy, rx, ry, isRight, blink = 0, gazeX = 0, gazeY = 0, eKey = 'bjdEye') {
      const s = isRight ? 1 : -1;
      const u = Math.max(0, Math.min(1, blink));
      const lidTopY = cy - ry + u * (ry * 1.85);

      ctx.save();
      // Eye socket depth shadow
      psBlush(cx, cy - 2, rx * 1.28, ry * 1.28, '148,96,88', 0.45);

      if (u < 0.92) {
        const scleraPts = bezierPts([
          [[cx - rx, cy + 2], [cx - rx * 0.55, lidTopY], [cx + rx * 0.55, lidTopY], [cx + rx, cy + 2]],
          [[cx + rx, cy + 2], [cx + rx * 0.55, cy + ry], [cx - rx * 0.55, cy + ry], [cx - rx, cy + 2]]
        ], 14);

        ctx.save();
        trace(scleraPts, true);
        ctx.fillStyle = '#faf5f4';
        ctx.fill();
        ctx.clip();

        // Upper lid cast shadow on sclera
        psBlush(cx, lidTopY + 4, rx * 1.2, 10, '120,82,78', 0.45);

        // Large realistic dark obsidian-espresso glass iris
        const ix = cx + gazeX * 0.45;
        const iy = cy + gazeY * 0.45;
        const irR = ry * 0.98;

        const ig = ctx.createRadialGradient(ix, iy + 3, 2, ix, iy, irR);
        ig.addColorStop(0, '#090606');
        ig.addColorStop(0.55, '#1d1210');
        ig.addColorStop(0.85, '#3b2420');
        ig.addColorStop(1, '#120b0a');
        ctx.fillStyle = ig;
        ctx.beginPath();
        ctx.arc(ix, iy, irR, 0, TAU);
        ctx.fill();

        // Deep pupil
        ctx.fillStyle = '#050303';
        ctx.beginPath();
        ctx.arc(ix, iy, irR * 0.46, 0, TAU);
        ctx.fill();

        // Dual wet studio specular catchlights
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.ellipse(ix - 5.5, iy - 5.2, 4.8, 3.6, -0.35, 0, TAU);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        ctx.beginPath();
        ctx.arc(ix + 5.5, iy + 5.0, 2.2, 0, TAU);
        ctx.fill();

        ctx.restore();
      }

      // Double eyelid crease
      ctx.strokeStyle = 'rgba(120,76,68,0.58)';
      ctx.lineWidth = 1.6;
      trace(bezierPts([
        [[cx - rx * 0.92, cy - 4], [cx - rx * 0.4, lidTopY - 7], [cx + rx * 0.4, lidTopY - 7], [cx + rx * 0.92, cy - 4]]
      ], 12), false);
      ctx.stroke();

      // Upper lash line & feathered lashes
      const lashArch = bezierPts([
        [[cx - rx * 1.04, cy + 2], [cx - rx * 0.5, lidTopY], [cx + rx * 0.5, lidTopY], [cx + rx * 1.04, cy + 2]]
      ], 14);
      sgTaperLine(lashArch, 1.8, 4.2, 1.8, '#1a1110', 0.95);

      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const lx = cx - rx * 0.88 + t * (rx * 1.76);
        const ly = lidTopY + Math.pow(t - 0.5, 2) * 14;
        const dirX = (t - 0.5) * 11 + s * 2;
        const dirY = (u > 0.6 ? 8 : -7) * (1 - Math.abs(t - 0.5) * 0.5);
        sgTaperLine([[lx, ly], [lx + dirX * 0.5, ly + dirY * 0.6], [lx + dirX, ly + dirY]], 1.8, 1.1, 0.2, '#1a1110', 0.82);
      }

      ctx.restore();
    }

    function drawPinkLaceBow(cx, cy, rot = 0, isRight = false, flutter = 0, bKey = 'laceBow') {
      const s = isRight ? 1 : -1;
      withPivot(cx, cy, rot + flutter * s, 1, 1, 0, 0, () => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, 1);

        const drawLacePart = (pts) => {
          ctx.save();
          ctx.shadowColor = 'rgba(60,35,38,0.18)';
          ctx.shadowBlur = 6;
          trace(pts, true);
          const g = ctx.createLinearGradient(-30, -30, 30, 60);
          g.addColorStop(0, '#fae3e8');
          g.addColorStop(0.5, '#f0cbd3');
          g.addColorStop(1, '#d9aeb8');
          ctx.fillStyle = g;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,250,252,0.65)';
          ctx.lineWidth = 1.4;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.restore();
        };

        // Hanging lace tails
        drawLacePart(bezierPts([
          [[-4, 4], [-18, 35], [-26, 72], [-22, 106]],
          [[-22, 106], [-12, 102], [-6, 95], [-2, 65]],
          [[-2, 65], [2, 35], [2, 15], [-4, 4]]
        ], 12));
        drawLacePart(bezierPts([
          [[4, 4], [14, 32], [22, 66], [28, 92]],
          [[28, 92], [18, 96], [10, 88], [4, 58]],
          [[4, 58], [0, 30], [0, 14], [4, 4]]
        ], 12));

        // Upper & lower bow loops
        drawLacePart(bezierPts([
          [[0, 0], [-18, -28], [-38, -34], [-42, -16]],
          [[-42, -16], [-44, 2], [-22, 10], [0, 4]]
        ], 12));
        drawLacePart(bezierPts([
          [[0, 0], [18, -24], [34, -26], [38, -10]],
          [[38, -10], [40, 6], [20, 12], [0, 4]]
        ], 12));

        // Center knot
        drawLacePart(ellipsePts(0, 2, 8, 10, 0, 14));
        ctx.restore();
      });
    }

export function drawExtractedCompilerCharacter(
  charId: ExtractedCompilerCharacterId,
  targetCtx: CanvasRenderingContext2D,
  rig: CompilerRigState | null,
  t: number = 0,
  opts: { transparentBg?: boolean; bjdOutfit?: string; sceneMode?: boolean; renderHair?: boolean } = {}
) {
  StudioState.t = t;
  StudioState.transparentBg = !!(opts.transparentBg || opts.sceneMode);
  (StudioState as any).renderHair = opts.renderHair ?? true;
  if (opts.bjdOutfit) {
    StudioState.bjdWardrobe.outfit = opts.bjdOutfit;
  }
  const frameIdx = Math.floor(((t % 6.0) / 6.0) * 144) % 144;
  B = (Math.floor(frameIdx / 3) % 4) + 1;

  const origClearRect = targetCtx.clearRect;
  const origFillRect = targetCtx.fillRect;

  if (opts.sceneMode) {
    targetCtx.clearRect = function (x: number, y: number, w: number, h: number) {
      if (w >= 950 && h >= 950) return;
      return origClearRect.call(this, x, y, w, h);
    };
    let skippedBgFill = false;
    targetCtx.fillRect = function (x: number, y: number, w: number, h: number) {
      if (!skippedBgFill && x === 0 && y === 0 && w >= 950 && h >= 950) {
        skippedBgFill = true;
        return;
      }
      return origFillRect.call(this, x, y, w, h);
    };
  }

  try {
    switch (charId) {
      case 'auburn_girl':
        return drawAuburnGirlMaster(targetCtx, rig);
      case 'black_bob_girl':
        return drawBlackBobGirlMaster(targetCtx, rig);
      case 'strawberry_mouse':
        return drawStrawberryMouseMaster(targetCtx, rig);
      case 'acorn_lamb':
        return drawAcornLambMaster(targetCtx, rig);
      case 'watering_bunny':
        return drawWateringCanBunnyMaster(targetCtx, rig);
      case 'postman_duckling':
        return drawPostmanDucklingMaster(targetCtx, rig);
      case 'lantern_kitten':
        return drawLanternKittenMaster(targetCtx, rig);
      case 'meadow_bg':
        return drawStorybookMeadowBG(targetCtx, rig, null);
      case 'meadow_with_mouse':
        return drawMeadowWithMouse(targetCtx, rig);
      case 'meadow_with_lamb':
        return drawMeadowWithLamb(targetCtx, rig);
      case 'meadow_with_bunny':
        return drawMeadowWithBunny(targetCtx, rig);
      case 'meadow_with_duckling':
        return drawMeadowWithDuckling(targetCtx, rig);
      case 'meadow_with_kitten':
        return drawMeadowWithKitten(targetCtx, rig);
      case 'porcelain_bjd':
        return drawPorcelainBJDMaster(targetCtx, rig);
      default:
        return drawAuburnGirlMaster(targetCtx, rig);
    }
  } finally {
    if (opts.sceneMode) {
      targetCtx.clearRect = origClearRect;
      targetCtx.fillRect = origFillRect;
    }
  }
}
