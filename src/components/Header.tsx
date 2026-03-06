"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white shadow-sm">
            PNG
          </span>
          <span className="text-base font-semibold text-slate-900 sm:text-lg">
            PNG&nbsp;Minify
          </span>
        </Link>

        {/* Desktop nav — md (768px) and above */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile burger — below md (768px) only */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-100 transition hover:bg-slate-50 md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <span className="text-lg">&times;</span>
          ) : (
            <span className="text-lg">&#9776;</span>
          )}
        </button>
      </div>

      {/* Mobile dropdown — below md (768px) only */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mx-auto max-w-5xl border-t border-slate-200 bg-white shadow-md shadow-slate-200 md:hidden">
          <nav className="flex flex-col text-sm font-medium text-slate-700">
            {[...navItems, { href: "/contact", label: "Contact" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-b border-slate-100 px-6 py-4 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

