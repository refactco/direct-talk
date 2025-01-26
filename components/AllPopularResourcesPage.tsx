"use client"

import { useState, useEffect } from "react"
import { fetchAllPopularResources } from "@/services/api"
import ResourceList from "./ResourceList"
import { useResourceContext } from "@/context/ResourceContext"
import type { Resource } from "@/types/resource"

export default function AllPopularResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedResources, addResource, removeResource } = useResourceContext()

  useEffect(() => {
    async function loadPopularResources() {
      setIsLoading(true)
      try {
        const fetchedResources = await fetchAllPopularResources()
        setResources(fetchedResources)
      } catch (error) {
        console.error("Failed to fetch popular resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPopularResources()
  }, [])

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
        <h1 className="text-3xl font-bold mb-6 text-white">Popular Resources</h1>
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

