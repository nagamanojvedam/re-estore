import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/middleware/auth';
import { allowedTransitions } from '@/lib/constants/orderStatus';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { id } = await params;

    console.log('id', id);

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    // User must own this order
    if (order.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized to cancel this order' },
        { status: 403 }
      );
    }

    const currentStatus = order.status;
    const validNextStates = allowedTransitions[currentStatus] || [];

    if (!validNextStates.includes('cancelled')) {
      return NextResponse.json(
        { status: 'error', message: 'This order cannot be cancelled at this stage' },
        { status: 400 }
      );
    }

    if (currentStatus === 'cancelled') {
      return NextResponse.json(
        { status: 'error', message: 'Order already cancelled' },
        { status: 400 }
      );
    }

    // Update order state
    order.status = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : 'failed';

    await order.save();

    return NextResponse.json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (err: any) {
    console.error(
      `Error at cancel order controller at /api/orders/cancelMyOrder route:`,
      err.message
    );

    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
