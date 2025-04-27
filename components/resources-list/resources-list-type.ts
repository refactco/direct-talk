import { TSelectedResource } from '@/types/resources';

export interface IResourcesListProps {
  selectedResources: TSelectedResource[];
  onRemoveResource?(id: string): void;
  hideRemoveButton?: boolean;
  customClassName?: string;
  direction?: 'horizontal' | 'vertical';
  wrapTitle?: boolean;
  isLoading?: boolean;
  noDetail?: boolean;
}
