import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle2, Sparkles, Volume2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/70 backdrop-blur sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_30%,transparent_70%)] pointer-events-none" />
          <div className="container relative py-20 md:py-28 lg:py-36">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                AI sinh IPA · SM-2 · IPA Roadmap 5 cấp
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Học từ vựng tiếng Anh <br className="hidden sm:block" />
                <span className="text-primary">đúng phiên âm</span>, đúng lúc.
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Lưu từ và câu ví dụ. AI tự động sinh phiên âm IPA + nghĩa tiếng Việt.
                Lộ trình 5 cấp độ giúp bạn đọc được phiên âm bất kỳ từ nào,
                kết hợp ôn tập SM-2 đúng lúc bạn sắp quên.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link href="/signup">
                    Bắt đầu miễn phí <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                  <Link href="/login">Đã có tài khoản · Đăng nhập</Link>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Không cần thẻ tín dụng", "Giao diện tiếng Việt", "Hoạt động trên mọi thiết bị"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">Cách nó hoạt động</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Mọi thứ bạn cần để học tiếng Anh, gọn trong một nơi.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Một nền tảng kết hợp từ vựng, phát âm, và ôn tập thông minh — không bị nhồi tính năng thừa.
            </p>
          </div>
          <div className="grid gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60 md:grid-cols-3">
            <Feature
              num="01"
              icon={<Sparkles className="h-5 w-5" />}
              title="AI sinh IPA tức thì"
              desc="Nhập từ → AI tự thêm phiên âm UK + US, nghĩa tiếng Việt, định nghĩa, và 3 câu ví dụ."
            />
            <Feature
              num="02"
              icon={<Brain className="h-5 w-5" />}
              title="Spaced Repetition"
              desc="Thuật toán SM-2 (như Anki). Hệ thống tự lên lịch ôn lại đúng lúc bạn sắp quên."
            />
            <Feature
              num="03"
              icon={<Volume2 className="h-5 w-5" />}
              title="IPA Roadmap 5 cấp"
              desc="Vowels đơn → diphthongs → consonants khó → stress → connected speech."
            />
          </div>
        </section>

        {/* CTA strip */}
        <section className="container pb-16 md:pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary text-primary-foreground p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(187_92%_60%_/_0.45),transparent_55%)]" />
            <div className="absolute inset-0 bg-dot-grid opacity-[0.08]" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Sẵn sàng nâng cấp tiếng Anh?</h3>
                <p className="mt-2 text-primary-foreground/85">
                  Tạo tài khoản miễn phí trong vòng 30 giây và bắt đầu lưu từ đầu tiên.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base shrink-0 self-start">
                <Link href="/signup">
                  Tạo tài khoản miễn phí <ArrowRight className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </div>
          <p>Built with Next.js · Supabase · Groq</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  num,
  icon,
  title,
  desc,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card p-7 md:p-8 transition-colors hover:bg-accent/30">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-xs font-mono text-muted-foreground/70">{num}</span>
      </div>
      <h3 className="mt-5 font-semibold text-lg tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
