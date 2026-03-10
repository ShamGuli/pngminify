"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:hello@pngminify.com?subject=${encodeURIComponent(subject || "PNG Minify Contact")}&body=${encodeURIComponent(`Hi,\n\n${message}\n\nFrom: ${name}`)}`;

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-md shadow-slate-200 sm:p-7">
      <form className="space-y-4 text-sm">
        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Your name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary focus:ring-2"
            placeholder="John Doe"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary focus:ring-2"
            placeholder="Bug report, feature request, etc."
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block min-h-[140px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary focus:ring-2"
            placeholder="How can we help?"
          />
        </label>

        <a
          href={mailtoHref}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Open in email app
        </a>

        <p className="pt-2 text-center text-xs text-slate-500">
          Or email us directly:{" "}
          <a
            href="mailto:hello@pngminify.com"
            className="text-primary underline-offset-2 hover:underline"
          >
            hello@pngminify.com
          </a>
        </p>
      </form>
    </div>
  );
}
