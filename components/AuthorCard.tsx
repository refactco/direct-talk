import { useState } from "react";
import type { Author } from "@/types/resources";
import { DetailSheet } from "@/components/DetailSheet";

export function AuthorCard({ author }: { author: Author }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div
        className="group w-48 space-y-4 rounded-md p-3 transition-colors hover:bg-background-highlight flex flex-col cursor-pointer"
        onClick={() => setIsSheetOpen(true)}
      >
        <div className="aspect-square overflow-hidden rounded-full">
          <img
            src={author.imageUrl || "/placeholder.svg"}
            alt={author.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex-1 text-center">
          <h3 className="font-semibold break-words">{author.name}</h3>
        </div>
      </div>
      <DetailSheet
        item={author}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
