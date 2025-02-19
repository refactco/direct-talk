'use client';

import { TSelectedResource } from '@/types/resources';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ResourceDetailContextType {
  selectedDetailItems?: TSelectedResource[];
  setSelectedDetailItems: (item?: TSelectedResource[]) => void;
  pushDetailItem: (item: TSelectedResource) => void;
  popDetailItem: () => void;
  clearDetailItem: () => void;
  // openSheet?: boolean;
  // setOpenSheet: (open: boolean) => void;
}

const ResourceDetailContext = createContext<
  ResourceDetailContextType | undefined
>(undefined);

export function ResourceDetailProvider({ children }: { children: ReactNode }) {
  const [selectedDetailItems, setSelectedDetailItems] =
    useState<TSelectedResource[]>();
  // const [openSheet, setOpenSheet] = useState<boolean>();
  // const router = useRouter();
  // const pathname = usePathname();

  return (
    <ResourceDetailContext.Provider
      value={{
        selectedDetailItems,
        setSelectedDetailItems,
        pushDetailItem: (item) => {
          setSelectedDetailItems([...(selectedDetailItems ?? []), item]);
        },
        popDetailItem: () => {
          selectedDetailItems?.pop();

          setSelectedDetailItems([...(selectedDetailItems ?? [])]);
        },
        clearDetailItem: () => {
          setSelectedDetailItems(undefined);
        }
        // openSheet,
        // setOpenSheet
      }}
    >
      {children}
    </ResourceDetailContext.Provider>
  );
}

export function useResourceDetail() {
  const context = useContext(ResourceDetailContext);

  if (context === undefined) {
    throw new Error(
      'useResourceDetail must be used within a ResourceDetailProvider'
    );
  }

  return context;
}
