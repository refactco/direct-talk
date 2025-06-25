'use client';

import { PeopleCard } from '@/components/people-card/PeopleCard';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import type { PeopleCardListProps } from '../people-card-list-type';

export function PeopleCardListMobile({ people, isLoading }: PeopleCardListProps) {
  const { selectedResources } = useSelectedResources();
  const hasSelectedAuthor = selectedResources.length > 0;
  
  // Show 4 skeleton cards while loading, or actual people when loaded
  const displayItems = isLoading ? Array(4).fill(null) : people;
  
  return (
    <div className="md:hidden">
      <div className="grid grid-cols-2 gap-4">
        {displayItems.map((person, index) => (
          <div key={person?.id || `skeleton-${index}`} className="w-full">
            <PeopleCard 
              people={person} 
              isLoading={isLoading} 
              hasSelectedAuthor={hasSelectedAuthor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
