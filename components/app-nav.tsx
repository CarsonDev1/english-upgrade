"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, BrainCircuit, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { href: "/vocabulary", label: "Vocabulary", short: "Words", icon: BookOpen },
  { href: "/decks", label: "Decks", short: "Decks", icon: Layers },
  { href: "/review", label: "Review", short: "Review", icon: BrainCircuit },
  { href: "/ipa", label: "IPA Roadmap", short: "IPA", icon: Sparkles },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ dueCount }: { dueCount?: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const showDue = item.href === "/review" && dueCount && dueCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-primary transition-all",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
              )}
            />
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className="flex-1">{item.label}</span>
            {showDue && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {dueCount! > 99 ? "99+" : dueCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ dueCount }: { dueCount?: number }) {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur-lg z-40 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const showDue = item.href === "/review" && dueCount && dueCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="relative">
              <item.icon className="h-5 w-5" />
              {showDue && (
                <span className="absolute -top-1 -right-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {dueCount! > 9 ? "9+" : dueCount}
                </span>
              )}
            </span>
            <span className={cn("font-medium", active && "font-semibold")}>{item.short}</span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
