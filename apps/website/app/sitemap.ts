<<<<<<< HEAD
<<<<<<< HEAD
import type { MetadataRoute } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://staffordmedia.ai";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/+$/,'');
  const now = new Date();
  return [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
=======
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://staffordmedia.ai';
  return [
    { url: `${base}/`,        changefreq: 'weekly',  priority: 1.0 },
    { url: `${base}/about`,   changefreq: 'monthly', priority: 0.7 },
    { url: `${base}/services`,changefreq: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, changefreq: 'monthly', priority: 0.6 },
>>>>>>> 9f62116 (seo: App Router robots + sitemap for staffordmedia.ai)
=======
import type { MetadataRoute } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://staffordmedia.ai";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/+$/,'');
  const now = new Date();
  return [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
>>>>>>> dd26c5a (feat(site): refined About/Services, inline Pricing (fix 404), app robots/sitemap, SITE_URL)
  ];
}
