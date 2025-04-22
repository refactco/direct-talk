'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    const logTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
    };

    logTheme();
    const observer = new MutationObserver(logTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <NextThemesProvider {...props} attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
