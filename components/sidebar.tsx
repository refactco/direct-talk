'use client';

import { CollapseIcon } from '@/components/icons/CollapseIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Logo } from '@/components/icons/Logo';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { Tooltip } from './ui/tooltip/tooltip';

export function Sidebar() {
  // const { mobileExpanded } = props;
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const {
    isAuthenticated,
    logout,
    openAuthModal,
    isLoading: isLoadingAuth
  } = useAuth();
  const { historyItems, removeHistoryItem, isLoading, updateHistory } =
    useHistory();
  const router = useRouter();
  const isNotHomePage: boolean = pathname !== '/';
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get('id');

  useEffect(() => {
    updateHistory();
  }, [isAuthenticated]);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <nav className="flex md:hidden w-full justify-between absolute z-50 p-4 border-b border-current/80 bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsMobileExpanded(true);
          }}
          className="bg-[#1C1917] rounded-md w-8 h-8"
        >
          <MenuIcon className="absolute rotate-90 scale-0 w-5 h-5 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {/* <ThemeToggle /> */}
      </nav>
      <div
        onClick={() => {
          setIsMobileExpanded(false);
        }}
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          isMobileExpanded ? 'block' : 'hidden'
        )}
      ></div>
      <div
        className={cn(
          'absolute md:relative md:left-0 w-80 z-50 flex l- h-full flex-col bg-accent transition-all duration-300 ease-in-out border-r border-white/10',
          isCollapsed ? 'md:w-[64px]' : 'md:w-[243px]',
          isMobileExpanded ? 'left-0' : '-left-full'
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center p-4 border-b border-border',
            isCollapsed ? 'justify-center' : 'justify-between'
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
              <span className="text-lg font-semibold">Ask Archive</span>
            )}
          </Link>
          {!isCollapsed && (
            <>
              <Tooltip id="collapse-button" place="right" content="Collapse" />
              <Button
                variant="ghost"
                size="icon"
                className="w-5 h-5 rounded-full hidden md:flex items-center justify-center hover:bg-accent transition-colors duration-200"
                onClick={() => setIsCollapsed(!isCollapsed)}
                data-tooltip-id="collapse-button"
              >
                <CollapseIcon className="fill-muted-foreground h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 rounded-full flex md:hidden items-center justify-center hover:bg-accent transition-colors duration-200"
            onClick={() => setIsMobileExpanded(false)}
          >
            <CollapseIcon className="fill-muted-foreground" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={cn('space-y-3 flex-1', isCollapsed ? 'p-3' : 'p-5')}>
            {/* History Section */}
            {isNotHomePage ? (
              <Button
                variant="default"
                onClick={() => router.push('/')}
                className="bg-foreground w-full mb-3 font-semibold max-h-9 hover:bg-foreground/90 rounded-[6px]"
              >
                <SearchIcon className="fill-primary-foreground" />
                {isCollapsed ? '' : 'New Search'}
              </Button>
            ) : null}
            <div
              className={cn(
                'flex items-center gap-2 mb-3',
                isCollapsed && 'justify-center'
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
              <ScrollArea
                className={`h-[calc(100vh-${isNotHomePage ? '264px' : '212px'})] border-white`}
              >
                {historyItems.length > 0 ? (
                  historyItems.map((chat) => (
                    <div
                      key={chat.session_id}
                      className={cn(
                        'flex items-center justify-between group py-2 text-sm rounded-md transition-all',
                        'hover:bg-highlight hover:px-2 max-h-[34px]',
                        pathname?.includes(chat.session_id) && 'bg-accent'
                      )}
                    >
                      <Link
                        href={`/conversation?id=${chat.session_id}`}
                        className="truncate max-w-40 text-sm"
                      >
                        {chat.session_title}
                      </Link>
                      <TrashIcon
                        onClick={() =>
                          removeHistoryItem(chat.session_id, activeSessionId)
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity fill-foreground cursor-pointer"
                      />
                    </div>
                  ))
                ) : (
                  <Fragment>
                    {isLoading ? (
                      <Icons.spinner className="mt-2 m-auto h-4 w-4 animate-spin" />
                    ) : (
                      <div className="text-sm text-muted-foreground pb-2">
                        No history records.
                      </div>
                    )}
                  </Fragment>
                )}
              </ScrollArea>
            )}
          </div>
          <div
            className={cn(
              'flex flex-col gap-5',
              isCollapsed ? 'px-3 pb-3 items-center' : 'px-5 pb-5'
            )}
          >
            <Button
              variant="outline"
              className={cn(
                'justify-start w-max bg-transparent',
                isCollapsed ? 'p-0 border-none' : 'border-border'
              )}
              onClick={handleAuth}
              disabled={isLoadingAuth}
            >
              {isLoadingAuth ? (
                <Icons.spinner className=" h-4 w-4 animate-spin" />
              ) : (
                <LogoutIcon
                className={cn(
                  'fill-foreground',
                  isCollapsed ? 'h-5 w-5' : 'h-4 w-4'
                )}
              />
              )}
              {!isCollapsed && (
                <span className="text-sm font-bold">
                  {isAuthenticated ? 'Logout' : 'Login'}
                </span>
              )}
            </Button>
            {!isCollapsed ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Copyright &copy; 2025 Refact, LLC
                </p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground [&_a:hover]:text-white">
                  <div className="flex gap-[0.38rem] items-center">
                    <Link href="/privacy">Privacy Policy</Link>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <Link href="/terms">Terms of Use</Link>
                  </div>
                  <div>
                    <Link href="/about">About</Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
