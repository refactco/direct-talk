'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface InitialMessageContextType {
  initialMessage: string | null;
  setInitialMessage: (message: string | null) => void;
}

const InitialMessageContext = createContext<
  InitialMessageContextType | undefined
>(undefined);

export function InitialMessageProvider({ children }: { children: ReactNode }) {
  const [initialMessage, setInitialMessageState] = useState<string | null>(null);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem('initialMessage');
      if (stored) {
        setInitialMessageState(stored);
      }
    } catch (error) {
      console.error('Error loading initial message from localStorage:', error);
    }
  }, []);

  const setInitialMessage = (message: string | null) => {
    setInitialMessageState(message);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        if (message) {
          localStorage.setItem('initialMessage', message);
        } else {
          localStorage.removeItem('initialMessage');
        }
      } catch (error) {
        console.error('Error saving initial message to localStorage:', error);
      }
    }
  };

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
