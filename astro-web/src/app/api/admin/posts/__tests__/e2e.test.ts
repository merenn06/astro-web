import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { PATCH, DELETE } from '../[id]/route';

// Mock Prisma
jest.mock('../../../../../lib/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock rate limiter
jest.mock('../../../../../lib/ratelimit', () => ({
  checkRateLimit: jest.fn(),
}));

const { prisma } = require('../../../../../lib/prisma');
const { checkRateLimit } = require('../../../../../lib/ratelimit');

describe('Blog API E2E Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full CRUD cycle: create → publish → fetch → delete', async () => {
    const mockPost = {
      id: 'test-id-123',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'Test excerpt',
      content: { type: 'doc', content: [] },
      coverImage: null,
      isPublished: false,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const publishedPost = {
      ...mockPost,
      isPublished: true,
      publishedAt: new Date(),
    };

    // 1. CREATE - Create new post
    (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

    const createRequest = new NextRequest('http://localhost:3000/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Blog Post',
        excerpt: 'Test excerpt',
        content: { type: 'doc', content: [] },
        isPublished: false,
      }),
    });

    const createResponse = await POST(createRequest);
    expect(createResponse.status).toBe(201);
    const createdPost = await createResponse.json();
    expect(createdPost.title).toBe('Test Blog Post');
    expect(createdPost.isPublished).toBe(false);

    // 2. PUBLISH - Update post to published
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);
    (prisma.post.update as jest.Mock).mockResolvedValue(publishedPost);

    const publishRequest = new NextRequest(`http://localhost:3000/api/admin/posts/${mockPost.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...mockPost,
        isPublished: true,
      }),
    });

    const publishResponse = await PATCH(publishRequest, { params: { id: mockPost.id } });
    expect(publishResponse.status).toBe(200);
    const publishedPostData = await publishResponse.json();
    expect(publishedPostData.isPublished).toBe(true);
    expect(publishedPostData.publishedAt).toBeTruthy();

    // 3. FETCH - Get published posts
    (prisma.post.findMany as jest.Mock).mockResolvedValue([publishedPost]);
    (prisma.post.count as jest.Mock).mockResolvedValue(1);

    const fetchRequest = new NextRequest('http://localhost:3000/api/admin/posts?status=published');
    const fetchResponse = await GET(fetchRequest);
    expect(fetchResponse.status).toBe(200);
    const fetchData = await fetchResponse.json();
    expect(fetchData.posts).toHaveLength(1);
    expect(fetchData.posts[0].isPublished).toBe(true);

    // 4. DELETE - Delete the post
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(publishedPost);
    (prisma.post.delete as jest.Mock).mockResolvedValue({ success: true });

    const deleteRequest = new NextRequest(`http://localhost:3000/api/admin/posts/${mockPost.id}`, {
      method: 'DELETE',
    });

    const deleteResponse = await DELETE(deleteRequest, { params: { id: mockPost.id } });
    expect(deleteResponse.status).toBe(200);
    const deleteData = await deleteResponse.json();
    expect(deleteData.success).toBe(true);
  });

  it('handles rate limiting correctly', async () => {
    (checkRateLimit as jest.Mock).mockResolvedValue({ success: false });

    const request = new NextRequest('http://localhost:3000/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: { type: 'doc', content: [] },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data.error).toContain('Çok fazla istek');
  });

  it('validates required fields', async () => {
    (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });

    const request = new NextRequest('http://localhost:3000/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        excerpt: 'Test excerpt',
        content: { type: 'doc', content: [] },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Başlık zorunludur');
  });
}); 