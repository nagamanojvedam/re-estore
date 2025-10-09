import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // v2 outline icon
import { MotionConfig, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingScreen } from '../components/common/Spinner';
import { orderService } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/helpers';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');

  const {
    data,
    isPending: isLoading,
    isError,
    status,
    refetch,
  } = useQuery({
    queryKey: ['track', { orderNumber }],
    queryFn: () => orderService.getOrderByNumber(orderNumber.trim()),
    enabled: false,
    retry: false,
  });

  const order = data?.order;

  const canSubmit = useMemo(
    () => orderNumber.trim().length > 0 && !isLoading,
    [orderNumber, isLoading],
  );

  const handleSubmit = e => {
    e?.preventDefault();
    if (!orderNumber.trim() || isLoading) return;
    refetch();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <section className="section-padding">
          <div className="container-custom max-w-lg mx-auto">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Track Your Order
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the order ID from the confirmation email to view status
                and details.
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              aria-busy={isLoading}
              className="space-y-3"
            >
              <label
                htmlFor="order-id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Order ID
              </label>
              <div className="relative">
                <input
                  id="order-id"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="e.g. ORD-123456"
                  disabled={isLoading}
                  className="w-full pr-12 pl-4 py-3 rounded-lg border 
                    border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-describedby="order-id-help"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    type="submit"
                    onClick={() => handleSubmit()}
                    disabled={!canSubmit}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                      bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400
                      text-white text-sm font-semibold shadow-sm transition
                      focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  >
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    Track
                  </button>
                </div>
              </div>
              <p
                id="order-id-help"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Case-sensitive. Includes any letters, numbers, or dashes. Press
                Enter to submit.
              </p>
            </form>

            {isLoading && (
              <div className="mt-6">
                <LoadingScreen message="Fetching order details..." />
              </div>
            )}

            {!isLoading && isError && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200"
              >
                <p className="font-semibold">Unable to find this order.</p>
                <p className="text-sm mt-1">
                  Please confirm the ID and try again. If the issue persists,
                  contact support.
                </p>
              </div>
            )}

            {!isLoading && status === 'success' && !order && (
              <div className="mt-6 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 p-4 text-amber-900 dark:text-amber-100">
                No data returned. The order may be archived or inaccessible.
              </div>
            )}

            {order && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 p-6 rounded-lg shadow-lg 
                  bg-white dark:bg-gray-800 
                  text-gray-800 dark:text-gray-100
                  text-left border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      Order Details
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Updated information below
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                    aria-label={`Status: ${order.status}`}
                  >
                    {order.status}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Order Number
                    </dt>
                    <dd className="mt-1">{order.orderNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Placed On
                    </dt>
                    <dd className="mt-1">{formatDate(order.createdAt)}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Items</h3>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-lg font-bold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-1">Shipping Address</h3>
                  <address className="not-italic text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </address>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
