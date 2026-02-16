import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'img.youtube.com' },
    ],
  },
};

export default nextConfig;
