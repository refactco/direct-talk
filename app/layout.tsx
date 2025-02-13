import { DetailSheet } from "@/components/detail-sheet/DetailSheet";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ResourceDetailProvider } from "@/contexts/ResourceDetailContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SelectedResourcesProvider } from "@/contexts/SelectedResourcesContext";
import { MenuIcon } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

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
                  <ResourceDetailProvider>
                    <ChatProvider>
                      <div className="flex h-screen">
                        <Sidebar />
                        <ThemeToggle />
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => {}}
                          className="flex md:hidden absolute top-4 md:top-8 left-4 md:left-8 z-50 border border-border rounded-full"
                        >
                          <MenuIcon className="absolute h-8 w-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                        <main className="flex-1 overflow-y-auto pb-0 px-4 py-4 md:px-8 md:py-8">
                          {children}
                        </main>
                        <DetailSheet />
                      </div>
                    </ChatProvider>
                  </ResourceDetailProvider>
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
