import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The board moved to the homepage; keep old /opportunities links working.
  async redirects() {
    return [{ source: "/opportunities", destination: "/", permanent: false }];
  },
};

export default nextConfig;
