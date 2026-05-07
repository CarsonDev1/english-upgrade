import { createClient } from "@/lib/supabase/server";
import { NewWordForm } from "./new-word-form";

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
    <div className="container max-w-5xl py-6 md:py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Add a new word</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Type a word, click <span className="font-medium text-foreground">AI fill</span> to auto-generate IPA, meaning, and examples.
        </p>
      </div>
      <NewWordForm decks={decks || []} />
    </div>
  );
}
