"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { reviewWord } from "../vocabulary/actions";
import { intervalLabel } from "@/lib/srs";
import { toast } from "sonner";
import { SpeakButton } from "@/components/speak-button";

interface Card {
  id: string;
  word: string;
  ipa_uk: string | null;
  ipa_us: string | null;
  word_class: string | null;
  meaning_vi: string | null;
  definition_en: string | null;
  notes: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  examples: { id: string; sentence: string; translation_vi: string | null }[];
}

const RATINGS: { rating: 1 | 2 | 3 | 4; label: string; sublabel: string; variant: "destructive" | "secondary" | "default" | "outline" }[] = [
  { rating: 1, label: "Again", sublabel: "<10m", variant: "destructive" },
  { rating: 2, label: "Hard", sublabel: "shorter", variant: "outline" },
  { rating: 3, label: "Good", sublabel: "normal", variant: "secondary" },
  { rating: 4, label: "Easy", sublabel: "longer", variant: "default" },
];

export function ReviewSession({ cards: initialCards }: { cards: Card[] }) {
  const [cards] = useState(initialCards);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [, start] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  const total = cards.length;
  const card = cards[idx];

  if (!card) {
    const reviewed = stats.again + stats.hard + stats.good + stats.easy;
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">Session complete!</p>
              <p className="text-sm text-muted-foreground mt-1">You reviewed {reviewed} words.</p>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto pt-2">
              <Stat label="Again" value={stats.again} color="text-destructive" />
              <Stat label="Hard" value={stats.hard} />
              <Stat label="Good" value={stats.good} />
              <Stat label="Easy" value={stats.easy} color="text-primary" />
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button asChild><Link href="/dashboard">Back to dashboard</Link></Button>
              <Button asChild variant="outline"><Link href="/vocabulary/new"><Sparkles className="mr-1" />Add word</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function rate(r: 1 | 2 | 3 | 4) {
    if (submitting) return;
    setSubmitting(true);
    start(async () => {
      const result = await reviewWord(card.id, r);
      setSubmitting(false);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      const intvl = (result as any).interval_days as number;
      const key = r === 1 ? "again" : r === 2 ? "hard" : r === 3 ? "good" : "easy";
      setStats((s) => ({ ...s, [key]: s[key] + 1 }));
      toast.success(r === 1 ? "Will see again soon" : `Next review in ${intervalLabel(intvl)}`, { duration: 1500 });
      setRevealed(false);
      setIdx(idx + 1);
    });
  }

  return (
    <div className="container max-w-2xl py-6 md:py-10 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Card {idx + 1} / {total}</span>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Quit</Link>
        </div>
        <Progress value={((idx) / total) * 100} />
      </div>

      <Card className="min-h-[400px]">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{card.word}</h2>
              <SpeakButton text={card.word} lang="en-US" />
            </div>
            {card.word_class && <Badge variant="secondary">{card.word_class}</Badge>}
          </div>

          {!revealed ? (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">Recall the meaning. Then reveal.</p>
              <Button size="lg" onClick={() => setRevealed(true)}>
                Show answer <ChevronRight className="ml-1" />
              </Button>
            </div>
          ) : (
            <div className="mt-6 w-full space-y-4 text-left">
              {card.ipa_uk && (
                <div className="flex items-center gap-2 justify-center">
                  <span className="ipa text-primary text-xl">{card.ipa_uk}</span>
                  <SpeakButton text={card.word} lang="en-GB" size="icon" className="h-7 w-7" />
                  {card.ipa_us && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="ipa text-primary text-xl">{card.ipa_us}</span>
                      <SpeakButton text={card.word} lang="en-US" size="icon" className="h-7 w-7" />
                    </>
                  )}
                </div>
              )}
              {card.meaning_vi && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs uppercase font-medium text-muted-foreground">Vietnamese</p>
                  <p className="mt-1">{card.meaning_vi}</p>
                </div>
              )}
              {card.definition_en && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs uppercase font-medium text-muted-foreground">English</p>
                  <p className="mt-1">{card.definition_en}</p>
                </div>
              )}
              {card.examples.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase font-medium text-muted-foreground">Examples</p>
                  {card.examples.slice(0, 2).map((ex) => (
                    <div key={ex.id} className="rounded-md border p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <p className="flex-1">{ex.sentence}</p>
                        <SpeakButton text={ex.sentence} size="icon" className="h-6 w-6 shrink-0" />
                      </div>
                      {ex.translation_vi && <p className="text-muted-foreground mt-1">{ex.translation_vi}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {revealed && (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <Button
              key={r.rating}
              variant={r.variant}
              onClick={() => rate(r.rating)}
              disabled={submitting}
              className="flex-col h-auto py-3"
            >
              <span className="font-semibold">{r.label}</span>
              <span className="text-[10px] opacity-70 font-normal">{r.sublabel}</span>
            </Button>
          ))}
        </div>
      )}

      {revealed && (
        <p className="text-center text-xs text-muted-foreground">
          <RotateCcw className="inline h-3 w-3 mr-1" /> Hotkeys: 1 Again · 2 Hard · 3 Good · 4 Easy
        </p>
      )}

      <KeyboardShortcuts revealed={revealed} onReveal={() => setRevealed(true)} onRate={rate} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-md border p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color || ""}`}>{value}</p>
    </div>
  );
}

function KeyboardShortcuts({
  revealed,
  onReveal,
  onRate,
}: {
  revealed: boolean;
  onReveal: () => void;
  onRate: (r: 1 | 2 | 3 | 4) => void;
}) {
  if (typeof window !== "undefined") {
    if (!(window as any).__reviewShortcutsBound) {
      (window as any).__reviewShortcutsBound = true;
    }
  }
  // Simple effect-less binding
  if (typeof document !== "undefined") {
    document.onkeydown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onReveal();
        return;
      }
      if (revealed) {
        if (e.key === "1") onRate(1);
        if (e.key === "2") onRate(2);
        if (e.key === "3") onRate(3);
        if (e.key === "4") onRate(4);
      }
    };
  }
  return null;
}
