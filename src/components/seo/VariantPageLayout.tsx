import Link from "next/link";
import type { SeoVariant } from "@/lib/seo-variant-generator";
import { getRelatedVariants } from "@/lib/seo-variant-generator";

interface Props {
  variant: SeoVariant;
  children: React.ReactNode;
}

export default function VariantPageLayout({ variant, children }: Props) {
  const related = getRelatedVariants(variant.relatedSlugs);

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              PNG Compressor
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-700">{variant.h1}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-6 space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {variant.h1}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {variant.intro}
        </p>
      </header>

      {/* Tool — Compressor */}
      <section className="mb-10">{children}</section>

      {/* How-to Steps */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
          How to {variant.h1.toLowerCase()}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {variant.steps.map((step, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-4 shadow-sm shadow-slate-100"
            >
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                {i + 1}. {step.title}
              </h3>
              <p className="text-xs text-slate-600 sm:text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Long-form Content */}
      <section className="mb-10 space-y-4">
        {variant.bodyParagraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-slate-700">
            {p}
          </p>
        ))}
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {variant.faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {faq.q}
                </span>
                <span className="text-xs text-slate-500 group-open:hidden">
                  +
                </span>
                <span className="hidden text-xs text-slate-500 group-open:inline">
                  −
                </span>
              </summary>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Guides */}
      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
            Related compression guides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={r.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md"
              >
                {r.h1}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to main tool */}
      <div className="flex items-center gap-4 border-t border-slate-200 pt-6 text-sm">
        <Link
          href="/"
          className="font-medium text-primary transition hover:underline"
        >
          ← Back to PNG Compressor
        </Link>
        <Link
          href="/blog"
          className="text-slate-500 transition hover:text-slate-800"
        >
          Read the blog
        </Link>
        <Link
          href="/faq"
          className="text-slate-500 transition hover:text-slate-800"
        >
          FAQ
        </Link>
      </div>
    </>
  );
}
