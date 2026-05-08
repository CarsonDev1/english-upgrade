import { createClient } from "@/lib/supabase/server";
import { DecksManager } from "./decks-manager";
import { PageContainer, PageHeader } from "@/components/page-header";

export default async function DecksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: decks } = await supabase
    .from("decks")
    .select("id, name, description, color, created_at")
    .eq("user_id", user.id)
    .order("created_at");

  const { data: counts } = await supabase
    .from("vocabulary")
    .select("deck_id")
    .eq("user_id", user.id);

  const wordCount: Record<string, number> = {};
  (counts || []).forEach((row) => {
    if (row.deck_id) wordCount[row.deck_id] = (wordCount[row.deck_id] || 0) + 1;
  });

  return (
    <PageContainer size="lg">
      <PageHeader
        title="Decks"
        description="Nhóm từ vựng theo chủ đề để học tập trung hơn."
      />
      <DecksManager decks={(decks || []).map((d) => ({ ...d, word_count: wordCount[d.id] || 0 }))} />
    </PageContainer>
  );
}
