"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import SearchResults from "./SearchResults"

interface FullScreenSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullScreenSearchModal({ isOpen, onClose }: FullScreenSearchModalProps) {
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <button onClick={onClose} className="fixed top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors">
        <X className="h-6 w-6" />
      </button>
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search in resources"
              className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] border-none text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 rounded-2xl h-14"
              autoFocus
            />
          </div>
        </form>
      </div>
      <SearchResults query={searchQuery} onClose={onClose} />
    </div>
  )
}

