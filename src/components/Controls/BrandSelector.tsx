import { useBeadStore } from '../../stores/beadStore';

export function BrandSelector() {
  const currentBrand = useBeadStore((s) => s.currentBrand);
  const setBrand = useBeadStore((s) => s.setBrand);

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">选择色卡</h3>
      <div className="flex gap-2">
        <button
          onClick={() => setBrand('hama')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
            currentBrand === 'hama'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
          }`}
        >
          Hama
        </button>
        <button
          onClick={() => setBrand('perler')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
            currentBrand === 'perler'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
          }`}
        >
          Perler
        </button>
      </div>
    </div>
  );
}
