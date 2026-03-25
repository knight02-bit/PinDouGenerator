import { useBeadStore } from '../../stores/beadStore';

export function BrandSelector() {
  const currentBrand = useBeadStore((s) => s.currentBrand);
  const setBrand = useBeadStore((s) => s.setBrand);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">选择色卡</h3>
      <div className="flex gap-2">
        <button
          onClick={() => setBrand('hama')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentBrand === 'hama'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Hama
        </button>
        <button
          onClick={() => setBrand('perler')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentBrand === 'perler'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Perler
        </button>
      </div>
    </div>
  );
}
