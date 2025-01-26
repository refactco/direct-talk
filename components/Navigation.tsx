"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Users, Search } from "lucide-react"
import { useResourceContext } from "@/context/ResourceContext"
import SelectedResourcesMenu from "./SelectedResourcesMenu"
import FullScreenSearchModal from "./FullScreenSearchModal"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { selectedResources } = useResourceContext()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-gray-400 hover:text-white p-2 transition-all hover:scale-110">
              <div className="bg-[#242424] rounded-full p-1.5">
                <Home className="h-5 w-5" />
              </div>
            </Link>

            <div className="flex-1 max-w-3xl mx-4">
              <Button
                variant="ghost"
                onClick={openSearch}
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Search className="h-5 w-5 mr-2" />
                Search resources...
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/topics" passHref>
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-transparent">
                  Topics
                </Button>
              </Link>
              <Link href="/authors" passHref>
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-transparent">
                  <Users className="h-5 w-5 mr-2" />
                  Authors
                </Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-transparent">
                  About
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={toggleMenu}
                  className="relative text-gray-400 hover:text-white p-2 transition-all hover:scale-110 hover:bg-transparent"
                >
                  <div className="bg-[#242424] rounded-full p-1.5">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  {selectedResources.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {selectedResources.length}
                    </span>
                  )}
                </Button>
                <SelectedResourcesMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <FullScreenSearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  )
}

