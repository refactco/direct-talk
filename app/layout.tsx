import { AuthModal } from '@/components/AuthModal';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { HistoryProvider } from '@/contexts/HistoryContext';
import { InitialMessageProvider } from '@/contexts/InitialMessageContext';
import { ResourceProvider } from '@/contexts/ResourcesContext';
import { SelectedResourcesProvider } from '@/contexts/SelectedResourcesContext';
import type { Metadata, Viewport } from 'next';
import React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ask Author - Ask questions from your favorite public figures',
  description:
    'Ask questions from your favorite public figures through AI-powered conversations',
  icons: {
    icon: '/favicon.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
                    <ChatProvider>
                      <ResourceProvider>
                        <div className="flex h-dvh">
                          <Sidebar />
                          <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8 mt-16 md:mt-0 !pb-0">
                            {children}
                          </main>
                          <AuthModal />
                        </div>
                      </ResourceProvider>
                    </ChatProvider>
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
