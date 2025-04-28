'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { TSelectedResource } from '@/types/resources';
import 'swiper/css';
import SelectedResourceCard from '../SelectedResourceCard';
import { ResourceSelectorProps } from './more-resources-modal-types';

export function MoreResourcesSheet({
  open,
  selectedResources,
  hideRemoveButton,
  onRemoveResource,
  onOpenChange
}: ResourceSelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[369px] p-0 bg-background border-l border-border text-white"
      >
        <SheetHeader className="flex flex-row p-4 justify-between items-center">
          <SheetTitle className="text-left">Selected Resources</SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border focus-visible:ring-0"
            >
              <CloseIcon className="h-5 w-5 fill-foreground" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="p-5 h-[calc(100vh-80px)] overflow-auto">
          <div className="flex flex-col gap-2">
            {selectedResources.map(
              (resource: TSelectedResource, index: number) => (
                <SelectedResourceCard
                  key={index}
                  resource={resource}
                  hideRemove={hideRemoveButton}
                  onRemoveResource={onRemoveResource}
                  wrapTitle
                  noDetail
                />
              )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
