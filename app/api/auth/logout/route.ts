import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import RefreshToken from '@/models/RefreshToken';

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
       Revoke refresh token if exists
    ---------------------------------------------- */
    await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });

    const response = NextResponse.json({
      status: 'success',
      message: 'Logout successful',
    });

    // Clear cookies
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');

    return response;
  } catch (err: any) {
    console.error('POST /api/auth/logout error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
