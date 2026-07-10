import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any HTTPS source
      },

    ],
    // Optionally tighten policy
    contentSecurityPolicy: "default-src 'self'; img-src 'self' https: data:; object-src 'none';",
  },
};

export default nextConfig;
