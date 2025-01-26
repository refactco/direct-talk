"use client"

import { useState, useEffect } from "react"
import { fetchAllAuthors } from "@/services/api"
import Link from "next/link"
import Image from "next/image"

interface Author {
  name: string
  image: string
  resourceCount: number
}

export default function AuthorsListPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAuthors() {
      setIsLoading(true)
      try {
        const fetchedAuthors = await fetchAllAuthors()
        setAuthors(fetchedAuthors)
      } catch (error) {
        console.error("Failed to fetch authors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthors()
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
        <h1 className="text-3xl font-bold mb-6 text-white">Authors</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {authors.map((author) => (
            <Link
              key={author.name}
              href={`/author/${encodeURIComponent(author.name.toLowerCase().replace(/ /g, "-"))}`}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Image
                src={author.image || "/placeholder.svg"}
                alt={author.name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-white text-center">{author.name}</h2>
              <p className="text-sm text-gray-400 mt-2">{author.resourceCount} resources</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

