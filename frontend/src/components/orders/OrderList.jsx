import { motion } from 'framer-motion';
import OrderItem from './OrderItem';
import { Link } from 'react-router-dom';

function OrderList({ orders, loading, error }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Orders
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || 'Something went wrong while loading your orders.'}
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Orders Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders
          here.
        </p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OrderItem order={order} />
        </motion.div>
      ))}
    </div>
  );
}

export default OrderList;
