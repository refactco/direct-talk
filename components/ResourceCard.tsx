"use client";

import { useState } from "react";
import type { Resource } from "@/types/resources";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DetailSheet } from "@/components/ResourceSheet";

export function ResourceCard({ resource }: { resource: Resource }) {
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const selected = isSelected(resource.id);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selected) {
      removeResource(resource.id);
    } else {
      addResource(resource);
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSheetOpen(true);
  };

  const getResourceIcon = (type: string) => {
    return (
      <div className="w-8 h-8 bg-[#343330] rounded-full flex items-center justify-center text-white">
        {type[0].toUpperCase()}
      </div>
    );
  };

  return (
    <>
      <div
        className="relative w-[166px] space-y-4 rounded-[8px] transition-colors hover:bg-[#262626] group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="bg-white rounded-[8px] w-[166px] h-[166px] flex items-center justify-center relative overflow-hidden">
          {getResourceIcon(resource.type)}
        </div>
        <div className="w-full pl-2 pt-4">
          <h3 className="text-[16px] font-bold text-white text-left truncate">
            {resource.title}
          </h3>
          <p className="text-[14px] text-white mt-1">{resource.type}</p>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full transition-colors",
              selected ? "bg-green-500" : "bg-white bg-opacity-20"
            )}
          />
        </div>
        <div
          className="absolute top-2 left-2 p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleIconClick}
        >
          <ArrowUpRight className="w-4 h-4 text-black" />
        </div>
      </div>

      <DetailSheet
        item={resource}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
