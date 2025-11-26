import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware/auth';

/* -----------------------------
   GET: Fetch user wishlist
------------------------------ */
export async function GET(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const currentUser = await User.findById(user._id)
      .select('-password -__v')
      .populate('wishlist.productId', 'name price images category');

    if (!currentUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: { wishlist: currentUser.wishlist },
    });
  } catch (err: any) {
    console.error('GET /api/users/wishlist error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

/* -----------------------------
   DELETE: Clear wishlist
------------------------------ */
export async function DELETE(req: NextRequest) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { wishlist: [] } },
      { new: true }
    ).select('wishlist');

    if (!updatedUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Wishlist cleared successfully',
      data: { wishlist: updatedUser.wishlist },
    });
  } catch (err: any) {
    console.error('DELETE /api/users/wishlist error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
