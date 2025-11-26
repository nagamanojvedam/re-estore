
import Link from 'next/link';
import OrderItem from './OrderItem';

function OrderList({ orders, loading, error, queryKey }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex space-x-4">
                    <div className="h-16 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
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
      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-12 w-12 text-red-600 dark:text-red-400"
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
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
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

      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-12 w-12 text-gray-400 dark:text-gray-600"
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
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Orders Yet</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          You haven&apos;t placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <div
          key={order._id}
        >
          <OrderItem order={order} queryKey={queryKey} />
        </div>
      ))}
    </div>
  );
}

export default OrderList;
