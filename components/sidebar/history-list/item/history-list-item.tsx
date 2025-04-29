'use client';

import { Icons } from '@/components/icons';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { useHistory } from '@/contexts/HistoryContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { IHistoryItemProps } from './history-list-item-type';

export function HistoryListItem(props: IHistoryItemProps) {
  const { item, onCloseSidebar } = props;
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get('id');
  const { removeHistoryItem } = useHistory();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS only on client side
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  return (
    <div
      key={item.session_id}
      className={cn(
        'flex items-center justify-between group text-sm rounded-md transition-all',
        'hover:bg-highlight hover:px-2 max-h-[34px]',
        activeSessionId == item.session_id && 'bg-accent',
        isIOS ? 'touch-manipulation' : ''
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
            className={cn(
              'truncate max-w-40 text-xs font-light py-1 flex-1',
              isIOS ? 'touch-manipulation' : ''
            )}
            onClick={() => {
              onCloseSidebar();
            }}
          >
            {item.session_title?.replace(/^"(.*)"$/, '$1')}
          </Link>
          <TrashIcon
            onClick={(e: MouseEvent<SVGSVGElement>) => {
              e.stopPropagation();
              setIsRemoving(true);
              removeHistoryItem(item.session_id, activeSessionId, () => {
                setIsRemoving(false);
              });
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity fill-foreground cursor-pointer w-5 hidden md:inline-block"
          />
        </>
      )}
    </div>
  );
}
