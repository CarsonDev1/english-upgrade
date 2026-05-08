import { createClient } from "@/lib/supabase/server";
import { NewWordForm } from "./new-word-form";
import { PageContainer, PageHeader } from "@/components/page-header";

export default async function NewWordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: decks } = await supabase
    .from("decks")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at");

  return (
    <PageContainer size="lg">
      <PageHeader
        title="Add a new word"
        backHref="/vocabulary"
        backLabel="Back to vocabulary"
        description={
          <>
            Nhập từ rồi bấm <span className="font-medium text-foreground">AI fill</span> để tự sinh IPA, nghĩa và ví dụ.
          </>
        }
      />
      <NewWordForm decks={decks || []} />
    </PageContainer>
  );
}
