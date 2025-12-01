import { authMiddleware } from '@/lib/middleware/auth';
import Product from '@/models/Product';
import connectDB from '@utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Extract all raw params
    const queries = Object.fromEntries(searchParams.entries());

    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive,
      exclude,
    } = queries;

    /* -------------------------------------------
       PARSE NUMBERS & NORMALIZE VALUES
    -------------------------------------------- */

    const decodedCategory = category ? decodeURIComponent(category) : undefined;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const minPriceNumber = minPrice ? Number(minPrice) : null;
    const maxPriceNumber = maxPrice ? Number(maxPrice) : null;
    const minRatingNumber = minRating ? Number(minRating) : null;

    const isActiveBoolean =
      typeof isActive === 'string' ? isActive === 'true' || isActive === '1' : undefined;

    /* -------------------------------------------
       FILTER BUILDING
    -------------------------------------------- */
    const filter: Record<string, any> = {};

    if (typeof isActiveBoolean === 'boolean') {
      filter.isActive = isActiveBoolean;
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

    if (minPriceNumber !== null || maxPriceNumber !== null) {
      filter.price = {};
      if (minPriceNumber !== null) filter.price.$gte = minPriceNumber * 100;

      if (maxPriceNumber !== null) filter.price.$lte = maxPriceNumber * 100;
    }

    if (minRatingNumber !== null) {
      filter['ratings.average'] = { $gte: minRatingNumber };
    }

    /* -------------------------------------------
       SORTING
    -------------------------------------------- */
    const sortField = sortBy === 'rating' ? 'ratings.average' : sortBy;

    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
      _id: -1, // stable ordering
    };

    /* -------------------------------------------
       QUERY
    -------------------------------------------- */
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .populate('owner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const total = await Product.countDocuments(filter);

    /* -------------------------------------------
       RESPONSE
    -------------------------------------------- */
    return NextResponse.json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (err: any) {
    console.error(`GET /api/products error: ${err.message}`);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    /* -----------------------------
       1) AUTHENTICATION
    ------------------------------ */
    const { user, error: authError } = await authMiddleware(req);
    if (authError) return authError;

    /* -----------------------------
       2) PARSE BODY
    ------------------------------ */
    const body = await req.json();

    /* -----------------------------
       3) VALIDATION
    // ------------------------------ */
    // const { error: validationError } = validate(createProductSchema, body);
    // if (validationError) return validationError;

    /* -----------------------------
       4) PRODUCT CREATION
    ------------------------------ */
    const productData = {
      ...body,
      owner: user._id,
    };

    const product = await Product.create(productData);
    await Product.populate(product, { path: 'owner', select: 'name email' });

    /* -----------------------------
       5) RESPONSE
    ------------------------------ */
    return NextResponse.json(
      {
        status: 'success',
        message: 'Product created successfully',
        data: { product },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
