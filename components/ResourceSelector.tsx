"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { resources, authors } from "@/lib/data"
import type { Resource } from "@/types/resources"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResourceSheet } from "@/components/ResourceSheet"
import { HomeResourceCard } from "@/components/HomeResourceCard"
import { Check, Play, Users, BookOpen } from "lucide-react"
import Image from "next/image"

interface ResourceSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showWarning?: boolean
}

export function ResourceSelector({ open, onOpenChange, showWarning = false }: ResourceSelectorProps) {
  const [search, setSearch] = useState("")
  const { addResource, removeResource, isSelected, selectedResources } = useSelectedResources()
  const [selectedSheetResource, setSelectedSheetResource] = useState<Resource | null>(null)

  // Get popular resources for initial view
  const popularResources = resources.slice(0, 6)

  // Filter and categorize resources based on search
  const filteredResources =
    search.trim() === ""
      ? []
      : resources.filter((resource) => {
          return (
            resource.title.toLowerCase().includes(search.toLowerCase()) ||
            resource.description.toLowerCase().includes(search.toLowerCase())
          )
        })

  // Categorize filtered resources
  const shows = filteredResources.filter((r) => r.type === "Podcast")
  const books = filteredResources.filter((r) => r.type === "Book")
  const people = filteredResources // In a real app, this would be authors

  const filteredAuthors =
    search.trim() === ""
      ? []
      : authors.filter(
          (author) =>
            author.name.toLowerCase().includes(search.toLowerCase()) ||
            author.bio.toLowerCase().includes(search.toLowerCase()),
        )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full p-0 m-0">
        <div className="flex flex-col h-full bg-background">
          <div className="flex flex-col gap-4 p-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search in resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-accent border-none"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4">
              {showWarning && selectedResources.length === 0 && (
                <Alert variant="warning" className="mb-4">
                  <AlertDescription>You should select at least one resource to start search about</AlertDescription>
                </Alert>
              )}

              {search.trim() === "" ? (
                // Show popular resources when no search
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-bold mb-4">Popular resources</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {popularResources.map((resource) => (
                        <HomeResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                // Show search results organized by category
                <div className="space-y-8">
                  {shows.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold mb-4">Shows</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {shows.map((resource) => (
                          <div
                            key={resource.id}
                            className="relative aspect-square bg-accent rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => addResource(resource)}
                          >
                            <Image
                              src={resource.imageUrl || "/placeholder.svg"}
                              alt={resource.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-white font-semibold truncate">{resource.title}</h3>
                              <p className="text-white/70 text-sm">{resource.type}</p>
                            </div>
                            {isSelected(resource.id) && (
                              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredAuthors.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold mb-4">People</h2>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {filteredAuthors.slice(0, 4).map((author) => (
                          <div
                            key={author.id}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            onClick={() => {
                              const authorResources = resources.filter((r) => r.authorId === author.id)
                              if (authorResources.length > 0) {
                                addResource(authorResources[0])
                              }
                            }}
                          >
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-accent">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-muted-foreground" />
                              </div>
                              {author.imageUrl && (
                                <Image
                                  src={author.imageUrl || "/placeholder.svg"}
                                  alt={author.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="font-medium truncate max-w-[96px]">{author.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[96px]">{author.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {books.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold mb-4">Books</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {books.map((resource) => (
                          <div
                            key={resource.id}
                            className="relative aspect-square bg-accent rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => addResource(resource)}
                          >
                            <Image
                              src={resource.imageUrl || "/placeholder.svg"}
                              alt={resource.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <BookOpen className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-white font-semibold truncate">{resource.title}</h3>
                              <p className="text-white/70 text-sm">{resource.type}</p>
                            </div>
                            {isSelected(resource.id) && (
                              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredResources.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No results found for "{search}"</div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
      <ResourceSheet
        resource={selectedSheetResource}
        open={!!selectedSheetResource}
        onOpenChange={(open) => {
          if (!open) setSelectedSheetResource(null)
        }}
      />
    </Dialog>
  )
}

