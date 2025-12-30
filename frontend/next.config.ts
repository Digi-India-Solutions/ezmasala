import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    /**
     * ✅ CRITICAL FIX
     * Disables Next.js image optimizer (/ _next/image)
     * Required when using:
     * - standalone build
     * - nginx
     * - serving images from /public
     */
    unoptimized: true,

    /**
     * ✅ OPTIONAL
     * Keep this ONLY if you actually use Cloudinary
     * Does NOT interfere with local images
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  /**
   * ⚠️ This is unrelated to image issues
   * Keep only if you are proxying /api via Next.js
   */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://ezmasalaa.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, Accept, Origin",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;