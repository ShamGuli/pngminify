import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
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
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          ...(isDev
            ? []
            : [
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'self'",
                    // unsafe-inline required for Next.js inline scripts & GTM/GA4; unsafe-eval only in dev
                    `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com 'unsafe-inline'`,
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com",
                    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com",
                    "worker-src 'self' blob:",
                    "frame-src 'self' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
                    "frame-ancestors 'none'",
                    "form-action 'self'",
                    "base-uri 'self'",
                    "object-src 'none'",
                    "font-src 'self'",
                  ].join("; "),
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
