"use client";

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { useState } from "react";
import type { Resource, Author } from "@/types/resources";
import Image from "next/image";
import { X } from "lucide-react";

interface ResourceSheetProps {
  resource: Resource | Author | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceSheet({
  resource,
  open,
  onOpenChange
}: ResourceSheetProps) {
  const [isResourceSelected, setIsResourceSelected] = useState(false);

  if (!resource) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 w-[369px] sm:max-w-[369px]">
        <div
          className="h-full flex flex-col"
          data-state={open ? "open" : "closed"}
        >
          <div className="relative h-[200px] w-full overflow-hidden">
            <Image
              src={resource.imageUrl || "/placeholder.svg"}
              alt={resource.name || resource.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute top-0 right-0 p-4 flex gap-2">
              <SheetClose className="rounded-full w-8 h-8 p-0 bg-background/80 hover:bg-background/90 flex items-center justify-center">
                <X className="h-4 w-4" />
              </SheetClose>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-shadow">
              <p className="text-sm text-white/90 mb-2">
                {resource.type} • By {resource.authorId}
              </p>
              <h2 className="text-2xl font-bold text-white">
                {resource.name || resource.title}
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <SheetTitle className="mb-2">
              {resource.name || resource.title}
            </SheetTitle>
            <SheetDescription>
              {resource.description || resource.bio}
            </SheetDescription>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
