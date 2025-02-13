"use client";

import { useState } from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useAuth } from "@/contexts/AuthContext";
import {useHistory} from "@/contexts/HistoryContext";
import {TrashIcon} from "@/components/icons/TrashIcon";
import {SearchIcon} from "@/components/icons/SearchIcon";
import {CollapseIcon} from "@/components/icons/CollapseIcon";
import {Logo} from "@/components/icons/Logo";
import {HistoryIcon} from "@/components/icons/HistoryIcon";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const { historyItems, removeHistoryItem } = useHistory();
  const router = useRouter();
  const isConversationPage =  pathname?.includes('conversation');

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      openAuthModal();
    }
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
          "flex items-center p-5 border-b border-white/10",
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
            <span className="text-lg font-semibold whitespace-nowrap">Direct Talk</span>
          )}
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <CollapseIcon className="fill-muted-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-3 p-5">
          {/* History Section */}
          {
            !isCollapsed && isConversationPage ? <Button
                variant="default"
                onClick={() => router.push('/')}
                className="bg-white w-full mb-3 font-semibold"
            >
              <SearchIcon/>
              Start Search
            </Button> : null
          }
          <div
            className={cn(
              "flex items-center gap-2 mb-3",
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
            <ScrollArea className={`h-[calc(100vh-${ isConversationPage ? '264px' : '212px'})] border-white`}>
                {historyItems.length > 0 ? (
                    historyItems.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/chat/conversation?id=${chat.id}`}
                      className={cn(
                        "flex items-center justify-between group py-2 text-sm rounded-sm transition-all",
                        "hover:bg-white/10 hover:px-2",
                        pathname?.includes(chat.id) && "bg-accent"
                      )}
                    >
                      <span className="truncate max-w-40 text-sm">{chat.title}</span>
                      <TrashIcon onClick={() => removeHistoryItem(chat.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground pb-2">
                    No history records.
                  </div>
                )}
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
        onClick={handleAuth}
      >
        <LogoutIcon className="h-4 w-4" />
        {!isCollapsed && (
          <span className="text-sm font-bold">
            {isAuthenticated ? "Logout" : "Login"}
          </span>
        )}
      </Button>
    </div>
  );
}
