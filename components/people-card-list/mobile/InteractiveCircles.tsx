'use client';

import { PeopleCard } from '@/components/people-card/PeopleCard';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { IPeopleCardListProps } from '../people-card-list-type';

export default function InteractiveCirclesPeople({
  popularResources,
  selectedPerson,
  selectedPersonIndex,
  handlePersonClick
}: IPeopleCardListProps) {
  return (
    <div className={`relative w-full aspect-square mt-8 block md:hidden`}>
      <AnimatePresence>
        {popularResources?.slice(0, 4).map((show, index) => {
          const isSelected = selectedPersonIndex === index;

          // Calculate positions as percentages
          const posX = index % 2 === 0 ? '25%' : '75%';
          const posY = index < 2 ? '25%' : '75%';
          const centerX = '50%';
          const centerY = '50%';

          return (
            <motion.div
              key={index}
              className={cn(
                'absolute w-1/2 h-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center',
                index < 2 ? 'pb-4' : 'pt-4',
                index % 2 === 0 ? 'pr-4' : 'pl-4',
                isSelected ? 'p-0' : ''
              )}
              initial={false}
              animate={{
                left: isSelected ? centerX : posX,
                top: isSelected ? centerY : posY,
                opacity: !selectedPerson || isSelected ? 1 : 0,
                display: selectedPerson && !isSelected ? 'none' : 'flex',
                transitionEnd: {
                  display: selectedPerson && !isSelected ? 'none' : 'flex'
                }
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28
              }}
              onClick={() => handlePersonClick(show, index)}
            >
              <PeopleCard people={show} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
