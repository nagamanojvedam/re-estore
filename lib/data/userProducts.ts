'use server';

import connectDB from '@/lib/utils/db';
import UserProduct from '@/models/UserProduct';

export async function getUserProducts(params: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const filter = { user: params.userId };

    const [products, total] = await Promise.all([
      UserProduct.find(filter)
        .populate('product')
        .sort({ createdAt: -1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      UserProduct.countDocuments(filter),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getUserProducts: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch user products');
  }
}
