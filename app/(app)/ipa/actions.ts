"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markLessonMastered(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("ipa_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId, mastered_at: new Date().toISOString() },
      { onConflict: "user_id,lesson_id" },
    );
  if (error) return { error: error.message };
  revalidatePath("/ipa");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function unmarkLessonMastered(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("ipa_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);
  if (error) return { error: error.message };
  revalidatePath("/ipa");
  return { ok: true };
}
