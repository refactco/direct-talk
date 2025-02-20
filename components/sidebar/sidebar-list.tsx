'use client';

import { HistoryItem } from '@/contexts/HistoryContext';
import { SidebarItem } from '@/components/sidebar/sidebar-item';
import React, { Fragment, Suspense } from 'react';
import { Icons } from '@/components/icons';

export function SidebarList(props: {
  list: HistoryItem[];
  isLoading: boolean;
}) {
  const { list, isLoading } = props;

  return (
    <div>
      {list?.length > 0 ? (
        <Suspense>{list?.map((chat) => <SidebarItem item={chat} />)}</Suspense>
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
