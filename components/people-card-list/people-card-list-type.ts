import { IAuthor, TSelectedResource } from '@/types/resources';

export interface IPeopleCardListProps {
  popularResources: IAuthor[];
  selectedPerson: IAuthor | null;
  selectedPersonIndex: number | null;
  handlePersonClick: (person: IAuthor, index: number | null) => void;
  selectedResources: TSelectedResource[];
}
