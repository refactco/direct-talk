"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getChatHistory,
  removeChatFromHistory,
  type ChatHistoryItem
} from "@/lib/history-storage";
import { cn } from "@/lib/utils";
import {
  Logo,
  CollapseIcon,
  HistoryIcon
} from "@/components/icons/sidebar-icons";
import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogoutIcon } from "@/components/icons/LogoutIcon";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateChatHistory = () => {
      setChatHistory(getChatHistory());
    };

    updateChatHistory();
    window.addEventListener("chatHistoryUpdated", updateChatHistory);
    return () => {
      window.removeEventListener("chatHistoryUpdated", updateChatHistory);
    };
  }, []);

  const handleRemoveChat = (chatId: string) => {
    removeChatFromHistory(chatId);
    setChatHistory(getChatHistory());
  };

  return (
    <div
      className={cn(
        "flex h-full pb-5 flex-col bg-accent relative transition-all duration-300 ease-in-out border-r border-white/10",
        isCollapsed ? "w-[64px]" : "w-[243px]"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center p-4 border-b border-white/10",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={(e) => {
            if (isCollapsed) {
              e.preventDefault();
              setIsCollapsed(false);
            }
          }}
        >
          <Logo />
          {!isCollapsed && (
            <span className="text-lg font-semibold">Direct Talk</span>
          )}
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <CollapseIcon />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-3 p-4">
          {/* History Section */}
          <div
            className={cn(
              "flex items-center gap-2 px-2 mb-4",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <Button
                variant="ghost"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <HistoryIcon />
              </Button>
            ) : (
              <>
                <span className="text-[11px] uppercase text-muted-foreground">
                  History
                </span>
              </>
            )}
          </div>

          {!isCollapsed && (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-1 px-2">
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/chat/conversation?id=${chat.id}`}
                      className={cn(
                        "flex items-center py-[6px] text-sm rounded-sm transition-all",
                        "hover:bg-white/10 hover:px-2",
                        pathname?.includes(chat.id) && "bg-accent"
                      )}
                    >
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-2 px-3">
                    No chat history
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Account Section */}
      <Button
        variant="outline"
        className={cn(
          "justify-start ml-5 w-max border-white/10 bg-transparent",
          isCollapsed && "px-2.5 ml-2.5"
        )}
      >
        <LogoutIcon className="h-4 w-4" />
        {!isCollapsed && <span className="text-base font-bold">Logout</span>}
      </Button>
    </div>
  );
}
