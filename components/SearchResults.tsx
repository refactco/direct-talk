"use client"

import { useState, useEffect } from "react"
import { fetchTopics, fetchResources } from "@/services/api"
import type { Resource } from "@/types/resource"
import ResourceCard from "./ResourceCard"

interface SearchResultsProps {
  query: string
  onClose: () => void
}

export default function SearchResults({ query, onClose }: SearchResultsProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        if (query) {
          const result = await fetchResources(query)
          setResources(result.resources)
        } else {
          setResources([])
        }
      } catch (err) {
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [query])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms</p>
        </div>
      ) : null}
    </div>
  )
}

