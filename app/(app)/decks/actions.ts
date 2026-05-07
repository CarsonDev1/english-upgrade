"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDeck(input: { name: string; description?: string; color?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  if (!input.name.trim()) return { error: "Name is required" };

  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      color: input.color || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/decks");
  revalidatePath("/vocabulary");
  return { id: data.id };
}

export async function deleteDeck(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("decks").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/decks");
  revalidatePath("/vocabulary");
  return { ok: true };
}

export async function renameDeck(id: string, name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  if (!name.trim()) return { error: "Name is required" };

  const { error } = await supabase
    .from("decks")
    .update({ name: name.trim() })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/decks");
  return { ok: true };
}
