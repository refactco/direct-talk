'use client';

import { useToast } from '@/hooks/use-toast';
import toastConfig from '@/lib/toast-config';
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
  const { toast } = useToast();
  const { selectedResources } = useSelectedResources();

  const clearResources = useCallback(() => {
    setResources([]);
    setIsLoading(true);
    setErrorMessage(null);
  }, []);

  const fetchResource = async (authorId?: number) => {
    console.log({ authorId, selectedResources });
    if (selectedResources.length > 0) {
      setResources(selectedResources);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      // const newContentIds = contentIds.filter((id) => {
      //   const foundIndex = resources.findIndex((res) => res.id === id);

      //   return foundIndex < 0;
      // });

      // if (newContentIds.length === 0) return;

      try {
        const response = await fetch(`/api/people/${authorId}`);
        const data = await response.json();

        setResources([data]);
        console.log({ data });
        // const resourcePromises = newContentIds.slice(0, 2).map(async (id) => {
        //   const response = await fetch(`/api/resources/${id}`);
        //   if (!response.ok) throw new Error(`Failed to fetch resource: ${id}`);
        //   const data = await response.json();

        //   return data;
        // });

        // const results = await Promise.all(resourcePromises);

        // setResources(results);
      } catch (error) {
        const toastLimitConf: any = toastConfig({
          message: error instanceof Error ? error.message : 'Unknown error',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
      } finally {
        setIsLoading(false);
      }
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
