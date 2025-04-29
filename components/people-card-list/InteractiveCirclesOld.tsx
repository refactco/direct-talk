'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface CirclePosition {
  x: number;
  y: number;
}

const circlePositions: CirclePosition[] = [
  { x: 30, y: 30 }, // top-left
  { x: 90, y: 30 }, // top-right
  { x: 30, y: 90 }, // bottom-left
  { x: 90, y: 90 } // bottom-right
];

const centerPosition: CirclePosition = { x: 60, y: 60 };

export default function InteractiveCircles() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCircleClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="relative w-[120px] h-[120px]">
      <AnimatePresence>
        {circlePositions.map((position, index) => {
          const isSelected = selectedIndex === index;
          const targetPosition = isSelected ? centerPosition : position;

          return (
            <motion.div
              key={index}
              className="absolute w-[60px] h-[60px] rounded-full bg-blue-500 cursor-pointer"
              initial={false}
              animate={{
                x: targetPosition.x - 30, // Subtract half of width to center
                y: targetPosition.y - 30, // Subtract half of height to center
                scale: isSelected ? 1.2 : 1,
                opacity: selectedIndex === null || isSelected ? 1 : 0
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              onClick={() => handleCircleClick(index)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
