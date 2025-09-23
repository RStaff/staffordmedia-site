/** @type {import('next').NextConfig} */
const nextConfig = {
  // allow building even if TypeScript errors exist
  typescript: { ignoreBuildErrors: true },
  // skip ESLint during build (errors won’t block deploy)
  eslint: { ignoreDuringBuilds: true }
};

module.exports = nextConfig;
