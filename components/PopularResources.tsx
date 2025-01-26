import Link from "next/link"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Resource } from "@/types/resource"

interface PopularResourcesProps {
  resources: Resource[]
  onResourceSelect: (resource: Resource) => void
}

export default function PopularResources({ resources, onResourceSelect }: PopularResourcesProps) {
  if (!resources || resources.length === 0) {
    return null
  }

  return (
    <ScrollArea>
      <div className="flex space-x-6">
        {resources.map((resource) => (
          <div key={resource.id} className="space-y-3 w-[200px] shrink-0" onClick={() => onResourceSelect(resource)}>
            <div className="aspect-square relative overflow-hidden rounded-md">
              <Image
                src={resource.image || "/placeholder.svg"}
                alt={resource.title}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h3 className="font-semibold truncate">{resource.title}</h3>
              <p className="text-sm text-gray-400 truncate">{resource.author}</p>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

