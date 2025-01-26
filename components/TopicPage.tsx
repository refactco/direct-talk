"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { fetchResources } from "@/services/api"
import ResourceList from "./ResourceList"
import { useResourceContext } from "@/context/ResourceContext"
import type { Resource } from "@/types/resource"

interface TopicPageProps {
  slug: string
}

export default function TopicPage({ slug }: TopicPageProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedResources, addResource, removeResource } = useResourceContext()
  // Remove this line
  // const searchParams = useSearchParams()
  const topicName = slug

  useEffect(() => {
    async function loadTopicResources() {
      setIsLoading(true)
      try {
        const result = await fetchResources("", "", 0, 100, topicName)
        setResources(result.resources)
      } catch (error) {
        console.error("Failed to fetch topic resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTopicResources()
  }, [topicName])

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
        <h1 className="text-3xl font-bold mb-6 text-white capitalize">{topicName} Resources</h1>
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

