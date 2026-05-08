import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { SidebarNav, MobileNav } from "@/components/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nowIso = new Date().toISOString();

  const [{ data: profile }, { count: dueCount }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase
      .from("vocabulary")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("next_review_at", nowIso),
  ]);

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Friend";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border/70 bg-card/60 backdrop-blur-sm z-30">
        <div className="h-16 flex items-center px-5 border-b border-border/60">
          <BrandLogo href="/dashboard" size="md" />
        </div>
        <SidebarNav dueCount={dueCount ?? 0} />
        <div className="p-3 border-t border-border/60 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate leading-tight">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>
          <form action="/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 border-b border-border/60 bg-background/85 backdrop-blur z-40 flex items-center justify-between px-4">
        <BrandLogo href="/dashboard" size="sm" />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action="/auth/signout" method="POST">
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
              <User className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <MobileNav dueCount={dueCount ?? 0} />

      {/* Main content */}
      <main className="md:pl-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">{children}</main>
    </div>
  );
}
