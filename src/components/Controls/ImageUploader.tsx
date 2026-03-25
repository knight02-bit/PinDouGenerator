import { useRef } from 'react';
import { loadImage } from '../../utils/imageProcessor';
import { useBeadStore } from '../../stores/beadStore';

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateGridFromPalette = useBeadStore((s) => s.generateGridFromPalette);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await loadImage(file);
      generateGridFromPalette(imageData);
    } catch (err) {
      console.error('Failed to load image:', err);
      alert('图片加载失败，请重试');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">导入图片</h3>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition-colors"
      >
        选择图片文件
      </button>
      <p className="text-xs text-gray-500 mt-2">
        支持 JPG、PNG 等常见格式
      </p>
    </div>
  );
}
