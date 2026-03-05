"use client";

import { useState } from "react";

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "is","are","was","were","be","been","have","has","had","do","does","did",
  "will","would","could","should","may","might","can","this","that","these",
  "those","it","its","i","you","we","they","he","she","how","what","why",
  "when","where","which","who","your","my","our","their","by","from","as",
  "into","not","no","so","if","than","then","about","up","out","png","image",
]);

export function autoGenerateTags(title: string, excerpt: string): string[] {
  const text = `${title} ${excerpt}`.toLowerCase();
  const words = text.replace(/[^a-z0-9\s-]/g, " ").split(/\s+/);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      freq[w] = (freq[w] ?? 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
}

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  title?: string;
  excerpt?: string;
};

export default function TagsInput({ value, onChange, title = "", excerpt = "" }: Props) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleAutoSuggest() {
    const suggested = autoGenerateTags(title, excerpt);
    const merged = [...new Set([...value, ...suggested])];
    onChange(merged);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-xs font-medium text-slate-700">
          Tags{" "}
          <span className="font-normal text-slate-400">
            (Enter or comma to add)
          </span>
        </span>
        {(title || excerpt) && (
          <button
            type="button"
            onClick={handleAutoSuggest}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            ✨ Auto-suggest from title
          </button>
        )}
      </div>

      <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 text-primary/60 hover:text-primary"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={value.length === 0 ? "png, compression, tutorial…" : ""}
        />
      </div>
    </div>
  );
}
