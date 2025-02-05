"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    const logTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      console.log("ThemeProvider: Current theme:", isDark ? "dark" : "light")
      console.log("ThemeProvider: HTML class:", document.documentElement.className)
    }

    logTheme()
    const observer = new MutationObserver(logTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

