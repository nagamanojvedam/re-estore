import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';
import { verifyToken, generateAuthTokens } from '@/lib/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { status: 'error', message: 'Refresh token required' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       Verify token & decode
    ---------------------------------------------- */
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    if (decoded.type !== 'refresh') {
      return NextResponse.json({ status: 'error', message: 'Invalid token type' }, { status: 401 });
    }

    /* ---------------------------------------------
       Check token existence and revocation
    ---------------------------------------------- */
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false,
    });

    if (!tokenDoc) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Refresh token not found or revoked',
        },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       Fetch user associated with token
    ---------------------------------------------- */
    const user = await User.findById(decoded.sub);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { status: 'error', message: 'User not found or inactive' },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       Generate new tokens
    ---------------------------------------------- */
    const tokens = await generateAuthTokens(user);

    /* ---------------------------------------------
       Revoke old refresh token (Rotation)
    ---------------------------------------------- */
    tokenDoc.revoked = true;
    await tokenDoc.save();

    /* ---------------------------------------------
       Save the new refresh token
    ---------------------------------------------- */
    await RefreshToken.create({
      token: tokens.refresh.token,
      user: user._id,
      expires: tokens.refresh.expires!,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: { tokens },
    });
  } catch (err: any) {
    console.error('POST /api/auth/refresh error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Invalid refresh token',
      },
      { status: 401 }
    );
  }
}
