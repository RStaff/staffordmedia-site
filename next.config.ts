import { fileURLToPath } from "node:url";

const nextConfig = {
  output: "standalone",
  assetPrefix: "/",
  images: { unoptimized: true },

  async redirects() {
    return [
      { source: "/start", destination: "/abando#start", permanent: false },
      { source: "/brands/:path*", destination: "/brand/:path*", permanent: true },
    ];
  },

  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
};

export default nextConfig;
