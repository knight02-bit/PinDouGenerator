import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import gzhImage from '../../../gzh.jpg';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isWechatModalOpen, setIsWechatModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (!isWechatModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWechatModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWechatModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">拼豆图纸生成器</h1>
          </div>
          <span className="text-sm text-[var(--color-text-secondary)] hidden sm:inline">Perler Bead Pattern Generator</span>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {children}
      </main>
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold">喜欢这个工具？欢迎关注我的公众号</p>
            <p className="text-sm text-[var(--color-text-secondary)]">获取更新动态和技术分享</p>
          </div>
          <button
            type="button"
            onClick={() => setIsWechatModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-[#07c160] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#06ad56]"
          >
            我的公众号：泥烟
          </button>
        </div>
      </footer>
      {isWechatModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsWechatModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="关闭公众号弹窗"
              onClick={() => setIsWechatModalOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              ×
            </button>
            <div className="space-y-3">
              <p className="pr-8 text-sm font-semibold">感谢关注</p>
              <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                <img src={gzhImage} alt="公众号名片" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
