import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Simple auth check - in production, you'd want proper auth
async function checkAuth(request: NextRequest) {
  // For now, we'll skip auth check - implement proper auth later
  return true;
}

// Rate limiting for uploads
const uploadLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = uploadLimits.get(ip);
  
  if (!limit || now > limit.resetTime) {
    uploadLimits.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (limit.count >= 10) { // 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const calendarUrl = formData.get('calendarUrl') as string;
    const video = formData.get('video') as File;
    const thumbnail = formData.get('thumbnail') as File;

    if (!title || !video) {
      return NextResponse.json(
        { error: 'Title and video are required' },
        { status: 400 }
      );
    }

    // Validate video file
    if (video.size > 30 * 1024 * 1024) { // 30MB limit
      return NextResponse.json(
        { error: 'Video file size must be less than 30MB' },
        { status: 400 }
      );
    }

    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid video file type' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save video file
    const videoExt = video.name.split('.').pop();
    const videoFileName = `reel-${Date.now()}.${videoExt}`;
    const videoPath = join(uploadsDir, videoFileName);
    const videoBuffer = Buffer.from(await video.arrayBuffer());
    await writeFile(videoPath, videoBuffer);

    // Save thumbnail if provided, otherwise use default
    let thumbnailFileName = 'default-thumbnail.jpg';
    if (thumbnail) {
      const thumbnailExt = thumbnail.name.split('.').pop();
      thumbnailFileName = `thumb-${Date.now()}.${thumbnailExt}`;
      const thumbnailPath = join(uploadsDir, thumbnailFileName);
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      await writeFile(thumbnailPath, thumbnailBuffer);
    }

    const reel = await prisma.reel.create({
      data: {
        title,
        description: description || null,
        videoUrl: `/uploads/${videoFileName}`,
        thumbnail: `/uploads/${thumbnailFileName}`,
        calendarUrl: calendarUrl || null,
      },
    });

    return NextResponse.json(reel, { status: 201 });
  } catch (error) {
    console.error('Error creating reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      prisma.reel.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.reel.count(),
    ]);

    return NextResponse.json({
      items: reels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching reels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 