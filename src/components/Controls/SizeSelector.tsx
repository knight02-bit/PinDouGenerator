import { useBeadStore } from '../../stores/beadStore';
import { useState, useEffect } from 'react';

const DEFAULT_PRESETS = [
  { label: '10x10', width: 10, height: 10 },
  { label: '15x15', width: 15, height: 15 },
  { label: '29x29 (Hama板)', width: 29, height: 29 },
  { label: '50x50', width: 50, height: 50 },
];

export function SizeSelector() {
  const gridWidth = useBeadStore((s) => s.gridWidth);
  const gridHeight = useBeadStore((s) => s.gridHeight);
  const setGridSize = useBeadStore((s) => s.setGridSize);
  const suggestedPresets = useBeadStore((s) => s.suggestedPresets);
  const originalImageData = useBeadStore((s) => s.originalImageData);
  const lockAspectRatio = useBeadStore((s) => s.lockAspectRatio);
  const imageAspectRatio = useBeadStore((s) => s.imageAspectRatio);

  // Local state for custom input
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  // Sync local state when grid size changes externally
  useEffect(() => {
    setCustomWidth(gridWidth.toString());
    setCustomHeight(gridHeight.toString());
  }, [gridWidth, gridHeight]);

  const presets = suggestedPresets.length > 0 ? suggestedPresets : DEFAULT_PRESETS;

  const handlePresetClick = (width: number, height: number) => {
    setGridSize(width, height);
  };

  const handleCustomWidthChange = (value: string) => {
    setCustomWidth(value);
  };

  const handleCustomHeightChange = (value: string) => {
    setCustomHeight(value);
  };

  const handleApplyCustomSize = () => {
    const w = parseInt(customWidth) || 1;
    const h = parseInt(customHeight) || 1;

    if (lockAspectRatio && imageAspectRatio) {
      // Lock aspect ratio - scale the other dimension
      if (imageAspectRatio >= 1) {
        // Landscape - width drives height
        const newHeight = Math.round(w / imageAspectRatio);
        setGridSize(Math.max(1, w), Math.max(1, newHeight));
      } else {
        // Portrait - height drives width
        const newWidth = Math.round(h * imageAspectRatio);
        setGridSize(Math.max(1, newWidth), Math.max(1, h));
      }
    } else {
      // Free aspect ratio
      setGridSize(Math.max(1, w), Math.max(1, h));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCustomSize();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">图纸规格</h3>

      {originalImageData && suggestedPresets.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">推荐尺寸（保持图片比例）</p>
      )}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {presets.map((size) => (
          <button
            key={`${size.width}x${size.height}`}
            onClick={() => handlePresetClick(size.width, size.height)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              gridWidth === size.width && gridHeight === size.height
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {size.width}x{size.height}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            min="1"
            max="100"
            value={customWidth}
            onChange={(e) => handleCustomWidthChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={gridWidth.toString()}
            className="w-16 px-2 py-1 bg-gray-700 rounded text-sm text-center"
          />
          <span className="text-gray-500">x</span>
          <input
            type="number"
            min="1"
            max="100"
            value={customHeight}
            onChange={(e) => handleCustomHeightChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={gridHeight.toString()}
            className="w-16 px-2 py-1 bg-gray-700 rounded text-sm text-center"
          />
          <button
            onClick={handleApplyCustomSize}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
          >
            应用
          </button>
        </div>

        {originalImageData && (
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={lockAspectRatio}
              onChange={(e) => useBeadStore.setState({ lockAspectRatio: e.target.checked })}
              className="rounded"
            />
            锁定图片比例
          </label>
        )}
      </div>
    </div>
  );
}
