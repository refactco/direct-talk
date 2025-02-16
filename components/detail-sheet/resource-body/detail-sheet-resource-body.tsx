'use client';

import { Button } from '@/components/ui/button';
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

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cover Image and Info */}
        <div className="p-0">
          <div className="relative aspect-square w-36 h-36 overflow-hidden rounded-[0.5rem] border border-[#27272A]">
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
          <div className="text-xs font-medium text-[#A7A7A7] uppercase tracking-wider mb-1">
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
                {people?.map((person: IAuthor, index: number) => {
                  const { name, image_url } = person;

                  return (
                    <>
                      <div
                        className="inline-flex items-center gap-2 text-sm text-[#A7A7A7] cursor-pointer hover:text-white"
                        onClick={() => {
                          pushDetailItem(person);
                        }}
                      >
                        {image_url ? (
                          <div className="rounded-full w-6 h-6 relative aspect-square">
                            <Image
                              alt=""
                              src={image_url}
                              fill
                              className="object-cover w-6 h-6 rounded-full"
                            />
                          </div>
                        ) : null}
                        <span>{name}</span>
                      </div>
                      {index + 1 < people.length ? <span>,</span> : ''}
                    </>
                  );
                })}
              </div>
            )}
          </div>
          <Button
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
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Description */}
        <div className="space-y-1">
          <h3 className="text-[#f2f2f2] text-base font-normal">About</h3>
          <p className="text-sm leading-relaxed text-[#A7A7A7]">
            {description}
          </p>
        </div>
      </div>
      <DetailSheetResourceEpisodes resource={detailedResource} />
    </>
  );
}
