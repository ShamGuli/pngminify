import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SchemaOrg from "@/components/SchemaOrg";

const GA_ID = "G-P0PY11QGW7";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = "Free PNG Compressor Online — Reduce PNG Size | PNG Minify";
const siteDescription =
  "Compress PNG images online for free. Reduce file size up to 80% without losing quality. No upload to server — 100% private.";
const siteUrl = "https://pngminify.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "PNG Minify",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PNG Minify — Free PNG Compressor Online",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6C47FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID || GA_ID;

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-page text-slate-900`}>
        {/* Google Analytics — afterInteractive: Chromium-based bot detects it */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
        </Script>

        {adsenseId && (
          <Script
            id="adsense-init"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}

        <SchemaOrg />
        {children}
      </body>
    </html>
  );
}
