import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { generateAuthTokens } from '@/lib/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ---------------------------------------------
       Parse Body
    ---------------------------------------------- */
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       Find user including password
    ---------------------------------------------- */
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordMatch(password))) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { status: 'error', message: 'Account is deactivated' },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       Generate Tokens
    ---------------------------------------------- */
    const tokens = await generateAuthTokens(user);

    /* ---------------------------------------------
       Save Refresh Token
    ---------------------------------------------- */
    await RefreshToken.create({
      token: tokens.refresh.token,
      user: user._id,
      expires: tokens.refresh.expires,
    });

    /* ---------------------------------------------
       Remove password before sending response
    ---------------------------------------------- */
    (user as any).password = undefined;

    const response = NextResponse.json({
      status: 'success',
      message: 'Login successful',
      data: { user, tokens },
    });

    // Set cookies
    response.cookies.set('token', tokens.access.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: tokens.access.expires,
      path: '/',
    });

    response.cookies.set('refreshToken', tokens.refresh.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: tokens.refresh.expires,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('POST /api/auth/login error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
