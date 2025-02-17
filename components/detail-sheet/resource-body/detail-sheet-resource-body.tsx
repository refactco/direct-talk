'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { getResource } from '@/lib/api';
import { IAuthor, IResource } from '@/types/resources';
import { Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IDetailSheetResourceBodyTypeProps } from './detail-sheet-resource-body-type';
import { DetailSheetResourceEpisodes } from './episodes/detail-sheet-resource-episodes';
import {CheckIcon} from "@/components/icons/CheckIcon";
import {PlusIcon} from "@/components/icons/PlusIcon";

export function DetailSheetResourceBody(
  props: IDetailSheetResourceBodyTypeProps
) {
  const { resource } = props;

  const { addResource, removeResource, isSelected } = useSelectedResources();
  const { pushDetailItem } = useResourceDetail();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailedResource, setDetailedResource] = useState<IResource>(resource);
  const { title, type, image_url, id, description, people } = detailedResource;

  useEffect(() => {
    const { id: resourceId } = resource;

    if (resourceId !== id) {
      setDetailedResource(resource);
    }

    const fetchDetailedResource = async () => {
      setIsLoading(true);

      try {
        const fetchedResource: IResource = await getResource(
          resourceId.toString()
        );

        setDetailedResource(fetchedResource);
      } catch (error) {
        console.error('Error fetching popular resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedResource();
  }, [resource]);

  const isResourceSelected = isSelected(id);
  const [firstPerson, ...rest] = people ?? [];

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cover Image and Info */}
        <div className="p-0">
          <div className="relative aspect-square w-36 h-36 overflow-hidden rounded-[0.5rem] border border-border">
            <Image
              src={image_url ?? '/placeholder.svg'}
              alt={title}
              fill
              className="object-cover w-36 h-36"
              priority
            />
          </div>
        </div>
        {/* Resource/Author Info */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {type}
          </div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
        </div>
        <div className="flex gap-4 items-center justify-between selectedDetailItems-start">
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <div className="flex gap-4">
                {firstPerson ? (
                  <div
                    className="inline-flex items-center h-7 relative gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => {
                      pushDetailItem(firstPerson);
                    }}
                  >
                    {firstPerson.image_url ? (
                      <div className="rounded-full w-7 h-7 aspect-square absolute">
                        <Image
                          alt=""
                          src={firstPerson.image_url}
                          fill
                          className="object-cover border border-border rounded-full"
                        />
                      </div>
                    ) : null}
                    <span className="pl-9 leading-7">{firstPerson.name}</span>
                  </div>
                ) : null}
                {people && people.length > 1 ? (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 border border-border rounded-full justify-center items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <span className="text-xs font-semibold">
                            +{people.length - 1}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto flex flex-col items-start gap-3">
                          {rest?.map((person: IAuthor, index: number) => {
                            const { name, image_url } = person;

                            return (
                              <>
                                <div
                                  className="inline-flex items-center h-7 relative gap-2 text-sm text-muted-foreground cursor-pointer hover:text-white"
                                  onClick={() => {
                                    pushDetailItem(person);
                                  }}
                                >
                                  {image_url ? (
                                    <div className="rounded-full w-7 h-7 aspect-square absolute">
                                      <Image
                                        alt=""
                                        src={image_url}
                                        fill
                                        className="object-cover rounded-full"
                                      />
                                    </div>
                                  ) : null}
                                  <span className="pl-9 leading-7">{name}</span>
                                </div>
                              </>
                            );
                          })}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <span className="text-sm font-semibold leading-7">
                      People
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-foreground text-black hover:bg-white/90 hover:scale-105 transition-transform self-end"
            onClick={() =>
              isResourceSelected ? removeResource(id) : addResource(resource)
            }
          >
            {isResourceSelected ? (
                <CheckIcon className="w-4 h-4 fill-primary-foreground" />
            ) : (
                <PlusIcon className="w-4 h-4 fill-accent" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Description */}
        <div className="space-y-1">
          <h3 className="text-base font-normal">About</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <DetailSheetResourceEpisodes resource={detailedResource} />
    </>
  );
}
