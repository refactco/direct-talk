"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface HistoryItem {
  id: string
  title: string
  contentId: string
  createdAt: string
}

interface HistoryContextType {
  historyItems: HistoryItem[]
  addHistoryItem: (item: HistoryItem) => void
  removeHistoryItem: (id: string) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

const HISTORY_STORAGE_KEY = "chat_history"

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (storedHistory) {
      setHistoryItems(JSON.parse(storedHistory))
    }
  }, [])

  const updateLocalStorage = useCallback((items: HistoryItem[]) => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items))
  }, [])

  const addHistoryItem = useCallback(
      (item: HistoryItem) => {
        setHistoryItems((prevItems) => {
          const updatedItems = [item, ...prevItems.filter((i) => i.id !== item.id)]
          const newItems = updatedItems.slice(0, 50) // Keep only the 50 most recent items
          updateLocalStorage(newItems)
          return newItems
        })
      },
      [updateLocalStorage],
  )

  const removeHistoryItem = useCallback(
      (id: string) => {
        setHistoryItems((prevItems) => {
          const newItems = prevItems.filter((item) => item.id !== id)
          updateLocalStorage(newItems)
          return newItems
        })
      },
      [updateLocalStorage],
  )

  const clearHistory = useCallback(() => {
    setHistoryItems([])
    updateLocalStorage([])
  }, [updateLocalStorage])

  const value = {
    historyItems,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
  }

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}

