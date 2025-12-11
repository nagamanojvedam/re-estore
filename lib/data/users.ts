'use server';

import connectDB from '@/lib/utils/db';
import User from '@/models/User';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import config from '@/lib/utils/config';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getUsers(params: {
  page?: number;
  limit?: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments();

    return {
      users: JSON.parse(JSON.stringify(users)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getUsers: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch users');
  }
}

export async function toggleUserActive({ id, isUserActive }: { id: string; isUserActive: boolean }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    await connectDB();

    // Prevent deactivating own account
    if (String(user.id || user._id || user.user?._id) === id) {
       throw new Error('Cannot deactivate your own account');
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !isUserActive },
      { new: true }
    ).select('-password');

    if (!updatedUser) throw new Error('User not found');

    return { 
        status: 'success', 
        user: JSON.parse(JSON.stringify(updatedUser)) 
    };
  } catch (err: any) {
    console.error(`Error in toggleUserActive: ${err.message}`);
    throw new Error(err.message || 'Failed to update user status');
  }
}

export async function getMe() {
  try {
    const session = await getCurrentUser();
    if (!session) return null; // Or throw? AuthContext handles null/error

    await connectDB();
    const user = await User.findById(session.id || session._id || session.user?._id)
      .select('-password -__v')
      .lean();

    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (err: any) {
    console.error(`Error in getMe: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch user profile');
  }
}

export async function updateMe(updates: any) {
  try {
    const session = await getCurrentUser();
    if (!session) throw new Error('Unauthorized');

    await connectDB();
    const userId = session.id || session._id || session.user?._id;

    // Prevent updating restricted fields
    delete updates.password;
    delete updates.role;
    delete updates.email;
    delete updates._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password -__v');

    if (!updatedUser) throw new Error('User not found');

    return JSON.parse(JSON.stringify(updatedUser)); // Return user directly
  } catch (err: any) {
    console.error(`Error in updateMe: ${err.message}`);
    throw new Error(err.message || 'Failed to update profile');
  }
}
