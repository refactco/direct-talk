import { HistoryItem } from '@/contexts/HistoryContext';

export interface IHistoryListProps {
  list: HistoryItem[];
  isLoading: boolean;
  onCloseSidebar(): void;
}
