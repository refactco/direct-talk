import { ChevronLeftIcon } from '@/components/icons/ChevronLeft';
import { ChevronRightIcon } from '@/components/icons/ChevronRight';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';

export function CardSlider({ children }: { children: ReactNode }) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="group/slider relative">
      {/* Left Navigation Button */}
      <div
        className={cn(
          'hidden md:flex absolute left-[-1px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity justify-center w-[95px] h-[calc(100%+2px)] dark:bg-[linear-gradient(-270deg,#09090B_-3.68%,rgba(9,9,11,0.25)_84.45%,rgba(9,9,11,0.00)_100%)] bg-[linear-gradient(-270deg,#ffffff_-3.68%,rgba(255,255,255,0.25)_84.45%,rgba(9,9,11,0.00)_100%)]',
          !showPrev && 'md:hidden'
        )}
      >
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className={`absolute left-0 prev-btn w-10 h-10 bg-accent rounded-full flex items-center justify-center top-10`}
        >
          <ChevronLeftIcon className="fill-foreground" />
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
        breakpoints={{
          0: {
            slidesPerView: 2.2,
            spaceBetween: 5
          },
          360: {
            slidesPerView: 3.2,
            spaceBetween: 16
          },
          420: {
            slidesPerView: 5,
            spaceBetween: 0
          }
        }}
      >
        {children}
      </Swiper>

      {/* Right Navigation Button */}
      <div
        className={cn(
          'absolute hidden md:flex right-[-1px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity justify-end w-[95px] h-[calc(100%+2px)] dark:bg-[linear-gradient(270deg,#0c0a09_-3.68%,rgba(9,9,11,0.25)_84.45%,rgba(9,9,11,0)_100%)] bg-[linear-gradient(270deg,#ffffff_-3.68%,rgba(255,255,255,0.25)_84.45%,rgba(9,9,11,0)_100%)]',
          !showNext && 'md:hidden'
        )}
      >
        <button
          onClick={() => swiperInstance?.slideNext()}
          className={`absolute next-btn w-10 h-10 bg-accent rounded-full flex items-center justify-center top-10`}
        >
          <ChevronRightIcon className="fill-foreground" />
        </button>
      </div>
    </div>
  );
}
