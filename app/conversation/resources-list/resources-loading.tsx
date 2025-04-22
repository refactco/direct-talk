'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

export function ResourcesConversationPageLoading() {
  return (
    <div>
      <div className="w-60 mt-6 sticky top-8 border border-border rounded-lg p-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Resources
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {[1].map((_, index) => (
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
  );
}
