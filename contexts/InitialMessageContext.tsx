'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface InitialMessageContextType {
  initialMessage: string | null;
  setInitialMessage: (message: string | null) => void;
}

const InitialMessageContext = createContext<
  InitialMessageContextType | undefined
>(undefined);

export function InitialMessageProvider({ children }: { children: ReactNode }) {
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  return (
    <InitialMessageContext.Provider
      value={{ initialMessage, setInitialMessage }}
    >
      {children}
    </InitialMessageContext.Provider>
  );
}

export function useInitialMessage() {
  const context = useContext(InitialMessageContext);
  if (context === undefined) {
    throw new Error(
      'useInitialMessage must be used within an InitialMessageProvider'
    );
  }
  return context;
}
