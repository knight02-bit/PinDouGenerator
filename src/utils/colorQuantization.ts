import type { BeadColor } from '../types';

/**
 * Calculate Euclidean distance between two RGB colors
 */
function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const dr = rgb1[0] - rgb2[0];
  const dg = rgb1[1] - rgb2[1];
  const db = rgb1[2] - rgb2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Find the nearest bead color from palette for a given RGB color
 */
export function findNearestColor(
  rgb: [number, number, number],
  palette: BeadColor[]
): BeadColor {
  let nearest = palette[0];
  let minDistance = colorDistance(rgb, nearest.rgb);

  for (let i = 1; i < palette.length; i++) {
    const distance = colorDistance(rgb, palette[i].rgb);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = palette[i];
    }
  }

  return nearest;
}

/**
 * Convert image data to bead grid using color quantization
 */
export function quantizeImage(
  imageData: ImageData,
  palette: BeadColor[],
  targetWidth: number,
  targetHeight: number
): string[][] {
  const { data, width, height } = imageData;

  // Calculate scaling ratios
  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;

  const grid: string[][] = [];

  for (let y = 0; y < targetHeight; y++) {
    const row: string[] = [];
    for (let x = 0; x < targetWidth; x++) {
      // Sample center pixel of the source region
      const srcX = Math.floor((x + 0.5) * scaleX);
      const srcY = Math.floor((y + 0.5) * scaleY);
      const idx = (srcY * width + srcX) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const nearest = findNearestColor([r, g, b], palette);
      row.push(nearest.id);
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Median Cut color quantization algorithm
 * Returns the dominant colors from an image
 */
export function medianCut(
  imageData: ImageData,
  numColors: number
): [number, number, number][] {
  const { data } = imageData;

  // Collect all pixels as RGB arrays
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Split palette recursively
  function split(colors: [number, number, number][], depth: number): [number, number, number][][] {
    if (depth === 0 || colors.length <= 1) {
      return [colors];
    }

    // Find the channel with the greatest range
    let rMin = 255, rMax = 0;
    let gMin = 255, gMax = 0;
    let bMin = 255, bMax = 0;

    for (const [r, g, b] of colors) {
      rMin = Math.min(rMin, r); rMax = Math.max(rMax, r);
      gMin = Math.min(gMin, g); gMax = Math.max(gMax, g);
      bMin = Math.min(bMin, b); bMax = Math.max(bMax, b);
    }

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    let sortIndex: 0 | 1 | 2 = 0;
    let maxRange = rRange;
    if (gRange > maxRange) { maxRange = gRange; sortIndex = 1; }
    if (bRange > maxRange) { sortIndex = 2; }

    // Sort by the channel with greatest range
    colors.sort((a, b) => a[sortIndex] - b[sortIndex]);

    // Split at median
    const mid = Math.floor(colors.length / 2);
    const left = colors.slice(0, mid);
    const right = colors.slice(mid);

    return [...split(left, depth - 1), ...split(right, depth - 1)];
  }

  // Average each bucket to get final colors
  const buckets = split(pixels, Math.ceil(Math.log2(numColors)));
  const result: [number, number, number][] = [];

  for (const bucket of buckets) {
    if (bucket.length === 0) continue;
    const r = Math.round(bucket.reduce((sum, c) => sum + c[0], 0) / bucket.length);
    const g = Math.round(bucket.reduce((sum, c) => sum + c[1], 0) / bucket.length);
    const b = Math.round(bucket.reduce((sum, c) => sum + c[2], 0) / bucket.length);
    result.push([r, g, b]);
  }

  return result.slice(0, numColors);
}
