import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useBeadStore } from '../../stores/beadStore';

export function ExportPanel() {
  const gridRef = useRef<HTMLDivElement>(null);
  const grid = useBeadStore((s) => s.grid);
  const exportSettings = useBeadStore((s) => s.exportSettings);
  const setExportSettings = useBeadStore((s) => s.setExportSettings);
  const palette = useBeadStore((s) => s.palette);

  if (!grid) return null;

  const handleExportPNG = async () => {
    if (!gridRef.current) return;

    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#1f2937',
        scale: exportSettings.scale,
      });

      const link = document.createElement('a');
      link.download = `bead-pattern-${grid.width}x${grid.height}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    }
  };

  const handleExportPDF = async () => {
    if (!gridRef.current) return;

    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#1f2937',
        scale: exportSettings.scale,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`bead-pattern-${grid.width}x${grid.height}.pdf`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    }
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">导出图纸</h3>

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleExportPNG}
          className="flex-1 px-3 py-2 border border-[var(--color-border)] hover:border-[var(--color-text-muted)] rounded-lg text-sm font-medium transition-colors bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
        >
          PNG
        </button>
        <button
          onClick={handleExportPDF}
          className="flex-1 px-3 py-2 border border-[var(--color-border)] hover:border-[var(--color-text-muted)] rounded-lg text-sm font-medium transition-colors bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
        >
          PDF
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-[var(--color-text-muted)]">导出精度:</label>
        <select
          value={exportSettings.scale}
          onChange={(e) => setExportSettings({ scale: Number(e.target.value) })}
          className="bg-[var(--color-bg-tertiary)] text-xs rounded px-2 py-1 border border-[var(--color-border)] text-[var(--color-text-secondary)]"
        >
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
      </div>

      {/* Hidden div for export capture */}
      <div ref={gridRef} className="absolute -left-[9999px] top-0">
        <ExportGridContent grid={grid} palette={palette} />
      </div>
    </div>
  );
}

function ExportGridContent({ grid, palette }: { grid: NonNullable<ReturnType<typeof useBeadStore.getState>['grid']>; palette: ReturnType<typeof useBeadStore.getState>['palette'] }) {
  const colorMap = new Map(palette.map((c) => [c.id, c]));
  const cellSize = 32;

  return (
    <div className="p-4" style={{ backgroundColor: '#1f2937' }}>
      <div className="text-white text-sm mb-2 font-bold">
        {grid.width} x {grid.height} 拼豆图纸
      </div>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
        }}
      >
        {grid.pixels.map((row, y) =>
          row.map((colorId, x) => {
            const color = colorMap.get(colorId);
            const label = color?.id || '';
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: color?.hex || '#888',
                  border: '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: isLightColor(color?.hex || '#888') ? '#000' : '#fff',
                  fontFamily: 'Arial, sans-serif',
                  textAlign: 'center',
                  lineHeight: '1',
                }}
                title={label}
              >
                {label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const normalizedHex = hex.replace('#', '');
  const r = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const g = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const b = Number.parseInt(normalizedHex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
