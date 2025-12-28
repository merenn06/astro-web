import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const domain = process.env.DOMAIN || 'localhost:3000';
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://${domain}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /blog/
Allow: /horoscope/
Allow: /takvim/
Allow: /yorumlar/
Allow: /danismanlik/`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 