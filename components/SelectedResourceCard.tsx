import Image from "next/image";
import { CloseIcon } from "@/components/icons/CloseIcon";
import type React from "react";

interface SelectedResourceCardProps {
  resource: any;
  onRemoveResource?: (id: string) => void;
  hideRemove?: boolean;
}

function SelectedResourceCard({
  resource,
  onRemoveResource,
  hideRemove = false
}: SelectedResourceCardProps) {
  return (
    <div
      key={resource.id}
      className="flex items-center gap-2 bg-accent rounded-lg px-2 py-1 h-9 relative"
    >
      <div className="h-6 w-6 overflow-hidden flex-shrink-0">
        <Image
          src={resource.imageUrl || "/placeholder.svg"}
          alt={resource.title}
          width={24}
          height={24}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow min-w-0 pr-6">
        <span className="text-[10px] leading-normal text-muted-foreground uppercase">
          {resource.type}
        </span>
        <span className="text-[13px]  font-bold leading-normal truncate max-w-40">
          {resource.title}
        </span>
      </div>
      {!hideRemove ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (onRemoveResource) {
              onRemoveResource(resource.id);
            }
          }}
          className="absolute top-1 right-1 hover:text-muted-foreground"
        >
          <CloseIcon className="fill-white h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default SelectedResourceCard;
