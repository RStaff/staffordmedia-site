import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://staffordmedia.ai';
  return [
    { url: `${base}/`,        changefreq: 'weekly',  priority: 1.0 },
    { url: `${base}/about`,   changefreq: 'monthly', priority: 0.7 },
    { url: `${base}/services`,changefreq: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, changefreq: 'monthly', priority: 0.6 },
  ];
}
