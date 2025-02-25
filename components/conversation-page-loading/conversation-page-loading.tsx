'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Book, MessageCircleQuestion } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function ConversationPageLoading() {
  return (
    <div className="">
      {/* Main Content */}
      <div className="flex gap-8 min-h-[calc(100vh-85px)]">
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
                    <MessageCircleQuestion className="h-6 w-6" />
                    <Skeleton className="h-4 w-[90%]" />
                  </div>

                  {/* Answer Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Book className="h-5 w-5" />
                      <div className="font-medium">Answer</div>
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
              </motion.div>
            );
          })}
        </div>
        {/* Resources Section */}
        <div className="w-60 mt-6">
          <div className="sticky top-0">
            <div className="text-sm text-gray-400 mb-4">Resources</div>
            <AnimatePresence mode="wait">
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5"
                  >
                    <Skeleton className="w-10 h-10 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
