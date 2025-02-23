'use client';

import { useToast } from '@/hooks/use-toast';
import type { TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import toastConfig from '@/lib/toast-config';

type SelectedResourcesContextType = {
  selectedResources: TSelectedResource[];
  addResource: (resource: TSelectedResource) => void;
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
  const { toast } = useToast();

  const addResource = (resource: TSelectedResource) => {
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
