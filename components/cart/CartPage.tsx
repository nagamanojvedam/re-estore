'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import CartItem from '@/components/cart/CartItem';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils/helpers';

function CartPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Handle authentication required
      toast.error('Please login to proceed to checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Your cart is empty
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it
            up!
          </p>
          <Link href="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} showFullDetails={true} />
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Order Summary
                </h2>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {total >= 5000 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        '$10.00'
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(total * 0.08)}
                    </span>
                  </div>

                  {total < 5000 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Add {formatPrice(5000 - total)} more to get free shipping!
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatPrice(total + (total >= 5000 ? 0 : 1000) + total * 0.08)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={handleCheckout} className="btn-primary w-full">
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </button>

                  {items.length > 1 && (
                    <button onClick={clearCart} className="btn-secondary w-full">
                      Clear Cart
                    </button>
                  )}
                </div>

                {/* Security Badges */}
                <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
