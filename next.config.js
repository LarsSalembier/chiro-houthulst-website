/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  // This is required for Posthog to work properly
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  // This makes react run in strict mode
  reactStrictMode: true,

  // This makes sure that the build is optimized
  swcMinify: true,

  // This allows us to use the next/image component with remote images from utfs.io (UploadThing)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },

  // Improve build speed by ignoring typechecking and linting
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Redirects for dumb routes
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/accounts",
        permanent: true,
      },
      {
        source: "/leiding",
        destination: "/leiding/afdelingen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
