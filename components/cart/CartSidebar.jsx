'use client';

import React from 'react';

import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/hooks/useCart';
import { useRouter } from 'next/navigation';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils/helpers';

function CartSidebar() {
  const { isOpen, setCartOpen, items, total, itemCount, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  const handleViewCart = () => {
    setCartOpen(false);
    router.push('/cart');
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />

          {/* Sidebar */}
          <div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Shopping Cart
                </h2>
                <span className="badge-primary">{itemCount}</span>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close cart"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Add some products to get started
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push('/shop');
                    }}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 p-6 dark:border-gray-700">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Shipping Notice */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button onClick={handleCheckout} className="btn-primary w-full">
                    Checkout
                  </button>

                  <button onClick={handleViewCart} className="btn-secondary w-full">
                    View Cart
                  </button>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push('/shop');
                    }}
                    className="btn-ghost w-full text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Clear Cart */}
                {items.length > 1 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default CartSidebar;
