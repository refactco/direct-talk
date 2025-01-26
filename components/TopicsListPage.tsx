"use client"

import { useState, useEffect } from "react"
import { fetchTopics } from "@/services/api"
import Link from "next/link"
import type { Topic } from "@/types/topic"

export default function TopicsListPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTopics() {
      setIsLoading(true)
      try {
        const fetchedTopics = await fetchTopics()
        setTopics(fetchedTopics)
      } catch (error) {
        console.error("Failed to fetch topics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTopics()
  }, [])

  if (isLoading) {
    return (
      <main className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Topics</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topic/${encodeURIComponent(topic.name.toLowerCase())}`}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white text-center">{topic.name}</h2>
              <p className="text-sm text-gray-400 mt-2">{topic.resourceCount} resources</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

