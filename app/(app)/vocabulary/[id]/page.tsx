import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { intervalLabel } from "@/lib/srs";
import { WordActions } from "./word-actions";
import { ExamplesSection } from "./examples-section";

export default async function VocabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: word } = await supabase
    .from("vocabulary")
    .select("*, decks(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!word) notFound();

  const { data: examples } = await supabase
    .from("examples")
    .select("*")
    .eq("vocabulary_id", id)
    .order("created_at");

  const nextReview = new Date(word.next_review_at);
  const overdue = nextReview <= new Date();

  return (
    <div className="container max-w-3xl py-6 md:py-10 space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/vocabulary"><ArrowLeft className="h-4 w-4 mr-1" /> Back to vocabulary</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">{word.word}</h1>
                <SpeakButton text={word.word} lang="en-US" />
                {word.word_class && <Badge variant="secondary">{word.word_class}</Badge>}
                {(word as any).decks && <Badge variant="outline">{(word as any).decks.name}</Badge>}
              </div>
              <div className="mt-2 space-y-0.5">
                {word.ipa_uk && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase text-muted-foreground w-7">UK</span>
                    <span className="ipa text-primary text-lg">{word.ipa_uk}</span>
                    <SpeakButton text={word.word} lang="en-GB" size="icon" className="h-7 w-7" />
                  </div>
                )}
                {word.ipa_us && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase text-muted-foreground w-7">US</span>
                    <span className="ipa text-primary text-lg">{word.ipa_us}</span>
                    <SpeakButton text={word.word} lang="en-US" size="icon" className="h-7 w-7" />
                  </div>
                )}
              </div>
            </div>
            <WordActions id={word.id} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {word.meaning_vi && (
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Vietnamese</p>
              <p>{word.meaning_vi}</p>
            </div>
          )}
          {word.definition_en && (
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground mb-1">English</p>
              <p>{word.definition_en}</p>
            </div>
          )}
          {word.notes && (
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{word.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">SRS status</CardTitle>
          <Badge variant={overdue ? "default" : "secondary"}>
            <Calendar className="h-3 w-3 mr-1" />
            {overdue ? "Due now" : `Due in ${intervalLabel(word.interval_days)}`}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Repetitions</p>
            <p className="text-xl font-semibold">{word.repetitions}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Interval</p>
            <p className="text-xl font-semibold">{intervalLabel(word.interval_days)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ease</p>
            <p className="text-xl font-semibold">{word.ease_factor.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <ExamplesSection vocabularyId={word.id} examples={examples || []} />
    </div>
  );
}
