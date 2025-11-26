import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/utils/email';

export async function POST(req: NextRequest) {
  try {
    await db();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ status: 'error', message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    // IMPORTANT: Avoid leaking user existence
    if (!user) {
      return NextResponse.json({
        status: 'success',
        message: 'If this email exists in our system, a password reset link has been sent.',
      });
    }

    /* -------------------------------------------
       Generate Reset Token
    -------------------------------------------- */
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 12);

    user.resetToken = hashedResetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    /* -------------------------------------------
       Send Reset Email
    -------------------------------------------- */
    const resetLink = `/reset-password?token=${resetToken}&userId=${user._id}`;

    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      resetLink,
    });

    return NextResponse.json({
      status: 'success',
      message: 'If this email exists in our system, a password reset link has been sent.',
    });
  } catch (err: any) {
    console.error('POST /api/auth/forgot-password error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
