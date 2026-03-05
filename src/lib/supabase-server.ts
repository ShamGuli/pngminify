import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Supabase server client missing env vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }
    return null;
  }

  return createClient(url, anonKey);
}
