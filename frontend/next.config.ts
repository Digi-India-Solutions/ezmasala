// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//     ],
//   },
//   async headers() {
//     return [
//       {
//         // Apply CORS headers to all API routes
//         source: "/api/:path*",
//         headers: [
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "*", // Allow all origins - you can restrict this to specific domains
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value: "Content-Type, Authorization, X-Requested-With, Accept, Origin",
//           },
//           {
//             key: "Access-Control-Allow-Credentials",
//             value: "true",
//           },
//           {
//             key: "Access-Control-Max-Age",
//             value: "86400",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://ezmasalaa.com", // ⚠️ DO NOT use "*"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With, Accept, Origin",
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
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = { 