"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Check, ExternalLink } from "lucide-react";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import type { Resource, Author } from "@/types/resources";
import Image from "next/image";
import Link from "next/link";

interface DetailSheetProps {
  item: Resource | Author | null;
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
      <SheetContent className="w-[369px] p-0 bg-background border-l border-border data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right duration-300 ease-in-out">
        <div className="relative h-[200px] w-full overflow-hidden transition-transform duration-300 ease-in-out">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name || item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            {isResource && (
              <Button
                size="icon"
                variant={isResourceSelected ? "default" : "secondary"}
                className="rounded-full w-8 h-8"
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
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full w-8 h-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-shadow">
            {isResource && (
              <p className="text-sm text-white/90 mb-2">
                {item.type} • By {item.authorId}
              </p>
            )}
            <h2 className="text-2xl font-bold text-white">
              {item.name || item.title}
            </h2>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] p-6 transition-transform duration-300 ease-in-out">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">About</h3>
              <p className="text-sm text-muted-foreground">
                {isResource ? item.description : item.bio}
              </p>
            </div>
            {isResource && (
              <div className="flex flex-wrap gap-2">
                {item?.topics?.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground text-base px-3 py-1"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
            {isResource && item.content && (
              <div>
                <h3 className="font-semibold text-foreground">Content</h3>
                <div className="text-sm text-muted-foreground">
                  {item.content}
                </div>
              </div>
            )}
            {isAuthor && (
              <div>
                <h3 className="font-semibold text-foreground">Resources</h3>
                <ul className="mt-2 space-y-2">
                  {item.resources.map((resourceId) => (
                    <li key={resourceId}>
                      <Link
                        href={`/resources/${resourceId}`}
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {resourceId}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
