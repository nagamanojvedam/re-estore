import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Review from '@/models/Review';
import mongoose from 'mongoose';

interface Params {
  params: {
    productId: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await db();

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ status: 'error', message: 'Invalid productId' }, { status: 400 });
    }

    const reviews = await Review.find({ product: productId })
      .select('_id comment rating title updatedAt user')
      .populate('user', '_id name email')
      .lean();

    return NextResponse.json({
      status: 'success',
      data: { reviews },
    });
  } catch (err: any) {
    console.error('GET /api/reviews/[productId] error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
