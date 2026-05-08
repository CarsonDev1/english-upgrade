"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X, Sparkles, MessageSquare } from "lucide-react";
import { addExample, deleteExample } from "../actions";
import { SpeakButton } from "@/components/speak-button";
import { toast } from "sonner";
import type { Example } from "@/types/database";

export function ExamplesSection({ vocabularyId, examples }: { vocabularyId: string; examples: Example[] }) {
  const [adding, setAdding] = useState(false);
  const [sentence, setSentence] = useState("");
  const [translation, setTranslation] = useState("");
  const [isPending, start] = useTransition();

  function onAdd() {
    if (!sentence.trim()) return;
    start(async () => {
      const result = await addExample(vocabularyId, sentence, translation);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSentence("");
      setTranslation("");
      setAdding(false);
      toast.success("Example added");
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this example?")) return;
    start(async () => {
      const result = await deleteExample(id, vocabularyId);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <Card className="surface-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base inline-flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Examples
          <span className="text-xs font-normal text-muted-foreground">({examples.length})</span>
        </CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 space-y-2 animate-fade-in-up">
            <Textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="English sentence"
              rows={2}
              autoFocus
              className="bg-background"
            />
            <Input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Vietnamese translation (optional)"
              className="bg-background"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAdding(false);
                  setSentence("");
                  setTranslation("");
                }}
              >
                <X /> Cancel
              </Button>
              <Button size="sm" onClick={onAdd} disabled={isPending || !sentence.trim()}>
                Save
              </Button>
            </div>
          </div>
        )}

        {examples.length === 0 && !adding && (
          <div className="rounded-xl border border-dashed py-10 text-center">
            <p className="text-sm text-muted-foreground">Chưa có ví dụ. Thêm một câu để dễ nhớ hơn.</p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setAdding(true)}>
              <Plus /> Add example
            </Button>
          </div>
        )}

        {examples.map((ex) => (
          <div
            key={ex.id}
            className="group rounded-xl border border-border/60 bg-card p-3 transition hover:border-primary/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start gap-2">
                  <p className="flex-1 leading-relaxed">{ex.sentence}</p>
                  <SpeakButton text={ex.sentence} size="icon" className="h-7 w-7 shrink-0" />
                </div>
                {ex.translation_vi && (
                  <p className="text-sm text-muted-foreground">{ex.translation_vi}</p>
                )}
                {ex.ai_generated && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> AI generated
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => onDelete(ex.id)}
                aria-label="Delete example"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
