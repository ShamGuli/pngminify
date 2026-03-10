import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import EditPostForm from "./EditPostForm";

type Params = Promise<{ id: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image, tags, published")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <EditPostForm
      initialPost={{
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        coverImage: data.cover_image ?? "",
        tags: (data.tags as string[]) ?? [],
        published: data.published ?? false,
      }}
    />
  );
}
