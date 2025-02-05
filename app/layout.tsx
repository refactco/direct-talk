// app/layout.tsx (Server-side layout)
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import { SearchProvider } from '@/contexts/SearchContext';
import { SelectedResourcesProvider } from '@/contexts/SelectedResourcesContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import ClientThemeProvider from './client-theme-provider'; // Import the client-side theme provider
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Carrot - Your Knowledge Hub',
  description:
    'Discover and engage with curated resources through AI-powered conversations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeProvider>
          {' '}
          {/* Wrap with ClientThemeProvider for client-side logic */}
          <Providers>
            <SearchProvider>
              <SelectedResourcesProvider>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto pb-0 px-6 pt-6">
                    {children}
                  </main>
                </div>
              </SelectedResourcesProvider>
            </SearchProvider>
          </Providers>
        </ClientThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            console.log("Initial HTML class:", document.documentElement.className);
            new MutationObserver(() => {
              console.log("HTML class changed:", document.documentElement.className);
            }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
          `,
          }}
        />
      </body>
    </html>
  );
}
