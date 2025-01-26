'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Resource } from '@/types/resource'

interface ResourceContextType {
  selectedResources: Resource[]
  addResource: (resource: Resource) => void
  removeResource: (resourceId: string) => void
  setSelectedResources: React.Dispatch<React.SetStateAction<Resource[]>>
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined)

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])

  useEffect(() => {
    const storedResources = localStorage.getItem('selectedResources')
    if (storedResources) {
      setSelectedResources(JSON.parse(storedResources))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedResources', JSON.stringify(selectedResources))
  }, [selectedResources])

  const addResource = (resource: Resource) => {
    setSelectedResources(prev => [...prev, resource])
  }

  const removeResource = (resourceId: string) => {
    setSelectedResources(prev => prev.filter(resource => resource.id !== resourceId))
  }

  return (
    <ResourceContext.Provider value={{ selectedResources, addResource, removeResource, setSelectedResources }}>
      {children}
    </ResourceContext.Provider>
  )
}

export function useResourceContext() {
  const context = useContext(ResourceContext)
  if (context === undefined) {
    throw new Error('useResourceContext must be used within a ResourceProvider')
  }
  return context
}

