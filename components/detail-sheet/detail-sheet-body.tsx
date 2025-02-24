'use client';

import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { useResourceDetail } from '@/contexts/ResourceDetailContext';
import { ChevronLeftIcon, X } from 'lucide-react';
import { IDetailSheetBodyProps } from './detail-sheet-body-type';
import { DetailSheetPeopleBody } from './people-body/detail-sheet-people-body';
import { DetailSheetResourceBody } from './resource-body/detail-sheet-resource-body';

export function DetailSheetBody(props: IDetailSheetBodyProps) {
  const { isReachedToEnd } = props;
  const { selectedDetailItems, popDetailItem } = useResourceDetail();

  if (!selectedDetailItems) {
    return null;
  }

  const selectedDetailItem =
    selectedDetailItems[selectedDetailItems.length - 1];

  const isResource = 'type' in selectedDetailItem;

  return (
    <div className="flex flex-col gap-8">
      <div className="absolute top-4 right-4 z-10">
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-accent hover:bg-accent/90"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetClose>
      </div>
      {selectedDetailItems.length > 1 ? (
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-accent hover:bg-accent/90"
            onClick={() => {
              popDetailItem();
            }}
          >
            <ChevronLeftIcon />
          </Button>
        </div>
      ) : null}
      {isResource ? (
        <DetailSheetResourceBody resource={selectedDetailItem} />
      ) : (
        <DetailSheetPeopleBody person={selectedDetailItem} />
      )}
    </div>
  );
}
