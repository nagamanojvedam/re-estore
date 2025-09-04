import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';
import { useMutation, useQueryClient } from 'react-query';

function ProductReviewCard({ item, page }) {
  const [openReview, setOpenReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
  });
  const queryClient = useQueryClient();

  const { product } = item;

  const mutation = useMutation({
    mutationFn: reviewData => reviewService.addOrUpdate(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts', page]);

      toast.success('Review added!');
      setReviewForm({ rating: 0, title: '', comment: '' });
      setOpenReview(false);
    },

    onError: () => {
      toast.error('Failed to add review!');
    },
  });

  const handleReviewChange = useCallback(data => {
    setReviewForm(prev => ({
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
    mutation.mutate({ ...reviewForm, productId: product._id });
  }, [mutation, reviewForm, product._id]);

  const handleReviewToggle = useCallback(() => {
    setOpenReview(prev => !prev);
  }, []);

  return (
    <motion.li
      key={item._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-4"
      role="listitem"
      aria-label={product?.name || 'Product'}
    >
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <img
          src={product.images?.[0]}
          alt={product.name || 'Product image'}
          className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          loading="lazy"
          decoding="async"
        />

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
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
                {openReview
                  ? 'Close Review'
                  : item.isReviewed
                    ? 'Update Review'
                    : 'Add Review'}
              </button>
              {item.isReviewed && (
                <button
                  className="btn btn-danger-outline"
                  onClick={() =>
                    toast.error('Delete review not implemented yet')
                  }
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
              className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3"
            >
              <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {item.isReviewed ? 'Update Review' : 'Add Review'}
              </h3>

              {/* Star Rating */}
              <div
                role="radiogroup"
                aria-label="Rating"
                className="flex space-x-1 mb-3"
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleReviewChange({ rating: star })}
                    role="radio"
                    aria-checked={reviewForm.rating === star}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    {reviewForm.rating >= star ? (
                      <StarSolid className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <StarOutline className="w-6 h-6 text-gray-300 dark:text-gray-600" />
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
                onChange={e => handleReviewChange({ title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg mb-2 text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
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
                onChange={e => handleReviewChange({ comment: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg mb-3 text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                rows={3}
              />

              {/* Submit Button */}
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900"
                onClick={handleSubmitReview}
              >
                {item.isReviewed ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default ProductReviewCard;
