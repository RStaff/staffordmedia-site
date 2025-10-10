/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep this minimal; add options here as needed.
  // Example: images: { formats: ['image/avif', 'image/webp'] },

  async redirects() {
    // Adjust these as your pages evolve.
    return [
      { source: "/start", destination: "/abando#start", permanent: false },
      { source: "/abando", destination: "/abando", permanent: false },
      { source: "/contact", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
