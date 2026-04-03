import { useMemo, useState } from 'react';
import { useBeadStore } from '../../stores/beadStore';

export function ColorPaletteDisplay() {
  const grid = useBeadStore((s) => s.grid);
  const palette = useBeadStore((s) => s.palette);
  const colorReplacements = useBeadStore((s) => s.colorReplacements);
  const currentBrand = useBeadStore((s) => s.currentBrand);
  const [searchText, setSearchText] = useState('');

  const usedColorIds = grid?.pixels ? [...new Set(grid.pixels.flat())] : [];
  const usedColors = usedColorIds
    .map((id) => palette.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  const replacementMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const replacement of colorReplacements) {
      map.set(replacement.toId, replacement.fromId);
    }
    return map;
  }, [colorReplacements]);

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredUsedColors = useMemo(() => {
    if (!normalizedSearchText) {
      return usedColors;
    }

    return usedColors.filter((color) => {
      const originalId = replacementMap.get(color.id);
      const originalColor = originalId
        ? palette.find((item) => item.id === originalId)
        : null;
      const searchableText = [
        color.id,
        color.name,
        color.hex,
        originalColor?.id ?? '',
        originalColor?.name ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearchText);
    });
  }, [normalizedSearchText, palette, replacementMap, usedColors]);

  if (!grid || !grid.pixels) return null;

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
            颜色图例 ({filteredUsedColors.length}/{usedColors.length} 种)
          </h3>
          {currentBrand === 'mard' && (
            <span className="text-[10px] text-[var(--color-text-muted)]">
              支持按编号 / HEX 查找
            </span>
          )}
        </div>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="搜索颜色编号 或 HEX"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]"
        />
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {filteredUsedColors.map((color) => {
          const originalId = replacementMap.get(color!.id);
          const originalColor = originalId
            ? palette.find((c) => c.id === originalId)
            : null;
          const displayName = originalColor
            ? `${originalColor.name} → ${color!.name}`
            : color!.name;

          return (
            <div
              key={color!.id}
              className="flex flex-col items-center gap-1"
              title={color!.id === color!.name
                ? `${color!.name}\n${color!.hex}`
                : `${color!.id}\n${color!.name}\n${color!.hex}`}
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
      {filteredUsedColors.length === 0 && (
        <div className="mt-3 text-xs text-[var(--color-text-muted)]">
          没有匹配到颜色，请尝试编号或 HEX。
        </div>
      )}
    </div>
  );
}
