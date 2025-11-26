// app/api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await db();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);

    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name price category')
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
    console.error('GET /api/orders error:', err.message);

    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
