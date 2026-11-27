import { withKeltra } from "keltra/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    typedEnv: true,
    // Turbopack's on-disk build cache was ~360MB of the Vercel build cache and
    // made every deploy upload and restore it. Off = a much smaller cache.
    turbopackFileSystemCacheForBuild: false,
  },
  allowedDevOrigins:
    process.env.NODE_ENV === "development" ? ["192.168.18.*"] : undefined,
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withKeltra(nextConfig);
