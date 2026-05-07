import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Lock, Target } from "lucide-react";
import { IPA_LEVELS } from "@/lib/ipa-data";

export default async function IPARoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: progress } = await supabase
    .from("ipa_progress")
    .select("lesson_id")
    .eq("user_id", user.id);
  const mastered = new Set((progress || []).map((p) => p.lesson_id));

  return (
    <div className="container max-w-5xl py-6 md:py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IPA Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          5 cấp độ từ nguyên âm đơn → connected speech. Học theo thứ tự để build foundation vững.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex items-start gap-4">
          <Target className="h-8 w-8 text-primary shrink-0" />
          <div>
            <p className="font-semibold">Cách học hiệu quả nhất</p>
            <ol className="mt-2 text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li><strong>Xem</strong> mô tả vị trí miệng/lưỡi.</li>
              <li><strong>Nghe</strong> ví dụ và minimal pairs (bấm 🔊).</li>
              <li><strong>Lặp lại</strong> shadowing — nói cùng lúc với audio.</li>
              <li><strong>Quiz</strong> 5 câu để check hiểu.</li>
              <li><strong>Áp dụng</strong> — IPA học sẽ tự hiện trên mọi từ vựng bạn lưu.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {IPA_LEVELS.map((lv, idx) => {
          const masteredCount = lv.lessons.filter((l) => mastered.has(l.id)).length;
          const total = lv.lessons.length;
          const pct = (masteredCount / total) * 100;
          const prevLevelDone = idx === 0 || (() => {
            const prev = IPA_LEVELS[idx - 1];
            return prev.lessons.every((l) => mastered.has(l.id));
          })();
          const locked = !prevLevelDone && masteredCount === 0 && idx > 1;

          return (
            <Card key={lv.level} className={locked ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Level {lv.level} — {lv.title}
                      {masteredCount === total && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="mt-1">{lv.summary}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{lv.estDuration}</Badge>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Progress value={pct} />
                  <p className="text-xs text-muted-foreground">{masteredCount}/{total} lessons mastered</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic mb-3">🎯 {lv.goal}</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {lv.lessons.map((lesson) => {
                    const done = mastered.has(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/ipa/${lv.level}/${encodeURIComponent(lesson.id)}`}
                        className="flex items-center justify-between rounded-md border p-3 hover:border-primary transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="ipa text-xl font-bold text-primary shrink-0">/{lesson.symbol}/</span>
                          <span className="text-sm truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {done && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
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
    </div>
  );
}
