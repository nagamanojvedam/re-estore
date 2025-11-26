import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/utils/db';
import Message from '@/models/Message';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await db();

    const { id } = params;
    const { reply } = await req.json();

    if (!reply) {
      return NextResponse.json(
        { status: 'error', message: 'Reply content is required' },
        { status: 400 }
      );
    }

    // Only update if isReplied=false (same logic as original)
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: id, isReplied: false },
      {
        $set: { reply, isReplied: true },
      },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        { status: 'error', message: 'Message already replied or not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Message replied successfully',
    });
  } catch (err: any) {
    console.error('PATCH /api/messages/[id]/reply error:', err.message);

    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
