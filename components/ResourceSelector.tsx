"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { ChatResourceCard } from "./ChatResourceCard"
import { resources } from "@/lib/data"
import type { Resource } from "@/types/resources"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResourceSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showWarning?: boolean
}

export function ResourceSelector({ open, onOpenChange, showWarning = false }: ResourceSelectorProps) {
  const [search, setSearch] = useState("")
  const { addResource } = useSelectedResources()

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase()),
  )

  const handleResourceSelect = (resource: Resource) => {
    addResource(resource)
    onOpenChange(false)
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full p-0 m-0">
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="relative flex-1 max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-background border-border/50"
              />
            </div>
            <Button variant="ghost" size="icon" className="ml-2" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {showWarning && (
            <Alert variant="warning" className="m-4">
              <AlertDescription>You should select a resource to start search about</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2 max-w-3xl mx-auto">
              {filteredResources.map((resource) => (
                <ChatResourceCard
                  key={resource.id}
                  resource={resource}
                  onSelect={() => handleResourceSelect(resource)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

