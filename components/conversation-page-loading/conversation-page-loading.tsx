'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CircleUserIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface ConversationPageLoadingProps {
  initialMessage?: string | null;
  userAvatar?: string | null;
}

export function ConversationPageLoading({
  initialMessage,
  userAvatar
}: ConversationPageLoadingProps) {

  return (
    <div className="flex gap-8 min-h-[calc(100vh-117px)] w-full mx-auto">
      <div className="flex flex-1 flex-col">
        {[1].map((chat: number, index: number) => {
          return (
            <motion.div
              key={index}
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
                <div className="grid grid-cols-[2rem_1fr] gap-3 flex-1 rounded-xl">
                  <div className="w-8">
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 w-[calc(100vw-5rem)] md:w-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 mt-2"
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
