'use client';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import type { TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import Image from "next/image";

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
        toast({
          variant: 'destructive',
          description: 'You can only select up to 10 resources.'
        });
        return prev; // Prevent adding more than 10 resources
      }
      if (!prev.some((r) => r.id === resource.id)) {
        toast({
          variant: 'default',
          description:  (
              <div className="flex align-center gap-2">
                <Image
                    width={24}
                    height={24}
                    src={ resource?.image_url || '/placeholder.svg' }
                    alt="Toast Image"
                    style={{ marginRight: 8, borderRadius: '50%' }}
                />
                Added to the resources.
              </div>
          ),
          action: <ToastAction className="bg-primary text-black border-none font-semibold text-xs rounded-[6px] hover:bg-primary/90" altText="Remove" onClick={() => removeResource(resource.id)}>Remove</ToastAction>,
          style: {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            maxWidth: 'max-content',
            paddingRight: '34px',
            paddingLeft: '16px',
          },
          className: 'p-4 bg-foreground border-none text-black text-[13px] rounded-lg',
        });
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
