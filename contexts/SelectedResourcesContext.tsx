"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Resource } from "@/types/resources";

type SelectedResourcesContextType = {
  selectedResources: Resource[];
  addResource: (resource: Resource) => void;
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
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);

  useEffect(() => {
    console.log("SelectedResourcesProvider mounted");
  }, []);

  const addResource = (resource: Resource) => {
    console.log("Adding resource:", resource);
    setSelectedResources((prev) => {
      if (!prev.some((r) => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });
  };

  const removeResource = (resourceId: string) => {
    console.log("Removing resource:", resourceId);
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const resetSelectedResources = () => {
    console.log("Resetting selected resources");
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
