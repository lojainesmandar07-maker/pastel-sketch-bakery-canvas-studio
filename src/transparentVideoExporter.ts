/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * INSTANT VIDEO & AFTER EFFECTS TRANSPARENT ALPHA EXPORTER
 * - Supports 100% Transparent Background (`rgba(0,0,0,0)`) for Adobe After Effects,
 *   Premiere Pro, DaVinci Resolve, Final Cut Pro, and CapCut.
 * - Mode 1: Fast WebM Alpha Video (`.webm` with VP9/VP8 Alpha Channel — never opaque H.264 when transparent!).
 * - Mode 2: Normal Video Save (`.mp4` / `.webm` with standard background).
 * - Mode 3: Instant After Effects Transparent PNG Sequence (`.zip` with 32-bit RGBA PNG frames,
 *   rendered offline at full speed without waiting for real-time playback).
 */

// Precomputed CRC32 table for standard ZIP archive creation
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipEntryInput {
  name: string;
  data: Uint8Array;
}

/**
 * Builds a standard uncompressed ZIP archive Blob in memory (zero external dependencies).
 * Works natively with macOS Archive Utility, Windows Explorer, and Adobe After Effects.
 */
export function buildZipBlob(entries: ZipEntryInput[]): Blob {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const size = data.byteLength;

    // Local file header (30 bytes + file name)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
    lv.setUint16(6, 0, true);          // General purpose bit flag
    lv.setUint16(8, 0, true);          // Compression method (0 = STORE, PNGs are already compressed)
    lv.setUint16(10, 0, true);         // Last mod file time
    lv.setUint16(12, 0x5421, true);    // Last mod file date
    lv.setUint32(14, crc, true);       // CRC-32
    lv.setUint32(18, size, true);      // Compressed size
    lv.setUint32(22, size, true);      // Uncompressed size
    lv.setUint16(26, nameBytes.length, true); // File name length
    lv.setUint16(28, 0, true);         // Extra field length
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, data);

    // Central directory file header (46 bytes + file name)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central file header signature
    cv.setUint16(4, 20, true);         // Version made by
    cv.setUint16(6, 20, true);         // Version needed to extract
    cv.setUint16(8, 0, true);          // General purpose bit flag
    cv.setUint16(10, 0, true);         // Compression method (0 = STORE)
    cv.setUint16(12, 0, true);         // Last mod file time
    cv.setUint16(14, 0x5421, true);    // Last mod file date
    cv.setUint32(16, crc, true);       // CRC-32
    cv.setUint32(20, size, true);      // Compressed size
    cv.setUint32(24, size, true);      // Uncompressed size
    cv.setUint16(28, nameBytes.length, true); // File name length
    cv.setUint16(30, 0, true);         // Extra field length
    cv.setUint16(32, 0, true);         // File comment length
    cv.setUint16(34, 0, true);         // Disk number start
    cv.setUint16(36, 0, true);         // Internal file attributes
    cv.setUint32(38, 0, true);         // External file attributes
    cv.setUint32(42, offset, true);    // Relative offset of local header
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.byteLength + size;
  }

  let centralSize = 0;
  for (const c of centralChunks) centralSize += c.byteLength;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // EOCD signature
  ev.setUint16(4, 0, true);          // Number of this disk
  ev.setUint16(6, 0, true);          // Disk where central directory starts
  ev.setUint16(8, entries.length, true);  // Number of central directory records on this disk
  ev.setUint16(10, entries.length, true); // Total number of central directory records
  ev.setUint32(12, centralSize, true);    // Size of central directory
  ev.setUint32(16, offset, true);         // Offset of start of central directory
  ev.setUint16(20, 0, true);              // Comment length

  return new Blob([...localChunks, ...centralChunks, eocd] as unknown as BlobPart[], {
    type: 'application/zip',
  });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

/**
 * Selects the best MediaRecorder MIME type.
 * CRITICAL FOR AFTER EFFECTS / VIDEO EDITORS:
 * Standard H.264 MP4 (`video/mp4`) does NOT support an alpha channel and forces
 * transparent canvas pixels to turn solid black!
 * Therefore:
 * - When `transparentBg === true`, we MUST select `video/webm;codecs=vp9` or `vp8`
 *   (which natively encode the 8-bit Alpha channel `yuva420p`).
 * - When `transparentBg === false` (Normal Video Save), we prefer `video/mp4` first, then `video/webm`.
 */
export function selectBestVideoMimeType(transparentBg: boolean): {
  mimeType: string;
  ext: string;
  supportsAlpha: boolean;
} {
  const alphaCandidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  const normalCandidates = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  const list = transparentBg ? alphaCandidates : normalCandidates;
  for (const m of list) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      return {
        mimeType: m,
        ext: m.includes('mp4') ? 'mp4' : 'webm',
        supportsAlpha: m.includes('webm'),
      };
    }
  }
  return {
    mimeType: 'video/webm',
    ext: 'webm',
    supportsAlpha: true,
  };
}

/**
 * Instant Offline Render of a 32-Bit RGBA Transparent PNG Sequence (.ZIP) for Adobe After Effects.
 * Renders every frame deterministically without waiting for real-time playback!
 */
export async function exportAfterEffectsPngSequenceZip(options: {
  width: number;
  height: number;
  durationSec: number;
  fps: number;
  filePrefix: string;
  renderFrameAtTime: (ctx: CanvasRenderingContext2D, timeSec: number) => void;
  onProgress?: (currentFrame: number, totalFrames: number) => void;
}): Promise<{ blobUrl: string; filename: string; totalFrames: number }> {
  const { width, height, durationSec, fps, filePrefix, renderFrameAtTime, onProgress } = options;
  const totalFrames = Math.max(2, Math.min(360, Math.round(durationSec * fps)));

  const offCanvas = document.createElement('canvas');
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext('2d', { alpha: true })!;

  const entries: ZipEntryInput[] = [];
  const encoder = new TextEncoder();

  const guideText = [
    `ADOBE AFTER EFFECTS / PREMIERE PRO / DAVINCI RESOLVE — TRANSPARENT ALPHA IMPORT GUIDE`,
    `=====================================================================================`,
    `Character Export : ${filePrefix}`,
    `Resolution       : ${width} x ${height} px (32-bit RGBA Straight Unmatted Alpha)`,
    `Frame Rate       : ${fps} FPS`,
    `Total Frames     : ${totalFrames} frames (${durationSec.toFixed(2)}s seamless loop)`,
    ``,
    `HOW TO IMPORT INTO ADOBE AFTER EFFECTS WITH TRANSPARENT BACKGROUND:`,
    `1. Unzip this folder.`,
    `2. In After Effects, press Ctrl+I (Cmd+I on Mac) or go to File > Import > File...`,
    `3. Select "frame_0001.png" and check the "PNG Sequence" box at the bottom of the dialog.`,
    `4. Right-click the imported footage > Interpret Footage > Main:`,
    `   - Set Frame Rate to ${fps} FPS.`,
    `   - Set Loop to as many times as you need (e.g. 10).`,
    `   - Alpha is automatically Straight (Unmatted) 100% Transparent!`,
  ].join('\n');

  entries.push({
    name: 'AFTER_EFFECTS_IMPORT_GUIDE.txt',
    data: encoder.encode(guideText),
  });

  for (let i = 0; i < totalFrames; i++) {
    const t = (i / totalFrames) * durationSec;
    offCtx.clearRect(0, 0, width, height);
    renderFrameAtTime(offCtx, t);

    const dataUrl = offCanvas.toDataURL('image/png');
    const pngBytes = dataUrlToUint8Array(dataUrl);
    const frameName = `frame_${String(i + 1).padStart(4, '0')}.png`;
    entries.push({ name: frameName, data: pngBytes });

    if (onProgress) {
      onProgress(i + 1, totalFrames);
    }
    // Yield every 6 frames so the UI progress bar updates smoothly
    if (i % 6 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const zipBlob = buildZipBlob(entries);
  const blobUrl = URL.createObjectURL(zipBlob);
  const filename = `${filePrefix}_after_effects_transparent_${fps}fps.zip`;

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  a.click();

  return { blobUrl, filename, totalFrames };
}
