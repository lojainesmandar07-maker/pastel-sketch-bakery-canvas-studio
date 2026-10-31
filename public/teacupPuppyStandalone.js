/**
 * TEACUP PUPPY IN SCALLOPED COLLAR — 100% Pure HTML5 Canvas 2D Standalone Engine
 * Zero external images. Uses 40-100 vertex Catmull-Rom splines, open limb creases,
 * true evenodd negative-space cutouts (ribbon bow loops + teacup handle hole),
 * 4-layer soft gouache washes, and contour-following colored-pencil shading.
 *
 * See src/teacupPuppyEngine.ts for full TypeScript source and 20-layer rigging solver.
 */
export {
  PUPPY_CANVAS_WIDTH,
  PUPPY_CANVAS_HEIGHT,
  DEFAULT_PUPPY_RIG,
  PUPPY_JOINT_META,
  drawCatmullRomSpline,
  computePuppyRigAtTime,
  drawTeacupPuppy,
} from '../src/teacupPuppyEngine';
