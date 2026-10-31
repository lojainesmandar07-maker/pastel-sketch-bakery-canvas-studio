# Pastel-Sketch Bakery & 2D Character Rigging Studio

A 100% pure-code HTML5 Canvas 2D character drawing, hierarchical skeletal rigging, multi-angle turnaround vault, and multi-character scene composition studio built with React 19, TypeScript, Tailwind CSS 4, and Vite.

> 📖 **Documentation:** Read [**`CHARACTER_DRAWING_METHODS_GUIDE.md`**](./CHARACTER_DRAWING_METHODS_GUIDE.md) for a complete technical breakdown of our pure-code character drawing process, mathematical curve primitives (`bezierPts`, `catmullRomSplinePts`, `sgTaperLine`, `lerpSegs`, `withPivot`), 3-stage deforming eye engine, 4-step hand anatomy rules, and watertight joint sockets.

---

## ✨ Key Features

- **20 Rigged Pure-Code Characters & Storybook Scenes**:
  - **Kawaii CRT TV Sailor (`src/crtSailorEngine.ts`)**: Native `5:6` (`1000×1200`) 18-layer rig with Closed-Chain 2-Link IK clasped hands, 6 interactive CRT screen channels, 4× Hand & Cuff Loupe, and exploded layer view.
  - **Chibi Squire Boy w/ Sword (`src/chibiSquireEngine.ts`)**: 5-view turnaround (`Front`, `3/4`, `Side Right`, `Side Left`, `Back`), practice sword slash & walk cycles, and 6 facial expressions.
  - **90s Shoujo Anime Heroine (`src/shoujoGirlEngine.ts`)**: 24-layer hierarchical rig with 3-stage deforming eyelid blink (`0.0 -> 0.55 -> 1.0`), clipped iris gaze, and phase-lagged hair physics.
  - **Teacup Puppy in Scalloped Collar (`src/teacupPuppyEngine.ts`)**: 20-layer Catmull-Rom spline & gouache rig (`0.08%` pixel error) with rising tea steam and floppy ear physics.
  - **Victorian Maid Lop Bunny (`src/victorianBunnyEngine.ts`)**: 12-layer storybook rig with 3-tier lace bonnet and floating cherry petals.
  - **Raincoat Calico Kitten (`src/catAnimationEngine.ts`)**: 12-layer rig with tilted umbrella, puddle ripples, and animated rain atmosphere.
  - **Compiler Character & Scene Collection (`src/extractedCompilerCharacters.ts`)**: Auburn Girl, Black Bob Girl, Porcelain BJD Doll (4 outfits), Strawberry Mouse, Acorn Lamb, Watering Can Bunny, Postman Duckling, Lantern Kitten, and Storybook Meadow.
- **Interactive Multi-Character Scene Composer (`src/SceneComposerModal.tsx`)**:
  - Combine multiple animated characters on a `16:9`, `4:3`, or `1:1` stage.
  - Choose built-in procedural Canvas 2D backgrounds, write/paste custom Canvas 2D background code live, or upload reference background images.
- **Multi-Angle Character Sheet Vault & Hand Anatomy Training Dojo (`src/characterSheetVault.ts`)**:
  - Upload Front, 3/4, Side, Back, and Hand close-up references with automatic plumb-line calibration and interactive 4-step hand anatomy overlays.
- **Production Export Pipeline (`src/transparentVideoExporter.ts`)**:
  - Export 100% transparent PNGs, normal `.mp4`/`.webm` videos, transparent alpha `.webm` videos, or instant 32-bit RGBA PNG sequence `.zip` archives for Adobe After Effects.

---

## 📁 Project Structure

```text
pastel-sketch-bakery-canvas-studio/
├── CHARACTER_DRAWING_METHODS_GUIDE.md  # Complete guide to our pure-code drawing & rigging methods
├── README.md                           # Project overview & setup instructions
├── package.json                        # Dependencies & scripts
├── index.html                          # Studio entry HTML
├── vite.config.ts                      # Vite bundler configuration
├── tsconfig.json                       # TypeScript configuration
├── scripts/
│   └── verify_crt_sailor.cjs           # 4-Gate automated verification script for CRT TV Sailor
├── public/                             # Static reference previews & standalone builds
└── src/
    ├── main.tsx                        # React DOM entry point
    ├── App.tsx                         # Main 2D Rigging Studio UI, Keyframe Loop Animator & Inspector
    ├── SceneComposerModal.tsx          # Multi-Character Stage & Custom Coded Background Studio
    ├── crtSailorEngine.ts              # 18-Layer Kawaii CRT TV Sailor Engine (5:6, Closed-Chain IK)
    ├── chibiSquireEngine.ts            # 5-View Chibi Squire Boy w/ Sword Engine
    ├── shoujoGirlEngine.ts             # 24-Layer 90s Shoujo Heroine Engine (bezierPts, sgTaperLine, lerpSegs)
    ├── teacupPuppyEngine.ts            # 20-Layer Teacup Puppy Catmull-Rom Spline Engine
    ├── victorianBunnyEngine.ts         # 12-Layer Victorian Maid Bunny Engine
    ├── catAnimationEngine.ts           # 12-Layer Raincoat Calico Kitten Engine
    ├── bakeryEngine.ts                 # Pretzel Baker Bear & 3D Storybook Bakery Engine
    ├── extractedCompilerCharacters.ts  # 14 Compiler Characters & Procedural Scenes
    ├── characterSheetVault.ts          # Turnaround Sheet Vault & 4-Step Hand Anatomy Training Overlay
    └── transparentVideoExporter.ts     # WebM Alpha & After Effects RGBA PNG Sequence (.ZIP) Exporter
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Type-check the project:**
   ```bash
   npm run lint
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```
