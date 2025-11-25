import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy to Backend
      },
    ];
  },
  images: {
    domains: ["localhost", "res.cloudinary.com"], // Add other domains as needed
  },
};

export default nextConfig;
