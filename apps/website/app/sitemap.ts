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
  ];
}
