import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API_SECRET = process.env.N8N_API_SECRET;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!API_SECRET || !auth) return false;
  return auth === `Bearer ${API_SECRET}`;
}

// GET /api/posts — list published posts
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, tags, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/posts — create a new post
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, slug, excerpt, content, cover_image, tags, published } = body as {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    cover_image?: string;
    tags?: string[];
    published?: boolean;
  };

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const finalSlug =
    slug ||
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content: content || null,
      cover_image: cover_image || null,
      tags: tags || [],
      published: published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
