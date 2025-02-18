'use client';

import { DetailItemList } from '@/components/detail-item-list/detail-item-list';
import { Button } from '@/components/ui/button';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { getAuthor } from '@/lib/api';
import { toCapitalize } from '@/lib/text-modifier';
import { cn } from '@/lib/utils';
import { IAuthor } from '@/types/resources';
import { Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IDetailSheetPeopleBodyTypeProps } from './detail-sheet-people-body-type';

export function DetailSheetPeopleBody(props: IDetailSheetPeopleBodyTypeProps) {
  const { person } = props;
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailedPerson, setDetailedPerson] = useState<IAuthor>(person);
  const {
    name,
    image_url,
    id,
    description,
    resources = {
      items: { shows: [], books: [], episodes: [] }
    }
  } = detailedPerson;

  console.log({ detailedPerson });

  const fetchDetailedPerson = async () => {
    setIsLoading(true);
    try {
      const fetchedPerson: IAuthor = await getAuthor(id.toString());

      setDetailedPerson(fetchedPerson);
    } catch (error) {
      console.error('Error fetching popular resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedPerson();
  }, []);

  const isResourceSelected = isSelected(id);

  console.log({ isResourceSelected });

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cover Image and Info */}
        <div className="p-0">
          <div className="relative aspect-square w-36 h-36 overflow-hidden rounded-full border border-border">
            <Image
              src={image_url ?? '/placeholder.svg'}
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
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-8 w-8 rounded-full text-black hover:bg-white/90 hover:scale-105 transition-transform self-end',
              isResourceSelected ? 'bg-primary' : 'bg-white'
            )}
            onClick={() =>
              isResourceSelected ? removeResource(id) : addResource(person)
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

      {description ? (
        <div className="flex flex-col">
          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-[#f2f2f2] text-base font-normal">About</h3>
            <p className="text-sm leading-relaxed text-[#A7A7A7]">
              {description}
            </p>
          </div>
        </div>
      ) : null}
      {Object.entries(resources.items).map(([key, value], index) => {
        return (
          <DetailItemList
            title={toCapitalize(key)}
            resources={value}
            isLoading={isLoading}
          />
        );
      })}
    </>
  );
}
