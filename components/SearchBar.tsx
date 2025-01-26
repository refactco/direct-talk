/**
 * SearchBar Component
 *
 * This component renders a search input field with a browse button.
 * It handles user input for searching and provides a way to reset the search and browse all resources.
 *
 * Props:
 * - value: Current search query value
 * - onChange: Function to call when the search query changes
 * - onBrowse: Function to call when the browse button is clicked
 * - setSearchQuery: Function to update the search query in the parent component
 * - className: Additional CSS classes for the component
 * - browseButtonClass: CSS classes for the browse button
 */

"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onBrowse: () => void
  setSearchQuery: (value: string) => void
  className?: string
  browseButtonClass?: string
}

export default function SearchBar({
  value,
  onChange,
  onBrowse,
  setSearchQuery,
  className,
  browseButtonClass,
}: SearchBarProps) {
  // State management for local input value
  const [localValue, setLocalValue] = useState(value)
  const router = useRouter()

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  // Handler for browse button click
  const handleBrowse = () => {
    setLocalValue("")
    setSearchQuery("")
    router.push("/search", undefined, { shallow: true })
  }

  // Render search bar
  return (
    <div className={cn("w-full", className)}>
      <div className="relative group">
        <div className="relative flex items-center bg-[#242424] rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-4" />
            <Input
              type="text"
              value={localValue}
              onChange={handleChange}
              placeholder="What do you want to learn?"
              className="pl-12 pr-32 py-1 w-full bg-transparent border-none text-white placeholder:text-gray-400 text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 focus:outline-none rounded-full"
            />
          </div>
          <div className="absolute right-0 h-full flex items-center pr-2">
            <div className="h-8 w-[1px] bg-gray-700 mr-2" />
            <Button
              variant="ghost"
              size="sm"
              className={browseButtonClass || "text-gray-400 hover:text-white text-sm py-1"}
              onClick={handleBrowse}
            >
              Browse
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

