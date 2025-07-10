import { NextRequest } from 'next/server';

// Simple in-memory rate limiter (for development)
// In production, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20; // 20 requests per minute

  const key = `rate_limit:${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remainingPoints: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return { success: false, remainingPoints: 0 };
  }

  // Increment count
  current.count++;
  rateLimitStore.set(key, current);

  return { success: true, remainingPoints: maxRequests - current.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute 