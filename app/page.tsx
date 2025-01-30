"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, X, Loader2 } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { ResourceSelector } from "@/components/ResourceSelector"
import { useRouter } from "next/navigation"
import { getResources } from "@/lib/api"
import { ResourceCard } from "@/components/ResourceCard"
import { Badge } from "@/components/ui/badge"
import { createNewChat } from "@/lib/history-storage"
import type React from "react"

export default function HomePage() {
  const [message, setMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [popularResources, setPopularResources] = useState([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (message.trim()) {
      if (selectedResource) {
        try {
          setIsLoading(true)
          const chatId = await createNewChat(selectedResource.id, message)
          await router.push(`/chat/conversation?id=${chatId}`)
        } catch (error) {
          console.error("Error creating new chat:", error)
          setErrorMessage(`Failed to create a new chat: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
          setIsLoading(false)
        }
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
          <div className="relative bg-background-highlight rounded-lg border-2 border-border/50">
            {/* Resources List */}
            <div className="p-2 border-b border-border/50">
              <div className="flex items-center gap-2 rounded-md p-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-background-secondary shrink-0"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                {selectedResource && (
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-border/50 px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-background-highlight/80 pl-2 pr-1 py-1 h-9 flex items-center gap-2 bg-background-secondary"
                  >
                    <div className="h-6 w-6 overflow-hidden rounded-full border border-border/50">
                      <img
                        src={selectedResource.imageUrl || "/placeholder.svg"}
                        alt={selectedResource.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm truncate max-w-[150px]">{selectedResource.title}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeResource()
                      }}
                      className="ml-1 h-5 w-5 bg-background-highlight rounded-full flex items-center justify-center transition-opacity hover:bg-background"
                      aria-label={`Remove ${selectedResource.title}`}
                    >
                      <X className="h-3 w-3 text-foreground" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-start p-2 gap-2">
              <div className="flex-grow min-h-[44px]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedResource ? "Ask AI about your resource..." : "Ask AI anything..."}
                  className="w-full h-full min-h-[44px] bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground py-2 px-2"
                  rows={1}
                  style={{
                    height: "auto",
                    overflow: "hidden",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto"
                    target.style.height = target.scrollHeight + "px"
                  }}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                size="icon"
                variant="secondary"
                disabled={!message.trim() || isLoading}
                className="h-9 w-9 rounded-full hover:bg-background-secondary shrink-0 self-end"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </form>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Popular Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

