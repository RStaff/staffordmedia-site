import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://www.staffordmedia.ai/', lastModified: new Date() }];
}
