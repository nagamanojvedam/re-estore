import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import Product from '@/models/Product';
import { authMiddleware } from '@/lib/middleware/auth';

/* ============================================================
   GET /api/products/:id
   Fetch a single active product
============================================================ */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const product = await Product.findOne({
      _id: params.id,
      isActive: true,
    }).populate('owner', 'name email');

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: { product },
    });
  } catch (err: any) {
    console.error('GET /api/products/:id error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   PATCH /api/products/:id
   Update a product (owner or admin only)
============================================================ */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    /* 1) AUTH */
    const { user, error } = await authMiddleware(req);
    if (error) return error;

    /* 2) Get Product */
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    /* 3) Ownership check */
    if (product.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You can only update your own products',
        },
        { status: 403 }
      );
    }

    /* 4) Validation */
    const body = await req.json();

    if (body.stock != null && body.stock < 0) {
      return NextResponse.json(
        { status: 'error', message: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    /* 5) Update fields */
    Object.assign(product, body);
    await product.save();

    await Product.populate(product, {
      path: 'owner',
      select: 'name email',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (err: any) {
    console.error('PATCH /api/products/:id error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE /api/products/:id
   Soft delete (toggle isActive)
============================================================ */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    /* 1) AUTH */
    const { user, error } = await authMiddleware(req);
    if (error) return error;

    /* 2) Product lookup */
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    /* 3) Ownership or admin */
    if (product.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You can only delete your own products',
        },
        { status: 403 }
      );
    }

    /* 4) Soft delete toggle */
    product.isActive = !product.isActive;
    await product.save();

    return NextResponse.json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err: any) {
    console.error('DELETE /api/products/:id error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
