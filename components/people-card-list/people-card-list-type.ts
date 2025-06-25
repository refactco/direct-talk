import type { IAuthor } from '@/types/resources';

export interface PeopleCardListProps {
  people: IAuthor[];
  isLoading?: boolean;
}
