import { useBeadStore } from '../../stores/beadStore';

export function ViewModeSelector() {
  const viewSettings = useBeadStore((s) => s.viewSettings);
  const setViewMode = useBeadStore((s) => s.setViewMode);
  const setBeadStyle = useBeadStore((s) => s.setBeadStyle);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">视图模式</h3>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewSettings.viewMode === '2d'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewSettings.viewMode === '3d'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          3D
        </button>
      </div>

      {viewSettings.viewMode === '3d' && (
        <div className="flex gap-2">
          <button
            onClick={() => setBeadStyle('cylinder')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewSettings.beadStyle === 'cylinder'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            空心圆柱
          </button>
          <button
            onClick={() => setBeadStyle('sphere')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewSettings.beadStyle === 'sphere'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            球形
          </button>
        </div>
      )}
    </div>
  );
}
