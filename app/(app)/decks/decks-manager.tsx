"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowRight, Layers } from "lucide-react";
import { createDeck, deleteDeck } from "./actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Deck {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  word_count: number;
}

const DECK_COLORS = [
  "from-sky-500/15 to-cyan-500/15 text-sky-600 dark:text-sky-400",
  "from-cyan-500/15 to-teal-500/15 text-cyan-600 dark:text-cyan-400",
  "from-teal-500/15 to-emerald-500/15 text-teal-600 dark:text-teal-400",
  "from-emerald-500/15 to-green-500/15 text-emerald-600 dark:text-emerald-400",
  "from-blue-500/15 to-sky-500/15 text-blue-600 dark:text-blue-400",
  "from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400",
];

function deckGradient(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return DECK_COLORS[Math.abs(h) % DECK_COLORS.length];
}

export function DecksManager({ decks }: { decks: Deck[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [, start] = useTransition();

  function onCreate() {
    if (!name.trim()) return;
    start(async () => {
      const result = await createDeck({ name, description });
      if (result.error) toast.error(result.error);
      else {
        toast.success("Deck đã được tạo");
        setName("");
        setDescription("");
        setOpen(false);
      }
    });
  }

  function onDelete(id: string, deckName: string) {
    if (!confirm(`Xoá deck "${deckName}"? Các từ trong deck sẽ không bị xoá.`)) return;
    start(async () => {
      const result = await deleteDeck(id);
      if (result.error) toast.error(result.error);
      else toast.success("Đã xoá");
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> New deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo deck mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="d-name">Tên deck</Label>
                <Input
                  id="d-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: IELTS Writing"
                  autoFocus
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-desc">Mô tả (tuỳ chọn)</Label>
                <Textarea
                  id="d-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onCreate} disabled={!name.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {decks.length === 0 ? (
        <Card className="surface-elevated">
          <CardContent className="py-16 text-center space-y-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-lg">Chưa có deck nào</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tạo deck để gom các từ cùng chủ đề lại với nhau.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus /> Create your first deck
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((d) => {
            const gradient = deckGradient(d.id);
            return (
              <div
                key={d.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
              >
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} ring-1 ring-inset ring-border/40 shrink-0`}
                      >
                        <Layers className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-lg truncate">{d.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                      onClick={() => onDelete(d.id, d.name)}
                      aria-label={`Delete ${d.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                  {d.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {d.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm">
                      <span className="font-bold text-foreground">{d.word_count}</span>
                      <span className="text-muted-foreground"> word{d.word_count !== 1 ? "s" : ""}</span>
                    </span>
                    <Button asChild variant="ghost" size="sm" className="h-8">
                      <Link href={`/vocabulary?deck=${d.id}`}>
                        Open <ArrowRight className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
