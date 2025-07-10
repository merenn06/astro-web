import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
process.env.MAILCHIMP_API_KEY = 'test-api-key';
process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
process.env.MAILCHIMP_DC = 'us21';

describe('/api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid email', async () => {
    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid');
  });

  it('should return 400 for empty email', async () => {
    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: '' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid');
  });

  it('should return 400 for missing email', async () => {
    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid');
  });

  it('should return 500 when Mailchimp API fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('mailchimp');
  });

  it('should return 200 for valid email and successful Mailchimp subscription', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it('should return 200 when user is already subscribed (Mailchimp returns 400)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400, // Already subscribed
    });

    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it('should call Mailchimp API with correct parameters', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const req = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    await POST(req);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.mailchimp.com/3.0/lists/'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('apikey'),
        },
        body: JSON.stringify({
          email_address: 'test@example.com',
          status: 'subscribed',
        }),
      })
    );
  });
}); 