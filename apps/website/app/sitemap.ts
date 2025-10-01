import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/+$/,'');
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
  return urls;
}
