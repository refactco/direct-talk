"use client"

import { Sheet, SheetContent, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useState } from "react"
import type { Resource, Author } from "@/types/resources"
import Image from "next/image"

interface ResourceSheetProps {
  resource: Resource | Author | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceSheet({ resource, open, onOpenChange }: ResourceSheetProps) {
  const [isResourceSelected, setIsResourceSelected] = useState(false)

  if (!resource) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[369px] p-0 bg-background border-l border-border data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right duration-300 ease-in-out">
        <div className="relative h-[200px] w-full overflow-hidden transition-transform duration-300 ease-in-out">
          <Image
            src={resource.imageUrl || "/placeholder.svg"}
            alt={resource.name || resource.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <SheetClose className="rounded-full w-8 h-8 p-0" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-shadow">
            <p className="text-sm text-white/90 mb-2">
              {resource.type} • By {resource.authorId}
            </p>
            <h2 className="text-2xl font-bold text-white">{resource.name || resource.title}</h2>
          </div>
        </div>
        <div className="p-6">
          <SheetTitle>{resource.name || resource.title}</SheetTitle>
          <SheetDescription>{resource.description || resource.bio}</SheetDescription>
        </div>
      </SheetContent>
    </Sheet>
  )
}

