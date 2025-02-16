import { IResource } from '@/types/resources';

export interface IDetailItemProps {
  alternativeImageSource?: string;
  resource: IResource;
  onClick(): void;
  onAddClick(): void;
}
