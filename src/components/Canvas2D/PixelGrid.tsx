import { useRef, useEffect } from 'react';
import { useBeadStore } from '../../stores/beadStore';

const CELL_SIZE = 16;

export function PixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const viewSettings = useBeadStore((s) => s.viewSettings);
  const setHoveredPixel = useBeadStore((s) => s.setHoveredPixel);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, pixels } = grid;
    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;

    // Create color map
    const colorMap = new Map(palette.map((c) => [c.id, c.hex]));

    // Draw checkerboard background for transparency effect (dark theme)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isLight = (x + y) % 2 === 0;
        ctx.fillStyle = isLight ? '#1a1a1a' : '#262626';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const colorId = pixels[y][x];
        const hex = colorMap.get(colorId);
        if (hex) {
          ctx.fillStyle = hex;
          // Leave small gap for grid effect
          ctx.fillRect(
            x * CELL_SIZE + 0.5,
            y * CELL_SIZE + 0.5,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        }
      }
    }

    // Draw hover highlight
    if (viewSettings.hoveredPixel) {
      const { x, y } = viewSettings.hoveredPixel;
      ctx.strokeStyle = '#f5f5f5';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        x * CELL_SIZE + 1,
        y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    }
  }, [grid, palette, viewSettings.hoveredPixel]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!grid || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // Calculate actual scale (accounts for CSS max-w-full scaling)
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
      setHoveredPixel({ x, y });
    } else {
      setHoveredPixel(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPixel(null);
  };

  if (!grid) {
    return (
      <div className="flex items-center justify-center h-96 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
        <p className="text-[var(--color-text-muted)]">请上传图片生成图纸</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] p-4 overflow-auto">
      <div className="mb-2 text-sm text-[var(--color-text-secondary)]">
        {grid.width} x {grid.height} 像素 | 悬浮查看详情
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="max-w-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
      {viewSettings.hoveredPixel && (
        <HoverInfo grid={grid} palette={palette} pixel={viewSettings.hoveredPixel} />
      )}
    </div>
  );
}

function HoverInfo({
  grid,
  palette,
  pixel,
}: {
  grid: NonNullable<ReturnType<typeof useBeadStore.getState>['grid']>;
  palette: ReturnType<typeof useBeadStore.getState>['palette'];
  pixel: { x: number; y: number };
}) {
  const colorId = grid.pixels[pixel.y][pixel.x];
  const color = palette.find((c) => c.id === colorId);

  return (
    <div className="mt-2 text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
      <span>
        位置: ({pixel.x}, {pixel.y})
      </span>
      {color && (
        <>
          <div
            className="w-4 h-4 rounded border border-[var(--color-border)]"
            style={{ backgroundColor: color.hex }}
          />
          <span>
            {color.id === color.name ? color.name : `${color.id} · ${color.name}`} ({color.hex})
          </span>
          <span className="text-[var(--color-text-muted)]">[{color.brand.toUpperCase()}]</span>
        </>
      )}
    </div>
  );
}
