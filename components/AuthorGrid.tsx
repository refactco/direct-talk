'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { useState } from 'react';

interface Author {
  id: string;
  name: string;
  imageUrl: string;
  about: string;
}

const authors: Author[] = [
  {
    id: '1',
    name: 'John Doe',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    about: 'Expert in Web Development'
  },
  {
    id: '2',
    name: 'Jane Smith',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
    about: 'UI/UX Designer'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
    about: 'Data Scientist'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    imageUrl: 'https://i.pravatar.cc/150?img=4',
    about: 'Product Manager'
  }
];

export function AuthorGrid() {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [question, setQuestion] = useState('');

  const handleAuthorClick = (author: Author) => {
    setSelectedAuthor(author);
  };

  const handleReset = () => {
    setSelectedAuthor(null);
    setQuestion('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      console.log({ question, author: selectedAuthor?.name });
      setQuestion('');
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4">
      <div className="container mx-auto">
        <AnimatePresence>
          {selectedAuthor ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={handleReset}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedAuthor.imageUrl}
                    alt={selectedAuthor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {selectedAuthor.name}
                      <Check className="w-6 h-6 text-green-500" />
                    </h2>
                    <p className="text-gray-600">{selectedAuthor.about}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything..."
                      className="w-full p-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {authors.map((author) => (
                <motion.div
                  key={author.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuthorClick(author)}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={author.imageUrl}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{author.name}</h3>
                      <p className="text-gray-600 text-sm">{author.about}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
