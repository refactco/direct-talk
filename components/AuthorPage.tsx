"use client"

import { useState, useEffect } from "react"
import { fetchResourcesByAuthor } from "@/services/api"
import ResourceList from "./ResourceList"
import { useResourceContext } from "@/context/ResourceContext"
import type { Resource } from "@/types/resource"
import Image from "next/image"

interface AuthorPageProps {
  slug: string
}

export default function AuthorPage({ slug }: AuthorPageProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [authorInfo, setAuthorInfo] = useState<{ name: string; image: string } | null>(null)
  const { selectedResources, addResource, removeResource } = useResourceContext()

  const authorName = decodeURIComponent(slug).replace(/-/g, " ")

  useEffect(() => {
    async function loadAuthorResources() {
      setIsLoading(true)
      try {
        const result = await fetchResourcesByAuthor(authorName)
        setResources(result.resources)
        if (result.resources.length > 0) {
          setAuthorInfo({
            name: result.resources[0].author,
            image: result.resources[0].image,
          })
        }
      } catch (error) {
        console.error("Failed to fetch author resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthorResources()
  }, [authorName])

  const handleResourceSelect = (resource: Resource) => {
    if (selectedResources.some((r) => r.id === resource.id)) {
      removeResource(resource.id)
    } else {
      addResource(resource)
    }
  }

  return (
    <main className="pt-32 pb-8">
      <div className="container mx-auto px-4">
        {authorInfo && (
          <div className="flex items-center mb-8">
            <div className="mr-6">
              <Image
                src={authorInfo.image || "/placeholder.svg"}
                alt={authorInfo.name}
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-white">{authorInfo.name}</h1>
          </div>
        )}
        <ResourceList
          resources={resources}
          onSelect={handleResourceSelect}
          selectedResources={selectedResources}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}

