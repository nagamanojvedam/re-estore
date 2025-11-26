'use client';

import { EyeIcon, HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import clsx from 'clsx';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/helpers';

function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlist.some((item) => item.productId._id === product._id)
  );

  const handleAddToCart = (e) => {
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
      image: product.images?.[0],
      stock: product.stock,
      quantity: 1,
    };

    addItem(itemToAdd);
  };

  const handleWishlistToggle = async (e) => {
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-current text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  useEffect(() => {
    setIsWishlisted(wishlist.some((item) => item.productId._id === product._id));
  }, [wishlist, product._id]);

  return (
    <div
      className="group"
    >
      <Link href={`/product/${product._id}`}>
        <div className="card-interactive overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Skeleton Loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
            )}

            {/* Product Image */}
            <img
              src={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className={clsx(
                'lazy-image h-full w-full object-cover transition-opacity duration-500 group-hover:scale-105',
                imageLoaded ? 'loaded' : 'loading'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Stock Badge */}
            {product.stock <= 0 && (
              <div className="absolute left-2 top-2">
                <span className="badge-danger">Out of Stock</span>
              </div>
            )}

            {/* Discount Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute right-2 top-2">
                <span className="badge bg-red-500 text-white">
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}
                  % OFF
                </span>
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 group-hover:flex">
              <div className="flex space-x-2">
                <button
                  onClick={handleWishlistToggle}
                  className="rounded-full bg-white p-2 text-gray-700 transition-colors hover:text-red-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-red-400"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="rounded-full bg-white p-2 text-gray-700 transition-colors hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-primary-400"
                  aria-label="Add to cart"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                </button>

                <button
                  className="rounded-full bg-white p-2 text-gray-700 transition-colors hover:text-primary-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-primary-400"
                  aria-label="Quick view"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <p className="mb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="mb-2 line-clamp-2 truncate font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {product.name}
            </h3>

            {/* Rating */}
            {/* {product.ratings?.count > 0 && ( */}

            <div className="mb-2 flex items-center space-x-1">
              <div className="flex">{renderStars(product.ratings.average)}</div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({product.ratings.count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                    {formatPrice(product.originalPrice)}
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
              className="btn btn-primary btn-sm mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
