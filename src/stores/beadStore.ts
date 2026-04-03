import { create } from 'zustand';
import type {
  BeadBrand,
  BeadColor,
  BeadGrid,
  ViewSettings,
  ExportSettings,
  ColorReplacement,
  MardPaletteMode,
} from '../types';
import { hamaColors } from '../utils/hamaColors';
import { mardBasicColors, mardFullColors } from '../utils/mardColors';
import { perlerColors } from '../utils/perlerColors';
import { quantizeImage } from '../utils/colorQuantization';

const brandPalettes: Record<BeadBrand, BeadColor[]> = {
  hama: hamaColors,
  perler: perlerColors,
  mard: mardBasicColors,
};

const mardPalettes: Record<MardPaletteMode, BeadColor[]> = {
  basic: mardBasicColors,
  full: mardFullColors,
};

interface BeadStore {
  currentBrand: BeadBrand;
  mardPaletteMode: MardPaletteMode;
  palette: BeadColor[];
  setBrand: (brand: BeadBrand) => void;
  setMardPaletteMode: (mode: MardPaletteMode) => void;

  grid: BeadGrid | null;
  setGrid: (grid: BeadGrid) => void;
  updatePixel: (x: number, y: number, colorId: string) => void;

  gridWidth: number;
  gridHeight: number;
  setGridSize: (width: number, height: number) => void;

  originalImageData: ImageData | null;

  originalImageWidth: number;
  originalImageHeight: number;

  imageAspectRatio: number | null;
  suggestedPresets: { width: number; height: number }[];

  lockAspectRatio: boolean;

  viewSettings: ViewSettings;
  setViewMode: (mode: '2d' | '3d') => void;
  setBeadStyle: (style: 'cylinder' | 'sphere') => void;
  setHoveredPixel: (pixel: { x: number; y: number } | null) => void;

  exportSettings: ExportSettings;
  setExportSettings: (settings: Partial<ExportSettings>) => void;

  colorReplacements: ColorReplacement[];
  replaceColor: (fromColorId: string, toColorId: string) => void;
  undoColorReplacement: () => void;

  generateGridFromPalette: (imageData: ImageData) => void;
}

function getPaletteForBrand(brand: BeadBrand, mardPaletteMode: MardPaletteMode) {
  if (brand === 'mard') {
    return mardPalettes[mardPaletteMode];
  }

  return brandPalettes[brand];
}

export const useBeadStore = create<BeadStore>((set, get) => ({
  currentBrand: 'hama',
  mardPaletteMode: 'basic',
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
    const { mardPaletteMode } = get();
    const palette = getPaletteForBrand(brand, mardPaletteMode);
    set({ currentBrand: brand, palette });
    const { originalImageData } = get();
    if (originalImageData) {
      get().generateGridFromPalette(originalImageData);
    }
  },

  setMardPaletteMode: (mode) => {
    const { currentBrand, originalImageData } = get();
    const nextState: Pick<BeadStore, 'mardPaletteMode' | 'palette'> = {
      mardPaletteMode: mode,
      palette: currentBrand === 'mard' ? mardPalettes[mode] : get().palette,
    };

    set(nextState);

    if (currentBrand === 'mard' && originalImageData) {
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

    const aspectRatio = imgW / imgH;
    let targetWidth = gridWidth;
    let targetHeight = gridHeight;

    if (aspectRatio > 1) {
      targetHeight = Math.round(gridWidth / aspectRatio);
    } else {
      targetWidth = Math.round(gridHeight * aspectRatio);
    }

    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

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

  const standardMaxSizes = [35, 40, 50, 80, 120, 150];

  for (const maxSize of standardMaxSizes) {
    let width: number;
    let height: number;

    if (aspectRatio >= 1) {
      width = Math.min(maxSize, 200);
      height = Math.round(width / aspectRatio);
    } else {
      height = Math.min(maxSize, 200);
      width = Math.round(height * aspectRatio);
    }

    width = Math.max(1, width);
    height = Math.max(1, height);

    if (width >= 5 && height >= 5 && width <= 200 && height <= 200) {
      const key = `${width}x${height}`;
      if (!presets.has(key)) {
        presets.set(key, { width, height });
      }
    }
  }

  return Array.from(presets.values())
    .sort((a, b) => (a.width * a.height) - (b.width * b.height))
    .slice(0, 6);
}
