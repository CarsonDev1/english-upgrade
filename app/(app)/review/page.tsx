import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from "lucide-react";
import { ReviewSession } from "./review-session";

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const nowIso = new Date().toISOString();

  const { data: due } = await supabase
    .from("vocabulary")
    .select(`
      id, word, ipa_uk, ipa_us, word_class, meaning_vi, definition_en, notes,
      ease_factor, interval_days, repetitions,
      examples(id, sentence, translation_vi)
    `)
    .eq("user_id", user.id)
    .lte("next_review_at", nowIso)
    .order("next_review_at")
    .limit(50);

  const cards = (due || []) as any[];

  if (cards.length === 0) {
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-semibold">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No words are due for review right now.</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button asChild><Link href="/vocabulary/new">Add new word</Link></Button>
              <Button asChild variant="outline"><Link href="/vocabulary"><BookOpen className="mr-1" /> Browse vocabulary</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ReviewSession cards={cards} />;
}
