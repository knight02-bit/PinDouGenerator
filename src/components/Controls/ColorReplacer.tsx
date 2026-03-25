import { useBeadStore } from '../../stores/beadStore';
import type { BeadColor } from '../../types';

export function ColorReplacer() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const replaceColor = useBeadStore((s) => s.replaceColor);

  // Get unique colors used in grid
  const usedColorIds = grid?.pixels
    ? [...new Set(grid.pixels.flat())]
    : [];
  const usedColors = usedColorIds
    .map((id) => palette.find((c) => c.id === id))
    .filter((c): c is BeadColor => c !== undefined);

  if (usedColors.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">颜色替换</h3>
        <p className="text-xs text-gray-500">先生成图纸后再进行颜色替换</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">颜色替换</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {usedColors.map((color) => (
          <div key={color.id} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs text-gray-300 flex-1 truncate">{color.name}</span>
            <select
              className="bg-gray-700 text-xs rounded px-1 py-0.5"
              onChange={(e) => {
                if (e.target.value) {
                  replaceColor(color.id, e.target.value);
                }
              }}
              defaultValue=""
            >
              <option value="">替换为...</option>
              {palette
                .filter((p) => p.id !== color.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
