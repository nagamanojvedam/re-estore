'use client';

import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils/helpers';

function ProductReviewCard({ item, page }) {
  const [openReview, setOpenReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { product } = item;

  const { mutate: addOrUpdateMutation } = useMutation({
    mutationFn: (reviewData) => reviewService.addOrUpdate(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts', page]);

      toast.success('Review added!');
      setOpenReview(false);
    },

    onError: () => {
      toast.error('Failed to add review!');
    },
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (productId) => reviewService.deleteReview(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts', page]);
      toast.success('Review deleted!');
    },
    onError: () => {
      toast.error('Failed to delete review!');
    },
  });

  const handleReviewChange = useCallback((data) => {
    setReviewForm((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { review } = await reviewService.getReview(item.product._id);

        setReviewForm({
          rating: review?.rating || 0,
          title: review?.title || '',
          comment: review?.comment || '',
        });
      } catch (err) {
        console.error(err);
        setReviewForm({ rating: 0, title: '', comment: '' });
      }
    };

    if (!item.isReviewed) setReviewForm({ rating: 0, title: '', comment: '' });
    else fetchReview();
  }, [item.product._id, item.user._id, item.isReviewed]);

  const handleSubmitReview = useCallback(async () => {
    if (!reviewForm.rating || !reviewForm.title || !reviewForm.comment) {
      toast.error('Please provide all required fields!');
      return;
    }
    addOrUpdateMutation({ ...reviewForm, productId: product._id });
  }, [addOrUpdateMutation, reviewForm, product._id]);

  const handleReviewToggle = useCallback(() => {
    setOpenReview((prev) => !prev);
  }, []);

  return (
    <li
      key={item._id}
      className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      role="listitem"
      aria-label={product?.name || 'Product'}
    >
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <img
          src={product.images?.[0]}
          alt={product.name || 'Product image'}
          className="h-32 w-32 rounded-lg border border-gray-200 bg-gray-50 object-cover dark:border-gray-700 dark:bg-gray-900"
          loading="lazy"
          decoding="async"
        />

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="cursor-pointer text-lg font-semibold text-gray-900 transition-all duration-200 hover:scale-[1.02] dark:text-gray-100"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                {product.name}
              </h2>
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {product.description}
              </p>

              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  Purchased:{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.purchaseCount}
                  </span>{' '}
                  times
                </p>
                <p>
                  Last Purchased:{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(item.lastPurchasedAt)}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleReviewToggle}
                className="btn btn-secondary"
                aria-expanded={openReview}
                aria-controls={`review-${product._id}`}
              >
                {openReview ? 'Close Review' : item.isReviewed ? 'Update Review' : 'Add Review'}
              </button>
              {item.isReviewed && (
                <button
                  className="btn btn-danger-outline"
                  onClick={() => deleteMutation(product._id)}
                >
                  Delete Review
                </button>
              )}
            </div>
          </div>

          {/* Review Form */}
          {/* {openReview && isLoadingReview && <ReviewFormSkeleton />} */}

          {openReview && (
            <div
              id={`review-${product._id}`}
              className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700"
            >
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.isReviewed ? 'Update Review' : 'Add Review'}
              </h3>

              {/* Star Rating */}
              <div role="radiogroup" aria-label="Rating" className="mb-3 flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleReviewChange({ rating: star })}
                    role="radio"
                    aria-checked={reviewForm.rating === star}
                    className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    {reviewForm.rating >= star ? (
                      <StarSolid className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Review Title */}
              <label className="sr-only" htmlFor={`title-${product._id}`}>
                Review title
              </label>
              <input
                id={`title-${product._id}`}
                type="text"
                placeholder="Review Title (max 50 chars)"
                maxLength={50}
                value={reviewForm.title}
                onChange={(e) => handleReviewChange({ title: e.target.value })}
                className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
              />

              {/* Review Comment */}
              <label className="sr-only" htmlFor={`comment-${product._id}`}>
                Review comment
              </label>
              <textarea
                id={`comment-${product._id}`}
                placeholder="Your review (max 1000 chars)"
                maxLength={1000}
                value={reviewForm.comment}
                onChange={(e) => handleReviewChange({ comment: e.target.value })}
                className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                rows={3}
              />

              {/* Submit Button */}
              <button
                className="w-full rounded-lg bg-blue-600 py-2 text-sm text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                onClick={handleSubmitReview}
              >
                {item.isReviewed ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProductReviewCard;
