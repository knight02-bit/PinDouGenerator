import { create } from 'zustand';
import type { BeadColor, BeadGrid, ViewSettings, ExportSettings } from '../types';
import { hamaColors } from '../utils/hamaColors';
import { perlerColors } from '../utils/perlerColors';
import { quantizeImage } from '../utils/colorQuantization';

interface BeadStore {
  // Brand & Palette
  currentBrand: 'hama' | 'perler';
  palette: BeadColor[];
  setBrand: (brand: 'hama' | 'perler') => void;

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

  // View settings
  viewSettings: ViewSettings;
  setViewMode: (mode: '2d' | '3d') => void;
  setBeadStyle: (style: 'cylinder' | 'sphere') => void;
  setHoveredPixel: (pixel: { x: number; y: number } | null) => void;

  // Export settings
  exportSettings: ExportSettings;
  setExportSettings: (settings: Partial<ExportSettings>) => void;

  // Color replacement
  replaceColor: (fromColorId: string, toColorId: string) => void;

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

  setBrand: (brand) => {
    const palette = brand === 'hama' ? hamaColors : perlerColors;
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
    const { grid } = get();
    if (!grid) return;
    const newPixels = grid.pixels.map((row) =>
      row.map((colorId) => (colorId === fromColorId ? toColorId : colorId))
    );
    set({ grid: { ...grid, pixels: newPixels } });
  },

  generateGridFromPalette: (imageData) => {
    const { palette, gridWidth, gridHeight } = get();
    const pixels = quantizeImage(imageData, palette, gridWidth, gridHeight);
    set({
      grid: { width: gridWidth, height: gridHeight, pixels },
      originalImageData: imageData,
    });
  },
}));
