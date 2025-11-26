import type { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['localhost', 'res.cloudinary.com'], // Add other domains as needed
  },
} as NextConfig;

export default nextConfig;
