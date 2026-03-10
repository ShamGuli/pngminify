import type { NextConfig } from "next";

const SUPABASE_HOST = "mhryztriafnzrueacpyk.supabase.co";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          ...(isDev
            ? []
            : [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com`,
              `connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net`,
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
