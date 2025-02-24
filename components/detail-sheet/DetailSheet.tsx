'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useResourceDetailEpisodes } from '@/contexts/resource-detail-episodes-context';
import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { useRef } from 'react';
import { DetailSheetBody } from './detail-sheet-body';

export function DetailSheet() {
  const { selectedDetailItems, clearDetailItem } = useResourceDetail();
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const { setIsReachedToEnd } = useResourceDetailEpisodes();

  const handleScroll = () => {
    if (sheetContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sheetContentRef.current;

      if (scrollTop + clientHeight >= scrollHeight) {
        setIsReachedToEnd(true);
      }
    }
  };

  return (
    <Sheet
      open={!!selectedDetailItems}
      onOpenChange={(open: boolean) => {
        if (!open) {
          clearDetailItem();
        }
      }}
    >
      <SheetContent
        ref={sheetContentRef}
        side="right"
        className="w-full md:w-96 py-12 px-10 bg-[#09090B] border-l border-[#282828] text-white h-[100vh] overflow-y-auto"
        onScroll={() => {
          handleScroll();
        }}
      >
        <DetailSheetBody />
      </SheetContent>
    </Sheet>
  );
}
