import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    if (user.role !== 'admin') {
      return NextResponse.json(
        { status: 'error', message: 'Access denied: Admin only' },
        { status: 403 }
      );
    }

    const { id } = params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    existingUser.isActive = !existingUser.isActive;
    await existingUser.save();

    return NextResponse.json({
      status: 'success',
      message: `User ${existingUser.isActive ? 'Activated' : 'Deactivated'} successfully`,
      data: { user: existingUser },
    });
  } catch (err: any) {
    console.error('PATCH /api/users/toggle-active ERROR:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
