import { prisma } from '@/lib/prisma';
import { PATCH } from './route';

describe('PATCH /api/comments/:id', () => {
  let commentId: number;

  beforeAll(async () => {
    // Create a test comment
    const comment = await prisma.comment.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        content: 'Test content',
        isApproved: false,
        isHighlighted: false,
      },
    });
    commentId = comment.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.comment.deleteMany({ where: { email: 'test@example.com' } });
    await prisma.$disconnect();
  });

  it('should approve a comment', async () => {
    // Simulate PATCH request
    const req = new Request(`http://localhost/api/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved: true }),
      headers: { 'Content-Type': 'application/json' },
    });
    // @ts-ignore
    const res = await PATCH(req, { params: { id: String(commentId) } });
    const data = await res.json();
    expect(data.isApproved).toBe(true);
  });

  it('should unapprove a comment', async () => {
    // Simulate PATCH request
    const req = new Request(`http://localhost/api/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved: false }),
      headers: { 'Content-Type': 'application/json' },
    });
    // @ts-ignore
    const res = await PATCH(req, { params: { id: String(commentId) } });
    const data = await res.json();
    expect(data.isApproved).toBe(false);
  });
}); 