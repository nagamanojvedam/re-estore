'use server';

import connectDB from '@/lib/utils/db';
import User from '@/models/User';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import config from '@/lib/utils/config';

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

export async function getWishlist() {
  try {
    await connectDB();
    const userId = await getCurrentUserId();
    if (!userId) return []; // Or throw error? Context handles empty list.

    const currentUser = await User.findById(userId)
      .select('wishlist')
      .populate('wishlist.productId', 'name price images category')
      .lean();

    if (!currentUser) return [];

    return JSON.parse(JSON.stringify(currentUser.wishlist));
  } catch (err: any) {
    console.error(`Error in getWishlist: ${err.message}`);
    return [];
  }
}

export async function addToWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    await connectDB();

    // Validate product exists
    const productExists = await Product.exists({ _id: productId, isActive: true });
    if (!productExists) {
      throw new Error('Product not found');
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error('User not found');

    const alreadyExists = currentUser.wishlist.some(
      (item: any) => item.productId.toString() === productId
    );

    if (!alreadyExists) {
      currentUser.wishlist.push({ productId });
      await currentUser.save();
    }

    await currentUser.populate('wishlist.productId', 'name price images category');
    
    // Return the updated wishlist array from the user document
    return JSON.parse(JSON.stringify(currentUser.wishlist));
  } catch (err: any) {
    console.error(`Error in addToWishlist: ${err.message}`);
    throw new Error(err.message || 'Failed to add to wishlist');
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    await connectDB();

    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error('User not found');

    currentUser.wishlist = currentUser.wishlist.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await currentUser.save();
    await currentUser.populate('wishlist.productId', 'name price images category');

    return JSON.parse(JSON.stringify(currentUser.wishlist));
  } catch (err: any) {
    console.error(`Error in removeFromWishlist: ${err.message}`);
    throw new Error(err.message || 'Failed to remove from wishlist');
  }
}

export async function clearWishlist() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { wishlist: [] } },
      { new: true }
    ).select('wishlist');

    if (!updatedUser) throw new Error('User not found');

    return JSON.parse(JSON.stringify(updatedUser.wishlist));
  } catch (err: any) {
    console.error(`Error in clearWishlist: ${err.message}`);
    throw new Error(err.message || 'Failed to clear wishlist');
  }
}
