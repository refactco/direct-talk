import { PeopleCard } from '@/components/people-card/PeopleCard';
import { AnimatePresence, motion } from 'framer-motion';
import { IPeopleCardListProps } from '../people-card-list-type';

export function PeopleCardListMobile({
  popularResources,
  selectedPerson,
  selectedPersonIndex,
  handlePersonClick,
  selectedResources
}: IPeopleCardListProps) {
  return (
    <AnimatePresence mode="wait">
      {selectedResources.length > 0 && selectedPerson ? (
        <motion.div
          key="selected"
          className="md:hidden flex justify-center items-center min-h-96"
          transition={{ duration: 1 }}
        >
          <motion.div
            layoutId={`person-${selectedPerson.id}`}
            onClick={() =>
              handlePersonClick(selectedPerson, selectedPersonIndex)
            }
            className="flex flex-col items-center w-1/2"
          >
            <PeopleCard people={selectedPerson} />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          transition={{ duration: 1 }}
          className="grid md:hidden grid-cols-2 gap-4"
        >
          {popularResources?.slice(0, 4).map((show, index) => (
            <motion.div
              key={show.id}
              layoutId={`person-${show.id}`}
              onClick={() => handlePersonClick(show, index)}
              className="flex justify-center items-center"
            >
              <PeopleCard people={show} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
