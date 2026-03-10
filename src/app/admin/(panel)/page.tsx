import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DeletePostButton from "@/components/DeletePostButton";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string | null;
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  let posts: PostRow[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, published, created_at")
      .order("created_at", { ascending: false });

    posts = (data as PostRow[]) ?? [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Posts
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Manage blog posts shown on pngminify.com.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500">
          No posts yet. Create your first post with the &quot;New Post&quot;
          button.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
          <table className="min-w-full text-left text-xs text-slate-700 sm:text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2">
                    <p className="line-clamp-1 font-medium text-slate-900">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{post.slug}</p>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {post.created_at &&
                      new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        post.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-xs">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="mr-2 text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mr-2 text-slate-500 hover:underline"
                    >
                      View
                    </Link>
                    <DeletePostButton id={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
