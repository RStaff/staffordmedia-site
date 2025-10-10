import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tell Next "the monorepo root is one level up from this app"
  experimental: { outputFileTracingRoot: path.join(__dirname, '..') }
};
export default nextConfig;
