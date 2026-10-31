import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  FlipHorizontal,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Download,
  Video,
  Upload,
  Sparkles,
  Layers,
  Sliders,
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Code2,
  Smile,
  Compass,
  Footprints,
  Check,
} from 'lucide-react';
import {
  ExtractedCompilerCharacterId,
  DEFAULT_COMPILER_RIG,
  computeCompilerRigAtTime,
  drawExtractedCompilerCharacter,
  CompilerAnimPreset,
} from './extractedCompilerCharacters';
import {
  DEFAULT_SHOUJO_RIG,
  drawShoujoGirl,
  ShoujoRigState,
} from './shoujoGirlEngine';
import {
  DEFAULT_PUPPY_RIG,
  computePuppyRigAtTime,
  drawTeacupPuppy,
} from './teacupPuppyEngine';
import {
  DEFAULT_BUNNY_RIG,
  drawVictorianBunny,
  drawFloatingPetals,
} from './victorianBunnyEngine';
import {
  DEFAULT_CAT_RIG,
  drawRiggedCalicoKitten,
  drawRainEnvironment,
} from './catAnimationEngine';
import {
  DEFAULT_CHIBI_SQUIRE_RIG,
  SquireViewAngle,
  SquireAction,
  SquireExpression,
  computeChibiSquireRigAtTime,
  drawChibiSquire,
  drawSquireCastleYardBG,
} from './chibiSquireEngine';

export type SceneCharacterType =
  | 'chibi_squire'
  | 'shoujo_girl'
  | 'auburn_girl'
  | 'black_bob_girl'
  | 'porcelain_bjd'
  | 'teacup_puppy'
  | 'strawberry_mouse'
  | 'acorn_lamb'
  | 'watering_bunny'
  | 'postman_duckling'
  | 'lantern_kitten'
  | 'victorian_bunny'
  | 'raincoat_cat';

export type SceneBgPresetId =
  | 'squire_castle_yard'
  | 'meadow_day'
  | 'meadow_sunset'
  | 'shoujo_rose_dream'
  | 'victorian_conservatory'
  | 'starlight_garden'
  | 'rainy_twilight'
  | 'watercolor_paper'
  | 'transparent'
  | 'custom_upload'
  | `custom_code:${string}`;

export type SceneActorAnimMode =
  | 'idle'
  | 'walk'
  | 'sit'
  | 'wave'
  | 'jump'
  | 'look_around'
  | 'breeze'
  | 'glance'
  | 'nod'
  | 'static';

export interface CustomCodedBgItem {
  id: string;
  label: string;
  subtitle: string;
  code: string;
}

export interface SceneActorInstance {
  id: string;
  charType: SceneCharacterType;
  label: string;
  /** Normalized X position (0..1 across scene width) */
  x: number;
  /** Normalized Y position (0..1 across scene height, anchor at center of character) */
  y: number;
  /** Scale multiplier (1.0 = 82% of scene height) */
  scale: number;
  /** Rotation in degrees */
  rotationDeg: number;
  /** Horizontal mirror flip */
  flipX: boolean;
  /** Opacity 0..1 */
  opacity: number;
  /** Ground contact shadow under character */
  groundShadow: boolean;
  /** Fine adjustment for shadow vertical offset (-0.18..0.12) */
  shadowOffsetY?: number;
  /** Optional toggle to render or hide hair layers */
  renderHair: boolean;
  /** Animation mode (supports Idle, Walk, Sit, Wave, Jump, Look Around, Breeze, Glance, Nod, Static) */
  animMode: SceneActorAnimMode;
  /** Multi-view angle for characters with Front / 3/4 / Side / Back views */
  viewAngle?: SquireViewAngle;
  /** Facial expression preset */
  expression?: SquireExpression;
  /** Optional auto-locomotion across the scene when in walk mode */
  autoWalkAcross?: boolean;
  /** Animation speed multiplier */
  animSpeed: number;
  /** Time phase offset in seconds */
  phaseOffset: number;
  /** Eye blink mode */
  blinkMode: 'auto' | 'open' | 'half' | 'closed';
  /** Optional outfit for Porcelain BJD */
  bjdOutfit?: 'pink_babydoll' | 'mint_lolita' | 'classic_alice' | 'crimson_gothic';
}

/**
 * Calibrated anatomical foot/base contact Y offset (in units of charBoxPx from center cy)
 * Ensures ground shadows hug the character's boots/feet/base with zero floating gap!
 */
const ACTOR_FOOT_CONTACT_Y: Record<SceneCharacterType, number> = {
  chibi_squire: 0.342,      // Snug to boot soles (no floating gap!)
  porcelain_bjd: 0.285,     // Shoes at base
  shoujo_girl: 0.235,       // Bust base
  auburn_girl: 0.235,       // Bust base
  black_bob_girl: 0.235,    // Bust base
  teacup_puppy: 0.295,      // Saucer base
  strawberry_mouse: 0.245,  // Paws
  acorn_lamb: 0.265,        // Hooves
  watering_bunny: 0.265,    // Feet
  postman_duckling: 0.265,  // Webbed feet
  lantern_kitten: 0.335,    // Paws
  victorian_bunny: 0.295,   // Boots
  raincoat_cat: 0.295,      // Boots
};

export const SCENE_CHARACTER_CATALOG: {
  charType: SceneCharacterType;
  label: string;
  badge: string;
  defaultScale: number;
  hasHairToggle?: boolean;
  supportsMultiView?: boolean;
}[] = [
  {
    charType: 'chibi_squire',
    label: 'Chibi Squire Boy w/ Sword',
    badge: '5 Views • Slash/Walk/Expr',
    defaultScale: 0.72,
    hasHairToggle: true,
    supportsMultiView: true,
  },
  { charType: 'shoujo_girl', label: '90s Shoujo Girl', badge: '24-Layer Rig', defaultScale: 0.78, hasHairToggle: true },
  { charType: 'auburn_girl', label: 'Auburn Girl', badge: '25-Joint Rig', defaultScale: 0.76, hasHairToggle: true },
  { charType: 'black_bob_girl', label: 'Black Bob Girl', badge: '25-Joint Rig', defaultScale: 0.76, hasHairToggle: true },
  { charType: 'porcelain_bjd', label: 'Porcelain BJD Doll', badge: '4 Outfits', defaultScale: 0.78, hasHairToggle: true },
  { charType: 'teacup_puppy', label: 'Teacup Puppy', badge: '20-Layer Spline', defaultScale: 0.56 },
  { charType: 'strawberry_mouse', label: 'Strawberry Mouse', badge: 'Woodland', defaultScale: 0.52 },
  { charType: 'acorn_lamb', label: 'Acorn Lamb', badge: 'Woodland', defaultScale: 0.56 },
  { charType: 'watering_bunny', label: 'Watering Can Bunny', badge: 'Woodland', defaultScale: 0.56 },
  { charType: 'postman_duckling', label: 'Postman Duckling', badge: 'Woodland', defaultScale: 0.54 },
  { charType: 'lantern_kitten', label: 'Lantern Kitten', badge: 'Woodland', defaultScale: 0.54 },
  { charType: 'victorian_bunny', label: 'Victorian Maid Bunny', badge: 'Storybook', defaultScale: 0.62 },
  { charType: 'raincoat_cat', label: 'Raincoat Calico Kitten', badge: 'Storybook', defaultScale: 0.60 },
];

export const SCENE_BG_PRESETS: {
  id: SceneBgPresetId;
  label: string;
  subtitle: string;
  swatch: string;
}[] = [
  {
    id: 'squire_castle_yard',
    label: 'Castle Training Courtyard',
    subtitle: 'Coded BG: Medieval stone ramparts, pennant banners & sparring dummy',
    swatch: 'linear-gradient(135deg, #ebd8c1 0%, #a3998f 55%, #c6beb2 100%)',
  },
  {
    id: 'meadow_day',
    label: 'Sunlit Storybook Meadow',
    subtitle: 'Coded BG: Rolling hills, wildflowers, oak stump & sunbeams',
    swatch: 'linear-gradient(135deg, #a9d9ec 0%, #c8dd9c 55%, #8db660 100%)',
  },
  {
    id: 'meadow_sunset',
    label: 'Golden Hour Sunset Meadow',
    subtitle: 'Coded BG: Warm amber sky, golden sunbeams & fireflies',
    swatch: 'linear-gradient(135deg, #ff9e80 0%, #ffd180 55%, #9ccc65 100%)',
  },
  {
    id: 'shoujo_rose_dream',
    label: '90s Shoujo Rose Dreamscape',
    subtitle: 'Coded BG: Soft pastel rose bokeh, sparkles & lace frame',
    swatch: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e1bee7 100%)',
  },
  {
    id: 'starlight_garden',
    label: 'Starlight Midnight Garden',
    subtitle: 'Coded BG: Crescent moon, twinkling stars & glowing hills',
    swatch: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
  },
  {
    id: 'victorian_conservatory',
    label: 'Sunlit Glass Conservatory',
    subtitle: 'Coded BG: Warmcream parlor light beams & floating dust motes',
    swatch: 'linear-gradient(135deg, #fdfbf7 0%, #f3e8d6 55%, #dec8b0 100%)',
  },
  {
    id: 'rainy_twilight',
    label: 'Rainy Cobblestone Twilight',
    subtitle: 'Coded BG: Slate blue rain atmosphere & puddle ripples',
    swatch: 'linear-gradient(135deg, #334155 0%, #475569 55%, #1e293b 100%)',
  },
  {
    id: 'watercolor_paper',
    label: 'Warm Storybook Paper',
    subtitle: 'Clean cold-press cream illustration paper',
    swatch: 'linear-gradient(135deg, #fbf8ee 0%, #f4ebd9 100%)',
  },
  {
    id: 'transparent',
    label: 'Transparent Alpha Stage',
    subtitle: 'Export multi-character scenes with transparent PNG background',
    swatch: 'repeating-conic-gradient(#d6d3cd 0% 25%, #ffffff 0% 50%) 50% / 12px 12px',
  },
];

const DEFAULT_CUSTOM_CODED_BGS: CustomCodedBgItem[] = [
  {
    id: 'cozy_campfire_dusk',
    label: 'Cozy Autumn Campfire Dusk (Code BG)',
    subtitle: 'Warm twilight sky, autumn hills, glowing campfire & embers',
    code: `// Available variables: ctx, width, height, t (seconds)
const sky = ctx.createLinearGradient(0, 0, 0, height * 0.75);
sky.addColorStop(0, '#2B2D42');
sky.addColorStop(0.5, '#6C464E');
sky.addColorStop(1, '#E07A5F');
ctx.fillStyle = sky;
ctx.fillRect(0, 0, width, height);

// Distant Autumn Hills
ctx.fillStyle = '#4A3540';
ctx.beginPath();
ctx.moveTo(0, height * 0.68);
ctx.quadraticCurveTo(width * 0.3, height * 0.52, width * 0.65, height * 0.66);
ctx.quadraticCurveTo(width * 0.85, height * 0.72, width, height * 0.60);
ctx.lineTo(width, height);
ctx.lineTo(0, height);
ctx.closePath();
ctx.fill();

// Warm Mossy Camp Clearing
const gnd = ctx.createLinearGradient(0, height * 0.68, 0, height);
gnd.addColorStop(0, '#5F6F52');
gnd.addColorStop(1, '#3E4A35');
ctx.fillStyle = gnd;
ctx.beginPath();
ctx.moveTo(0, height * 0.72);
ctx.quadraticCurveTo(width * 0.5, height * 0.66, width, height * 0.74);
ctx.lineTo(width, height);
ctx.lineTo(0, height);
ctx.closePath();
ctx.fill();

// Glowing Campfire on Right
const fx = width * 0.75;
const fy = height * 0.82;
const pulse = 1 + Math.sin(t * 6) * 0.08;
const glow = ctx.createRadialGradient(fx, fy - 20, 5, fx, fy - 20, 220 * pulse);
glow.addColorStop(0, 'rgba(255, 200, 90, 0.55)');
glow.addColorStop(0.5, 'rgba(240, 110, 50, 0.22)');
glow.addColorStop(1, 'rgba(240, 110, 50, 0)');
ctx.fillStyle = glow;
ctx.beginPath();
ctx.arc(fx, fy - 20, 220 * pulse, 0, Math.PI * 2);
ctx.fill();

// Logs
ctx.fillStyle = '#5C3A21';
ctx.strokeStyle = '#2B1810';
ctx.lineWidth = 3;
ctx.fillRect(fx - 45, fy - 8, 90, 16);
ctx.strokeRect(fx - 45, fy - 8, 90, 16);

// Animated Flame
ctx.fillStyle = '#FFB703';
ctx.beginPath();
ctx.moveTo(fx - 26, fy - 6);
ctx.quadraticCurveTo(fx - 10, fy - 75 * pulse, fx + Math.sin(t * 8) * 6, fy - 88 * pulse);
ctx.quadraticCurveTo(fx + 14, fy - 70 * pulse, fx + 26, fy - 6);
ctx.closePath();
ctx.fill();`,
  },
  {
    id: 'pastel_cloud_bridge',
    label: 'Storybook Lakeside Wooden Pier (Code BG)',
    subtitle: 'Calm mirror lake, reeds, wooden jetty & drifting clouds',
    code: `// Available variables: ctx, width, height, t (seconds)
const sky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
sky.addColorStop(0, '#A8DADC');
sky.addColorStop(1, '#F1FAEE');
ctx.fillStyle = sky;
ctx.fillRect(0, 0, width, height);

// Mirror Lake Water
const lake = ctx.createLinearGradient(0, height * 0.58, 0, height);
lake.addColorStop(0, '#76B5C5');
lake.addColorStop(0.6, '#528AAE');
lake.addColorStop(1, '#2E5984');
ctx.fillStyle = lake;
ctx.fillRect(0, height * 0.58, width, height * 0.42);

// Shimmering Water Ripples
ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
ctx.lineWidth = 2;
for (let i = 0; i < 18; i++) {
  const rx = ((i * 210 + t * 18) % (width - 100)) + 50;
  const ry = height * (0.64 + (i % 6) * 0.05);
  ctx.beginPath();
  ctx.moveTo(rx - 30, ry);
  ctx.lineTo(rx + 30, ry);
  ctx.stroke();
}

// Grassy Bank & Wooden Pier where characters stand
ctx.fillStyle = '#8AB17D';
ctx.beginPath();
ctx.moveTo(0, height * 0.72);
ctx.quadraticCurveTo(width * 0.35, height * 0.68, width * 0.55, height);
ctx.lineTo(0, height);
ctx.closePath();
ctx.fill();

// Wooden Deck Planks across Foreground
ctx.fillStyle = '#B08968';
ctx.strokeStyle = '#432818';
ctx.lineWidth = 3;
ctx.fillRect(width * 0.15, height * 0.78, width * 0.7, 26);
ctx.strokeRect(width * 0.15, height * 0.78, width * 0.7, 26);`,
  },
];

function computeAnimatedShoujoRig(
  t: number,
  mode: SceneActorAnimMode,
  blinkMode: SceneActorInstance['blinkMode'],
  renderHair = true
): ShoujoRigState {
  const rig: ShoujoRigState = {
    ...DEFAULT_SHOUJO_RIG,
    mode: mode === 'static' ? 'static' : '24layer',
    transparentBg: true,
    renderHair,
  };

  if (mode === 'static') {
    if (blinkMode === 'open') rig.blink = 0;
    if (blinkMode === 'half') rig.blink = 0.55;
    if (blinkMode === 'closed') rig.blink = 1.0;
    return rig;
  }

  const speed = mode === 'breeze' ? 1.0 : mode === 'walk' ? 1.8 : 0.65;
  const phase = t * speed;

  const blinkCycle = (t * 0.28) % 1;
  let autoBlink = 0;
  if (blinkCycle > 0.92) {
    const u = (blinkCycle - 0.92) / 0.08;
    autoBlink = Math.sin(u * Math.PI);
  }

  rig.blink =
    blinkMode === 'open'
      ? 0
      : blinkMode === 'half'
      ? 0.55
      : blinkMode === 'closed'
      ? 1.0
      : autoBlink;

  rig.headRot =
    mode === 'nod'
      ? Math.sin(phase * 2.2) * 2.2
      : Math.sin(phase * 1.1) * 1.8 + Math.cos(phase * 0.6) * 0.8;
  rig.headDX = Math.sin(phase * 0.9) * 5.0;
  rig.headDY =
    mode === 'nod'
      ? Math.sin(phase * 2.6) * 8.5
      : mode === 'walk'
      ? Math.abs(Math.sin(phase * 3.2)) * -10
      : Math.sin(phase * 1.8) * 4.2;

  rig.gazeDX =
    mode === 'glance' || mode === 'look_around'
      ? Math.sin(phase * 1.6) * 10.5
      : Math.sin(phase * 0.75) * 5.5;
  rig.gazeDY = Math.cos(phase * 0.95) * 3.0;
  rig.browLift = Math.sin(phase * 1.1) * 2.5;
  rig.lipPart = 0.2 + 0.25 * Math.sin(phase * 1.4);

  const windBoost = mode === 'breeze' ? 1.25 : 0.7;
  rig.bangLRot = Math.sin(phase * 1.8 - 0.3) * 3.4 * windBoost;
  rig.bangRRot = Math.sin(phase * 1.8 - 0.55) * 3.2 * windBoost;
  rig.cheekLockRot = Math.sin(phase * 1.5 - 0.8) * 3.8 * windBoost;
  rig.shoulderCurlRot = Math.sin(phase * 1.3 - 1.1) * 4.2 * windBoost;
  rig.backHairLRot = Math.sin(phase * 1.1 - 1.4) * 3.6 * windBoost;
  rig.backHairRRot = Math.sin(phase * 1.1 - 1.8) * 3.4 * windBoost;

  rig.bowFlutter = Math.sin(phase * 2.4 - 0.5) * 4.5 * windBoost;
  rig.roseSpin = Math.sin(phase * 1.8) * 3.8;
  rig.torsoBreath = Math.sin(phase * 1.8);
  rig.showSparkles = true;

  return rig;
}

interface SceneComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCharacter?: SceneCharacterType;
}

export const SceneComposerModal: React.FC<SceneComposerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenSquareRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenBjdRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenMeadowRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [actors, setActors] = useState<SceneActorInstance[]>([
    {
      id: 'actor-shoujo-main',
      charType: 'shoujo_girl',
      label: '90s Shoujo Girl',
      x: 0.48,
      y: 0.56,
      scale: 0.82,
      rotationDeg: 0,
      flipX: false,
      opacity: 1,
      groundShadow: true,
      shadowOffsetY: 0,
      renderHair: true,
      animMode: 'breeze',
      autoWalkAcross: false,
      animSpeed: 1.0,
      phaseOffset: 0,
      blinkMode: 'auto',
    },
    {
      id: 'actor-puppy-companion',
      charType: 'teacup_puppy',
      label: 'Teacup Puppy',
      x: 0.74,
      y: 0.66,
      scale: 0.46,
      rotationDeg: 0,
      flipX: true,
      opacity: 1,
      groundShadow: false,
      shadowOffsetY: 0,
      renderHair: true,
      animMode: 'breeze',
      animSpeed: 1.0,
      phaseOffset: 1.1,
      blinkMode: 'auto',
    },
  ]);

  const [selectedActorId, setSelectedActorId] = useState<string | null>('actor-shoujo-main');
  const [bgPreset, setBgPreset] = useState<SceneBgPresetId>('meadow_day');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const customBgImgRef = useRef<HTMLImageElement | null>(null);

  // Custom Coded Backgrounds State (saved in localStorage)
  const [customCodedBgs, setCustomCodedBgs] = useState<CustomCodedBgItem[]>(() => {
    try {
      const saved = localStorage.getItem('studio_custom_coded_bgs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_CUSTOM_CODED_BGS;
  });

  const [isCodeBgBuilderOpen, setIsCodeBgBuilderOpen] = useState<boolean>(false);
  const [newBgTitle, setNewBgTitle] = useState<string>('My Custom Coded Background');
  const [newBgSubtitle, setNewBgSubtitle] = useState<string>('Custom procedural HTML5 Canvas background');
  const [newBgCode, setNewBgCode] = useState<string>(DEFAULT_CUSTOM_CODED_BGS[0].code);
  const [codeBgError, setCodeBgError] = useState<string | null>(null);

  const [fgAtmosphere, setFgAtmosphere] = useState<
    'shoujo_sparkles' | 'cherry_petals' | 'golden_motes' | 'soft_rain' | 'none'
  >('golden_motes');
  const [vignetteIntensity, setVignetteIntensity] = useState<number>(0.16);
  const [sceneAspect, setSceneAspect] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showSelectionGizmo, setShowSelectionGizmo] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inspectorSection, setInspectorSection] = useState<'actors' | 'background' | 'templates'>('actors');

  // Dragging state on canvas
  const dragStateRef = useRef<{
    actorId: string | null;
    startMouseX: number;
    startMouseY: number;
    startActorX: number;
    startActorY: number;
  }>({
    actorId: null,
    startMouseX: 0,
    startMouseY: 0,
    startActorX: 0,
    startActorY: 0,
  });

  // Video recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);

  const selectedActor = actors.find((a) => a.id === selectedActorId) || null;

  const sceneDimensions =
    sceneAspect === '16:9'
      ? { width: 1600, height: 900 }
      : sceneAspect === '4:3'
      ? { width: 1440, height: 1080 }
      : { width: 1200, height: 1200 };
  const sceneW = sceneDimensions.width;
  const sceneH = sceneDimensions.height;

  // Save custom coded backgrounds to localStorage
  const saveCustomCodedBgs = (list: CustomCodedBgItem[]) => {
    setCustomCodedBgs(list);
    try {
      localStorage.setItem('studio_custom_coded_bgs_v1', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleSaveNewCodedBg = () => {
    try {
      // Validate syntax before saving
      // eslint-disable-next-line no-new-func
      new Function('ctx', 'width', 'height', 't', newBgCode);
      setCodeBgError(null);
      const id = 'bg_' + Date.now().toString(36);
      const item: CustomCodedBgItem = {
        id,
        label: newBgTitle.trim() || 'Custom Coded Scene BG',
        subtitle: newBgSubtitle.trim() || 'Procedural Canvas 2D Code Background',
        code: newBgCode,
      };
      const updated = [item, ...customCodedBgs];
      saveCustomCodedBgs(updated);
      setBgPreset(`custom_code:${id}`);
      setIsCodeBgBuilderOpen(false);
    } catch (err) {
      setCodeBgError(err instanceof Error ? err.message : 'Syntax error in Canvas code');
    }
  };

  const handleDeleteCustomCodedBg = (id: string) => {
    const updated = customCodedBgs.filter((b) => b.id !== id);
    saveCustomCodedBgs(updated);
    if (bgPreset === `custom_code:${id}`) {
      setBgPreset('meadow_day');
    }
  };

  // Handle custom background image upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      customBgImgRef.current = img;
      setCustomBgUrl(url);
      setBgPreset('custom_upload');
    };
    img.src = url;
  };

  // Add a new character instance to the scene
  const handleAddCharacter = (charType: SceneCharacterType) => {
    const meta = SCENE_CHARACTER_CATALOG.find((c) => c.charType === charType);
    const count = actors.length;
    const spreadX = 0.25 + ((count * 0.19) % 0.54);
    const newId = `actor-${charType}-${Date.now()}-${Math.floor(Math.random() * 999)}`;
    const isSquire = charType === 'chibi_squire';
    const hasBuiltInShadow =
      charType === 'teacup_puppy' ||
      charType === 'strawberry_mouse' ||
      charType === 'acorn_lamb' ||
      charType === 'watering_bunny' ||
      charType === 'postman_duckling' ||
      charType === 'lantern_kitten' ||
      charType === 'victorian_bunny' ||
      charType === 'raincoat_cat';

    const newActor: SceneActorInstance = {
      id: newId,
      charType,
      label: meta ? meta.label : charType,
      x: spreadX,
      y: isSquire ? 0.58 : charType.includes('girl') || charType === 'porcelain_bjd' ? 0.58 : 0.66,
      scale: meta ? meta.defaultScale : 0.65,
      rotationDeg: 0,
      flipX: false,
      opacity: 1,
      groundShadow: !hasBuiltInShadow,
      shadowOffsetY: 0,
      renderHair: true,
      animMode: isSquire ? 'idle' : 'breeze',
      viewAngle: 'front',
      expression: 'determined',
      autoWalkAcross: false,
      animSpeed: 1.0,
      phaseOffset: Number(((count * 0.85) % 4).toFixed(2)),
      blinkMode: 'auto',
      bjdOutfit: 'pink_babydoll',
    };
    setActors((prev) => [...prev, newActor]);
    setSelectedActorId(newId);
    setInspectorSection('actors');
  };

  // Update a specific actor's properties
  const updateActor = useCallback((id: string, patch: Partial<SceneActorInstance>) => {
    setActors((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  // Duplicate selected actor
  const handleDuplicateActor = (actor: SceneActorInstance) => {
    const newId = `actor-copy-${Date.now()}`;
    const copy: SceneActorInstance = {
      ...actor,
      id: newId,
      label: `${actor.label} (Copy)`,
      x: Math.min(0.9, actor.x + 0.08),
      phaseOffset: Number(((actor.phaseOffset + 1.1) % 5).toFixed(2)),
    };
    setActors((prev) => [...prev, copy]);
    setSelectedActorId(newId);
  };

  // Delete actor
  const handleDeleteActor = (id: string) => {
    setActors((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedActorId === id) {
        setSelectedActorId(next.length > 0 ? next[next.length - 1].id : null);
      }
      return next;
    });
  };

  // Layer ordering (Bring Forward / Send Backward)
  const handleMoveLayer = (id: string, dir: -1 | 1) => {
    setActors((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx === -1) return prev;
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy;
    });
  };

  // Load Quick Multi-Character Scene Templates
  const applySceneTemplate = (
    templateId:
      | 'shoujo_trio'
      | 'meadow_picnic'
      | 'woodland_gathering'
  ) => {
    if (templateId === 'shoujo_trio') {
      setBgPreset('shoujo_rose_dream');
      setFgAtmosphere('shoujo_sparkles');
      const next: SceneActorInstance[] = [
        {
          id: 'tpl-auburn',
          charType: 'auburn_girl',
          label: 'Auburn Girl',
          x: 0.25,
          y: 0.58,
          scale: 0.74,
          rotationDeg: -2,
          flipX: false,
          opacity: 1,
          groundShadow: true,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 0.95,
          phaseOffset: 0.8,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-blackbob',
          charType: 'black_bob_girl',
          label: 'Black Bob Girl',
          x: 0.75,
          y: 0.58,
          scale: 0.74,
          rotationDeg: 2,
          flipX: true,
          opacity: 1,
          groundShadow: true,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'glance',
          animSpeed: 0.9,
          phaseOffset: 1.7,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-shoujo',
          charType: 'shoujo_girl',
          label: '90s Shoujo Girl',
          x: 0.5,
          y: 0.56,
          scale: 0.84,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: true,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.0,
          phaseOffset: 0,
          blinkMode: 'auto',
        },
      ];
      setActors(next);
      setSelectedActorId('tpl-shoujo');
    } else if (templateId === 'meadow_picnic') {
      setBgPreset('meadow_day');
      setFgAtmosphere('cherry_petals');
      const next: SceneActorInstance[] = [
        {
          id: 'tpl-picnic-shoujo',
          charType: 'shoujo_girl',
          label: '90s Shoujo Girl',
          x: 0.48,
          y: 0.55,
          scale: 0.8,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: true,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.0,
          phaseOffset: 0,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-picnic-lamb',
          charType: 'acorn_lamb',
          label: 'Acorn Lamb',
          x: 0.23,
          y: 0.67,
          scale: 0.54,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.1,
          phaseOffset: 0.6,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-picnic-bunny',
          charType: 'watering_bunny',
          label: 'Watering Can Bunny',
          x: 0.77,
          y: 0.66,
          scale: 0.56,
          rotationDeg: 0,
          flipX: true,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.0,
          phaseOffset: 1.5,
          blinkMode: 'auto',
        },
      ];
      setActors(next);
      setSelectedActorId('tpl-picnic-shoujo');
    } else if (templateId === 'woodland_gathering') {
      setBgPreset('meadow_sunset');
      setFgAtmosphere('golden_motes');
      const next: SceneActorInstance[] = [
        {
          id: 'tpl-wood-mouse',
          charType: 'strawberry_mouse',
          label: 'Strawberry Mouse',
          x: 0.2,
          y: 0.68,
          scale: 0.5,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.1,
          phaseOffset: 0,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-wood-duck',
          charType: 'postman_duckling',
          label: 'Postman Duckling',
          x: 0.4,
          y: 0.65,
          scale: 0.54,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.0,
          phaseOffset: 0.9,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-wood-puppy',
          charType: 'teacup_puppy',
          label: 'Teacup Puppy',
          x: 0.61,
          y: 0.66,
          scale: 0.55,
          rotationDeg: 0,
          flipX: false,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 1.0,
          phaseOffset: 1.8,
          blinkMode: 'auto',
        },
        {
          id: 'tpl-wood-kitten',
          charType: 'lantern_kitten',
          label: 'Lantern Kitten',
          x: 0.81,
          y: 0.64,
          scale: 0.54,
          rotationDeg: 0,
          flipX: true,
          opacity: 1,
          groundShadow: false,
          shadowOffsetY: 0,
          renderHair: true,
          animMode: 'breeze',
          animSpeed: 0.95,
          phaseOffset: 2.5,
          blinkMode: 'auto',
        },
      ];
      setActors(next);
      setSelectedActorId('tpl-wood-puppy');
    }
  };

  // Pointer interaction on Scene Canvas (Click to Select + Drag to Position)
  const getCanvasNormalizedCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = sceneCanvasRef.current;
    if (!canvas) return { nx: 0.5, ny: 0.5 };
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    return { nx, ny };
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { nx, ny } = getCanvasNormalizedCoords(e);
    for (let i = actors.length - 1; i >= 0; i--) {
      const act = actors[i];
      const hitRadiusX = 0.16 * act.scale;
      const hitRadiusY = 0.28 * act.scale;
      if (Math.abs(nx - act.x) <= hitRadiusX && Math.abs(ny - act.y) <= hitRadiusY) {
        setSelectedActorId(act.id);
        dragStateRef.current = {
          actorId: act.id,
          startMouseX: nx,
          startMouseY: ny,
          startActorX: act.x,
          startActorY: act.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragStateRef.current;
    if (!drag.actorId) return;
    const { nx, ny } = getCanvasNormalizedCoords(e);
    const dx = nx - drag.startMouseX;
    const dy = ny - drag.startMouseY;
    updateActor(drag.actorId, {
      x: Math.max(0.05, Math.min(0.95, Number((drag.startActorX + dx).toFixed(3)))),
      y: Math.max(0.08, Math.min(0.95, Number((drag.startActorY + dy).toFixed(3)))),
    });
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.actorId) {
      dragStateRef.current.actorId = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!selectedActor) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.04 : -0.04;
    const nextScale = Math.max(0.2, Math.min(1.65, Number((selectedActor.scale + delta).toFixed(2))));
    updateActor(selectedActor.id, { scale: nextScale });
  };

  // Export PNG Snapshot
  const handleExportScenePNG = () => {
    const canvas = sceneCanvasRef.current;
    if (!canvas) return;
    const prevGizmo = showSelectionGizmo;
    setShowSelectionGizmo(false);
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `storybook-scene-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowSelectionGizmo(prevGizmo);
    }, 60);
  };

  // Record 5-Second WebM Scene Video
  const handleRecordSceneVideo = () => {
    const canvas = sceneCanvasRef.current;
    if (!canvas || isRecording) return;
    setShowSelectionGizmo(false);
    setIsPlaying(true);
    setIsRecording(true);
    setRecordSeconds(0);

    const stream = canvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 12_000_000,
    });

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storybook-scene-${Date.now()}.webm`;
      a.click();
      setIsRecording(false);
      setShowSelectionGizmo(true);
    };

    recorder.start(100);
    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      setRecordSeconds(Math.min(5.0, elapsed));
      if (elapsed >= 5.0) {
        clearInterval(timer);
        if (recorder.state === 'recording') recorder.stop();
      }
    }, 100);
  };

  // Main 60fps Scene Render Loop using Offscreen Canvas Isolation
  useEffect(() => {
    if (!isOpen) return;
    let rafId = 0;
    const startTime = performance.now();

    if (!offscreenSquareRef.current) {
      const c = document.createElement('canvas');
      c.width = 1000;
      c.height = 1000;
      offscreenSquareRef.current = c;
    }
    if (!offscreenBjdRef.current) {
      const c = document.createElement('canvas');
      c.width = 1000;
      c.height = 1500;
      offscreenBjdRef.current = c;
    }
    if (!offscreenMeadowRef.current) {
      const c = document.createElement('canvas');
      c.width = 1600;
      c.height = 900;
      offscreenMeadowRef.current = c;
    }

    const renderLoop = (now: number) => {
      const t = isPlaying ? (now - startTime) / 1000 : 0;
      const canvas = sceneCanvasRef.current;
      const offSquare = offscreenSquareRef.current;
      const offBjd = offscreenBjdRef.current;
      const offMeadow = offscreenMeadowRef.current;

      if (canvas && offSquare && offBjd && offMeadow) {
        const ctx = canvas.getContext('2d');
        const offSquareCtx = offSquare.getContext('2d');
        const offBjdCtx = offBjd.getContext('2d');
        const offMeadowCtx = offMeadow.getContext('2d');

        if (ctx && offSquareCtx && offBjdCtx && offMeadowCtx) {
          ctx.clearRect(0, 0, sceneW, sceneH);

          // ------------------------------------------------------------------
          // 1. RENDER SCENE BACKGROUND LAYER
          // ------------------------------------------------------------------
          if (bgPreset.startsWith('custom_code:')) {
            const customId = bgPreset.replace('custom_code:', '');
            const found = customCodedBgs.find((b) => b.id === customId);
            if (found) {
              ctx.save();
              try {
                // eslint-disable-next-line no-new-func
                const fn = new Function('ctx', 'width', 'height', 't', found.code);
                fn(ctx, sceneW, sceneH, t);
              } catch {
                ctx.fillStyle = '#F7F1E1';
                ctx.fillRect(0, 0, sceneW, sceneH);
              }
              ctx.restore();
            }
          } else if (bgPreset === 'squire_castle_yard') {
            drawSquireCastleYardBG(ctx, t, sceneW, sceneH);
          } else if (bgPreset === 'meadow_day' || bgPreset === 'meadow_sunset') {
            offMeadowCtx.save();
            offMeadowCtx.clearRect(0, 0, 1600, 900);
            const bgRig = computeCompilerRigAtTime(t, 'breeze');
            drawExtractedCompilerCharacter('meadow_bg', offMeadowCtx, bgRig, t, {
              transparentBg: false,
            });
            offMeadowCtx.restore();

            ctx.drawImage(offMeadow, 0, 0, sceneW, sceneH);

            if (bgPreset === 'meadow_sunset') {
              ctx.save();
              ctx.fillStyle = 'rgba(255, 138, 72, 0.24)';
              ctx.fillRect(0, 0, sceneW, sceneH);
              const sunG = ctx.createRadialGradient(
                sceneW * 0.22,
                sceneH * 0.2,
                20,
                sceneW * 0.22,
                sceneH * 0.2,
                sceneW * 0.65
              );
              sunG.addColorStop(0, 'rgba(255, 226, 148, 0.42)');
              sunG.addColorStop(0.5, 'rgba(255, 142, 88, 0.16)');
              sunG.addColorStop(1, 'rgba(90, 35, 65, 0.22)');
              ctx.fillStyle = sunG;
              ctx.fillRect(0, 0, sceneW, sceneH);
              ctx.restore();
            }
          } else if (bgPreset === 'shoujo_rose_dream') {
            const g = ctx.createLinearGradient(0, 0, sceneW * 0.4, sceneH);
            g.addColorStop(0, '#FFF6F8');
            g.addColorStop(0.45, '#FCE2EC');
            g.addColorStop(0.82, '#F5C6DA');
            g.addColorStop(1, '#E8B2CC');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, sceneW, sceneH);

            for (let i = 0; i < 24; i++) {
              const bx = ((i * 293 + 110) % 970) * (sceneW / 1000) + Math.sin(t * 0.5 + i) * 14;
              const by = ((i * 419 + 80) % 880) * (sceneH / 1000) + Math.cos(t * 0.4 + i) * 12;
              const br = (22 + (i % 5) * 18) * (sceneH / 900);
              const bg = ctx.createRadialGradient(bx, by, 2, bx, by, br);
              bg.addColorStop(0, 'rgba(255,255,255,0.68)');
              bg.addColorStop(0.65, 'rgba(255,240,246,0.28)');
              bg.addColorStop(1, 'rgba(255,220,235,0)');
              ctx.fillStyle = bg;
              ctx.beginPath();
              ctx.arc(bx, by, br, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(24, 24, sceneW - 48, sceneH - 48);
            ctx.strokeStyle = 'rgba(218, 132, 162, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(32, 32, sceneW - 64, sceneH - 64);
            ctx.restore();
          } else if (bgPreset === 'starlight_garden') {
            const g = ctx.createLinearGradient(0, 0, 0, sceneH);
            g.addColorStop(0, '#0B1026');
            g.addColorStop(0.52, '#182048');
            g.addColorStop(0.82, '#283166');
            g.addColorStop(1, '#1A2B2E');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, sceneW, sceneH);

            const mx = sceneW * 0.82;
            const my = sceneH * 0.20;
            const moonGlow = ctx.createRadialGradient(mx, my, 10, mx, my, 180);
            moonGlow.addColorStop(0, 'rgba(255, 250, 210, 0.55)');
            moonGlow.addColorStop(1, 'rgba(255, 250, 210, 0)');
            ctx.fillStyle = moonGlow;
            ctx.beginPath();
            ctx.arc(mx, my, 180, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFF9D6';
            ctx.beginPath();
            ctx.arc(mx, my, 46, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#121838';
            ctx.beginPath();
            ctx.arc(mx - 16, my - 10, 40, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 65; i++) {
              const sx = ((i * 317 + 43) % 990) * (sceneW / 1000);
              const sy = ((i * 523 + 29) % 680) * (sceneH / 1000);
              const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.0 + i * 1.3));
              ctx.fillStyle = `rgba(255, 250, 230, ${tw.toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(sx, sy, i % 3 === 0 ? 2.4 : 1.4, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = '#13222B';
            ctx.beginPath();
            ctx.moveTo(0, sceneH * 0.78);
            ctx.quadraticCurveTo(sceneW * 0.35, sceneH * 0.68, sceneW * 0.7, sceneH * 0.77);
            ctx.quadraticCurveTo(sceneW * 0.88, sceneH * 0.81, sceneW, sceneH * 0.74);
            ctx.lineTo(sceneW, sceneH);
            ctx.lineTo(0, sceneH);
            ctx.closePath();
            ctx.fill();
          } else if (bgPreset === 'victorian_conservatory') {
            const g = ctx.createLinearGradient(0, 0, 0, sceneH);
            g.addColorStop(0, '#FDF9F2');
            g.addColorStop(0.6, '#F4E9DA');
            g.addColorStop(1, '#E5D3BE');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, sceneW, sceneH);

            ctx.save();
            ctx.fillStyle = 'rgba(255, 252, 240, 0.38)';
            for (let b = 0; b < 3; b++) {
              ctx.beginPath();
              const bx = sceneW * (0.15 + b * 0.25);
              ctx.moveTo(bx, 0);
              ctx.lineTo(bx + sceneW * 0.12, 0);
              ctx.lineTo(bx + sceneW * 0.34, sceneH);
              ctx.lineTo(bx + sceneW * 0.18, sceneH);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          } else if (bgPreset === 'rainy_twilight') {
            const g = ctx.createLinearGradient(0, 0, 0, sceneH);
            g.addColorStop(0, '#2C3847');
            g.addColorStop(0.65, '#465669');
            g.addColorStop(1, '#364352');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, sceneW, sceneH);
            ctx.save();
            ctx.scale(sceneW / 1000, sceneH / 1000);
            drawRainEnvironment(ctx, t, true, true, 0);
            ctx.restore();
          } else if (bgPreset === 'watercolor_paper') {
            ctx.fillStyle = '#F7F1E1';
            ctx.fillRect(0, 0, sceneW, sceneH);
          } else if (bgPreset === 'custom_upload' && customBgImgRef.current) {
            const img = customBgImgRef.current;
            const scale = Math.max(sceneW / img.width, sceneH / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            ctx.drawImage(img, (sceneW - dw) / 2, (sceneH - dh) / 2, dw, dh);
          }

          // ------------------------------------------------------------------
          // 2. RENDER EACH CHARACTER INSTANCE IN LAYER ORDER VIA OFFSCREEN BUFFER
          // ------------------------------------------------------------------
          for (const actor of actors) {
            const actorTime = t * actor.animSpeed + actor.phaseOffset;
            const charBoxPx = sceneH * 0.82 * actor.scale;

            // Optional horizontal walk across scene when in walk mode
            let effectiveX = actor.x;
            if (actor.animMode === 'walk' && actor.autoWalkAcross && isPlaying) {
              const dir =
                (actor.viewAngle === 'side_left' ? -1 : 1) * (actor.flipX ? -1 : 1);
              effectiveX =
                ((actor.x + dir * t * 0.065 * actor.animSpeed) % 1.0 + 1.0) % 1.0;
            }

            // Procedural root motion for non-squire characters when given walk/jump/sit
            let extraBobY = 0;
            let extraRotDeg = 0;
            if (actor.charType !== 'chibi_squire') {
              if (actor.animMode === 'walk') {
                extraBobY = -Math.abs(Math.sin(actorTime * 5.2)) * (charBoxPx * 0.025);
                extraRotDeg = Math.sin(actorTime * 5.2) * 2.2;
              } else if (actor.animMode === 'jump') {
                extraBobY = -Math.max(0, Math.sin(actorTime * 4.2)) * (charBoxPx * 0.065);
              } else if (actor.animMode === 'sit') {
                extraBobY = charBoxPx * 0.035;
              }
            }

            const cx = effectiveX * sceneW;
            const cy = actor.y * sceneH + extraBobY;

            // Calibrated Ground Contact Shadow (Hugs exact anatomical base of each character!)
            if (actor.groundShadow) {
              ctx.save();
              const baseContactRatio =
                actor.charType === 'chibi_squire' &&
                actor.animMode === 'sit'
                  ? 0.305
                  : ACTOR_FOOT_CONTACT_Y[actor.charType] ?? 0.28;
              const customOffset = actor.shadowOffsetY ?? 0;
              const shY = cy + charBoxPx * (baseContactRatio + customOffset);

              // Shrink shadow slightly when character jumps up
              const jumpShrink =
                actor.animMode === 'jump'
                  ? 1 - Math.max(0, Math.sin(actorTime * 4.0)) * 0.25
                  : 1;
              const shRx =
                charBoxPx *
                (actor.charType === 'chibi_squire'
                  ? 0.145
                  : 0.21) *
                jumpShrink;
              const shRy = charBoxPx * 0.024 * jumpShrink;

              const sg = ctx.createRadialGradient(cx, shY, 2, cx, shY, shRx);
              sg.addColorStop(0, 'rgba(42, 28, 24, 0.28)');
              sg.addColorStop(0.65, 'rgba(42, 28, 24, 0.12)');
              sg.addColorStop(1, 'rgba(42, 28, 24, 0)');
              ctx.fillStyle = sg;
              ctx.beginPath();
              ctx.ellipse(cx, shY, shRx, shRy, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            // Map general SceneActorAnimMode to CompilerAnimPreset for legacy characters
            const legacyCompilerPreset: CompilerAnimPreset =
              actor.animMode === 'static'
                ? 'static'
                : actor.animMode === 'idle' || actor.animMode === 'sit'
                ? 'idle'
                : actor.animMode === 'glance' || actor.animMode === 'look_around'
                ? 'glance'
                : actor.animMode === 'nod'
                ? 'nod'
                : 'breeze';

            // Render character onto its isolated offscreen buffer first
            if (actor.charType === 'porcelain_bjd') {
              offBjdCtx.save();
              offBjdCtx.clearRect(0, 0, 1000, 1500);
              const cRig = computeCompilerRigAtTime(
                actorTime,
                legacyCompilerPreset,
                DEFAULT_COMPILER_RIG
              );
              if (actor.blinkMode === 'open') cRig.blink = 0;
              if (actor.blinkMode === 'half') cRig.blink = 0.55;
              if (actor.blinkMode === 'closed') cRig.blink = 1.0;

              drawExtractedCompilerCharacter('porcelain_bjd', offBjdCtx, cRig, actorTime, {
                transparentBg: true,
                bjdOutfit: actor.bjdOutfit || 'pink_babydoll',
                renderHair: actor.renderHair !== false,
              });
              offBjdCtx.restore();

              const bjdH = charBoxPx * 1.12;
              const bjdW = bjdH * (1000 / 1500);
              ctx.save();
              ctx.globalAlpha = actor.opacity;
              ctx.translate(cx, cy);
              ctx.rotate(((actor.rotationDeg + extraRotDeg) * Math.PI) / 180);
              ctx.scale(actor.flipX ? -1 : 1, 1);
              ctx.drawImage(offBjd, -bjdW * 0.5, -bjdH * 0.5, bjdW, bjdH);
              ctx.restore();
            } else {
              offSquareCtx.save();
              offSquareCtx.clearRect(0, 0, 1000, 1000);

              if (actor.charType === 'chibi_squire') {
                const sqAction: SquireAction =
                  actor.animMode === 'walk' ||
                  actor.animMode === 'sit' ||
                  actor.animMode === 'wave' ||
                  actor.animMode === 'jump' ||
                  actor.animMode === 'look_around' ||
                  actor.animMode === 'breeze' ||
                  actor.animMode === 'static'
                    ? actor.animMode
                    : actor.animMode === 'glance'
                    ? 'look_around'
                    : 'idle';

                const sqRig = computeChibiSquireRigAtTime(actorTime, sqAction, {
                  ...DEFAULT_CHIBI_SQUIRE_RIG,
                  viewAngle: (actor.viewAngle as SquireViewAngle) || 'three_quarter',
                  expression: (actor.expression as SquireExpression) || 'wonder',
                  renderHair: actor.renderHair !== false,
                  transparentBg: true,
                });
                if (actor.blinkMode === 'open') sqRig.blink = 0;
                if (actor.blinkMode === 'half') sqRig.blink = 0.55;
                if (actor.blinkMode === 'closed') sqRig.blink = 1.0;

                drawChibiSquire(offSquareCtx, sqRig, 500, 500, 1);
              } else if (actor.charType === 'shoujo_girl') {
                const sRig = computeAnimatedShoujoRig(
                  actorTime,
                  actor.animMode,
                  actor.blinkMode,
                  actor.renderHair !== false
                );
                drawShoujoGirl(offSquareCtx, sRig, 500, 500, 1);
              } else if (actor.charType === 'teacup_puppy') {
                const pRig = computePuppyRigAtTime(
                  actorTime,
                  actor.animMode === 'static' ? 'manual' : '20layer',
                  DEFAULT_PUPPY_RIG
                );
                if (actor.blinkMode === 'open') pRig.blink = 0;
                if (actor.blinkMode === 'half') pRig.blink = 0.55;
                if (actor.blinkMode === 'closed') pRig.blink = 1.0;
                drawTeacupPuppy(offSquareCtx, pRig, actorTime, {
                  transparentBg: true,
                  showSteam: true,
                });
              } else if (actor.charType === 'victorian_bunny') {
                const bRig = {
                  ...DEFAULT_BUNNY_RIG,
                  time: actorTime,
                  mode:
                    actor.animMode === 'static'
                      ? ('static' as const)
                      : ('12layer' as const),
                  eyeState:
                    actor.blinkMode === 'closed'
                      ? ('blink' as const)
                      : actor.blinkMode === 'half'
                      ? ('happy' as const)
                      : ('open' as const),
                  showConstructionGuides: false,
                };
                drawVictorianBunny(offSquareCtx, bRig, 500, 500, 1);
              } else if (actor.charType === 'raincoat_cat') {
                const cRig = {
                  ...DEFAULT_CAT_RIG,
                  mode:
                    actor.animMode === 'static'
                      ? ('static' as const)
                      : ('12layer' as const),
                };
                drawRiggedCalicoKitten(offSquareCtx, 495, 560, 1, cRig, actorTime);
              } else {
                const cRig = computeCompilerRigAtTime(
                  actorTime,
                  legacyCompilerPreset,
                  DEFAULT_COMPILER_RIG
                );
                if (actor.blinkMode === 'open') cRig.blink = 0;
                if (actor.blinkMode === 'half') cRig.blink = 0.55;
                if (actor.blinkMode === 'closed') cRig.blink = 1.0;
                drawExtractedCompilerCharacter(
                  actor.charType as ExtractedCompilerCharacterId,
                  offSquareCtx,
                  cRig,
                  actorTime,
                  {
                    transparentBg: true,
                    renderHair: actor.renderHair !== false,
                  }
                );
              }

              offSquareCtx.restore();

              // Composite 1000x1000 Character onto Scene Canvas
              ctx.save();
              ctx.globalAlpha = actor.opacity;
              ctx.translate(cx, cy);
              ctx.rotate(((actor.rotationDeg + extraRotDeg) * Math.PI) / 180);
              ctx.scale(actor.flipX ? -1 : 1, 1);
              ctx.drawImage(
                offSquare,
                -charBoxPx * 0.5,
                -charBoxPx * 0.5,
                charBoxPx,
                charBoxPx
              );
              ctx.restore();
            }

            // Selection Gizmo Box if selected
            if (showSelectionGizmo && selectedActorId === actor.id && !isRecording) {
              const boxSize = sceneH * 0.62 * actor.scale;
              ctx.save();
              ctx.strokeStyle = '#E8998D';
              ctx.lineWidth = 2;
              ctx.setLineDash([8, 6]);
              ctx.strokeRect(
                cx - boxSize * 0.42,
                cy - boxSize * 0.42,
                boxSize * 0.84,
                boxSize * 0.84
              );
              ctx.setLineDash([]);
              ctx.fillStyle = '#E8998D';
              const corners = [
                [cx - boxSize * 0.42, cy - boxSize * 0.42],
                [cx + boxSize * 0.42, cy - boxSize * 0.42],
                [cx - boxSize * 0.42, cy + boxSize * 0.42],
                [cx + boxSize * 0.42, cy + boxSize * 0.42],
              ];
              for (const [hx, hy] of corners) {
                ctx.beginPath();
                ctx.arc(hx, hy, 5, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }
          }

          // ------------------------------------------------------------------
          // 3. FOREGROUND ATMOSPHERE OVERLAY (SPARKLES / PETALS / MOTES / RAIN)
          // ------------------------------------------------------------------
          if (fgAtmosphere === 'shoujo_sparkles') {
            ctx.save();
            for (let i = 0; i < 28; i++) {
              const sx = ((i * 389 + 95) % 980) * (sceneW / 1000) + Math.sin(t * 0.8 + i) * 16;
              const sy = ((i * 571 + 60) % 920) * (sceneH / 1000) + Math.cos(t * 0.7 + i) * 14;
              const pulse = 0.25 + 0.75 * Math.abs(Math.sin(t * 2.4 + i * 0.9));
              const r = (6 + (i % 4) * 4) * pulse;
              ctx.fillStyle = `rgba(255, 252, 245, ${(0.85 * pulse).toFixed(2)})`;
              ctx.beginPath();
              ctx.moveTo(sx, sy - r * 1.8);
              ctx.quadraticCurveTo(sx, sy, sx + r * 1.8, sy);
              ctx.quadraticCurveTo(sx, sy, sx, sy + r * 1.8);
              ctx.quadraticCurveTo(sx, sy, sx - r * 1.8, sy);
              ctx.quadraticCurveTo(sx, sy, sx, sy - r * 1.8);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          } else if (fgAtmosphere === 'cherry_petals') {
            ctx.save();
            ctx.scale(sceneW / 1000, sceneH / 1000);
            drawFloatingPetals(ctx, 1000, 1000, t);
            ctx.restore();
          } else if (fgAtmosphere === 'golden_motes') {
            ctx.save();
            for (let i = 0; i < 36; i++) {
              const mx = ((i * 271 + Math.floor(t * 24)) % 1000) * (sceneW / 1000);
              const my =
                ((i * 463 + Math.sin(t * 1.2 + i) * 35 + 1000) % 1000) * (sceneH / 1000);
              const alpha = 0.3 + 0.55 * Math.abs(Math.sin(t * 1.8 + i));
              ctx.fillStyle = `rgba(255, 238, 170, ${alpha.toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(mx, my, 2.2 + (i % 3) * 1.4, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          } else if (fgAtmosphere === 'soft_rain') {
            ctx.save();
            ctx.strokeStyle = 'rgba(220, 235, 255, 0.35)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 55; i++) {
              const rx = ((i * 197 + t * 180) % 1000) * (sceneW / 1000);
              const ry = ((i * 353 + t * 680) % 1000) * (sceneH / 1000);
              ctx.beginPath();
              ctx.moveTo(rx, ry);
              ctx.lineTo(rx - 8, ry + 28);
              ctx.stroke();
            }
            ctx.restore();
          }

          // ------------------------------------------------------------------
          // 4. CINEMATIC VIGNETTE
          // ------------------------------------------------------------------
          if (vignetteIntensity > 0.01 && bgPreset !== 'transparent') {
            const vg = ctx.createRadialGradient(
              sceneW * 0.5,
              sceneH * 0.5,
              sceneH * 0.35,
              sceneW * 0.5,
              sceneH * 0.5,
              sceneW * 0.75
            );
            vg.addColorStop(0, 'rgba(28, 18, 22, 0)');
            vg.addColorStop(1, `rgba(28, 18, 22, ${vignetteIntensity.toFixed(2)})`);
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, sceneW, sceneH);
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [
    isOpen,
    actors,
    bgPreset,
    customCodedBgs,
    fgAtmosphere,
    vignetteIntensity,
    sceneW,
    sceneH,
    isPlaying,
    selectedActorId,
    showSelectionGizmo,
    isRecording,
  ]);

  if (!isOpen) return null;

  const selectedMeta = selectedActor
    ? SCENE_CHARACTER_CATALOG.find((c) => c.charType === selectedActor.charType)
    : null;
  const selectedHasHairToggle = Boolean(selectedMeta?.hasHairToggle);
  const selectedSupportsMultiView = Boolean(selectedMeta?.supportsMultiView);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <div
        className={`bg-[#151211] border border-[#342B28] text-[#F7F1EB] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${
          isFullscreen
            ? 'w-screen h-screen rounded-none'
            : 'w-full max-w-[1640px] h-[93vh]'
        }`}
      >
        {/* Top Modal Header */}
        <div className="px-5 py-3 bg-[#1D1817] border-b border-[#2E2623] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D68B7E]/20 border border-[#D68B7E]/40 flex items-center justify-center text-[#E8998D]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-[#FFF8F2]">
                  Storybook & Shoujo Multi-Character Scene Composer
                </h2>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#D68B7E]/20 text-[#F5C4D2] border border-[#D68B7E]/30">
                  Interactive Stage + Coded BG Studio
                </span>
              </div>
              <p className="text-xs text-[#A89890]">
                Click any character to choose its Animation, View Angle (Front/Side/Back), Expression & position • Add Coded or Image Backgrounds
              </p>
            </div>
          </div>

          {/* Aspect Ratio, Play/Pause, Export & Close Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#120F0E] p-1 rounded-lg border border-[#2C2421]">
              {(['16:9', '4:3', '1:1'] as const).map((asp) => (
                <button
                  key={asp}
                  onClick={() => setSceneAspect(asp)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    sceneAspect === asp
                      ? 'bg-[#D68B7E] text-[#151211] font-semibold'
                      : 'text-[#A89890] hover:text-white'
                  }`}
                >
                  {asp}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSelectionGizmo(!showSelectionGizmo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showSelectionGizmo
                  ? 'bg-[#2A2220] text-[#F5C4D2] border-[#D68B7E]/50'
                  : 'bg-[#1A1614] text-[#9A8C84] border-[#2C2421]'
              }`}
              title="Show/Hide Selection Box"
            >
              {showSelectionGizmo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Guides
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#241E1C] hover:bg-[#322926] text-[#F7F1EB] border border-[#382F2C]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={handleExportScenePNG}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#26201E] hover:bg-[#342B28] text-[#F7F1EB] border border-[#3E322E]"
            >
              <Download className="w-3.5 h-3.5" />
              Save Scene PNG
            </button>

            <button
              onClick={handleRecordSceneVideo}
              disabled={isRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D68B7E] hover:bg-[#E29A8E] text-[#181312] shadow-sm disabled:opacity-50"
            >
              <Video className="w-3.5 h-3.5" />
              {isRecording ? `Recording ${recordSeconds.toFixed(1)}s...` : 'Record 5s Video'}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-[#221C1A] hover:bg-[#302724] text-[#C8B8B0] border border-[#322A27]"
              title="Toggle Fullscreen Window"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#2A1F1E] hover:bg-[#422B29] text-[#F5C4D2] border border-[#45312E]"
              title="Close Scene Composer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Add Character Roster Strip */}
        <div className="px-5 py-2.5 bg-[#171312] border-b border-[#2A2220] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#D68B7E] shrink-0 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Character to Scene:
          </span>
          {SCENE_CHARACTER_CATALOG.map((item) => (
            <button
              key={item.charType}
              onClick={() => handleAddCharacter(item.charType)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all bg-[#221D1A] hover:bg-[#322925] text-[#F2E8DF] border-[#342B28] hover:border-[#D68B7E]"
            >
              <Plus className="w-3 h-3 text-[#D68B7E]" />
              <span>{item.label}</span>
              {item.supportsMultiView && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#769A95]/30 text-[#CFE4DF]">
                  5 Views
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Body: Interactive Stage Canvas (Left 8 cols) + Scene Inspector (Right 4 cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Interactive Scene Canvas Area */}
          <div className="lg:col-span-8 bg-[#0E0C0B] p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div
              className={`w-full flex items-center justify-center ${
                sceneAspect === '16:9'
                  ? 'max-w-[1040px] aspect-[16/9]'
                  : sceneAspect === '4:3'
                  ? 'max-w-[840px] aspect-[4/3]'
                  : 'max-w-[680px] aspect-square'
              } rounded-xl overflow-hidden shadow-2xl border border-[#322A27] relative`}
              style={{
                background:
                  'repeating-conic-gradient(#1f1a18 0% 25%, #161311 0% 50%) 50% / 20px 20px',
              }}
            >
              <canvas
                ref={sceneCanvasRef}
                width={sceneW}
                height={sceneH}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onWheel={handleCanvasWheel}
                className="w-full h-full object-contain block cursor-grab active:cursor-grabbing touch-none"
              />
            </div>

            {/* Bottom Stage Floating Quick Bar for Selected Character (Immediate Animation, View & Expression Selection!) */}
            {selectedActor && (
              <div className="mt-3 px-3.5 py-2 rounded-xl bg-[#1A1614]/95 border border-[#342B28] flex flex-wrap items-center gap-2.5 shadow-lg max-w-full">
                <span className="text-xs font-semibold text-[#F5C4D2]">
                  {selectedActor.label}
                </span>

                {/* Direct Animation Picker right in the stage bar */}
                <div className="flex items-center gap-1.5 bg-[#120F0E] px-2 py-1 rounded-lg border border-[#2E2623]">
                  <Footprints className="w-3.5 h-3.5 text-[#D68B7E]" />
                  <span className="text-[10px] font-mono uppercase text-[#A89890]">Anim:</span>
                  <select
                    value={selectedActor.animMode}
                    onChange={(e) =>
                      updateActor(selectedActor.id, {
                        animMode: e.target.value as SceneActorAnimMode,
                      })
                    }
                    className="bg-transparent text-xs font-semibold text-[#FFF8F2] focus:outline-none cursor-pointer"
                  >
                    <option value="idle" className="bg-[#1C1816]">Idle Breathing</option>
                    <option value="walk" className="bg-[#1C1816]">Walk Cycle</option>
                    <option value="sit" className="bg-[#1C1816]">Sit Pose</option>
                    <option value="wave" className="bg-[#1C1816]">Wave Hand</option>
                    <option value="jump" className="bg-[#1C1816]">Happy Jump</option>
                    <option value="look_around" className="bg-[#1C1816]">Look Around</option>
                    <option value="breeze" className="bg-[#1C1816]">Wind Breeze</option>
                    <option value="glance" className="bg-[#1C1816]">Gaze & Glance</option>
                    <option value="nod" className="bg-[#1C1816]">Gentle Nod</option>
                    <option value="static" className="bg-[#1C1816]">Static Pose</option>
                  </select>
                </div>

                {/* Direct View Angle Picker if character supports multi-view */}
                {selectedSupportsMultiView && (
                  <div className="flex items-center gap-1 bg-[#120F0E] px-2 py-1 rounded-lg border border-[#2E2623]">
                    <Compass className="w-3.5 h-3.5 text-[#86ABA6]" />
                    <span className="text-[10px] font-mono uppercase text-[#A89890]">View:</span>
                    <select
                      value={selectedActor.viewAngle || 'front'}
                      onChange={(e) =>
                        updateActor(selectedActor.id, {
                          viewAngle: e.target.value as SquireViewAngle,
                        })
                      }
                      className="bg-transparent text-xs font-semibold text-[#CFE4DF] focus:outline-none cursor-pointer"
                    >
                      <option value="front" className="bg-[#1C1816]">Front</option>
                      <option value="three_quarter" className="bg-[#1C1816]">3/4 Angle</option>
                      <option value="side_right" className="bg-[#1C1816]">Side (Right)</option>
                      <option value="side_left" className="bg-[#1C1816]">Side (Left)</option>
                      <option value="back" className="bg-[#1C1816]">Back View</option>
                    </select>
                  </div>
                )}

                {/* Direct Expression Picker if character supports multi-view */}
                {selectedSupportsMultiView && (
                  <div className="flex items-center gap-1 bg-[#120F0E] px-2 py-1 rounded-lg border border-[#2E2623]">
                    <Smile className="w-3.5 h-3.5 text-[#EE9A8A]" />
                    <span className="text-[10px] font-mono uppercase text-[#A89890]">Expr:</span>
                    <select
                      value={selectedActor.expression || 'determined'}
                      onChange={(e) =>
                        updateActor(selectedActor.id, {
                          expression: e.target.value as SquireExpression,
                        })
                      }
                      className="bg-transparent text-xs font-semibold text-[#FADBC3] focus:outline-none cursor-pointer"
                    >
                      <option value="determined" className="bg-[#1C1816]">Determined</option>
                      <option value="happy" className="bg-[#1C1816]">Happy Smile</option>
                      <option value="surprised" className="bg-[#1C1816]">Surprised</option>
                      <option value="sleepy" className="bg-[#1C1816]">Sleepy Calm</option>
                      <option value="wonder" className="bg-[#1C1816]">Wonder</option>
                      <option value="proud" className="bg-[#1C1816]">Proud (^ ^)</option>
                    </select>
                  </div>
                )}

                <div className="h-3.5 w-[1px] bg-[#322A27]" />

                {selectedHasHairToggle && (
                  <button
                    onClick={() =>
                      updateActor(selectedActor.id, {
                        renderHair: selectedActor.renderHair === false ? true : false,
                      })
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      selectedActor.renderHair !== false
                        ? 'bg-[#2C2224] text-[#F5C4D2] border-[#D68B7E]/60'
                        : 'bg-[#1D1817] text-[#8C7D75] border-[#2E2623]'
                    }`}
                    title="Toggle Optional Hair Rendering"
                  >
                    {selectedActor.renderHair !== false ? (
                      <Eye className="w-3.5 h-3.5 text-[#D68B7E]" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    Hair: {selectedActor.renderHair !== false ? 'ON' : 'OFF'}
                  </button>
                )}

                <button
                  onClick={() =>
                    updateActor(selectedActor.id, { flipX: !selectedActor.flipX })
                  }
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#251F1D] hover:bg-[#342B28] text-xs text-[#F7F1EB]"
                  title="Mirror Flip Horizontally"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  Flip
                </button>
                <button
                  onClick={() => handleDuplicateActor(selectedActor)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#251F1D] hover:bg-[#342B28] text-xs text-[#F7F1EB]"
                  title="Duplicate Character"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
                <button
                  onClick={() => handleDeleteActor(selectedActor.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#3A2220] hover:bg-[#522D2A] text-xs text-[#FFB4AE]"
                  title="Remove Character from Scene"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Right Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#191513] border-l border-[#2E2623] flex flex-col overflow-hidden">
            {/* Inspector Sub-Tabs */}
            <div className="grid grid-cols-3 border-b border-[#2E2623] bg-[#141110]">
              <button
                onClick={() => setInspectorSection('actors')}
                className={`py-2.5 text-xs font-medium border-b-2 flex items-center justify-center gap-1.5 ${
                  inspectorSection === 'actors'
                    ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#211B19]'
                    : 'border-transparent text-[#A89890] hover:text-[#FFF8F2]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Characters ({actors.length})
              </button>
              <button
                onClick={() => setInspectorSection('background')}
                className={`py-2.5 text-xs font-medium border-b-2 flex items-center justify-center gap-1.5 ${
                  inspectorSection === 'background'
                    ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#211B19]'
                    : 'border-transparent text-[#A89890] hover:text-[#FFF8F2]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Scene BGs (Code/Img)
              </button>
              <button
                onClick={() => setInspectorSection('templates')}
                className={`py-2.5 text-xs font-medium border-b-2 flex items-center justify-center gap-1.5 ${
                  inspectorSection === 'templates'
                    ? 'border-[#D68B7E] text-[#FFF8F2] bg-[#211B19]'
                    : 'border-transparent text-[#A89890] hover:text-[#FFF8F2]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Scene Presets
              </button>
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {inspectorSection === 'actors' && (
                <>
                  {/* Layer Stack List */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase text-[#A89890]">
                        Scene Characters (Click to Select)
                      </span>
                      {actors.length > 0 && (
                        <button
                          onClick={() => {
                            setActors([]);
                            setSelectedActorId(null);
                          }}
                          className="text-[11px] text-[#E27D73] hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {actors.length === 0 ? (
                      <div className="p-6 rounded-xl bg-[#141110] border border-[#2A2220] text-center space-y-2">
                        <p className="text-xs text-[#A89890]">
                          No characters in the scene yet. Click any character button in the top bar to place them!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-[155px] overflow-y-auto pr-1">
                        {[...actors].reverse().map((act) => (
                          <div
                            key={act.id}
                            onClick={() => setSelectedActorId(act.id)}
                            className={`px-3 py-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              selectedActorId === act.id
                                ? 'bg-[#28201E] border-[#D68B7E] text-[#FFF8F2]'
                                : 'bg-[#141110] border-[#28211E] text-[#C8B8B0] hover:border-[#3E322E]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-[#D68B7E]" />
                              <span className="text-xs font-medium truncate">
                                {act.label}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1D1816] text-[#D68B7E]">
                                {act.animMode}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveLayer(act.id, 1);
                                }}
                                className="p-1 rounded hover:bg-[#382E2B] text-[#A89890] hover:text-[#FFF8F2]"
                                title="Bring Forward"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveLayer(act.id, -1);
                                }}
                                className="p-1 rounded hover:bg-[#382E2B] text-[#A89890] hover:text-[#FFF8F2]"
                                title="Send Backward"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteActor(act.id);
                                }}
                                className="p-1 rounded hover:bg-[#442523] text-[#A89890] hover:text-[#FF948D]"
                                title="Remove"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Actor Animation, View Angle, Expression & Transform Controls */}
                  {selectedActor && (
                    <div className="p-4 rounded-xl bg-[#141110] border border-[#2C2421] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#26201E] pb-2">
                        <span className="text-xs font-semibold text-[#F5C4D2]">
                          Selected: {selectedActor.label}
                        </span>
                        <button
                          onClick={() =>
                            updateActor(selectedActor.id, {
                              x: 0.5,
                              y: 0.58,
                              scale: 0.74,
                              rotationDeg: 0,
                              flipX: false,
                              shadowOffsetY: 0,
                            })
                          }
                          className="text-[11px] flex items-center gap-1 text-[#A89890] hover:text-[#FFF8F2]"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Pose
                        </button>
                      </div>

                      {/* 1. CHOOSE CHARACTER ANIMATION CLIP */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-[#D68B7E]">
                          1. Choose Character Animation
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(
                            [
                              { id: 'idle', label: 'Idle (Breathing)' },
                              { id: 'walk', label: 'Walk Cycle' },
                              { id: 'sit', label: 'Sit Down Pose' },
                              { id: 'wave', label: 'Cheerful Wave' },
                              { id: 'jump', label: 'Happy Jump' },
                              { id: 'look_around', label: 'Look Around' },
                              { id: 'breeze', label: 'Wind Breeze' },
                              { id: 'static', label: 'Static Still' },
                            ] as { id: SceneActorAnimMode; label: string }[]
                          ).map((anim) => (
                            <button
                              key={anim.id}
                              onClick={() =>
                                updateActor(selectedActor.id, { animMode: anim.id })
                              }
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all flex items-center justify-between ${
                                selectedActor.animMode === anim.id
                                  ? 'bg-[#D68B7E] text-[#151211] border-[#F5C4D2] font-semibold'
                                  : 'bg-[#1C1816] text-[#C8B8B0] border-[#2E2623] hover:border-[#4A3B36]'
                              }`}
                            >
                              <span>{anim.label}</span>
                              {selectedActor.animMode === anim.id && (
                                <Check className="w-3 h-3 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>

                        {selectedActor.animMode === 'walk' && (
                          <label className="flex items-center gap-2 pt-1 text-xs text-[#CFE4DF] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedActor.autoWalkAcross)}
                              onChange={(e) =>
                                updateActor(selectedActor.id, {
                                  autoWalkAcross: e.target.checked,
                                })
                              }
                              className="accent-[#769A95]"
                            />
                            Auto-Walk Across Stage Horizontally
                          </label>
                        )}
                      </div>

                      {/* 2. VIEW ANGLE SWITCHER (Front / 3/4 / Side / Back) */}
                      {selectedSupportsMultiView && (
                        <div className="space-y-1.5 pt-2 border-t border-[#241E1C]">
                          <label className="block text-[10px] font-mono uppercase text-[#86ABA6]">
                            2. Camera View Angle (Front / Side / Back)
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(
                              [
                                { id: 'front', label: 'Front View' },
                                { id: 'three_quarter', label: '3/4 Angle' },
                                { id: 'side_right', label: 'Side Right' },
                                { id: 'side_left', label: 'Side Left' },
                                { id: 'back', label: 'Back View' },
                              ] as { id: SquireViewAngle; label: string }[]
                            ).map((v) => (
                              <button
                                key={v.id}
                                onClick={() =>
                                  updateActor(selectedActor.id, { viewAngle: v.id })
                                }
                                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  (selectedActor.viewAngle || 'front') === v.id
                                    ? 'bg-[#769A95] text-[#121817] border-[#CFE4DF] font-semibold'
                                    : 'bg-[#1C1816] text-[#C8B8B0] border-[#2E2623] hover:border-[#769A95]/60'
                                }`}
                              >
                                {v.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. FACIAL EXPRESSION SWITCHER */}
                      {selectedSupportsMultiView && (
                        <div className="space-y-1.5 pt-2 border-t border-[#241E1C]">
                          <label className="block text-[10px] font-mono uppercase text-[#EE9A8A]">
                            3. Facial Expression
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(
                              [
                                { id: 'determined', label: 'Determined' },
                                { id: 'happy', label: 'Happy Smile' },
                                { id: 'surprised', label: "Surprised 'O'" },
                                { id: 'sleepy', label: 'Sleepy Calm' },
                                { id: 'wonder', label: 'Wonder' },
                                { id: 'proud', label: 'Proud (^ ^)' },
                              ] as { id: SquireExpression; label: string }[]
                            ).map((ex) => (
                              <button
                                key={ex.id}
                                onClick={() =>
                                  updateActor(selectedActor.id, { expression: ex.id })
                                }
                                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  (selectedActor.expression || 'determined') === ex.id
                                    ? 'bg-[#EE9A8A] text-[#1A1210] border-[#FADBC3] font-semibold'
                                    : 'bg-[#1C1816] text-[#C8B8B0] border-[#2E2623] hover:border-[#EE9A8A]/60'
                                }`}
                              >
                                {ex.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Optional Render Hair Button */}
                      {selectedHasHairToggle && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1716] border border-[#322926]">
                          <span className="text-xs text-[#F2E8DF] font-medium">
                            Render Character Hair
                          </span>
                          <button
                            onClick={() =>
                              updateActor(selectedActor.id, {
                                renderHair:
                                  selectedActor.renderHair === false ? true : false,
                              })
                            }
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              selectedActor.renderHair !== false
                                ? 'bg-[#D68B7E] text-[#151211]'
                                : 'bg-[#28211F] text-[#A89890] border border-[#3A302C]'
                            }`}
                          >
                            {selectedActor.renderHair !== false ? (
                              <>
                                <Eye className="w-3.5 h-3.5" /> Hair ON
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" /> Hair OFF
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* X, Y, Scale, Rotation Sliders */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#241E1C]">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#A89890]">Horizontal (X)</span>
                            <span className="font-mono text-[#E8DCD2]">
                              {Math.round(selectedActor.x * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.05}
                            max={0.95}
                            step={0.005}
                            value={selectedActor.x}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                x: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-[#D68B7E]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#A89890]">Vertical (Y)</span>
                            <span className="font-mono text-[#E8DCD2]">
                              {Math.round(selectedActor.y * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.08}
                            max={0.95}
                            step={0.005}
                            value={selectedActor.y}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                y: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-[#D68B7E]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#A89890]">Scale Size</span>
                            <span className="font-mono text-[#E8DCD2]">
                              {selectedActor.scale.toFixed(2)}×
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.18}
                            max={1.65}
                            step={0.01}
                            value={selectedActor.scale}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                scale: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-[#D68B7E]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#A89890]">Rotation</span>
                            <span className="font-mono text-[#E8DCD2]">
                              {selectedActor.rotationDeg}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min={-45}
                            max={45}
                            step={1}
                            value={selectedActor.rotationDeg}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                rotationDeg: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-[#D68B7E]"
                          />
                        </div>
                      </div>

                      {/* Porcelain BJD Wardrobe Selector if BJD */}
                      {selectedActor.charType === 'porcelain_bjd' && (
                        <div className="pt-2 border-t border-[#241E1C]">
                          <label className="block text-[10px] font-mono uppercase text-[#F5C4D2] mb-1.5">
                            Porcelain BJD Wardrobe Outfit
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(
                              [
                                { id: 'pink_babydoll', label: 'Pink Babydoll' },
                                { id: 'mint_lolita', label: 'Mint Lolita' },
                                { id: 'classic_alice', label: 'Classic Alice' },
                                { id: 'crimson_gothic', label: 'Crimson Gothic' },
                              ] as const
                            ).map((out) => (
                              <button
                                key={out.id}
                                onClick={() =>
                                  updateActor(selectedActor.id, { bjdOutfit: out.id })
                                }
                                className={`px-2 py-1.5 rounded text-xs font-medium border ${
                                  selectedActor.bjdOutfit === out.id
                                    ? 'bg-[#D68B7E] text-[#151211] border-[#F5C4D2] font-semibold'
                                    : 'bg-[#1E1917] text-[#C8B8B0] border-[#2E2623]'
                                }`}
                              >
                                {out.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Speed, Blink & Ground Contact Shadow Calibration */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#241E1C]">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#A89890]">Motion Speed</span>
                            <span className="font-mono text-[#E8DCD2]">
                              {selectedActor.animSpeed.toFixed(1)}×
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.2}
                            max={2.0}
                            step={0.1}
                            value={selectedActor.animSpeed}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                animSpeed: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-[#D68B7E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                            Eye Blink Mode
                          </label>
                          <select
                            value={selectedActor.blinkMode}
                            onChange={(e) =>
                              updateActor(selectedActor.id, {
                                blinkMode: e.target.value as SceneActorInstance['blinkMode'],
                              })
                            }
                            className="w-full px-2 py-1 rounded-lg bg-[#1C1816] border border-[#322A27] text-xs text-[#FFF8F2]"
                          >
                            <option value="auto">Auto Blink</option>
                            <option value="open">Eyes Open</option>
                            <option value="half">Half-Lid</option>
                            <option value="closed">Eyes Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Ground Shadow Toggle + Fine Contact Distance Slider */}
                      <div className="pt-2 border-t border-[#241E1C] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedActor.groundShadow}
                              onChange={(e) =>
                                updateActor(selectedActor.id, {
                                  groundShadow: e.target.checked,
                                })
                              }
                              className="accent-[#D68B7E]"
                            />
                            Ground Contact Shadow
                          </label>

                          <label className="flex items-center gap-2 text-xs text-[#D8C8B8] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedActor.flipX}
                              onChange={(e) =>
                                updateActor(selectedActor.id, {
                                  flipX: e.target.checked,
                                })
                              }
                              className="accent-[#D68B7E]"
                            />
                            Mirror Flip X
                          </label>
                        </div>

                        {selectedActor.groundShadow && (
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-[#A89890]">
                                Shadow Contact Offset (Hug Feet)
                              </span>
                              <span className="font-mono text-[#E8DCD2]">
                                {((selectedActor.shadowOffsetY ?? 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min={-0.18}
                              max={0.12}
                              step={0.005}
                              value={selectedActor.shadowOffsetY ?? 0}
                              onChange={(e) =>
                                updateActor(selectedActor.id, {
                                  shadowOffsetY: parseFloat(e.target.value),
                                })
                              }
                              className="w-full accent-[#D68B7E]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {inspectorSection === 'background' && (
                <div className="space-y-4">
                  {/* 1. ADD / BUILD CODED BACKGROUND FROM USER'S CODE */}
                  <div className="p-3.5 rounded-xl bg-[#141110] border border-[#382E2A] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#CFE4DF] flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-[#769A95]" />
                          Coded Backgrounds (Canvas 2D Code)
                        </span>
                        <p className="text-[11px] text-[#A89890]">
                          Add backgrounds built in code or paste any Canvas 2D drawing code:
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCodeBgBuilderOpen(!isCodeBgBuilderOpen)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#769A95] hover:bg-[#86ABA6] text-[#111716] text-xs font-semibold shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isCodeBgBuilderOpen ? 'Close Editor' : 'Add Code BG'}
                      </button>
                    </div>

                    {isCodeBgBuilderOpen && (
                      <div className="p-3 rounded-xl bg-[#1C1715] border border-[#382F2C] space-y-2.5 mt-2">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                            Background Title
                          </label>
                          <input
                            type="text"
                            value={newBgTitle}
                            onChange={(e) => setNewBgTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-[#120F0E] border border-[#2E2623] text-xs text-[#FFF8F2]"
                            placeholder="e.g. Enchanted Forest Clearing"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                            Canvas 2D Drawing Code (uses `ctx`, `width`, `height`, `t`)
                          </label>
                          <textarea
                            rows={8}
                            value={newBgCode}
                            onChange={(e) => setNewBgCode(e.target.value)}
                            className="w-full p-2.5 rounded bg-[#0E0C0B] border border-[#2E2623] text-[11px] font-mono text-[#CFE4DF] focus:outline-none focus:border-[#769A95]"
                            placeholder="// Write or paste Canvas 2D background code here..."
                          />
                        </div>
                        {codeBgError && (
                          <p className="text-[11px] text-[#FF948D] font-mono">
                            Error: {codeBgError}
                          </p>
                        )}
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setIsCodeBgBuilderOpen(false)}
                            className="px-2.5 py-1 rounded text-xs text-[#A89890] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNewCodedBg}
                            className="px-3 py-1.5 rounded-lg bg-[#D68B7E] hover:bg-[#E29A8E] text-[#151211] text-xs font-semibold"
                          >
                            Save & Apply Code BG
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Saved Custom Coded Backgrounds List */}
                    {customCodedBgs.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase text-[#86ABA6]">
                          Your Saved Coded Backgrounds ({customCodedBgs.length})
                        </span>
                        {customCodedBgs.map((cbg) => {
                          const presetKey: SceneBgPresetId = `custom_code:${cbg.id}`;
                          const isSelected = bgPreset === presetKey;
                          return (
                            <div
                              key={cbg.id}
                              onClick={() => setBgPreset(presetKey)}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#25302E] border-[#769A95] text-[#FFF8F2]'
                                  : 'bg-[#181412] border-[#28211E] text-[#C8B8B0] hover:border-[#3E322E]'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                                  <Code2 className="w-3.5 h-3.5 text-[#769A95] shrink-0" />
                                  <span>{cbg.label}</span>
                                </div>
                                <div className="text-[11px] text-[#A89890] truncate">
                                  {cbg.subtitle}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewBgTitle(cbg.label);
                                    setNewBgSubtitle(cbg.subtitle);
                                    setNewBgCode(cbg.code);
                                    setIsCodeBgBuilderOpen(true);
                                  }}
                                  className="px-2 py-0.5 rounded bg-[#26201E] hover:bg-[#362D2A] text-[10px] text-[#CFE4DF]"
                                >
                                  Edit Code
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCustomCodedBg(cbg.id);
                                  }}
                                  className="p-1 rounded hover:bg-[#442523] text-[#A89890] hover:text-[#FF948D]"
                                  title="Delete Coded BG"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. UPLOAD IMAGE BACKGROUND */}
                  <div className="p-3.5 rounded-xl bg-[#141110] border border-[#2E2623] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5C4D2]">
                        Upload Picture Background
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D68B7E] text-[#151211] text-xs font-semibold"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload BG Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBgUpload}
                        className="hidden"
                      />
                    </div>
                    {customBgUrl && (
                      <button
                        onClick={() => setBgPreset('custom_upload')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs border ${
                          bgPreset === 'custom_upload'
                            ? 'bg-[#28201E] border-[#D68B7E] text-[#FFF8F2]'
                            : 'bg-[#1A1614] border-[#2C2421] text-[#A89890]'
                        }`}
                      >
                        Use Uploaded Background Image
                      </button>
                    )}
                  </div>

                  {/* 3. BUILT-IN PROCEDURAL CODED BACKGROUNDS */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase text-[#A89890]">
                      Built-In Coded Backgrounds
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {SCENE_BG_PRESETS.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setBgPreset(bg.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            bgPreset === bg.id
                              ? 'bg-[#28201E] border-[#D68B7E] text-[#FFF8F2]'
                              : 'bg-[#141110] border-[#28211E] text-[#C8B8B0] hover:border-[#3E322E]'
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-lg shrink-0 border border-white/15 shadow-inner"
                            style={{ background: bg.swatch }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate">
                              {bg.label}
                            </div>
                            <div className="text-[11px] text-[#A89890] truncate">
                              {bg.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foreground Atmosphere Particles & Vignette */}
                  <div className="p-3.5 rounded-xl bg-[#141110] border border-[#2E2623] space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#A89890] mb-1">
                        Foreground Atmosphere Overlay
                      </label>
                      <select
                        value={fgAtmosphere}
                        onChange={(e) =>
                          setFgAtmosphere(
                            e.target.value as typeof fgAtmosphere
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1816] border border-[#322A27] text-xs text-[#FFF8F2]"
                      >
                        <option value="shoujo_sparkles">✨ 90s Shoujo Starlight Sparkles</option>
                        <option value="cherry_petals">🌸 Drifting Cherry Blossom Petals</option>
                        <option value="golden_motes">☀️ Sunlit Golden Dust Motes</option>
                        <option value="soft_rain">🌧️ Gentle Twilight Raindrops</option>
                        <option value="none">None (Clean Stage)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#A89890]">Cinematic Vignette</span>
                        <span className="font-mono text-[#E8DCD2]">
                          {Math.round(vignetteIntensity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.65}
                        step={0.02}
                        value={vignetteIntensity}
                        onChange={(e) =>
                          setVignetteIntensity(parseFloat(e.target.value))
                        }
                        className="w-full accent-[#D68B7E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {inspectorSection === 'templates' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#A89890]">
                    Load a multi-character scene preset, then customize any character's animation, view angle, or expression:
                  </p>

                  {[
                    {
                      id: 'shoujo_trio' as const,
                      title: '90s Shoujo Heroine Trio',
                      desc: '90s Shoujo Girl, Auburn Girl & Black Bob Girl in a pastel rose bokeh dreamscape.',
                    },
                    {
                      id: 'meadow_picnic' as const,
                      title: 'Sunlit Meadow Storybook Picnic',
                      desc: '90s Shoujo Girl with Acorn Lamb & Watering Can Bunny in the rolling oak meadow.',
                    },
                    {
                      id: 'woodland_gathering' as const,
                      title: 'Golden Hour Woodland Friends',
                      desc: 'Strawberry Mouse, Postman Duckling, Teacup Puppy & Lantern Kitten at sunset.',
                    },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => applySceneTemplate(tpl.id)}
                      className="w-full p-3.5 rounded-xl bg-[#141110] hover:bg-[#231D1A] border border-[#2C2421] hover:border-[#D68B7E] text-left transition-all space-y-1"
                    >
                      <div className="text-xs font-semibold text-[#F5C4D2] flex items-center justify-between">
                        <span>{tpl.title}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#261E1C] text-[#D68B7E]">
                          Load Scene
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A89890]">{tpl.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
