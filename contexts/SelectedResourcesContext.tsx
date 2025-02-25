'use client';

import { useToast } from '@/hooks/use-toast';
import type { IAuthor, IResource, TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import toastConfig from '@/lib/toast-config';

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
  const { toast } = useToast();

  const getAuthorResource = async (author: IAuthor) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PUBLIC_API_URL}/people/${author.id}?per_page=99999`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch author resources');
      }
      const authorResources: IAuthor = await response.json();

      // Extract content IDs from all resource types (books, shows, episodes)
      const extractRefIds = (items: IResource[]) =>
        items.reduce<string[]>((acc, item) => {
          if (item.ref_id) acc.push(item.ref_id);
          return acc;
        }, []);
      const contentIds: string[] = [
        ...extractRefIds(authorResources.resources.items.books),
        ...extractRefIds(authorResources.resources.items.shows),
        ...extractRefIds(authorResources.resources.items.episodes)
      ];

      setAuthorResourcesIds(contentIds);
    } catch (error) {
      toast(
        toastConfig({
          message: 'Error fetching author resources.',
          toastType: 'destructive'
        })
      );
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
      if (prev.length >= 10) {
        const toastLimitConf: any = toastConfig({
          message: 'You can only select up to 10 resources.',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
        return prev; // Prevent adding more than 10 resources
      }
      if (!prev.some((r) => r.id === resource.id)) {
        const toastConf: any = toastConfig({
          image_url: resource.image_url,
          message: 'Added to the resources.',
          onAction: () => removeResource(resource.id),
          action_text: 'Remove'
        });
        toast(toastConf);
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
