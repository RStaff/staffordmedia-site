import { fileURLToPath } from "node:url";

const nextConfig = {
  output: "standalone",
  assetPrefix: "/",
  images: { unoptimized: true },

  async redirects() {
    return [
      { source: "/start", destination: "/abando#start", permanent: false },
      { source: "/abando", destination: "/abando", permanent: false },
      { source: "/contact", destination: "/contact", permanent: false },
    ];
  },

  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
};

export default nextConfig;
