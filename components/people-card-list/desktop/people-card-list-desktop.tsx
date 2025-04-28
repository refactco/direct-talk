import { CardSlider } from '@/components/card-slider/card-slider';
import { PeopleCard } from '@/components/people-card/PeopleCard';
import { AnimatePresence, motion } from 'framer-motion';
import { SwiperSlide } from 'swiper/react';
import { IPeopleCardListProps } from '../people-card-list-type';

export function PeopleCardListDesktop({
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
          initial={{
            x: `${(selectedPersonIndex ?? 0) * 25}%`
          }}
          animate={{ x: 'calc(40% - 2rem)' }}
          exit={{
            x: `${(selectedPersonIndex ?? 0) * 25}%`
          }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex justify-start"
        >
          <div
            className="w-1/4"
            onClick={() =>
              handlePersonClick(selectedPerson, selectedPersonIndex)
            }
          >
            <PeopleCard people={selectedPerson} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="carousel"
          transition={{ duration: 0.4 }}
          className="hidden md:block"
        >
          <CardSlider>
            {popularResources.map((show, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div onClick={() => handlePersonClick(show, index)}>
                  <PeopleCard people={show} />
                </div>
              </SwiperSlide>
            ))}
          </CardSlider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
