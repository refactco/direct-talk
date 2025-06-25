'use client';

import type { IAuthor, IResource, TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useContext, useState } from 'react';

type SelectedResourcesContextType = {
  authorResourcesIds: string[] | number[];
  selectedResources: TSelectedResource[];
  addResource: (
    resource: TSelectedResource,
    type?: 'people' | 'resource'
  ) => void;
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
    TSelectedResource[]
  >([]);
  const [authorResourcesIds, setAuthorResourcesIds] = useState<
    string[] | number[]
  >([]);

  const getAuthorResource = async (author: IAuthor) => {
    try {
      const response = await fetch(`/api/people/${author.id}?per_page=99999`);

      if (!response.ok) {
        throw new Error('Failed to fetch author resources');
      }

      const authorResources: IAuthor = await response.json();
      // Extract content IDs from all resource types (books, shows, episodes)
      const extractRefIds = (items: IResource[]) => {
        return items.reduce<string[]>((acc, item) => {
          if (item.ref_id) {
            acc.push(item.ref_id);
          }
          return acc;
        }, []);
      };

      const bookContentIds = extractRefIds(
        authorResources.resources.items.books
      );
      const showContentIds = extractRefIds(
        authorResources.resources.items.shows
      );
      const episodeContentIds = extractRefIds(
        authorResources.resources.items.episodes
      );
      const contentIds: string[] = [
        ...bookContentIds,
        ...showContentIds,
        ...episodeContentIds
      ];

      setAuthorResourcesIds(contentIds);
    } catch (error) {
      console.error('Error fetching author resources:', error);
      return;
    }
  };

  const addResource = async (
    resource: TSelectedResource,
    type: 'people' | 'resource' = 'resource'
  ) => {
    if (type === 'people') {
      getAuthorResource(resource as IAuthor);
    }
    setSelectedResources((prev) => {
      // Fix: Use prev.length instead of selectedResources.length to avoid stale state
      if (prev.length === 1) {
        // Remove the existing selection first
        const existingResource = prev[0];
        const resourceName = (existingResource as any).title || (existingResource as any).name || 'Resource';
        console.log(`${resourceName} is removed.`);
      }
      
      if (!prev.some((r) => r.id === resource.id)) {
        const resourceName = (resource as any).title || (resource as any).name || 'Resource';
        console.log(`${resourceName} is selected.`);
        return [resource]; // Only allow one selection at a time
      }
      return prev;
    });
  };

  const removeResource = (resourceId: string | number) => {
    setSelectedResources((prev) => {
      const resourceToRemove = prev.find((r) => r.id === resourceId);
      if (resourceToRemove) {
        const resourceName = (resourceToRemove as any).title || (resourceToRemove as any).name || 'Resource';
        console.log(`${resourceName} is removed.`);
      }
      return prev.filter((r) => r.id !== resourceId);
    });
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
        authorResourcesIds,
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
