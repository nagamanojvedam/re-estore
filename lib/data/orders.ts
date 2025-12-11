'use server';

import connectDB from '@/lib/utils/db';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import config from '@/lib/utils/config';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (params.status) filter.status = params.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name price category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getOrders: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch orders');
  }
}

export async function getMyOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { user: user.id || user._id || user.user?._id };
    if (params.status) filter.status = params.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name price category images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getMyOrders: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch your orders');
  }
}

export async function updateOrderStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    return JSON.parse(JSON.stringify(order));
  } catch (err: any) {
    console.error(`Error in updateOrderStatus: ${err.message}`);
    throw new Error(err.message || 'Failed to update order status');
  }
}

export async function getOrderById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    await connectDB();
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name price category images')
      .lean();

    if (!order) return null;

    // Check authorization: Owner or Admin
    if (user.role !== 'admin' && String(order.user._id) !== String(user.id || user._id)) {
      throw new Error('Unauthorized');
    }

    return JSON.parse(JSON.stringify(order));
  } catch (err: any) {
    // console.error(`Error in getOrderById: ${err.message}`);
    // Don't log expected unauthorized as error? Or do.
    return null; // Return null on error for page to handle (404/redirect)
  }
}

export async function createOrder(data: any) {
  try {
    await connectDB();
    const newOrder = await Order.create(data);
    return JSON.parse(JSON.stringify(newOrder));
  } catch (err: any) {
    console.error(`Error in createOrder: ${err.message}`);
    throw new Error(err.message || 'Failed to create order');
  }
}
