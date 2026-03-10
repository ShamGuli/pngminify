"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setDeleting(true);
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:text-red-700 hover:underline disabled:opacity-50"
    >
      {deleting ? "…" : "Delete"}
    </button>
  );
}
