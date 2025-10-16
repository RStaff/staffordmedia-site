/** CommonJS Next.js config (Render-safe) */
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: '/',
  images: { unoptimized: true },

  async redirects() {
    return [
      // legacy /logos → canonical root files
      { source: '/logos/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/logos/abando.png',            destination: '/abando-logo.png', permanent: true },

      // legacy /brands → canonical root/brand
      { source: '/brands/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/brands/abando.png',           destination: '/abando-logo.png',  permanent: true },

      // brands folder passthrough (optional)
      { source: '/brands/:path*', destination: '/brand/:path*', permanent: true },

      // keep your existing soft redirects if desired
      { source: '/start',   destination: '/abando#start', permanent: false },
      { source: '/abando',  destination: '/abando',       permanent: false },
      { source: '/contact', destination: '/contact',      permanent: false },
    ];
  },

  // Helps Render’s file tracing in monorepo-ish setups
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
