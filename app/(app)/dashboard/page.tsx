import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, BrainCircuit, ArrowRight } from "lucide-react";
import { IPA_LEVELS } from "@/lib/ipa-data";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const nowIso = new Date().toISOString();

  const [{ count: total }, { count: due }, { data: recent }, { data: profile }, { data: ipaProgress }] = await Promise.all([
    supabase.from("vocabulary").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("vocabulary").select("*", { count: "exact", head: true }).eq("user_id", user.id).lte("next_review_at", nowIso),
    supabase.from("vocabulary").select("id, word, ipa_uk, meaning_vi, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("ipa_progress").select("lesson_id").eq("user_id", user.id),
  ]);

  const masteredLessons = new Set((ipaProgress || []).map((r) => r.lesson_id));
  const totalLessons = IPA_LEVELS.reduce((s, lv) => s + lv.lessons.length, 0);
  const masteredCount = IPA_LEVELS.reduce(
    (s, lv) => s + lv.lessons.filter((l) => masteredLessons.has(l.id)).length,
    0,
  );

  return (
    <div className="container max-w-6xl py-6 md:py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hi {profile?.display_name || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Let's keep your English sharp today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total words" value={total ?? 0} icon={<BookOpen className="h-5 w-5" />} />
        <Stat label="Due for review" value={due ?? 0} icon={<BrainCircuit className="h-5 w-5" />} accent={(due ?? 0) > 0} />
        <Stat label="IPA mastered" value={`${masteredCount}/${totalLessons}`} icon={<Sparkles className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Start learning right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/vocabulary/new"><Sparkles className="mr-1" /> Add word with AI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/review">
                <BrainCircuit className="mr-1" /> Review {due ?? 0} due
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/ipa">IPA Roadmap <ArrowRight className="ml-1" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">IPA Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {IPA_LEVELS.map((lv) => {
              const total = lv.lessons.length;
              const done = lv.lessons.filter((l) => masteredLessons.has(l.id)).length;
              return (
                <div key={lv.level} className="flex items-center justify-between text-sm">
                  <span>L{lv.level} {lv.title}</span>
                  <Badge variant={done === total ? "default" : "secondary"}>{done}/{total}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recently added</CardTitle>
            <CardDescription>Your latest vocabulary entries.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/vocabulary">See all <ArrowRight className="ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {(recent || []).length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">No words yet. Add your first one!</p>
          )}
          {(recent || []).map((v) => (
            <Link
              key={v.id}
              href={`/vocabulary/${v.id}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{v.word}</p>
                <p className="text-sm text-muted-foreground truncate">{v.meaning_vi}</p>
              </div>
              {v.ipa_uk && <span className="ipa text-sm text-primary">{v.ipa_uk}</span>}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon, accent = false }: { label: string; value: number | string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <Card className={accent ? "border-primary" : ""}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${accent ? "bg-primary/10 text-primary" : "bg-muted"}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
