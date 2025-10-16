/** CommonJS Next.js config (Render-safe) */
const nextConfig = {
  output: 'standalone',
  assetPrefix: '/',
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/logos/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/logos/abando.png',            destination: '/abando-logo.png', permanent: true },
      { source: '/brands/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/brands/abando.png',           destination: '/abando-logo.png',  permanent: true },
      { source: '/brands/:path*', destination: '/brand/:path*', permanent: true },
      { source: '/start',   destination: '/abando#start', permanent: false },
      { source: '/abando',  destination: '/abando',       permanent: false },
      { source: '/contact', destination: '/contact',      permanent: false },
    ];
  },
  outputFileTracingRoot: __dirname,
};
module.exports = nextConfig;
