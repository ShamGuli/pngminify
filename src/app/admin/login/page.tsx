"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const redirectTo = searchParams.get("redirectTo") || "/admin";
        router.replace(redirectTo);
      } else {
        setChecking(false);
      }
    });
  }, [router, searchParams]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/admin";
    router.push(redirectTo);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-md shadow-slate-200 sm:p-8">
        <div className="mb-6 text-center">
          <p className="mx-auto mb-2 inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10">
            PNG Minify Admin
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Sign in
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter your admin credentials to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="space-y-1">
            <span className="block text-xs font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary focus:ring-2"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="block text-xs font-medium text-slate-700">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary focus:ring-2"
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-page">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
