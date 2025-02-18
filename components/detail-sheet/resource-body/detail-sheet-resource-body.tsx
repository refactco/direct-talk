'use client';

import { CheckIcon } from '@/components/icons/CheckIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
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
import { cn } from '@/lib/utils';
import { IAuthor, IResource } from '@/types/resources';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IDetailSheetResourceBodyTypeProps } from './detail-sheet-resource-body-type';
import { DetailSheetResourceEpisodes } from './episodes/detail-sheet-resource-episodes';

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
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex gap-0 cursor-pointer">
                      {people?.map((pers: IAuthor, index: number) => {
                        return (
                          <div
                            className={cn(
                              'rounded-full w-7 h-7 aspect-square relative border-2 border-[#09090B]',
                              index > 0 ? '-ml-3' : ''
                            )}
                          >
                            <Image
                              alt=""
                              src={pers.image_url}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto flex flex-col items-start gap-3">
                    {people?.map((person: IAuthor, index: number) => {
                      const { name, image_url } = person;

                      return (
                        <>
                          <div
                            className="inline-flex items-center h-7 relative gap-2 text-sm text-[#A7A7A7] cursor-pointer hover:text-white"
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
                <div className="items-center max-w-36 truncate text-ellipsis">
                  {people?.map((pers: IAuthor, index: number) => {
                    return (
                      <>
                        <span
                          className="text-xsm font-semibold text-neutral-300 hover:text-white cursor-pointer"
                          onClick={() => {
                            pushDetailItem(pers);
                          }}
                        >
                          {pers.name}
                        </span>
                        {index < people.length - 1 ? <span>, </span> : null}
                      </>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-8 w-8 rounded-full text-black hover:bg-white/90 hover:scale-105 transition-transform self-end',
              isResourceSelected ? 'bg-primary' : 'bg-white'
            )}
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
