import Pagination from '@/components/common/Pagination';
import OrderList from '@/components/orders/OrderList';

import Link from 'next/link';
import config from '@/lib/utils/config';
import { cookies } from 'next/headers';
import OrdersFilter from '@/components/orders/OrdersFilter';

async function OrdersPage({ searchParams }) {
  const queries = await searchParams;

  const { status = '', page = 1 } = queries;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(
    `${config.next.api.baseUrl}/orders/me?limit=5&status=${status}&page=${page}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { data: ordersData } = await res.json();
  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your order history</p>
          </div>

          {/* Filters and Search */}
          <OrdersFilter currentFilter={status} />

          {/* Orders List */}
          <div>
            <OrderList orders={orders} />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                allowedParams={['status', 'page']}
                href="/orders"
                showInfo={true}
              />
            </div>
          )}

          {/* Help Section */}
          <div className="card mt-12 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Need Help?</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Have questions about your orders? We&apos;re here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-outline">
                Contact Support
              </Link>
              <Link href="/returns" className="btn-secondary">
                Return Policy
              </Link>
              <Link href="/shipping" className="btn-secondary">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
