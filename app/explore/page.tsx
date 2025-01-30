"use client"

import { useState, useEffect } from "react"
import { getResources, getAuthors } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { ResourceCard } from "@/components/ResourceCard"
import { AuthorCard } from "@/components/AuthorCard"
import { useRouter } from "next/navigation"
import { useSearch } from "@/contexts/SearchContext"

export default function ExplorePage() {
  const [recentResources, setRecentResources] = useState([])
  const [popularResources, setPopularResources] = useState([])
  const [authors, setAuthors] = useState([])
  const router = useRouter()
  const { query, setQuery } = useSearch()

  useEffect(() => {
    const fetchData = async () => {
      const [recent, popular, authorList] = await Promise.all([
        getResources({ sort: "latest", limit: 10 }).catch(() => []),
        getResources({ sort: "popular", limit: 10 }).catch(() => []),
        getAuthors({ limit: 10 }).catch((error) => {
          console.error("Error fetching authors:", error)
          return []
        }),
      ])
      setRecentResources(recent)
      setPopularResources(popular)
      setAuthors(authorList)
    }
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to learn?"
            className="w-full pl-10 pr-4 py-2"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            Search
          </Button>
        </div>
      </form>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Resources</h2>
          <Button variant="link" asChild>
            <Link href="/resources/popular" className="text-sm text-muted-foreground">
              Show all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-4 py-4">
            {popularResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Resources</h2>
          <Button variant="link" asChild>
            <Link href="/resources/latest" className="text-sm text-muted-foreground">
              Show all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-4 py-4">
            {recentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Authors</h2>
          <Button variant="link" asChild>
            <Link href="/authors" className="text-sm text-muted-foreground">
              Show all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-4 py-4">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  )
}

