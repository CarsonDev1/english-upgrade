import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { warmImageUrl } from "@/lib/image";
import { generateVisualSubject } from "@/lib/groq";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    word?: string;
    meaning_vi?: string;
    definition_en?: string;
    word_class?: string;
    regenerate?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const word = body.word?.trim();
  if (!word) return NextResponse.json({ error: "Word is required" }, { status: 400 });
  if (word.length > 100) return NextResponse.json({ error: "Word too long" }, { status: 400 });

  // Step 1: ask Groq for a concrete drawable scene so the diffusion model
  // doesn't have to guess what e.g. "text (verb)" should look like.
  let visualSubject = "";
  try {
    visualSubject = await generateVisualSubject(word, body.word_class, body.definition_en);
  } catch (err) {
    console.warn("[generate-image] visual subject failed, falling back", err);
  }

  const seed = body.regenerate ? Math.floor(Math.random() * 1_000_000) : undefined;
  try {
    const url = await warmImageUrl(
      {
        word,
        meaning_vi: body.meaning_vi,
        definition_en: body.definition_en,
        word_class: body.word_class,
        visual_subject: visualSubject || undefined,
      },
      { seed },
    );
    return NextResponse.json({ url, visual_subject: visualSubject });
  } catch (err: any) {
    console.error("[generate-image]", err);
    return NextResponse.json({ error: err?.message || "Image gen failed" }, { status: 500 });
  }
}
