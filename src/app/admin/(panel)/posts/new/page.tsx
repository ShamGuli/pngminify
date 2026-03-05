"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import TagsInput from "@/components/TagsInput";
import MarkdownEditor from "@/components/MarkdownEditor";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) {
      setSlug(slugify(v));
    }
  }

  function handleSlugChange(v: string) {
    setSlug(slugify(v));
    setSlugEdited(true);
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

    setCoverImage(urlData.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("posts").insert({
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || null,
      content: content || null,
      cover_image: coverImage || null,
      tags: tags.length > 0 ? tags : [],
      published: true,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          New Post
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Title
          </span>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Slug{" "}
            <span className="font-normal text-slate-400">
              (auto-generated, edit to override)
            </span>
          </span>
          <input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="auto-generated-from-title"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Excerpt
          </span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-slate-700">
            Content (Markdown)
          </span>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="## Başlıq... **qalın** mətn, siyahılar, cədvəllər..."
          />
        </label>

        <TagsInput
          value={tags}
          onChange={setTags}
          title={title}
          excerpt={excerpt}
        />

        {/* Cover Image */}
        <div className="space-y-2">
          <span className="block text-xs font-medium text-slate-700">
            Cover image
          </span>

          <div className="flex gap-2">
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
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

          {coverImage && (
            <div className="relative mt-1 w-full overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Cover preview"
                className="h-36 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage("")}
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

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
      </form>
    </div>
  );
}
