import type { MetadataRoute } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://staffordmedia.ai";
export default function robots(): MetadataRoute.Robots {
  const host = SITE_URL.replace(/\/+$/,'');
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${host}/sitemap.xml`, host };
import type { MetadataRoute } from 'next';
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const host = SITE_URL.replace(/\/+$/,'');
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://staffordmedia.ai";
export default function robots(): MetadataRoute.Robots {
  const host = SITE_URL.replace(/\/+$/,'');
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${host}/sitemap.xml`, host };
}
