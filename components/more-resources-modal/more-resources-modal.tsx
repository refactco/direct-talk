'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TSelectedResource } from '@/types/resources';
import { X } from 'lucide-react';
import 'swiper/css';
import SelectedResourceCard from '../SelectedResourceCard';
import { ResourceSelectorProps } from './more-resources-modal-types';

export function MoreResourcesModal({
  open,
  selectedResources,
  hideRemoveButton,
  onRemoveResource,
  onOpenChange
}: ResourceSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[283px] h-full md:h-auto p-0 gap-0 bg-background ring-0">
        <div className="flex p-4 justify-between items-center border border-highlight">
          <span>Selected Resources</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border h-10 w-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <ScrollArea className="p-5">
          <div className="flex flex-col gap-2">
            {selectedResources.map(
              (resource: TSelectedResource, index: number) => {
                // const { title, name } = resource as any;

                return (
                  <SelectedResourceCard
                    resource={resource}
                    hideRemove={hideRemoveButton}
                    onRemoveResource={onRemoveResource}
                  />
                );
              }
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
