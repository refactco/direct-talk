"use client"

import { useState, useEffect } from "react"
import { fetchPopularPeople, fetchPopularResources, fetchNewResources } from "@/services/api"
import PopularPeople from "./PopularPeople"
import PopularResources from "./PopularResources"
import NewResources from "./NewResources"
import type { Resource } from "@/types/resource"
import Link from "next/link"

interface HomeViewProps {
  onResourceSelect: (resource: Resource) => void
}

export default function HomeView({ onResourceSelect }: HomeViewProps) {
  const [popularPeople, setPopularPeople] = useState<Resource[]>([])
  const [popularResources, setPopularResources] = useState<Resource[]>([])
  const [newResources, setNewResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [people, popular, newRes] = await Promise.all([
          fetchPopularPeople(),
          fetchPopularResources(),
          fetchNewResources(),
        ])
        setPopularPeople(people)
        setPopularResources(popular)
        setNewResources(newRes)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="pt-32 pb-8 text-center">Loading...</div>
  }

  if (error) {
    return <div className="pt-32 pb-8 text-center text-red-500">{error}</div>
  }

  return (
    <main className="pt-32 pb-8">
      <div className="container mx-auto px-4 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Popular People</h2>
            <Link href="/popular-people" className="text-sm text-blue-400 hover:underline">
              Show all
            </Link>
          </div>
          <PopularPeople people={popularPeople} onResourceSelect={onResourceSelect} />
        </section>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Popular Resources</h2>
            <Link href="/popular-resources" className="text-sm text-blue-400 hover:underline">
              Show all
            </Link>
          </div>
          <PopularResources resources={popularResources} onResourceSelect={onResourceSelect} />
        </section>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">New Resources</h2>
            <Link href="/new-resources" className="text-sm text-blue-400 hover:underline">
              Show all
            </Link>
          </div>
          <NewResources resources={newResources} onResourceSelect={onResourceSelect} />
        </section>
      </div>
    </main>
  )
}

