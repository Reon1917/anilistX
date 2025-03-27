import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.myanimelist.net'],
    // Remove 'remote' key as it's causing the warning
  },
};

export default nextConfig; 