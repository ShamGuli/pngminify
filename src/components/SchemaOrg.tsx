const BASE_URL = "https://pngminify.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "PNG Minify",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og.png`,
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "PNG Minify",
  url: BASE_URL,
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PNG Minify",
  url: BASE_URL,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Compress PNG images online for free. Reduce file size up to 80% without losing quality. No upload to server — 100% private.",
  featureList: [
    "Browser-side compression — files never leave your device",
    "Batch processing — compress up to 20 files at once",
    "No file upload required",
    "Download all as ZIP",
    "Adjustable compression level",
    "Transparent PNG support",
  ],
  screenshot: `${BASE_URL}/og.png`,
  creator: { "@id": `${BASE_URL}/#organization` },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compress PNG images online",
  description:
    "Compress PNG files for free using PNG Minify in three simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your PNG files",
      text: "Drag and drop your PNG images into the upload area or click to choose files. Up to 20 files, each up to 50 MB.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust compression level",
      text: "Use the quality slider to set compression. Lower values produce smaller files. Everything runs in your browser.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download compressed files",
      text: "Download individual optimized PNGs or click Download all for a ZIP archive.",
    },
  ],
  tool: { "@type": "HowToTool", name: "PNG Minify" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is PNG Minify free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PNG Minify is completely free. There are no hidden fees, subscriptions, or limits on the number of files you can compress.",
      },
    },
    {
      "@type": "Question",
      name: "Does my image get uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All compression happens entirely in your browser using JavaScript. Your images never leave your device and are never sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum file size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each PNG file can be up to 50 MB. You can compress up to 20 files at once.",
      },
    },
    {
      "@type": "Question",
      name: "How much can I compress a PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Results vary depending on the PNG content, but typical savings range from 30% to 80%. Photographic PNGs compress more than simple graphics or icons.",
      },
    },
    {
      "@type": "Question",
      name: "Do you support JPG, WEBP or other formats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG Minify focuses on PNG only. For WEBP files we recommend using miniwebp.com.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use PNG Minify for commercial projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can use the compressed images in any personal or commercial project.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a watermark on the output?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your images stay clean — we do not add any watermarks or visual marks to your PNGs.",
      },
    },
  ],
};

export default function SchemaOrg() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          organizationSchema,
          webSiteSchema,
          webAppSchema,
          howToSchema,
          faqSchema,
        ]),
      }}
    />
  );
}
