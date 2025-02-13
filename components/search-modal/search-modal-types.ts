import type { IAuthor, IResource } from "@/types/resources";

export interface ResourceSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showWarning?: boolean;
}

export interface SearchResults {
  books: IResource[];
  people: IAuthor[];
  shows: IResource[];
  episodes: IResource[];
}
