import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { formatPrice } from '@/lib/utils/helpers';

function WishlistItem({ item }) {
  const { removeFromWishlist } = useWishlist();

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      {/* Left Section: Product Image + Info */}
      <div className="flex items-center space-x-4">
        <Link to={`/product/${item._id}`}>
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
          />
        </Link>
        <div>
          <Link
            to={`/product/${item._id}`}
            className="text-lg font-medium text-gray-900 hover:underline dark:text-white"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{formatPrice(item.price)}</p>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-3">
        <Link to={`/product/${item._id}`} className="btn-primary px-3 py-1 text-sm">
          View
        </Link>
        <button
          onClick={() => removeFromWishlist(item._id)}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}

export default WishlistItem;
