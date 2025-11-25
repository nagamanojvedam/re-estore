"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { orderService } from "@/lib/services/orderService";
import { productService } from "@/lib/services/productService";
import OrderCard from "@/components/dashboard/OrderCard";
import ProductCard from "@/components/dashboard/ProductCard";
import UserCard from "@/components/dashboard/UserCard";
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

import { useAuth } from "@/lib/hooks/useAuth";
import Pagination from "@/components/common/Pagination";

import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/common/Spinner";
import MessageCard from "@/components/dashboard/MessageCard";
import { messageService } from "@/lib/services/messageService";

export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Main content card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/25 p-8 text-center">
            {/* Icon with background */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <ShieldExclamationIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Title and message */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This page is restricted to administrators only. You need admin
              privileges to access the dashboard.
            </p>

            {/* User info if available */}
            {user && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserIcon className="h-4 w-4" />
                  <span>
                    Signed in as: {user.email || user.username || "User"}
                  </span>
                </div>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full">
                  Role: {user.role || "user"}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Go Back
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Return to Home
              </button>
            </div>

            {/* Contact admin option */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need admin access?{" "}
                <a
                  href="mailto:admin@yoursite.com"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {["orders", "products", "users", "messages"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-2 px-4 ${
              tab === item
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <span className="capitalize"> {item} </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "orders" && <OrdersTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "messages" && <MessagesTab />}
    </div>
  );
}

/* ---------------- Orders Tab ---------------- */
function OrdersTab() {
  const [page, setPage] = useState(1);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => orderService.getAllOrders({ page, limit: 5 }),
  });
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: orderService.updateOrderStatus,
  });

  if (isLoading) return <LoadingScreen message="Loading orders..." />;

  const { orders, pagination } = data;
  console.log("Pagination:", pagination);
  return (
    <div className="space-y-4">
      {orders?.map((order: any) => (
        <OrderCard
          key={order._id}
          order={order}
          updateStatusMutation={updateStatusMutation}
        />
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ---------------- Products Tab ---------------- */
function ProductsTab() {
  const [page, setPage] = useState(1);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ["adminProducts", page],
    queryFn: () => productService.getProducts({ page }),
  });

  const { mutate: toggleMutation } = useMutation({
    mutationFn: productService.deleteProduct,
  });

  if (isLoading) return <LoadingScreen message="Loading products..." />;

  const { products, pagination } = data;

  const handlePageChange = (newPage: number) => {
    // Handle page change logic here
    setPage(newPage);
  };

  return (
    <div className="grid gap-4">
      {products?.map((product: any) => (
        <ProductCard
          key={product._id}
          product={product}
          toggleMutation={toggleMutation}
        />
      ))}
      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            showInfo={true}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ---------------- Users Tab ---------------- */
function UsersTab() {
  const [page, setPage] = useState(1);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["adminUsers", page],
    queryFn: () => authService.getAllUsers({ page, limit: 5 }),
  });

  if (isLoading) return <LoadingScreen message="Loading users..." />;

  const { users, pagination } = data;

  // Filter out admin users
  const regularUsers = users?.filter((u: any) => u.role === "user") || [];

  return (
    <div className="space-y-4">
      {regularUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </motion.div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [page, setPage] = useState(1);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ["adminMessages", page],
    queryFn: () => messageService.getAllMessages({ page, limit: 5 }),
  });

  if (isLoading) return <LoadingScreen message="Loading orders..." />;

  const { messages, pagination } = data;
  return (
    <div className="space-y-4">
      {messages?.map((message: any) => (
        <MessageCard key={message._id} message={message} page={page} />
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage: number) => setPage(newPage)}
            showInfo={true}
          />
        </motion.div>
      )}
    </div>
  );
}
