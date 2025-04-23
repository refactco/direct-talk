'use client';

import { ResourcesList } from '@/components/resources-list/resources-list';
import { TSelectedResource } from '@/types/resources';
import { AnimatePresence, motion } from 'framer-motion';

export function ResourcesConversationPage({
  resources
}: {
  resources: TSelectedResource[];
}) {
  return (
    <div>
      <div className="w-60 mt-6 sticky top-8 border border-border rounded-lg p-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Resources
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <ResourcesList
              selectedResources={resources}
              hideRemoveButton
              direction="vertical"
              wrapTitle
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
