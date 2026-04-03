import { create } from 'zustand';
import type { BeadBrand, BeadColor, BeadGrid, ViewSettings, ExportSettings, ColorReplacement } from '../types';
import { hamaColors } from '../utils/hamaColors';
import { mardColors } from '../utils/mardColors';
import { perlerColors } from '../utils/perlerColors';
import { quantizeImage } from '../utils/colorQuantization';

const brandPalettes: Record<BeadBrand, BeadColor[]> = {
  hama: hamaColors,
  perler: perlerColors,
  mard: mardColors,
};

interface BeadStore {
  // Brand & Palette
  currentBrand: BeadBrand;
  palette: BeadColor[];
  setBrand: (brand: BeadBrand) => void;

  // Grid data
  grid: BeadGrid | null;
  setGrid: (grid: BeadGrid) => void;
  updatePixel: (x: number, y: number, colorId: string) => void;

  // Grid dimensions
  gridWidth: number;
  gridHeight: number;
  setGridSize: (width: number, height: number) => void;

  // Original image data for regeneration
  originalImageData: ImageData | null;

  // Original image dimensions (for preset generation)
  originalImageWidth: number;
  originalImageHeight: number;

  // Image aspect ratio for preset suggestions
  imageAspectRatio: number | null;
  suggestedPresets: { width: number; height: number }[];

  // Lock aspect ratio when manually changing custom size
  lockAspectRatio: boolean;

  // View settings
  viewSettings: ViewSettings;
  setViewMode: (mode: '2d' | '3d') => void;
  setBeadStyle: (style: 'cylinder' | 'sphere') => void;
  setHoveredPixel: (pixel: { x: number; y: number } | null) => void;

  // Export settings
  exportSettings: ExportSettings;
  setExportSettings: (settings: Partial<ExportSettings>) => void;

  // Color replacement history
  colorReplacements: ColorReplacement[];
  replaceColor: (fromColorId: string, toColorId: string) => void;
  undoColorReplacement: () => void;

  // Generate grid from palette
  generateGridFromPalette: (imageData: ImageData) => void;
}

export const useBeadStore = create<BeadStore>((set, get) => ({
  currentBrand: 'hama',
  palette: hamaColors,
  grid: null,
  gridWidth: 29,
  gridHeight: 29,
  originalImageData: null,
  originalImageWidth: 0,
  originalImageHeight: 0,
  imageAspectRatio: null,
  suggestedPresets: [],
  lockAspectRatio: true,
  viewSettings: {
    viewMode: '2d',
    beadStyle: 'cylinder',
    showGrid: true,
    hoveredPixel: null,
  },
  exportSettings: {
    format: 'png',
    scale: 2,
    includePalette: true,
  },
  colorReplacements: [],

  setBrand: (brand) => {
    const palette = brandPalettes[brand];
    set({ currentBrand: brand, palette });
    // Regenerate grid with new palette if we have original image data
    const { originalImageData } = get();
    if (originalImageData) {
      get().generateGridFromPalette(originalImageData);
    }
  },

  setGrid: (grid) => set({ grid }),

  updatePixel: (x, y, newColorId) => {
    const { grid } = get();
    if (!grid) return;
    const newPixels = grid.pixels.map((row, ry) =>
      row.map((oldColorId, rx) => (rx === x && ry === y ? newColorId : oldColorId))
    );
    set({ grid: { ...grid, pixels: newPixels } });
  },

  setGridSize: (width, height) => {
    const { originalImageData } = get();
    set({ gridWidth: width, gridHeight: height });
    // Regenerate grid with new size if we have original image data
    if (originalImageData) {
      get().generateGridFromPalette(originalImageData);
    }
  },

  setViewMode: (mode) =>
    set((state) => ({
      viewSettings: { ...state.viewSettings, viewMode: mode },
    })),

  setBeadStyle: (style) =>
    set((state) => ({
      viewSettings: { ...state.viewSettings, beadStyle: style },
    })),

  setHoveredPixel: (pixel) =>
    set((state) => ({
      viewSettings: { ...state.viewSettings, hoveredPixel: pixel },
    })),

  setExportSettings: (settings) =>
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...settings },
    })),

  replaceColor: (fromColorId, toColorId) => {
    const { grid, colorReplacements } = get();
    if (!grid) return;
    const newPixels = grid.pixels.map((row) =>
      row.map((colorId) => (colorId === fromColorId ? toColorId : colorId))
    );
    set({
      grid: { ...grid, pixels: newPixels },
      colorReplacements: [...colorReplacements, { fromId: fromColorId, toId: toColorId }],
    });
  },

  undoColorReplacement: () => {
    const { grid, colorReplacements } = get();
    if (!grid || colorReplacements.length === 0) return;
    const lastReplacement = colorReplacements[colorReplacements.length - 1];
    const newPixels = grid.pixels.map((row) =>
      row.map((colorId) => (colorId === lastReplacement.toId ? lastReplacement.fromId : colorId))
    );
    set({
      grid: { ...grid, pixels: newPixels },
      colorReplacements: colorReplacements.slice(0, -1),
    });
  },

  generateGridFromPalette: (imageData) => {
    const { palette, gridWidth, gridHeight } = get();
    const { width: imgW, height: imgH } = imageData;

    // Calculate grid size maintaining image aspect ratio
    // The larger dimension will be capped to the current grid setting
    const aspectRatio = imgW / imgH;
    let targetWidth = gridWidth;
    let targetHeight = gridHeight;

    if (aspectRatio > 1) {
      // Image is wider, cap width and scale height
      targetHeight = Math.round(gridWidth / aspectRatio);
    } else {
      // Image is taller, cap height and scale width
      targetWidth = Math.round(gridHeight * aspectRatio);
    }

    // Ensure minimum size of 1
    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    // Generate suggested presets based on original image dimensions
    // This uses the IMAGE dimensions, not current grid settings
    const suggestedPresets = generateSuggestedPresets(imgW, imgH);

    const pixels = quantizeImage(imageData, palette, targetWidth, targetHeight);
    set({
      grid: { width: targetWidth, height: targetHeight, pixels },
      originalImageData: imageData,
      originalImageWidth: imgW,
      originalImageHeight: imgH,
      imageAspectRatio: aspectRatio,
      suggestedPresets,
      colorReplacements: [],
    });
  },
}));

function generateSuggestedPresets(imgWidth: number, imgHeight: number): { width: number; height: number }[] {
  const aspectRatio = imgWidth / imgHeight;
  const presets = new Map<string, { width: number; height: number }>();

  // Standard sizes to generate presets at
  // These maintain the image aspect ratio at different scales
  const standardMaxSizes = [35, 40, 50, 80, 120, 150];

  for (const maxSize of standardMaxSizes) {
    let width: number;
    let height: number;

    if (aspectRatio >= 1) {
      // Landscape or square - width is the larger dimension
      width = Math.min(maxSize, 200);
      height = Math.round(width / aspectRatio);
    } else {
      // Portrait - height is the larger dimension
      height = Math.min(maxSize, 200);
      width = Math.round(height * aspectRatio);
    }

    // Ensure minimum size
    width = Math.max(1, width);
    height = Math.max(1, height);

    // Only add if both dimensions are within reasonable range
    if (width >= 5 && height >= 5 && width <= 200 && height <= 200) {
      const key = `${width}x${height}`;
      // Avoid duplicate entries
      if (!presets.has(key)) {
        presets.set(key, { width, height });
      }
    }
  }

  // Return sorted by total size (smallest first)
  return Array.from(presets.values())
    .sort((a, b) => (a.width * a.height) - (b.width * b.height))
    .slice(0, 6);
}
