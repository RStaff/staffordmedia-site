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

if (typeof module.exports==='object') module.exports.outputFileTracingRoot = __dirname;

;(() => {
  const __prev = (module.exports && module.exports.redirects) ? module.exports.redirects : null;
  module.exports.redirects = async () => {
    const prev = __prev ? await __prev() : [];
    return [...[{"source":"/logos/stafford-primary.png","destination":"/smc-logo.png","permanent":true},{"source":"/brands/stafford-primary.png","destination":"/smc-logo.png","permanent":true},{"source":"/logos/abando.png","destination":"/abando-logo.png","permanent":true},{"source":"/brands/abando.png","destination":"/abando-logo.png","permanent":true}], ...prev];
  };
})();