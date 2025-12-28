import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogPageClient from '../BlogPageClient';

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn((key: string) => {
      if (key === 'page') return '1';
      return null;
    }),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test excerpt',
    coverImage: '/test-image-1.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'This is another test excerpt',
    coverImage: null,
    publishedAt: '2024-01-02T00:00:00Z',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('BlogPageClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<BlogPageClient />);
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
  });

  it('renders posts after successful fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockPosts }),
      headers: new Map([['X-Total-Count', '2']]),
    });

    render(<BlogPageClient />);

    await waitFor(() => {
      expect(screen.getAllByText('Test Post 1')).toHaveLength(3); // Desktop, tablet, mobile
      expect(screen.getAllByText('Test Post 2')).toHaveLength(3); // Desktop, tablet, mobile
    });
  });

  it('renders empty state when no posts', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: [] }),
      headers: new Map([['X-Total-Count', '0']]),
    });

    render(<BlogPageClient />);

    await waitFor(() => {
      expect(screen.getByText('Henüz yazı yok')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BlogPageClient />);

    await waitFor(() => {
      expect(screen.getByText('Henüz yazı yok')).toBeInTheDocument();
    });
  });

  it('loads more posts on mobile infinite scroll', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts }),
        headers: new Map([['X-Total-Count', '4']]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts }),
        headers: new Map([['X-Total-Count', '4']]),
      });

    render(<BlogPageClient />);

    await waitFor(() => {
      expect(screen.getAllByText('Test Post 1')).toHaveLength(3); // Desktop, tablet, mobile
    });

    const loadMoreButton = screen.getByText('Daha Fazla Yükle');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
}); 