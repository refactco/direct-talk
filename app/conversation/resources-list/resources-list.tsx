'use client';

import { ResourcesList } from '@/components/resources-list/resources-list';
import { IAuthor, TSelectedResource } from '@/types/resources';
import { AnimatePresence, motion } from 'framer-motion';

export function ResourcesConversationPage({
  resources
}: {
  resources: TSelectedResource[];
}) {
  const findCommonPeople = () => {
    if (!resources) {
      return null;
    }

    if (resources.length === 1) {
      return resources[0].people[0];
    }

    const firstThreeResources = resources.slice(0, 2);

    // Get people arrays from first 3 resources
    const peopleArrays = firstThreeResources.map((resource) =>
      resource.people ? resource.people : []
    );

    // Find common people across all 3 arrays
    const commonPeople = peopleArrays[0].filter((person: IAuthor) =>
      peopleArrays[1].some((p: IAuthor) => p.id === person.id)
    );

    return commonPeople;
  };

  const commonPeople = findCommonPeople();
  return (
    <div>
      <div className="w-60 mt-6 sticky top-8 border border-border rounded-lg p-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Resources hello
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <ResourcesList
              selectedResources={commonPeople}
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
