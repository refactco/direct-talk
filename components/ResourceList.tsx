/**
 * ResourceList Component
 *
 * This component renders a grid of ResourceCard components and manages the state
 * for the ResourceDetailDrawer.
 *
 * Props:
 * @param {Resource[]} resources - Array of resources to display
 * @param {function} onSelect - Callback function when a resource is selected
 * @param {Resource[]} selectedResources - Array of currently selected resources
 * @param {boolean} isLoading - Flag to indicate if resources are being loaded
 */

import { useState } from "react"
import ResourceCard from "./ResourceCard"
import type { Resource } from "@/types/resource"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import ResourceDetailDrawer from "./ResourceDetailDrawer"

interface ResourceListProps {
  resources: Resource[]
  onSelect: (resource: Resource) => void
  selectedResources: Resource[]
  isLoading: boolean
}

// Main component function
export default function ResourceList({ resources, onSelect, selectedResources, isLoading }: ResourceListProps) {
  // State for managing the selected resource and drawer visibility
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Handler for resource click events
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
    setIsDrawerOpen(true)
    onSelect(resource)
  }

  // Render the resource grid with animations
  return (
    <>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {/* Map through resources and render ResourceCard components */}
        <AnimatePresence>
          {resources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ResourceCard
                resource={resource}
                onClick={handleResourceClick}
                isSelected={selectedResources.some((r) => r.id === resource.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Render loading skeletons when isLoading is true */}
        {isLoading && (
          <>
            {[...Array(5)].map((_, index) => (
              <div key={`skeleton-${index}`} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </>
        )}
      </motion.div>
      
      {/* Render the ResourceDetailDrawer */}
      <ResourceDetailDrawer resource={selectedResource} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}

