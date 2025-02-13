import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { IDetailItemProps } from "./detail-item-type";

export function DetailItem(props: IDetailItemProps) {
  const { resource, onClick, onAddClick } = props;
  const { title, type, image_url, id, people } = resource;
  const { addResource, removeResource, isSelected } = useSelectedResources();

  const isResourceSelected = isSelected(id);
  const className = isResourceSelected
    ? "bg-primary hover:bg-primary/90"
    : "bg-white hover:bg-white/90";

  return (
    <div className="flex items-center justify-between bg-[#1C1917] rounded-lg px-3 py-4 relative">
      <div className="flex items-center gap-2" onClick={onClick}>
        <div className="h-12 w-12 overflow-hidden flex-shrink-0">
          <Image
            src={image_url ?? "/placeholder.svg"}
            alt={title}
            width={24}
            height={24}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 self-start">
          <span className="text-xs leading-normal text-[#f2f2f2] font-semibold">
            {title}
          </span>
          {people ? (
            <span className="text-xs leading-normal text-[#a1a1a1] font-normal">
              {people[0].name}
            </span>
          ) : null}
        </div>
      </div>
      <div className="self-end">
        <Button
          size="icon"
          variant="ghost"
          className={`h-6 w-6 rounded-full ${className} text-black hover:text-black hover:scale-105 transition-transform self-end`}
          onClick={() => {
            isResourceSelected ? removeResource(id) : addResource(resource);
          }}
        >
          {isResourceSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
