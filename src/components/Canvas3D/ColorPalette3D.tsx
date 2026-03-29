import { useBeadStore } from '../../stores/beadStore';

export function ColorPaletteDisplay() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const colorReplacements = useBeadStore((s) => s.colorReplacements);

  if (!grid || !grid.pixels) return null;

  // Get unique colors used in grid
  const usedColorIds = [...new Set(grid.pixels.flat())];
  const usedColors = usedColorIds
    .map((id) => palette.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  // Build replacement map: toId -> fromId (the "new" color and what it replaced)
  const replacementMap = new Map<string, string>();
  for (const r of colorReplacements) {
    replacementMap.set(r.toId, r.fromId);
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
        颜色图例 ({usedColors.length} 种)
      </h3>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {usedColors.map((color) => {
          const originalId = replacementMap.get(color!.id);
          const originalColor = originalId
            ? palette.find((c) => c.id === originalId)
            : null;
          const displayName = originalColor
            ? `${originalColor.name}->${color!.name}`
            : color!.name;

          return (
            <div
              key={color!.id}
              className="flex flex-col items-center gap-1"
              title={`${color!.name}\n${color!.hex}`}
            >
              <div
                className="w-8 h-8 rounded border border-[var(--color-border)]"
                style={{ backgroundColor: color!.hex }}
              />
              <span className="text-[10px] text-[var(--color-text-muted)] truncate w-full text-center">
                {displayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
