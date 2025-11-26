import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Message from '@/models/Message';

/* ============================================================
   GET /api/messages
   Fetch paginated contact messages
============================================================ */
export async function GET(req: NextRequest) {
  try {
    await db();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);

    const skip = (page - 1) * limit;

    const messages = await Message.find({})
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({});

    return NextResponse.json({
      status: 'success',
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err: any) {
    console.error('GET /api/messages error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/* ============================================================
   POST /api/messages
   Create a new contact message
============================================================ */
export async function POST(req: NextRequest) {
  try {
    await db();

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({ name, email, message });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Message created successfully',
        data: { newMessage },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/messages error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
