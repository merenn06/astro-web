import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';

interface PageProps {
  params: { slug: string };
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

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
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: true,
      },
    });

    if (!post) {
      return {
        title: 'Yazı Bulunamadı | Astrolog Dilek Alkan Kara',
        description: 'Aradığınız yazı bulunamadı.',
      };
    }

    const description = post.excerpt || 
      (typeof post.content === 'string' ? post.content.slice(0, 155) : 'Astroloji yazısı') + '...';
    
    const domain = process.env.DOMAIN || 'localhost:3000';
    const url = `https://${domain}/blog/${post.slug}`;

    return {
      title: `${post.title} | Astrolog Dilek Alkan Kara`,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        url,
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        images: post.coverImage ? [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        authors: ['Dilek Alkan Kara'],
        section: post.category === 'MONTHLY' ? 'Aylık Yorum' : post.category === 'RETRO' ? 'Retro Rehberi' : post.category === 'TIP' ? 'Ritüel / İpucu' : '',
        tags: [post.category === 'MONTHLY' ? 'Aylık Yorum' : post.category === 'RETRO' ? 'Retro Rehberi' : post.category === 'TIP' ? 'Ritüel / İpucu' : ''],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
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

  // Schema.org BlogPosting markup
  const domain = process.env.DOMAIN || 'localhost:3000';
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || 'Astroloji yazısı',
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt?.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": "Dilek Alkan Kara",
      "url": `https://${domain}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Astrolog Dilek Alkan Kara",
      "logo": {
        "@type": "ImageObject",
        "url": `https://${domain}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://${domain}/blog/${post.slug}`
    },
    "url": `https://${domain}/blog/${post.slug}`
  };

  // Convert Date objects to strings for the client component
  const postForClient = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaOrg),
        }}
      />
      <BlogPostClient post={postForClient} />
    </>
  );
} 