import { cn } from '@/lib/utils';
import { TSelectedResource } from '@/types/resources';
import Image from 'next/image';
import { useState } from 'react';
import SelectedResourceCard from '../SelectedResourceCard';
import { IResourcesListProps } from './resources-list-type';
import { MoreResourcesSheet } from '@/components/more-resources-modal/more-resources-modal';

export function ResourcesList(props: IResourcesListProps) {
  const {
    selectedResources,
    onRemoveResource,
    customClassName = '',
    hideRemoveButton = false,
    direction = 'horizontal',
    wrapTitle = false,
    isLoading = false
  } = props;
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  if (selectedResources.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        direction === 'horizontal'
          ? 'flex-row md:grid md:grid-cols-4 overflow-x-auto'
          : 'flex-row md:flex-col overflow-x-auto',
        customClassName
      )}
    >
      {selectedResources.map((resource: TSelectedResource, index: number) => {
        if (selectedResources.length === 4 || index < 3) {
          return (
            <div
              key={index}
              className={cn(
                direction === 'horizontal'
                  ? 'w-[45%] sm:w-[48%] md:w-auto'
                  : 'w-[45%] sm:w-[48%] md:w-full'
              )}
            >
              <SelectedResourceCard
                resource={resource}
                hideRemove={hideRemoveButton}
                onRemoveResource={onRemoveResource}
              />
            </div>
          );
        }

        return null;
      })}
      {selectedResources.length > 4 ? (
        <div
          className="flex items-center bg-accent rounded-lg px-2 py-1 relative gap-2 cursor-pointer"
          onClick={() => {
            setIsSheetOpen(true);
          }}
        >
          <div className="flex">
            {selectedResources.map(
              (resource: TSelectedResource, index: number) => {
                if (index >= 3 && index < 6) {
                  const { image_url, title, name } = resource as any;

                  return (
                    <div
                      key={index}
                      className={cn(
                        'h-6 w-6 overflow-hidden flex-shrink-0 border-2 border-accent box-content rounded-md',
                        index > 3 ? '-ml-3' : ''
                      )}
                    >
                      <Image
                        src={image_url ?? '/placeholder.svg'}
                        alt={title ?? name}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                }
                return null;
              }
            )}
          </div>
          <div className="flex flex-col flex-grow min-w-0 pr-6">
            <span className="text-xsm font-semibold leading-[normal] truncate max-w-32">
              +{selectedResources.length - 3} More
            </span>
          </div>
        </div>
      ) : null}
      <MoreResourcesSheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
        }}
        {...props}
      />
    </div>
  );
}
