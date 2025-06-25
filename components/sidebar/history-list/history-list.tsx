'use client';

import { Icons } from '@/components/icons';
import { HistoryListItem } from '@/components/sidebar/history-list/item/history-list-item';
import { HistoryItem } from '@/contexts/HistoryContext';
import { Fragment, Suspense } from 'react';
import { IHistoryListProps } from './history-list-type';

export function HistoryList(props: IHistoryListProps) {
  const { list, isLoading, onCloseSidebar } = props;

  // Ensure list is an array
  const safeList = Array.isArray(list) ? list : [];

  return (
    <div>
      {safeList.length > 0 ? (
        <Suspense>
          {safeList.map((chat: HistoryItem) => {
            return (
              <HistoryListItem 
                key={chat.session_id} 
                item={chat} 
                onCloseSidebar={onCloseSidebar} 
              />
            );
          })}
        </Suspense>
      ) : (
        <Fragment>
          {isLoading ? (
            <Icons.spinner className="mt-2 m-auto h-4 w-4 animate-spin" />
          ) : (
            <div className="text-sm text-muted-foreground pb-2">
              No history records.
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
