'use client';

import { HistoryListItem } from '@/components/sidebar/history-list/item/history-list-item';
import { Skeleton } from '@/components/ui/skeleton';
import { HistoryItem } from '@/contexts/HistoryContext';
import { Fragment, Suspense } from 'react';
import { IHistoryListProps } from './history-list-type';

// Skeleton component for history items
function HistoryItemSkeleton({ width }: { width: string }) {
  return (
    <div className="flex items-center justify-between text-sm max-h-[34px] py-1 px-0">
      <Skeleton className={`h-3 ${width}`} />
      <div className="w-4" /> {/* Spacer for trash icon area */}
    </div>
  );
}

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
            <div className="space-y-2">
              {/* Show 3-5 skeleton items to simulate loading history */}
              <HistoryItemSkeleton width="w-[140px]" />
              <HistoryItemSkeleton width="w-[100px]" />
              <HistoryItemSkeleton width="w-[120px]" />
              <HistoryItemSkeleton width="w-[90px]" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground/40 pb-2">
              No history records.
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
