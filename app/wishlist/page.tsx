'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '@/lib/hooks/useWishlist';
import WishlistItem from '@/components/wishlist/WishlistItem';

function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const router = useRouter();

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div
          className="mx-auto max-w-md px-4 text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <HeartIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Your wishlist is empty
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Save items you love for later. Start browsing and add them to your wishlist!
          </p>
          <Link href="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div
          className="mb-8 flex items-center space-x-4"
        >
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlist</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlist.map((item, index) => {
            const { productId: product } = item;
            return (
              <div
                key={index + 1}
              >
                <WishlistItem item={product} />
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div
          className="mt-8 flex items-center justify-between"
        >
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeftIcon className="h-5 w-5" />
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
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
