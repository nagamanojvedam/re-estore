import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest) {
  try {
    await db();

    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    if (!token || !userId) {
      return NextResponse.json({ status: 'error', message: 'Invalid reset link' }, { status: 400 });
    }

    const { password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { status: 'error', message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------
       Get User
    ---------------------------------------------------- */
    const user = await User.findById(userId).select('+resetToken +resetTokenExpires');

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid link or user' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------
       Check Token Expiration
    ---------------------------------------------------- */
    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      return NextResponse.json(
        { status: 'error', message: 'Reset token expired' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------
       Compare Token
    ---------------------------------------------------- */
    const isValid = await bcrypt.compare(token, user.resetToken as string);

    if (!isValid) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------
       Update Password + Reset Token Cleanup
    ---------------------------------------------------- */
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({
      status: 'success',
      message: 'Password updated successfully. Please log in.',
    });
  } catch (err: any) {
    console.error('PATCH /api/auth/reset-password error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
