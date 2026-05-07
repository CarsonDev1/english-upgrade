import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWord } from "@/lib/groq";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { word?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const word = body.word?.trim();
  if (!word) return NextResponse.json({ error: "Word is required" }, { status: 400 });
  if (word.length > 100) return NextResponse.json({ error: "Word too long" }, { status: 400 });

  try {
    const result = await generateWord(word);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[generate-word]", err);
    return NextResponse.json(
      { error: err?.message || "AI generation failed" },
      { status: 500 },
    );
  }
}
