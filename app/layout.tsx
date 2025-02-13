import { DetailSheet } from "@/components/detail-sheet/DetailSheet";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ResourceDetailProvider } from "@/contexts/ResourceDetailContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SelectedResourcesProvider } from "@/contexts/SelectedResourcesContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
<<<<<<< HEAD
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
=======
import "./globals.css";
>>>>>>> 7faab81 (detail drawer changes)

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
              <SearchProvider>
                <SelectedResourcesProvider>
                  <ChatProvider>
                    <div className="flex h-screen">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto pb-0 px-6 pt-6">
                        {children}
                      </main>
                    </div>
                  </ChatProvider>
                </SelectedResourcesProvider>
              </SearchProvider>
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
