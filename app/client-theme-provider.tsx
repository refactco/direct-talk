// app/components/ClientThemeProvider.tsx (Client-side component)
'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      onChangeTheme={(theme) => console.log('Theme changed to:', theme)}
    >
      {children}
    </ThemeProvider>
  );
}
