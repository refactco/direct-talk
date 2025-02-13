"use client";

import { Button } from "@/components/ui/button";
import {
  addResource,
  removeResource,
  useSelectedResources
} from "@/contexts/SelectedResourcesContext";
import type { IResource } from "@/types/resources";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ChatResourceCardProps {
  resource: IResource;
  onSelect: () => void;
}

export function ChatResourceCard({
  resource,
  onSelect
}: ChatResourceCardProps) {
  const { isSelected } = useSelectedResources();
  const selected = isSelected(resource.id);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggleResource = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected(resource.id)) {
      removeResource(resource.id);
    } else {
      addResource(resource);
    }
  };

  const handleOpenSheet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSheetOpen(true);
  };

  return (
    <>
      <div
        className="group relative rounded-md p-3 transition-colors hover:bg-background-highlight flex items-center space-x-3 cursor-pointer"
        onClick={handleToggleResource}
      >
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={resource.imageUrl || "/placeholder.svg"}
            alt={resource.title}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{resource.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {resource.type}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="rounded-full w-8 h-8 p-0 flex items-center justify-center hover:bg-background-highlight"
            onClick={handleOpenSheet}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
          <Button
            size="icon"
            variant={selected ? "default" : "secondary"}
            className={`rounded-full w-8 h-8 p-0 transition-opacity ${
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-background-secondary"
            }`}
            onClick={handleToggleResource}
          >
            {selected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {/* <DetailSheet
        item={resource}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      /> */}
    </>
  );
}
