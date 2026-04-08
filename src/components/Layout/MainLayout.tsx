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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWechatModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-[#07c160] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#06ad56]"
            >
              我的公众号：泥烟
            </button>
            <a
              href="https://github.com/knight02-bit/PinDouGenerator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-[#24292f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#444d56]"
            >
              <svg className="mr-1.5 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
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
