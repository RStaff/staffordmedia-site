import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
<<<<<<< HEAD


/** Canonical host: force www->apex */
const redirects = async () => ([
  { source: '/:path*', has:[{type:'host', value:'www.staffordmedia.ai'}], destination: 'https://staffordmedia.ai/:path*', permanent: true },
]);
module.exports.redirects = redirects;


/** Avoid caching status at edge */
const headers = async () => ([
  { source: '/api/status', headers: [
    { key: 'Cache-Control', value: 'no-store' }
  ]},
]);
module.exports.headers = headers;
=======
>>>>>>> 6f1c366 (ci(build): run Next from apps/website; make app own next.config + @ alias)
