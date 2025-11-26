import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { authMiddleware } from '@/lib/middleware/auth';
import { generateAuthTokens } from '@/lib/utils/jwt';

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    /* ---------------------------------------------
       1️⃣ Authentication required
    ---------------------------------------------- */
    const { user, error } = await authMiddleware(req);
    if (error) return error;

    /* ---------------------------------------------
       2️⃣ Validate request body
    ---------------------------------------------- */
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'All password fields are required',
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'New password and confirm password do not match',
        },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       3️⃣ Find user including password
    ---------------------------------------------- */
    const foundUser = await User.findById(user._id).select('+password');

    if (!foundUser || !(await foundUser.isPasswordMatch(currentPassword))) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid current password' },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       4️⃣ Update password
          (pre-save hook will hash automatically)
    ---------------------------------------------- */
    foundUser.password = newPassword;
    await foundUser.save();

    /* ---------------------------------------------
       5️⃣ Generate new auth tokens
    ---------------------------------------------- */
    const tokens = await generateAuthTokens(foundUser);

    /* ---------------------------------------------
       6️⃣ Store new refresh token
    ---------------------------------------------- */
    await RefreshToken.create({
      token: tokens.refresh.token,
      user: foundUser._id,
      expires: tokens.refresh.expires,
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Password updated successfully',
        data: { tokens },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('PATCH /api/auth/update-password error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
