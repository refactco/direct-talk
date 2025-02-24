'use client';

import { Icons } from '@/components/icons';
import { HistoryListItem } from '@/components/sidebar/history-list/item/history-list-item';
import { HistoryItem } from '@/contexts/HistoryContext';
import { Fragment, Suspense } from 'react';
import { IHistoryListProps } from './history-list-type';

export function HistoryList(props: IHistoryListProps) {
  const { list, isLoading, onCloseSidebar } = props;

  return (
    <div>
      {list?.length > 0 ? (
        <Suspense>
          {list?.map((chat: HistoryItem) => {
            return (
              <HistoryListItem item={chat} onCloseSidebar={onCloseSidebar} />
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
