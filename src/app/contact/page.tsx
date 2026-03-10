import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — PNG Minify",
  description:
    "Get in touch with the PNG Minify team. Ask questions, send feedback, or suggest new features.",
  alternates: { canonical: "https://pngminify.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-10 text-sm text-slate-700 sm:px-6 sm:py-14 lg:py-16">
        <div className="mb-6 flex w-full max-w-xl flex-col gap-2 text-center">
          <p className="mx-auto inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10">
            Get in touch
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Contact PNG Minify
          </h1>
          <p className="text-sm text-slate-600">
            Have a question, bug report, or feature idea? Send us a quick
            message — we&apos;d love to hear from you.
          </p>
        </div>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

