import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { SelectedResourcesProvider } from "@/contexts/SelectedResourcesContext"
import { SearchProvider } from "@/contexts/SearchContext"
import { Providers } from "@/components/providers"
import type React from "react" //Import React

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
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
      </body>
    </html>
  )
}

