'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { HeartIcon, MinusIcon, PlusIcon, ShareIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function ProductActions({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlist.some((item) => item.productId._id === id)
  );

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    const itemToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      stock: product.stock,
      quantity,
    };

    addItem(itemToAdd);

    setQuantity(1);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (!isWishlisted) {
      await addToWishlist(product._id);
      setIsWishlisted(true);
    } else {
      await removeFromWishlist(product._id);
      setIsWishlisted(false);
    }
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setOpen(false);
      toast.success('Product link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  return (
    <>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <label className="text-md mb-2 block font-medium text-gray-500 dark:text-gray-300">
            Quantity
          </label>
          <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="rounded p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] px-4 py-2 text-center text-lg font-medium text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="rounded p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {product.stock <= 10 && product.stock > 0 && (
          <div className="text-sm text-orange-600 dark:text-orange-400">
            Only {product.stock} left in stock!
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="btn-primary flex flex-1 items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`rounded-lg border-2 p-3 transition-all ${
            isWishlisted
              ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              : 'border-gray-300 text-gray-600 hover:border-red-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-red-600'
          }`}
        >
          {!isWishlisted ? (
            <HeartIcon className="h-6 w-6" />
          ) : (
            <HeartIcon className="h-6 w-6 fill-red-700 stroke-red-700" />
          )}
        </button>

        <div className="relative inline-block">
          {/* Share button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border-2 border-gray-300 p-3 text-gray-600 transition-all hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
          >
            <ShareIcon className="h-6 w-6" />
          </button>

          {/* Tooltip popup */}
          {open && (
            <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border bg-white p-3 shadow-lg dark:bg-gray-900">
              <p className="truncate p-2 text-sm text-gray-600 dark:text-gray-400">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </p>
              <button
                onClick={handleShare}
                className="mt-2 w-full rounded bg-gray-800 px-3 py-2 text-sm text-white transition hover:bg-gray-700"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductActions;
