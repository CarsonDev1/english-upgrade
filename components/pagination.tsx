import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  pageHref: (p: number) => string;
}

export function Pagination({ page, totalPages, from, to, total, pageHref }: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-2">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from + 1}</span>–
        <span className="font-medium text-foreground">{Math.min(to + 1, total)}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <PageLink href={pageHref(Math.max(1, page - 1))} disabled={prevDisabled} ariaLabel="Previous page">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </PageLink>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm select-none">
              …
            </span>
          ) : (
            <PageLink key={p} href={pageHref(p)} active={p === page} ariaLabel={`Page ${p}`}>
              {p}
            </PageLink>
          ),
        )}

        <PageLink href={pageHref(Math.min(totalPages, page + 1))} disabled={nextDisabled} ariaLabel="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </nav>
    </div>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const cls = cn(
    "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-3 text-sm font-medium transition select-none",
    active && "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
    !active && !disabled && "border-input bg-background hover:bg-accent hover:text-accent-foreground",
    disabled && "border-input bg-background text-muted-foreground/50 cursor-not-allowed pointer-events-none opacity-60",
  );

  if (disabled) {
    return (
      <span className={cls} aria-disabled="true" aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}
