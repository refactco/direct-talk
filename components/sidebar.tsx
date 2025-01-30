"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { useResizable } from "@/hooks/useResizable"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const { selectedResource, removeResource } = useSelectedResources()
  const { width, startResizing } = useResizable(280, 200, 400)
  const router = useRouter()

  return (
    <>
      <div className="flex h-full flex-col bg-background-secondary relative" style={{ width: `${width}px` }}>
        <div className="flex-1 overflow-hidden">
          <div className="space-y-3 p-4">
            {/* Start Search button */}
            <Button className="w-full rounded-full" size="lg" onClick={() => router.push("/")}>
              <Search className="mr-2 h-5 w-5" />
              Start Search
            </Button>
            {/* My Resources */}
            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold mb-2">History</h3>
              <ScrollArea className="h-[300px] px-2">
                {selectedResource ? (
                  <div key={selectedResource.id} className="flex items-center group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResource()}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      aria-label={`Remove ${selectedResource.title}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal truncate text-left px-2"
                      asChild
                    >
                      <Link href={`/resources/${selectedResource.id}`}>{selectedResource.title}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground px-2">No resource selected</div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <img src="/placeholder.svg" alt="User avatar" className="h-8 w-8 rounded-full mr-2" />
            <span>Account</span>
          </Button>
        </div>

        <div
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-border hover:bg-primary transition-colors"
          onMouseDown={startResizing}
        />
      </div>
    </>
  )
}

