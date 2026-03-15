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
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/site.webmanifest",
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
  keywords: [
    "compress png",
    "png compressor",
    "png minify",
    "reduce png size",
    "compress png online",
    "free png compressor",
    "png optimizer",
    "shrink png",
    "png file size reducer",
    "compress png without losing quality",
    "batch png compression",
    "browser png compressor",
  ],
  alternates: {
    canonical: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: "@pngminify",
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRRTX99V');`}
        </Script>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased bg-page text-slate-900`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRRTX99V"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

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
