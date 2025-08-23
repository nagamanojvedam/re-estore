import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '@hooks/useCart';
import { useAuth } from '@hooks/useAuth';
import { useWishlist } from '@hooks/useWishlist';
import toast from 'react-hot-toast';
import clsx from 'clsx';

function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlist.some(item => item.productId._id === product._id),
  );

  const randomImageIndex = Math.floor(Math.random() * product.images.length);

  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    const itemToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[randomImageIndex],
      stock: product.stock,
      quantity: 1,
    };

    addItem(itemToAdd);
  };

  const handleWishlistToggle = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(product._id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(product._id);
      setIsWishlisted(true);
    }

    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = rating => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  useEffect(() => {
    setIsWishlisted(wishlist.some(item => item.productId._id === product._id));
  }, [wishlist, product._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="card-interactive overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Skeleton Loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}

            {/* Product Image */}
            <img
              src={
                product.images?.[randomImageIndex] || '/placeholder-product.jpg'
              }
              alt={product.name}
              className={clsx(
                'lazy-image w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105',
                imageLoaded ? 'loaded' : 'loading',
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Just Image */}
            {/* <img
              src={
                product.images?.[randomImageIndex] || '/placeholder-product.jpg'
              }
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105`}
            /> */}

            {/* Stock Badge */}
            {product.stock <= 0 && (
              <div className="absolute top-2 left-2">
                <span className="badge-danger">Out of Stock</span>
              </div>
            )}

            {/* Discount Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-2 right-2">
                <span className="badge bg-red-500 text-white">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )}
                  % OFF
                </span>
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center transition-opacity duration-200">
              <div className="flex space-x-2">
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  aria-label={
                    isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                  }
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add to cart"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                </button>

                <button
                  className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="Quick view"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {/* {product.ratings?.count > 0 && ( */}

            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">{renderStars(product.ratings.average)}</div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({product.ratings.count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
              </div>

              {/* Stock Count */}
              <span
                className={`text-xs ${
                  product.stock <= 5
                    ? 'text-red-500'
                    : product.stock <= 10
                      ? 'text-yellow-500'
                      : 'text-green-500'
                }`}
              >
                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
              </span>
            </div>

            {/* Quick Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full mt-3 btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
