"use client";

import { createContext, useContext, useState } from "react";

interface ResourceData {
  [key: string]: any;
}

interface ResourceContextType {
  resources: ResourceData;
  fetchResource: (contentIds: string[] | number[]) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

const ResourceContext = createContext<ResourceContextType | null>(null);

export function useResource(): ResourceContextType {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
}
const BASE_API_URL = "https://dt-api.refact.co/wp-json/direct-talk/v1";
export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<ResourceData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchResource = async (contentIds: string[]) => {
    const newContentIds = contentIds.filter((id) => !resources[id]);
    if (newContentIds.length === 0) return;

    setIsLoading(true);
    try {
      const resourcePromises = newContentIds.map(async (id) => {
        const response = await fetch(`${BASE_API_URL}/resources/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch resource: ${id}`);
        const data = await response.json();
        return { id, data };
      });

      const results = await Promise.all(resourcePromises);
      const resourceMap = results.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {} as ResourceData);

      setResources((prev) => ({ ...prev, ...resourceMap }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResourceContext.Provider
      value={{ resources, fetchResource, isLoading, errorMessage }}
    >
      {children}
    </ResourceContext.Provider>
  );
}
