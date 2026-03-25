import { useBeadStore } from '../../stores/beadStore';

const PRESET_SIZES = [
  { label: '10x10', width: 10, height: 10 },
  { label: '15x15', width: 15, height: 15 },
  { label: '29x29 (Hama板)', width: 29, height: 29 },
  { label: '50x50', width: 50, height: 50 },
];

export function SizeSelector() {
  const gridWidth = useBeadStore((s) => s.gridWidth);
  const gridHeight = useBeadStore((s) => s.gridHeight);
  const setGridSize = useBeadStore((s) => s.setGridSize);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">图纸规格</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {PRESET_SIZES.map((size) => (
          <button
            key={size.label}
            onClick={() => setGridSize(size.width, size.height)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              gridWidth === size.width && gridHeight === size.height
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="5"
          max="100"
          value={gridWidth}
          onChange={(e) => setGridSize(parseInt(e.target.value) || 10, gridHeight)}
          className="w-16 px-2 py-1 bg-gray-700 rounded text-sm text-center"
        />
        <span className="text-gray-500">x</span>
        <input
          type="number"
          min="5"
          max="100"
          value={gridHeight}
          onChange={(e) => setGridSize(gridWidth, parseInt(e.target.value) || 10)}
          className="w-16 px-2 py-1 bg-gray-700 rounded text-sm text-center"
        />
        <span className="text-xs text-gray-500 ml-2">自定义尺寸</span>
      </div>
    </div>
  );
}
