import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);

    const filter: any = { user: user._id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name price category images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err: any) {
    console.error('GET /api/orders/my-orders error:', err.message);

    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
