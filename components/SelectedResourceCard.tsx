import { CloseIcon } from '@/components/icons/CloseIcon';
import Image from 'next/image';

interface SelectedResourceCardProps {
  resource: any;
  onRemoveResource?: (id: string) => void;
  hideRemove?: boolean;
}

function SelectedResourceCard({
  resource,
  onRemoveResource,
  hideRemove = false
}: SelectedResourceCardProps) {
  const { id, image_url, title, type } = resource;

  return (
    <div
      key={id}
      className="flex items-center gap-2 bg-accent rounded-lg px-2 py-1 relative"
    >
      <div className="h-6 w-6 overflow-hidden flex-shrink-0">
        <Image
          src={image_url || '/placeholder.svg'}
          alt={title}
          width={24}
          height={24}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow min-w-0 pr-6">
        <span className="text-xxs leading-[normal] text-muted-foreground uppercase">
          {type}
        </span>
        <span className="text-xsm font-semibold leading-[normal] truncate max-w-32">
          {title}
        </span>
      </div>
      {!hideRemove ? (
        <button
          onClick={(e) => {
            e.preventDefault();

            if (onRemoveResource) {
              onRemoveResource(id);
            }
          }}
          className="absolute top-1 right-1 hover:text-muted-foreground"
        >
          <CloseIcon className="fill-white h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default SelectedResourceCard;
