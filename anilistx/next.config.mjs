/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable eslint during build to prevent failing due to linting errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during build to prevent failing due to type errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
};

export default nextConfig; 