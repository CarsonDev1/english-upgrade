import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLesson, IPA_LEVELS } from "@/lib/ipa-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { LessonQuiz } from "./lesson-quiz";
import { PageContainer } from "@/components/page-header";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ level: string; lesson: string }>;
}) {
  const { level, lesson: lessonIdRaw } = await params;
  const lessonId = decodeURIComponent(lessonIdRaw);
  const levelNum = Number(level);
  const lesson = getLesson(levelNum, lessonId);
  if (!lesson) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: progressRow } = await supabase
    .from("ipa_progress")
    .select("mastered_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  const isMastered = !!progressRow;

  const levelData = IPA_LEVELS.find((l) => l.level === levelNum)!;
  const idx = levelData.lessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? levelData.lessons[idx - 1] : null;
  const next = idx < levelData.lessons.length - 1 ? levelData.lessons[idx + 1] : null;

  return (
    <PageContainer size="default">
      <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 text-muted-foreground hover:text-foreground">
        <Link href="/ipa">
          <ArrowLeft className="h-4 w-4" /> Back to roadmap
        </Link>
      </Button>

      {/* Hero */}
      <Card className="surface-elevated overflow-hidden">
        <div className="h-1 bg-primary" />
        <CardContent className="p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              Level {levelNum} · {levelData.title}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Lesson {idx + 1}/{levelData.lessons.length}
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="ipa text-5xl md:text-7xl font-bold text-primary">/{lesson.symbol}/</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              {lesson.title}
              {isMastered && <CheckCircle2 className="h-6 w-6 text-primary" />}
            </h1>
          </div>
        </CardContent>
      </Card>

      {/* Description + tip */}
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle className="text-base">Mô tả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="leading-relaxed">{lesson.description}</p>
          <div className="rounded-xl bg-accent/40 border border-primary/20 p-4 flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-primary">Mẹo phát âm</p>
              <p className="text-sm mt-0.5 leading-relaxed">{lesson.mouthTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle className="text-base">Ví dụ</CardTitle>
          <CardDescription>Bấm 🔊 để nghe rồi lặp lại theo (shadowing).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {lesson.examples.map((ex) => (
            <div
              key={ex.word}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 transition hover:border-primary/30"
            >
              <div className="min-w-0">
                <p className="font-semibold">{ex.word}</p>
                <p className="ipa text-sm text-primary">{ex.ipa}</p>
                {ex.vi && <p className="text-xs text-muted-foreground mt-0.5">{ex.vi}</p>}
              </div>
              <SpeakButton text={ex.word} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Minimal pairs */}
      {lesson.minimalPairs && lesson.minimalPairs.length > 0 && (
        <Card className="surface-elevated">
          <CardHeader>
            <CardTitle className="text-base">Minimal pairs</CardTitle>
            <CardDescription>So sánh để phân biệt — bấm 🔊 cả 2 và nghe sự khác biệt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lesson.minimalPairs.map((mp, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl border bg-primary/5 p-3">
                  <div>
                    <p className="font-semibold">{mp.a.word}</p>
                    <p className="ipa text-sm text-primary">{mp.a.ipa}</p>
                  </div>
                  <SpeakButton text={mp.a.word} />
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-dashed bg-card p-3">
                  <div>
                    <p className="font-semibold">{mp.b.word}</p>
                    <p className="ipa text-sm">{mp.b.ipa}</p>
                  </div>
                  <SpeakButton text={mp.b.word} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quiz */}
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle className="text-base">Quiz — 5 câu</CardTitle>
          <CardDescription>Đạt 4/5 trở lên để mark "mastered".</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonQuiz lessonId={lesson.id} questions={lesson.quiz} alreadyMastered={isMastered} />
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="flex justify-between gap-2 pt-2">
        {prev ? (
          <Button asChild variant="outline">
            <Link href={`/ipa/${levelNum}/${encodeURIComponent(prev.id)}`}>
              <ArrowLeft /> {prev.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button asChild>
            <Link href={`/ipa/${levelNum}/${encodeURIComponent(next.id)}`}>
              {next.title} <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/ipa">
              Done with this level <CheckCircle2 />
            </Link>
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
