import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    return NextResponse.json({
      status: 'success',
      data: { user },
    });
  } catch (err: any) {
    console.error('GET /api/users/me error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const updates = await req.json();

    // prevent updating restricted fields
    delete updates.password;
    delete updates.role;
    delete updates.email; // optional: allow only through special flow

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -__v');

    if (!updatedUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  } catch (err: any) {
    console.error('PATCH /api/users/me error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
