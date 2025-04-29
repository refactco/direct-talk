'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface CirclePosition {
  x: number;
  y: number;
}

interface InteractiveCirclesProps {
  containerClassName?: string;
  circleClassName?: string;
  children?: ReactNode[];
}

export default function InteractiveCircles({
  containerClassName = '',
  circleClassName = '',
  children = []
}: InteractiveCirclesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCircleClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div className={`relative w-full aspect-square ${containerClassName}`}>
      <AnimatePresence>
        {[0, 1, 2, 3].map((index) => {
          const isSelected = selectedIndex === index;

          // Calculate positions as percentages
          const posX = index % 2 === 0 ? '25%' : '75%';
          const posY = index < 2 ? '25%' : '75%';
          const centerX = '50%';
          const centerY = '50%';

          return (
            <motion.div
              key={index}
              className={`absolute w-[30%] h-[30%] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 cursor-pointer flex items-center justify-center ${circleClassName}`}
              initial={false}
              animate={{
                left: isSelected ? centerX : posX,
                top: isSelected ? centerY : posY,
                scale: isSelected ? 1.2 : 1,
                opacity: selectedIndex === null || isSelected ? 1 : 0
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              onClick={() => handleCircleClick(index)}
            >
              {children ? children[index] : null}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
