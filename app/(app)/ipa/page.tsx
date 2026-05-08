import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, Lock, Target } from "lucide-react";
import { IPA_LEVELS } from "@/lib/ipa-data";
import { PageContainer, PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

export default async function IPARoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: progress } = await supabase
    .from("ipa_progress")
    .select("lesson_id")
    .eq("user_id", user.id);
  const mastered = new Set((progress || []).map((p) => p.lesson_id));

  const totalLessons = IPA_LEVELS.reduce((s, lv) => s + lv.lessons.length, 0);
  const masteredCount = IPA_LEVELS.reduce(
    (s, lv) => s + lv.lessons.filter((l) => mastered.has(l.id)).length,
    0,
  );
  const overallPct = totalLessons > 0 ? (masteredCount / totalLessons) * 100 : 0;

  return (
    <PageContainer size="lg">
      <PageHeader
        title="IPA Roadmap"
        description="5 cấp độ từ nguyên âm đơn → connected speech. Học theo thứ tự để xây nền vững."
      />

      {/* Overall progress + tip */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="surface-elevated md:col-span-2 overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 ring-1 ring-inset ring-primary/20">
              <Target className="h-5 w-5" />
            </div>
            <div className="space-y-2 min-w-0 flex-1">
              <div>
                <p className="font-semibold">Cách học hiệu quả nhất</p>
                <p className="text-sm text-muted-foreground">
                  Theo trình tự dưới đây cho mỗi bài học để đạt kết quả tốt nhất.
                </p>
              </div>
              <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
                {[
                  ["Xem", "mô tả vị trí miệng/lưỡi"],
                  ["Nghe", "ví dụ và minimal pairs"],
                  ["Lặp lại", "shadowing cùng audio"],
                  ["Quiz", "5 câu để check hiểu"],
                  ["Áp dụng", "trên từ vựng hằng ngày"],
                ].map(([k, v], i) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-foreground">{k}</strong>{" "}
                      <span className="text-muted-foreground">{v}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold tracking-tight">
                {masteredCount}
                <span className="text-base font-normal text-muted-foreground">/{totalLessons}</span>
              </p>
              <Badge variant="outline" className="font-mono">
                {Math.round(overallPct)}%
              </Badge>
            </div>
            <Progress value={overallPct} />
            <p className="text-xs text-muted-foreground">lessons mastered</p>
          </CardContent>
        </Card>
      </div>

      {/* Levels */}
      <div className="space-y-4">
        {IPA_LEVELS.map((lv, idx) => {
          const masteredInLevel = lv.lessons.filter((l) => mastered.has(l.id)).length;
          const total = lv.lessons.length;
          const pct = (masteredInLevel / total) * 100;
          const prevLevelDone = idx === 0 || (() => {
            const prev = IPA_LEVELS[idx - 1];
            return prev.lessons.every((l) => mastered.has(l.id));
          })();
          const locked = !prevLevelDone && masteredInLevel === 0 && idx > 1;
          const complete = masteredInLevel === total;

          return (
            <Card
              key={lv.level}
              className={cn(
                "surface-elevated overflow-hidden transition",
                locked && "opacity-70",
                complete && "ring-1 ring-primary/30",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm shrink-0",
                          complete
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        L{lv.level}
                      </span>
                      <CardTitle className="flex items-center gap-2">
                        {lv.title}
                        {complete && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-2">{lv.summary}</CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {lv.estDuration}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={pct} className="flex-1 h-2" />
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums shrink-0",
                      complete ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {masteredInLevel}/{total}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-accent/40 px-3 py-2 mb-3 text-sm">
                  <span className="text-primary mr-1">🎯</span>
                  <span className="text-foreground">{lv.goal}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {lv.lessons.map((lesson) => {
                    const done = mastered.has(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/ipa/${lv.level}/${encodeURIComponent(lesson.id)}`}
                        className={cn(
                          "group flex items-center justify-between rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                          done
                            ? "border-primary/30 bg-primary/5 hover:border-primary/60"
                            : "border-border/60 bg-card hover:border-primary/30",
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={cn(
                              "ipa text-xl font-bold shrink-0",
                              done ? "text-primary" : "text-foreground",
                            )}
                          >
                            /{lesson.symbol}/
                          </span>
                          <span className="text-sm font-medium truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {done && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground transition" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
