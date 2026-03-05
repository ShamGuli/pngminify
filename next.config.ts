import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mhryztriafnzrueacpyk.supabase.co",
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
                  value:
                    "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://pagead2.googlesyndication.com 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://mhryztriafnzrueacpyk.supabase.co; connect-src 'self' https://mhryztriafnzrueacpyk.supabase.co https://www.google-analytics.com; frame-ancestors 'none';",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
