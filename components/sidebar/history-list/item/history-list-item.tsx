'use client';

import { Icons } from '@/components/icons';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { useHistory } from '@/contexts/HistoryContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { IHistoryItemProps } from './history-list-item-type';

export function HistoryListItem(props: IHistoryItemProps) {
  const { item, onCloseSidebar } = props;
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get('id');
  const { removeHistoryItem } = useHistory();
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <div
      key={item.session_id}
      className={cn(
        'flex items-center justify-between group text-sm rounded-md transition-all',
        'hover:bg-highlight hover:px-2 max-h-[34px]',
        activeSessionId == item.session_id && 'bg-accent'
      )}
    >
      {isRemoving ? (
        <div className="truncate max-w-40 text-sm py-2 flex-1">
          <Icons.spinner className=" h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>
          <Link
            href={`/conversation?id=${item.session_id}`}
            className="truncate max-w-40 text-sm py-2 flex-1"
            onClick={() => {
              onCloseSidebar();
            }}
          >
            {item.session_title?.replace(/^"(.*)"$/, '$1')}
          </Link>
          <TrashIcon
            onClick={() => {
              setIsRemoving(true);
              removeHistoryItem(item.session_id, activeSessionId, () => {
                setIsRemoving(false);
              });
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity fill-foreground cursor-pointer w-5"
          />
        </>
      )}
    </div>
  );
}
