import { DetailSheet } from "@/components/detail-sheet/DetailSheet";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ResourceDetailProvider } from "@/contexts/ResourceDetailContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SelectedResourcesProvider } from "@/contexts/SelectedResourcesContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import {HistoryProvider} from "@/contexts/HistoryContext";
import {ThemeToggle} from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Direct Talk - Talk to you favorite resources",
  description:
    "Discover and engage with curated resources through AI-powered conversations"
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
              <HistoryProvider>
              <SearchProvider>
                <SelectedResourcesProvider>
                  <ResourceDetailProvider>
                    <ChatProvider>
                      <div className="flex h-screen">
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto pb-0 px-6 pt-6">
                          {/* Theme Toggle */}
                          <ThemeToggle />
                          {children}
                        </main>
                        <DetailSheet />
                      </div>
                    </ChatProvider>
                  </ResourceDetailProvider>
                </SelectedResourcesProvider>
              </SearchProvider>
              </HistoryProvider>
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
