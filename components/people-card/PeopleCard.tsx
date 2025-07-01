import { cn } from '@/lib/utils';
import type { IAuthor } from '@/types/resources';
import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';

interface PeopleCardProps {
  people: IAuthor;
  isLoading?: boolean;
  hasSelectedAuthor?: boolean;
}

export function PeopleCard({
  people,
  isLoading = false,
  hasSelectedAuthor = false
}: PeopleCardProps) {
  const { name } = people ?? {};
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (!isLoading && people) {
      if (selected) {
        // If already selected, deselect it
        removeResource(people.id);
      } else {
        // If not selected, select it
        addResource(people, 'people');
      }
    }
  };

  const selected = people ? isSelected(people.id) : false;
  const isDisabled = hasSelectedAuthor && !selected;

  if (isLoading) {
    return (
      <div className="relative w-full p-2 md:p-4 rounded-lg flex flex-col items-center">
        <div className="relative bg-background rounded-full w-full max-w-[100px] aspect-square overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
        </div>
        <div className="w-full pt-1 md:pt-2">
          <Skeleton className="h-4 md:h-5 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full transition-all duration-300 group/people cursor-pointer hover:bg-accent p-2 md:p-4 rounded-lg flex flex-col items-center',
        selected && 'bg-accent border-2 border-primary',
        isDisabled && 'opacity-50'
      )}
      onClick={handleClick}
    >
      <div className="relative bg-background rounded-full w-full max-w-[100px] aspect-square overflow-hidden">
        {imageLoading && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
        )}

        {people.image_url && (
          <Image
            src={people.image_url}
            alt={people.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              'object-cover transition-all duration-300 group-hover/people:scale-105',
              imageLoading && 'opacity-0',
              // Grayscale by default, remove on hover or when selected
              !selected && 'grayscale group-hover/people:grayscale-0',
              selected && 'grayscale-0'
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}

        {(!people.image_url || imageError) && !imageLoading && (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="w-8 h-8 bg-muted-foreground/40 rounded-full" />
          </div>
        )}
      </div>
      <div className="w-full pt-1 md:pt-2">
        <h3
          className={cn(
            'text-[10px] md:text-xs font-bold truncate text-center transition-colors duration-300',
            selected ? 'text-primary' : 'text-foreground'
          )}
        >
          {name}
        </h3>
      </div>
    </div>
  );
}
