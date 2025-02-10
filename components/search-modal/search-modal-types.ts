import type { Author, Resource } from "@/types/resources";

export interface ResourceSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showWarning?: boolean;
}

export interface SearchResults {
  books: Resource[];
  people: Author[];
  shows: Resource[];
  episodes: Resource[];
}
