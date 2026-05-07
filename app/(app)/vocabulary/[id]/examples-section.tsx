"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import { addExample, deleteExample } from "../actions";
import { SpeakButton } from "@/components/speak-button";
import { toast } from "sonner";
import type { Example } from "@/types/database";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Examples ({examples.length})</CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-md border p-3 space-y-2">
            <Textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="English sentence"
              rows={2}
              autoFocus
            />
            <Input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Vietnamese translation (optional)"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setSentence(""); setTranslation(""); }}>
                <X className="h-3 w-3" /> Cancel
              </Button>
              <Button size="sm" onClick={onAdd} disabled={isPending || !sentence.trim()}>Save</Button>
            </div>
          </div>
        )}

        {examples.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground text-center py-6">No examples yet.</p>
        )}

        {examples.map((ex) => (
          <div key={ex.id} className="rounded-md border p-3 space-y-1.5 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{ex.sentence}</p>
                  <SpeakButton text={ex.sentence} size="icon" className="h-7 w-7 shrink-0" />
                </div>
                {ex.translation_vi && (
                  <p className="text-sm text-muted-foreground mt-1">{ex.translation_vi}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={() => onDelete(ex.id)}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
            {ex.ai_generated && <Badge variant="outline" className="text-[10px]">AI</Badge>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
