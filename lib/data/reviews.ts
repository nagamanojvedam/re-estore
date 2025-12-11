'use server';

import connectDB from '@/lib/utils/db';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export async function getReviewsByProductId(productId: string) {
  try {
    await connectDB();


    
    // Mongoose isValid check?
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return [];
    }

    const reviews = await Review.find({ product: productId })
      .select('_id comment rating title updatedAt user')
      .populate('user', '_id name email')
      .lean();

    return JSON.parse(JSON.stringify(reviews));
  } catch (err: any) {
    console.error(`Error in getReviewsByProductId: ${err.message}`);
    return [];
  }
}

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import config from '@/lib/utils/config';
import UserProduct from '@/models/UserProduct';

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, config.jwt.secret);
    return decoded.id || decoded._id || decoded.user?._id;
  } catch (err) {
    return null;
  }
}

export async function getUserReview(productId: string) {
  try {
    await connectDB();
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const review = await Review.findOne({ product: productId, user: userId }).lean();
    if (!review) return null;
    return JSON.parse(JSON.stringify(review));
  } catch (err) {
    console.error(err);
    return null;
  }
}

import Product from '@/models/Product';

async function calculateStats(productId: string, session: any) {
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
}

export async function upsertReview(data: { productId: string; rating: number; title: string; comment: string }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    const { productId, rating, title, comment } = data;

    const review = await Review.findOneAndUpdate(
      { product: productId, user: userId },
      { 
        rating, title, comment, user: userId, product: productId, 
        isActive: true, 
        updatedAt: new Date() 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, session }
    ).lean();

    // Recalculate stats
    await calculateStats(productId, session);

    // Update UserProduct
    await UserProduct.findOneAndUpdate(
      { user: userId, product: productId },
      { isReviewed: true },
      { upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return JSON.parse(JSON.stringify(review));
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err.message || 'Failed to submit review');
  }
}

export async function deleteReview(productId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    const review = await Review.findOneAndUpdate(
       { product: productId, user: userId },
       { isActive: false },
       { new: true, session }
    );

    if (!review) throw new Error('Review not found');

    // Recalculate stats - The DELETE api logic did partial update ($inc), but aggregation is safer/cleaner reuse.
    // The DELETE route logic: $inc count -1, sum -rating.
    // The POST route logic: Aggregation.
    // Let's use Aggregation for consistency. Since we soft deleted (isActive=false), Aggregation (match isActive=true) will handle it correctly.
    await calculateStats(productId, session);

    // Update UserProduct
    await UserProduct.findOneAndUpdate(
      { user: userId, product: productId },
      { isReviewed: false },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err.message || 'Failed to delete review');
  }
}
