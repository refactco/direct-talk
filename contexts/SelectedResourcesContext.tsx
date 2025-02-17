'use client';

import { useToast } from '@/hooks/use-toast';
import type { IAuthor, IResource } from '@/types/resources';
import type React from 'react';
import { createContext, useContext, useState } from 'react';

type SelectedResourcesContextType = {
  selectedResources: (IResource | IAuthor)[];
  addResource: (resource: IResource | IAuthor) => void;
  removeResource: (resourceId: string | number) => void;
  resetSelectedResources: () => void;
  isSelected: (resourceId: string | number) => boolean;
};

const SelectedResourcesContext = createContext<
  SelectedResourcesContextType | undefined
>(undefined);

export function SelectedResourcesProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [selectedResources, setSelectedResources] = useState<
    (IResource | IAuthor)[]
  >([]);
  const { toast } = useToast();

  const addResource = (resource: IResource | IAuthor) => {
    setSelectedResources((prev) => {
      if (prev.length >= 10) {
        toast({
          variant: 'destructive',
          title: 'Limit reached',
          description: 'You can only select up to 10 resources.'
        });
        return prev; // Prevent adding more than 10 resources
      }
      if (!prev.some((r) => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });
  };

  const removeResource = (resourceId: string | number) => {
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const resetSelectedResources = () => {
    setSelectedResources([]);
  };

  const isSelected = (resourceId: string | number) => {
    return selectedResources.some((r) => r.id === resourceId);
  };

  return (
    <SelectedResourcesContext.Provider
      value={{
        selectedResources,
        addResource,
        removeResource,
        resetSelectedResources,
        isSelected
      }}
    >
      {children}
    </SelectedResourcesContext.Provider>
  );
}

export function useSelectedResources() {
  const context = useContext(SelectedResourcesContext);
  if (context === undefined) {
    throw new Error(
      'useSelectedResources must be used within a SelectedResourcesProvider'
    );
  }
  return context;
}
