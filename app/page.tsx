import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, Volume2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          English<span className="text-primary">Upgrade</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
          <Button asChild><Link href="/signup">Get started</Link></Button>
        </div>
      </header>

      <main className="container">
        <section className="py-20 md:py-32 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Master English vocabulary <span className="text-primary">with IPA</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Lưu từ vựng và câu ví dụ. AI tự động sinh phiên âm IPA + nghĩa tiếng Việt.
            Lộ trình 5 cấp độ giúp bạn đọc được phiên âm bất kỳ từ nào.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Start learning <ArrowRight className="ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 py-16">
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title="AI sinh IPA tức thì"
            desc="Nhập từ → AI tự thêm phiên âm UK + US, nghĩa tiếng Việt, định nghĩa, và 3 câu ví dụ."
          />
          <Feature
            icon={<Brain className="h-6 w-6" />}
            title="Spaced Repetition"
            desc="Thuật toán SM-2 (như Anki). Hệ thống tự động lên lịch ôn lại đúng lúc bạn sắp quên."
          />
          <Feature
            icon={<Volume2 className="h-6 w-6" />}
            title="IPA Roadmap 5 cấp"
            desc="Từ vowels đơn → diphthongs → consonants khó → stress → connected speech."
          />
        </section>
      </main>

      <footer className="container py-8 text-center text-sm text-muted-foreground">
        Built with Next.js · Supabase · Groq · Shadcn UI
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
