'use client';

import { Icons } from '@/components/icons';
import { CollapseIcon } from '@/components/icons/CollapseIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Logo } from '@/components/icons/Logo';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { HistoryList } from '@/components/sidebar/history-list/history-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { cn } from '@/lib/utils';
import { MenuIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
  // const { mobileExpanded } = props;
  const pathname = usePathname();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const {
    isAuthenticated,
    logout,
    openAuthModal,
    isLoading: isLoadingAuth
  } = useAuth();
  const { historyItems, isLoading, updateHistory } = useHistory();
  const router = useRouter();
  const isNotHomePage: boolean = pathname !== '/';
  const { resetSelectedResources } = useSelectedResources();

  useEffect(() => {
    // Only update history when user becomes authenticated, not when they become unauthenticated
    if (isAuthenticated) {
      updateHistory();
    }
  }, [isAuthenticated]);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      openAuthModal();
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement;
    // Show/hide top fade based on scroll position
    setShowTopFade(scrollTop > 0);

    // Show/hide bottom fade based on scroll position
    setShowBottomFade(scrollTop + clientHeight < scrollHeight);
  };

  // Set sidebar width to always be expanded on desktop
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', '243px');
  }, []);

  const closeMobileSidebar = () => {
    setIsMobileExpanded(false);
  };

  return (
    <>
      <nav className="flex md:hidden w-full justify-between absolute z-50 p-4 bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsMobileExpanded(true);
          }}
          className="bg-accent rounded-md w-8 h-8"
        >
          <MenuIcon className="absolute rotate-90 scale-0 w-5 h-5 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
      <div
        onClick={() => {
          closeMobileSidebar();
        }}
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          isMobileExpanded ? 'block' : 'hidden'
        )}
      ></div>
      <div
        className={cn(
          'absolute md:relative md:left-0 w-80 z-50 flex h-full flex-col bg-accent transition-all duration-300 ease-in-out',
          'md:w-[243px]',
          isMobileExpanded ? 'left-0' : '-left-full'
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center p-4',
            'justify-between'
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => {
              closeMobileSidebar();
            }}
          >
            <Logo className="flex-[25px]" />
            <div className="line-height-0">
              <span 
                className="font-medium text-[#97c521] line-height-0 whitespace-nowrap text-xl" 
              >
                Ask Author
              </span>
            </div>
          </Link>
          {/* Collapse button removed for desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 rounded-full flex md:hidden items-center justify-center hover:bg-accent transition-colors duration-200"
            onClick={() => {
              closeMobileSidebar();
            }}
          >
            <CollapseIcon className="fill-muted-foreground" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="space-y-3 flex-1 p-4">
            {/* New Chat Link */}
            {isNotHomePage ? (
              <div className="mb-4">
                <Link
                  href="/"
                  onClick={() => {
                    closeMobileSidebar();
                    resetSelectedResources();
                  }}
                  className="flex items-center justify-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground bg-background/50 border border-border hover:border-[#97c521] hover:bg-background/80 rounded-lg transition-all duration-200 group w-full"
                >
                  <PlusIcon className="w-4 h-4 group-hover:text-[#97c521] transition-colors duration-200" />
                  New Chat
                </Link>
              </div>
            ) : null}
            <div className="flex items-center pt-4 border-t border-border/30">
              <span className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                History
              </span>
            </div>

            <ScrollArea
              className="relative"
              onScroll={handleScroll}
            >
              <div
                className={cn(
                  isNotHomePage
                    ? 'h-[calc(100vh-322px)]'
                    : 'h-[calc(100vh-270px)]'
                )}
              >
                {showTopFade ? (
                  <div className="w-full h-8 bg-history-top-fade absolute top-0"></div>
                ) : null}
                <div>
                  <HistoryList
                    list={historyItems}
                    isLoading={isLoading}
                    onCloseSidebar={() => {
                      closeMobileSidebar();
                    }}
                  />
                </div>
                {showBottomFade ? (
                  <div className="w-full h-8 bg-history-bottom-fade absolute bottom-0"></div>
                ) : null}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-5 px-4 pb-4">
            <div>
              <Button
                variant="outline"
                className="justify-start w-max bg-background/50 border-border hover:border-[#97c521] hover:bg-background/80 transition-all duration-200"
                onClick={handleAuth}
                disabled={isLoadingAuth}
              >
                {isLoadingAuth ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <LogoutIcon className="fill-foreground h-4 w-4" />
                )}
                <span className="text-sm font-bold">
                  {isAuthenticated ? 'Logout' : 'Login'}
                </span>
              </Button>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Made by{' '}
                  <a
                    href="https://refact.co"
                    target="_blank"
                    className="text-primary"
                  >
                    Refact
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
