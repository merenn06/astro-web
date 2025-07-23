import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const domain = process.env.DOMAIN || 'localhost:3000';
  
  try {
    // Get all published posts
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    // Static pages
    const staticPages = [
      { path: '', priority: '1.0' },
      { path: '/blog', priority: '0.9' },
      { path: '/horoscope', priority: '0.8' },
      { path: '/takvim', priority: '0.8' },
      { path: '/yorumlar', priority: '0.8' },
      { path: '/danismanlik', priority: '0.8' },
    ];

    // Generate XML
    const urls = [
      // Static pages
      ...staticPages.map(page => 
        `<url>
          <loc>https://${domain}${page.path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${page.priority}</priority>
        </url>`
      ),
      // Blog posts
      ...posts.map(post => 
        `<url>
          <loc>https://${domain}/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>`
      ),
    ].join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just static pages
    const fallbackStaticPages = [
      { path: '', priority: '1.0' },
      { path: '/blog', priority: '0.9' },
      { path: '/horoscope', priority: '0.8' },
      { path: '/takvim', priority: '0.8' },
      { path: '/yorumlar', priority: '0.8' },
      { path: '/danismanlik', priority: '0.8' },
    ];
    
    const fallbackUrls = fallbackStaticPages.map((page: { path: string; priority: string }) => 
      `<url>
        <loc>https://${domain}${page.path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${page.priority}</priority>
      </url>`
    ).join('');

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${fallbackUrls}
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
} 