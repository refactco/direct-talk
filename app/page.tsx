"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, X } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { ResourceSelector } from "@/components/ResourceSelector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getResources } from "@/lib/api"
import { ResourceCard } from "@/components/ResourceCard"

export default function HomePage() {
  const [message, setMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [popularResources, setPopularResources] = useState([])
  const { selectedResource, removeResource } = useSelectedResources()
  const router = useRouter()

  useEffect(() => {
    const fetchPopularResources = async () => {
      try {
        const resources = await getResources({ sort: "popular", limit: 4 })
        setPopularResources(resources)
      } catch (error) {
        console.error("Error fetching popular resources:", error)
      }
    }
    fetchPopularResources()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      if (selectedResource) {
        const queryParams = new URLSearchParams({
          prompt: message,
          content_id: selectedResource.id,
        })
        router.push(`/chat/conversation?${queryParams.toString()}`)
      } else {
        setIsModalOpen(true)
        setShowWarning(true)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-[calc(100vh-4rem)] bg-background p-6">
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center items-center space-y-8">
        <h1 className="text-4xl font-bold text-center">What do you want to know?</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="rounded-full border border-border/50 bg-[#282828] hover:bg-[#2a2a2a] transition-colors overflow-hidden">
            <div className="relative flex items-center px-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-background-highlight shrink-0"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>

              {selectedResource && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative group ml-2">
                        <Link href={`/resources/${selectedResource.id}`}>
                          <div className="h-6 w-6 overflow-hidden rounded-full border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
                            <img
                              src={selectedResource.imageUrl || "/placeholder.svg"}
                              alt={selectedResource.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            removeResource()
                          }}
                          className="absolute -top-1 -right-1 h-3 w-3 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border/50"
                          aria-label={`Remove ${selectedResource.title}`}
                        >
                          <X className="h-2 w-2 text-red-500" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{selectedResource.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedResource ? "Ask AI about your resource..." : "Select a resource to start..."}
                className="flex-1 h-12 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground px-3"
              />

              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={!message.trim()}
                className="h-8 w-8 rounded-full hover:bg-background-highlight shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Popular Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <ResourceSelector
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setShowWarning(false)
        }}
        showWarning={showWarning}
      />
    </div>
  )
}

