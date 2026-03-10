import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-2 text-6xl font-bold text-primary">404</p>
        <h1 className="mb-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Page not found
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90"
          >
            Go to PNG Compressor
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary"
          >
            Read the blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
