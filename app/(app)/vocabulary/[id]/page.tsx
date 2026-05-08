import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { intervalLabel } from "@/lib/srs";
import { WordActions } from "./word-actions";
import { ExamplesSection } from "./examples-section";
import { PageContainer } from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <PageContainer size="default">
      <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 text-muted-foreground hover:text-foreground">
        <Link href="/vocabulary">
          <ArrowLeft className="h-4 w-4" /> Back to vocabulary
        </Link>
      </Button>

      {/* Hero word card */}
      <Card className="surface-elevated overflow-hidden">
        <div className="h-1 bg-primary" />
        <CardHeader className="pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {word.ai_generated && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Sparkles className="h-3 w-3 text-primary" /> AI generated
                  </Badge>
                )}
                {word.word_class && <Badge variant="secondary">{word.word_class}</Badge>}
                {(word as any).decks && <Badge variant="outline">{(word as any).decks.name}</Badge>}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{word.word}</h1>
                <SpeakButton text={word.word} lang="en-US" />
              </div>
              <div className="space-y-1.5">
                {word.ipa_uk && (
                  <PronunciationRow label="UK" ipa={word.ipa_uk} word={word.word} lang="en-GB" />
                )}
                {word.ipa_us && (
                  <PronunciationRow label="US" ipa={word.ipa_us} word={word.word} lang="en-US" />
                )}
              </div>
            </div>
            <WordActions id={word.id} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {word.image_url && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={word.image_url}
                alt={word.word}
                loading="lazy"
                className="w-full max-w-xs aspect-square rounded-2xl object-contain bg-muted/30 border"
              />
            </div>
          )}
          {word.meaning_vi && <DefinitionBlock label="Tiếng Việt" body={word.meaning_vi} />}
          {word.definition_en && <DefinitionBlock label="English" body={word.definition_en} />}
          {word.notes && <DefinitionBlock label="Ghi chú" body={word.notes} mono />}
        </CardContent>
      </Card>

      {/* SRS status */}
      <Card className="surface-elevated">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">SRS status</CardTitle>
          <Badge
            variant={overdue ? "default" : "secondary"}
            className={overdue ? "bg-primary text-primary-foreground" : ""}
          >
            <Calendar className="h-3 w-3" />
            {overdue ? "Due now" : `Due in ${intervalLabel(word.interval_days)}`}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <SRSStat label="Repetitions" value={word.repetitions} />
          <SRSStat label="Interval" value={intervalLabel(word.interval_days)} />
          <SRSStat label="Ease" value={word.ease_factor.toFixed(2)} />
        </CardContent>
      </Card>

      <ExamplesSection vocabularyId={word.id} examples={examples || []} />
    </PageContainer>
  );
}

function PronunciationRow({
  label,
  ipa,
  word,
  lang,
}: {
  label: string;
  ipa: string;
  word: string;
  lang: "en-US" | "en-GB";
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-5 min-w-[26px] items-center justify-center rounded-md bg-muted px-1.5 text-[10px] font-bold tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="ipa text-primary text-lg">{ipa}</span>
      <SpeakButton text={word} lang={lang} size="icon" className="h-7 w-7" />
    </div>
  );
}

function DefinitionBlock({ label, body, mono = false }: { label: string; body: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={mono ? "text-sm whitespace-pre-wrap leading-relaxed" : "leading-relaxed"}>{body}</p>
    </div>
  );
}

function SRSStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
}
