import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimiter(
  request: Request,
  limit = 100, // max requests
  window = 15 * 60 // 15 minutes
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown_ip';
  const key = `ratelimit_${ip}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, window);
  }

  if (requests > limit) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  return null;
}
