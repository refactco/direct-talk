"use client"

import { useState, useEffect } from "react"
import { fetchAllPopularPeople } from "@/services/api"
import Link from "next/link"
import Image from "next/image"
import type { Resource } from "@/types/resource"

export default function AllPopularPeoplePage() {
  const [people, setPeople] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPopularPeople() {
      setIsLoading(true)
      try {
        const fetchedPeople = await fetchAllPopularPeople()
        setPeople(fetchedPeople)
      } catch (error) {
        console.error("Failed to fetch popular people:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPopularPeople()
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
        <h1 className="text-3xl font-bold mb-6 text-white">Popular People</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/author/${encodeURIComponent(person.name.toLowerCase().replace(/ /g, "-"))}`}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Image
                src={person.imageUrl || "/placeholder.svg"}
                alt={person.name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-white text-center">{person.name}</h2>
              <p className="text-sm text-gray-400 mt-2">{person.role}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

