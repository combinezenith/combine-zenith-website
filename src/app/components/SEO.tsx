import Head from 'next/head';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEO({
  title = "Combine Zenith - From Ideas to Impact",
  description = "At Combine Zenith, we partner with dreamers and creators to bring visions to life through strategic marketing, branding, and innovation.",
  image = "/logo.webp",
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.combinezenith.com';
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Generate structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Combine Zenith",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.webp`,
    "description": "Strategic marketing and branding agency helping brands reach their peak potential.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-XXX-XXXXXXX", // Replace with actual phone
      "contactType": "Customer Service",
      "email": "combinezenith@gmail.com"
    },
    "sameAs": [
      "https://www.facebook.com/combinedzenith",
      "https://www.instagram.com/combinedzenith",
      "https://www.linkedin.com/company/combinedzenith"
    ]
  };

  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Organization",
      "name": author || "Combine Zenith"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Combine Zenith",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.webp`
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": section,
    "keywords": tags.join(', ')
  } : null;

  const schemas = articleSchema ? [organizationSchema, articleSchema] : [organizationSchema];

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Combine Zenith" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article Specific Meta Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && (
        <meta property="article:tag" content={tags.join(', ')} />
      )}

      {/* Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </Head>
  );
}

// Helper function to generate metadata for Next.js 14+ App Router
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website'
}: Omit<SEOProps, 'publishedTime' | 'modifiedTime' | 'author' | 'section' | 'tags'>): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.combinezenith.com';
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image?.startsWith('http') ? image : `${siteUrl}${image || '/logo.webp'}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Combine Zenith',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
