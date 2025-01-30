"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getResources, getAuthors, getTopics } from "@/lib/api"
import type { Resource, Author, Topic } from "@/types/resources"

interface SearchResults {
  resources: Resource[]
  authors: Author[]
  topics: Topic[]
  isLoading: boolean
}

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: SearchResults
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>({
    resources: [],
    authors: [],
    topics: [],
    isLoading: false,
  })
  const router = useRouter()
  const pathname = usePathname()

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({
        resources: [],
        authors: [],
        topics: [],
        isLoading: false,
      })
      return
    }

    setResults((prev) => ({ ...prev, isLoading: true }))

    try {
      const [resources, authors, topics] = await Promise.all([
        getResources({ query: searchQuery }),
        getAuthors(searchQuery),
        getTopics(searchQuery),
      ])

      setResults({
        resources,
        authors,
        topics,
        isLoading: false,
      })
    } catch (error) {
      console.error("Search error:", error)
      setResults((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
      if (pathname === "/search" || pathname?.startsWith("/search/")) {
        router.replace(`/search/${encodeURIComponent(query)}`, { scroll: false })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, performSearch, router, pathname])

  return <SearchContext.Provider value={{ query, setQuery, results }}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

