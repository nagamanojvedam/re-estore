import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import UserProduct from '@/models/UserProduct';
import { authMiddleware } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const skip = (page - 1) * limit;

    const filter = { user: user._id };

    const [products, total] = await Promise.all([
      UserProduct.find(filter)
        .populate('product')
        .sort({ createdAt: -1, _id: 1 })
        .skip(skip)
        .limit(limit),

      UserProduct.countDocuments(filter),
    ]);

    return NextResponse.json({
      status: 'success',
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err: any) {
    console.error('GET /api/user-products/my error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
