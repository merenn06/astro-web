import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    reel: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = require('@/lib/prisma').prisma;

describe('/api/reels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated reels', async () => {
    const mockReels = [
      {
        id: '1',
        title: 'Test Reel 1',
        description: 'Test description',
        videoUrl: '/uploads/test1.mp4',
        thumbnail: '/uploads/thumb1.jpg',
        publishedAt: new Date('2024-01-01'),
        calendarUrl: null,
      },
    ];

    mockPrisma.reel.findMany.mockResolvedValue(mockReels);
    mockPrisma.reel.count.mockResolvedValue(1);

    const request = new NextRequest('http://localhost:3000/api/reels?page=1&limit=12');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toEqual(mockReels);
    expect(data.total).toBe(1);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(12);
    expect(data.totalPages).toBe(1);
  });

  it('should apply default pagination when no params provided', async () => {
    mockPrisma.reel.findMany.mockResolvedValue([]);
    mockPrisma.reel.count.mockResolvedValue(0);

    const request = new NextRequest('http://localhost:3000/api/reels');
    const response = await GET(request);
    const data = await response.json();

    expect(mockPrisma.reel.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
      skip: 0,
      take: 12,
      select: expect.any(Object),
    });
  });

  it('should handle errors gracefully', async () => {
    mockPrisma.reel.findMany.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/reels');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
}); 