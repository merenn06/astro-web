import { Metadata } from 'next';
import CommentsPageClient from './CommentsPageClient';

interface PageProps {
  searchParams: { page?: string };
}

// SEO & Meta
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const pageSuffix = page > 1 ? ` - Sayfa ${page}` : '';
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/comments?status=approved&page=1&limit=12`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const comments = data.comments as { content: string }[];
    const desc = comments.map(c => c.content).join(' ').replace(/<[^>]+>/g, '').slice(0, 150) + '... Gerçek danışan yorumlarını okuyun.';
    return {
      title: `Danışan Yorumları${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: desc,
    };
  } catch (error) {
    return {
      title: `Danışan Yorumları${pageSuffix} | Astrolog Dilek Alkan Kara`,
      description: 'Gerçek danışan yorumlarını okuyun ve kendi yorumunuzu bırakın.',
    };
  }
}

// SSR + React Query prefetch
export default async function CommentsPage({ searchParams }: PageProps) {
  return <CommentsPageClient />;
} 