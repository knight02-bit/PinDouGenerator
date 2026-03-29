import { useBeadStore } from '../../stores/beadStore';

export function ViewModeSelector() {
  const viewSettings = useBeadStore((s) => s.viewSettings);
  const setViewMode = useBeadStore((s) => s.setViewMode);
  const setBeadStyle = useBeadStore((s) => s.setBeadStyle);

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">视图模式</h3>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
            viewSettings.viewMode === '2d'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)] ${
            viewSettings.viewMode === '3d'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
          }`}
        >
          3D
        </button>
      </div>

      {viewSettings.viewMode === '3d' && (
        <div className="flex gap-2">
          <button
            onClick={() => setBeadStyle('cylinder')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-[var(--color-border)] ${
              viewSettings.beadStyle === 'cylinder'
                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            空心圆柱
          </button>
          <button
            onClick={() => setBeadStyle('sphere')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-[var(--color-border)] ${
              viewSettings.beadStyle === 'sphere'
                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            球形
          </button>
        </div>
      )}
    </div>
  );
}
