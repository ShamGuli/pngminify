import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PNG Minify",
  description:
    "Learn how PNG Minify handles your data. All PNG compression runs entirely in your browser — no uploads.",
  alternates: { canonical: "https://pngminify.com/privacy" },
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 text-sm text-slate-700 sm:px-6 sm:py-14 lg:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: {year}</p>
        </header>

        <section className="space-y-3">
          <p>
            PNG Minify is a simple utility for compressing PNG images in your
            browser. We have designed the tool to be privacy-first by default.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            1. No image uploads
          </h2>
          <p>
            All compression happens entirely in your browser using
            JavaScript-based algorithms. Your PNG files are never sent to our
            servers or any third party service. The images remain on your
            device at all times.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            2. Analytics
          </h2>
          <p>
            We use Google Analytics to collect anonymous, aggregated data about
            how visitors use the site (page views, traffic sources, device
            types). This helps us improve the service. Google Analytics does
            not have access to the images you compress — those never leave your
            browser. You can opt out by using a browser extension or disabling
            JavaScript.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            3. Temporary in-memory processing
          </h2>
          <p>
            When you drop a PNG file onto PNG Minify, it is processed directly
            in the open browser tab. Once you close or refresh the page,
            everything is cleared from memory by your browser.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">4. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, you can reach us
            at{" "}
            <a
              href="mailto:hello@pngminify.com"
              className="text-primary underline-offset-2 hover:underline"
            >
              hello@pngminify.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

