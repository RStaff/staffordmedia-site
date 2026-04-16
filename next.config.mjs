import { fileURLToPath } from "node:url";

const nextConfig = {
  output: "standalone",
  assetPrefix: "/",
  images: { unoptimized: true },

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
