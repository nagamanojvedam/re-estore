import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Product from '@/models/Product';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware/auth';

/* -------------------------------------------
   ADD to Wishlist → POST /api/users/wishlist/:productId
-------------------------------------------- */
export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { productId } = params;

    // Validate product exists
    const productExists = await Product.exists({ _id: productId, isActive: true });
    if (!productExists) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    const alreadyExists = currentUser.wishlist.some(
      (item) => item.productId.toString() === productId
    );

    if (!alreadyExists) {
      currentUser.wishlist.push({ productId });
      await currentUser.save();
    }

    await currentUser.populate('wishlist.productId', 'name price images category');

    return NextResponse.json({
      status: 'success',
      message: 'Product added to wishlist',
      data: { wishlist: currentUser.wishlist },
    });
  } catch (err: any) {
    console.error('POST /wishlist error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

/* -------------------------------------------
   REMOVE From Wishlist → DELETE /api/users/wishlist/:productId
-------------------------------------------- */
export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { productId } = params;

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    currentUser.wishlist = currentUser.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );

    await currentUser.save();
    await currentUser.populate('wishlist.productId', 'name price images category');

    return NextResponse.json({
      status: 'success',
      message: 'Product removed from wishlist',
      data: { wishlist: currentUser.wishlist },
    });
  } catch (err: any) {
    console.error('DELETE /wishlist error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
