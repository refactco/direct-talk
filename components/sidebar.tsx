"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, PanelLeftOpen, PanelLeftClose, Settings, LogOut, History, Trash2 } from "lucide-react"
import { useResizable } from "@/hooks/useResizable"
import { useSelectedResources } from "@/contexts/SelectedResourcesContext"
import { getChatHistory, removeChatFromHistory, type ChatHistoryItem } from "@/lib/history-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { width, startResizing } = useResizable(280, 200, 400)
  const router = useRouter()
  const pathname = usePathname()
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { selectedResource, resetSelectedResource } = useSelectedResources()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setChatHistory(getChatHistory())
  }, [])

  const handleRemoveChat = (chatId: string) => {
    removeChatFromHistory(chatId)
    setChatHistory(getChatHistory())
  }

  const handleNewChat = async () => {
    setIsLoading(true)
    resetSelectedResource()
    await router.push("/")
    setIsLoading(false)
  }

  return (
    <>
      <div
        className={cn(
          "flex h-full flex-col bg-background-secondary relative transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16 border-r border-border" : "",
        )}
        style={{ width: isCollapsed ? "4rem" : `${width}px` }}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {!isCollapsed && <span className="ml-2 text-lg font-semibold">Direct Talk</span>}
          </Link>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-3 p-4">
            {pathname.startsWith("/chat/conversation") && (
              <Button
                className={cn("w-full rounded-full", isCollapsed ? "w-12 h-12 p-0" : "h-12")}
                size={isCollapsed ? "icon" : "lg"}
                onClick={handleNewChat}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Plus className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && "New Chat"}
                  </>
                )}
              </Button>
            )}
            {/* Chat History */}
            <div className="px-3 py-2">
              {!isCollapsed && chatHistory.length > 0 && <h3 className="text-sm font-semibold mb-2">History</h3>}
              <ScrollArea className="h-[calc(100vh-280px)]">
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="mb-2">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start font-normal text-left px-2 py-2 h-auto",
                          "hover:bg-background-highlight transition-colors duration-200",
                          "flex items-center gap-2 rounded-lg group",
                        )}
                        asChild
                      >
                        <Link href={`/chat/conversation?id=${chat.id}`}>
                          {!isCollapsed && <span className="truncate">{chat.title}</span>}
                          {!isCollapsed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveChat(chat.id)
                              }}
                              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                              aria-label={`Remove ${chat.title}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground px-2 flex items-center justify-center h-full pt-4">
                    <History className="mr-2 h-5 w-5" />
                    {isCollapsed ? "" : "No chat history"}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn("w-full justify-start", isCollapsed && "px-0")}>
                <img src="/placeholder.svg" alt="User avatar" className="h-8 w-8 rounded-full" />
                {!isCollapsed && <span className="ml-2">Account</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 -right-10 bg-background-secondary z-10",
            "w-10 h-10 rounded-full shadow-md",
            "flex items-center justify-center",
            "hover:bg-background-highlight transition-colors duration-200",
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>

        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-border hover:bg-primary transition-colors"
            onMouseDown={startResizing}
          />
        )}
      </div>
    </>
  )
}

