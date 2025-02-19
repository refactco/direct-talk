import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { ResourcesList } from '../resources-list/resources-list';
import { ISelectedResourcesListProps } from './selected-resources-list-type';

export function SelectedResourcesList(props: ISelectedResourcesListProps) {
  const { customClassName } = props;
  const { selectedResources, removeResource } = useSelectedResources();

  return (
    <ResourcesList
      selectedResources={selectedResources}
      customClassName={customClassName}
      onRemoveResource={removeResource}
    />
  );
}
