import { useState } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ReactNode } from 'react';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeft';
import { ChevronRightIcon } from '@/components/icons/ChevronRight';

export function CardSlider({ children }: { children: ReactNode }) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="relative w-full group/slider">
      {/* Left Navigation Button */}
      <div
        className={`${!showPrev && 'hidden'} absolute left-[-1px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity flex justify-center w-[95px] h-[calc(100%+2px)] bg-[linear-gradient(-270deg,#09090B_-3.68%,rgba(9,9,11,0.25)_84.45%,rgba(9,9,11,0.00)_100%)]`}
      >
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className={`absolute left-0 prev-btn w-10 h-10 bg-accent rounded-full flex items-center justify-center top-10`}
        >
          <ChevronLeftIcon />
        </button>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={22}
        slidesPerView={5}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          setShowPrev(!swiper.isBeginning);
          setShowNext(!swiper.isEnd);
          swiper.on('slideChange', () => {
            setShowPrev(!swiper.isBeginning);
            setShowNext(!swiper.isEnd);
          });
        }}
      >
        {children}
      </Swiper>

      {/* Right Navigation Button */}
      <div
        className={`${!showNext && 'hidden'} absolute right-[-1px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity flex justify-end w-[95px] h-[calc(100%+2px)] bg-[linear-gradient(270deg,#0c0a09_-3.68%,rgba(9,9,11,0.25)_84.45%,rgba(9,9,11,0)_100%)]`}
      >
        <button
          onClick={() => swiperInstance?.slideNext()}
          className={`absolute next-btn w-10 h-10 bg-accent rounded-full flex items-center justify-center top-10`}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
