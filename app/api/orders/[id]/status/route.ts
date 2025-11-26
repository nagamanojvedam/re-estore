import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Order from '@/models/Order';
import UserProduct from '@/models/UserProduct';
import { allowedTransitions } from '@/lib/constants/orderStatus';
import { authMiddleware } from '@/lib/middleware/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await db();

    const { user: loggedUser, error } = await authMiddleware(req);
    if (error) return error;

    if (loggedUser.role !== 'admin') {
      return NextResponse.json(
        { status: 'error', message: 'Only admin can update order status' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    const currentStatus = order.status;
    const validNextStates = allowedTransitions[currentStatus] || [];

    if (!validNextStates.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Invalid transition: ${currentStatus} → ${status}`,
        },
        { status: 400 }
      );
    }

    order.status = status;
    await order.save();

    // Update review eligibility
    if (status === 'delivered') {
      for (const item of order.items) {
        await UserProduct.findOneAndUpdate(
          {
            user: order.user,
            product: item.product,
          },
          {
            $set: { lastPurchasedAt: new Date() },
            $inc: { purchaseCount: 1 },
          },
          { upsert: true, new: true }
        );
      }
    }

    await order.populate([
      { path: 'user', select: 'name email' },
      { path: 'items.product', select: 'name price category images' },
    ]);

    return NextResponse.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (err: any) {
    console.error(`PATCH /api/orders/${params.id}/status error:`, err.message);

    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
