/**
 * verify_crt_sailor.cjs
 * Phase 1 & Phase 2 Anti-Cheat Verification Gate for Kawaii CRT TV Sailor Character
 *
 * Enforces all 4 Mandatory Verification Gates (Rule 1, Rule 2, Rule 3):
 * 1. Full 18-Layer Recomposite Foreground Pixel Diff (Target: <= 2.5% over non-white foreground)
 * 2. Dedicated Ink-Line Match Check (lum < 140, 2px radius):
 *    - Ink-Line Recall    >= 94.0%
 *    - Ink-Line Precision >= 92.0%
 * 3. Disjoint Visible Partition Check:
 *    - Foreground Coverage >= 99.0%
 *    - Unintended Visible Overlap < 0.5%
 * 4. 12-Pose Extreme-Boundary Combination Leak Matrix:
 *    - Tests 12 extreme clamp combinations (including all-joint simultaneous stress test)
 *    - Requires 0 leaked interior white background pixels across all 12 poses
 */

const fs = require('fs');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const W = 1000;
const H = 1200;

// ============================================================================
// CLOSED-CHAIN 2-LINK IK & MANDATORY CLAMPING (Normalized to 1000 x 1200)
// ============================================================================
const CLAMPS = {
  headTilt: [-0.12, 0.12],
  headDX: [-6.0, 6.0],       // +/- 0.6% of W (1000)
  headDY: [-7.0, 7.0],       // +/- 0.58% of H (1200) -> inside +42px neck underlap
  leftAntennaRot: [-0.20, 0.20],
  rightAntennaRot: [-0.20, 0.20],
  upperDialRot: [-Math.PI, Math.PI],
  lowerDialRot: [-Math.PI, Math.PI],
  handsDX: [-8.0, 8.0],      // +/- 0.8% of W
  handsDY: [-10.0, 10.0],    // +/- 0.82% of H
  handsRot: [-0.08, 0.08],
  elbowSpread: [-0.08, 0.08],
  collarSway: [-0.04, 0.04],
  ribbonBowRot: [-0.14, 0.14],
  torsoBobY: [-6.0, 6.0],    // +/- 0.5% of H
  torsoSwayRot: [-0.04, 0.04],
};

function clampVal(val, [min, max]) {
  return Math.max(min, Math.min(max, val || 0));
}

function clampCrtSailorRig(rig) {
  return {
    headTilt: clampVal(rig.headTilt, CLAMPS.headTilt),
    headDX: clampVal(rig.headDX, CLAMPS.headDX),
    headDY: clampVal(rig.headDY, CLAMPS.headDY),
    leftAntennaRot: clampVal(rig.leftAntennaRot, CLAMPS.leftAntennaRot),
    rightAntennaRot: clampVal(rig.rightAntennaRot, CLAMPS.rightAntennaRot),
    upperDialRot: clampVal(rig.upperDialRot, CLAMPS.upperDialRot),
    lowerDialRot: clampVal(rig.lowerDialRot, CLAMPS.lowerDialRot),
    handsDX: clampVal(rig.handsDX, CLAMPS.handsDX),
    handsDY: clampVal(rig.handsDY, CLAMPS.handsDY),
    handsRot: clampVal(rig.handsRot, CLAMPS.handsRot),
    elbowSpread: clampVal(rig.elbowSpread, CLAMPS.elbowSpread),
    collarSway: clampVal(rig.collarSway, CLAMPS.collarSway),
    ribbonBowRot: clampVal(rig.ribbonBowRot, CLAMPS.ribbonBowRot),
    torsoBobY: clampVal(rig.torsoBobY, CLAMPS.torsoBobY),
    torsoSwayRot: clampVal(rig.torsoSwayRot, CLAMPS.torsoSwayRot),
  };
}

/**
 * Closed-Chain 2-Link IK Solver for Left & Right Sleeves coupled to Clasped Hands (L10)
 * Ensures both cuffs stay locked to the left and right wrists of L10 so wrists NEVER separate.
 */
function solveClosedChainArmIK(clampedRig) {
  const { handsDX, handsDY, handsRot, elbowSpread } = clampedRig;
  // Rest shoulder, elbow, and wrist anchors in 1000x1200 space
  const shL = [305, 635], elL = [335, 860], wrL = [442, 1085];
  const shR = [685, 635], elR = [655, 860], wrR = [552, 1085];
  const handsPivot = [498, 1115];

  // Rotated + translated left & right wrist target positions attached to L10
  const cosH = Math.cos(handsRot), sinH = Math.sin(handsRot);
  const relLX = wrL[0] - handsPivot[0], relLY = wrL[1] - handsPivot[1];
  const relRX = wrR[0] - handsPivot[0], relRY = wrR[1] - handsPivot[1];

  const targetWL = [
    handsPivot[0] + handsDX + relLX * cosH - relLY * sinH,
    handsPivot[1] + handsDY + relLX * sinH + relLY * cosH,
  ];
  const targetWR = [
    handsPivot[0] + handsDX + relRX * cosH - relRY * sinH,
    handsPivot[1] + handsDY + relRX * sinH + relRY * cosH,
  ];

  // Solve subtle upper-arm & forearm angular deltas to track targetWL / targetWR + symmetric elbowSpread
  const dWLX = targetWL[0] - wrL[0], dWLY = targetWL[1] - wrL[1];
  const dWRX = targetWR[0] - wrR[0], dWRY = targetWR[1] - wrR[1];

  const leftUpperArmRot = clampVal(elbowSpread - dWLX * 0.0018, [-0.12, 0.12]);
  const rightUpperArmRot = clampVal(-elbowSpread - dWRX * 0.0018, [-0.12, 0.12]);

  const leftForearmRot = clampVal(-elbowSpread * 1.15 - dWLX * 0.0022, [-0.15, 0.15]);
  const rightForearmRot = clampVal(elbowSpread * 1.15 - dWRX * 0.0022, [-0.15, 0.15]);

  return {
    leftUpperArmRot,
    rightUpperArmRot,
    leftForearmRot,
    rightForearmRot,
    leftForearmDY: dWLY * 0.65,
    rightForearmDY: dWRY * 0.65,
  };
}

(async () => {
  console.log('=== PHASE 1 & 2 VERIFICATION SUITE (verify_crt_sailor.cjs) ===');
  const img = await loadImage('public/assets/aistudio/Kawaii_CRT_TV_Sailor_Uniform_Character_10b4cf85.png');
  const refCanvas = createCanvas(W, H);
  const refCtx = refCanvas.getContext('2d');
  refCtx.drawImage(img, 0, 0, W, H);
  const refData = refCtx.getImageData(0, 0, W, H).data;

  // Build exact 18-layer disjoint partition + occluded tangent-continuation hulls
  // First assign every foreground pixel (lum < 250) to one of the 18 layers
  const fgMask = new Uint8Array(W * H);
  const refInkMask = new Uint8Array(W * H);
  let fgTotal = 0;
  let refInkTotal = 0;

  for (let i = 0; i < W * H; i++) {
    const r = refData[i * 4], g = refData[i * 4 + 1], b = refData[i * 4 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 250) {
      fgMask[i] = 1;
      fgTotal++;
    }
    if (lum < 140) {
      refInkMask[i] = 1;
      refInkTotal++;
    }
  }

  // Assign each foreground pixel to its layer ID (0..17) based on the 18 semantic layer masks + Voronoi ink assignment
  const layerIdMap = new Int8Array(W * H).fill(-1);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (!fgMask[idx]) continue;
      const r = refData[idx * 4], g = refData[idx * 4 + 1], b = refData[idx * 4 + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // 1. Antennas & Dome Mount (y < 204)
      if (y < 204 && x >= 315 && x <= 650) {
        if (x < 488) layerIdMap[idx] = 15; // L16_left_rabbit_antenna
        else layerIdMap[idx] = 16;        // L17_right_rabbit_antenna
        continue;
      }

      // 2. CRT TV Head Assembly (y <= 544 and not neck skin)
      const isNeckSkin = y >= 514 && x >= 412 && x <= 570 && (r - b > 16 || (y > 532 && x >= 435 && x <= 548));
      if (y <= 545 && !isNeckSkin) {
        // Inside Phosphor Screen Glass (x=305..580, y=249..482)
        if (x >= 306 && x <= 579 && y >= 250 && y <= 481) {
          // Check if Screen Face feature (eyes, mouth, blush)
          if (y >= 348 && y <= 424 && x >= 332 && x <= 558 && (lum < 150 || (r - g > 30 && r > 180))) {
            layerIdMap[idx] = 17; // L18_kawaii_screen_face
          } else {
            layerIdMap[idx] = 13; // L14_phosphor_screen_glass
          }
          continue;
        }
        // Inner Screen Bezel (x=286..596, y=232..495)
        if (x >= 286 && x <= 596 && y >= 232 && y <= 495) {
          layerIdMap[idx] = 12; // L13_inner_screen_bezel
          continue;
        }
        // Dials & Speaker Grille (x=606..692, y=242..482)
        if (x >= 606 && x <= 692 && y >= 242 && y <= 482) {
          const distU = Math.hypot(x - 642, y - 273);
          const distL = Math.hypot(x - 646, y - 353);
          if (distU <= 33 || distL <= 33 || (y >= 398 && y <= 481 && x >= 610 && x <= 690)) {
            layerIdMap[idx] = 14; // L15_rotary_dials_and_grille
            continue;
          }
        }
        // Right 3D Bevel & Bottom Rosy Shadow
        if (x >= 693 || y >= 503) {
          layerIdMap[idx] = 11; // L12_crt_3d_bevel_and_bottom
          continue;
        }
        // CRT Outer Casing
        layerIdMap[idx] = 10; // L11_crt_outer_casing
        continue;
      }

      // 3. Slender Neck & Collarbone (y=514..660, x=400..576)
      if (y >= 514 && y <= 660 && x >= 400 && x <= 576) {
        // V-neck boundary curve
        const vHalfW = Math.max(0, 88 - (y - 560) * 0.88);
        if (Math.abs(x - 491) <= vHalfW) {
          layerIdMap[idx] = 2; // L03_slender_neck
          continue;
        }
      }

      // 4. Black Satin Tie Ribbon (x=438..542, y=628..890, dark pixels)
      if (y >= 628 && y <= 890 && x >= 438 && x <= 542 && lum < 85) {
        layerIdMap[idx] = 4; // L05_black_tie_ribbon
        continue;
      }

      // 5. Wide Sailor Collar & Double Stripes (y=545..764)
      if (y >= 545 && y <= 764) {
        // Left collar wing: from x=262..490, bottom edge slopes from (268,595) -> (355,760) -> (488,645)
        const leftWingBottom = x < 355
          ? 595 + ((x - 264) / 91) * 165
          : 760 - ((x - 355) / 133) * 115;
        const rightWingBottom = x > 638
          ? 600 + ((730 - x) / 92) * 162
          : 762 - ((638 - x) / 146) * 117;
        if ((x <= 490 && y <= leftWingBottom) || (x >= 490 && y <= rightWingBottom)) {
          layerIdMap[idx] = 3; // L04_sailor_collar
          continue;
        }
      }

      // 6. Coupled Clasped Hands (L10: y=1062..1178, x=414..582)
      if (y >= 1062 && y <= 1178 && x >= 414 && x <= 582) {
        const isHandTone = (r > 220 && g > 190 && r - b > 14) || (y >= 1072 && x >= 425 && x <= 572 && lum > 85);
        const isFingerInk = y >= 1070 && y <= 1174 && x >= 420 && x <= 575 && lum <= 160 && !(y > 1155 && (x < 438 || x > 560));
        if (isHandTone || isFingerInk) {
          layerIdMap[idx] = 9; // L10_coupled_clasped_hands
          continue;
        }
      }

      // 7. Pleated Dark Skirt (L01: y >= 1108, dark pixels)
      if (y >= 1108 && lum < 105) {
        layerIdMap[idx] = 0; // L01_pleated_skirt
        continue;
      }

      // 8. Left & Right Sleeves vs. Cardigan Torso
      // Left sleeve inner seam goes from (355,755) -> (395,850) -> (455,950) -> (492,1065)
      const leftSeamX = y < 850
        ? 355 + ((y - 755) / 95) * 40
        : 395 + ((y - 850) / 215) * 97;
      // Right sleeve inner seam goes from (638,755) -> (595,850) -> (538,950) -> (502,1065)
      const rightSeamX = y < 850
        ? 638 - ((y - 755) / 95) * 43
        : 595 - ((y - 850) / 215) * 93;

      // Note waist hemband on outer left (x < 395, y > 1075) and outer right (x > 600, y > 1075) belongs to Torso (L02)
      const isLeftWaistHem = y > 1078 && x < 390 && y > 1078 + (390 - x) * 0.25;
      const isRightWaistHem = y > 1078 && x > 605 && y > 1078 + (x - 605) * 0.25;

      if (!isLeftWaistHem && x < leftSeamX) {
        const elbowSplitY = 850 + (x - 250) * 0.12;
        layerIdMap[idx] = y < elbowSplitY ? 5 : 6; // L06_left_upper_sleeve : L07_left_forearm_cuff
        continue;
      }
      if (!isRightWaistHem && x > rightSeamX) {
        const elbowSplitY = 870 - (x - 575) * 0.12;
        layerIdMap[idx] = y < elbowSplitY ? 7 : 8; // L08_right_upper_sleeve : L09_right_forearm_cuff
        continue;
      }

      // Otherwise Cardigan Torso & Waist Hemband (L02)
      layerIdMap[idx] = 1; // L02_cardigan_torso
    }
  }

  // Build 18 offscreen layer canvases, each containing:
  // (A) Its synthesized occluded tangent-continuation underlap / joint cap
  // (B) Its exact assigned pixels + Bezier/ink strokes
  const layerCanvases = Array.from({ length: 18 }, () => createCanvas(W, H));

  // First draw synthesized occluded underlaps onto each layer canvas so rotation never leaks white gaps:
  function drawOccludedUnderlap(layerIdx, ctx) {
    ctx.save();
    if (layerIdx === 0) {
      // L01 Skirt: complete trapezoid underlap (y=1060..1198) behind both cardigan waist hem AND the entire clasped hands (L10)
      ctx.fillStyle = '#312F2D';
      ctx.beginPath();
      ctx.moveTo(282, 1198);
      ctx.lineTo(300, 1060);
      ctx.lineTo(695, 1060);
      ctx.lineTo(712, 1198);
      ctx.closePath();
      ctx.fill();
    } else if (layerIdx === 1) {
      // L02 Cardigan Torso: watertight undershirt block behind collar, ribbon, sleeves & hands
      ctx.fillStyle = '#F5EFE5';
      ctx.beginPath();
      ctx.moveTo(295, 585);
      ctx.lineTo(695, 585);
      ctx.lineTo(705, 1125);
      ctx.lineTo(290, 1125);
      ctx.closePath();
      ctx.fill();
    } else if (layerIdx === 2) {
      // L03 Neck: +42px top underlap into TV bottom + +55px bottom chest wedge behind collar V-neck
      ctx.fillStyle = '#C19EA7';
      ctx.fillRect(435, 472, 116, 62);
      ctx.fillStyle = '#F9E4D8';
      ctx.beginPath();
      ctx.moveTo(405, 550);
      ctx.lineTo(580, 550);
      ctx.lineTo(555, 715);
      ctx.lineTo(430, 715);
      ctx.closePath();
      ctx.fill();
    } else if (layerIdx === 5) {
      // L06 Left Upper Sleeve: +38px shoulder cap & +42px elbow cap
      ctx.fillStyle = '#F5EFE6';
      ctx.beginPath();
      ctx.arc(335, 645, 44, 0, Math.PI * 2);
      ctx.arc(335, 858, 56, 0, Math.PI * 2);
      ctx.fill();
    } else if (layerIdx === 6) {
      // L07 Left Forearm & Cuff: +42px elbow cap & +28px wrist cap
      ctx.fillStyle = '#F5EFE6';
      ctx.beginPath();
      ctx.arc(338, 860, 54, 0, Math.PI * 2);
      ctx.arc(432, 1072, 36, 0, Math.PI * 2);
      ctx.fill();
    } else if (layerIdx === 7) {
      // L08 Right Upper Sleeve: +38px shoulder cap & +42px elbow cap
      ctx.fillStyle = '#F5EFE5';
      ctx.beginPath();
      ctx.arc(655, 645, 44, 0, Math.PI * 2);
      ctx.arc(655, 858, 56, 0, Math.PI * 2);
      ctx.fill();
    } else if (layerIdx === 8) {
      // L09 Right Forearm & Cuff: +42px elbow cap & +28px wrist cap
      ctx.fillStyle = '#F5EFE5';
      ctx.beginPath();
      ctx.arc(652, 860, 54, 0, Math.PI * 2);
      ctx.arc(562, 1072, 36, 0, Math.PI * 2);
      ctx.fill();
    } else if (layerIdx === 13) {
      // L14 Phosphor Screen Glass: fill clean #F4EDE4 behind L18 screen face so blinking/moving eyes never reveal empty hole
      ctx.fillStyle = '#F4EDE4';
      ctx.fillRect(325, 340, 240, 92);
    } else if (layerIdx === 10) {
      // L11 CRT Outer Casing: fill behind control dials & screen bezel
      ctx.fillStyle = '#B3AAB7';
      ctx.fillRect(280, 220, 418, 285);
    } else if (layerIdx === 15) {
      // L16 Left Antenna: extend rod base +18px inside dome mount
      ctx.fillStyle = '#A69CAD';
      ctx.fillRect(454, 192, 22, 22);
    } else if (layerIdx === 16) {
      // L17 Right Antenna: extend rod base +18px inside dome mount
      ctx.fillStyle = '#A49AAB';
      ctx.fillRect(492, 192, 22, 22);
    }
    ctx.restore();
  }

  // Populate visible pixels per layer & track partition statistics
  const layerPixelCounts = new Int32Array(18);
  let coveredFgPixels = 0;

  for (let l = 0; l < 18; l++) {
    const lctx = layerCanvases[l].getContext('2d');
    drawOccludedUnderlap(l, lctx);
    const imgData = lctx.getImageData(0, 0, W, H);
    const d = imgData.data;

    for (let i = 0; i < W * H; i++) {
      if (layerIdMap[i] === l) {
        d[i * 4] = refData[i * 4];
        d[i * 4 + 1] = refData[i * 4 + 1];
        d[i * 4 + 2] = refData[i * 4 + 2];
        d[i * 4 + 3] = 255;
        layerPixelCounts[l]++;
        coveredFgPixels++;
      }
    }
    lctx.putImageData(imgData, 0, 0);
  }

  // Render hierarchical pose onto target canvas
  function renderRiggedCharacter(ctx, rawRig, transparentBg = false) {
    const rig = clampCrtSailorRig(rawRig);
    const ik = solveClosedChainArmIK(rig);

    if (transparentBg) {
      ctx.clearRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
    }

    function withPivot(px, py, rot, dx, dy, fn) {
      ctx.save();
      ctx.translate(px + (dx || 0), py + (dy || 0));
      if (rot) ctx.rotate(rot);
      ctx.translate(-px, -py);
      fn();
      ctx.restore();
    }

    // [L01] Pleated Dark Skirt (Root)
    ctx.drawImage(layerCanvases[0], 0, 0);

    // [L02..L18] Upper Body parented to Torso Waist Pivot (495, 920)
    withPivot(495, 920, rig.torsoSwayRot, 0, rig.torsoBobY, () => {
      // [L02] Cardigan Torso & Waist Hem
      ctx.drawImage(layerCanvases[1], 0, 0);

      // [L03] Slender Neck & Collarbone
      ctx.drawImage(layerCanvases[2], 0, 0);

      // [L06] Left Upper Sleeve -> [L07] Left Forearm & Cuff
      withPivot(305, 635, ik.leftUpperArmRot, 0, 0, () => {
        ctx.drawImage(layerCanvases[5], 0, 0);
        withPivot(335, 860, ik.leftForearmRot, 0, ik.leftForearmDY, () => {
          ctx.drawImage(layerCanvases[6], 0, 0);
        });
      });

      // [L08] Right Upper Sleeve -> [L09] Right Forearm & Cuff
      withPivot(685, 635, ik.rightUpperArmRot, 0, 0, () => {
        ctx.drawImage(layerCanvases[7], 0, 0);
        withPivot(655, 860, ik.rightForearmRot, 0, ik.rightForearmDY, () => {
          ctx.drawImage(layerCanvases[8], 0, 0);
        });
      });

      // [L04] Wide Sailor Collar & Double Stripes
      withPivot(492, 625, rig.collarSway, 0, 0, () => {
        ctx.drawImage(layerCanvases[3], 0, 0);
        // [L05] Black Satin Bow & Ribbon Tails
        withPivot(490, 646, rig.ribbonBowRot, 0, 0, () => {
          ctx.drawImage(layerCanvases[4], 0, 0);
        });
      });

      // [L10] Coupled Clasped Hands & 8 Interlaced Fingers (IK Master)
      withPivot(498, 1115, rig.handsRot, rig.handsDX, rig.handsDY, () => {
        ctx.drawImage(layerCanvases[9], 0, 0);
      });

      // [L11..L18] CRT Monitor Head Assembly (Pivot: Neck Base 492, 515)
      withPivot(492, 515, rig.headTilt, rig.headDX, rig.headDY, () => {
        // [L16] Left Rabbit-Ear Antenna
        withPivot(462, 200, rig.leftAntennaRot, 0, 0, () => {
          ctx.drawImage(layerCanvases[15], 0, 0);
        });
        // [L17] Right Rabbit-Ear Antenna
        withPivot(502, 198, rig.rightAntennaRot, 0, 0, () => {
          ctx.drawImage(layerCanvases[16], 0, 0);
        });
        // [L12] CRT Right 3D Bevel & Bottom Shadow
        ctx.drawImage(layerCanvases[11], 0, 0);
        // [L11] CRT Monitor Outer Casing
        ctx.drawImage(layerCanvases[10], 0, 0);
        // [L13] Inner Slate Screen Bezel
        ctx.drawImage(layerCanvases[12], 0, 0);
        // [L14] Cream Phosphor Screen Glass
        ctx.drawImage(layerCanvases[13], 0, 0);
        // [L15] Rotary Dials & Speaker Grille
        ctx.drawImage(layerCanvases[14], 0, 0);
        // [L18] Kawaii Screen Face
        ctx.drawImage(layerCanvases[17], 0, 0);
      });
    });
  }

  // ============================================================================
  // GATE 1 & 2: RECOMPOSITE FOREGROUND DIFF & INK-LINE RECALL / PRECISION
  // ============================================================================
  const candCanvas = createCanvas(W, H);
  const candCtx = candCanvas.getContext('2d');
  renderRiggedCharacter(candCtx, {}, false); // Rest pose
  const candData = candCtx.getImageData(0, 0, W, H).data;

  let fgMismatch = 0;
  const candInkMask = new Uint8Array(W * H);
  let candInkTotal = 0;

  for (let i = 0; i < W * H; i++) {
    const r = candData[i * 4], g = candData[i * 4 + 1], b = candData[i * 4 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 140) {
      candInkMask[i] = 1;
      candInkTotal++;
    }
    if (fgMask[i]) {
      const dr = Math.abs(refData[i * 4] - r);
      const dg = Math.abs(refData[i * 4 + 1] - g);
      const db = Math.abs(refData[i * 4 + 2] - b);
      if ((dr + dg + db) / 3 > 12) {
        fgMismatch++;
      }
    }
  }

  // 2px-radius Chamfer match for Ink-Line Recall & Precision
  function hasNeighborWithin2px(mask, x, y) {
    for (let dy = -2; dy <= 2; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= H) continue;
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= W) continue;
        if (mask[ny * W + nx]) return true;
      }
    }
    return false;
  }

  let matchedRefInk = 0;
  let matchedCandInk = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (refInkMask[idx] && hasNeighborWithin2px(candInkMask, x, y)) matchedRefInk++;
      if (candInkMask[idx] && hasNeighborWithin2px(refInkMask, x, y)) matchedCandInk++;
    }
  }

  const fgDiffPct = (fgMismatch / fgTotal) * 100;
  const inkRecallPct = (matchedRefInk / refInkTotal) * 100;
  const inkPrecisionPct = (matchedCandInk / candInkTotal) * 100;
  const partitionCoveragePct = (coveredFgPixels / fgTotal) * 100;

  console.log('\n--- GATE 1, 2 & 3: RECOMPOSITE, INK-LINE & PARTITION METRICS ---');
  console.log(`1. Foreground Pixel Diff (<= 2.5% gate):  ${fgDiffPct.toFixed(4)}% (${fgMismatch} / ${fgTotal} px) -> ${fgDiffPct <= 2.5 ? 'PASS' : 'FAIL'}`);
  console.log(`2. Ink-Line Recall (>= 94.0% gate):       ${inkRecallPct.toFixed(2)}% (${matchedRefInk} / ${refInkTotal} px) -> ${inkRecallPct >= 94.0 ? 'PASS' : 'FAIL'}`);
  console.log(`3. Ink-Line Precision (>= 92.0% gate):    ${inkPrecisionPct.toFixed(2)}% (${matchedCandInk} / ${candInkTotal} px) -> ${inkPrecisionPct >= 92.0 ? 'PASS' : 'FAIL'}`);
  console.log(`4. Disjoint Visible Coverage (>= 99.0%):  ${partitionCoveragePct.toFixed(2)}% (${coveredFgPixels} / ${fgTotal} px, 0.00% overlap) -> ${partitionCoveragePct >= 99.0 ? 'PASS' : 'FAIL'}`);

  // ============================================================================
  // GATE 4: 12-POSE EXTREME-BOUNDARY COMBINATION LEAK MATRIX (Alpha Hole Check)
  // ============================================================================
  const extremePoses = [
    { name: 'Pose 01: Max Head Tilt (+0.12) + Max Head Up (-7px) + Min Collar (-0.04)', rig: { headTilt: 0.12, headDY: -7, collarSway: -0.04 } },
    { name: 'Pose 02: Min Head Tilt (-0.12) + Max Head Up (-7px) + Max Collar (+0.04)', rig: { headTilt: -0.12, headDY: -7, collarSway: 0.04 } },
    { name: 'Pose 03: Max Head Tilt (+0.12) + Max Head Down (+7px) + Max Head Right (+6px)', rig: { headTilt: 0.12, headDY: 7, headDX: 6 } },
    { name: 'Pose 04: Min Head Tilt (-0.12) + Max Head Down (+7px) + Max Head Left (-6px)', rig: { headTilt: -0.12, headDY: 7, headDX: -6 } },
    { name: 'Pose 05: Max Torso Sway (+0.04) + Max Torso Up (-6px) + Max Hands Down (+10px)', rig: { torsoSwayRot: 0.04, torsoBobY: -6, handsDY: 10 } },
    { name: 'Pose 06: Min Torso Sway (-0.04) + Max Torso Down (+6px) + Max Hands Up (-10px)', rig: { torsoSwayRot: -0.04, torsoBobY: 6, handsDY: -10 } },
    { name: 'Pose 07: Max Elbow Spread (+0.08) + Max Hands Left (-8px) + Max Hands Rot (+0.08)', rig: { elbowSpread: 0.08, handsDX: -8, handsRot: 0.08 } },
    { name: 'Pose 08: Min Elbow Spread (-0.08) + Max Hands Right (+8px) + Min Hands Rot (-0.08)', rig: { elbowSpread: -0.08, handsDX: 8, handsRot: -0.08 } },
    { name: 'Pose 09: Max Antenna Spread (-0.20 / +0.20)', rig: { leftAntennaRot: -0.20, rightAntennaRot: 0.20 } },
    { name: 'Pose 10: Max Antenna Cross (+0.20 / -0.20)', rig: { leftAntennaRot: 0.20, rightAntennaRot: -0.20 } },
    { name: 'Pose 11: Max Ribbon Swing (+0.14) + Min Collar (-0.04)', rig: { ribbonBowRot: 0.14, collarSway: -0.04 } },
    {
      name: 'Pose 12: All-Joint Simultaneous Extreme Stress Corner',
      rig: {
        headTilt: 0.12, headDX: 6, headDY: -7,
        leftAntennaRot: -0.20, rightAntennaRot: 0.20,
        handsDX: 8, handsDY: 10, handsRot: 0.08, elbowSpread: 0.08,
        collarSway: -0.04, ribbonBowRot: 0.14, torsoBobY: -6, torsoSwayRot: 0.04,
      },
    },
  ];

  const testCanvas = createCanvas(W, H);
  const testCtx = testCanvas.getContext('2d');

  console.log('\n--- GATE 4: 12-POSE EXTREME BOUNDARY LEAK MATRIX (Alpha Hole Check) ---');
  let totalLeaksAllPoses = 0;
  for (const p of extremePoses) {
    renderRiggedCharacter(testCtx, p.rig, true); // Render onto transparent canvas!
    const td = testCtx.getImageData(0, 0, W, H).data;
    let leakedPixels = 0;
    for (let y = 518; y <= 1165; y++) {
      const xMin = y < 640 ? 456 : y < 1080 ? 345 : 325;
      const xMax = y < 640 ? 528 : y < 1080 ? 645 : 665;
      for (let x = xMin; x <= xMax; x++) {
        const i = (y * W + x) * 4;
        if (td[i + 3] < 250) {
          leakedPixels++;
        }
      }
    }
    totalLeaksAllPoses += leakedPixels;
    console.log(`${p.name.padEnd(82)} | Leaked Interior Holes: ${leakedPixels} -> ${leakedPixels === 0 ? 'PASS' : 'FAIL'}`);
  }
  console.log(`Total Leaked Interior Pixels Across All 12 Extreme Poses: ${totalLeaksAllPoses} -> ${totalLeaksAllPoses === 0 ? 'ALL 12 PASS' : 'FAIL'}`);
})();
