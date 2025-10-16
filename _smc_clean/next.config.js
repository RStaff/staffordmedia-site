/** CommonJS Next.js config for Render (safe in Node CJS runtime) */
const nextConfig = {
  output: 'standalone',
  assetPrefix: '/',
  images: { unoptimized: true },

  // Logo path compatibility:
  async redirects() {
    return [
      // legacy logo URLs → canonical files (adjust if needed)
      { source: '/logos/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/logos/abando.png',            destination: '/abando-logo.png', permanent: true },

      // older "/brands/*" forms
      { source: '/brands/stafford-primary.png', destination: '/smc-logo.png',     permanent: true },
      { source: '/brands/abando.png',           destination: '/abando-logo.png',  permanent: true },
      { source: '/brands/:path*',               destination: '/brand/:path*',     permanent: true },

      // keep your simple page redirects if you use them
      { source: '/start',   destination: '/abando#start', permanent: false },
      { source: '/abando',  destination: '/abando',       permanent: false },
      { source: '/contact', destination: '/contact',      permanent: false },
    ];
  },

  // help file tracing in container/monorepo setups
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
