import { useBeadStore } from '../../stores/beadStore';

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
  const imageAspectRatio = useBeadStore((s) => s.imageAspectRatio);

  const presets = suggestedPresets.length > 0 ? suggestedPresets : DEFAULT_PRESETS;

  const handlePresetClick = (width: number, height: number) => {
    setGridSize(width, height);
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">图纸规格</h3>

      {originalImageData && suggestedPresets.length > 0 && (
        <p className="text-xs text-[var(--color-text-muted)] mb-2">推荐尺寸（保持图片比例）</p>
      )}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {presets.map((size) => (
          <button
            key={`${size.width}x${size.height}`}
            onClick={() => handlePresetClick(size.width, size.height)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
              gridWidth === size.width && gridHeight === size.height
                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {size.width}x{size.height}
          </button>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)] pt-3 mt-3">
        <div className="text-sm text-[var(--color-text-secondary)] mb-2">
          当前尺寸: <span className="font-medium">{gridWidth}</span>
          {imageAspectRatio && (
            <> x <span className="font-medium">{gridHeight}</span></>
          )}
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={gridWidth}
          onChange={(e) => {
            const w = parseInt(e.target.value);
            if (imageAspectRatio) {
              const h = imageAspectRatio >= 1
                ? Math.round(w / imageAspectRatio)
                : Math.round(w * imageAspectRatio);
              setGridSize(Math.max(1, w), Math.max(1, h));
            } else {
              setGridSize(Math.max(1, w), gridHeight);
            }
          }}
          className="w-full h-2 bg-[var(--color-bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-text-primary)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
          <span>5</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
