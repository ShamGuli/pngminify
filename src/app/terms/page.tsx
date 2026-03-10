import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — PNG Minify",
  description:
    "Terms of Service for using PNG Minify, a free browser-based PNG compression tool.",
  alternates: { canonical: "https://pngminify.com/terms" },
};

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 text-sm text-slate-700 sm:px-6 sm:py-14 lg:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Last updated: {year}</p>
        </header>

        <section className="space-y-3">
          <p>
            By using PNG Minify (the "Service"), you agree to the following
            terms. If you do not agree, please do not use the Service.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            1. Free utility, no guarantees
          </h2>
          <p>
            PNG Minify is provided as a free utility tool. While we aim for
            reliable operation, the Service is provided "as is" without any
            warranties of any kind.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            2. Your responsibility for backups
          </h2>
          <p>
            Always keep a backup of your original images. We are not
            responsible for any loss of data or quality resulting from using
            the Service.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            3. Acceptable use
          </h2>
          <p>
            You agree not to use PNG Minify for any illegal activities or to
            process content that is unlawful, harmful, or infringes on the
            rights of others.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">
            4. Changes to the Service
          </h2>
          <p>
            We may modify, suspend, or discontinue PNG Minify at any time
            without prior notice.
          </p>

          <h2 className="text-sm font-semibold text-slate-900">5. Contact</h2>
          <p>
            For questions about these terms, contact{" "}
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

