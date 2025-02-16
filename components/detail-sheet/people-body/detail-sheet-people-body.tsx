'use client';

import { DetailItemList } from '@/components/detail-item-list/detail-item-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuthor } from '@/lib/api';
import { toCapitalize } from '@/lib/text-modifier';
import { IAuthor } from '@/types/resources';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IDetailSheetPeopleBodyTypeProps } from './detail-sheet-people-body-type';

export function DetailSheetPeopleBody(props: IDetailSheetPeopleBodyTypeProps) {
  const { person } = props;
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

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cover Image and Info */}
        <div className="p-0">
          <div className="relative aspect-square w-36 h-36 overflow-hidden rounded-full border border-[#27272A]">
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
