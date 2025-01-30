"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Book, MessageSquare, Plus } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getResource } from "@/lib/api"
import { ResourceSelector } from "@/components/ResourceSelector"
import { getPreviousChat, createNewChat } from "@/lib/history-storage"

interface ApiResponse {
  id: string
  content_id: string
  messages: {
    role: string
    result: string
  }[]
}

const sendMessage = async (prompt: string, chatId: string) => {
  try {
    console.log("Sending message to API:", { prompt, chatId })
    const formData = new URLSearchParams()
    formData.append("prompt", prompt)
    formData.append("chat_id", chatId)

    const response = await fetch("https://api-focus.sajjadrad.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer TEST_API_KEY",
      },
      body: formData,
    })

    console.log("API response status:", response.status)
    const data: ApiResponse = await response.json()
    console.log("API response data:", data)
    return data.messages[0].result
  } catch (error) {
    console.error("Error in sendMessage:", error)
    throw error
  }
}

export default function ChatConversationPage() {
  const { selectedResource, addResource } = useSelectedResources()
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResourceLoading, setIsResourceLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const handlePlusClick = () => {
    setIsResourceSelectorOpen(true)
  }

  useEffect(() => {
    const fetchChatData = async () => {
      const id = searchParams.get("id")
      if (id) {
        setChatId(id)
        try {
          const chatData = await getPreviousChat(id)
          setMessages(
            chatData.messages.map((msg: any) => ({
              role: msg.role,
              content: msg.result || msg.content,
            })),
          )
          if (chatData.content_id && !selectedResource) {
            const resource = await getResource(chatData.content_id)
            addResource(resource)
          }
        } catch (error) {
          console.error("Error fetching chat data:", error)
          setErrorMessage("Failed to load chat. Please try again.")
        }
      }
    }
    fetchChatData()
  }, [searchParams, selectedResource, addResource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading || !selectedResource) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setErrorMessage(null)

    try {
      let currentChatId = chatId
      if (!currentChatId) {
        currentChatId = await createNewChat(selectedResource.id, userMessage)
        setChatId(currentChatId)
      }
      const result = await sendMessage(userMessage, currentChatId)
      console.log("Setting assistant message with result:", result)
      setMessages((prev) => [...prev, { role: "assistant", content: result }])
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setErrorMessage("Failed to get response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  if (isResourceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground animate-pulse flex items-center">
          <div className="mr-1 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
          <div
            className="mr-1 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="mr-2 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          Loading resource...
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto min-h-[calc(100vh-10rem)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-6 py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`space-y-4 p-4 rounded-lg ${
                  message.role === "user" ? "bg-background-secondary" : "bg-background-highlight"
                }`}
              >
                {message.role === "user" ? (
                  <div className="text-sm text-muted-foreground">{message.content}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium">
                        <Book className="w-4 h-4 mr-2" />
                        Resource
                      </div>
                      {selectedResource && (
                        <div className="flex gap-1">
                          <Link
                            href={`/resources/${selectedResource.id}`}
                            className="h-8 w-8 overflow-hidden rounded-full border border-border/50"
                          >
                            <img
                              src={selectedResource.imageUrl || "/placeholder.svg"}
                              alt={selectedResource.title}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Answer
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm text-muted-foreground animate-pulse flex items-center">
                <div className="mr-1 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="mr-1 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="mr-2 h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                AI is thinking...
              </div>
            )}
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-background pb-6 pt-4">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="rounded-full border border-border/50 bg-[#282828] hover:bg-[#2a2a2a] transition-colors overflow-hidden flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-background-highlight ml-2 shrink-0"
                onClick={handlePlusClick}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask follow-up..."
                className="flex-1 h-12 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground px-3"
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 rounded-full hover:bg-background-highlight shrink-0 mr-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ResourceSelector open={isResourceSelectorOpen} onOpenChange={setIsResourceSelectorOpen} />
    </div>
  )
}

