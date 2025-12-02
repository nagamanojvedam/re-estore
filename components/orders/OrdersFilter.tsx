'use client';

import { ORDER_STATUSES } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';

const statusCounts = {
  all: 0,
  pending: 0, // These would come from API
  confirmed: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

const statusTabs = [
  { key: '', label: 'All Orders', count: statusCounts.all },
  {
    key: ORDER_STATUSES.PENDING,
    label: 'Pending',
    count: statusCounts.pending,
  },
  {
    key: ORDER_STATUSES.CONFIRMED,
    label: 'Confirmed',
    count: statusCounts.confirmed,
  },
  {
    key: ORDER_STATUSES.SHIPPED,
    label: 'Shipped',
    count: statusCounts.shipped,
  },
  {
    key: ORDER_STATUSES.DELIVERED,
    label: 'Delivered',
    count: statusCounts.delivered,
  },
  {
    key: ORDER_STATUSES.CANCELLED,
    label: 'Cancelled',
    count: statusCounts.cancelled,
  },
];

function OrdersFilter({ currentFilter }) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {statusTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(`/orders?status=${tab.key}`)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentFilter === tab.key
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs dark:bg-gray-600">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default OrdersFilter;
