'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { HistoryItem, useHistory } from '@/contexts/HistoryContext';
import { useSearchParams } from 'next/navigation';

export function SidebarItem(props: { item: HistoryItem }) {
  const { item } = props;
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get('id');
  const { removeHistoryItem } = useHistory();

  return (
    <div
      key={item.session_id}
      className={cn(
        'flex items-center justify-between group py-2 text-sm rounded-md transition-all',
        'hover:bg-highlight hover:px-2 max-h-[34px]',
        activeSessionId == item.session_id && 'bg-accent'
      )}
    >
      <Link
        href={`/conversation?id=${item.session_id}`}
        className="truncate max-w-40 text-sm"
      >
        {item.session_title}
      </Link>
      <TrashIcon
        onClick={() => removeHistoryItem(item.session_id, activeSessionId)}
        className="opacity-0 group-hover:opacity-100 transition-opacity fill-foreground cursor-pointer"
      />
    </div>
  );
}
