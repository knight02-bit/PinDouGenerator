import { useBeadStore } from '../../stores/beadStore';

export function BrandSelector() {
  const currentBrand = useBeadStore((s) => s.currentBrand);
  const mardPaletteMode = useBeadStore((s) => s.mardPaletteMode);
  const setBrand = useBeadStore((s) => s.setBrand);
  const setMardPaletteMode = useBeadStore((s) => s.setMardPaletteMode);
  const brands = [
    { id: 'hama', label: 'Hama' },
    { id: 'perler', label: 'Perler' },
    { id: 'mard', label: 'Mard' },
  ] as const;

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">选择色卡</h3>
      <div className="grid grid-cols-3 gap-2">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setBrand(brand.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
              currentBrand === brand.id
                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {brand.label}
          </button>
        ))}
      </div>
      {currentBrand === 'mard' && (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <div className="mb-2 text-xs text-[var(--color-text-muted)]">Mard 色卡版本</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMardPaletteMode('basic')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
                mardPaletteMode === 'basic'
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              基础版 221 色
            </button>
            <button
              onClick={() => setMardPaletteMode('full')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
                mardPaletteMode === 'full'
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              完整版 291 色
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
