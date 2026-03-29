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
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">导入图片</h3>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full px-4 py-2 bg-[var(--color-text-primary)] hover:bg-[var(--color-text-secondary)] text-[var(--color-bg-primary)] rounded-lg text-sm font-medium transition-colors"
      >
        选择图片文件
      </button>
      <p className="text-xs text-[var(--color-text-muted)] mt-2">
        支持 JPG、PNG 等常见格式
      </p>
    </div>
  );
}
