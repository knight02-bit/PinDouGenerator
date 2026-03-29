import { useBeadStore } from '../../stores/beadStore';
import type { BeadColor } from '../../types';
import { useState } from 'react';

export function ColorReplacer() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const replaceColor = useBeadStore((s) => s.replaceColor);
  const undoColorReplacement = useBeadStore((s) => s.undoColorReplacement);
  const colorReplacements = useBeadStore((s) => s.colorReplacements);

  // Track selected replacement for each color
  const [selectedReplacements, setSelectedReplacements] = useState<Record<string, string>>({});

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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">颜色替换</h3>
        {colorReplacements.length > 0 && (
          <button
            onClick={undoColorReplacement}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
          >
            撤销 ({colorReplacements.length})
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {usedColors.map((color) => {
          const selectedId = selectedReplacements[color.id];

          return (
            <div key={color.id} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-gray-300 flex-1 truncate">{color.name}</span>
              <select
                className="bg-gray-700 text-xs rounded px-1 py-0.5"
                value={selectedId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    replaceColor(color.id, value);
                    setSelectedReplacements((prev) => ({ ...prev, [color.id]: value }));
                  }
                }}
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
          );
        })}
      </div>
    </div>
  );
}
