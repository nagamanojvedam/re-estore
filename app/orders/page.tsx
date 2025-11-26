'use client';

import Pagination from '@/components/common/Pagination';
import OrderList from '@/components/orders/OrderList';
import { orderService } from '@/lib/services/orderService';
import { ORDER_STATUSES } from '@/lib/utils/constants';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

function OrdersPage() {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 5,
  });

  const {
    data: ordersData,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getMyOrders(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: status === prev.status ? '' : status,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    // window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  const statusCounts = {
    all: pagination.total || 0,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your order history</p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusFilter(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filters.status === tab.key
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

          {/* Orders List */}
          <div>
            <OrderList
              orders={orders}
              loading={isLoading}
              error={error}
              queryKey={['orders', filters]}
            />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div
              className="mt-8"
            >
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}

          {/* Help Section */}
          <div
            className="card mt-12 p-6 text-center"
          >
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
