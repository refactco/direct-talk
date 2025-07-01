'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthorRequestData {
  authorName: string;
  additionalNotes: string;
}

interface AuthorRequestContextType {
  requestData: AuthorRequestData;
  setRequestData: (data: AuthorRequestData) => void;
  clearRequestData: () => void;
  hasRequestData: boolean;
}

const AuthorRequestContext = createContext<AuthorRequestContextType | undefined>(undefined);

const STORAGE_KEY = 'author-request-data';

export function AuthorRequestProvider({ children }: { children: React.ReactNode }) {
  const [requestData, setRequestDataState] = useState<AuthorRequestData>({
    authorName: '',
    additionalNotes: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setRequestDataState(parsedData);
      }
    } catch (error) {
      console.error('Error loading author request data:', error);
    }
  }, []);

  const setRequestData = (data: AuthorRequestData) => {
    setRequestDataState(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving author request data:', error);
    }
  };

  const clearRequestData = () => {
    const emptyData = { authorName: '', additionalNotes: '' };
    setRequestDataState(emptyData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing author request data:', error);
    }
  };

  const hasRequestData = requestData.authorName.trim() !== '' || requestData.additionalNotes.trim() !== '';

  return (
    <AuthorRequestContext.Provider
      value={{
        requestData,
        setRequestData,
        clearRequestData,
        hasRequestData
      }}
    >
      {children}
    </AuthorRequestContext.Provider>
  );
}

export function useAuthorRequest() {
  const context = useContext(AuthorRequestContext);
  if (context === undefined) {
    throw new Error('useAuthorRequest must be used within an AuthorRequestProvider');
  }
  return context;
} 