'use server';

import connectDB from '@/lib/utils/db';
import Message from '@/models/Message';

export async function getMessages(params: {
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find({})
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments({});

    return {
      messages: JSON.parse(JSON.stringify(messages)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error(`Error in getMessages: ${err.message}`);
    throw new Error(err.message || 'Failed to fetch messages');
  }
}

export async function createMessage(data: { name: string; email: string; message: string }) {
  try {
    await connectDB();
    const newMessage = await Message.create(data);
    return JSON.parse(JSON.stringify(newMessage));
  } catch (err: any) {
    console.error(`Error in createMessage: ${err.message}`);
    throw new Error(err.message || 'Failed to create message');
  }
}

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

export async function replyMessage(data: { messageId: string; reply: string }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    await connectDB();
    const { messageId, reply } = data;

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, isReplied: false },
      { $set: { reply, isReplied: true } },
      { new: true }
    );

    if (!updatedMessage) throw new Error('Message already replied or not found');

    return JSON.parse(JSON.stringify(updatedMessage));
  } catch (err: any) {
    console.error(`Error in replyMessage: ${err.message}`);
    throw new Error(err.message || 'Failed to reply to message');
  }
}
