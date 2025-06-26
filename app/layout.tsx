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
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ask Author - Chat with Your Favorite Thinkers',
    template: '%s | Ask Author'
  },
  description:
    'Engage in AI-powered conversations with your favorite thinkers, authors, and intellectuals. Ask questions and explore ideas through interactive chat.',
  keywords: [
    'AI chat',
    'artificial intelligence',
    'thinkers',
    'authors',
    'intellectuals',
    'conversation',
    'Q&A',
    'philosophy',
    'ideas',
    'knowledge',
    'learning'
  ],
  authors: [{ name: 'Ask Author Team' }],
  creator: 'Ask Author',
  publisher: 'Ask Author',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://askauthor.com'
  ),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Ask Author - Chat with Your Favorite Thinkers',
    description:
      'Engage in AI-powered conversations with your favorite thinkers, authors, and intellectuals. Ask questions and explore ideas through interactive chat.',
    siteName: 'Ask Author'
  },
  twitter: {
    card: 'summary',
    title: 'Ask Author - Chat with Your Favorite Thinkers',
    description:
      'Engage in AI-powered conversations with your favorite thinkers, authors, and intellectuals.',
    creator: '@askauthor',
    site: '@askauthor'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.png'
  },
  manifest: '/site.webmanifest',
  category: 'technology',
  classification: 'AI Chat Platform',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || ''
    }
  },
  appleWebApp: {
    capable: true,
    title: 'Ask Author',
    statusBarStyle: 'default'
  },
  applicationName: 'Ask Author',
  generator: 'Next.js',
  abstract:
    'AI-powered platform for conversing with favorite thinkers and authors',
  archives: [],
  assets: [],
  bookmarks: [],
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Ask Author',
    description:
      'Engage in AI-powered conversations with your favorite thinkers, authors, and intellectuals.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://askauthor.com',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: 'Ask Author Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ask Author'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://askauthor.com'}/conversation?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    featureList: [
      'AI-powered conversations',
      'Chat with famous thinkers',
      'Interactive Q&A sessions',
      'Educational content',
      'Knowledge exploration'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
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
      </body>
    </html>
  );
}
