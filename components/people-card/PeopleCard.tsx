import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { cn } from '@/lib/utils';
import type { IAuthor } from '@/types/resources';
import { Check, Minus, Plus, UserIcon } from 'lucide-react';
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
  const { id, name } = people ?? {};
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
            <Skeleton className="h-5 w-full" />
            {/* <Skeleton className="h-4 w-full" /> */}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="relative w-full transition-colors group/people cursor-pointer hover:bg-accent p-4 rounded-[8px]"
        onClick={handleAddClick}
      >
        <div className="relative bg-background rounded-full w-full aspect-square">
          {people.image_url ? (
            <Image
              src={people.image_url || '/placeholder.svg'}
              alt={people.name}
              fill
              className={cn(
                'object-cover transition-all duration-300 group-hover/people:scale-105 grayscale group-hover/people:grayscale-0 rounded-full',
                selected ? 'grayscale-0' : 'grayscale'
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent rounded-full">
              <UserIcon className="stroke-muted-foreground" />
            </div>
          )}
          {showDetails ? (
            <div
              className="shadow absolute flex items-center gap-1 top-[10px] left-2 p-1 rounded-[62.4375rem] bg-foreground opacity-100 md:opacity-0 group-hover/people:opacity-100 transition-opacity duration-300"
              onClick={handleViewDetails}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM7.75 4.5C7.89834 4.5 8.04334 4.54399 8.16668 4.6264C8.29002 4.70881 8.38615 4.82594 8.44291 4.96299C8.49968 5.10003 8.51453 5.25083 8.48559 5.39632C8.45665 5.5418 8.38522 5.67544 8.28033 5.78033C8.17544 5.88522 8.04181 5.95665 7.89632 5.98559C7.75083 6.01453 7.60003 5.99968 7.46299 5.94291C7.32595 5.88614 7.20881 5.79001 7.1264 5.66668C7.04399 5.54334 7 5.39834 7 5.25C7 5.05109 7.07902 4.86032 7.21967 4.71967C7.36032 4.57902 7.55109 4.5 7.75 4.5ZM8.5 11.5C8.23479 11.5 7.98043 11.3946 7.7929 11.2071C7.60536 11.0196 7.5 10.7652 7.5 10.5V8C7.36739 8 7.24022 7.94732 7.14645 7.85355C7.05268 7.75979 7 7.63261 7 7.5C7 7.36739 7.05268 7.24021 7.14645 7.14645C7.24022 7.05268 7.36739 7 7.5 7C7.76522 7 8.01957 7.10536 8.20711 7.29289C8.39465 7.48043 8.5 7.73478 8.5 8V10.5C8.63261 10.5 8.75979 10.5527 8.85356 10.6464C8.94732 10.7402 9 10.8674 9 11C9 11.1326 8.94732 11.2598 8.85356 11.3536C8.75979 11.4473 8.63261 11.5 8.5 11.5Z"
                  fill="#1C1917"
                />
              </svg>
              {/* <InfoIcon className="fill-foreground w-4 h-4" /> */}
              <span className="text-[0.5625rem] text-accent font-semibold">
                About
              </span>
            </div>
          ) : null}
        </div>
        <div className="w-full pt-2">
          <h3 className="text-sm font-bold text-foreground text-left truncate max-w-[calc(100%-28px)] transition-all duration-300">
            {name}
          </h3>
        </div>
        <div
          className={cn(
            'flex items-center space-x-2 absolute bottom-4 right-2 opacity-100 md:opacity-0 group-hover/people:opacity-100 transition-opacity duration-300',
            selected ? 'md:opacity-100' : ''
          )}
        >
          {selected ? (
            <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-primary hover:bg-foreground flex items-center justify-center group/add">
              <Check
                className="w-3 h-3 md:w-3 md:h-3 text-primary-foreground group-hover/add:hidden"
                strokeWidth={3}
              />
              <Minus
                className="md:w-3 md:h-3 text-primary-foreground hidden group-hover/add:block"
                strokeWidth={3}
              />
            </div>
          ) : (
            <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center">
              <Plus
                className="w-3 h-3 md:w-3 md:h-3 text-primary-foreground fill-accent"
                strokeWidth={3}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
