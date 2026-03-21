import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "PNG Minify Blog — Tips for Faster, Lighter PNG Images",
  description:
    "Learn how to optimize PNG images for the web. Guides on compression, performance, best practices, and image workflows.",
  alternates: { canonical: "https://pngminify.com/blog" },
  openGraph: {
    title: "PNG Minify Blog — PNG Optimization Guides",
    description:
      "Deep dives on PNG optimization, performance tips, and image workflows for modern web apps.",
    url: "https://pngminify.com/blog",
    type: "website",
  },
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[] | null;
  created_at: string | null;
};

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  let errorMessage: string | null = null;

  if (!supabase) {
    // Supabase not configured — show empty state without crashing
    errorMessage = "Blog is not configured yet.";
  } else {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, tags, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        errorMessage = "Could not load posts from Supabase.";
      } else {
        posts = (data as Post[]) ?? [];
      }
    } catch {
      errorMessage = "Unexpected error while loading blog posts.";
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <div className="mb-4 flex justify-center">
          <AdBanner
            className="w-full max-w-[728px]"
            slot="3333333333"
            style={{ display: "block", width: "100%", height: 90 }}
          />
        </div>
        <header className="mb-6 space-y-3">
          <p className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10">
            Blog
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            PNG optimization tips &amp; best practices
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Articles about PNG compression, performance budgets, and image
            workflows for modern websites and products.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-6 text-sm text-red-600">{errorMessage}</p>
        )}

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">
            No posts have been published yet. Once you add posts in Supabase,
            they will appear here automatically.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col overflow-hidden rounded-xl bg-white text-sm text-slate-700 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image || "/og.png"}
                        alt={post.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-1 flex-col p-4">
                        <h2 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-900">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="line-clamp-3 text-xs text-slate-600 sm:text-sm">
                            {post.excerpt}
                          </p>
                        )}
                        {post.created_at && (
                          <p className="mt-3 text-[11px] text-slate-400">
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    </Link>

                    {(index + 1) % 3 === 0 && index !== posts.length - 1 && (
                      <div className="sm:col-span-2 lg:col-span-3 flex justify-center">
                        <AdBanner
                          className="w-full max-w-sm"
                          slot="4444444444"
                          style={{ display: "block", width: "100%", height: 280 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Tag cloud — after posts */}
            {(() => {
              const allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();
              return allTags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <a
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              ) : null;
            })()}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

