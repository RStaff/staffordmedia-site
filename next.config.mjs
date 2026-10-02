import { fileURLToPath } from "node:url";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://cart-agent-api.onrender.com https://app.abando.ai",
  "form-action 'self' https://buy.stripe.com",
].join("; ");

const nextConfig = {
  output: "standalone",
  assetPrefix: "/",
  images: { unoptimized: true },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/smc-logo.png", destination: "/smc-logo.png", permanent: true },
      { source: "/logos/abando.png", destination: "/abando-logo.png", permanent: true },
      { source: "/brands/stafford-primary.png", destination: "/smc-logo.png", permanent: true },
      { source: "/brands/abando.png", destination: "/abando-logo.png", permanent: true },
      { source: "/brands/:path*", destination: "/brand/:path*", permanent: true },
      { source: "/start", destination: "/abando#start", permanent: false },
      
      
    ];
  },

  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
};

export default nextConfig;
