"use client"

import type { Resource } from "@/types/resources"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { Button } from "@/components/ui/button"
import { Plus, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import type React from "react"

interface ChatResourceCardProps {
  resource: Resource
  onSelect: () => void
}

export function ChatResourceCard({ resource, onSelect }: ChatResourceCardProps) {
  const { isSelected } = useSelectedResources()
  const selected = isSelected(resource.id)

  const handleToggleResource = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
  }

  return (
    <div
      className="group relative rounded-md p-3 transition-colors hover:bg-background-highlight flex items-center space-x-3 cursor-pointer"
      onClick={handleToggleResource}
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={resource.imageUrl || "/placeholder.svg"}
          alt={resource.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{resource.title}</p>
        <p className="text-sm text-muted-foreground truncate">{resource.type}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Link
          href={`/resources/${resource.id}`}
          className="rounded-full w-8 h-8 p-0 flex items-center justify-center hover:bg-background-highlight"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Button
          size="icon"
          variant={selected ? "default" : "secondary"}
          className={`rounded-full w-8 h-8 p-0 transition-opacity ${
            selected ? "bg-primary text-primary-foreground" : "bg-background-secondary"
          }`}
          onClick={handleToggleResource}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

