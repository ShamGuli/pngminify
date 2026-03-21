import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const API_SECRET = process.env.N8N_API_SECRET;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!API_SECRET || auth !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/blog", "page");
  revalidatePath("/", "page");
  revalidatePath("/sitemap.xml", "page");

  return NextResponse.json({ revalidated: true });
}
