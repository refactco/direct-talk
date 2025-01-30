"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Resource } from "@/types/resources"

type SelectedResourcesContextType = {
  selectedResource: Resource | null
  addResource: (resource: Resource) => void
  removeResource: () => void
  resetSelectedResource: () => void
  isSelected: (resourceId: string) => boolean
}

const SelectedResourcesContext = createContext<SelectedResourcesContextType | undefined>(undefined)

export function SelectedResourcesProvider({ children }: { children: React.ReactNode }) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  useEffect(() => {
    console.log("SelectedResourcesProvider mounted")
  }, [])

  const addResource = (resource: Resource) => {
    console.log("Adding resource:", resource)
    setSelectedResource(resource)
  }

  const removeResource = () => {
    console.log("Removing resource")
    setSelectedResource(null)
  }

  const resetSelectedResource = () => {
    console.log("Resetting selected resource")
    setSelectedResource(null)
  }

  const isSelected = (resourceId: string) => {
    return selectedResource?.id === resourceId
  }

  return (
    <SelectedResourcesContext.Provider
      value={{ selectedResource, addResource, removeResource, resetSelectedResource, isSelected }}
    >
      {children}
    </SelectedResourcesContext.Provider>
  )
}

export function useSelectedResources() {
  const context = useContext(SelectedResourcesContext)
  if (context === undefined) {
    throw new Error("useSelectedResources must be used within a SelectedResourcesProvider")
  }
  return context
}

