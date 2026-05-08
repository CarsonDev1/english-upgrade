import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, BrainCircuit, ArrowRight, Layers, Volume2 } from "lucide-react";
import { IPA_LEVELS } from "@/lib/ipa-data";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const nowIso = new Date().toISOString();

  const [
    { count: total },
    { count: due },
    { data: recent },
    { data: profile },
    { data: ipaProgress },
    { count: deckCount },
  ] = await Promise.all([
    supabase.from("vocabulary").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("vocabulary").select("*", { count: "exact", head: true }).eq("user_id", user.id).lte("next_review_at", nowIso),
    supabase.from("vocabulary").select("id, word, ipa_uk, meaning_vi, word_class, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("ipa_progress").select("lesson_id").eq("user_id", user.id),
    supabase.from("decks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const masteredLessons = new Set((ipaProgress || []).map((r) => r.lesson_id));
  const totalLessons = IPA_LEVELS.reduce((s, lv) => s + lv.lessons.length, 0);
  const masteredCount = IPA_LEVELS.reduce(
    (s, lv) => s + lv.lessons.filter((l) => masteredLessons.has(l.id)).length,
    0,
  );
  const masteryPct = totalLessons > 0 ? (masteredCount / totalLessons) * 100 : 0;
  const greeting = getGreeting();

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Hi {profile?.display_name || "there"}
        </h1>
        <p className="text-muted-foreground">Hôm nay học gì cùng nhau nào?</p>
      </header>

      {/* Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <Stat
          label="Total words"
          value={total ?? 0}
          icon={<BookOpen className="h-5 w-5" />}
          tint="sky"
        />
        <Stat
          label="Due for review"
          value={due ?? 0}
          icon={<BrainCircuit className="h-5 w-5" />}
          tint={(due ?? 0) > 0 ? "primary" : "muted"}
          highlight={(due ?? 0) > 0}
        />
        <Stat
          label="Decks"
          value={deckCount ?? 0}
          icon={<Layers className="h-5 w-5" />}
          tint="emerald"
        />
        <Stat
          label="IPA mastered"
          value={`${masteredCount}/${totalLessons}`}
          icon={<Sparkles className="h-5 w-5" />}
          tint="cyan"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="lg:col-span-2 surface-elevated">
          <CardHeader className="pb-3">
            <CardTitle>Bắt đầu nhanh</CardTitle>
            <CardDescription>Chọn một việc và bắt tay vào học.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <ActionCard
              href="/vocabulary/new"
              icon={<Sparkles className="h-5 w-5" />}
              title="Add word"
              desc="AI điền IPA + nghĩa"
              primary
            />
            <ActionCard
              href="/review"
              icon={<BrainCircuit className="h-5 w-5" />}
              title={due ? `Review ${due}` : "Review"}
              desc={due ? "due bây giờ" : "đã ôn xong"}
            />
            <ActionCard
              href="/ipa"
              icon={<Volume2 className="h-5 w-5" />}
              title="IPA Roadmap"
              desc={`${masteredCount}/${totalLessons} bài học`}
            />
          </CardContent>
        </Card>

        {/* IPA progress */}
        <Card className="surface-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">IPA Progress</CardTitle>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {Math.round(masteryPct)}%
              </span>
            </div>
            <Progress value={masteryPct} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {IPA_LEVELS.map((lv) => {
              const t = lv.lessons.length;
              const done = lv.lessons.filter((l) => masteredLessons.has(l.id)).length;
              const pct = (done / t) * 100;
              return (
                <div key={lv.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">
                      <span className="text-muted-foreground font-mono mr-1.5">L{lv.level}</span>
                      {lv.title}
                    </span>
                    <span className={cn("text-xs tabular-nums shrink-0", done === t ? "text-primary font-medium" : "text-muted-foreground")}>
                      {done}/{t}
                    </span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
            <Button asChild variant="ghost" size="sm" className="w-full mt-2">
              <Link href="/ipa">
                Mở roadmap <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recently added */}
      <Card className="surface-elevated">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Mới thêm gần đây</CardTitle>
            <CardDescription>Các từ vựng bạn vừa lưu.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/vocabulary">
              Xem tất cả <ArrowRight className="ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {(recent || []).length === 0 ? (
            <EmptyRecent />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(recent || []).map((v) => (
                <Link
                  key={v.id}
                  href={`/vocabulary/${v.id}`}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-card p-3 hover:border-primary/40 hover:bg-accent/40 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{v.word}</p>
                      {v.word_class && (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground italic">
                          {v.word_class}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {v.meaning_vi || <span className="italic">No meaning yet</span>}
                    </p>
                  </div>
                  {v.ipa_uk && (
                    <span className="ipa text-xs text-primary ml-2 shrink-0">{v.ipa_uk}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const TINTS: Record<string, { bg: string; fg: string; ring: string }> = {
  primary: { bg: "bg-primary/10", fg: "text-primary", ring: "ring-primary/20" },
  sky: { bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400", ring: "ring-sky-500/20" },
  cyan: { bg: "bg-cyan-500/10", fg: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-500/20" },
  emerald: { bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20" },
  muted: { bg: "bg-muted", fg: "text-muted-foreground", ring: "ring-border" },
};

function Stat({
  label,
  value,
  icon,
  tint,
  highlight = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tint: keyof typeof TINTS;
  highlight?: boolean;
}) {
  const t = TINTS[tint] ?? TINTS.muted;
  return (
    <Card
      className={cn(
        "surface-elevated transition hover:border-primary/30",
        highlight && "ring-1 ring-primary/30",
      )}
    >
      <CardContent className="p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">{label}</p>
          <p className="text-2xl md:text-3xl font-bold mt-1.5 leading-none tabular-nums">{value}</p>
        </div>
        <div className={cn("p-2.5 rounded-xl shrink-0 ring-1 ring-inset", t.bg, t.fg, t.ring)}>{icon}</div>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  href,
  icon,
  title,
  desc,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5",
        primary
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_-4px_hsl(199_89%_48%_/_0.5)]"
          : "border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40",
      )}
    >
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg",
          primary ? "bg-white/20 text-primary-foreground ring-1 ring-inset ring-white/10" : "bg-primary/10 text-primary",
        )}
      >
        {icon}
      </div>
      <div className="flex items-end justify-between gap-2 min-h-[34px]">
        <div className="min-w-0">
          <p className={cn("font-semibold truncate leading-tight", primary ? "text-primary-foreground" : "")}>
            {title}
          </p>
          <p
            className={cn(
              "text-xs truncate mt-0.5",
              primary ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {desc}
          </p>
        </div>
        <ArrowRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
            primary ? "text-primary-foreground" : "text-muted-foreground",
          )}
        />
      </div>
    </Link>
  );
}

function EmptyRecent() {
  return (
    <div className="rounded-xl border border-dashed border-border/70 py-10 text-center space-y-3">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <BookOpen className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium">Chưa có từ nào</p>
        <p className="text-sm text-muted-foreground mt-0.5">Thêm từ đầu tiên và để AI lo phần còn lại.</p>
      </div>
      <Button asChild size="sm">
        <Link href="/vocabulary/new">
          <Sparkles className="mr-1" /> Thêm từ đầu tiên
        </Link>
      </Button>
    </div>
  );
}
