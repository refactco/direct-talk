import { CardSlider } from '@/components/card-slider/card-slider';
import { PeopleCard } from '@/components/people-card/PeopleCard';
import { AnimatePresence, motion } from 'framer-motion';
import { SwiperSlide } from 'swiper/react';

export const AnimateMobile = () => {
  return (
    <AnimatePresence mode="wait">
      {/* Mobile: 2x2 grid, shared layoutId animation */}
      {!selectedPerson ? (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden grid grid-cols-2 gap-4"
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
      ) : (
        <motion.div
          key="selected"
          className="md:hidden flex justify-center items-center min-h-[60vh]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            layoutId={`person-${selectedPerson.id}`}
            className="flex flex-col items-center"
          >
            <PeopleCard people={selectedPerson} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
