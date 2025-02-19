import { cn } from '@/lib/utils';
import { TSelectedResource } from '@/types/resources';
import Image from 'next/image';
import { useState } from 'react';
import SelectedResourceCard from '../SelectedResourceCard';
import { MoreResourcesModal } from '../more-resources-modal/more-resources-modal';
import { IResourcesListProps } from './resources-list-type';

export function ResourcesList(props: IResourcesListProps) {
  const {
    selectedResources,
    onRemoveResource,
    customClassName = '',
    hideRemoveButton = false
  } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (selectedResources.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex overflow-x-auto md:grid md:grid-cols-4 items-center gap-2',
        customClassName
      )}
    >
      {selectedResources.map((resource: TSelectedResource, index: number) => {
        if (selectedResources.length === 4 || index < 3) {
          return (
            <SelectedResourceCard
              resource={resource}
              hideRemove={hideRemoveButton}
              onRemoveResource={onRemoveResource}
            />
          );
        }

        return null;
      })}
      {selectedResources.length > 4 ? (
        <div
          className="flex items-center bg-accent rounded-lg px-2 py-1 relative gap-2 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <div className="flex">
            {selectedResources.map(
              (resource: TSelectedResource, index: number) => {
                if (index >= 3 && index < 6) {
                  const { image_url, title, name } = resource as any;

                  return (
                    <div
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
      <MoreResourcesModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
        }}
        {...props}
      />
    </div>
  );
}
