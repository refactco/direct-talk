import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { IDetailItemProps } from './detail-item-type';

export function DetailItem(props: IDetailItemProps) {
  const { resource, alternativeImageSource, onClick, onAddClick } = props;
  const { title, image_url, id, people, type, description } = resource;
  const { addResource, removeResource, isSelected } = useSelectedResources();
  const { pushDetailItem } = useResourceDetail();

  const isResourceSelected = isSelected(id);
  const className = isResourceSelected
    ? 'bg-primary hover:bg-primary/90'
    : 'bg-white hover:bg-white/90';

  return (
    <div className="flex items-center justify-between bg-accent rounded-lg px-3 py-4 relative">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          pushDetailItem(resource);
        }}
      >
        <div className="h-12 w-12 overflow-hidden flex-shrink-0 self-start">
          <Image
            src={image_url ? image_url : alternativeImageSource}
            alt={title}
            width={24}
            height={24}
            className="h-full w-full object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col gap-1 self-start w-40 md:w-44">
          <span className="text-xs leading-normal text-[#f2f2f2] font-semibold overflow-hidden text-ellipsis line-clamp-2">
            {title}
          </span>
          {type === 'episode' && description ? (
            <span className="text-xs leading-normal text-[#a1a1a1] font-normal overflow-hidden text-ellipsis line-clamp-1">
              {description}
            </span>
          ) : null}
          {type === 'show' && people ? (
            <span className="text-xs leading-normal text-[#a1a1a1] font-normal overflow-hidden text-ellipsis line-clamp-1">
              {people[0].name}
            </span>
          ) : null}
        </div>
      </div>
      <div className="self-end">
        <Button
          size="icon"
          variant="ghost"
          className={`h-6 w-6 rounded-full ${className} text-black hover:text-black hover:scale-105 transition-transform self-end`}
          onClick={() => {
            isResourceSelected ? removeResource(id) : addResource(resource);
          }}
        >
          {isResourceSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
