import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { SelectedResourcesProvider } from "@/contexts/SelectedResourcesContext"
import { SearchProvider } from "@/contexts/SearchContext"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/ThemeProvider"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Carrot - Your Knowledge Hub",
  description: "Discover and engage with curated resources through AI-powered conversations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <SearchProvider>
              <SelectedResourcesProvider>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto pb-0 px-6 pt-6">{children}</main>
                </div>
              </SelectedResourcesProvider>
            </SearchProvider>
          </Providers>
        </ThemeProvider>
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
  )
}

