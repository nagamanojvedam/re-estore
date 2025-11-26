import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Order from '@/models/Order';
// Optionally import auth if needed:
// import { authMiddleware } from "@/lib/middleware/auth";

interface Params {
  params: {
    orderNumber: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await db();

    const { orderNumber } = params;

    const order = await Order.findOne({ orderNumber }).populate(
      'items.product',
      'name price category images'
    );

    if (!order) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: { order },
    });
  } catch (err: any) {
    console.error(`GET /api/orders/by-number/${params.orderNumber} error:`, err.message);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
