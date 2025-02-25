'use client';

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
import { X } from 'lucide-react';
import 'swiper/css';
import SelectedResourceCard from '../SelectedResourceCard';
import { ResourceSelectorProps } from './more-resources-modal-types';
import { CloseIcon } from '@/components/icons/CloseIcon';

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
              className="rounded-full border border-border"
            >
              <CloseIcon className="h-5 w-5 fill-foreground" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="p-5">
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
