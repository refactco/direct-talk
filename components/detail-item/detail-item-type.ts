import { IResource } from "@/types/resources";

export interface IDetailItemProps {
  resource: IResource;
  onClick(): void;
  onAddClick(): void;
}
