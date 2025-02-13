"use client";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { InfoIcon } from "@/components/icons/InfoIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { useResourceDetail } from "@/contexts/ResourceDetailContext";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { cn } from "@/lib/utils";
import type { IResource } from "@/types/resources";
import Image from "next/image";
import { useState } from "react";

interface HomeResourceCardProps {
  resource: IResource;
  showDetails?: boolean;
  hideType?: boolean;
  isLoading?: boolean;
}

export function ResourceCard({
  resource,
  showDetails = true,
  hideType = false,
  isLoading = false
}: HomeResourceCardProps) {
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const [isResourceSheetOpen, setIsResourceSheetOpen] = useState(false);
  const selected = isSelected(resource?.id);
  const { setSelectedDetailItems } = useResourceDetail();

  const handleCardClick = () => {
    if (selected) {
      removeResource(resource.id);
    } else {
      addResource(resource);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDetailItems([resource]);
  };
  if (isLoading) {
    return (
      <>
        <div className="flex flex-col space-y-3">
          <Skeleton className="aspect-square w-full rounded-[8px]" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[50%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="relative w-full rounded-[8px] transition-colors group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative bg-background rounded-[8px] w-full aspect-square overflow-hidden">
          <Image
            src={resource?.image_url || "/placeholder.svg"}
            alt={resource?.title}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          {showDetails ? (
            <div
              className="absolute top-2 left-2 p-0 rounded-full bg-background opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleViewDetails}
            >
              <InfoIcon />
            </div>
          ) : null}
        </div>
        <div className="w-full pt-2 pb-1">
          {!hideType ? (
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
              {resource?.type}
            </p>
          ) : null}
          <h3 className="text-sm font-bold text-foreground text-left truncate max-w-[calc(100%-28px)] transition-all duration-300">
            {resource?.title}
          </h3>
        </div>
        <div
          className={cn(
            "flex items-center space-x-2 absolute bottom-2 right-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            selected && "opacity-100",
            hideType && "bottom-1 right-0.5"
          )}
        >
          {selected ? (
            <div
              onClick={handleCardClick}
              className="w-6 h-6 rounded-full bg-primary ring-[3px] ring-primary/25 flex items-center justify-center"
            >
              <CheckIcon className="w-4 h-4 text-primary-foreground" />
            </div>
          ) : (
            <div
              onClick={handleCardClick}
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
            >
              <PlusIcon className="w-4 h-4 text-primary-foreground fill-accent" />
            </div>
          )}
        </div>
      </div>
      {/* {showDetails ? (
        <DetailSheet
          item={resource}
          open={isResourceSheetOpen}
          onOpenChange={setIsResourceSheetOpen}
        />
      ) : null} */}
    </>
  );
}
