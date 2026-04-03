export type BeadBrand = 'hama' | 'perler' | 'mard';
export type MardPaletteMode = 'basic' | 'full';

export interface BeadColor {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  brand: BeadBrand;
}

export interface Pixel {
  x: number;
  y: number;
  colorId: string;
}

export interface BeadGrid {
  width: number;
  height: number;
  pixels: string[][]; // colorId grid
}

export interface ViewSettings {
  viewMode: '2d' | '3d';
  beadStyle: 'cylinder' | 'sphere';
  showGrid: boolean;
  hoveredPixel: { x: number; y: number } | null;
}

export interface ExportSettings {
  format: 'png' | 'pdf';
  scale: number;
  includePalette: boolean;
}

export interface ColorReplacement {
  fromId: string;
  toId: string;
}
