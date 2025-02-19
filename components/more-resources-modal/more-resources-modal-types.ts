import type { IAuthor, IResource } from '@/types/resources';
import { IResourcesListProps } from '../resources-list/resources-list-type';

export interface ResourceSelectorProps extends IResourcesListProps {
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
