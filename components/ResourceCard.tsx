"use client"

import type { Resource } from "@/types/resources"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import Link from "next/link"

export function ResourceCard({ resource }: { resource: Resource }) {
  const { addResource, removeResource, isSelected } = useSelectedResources()
  const selected = isSelected(resource.id)

  const handleToggleResource = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selected) {
      removeResource(resource.id)
    } else {
      addResource(resource)
    }
  }

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group relative w-48 space-y-4 rounded-md p-3 transition-colors hover:bg-background-highlight flex flex-col"
    >
      <div className="aspect-square overflow-hidden rounded-md relative">
        <img
          src={resource.imageUrl || "/placeholder.svg"}
          alt={resource.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Button
          size="icon"
          variant={selected ? "default" : "secondary"}
          className={`absolute top-2 right-2 rounded-full w-8 h-8 p-0 transition-opacity ${
            selected
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          }`}
          onClick={handleToggleResource}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold break-words">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">{resource.type}</p>
      </div>
    </Link>
  )
}

