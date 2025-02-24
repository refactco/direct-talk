'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface IResourceDetailEpisodesContextType {
  isReachedToEnd?: boolean;
  setIsReachedToEnd: (value?: boolean) => void;
}

const ResourceDetailEpisodesContext = createContext<
  IResourceDetailEpisodesContextType | undefined
>(undefined);

export function ResourceDetailEpisodesProvider({
  children
}: {
  children: ReactNode;
}) {
  const [isReachedToEnd, setIsReachedToEnd] = useState<boolean>();

  return (
    <ResourceDetailEpisodesContext.Provider
      value={{
        isReachedToEnd,
        setIsReachedToEnd
      }}
    >
      {children}
    </ResourceDetailEpisodesContext.Provider>
  );
}

export function useResourceDetailEpisodes() {
  const context = useContext(ResourceDetailEpisodesContext);

  if (context === undefined) {
    throw new Error(
      'useResourceDetail must be used within a ResourceDetailProvider'
    );
  }

  return context;
}
