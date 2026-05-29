import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@launchpad/shared", "@launchpad/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
