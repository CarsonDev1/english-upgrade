import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { DecksManager } from "./decks-manager";

export default async function DecksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: decks } = await supabase
    .from("decks")
    .select("id, name, description, color, created_at")
    .eq("user_id", user.id)
    .order("created_at");

  // Count words per deck
  const { data: counts } = await supabase
    .from("vocabulary")
    .select("deck_id")
    .eq("user_id", user.id);

  const wordCount: Record<string, number> = {};
  (counts || []).forEach((row) => {
    if (row.deck_id) wordCount[row.deck_id] = (wordCount[row.deck_id] || 0) + 1;
  });

  return (
    <div className="container max-w-5xl py-6 md:py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decks</h1>
        <p className="text-muted-foreground mt-1">Group your vocabulary by topic.</p>
      </div>

      <DecksManager decks={(decks || []).map((d) => ({ ...d, word_count: wordCount[d.id] || 0 }))} />
    </div>
  );
}
