'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/helpers';

export default function ProductReviews({
  reviews = [],
  autoPlay = false,
  autoPlayInterval = 3000,
  allowHalf = false,
}) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  const length = reviews.length;

  // The formula always maps correctly into the range 0 -> length-1
  const safeIndex = useCallback((i) => ((i % length) + length) % length, [length]);

  const next = useCallback(() => {
    if (!length) return;
    setIndex((p) => safeIndex(p + 1));
  }, [length, safeIndex]);

  const prev = useCallback(() => {
    if (!length) return;
    setIndex((p) => safeIndex(p - 1));
  }, [length, safeIndex]);

  // Optional autoplay (default disabled)
  useEffect(() => {
    if (!autoPlay || length <= 1) return;
    const t = setInterval(next, autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay, length, next, autoPlayInterval]);

  if (!length) return null;
  const review = reviews[index];

  const renderStars = (value) => {
    const full = Math.floor(value);
    const hasHalf = allowHalf && value - full >= 0.5;
    const total = 5;
    const items = [];
    for (let i = 0; i < total; i++) {
      const filled = i < full;
      const isHalf = hasHalf && i === full;
      items.push(
        <span key={i} className="relative inline-flex h-5 w-5" aria-hidden="true">
          {isHalf ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-yellow-400">
              <defs>
                <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {/* Outline star with half fill overlay */}
              <path d="M0 0h24v24H0z" fill="none" />
              <svg className="absolute inset-0 h-5 w-5">
                <path
                  d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.401 8.165L12 18.896l-7.335 3.865 1.401-8.165L.132 9.21l8.2-1.192L12 .587z"
                  className="fill-current text-gray-300 dark:text-gray-600"
                />
              </svg>
              <svg className="absolute inset-0 h-5 w-5" style={{ fill: 'url(#half-fill)' }}>
                <path
                  d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.401 8.165L12 18.896l-7.335 3.865 1.401-8.165L.132 9.21l8.2-1.192L12 .587z"
                  className="fill-current text-yellow-400"
                />
              </svg>
            </svg>
          ) : (
            <Star
              className={`h-5 w-5 ${
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          )}
        </span>
      );
    }
    return items;
  };

  return (
    <section
      ref={containerRef}
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Product reviews"
      tabIndex={0}
      aria-live={autoPlay ? 'off' : 'polite'}
    >
      {/* Controls + card in a row to avoid overlap */}
      <div className="flex items-stretch gap-3 sm:gap-4">
        <div className="flex items-center">
          <button
            onClick={prev}
            aria-label="Previous review"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
            <div className="relative w-full max-w-none rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-900 sm:p-6">
              <div
                key={review._id}
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${length}`}
              >
                <div className="mb-4 flex items-center">
                  <img
                    src={review.user?.image || '/avatars/default-avatar.jpg'}
                    alt={review.user?.name ? `${review.user.name}'s avatar` : 'User avatar'}
                    className="h-12 w-12 rounded-full border-2 border-primary-600 object-cover dark:border-primary-400"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="ml-3 min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(review.updatedAt)}</p>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                  {review.title}
                </h3>

                <div
                  className="mb-3 flex items-center"
                  role="img"
                  aria-label={`Rating ${review.rating} out of 5`}
                >
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {Number(review.rating).toFixed(1)} / 5
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            </div>

          <div
            className="mt-3 flex justify-center space-x-2 sm:mt-4"
            role="tablist"
            aria-label="Review slides"
          >
            {reviews.map((_, i) => {
              const selected = i === index;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Go to review ${i + 1}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    selected ? 'bg-gray-800 dark:bg-gray-200' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={next}
            aria-label="Next review"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
