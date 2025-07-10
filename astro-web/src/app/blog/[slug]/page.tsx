import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';

interface PageProps {
  params: { slug: string };
}

// Generate static params for published posts
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
    });

    if (!post) {
      return {
        title: 'Yazı Bulunamadı | Astrolog Dilek Alkan Kara',
        description: 'Aradığınız yazı bulunamadı.',
      };
    }

    const description = post.excerpt || 
      (typeof post.content === 'string' ? post.content.slice(0, 150) : 'Astroloji yazısı') + '...';

    return {
      title: `${post.title} | Astrolog Dilek Alkan Kara`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: 'Blog | Astrolog Dilek Alkan Kara',
      description: 'Astroloji ve kişisel gelişim yazıları.',
    };
  }
}

// Get post data
async function getPost(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error('getPost error:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
} 