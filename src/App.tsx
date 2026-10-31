/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  PuppyRigState,
  DEFAULT_PUPPY_RIG,
  drawTeacupPuppy,
  computePuppyRigAtTime,
  PuppyAnimationMode,
} from './teacupPuppyEngine';
import {
  ExtractedCompilerCharacterId,
  EXTRACTED_COMPILER_CHAR_LIST,
  isExtractedCompilerChar,
  CompilerJointKey,
  CompilerRigState,
  DEFAULT_COMPILER_RIG,
  COMPILER_JOINT_SLIDER_META,
  CompilerAnimPreset,
  computeCompilerRigAtTime,
  drawExtractedCompilerCharacter,
} from './extractedCompilerCharacters';
import {
  ShoujoRigState,
  DEFAULT_SHOUJO_RIG,
  drawShoujoGirl,
  ShoujoAnimationMode,
} from './shoujoGirlEngine';
import {
  BunnyRigState,
  DEFAULT_BUNNY_RIG,
  drawVictorianBunny,
  drawBunnyPaperBackground,
  drawFloatingPetals,
  BunnyAnimationMode,
  BunnyEyeState,
} from './victorianBunnyEngine';
import {
  CatRigState,
  DEFAULT_CAT_RIG,
  drawRiggedCalicoKitten,
  drawPaperTooth,
  drawRainEnvironment,
  AnimationMode as CatAnimationMode,
  RC,
} from './catAnimationEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Code2,
  Download,
  Check,
  Copy,
  Layers,
  Wand2,
  Rabbit,
  Cat,
  Video,
  KeyRound,
  Plus,
  Trash2,
  ArrowLeftRight,
  Clock,
  Film,
  Loader2,
  UserRound,
  Feather,
  Dog,
  Sparkles,
  Tv,
} from 'lucide-react';
import { SceneComposerModal } from './SceneComposerModal';
import {
  selectBestVideoMimeType,
  exportAfterEffectsPngSequenceZip,
} from './transparentVideoExporter';
import {
  CrtSailorRigState,
  DEFAULT_CRT_SAILOR_RIG,
  CrtSailorChannel,
  CrtSailorAction,
  CrtSailorInspectionView,
  CrtSailorJointKey,
  CrtSailorKeyframe,
  DEFAULT_CRT_SAILOR_KEYFRAMES,
  CRT_SAILOR_JOINT_SLIDER_META,
  CRT_SAILOR_LAYER_SUMMARIES,
  CRT_SAILOR_VERIFICATION_METRICS,
  extractCrtSailorJoints,
  computeCrtSailorRigAtTime,
  drawCrtTvSailor,
} from './crtSailorEngine';
import {
  ChibiSquireRigState,
  DEFAULT_CHIBI_SQUIRE_RIG,
  SquireViewAngle,
  SquireAction,
  SquireExpression,
  SquireJointKey,
  SQUIRE_JOINT_SLIDER_META,
  computeChibiSquireRigAtTime,
  drawChibiSquire,
  drawSquireCastleYardBG,
  extractSquireJoints,
  SquireKeyframe,
  DEFAULT_SQUIRE_KEYFRAMES,
  SquirePresetId,
} from './chibiSquireEngine';
import { Compass, Footprints, Smile, Shield, Swords, Upload } from 'lucide-react';
import {
  SheetViewCategory,
  VIEW_CATEGORY_LABELS,
  CharacterSheetProfile,
  CharacterSheetViewItem,
  DetailTrainingPreset,
  DEFAULT_DETAIL_TRAINING_PRESETS,
  AnatomyStepId,
  AnatomyMistakeId,
  ANATOMY_TRAINING_STEPS,
  ANATOMY_COMMON_MISTAKES,
  drawHandAnatomyTrainingOverlay,
  loadAllCharacterSheetProfiles,
  saveCharacterSheetProfile,
  deleteCharacterSheetProfile,
  analyzeUploadedSheetImage,
  createDefaultCrtSailorSheetProfile,
  formatCharacterSheetBlueprintForChat,
} from './characterSheetVault';

type ActiveCharacter =
  | 'crt_tv_sailor'
  | 'chibi_squire'
  | ExtractedCompilerCharacterId
  | 'teacup_puppy'
  | 'shoujo_girl'
  | 'victorian_bunny'
  | 'raincoat_cat';
type EasingMode = 'easeInOutSine' | 'linear' | 'smoothStep' | 'springBounce';
type LoopStyle = 'pingpong' | 'cycle';

// Joint numeric keys for 20-Layer Teacup Puppy in Scalloped Collar
type PuppyJointKey =
  | 'blink'
  | 'headRot'
  | 'headDX'
  | 'headDY'
  | 'gazeDX'
  | 'gazeDY'
  | 'noseWiggle'
  | 'blushPulse'
  | 'leftEarRot'
  | 'rightEarRot'
  | 'ribbonBowRot'
  | 'teacupBobDY'
  | 'teacupTiltRot'
  | 'tailWagRot'
  | 'leftFootRot'
  | 'rightFootRot'
  | 'torsoSwayRot';

// Joint numeric keys for 24-Layer Shoujo Anime Girl
type ShoujoJointKey =
  | 'headRot'
  | 'headDX'
  | 'headDY'
  | 'blink'
  | 'gazeDX'
  | 'gazeDY'
  | 'browLift'
  | 'lipPart'
  | 'bangLRot'
  | 'bangRRot'
  | 'cheekLockRot'
  | 'shoulderCurlRot'
  | 'backHairLRot'
  | 'backHairRRot'
  | 'heartRot'
  | 'strapDropRot'
  | 'roseSpin'
  | 'bowFlutter'
  | 'torsoBreath';

// Joint numeric keys for Victorian Bunny
type BunnyJointKey =
  | 'headRot'
  | 'bonnetFlutter'
  | 'earLeftRot'
  | 'earRightRot'
  | 'armLeftRot'
  | 'armRightRot'
  | 'footLeftRot'
  | 'footRightRot'
  | 'tailWagRot'
  | 'chestBowRot'
  | 'sideBowRot'
  | 'noseTwitchY'
  | 'bodyRot';

// Joint numeric keys for Raincoat Cat
type CatJointKey =
  | 'headTilt'
  | 'earRotL'
  | 'earRotR'
  | 'armLRot'
  | 'umbTilt'
  | 'armRRot'
  | 'footTapL'
  | 'footTapR'
  | 'bodySway'
  | 'whiskerTwitch';

export interface PuppyKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<PuppyJointKey, number>;
}

export interface CompilerKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<CompilerJointKey, number>;
}

export interface ShoujoKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<ShoujoJointKey, number>;
}

export interface BunnyKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<BunnyJointKey, number>;
}

export interface CatKeyframe {
  id: string;
  label: string;
  progress: number;
  joints: Record<CatJointKey, number>;
}

const PUPPY_JOINT_SLIDER_META: {
  key: PuppyJointKey;
  label: string;
  pivotLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'blink', label: '3-Stage Deforming Eyelid Blink', pivotLabel: '40pt Spline Lid (0 → 0.55 → 1)', min: 0, max: 1, step: 0.01, unit: 'u' },
  { key: 'headRot', label: 'Floppy Puppy Head Tilt', pivotLabel: 'Neck Base (504, 488)', min: -0.14, max: 0.14, step: 0.005, unit: 'rad' },
  { key: 'headDX', label: 'Head Horizontal Sway', pivotLabel: 'Neck Base (504, 488)', min: -12, max: 12, step: 0.5, unit: 'px' },
  { key: 'headDY', label: 'Head Breathing Bob', pivotLabel: 'Neck Base (504, 488)', min: -10, max: 10, step: 0.5, unit: 'px' },
  { key: 'leftEarRot', label: 'Left Floppy Lop Ear Sway', pivotLabel: 'Left Ear Root (364, 214)', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'rightEarRot', label: 'Right Floppy Lop Ear Sway', pivotLabel: 'Right Ear Root (614, 206)', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'gazeDX', label: 'Velvet Espresso Eye Gaze X', pivotLabel: '40pt Eye Spline', min: -5, max: 5, step: 0.25, unit: 'px' },
  { key: 'gazeDY', label: 'Velvet Espresso Eye Gaze Y', pivotLabel: '40pt Eye Spline', min: -4, max: 4, step: 0.25, unit: 'px' },
  { key: 'noseWiggle', label: 'Chestnut Nose Sniff Wiggle', pivotLabel: 'Muzzle Tip (519, 391)', min: -3, max: 3, step: 0.1, unit: 'px' },
  { key: 'blushPulse', label: 'Gouache Cheek Blush & Slashes', pivotLabel: 'Cheeks (390, 405) & (618, 396)', min: 0.2, max: 1.0, step: 0.02, unit: 'α' },
  { key: 'ribbonBowRot', label: 'Mauve Collar Bow Sway (Cutout Loops)', pivotLabel: 'Collar Knot (512, 508)', min: -0.16, max: 0.16, step: 0.005, unit: 'rad' },
  { key: 'teacupBobDY', label: 'Porcelain Teacup & Paws Lift Y', pivotLabel: 'Teacup Center (534, 650)', min: -8, max: 8, step: 0.25, unit: 'px' },
  { key: 'teacupTiltRot', label: 'Porcelain Teacup & Paws Tilt', pivotLabel: 'Teacup Center (534, 650)', min: -0.08, max: 0.08, step: 0.004, unit: 'rad' },
  { key: 'tailWagRot', label: 'Fluffy Tail Wag (60pt Spline)', pivotLabel: 'Tail Base (294, 758)', min: -0.24, max: 0.24, step: 0.005, unit: 'rad' },
  { key: 'leftFootRot', label: 'Left Hind Foot Wiggle (Open Crease)', pivotLabel: 'Left Ankle (492, 815)', min: -0.10, max: 0.10, step: 0.004, unit: 'rad' },
  { key: 'rightFootRot', label: 'Right Hind Foot Wiggle (Open Crease)', pivotLabel: 'Right Ankle (680, 775)', min: -0.10, max: 0.10, step: 0.004, unit: 'rad' },
  { key: 'torsoSwayRot', label: 'Whole Body Breathing Sway', pivotLabel: 'Hip Root (500, 820)', min: -0.06, max: 0.06, step: 0.003, unit: 'rad' },
];

const SHOUJO_JOINT_META: {
  key: ShoujoJointKey;
  label: string;
  pivotLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'blink', label: '3-Stage Deforming Eyelid Blink', pivotLabel: 'Bezier Lid Curve (0 → 0.55 → 1)', min: 0, max: 1, step: 0.01, unit: 'u' },
  { key: 'headRot', label: 'Head 3/4 Tilt Rotation', pivotLabel: 'Neck Base (465, 485)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'headDX', label: 'Head Horizontal Sway', pivotLabel: 'Neck Base (465, 485)', min: -12, max: 12, step: 0.5, unit: 'px' },
  { key: 'headDY', label: 'Head Vertical Nod', pivotLabel: 'Neck Base (465, 485)', min: -10, max: 10, step: 0.5, unit: 'px' },
  { key: 'gazeDX', label: 'Clipped Iris Gaze X', pivotLabel: 'Sclera Clip Mask', min: -6, max: 6, step: 0.25, unit: 'px' },
  { key: 'gazeDY', label: 'Clipped Iris Gaze Y', pivotLabel: 'Sclera Clip Mask', min: -4, max: 4, step: 0.25, unit: 'px' },
  { key: 'browLift', label: 'Eyebrow Expressive Lift', pivotLabel: 'Brow Arch', min: -6, max: 6, step: 0.25, unit: 'px' },
  { key: 'lipPart', label: 'Glossy Lower Lip Cushion Part', pivotLabel: 'Lower Lip (350, 420)', min: -2, max: 5, step: 0.2, unit: 'px' },
  { key: 'bangLRot', label: 'Left Swept Bangs Sway', pivotLabel: 'Crown Parting (410, 130)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'bangRRot', label: 'Right Swept Bangs Sway', pivotLabel: 'Crown Parting (455, 130)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'cheekLockRot', label: 'Left Cheek Hair Lock Pendulum', pivotLabel: 'Temple (268, 255)', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'shoulderCurlRot', label: 'Right Shoulder S-Wave Lock', pivotLabel: 'Behind Ear (590, 420)', min: -0.18, max: 0.18, step: 0.005, unit: 'rad' },
  { key: 'backHairLRot', label: 'Back Left Hair Mass Wave', pivotLabel: 'Left Crown (280, 340)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'backHairRRot', label: 'Back Right Hair Cascade', pivotLabel: 'Right Crown (640, 360)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'heartRot', label: 'Ruby Heart Earring Pendulum', pivotLabel: 'Earlobe Stud (556, 424)', min: -0.35, max: 0.35, step: 0.01, unit: 'rad' },
  { key: 'strapDropRot', label: 'Gold Chain Drop Dangle', pivotLabel: 'Right Temple (660, 480)', min: -0.25, max: 0.25, step: 0.01, unit: 'rad' },
  { key: 'roseSpin', label: 'Pink Rose Hair Clip Spin', pivotLabel: 'Rose Center (610, 290)', min: -0.3, max: 0.3, step: 0.01, unit: 'rad' },
  { key: 'bowFlutter', label: 'Shoulder Satin Bow Flutter', pivotLabel: 'Bow Knot (240, 650)', min: -0.25, max: 0.25, step: 0.01, unit: 'rad' },
  { key: 'torsoBreath', label: 'Torso Breathing Expansion', pivotLabel: 'Chest Base (480, 920)', min: -1, max: 1, step: 0.05, unit: '×' },
];

const BUNNY_JOINT_META: {
  key: BunnyJointKey;
  label: string;
  pivotLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'headRot', label: 'Head & Cheek Tilt', pivotLabel: 'Neck Base (456, 565)', min: -0.2, max: 0.2, step: 0.005, unit: 'rad' },
  { key: 'bonnetFlutter', label: '3-Tier Bonnet Ruffle Flutter', pivotLabel: 'Crown (468, 365)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'earLeftRot', label: 'Left Lop Ear Swing', pivotLabel: 'Left Temple (292, 412)', min: -0.28, max: 0.28, step: 0.005, unit: 'rad' },
  { key: 'earRightRot', label: 'Right Lop Ear Swing', pivotLabel: 'Right Temple (625, 398)', min: -0.28, max: 0.28, step: 0.005, unit: 'rad' },
  { key: 'armLeftRot', label: 'Left Front Paw Reach', pivotLabel: 'Left Shoulder (365, 595)', min: -0.3, max: 0.3, step: 0.005, unit: 'rad' },
  { key: 'armRightRot', label: 'Right Front Paw Reach', pivotLabel: 'Right Shoulder (595, 588)', min: -0.3, max: 0.3, step: 0.005, unit: 'rad' },
  { key: 'footLeftRot', label: 'Left Hind Foot Rock', pivotLabel: 'Left Ankle (345, 735)', min: -0.28, max: 0.28, step: 0.005, unit: 'rad' },
  { key: 'footRightRot', label: 'Right Hind Foot Rock', pivotLabel: 'Right Ankle (595, 745)', min: -0.28, max: 0.28, step: 0.005, unit: 'rad' },
  { key: 'tailWagRot', label: 'Fluffy Cottontail Wiggle', pivotLabel: 'Tail Base (695, 718)', min: -0.35, max: 0.35, step: 0.005, unit: 'rad' },
  { key: 'chestBowRot', label: 'Satin Chest Bow Sway', pivotLabel: 'Collar Knot (442, 578)', min: -0.22, max: 0.22, step: 0.005, unit: 'rad' },
  { key: 'sideBowRot', label: 'Right Bonnet Ribbon Flutter', pivotLabel: 'Bonnet Knot (646, 365)', min: -0.22, max: 0.22, step: 0.005, unit: 'rad' },
  { key: 'noseTwitchY', label: 'Pink Nose & Whisker Twitch', pivotLabel: 'Snout Tip (431, 474)', min: -8, max: 8, step: 0.25, unit: 'px' },
  { key: 'bodyRot', label: 'Whole Body Rocking Sway', pivotLabel: 'Root Hip (485, 745)', min: -0.14, max: 0.14, step: 0.005, unit: 'rad' },
];

const CAT_JOINT_META: {
  key: CatJointKey;
  label: string;
  pivotLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'headTilt', label: 'Head & Hood Tilt', pivotLabel: 'Neck (495, 540)', min: -0.2, max: 0.2, step: 0.005, unit: 'rad' },
  { key: 'earRotL', label: 'Left Ear Flutter', pivotLabel: 'Left Ear Base', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'earRotR', label: 'Right Ear Flutter', pivotLabel: 'Right Ear Base', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'armLRot', label: 'Left Arm & Umbrella Sway', pivotLabel: 'Left Shoulder', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'umbTilt', label: 'Umbrella Canopy Tilt', pivotLabel: 'Handle Grip', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'armRRot', label: 'Right Arm Wave', pivotLabel: 'Right Shoulder', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'footTapL', label: 'Left Boot Puddle Tap', pivotLabel: 'Left Ankle', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'footTapR', label: 'Right Boot Puddle Tap', pivotLabel: 'Right Ankle', min: -0.25, max: 0.25, step: 0.005, unit: 'rad' },
  { key: 'bodySway', label: 'Raincoat Torso Sway', pivotLabel: 'Hips (495, 780)', min: -0.15, max: 0.15, step: 0.005, unit: 'rad' },
  { key: 'whiskerTwitch', label: 'Whisker & Nose Twitch', pivotLabel: 'Cheeks', min: -0.2, max: 0.2, step: 0.005, unit: 'rad' },
];

function extractPuppyJoints(rig: PuppyRigState): Record<PuppyJointKey, number> {
  return {
    blink: rig.blink,
    headRot: rig.headRot,
    headDX: rig.headDX,
    headDY: rig.headDY,
    gazeDX: rig.gazeDX,
    gazeDY: rig.gazeDY,
    noseWiggle: rig.noseWiggle,
    blushPulse: rig.blushPulse,
    leftEarRot: rig.leftEarRot,
    rightEarRot: rig.rightEarRot,
    ribbonBowRot: rig.ribbonBowRot,
    teacupBobDY: rig.teacupBobDY,
    teacupTiltRot: rig.teacupTiltRot,
    tailWagRot: rig.tailWagRot,
    leftFootRot: rig.leftFootRot,
    rightFootRot: rig.rightFootRot,
    torsoSwayRot: rig.torsoSwayRot,
  };
}

function extractCompilerJoints(rig: CompilerRigState): Record<CompilerJointKey, number> {
  return { ...rig };
}

function extractShoujoJoints(rig: ShoujoRigState): Record<ShoujoJointKey, number> {
  return {
    headRot: rig.headRot,
    headDX: rig.headDX,
    headDY: rig.headDY,
    blink: rig.blink,
    gazeDX: rig.gazeDX,
    gazeDY: rig.gazeDY,
    browLift: rig.browLift,
    lipPart: rig.lipPart,
    bangLRot: rig.bangLRot,
    bangRRot: rig.bangRRot,
    cheekLockRot: rig.cheekLockRot,
    shoulderCurlRot: rig.shoulderCurlRot,
    backHairLRot: rig.backHairLRot,
    backHairRRot: rig.backHairRRot,
    heartRot: rig.heartRot,
    strapDropRot: rig.strapDropRot,
    roseSpin: rig.roseSpin,
    bowFlutter: rig.bowFlutter,
    torsoBreath: rig.torsoBreath,
  };
}

function extractBunnyJoints(rig: BunnyRigState): Record<BunnyJointKey, number> {
  return {
    headRot: rig.headRot,
    bonnetFlutter: rig.bonnetFlutter,
    earLeftRot: rig.earLeftRot,
    earRightRot: rig.earRightRot,
    armLeftRot: rig.armLeftRot,
    armRightRot: rig.armRightRot,
    footLeftRot: rig.footLeftRot,
    footRightRot: rig.footRightRot,
    tailWagRot: rig.tailWagRot,
    chestBowRot: rig.chestBowRot,
    sideBowRot: rig.sideBowRot,
    noseTwitchY: rig.noseTwitchY,
    bodyRot: rig.bodyRot,
  };
}

function extractCatJoints(rig: CatRigState): Record<CatJointKey, number> {
  return {
    headTilt: rig.headTilt,
    earRotL: rig.earRotL,
    earRotR: rig.earRotR,
    armLRot: rig.armLRot,
    umbTilt: rig.umbTilt,
    armRRot: rig.armRRot,
    footTapL: rig.footTapL,
    footTapR: rig.footTapR,
    bodySway: rig.bodySway,
    whiskerTwitch: rig.whiskerTwitch,
  };
}

function applyEasing(t: number, mode: EasingMode): number {
  const clamped = Math.max(0, Math.min(1, t));
  switch (mode) {
    case 'linear':
      return clamped;
    case 'smoothStep':
      return clamped * clamped * (3 - 2 * clamped);
    case 'springBounce': {
      const c4 = (2 * Math.PI) / 3;
      return clamped === 0
        ? 0
        : clamped === 1
        ? 1
        : Math.pow(2, -8 * clamped) * Math.sin((clamped * 8 - 0.75) * c4) + 1;
    }
    case 'easeInOutSine':
    default:
      return -(Math.cos(Math.PI * clamped) - 1) / 2;
  }
}

function interpolateKeyframes<K extends string>(
  keyframes: { progress: number; joints: Record<K, number> }[],
  cycleProgress01: number,
  easing: EasingMode
): Record<K, number> {
  const sorted = [...keyframes].sort((a, b) => a.progress - b.progress);
  if (sorted.length === 0) return {} as Record<K, number>;
  if (sorted.length === 1) return { ...sorted[0].joints };

  let prev = sorted[0];
  let next = sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (cycleProgress01 >= sorted[i].progress && cycleProgress01 <= sorted[i + 1].progress) {
      prev = sorted[i];
      next = sorted[i + 1];
      break;
    }
  }

  const span = Math.max(0.0001, next.progress - prev.progress);
  const localT = (cycleProgress01 - prev.progress) / span;
  const easedT = applyEasing(localT, easing);

  const out = {} as Record<K, number>;
  (Object.keys(prev.joints) as K[]).forEach((k) => {
    const a = prev.joints[k] ?? 0;
    const b = next.joints[k] ?? 0;
    out[k] = a + (b - a) * easedT;
  });
  return out;
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Character (Default: Kawaii CRT TV Sailor Uniform Character — 5:6 Native Portrait, 18-Layer IK Rig)
  const [activeChar, setActiveChar] = useState<ActiveCharacter>('crt_tv_sailor');

  // Playback Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'keyframes' | 'presets' | 'video' | 'code'>('keyframes');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSceneComposerOpen, setIsSceneComposerOpen] = useState<boolean>(false);
  const [renderHair, setRenderHair] = useState<boolean>(true);

  // Kawaii CRT TV Sailor Uniform Character State (5:6 Native Portrait 1000×1200, 18-Layer IK & Phase 1 Visual Gate)
  const [crtSailorChannel, setCrtSailorChannel] = useState<CrtSailorChannel>('uwu');
  const [crtSailorAction, setCrtSailorAction] = useState<CrtSailorAction>('idle');
  const [crtSailorInspectionView, setCrtSailorInspectionView] = useState<CrtSailorInspectionView>('live');
  const [crtSailorExplosionSpread, setCrtSailorExplosionSpread] = useState<number>(0.65);
  const [crtSailorBezierWireframe, setCrtSailorBezierWireframe] = useState<boolean>(false);
  const [crtSailorScanlines, setCrtSailorScanlines] = useState<boolean>(false);
  const [crtSailorTransparent, setCrtSailorTransparent] = useState<boolean>(false);
  const [crtSailorManualMode, setCrtSailorManualMode] = useState<boolean>(false);
  const [showCrtLayerTable, setShowCrtLayerTable] = useState<boolean>(false);
  const [crtSailorRig, setCrtSailorRig] = useState<CrtSailorRigState>({
    ...DEFAULT_CRT_SAILOR_RIG,
  });
  // Custom Reference Image-to-Vector Calibration Overlay State
  const [customRefImageUrl, setCustomRefImageUrl] = useState<string | null>(null);
  const [customRefOpacity, setCustomRefOpacity] = useState<number>(0.42);
  const [showRefCalibrationGrid, setShowRefCalibrationGrid] = useState<boolean>(false);

  // Multi-Angle Character Sheet Vault & 4-Stage Hand/Detail Training State
  const [sheetProfiles, setSheetProfiles] = useState<CharacterSheetProfile[]>(() => [
    createDefaultCrtSailorSheetProfile(),
  ]);
  const [activeSheetProfileId, setActiveSheetProfileId] = useState<string>('crt_tv_sailor_default');
  const [newCharProfileName, setNewCharProfileName] = useState<string>('');
  const [uploadViewCategory, setUploadViewCategory] = useState<SheetViewCategory>('front');
  const [uploadViewCustomLabel, setUploadViewCustomLabel] = useState<string>('Front View');
  const [uploadViewNotes, setUploadViewNotes] = useState<string>('');
  const [isAnalyzingSheetUpload, setIsAnalyzingSheetUpload] = useState<boolean>(false);
  const [selectedTrainingPresetId, setSelectedTrainingPresetId] = useState<string>(
    DEFAULT_DETAIL_TRAINING_PRESETS[0].id
  );
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);
  const [showPlumbLinesOnViews, setShowPlumbLinesOnViews] = useState<boolean>(true);

  // Anatomy Training Mode State (Step-by-Step Finger & Palm Crease Breakdown + Common Mistake Overlays)
  const [anatomyTrainingEnabled, setAnatomyTrainingEnabled] = useState<boolean>(false);
  const [anatomyActiveStepId, setAnatomyActiveStepId] = useState<AnatomyStepId>('all_steps');
  const [anatomyActiveMistakeId, setAnatomyActiveMistakeId] =
    useState<AnatomyMistakeId>('equal_finger_lengths');
  const [copiedAnatomyCode, setCopiedAnatomyCode] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    loadAllCharacterSheetProfiles().then((saved) => {
      if (!mounted) return;
      if (saved.length > 0) {
        setSheetProfiles(saved);
        setActiveSheetProfileId(saved[0].id);
      } else {
        const def = createDefaultCrtSailorSheetProfile();
        saveCharacterSheetProfile(def);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activeSheetProfile =
    sheetProfiles.find((p) => p.id === activeSheetProfileId) ?? sheetProfiles[0];
  const activeTrainingPreset: DetailTrainingPreset =
    DEFAULT_DETAIL_TRAINING_PRESETS.find((p) => p.id === selectedTrainingPresetId) ??
    DEFAULT_DETAIL_TRAINING_PRESETS[0];
  const activeAnatomyStep =
    ANATOMY_TRAINING_STEPS.find((s) => s.id === anatomyActiveStepId) ??
    ANATOMY_TRAINING_STEPS[1];
  const activeAnatomyMistake =
    ANATOMY_COMMON_MISTAKES.find((m) => m.id === anatomyActiveMistakeId) ?? null;

  const handleCreateNewCharacterProfile = async () => {
    const cleanName = newCharProfileName.trim() || `Custom Character ${sheetProfiles.length + 1}`;
    const newProf: CharacterSheetProfile = {
      id: 'char_sheet_' + Date.now(),
      name: cleanName,
      description: 'Multi-angle turnaround & detail reference sheet saved for pure-code rigging.',
      targetStyle: 'Pure Canvas 2D Spline & Bezier Rig (1000×1200)',
      updatedAt: new Date().toISOString(),
      plumbLines: {
        headTopY: 180,
        eyeLineY: 340,
        chinNeckY: 480,
        shoulderLineY: 580,
        elbowLineY: 820,
        wristHandY: 1040,
        hemBottomY: 1180,
        centerAxisX: 500,
      },
      views: [],
    };
    await saveCharacterSheetProfile(newProf);
    setSheetProfiles((prev) => [newProf, ...prev]);
    setActiveSheetProfileId(newProf.id);
    setNewCharProfileName('');
  };

  const handleUploadCharacterSheetView = async (file: File) => {
    if (!activeSheetProfile) return;
    setIsAnalyzingSheetUpload(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const { naturalWidth, naturalHeight, analysis } = await analyzeUploadedSheetImage(dataUrl);
      const catMeta = VIEW_CATEGORY_LABELS.find((c) => c.id === uploadViewCategory);
      const finalLabel =
        uploadViewCustomLabel.trim() || catMeta?.defaultTitle || file.name.replace(/\.[^.]+$/, '');

      const newView: CharacterSheetViewItem = {
        id: 'view_' + Date.now(),
        label: finalLabel,
        category: uploadViewCategory,
        imageDataUrl: dataUrl,
        naturalWidth,
        naturalHeight,
        createdAt: new Date().toISOString(),
        notes: uploadViewNotes.trim(),
        analysis,
      };

      const updatedProfile: CharacterSheetProfile = {
        ...activeSheetProfile,
        updatedAt: new Date().toISOString(),
        views: [...activeSheetProfile.views, newView],
      };
      await saveCharacterSheetProfile(updatedProfile);
      setSheetProfiles((prev) =>
        prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
      );
      setUploadViewNotes('');
    } finally {
      setIsAnalyzingSheetUpload(false);
    }
  };

  const handleDeleteCharacterSheetView = async (viewId: string) => {
    if (!activeSheetProfile) return;
    const updatedProfile: CharacterSheetProfile = {
      ...activeSheetProfile,
      updatedAt: new Date().toISOString(),
      views: activeSheetProfile.views.filter((v) => v.id !== viewId),
    };
    await saveCharacterSheetProfile(updatedProfile);
    setSheetProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  const handleCopyCharacterBlueprintForChat = async () => {
    if (!activeSheetProfile) return;
    const text = formatCharacterSheetBlueprintForChat(activeSheetProfile, activeTrainingPreset);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2500);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  // Chibi Squire Boy State (Multi-View: Front, 3/4 [Ref Match], Side R, Side L, Back + Practice Sword + Slash/Walk/Wave)
  const [squireView, setSquireView] = useState<SquireViewAngle>('three_quarter');
  const [squireAction, setSquireAction] = useState<SquireAction>('idle');
  const [squireExpression, setSquireExpression] = useState<SquireExpression>('wonder');
  const [squireTransparent, setSquireTransparent] = useState<boolean>(false);
  const [squireCastleBg, setSquireCastleBg] = useState<boolean>(false);
  const [squireManualMode, setSquireManualMode] = useState<boolean>(false);
  const [showSquireRefCompare, setShowSquireRefCompare] = useState<boolean>(false);
  const [squireRig, setSquireRig] = useState<ChibiSquireRigState>({
    ...DEFAULT_CHIBI_SQUIRE_RIG,
  });

  // Teacup Puppy State
  const [puppyMode, setPuppyMode] = useState<PuppyAnimationMode>('20layer');
  const [puppyTransparent, setPuppyTransparent] = useState<boolean>(false);
  const [puppySteam, setPuppySteam] = useState<boolean>(true);
  const [puppyShowPivots, setPuppyShowPivots] = useState<boolean>(false);
  const [puppyRig, setPuppyRig] = useState<PuppyRigState>({ ...DEFAULT_PUPPY_RIG });

  // Extracted Compiler Characters State (15 Characters & Scenes from Uploaded Compiler HTML)
  const [compilerMode, setCompilerMode] = useState<CompilerAnimPreset>('breeze');
  const [compilerTransparent, setCompilerTransparent] = useState<boolean>(false);
  const [compilerRig, setCompilerRig] = useState<CompilerRigState>({ ...DEFAULT_COMPILER_RIG });

  // 24-Layer Shoujo Girl State
  const [shoujoMode, setShoujoMode] = useState<ShoujoAnimationMode>('24layer');
  const [shoujoTransparent, setShoujoTransparent] = useState<boolean>(false);
  const [shoujoRig, setShoujoRig] = useState<ShoujoRigState>({ ...DEFAULT_SHOUJO_RIG });

  // Victorian Bunny State
  const [bunnyMode, setBunnyMode] = useState<BunnyAnimationMode>('12layer');
  const [bunnyEyeState, setBunnyEyeState] = useState<BunnyEyeState | 'auto'>('auto');
  const [showPetals, setShowPetals] = useState<boolean>(true);
  const [showPaperGrid, setShowPaperGrid] = useState<boolean>(true);
  const [bunnyRig, setBunnyRig] = useState<BunnyRigState>({ ...DEFAULT_BUNNY_RIG });

  // Raincoat Cat State
  const [catMode, setCatMode] = useState<CatAnimationMode>('12layer');
  const [showRain, setShowRain] = useState<boolean>(true);
  const [catRig, setCatRig] = useState<CatRigState>({ ...DEFAULT_CAT_RIG });

  // ===================================================================
  // KEYFRAME LOOP ANIMATOR STATE
  // ===================================================================
  const [useKeyframeLoop, setUseKeyframeLoop] = useState<boolean>(false);
  const [loopDurationSec, setLoopDurationSec] = useState<number>(6.0);
  const [loopStyle, setLoopStyle] = useState<LoopStyle>('pingpong');
  const [easingMode, setEasingMode] = useState<EasingMode>('easeInOutSine');
  const [loopProgressUI, setLoopProgressUI] = useState<number>(0);

  // Teacup Puppy Keyframes
  const [puppyKeyframes, setPuppyKeyframes] = useState<PuppyKeyframe[]>([
    {
      id: 'start',
      label: 'Start Frame (0%)',
      progress: 0,
      joints: {
        blink: 0.0,
        headRot: -0.04,
        headDX: -3.0,
        headDY: 2.0,
        gazeDX: -1.8,
        gazeDY: -1.0,
        noseWiggle: -1.0,
        blushPulse: 0.48,
        leftEarRot: -0.06,
        rightEarRot: 0.05,
        ribbonBowRot: -0.06,
        teacupBobDY: 2.5,
        teacupTiltRot: -0.02,
        tailWagRot: -0.15,
        leftFootRot: -0.03,
        rightFootRot: 0.03,
        torsoSwayRot: -0.015,
      },
    },
    {
      id: 'end',
      label: 'Target Keyframe (100%)',
      progress: 1,
      joints: {
        blink: 0.55,
        headRot: 0.045,
        headDX: 3.0,
        headDY: -2.5,
        gazeDX: 1.8,
        gazeDY: 1.0,
        noseWiggle: 1.4,
        blushPulse: 0.72,
        leftEarRot: 0.07,
        rightEarRot: -0.06,
        ribbonBowRot: 0.065,
        teacupBobDY: -3.0,
        teacupTiltRot: 0.025,
        tailWagRot: 0.16,
        leftFootRot: 0.035,
        rightFootRot: -0.035,
        torsoSwayRot: 0.015,
      },
    },
  ]);
  const [activePuppyKfId, setActivePuppyKfId] = useState<string>('start');

  // Extracted Compiler Characters Keyframes
  const [compilerKeyframes, setCompilerKeyframes] = useState<CompilerKeyframe[]>([
    {
      id: 'start',
      label: 'Start Frame (0%)',
      progress: 0,
      joints: {
        ...DEFAULT_COMPILER_RIG,
        headTilt: -0.035,
        headTurn: -3.5,
        headNod: 2.5,
        blink: 0.0,
        gazeX: -2.0,
        gazeY: -1.0,
        hairSwayL: -0.04,
        hairSwayR: -0.04,
        bangsSway: -0.03,
        ruffleBounce: -0.06,
      },
    },
    {
      id: 'end',
      label: 'Target Keyframe (100%)',
      progress: 1,
      joints: {
        ...DEFAULT_COMPILER_RIG,
        headTilt: 0.04,
        headTurn: 3.5,
        headNod: -2.5,
        blink: 0.55,
        gazeX: 2.0,
        gazeY: 1.0,
        hairSwayL: 0.045,
        hairSwayR: 0.045,
        bangsSway: 0.035,
        ruffleBounce: 0.07,
      },
    },
  ]);
  const [activeCompilerKfId, setActiveCompilerKfId] = useState<string>('start');

  // Shoujo Girl Keyframes
  const [shoujoKeyframes, setShoujoKeyframes] = useState<ShoujoKeyframe[]>([
    {
      id: 'start',
      label: 'Start Frame (0%)',
      progress: 0,
      joints: {
        headRot: -0.045,
        headDX: -4,
        headDY: 2,
        blink: 0.0,
        gazeDX: -2.5,
        gazeDY: -1.5,
        browLift: 1.5,
        lipPart: 0.5,
        bangLRot: -0.05,
        bangRRot: -0.04,
        cheekLockRot: -0.07,
        shoulderCurlRot: -0.06,
        backHairLRot: -0.04,
        backHairRRot: -0.05,
        heartRot: -0.14,
        strapDropRot: -0.1,
        roseSpin: -0.08,
        bowFlutter: -0.08,
        torsoBreath: -0.6,
      },
    },
    {
      id: 'end',
      label: 'Target Keyframe (100%)',
      progress: 1,
      joints: {
        headRot: 0.055,
        headDX: 4,
        headDY: -3,
        blink: 0.55,
        gazeDX: 2.5,
        gazeDY: 1.0,
        browLift: 3.0,
        lipPart: 2.5,
        bangLRot: 0.06,
        bangRRot: 0.05,
        cheekLockRot: 0.08,
        shoulderCurlRot: 0.07,
        backHairLRot: 0.05,
        backHairRRot: 0.06,
        heartRot: 0.16,
        strapDropRot: 0.12,
        roseSpin: 0.1,
        bowFlutter: 0.09,
        torsoBreath: 0.8,
      },
    },
  ]);
  const [activeShoujoKfId, setActiveShoujoKfId] = useState<string>('start');

  // Bunny Keyframes
  const [bunnyKeyframes, setBunnyKeyframes] = useState<BunnyKeyframe[]>([
    {
      id: 'start',
      label: 'Start Frame (0%)',
      progress: 0,
      joints: {
        headRot: -0.06,
        bonnetFlutter: -0.04,
        earLeftRot: -0.08,
        earRightRot: 0.05,
        armLeftRot: -0.08,
        armRightRot: 0.08,
        footLeftRot: -0.07,
        footRightRot: 0.07,
        tailWagRot: -0.14,
        chestBowRot: -0.06,
        sideBowRot: -0.07,
        noseTwitchY: -2.0,
        bodyRot: -0.03,
      },
    },
    {
      id: 'end',
      label: 'Target Keyframe (100%)',
      progress: 1,
      joints: {
        headRot: 0.07,
        bonnetFlutter: 0.05,
        earLeftRot: 0.09,
        earRightRot: -0.08,
        armLeftRot: 0.1,
        armRightRot: -0.1,
        footLeftRot: 0.08,
        footRightRot: -0.08,
        tailWagRot: 0.16,
        chestBowRot: 0.07,
        sideBowRot: 0.08,
        noseTwitchY: 2.5,
        bodyRot: 0.035,
      },
    },
  ]);
  const [activeBunnyKfId, setActiveBunnyKfId] = useState<string>('start');

  // Cat Keyframes
  const [catKeyframes, setCatKeyframes] = useState<CatKeyframe[]>([
    {
      id: 'start',
      label: 'Start Frame (0%)',
      progress: 0,
      joints: {
        headTilt: -0.06,
        earRotL: -0.08,
        earRotR: 0.06,
        armLRot: -0.07,
        umbTilt: -0.06,
        armRRot: 0.06,
        footTapL: -0.08,
        footTapR: 0.08,
        bodySway: -0.04,
        whiskerTwitch: -0.06,
      },
    },
    {
      id: 'end',
      label: 'Target Keyframe (100%)',
      progress: 1,
      joints: {
        headTilt: 0.06,
        earRotL: 0.08,
        earRotR: -0.07,
        armLRot: 0.08,
        umbTilt: 0.07,
        armRRot: -0.07,
        footTapL: 0.09,
        footTapR: -0.08,
        bodySway: 0.04,
        whiskerTwitch: 0.07,
      },
    },
  ]);
  const [activeCatKfId, setActiveCatKfId] = useState<string>('start');

  // Chibi Squire Boy Keyframes
  const [squireKeyframes, setSquireKeyframes] = useState<SquireKeyframe[]>(DEFAULT_SQUIRE_KEYFRAMES);
  const [activeSquireKfId, setActiveSquireKfId] = useState<string>('start');

  // Kawaii CRT TV Sailor Keyframes
  const [crtSailorKeyframes, setCrtSailorKeyframes] = useState<CrtSailorKeyframe[]>(
    DEFAULT_CRT_SAILOR_KEYFRAMES
  );
  const [activeCrtSailorKfId, setActiveCrtSailorKfId] = useState<string>('start');

  // ===================================================================
  // VIDEO RECORDING, INSTANT SAVE & AFTER EFFECTS ALPHA EXPORT STATE
  // ===================================================================
  const [videoDurationSec, setVideoDurationSec] = useState<number>(6);
  const [videoFps, setVideoFps] = useState<number>(60);
  const [videoTransparentBg, setVideoTransparentBg] = useState<boolean>(true);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingModeLabel, setRecordingModeLabel] = useState<string>('Normal Video');
  const [recordingElapsedSec, setRecordingElapsedSec] = useState<number>(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedVideoExt, setRecordedVideoExt] = useState<string>('webm');
  const [isExportingAeZip, setIsExportingAeZip] = useState<boolean>(false);
  const [aeZipProgress, setAeZipProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [lastAeZipUrl, setLastAeZipUrl] = useState<{ url: string; filename: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const forceTransparentCaptureRef = useRef<boolean | null>(null);

  // Animation clock refs
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const uiThrottleRef = useRef<number>(0);

  // Compute current interpolated joint state at time `t`
  const computeKeyframeRigAtTime = useCallback(
    (t: number) => {
      const dur = Math.max(0.2, loopDurationSec);
      const rawCycles = t / dur;
      let cycleProgress01 = rawCycles % 1;
      if (cycleProgress01 < 0) cycleProgress01 += 1;

      if (loopStyle === 'pingpong') {
        const twoCycle = rawCycles % 2;
        cycleProgress01 = twoCycle <= 1 ? twoCycle : 2 - twoCycle;
      }

      return {
        cycleProgress01,
        crtSailorJoints: interpolateKeyframes(crtSailorKeyframes, cycleProgress01, easingMode),
        squireJoints: interpolateKeyframes(squireKeyframes, cycleProgress01, easingMode),
        puppyJoints: interpolateKeyframes(puppyKeyframes, cycleProgress01, easingMode),
        compilerJoints: interpolateKeyframes(compilerKeyframes, cycleProgress01, easingMode),
        shoujoJoints: interpolateKeyframes(shoujoKeyframes, cycleProgress01, easingMode),
        bunnyJoints: interpolateKeyframes(bunnyKeyframes, cycleProgress01, easingMode),
        catJoints: interpolateKeyframes(catKeyframes, cycleProgress01, easingMode),
      };
    },
    [
      loopDurationSec,
      loopStyle,
      easingMode,
      crtSailorKeyframes,
      squireKeyframes,
      puppyKeyframes,
      compilerKeyframes,
      shoujoKeyframes,
      bunnyKeyframes,
      catKeyframes,
    ]
  );

  // Reusable deterministic character frame renderer (used by Live 60FPS loop, Fast Video Save & After Effects Alpha ZIP)
  const renderCharacterFrameToContext = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      t: number,
      options?: { forceTransparent?: boolean; forceAnimated?: boolean; updateUiProgress?: boolean; nowMs?: number }
    ) => {
      const forceTrans =
        options?.forceTransparent !== undefined
          ? options.forceTransparent
          : forceTransparentCaptureRef.current !== null
          ? forceTransparentCaptureRef.current
          : undefined;
      const animated = options?.forceAnimated || isPlaying || isRecordingVideo;

      if (useKeyframeLoop) {
        const {
          cycleProgress01,
          crtSailorJoints,
          squireJoints,
          puppyJoints,
          compilerJoints,
          shoujoJoints,
          bunnyJoints,
          catJoints,
        } = computeKeyframeRigAtTime(t);

        if (options?.updateUiProgress && options.nowMs !== undefined) {
          if (options.nowMs - uiThrottleRef.current > 60) {
            uiThrottleRef.current = options.nowMs;
            setLoopProgressUI(cycleProgress01);
          }
        }

        if (activeChar === 'crt_tv_sailor') {
          const kfPose = animated
            ? crtSailorJoints
            : crtSailorKeyframes.find((k) => k.id === activeCrtSailorKfId)?.joints ??
              crtSailorJoints;
          const currentCrtRig: CrtSailorRigState = {
            ...DEFAULT_CRT_SAILOR_RIG,
            ...kfPose,
            channel: crtSailorChannel,
            action: crtSailorAction,
            inspectionView: forceTrans ? 'live' : crtSailorInspectionView,
            explosionSpread: crtSailorExplosionSpread,
            showBezierWireframe: forceTrans ? false : crtSailorBezierWireframe,
            crtScanlines: crtSailorScanlines,
            transparentBg: forceTrans ?? crtSailorTransparent,
            time: t,
          };
          drawCrtTvSailor(
            ctx,
            currentCrtRig,
            undefined,
            forceTrans
              ? undefined
              : {
                  enabled: anatomyTrainingEnabled,
                  stepId: anatomyActiveStepId,
                  mistakeId: anatomyActiveMistakeId,
                }
          );
        } else if (activeChar === 'chibi_squire') {
          const isTrans = forceTrans ?? squireTransparent;
          const kfPose = animated
            ? squireJoints
            : squireKeyframes.find((k) => k.id === activeSquireKfId)?.joints ?? squireJoints;
          const currentSquireRig: ChibiSquireRigState = {
            ...DEFAULT_CHIBI_SQUIRE_RIG,
            ...kfPose,
            viewAngle: squireView,
            action: squireAction,
            expression: squireExpression,
            renderHair,
            transparentBg: isTrans,
            time: t,
          };
          if (squireCastleBg && !isTrans) {
            drawSquireCastleYardBG(ctx, t, 1000, 1000);
          }
          drawChibiSquire(ctx, currentSquireRig, 500, 500, 1);
        } else if (activeChar === 'teacup_puppy') {
          const currentRig: PuppyRigState = animated
            ? { ...DEFAULT_PUPPY_RIG, ...puppyJoints }
            : {
                ...DEFAULT_PUPPY_RIG,
                ...(puppyKeyframes.find((k) => k.id === activePuppyKfId)?.joints ?? puppyJoints),
              };
          drawTeacupPuppy(ctx, currentRig, t, {
            transparentBg: forceTrans ?? puppyTransparent,
            showSteam: puppySteam,
            showRigPivots: forceTrans ? false : puppyShowPivots,
          });
        } else if (isExtractedCompilerChar(activeChar)) {
          const currentRig: CompilerRigState = animated
            ? { ...DEFAULT_COMPILER_RIG, ...compilerJoints }
            : {
                ...DEFAULT_COMPILER_RIG,
                ...(compilerKeyframes.find((k) => k.id === activeCompilerKfId)?.joints ??
                  compilerJoints),
              };
          drawExtractedCompilerCharacter(activeChar, ctx, currentRig, t, {
            transparentBg: forceTrans ?? compilerTransparent,
            renderHair,
          });
        } else if (activeChar === 'shoujo_girl') {
          const isTrans = forceTrans ?? shoujoTransparent;
          if (isTrans) ctx.clearRect(0, 0, 1000, 1000);
          const currentRig: ShoujoRigState = animated
            ? {
                ...DEFAULT_SHOUJO_RIG,
                ...shoujoJoints,
                time: t,
                mode: 'manual',
                renderHair,
              }
            : {
                ...DEFAULT_SHOUJO_RIG,
                ...(shoujoKeyframes.find((k) => k.id === activeShoujoKfId)?.joints ??
                  shoujoJoints),
                time: t,
                mode: 'manual',
                renderHair,
              };
          drawShoujoGirl(ctx, currentRig, 500, 500, 1);
        } else if (activeChar === 'victorian_bunny') {
          const isTrans = forceTrans ?? false;
          if (isTrans) {
            ctx.clearRect(0, 0, 1000, 1000);
          } else if (showPaperGrid) {
            drawBunnyPaperBackground(ctx, 1000, 1000);
          } else {
            ctx.fillStyle = '#F9F6F0';
            ctx.fillRect(0, 0, 1000, 1000);
          }
          const currentRig: BunnyRigState = animated
            ? {
                ...DEFAULT_BUNNY_RIG,
                ...bunnyJoints,
                time: t,
                mode: 'manual',
                eyeState: bunnyEyeState === 'auto' ? 'open' : bunnyEyeState,
              }
            : {
                ...DEFAULT_BUNNY_RIG,
                ...(bunnyKeyframes.find((k) => k.id === activeBunnyKfId)?.joints ?? bunnyJoints),
                time: t,
                mode: 'manual',
                eyeState: bunnyEyeState === 'auto' ? 'open' : bunnyEyeState,
              };
          drawVictorianBunny(ctx, currentRig, 500, 500, 1);
          if (showPetals && !isTrans) {
            drawFloatingPetals(ctx, 1000, 1000, t);
          }
        } else {
          const isTrans = forceTrans ?? false;
          if (isTrans) {
            ctx.clearRect(0, 0, 1000, 1000);
          } else {
            ctx.fillStyle = RC.bg;
            ctx.fillRect(0, 0, 1000, 1000);
            drawPaperTooth(ctx, 1000, 1000);
          }
          const currentCatRig: CatRigState = animated
            ? { ...DEFAULT_CAT_RIG, ...catJoints, mode: 'manual' }
            : {
                ...DEFAULT_CAT_RIG,
                ...(catKeyframes.find((k) => k.id === activeCatKfId)?.joints ?? catJoints),
                mode: 'manual',
              };
          drawRiggedCalicoKitten(ctx, 495, 560, 1, currentCatRig, t);
          if (showRain && !isTrans) {
            drawRainEnvironment(ctx, t, true, true);
          }
        }
      } else {
        // Standard Procedural Engine Mode
        if (activeChar === 'crt_tv_sailor') {
          const baseRig: CrtSailorRigState = {
            ...crtSailorRig,
            channel: crtSailorChannel,
            action: crtSailorAction,
            inspectionView: forceTrans ? 'live' : crtSailorInspectionView,
            explosionSpread: crtSailorExplosionSpread,
            showBezierWireframe: forceTrans ? false : crtSailorBezierWireframe,
            crtScanlines: crtSailorScanlines,
            transparentBg: forceTrans ?? crtSailorTransparent,
            time: t,
          };
          const activeRig = crtSailorManualMode
            ? baseRig
            : computeCrtSailorRigAtTime(t, crtSailorAction, baseRig);
          drawCrtTvSailor(
            ctx,
            activeRig,
            undefined,
            forceTrans
              ? undefined
              : {
                  enabled: anatomyTrainingEnabled,
                  stepId: anatomyActiveStepId,
                  mistakeId: anatomyActiveMistakeId,
                }
          );
        } else if (activeChar === 'chibi_squire') {
          const isTrans = forceTrans ?? squireTransparent;
          const baseRig: ChibiSquireRigState = {
            ...squireRig,
            viewAngle: squireView,
            action: squireAction,
            expression: squireExpression,
            renderHair,
            transparentBg: isTrans,
          };
          const activeRig = squireManualMode
            ? baseRig
            : computeChibiSquireRigAtTime(t, squireAction, baseRig);
          if (squireCastleBg && !isTrans) {
            drawSquireCastleYardBG(ctx, t, 1000, 1000);
          }
          drawChibiSquire(ctx, activeRig, 500, 500, 1);
        } else if (activeChar === 'teacup_puppy') {
          const activeRig = computePuppyRigAtTime(t, puppyMode, puppyRig);
          drawTeacupPuppy(ctx, activeRig, t, {
            transparentBg: forceTrans ?? puppyTransparent,
            showSteam: puppySteam,
            showRigPivots: forceTrans ? false : puppyShowPivots,
          });
        } else if (isExtractedCompilerChar(activeChar)) {
          const activeRig =
            compilerMode === 'static'
              ? null
              : computeCompilerRigAtTime(t, compilerMode, compilerRig);
          drawExtractedCompilerCharacter(activeChar, ctx, activeRig, t, {
            transparentBg: forceTrans ?? compilerTransparent,
            renderHair,
          });
        } else if (activeChar === 'shoujo_girl') {
          const isTrans = forceTrans ?? shoujoTransparent;
          if (isTrans) ctx.clearRect(0, 0, 1000, 1000);
          drawShoujoGirl(
            ctx,
            { ...shoujoRig, time: t, mode: shoujoMode, renderHair },
            500,
            500,
            1
          );
        } else if (activeChar === 'victorian_bunny') {
          const isTrans = forceTrans ?? false;
          if (isTrans) {
            ctx.clearRect(0, 0, 1000, 1000);
          } else if (showPaperGrid) {
            drawBunnyPaperBackground(ctx, 1000, 1000);
          } else {
            ctx.fillStyle = '#F9F6F0';
            ctx.fillRect(0, 0, 1000, 1000);
          }
          drawVictorianBunny(
            ctx,
            {
              ...bunnyRig,
              time: t,
              mode: bunnyMode,
              eyeState: bunnyEyeState === 'auto' ? 'open' : bunnyEyeState,
            },
            500,
            500,
            1
          );
          if (showPetals && !isTrans) {
            drawFloatingPetals(ctx, 1000, 1000, t);
          }
        } else {
          const isTrans = forceTrans ?? false;
          if (isTrans) {
            ctx.clearRect(0, 0, 1000, 1000);
          } else {
            ctx.fillStyle = RC.bg;
            ctx.fillRect(0, 0, 1000, 1000);
            drawPaperTooth(ctx, 1000, 1000);
          }
          drawRiggedCalicoKitten(
            ctx,
            495,
            560,
            1,
            { ...catRig, mode: catMode },
            t
          );
          if (showRain && !isTrans) {
            drawRainEnvironment(ctx, t, true, true);
          }
        }
      }

      // If Anatomy Training Mode is enabled while viewing a non-CRT character, render the
      // interactive finger/palm guide & mistake overlay mapped to that character's hand zone
      if (activeChar !== 'crt_tv_sailor' && anatomyTrainingEnabled && !forceTrans) {
        const handCenterMap: Partial<Record<ActiveCharacter, [number, number]>> = {
          chibi_squire: [490, 625],
          teacup_puppy: [534, 650],
          shoujo_girl: [485, 760],
          victorian_bunny: [480, 635],
          raincoat_cat: [495, 645],
        };
        const targetCenter = handCenterMap[activeChar] ?? [500, 660];
        drawHandAnatomyTrainingOverlay(ctx, {
          enabled: true,
          stepId: anatomyActiveStepId,
          mistakeId: anatomyActiveMistakeId,
          targetCenter,
          targetScale: 1.25,
          compactLabels: false,
        });
      }
    },
    [
      activeChar,
      isPlaying,
      isRecordingVideo,
      useKeyframeLoop,
      computeKeyframeRigAtTime,
      crtSailorChannel,
      crtSailorAction,
      crtSailorInspectionView,
      crtSailorExplosionSpread,
      crtSailorBezierWireframe,
      crtSailorScanlines,
      crtSailorTransparent,
      crtSailorManualMode,
      crtSailorRig,
      crtSailorKeyframes,
      activeCrtSailorKfId,
      anatomyTrainingEnabled,
      anatomyActiveStepId,
      anatomyActiveMistakeId,
      puppyMode,
      puppyTransparent,
      puppySteam,
      puppyShowPivots,
      puppyRig,
      puppyKeyframes,
      activePuppyKfId,
      compilerMode,
      compilerTransparent,
      compilerRig,
      compilerKeyframes,
      activeCompilerKfId,
      shoujoMode,
      shoujoTransparent,
      shoujoRig,
      shoujoKeyframes,
      activeShoujoKfId,
      bunnyMode,
      bunnyEyeState,
      showPetals,
      showPaperGrid,
      bunnyRig,
      bunnyKeyframes,
      activeBunnyKfId,
      catMode,
      showRain,
      catRig,
      catKeyframes,
      activeCatKfId,
      renderHair,
      squireView,
      squireAction,
      squireExpression,
      squireTransparent,
      squireCastleBg,
      squireManualMode,
      squireRig,
      squireKeyframes,
      activeSquireKfId,
    ]
  );

  // Main 60fps Canvas Render Loop
  useEffect(() => {
    let rafId: number;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = now;

      if (isPlaying || isRecordingVideo) {
        timeRef.current += dt * speed;
      }
      const t = timeRef.current;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderCharacterFrameToContext(ctx, t, {
            updateUiProgress: true,
            nowMs: now,
          });
        }
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isRecordingVideo, speed, renderCharacterFrameToContext]);

  // Update a joint slider for Kawaii CRT TV Sailor
  const handleCrtSailorJointChange = (key: CrtSailorJointKey, value: number) => {
    if (useKeyframeLoop) {
      setCrtSailorKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeCrtSailorKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setCrtSailorManualMode(true);
      setCrtSailorRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Update a joint slider for Chibi Squire Boy
  const handleSquireJointChange = (key: SquireJointKey, value: number) => {
    if (useKeyframeLoop) {
      setSquireKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeSquireKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setSquireManualMode(true);
      setSquireRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handlePuppyJointChange = (key: PuppyJointKey, value: number) => {
    if (useKeyframeLoop) {
      setPuppyKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activePuppyKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setPuppyMode('manual');
      setPuppyRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleCompilerJointChange = (key: CompilerJointKey, value: number) => {
    if (useKeyframeLoop) {
      setCompilerKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeCompilerKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setCompilerMode('manual');
      setCompilerRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleShoujoJointChange = (key: ShoujoJointKey, value: number) => {
    if (useKeyframeLoop) {
      setShoujoKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeShoujoKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setShoujoMode('manual');
      setShoujoRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleBunnyJointChange = (key: BunnyJointKey, value: number) => {
    if (useKeyframeLoop) {
      setBunnyKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeBunnyKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setBunnyMode('manual');
      setBunnyRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleCatJointChange = (key: CatJointKey, value: number) => {
    if (useKeyframeLoop) {
      setCatKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === activeCatKfId
            ? { ...kf, joints: { ...kf.joints, [key]: value } }
            : kf
        )
      );
    } else {
      setCatMode('manual');
      setCatRig((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Add Intermediate Keyframe
  const handleAddMidKeyframe = () => {
    setUseKeyframeLoop(true);
    if (activeChar === 'crt_tv_sailor') {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(crtSailorKeyframes, 0.5, easingMode);
      const newKf: CrtSailorKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setCrtSailorKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveCrtSailorKfId(id);
    } else if (activeChar === 'chibi_squire') {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(squireKeyframes, 0.5, easingMode);
      const newKf: SquireKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setSquireKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveSquireKfId(id);
    } else if (activeChar === 'teacup_puppy') {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(puppyKeyframes, 0.5, easingMode);
      const newKf: PuppyKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setPuppyKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActivePuppyKfId(id);
    } else if (isExtractedCompilerChar(activeChar)) {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(compilerKeyframes, 0.5, easingMode);
      const newKf: CompilerKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setCompilerKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveCompilerKfId(id);
    } else if (activeChar === 'shoujo_girl') {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(shoujoKeyframes, 0.5, easingMode);
      const newKf: ShoujoKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setShoujoKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveShoujoKfId(id);
    } else if (activeChar === 'victorian_bunny') {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(bunnyKeyframes, 0.5, easingMode);
      const newKf: BunnyKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setBunnyKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveBunnyKfId(id);
    } else {
      const id = 'kf_' + Date.now();
      const midJoints = interpolateKeyframes(catKeyframes, 0.5, easingMode);
      const newKf: CatKeyframe = {
        id,
        label: `Mid Keyframe (50%)`,
        progress: 0.5,
        joints: midJoints,
      };
      setCatKeyframes((prev) =>
        [...prev, newKf].sort((a, b) => a.progress - b.progress)
      );
      setActiveCatKfId(id);
    }
  };

  // Swap Start and End Keyframes
  const handleSwapStartEnd = () => {
    setUseKeyframeLoop(true);
    if (activeChar === 'crt_tv_sailor') {
      setCrtSailorKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else if (activeChar === 'chibi_squire') {
      setSquireKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else if (activeChar === 'teacup_puppy') {
      setPuppyKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else if (isExtractedCompilerChar(activeChar)) {
      setCompilerKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else if (activeChar === 'shoujo_girl') {
      setShoujoKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else if (activeChar === 'victorian_bunny') {
      setBunnyKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    } else {
      setCatKeyframes((prev) => {
        if (prev.length < 2) return prev;
        const first = prev[0];
        const last = prev[prev.length - 1];
        return prev.map((kf, idx) => {
          if (idx === 0) return { ...kf, joints: { ...last.joints } };
          if (idx === prev.length - 1) return { ...kf, joints: { ...first.joints } };
          return kf;
        });
      });
    }
  };

  // Apply Ready-Made Keyframe Loop Presets for Kawaii CRT TV Sailor
  const applyCrtSailorLoopPreset = (
    preset: 'idle_breath' | 'channel_surf' | 'shy_fidget_loop' | 'happy_antenna_bounce'
  ) => {
    setUseKeyframeLoop(true);
    setCrtSailorInspectionView('live');
    setIsPlaying(true);
    if (preset === 'idle_breath') {
      setLoopDurationSec(2.4);
      setCrtSailorChannel('uwu');
      setCrtSailorKeyframes([
        {
          id: 'start',
          label: 'Inhale Sway (0%)',
          progress: 0,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headTilt: -0.04,
            headDY: -3,
            leftAntennaRot: -0.07,
            rightAntennaRot: -0.05,
            handsDY: -4,
            elbowSpread: -0.025,
            ribbonBowRot: -0.05,
            torsoBobY: -3,
          },
        },
        {
          id: 'end',
          label: 'Exhale Sway (100%)',
          progress: 1,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headTilt: 0.04,
            headDY: 3,
            leftAntennaRot: 0.07,
            rightAntennaRot: 0.05,
            handsDY: 4,
            elbowSpread: 0.025,
            ribbonBowRot: 0.05,
            torsoBobY: 3,
          },
        },
      ]);
    } else if (preset === 'channel_surf') {
      setLoopDurationSec(2.8);
      setCrtSailorChannel('happy');
      setCrtSailorKeyframes([
        {
          id: 'start',
          label: 'Tune Dial Left (0%)',
          progress: 0,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headTilt: -0.07,
            headDX: -4,
            upperDialRot: -1.4,
            lowerDialRot: -0.8,
            leftAntennaRot: -0.14,
            rightAntennaRot: 0.10,
            gazeDX: -4,
            handsDY: -3,
          },
        },
        {
          id: 'end',
          label: 'Tune Dial Right (100%)',
          progress: 1,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headTilt: 0.07,
            headDX: 4,
            upperDialRot: 1.4,
            lowerDialRot: 0.8,
            leftAntennaRot: 0.14,
            rightAntennaRot: -0.10,
            gazeDX: 4,
            handsDY: 4,
          },
        },
      ]);
    } else if (preset === 'shy_fidget_loop') {
      setLoopDurationSec(2.2);
      setCrtSailorChannel('uwu');
      setCrtSailorKeyframes([
        {
          id: 'start',
          label: 'Shy Clasped Left (0%)',
          progress: 0,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            blink: 0.55,
            headTilt: -0.08,
            headDY: 4,
            gazeDX: -3.5,
            gazeDY: 2,
            blushPulse: 0.9,
            handsDX: -5.5,
            handsDY: -4,
            handsRot: -0.05,
            elbowSpread: 0.04,
            ribbonBowRot: -0.06,
          },
        },
        {
          id: 'end',
          label: 'Shy Clasped Right (100%)',
          progress: 1,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            blink: 0.0,
            headTilt: -0.03,
            headDY: 2,
            gazeDX: 3.5,
            gazeDY: 2,
            blushPulse: 0.95,
            handsDX: 5.5,
            handsDY: 3,
            handsRot: 0.05,
            elbowSpread: -0.02,
            ribbonBowRot: 0.06,
          },
        },
      ]);
    } else if (preset === 'happy_antenna_bounce') {
      setLoopDurationSec(1.8);
      setCrtSailorChannel('heart');
      setCrtSailorKeyframes([
        {
          id: 'start',
          label: 'Signal Hop Up (0%)',
          progress: 0,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headDY: -5.5,
            headTilt: -0.05,
            leftAntennaRot: -0.16,
            rightAntennaRot: 0.16,
            handsDY: -6.5,
            elbowSpread: 0.05,
            torsoBobY: -4.5,
            collarSway: -0.03,
            ribbonBowRot: -0.09,
          },
        },
        {
          id: 'end',
          label: 'Signal Settle Down (100%)',
          progress: 1,
          joints: {
            ...extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG),
            headDY: 4.5,
            headTilt: 0.05,
            leftAntennaRot: 0.12,
            rightAntennaRot: -0.12,
            handsDY: 5.5,
            elbowSpread: -0.03,
            torsoBobY: 4.0,
            collarSway: 0.03,
            ribbonBowRot: 0.09,
          },
        },
      ]);
    }
  };

  // Apply Ready-Made Keyframe Loop Presets for Chibi Squire Boy
  const applySquireLoopPreset = (
    preset: 'practice_slash' | 'squire_stride' | 'cheerful_wave' | 'scout_scan' | 'idle_breath' | 'combat_stance'
  ) => {
    setUseKeyframeLoop(true);
    setIsPlaying(true);
    if (preset === 'idle_breath') {
      setLoopDurationSec(1.8);
      setSquireAction('idle');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Start Breath In (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: -0.03,
            headNodY: 2,
            hairSway: -0.03,
            torsoBobY: -3,
            armRightRot: 0.08,
            armLeftRot: -0.08,
            swordTilt: -0.04,
          },
        },
        {
          id: 'end',
          label: 'Target Breath Out (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: 0.03,
            headNodY: -2,
            hairSway: 0.03,
            torsoBobY: 3,
            armRightRot: -0.08,
            armLeftRot: 0.08,
            swordTilt: 0.04,
          },
        },
      ]);
    } else if (preset === 'practice_slash') {
      setLoopDurationSec(2.2);
      setSquireAction('slash');
      setSquireExpression('determined');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Windup Grip (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: -0.06,
            armLeftRot: -0.85,
            swordTilt: -0.32,
            swordDraw: 15,
            torsoSwayRot: 0.04,
            hairSway: -0.05,
          },
        },
        {
          id: 'slash_mid',
          label: 'Power Slash Arc (50%)',
          progress: 0.5,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: 0.04,
            armLeftRot: 1.15,
            swordTilt: 0.42,
            swordDraw: 26,
            torsoBobY: 5,
            torsoSwayRot: -0.05,
            hairSway: 0.08,
            armRightRot: -0.35,
          },
        },
        {
          id: 'end',
          label: 'Follow Through (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: -0.02,
            armLeftRot: 0.65,
            swordTilt: 0.25,
            swordDraw: 18,
            torsoBobY: 2,
            hairSway: 0.03,
          },
        },
      ]);
    } else if (preset === 'squire_stride') {
      setLoopDurationSec(1.6);
      setSquireAction('walk');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Left Foot Stride (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            legLeftRot: 0.26,
            legRightRot: -0.26,
            legLeftLiftY: -16,
            legRightLiftY: 0,
            armRightRot: -0.3,
            armLeftRot: 0.24,
            torsoBobY: -6,
            headNodY: -3,
            hairSway: -0.04,
            swordTilt: -0.06,
          },
        },
        {
          id: 'end',
          label: 'Right Foot Stride (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            legLeftRot: -0.26,
            legRightRot: 0.26,
            legLeftLiftY: 0,
            legRightLiftY: -16,
            armRightRot: 0.3,
            armLeftRot: -0.24,
            torsoBobY: 6,
            headNodY: 3,
            hairSway: 0.04,
            swordTilt: 0.06,
          },
        },
      ]);
    } else if (preset === 'cheerful_wave') {
      setLoopDurationSec(2.0);
      setSquireExpression('happy');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Wave Up Left (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: -0.06,
            armRightRot: -1.8,
            hairSway: -0.04,
            torsoBobY: -2,
          },
        },
        {
          id: 'end',
          label: 'Wave Up Right (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTilt: -0.02,
            armRightRot: -2.3,
            hairSway: 0.05,
            torsoBobY: 2,
          },
        },
      ]);
    } else if (preset === 'scout_scan') {
      setLoopDurationSec(3.5);
      setSquireExpression('wonder');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Scan Left (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTurnX: -16,
            gazeX: -6.5,
            headTilt: -0.05,
            hairSway: -0.04,
          },
        },
        {
          id: 'end',
          label: 'Scan Right (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            headTurnX: 16,
            gazeX: 6.5,
            headTilt: 0.05,
            hairSway: 0.04,
          },
        },
      ]);
    } else if (preset === 'combat_stance') {
      setLoopDurationSec(1.8);
      setSquireExpression('determined');
      setSquireKeyframes([
        {
          id: 'start',
          label: 'Stance Crouch (0%)',
          progress: 0,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            torsoBobY: 10,
            headTilt: 0.04,
            armLeftRot: -0.4,
            swordDraw: 12,
            swordTilt: -0.15,
            legLeftRot: 0.1,
            legRightRot: -0.1,
          },
        },
        {
          id: 'end',
          label: 'Stance Guard (100%)',
          progress: 1,
          joints: {
            ...extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG),
            torsoBobY: 4,
            headTilt: -0.03,
            armLeftRot: -0.55,
            swordDraw: 16,
            swordTilt: -0.22,
            legLeftRot: 0.05,
            legRightRot: -0.05,
          },
        },
      ]);
    }
  };

  // Apply Ready-Made Keyframe Loop Presets for Teacup Puppy
  const applyPuppyLoopPreset = (
    preset: 'teacup_sip_wag' | 'sleepy_ear_sway' | 'happy_tail_bounce' | 'curious_head_tilt'
  ) => {
    setUseKeyframeLoop(true);
    setIsPlaying(true);
    if (preset === 'teacup_sip_wag') {
      setLoopDurationSec(5.0);
      setPuppyKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            headRot: -0.04,
            headDY: -1.5,
            leftEarRot: -0.05,
            rightEarRot: 0.04,
            teacupBobDY: 3.0,
            tailWagRot: -0.16,
            noseWiggle: -1.2,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            blink: 0.55,
            headRot: 0.04,
            headDY: 4.5,
            leftEarRot: 0.06,
            rightEarRot: -0.06,
            teacupBobDY: -5.5,
            teacupTiltRot: -0.04,
            tailWagRot: 0.18,
            noseWiggle: 1.5,
            blushPulse: 0.78,
          },
        },
      ]);
    } else if (preset === 'sleepy_ear_sway') {
      setLoopDurationSec(6.0);
      setPuppyKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            blink: 0.0,
            headRot: -0.03,
            headDY: 2.0,
            leftEarRot: -0.08,
            rightEarRot: -0.06,
            ribbonBowRot: -0.07,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            blink: 1.0,
            headRot: 0.05,
            headDY: 5.0,
            leftEarRot: 0.08,
            rightEarRot: 0.07,
            ribbonBowRot: 0.08,
            blushPulse: 0.75,
          },
        },
      ]);
    } else if (preset === 'happy_tail_bounce') {
      setLoopDurationSec(3.0);
      setPuppyKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            tailWagRot: -0.22,
            leftFootRot: -0.07,
            rightFootRot: 0.07,
            teacupBobDY: -3.5,
            ribbonBowRot: -0.10,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            tailWagRot: 0.22,
            leftFootRot: 0.07,
            rightFootRot: -0.07,
            teacupBobDY: 3.5,
            ribbonBowRot: 0.10,
          },
        },
      ]);
    } else if (preset === 'curious_head_tilt') {
      setLoopDurationSec(4.5);
      setPuppyKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            headRot: -0.11,
            headDX: -6.0,
            gazeDX: -3.5,
            leftEarRot: -0.12,
            rightEarRot: -0.08,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractPuppyJoints(DEFAULT_PUPPY_RIG),
            headRot: 0.11,
            headDX: 6.0,
            gazeDX: 3.5,
            leftEarRot: 0.09,
            rightEarRot: 0.12,
          },
        },
      ]);
    }
  };

  // Apply Ready-Made Keyframe Loop Presets for Extracted Compiler Characters
  const applyCompilerLoopPreset = (
    preset: 'dreamy_breeze' | 'half_lid_sigh' | 'bow_flutter' | 'sleeping_breath'
  ) => {
    setUseKeyframeLoop(true);
    setIsPlaying(true);
    if (preset === 'dreamy_breeze') {
      setLoopDurationSec(6.0);
      setCompilerKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: -0.04,
            headTurn: -3.5,
            headNod: 2.5,
            blink: 0.0,
            gazeX: -2.0,
            gazeY: -1.0,
            hairSwayL: -0.05,
            hairSwayR: -0.045,
            bangsSway: -0.035,
            ruffleBounce: -0.08,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: 0.045,
            headTurn: 3.5,
            headNod: -3.0,
            blink: 0.0,
            gazeX: 2.2,
            gazeY: 1.2,
            hairSwayL: 0.055,
            hairSwayR: 0.05,
            bangsSway: 0.04,
            ruffleBounce: 0.09,
          },
        },
      ]);
    } else if (preset === 'half_lid_sigh') {
      setLoopDurationSec(5.0);
      setCompilerKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: -0.02,
            headNod: 2.0,
            blink: 0.0,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: 0.05,
            headNod: -3.5,
            blink: 0.55,
            gazeX: 1.8,
            gazeY: 1.5,
            mouthOpen: 0.18,
            smile: 0.72,
            ruffleBounce: 0.1,
          },
        },
      ]);
    } else if (preset === 'bow_flutter') {
      setLoopDurationSec(3.5);
      setCompilerKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: -0.05,
            hairSwayL: -0.08,
            hairSwayR: -0.08,
            bangsSway: -0.06,
            ruffleBounce: -0.14,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            headTilt: 0.05,
            hairSwayL: 0.08,
            hairSwayR: 0.08,
            bangsSway: 0.06,
            ruffleBounce: 0.14,
          },
        },
      ]);
    } else if (preset === 'sleeping_breath') {
      setLoopDurationSec(6.0);
      setCompilerKeyframes([
        {
          id: 'start',
          label: 'Start Frame (0%)',
          progress: 0,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            blink: 0.0,
            headTilt: -0.02,
            headNod: 2.0,
          },
        },
        {
          id: 'end',
          label: 'Target Keyframe (100%)',
          progress: 1,
          joints: {
            ...extractCompilerJoints(DEFAULT_COMPILER_RIG),
            blink: 1.0,
            headTilt: 0.04,
            headNod: 5.0,
            breath: 0.025,
          },
        },
      ]);
    }
  };

  // Download PNG Snapshot (optionally forcing 100% Transparent Background)
  const handleDownloadPNG = (forceTransparent?: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (forceTransparent) {
      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const offCtx = off.getContext('2d', { alpha: true })!;
      offCtx.clearRect(0, 0, off.width, off.height);
      renderCharacterFrameToContext(offCtx, timeRef.current, {
        forceTransparent: true,
        forceAnimated: isPlaying,
      });
      const url = off.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeChar}_transparent_${canvas.width}x${canvas.height}.png`;
      a.click();
      return;
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChar}_${canvas.width}x${canvas.height}.png`;
    a.click();
  };

  // Save / Record Video (Supports Normal Video Save, Transparent BG WebM Alpha, and Fast Offscreen Render)
  const handleStartVideoRecording = (options?: {
    transparent?: boolean;
    durationOverrideSec?: number;
    fastRender?: boolean;
  }) => {
    const canvas = canvasRef.current;
    if (!canvas || isRecordingVideo) return;

    const useTransparent =
      options?.transparent !== undefined ? options.transparent : videoTransparentBg;
    setVideoTransparentBg(useTransparent);

    // Also sync the active character's transparent toggle so the user sees the transparent checkerboard
    if (useTransparent) {
      if (activeChar === 'crt_tv_sailor') setCrtSailorTransparent(true);
      else if (activeChar === 'chibi_squire') setSquireTransparent(true);
      else if (activeChar === 'teacup_puppy') setPuppyTransparent(true);
      else if (isExtractedCompilerChar(activeChar)) setCompilerTransparent(true);
      else if (activeChar === 'shoujo_girl') setShoujoTransparent(true);
    }

    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }

    const durSec = Math.max(
      1,
      Math.min(120, options?.durationOverrideSec ?? videoDurationSec)
    );
    forceTransparentCaptureRef.current = useTransparent;
    timeRef.current = 0;
    setIsPlaying(true);
    setIsRecordingVideo(true);
    setRecordingModeLabel(
      useTransparent
        ? 'Transparent Alpha Video (.WebM for After Effects / Video Editors)'
        : 'Normal Video (.MP4 / .WebM)'
    );
    setRecordingElapsedSec(0);

    // Render onto a dedicated offscreen capture canvas so we guarantee clean alpha (zero UI overlays)
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = canvas.width;
    captureCanvas.height = canvas.height;
    const captureCtx = captureCanvas.getContext('2d', { alpha: true })!;

    // Initial frame draw before stream starts
    captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
    renderCharacterFrameToContext(captureCtx, 0, {
      forceTransparent: useTransparent,
      forceAnimated: true,
    });

    const stream = captureCanvas.captureStream(videoFps);
    const { mimeType: chosenMime, ext } = selectBestVideoMimeType(useTransparent);
    setRecordedVideoExt(ext);

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 14_000_000,
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const startWall = performance.now();
    const tickInterval = window.setInterval(() => {
      const elapsed = (performance.now() - startWall) / 1000;
      const simTime = elapsed * speed;
      captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
      renderCharacterFrameToContext(captureCtx, simTime, {
        forceTransparent: useTransparent,
        forceAnimated: true,
      });

      if (elapsed >= durSec) {
        window.clearInterval(tickInterval);
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      } else {
        setRecordingElapsedSec(Number(elapsed.toFixed(1)));
      }
    }, Math.max(10, Math.floor(1000 / videoFps)));

    recorder.onstop = () => {
      window.clearInterval(tickInterval);
      forceTransparentCaptureRef.current = null;
      const blob = new Blob(chunks, { type: chosenMime });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsRecordingVideo(false);
      setRecordingElapsedSec(durSec);

      const suffix = useTransparent ? `transparent_alpha_${durSec}s` : `normal_${durSec}s`;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeChar}_${suffix}.${ext}`;
      a.click();
    };

    recorder.start(100);
    recordingTimerRef.current = tickInterval;
  };

  // Instant Offline Export of 32-Bit RGBA Transparent PNG Sequence (.ZIP) for Adobe After Effects
  // Renders immediately without waiting for real-time video recording!
  const handleExportAfterEffectsZip = async (durationOverrideSec?: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isExportingAeZip) return;

    const exportDur = Math.max(
      1,
      Math.min(12, durationOverrideSec ?? Math.min(videoDurationSec, loopDurationSec || 2.4))
    );
    const exportFps = Math.min(30, videoFps);
    setIsExportingAeZip(true);

    if (lastAeZipUrl) {
      URL.revokeObjectURL(lastAeZipUrl.url);
      setLastAeZipUrl(null);
    }

    try {
      const res = await exportAfterEffectsPngSequenceZip({
        width: canvas.width,
        height: canvas.height,
        durationSec: exportDur,
        fps: exportFps,
        filePrefix: activeChar,
        renderFrameAtTime: (offCtx, tSec) => {
          renderCharacterFrameToContext(offCtx, tSec, {
            forceTransparent: true,
            forceAnimated: true,
          });
        },
        onProgress: (cur, tot) => {
          setAeZipProgress({ current: cur, total: tot });
        },
      });
      setLastAeZipUrl({ url: res.blobUrl, filename: res.filename });
    } finally {
      setIsExportingAeZip(false);
    }
  };

  const handleCancelVideoRecording = () => {
    forceTransparentCaptureRef.current = null;
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
  };

  const handleCopyCode = async () => {
    try {
      const fileMap: Record<string, string> = {
        teacup_puppy: '/teacupPuppyStandalone.js',
        shoujo_girl: '/shoujoGirlStandalone.js',
        victorian_bunny: '/victorianBunnyStandalone.js',
        raincoat_cat: '/raincoatCatStandalone.js',
      };
      const targetUrl =
        fileMap[activeChar] ||
        '/assets/aistudio/exact_fidelity_2d_character_code_compiler_multi_engine_rigging_studio_9d3f4837.html';
      const res = await fetch(targetUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Current active keyframe object for sliders
  const activeCrtSailorKf =
    crtSailorKeyframes.find((k) => k.id === activeCrtSailorKfId) ?? crtSailorKeyframes[0];
  const activeSquireKf =
    squireKeyframes.find((k) => k.id === activeSquireKfId) ?? squireKeyframes[0];
  const activePuppyKf =
    puppyKeyframes.find((k) => k.id === activePuppyKfId) ?? puppyKeyframes[0];
  const activeCompilerKf =
    compilerKeyframes.find((k) => k.id === activeCompilerKfId) ?? compilerKeyframes[0];
  const activeShoujoKf =
    shoujoKeyframes.find((k) => k.id === activeShoujoKfId) ?? shoujoKeyframes[0];
  const activeBunnyKf =
    bunnyKeyframes.find((k) => k.id === activeBunnyKfId) ?? bunnyKeyframes[0];
  const activeCatKf =
    catKeyframes.find((k) => k.id === activeCatKfId) ?? catKeyframes[0];

  const activeCompilerMeta = EXTRACTED_COMPILER_CHAR_LIST.find((c) => c.id === activeChar);
  const stageRatio =
    activeChar === 'crt_tv_sailor'
      ? '5:6'
      : activeCompilerMeta?.ratio ?? '1:1';
  const canvasW = stageRatio === '16:9' ? 1600 : 1000;
  const canvasH =
    stageRatio === '5:6'
      ? 1200
      : stageRatio === '2:3'
      ? 1500
      : stageRatio === '16:9'
      ? 900
      : 1000;

  return (
    <div className="min-h-screen bg-[#151211] text-[#F7F1EB] flex flex-col font-sans selection:bg-[#E2A39B]/30">
      {/* Top Studio Header */}
      <header className="border-b border-[#2E2623] bg-[#1C1816]/90 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E2A39B]/20 border border-[#E2A39B]/40 flex items-center justify-center text-[#F5C4D2]">
            {activeChar === 'crt_tv_sailor' ? (
              <Tv className="w-5 h-5" />
            ) : (
              <Dog className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-semibold tracking-tight text-[#FFF8F2]">
                Catmull-Rom Spline & Gouache 2D Rigging Studio
              </h1>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#2B221F] text-[#F5C4D2] border border-[#42332E]">
                {useKeyframeLoop
                  ? `Keyframe Loop (${loopDurationSec.toFixed(1)}s)`
                  : activeChar === 'crt_tv_sailor'
                  ? `CRT TV Sailor • 5:6 Native (1000×1200) • 0.48% Diff • 99.54% Ink Recall`
                  : activeChar === 'teacup_puppy'
                  ? '40–100pt Splines • 0.08% Pixel Diff'
                  : isExtractedCompilerChar(activeChar)
                  ? `${activeCompilerMeta?.shortLabel ?? 'Compiler Rig'} • ${stageRatio}`
                  : activeChar === 'shoujo_girl'
                  ? '24-Layer Shoujo + Deforming Blink'
                  : '12-Layer Pivot Rig'}
              </span>
            </div>
            <p className="text-xs text-[#A89890]">
              Budgeted Cubic Bézier + Corner Flags • Closed-Chain 2-Link IK • Native Aspect Ratio (<code className="text-[#F5C4D2]">5:6</code> / <code className="text-[#F5C4D2]">2:3</code> / <code className="text-[#F5C4D2]">16:9</code> / <code className="text-[#F5C4D2]">1:1</code>) • 20 Rigged Characters
            </p>
          </div>
        </div>

        {/* Transport & Quick Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRenderHair(!renderHair)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              renderHair
                ? 'bg-[#28201E] text-[#F5C4D2] border-[#D68B7E]/60'
                : 'bg-[#1C1716] text-[#A89890] border-[#322926]'
            }`}
            title="Toggle whether character hair layers are rendered or hidden"
          >
            <Eye className="w-3.5 h-3.5 text-[#D68B7E]" />
            {renderHair ? 'Render Hair: ON' : 'Render Hair: OFF'}
          </button>
          <button
            onClick={() => setIsSceneComposerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D68B7E] to-[#E8B4B8] hover:from-[#E29A8E] hover:to-[#F5C4D2] text-[#151211] font-semibold text-xs shadow-md transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            Scene Composer Window
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#26201E] hover:bg-[#322A27] text-[#FFF8F2] border border-[#3E322E] font-semibold text-xs transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => {
              timeRef.current = 0;
              setCrtSailorManualMode(false);
              setCrtSailorInspectionView('live');
              setCrtSailorRig({ ...DEFAULT_CRT_SAILOR_RIG });
              setSquireManualMode(false);
              setSquireRig({ ...DEFAULT_CHIBI_SQUIRE_RIG });
              setPuppyRig({ ...DEFAULT_PUPPY_RIG });
              setCompilerRig({ ...DEFAULT_COMPILER_RIG });
              setShoujoRig({ ...DEFAULT_SHOUJO_RIG });
              setBunnyRig({ ...DEFAULT_BUNNY_RIG });
              setCatRig({ ...DEFAULT_CAT_RIG });
            }}
            className="p-1.5 rounded-lg bg-[#26201E] hover:bg-[#322A27] text-[#D8C8B8] border border-[#382F2C] transition-colors"
            title="Reset Pose"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownloadPNG(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F2D2A] hover:bg-[#293D39] text-[#9CE4C8] border border-[#4E7A70] text-xs font-semibold transition-colors"
            title="Download 100% Transparent PNG (No Background)"
          >
            <Download className="w-3.5 h-3.5" />
            Transparent PNG
          </button>
          <button
            onClick={() => handleStartVideoRecording({ transparent: false, durationOverrideSec: 3 })}
            disabled={isRecordingVideo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26201E] hover:bg-[#322A27] text-[#F7F1EB] border border-[#483B36] text-xs font-semibold transition-colors disabled:opacity-50"
            title="Save Normal Video with Background (.MP4 / .WebM)"
          >
            <Video className="w-3.5 h-3.5 text-[#D68B7E]" />
            Save Video (Normal)
          </button>
          <button
            onClick={() => handleStartVideoRecording({ transparent: true, durationOverrideSec: 3 })}
            disabled={isRecordingVideo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B1F2E] hover:bg-[#3B2A40] text-[#F3C6FF] border border-[#845696] text-xs font-semibold transition-colors disabled:opacity-50"
            title="Download Transparent Background Video (.WebM Alpha for After Effects & Video Editors)"
          >
            <Film className="w-3.5 h-3.5 text-[#E492A4]" />
            Save Transparent Video (No BG)
          </button>
          <button
            onClick={() => handleExportAfterEffectsZip(2.4)}
            disabled={isExportingAeZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6B4C9A] to-[#9B6B9E] hover:from-[#7C59B0] hover:to-[#B07AB3] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            title="Instant Render (Zero Real-Time Wait): 32-Bit RGBA Transparent PNG Sequence (.ZIP) for Adobe After Effects"
          >
            {isExportingAeZip ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {isExportingAeZip
              ? `AE Alpha ZIP (${aeZipProgress.current}/${aeZipProgress.total})...`
              : 'After Effects Alpha (.ZIP Instant)'}
          </button>
        </div>
      </header>

      {/* Character Switcher Strip */}
      <div className="border-b border-[#2E2623] bg-[#161311] px-6 py-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A89890] mr-1.5">
          Characters (20):
        </span>
        <button
          onClick={() => {
            setActiveChar('crt_tv_sailor');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
            activeChar === 'crt_tv_sailor'
              ? 'bg-[#E492A4] text-[#181215] shadow-sm ring-1 ring-[#FADCE4]'
              : 'bg-[#261B20] text-[#FADCE4] hover:text-white border border-[#6E4452]'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          Kawaii CRT TV Sailor (5:6 • 18-Layer Pure-Code IK)
        </button>
        <button
          onClick={() => {
            setActiveChar('chibi_squire');
            setRenderHair(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
            activeChar === 'chibi_squire'
              ? 'bg-[#7E98A8] text-[#121A20] shadow-sm ring-1 ring-[#D8E6F0]'
              : 'bg-[#1C252B] text-[#D8E6F0] hover:text-white border border-[#485E6D]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Chibi Squire Boy w/ Sword (5 Views + Slash/Walk/Expr)
        </button>
        <button
          onClick={() => setActiveChar('teacup_puppy')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            activeChar === 'teacup_puppy'
              ? 'bg-[#D68B7E] text-[#151211] shadow-sm font-semibold'
              : 'bg-[#1E1917] text-[#C8B8B0] hover:text-[#F7F1EB] border border-[#2E2623]'
          }`}
        >
          <Dog className="w-3.5 h-3.5" />
          Teacup Puppy
        </button>
        <button
          onClick={() => setActiveChar('shoujo_girl')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            activeChar === 'shoujo_girl'
              ? 'bg-[#D68B7E] text-[#151211] shadow-sm font-semibold'
              : 'bg-[#1E1917] text-[#C8B8B0] hover:text-[#F7F1EB] border border-[#2E2623]'
          }`}
        >
          <UserRound className="w-3.5 h-3.5" />
          90s Shoujo Girl
        </button>
        <button
          onClick={() => setActiveChar('victorian_bunny')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            activeChar === 'victorian_bunny'
              ? 'bg-[#D68B7E] text-[#151211] shadow-sm font-semibold'
              : 'bg-[#1E1917] text-[#C8B8B0] hover:text-[#F7F1EB] border border-[#2E2623]'
          }`}
        >
          <Rabbit className="w-3.5 h-3.5" />
          Victorian Maid Bunny
        </button>
        <button
          onClick={() => setActiveChar('raincoat_cat')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            activeChar === 'raincoat_cat'
              ? 'bg-[#D68B7E] text-[#151211] shadow-sm font-semibold'
              : 'bg-[#1E1917] text-[#C8B8B0] hover:text-[#F7F1EB] border border-[#2E2623]'
          }`}
        >
          <Cat className="w-3.5 h-3.5" />
          Raincoat Calico Kitten
        </button>

        <span className="h-4 w-[1px] bg-[#322A27] mx-1" />

        {EXTRACTED_COMPILER_CHAR_LIST.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChar(ch.id)}
            title={ch.label}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeChar === ch.id
                ? 'bg-[#D68B7E] text-[#151211] shadow-sm font-semibold'
                : 'bg-[#1E1917] text-[#C8B8B0] hover:text-[#F7F1EB] border border-[#2E2623]'
            }`}
          >
            {ch.shortLabel}
          </button>
        ))}

        <span className="h-4 w-[1px] bg-[#322A27] mx-1" />

        <button
          onClick={() => setIsSceneComposerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#2B2022] hover:bg-[#3B2A2D] text-[#F5C4D2] border border-[#D68B7E]/50 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D68B7E]" />
          + Make Scene (BG & Multi-Character Stage)
        </button>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto items-start">
        {/* Left / Center Unobstructed Canvas Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className={`w-full ${
              stageRatio === '5:6'
                ? 'max-w-[580px] aspect-[5/6]'
                : stageRatio === '2:3'
                ? 'max-w-[520px] aspect-[2/3]'
                : stageRatio === '16:9'
                ? 'max-w-[820px] aspect-[16/9]'
                : 'max-w-[700px] aspect-square'
            } rounded-2xl overflow-hidden shadow-2xl border border-[#322A27] ${
              (activeChar === 'crt_tv_sailor' && crtSailorTransparent) ||
              (activeChar === 'chibi_squire' && squireTransparent) ||
              (activeChar === 'teacup_puppy' && puppyTransparent) ||
              (isExtractedCompilerChar(activeChar) && compilerTransparent) ||
              (activeChar === 'shoujo_girl' && shoujoTransparent)
                ? 'bg-[conic-gradient(#231F20_25%,#181516_0_50%,#231F20_0_75%,#181516_0)] bg-[length:24px_24px]'
                : 'bg-[#FFFFFF]'
            } relative transition-all duration-300`}
          >
            {/* 100% UNOBSTRUCTED CHARACTER CANVAS — Zero HUD bars covering the hands or skirt! */}
            <canvas
              ref={canvasRef}
              width={canvasW}
              height={canvasH}
              className="w-full h-full object-contain block"
            />

            {/* Optional Custom Reference Image Onion-Skin Overlay */}
            {customRefImageUrl && !isRecordingVideo && (
              <img
                src={customRefImageUrl}
                alt="Custom Reference Calibration Overlay"
                style={{ opacity: customRefOpacity }}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />
            )}
            {showRefCalibrationGrid && !isRecordingVideo && (
              <div
                className="absolute inset-0 pointer-events-none select-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(92,225,230,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(92,225,230,0.22) 1px, transparent 1px)',
                  backgroundSize: '10% 10%',
                }}
              />
            )}

            {/* Recording Status Banner (only visible while actively capturing video) */}
            {isRecordingVideo && (
              <div className="absolute top-3 left-3 right-3 bg-[#1C1615]/95 backdrop-blur-md border border-[#E27D73] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A52] animate-ping" />
                  <span className="text-xs font-semibold text-[#FFF8F2]">
                    Saving {recordingModeLabel} ({recordingElapsedSec.toFixed(1)}s / {videoDurationSec}s)
                  </span>
                </div>
                <button
                  onClick={handleCancelVideoRecording}
                  className="text-[11px] px-2.5 py-1 rounded bg-[#382826] hover:bg-[#4A3432] text-[#F5C4D2]"
                >
                  Stop & Download Now
                </button>
              </div>
            )}
          </div>

          {/* BELOW-CANVAS STATUS, BLINK & KEYFRAME BAR (Moved off the canvas so 100% of the character is visible) */}
          <div className="mt-3 w-full max-w-[700px] flex flex-col gap-2 bg-[#181412] px-4 py-2.5 rounded-xl border border-[#2E2623]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#E8DCD2] tabular-nums">
                  {useKeyframeLoop
                    ? `KEYFRAME LOOP (${loopStyle.toUpperCase()}) · ${Math.round(
                        loopProgressUI * 100
                      )}%`
                    : activeChar === 'crt_tv_sailor'
                    ? `KAWAII CRT TV SAILOR · ${crtSailorInspectionView.toUpperCase()} · CH:${crtSailorChannel.toUpperCase()} · ${
                        crtSailorManualMode ? 'MANUAL IK POSE' : crtSailorAction.toUpperCase()
                      }`
                    : activeChar === 'chibi_squire'
                    ? `CHIBI SQUIRE BOY · ${squireView.toUpperCase()} · ${
                        squireManualMode ? 'MANUAL POSE' : squireAction.toUpperCase()
                      }`
                    : activeChar === 'teacup_puppy'
                    ? `TEACUP PUPPY · ${puppyMode.toUpperCase()}`
                    : isExtractedCompilerChar(activeChar)
                    ? `${activeCompilerMeta?.shortLabel.toUpperCase()} · ${compilerMode.toUpperCase()}`
                    : activeChar === 'shoujo_girl'
                    ? `SHOUJO GIRL · ${shoujoMode.toUpperCase()}`
                    : activeChar === 'victorian_bunny'
                    ? `VICTORIAN BUNNY · ${bunnyMode.toUpperCase()}`
                    : `CALICO KITTEN · ${catMode.toUpperCase()}`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(activeChar === 'crt_tv_sailor' ||
                  activeChar === 'chibi_squire' ||
                  activeChar === 'teacup_puppy' ||
                  isExtractedCompilerChar(activeChar) ||
                  activeChar === 'shoujo_girl') && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#A89890] mr-1">Blink:</span>
                    {[
                      { label: 'Open', u: 0.0 },
                      { label: 'Half (0.55)', u: 0.55 },
                      { label: 'Closed', u: 1.0 },
                    ].map((st) => {
                      const curBlink =
                        activeChar === 'crt_tv_sailor'
                          ? crtSailorRig.blink
                          : activeChar === 'chibi_squire'
                          ? squireRig.blink
                          : activeChar === 'teacup_puppy'
                          ? puppyRig.blink
                          : isExtractedCompilerChar(activeChar)
                          ? compilerRig.blink
                          : shoujoRig.blink;
                      const isManualActive =
                        activeChar === 'crt_tv_sailor'
                          ? crtSailorManualMode
                          : activeChar === 'chibi_squire'
                          ? squireManualMode
                          : activeChar === 'teacup_puppy'
                          ? puppyMode === 'manual'
                          : isExtractedCompilerChar(activeChar)
                          ? compilerMode === 'manual'
                          : shoujoMode === 'manual';
                      return (
                        <button
                          key={st.label}
                          onClick={() => {
                            setUseKeyframeLoop(false);
                            if (activeChar === 'crt_tv_sailor') {
                              setCrtSailorManualMode(true);
                              setCrtSailorRig((prev) => ({ ...prev, blink: st.u }));
                            } else if (activeChar === 'chibi_squire') {
                              setSquireManualMode(true);
                              setSquireRig((prev) => ({ ...prev, blink: st.u }));
                            } else if (activeChar === 'teacup_puppy') {
                              setPuppyMode('manual');
                              setPuppyRig((prev) => ({ ...prev, blink: st.u }));
                            } else if (isExtractedCompilerChar(activeChar)) {
                              setCompilerMode('manual');
                              setCompilerRig((prev) => ({ ...prev, blink: st.u }));
                            } else {
                              setShoujoMode('manual');
                              setShoujoRig((prev) => ({ ...prev, blink: st.u }));
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                            !useKeyframeLoop &&
                            isManualActive &&
                            Math.abs(curBlink - st.u) < 0.05
                              ? 'bg-[#D68B7E] text-[#151211] font-semibold'
                              : 'bg-[#241E1C] text-[#D8C8B8] hover:bg-[#322926]'
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={() => setUseKeyframeLoop(!useKeyframeLoop)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors border ${
                    useKeyframeLoop
                      ? 'bg-[#D68B7E] text-[#151211] border-[#E8B4B8] font-semibold'
                      : 'bg-[#241E1C] text-[#A89890] border-[#382F2C] hover:text-[#F7F1EB]'
                  }`}
                >
                  {useKeyframeLoop ? 'Keyframe Loop: ON' : 'Enable Keyframe Loop'}
                </button>
                <span className="font-mono text-[#A89890] tabular-nums">
                  {canvasW}×{canvasH}px ({stageRatio})
                </span>
              </div>
            </div>

            {useKeyframeLoop && (
              <div className="w-full h-1.5 bg-[#2A2220] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D68B7E] to-[#F5C4D2] transition-all duration-75"
                  style={{ width: `${Math.round(loopProgressUI * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Dedicated CRT TV Sailor Visual Verification Gate, 4x Hand Loupe & Channel Bar */}
          {activeChar === 'crt_tv_sailor' && (
            <div className="mt-3 w-full max-w-[700px] p-4 rounded-2xl bg-[#1A1518] border border-[#3E2E37] shadow-xl space-y-3">
              {/* Row 1: Visual Inspection Modes (Including 4x Hand & Cuff Training Loupe) */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F5C4D2] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E492A4]" />
                  Inspection & Hand Loupe:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'live', label: '1. Full Character (5:6)' },
                      { id: 'hand_loupe', label: '2. 4× Hand & Cuff Loupe' },
                      { id: 'exploded', label: '3. Exploded 18-Layer' },
                      { id: 'side_by_side', label: '4. Side-by-Side w/ Ref' },
                      { id: 'diff_heatmap', label: '5. Pixel-Diff Map' },
                    ] as { id: CrtSailorInspectionView; label: string }[]
                  ).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setCrtSailorInspectionView(v.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                        crtSailorInspectionView === v.id
                          ? 'bg-[#E492A4] text-[#181215] border-[#FADCE4] font-semibold ring-1 ring-[#FADCE4]/50'
                          : 'bg-[#120E10] text-[#E6D5DC] border-[#2E2228] hover:border-[#E492A4]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exploded View Spread Slider & Cubic Bezier Wireframe Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2A1F25] text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-[11px] font-mono text-[#D8C2CB]">
                    Explosion Spread ({Math.round(crtSailorExplosionSpread * 100)}%):
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={crtSailorExplosionSpread}
                    onChange={(e) => {
                      setCrtSailorInspectionView('exploded');
                      setCrtSailorExplosionSpread(parseFloat(e.target.value));
                    }}
                    className="flex-1 accent-[#E492A4]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCrtSailorBezierWireframe(!crtSailorBezierWireframe)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                      crtSailorBezierWireframe
                        ? 'bg-[#1D3540] text-[#7DD3FC] border-[#38BDF8]'
                        : 'bg-[#120E10] text-[#B8A5AE] border-[#2E2228]'
                    }`}
                  >
                    {crtSailorBezierWireframe ? '● Cubic Bézier Overlay: ON' : 'Cubic Bézier Overlay: OFF'}
                  </button>
                  <button
                    onClick={() => setShowCrtLayerTable(!showCrtLayerTable)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                      showCrtLayerTable
                        ? 'bg-[#2C2027] text-[#FADCE4] border-[#E492A4]'
                        : 'bg-[#120E10] text-[#B8A5AE] border-[#2E2228]'
                    }`}
                  >
                    {showCrtLayerTable ? 'Hide 18-Layer Report' : '18-Layer Gate Report'}
                  </button>
                </div>
              </div>

              {/* Row 2: 6 Interactive CRT TV Screen Channels */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2A1F25]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CE4C8] flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  CRT TV Channel:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'uwu', label: 'CH1: • w • (Ref Match)' },
                      { id: 'happy', label: 'CH2: ^ w ^ Happy' },
                      { id: 'heart', label: 'CH3: ♥ w ♥ Heart' },
                      { id: 'static', label: 'CH4: CRT Static' },
                      { id: 'sleepy', label: 'CH5: - w - Sleepy' },
                      { id: 'surprised', label: 'CH6: O o O Signal' },
                    ] as { id: CrtSailorChannel; label: string }[]
                  ).map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCrtSailorChannel(ch.id);
                        setCrtSailorInspectionView('live');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        crtSailorChannel === ch.id
                          ? 'bg-[#769A95] text-[#101816] border-[#CFE4DF] font-semibold'
                          : 'bg-[#120E10] text-[#D8C2CB] border-[#2E2228] hover:border-[#769A95]'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Phase 2/3 Closed-Chain IK Animation Actions & Scanline Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2A1F25]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8C2A0] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  IK Motion Set:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'idle', label: 'Idle Breath & Sway' },
                      { id: 'tune_channel', label: 'Dial Channel Surf' },
                      { id: 'shy_fidget', label: 'Shy Clasped Fidget (IK)' },
                      { id: 'signal_bounce', label: 'Antenna Signal Bounce' },
                      { id: 'static', label: 'Static Reference Master' },
                    ] as { id: CrtSailorAction; label: string }[]
                  ).map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        setUseKeyframeLoop(false);
                        setCrtSailorManualMode(false);
                        setCrtSailorInspectionView('live');
                        setCrtSailorAction(act.id);
                        if (act.id !== 'static') setIsPlaying(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        !useKeyframeLoop && !crtSailorManualMode && crtSailorAction === act.id
                          ? 'bg-[#D68B7E] text-[#151211] border-[#FADCE4] font-semibold'
                          : 'bg-[#120E10] text-[#D8C2CB] border-[#2E2228] hover:border-[#D68B7E]'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setCrtSailorScanlines(!crtSailorScanlines)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      crtSailorScanlines
                        ? 'bg-[#2C2433] text-[#E4C2F8] border-[#A87ED6]'
                        : 'bg-[#120E10] text-[#9E8B94] border-[#2E2228]'
                    }`}
                  >
                    {crtSailorScanlines ? 'Scanlines: ON' : 'Scanlines: OFF'}
                  </button>
                </div>
              </div>

              {/* Collapsible 18-Layer Extraction & 4-Gate Verification Report */}
              {showCrtLayerTable && (
                <div className="pt-2 border-t border-[#2A1F25] space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-[#120E10] border border-[#2E2228]">
                      <div className="text-[#A89890]">1. Foreground Diff</div>
                      <div className="text-sm font-bold text-[#7ED6A5]">
                        {CRT_SAILOR_VERIFICATION_METRICS.foregroundDiffPct}% (PASS &le;2.5%)
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#120E10] border border-[#2E2228]">
                      <div className="text-[#A89890]">2. Ink-Line Recall</div>
                      <div className="text-sm font-bold text-[#7ED6A5]">
                        {CRT_SAILOR_VERIFICATION_METRICS.inkRecallPct}% (PASS &ge;94%)
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#120E10] border border-[#2E2228]">
                      <div className="text-[#A89890]">3. Ink Precision</div>
                      <div className="text-sm font-bold text-[#7ED6A5]">
                        {CRT_SAILOR_VERIFICATION_METRICS.inkPrecisionPct}% (PASS &ge;92%)
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#120E10] border border-[#2E2228]">
                      <div className="text-[#A89890]">4. 12-Pose Leak Test</div>
                      <div className="text-sm font-bold text-[#7ED6A5]">
                        0 Holes (12/12 PASS)
                      </div>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-[#2E2228] bg-[#120E10]">
                    <table className="w-full text-left text-[10px] font-mono text-[#D8C2CB]">
                      <thead className="bg-[#1E171B] text-[#F5C4D2] sticky top-0">
                        <tr>
                          <th className="py-1.5 px-2">Layer</th>
                          <th className="py-1.5 px-2">Pixels</th>
                          <th className="py-1.5 px-2">Bézier Segs</th>
                          <th className="py-1.5 px-2">Corners</th>
                          <th className="py-1.5 px-2">Pivot</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#241B20]">
                        {CRT_SAILOR_LAYER_SUMMARIES.map((ly) => (
                          <tr key={ly.id}>
                            <td className="py-1 px-2 font-semibold text-[#FFF8F2]">
                              L{String(ly.index).padStart(2, '0')} {ly.name}
                            </td>
                            <td className="py-1 px-2">{ly.area.toLocaleString()} px</td>
                            <td className="py-1 px-2 text-[#7DD3FC]">{ly.bezierSegmentCount}</td>
                            <td className="py-1 px-2 text-[#FBBF24]">{ly.sharpCornerCount}</td>
                            <td className="py-1 px-2">
                              ({ly.pivot[0]}, {ly.pivot[1]})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dedicated Multi-View, Animation Action & Facial Expression Bar for Chibi Squire Boy */}
          {activeChar === 'chibi_squire' && (
            <div className="mt-4 w-full max-w-[700px] p-4 rounded-2xl bg-[#171E24] border border-[#2D3A44] shadow-xl space-y-3">
              {/* Row 1: 5 Camera View Angles */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A8BDCD] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  View Angle:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'three_quarter', label: '3/4 View (Ref Match)' },
                      { id: 'front', label: 'Front View' },
                      { id: 'side_right', label: 'Side (Right)' },
                      { id: 'side_left', label: 'Side (Left)' },
                      { id: 'back', label: 'Back View' },
                    ] as { id: SquireViewAngle; label: string }[]
                  ).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSquireView(v.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        squireView === v.id
                          ? 'bg-[#7E98A8] text-[#121A20] border-[#CFDFEC] font-semibold ring-1 ring-[#CFDFEC]/40'
                          : 'bg-[#11171C] text-[#C2D3DE] border-[#25323C] hover:border-[#7E98A8]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Animation Action Set */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#25323C]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8C2A0] flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  Animation Set:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'idle', label: 'Idle Breath' },
                      { id: 'slash', label: 'Practice Slash' },
                      { id: 'walk', label: 'Squire Stride' },
                      { id: 'sit', label: 'Sit Rest' },
                      { id: 'wave', label: 'Wave Hello' },
                      { id: 'jump', label: 'Jump Hop' },
                      { id: 'look_around', label: 'Scout Scan' },
                      { id: 'breeze', label: 'Wind Breeze' },
                      { id: 'static', label: 'Static' },
                    ] as { id: SquireAction; label: string }[]
                  ).map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        setUseKeyframeLoop(false);
                        setSquireManualMode(false);
                        setSquireAction(act.id);
                        if (act.id !== 'static') {
                          setIsPlaying(true);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        !useKeyframeLoop && !squireManualMode && squireAction === act.id
                          ? 'bg-[#A86F58] text-[#FFF8F2] border-[#F2C9B8] font-semibold'
                          : 'bg-[#11171C] text-[#C2D3DE] border-[#25323C] hover:border-[#A86F58]'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Facial Expressions + Reference Comparison Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#25323C]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F0B89C] flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5" />
                  Expression:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'wonder', label: 'Wonder (Ref Match)' },
                      { id: 'determined', label: 'Determined' },
                      { id: 'happy', label: 'Cheerful Smile' },
                      { id: 'surprised', label: "Surprised 'O'" },
                      { id: 'sleepy', label: 'Sleepy' },
                      { id: 'proud', label: 'Proud (^ ^)' },
                    ] as { id: SquireExpression; label: string }[]
                  ).map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setSquireExpression(ex.id);
                        setSquireRig((prev) => ({ ...prev, blink: 0 }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        squireExpression === ex.id
                          ? 'bg-[#E09D7A] text-[#1D1410] border-[#FBD6C2] font-semibold'
                          : 'bg-[#11171C] text-[#C2D3DE] border-[#25323C] hover:border-[#E09D7A]'
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowSquireRefCompare(!showSquireRefCompare)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      showSquireRefCompare
                        ? 'bg-[#3A2F25] text-[#FDEBDD] border-[#E09D7A]'
                        : 'bg-[#11171C] text-[#9FB3C0] border-[#25323C]'
                    }`}
                  >
                    {showSquireRefCompare ? 'Hide Ref Image' : 'Compare w/ Ref'}
                  </button>
                </div>
              </div>

              {showSquireRefCompare && (
                <div className="pt-2 border-t border-[#25323C] flex items-center gap-4">
                  <img
                    src="/assets/aistudio/Chibi_boy_standing_with_sword_20261020234257_441f6f38.jpg"
                    alt="Uploaded Reference Character"
                    className="w-36 h-36 object-contain rounded-xl border border-[#3E4F5C] bg-[#F7F1E3]"
                  />
                  <div className="text-xs text-[#C8D6DF] space-y-1">
                    <div className="font-semibold text-[#FFFDF8]">
                      Uploaded Reference Artwork vs. Live Multi-View Engine
                    </div>
                    <p className="text-[11px] text-[#A2B6C5]">
                      Calibrated ash-brown messy hair (#9E998C), peach cheeks with warm blush (#F6AC7A), dark bean eyes with catchlights, lace-neck slate tunic (#7B8E9B), leather belt & scabbard, oversized fencing gauntlet, charcoal shorts, leather boots.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MULTI-ANGLE CHARACTER SHEET VAULT & 4-STAGE HAND/DETAIL TRAINING STUDIO */}
          <div className="mt-4 w-full max-w-[700px] p-4 rounded-2xl bg-[#16131A] border border-[#332B3D] shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#282130] pb-3">
              <div>
                <h2 className="text-sm font-semibold text-[#FFF8F2]">
                  Multi-Angle Character Sheet Vault & Detail Training Dojo
                </h2>
                <p className="text-xs text-[#A89BB8]">
                  Submit pictures from Front, Half-Rotation (3/4), Side, or Hand Close-ups with custom names. Saved sheets persist in your browser and generate exact sub-pixel blueprints for chat.
                </p>
              </div>
              <button
                onClick={handleCopyCharacterBlueprintForChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E492A4] hover:bg-[#F0A3B4] text-[#181215] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {copiedBlueprint ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Blueprint Copied for Chat
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Sheet Blueprint for Chat
                  </>
                )}
              </button>
            </div>

            {/* Section 1: Character Sheet Profile Selector & New Character Creator */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#C8BBD8] mr-1">Saved Character Sheets:</span>
                {sheetProfiles.map((prof) => (
                  <div key={prof.id} className="flex items-center">
                    <button
                      onClick={() => setActiveSheetProfileId(prof.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        activeSheetProfile?.id === prof.id
                          ? 'bg-[#2C2238] text-[#FFF8F2] border-[#E492A4]'
                          : 'bg-[#120F16] text-[#A89BB8] border-[#261F2E] hover:text-[#FFF8F2]'
                      }`}
                    >
                      {prof.name} ({prof.views.length} views)
                    </button>
                    {prof.id !== 'crt_tv_sailor_default' && (
                      <button
                        onClick={async () => {
                          await deleteCharacterSheetProfile(prof.id);
                          setSheetProfiles((prev) => prev.filter((p) => p.id !== prof.id));
                          setActiveSheetProfileId('crt_tv_sailor_default');
                        }}
                        className="ml-1 p-1 text-[#A89BB8] hover:text-[#FF7A72]"
                        title="Delete Character Sheet Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCharProfileName}
                  onChange={(e) => setNewCharProfileName(e.target.value)}
                  placeholder="New character name..."
                  className="px-2.5 py-1 rounded-lg bg-[#100D14] border border-[#2C2436] text-xs text-[#FFF8F2] placeholder-[#6E637A] w-40"
                />
                <button
                  onClick={handleCreateNewCharacterProfile}
                  className="px-2.5 py-1 rounded-lg bg-[#251E30] hover:bg-[#322840] text-[#E8D7FF] border border-[#493A5E] text-xs font-medium whitespace-nowrap"
                >
                  + New Character
                </button>
              </div>
            </div>

            {/* Section 2: Add Any Picture with Custom View Name (Front, Half Rotation 3/4, Side, Hands, etc.) */}
            <div className="p-3 rounded-xl bg-[#110E14] border border-[#261F2E] space-y-2.5">
              <div className="text-xs font-medium text-[#E8D7FF]">
                Add Picture to &ldquo;{activeSheetProfile?.name}&rdquo; Character Sheet
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-[#A89BB8] mb-1">View Type Preset</label>
                  <select
                    value={uploadViewCategory}
                    onChange={(e) => {
                      const cat = e.target.value as SheetViewCategory;
                      setUploadViewCategory(cat);
                      const found = VIEW_CATEGORY_LABELS.find((c) => c.id === cat);
                      if (found && found.defaultTitle) {
                        setUploadViewCustomLabel(found.defaultTitle);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#18141D] border border-[#2E2538] text-xs text-[#FFF8F2]"
                  >
                    {VIEW_CATEGORY_LABELS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#A89BB8] mb-1">
                    Picture Name (e.g. Front, Half Rotation, Hand)
                  </label>
                  <input
                    type="text"
                    value={uploadViewCustomLabel}
                    onChange={(e) => setUploadViewCustomLabel(e.target.value)}
                    placeholder="e.g. Half Rotation (3/4 View)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#18141D] border border-[#2E2538] text-xs text-[#FFF8F2]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="w-full cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#769A95] hover:bg-[#87ADA8] text-[#101816] font-semibold text-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {isAnalyzingSheetUpload ? 'Analyzing & Saving...' : 'Submit & Save Picture'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isAnalyzingSheetUpload}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadCharacterSheetView(file);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <input
                type="text"
                value={uploadViewNotes}
                onChange={(e) => setUploadViewNotes(e.target.value)}
                placeholder="Optional movement / rigging note for this view (e.g. 'Keep cuffs overlapping wrist, cape flows behind')"
                className="w-full px-2.5 py-1 rounded-lg bg-[#18141D] border border-[#2E2538] text-xs text-[#E2D9EC] placeholder-[#6E637A]"
              />
            </div>

            {/* Section 3: Saved Character Sheet Views Gallery with Turnaround Plumb Lines */}
            {activeSheetProfile && activeSheetProfile.views.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C8BBD8]">
                    Submitted Views for <strong className="text-[#FFF8F2]">{activeSheetProfile.name}</strong> ({activeSheetProfile.views.length})
                  </span>
                  <button
                    onClick={() => setShowPlumbLinesOnViews(!showPlumbLinesOnViews)}
                    className="text-[11px] font-mono text-[#7DD3FC] hover:underline"
                  >
                    {showPlumbLinesOnViews ? 'Plumb Lines: ON' : 'Plumb Lines: OFF'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {activeSheetProfile.views.map((v) => (
                    <div
                      key={v.id}
                      className="p-2 rounded-xl bg-[#110E14] border border-[#282130] flex flex-col gap-1.5"
                    >
                      <div className="relative aspect-[5/6] w-full rounded-lg overflow-hidden bg-white border border-[#2E2538]">
                        <img
                          src={v.imageDataUrl}
                          alt={v.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                        {showPlumbLinesOnViews && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[
                              activeSheetProfile.plumbLines.headTopY,
                              activeSheetProfile.plumbLines.eyeLineY,
                              activeSheetProfile.plumbLines.chinNeckY,
                              activeSheetProfile.plumbLines.shoulderLineY,
                              activeSheetProfile.plumbLines.elbowLineY,
                              activeSheetProfile.plumbLines.wristHandY,
                            ].map((py, i) => (
                              <div
                                key={i}
                                style={{ top: `${(py / 1200) * 100}%` }}
                                className="absolute left-0 right-0 border-t border-dashed border-sky-400/55"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[#FFF8F2] truncate" title={v.label}>
                          {v.label}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setCustomRefImageUrl(v.imageDataUrl)}
                            className="px-1.5 py-0.5 rounded bg-[#231C2E] hover:bg-[#312740] text-[10px] text-[#7DD3FC]"
                            title="Overlay this view on the main stage canvas for direct tracing"
                          >
                            Stage Overlay
                          </button>
                          {v.id !== 'view_front_master' && (
                            <button
                              onClick={() => handleDeleteCharacterSheetView(v.id)}
                              className="p-0.5 text-[#A89BB8] hover:text-[#FF7A72]"
                              title="Remove View"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#A89BB8] tabular-nums">
                        <span>
                          {v.naturalWidth}×{v.naturalHeight}
                        </span>
                        <span>·</span>
                        <span>Ink {v.analysis.inkCoveragePct}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {v.analysis.paletteHex.map((hex, i) => (
                          <span
                            key={i}
                            style={{ backgroundColor: hex }}
                            className="w-3.5 h-3.5 rounded-sm border border-white/20"
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: 4-Stage Training Pipeline for Hands & Complex Details */}
            <div className="p-3 rounded-xl bg-[#110E14] border border-[#282130] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#9CE4C8]">
                  4-Stage Hand & Detail Training Lab (Pure-Code Calibration)
                </span>
                <button
                  onClick={() => {
                    setActiveChar('crt_tv_sailor');
                    setCrtSailorInspectionView(
                      crtSailorInspectionView === 'hand_loupe' ? 'live' : 'hand_loupe'
                    );
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    crtSailorInspectionView === 'hand_loupe'
                      ? 'bg-[#34D399] text-[#0D1F18] border-[#A7F3D0]'
                      : 'bg-[#1B2A26] text-[#9CE4C8] border-[#3E6E65] hover:bg-[#243833]'
                  }`}
                >
                  {crtSailorInspectionView === 'hand_loupe'
                    ? 'Exit 4× Hand Loupe'
                    : 'Open 4× Hand & Cuff Loupe on Stage'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {DEFAULT_DETAIL_TRAINING_PRESETS.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => {
                      setSelectedTrainingPresetId(pr.id);
                      if (pr.id === 'clasped_hands_cuffs') {
                        setActiveChar('crt_tv_sailor');
                        setCrtSailorInspectionView('hand_loupe');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selectedTrainingPresetId === pr.id
                        ? 'bg-[#261E32] text-[#FFF8F2] border-[#E492A4]'
                        : 'bg-[#18141D] text-[#A89BB8] border-[#282130] hover:text-[#FFF8F2]'
                    }`}
                  >
                    {pr.title.split(' (')[0]}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#D8CBE8] bg-[#18141D] p-2.5 rounded-lg border border-[#282130] space-y-1">
                <div className="font-mono text-[11px] text-[#FADCE4]">
                  Socket & Layering Rule: {activeTrainingPreset.socketRule}
                </div>
                <div className="text-[11px] text-[#A89BB8] font-mono tabular-nums">
                  Calibrated Anchors:{' '}
                  {activeTrainingPreset.anchors
                    .map((a) => `${a.label} (${a.x},${a.y})`)
                    .join(' · ')}
                </div>
              </div>
            </div>

            {/* Section 5: ANATOMY TRAINING MODE — Step-by-Step Finger & Palm Crease Breakdown + Interactive Mistake Overlays */}
            <div className="p-3.5 rounded-xl bg-[#0F1318] border border-[#2A3A4A] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2B38] pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7DD3FC]">
                      Anatomy Training Mode: Fingers, Ratios &amp; Palm Creases
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#162432] text-[#9CE4C8] border border-[#2B485E]">
                      Interactive Stage Overlay
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Step-by-step construction of dorsal palm blocks, parabolic finger length ratios, radial clefts, and palm crease pockets — with live overlays highlighting common mistakes on the current character&apos;s hands.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const next = !anatomyTrainingEnabled;
                      setAnatomyTrainingEnabled(next);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      anatomyTrainingEnabled
                        ? 'bg-[#10B981] text-[#051B14] border-[#6EE7B7] shadow-sm'
                        : 'bg-[#16202A] text-[#CBD5E1] border-[#2E4052] hover:border-[#7DD3FC]'
                    }`}
                  >
                    {anatomyTrainingEnabled
                      ? '● Hand Anatomy Overlay: ON'
                      : 'Enable Hand Anatomy Overlay'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveChar('crt_tv_sailor');
                      setAnatomyTrainingEnabled(true);
                      setCrtSailorInspectionView(
                        crtSailorInspectionView === 'hand_loupe' ? 'live' : 'hand_loupe'
                      );
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      crtSailorInspectionView === 'hand_loupe' && anatomyTrainingEnabled
                        ? 'bg-[#38BDF8] text-[#082030] border-[#BAE6FD]'
                        : 'bg-[#16202A] text-[#7DD3FC] border-[#2B485E] hover:bg-[#1E2D3B]'
                    }`}
                    title="Zoom 400% into the character's hands with Anatomy Training Overlays active"
                  >
                    {crtSailorInspectionView === 'hand_loupe'
                      ? 'View on Full Character'
                      : '4× Zoom Hand Overlay'}
                  </button>
                </div>
              </div>

              {/* Part A: 4-Step Progressive Finger & Palm Crease Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono uppercase tracking-wider text-[#9CE4C8]">
                    Step-by-Step Finger &amp; Palm Construction:
                  </span>
                  <span className="font-mono text-[#7DD3FC]">
                    Click any step to highlight on stage
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAnatomyTrainingEnabled(true);
                      setAnatomyActiveStepId('all_steps');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      anatomyActiveStepId === 'all_steps'
                        ? 'bg-[#1D3548] text-[#FFF8F2] border-[#38BDF8] font-semibold'
                        : 'bg-[#141C24] text-[#94A3B8] border-[#243240] hover:text-[#FFF8F2]'
                    }`}
                  >
                    All 4 Steps Combined
                  </button>
                  {ANATOMY_TRAINING_STEPS.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setAnatomyTrainingEnabled(true);
                        setAnatomyActiveStepId(st.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        anatomyActiveStepId === st.id
                          ? 'bg-[#1D3548] text-[#7DD3FC] border-[#38BDF8] font-semibold'
                          : 'bg-[#141C24] text-[#94A3B8] border-[#243240] hover:text-[#FFF8F2]'
                      }`}
                    >
                      {st.shortTitle}
                    </button>
                  ))}
                </div>

                {/* Active Step Detail & Visual Ratio Diagram Card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-2.5 rounded-xl bg-[#141B22] border border-[#243240]">
                  <div className="sm:col-span-7 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#FFF8F2]">
                        {activeAnatomyStep.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      {activeAnatomyStep.anatomicalRule}
                    </p>
                    <div className="px-2 py-1 rounded bg-[#0D1318] border border-[#223242] font-mono text-[10px] text-[#6EE7B7] tabular-nums">
                      {activeAnatomyStep.ratioOrMetric}
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-[#94A3B8]">
                      {activeAnatomyStep.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#34D399] font-mono">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive SVG Finger Ratio & Palm Crease Schematic + Code Snippet */}
                  <div className="sm:col-span-5 flex flex-col justify-between gap-2 bg-[#0C1015] p-2.5 rounded-lg border border-[#1E2B38]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#7DD3FC]">
                        Phalanx Ratio &amp; Crease Map
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              activeAnatomyStep.canvasCodePattern
                            );
                            setCopiedAnatomyCode(true);
                            setTimeout(() => setCopiedAnatomyCode(false), 1800);
                          } catch {
                            // ignore
                          }
                        }}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#182430] hover:bg-[#223344] text-[#9CE4C8]"
                      >
                        {copiedAnatomyCode ? 'Copied!' : 'Copy Step Code'}
                      </button>
                    </div>

                    {/* Visual Ratio Bar Comparison: Middle 1.00x, Ring 0.93x, Index 0.91x, Pinky 0.76x */}
                    <div className="space-y-1 font-mono text-[10px]">
                      {[
                        { name: 'Middle (Apex)', ratio: 1.0, label: '1.00×', color: '#10B981' },
                        { name: 'Ring Finger', ratio: 0.93, label: '0.93×', color: '#34D399' },
                        { name: 'Index Finger', ratio: 0.91, label: '0.91×', color: '#38BDF8' },
                        { name: 'Pinky Finger', ratio: 0.76, label: '0.76×', color: '#A78BFA' },
                      ].map((f) => (
                        <div key={f.name} className="flex items-center gap-1.5">
                          <span className="w-24 text-[#CBD5E1] truncate">{f.name}</span>
                          <div className="flex-1 h-2 bg-[#18222C] rounded-full overflow-hidden">
                            <div
                              style={{
                                width: `${Math.round(f.ratio * 100)}%`,
                                backgroundColor: f.color,
                              }}
                              className="h-full rounded-full"
                            />
                          </div>
                          <span className="w-9 text-right text-[#FFF8F2] tabular-nums">
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <pre className="text-[9.5px] font-mono text-[#9CE4C8] bg-[#080B0E] p-2 rounded border border-[#1A2632] overflow-x-auto leading-tight">
                      {activeAnatomyStep.canvasCodePattern}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Part B: Interactive Common Mistakes Highlighter (Highlights Red Mistake vs. Emerald Fix on Stage) */}
              <div className="space-y-2 pt-2 border-t border-[#1E2B38]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono uppercase tracking-wider text-[#FDA4AF]">
                    Interactive Common Mistake Overlays (Red = Mistake vs. Emerald = Correct):
                  </span>
                  <button
                    onClick={() => setAnatomyActiveMistakeId('none')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      anatomyActiveMistakeId === 'none'
                        ? 'bg-[#1E293B] text-[#E2E8F0] border-[#475569]'
                        : 'bg-[#141B22] text-[#94A3B8] border-[#243240] hover:text-white'
                    }`}
                  >
                    Hide Mistake Overlay (Clean Guides Only)
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {ANATOMY_COMMON_MISTAKES.map((mk) => (
                    <button
                      key={mk.id}
                      onClick={() => {
                        setAnatomyTrainingEnabled(true);
                        setAnatomyActiveMistakeId(mk.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        anatomyTrainingEnabled && anatomyActiveMistakeId === mk.id
                          ? 'bg-[#4C1122] text-[#FFE4E6] border-[#F43F5E] font-semibold'
                          : 'bg-[#18131A] text-[#FDA4AF] border-[#38202B] hover:border-[#F43F5E]'
                      }`}
                    >
                      {mk.shortLabel}
                    </button>
                  ))}
                </div>

                {activeAnatomyMistake && (
                  <div className="p-2.5 rounded-xl bg-[#1A1116] border border-[#4A1D2C] grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-[#FDA4AF]">
                        ✗ {activeAnatomyMistake.title}
                      </div>
                      <p className="text-[11px] text-[#E2CBD2]">
                        <strong>Visual Symptom:</strong> {activeAnatomyMistake.symptom}
                      </p>
                      <p className="text-[11px] text-[#B89CA6]">
                        <strong>Root Cause in Code:</strong> {activeAnatomyMistake.whyItHappens}
                      </p>
                    </div>
                    <div className="space-y-1 bg-[#0E1916] p-2.5 rounded-lg border border-[#1E4638]">
                      <div className="font-semibold text-[#6EE7B7]">
                        ✓ Calibrated Pure-Code Fix
                      </div>
                      <p className="text-[11px] text-[#D1FAE5]">
                        {activeAnatomyMistake.pureCodeFix}
                      </p>
                      <div className="font-mono text-[10px] text-[#34D399] pt-0.5 tabular-nums">
                        {activeAnatomyMistake.ratioSpec}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-[#1C1816] border border-[#2E2623] rounded-2xl overflow-hidden flex flex-col shadow-xl">
          {/* Inspector Tabs */}
          <div className="grid grid-cols-4 border-b border-[#2E2623] bg-[#161311]">
            <button
              onClick={() => setActiveTab('keyframes')}
              className={`flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'keyframes'
                  ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#221D1A]'
                  : 'border-transparent text-[#A89890] hover:text-[#E8DCD2]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Keyframes & Joints
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'video'
                  ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#221D1A]'
                  : 'border-transparent text-[#A89890] hover:text-[#E8DCD2]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Video Export
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'presets'
                  ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#221D1A]'
                  : 'border-transparent text-[#A89890] hover:text-[#E8DCD2]'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Rig Modes
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'code'
                  ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#221D1A]'
                  : 'border-transparent text-[#A89890] hover:text-[#E8DCD2]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Engine Specs
            </button>
          </div>

          {/* Tab 1: Start & Keyframe Loop Sliders */}
          {activeTab === 'keyframes' && (
            <div className="p-5 space-y-4 max-h-[680px] overflow-y-auto">
              {/* Loop Mode Switch & Keyframe Slot Bar */}
              <div className="p-3.5 rounded-xl bg-[#141110] border border-[#2E2623] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F5C4D2] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      Start & Target Keyframe Loop
                    </h2>
                    <p className="text-[11px] text-[#A89890]">
                      Click any keyframe slot below to pose it with joint sliders, or press Play to run the loop.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setUseKeyframeLoop(true);
                        setIsPlaying(!isPlaying);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isPlaying && useKeyframeLoop
                          ? 'bg-[#769A95] text-[#121817]'
                          : 'bg-[#2E2420] text-[#F7F1EB] border border-[#42342E] hover:border-[#769A95]'
                      }`}
                    >
                      {isPlaying && useKeyframeLoop ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause to Pose
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Play Loop
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setUseKeyframeLoop(!useKeyframeLoop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        useKeyframeLoop
                          ? 'bg-[#D68B7E] text-[#151211]'
                          : 'bg-[#26201E] text-[#D8C8B8] border border-[#382F2C]'
                      }`}
                    >
                      {useKeyframeLoop ? 'Loop Mode: ON' : 'Use Keyframes'}
                    </button>
                  </div>
                </div>

                {/* Keyframe Selector Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {activeChar === 'crt_tv_sailor' &&
                    crtSailorKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveCrtSailorKfId(kf.id);
                            setIsPlaying(false);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeCrtSailorKfId === kf.id
                              ? 'bg-[#E492A4]/30 border-[#E492A4] text-[#FFF8F2] font-semibold ring-1 ring-[#E492A4]/50'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setCrtSailorKeyframes((prev) =>
                                prev.filter((item) => item.id !== kf.id)
                              );
                              setActiveCrtSailorKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {activeChar === 'chibi_squire' &&
                    squireKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveSquireKfId(kf.id);
                            setIsPlaying(false);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeSquireKfId === kf.id
                              ? 'bg-[#7E98A8]/30 border-[#7E98A8] text-[#FFF8F2] font-semibold ring-1 ring-[#7E98A8]/50'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setSquireKeyframes((prev) =>
                                prev.filter((item) => item.id !== kf.id)
                              );
                              setActiveSquireKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {activeChar === 'teacup_puppy' &&
                    puppyKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActivePuppyKfId(kf.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activePuppyKfId === kf.id
                              ? 'bg-[#D68B7E]/20 border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setPuppyKeyframes((prev) => prev.filter((item) => item.id !== kf.id));
                              setActivePuppyKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {isExtractedCompilerChar(activeChar) &&
                    compilerKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveCompilerKfId(kf.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeCompilerKfId === kf.id
                              ? 'bg-[#D68B7E]/20 border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setCompilerKeyframes((prev) => prev.filter((item) => item.id !== kf.id));
                              setActiveCompilerKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {activeChar === 'shoujo_girl' &&
                    shoujoKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveShoujoKfId(kf.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeShoujoKfId === kf.id
                              ? 'bg-[#D68B7E]/20 border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setShoujoKeyframes((prev) => prev.filter((item) => item.id !== kf.id));
                              setActiveShoujoKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {activeChar === 'victorian_bunny' &&
                    bunnyKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveBunnyKfId(kf.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeBunnyKfId === kf.id
                              ? 'bg-[#D68B7E]/20 border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setBunnyKeyframes((prev) => prev.filter((item) => item.id !== kf.id));
                              setActiveBunnyKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  {activeChar === 'raincoat_cat' &&
                    catKeyframes.map((kf) => (
                      <div key={kf.id} className="flex items-center">
                        <button
                          onClick={() => {
                            setUseKeyframeLoop(true);
                            setActiveCatKfId(kf.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            useKeyframeLoop && activeCatKfId === kf.id
                              ? 'bg-[#D68B7E]/20 border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#1C1816] border-[#2E2623] text-[#A89890] hover:text-[#F7F1EB]'
                          }`}
                        >
                          {kf.label}
                        </button>
                        {kf.id !== 'start' && kf.id !== 'end' && (
                          <button
                            onClick={() => {
                              setCatKeyframes((prev) => prev.filter((item) => item.id !== kf.id));
                              setActiveCatKfId('start');
                            }}
                            className="ml-1 p-1 text-[#A89890] hover:text-[#FF7A72]"
                            title="Delete Mid Keyframe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                  <button
                    onClick={handleAddMidKeyframe}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#221D1A] hover:bg-[#2E2623] text-[#F5C4D2] border border-[#382F2C]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Mid Keyframe
                  </button>
                  <button
                    onClick={handleSwapStartEnd}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#221D1A] hover:bg-[#2E2623] text-[#D8C8B8] border border-[#382F2C]"
                    title="Swap Start & Target Keyframes"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Swap
                  </button>
                </div>

                {/* Loop Cycle Duration, Style & Easing */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#26201E]">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                      Loop Cycle (s)
                    </label>
                    <input
                      type="number"
                      min={0.5}
                      max={30}
                      step={0.5}
                      value={loopDurationSec}
                      onChange={(e) =>
                        setLoopDurationSec(Math.max(0.5, parseFloat(e.target.value) || 1))
                      }
                      className="w-full px-2.5 py-1 rounded bg-[#1C1816] border border-[#322A27] text-xs font-mono text-[#FFF8F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                      Loop Mode
                    </label>
                    <select
                      value={loopStyle}
                      onChange={(e) => setLoopStyle(e.target.value as LoopStyle)}
                      className="w-full px-2 py-1 rounded bg-[#1C1816] border border-[#322A27] text-xs text-[#FFF8F2]"
                    >
                      <option value="pingpong">Ping-Pong (A↔B)</option>
                      <option value="cycle">Forward (A→B)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                      Easing Curve
                    </label>
                    <select
                      value={easingMode}
                      onChange={(e) => setEasingMode(e.target.value as EasingMode)}
                      className="w-full px-2 py-1 rounded bg-[#1C1816] border border-[#322A27] text-xs text-[#FFF8F2]"
                    >
                      <option value="easeInOutSine">Sine Ease-In-Out</option>
                      <option value="smoothStep">SmoothStep</option>
                      <option value="springBounce">Spring Overshoot</option>
                      <option value="linear">Linear</option>
                    </select>
                  </div>
                </div>

                {/* Quick Loop Presets for Kawaii CRT TV Sailor */}
                {activeChar === 'crt_tv_sailor' && (
                  <div className="pt-2 border-t border-[#26201E]">
                    <span className="block text-[10px] font-mono uppercase text-[#E492A4] mb-1.5">
                      Quick Keyframe Loop Presets (CRT TV Sailor):
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => applyCrtSailorLoopPreset('idle_breath')}
                        className="px-2.5 py-1.5 rounded bg-[#21191D] hover:bg-[#2E2228] text-[11px] text-[#F7F1EB] border border-[#4D3843] text-left truncate"
                      >
                        📺 Calm Sailor Breathing (2.4s)
                      </button>
                      <button
                        onClick={() => applyCrtSailorLoopPreset('channel_surf')}
                        className="px-2.5 py-1.5 rounded bg-[#21191D] hover:bg-[#2E2228] text-[11px] text-[#F7F1EB] border border-[#4D3843] text-left truncate"
                      >
                        🎛️ Rotary Dial Channel Surf (2.8s)
                      </button>
                      <button
                        onClick={() => applyCrtSailorLoopPreset('shy_fidget_loop')}
                        className="px-2.5 py-1.5 rounded bg-[#21191D] hover:bg-[#2E2228] text-[11px] text-[#F7F1EB] border border-[#4D3843] text-left truncate"
                      >
                        🌸 Shy Clasped Fidget IK (2.2s)
                      </button>
                      <button
                        onClick={() => applyCrtSailorLoopPreset('happy_antenna_bounce')}
                        className="px-2.5 py-1.5 rounded bg-[#21191D] hover:bg-[#2E2228] text-[11px] text-[#F7F1EB] border border-[#4D3843] text-left truncate"
                      >
                        📡 Rabbit Antenna Hop (1.8s)
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Loop Presets for Chibi Squire Boy */}
                {activeChar === 'chibi_squire' && (
                  <div className="pt-2 border-t border-[#26201E]">
                    <span className="block text-[10px] font-mono uppercase text-[#7E98A8] mb-1.5">
                      Quick Keyframe Loop Presets (Chibi Squire):
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => applySquireLoopPreset('practice_slash')}
                        className="px-2.5 py-1.5 rounded bg-[#1B2329] hover:bg-[#25323C] text-[11px] text-[#F7F1EB] border border-[#3E4F5C] text-left truncate"
                      >
                        ⚔️ Practice Slash Arc (2.2s)
                      </button>
                      <button
                        onClick={() => applySquireLoopPreset('squire_stride')}
                        className="px-2.5 py-1.5 rounded bg-[#1B2329] hover:bg-[#25323C] text-[11px] text-[#F7F1EB] border border-[#3E4F5C] text-left truncate"
                      >
                        🛡️ Squire Stride Patrol (1.6s)
                      </button>
                      <button
                        onClick={() => applySquireLoopPreset('cheerful_wave')}
                        className="px-2.5 py-1.5 rounded bg-[#1B2329] hover:bg-[#25323C] text-[11px] text-[#F7F1EB] border border-[#3E4F5C] text-left truncate"
                      >
                        👋 Cheerful Greeting Wave (2s)
                      </button>
                      <button
                        onClick={() => applySquireLoopPreset('idle_breath')}
                        className="px-2.5 py-1.5 rounded bg-[#1B2329] hover:bg-[#25323C] text-[11px] text-[#F7F1EB] border border-[#3E4F5C] text-left truncate"
                      >
                        🌬️ Calm Sentry Breathing (1.8s)
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Loop Presets for Teacup Puppy */}
                {activeChar === 'teacup_puppy' && (
                  <div className="pt-2 border-t border-[#26201E]">
                    <span className="block text-[10px] font-mono uppercase text-[#A89890] mb-1.5">
                      Quick Loop Movement Presets:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => applyPuppyLoopPreset('teacup_sip_wag')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🍵 Warm Teacup Sip & Wag (5s)
                      </button>
                      <button
                        onClick={() => applyPuppyLoopPreset('sleepy_ear_sway')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🌙 Sleepy Blink & Floppy Ears (6s)
                      </button>
                      <button
                        onClick={() => applyPuppyLoopPreset('happy_tail_bounce')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🐾 Happy Tail Wag & Paws (3s)
                      </button>
                      <button
                        onClick={() => applyPuppyLoopPreset('curious_head_tilt')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🎀 Curious Puppy Head Tilt (4.5s)
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Loop Presets for Extracted Compiler Characters */}
                {isExtractedCompilerChar(activeChar) && (
                  <div className="pt-2 border-t border-[#26201E]">
                    <span className="block text-[10px] font-mono uppercase text-[#A89890] mb-1.5">
                      Quick Loop Movement Presets:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => applyCompilerLoopPreset('dreamy_breeze')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🌸 Gentle Breeze & Sway (6s)
                      </button>
                      <button
                        onClick={() => applyCompilerLoopPreset('half_lid_sigh')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        ✨ Half-Lid Sigh & Gaze (5s)
                      </button>
                      <button
                        onClick={() => applyCompilerLoopPreset('bow_flutter')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🎀 Happy Bow & Hair Flutter (3.5s)
                      </button>
                      <button
                        onClick={() => applyCompilerLoopPreset('sleeping_breath')}
                        className="px-2.5 py-1.5 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] text-[#F7F1EB] border border-[#322A27] text-left truncate"
                      >
                        🌙 Sleepy Nod & Blink (6s)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Joint Sliders Header */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D8C8B8]">
                  {useKeyframeLoop
                    ? `Editing Slot: ${
                        activeChar === 'crt_tv_sailor'
                          ? activeCrtSailorKf.label
                          : activeChar === 'chibi_squire'
                          ? activeSquireKf.label
                          : activeChar === 'teacup_puppy'
                          ? activePuppyKf.label
                          : isExtractedCompilerChar(activeChar)
                          ? activeCompilerKf.label
                          : activeChar === 'shoujo_girl'
                          ? activeShoujoKf.label
                          : activeChar === 'victorian_bunny'
                          ? activeBunnyKf.label
                          : activeCatKf.label
                      }`
                    : 'Manual Joint & Expression Sliders'}
                </span>
                <button
                  onClick={() => {
                    if (activeChar === 'crt_tv_sailor') {
                      if (useKeyframeLoop) {
                        setCrtSailorKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeCrtSailorKfId
                              ? { ...kf, joints: extractCrtSailorJoints(DEFAULT_CRT_SAILOR_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setCrtSailorManualMode(false);
                        setCrtSailorRig({ ...DEFAULT_CRT_SAILOR_RIG });
                      }
                    } else if (activeChar === 'chibi_squire') {
                      if (useKeyframeLoop) {
                        setSquireKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeSquireKfId
                              ? { ...kf, joints: extractSquireJoints(DEFAULT_CHIBI_SQUIRE_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setSquireManualMode(false);
                        setSquireRig({ ...DEFAULT_CHIBI_SQUIRE_RIG });
                      }
                    } else if (activeChar === 'teacup_puppy') {
                      if (useKeyframeLoop) {
                        setPuppyKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activePuppyKfId
                              ? { ...kf, joints: extractPuppyJoints(DEFAULT_PUPPY_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setPuppyRig({ ...DEFAULT_PUPPY_RIG });
                      }
                    } else if (isExtractedCompilerChar(activeChar)) {
                      if (useKeyframeLoop) {
                        setCompilerKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeCompilerKfId
                              ? { ...kf, joints: extractCompilerJoints(DEFAULT_COMPILER_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setCompilerRig({ ...DEFAULT_COMPILER_RIG });
                      }
                    } else if (activeChar === 'shoujo_girl') {
                      if (useKeyframeLoop) {
                        setShoujoKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeShoujoKfId
                              ? { ...kf, joints: extractShoujoJoints(DEFAULT_SHOUJO_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setShoujoRig({ ...DEFAULT_SHOUJO_RIG });
                      }
                    } else if (activeChar === 'victorian_bunny') {
                      if (useKeyframeLoop) {
                        setBunnyKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeBunnyKfId
                              ? { ...kf, joints: extractBunnyJoints(DEFAULT_BUNNY_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setBunnyRig({ ...DEFAULT_BUNNY_RIG });
                      }
                    } else {
                      if (useKeyframeLoop) {
                        setCatKeyframes((prev) =>
                          prev.map((kf) =>
                            kf.id === activeCatKfId
                              ? { ...kf, joints: extractCatJoints(DEFAULT_CAT_RIG) }
                              : kf
                          )
                        );
                      } else {
                        setCatRig({ ...DEFAULT_CAT_RIG });
                      }
                    }
                  }}
                  className="text-[11px] text-[#F5C4D2] hover:underline"
                >
                  Zero Current Pose
                </button>
              </div>

              {/* Joint Sliders List */}
              {activeChar === 'crt_tv_sailor' ? (
                <div className="space-y-2.5">
                  {CRT_SAILOR_JOINT_SLIDER_META.map((s) => {
                    const startVal = crtSailorKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      crtSailorKeyframes[crtSailorKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal =
                      (useKeyframeLoop
                        ? activeCrtSailorKf.joints[s.key]
                        : crtSailorRig[s.key]) ?? 0;
                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : `Clamped [${s.min}, +${s.max}]${s.unit}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleCrtSailorJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#E492A4]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#FADCE4]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activeChar === 'chibi_squire' ? (
                <div className="space-y-2.5">
                  {SQUIRE_JOINT_SLIDER_META.map((s) => {
                    const startVal = squireKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      squireKeyframes[squireKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal =
                      (useKeyframeLoop
                        ? activeSquireKf.joints[s.key]
                        : squireRig[s.key]) ?? 0;
                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.unit === 'rad'
                              ? 'Rotation Joint'
                              : 'Translation Offset'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleSquireJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#7E98A8]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#D8E6F0]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activeChar === 'teacup_puppy' ? (
                <div className="space-y-2.5">
                  {PUPPY_JOINT_SLIDER_META.map((s) => {
                    const startVal = puppyKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      puppyKeyframes[puppyKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal = useKeyframeLoop
                      ? activePuppyKf.joints[s.key]
                      : puppyRig[s.key];

                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.pivotLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handlePuppyJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#D68B7E]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#F5C4D2]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isExtractedCompilerChar(activeChar) ? (
                <div className="space-y-2.5">
                  {COMPILER_JOINT_SLIDER_META.map((s) => {
                    const startVal = compilerKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      compilerKeyframes[compilerKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal =
                      (useKeyframeLoop
                        ? activeCompilerKf.joints[s.key]
                        : compilerRig[s.key]) ?? 0;

                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.pivotLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleCompilerJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#D68B7E]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#F5C4D2]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activeChar === 'shoujo_girl' ? (
                <div className="space-y-2.5">
                  {SHOUJO_JOINT_META.map((s) => {
                    const startVal = shoujoKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      shoujoKeyframes[shoujoKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal = useKeyframeLoop
                      ? activeShoujoKf.joints[s.key]
                      : shoujoRig[s.key];

                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.pivotLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleShoujoJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#D68B7E]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#F5C4D2]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activeChar === 'victorian_bunny' ? (
                <div className="space-y-2.5">
                  {BUNNY_JOINT_META.map((s) => {
                    const startVal = bunnyKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      bunnyKeyframes[bunnyKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal = useKeyframeLoop
                      ? activeBunnyKf.joints[s.key]
                      : bunnyRig[s.key];

                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.pivotLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleBunnyJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#D68B7E]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#F5C4D2]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {CAT_JOINT_META.map((s) => {
                    const startVal = catKeyframes[0]?.joints[s.key] ?? 0;
                    const endVal =
                      catKeyframes[catKeyframes.length - 1]?.joints[s.key] ?? 0;
                    const curVal = useKeyframeLoop
                      ? activeCatKf.joints[s.key]
                      : catRig[s.key];

                    return (
                      <div
                        key={s.key}
                        className="p-2.5 rounded-xl bg-[#161311] border border-[#28211E] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#EFE6DD]">{s.label}</span>
                          <span className="font-mono text-[10px] text-[#A89890]">
                            {useKeyframeLoop
                              ? `0%: ${startVal.toFixed(2)} → 100%: ${endVal.toFixed(2)}`
                              : s.pivotLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={curVal}
                            onChange={(e) =>
                              handleCatJointChange(s.key, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-[#D68B7E]"
                          />
                          <span className="w-16 text-right font-mono text-xs text-[#F5C4D2]">
                            {curVal.toFixed(2)}
                            {s.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Custom-Length Video Downloader */}
          {activeTab === 'video' && (
            <div className="p-5 space-y-5 max-h-[680px] overflow-y-auto">
              <div className="p-4 rounded-xl bg-[#141110] border border-[#2E2623] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D68B7E]/20 border border-[#D68B7E]/40 flex items-center justify-center text-[#F5C4D2]">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#FFF8F2]">
                      Loop Video Downloader
                    </h2>
                    <p className="text-xs text-[#A89890]">
                      Choose the exact length of your loop video (1s – 120s) and record directly from the canvas.
                    </p>
                  </div>
                </div>

                {/* Duration Presets */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#D8C8B8] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#F5C4D2]" />
                      Video Duration (Seconds)
                    </span>
                    <span className="font-mono text-xs text-[#F5C4D2] font-semibold">
                      {videoDurationSec} sec (
                      {(videoDurationSec / Math.max(0.2, loopDurationSec)).toFixed(1)}× loop cycles)
                    </span>
                  </div>

                  {/* Quick Second Buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[3, 6, 12, 18, 30].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setVideoDurationSec(sec)}
                        className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                          videoDurationSec === sec
                            ? 'bg-[#D68B7E] text-[#151211] border-[#F5C4D2] font-semibold'
                            : 'bg-[#1C1816] text-[#D8C8B8] border-[#2E2623] hover:border-[#4A3B36]'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  {/* Loop Multiple Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-[#A89890] mr-1">Exact Loop Multiples:</span>
                    {[1, 2, 4, 8].map((mult) => {
                      const targetSec = Number((loopDurationSec * mult).toFixed(1));
                      return (
                        <button
                          key={mult}
                          onClick={() => setVideoDurationSec(targetSec)}
                          className="px-2 py-1 rounded bg-[#221D1A] hover:bg-[#2E2623] text-[11px] font-mono text-[#F5C4D2] border border-[#382F2C]"
                        >
                          {mult}× ({targetSec}s)
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Duration Slider + Number Input */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="range"
                      min={1}
                      max={60}
                      step={1}
                      value={Math.min(60, videoDurationSec)}
                      onChange={(e) => setVideoDurationSec(parseFloat(e.target.value))}
                      className="flex-1 accent-[#D68B7E]"
                    />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      step={0.5}
                      value={videoDurationSec}
                      onChange={(e) =>
                        setVideoDurationSec(Math.max(1, Math.min(120, parseFloat(e.target.value) || 6)))
                      }
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-[#1C1816] border border-[#322A27] text-xs font-mono text-right text-[#FFF8F2]"
                    />
                  </div>
                </div>

                {/* Frame Rate Selector & Transparent Background Mode */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#26201E]">
                  <span className="text-xs text-[#D8C8B8] font-medium">Capture Frame Rate</span>
                  <div className="flex items-center gap-1.5">
                    {[24, 30, 60].map((fps) => (
                      <button
                        key={fps}
                        onClick={() => setVideoFps(fps)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono border ${
                          videoFps === fps
                            ? 'bg-[#D68B7E]/25 border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#1C1816] border-[#2E2623] text-[#A89890]'
                        }`}
                      >
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transparent BG Mode Selector for After Effects & Video Editors */}
                <div className="p-3 rounded-xl bg-[#1A1518] border border-[#3E2E37] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5C4D2]">
                      Background Mode (After Effects / Premiere / CapCut)
                    </span>
                    <button
                      onClick={() => {
                        const next = !videoTransparentBg;
                        setVideoTransparentBg(next);
                        if (activeChar === 'crt_tv_sailor') setCrtSailorTransparent(next);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        videoTransparentBg
                          ? 'bg-[#1F332D] text-[#7ED6A5] border-[#4E8A78]'
                          : 'bg-[#26201E] text-[#D8C8B8] border-[#3E322E]'
                      }`}
                    >
                      {videoTransparentBg
                        ? '✓ Transparent BG (Alpha Channel ON)'
                        : 'Opaque White/Scene BG'}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#A89890] leading-relaxed">
                    • <strong className="text-[#9CE4C8]">Transparent Video (.WebM VP9 Alpha):</strong> Encodes an 8-bit Alpha channel (<code className="text-[#F5C4D2]">rgba(0,0,0,0)</code>) with zero background.<br />
                    • <strong className="text-[#E4C2F8]">After Effects PNG Sequence (.ZIP):</strong> Instant offline render (no waiting for recording!) of 32-bit RGBA lossless transparent PNG frames ready for <code className="text-[#F5C4D2]">File &gt; Import &gt; PNG Sequence</code> in After Effects.
                  </p>
                </div>

                {/* 3 Direct Export Action Buttons */}
                <div className="pt-2 space-y-2">
                  {!isRecordingVideo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartVideoRecording({ transparent: true })}
                        className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#7B4B94] to-[#B66697] hover:from-[#8C57A8] hover:to-[#C874A8] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <Film className="w-4 h-4" />
                        Download Transparent Video (.WebM No BG, {videoDurationSec}s)
                      </button>
                      <button
                        onClick={() => handleStartVideoRecording({ transparent: false })}
                        className="py-3 px-3 rounded-xl bg-[#D68B7E] hover:bg-[#E29A8E] text-[#151211] font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <Video className="w-4 h-4" />
                        Save Normal Video (With BG, {videoDurationSec}s)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-[#26201E] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B63] transition-all duration-100"
                          style={{
                            width: `${Math.min(100, (recordingElapsedSec / videoDurationSec) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#F5C4D2] flex items-center gap-1.5 font-mono">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving {recordingElapsedSec.toFixed(1)}s / {videoDurationSec}s...
                        </span>
                        <button
                          onClick={handleCancelVideoRecording}
                          className="px-3 py-1 rounded bg-[#382826] hover:bg-[#4A3432] text-xs text-[#FFF8F2]"
                        >
                          Stop & Save Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Instant Offline After Effects Transparent PNG Sequence (.ZIP) */}
                  <button
                    onClick={() => handleExportAfterEffectsZip()}
                    disabled={isExportingAeZip}
                    className="w-full py-3 px-4 rounded-xl bg-[#1D2E2B] hover:bg-[#263D39] text-[#9CE4C8] border border-[#4E7A70] font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isExportingAeZip ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Rendering After Effects 32-Bit RGBA Frames ({aeZipProgress.current}/{aeZipProgress.total})...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Instant Save for After Effects: Transparent PNG Sequence (.ZIP — Zero Recording Wait)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recorded Video Preview & Re-Download */}
              {recordedVideoUrl && (
                <div className="p-4 rounded-xl bg-[#141110] border border-[#382F2C] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#7ED6A5]">
                      ✓ {videoTransparentBg ? 'Transparent Alpha Video' : 'Normal Video'} Ready ({videoDurationSec}s)
                    </span>
                    <a
                      href={recordedVideoUrl}
                      download={`${activeChar}_${videoTransparentBg ? 'transparent_alpha' : 'normal'}_${videoDurationSec}s.${recordedVideoExt}`}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D68B7E] text-[#151211] font-semibold text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .{recordedVideoExt.toUpperCase()}
                    </a>
                  </div>
                  <video
                    src={recordedVideoUrl}
                    controls
                    loop
                    autoPlay
                    muted
                    className={`w-full rounded-lg border border-[#2E2623] ${
                      videoTransparentBg
                        ? 'bg-[conic-gradient(#231F20_25%,#181516_0_50%,#231F20_0_75%,#181516_0)] bg-[length:20px_20px]'
                        : 'bg-[#FFFFFF]'
                    }`}
                  />
                </div>
              )}

              {/* Instant After Effects ZIP Re-Download */}
              {lastAeZipUrl && (
                <div className="p-3.5 rounded-xl bg-[#141E1C] border border-[#386158] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#9CE4C8]">
                    ✓ After Effects 32-Bit RGBA PNG Sequence Ready
                  </span>
                  <a
                    href={lastAeZipUrl.url}
                    download={lastAeZipUrl.filename}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9CE4C8] text-[#101C19] font-semibold text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {lastAeZipUrl.filename}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Rig Modes & Environment Controls */}
          {activeTab === 'presets' && (
            <div className="p-5 space-y-6 max-h-[680px] overflow-y-auto">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#A89890] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F5C4D2]" />
                  Hierarchical Rigging Mode
                </label>
                {activeChar === 'crt_tv_sailor' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {
                            id: 'idle',
                            title: '18-Layer Breathing & Antenna Sway',
                            desc: 'Chest breathing, TV head sway, rabbit-ear phase lag & 3-stage blink',
                          },
                          {
                            id: 'tune_channel',
                            title: 'Rotary Dial Channel Surf',
                            desc: 'Cycles rotary tuning dials, antenna bounce & 6 CRT expressions',
                          },
                          {
                            id: 'shy_fidget',
                            title: 'Shy Clasped-Hand Fidget',
                            desc: 'Coupled 2-link IK hand fidget, blush glow & gentle head tilt',
                          },
                          {
                            id: 'signal_bounce',
                            title: 'Kawaii Happy Signal Bounce',
                            desc: 'Joyful vertical bounce, rabbit-ear swing & :3 mouth morph',
                          },
                          {
                            id: 'static',
                            title: 'Static Reference Master (1000×1200)',
                            desc: 'Exact calibrated 5:6 pure-code vector pose',
                          },
                        ] as { id: CrtSailorAction; title: string; desc: string }[]
                      ).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setUseKeyframeLoop(false);
                            setCrtSailorManualMode(false);
                            setCrtSailorAction(m.id);
                            if (m.id !== 'static') setIsPlaying(true);
                          }}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            !useKeyframeLoop && !crtSailorManualMode && crtSailorAction === m.id
                              ? 'bg-[#2B2023] border-[#E08A92] text-[#FFF8F2]'
                              : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                          }`}
                        >
                          <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                          <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                            {m.desc}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setCrtSailorManualMode(true);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && crtSailorManualMode
                            ? 'bg-[#2B2023] border-[#E08A92] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">
                          Manual Joint & IK Sliders
                        </div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                          Pose all 20 clamped CRT TV joints, 2-link arm IK & 3-stage blink
                        </div>
                      </button>
                    </div>
                  </div>
                ) : activeChar === 'chibi_squire' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {
                            id: 'idle',
                            title: 'Idle Breathing & Cape Sway',
                            desc: 'Chest rise/fall, hair & cape breathing sway, sword sheath rest',
                          },
                          {
                            id: 'slash',
                            title: 'Practice Sword Slash',
                            desc: 'Diagonal blade slash with arc trail, gauntlet brace & balanced stance',
                          },
                          {
                            id: 'walk',
                            title: 'Squire Stride / Patrol',
                            desc: 'Confident pacing step with alternating arm swing, scabbard bob & boot lift',
                          },
                          {
                            id: 'sit',
                            title: 'Resting Camp Pose',
                            desc: 'Seated on training grounds grass with sheathed sword across knees',
                          },
                          {
                            id: 'wave',
                            title: 'Knightly Greeting Wave',
                            desc: 'Raises left gauntlet or right hand in a friendly chivalric wave',
                          },
                          {
                            id: 'jump',
                            title: 'Combat Training Hop',
                            desc: 'Upward jump with secondary hair, cape & scabbard follow-through',
                          },
                          {
                            id: 'look_around',
                            title: 'Sentry Horizon Scan',
                            desc: 'Turns head and shifts gaze left and right on castle ramparts',
                          },
                          {
                            id: 'breeze',
                            title: 'Castle Battlement Breeze',
                            desc: 'Crisp wind rustling ash-brown hair tufts, cape cloth, and tunic lace',
                          },
                          {
                            id: 'static',
                            title: 'Static Master Reference Pose',
                            desc: 'Exact calibrated pose matching your reference artwork',
                          },
                        ] as { id: SquireAction; title: string; desc: string }[]
                      ).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setUseKeyframeLoop(false);
                            setSquireManualMode(false);
                            setSquireAction(m.id);
                            if (m.id !== 'static') setIsPlaying(true);
                          }}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            !useKeyframeLoop && !squireManualMode && squireAction === m.id
                              ? 'bg-[#1C252B] border-[#7E98A8] text-[#FFF8F2]'
                              : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                          }`}
                        >
                          <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                          <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                            {m.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : activeChar === 'teacup_puppy' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: '20layer',
                          title: '20-Layer Full Spline Rig',
                          desc: 'Phase-lagged floppy ears, wagging tail, teacup lift, nose sniff & 3-stage blink',
                        },
                        {
                          id: '5layer',
                          title: '5-Layer Primary Rig',
                          desc: 'Breathing head bob, tail wag, teacup float & auto-blink',
                        },
                        {
                          id: 'static',
                          title: 'Static Reference Master',
                          desc: 'Exact calibrated 1000×1000 pose (0.08% Pixel Error)',
                        },
                        {
                          id: 'manual',
                          title: 'Manual Joint Sliders',
                          desc: 'Pose all 17 puppy joints & 3-stage deforming blink by hand',
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setPuppyMode(m.id);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && puppyMode === m.id
                            ? 'bg-[#2B221F] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : isExtractedCompilerChar(activeChar) ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: 'breeze',
                          title: '20-Layer Breeze & Sway',
                          desc: 'Full hierarchical joint sway, secondary follow-through & deforming blink',
                        },
                        {
                          id: 'idle',
                          title: 'Gentle Breathing Idle',
                          desc: 'Subtle torso breathing, gentle head tilt & auto-blink',
                        },
                        {
                          id: 'glance',
                          title: 'Expressive Eye Glance',
                          desc: 'Dynamic iris gaze shift, brow lift & hair follow-through',
                        },
                        {
                          id: 'nod',
                          title: 'Happy Nod & Bounce',
                          desc: 'Rhythmic head nod, lace ribbon bounce & blink',
                        },
                        {
                          id: 'static',
                          title: 'Static Reference Pose',
                          desc: 'Exact calibrated portrait from compiler engine',
                        },
                        {
                          id: 'manual',
                          title: 'Manual Joint Sliders',
                          desc: 'Pose all 25 compiler joints & deforming blink by hand',
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setCompilerMode(m.id);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && compilerMode === m.id
                            ? 'bg-[#2B221F] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : activeChar === 'shoujo_girl' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: '24layer',
                          title: '24-Layer Full Shoujo Rig',
                          desc: 'Phase-lagged hair, deforming eyelid blink, iris gaze & jewels',
                        },
                        {
                          id: '5layer',
                          title: '5-Layer Primary Groups',
                          desc: 'Breathing torso, head tilt, hair sway & auto-blink',
                        },
                        {
                          id: 'static',
                          title: 'Static Reference Master',
                          desc: 'Exact 1000×1000 calibrated 90s Shoujo reference pose',
                        },
                        {
                          id: 'manual',
                          title: 'Manual Joint Sliders',
                          desc: 'Direct slider control over all 19 joints & blink stages',
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setShoujoMode(m.id);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && shoujoMode === m.id
                            ? 'bg-[#2B221F] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : activeChar === 'victorian_bunny' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: '12layer',
                          title: '12-Layer Full Storybook Rig',
                          desc: 'Independent lop ears, bonnet tiers, paws, feet, tail & nose twitch',
                        },
                        {
                          id: '5layer',
                          title: '5-Layer Primary Groups',
                          desc: 'Head, body, ears, limbs, and ribbon follow-through',
                        },
                        {
                          id: 'static',
                          title: 'Static Reference Master',
                          desc: 'Exact 1000×1000 calibrated illustration pose',
                        },
                        {
                          id: 'manual',
                          title: 'Manual Joint Sliders',
                          desc: 'Pose every anatomical joint by hand',
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setBunnyMode(m.id);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && bunnyMode === m.id
                            ? 'bg-[#2B221F] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5 leading-snug">
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: '12layer', title: '12-Layer Full Rig', desc: 'Complete overlapping physics' },
                        { id: '5layer', title: '5-Layer Rig', desc: 'Simplified group motion' },
                        { id: 'static', title: 'Static Pose', desc: 'Zero-motion reference' },
                        { id: 'manual', title: 'Manual Sliders', desc: 'Custom joint posing' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setUseKeyframeLoop(false);
                          setCatMode(m.id);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          !useKeyframeLoop && catMode === m.id
                            ? 'bg-[#2B221F] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#161311] border-[#28211E] text-[#A89890] hover:border-[#3A302C]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7F1EB]">{m.title}</div>
                        <div className="text-[11px] text-[#9E8E86] mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Deforming Eyelid Blink Inspector */}
              {(activeChar === 'crt_tv_sailor' ||
                activeChar === 'teacup_puppy' ||
                isExtractedCompilerChar(activeChar)) && (
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#A89890] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#F5C4D2]" />
                    3-Stage Deforming Eyelid Blink
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Wide Open (0.0)', u: 0.0 },
                      { label: 'Half-Lid (0.55)', u: 0.55 },
                      { label: 'Sleeping (1.0)', u: 1.0 },
                    ].map((st) => {
                      const curBlink =
                        activeChar === 'crt_tv_sailor'
                          ? crtSailorRig.blink
                          : activeChar === 'teacup_puppy'
                            ? puppyRig.blink
                            : compilerRig.blink;
                      const isManualActive =
                        activeChar === 'crt_tv_sailor'
                          ? crtSailorManualMode
                          : activeChar === 'teacup_puppy'
                            ? puppyMode === 'manual'
                            : compilerMode === 'manual';
                      return (
                        <button
                          key={st.label}
                          onClick={() => {
                            setUseKeyframeLoop(false);
                            if (activeChar === 'crt_tv_sailor') {
                              setCrtSailorManualMode(true);
                              setCrtSailorRig((prev) => ({ ...prev, blink: st.u }));
                            } else if (activeChar === 'teacup_puppy') {
                              setPuppyMode('manual');
                              setPuppyRig((prev) => ({ ...prev, blink: st.u }));
                            } else {
                              setCompilerMode('manual');
                              setCompilerRig((prev) => ({ ...prev, blink: st.u }));
                            }
                          }}
                          className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all ${
                            !useKeyframeLoop &&
                            isManualActive &&
                            Math.abs(curBlink - st.u) < 0.05
                              ? 'bg-[#D68B7E] text-[#151211] border-[#F5C4D2] font-semibold'
                              : 'bg-[#161311] text-[#D8C8B8] border-[#28211E] hover:border-[#3A302C]'
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Playback Speed */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A89890] font-medium">Animation Tempo</span>
                  <span className="font-mono text-[#F5C4D2]">{speed.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.5}
                  step={0.05}
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#D68B7E]"
                />
              </div>

              {/* Atmosphere Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#28211E]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A89890]">
                  Canvas Background & Atmosphere
                </span>
                {activeChar === 'crt_tv_sailor' ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crtSailorScanlines}
                        onChange={(e) => setCrtSailorScanlines(e.target.checked)}
                        className="accent-[#E08A92] rounded"
                      />
                      Subtle CRT Scanline & Phosphor Vignette Overlay
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crtSailorBezierWireframe}
                        onChange={(e) => setCrtSailorBezierWireframe(e.target.checked)}
                        className="accent-[#E08A92] rounded"
                      />
                      Show 18-Layer Vector Wireframe & IK Pivot Markers
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crtSailorTransparent}
                        onChange={(e) => setCrtSailorTransparent(e.target.checked)}
                        className="accent-[#E08A92] rounded"
                      />
                      Transparent Background (Hide #FFFFFF Reference Fill)
                    </label>
                  </div>
                ) : activeChar === 'chibi_squire' ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={squireCastleBg}
                        onChange={(e) => setSquireCastleBg(e.target.checked)}
                        className="accent-[#7E98A8] rounded"
                      />
                      Storybook Castle Courtyard & Training Grounds Background
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={squireTransparent}
                        onChange={(e) => setSquireTransparent(e.target.checked)}
                        className="accent-[#7E98A8] rounded"
                      />
                      Transparent Background (Hide Paper Fill & Shadow)
                    </label>
                  </div>
                ) : activeChar === 'teacup_puppy' ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={puppySteam}
                        onChange={(e) => setPuppySteam(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Rising Warm Tea Steam Wisps
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={puppyTransparent}
                        onChange={(e) => setPuppyTransparent(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Transparent Background
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={puppyShowPivots}
                        onChange={(e) => setPuppyShowPivots(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Show Anatomical Pivot Markers
                    </label>
                  </div>
                ) : isExtractedCompilerChar(activeChar) ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compilerTransparent}
                        onChange={(e) => setCompilerTransparent(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Transparent Background (Hide Studio Canvas Fill)
                    </label>
                  </div>
                ) : activeChar === 'shoujo_girl' ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shoujoTransparent}
                        onChange={(e) => setShoujoTransparent(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Transparent Background (Hide Periwinkle Circle)
                    </label>
                  </div>
                ) : activeChar === 'victorian_bunny' ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPetals}
                        onChange={(e) => setShowPetals(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Floating Pastel Petals & Dust Motes
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPaperGrid}
                        onChange={(e) => setShowPaperGrid(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Warm Storybook Paper Grain
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showRain}
                        onChange={(e) => setShowRain(e.target.checked)}
                        className="accent-[#D68B7E] rounded"
                      />
                      Animated Raindrops & Canopy Splashes
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Architecture & 4 Mandatory Pipeline Rules */}
          {activeTab === 'code' && (
            <div className="p-5 space-y-4 max-h-[680px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5C4D2]">
                    4-Gate Verification & 18-Layer Architecture
                  </h3>
                  <p className="text-[11px] text-[#A89890]">
                    Native 5:6 (1000×1200) • Ink-Wall Flood-Fill • Cubic Bézier • Closed-Chain 2-Link IK
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26201E] hover:bg-[#322A27] text-xs font-medium text-[#F7F1EB] border border-[#382F2C]"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#7ED6A5]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy Spec'}
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#D8C8B8] bg-[#141110] p-3.5 rounded-xl border border-[#28211E]">
                <div className="font-semibold text-[#FFF8F2]">
                  CRT TV Sailor Character (`src/crtSailorEngine.ts` + `verify_crt_sailor.cjs`):
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-[#B8A89E]">
                  <li>
                    <strong className="text-[#F5C4D2]">Native 5:6 Aspect Ratio (1000×1200):</strong>{' '}
                    Preserves the full <code className="text-[#F5C4D2]">1145×1374</code> reference silhouette from the rabbit-ear antenna tips (<code className="text-[#F5C4D2]">y=37</code>) to the pleated skirt hem (<code className="text-[#F5C4D2]">y=1198</code>) without square cropping.
                  </li>
                  <li>
                    <strong className="text-[#F5C4D2]">Ink-Wall Flood-Fill + Coordinate Cut-Lines:</strong>{' '}
                    Separates identical warm-cream layers (<code className="text-[#F5C4D2]">#F5EFE6</code> collar, torso, upper sleeves, forearms/cuffs, <code className="text-[#F5C4D2]">#F4EDE4</code> CRT screen) via 2px dilated ink walls and explicit elbow cut segments, with budgeted Cubic Bézier (<code className="text-[#F5C4D2]">C</code>) and sharp-corner (<code className="text-[#F5C4D2]">L</code>, &lt;135°) segments.
                  </li>
                  <li>
                    <strong className="text-[#F5C4D2]">Watertight Occluded Underlaps & Closed-Chain 2-Link IK:</strong>{' '}
                    Synthesizes deterministic tangent-continuation hulls for <code className="text-[#F5C4D2]">L01</code> skirt (<code className="text-[#F5C4D2]">y=1060..1198</code>), <code className="text-[#F5C4D2]">L02</code> torso undershirt, <code className="text-[#F5C4D2]">L03</code> neck (<code className="text-[#F5C4D2]">+42px</code> top, <code className="text-[#F5C4D2]">+55px</code> chest wedge), and <code className="text-[#F5C4D2]">L06..L09</code> semicircular joint caps. Analytical 2-link IK keeps both wrists locked to the coupled clasped hands (<code className="text-[#F5C4D2]">L10</code>).
                  </li>
                  <li>
                    <strong className="text-[#F5C4D2]">4-Gate Numeric Verification (`node verify_crt_sailor.cjs`):</strong>{' '}
                    Foreground Diff <strong className="text-[#7ED6A5]">0.4824% (&le;2.5% gate)</strong> • Ink-Line Recall <strong className="text-[#7ED6A5]">99.54% (&ge;94.0% gate)</strong> • Ink-Line Precision <strong className="text-[#7ED6A5]">99.92% (&ge;92.0% gate)</strong> • 12-Pose Extreme Boundary Combination Leak Matrix <strong className="text-[#7ED6A5]">0 leaked interior holes</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Multi-Character & Background Scene Composer Window */}
      <SceneComposerModal
        isOpen={isSceneComposerOpen}
        onClose={() => setIsSceneComposerOpen(false)}
      />
    </div>
  );
}

export default App;
