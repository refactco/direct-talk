'use client';

import { useToast } from '@/hooks/use-toast';
import toastConfig from '@/lib/toast-config';
import { IResource } from '@/types/resources';
import { createContext, useCallback, useContext, useState } from 'react';

interface ResourceData {
  [key: string]: any;
}

interface ResourceContextType {
  resources: IResource[];
  fetchResource: (contentIds: string[] | number[]) => Promise<void>;
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
const BASE_API_URL = `${process.env.NEXT_PUBLIC_BASE_PUBLIC_API_URL}/wp-json/direct-talk/v1`;

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<IResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const clearResources = useCallback(() => {
    setResources([]);
    setIsLoading(true);
    setErrorMessage(null);
  }, []);

  const fetchResource = async (contentIds: string[] | number[]) => {
    const newContentIds = contentIds.filter((id) => {
      const foundIndex = resources.findIndex((res) => res.id === id);

      return foundIndex < 0;
    });

    if (newContentIds.length === 0) return;

    setIsLoading(true);

    try {
      const resourcePromises = newContentIds.slice(0, 2).map(async (id) => {
        const response = await fetch(`${BASE_API_URL}/resources/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch resource: ${id}`);
        const data = await response.json();

        return data;
      });

      const results = await Promise.all(resourcePromises);

      setResources(results);
    } catch (error) {
      const toastLimitConf: any = toastConfig({
        message: error instanceof Error ? error.message : 'Unknown error',
        toastType: 'destructive'
      });
      toast(toastLimitConf);
    } finally {
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
