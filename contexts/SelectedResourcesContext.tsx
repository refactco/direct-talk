"use client";

import type { IResource } from "@/types/resources";
import type React from "react";
import { createContext, useContext, useState } from "react";

type SelectedResourcesContextType = {
  selectedResources: IResource[];
  addResource: (resource: IResource) => void;
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
  const [selectedResources, setSelectedResources] = useState<IResource[]>([]);

  const addResource = (resource: IResource) => {
    setSelectedResources((prev) => {
      if (!prev.some((r) => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });
  };

  const removeResource = (resourceId: string) => {
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const resetSelectedResources = () => {
    setSelectedResources([]);
  };

  const isSelected = (resourceId: string) => {
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
      "useSelectedResources must be used within a SelectedResourcesProvider"
    );
  }
  return context;
}
