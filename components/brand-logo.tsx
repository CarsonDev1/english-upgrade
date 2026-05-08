import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  href = "/",
  size = "md",
  showIcon = true,
  className,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}) {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const iconBox = size === "lg" ? "h-9 w-9" : size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5 font-semibold tracking-tight", text, className)}
    >
      {showIcon && (
        <span
          className={cn(
            "relative inline-flex items-center justify-center rounded-[10px] gradient-brand text-primary-foreground shadow-[0_4px_12px_-4px_hsl(199_89%_48%_/_0.5)] ring-1 ring-inset ring-white/20",
            iconBox,
          )}
        >
          <BrandMark />
        </span>
      )}
      <span className="leading-none">
        English<span className="text-primary">.up</span>
      </span>
    </Link>
  );
}

function BrandMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[55%] w-[55%]"
      aria-hidden
    >
      <path d="M5 19V5h7a4 4 0 0 1 0 8H5" />
      <path d="M14 13l5 6" />
    </svg>
  );
}
