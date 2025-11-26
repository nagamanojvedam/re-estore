import { NextResponse } from 'next/server';
import ApiError from '@/lib/utils/ApiError';

/**
 * Role-based authorization middleware for Next.js
 * Example: authorize("admin")
 */
export const authorize = (...allowedRoles: string[]) => {
  return (user: any) => {
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { status: 'error', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // authorized
  };
};
