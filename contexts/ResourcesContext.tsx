'use client';

import { TSelectedResource } from '@/types/resources';
import { createContext, useCallback, useContext, useState } from 'react';
import { useSelectedResources } from './SelectedResourcesContext';

interface ResourceData {
  [key: string]: any;
}

interface ResourceContextType {
  resources: TSelectedResource[];
  fetchResource: (authorId?: number) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  clearResources: () => void;
}

const ResourceContext = createContext<ResourceContextType | null>(null);

export function useResource(): ResourceContextType {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
}

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<TSelectedResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { selectedResources } = useSelectedResources();

  const clearResources = useCallback(() => {
    setResources([]);
    setIsLoading(true);
    setErrorMessage(null);
  }, []);

  const fetchResource = async (authorId?: number) => {
    // If authorId is provided, always fetch the specific author data
    if (authorId) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/people/${authorId}`);
        const data = await response.json();
        setResources([data]);
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (selectedResources.length > 0) {
      // Only use selectedResources if no specific authorId is provided
      setResources(selectedResources);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        fetchResource,
        isLoading,
        errorMessage,
        clearResources
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}
