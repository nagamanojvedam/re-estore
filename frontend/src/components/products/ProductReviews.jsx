import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ProductReviews({ reviews }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex(prev => (prev + 1) % reviews.length),
    [setIndex, reviews.length],
  );
  const prev = () =>
    setIndex(prev => (prev - 1 + reviews.length) % reviews.length);

  // Optional auto-scroll every 5s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [reviews, next]);

  const review = reviews[index];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={review._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            {/* User info */}
            <div className="flex items-center mb-4">
              <img
                // src={review.user?.image || '/default-avatar.png'}
                src={'/avatars/default-avatar.jpg'}
                alt={review.user?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover border-2   border-primary-600 dark:border-primary-400"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {review.user?.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(review.updatedAt)}
                </p>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              {review.title}
            </h3>

            {/* Stars */}
            <div className="flex mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2">
          <button
            onClick={prev}
            className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow"
          >
            ◀
          </button>
        </div>
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <button
            onClick={next}
            className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === index ? 'bg-gray-800 dark:bg-gray-200' : 'bg-gray-300'
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
