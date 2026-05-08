"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, RotateCcw, CheckCircle2, Sparkles, Keyboard, X } from "lucide-react";
import { reviewWord } from "../vocabulary/actions";
import { intervalLabel } from "@/lib/srs";
import { toast } from "sonner";
import { SpeakButton } from "@/components/speak-button";
import { cn } from "@/lib/utils";

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

const RATINGS: { rating: 1 | 2 | 3 | 4; label: string; sublabel: string; tone: string }[] = [
  { rating: 1, label: "Again", sublabel: "<10m", tone: "destructive" },
  { rating: 2, label: "Hard", sublabel: "shorter", tone: "warning" },
  { rating: 3, label: "Good", sublabel: "normal", tone: "primary" },
  { rating: 4, label: "Easy", sublabel: "longer", tone: "success" },
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

  function rate(r: 1 | 2 | 3 | 4) {
    if (submitting || !card) return;
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
      toast.success(r === 1 ? "Will see again soon" : `Next review in ${intervalLabel(intvl)}`, {
        duration: 1500,
      });
      setRevealed(false);
      setIdx((i) => i + 1);
    });
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        if (e.key === "1") rate(1);
        if (e.key === "2") rate(2);
        if (e.key === "3") rate(3);
        if (e.key === "4") rate(4);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) {
    const reviewed = stats.again + stats.hard + stats.good + stats.easy;
    return (
      <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto">
        <Card className="surface-elevated">
          <CardContent className="py-16 text-center space-y-5">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">Session complete!</p>
              <p className="text-muted-foreground mt-1">
                Bạn đã ôn xong <span className="font-semibold text-foreground">{reviewed}</span> từ. Tuyệt vời!
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto pt-2">
              <SessionStat label="Again" value={stats.again} tone="destructive" />
              <SessionStat label="Hard" value={stats.hard} tone="warning" />
              <SessionStat label="Good" value={stats.good} tone="primary" />
              <SessionStat label="Easy" value={stats.easy} tone="success" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild>
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/vocabulary/new">
                  <Sparkles /> Add word
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPct = (idx / total) * 100;

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto space-y-4">
      {/* Top bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Card <span className="text-primary">{idx + 1}</span>{" "}
            <span className="text-muted-foreground">/ {total}</span>
          </span>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Quit
          </Link>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Card */}
      <Card className="surface-elevated min-h-[420px] overflow-hidden">
        <div className="h-1 bg-primary" />
        <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{card.word}</h2>
              <SpeakButton text={card.word} lang="en-US" />
            </div>
            {card.word_class && (
              <Badge variant="secondary" className="font-normal">
                {card.word_class}
              </Badge>
            )}
          </div>

          {!revealed ? (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Hãy nhớ lại nghĩa của từ. Sau đó bấm để xem đáp án.
              </p>
              <Button size="lg" onClick={() => setRevealed(true)}>
                Show answer <ChevronRight />
              </Button>
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Keyboard className="h-3 w-3" /> Press <kbd className="kbd">Space</kbd> to reveal
              </p>
            </div>
          ) : (
            <div className="mt-6 w-full space-y-4 text-left animate-fade-in-up">
              {(card.ipa_uk || card.ipa_us) && (
                <div className="flex items-center gap-2 justify-center flex-wrap">
                  {card.ipa_uk && (
                    <>
                      <span className="ipa text-primary text-xl">{card.ipa_uk}</span>
                      <SpeakButton text={card.word} lang="en-GB" size="icon" className="h-7 w-7" />
                    </>
                  )}
                  {card.ipa_us && (
                    <>
                      {card.ipa_uk && <span className="text-muted-foreground">·</span>}
                      <span className="ipa text-primary text-xl">{card.ipa_us}</span>
                      <SpeakButton text={card.word} lang="en-US" size="icon" className="h-7 w-7" />
                    </>
                  )}
                </div>
              )}
              {card.meaning_vi && (
                <DefBlock label="Tiếng Việt" body={card.meaning_vi} />
              )}
              {card.definition_en && (
                <DefBlock label="English" body={card.definition_en} />
              )}
              {card.examples.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                    Examples
                  </p>
                  {card.examples.slice(0, 2).map((ex) => (
                    <div key={ex.id} className="rounded-xl border bg-card p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <p className="flex-1 leading-relaxed">{ex.sentence}</p>
                        <SpeakButton text={ex.sentence} size="icon" className="h-7 w-7 shrink-0" />
                      </div>
                      {ex.translation_vi && (
                        <p className="text-muted-foreground mt-1">{ex.translation_vi}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating buttons */}
      {revealed && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <RatingButton
                key={r.rating}
                rating={r.rating}
                label={r.label}
                sublabel={r.sublabel}
                tone={r.tone}
                disabled={submitting}
                onClick={() => rate(r.rating)}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-2 w-full">
            <RotateCcw className="h-3 w-3" />
            Hotkeys: <kbd className="kbd">1</kbd> Again · <kbd className="kbd">2</kbd> Hard ·{" "}
            <kbd className="kbd">3</kbd> Good · <kbd className="kbd">4</kbd> Easy
          </p>
          <style>{`.kbd{display:inline-flex;height:1.25rem;min-width:1.25rem;padding:0 .25rem;align-items:center;justify-content:center;border-radius:.375rem;border:1px solid hsl(var(--border));background:hsl(var(--muted));font-family:ui-monospace,monospace;font-size:.65rem;font-weight:600;color:hsl(var(--foreground))}`}</style>
        </>
      )}
    </div>
  );
}

function DefBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3.5 border border-border/40">
      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 leading-relaxed">{body}</p>
    </div>
  );
}

function SessionStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  const toneClass: Record<string, string> = {
    destructive: "text-destructive",
    warning: "text-amber-600 dark:text-amber-400",
    primary: "text-primary",
    success: "text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="rounded-xl border bg-card p-2.5">
      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold", toneClass[tone])}>{value}</p>
    </div>
  );
}

function RatingButton({
  rating,
  label,
  sublabel,
  tone,
  disabled,
  onClick,
}: {
  rating: number;
  label: string;
  sublabel: string;
  tone: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const toneClass: Record<string, string> = {
    destructive: "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white",
    primary: "border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-col items-center gap-0.5 rounded-xl border-2 px-3 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:translate-y-0 ring-focus",
        toneClass[tone],
      )}
    >
      <span className="text-[10px] font-mono opacity-60 group-hover:opacity-90">{rating}</span>
      <span className="font-semibold leading-none">{label}</span>
      <span className="text-[10px] opacity-70 font-normal">{sublabel}</span>
    </button>
  );
}
