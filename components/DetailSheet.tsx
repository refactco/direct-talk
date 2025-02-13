"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import type { IAuthor, Resource } from "@/types/resources";
import { Check, Plus, X } from "lucide-react";
import Image from "next/image";

interface DetailSheetProps {
  item: Resource | IAuthor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailSheet({ item, open, onOpenChange }: DetailSheetProps) {
  const { addResource, removeResource, isSelected } = useSelectedResources();

  if (!item) return null;

  const isResource = "type" in item;
  const isAuthor = "bio" in item;
  const isResourceSelected = isResource ? isSelected(item.id) : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[369px] p-0 bg-[#121212] border-l border-[#282828] text-white"
      >
        <div className="relative flex flex-col h-full">
          {/* Header with close button */}
          <div className="absolute top-4 right-4 z-10">
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-black/40 hover:bg-black/60"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>

          {/* Cover Image and Info */}
          <div className="p-4">
            <div className="relative aspect-square w-36 h-36 overflow-hidden">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={isResource ? item.title : item.name}
                fill
                className="object-cover w-36 h-36"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col px-4 pb-5">
            {/* Resource/Author Info */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="text-xs font-medium text-[#A7A7A7] uppercase tracking-wider mb-1">
                  {isResource ? item.type : "Author"}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {isResource ? item.title : item.name}
                </h2>
                <div className="text-sm text-[#A7A7A7]">
                  JK rowling
                  {isResource
                    ? item.authorId
                    : `${item.resources.length} resources`}
                </div>
              </div>
              {isResource && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform"
                  onClick={() =>
                    isResourceSelected
                      ? removeResource(item.id)
                      : addResource(item)
                  }
                >
                  {isResourceSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-[#f2f2f2] text-base font-normal">About</h3>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <p className="text-sm leading-relaxed text-[#A7A7A7]">
                  {isResource ? item.description : item.bio}
                </p>
              </ScrollArea>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
