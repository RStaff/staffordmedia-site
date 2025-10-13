import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const __cfg:any = nextConfig as any;
__cfg.eslint = Object.assign({}, __cfg.eslint, { ignoreDuringBuilds: true });
__cfg.typescript = Object.assign({}, __cfg.typescript, { ignoreBuildErrors: true });
__cfg.experimental = Object.assign({}, __cfg.experimental, { outputFileTracingRoot: __dirname });
export default __cfg;
