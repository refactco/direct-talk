import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { cn } from '@/lib/utils';
import type { IAuthor } from '@/types/resources';
import {
  CheckIcon,
  InfoIcon,
  MinusCircleIcon,
  PlusIcon,
  UserIcon
} from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface PeopleCardProps {
  people: IAuthor;
  isLoading?: boolean;
  showDetails?: boolean;
}

export function PeopleCard({
  people,
  isLoading = false,
  showDetails = true
}: PeopleCardProps) {
  const { id, image_url, name } = people;
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const selected = isSelected(id);
  const { setSelectedDetailItems } = useResourceDetail();

  const handleAddClick = () => {
    if (selected) {
      removeResource(id);
    } else {
      addResource(people, 'people');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDetailItems([people]);
  };

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col space-y-3">
          <Skeleton className="aspect-square w-full rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[50%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="relative w-full transition-colors group/people cursor-pointer"
        onClick={handleAddClick}
      >
        <div className="relative bg-background rounded-full w-full aspect-square overflow-hidden">
          {people.image_url ? (
            <Image
              src={people.image_url || '/placeholder.svg'}
              alt={people.name}
              fill
              className="object-cover transition-all duration-300 group-hover/people:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent">
              <UserIcon className="stroke-muted-foreground" />
            </div>
          )}
          {showDetails ? (
            <div
              className="absolute top-5 left-5 p-0 rounded-full bg-background opacity-100 md:opacity-0 group-hover/people:opacity-100 transition-opacity duration-300"
              onClick={handleViewDetails}
            >
              <InfoIcon />
            </div>
          ) : null}
        </div>
        <div className="w-full pt-2 pb-1">
          <h3 className="text-sm font-bold text-foreground text-left truncate max-w-[calc(100%-28px)] transition-all duration-300">
            {name}
          </h3>
        </div>
        <div
          className={cn(
            'flex items-center space-x-2 absolute bottom-2 right-0 opacity-100 md:opacity-0 group-hover/people:opacity-100 transition-opacity duration-300',
            selected && 'md:opacity-100'
          )}
        >
          {selected ? (
            <div className="w-6 h-6 rounded-full bg-primary hover:bg-red-800 ring-[3px] ring-primary/25 hover:ring-red-800/25 flex items-center justify-center group/add">
              <CheckIcon className="w-4 h-4 text-primary-foreground group-hover/add:hidden" />
              <MinusCircleIcon className="w-4 h-4 text-white hidden group-hover/add:block" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <PlusIcon className="w-4 h-4 text-primary-foreground fill-accent" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
