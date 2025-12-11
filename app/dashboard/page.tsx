'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import OrderCard from '@/components/dashboard/OrderCard';
import ProductCard from '@/components/dashboard/ProductCard';
import UserCard from '@/components/dashboard/UserCard';
import { ArrowLeftIcon, ShieldExclamationIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/hooks/useAuth';
import Pagination from '@/components/common/Pagination';

import { LoadingScreen } from '@/components/common/Spinner';
import MessageCard from '@/components/dashboard/MessageCard';

// Server Actions
import { getOrders, updateOrderStatus } from '@/lib/data/orders';
import { getProducts, deleteProduct } from '@/lib/data/products';
import { getUsers } from '@/lib/data/users';
import { getMessages } from '@/lib/data/messages';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Main content card */}
          <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800 dark:shadow-gray-900/25">
            {/* Icon with background */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <ShieldExclamationIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Title and message */}
            <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Access Restricted
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              This page is restricted to administrators only. You need admin privileges to access
              the dashboard.
            </p>

            {/* User info if available */}
            {user && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserIcon className="h-4 w-4" />
                  <span>Signed in as: {user.email || user.username || 'User'}</span>
                </div>
                <span className="mt-1 inline-block rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                  Role: {user.role || 'user'}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Go Back
              </button>

              <button
                onClick={() => router.push('/')}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
              >
                Return to Home
              </button>
            </div>

            {/* Contact admin option */}
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need admin access?{' '}
                <a
                  href="mailto:admin@yoursite.com"
                  className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>

          {/* Additional help text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Error Code: 403 - Forbidden Access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="mb-6 flex space-x-4 border-b">
        {['orders', 'products', 'users', 'messages'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 pb-2 ${
              tab === item
                ? 'border-b-2 border-blue-500 font-semibold text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="capitalize"> {item} </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'messages' && <MessagesTab />}
    </div>
  );
}

/* ---------------- Orders Tab ---------------- */
function OrdersTab() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['adminOrders', page],
    queryFn: () => getOrders({ page, limit: 5 }),
  });
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: (vars: {id: string, status: string}) => updateOrderStatus(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      toast.success('Order status updated');
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  if (isLoading) return <LoadingScreen message="Loading orders..." />;

  const { orders, pagination } = data || { orders: [], pagination: { pages: 0 } };
  return (
    <div className="space-y-4">
      {orders?.map((order: any) => (
        <OrderCard key={order._id} order={order} updateStatusMutation={updateStatusMutation} />
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- Products Tab ---------------- */
function ProductsTab() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['adminProducts', page],
    queryFn: () => getProducts({ page, limit: 5 }),
  });

  const { mutate: toggleMutation } = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product updated');
    },
    onError: (err) => {
        toast.error(err.message);
    }
  });

  if (isLoading) return <LoadingScreen message="Loading products..." />;

  const { products, pagination } = data || { products: [], pagination: { pages: 0 }};

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="grid gap-4">
      {products?.map((product: any) => (
        <ProductCard key={product._id} product={product} toggleMutation={toggleMutation} />
      ))}
      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- Users Tab ---------------- */
function UsersTab() {
  const [page, setPage] = useState(1);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => getUsers({ page, limit: 5 }),
  });

  if (isLoading) return <LoadingScreen message="Loading users..." />;

  const { users, pagination } = data || { users: [], pagination: { pages: 0  }};

  // Filter out admin users
  const regularUsers = users?.filter((u: any) => u.role === 'user') || [];

  return (
    <div className="space-y-4">
      {regularUsers.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p>No regular users found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {regularUsers.map((user: any) => (
            <UserCard key={user._id} user={user} page={page} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [page, setPage] = useState(1);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['adminMessages', page],
    queryFn: () => getMessages({ page, limit: 5 }),
  });

  if (isLoading) return <LoadingScreen message="Loading orders..." />;

  const { messages, pagination } = data || { messages: [], pagination: { pages: 0 }};
  return (
    <div className="space-y-4">
      {messages?.map((message: any) => (
        <MessageCard key={message._id} message={message} page={page} />
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
}
