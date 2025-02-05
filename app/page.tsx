"use client"

import { useState, useEffect } from "react"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { useRouter } from "next/navigation"
import { getResources } from "@/lib/api"
import { createNewChat } from "@/lib/history-storage"
import type { Resource } from "@/types/resources"
import type React from "react"
import { DetailSheet } from "@/components/DetailSheet"
import { HomeResourceCard } from "@/components/HomeResourceCard"
import { ResourceSelector } from "@/components/ResourceSelector"
import Image from "next/image"

export default function HomePage() {
  const [message, setMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [popularResources, setPopularResources] = useState<Resource[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResourceSheetOpen, setIsResourceSheetOpen] = useState(false)
  const { selectedResources, removeResource, addResource, isSelected } = useSelectedResources()
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
      if (selectedResources.length > 0) {
        try {
          setIsLoading(true)
          const chatId = await createNewChat(selectedResources[0].id, message)
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
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] p-4 sm:p-6">
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-4 sm:mb-6">
          What do you want to know?
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative rounded-lg border border-border overflow-hidden">
            {/* Resources List */}
            <div className="flex flex-wrap items-center gap-2 p-2 sm:p-4 border-b border-border">
              <button
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-accent hover:bg-accent/80 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    d="M20 3.75C16.7861 3.75 13.6443 4.70305 10.972 6.48862C8.29969 8.27419 6.21689 10.8121 4.98696 13.7814C3.75704 16.7507 3.43524 20.018 4.06225 23.1702C4.68926 26.3224 6.23692 29.2179 8.50952 31.4905C10.7821 33.7631 13.6776 35.3108 16.8298 35.9378C19.982 36.5648 23.2493 36.243 26.2186 35.013C29.1879 33.7831 31.7258 31.7003 33.5114 29.028C35.297 26.3557 36.25 23.2139 36.25 20C36.2446 15.6919 34.5309 11.5618 31.4846 8.51545C28.4383 5.46915 24.3081 3.75538 20 3.75ZM26.25 21.25H21.25V26.25C21.25 26.5815 21.1183 26.8995 20.8839 27.1339C20.6495 27.3683 20.3315 27.5 20 27.5C19.6685 27.5 19.3505 27.3683 19.1161 27.1339C18.8817 26.8995 18.75 26.5815 18.75 26.25V21.25H13.75C13.4185 21.25 13.1005 21.1183 12.8661 20.8839C12.6317 20.6495 12.5 20.3315 12.5 20C12.5 19.6685 12.6317 19.3505 12.8661 19.1161C13.1005 18.8817 13.4185 18.75 13.75 18.75H18.75V13.75C18.75 13.4185 18.8817 13.1005 19.1161 12.8661C19.3505 12.6317 19.6685 12.5 20 12.5C20.3315 12.5 20.6495 12.6317 20.8839 12.8661C21.1183 13.1005 21.25 13.4185 21.25 13.75V18.75H26.25C26.5815 18.75 26.8995 18.8817 27.1339 19.1161C27.3683 19.3505 27.5 19.6685 27.5 20C27.5 20.3315 27.3683 20.6495 27.1339 20.8839C26.8995 21.1183 26.5815 21.25 26.25 21.25Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              {selectedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-2 sm:gap-3 bg-accent rounded-lg px-2 sm:px-3 h-12 sm:h-[58px] relative"
                >
                  <div className="h-8 w-6 sm:h-10 sm:w-8 overflow-hidden rounded flex-shrink-0">
                    <Image
                      src={resource.imageUrl || "/placeholder.svg"}
                      alt={resource.title}
                      width={32}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0 pr-6">
                    <span className="text-xs sm:text-sm font-bold leading-tight truncate">{resource.title}</span>
                    <span className="text-xs leading-tight">{resource.type}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeResource(resource.id)
                    }}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 hover:text-muted-foreground"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    >
                      <path
                        d="M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center px-2 sm:px-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI anything..."
                className="flex-grow bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-muted-foreground text-xs sm:text-sm py-3 sm:py-5 min-h-[48px] sm:min-h-[64px] resize-none"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                >
                  <path
                    d="M3.125 10H16.875"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.25 4.375L16.875 10L11.25 15.625"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}
        {showWarning && selectedResources.length === 0 && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            Please select at least one resource before starting a chat.
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-foreground">
          Popular resources
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-[22px]">
          {popularResources.map((resource) => (
            <HomeResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <DetailSheet item={selectedResources[0]} open={isResourceSheetOpen} onOpenChange={setIsResourceSheetOpen} />
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

