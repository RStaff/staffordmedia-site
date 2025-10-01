import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    host: 'https://staffordmedia.ai',
    sitemap: 'https://staffordmedia.ai/sitemap.xml',
  };
}
