'use client';

import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '../icons/Logo';
import { Skeleton } from '../ui/skeleton';

interface ConversationPageLoadingProps {
  initialMessage?: string | null;
}

export function ConversationPageLoading({
  initialMessage
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
              className="p-6 max-w-5xl"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  {initialMessage ? (
                    <h2 className="text-lg font-bold">{initialMessage}</h2>
                  ) : (
                    <Skeleton className="h-4 w-[90%]" />
                  )}
                </div>

                {/* Answer Section */}
                <div className="flex gap-4 flex-1 bg-neutral-900 p-4 rounded-xl">
                  <div className="w-10">
                    {selectedResources?.[0] ? (
                      <img
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                        src={selectedResources[0].image_url}
                      />
                    ) : (
                      <Logo width={40} height={40} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-neutral-400">
                      {/* <Book className="h-5 w-5" /> */}
                      {/* <Logo /> */}
                      <div className="font-medium">
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
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[85%]" />
                        <Skeleton className="h-4 w-[75%]" />
                        <Skeleton className="h-4 w-[88%]" />
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
