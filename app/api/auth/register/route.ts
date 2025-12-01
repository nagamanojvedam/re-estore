import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';

import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';

import { generateAuthTokens } from '@/lib/utils/jwt';
import { sendWelcomeEmail } from '@/lib/utils/email';

import jwt from 'jsonwebtoken';
import config from '@utils/config';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ----------------------------------------------------------
       1. Parse request body
    ----------------------------------------------------------- */
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------------
       2. Check for existing user
    ----------------------------------------------------------- */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User already exists with this email',
        },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------------
       3. Create the user
    ----------------------------------------------------------- */
    const user = await User.create({
      name,
      email,
      password,
    });

    /* ----------------------------------------------------------
       4. Generate tokens
    ----------------------------------------------------------- */
    const tokens = await generateAuthTokens(user);

    // Email verification token
    const verifyToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '15m' });

    /* ----------------------------------------------------------
       5. Save refresh token
    ----------------------------------------------------------- */
    await RefreshToken.create({
      token: tokens.refresh.token,
      user: user._id,
      expires: tokens.refresh.expires,
    });

    /* ----------------------------------------------------------
       6. Send welcome email
    ----------------------------------------------------------- */
    const baseUrl = '/';

    await sendWelcomeEmail({
      name: user.name,
      email: user.email,
      activationLink: `${baseUrl}/users/verifyEmail/${verifyToken}`,
      dashboardLink: `${baseUrl}/`,
      supportLink: `${baseUrl}/contact`,
      shopLink: `${baseUrl}/shop`,
      unsubscribeLink: `${baseUrl}/`,
    });

    /* ----------------------------------------------------------
       7. Respond with created user + tokens
    ----------------------------------------------------------- */
    const response = NextResponse.json(
      {
        status: 'success',
        message: 'User registered successfully',
        data: {
          user,
          tokens,
        },
      },
      { status: 201 }
    );

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
    console.error('POST /api/auth/register error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
