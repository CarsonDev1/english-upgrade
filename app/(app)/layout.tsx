import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, BrainCircuit, Sparkles, Layers, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
    { href: "/decks", label: "Decks", icon: Layers },
    { href: "/review", label: "Review", icon: BrainCircuit },
    { href: "/ipa", label: "IPA Roadmap", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="text-lg font-bold">
            English<span className="text-primary">Upgrade</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="flex items-center justify-between px-3">
            <div className="text-sm">
              <p className="font-medium truncate max-w-[140px]">{profile?.display_name || user.email}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>
          <form action="/auth/signout" method="POST">
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 border-b bg-background z-40 flex items-center justify-between px-4">
        <Link href="/dashboard" className="font-bold">
          English<span className="text-primary">Upgrade</span>
        </Link>
        <ThemeToggle />
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-background z-40 grid grid-cols-5">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center py-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
            <item.icon className="h-4 w-4" />
            <span>{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>

      <main className="flex-1 min-w-0 pt-14 md:pt-0 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
