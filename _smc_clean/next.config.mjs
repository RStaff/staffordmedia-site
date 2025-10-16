// Pure ESM Next.js config for Render
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: '/',
  images: { unoptimized: true },

  // Legacy → canonical logo paths
  async redirects() {
    return [
      // legacy /logos → canonical root files
      { source: '/logos/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/logos/abando.png',            destination: '/abando-logo.png', permanent: true },

      // legacy /brands → canonical root/brand
      { source: '/brands/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/brands/abando.png',           destination: '/abando-logo.png',  permanent: true },

      // (optional) general brands folder passthrough if you use /brand/*
      { source: '/brands/:path*', destination: '/brand/:path*', permanent: true },
    ];
  },

  // Helps Render’s file tracing in monorepo-ish setups
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
