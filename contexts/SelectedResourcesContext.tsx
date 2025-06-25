'use client';

import type { IAuthor, IResource, TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

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
  const [selectedResources, setSelectedResources] = useState<TSelectedResource[]>([]);
  const [authorResourcesIds, setAuthorResourcesIds] = useState<string[] | number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastLoggedRef = useRef<string>('');
  const previousSelectedRef = useRef<TSelectedResource[]>([]);
  const lastActionRef = useRef<{ action: string; timestamp: number; resourceId: string | number }>({ action: '', timestamp: 0, resourceId: '' });

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    
    try {
      const storedSelectedResources = localStorage.getItem('selectedResources');
      const storedAuthorResourcesIds = localStorage.getItem('authorResourcesIds');
      
      if (storedSelectedResources) {
        const parsedSelectedResources = JSON.parse(storedSelectedResources);
        setSelectedResources(parsedSelectedResources);
        previousSelectedRef.current = parsedSelectedResources; // Initialize ref to prevent logging on hydration
      }
      
      if (storedAuthorResourcesIds) {
        setAuthorResourcesIds(JSON.parse(storedAuthorResourcesIds));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

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
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('authorResourcesIds', JSON.stringify(contentIds));
        } catch (error) {
          console.error('Error saving author resource IDs to localStorage:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching author resources:', error);
      return;
    }
  };

  // Effect to log selection changes
  useEffect(() => {
    // Only log after hydration is complete
    if (!isHydrated) return;
    
    const current = selectedResources;
    const previous = previousSelectedRef.current;
    
    // Skip initial mount when both are empty
    if (previous.length === 0 && current.length === 0) {
      previousSelectedRef.current = [...current];
      return;
    }
    
    // Only log if there's an actual change
    if (current.length !== previous.length || 
        (current.length > 0 && previous.length > 0 && current[0].id !== previous[0].id)) {
      
      // Log removal when going from 1 to 0 (direct removal)
      if (previous.length === 1 && current.length === 0) {
        const removedResourceName = (previous[0] as any).title || (previous[0] as any).name || 'Resource';
        console.log(`${removedResourceName} is removed.`);
      }
      
      // Log removal when replacing (1 to 1, different IDs)
      if (previous.length === 1 && current.length === 1 && current[0].id !== previous[0].id) {
        const removedResourceName = (previous[0] as any).title || (previous[0] as any).name || 'Resource';
        console.log(`${removedResourceName} is removed.`);
      }
      
      // Log selection when adding new resource
      if (current.length > 0) {
        const selectedResourceName = (current[0] as any).title || (current[0] as any).name || 'Resource';
        console.log(`${selectedResourceName} is selected.`);
      }
    }
    
    // Update the ref
    previousSelectedRef.current = [...current];
  }, [selectedResources, isHydrated]);

  const addResource = useCallback(async (
    resource: TSelectedResource,
    type: 'people' | 'resource' = 'resource'
  ) => {
    // Prevent duplicate calls within 100ms
    const now = Date.now();
    const lastAction = lastActionRef.current;
    if (lastAction.action === 'add' && lastAction.resourceId === resource.id && (now - lastAction.timestamp) < 100) {
      return;
    }
    lastActionRef.current = { action: 'add', timestamp: now, resourceId: resource.id };
    
    if (type === 'people') {
      getAuthorResource(resource as IAuthor);
    }
    
    setSelectedResources((prev) => {
      // Check if this resource is already selected
      if (prev.some((r) => r.id === resource.id)) {
        return prev; // No change needed
      }
      
      const newSelectedResources = [resource]; // Only allow one selection at a time
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('selectedResources', JSON.stringify(newSelectedResources));
        } catch (error) {
          console.error('Error saving selected resources to localStorage:', error);
        }
      }
      
      return newSelectedResources;
    });
  }, []);

  const removeResource = (resourceId: string | number) => {
    // Prevent duplicate calls within 100ms
    const now = Date.now();
    const lastAction = lastActionRef.current;
    if (lastAction.action === 'remove' && lastAction.resourceId === resourceId && (now - lastAction.timestamp) < 100) {
      return;
    }
    lastActionRef.current = { action: 'remove', timestamp: now, resourceId };
    
    setSelectedResources((prev) => {
      const newSelectedResources = prev.filter((r) => r.id !== resourceId);
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          if (newSelectedResources.length > 0) {
            localStorage.setItem('selectedResources', JSON.stringify(newSelectedResources));
          } else {
            localStorage.removeItem('selectedResources');
          }
        } catch (error) {
          console.error('Error updating selected resources in localStorage:', error);
        }
      }
      
      return newSelectedResources;
    });
  };

  const resetSelectedResources = () => {
    setSelectedResources([]);
    setAuthorResourcesIds([]);
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('selectedResources');
        localStorage.removeItem('authorResourcesIds');
      } catch (error) {
        console.error('Error clearing selected resources from localStorage:', error);
      }
    }
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
