import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useBeadStore } from '../../stores/beadStore';
import { BeadMesh } from './BeadMesh';

export function BeadScene() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const viewSettings = useBeadStore((s) => s.viewSettings);
  const setHoveredPixel = useBeadStore((s) => s.setHoveredPixel);

  if (!grid) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-500">请上传图片生成图纸</p>
      </div>
    );
  }

  const colorMap = new Map(palette.map((c) => [c.id, c]));
  const centerX = grid.width / 2;
  const centerY = grid.height / 2;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-2 border-b border-gray-700 text-sm text-gray-400">
        3D视图 - 拖拽旋转 | 滚轮缩放
      </div>
      <div className="h-[500px]">
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
      </div>
    </div>
  );
}
