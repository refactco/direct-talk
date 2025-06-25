import { cn } from '@/lib/utils';
import { TSelectedResource } from '@/types/resources';
import Image from 'next/image';
import { IResourcesListProps } from './resources-list-type';

export function ResourcesList(props: IResourcesListProps) {
  const {
    selectedResources,
    customClassName = '',
    direction = 'horizontal',
    wrapTitle = false,
    isLoading = false
  } = props;

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
        const { image_url, title, name, link, url } = resource as any;

        return (
          <div
            key={index}
            className={cn(
              direction === 'horizontal'
                ? 'w-[45%] sm:w-[48%] md:w-auto'
                : 'w-[45%] sm:w-[48%] md:w-full'
            )}
          >
            <a
              href={link || url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-accent hover:bg-accent/80 transition-colors rounded-lg p-2 relative gap-2 cursor-pointer"
            >
              <div className="h-6 w-6 overflow-hidden flex-shrink-0 rounded-md">
                <Image
                  src={image_url ?? '/youtube.png'}
                  alt={title ?? name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow min-w-0">
                <span className="text-xsm font-semibold leading-[normal] truncate">
                  {title ?? name}
                </span>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
