"use client"

import type { Resource } from "@/types/resources"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { Button } from "@/components/ui/button"
import { Plus, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ResourceCard({ resource }: { resource: Resource }) {
  const { addResource, removeResource, isSelected } = useSelectedResources()
  const selected = isSelected(resource.id)

  const handleToggleResource = () => {
    if (selected) {
      removeResource(resource.id)
    } else {
      addResource(resource)
    }
  }

  return (
    <div
      className="group relative w-48 space-y-4 rounded-md p-3 transition-colors hover:bg-background-highlight flex flex-col"
      onClick={handleToggleResource}
    >
      <div className="aspect-square overflow-hidden rounded-md relative cursor-pointer">
        <img
          src={resource.imageUrl || "/placeholder.svg"}
          alt={resource.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
        <Button
          size="icon"
          variant={selected ? "default" : "secondary"}
          className={cn(
            "absolute top-2 right-2 rounded-full w-8 h-8 p-0 transition-opacity duration-300",
            selected
              ? "bg-green-500 hover:bg-green-600 text-white opacity-100"
              : "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => {
            e.stopPropagation()
            handleToggleResource()
          }}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100" />}
        </Button>
        <Link
          href={`/resources/${resource.id}`}
          className="absolute top-2 left-2 rounded-full w-8 h-8 p-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex-1 cursor-pointer">
        <h3 className="font-semibold break-words hover:underline">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">{resource.type}</p>
      </div>
    </div>
  )
}

