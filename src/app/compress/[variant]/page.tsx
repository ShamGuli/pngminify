import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Compressor from "@/components/Compressor";
import VariantPageLayout from "@/components/seo/VariantPageLayout";
import {
  getVariant,
  getVariantSlugs,
} from "@/lib/seo-variant-generator";

const BASE_URL = "https://pngminify.com";

type Params = Promise<{ variant: string }>;

// ─── Static generation for all variants ───────
export function generateStaticParams() {
  return getVariantSlugs().map((slug) => ({ variant: slug }));
}

// ─── Dynamic metadata per variant ─────────────
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { variant: slug } = await params;
  const variant = getVariant(slug);

  if (!variant) {
    return { title: "Not Found | PNG Minify" };
  }

  const url = `${BASE_URL}/compress/${variant.slug}`;

  return {
    title: variant.title,
    description: variant.description,
    keywords: variant.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: variant.title,
      description: variant.description,
      url,
      siteName: "PNG Minify",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og.png`,
          width: 1200,
          height: 630,
          alt: variant.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: variant.title,
      description: variant.description,
      images: [`${BASE_URL}/og.png`],
    },
  };
}

// ─── Page component ───────────────────────────
export default async function VariantPage({
  params,
}: {
  params: Params;
}) {
  const { variant: slug } = await params;
  const variant = getVariant(slug);

  if (!variant) notFound();

  // JSON-LD schemas
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${variant.h1.toLowerCase()}`,
    description: variant.description,
    step: variant.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
    tool: {
      "@type": "HowToTool",
      name: "PNG Minify",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: variant.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PNG Compressor",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: variant.h1,
        item: `${BASE_URL}/compress/${variant.slug}`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToSchema, faqSchema, breadcrumbSchema]),
        }}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <VariantPageLayout variant={variant}>
          <Compressor />
        </VariantPageLayout>
      </main>

      <Footer />
    </div>
  );
}
