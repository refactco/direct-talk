"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useResourceDetail } from "@/contexts/ResourceDetailContext";
import { DetailSheetBody } from "./detail-sheet-body";

export function DetailSheet() {
  const { selectedDetailItems, clearDetailItem } = useResourceDetail();

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
        side="right"
        className="w-full md:w-96 py-12 px-10 bg-[#121212] border-l border-[#282828] text-white h-[100vh] overflow-y-auto"
      >
        <DetailSheetBody />
      </SheetContent>
    </Sheet>
  );
}
