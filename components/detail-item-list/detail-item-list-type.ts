import { IResource } from '@/types/resources';

export interface IDetailItemListProps {
  resources: IResource[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  showLoadMore?: boolean;
  onLoadMoreClick?(): void;
  title: string;

  alternativeImageSource?: string;
}
