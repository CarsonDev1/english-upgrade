"use client";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SpeakButton({
  text,
  lang = "en-US",
  size = "icon",
  className,
}: {
  text: string;
  lang?: "en-US" | "en-GB";
  size?: "icon" | "sm" | "default";
  className?: string;
}) {
  function speak(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={speak}
      aria-label={`Speak ${text}`}
      className={cn("shrink-0", className)}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );
}
