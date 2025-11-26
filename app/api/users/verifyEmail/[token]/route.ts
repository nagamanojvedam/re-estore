import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/utils/jwt';

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await db();
    const { token } = params;

    if (!token) {
      return NextResponse.json({ status: 'error', message: 'Token is required' }, { status: 400 });
    }

    // Verify JWT
    const decoded: any = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: { isEmailVerified: true } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (err: any) {
    console.error('Email verification error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message ?? 'Invalid or expired verification link',
      },
      { status: 400 }
    );
  }
}
