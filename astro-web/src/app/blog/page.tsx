import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

interface PageProps {
  searchParams: { page?: string; category?: string };
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  monthly: 'Aylık Yorum',
  retro: 'Retro Rehberi',
  tip: 'Ritüel / İpucu',
};

// SEO & Meta
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const pageSuffix = page > 1 ? ` - Sayfa ${page}` : '';
  const categoryParam = searchParams.category || '';
  const categoryLabel = CATEGORY_LABELS[categoryParam] || '';
  const categoryTitle = categoryLabel ? `${categoryLabel} | ` : '';
  const canonical = categoryParam ? `/blog?category=${categoryParam}` : '/blog';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts?page=1&limit=10${categoryParam ? `&category=${categoryParam}` : ''}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const posts = data.posts as { title: string; excerpt: string | null }[];
    const desc = posts.map(p => p.excerpt || p.title).join(' ').slice(0, 150) + '... Astroloji ve kişisel gelişim yazıları.';
    return {
      title: `${categoryTitle}Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: desc,
      alternates: { canonical },
      openGraph: {
        title: `${categoryTitle}Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: desc,
        type: 'website',
        url: canonical,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryTitle}Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: desc,
      },
    };
  } catch (error) {
    return {
      title: `${categoryTitle}Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: 'Astroloji ve kişisel gelişim yazıları. Burç yorumları, astroloji rehberleri ve daha fazlası.',
      alternates: { canonical },
      openGraph: {
        title: `${categoryTitle}Blog${pageSuffix} | Astrolog Dilek Alkan Kara`,
        description: 'Astroloji ve kişisel gelişim yazıları. Burç yorumları, astroloji rehberleri ve daha fazlası.',
        type: 'website',
        url: canonical,
      },
    };
  }
}

// SSR + React Query prefetch
export default async function BlogPage({ searchParams }: PageProps) {
  return <BlogPageClient />;
} 