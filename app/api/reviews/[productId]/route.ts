import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import db from '@/lib/utils/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import UserProduct from '@/models/UserProduct';
import { authMiddleware } from '@/lib/middleware/auth';

interface Params {
  params: {
    productId: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { productId } = params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ status: 'error', message: 'Invalid productId' }, { status: 400 });
    }

    const review = await Review.findOne({
      product: productId,
      user: user._id,
      isActive: true,
    });

    return NextResponse.json({
      status: 'success',
      data: { review: review || null },
    });
  } catch (err: any) {
    console.error('GET /api/reviews/my/[productId] error:', err.message);

    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { productId } = params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ status: 'error', message: 'Invalid productId' }, { status: 400 });
    }

    // Soft delete review
    const review = await Review.findOneAndUpdate(
      {
        product: productId,
        user: user._id,
        isActive: true,
      },
      {
        $set: { isActive: false },
      },
      {
        new: true,
        session,
      }
    );

    if (!review) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ status: 'error', message: 'Review not found' }, { status: 404 });
    }

    // Update product rating stats
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          'ratings.count': -1,
          'ratings.sum': -review.rating,
        },
      },
      { new: true, session }
    );

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    product.ratings.average =
      product.ratings.count > 0 ? product.ratings.sum / product.ratings.count : 0;

    await product.save({ session });

    // Update UserProduct review eligibility
    await UserProduct.findOneAndUpdate(
      { user: user._id, product: productId },
      { $set: { isReviewed: false } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();

    console.error(`DELETE /api/reviews/my/${params.productId} error:`, err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
