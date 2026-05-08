import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, PartyPopper } from "lucide-react";
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
      <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto">
        <Card className="surface-elevated">
          <CardContent className="py-16 text-center space-y-5">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              <PartyPopper className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">All caught up!</p>
              <p className="text-muted-foreground mt-1">
                Không có từ nào cần ôn ngay bây giờ. Quay lại sau.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild>
                <Link href="/vocabulary/new">
                  <Sparkles /> Add new word
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/vocabulary">
                  <BookOpen /> Browse vocabulary
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ReviewSession cards={cards} />;
}
