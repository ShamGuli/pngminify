import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Params = Promise<{ tag: string }>;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string | null;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `Posts tagged: ${decoded} | PNG Minify Blog`,
    description: `All blog posts tagged with "${decoded}" on PNG Minify.`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  let posts: Post[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("published", true)
      .contains("tags", [decoded])
      .order("created_at", { ascending: false });

    posts = (data as Post[]) ?? [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 space-y-3">
          <Link href="/blog" className="text-xs text-slate-500 hover:text-primary">
            ← Back to blog
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              #{decoded}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Posts tagged &ldquo;{decoded}&rdquo;
          </h1>
          <p className="text-sm text-slate-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">No posts found with this tag yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-xl bg-white text-sm text-slate-700 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {post.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="h-36 w-full object-cover"
                    loading="lazy"
                  />
                )}
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
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
