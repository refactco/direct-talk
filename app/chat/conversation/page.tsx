"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Book, Plus, X } from "lucide-react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ResourceSelector } from "@/components/ResourceSelector"
import { createNewChat, addMessageToChat, addChatToHistory } from "@/lib/history-storage"
import { getResource } from "@/lib/api"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content?: string
  result?: string
}

interface ChatData {
  id: string
  content_id: string
  messages: Message[]
}

const sendMessage = async (prompt: string, chatId: string, contentId: string) => {
  try {
    console.log("Sending message to API:", { prompt, chatId, contentId })
    const formData = new URLSearchParams()
    formData.append("prompt", prompt)
    formData.append("chat_id", chatId)
    formData.append("content_id", contentId)

    const response = await fetch("https://api-focus.sajjadrad.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer TEST_API_KEY",
      },
      body: formData,
    })

    console.log("API response status:", response.status)
    const data = await response.json()
    console.log("API response data:", data)
    return data.messages[0].result
  } catch (error) {
    console.error("Error in sendMessage:", error)
    throw error
  }
}

export default function ChatConversationPage() {
  const { selectedResources, addResource, removeResource, contextSelectedResource } = useSelectedResources()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const fetchChatData = useCallback(
    async (id: string) => {
      try {
        if (id === "new") {
          return {
            id: "new",
            content_id: selectedResources[0]?.id || "",
            messages: [],
          }
        }
        const response = await fetch(`https://api-focus.sajjadrad.com/v1/chat/${id}`, {
          headers: {
            Authorization: "Bearer TEST_API_KEY",
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch chat data")
        }
        const data = await response.json()
        if (data.content_id && (!selectedResources[0] || selectedResources[0].id !== data.content_id)) {
          const resource = await getResource(data.content_id)
          addResource(resource)
        }
        return data
      } catch (error) {
        console.error("Error fetching chat data:", error)
        setErrorMessage("Failed to load chat. Please try again.")
        return null
      }
    },
    [selectedResources, addResource],
  )

  useEffect(() => {
    const id = searchParams.get("id") || "new"
    if (id && id !== chatId) {
      setChatId(id)
      fetchChatData(id).then((data) => {
        if (data) {
          setChatData(data)
          setMessages(data.messages)
        }
      })
    }
  }, [searchParams, chatId, fetchChatData])

  useEffect(() => {
    if (chatId === "new" && selectedResources[0]) {
      setMessages([
        {
          role: "assistant",
          content: `Welcome! You're now chatting about "${selectedResources[0].title}". What would you like to know?`,
        },
      ])
    }
  }, [chatId, selectedResources])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading || selectedResources.length === 0) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setErrorMessage(null)

    try {
      let currentChatId = chatId
      if (currentChatId === "new" || !currentChatId) {
        currentChatId = await createNewChat(selectedResources[0].id, userMessage)
        setChatId(currentChatId)
        router.push(`/chat/conversation?id=${currentChatId}`)
      }

      const contentId = selectedResources[0].id

      console.log("Sending message with:", { currentChatId, contentId, userMessage })

      const result = await sendMessage(userMessage, currentChatId, contentId)
      const assistantMessage = { role: "assistant", content: result }
      setMessages((prev) => [...prev, assistantMessage])
      await addMessageToChat(currentChatId, { role: "assistant", content: result })

      setChatData((prevChatData) => ({
        id: currentChatId,
        content_id: contentId,
        messages: [...(prevChatData?.messages || []), { role: "user", content: userMessage }, assistantMessage],
      }))

      // Update chat history
      const updatedChatItem = {
        id: currentChatId,
        title: userMessage,
        contentId: selectedResources[0].id,
        createdAt: new Date().toISOString(),
      }
      addChatToHistory(updatedChatItem)

      // Trigger a custom event to notify the sidebar of the chat history update
      window.dispatchEvent(new CustomEvent("chatHistoryUpdated"))
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setErrorMessage(`Failed to get response: ${error.message || "Unknown error"}`)
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

  return (
    <div className="relative flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto min-h-[calc(100vh-10rem)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {contextSelectedResource && (
            <div className="flex items-center gap-2 sm:gap-3 bg-[#262626] rounded-lg px-2 sm:px-3 h-12 sm:h-[58px] relative mb-4 sm:mb-6">
              <div className="h-8 w-6 sm:h-10 sm:w-8 overflow-hidden rounded">
                <Image
                  src={contextSelectedResource.imageUrl || "/placeholder.svg"}
                  alt={contextSelectedResource.title}
                  width={32}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow min-w-0 pr-6">
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                  {contextSelectedResource.title}
                </span>
                <span className="text-xs text-white leading-tight">{contextSelectedResource.type}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  removeResource()
                }}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white hover:text-gray-300"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
          <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`space-y-2 sm:space-y-4 p-3 sm:p-4 rounded-lg ${
                  message.role === "user" ? "bg-background-secondary" : "bg-background-highlight"
                }`}
              >
                <div className="flex items-start">
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-2 sm:mr-3 bg-secondary text-secondary-foreground">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{message.content || message.result}</p>
                  </div>
                </div>
                {message.role === "assistant" && selectedResources[0] && (
                  <div className="mt-1 sm:mt-2 flex items-center text-xs text-muted-foreground">
                    <Book className="w-3 h-3 mr-1" />
                    <span>Source: </span>
                    <Link href={`/resources/${selectedResources[0].id}`} className="ml-1 hover:underline">
                      {selectedResources[0].title}
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-xs sm:text-sm text-muted-foreground animate-pulse flex items-center">
                <div className="mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="mr-2 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                AI is thinking...
              </div>
            )}
            {errorMessage && <div className="text-red-500 text-xs sm:text-sm">{errorMessage}</div>}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-background pb-4 sm:pb-6 pt-2 sm:pt-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="rounded-full border border-border bg-accent hover:bg-accent/80 transition-colors overflow-hidden flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-accent ml-1 sm:ml-2 shrink-0"
                onClick={() => setIsResourceSelectorOpen(true)}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask follow-up..."
                className="flex-1 h-10 sm:h-12 bg-transparent border-0 focus:outline-none focus:ring-0 text-xs sm:text-sm placeholder-muted-foreground px-2 sm:px-3"
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={isLoading || !input.trim()}
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-accent shrink-0 mr-1 sm:mr-2"
              >
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ResourceSelector open={isResourceSelectorOpen} onOpenChange={setIsResourceSelectorOpen} />
    </div>
  )
}

