import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useWishlist } from '@hooks/useWishlist';

function WishlistItem({ item }) {
  const { removeFromWishlist } = useWishlist();

  return (
    <motion.div
      layout
      className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
    >
      {/* Left Section: Product Image + Info */}
      <div className="flex items-center space-x-4">
        <Link to={`/product/${item._id}`}>
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </Link>
        <div>
          <Link
            to={`/product/${item._id}`}
            className="text-lg font-medium text-gray-900 dark:text-white hover:underline"
          >
            {item.name}
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-3">
        <Link
          to={`/product/${item._id}`}
          className="btn-primary py-1 px-3 text-sm"
        >
          View
        </Link>
        <button
          onClick={() => removeFromWishlist(item._id)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
      </div>
    </motion.div>
  );
}

export default WishlistItem;
