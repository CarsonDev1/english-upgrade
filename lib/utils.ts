import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);
  const diffHr = Math.round(diffMs / 3600000);
  const diffDay = Math.round(diffMs / 86400000);

  if (Math.abs(diffMin) < 60) return diffMin === 0 ? "now" : `${diffMin > 0 ? "in " : ""}${Math.abs(diffMin)}m${diffMin < 0 ? " ago" : ""}`;
  if (Math.abs(diffHr) < 24) return `${diffHr > 0 ? "in " : ""}${Math.abs(diffHr)}h${diffHr < 0 ? " ago" : ""}`;
  return `${diffDay > 0 ? "in " : ""}${Math.abs(diffDay)}d${diffDay < 0 ? " ago" : ""}`;
}
