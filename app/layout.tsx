import { AuthModal } from '@/components/AuthModal';
import { DetailSheet } from '@/components/detail-sheet/DetailSheet';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { HistoryProvider } from '@/contexts/HistoryContext';
import { InitialMessageProvider } from '@/contexts/InitialMessageContext';
import { ResourceDetailEpisodesProvider } from '@/contexts/resource-detail-episodes-context';
import { ResourceDetailProvider } from '@/contexts/ResourceDetailContext';
import { ResourceProvider } from '@/contexts/ResourcesContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { SelectedResourcesProvider } from '@/contexts/SelectedResourcesContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ask Author - ask your favorite authors',
  description:
    'Discover and engage with curated authors through AI-powered conversations',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <InitialMessageProvider>
                <HistoryProvider>
                  <SelectedResourcesProvider>
                    <ResourceDetailProvider>
                      <ChatProvider>
                        <ResourceProvider>
                          <SearchProvider>
                            <div className="flex h-dvh">
                              <Sidebar />
                              {/* <ThemeToggle className="hidden md:flex absolute top-4 md:top-8 right-4 md:right-8 z-10" /> */}
                              <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8 mt-16 md:mt-0 !pb-0">
                                {children}
                              </main>
                              <Toaster />
                              <AuthModal />
                              <ResourceDetailEpisodesProvider>
                                <DetailSheet />
                              </ResourceDetailEpisodesProvider>
                            </div>
                          </SearchProvider>
                        </ResourceProvider>
                      </ChatProvider>
                    </ResourceDetailProvider>
                  </SelectedResourcesProvider>
                </HistoryProvider>
              </InitialMessageProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    console.log("Initial HTML class:", document.documentElement.className);
    new MutationObserver(() => {
      console.log("HTML class changed:", document.documentElement.className);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  `
          }}
        />
      </body>
    </html>
  );
}
