"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/admin/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white shadow-sm">
            ADM
          </span>
          <span className="text-base font-semibold text-slate-900 sm:text-lg">
            PNG Minify Admin
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="hidden text-slate-500 transition-colors hover:text-slate-800 sm:inline"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {loading ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}

