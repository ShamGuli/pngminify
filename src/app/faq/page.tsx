import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PNG Minify FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about PNG Minify: pricing, privacy, limits, and how PNG compression works.",
  alternates: { canonical: "https://pngminify.com/faq" },
};

const faqs = [
  {
    q: "Is PNG Minify free?",
    a: "Yes. PNG Minify is completely free to use. There are no hidden fees or usage limits.",
  },
  {
    q: "Does my image get uploaded to a server?",
    a: "No. All compression happens locally in your browser using JavaScript. Your PNGs never leave your device.",
  },
  {
    q: "What is the maximum file size?",
    a: "Each PNG file can be up to 50 MB, and you can compress up to 20 files at a time.",
  },
  {
    q: "How much can I compress a PNG?",
    a: "It depends on the image. Many PNGs can be reduced by 30–80% without visible quality loss, especially photographic content.",
  },
  {
    q: "Do you support JPG, WEBP or other formats?",
    a: "PNG Minify focuses on PNG only. For WEBP files we recommend using miniwebp.com.",
  },
  {
    q: "Can I use PNG Minify for commercial projects?",
    a: "Yes. You can use the compressed images in any personal or commercial project.",
  },
  {
    q: "Is there a watermark on the output?",
    a: "No. Your images stay clean — we do not add any watermarks or visual marks to your PNGs.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h1>
          <p className="max-w-xl text-sm text-slate-600">
            Short answers to the most common questions about PNG Minify.
          </p>
        </header>

        <section className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {item.q}
                </span>
                <span className="text-xs text-slate-500 group-open:hidden">
                  +
                </span>
                <span className="hidden text-xs text-slate-500 group-open:inline">
                  −
                </span>
              </summary>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                {item.a}
              </p>
            </details>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

