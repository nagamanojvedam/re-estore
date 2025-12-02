
import Link from 'next/link';
import OrderItem from './OrderItem';

function OrderList({ orders }) {

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
          <OrderItem order={order} />
        </div>
      ))}
    </div>
  );
}

export default OrderList;
