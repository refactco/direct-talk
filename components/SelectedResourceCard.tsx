import { CloseIcon } from '@/components/icons/CloseIcon';
import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DivOrA } from './div-or-a/div-or-a';

interface SelectedResourceCardProps {
  resource: any;
  onRemoveResource?: (id: string) => void;
  hideRemove?: boolean;
  wrapTitle?: boolean;
  noDetail?: boolean;
}

function SelectedResourceCard({
  resource,
  onRemoveResource,
  hideRemove = false,
  wrapTitle = false,
  noDetail = false
}: SelectedResourceCardProps) {
  const { id, image_url, title, name, type, link } = resource;
  const displayName = title ?? name;
  const { pushDetailItem } = useResourceDetail();

  return (
    <DivOrA
      href={noDetail ? link : undefined}
      target={noDetail ? '_blank' : undefined}
      className="flex shrink-0 w-full items-center gap-2 bg-accent rounded-lg p-2 relative"
    >
      <div className="h-6 w-6 overflow-hidden flex-shrink-0 rounded-md">
        <Image
          src={image_url ? image_url : '/youtube.png'}
          alt={displayName}
          width={24}
          height={24}
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className={`flex flex-col flex-grow min-w-0 pr-6 ${!noDetail && 'cursor-pointer'}`}
        onClick={
          noDetail
            ? () => {}
            : () => {
                pushDetailItem(resource);
              }
        }
      >
        <span className="text-xxs leading-[normal] text-muted-foreground uppercase">
          {type ?? 'Person'}
        </span>
        <span
          className={cn(
            'text-xsm font-semibold leading-[normal]',
            wrapTitle ? '' : 'truncate max-w-32'
          )}
        >
          {displayName}
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
          className="absolute top-2 right-2 hover:text-muted-foreground"
        >
          <CloseIcon className="fill-white h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      ) : null}
    </DivOrA>
  );
}

export default SelectedResourceCard;
