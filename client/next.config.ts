import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for CDN deployment
  output: "standalone",

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Compiler options for production
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features
  experimental: {
    // Optimize package imports for better dev/build performance
    optimizePackageImports: [
      "lucide-react",
      "chart.js",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "framer-motion",
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "interlock",
  project: "interlock-client",

  widenClientFileUpload: true,

  tunnelRoute: "/monitoring",

  disableLogger: true,

  automaticVercelMonitors: true,
});
