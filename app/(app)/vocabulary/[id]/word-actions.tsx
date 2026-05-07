"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteWord } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";

export function WordActions({ id }: { id: string }) {
  const [isPending, start] = useTransition();
  function onDelete() {
    if (!confirm("Delete this word and all its examples? This cannot be undone.")) return;
    start(async () => {
      const result = await deleteWord(id);
      if (result && "error" in result && result.error) toast.error(result.error);
    });
  }
  return (
    <Button variant="ghost" size="icon" onClick={onDelete} disabled={isPending} aria-label="Delete word">
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
