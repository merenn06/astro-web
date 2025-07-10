import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock Prisma
jest.mock('../../../../../lib/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// Mock rate limiter
jest.mock('../../../../../lib/ratelimit', () => ({
  checkRateLimit: jest.fn(),
}));

const { prisma } = require('../../../../../lib/prisma');
const { checkRateLimit } = require('../../../../../lib/ratelimit');

describe('/api/admin/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns posts with pagination', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test excerpt',
          coverImage: null,
          isPublished: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
      (prisma.post.count as jest.Mock).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/admin/posts?page=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toEqual(mockPosts);
      expect(data.total).toBe(1);
      expect(response.headers.get('X-Total-Count')).toBe('1');
    });

    it('filters by status', async () => {
      (prisma.post.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.post.count as jest.Mock).mockResolvedValue(0);

      const request = new NextRequest('http://localhost:3000/api/admin/posts?status=published');
      await GET(request);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublished: true,
          }),
        })
      );
    });

    it('searches by query', async () => {
      (prisma.post.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.post.count as jest.Mock).mockResolvedValue(0);

      const request = new NextRequest('http://localhost:3000/api/admin/posts?query=test');
      await GET(request);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                title: expect.objectContaining({
                  contains: 'test',
                  mode: 'insensitive',
                }),
              }),
            ]),
          }),
        })
      );
    });
  });

  describe('POST', () => {
    it('creates a new post successfully', async () => {
      const mockPost = {
        id: '1',
        title: 'New Post',
        slug: 'new-post',
        excerpt: 'New excerpt',
        content: { type: 'doc', content: [] },
        coverImage: null,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });
      (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

      const request = new NextRequest('http://localhost:3000/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Post',
          excerpt: 'New excerpt',
          content: { type: 'doc', content: [] },
          isPublished: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockPost);
    });

    it('handles rate limiting', async () => {
      (checkRateLimit as jest.Mock).mockResolvedValue({ success: false });

      const request = new NextRequest('http://localhost:3000/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Post',
          content: { type: 'doc', content: [] },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Çok fazla istek');
    });

    it('validates required fields', async () => {
      (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });

      const request = new NextRequest('http://localhost:3000/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excerpt: 'New excerpt',
          content: { type: 'doc', content: [] },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Başlık zorunludur');
    });

    it('handles slug conflicts', async () => {
      const mockPost = {
        id: '1',
        title: 'New Post',
        slug: 'new-post-1',
        excerpt: 'New excerpt',
        content: { type: 'doc', content: [] },
        coverImage: null,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });
      (prisma.post.findUnique as jest.Mock)
        .mockResolvedValueOnce({ slug: 'new-post' }) // First call finds existing
        .mockResolvedValueOnce(null); // Second call finds no conflict
      (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

      const request = new NextRequest('http://localhost:3000/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Post',
          excerpt: 'New excerpt',
          content: { type: 'doc', content: [] },
          isPublished: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.slug).toBe('new-post-1');
    });
  });
}); 