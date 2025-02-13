"use client";

import { DetailItem } from "@/components/detail-item/detail-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthor } from "@/lib/api";
import { toCapitalize } from "@/lib/text-modifier";
import { IAuthor, IResource } from "@/types/resources";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IDetailSheetPeopleBodyTypeProps } from "./detail-sheet-people-body-type";

export function DetailSheetPeopleBody(props: IDetailSheetPeopleBodyTypeProps) {
  const { person } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailedPerson, setDetailedPerson] = useState<IAuthor>(person);
  const { name, image_url, id, description, resources } = detailedPerson;

  const fetchDetailedPerson = async () => {
    setIsLoading(true);
    try {
      const fetchedPerson: IAuthor = await getAuthor(id.toString());

      console.log({ fetchedPerson });

      setDetailedPerson(fetchedPerson);
    } catch (error) {
      console.error("Error fetching popular resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedPerson();
  }, []);
  // const { addResource, removeResource, isSelected } = useSelectedResources();
  // const { selectedDetailItems, setSelectedDetailItems } = useResourceDetail();

  // if (!selectedDetailItems) return null;

  // const selectedDetailItem =
  //   selectedDetailItems[selectedDetailItems.length - 1];

  // console.log({ selectedDetailItem });

  // const { id, description, image_url, ref_id } = selectedDetailItem;
  // const isResource = "type" in selectedDetailItem;
  // const isAuthor = "bio" in selectedDetailItem;
  // const isResourceSelected = isSelected(id);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cover Image and Info */}
        <div className="p-0">
          <div className="relative aspect-square w-36 h-36 overflow-hidden rounded-full border border-[#27272A]">
            <Image
              src={image_url ?? "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover w-36 h-36"
              priority
            />
          </div>
        </div>
        {/* Resource/Author Info */}
        <div className="flex justify-between selectedDetailItems-start">
          <div className="flex-1">
            {/* <div className="text-xs font-medium text-[#A7A7A7] uppercase tracking-wider mb-1">
              {type}
            </div> */}
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
            {/* <div className="text-sm text-[#A7A7A7]">JK rowling</div> */}
          </div>
          {/* <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform self-end"
            onClick={() =>
              isResourceSelected ? removeResource(id) : addResource(resource)
            }
          >
            {isResourceSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button> */}
        </div>
      </div>

      {description ? (
        <div className="flex flex-col">
          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-[#f2f2f2] text-base font-normal">About</h3>
            <ScrollArea className="h-[calc(100vh-400px)]">
              <p className="text-sm leading-relaxed text-[#A7A7A7]">
                {description}
              </p>
            </ScrollArea>
          </div>
        </div>
      ) : null}
      {!isLoading ? (
        Object.entries(resources.items).map(([key, value], index) => {
          console.log({ value });
          if (value && value.length > 0) {
            return (
              <div key={index} className="flex flex-col gap-2">
                <h4 className="text-base font-semibold">{toCapitalize(key)}</h4>
                {value.map((resource: IResource, resourceIndex: number) => {
                  // const { title, image_url, type } = resource;
                  return (
                    <DetailItem
                      key={resourceIndex}
                      resource={resource}
                      onAddClick={() => {}}
                      onClick={() => {}}
                    />
                  );
                })}
              </div>
            );
          }

          return null;
        })
      ) : (
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-semibold">Resources</h4>
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      )}
    </>
  );
}
