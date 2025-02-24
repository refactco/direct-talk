import { HistoryItem } from '@/contexts/HistoryContext';

export interface IHistoryItemProps {
  item: HistoryItem;
  onCloseSidebar(): void;
}
