import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

type Params = Promise<{ slug: string }>;

function estimateReadTime(text: string | null | undefined): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

async function getPost(slug: string): Promise<Post | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, tags, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

export async function generateStaticParams() {
  if (!supabase) return [];

  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Params },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {
      title: "Post not found | PNG Minify Blog",
    };
  }

  const baseUrl = "https://pngminify.com";
  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | PNG Minify Blog`,
    description:
      post.excerpt ??
      "PNG optimization tips and best practices from PNG Minify.",
    openGraph: {
      title: post.title,
      description:
        post.excerpt ??
        "PNG optimization tips and best practices from PNG Minify.",
      url,
      type: "article",
      images: post.cover_image ? [post.cover_image] : ["/og.png"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  let related: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    created_at: string | null;
  }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("published", true)
      .neq("id", post.id)
      .order("created_at", { ascending: false })
      .limit(3);

    related = (data as typeof related) ?? [];
  }

  const readTime = estimateReadTime(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description:
      post.excerpt ??
      "PNG optimization tips and best practices from PNG Minify.",
    image: post.cover_image ? [post.cover_image] : ["https://pngminify.com/og.png"],
    url: `https://pngminify.com/blog/${post.slug}`,
    datePublished: post.created_at ?? undefined,
    dateModified: post.updated_at ?? post.created_at ?? undefined,
    author: {
      "@type": "Organization",
      name: "PNG Minify",
      url: "https://pngminify.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PNG Minify",
      logo: {
        "@type": "ImageObject",
        url: "https://pngminify.com/og.png",
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <header className="mb-8 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Link href="/blog" className="hover:text-primary">
              ← Back to blog
            </Link>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              {post.excerpt}
            </p>
          )}
          {post.created_at && (
            <p className="text-xs text-slate-400">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </header>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="mb-8 h-56 w-full rounded-xl object-cover sm:h-72"
          />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <a
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        <article className="prose prose-sm max-w-none text-slate-800 prose-headings:text-slate-900 prose-a:text-primary prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-slate-200 prose-td:px-4 prose-td:py-2 sm:prose-base">
          {post.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) =>
                  href?.startsWith("http") ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {children}
                    </a>
                  ) : (
                    <Link href={href ?? "#"} className="text-primary underline-offset-2 hover:underline">
                      {children}
                    </Link>
                  ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          ) : (
            <p>
              This post does not have any content yet. Please add content in
              Supabase.
            </p>
          )}
        </article>

        {/* In-article ad */}
        <div className="my-8 flex justify-center">
          <AdBanner
            className="w-full max-w-sm"
            slot="5555555555"
            style={{ display: "block", width: "100%", height: 280 }}
          />
        </div>

        {related && related.length > 0 && (
          <section className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              Related posts
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="flex flex-col justify-between rounded-xl bg-white p-3 text-xs text-slate-700 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md sm:text-sm"
                >
                  <div>
                    <p className="mb-1 line-clamp-2 font-medium text-slate-900">
                      {r.title}
                    </p>
                    {r.excerpt && (
                      <p className="line-clamp-3 text-[11px] text-slate-600 sm:text-xs">
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                  {r.created_at && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

