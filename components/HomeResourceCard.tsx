import { useState } from "react";
import type { Resource } from "@/types/resources";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { DetailSheet } from "@/components/DetailSheet";
import Image from "next/image";
import {PlusIcon} from "@/components/icons/PlusIcon";
import {cn} from "@/lib/utils";
import {CheckIcon} from "@/components/icons/CheckIcon";

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
            className="relative w-full rounded-[8px] transition-colors group cursor-pointer"
            onClick={handleCardClick}
        >
          <div
              className="relative bg-background rounded-[8px] w-full aspect-square overflow-hidden"
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
                className="absolute top-2 left-2 p-0 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={handleViewDetails}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M7.9999 0.935364C4.09837 0.935364 0.935547 4.09819 0.935547 7.99971C0.935547 11.9012 4.09837 15.0641 7.9999 15.0641C11.9014 15.0641 15.0642 11.9012 15.0642 7.99971C15.0642 4.09819 11.9014 0.935364 7.9999 0.935364ZM1.94887 7.99971C1.94887 4.65784 4.65802 1.9487 7.9999 1.9487C11.3418 1.9487 14.0509 4.65784 14.0509 7.99971C14.0509 11.3416 11.3418 14.0508 7.9999 14.0508C4.65802 14.0508 1.94887 11.3416 1.94887 7.99971ZM8.79991 4.8C8.79991 5.24183 8.44174 5.6 7.99991 5.6C7.55809 5.6 7.19991 5.24183 7.19991 4.8C7.19991 4.35817 7.55809 4 7.99991 4C8.44174 4 8.79991 4.35817 8.79991 4.8ZM6.40003 6.4H6.93336H8.00003C8.29459 6.4 8.53336 6.63878 8.53336 6.93334V10.6667H9.0667H9.60003V11.7333H9.0667H8.00003H6.93336H6.40003V10.6667H6.93336H7.4667V7.46667H6.93336H6.40003V6.4Z"
                      fill="white"/>
              </svg>
            </div>
          </div>
          <div className="w-full pt-2 pb-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
              {resource.type}
            </p>
            <h3 className="text-sm font-bold text-foreground text-left truncate max-w-36 transition-all duration-300">
              {resource.title}
            </h3>
          </div>
          <div className={cn('flex items-center space-x-2 absolute bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300', selected && 'opacity-100')}>
            {selected ? (
                <div onClick={handleCardClick} className="w-6 h-6 rounded-full bg-primary ring-[3px] ring-primary/25 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-primary-foreground"/>
                </div>
            ) : (
                <div onClick={handleCardClick} className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <PlusIcon className="w-4 h-4 text-primary-foreground fill-accent"/>
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
