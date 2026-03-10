"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import TagsInput from "@/components/TagsInput";
import MarkdownEditor from "@/components/MarkdownEditor";

type EditPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditPostForm({ initialPost }: { initialPost: EditPost }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(initialPost);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EditPost>(key: K, value: EditPost[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadErr } = await supabase.storage
      .from("covers")
      .upload(fileName, file, { upsert: true });

    if (uploadErr) {
      setUploadError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("covers")
      .getPublicUrl(data.path);

    update("coverImage", urlData.publicUrl);
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content || null,
        cover_image: form.coverImage || null,
        tags: form.tags ?? [],
        published: form.published,
      })
      .eq("id", form.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/admin");
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const supabaseClient = getSupabaseBrowserClient();
    if (!supabaseClient) return;

    const { error: deleteError } = await supabaseClient
      .from("posts")
      .delete()
      .eq("id", form.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Edit Post
        </h1>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center justify-center rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-600 shadow-sm hover:bg-red-100"
        >
          Delete Post
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Title
          </span>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Slug
          </span>
          <input
            value={form.slug}
            onChange={(e) => update("slug", slugify(e.target.value))}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Excerpt
          </span>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Content (Markdown)
          </span>
          <MarkdownEditor
            value={form.content}
            onChange={(v) => update("content", v)}
            placeholder="## Başlıq... **qalın** mətn, siyahılar, cədvəllər..."
          />
        </label>

        <TagsInput
          value={form.tags ?? []}
          onChange={(t) => update("tags", t)}
          title={form.title}
          excerpt={form.excerpt}
        />

        {/* Cover Image */}
        <div className="space-y-2">
          <span className="block text-xs font-medium text-slate-700">
            Cover image
          </span>

          <div className="flex gap-2">
            <input
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              className="block min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="https://... (paste URL)"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
                  Uploading…
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                    />
                  </svg>
                  Upload
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {uploadError && (
            <p className="text-xs text-red-600">{uploadError}</p>
          )}

          {form.coverImage && (
            <div className="relative mt-1 w-full overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="h-36 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => update("coverImage", "")}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow hover:bg-red-50 hover:text-red-600"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary accent-primary"
          />
          <span className="text-xs font-medium text-slate-700">
            {form.published ? "Published" : "Draft (not visible on site)"}
          </span>
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
