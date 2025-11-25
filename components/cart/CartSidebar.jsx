"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/lib/hooks/useCart";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";
import { formatPrice } from "@/lib/utils/helpers";

function CartSidebar() {
  const { isOpen, setCartOpen, items, total, itemCount, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setCartOpen(false);
    router.push("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Shopping Cart
                </h2>
                <span className="badge-primary">{itemCount}</span>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBagIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/shop");
                    }}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
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
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary"
                  >
                    Checkout
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full btn-secondary"
                  >
                    View Cart
                  </button>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/shop");
                    }}
                    className="w-full btn-ghost text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Clear Cart */}
                {items.length > 1 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;
