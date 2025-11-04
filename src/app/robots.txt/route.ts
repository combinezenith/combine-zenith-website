import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Allow access to sitemap
Sitemap: https://www.combinezenith.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
