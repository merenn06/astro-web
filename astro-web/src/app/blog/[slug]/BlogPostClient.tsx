'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import NewsletterForm from '@/components/NewsletterForm';
import ShareButtons from '@/components/ShareButtons';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostClientProps {
  post: Post;
}

// TipTap content renderer
function renderTipTapContent(content: any): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const renderNode = (node: any): string => {
    if (typeof node === 'string') {
      return node;
    }

    if (node.type === 'text') {
      let text = node.text || '';
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') {
            text = `<strong>${text}</strong>`;
          } else if (mark.type === 'italic') {
            text = `<em>${text}</em>`;
          } else if (mark.type === 'link') {
            text = `<a href="${mark.attrs.href}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
          }
        });
      }
      return text;
    }

    if (node.type === 'paragraph') {
      const content = node.content?.map(renderNode).join('') || '';
      return `<p class="mb-4">${content}</p>`;
    }

    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const content = node.content?.map(renderNode).join('') || '';
      const tag = `h${level}`;
      const className = level === 2 ? 'text-2xl font-bold mb-4 mt-8' : 'text-xl font-semibold mb-3 mt-6';
      return `<${tag} class="${className}">${content}</${tag}>`;
    }

    if (node.type === 'bulletList') {
      const content = node.content?.map(renderNode).join('') || '';
      return `<ul class="list-disc list-inside mb-4 space-y-1">${content}</ul>`;
    }

    if (node.type === 'orderedList') {
      const content = node.content?.map(renderNode).join('') || '';
      return `<ol class="list-decimal list-inside mb-4 space-y-1">${content}</ol>`;
    }

    if (node.type === 'listItem') {
      const content = node.content?.map(renderNode).join('') || '';
      return `<li>${content}</li>`;
    }

    if (node.type === 'codeBlock') {
      const content = node.content?.map(renderNode).join('') || '';
      return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>${content}</code></pre>`;
    }

    if (node.type === 'image') {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      const width = node.attrs?.width || 800;
      const height = node.attrs?.height || 600;
      return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="max-w-full h-auto rounded-lg mb-4" loading="lazy" />`;
    }

    if (node.content) {
      return node.content.map(renderNode).join('');
    }

    return '';
  };

  return content.content?.map(renderNode).join('') || '';
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [prevPost, setPrevPost] = useState<{ slug: string; title: string } | null>(null);
  const [nextPost, setNextPost] = useState<{ slug: string; title: string } | null>(null);

  // Fetch previous and next posts
  useEffect(() => {
    const fetchNavigationPosts = async () => {
      try {
        const response = await fetch(`/api/posts?limit=100`);
        if (!response.ok) return;

        const data = await response.json();
        const posts = data.posts;
        const currentIndex = posts.findIndex((p: any) => p.id === post.id);

        if (currentIndex > 0) {
          setPrevPost({
            slug: posts[currentIndex - 1].slug,
            title: posts[currentIndex - 1].title,
          });
        }

        if (currentIndex < posts.length - 1) {
          setNextPost({
            slug: posts[currentIndex + 1].slug,
            title: posts[currentIndex + 1].title,
          });
        }
      } catch (error) {
        console.error('Navigation posts fetch error:', error);
      }
    };

    fetchNavigationPosts();
  }, [post.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderedContent = renderTipTapContent(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Blog */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Blog'a Dön
        </Link>
      </div>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
            />
          </div>
        )}

        <div className="p-8">
          {/* Meta */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
          
          {/* Share Buttons */}
          <ShareButtons title={post.title} excerpt={post.excerpt || undefined} />
        </div>
      </article>

      {/* Navigation */}
      {(prevPost || nextPost) && (
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="flex-1 bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <ArrowLeft className="w-4 h-4" />
                Önceki Yazı
              </div>
              <h3 className="font-semibold line-clamp-2">{prevPost.title}</h3>
            </Link>
          )}
          
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex-1 bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-right"
            >
              <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                Sonraki Yazı
                <ArrowRight className="w-4 h-4" />
              </div>
              <h3 className="font-semibold line-clamp-2">{nextPost.title}</h3>
            </Link>
          )}
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-12 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-8 border border-violet-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            📅 2025 Astro Takvimi
          </h3>
          <p className="text-gray-600">
            Bu yazıyı beğendiyseniz, e-posta bültenimize kaydolun ve 2025 Astro Takvimi PDF'ini ücretsiz indirin!
          </p>
        </div>
        <div className="flex justify-center">
          <NewsletterForm />
        </div>
      </div>

      {/* Comments Placeholder */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Yorumlar</h3>
        <p className="text-gray-600">
          Yorum sistemi yakında eklenecek. Bu yazı hakkında düşüncelerinizi paylaşabileceksiniz.
        </p>
      </div>
    </div>
  );
} 