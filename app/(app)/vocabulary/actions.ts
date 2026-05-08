"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applySRS } from "@/lib/srs";

export interface SaveWordInput {
  word: string;
  ipa_uk?: string;
  ipa_us?: string;
  word_class?: string;
  meaning_vi?: string;
  definition_en?: string;
  notes?: string;
  image_url?: string;
  deck_id?: string | null;
  ai_generated?: boolean;
  examples?: { sentence: string; translation_vi?: string; ai_generated?: boolean }[];
}

export async function saveWord(input: SaveWordInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const trimmed = input.word.trim();
  if (!trimmed) return { error: "Word is required" };

  const { data: vocab, error } = await supabase
    .from("vocabulary")
    .insert({
      user_id: user.id,
      deck_id: input.deck_id ?? null,
      word: trimmed,
      ipa_uk: input.ipa_uk || null,
      ipa_us: input.ipa_us || null,
      word_class: input.word_class || null,
      meaning_vi: input.meaning_vi || null,
      definition_en: input.definition_en || null,
      notes: input.notes || null,
      image_url: input.image_url || null,
      ai_generated: input.ai_generated ?? false,
    })
    .select()
    .single();

  if (error || !vocab) return { error: error?.message || "Failed to save" };

  if (input.examples && input.examples.length > 0) {
    const rows = input.examples
      .filter((e) => e.sentence?.trim())
      .map((e) => ({
        vocabulary_id: vocab.id,
        sentence: e.sentence.trim(),
        translation_vi: e.translation_vi || null,
        ai_generated: e.ai_generated ?? false,
      }));
    if (rows.length > 0) {
      await supabase.from("examples").insert(rows);
    }
  }

  revalidatePath("/vocabulary");
  revalidatePath("/dashboard");
  return { id: vocab.id };
}

export async function updateWord(id: string, input: Partial<SaveWordInput>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("vocabulary")
    .update({
      word: input.word,
      ipa_uk: input.ipa_uk,
      ipa_us: input.ipa_us,
      word_class: input.word_class,
      meaning_vi: input.meaning_vi,
      definition_en: input.definition_en,
      notes: input.notes,
      image_url: input.image_url,
      deck_id: input.deck_id,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/vocabulary");
  revalidatePath(`/vocabulary/${id}`);
  return { ok: true };
}

export async function deleteWord(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("vocabulary")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/vocabulary");
  redirect("/vocabulary");
}

export async function addExample(vocabularyId: string, sentence: string, translation_vi?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // RLS verifies ownership via vocabulary parent.
  const { error } = await supabase.from("examples").insert({
    vocabulary_id: vocabularyId,
    sentence: sentence.trim(),
    translation_vi: translation_vi || null,
    ai_generated: false,
  });
  if (error) return { error: error.message };
  revalidatePath(`/vocabulary/${vocabularyId}`);
  return { ok: true };
}

export async function deleteExample(exampleId: string, vocabularyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("examples").delete().eq("id", exampleId);
  if (error) return { error: error.message };
  revalidatePath(`/vocabulary/${vocabularyId}`);
  return { ok: true };
}

export async function reviewWord(id: string, rating: 1 | 2 | 3 | 4) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: card, error: fetchErr } = await supabase
    .from("vocabulary")
    .select("ease_factor, interval_days, repetitions")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !card) return { error: "Card not found" };

  const result = applySRS(card, rating);

  await Promise.all([
    supabase
      .from("vocabulary")
      .update({
        ease_factor: result.ease_factor,
        interval_days: result.interval_days,
        repetitions: result.repetitions,
        next_review_at: result.next_review_at.toISOString(),
        last_reviewed_at: result.last_reviewed_at.toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id),
    supabase.from("review_logs").insert({
      vocabulary_id: id,
      user_id: user.id,
      rating,
    }),
  ]);

  revalidatePath("/review");
  revalidatePath("/dashboard");
  return { ok: true, next_review_at: result.next_review_at.toISOString(), interval_days: result.interval_days };
}
