import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useBeadStore } from '../../stores/beadStore';
import { BeadMesh } from './BeadMesh';

export function BeadScene() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const viewSettings = useBeadStore((s) => s.viewSettings);
  const setHoveredPixel = useBeadStore((s) => s.setHoveredPixel);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!grid) {
    return (
      <div className="flex items-center justify-center h-96 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
        <p className="text-[var(--color-text-muted)]">请上传图片生成图纸</p>
      </div>
    );
  }

  const colorMap = new Map(palette.map((c) => [c.id, c]));
  const centerX = grid.width / 2;
  const centerY = grid.height / 2;

  const hoveredColorId = viewSettings.hoveredPixel
    ? grid.pixels[viewSettings.hoveredPixel.y][viewSettings.hoveredPixel.x]
    : null;
  const hoveredColor = hoveredColorId ? colorMap.get(hoveredColorId) : null;

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="p-2 border-b border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
        3D视图 - 拖拽旋转 | 滚轮缩放
      </div>
      <div
        className="h-[500px] relative"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 60]} />
          <OrbitControls enablePan enableZoom enableRotate />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />
          <directionalLight position={[-10, -10, -10]} intensity={0.3} />

          {grid.pixels.map((row, y) =>
            row.map((colorId, x) => {
              const color = colorMap.get(colorId);
              if (!color) return null;

              const isHovered =
                viewSettings.hoveredPixel?.x === x &&
                viewSettings.hoveredPixel?.y === y;

              return (
                <BeadMesh
                  key={`${x}-${y}`}
                  position={[
                    (x - centerX) * 1.2,
                    (centerY - y) * 1.2,
                    0,
                  ]}
                  color={color.hex}
                  isHovered={isHovered}
                  beadStyle={viewSettings.beadStyle}
                  onPointerEnter={() => setHoveredPixel({ x, y })}
                  onPointerLeave={() => setHoveredPixel(null)}
                />
              );
            })
          )}
        </Canvas>

        {hoveredColor && (
          <div
            className="fixed pointer-events-none z-50 px-3 py-2 rounded-lg backdrop-blur-md border border-white/20 shadow-lg"
            style={{
              left: mousePos.x + 16,
              top: mousePos.y + 16,
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              minWidth: '80px',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-white/30 shrink-0"
                style={{ backgroundColor: hoveredColor.hex }}
              />
              <span className="text-white font-medium text-sm">{hoveredColorId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
