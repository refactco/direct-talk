"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import HomeView from "./HomeView"
import SearchResults from "./SearchResults"
import ResourceDetailDrawer from "./ResourceDetailDrawer"
import type { Resource } from "@/types/resource"

export default function Layout({ children }: { children?: React.ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)

  useEffect(() => {
    const query = searchParams.get("query")
    const topic = searchParams.get("topic")
    setIsSearchPage(!!query || !!topic || pathname === "/search")
  }, [searchParams, pathname])

  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource)
    setIsDrawerOpen(true)
    setIsOverlayVisible(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setIsOverlayVisible(false)
  }

  if (children) {
    return (
      <>
        {children}
        <ResourceDetailDrawer resource={selectedResource} isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
        {isOverlayVisible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleCloseDrawer} />}
      </>
    )
  }

  return (
    <>
      {isSearchPage ? (
        <SearchResults onResourceSelect={handleResourceSelect} />
      ) : (
        <HomeView onResourceSelect={handleResourceSelect} />
      )}
      <ResourceDetailDrawer resource={selectedResource} isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
      {isOverlayVisible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleCloseDrawer} />}
    </>
  )
}

