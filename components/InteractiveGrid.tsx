'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface GridItem {
  id: string;
  name: string;
  image: string;
}

const items: GridItem[] = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    name: 'Jane Smith',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    image: 'https://via.placeholder.com/150'
  }
];

export function InteractiveGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen p-4">
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            className={`relative rounded-lg overflow-hidden cursor-pointer ${
              selectedId === item.id
                ? 'fixed inset-0 z-50 w-screen h-screen'
                : 'aspect-square'
            }`}
            onClick={() => setSelectedId(item.id)}
            initial={{ opacity: 1 }}
            animate={{
              opacity: selectedId ? (selectedId === item.id ? 1 : 0) : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              layout
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
              layout
            >
              <h3 className="text-white font-semibold">{item.name}</h3>
              <button
                className="mt-2 px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log({ clickedItem: item });
                }}
              >
                About
              </button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
