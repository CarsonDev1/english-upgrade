"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowRight } from "lucide-react";
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
        toast.success("Deck created");
        setName("");
        setDescription("");
        setOpen(false);
      }
    });
  }

  function onDelete(id: string, deckName: string) {
    if (!confirm(`Delete deck "${deckName}"? Words inside will not be deleted.`)) return;
    start(async () => {
      const result = await deleteDeck(id);
      if (result.error) toast.error(result.error);
      else toast.success("Deleted");
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1" /> New deck</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new deck</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="d-name">Name</Label>
                <Input id="d-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. IELTS Writing" autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-desc">Description (optional)</Label>
                <Textarea id="d-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onCreate} disabled={!name.trim()}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <p>No decks yet. Create one to organize your vocabulary.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((d) => (
            <Card key={d.id} className="group">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{d.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => onDelete(d.id, d.name)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.description && <p className="text-sm text-muted-foreground line-clamp-2">{d.description}</p>}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{d.word_count} words</Badge>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/vocabulary?deck=${d.id}`}>Open <ArrowRight className="ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
