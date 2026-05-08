import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
  eyebrow,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {backHref && (
        <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 text-muted-foreground hover:text-foreground">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" /> {backLabel || "Back"}
          </Link>
        </Button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-1 min-w-0">
          {eyebrow && <div>{eyebrow}</div>}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm md:text-base text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function PageContainer({
  children,
  size = "default",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const max = size === "sm" ? "max-w-2xl" : size === "lg" ? "max-w-7xl" : "max-w-5xl";
  return (
    <div className={cn("px-4 md:px-8 py-6 md:py-10 space-y-6 mx-auto", max, className)}>{children}</div>
  );
}
