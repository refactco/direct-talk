"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, BookOpen, X, Loader2 } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { ResourceSelector } from "@/components/ResourceSelector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const { selectedResource, removeResource } = useSelectedResources()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (message.trim()) {
      if (selectedResource) {
        try {
          setIsLoading(true)
          const chatId = await createNewChat(selectedResource.id, message)
          router.push(`/chat/conversation?id=${chatId}`)
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

  const createNewChat = async (resourceId: string, prompt: string): Promise<string> => {
    // Replace this with your actual API call
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resourceId, prompt }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create chat: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.id
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold text-center animate-in slide-in-from-top duration-500">
          Chat with your resource
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-border/50 bg-[hsl(var(--background))] overflow-hidden animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="relative p-4 border-b border-border/50">
              {selectedResource ? (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative group">
                          <Link href={`/resources/${selectedResource.id}`}>
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
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
                            className="absolute -top-1 -right-1 h-4 w-4 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border/50"
                            aria-label={`Remove ${selectedResource.title}`}
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{selectedResource.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="flex items-center justify-center h-8 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  No resource selected
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-background-highlight"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI about your resource ..."
                className={cn(
                  "w-full min-h-[100px] p-4 pr-12 bg-[hsl(var(--background))] resize-none border-0",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-0",
                )}
              />
              <Button
                type="submit"
                className="absolute right-3 bottom-3 h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
                disabled={!selectedResource || !message.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>

      <ResourceSelector
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        showWarning={showWarning}
        setShowWarning={setShowWarning}
      />
    </div>
  )
}

