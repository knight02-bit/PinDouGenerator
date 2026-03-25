import { useBeadStore } from '../../stores/beadStore';

export function ColorPaletteDisplay() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);

  if (!grid || !grid.pixels) return null;

  // Get unique colors used in grid
  const usedColorIds = [...new Set(grid.pixels.flat())];
  const usedColors = usedColorIds
    .map((id) => palette.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        颜色图例 ({usedColors.length} 种)
      </h3>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {usedColors.map((color) => (
          <div
            key={color!.id}
            className="flex flex-col items-center gap-1"
            title={`${color!.name}\n${color!.hex}`}
          >
            <div
              className="w-8 h-8 rounded border border-gray-600"
              style={{ backgroundColor: color!.hex }}
            />
            <span className="text-[10px] text-gray-500 truncate w-full text-center">
              {color!.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
