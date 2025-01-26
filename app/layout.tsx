import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ResourceProvider } from "@/context/ResourceContext"
import Navigation from "@/components/Navigation"
import { CustomToaster } from "@/components/ui/custom-toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Resource Library and Chat",
  description: "Browse resources and chat about them",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#121212] text-white`}>
        <ResourceProvider>
          <Navigation />
          {children}
          <CustomToaster />
        </ResourceProvider>
      </body>
    </html>
  )
}

