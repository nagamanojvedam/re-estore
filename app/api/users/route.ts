import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await db();

    // Require admin to view all users
    const { user, error } = await authMiddleware(req);
    if (error) return error;

    if (user.role !== 'admin') {
      return NextResponse.json({ status: 'error', message: 'Not authorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    return NextResponse.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err: any) {
    console.error('GET /api/users error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
