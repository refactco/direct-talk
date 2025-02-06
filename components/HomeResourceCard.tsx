import { useState } from "react";
import type { Resource } from "@/types/resources";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { Check, Info } from "lucide-react";
import { DetailSheet } from "@/components/DetailSheet";
import Image from "next/image";

interface HomeResourceCardProps {
  resource: Resource;
}

export function HomeResourceCard({ resource }: HomeResourceCardProps) {
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const [isResourceSheetOpen, setIsResourceSheetOpen] = useState(false);
  const selected = isSelected(resource.id);

  const handleCardClick = () => {
    if (selected) {
      removeResource(resource.id);
    } else {
      addResource(resource);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResourceSheetOpen(true);
  };

  return (
    <>
      <div
        className="relative w-full space-y-2 rounded-[8px] transition-colors group cursor-pointer"
        onClick={handleCardClick}
      >
        <div
          className={`relative bg-background rounded-[8px] w-full aspect-square overflow-hidden ${
            selected ? "ring-2 ring-primary" : ""
          }`}
        >
          <Image
            src={resource.imageUrl || "/placeholder.svg"}
            alt={resource.title}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={resource.id === "potter" || resource.id === "sapiens"}
          />
          <div
            className="absolute top-2 left-2 p-1 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleViewDetails}
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
          </div>
        </div>
        <div className="w-full px-1 sm:px-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground text-left truncate">
            {resource.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {resource.type}
          </p>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {selected && (
            <div className="w-6 h-6 sm:w-[30px] sm:h-[30px] rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-primary-foreground" />
            </div>
          )}
        </div>
      </div>

      <DetailSheet
        item={resource}
        open={isResourceSheetOpen}
        onOpenChange={setIsResourceSheetOpen}
      />
    </>
  );
}
