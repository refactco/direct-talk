'use client';

import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleUserIcon } from 'lucide-react';
import { Logo } from '../icons/Logo';
import { Skeleton } from '../ui/skeleton';

interface ConversationPageLoadingProps {
  initialMessage?: string | null;
  userAvatar?: string | null;
}

export function ConversationPageLoading({
  initialMessage,
  userAvatar
}: ConversationPageLoadingProps) {
  const { selectedResources } = useSelectedResources();

  return (
    <div className="flex gap-8 min-h-[calc(100vh-117px)] w-full mx-auto">
      <div className="flex flex-1 flex-col">
        {[1].map((chat: number, index: number) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  {initialMessage ? (
                    <div className="flex items-center gap-3">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="User"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <CircleUserIcon className="w-8 h-8" />
                      )}
                      <h2 className="text-base font-normal">
                        {initialMessage}
                      </h2>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-1/2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="flex-1 h-4 w-full" />
                    </div>
                  )}
                </div>

                {/* Answer Section */}
                <div className="flex gap-3 py-4 rounded-xl">
                  <div className="w-8">
                    {selectedResources?.[0] ? (
                      <img
                        width={40}
                        height={40}
                        className="w-8 h-8 object-cover rounded-full"
                        src={selectedResources[0].image_url}
                      />
                    ) : (
                      <Logo className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-neutral-500">
                      {/* <Book className="h-5 w-5" /> */}
                      {/* <Logo /> */}
                      <div className="font-light text-sm">
                        {selectedResources?.[0]
                          ? selectedResources[0].name
                          : 'Answer'}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <Skeleton className="h-4 w-[100%]" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[95%]" />
                        <Skeleton className="h-4 w-[85%]" />
                        <Skeleton className="h-4 w-[98%]" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
