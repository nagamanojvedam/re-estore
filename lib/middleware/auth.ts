import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/utils/db';

export async function authMiddleware(req: Request) {
  await connectDB();

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ message: 'Access denied. No token provided.' }, { status: 401 }),
    };
  }

  try {
    // Decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Check token type
    if (decoded.type !== 'access') {
      return {
        user: null,
        error: NextResponse.json({ message: 'Invalid token type' }, { status: 401 }),
      };
    }

    // Find user
    const user = await User.findById(decoded.sub).select('+passwordChangedAt');

    if (!user || !user.isActive) {
      return {
        user: null,
        error: NextResponse.json({ message: 'User not found or inactive' }, { status: 401 }),
      };
    }

    // Password changed check
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);

      if (decoded.iat < passwordChangedTimestamp) {
        return {
          user: null,
          error: NextResponse.json(
            { message: 'Password changed. Please log in again.' },
            { status: 401 }
          ),
        };
      }
    }

    // Success → return user
    return { user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: NextResponse.json(
        {
          message:
            error instanceof jwt.JsonWebTokenError
              ? 'Invalid token'
              : error.message || 'Authentication failed',
        },
        { status: 401 }
      ),
    };
  }
}
