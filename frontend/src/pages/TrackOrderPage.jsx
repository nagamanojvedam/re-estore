import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { orderService } from '../services/orderService';
import { LoadingScreen } from '../components/common/Spinner';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');

  const { data, isLoading, refetch } = useQuery(
    ['track'],
    () => orderService.getOrderByNumber(orderNumber),
    {
      enabled: false,
      retry: false,
    },
  );

  const handleTrack = () => {
    if (!orderNumber.trim()) return;

    refetch();
  };

  const order = data?.order;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <section className="section-padding">
        <div className="container-custom max-w-lg mx-auto text-center">
          <h1
            className="text-3xl font-bold mb-6 
              text-gray-800 dark:text-gray-100"
          >
            Track Your Order
          </h1>
          {/* Input */}
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Enter Order ID"
            className="w-full px-4 py-3 rounded-lg border 
              border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
          />
          {/* Button */}
          <button
            onClick={handleTrack}
            className="w-full py-3 rounded-lg font-semibold
              bg-primary-600 hover:bg-primary-700 
              text-white shadow-md
              transition-all"
          >
            Track Order
          </button>

          {isLoading && <LoadingScreen message="Loading order..." />}

          {/* Order Details */}
          {order && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 p-6 rounded-lg shadow-lg 
                bg-white dark:bg-gray-800 
                text-gray-800 dark:text-gray-100
                text-left border border-gray-200 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-700 space-y-2"
            >
              <h2 className="text-xl font-bold mb-4 text-primary-600 dark:text-primary-400">
                Order Details
              </h2>

              <p>
                <span className="font-semibold">Order Number:</span>{' '}
                {order.orderNumber}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p>
                <span className="font-semibold">Placed On:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.product.name} × {item.quantity} - ${item.price}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3">
                <span className="font-semibold">Total Amount:</span> $
                {order.totalAmount}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-1">Shipping Address:</h3>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
