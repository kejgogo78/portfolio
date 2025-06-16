'use client';

import { useEffect } from 'react';

const ThemeScript = () => {
  useEffect(() => {
    const defaultThemeMode = 'light';
    let themeMode: string | null = null;

    if (typeof document !== 'undefined' && document.documentElement) {
      const html = document.documentElement;

      if (html.hasAttribute('data-bs-theme-mode')) {
        themeMode = html.getAttribute('data-bs-theme-mode');
      } else if (localStorage.getItem('data-bs-theme')) {
        themeMode = localStorage.getItem('data-bs-theme');
      } else {
        themeMode = defaultThemeMode;
      }

      if (themeMode === 'system') {
        themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      html.setAttribute('data-bs-theme', themeMode || defaultThemeMode);
    }
  }, []);

  return null;
};

export default ThemeScript;

/*
//그리고 pages/_app.tsx 또는 app/layout.tsx (App Router 사용 시)에 다음과 같이 추가해주시면 됩니다:
// app/layout.tsx (App Router 기준)
import ThemeScript from '@/components/ThemeScript';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
*/