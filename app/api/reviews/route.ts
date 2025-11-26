import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import db from '@/lib/utils/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import UserProduct from '@/models/UserProduct';
import { authMiddleware } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await db();

    const { user, error } = await authMiddleware(req);
    if (error) return error;

    const { productId, rating, title, comment } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ status: 'error', message: 'Invalid productId' }, { status: 400 });
    }

    // Upsert review (create or update)
    const review = await Review.findOneAndUpdate(
      {
        product: productId,
        user: user._id,
      },
      {
        $set: {
          rating,
          title,
          comment,
          isActive: true,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session,
      }
    );

    // Recalculate product review stats
    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$product',
          average: { $avg: '$rating' },
          count: { $sum: 1 },
          sum: { $sum: '$rating' },
        },
      },
    ]).session(session);

    if (stats.length) {
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            'ratings.average': stats[0].average,
            'ratings.count': stats[0].count,
            'ratings.sum': stats[0].sum,
          },
        },
        { session }
      );
    } else {
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            'ratings.average': 0,
            'ratings.count': 0,
            'ratings.sum': 0,
          },
        },
        { session }
      );
    }

    // Track review status in UserProduct
    await UserProduct.findOneAndUpdate(
      { user: user._id, product: productId },
      { $set: { isReviewed: true } },
      { upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      status: 'success',
      message: 'Review saved',
      data: { review },
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();

    console.error('POST /api/reviews error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}
