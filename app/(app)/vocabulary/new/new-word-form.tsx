"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Plus, X } from "lucide-react";
import { saveWord } from "../actions";
import type { GeneratedWord } from "@/lib/groq";
import { toast } from "sonner";
import { SpeakButton } from "@/components/speak-button";

interface ExampleField {
  sentence: string;
  translation_vi: string;
  ai_generated: boolean;
}

export function NewWordForm({ decks }: { decks: { id: string; name: string }[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [word, setWord] = useState("");
  const [ipaUk, setIpaUk] = useState("");
  const [ipaUs, setIpaUs] = useState("");
  const [wordClass, setWordClass] = useState("");
  const [meaningVi, setMeaningVi] = useState("");
  const [definitionEn, setDefinitionEn] = useState("");
  const [notes, setNotes] = useState("");
  const [deckId, setDeckId] = useState<string>("none");
  const [examples, setExamples] = useState<ExampleField[]>([]);
  const [aiGenerated, setAiGenerated] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function generate() {
    if (!word.trim()) {
      toast.error("Enter a word first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI failed");
      const g: GeneratedWord = data;
      setWord(g.word || word);
      setIpaUk(g.ipa_uk || "");
      setIpaUs(g.ipa_us || "");
      setWordClass(g.word_class || "");
      setMeaningVi(g.meaning_vi || "");
      setDefinitionEn(g.definition_en || "");
      setExamples(
        (g.examples || []).map((e) => ({
          sentence: e.sentence,
          translation_vi: e.translation_vi,
          ai_generated: true,
        })),
      );
      setAiGenerated(true);
      toast.success("AI generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "AI generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim()) {
      toast.error("Word is required.");
      return;
    }
    setSaving(true);
    const result = await saveWord({
      word: word.trim(),
      ipa_uk: ipaUk || undefined,
      ipa_us: ipaUs || undefined,
      word_class: wordClass || undefined,
      meaning_vi: meaningVi || undefined,
      definition_en: definitionEn || undefined,
      notes: notes || undefined,
      deck_id: deckId === "none" ? null : deckId,
      ai_generated: aiGenerated,
      examples,
    });
    setSaving(false);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved!");
    startTransition(() => router.push(`/vocabulary/${result.id}`));
  }

  function addExample() {
    setExamples([...examples, { sentence: "", translation_vi: "", ai_generated: false }]);
  }
  function removeExample(idx: number) {
    setExamples(examples.filter((_, i) => i !== idx));
  }
  function updateExample(idx: number, key: keyof ExampleField, value: string) {
    setExamples(examples.map((e, i) => (i === idx ? { ...e, [key]: value } : e)));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pb-20">
      {/* Top: word + AI generate (full width, prominent) */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <Label htmlFor="word" className="text-sm">Word or phrase *</Label>
        <div className="flex gap-2">
          <Input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g. ubiquitous"
            required
            autoFocus
            className="text-base h-11"
          />
          <Button
            type="button"
            onClick={generate}
            disabled={generating || !word.trim()}
            size="lg"
            className="h-11 shrink-0"
          >
            {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
            <span className="hidden sm:inline">{generating ? "Generating" : "AI fill"}</span>
          </Button>
        </div>
      </div>

      {/* Two-column layout: left = fields, right = examples */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left column: 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ipa_uk" className="text-xs flex items-center gap-1">
                IPA (UK)
                {ipaUk && <SpeakButton text={word} lang="en-GB" size="icon" className="h-5 w-5" />}
              </Label>
              <Input id="ipa_uk" value={ipaUk} onChange={(e) => setIpaUk(e.target.value)} placeholder="/həˈləʊ/" className="ipa h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ipa_us" className="text-xs flex items-center gap-1">
                IPA (US)
                {ipaUs && <SpeakButton text={word} lang="en-US" size="icon" className="h-5 w-5" />}
              </Label>
              <Input id="ipa_us" value={ipaUs} onChange={(e) => setIpaUs(e.target.value)} placeholder="/həˈloʊ/" className="ipa h-9 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="word_class" className="text-xs">Word class</Label>
              <Input id="word_class" value={wordClass} onChange={(e) => setWordClass(e.target.value)} placeholder="noun, verb..." className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deck" className="text-xs">Deck</Label>
              <Select value={deckId} onValueChange={setDeckId}>
                <SelectTrigger id="deck" className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No deck</SelectItem>
                  {decks.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meaning_vi" className="text-xs">Vietnamese meaning</Label>
            <Input id="meaning_vi" value={meaningVi} onChange={(e) => setMeaningVi(e.target.value)} className="h-9" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="definition_en" className="text-xs">English definition</Label>
            <Textarea id="definition_en" value={definitionEn} onChange={(e) => setDefinitionEn(e.target.value)} rows={2} className="min-h-[60px] text-sm" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="min-h-[60px] text-sm" placeholder="Mnemonics, personal notes..." />
          </div>
        </div>

        {/* Right column: 2 cols — examples */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Examples ({examples.length})</Label>
            <Button type="button" variant="ghost" size="sm" onClick={addExample} className="h-7 text-xs">
              <Plus className="h-3 w-3" /> Add
            </Button>
          </div>
          <div className="space-y-2 lg:max-h-[440px] lg:overflow-y-auto lg:pr-1">
            {examples.length === 0 && (
              <p className="text-xs text-muted-foreground italic rounded-md border border-dashed p-4 text-center">
                No examples yet.<br />
                Use <span className="font-medium">AI fill</span> or click <span className="font-medium">Add</span>.
              </p>
            )}
            {examples.map((ex, idx) => (
              <div key={idx} className="rounded-md border p-2 space-y-1.5 bg-background">
                <div className="flex items-start gap-1">
                  <Textarea
                    value={ex.sentence}
                    onChange={(e) => updateExample(idx, "sentence", e.target.value)}
                    placeholder="English sentence"
                    rows={2}
                    className="flex-1 text-sm min-h-[50px]"
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeExample(idx)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={ex.translation_vi}
                  onChange={(e) => updateExample(idx, "translation_vi", e.target.value)}
                  placeholder="Vietnamese translation"
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 md:bottom-0 left-0 md:left-64 right-0 border-t bg-background/95 backdrop-blur-sm p-3 z-30 mb-16 md:mb-0">
        <div className="container max-w-5xl flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="animate-spin" />} Save word
          </Button>
        </div>
      </div>
    </form>
  );
}
