import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

interface PageProps {
  searchParams: { page?: string };
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

// SEO & Meta
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const pageSuffix = page > 1 ? ` - Sayfa ${page}` : '';
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts?page=1&limit=10`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const posts = data.posts as { title: string; excerpt: string | null }[];
    const desc = posts.map(p => p.excerpt || p.title).join(' ').slice(0, 150) + '... Astroloji ve kişisel gelişim yazıları.';
    
    return {
      title: `Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: desc,
      openGraph: {
        title: `Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: desc,
        type: 'website',
        url: `/blog${page > 1 ? `?page=${page}` : ''}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: desc,
      },
    };
  } catch (error) {
    return {
      title: `Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: 'Astroloji ve kişisel gelişim yazıları. Burç yorumları, astroloji rehberleri ve daha fazlası.',
      openGraph: {
        title: `Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: 'Astroloji ve kişisel gelişim yazıları. Burç yorumları, astroloji rehberleri ve daha fazlası.',
        type: 'website',
        url: `/blog${page > 1 ? `?page=${page}` : ''}`,
      },
    };
  }
}

// SSR + React Query prefetch
export default async function BlogPage({ searchParams }: PageProps) {
  return <BlogPageClient />;
} 