# Pure-Code 2D Character Drawing & Rigging Methods Guide

This document explains the complete end-to-end methodology, mathematical primitives, anatomical construction rules, and hierarchical rigging system used in **Pastel-Sketch Bakery Canvas Studio** (`src/shoujoGirlEngine.ts`, `src/crtSailorEngine.ts`, `src/teacupPuppyEngine.ts`, `src/victorianBunnyEngine.ts`, `src/catAnimationEngine.ts`, `src/chibiSquireEngine.ts`, and `src/extractedCompilerCharacters.ts`).

---

## 1. Core Philosophy: 100% Pure Mathematical Vector Code

Every character in this studio is drawn **100% procedurally in HTML5 Canvas 2D (`CanvasRenderingContext2D`) using mathematical curves and parametric primitives**:
- **Zero external sprite sheets (`ctx.drawImage`)** for character parts.
- **Zero pixel-tracing (`cv2.findContours`) dumps** of thousands of jagged raster points.
- **Clean, hand-crafted mathematical control points** (`bezierPts`, `catmullRomSplinePts`, `sgTaperLine`, `sgShape`, `sgLine`, `lerpSegs`) that scale infinitely to any resolution (`1000×1000`, `1000×1200`, `1000×1500`, `1600×900`, or `4K`) with crisp calligraphy ink tapers and multi-stop gradients.

---

## 2. The 5-Stage Character Drawing & Rigging Process

Whenever we create a new character from a reference illustration or turnaround sheet, we follow a strict **5-Stage Pipeline**:

### Stage 1: Native Canvas Calibration & Color Palette Lock
1. **Preserve Native Aspect Ratio**:
   - Full-body standing characters use `1000×1200` (`5:6` ratio, e.g., `crtSailorEngine.ts`) or `1000×1500` (`2:3` ratio, e.g., Porcelain BJD).
   - Bust portraits and chibi/storybook characters use `1000×1000` (`1:1` ratio, e.g., `shoujoGirlEngine.ts`, `teacupPuppyEngine.ts`, `victorianBunnyEngine.ts`, `chibiSquireEngine.ts`).
   - Wide environmental stages use `1600×900` (`16:9` ratio, e.g., `SceneComposerModal.tsx`).
2. **Proportional Plumb-Line Landmarks**:
   - Before writing a single path, we map the vertical and horizontal anatomical landmarks on the reference grid:
     - `headTopY`, `eyeLineY`, `chinNeckY`, `shoulderLineY`, `elbowLineY`, `wristHandY`, `hemLineY`, and `footContactY`.
3. **Named Color Palette Object (`const C` or `const SG`)**:
   - Every character engine defines a strongly-typed palette dictionary at the top of the file containing:
     - Base fills (`skinBase`, `hairBase`, `dressBase`)
     - Warm/cool shadow tones (`skinShadow`, `hairDark`, `skirtShadow`)
     - Specular highlights (`hairHighlight`, `eyeCatchlight`, `lipGloss`)
     - Colored ink outlines (`ink`, `skinInk`, `hairInk`, `goldInk`) — using warm espresso/plum/sepia ink (`#1F1518`, `#281A1E`, `#4A332D`) rather than harsh pure black.

### Stage 2: Back-to-Front Anatomical Layer Decomposition (12 to 24+ Layers)
A character is decomposed into **12 to 24+ independent anatomical layers** ordered strictly from back (`L01`) to front (`L24`):
1. **Background & Atmosphere** (Paper grain, soft vignette, pastel circle, or environmental backdrop)
2. **Back Hair Mass / Cape / Backpack** (Behind the neck and torso)
3. **Torso / Undershirt / Dress Bodice & Skirt** (With extended neck and waist underlaps)
4. **Left & Right Upper Sleeves / Arms**
5. **Left & Right Forearms & Open-Contour Cuffs**
6. **Left & Right Articulated Hands** (Docked inside the sleeve cuff sockets)
7. **Neck Cylinder & Collar / Ribbon Bow** (With a `+42px` top extension into the head and `+55px` chest wedge under the collar)
8. **Head & Cheek/Jaw Silhouette** (Pivoting at the anatomical neck base)
9. **Ears & Earrings / Headphone / Bonnet Back**
10. **Facial Features**:
    - Soft radial cheek blush (`ctx.createRadialGradient`)
    - Nose bridge & nostril shadow dot
    - Expressive mouth (upper lip bow, oral cavity, tongue, glossy lower lip cushion)
    - Left & Right **3-Stage Deforming Eyes** (Sclera -> Clipped Iris/Pupil -> Catchlights -> Deforming Eyelid Skin Cap -> Upper Lash Ribbon)
    - Left & Right Eyebrows (Translating vertically with `browLift`)
11. **Mid-Ground Cheek Hair Locks & Sideburns** (Framing the jaw)
12. **Foreground Swept Bangs & Crown Hair Shine** (Pivoting from the crown parting root)
13. **Headgear / Ribbons / Hats / Sparkles** (Topmost accessories)

### Stage 3: Watertight Occluded Underlaps & Open-Contour Socket Joins
When joints rotate during animation, flat shapes that merely touch at their edges will tear apart and expose background gaps. We prevent this with two mandatory geometric laws:
1. **Watertight Occluded Underlaps**:
   - Every child layer extends **35px–60px deep** underneath its parent layer along a smooth tangent continuation curve.
   - Example: The neck (`L03`) extends `+42px` upward behind the chin and `+55px` downward in a V-wedge behind the sailor collar. Even at maximum head tilt (`±0.15 rad`), zero background pixels ever leak through.
2. **Open-Contour Socket Joins (Sleeves, Cuffs & Ankles)**:
   - Sleeve cuffs, collar openings, and skirt hems are drawn as **open contours** (omitting the closing straight line across the socket opening) or layered with an explicit interior shadow ellipse + foreground overlap rim so the wrist/hand or leg emerges from *inside* the clothing cylinder rather than looking pasted on top.

### Stage 4: Hierarchical Forward Kinematics (`withPivot`) & Coupled 2-Link IK
1. **Hierarchical Pivot Transforms (`withPivot`)**:
   - Every articulated part rotates and translates around its true anatomical joint center `(px, py)`:
     ```ts
     function withPivot(
       ctx: CanvasRenderingContext2D,
       px: number,
       py: number,
       rotRad = 0,
       dx = 0,
       dy = 0,
       sx = 1,
       sy = 1,
       drawFn: () => void
     ) {
       ctx.save();
       ctx.translate(px + dx, py + dy);
       if (rotRad !== 0) ctx.rotate(rotRad);
       if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
       ctx.translate(-px, -py);
       drawFn();
       ctx.restore();
     }
     ```
   - Child layers (eyes, brows, hair locks, earrings, hats) are nested *inside* the head's `withPivot` block so they automatically inherit the head's rotation and translation, while adding their own secondary phase-lagged motion!
2. **Analytical 2-Link Inverse Kinematics (`solveTwoLinkIK` in `crtSailorEngine.ts`)**:
   - When a character's hands are clasped together or holding a prop with both hands, moving the hands `(handsDX, handsDY)` automatically solves the exact shoulder-to-elbow and elbow-to-wrist angles via the Law of Cosines so the cuffs never detach from the wrists.

### Stage 5: 4-Gate Visual & Numeric Verification
Before any character is finalized, we verify:
1. **Proportional & Silhouette Alignment** (Checking against reference plumb lines and onion-skin overlay).
2. **3-Stage Blink Verification** (`u = 0.0` Wide Open, `u = 0.55` Half-Lid, `u = 1.0` Fully Closed).
3. **4× Zoom Hand & Cuff Loupe Inspection** (Verifying palm block, finger ratios, and wrist cuff socket).
4. **12-Pose Extreme Boundary Leak Test** (`scripts/verify_crt_sailor.cjs` — verifying zero interior gaps across extreme joint combinations).

---

## 3. Our Core Mathematical Drawing Methods

Below are the primary drawing functions used across our character engines (`shoujoGirlEngine.ts`, `teacupPuppyEngine.ts`, `extractedCompilerCharacters.ts`, `crtSailorEngine.ts`):

### 3.1 `bezierPts(segments, stepsPerSeg)` — Cubic Bézier Path Evaluator
Converts an array of Cubic Bézier control segments `[x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1]` into a high-density array of `[x, y]` vertices.
```ts
export function bezierPts(segments: number[][], stepsPerSeg = 20): Pt[] {
  const pts: Pt[] = [];
  for (let s = 0; s < segments.length; s++) {
    const [x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1] = segments[s];
    const startStep = s === 0 ? 0 : 1;
    for (let i = startStep; i <= stepsPerSeg; i++) {
      const t = i / stepsPerSeg;
      const mt = 1 - t;
      const x =
        mt * mt * mt * x0 +
        3 * mt * mt * t * cp1x +
        3 * mt * t * t * cp2x +
        t * t * t * x1;
      const y =
        mt * mt * mt * y0 +
        3 * mt * mt * t * cp1y +
        3 * mt * t * t * cp2y +
        t * t * t * y1;
      pts.push([x, y]);
    }
  }
  return pts;
}
```
**Why we use it:** Allows us to define complex, graceful anime curves (jawlines, hair locks, irises, dress folds) with just a few mathematical control points, and also allows us to **morph** between two curves using `lerpSegs`!

---

### 3.2 `lerpSegs(segsA, segsB, t)` — Real-Time Curve Morphing
Linearly interpolates every control point between two Cubic Bézier segment arrays `segsA` and `segsB` by parameter `t ∈ [0, 1]`.
```ts
export function lerpSegs(segsA: number[][], segsB: number[][], t: number): number[][] {
  return segsA.map((segA, idx) => {
    const segB = segsB[idx] || segA;
    return segA.map((valA, j) => valA + ((segB[j] ?? valA) - valA) * t);
  });
}
```
**Why we use it:** Powers our **3-Stage Deforming Eyelid Blink** (`Open 0.0 -> Half-Lid 0.55 -> Closed 1.0`). Instead of a fake circle scaling vertically or a flat rectangle sliding down, the actual upper eyelid curve and eyelashes smoothly deform from an arched open curve (`u = 0.0`) to a relaxed horizontal curve (`u = 0.55`) to a downward-curved sleeping lash line (`u = 1.0`).

---

### 3.3 `catmullRomSplinePts(controlPts, closed, subdivisions)` — C1-Smooth Organic Splines
Used heavily in `teacupPuppyEngine.ts` and `extractedCompilerCharacters.ts` to pass a smooth curve directly through anatomical landmark points `[x, y]` without having to manually calculate tangent handles:
```ts
export function traceCatmullRom(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  closed = true,
  tension = 0.5
) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  const n = pts.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i % n];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 3;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 3;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 3;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 3;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}
```

---

### 3.4 `sgTaperLine(ctx, pts, maxWidth, color)` — Variable-Width Calligraphy Ink Stroke
Standard HTML5 Canvas `ctx.stroke()` draws a uniform-width tube that looks mechanical. To achieve authentic hand-inked anime & storybook linework that swells in the middle and tapers to a razor-sharp point at both ends, `sgTaperLine` computes normal vectors along the curve and constructs a closed variable-width ribbon polygon:
```ts
export function sgTaperLine(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  maxWidth: number,
  color: string,
  startTaper = 0.15,
  endTaper = 0.15
) {
  if (pts.length < 2) return;
  const left: Pt[] = [];
  const right: Pt[] = [];
  const n = pts.length;

  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    let profile = Math.sin(u * Math.PI);
    if (u < startTaper) profile = (u / startTaper) * Math.sin(startTaper * Math.PI);
    else if (u > 1 - endTaper) profile = ((1 - u) / endTaper) * Math.sin((1 - endTaper) * Math.PI);

    const w = Math.max(0.35, maxWidth * profile * 0.5);
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    left.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
    right.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left[0][0], left[0][1]);
  for (let i = 1; i < n; i++) ctx.lineTo(left[i][0], left[i][1]);
  for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
```
**Where we use it:** Upper eyelashes, eyebrow arches, jawline ink accents, hair strand interior lines, and clothing fold creases.

---

### 3.5 `sgShape(ctx, pts, fill, stroke, lineWidth)` — Closed Polygon / Spline Fill & Ink Helper
Draws a closed path from evaluated Bézier or spline points, fills it with a solid color or `CanvasGradient`, and optionally strokes the perimeter with round caps and joins (`lineCap = 'round'`, `lineJoin = 'round'`).

---

### 3.6 `drawShoujoEyeDeforming(...)` — The 3-Stage Clipped & Deforming Eye Engine
Every expressive character eye in our studio is built from **7 sub-layers**:
1. **Sclera Base (`sgShape`)**: Warm ivory/cream fill (`#FDFBF9`) with soft upper lash shadow gradient.
2. **Canvas Clipping Mask (`ctx.clip()`)**: Clips the iris and pupil strictly inside the sclera boundary so when the character glances left/right (`gazeDX`) or up/down (`gazeDY`), the iris never spills outside the eye white.
3. **Multi-Stop Radial Gradient Iris**: Deep outer limbal ring -> rich mid-iris gradient -> lower crescent luminescence reflector.
4. **Velvet Pupil & Starlight Catchlights**: Deep pupil core plus primary upper-left window highlight, secondary lower-right droplet highlight, and micro-pinpoint sparkles.
5. **Deforming Upper Eyelid Skin Cap**: Uses `lerpSegs(upperOpenSegs, upperHalfSegs, upperClosedSegs, blink)` to pull a skin-colored cap seamlessly down over the sclera as `blink` goes from `0.0 -> 0.55 -> 1.0`.
6. **Deforming Upper Lash Ribbon & Winged Spikes**: Follows the exact morphed eyelid edge, adding individual feathered lash spikes that fold downward when the eye closes.
7. **Double-Eyelid Crease (`creasePts`)**: Deforms in sync above the upper lash line.

---

### 3.7 The 4-Step Hand Anatomy Formula (`characterSheetVault.ts` & `crtSailorEngine.ts`)
To guarantee mistake-free hands in pure code:
1. **Step 1: Dorsal Palm Block & Wrist Socket**: Construct the trapezoid palm block first and tuck the wrist 20px–30px inside the open-contour sleeve cuff.
2. **Step 2: Parabolic Finger Arc**: Finger tips must follow a smooth parabolic arc where **Middle > Index ≈ Ring > Pinky** (never flat comb-teeth or identical-length tubes).
3. **Step 3: Radial Finger Clefts & Thumb Opposition**: Finger separation lines (`sgTaperLine`) radiate toward the center of the wrist, and the thumb emerges from the lower radial base at an opposition angle (`35°–50°`).
4. **Step 4: Tapered Fingertip Pads & Soft Crease Accents**: Fingertips round softly with a subtle warm blush tint and a delicate lunar palm crease.

---

## 4. How to Add a New Pure-Code Character to the Studio

1. **Create the Character Engine Module**:
   - Create `src/<characterName>Engine.ts`.
   - Define `<Character>RigState`, `DEFAULT_<CHARACTER>_RIG`, `<CHARACTER>_JOINT_SLIDER_META`, `compute<Character>RigAtTime(t, action, baseRig)`, and `draw<Character>(ctx, rig, cx, cy, scale)`.
2. **Register in `src/App.tsx`**:
   - Add the character ID to `type ActiveCharacter`.
   - Add its switcher button in the top Character Switcher Strip.
   - Add its branch in `renderCharacterFrameToContext` and the right-hand Joint Inspector panel.
3. **Register in `src/SceneComposerModal.tsx`**:
   - Add the character ID to `SceneCharacterType` and `SCENE_CHARACTER_CATALOG` so it can be placed, scaled, animated, and recorded inside multi-character scenes!
4. **Verify Compilation**:
   - Run `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
