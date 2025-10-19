/** CommonJS Next.js config for Render */
const nextConfig = {
  assetPrefix: '/',
  images: { unoptimized: true },

  async redirects() {
    return [
      // legacy logo URLs → canonical files
      { source: "/smc-logo.png", destination: '/smc-logo.png',     permanent: true },
      { source: '/logos/abando.png',            destination: '/abando-logo.png', permanent: true },

      // older "/brands/*" forms
      { source: '/brands/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/brands/abando.png',           destination: '/abando-logo.png',  permanent: true },
      { source: '/brands/:path*',               destination: '/brand/:path*',     permanent: true },

      // simple page redirects
      { source: '/start',   destination: '/abando#start', permanent: false },
      { source: '/abando',  destination: '/abando',       permanent: false },
      { source: '/contact', destination: '/contact',      permanent: false },
    ];
  },

  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
