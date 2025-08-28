import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '@hooks/useWishlist';
import WishlistItem from '@components/wishlist/WishlistItem';

function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your wishlist is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save items you love for later. Start browsing and add them to your
            wishlist!
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </motion.div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlist.map((item, index) => {
            const { productId: product } = item;
            return (
              <motion.div
                key={index + 1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WishlistItem item={product} />
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: wishlist.length * 0.1 + 0.2 }}
          className="mt-8 flex items-center justify-between"
        >
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>

          {wishlist.length > 1 && (
            <button
              onClick={() => {
                clearWishlist();
              }}
              className="btn-secondary"
            >
              Clear Wishlist
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default WishlistPage;
