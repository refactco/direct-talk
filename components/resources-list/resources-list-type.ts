import { TSelectedResource } from '@/types/resources';

export interface IResourcesListProps {
  selectedResources: TSelectedResource[];
  customClassName?: string;
  direction?: 'horizontal' | 'vertical';
  wrapTitle?: boolean;
  isLoading?: boolean;
  hideRemoveButton?: boolean;
}
