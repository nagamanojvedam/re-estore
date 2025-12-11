'use server';

import Product from '@/models/Product';
import connectDB from '@/lib/utils/db'; 
// Check where specific aliases map to. Seen '@utils/db' in FeaturedProducts.tsx
import { SortOrder } from 'mongoose';

// Types for the parameters
export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  exclude?: string;
}

export async function getProducts(params: GetProductsParams) {
  try {
    await connectDB();

    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive,
      exclude,
    } = params;
    
    // Decoding category if it was encoded in URL params (though strictly, server function callers should pass decoded strings)
    // We'll assume clean input here, but decode just in case logic was moved 1:1
    const decodedCategory = category ? decodeURIComponent(category) : undefined;

    /* -------------------------------------------
       FILTER BUILDING
    -------------------------------------------- */
    const filter: Record<string, any> = {};

    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (exclude) {
      filter._id = { $ne: exclude };
    }

    if (decodedCategory) {
      filter.category = decodedCategory;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice * 100;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice * 100;
    }

    if (minRating !== undefined) {
      filter['ratings.average'] = { $gte: minRating };
    }

    /* -------------------------------------------
       SORTING
    -------------------------------------------- */
    const sortField = sortBy === 'rating' ? 'ratings.average' : sortBy;

    const sort: { [key: string]: SortOrder } = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
      _id: -1, // stable ordering
    };

    /* -------------------------------------------
       QUERY
    -------------------------------------------- */
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('owner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // lean() is important for serializable data in Server Components

    const total = await Product.countDocuments(filter);

    // Mongoose documents (even lean) *might* contain non-serializable fields like ObjectIds or Dates if not handled.
    // Next.js Server Components require plain objects.
    // JSON.stringify/parse is a crude but effective sanitization for now.
    // Ideally we map to a DTO.
    const sanitizedProducts = JSON.parse(JSON.stringify(products));

    return {
      products: sanitizedProducts,
      pagination: {
        page: page,
        limit: limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getProducts: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch products');
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('owner', 'name email')
      .lean();

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (err) {
    console.error(`Error in getProductById: ${err}`);
    return null;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    // Soft delete usually? Or real delete? The API route did soft delete (isActive toggle).
    // Let's check api/products/[id]/route.ts. It toggled isActive.
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    
    product.isActive = !product.isActive;
    await product.save();

    return JSON.parse(JSON.stringify(product));
  } catch (err: any) {
    console.error(`Error in deleteProduct: ${err.message}`);
    throw new Error(err.message || 'Failed to delete product');
  }
}

export async function updateProductStock(id: string, stock: number) {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    ).lean();

    if (!product) throw new Error('Product not found');

    return JSON.parse(JSON.stringify(product));
  } catch (err: any) {
    console.error(`Error in updateProductStock: ${err.message}`);
    throw new Error(err.message || 'Failed to update product stock');
  }
}
