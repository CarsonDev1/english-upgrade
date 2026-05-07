import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Search, Sparkles } from "lucide-react";
import { VocabSearch } from "./vocab-search";
import { SpeakButton } from "@/components/speak-button";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 24;

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; deck?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let query = supabase
    .from("vocabulary")
    .select(
      "id, word, ipa_uk, ipa_us, word_class, meaning_vi, deck_id, ai_generated, created_at, decks(name)",
      { count: "exact" },
    )
    .eq("user_id", user.id);

  if (sp.q) query = query.ilike("word", `%${sp.q}%`);
  if (sp.deck) query = query.eq("deck_id", sp.deck);

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data: words, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { data: decks } = await supabase
    .from("decks")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at");

  function pageHref(p: number, opts?: { deck?: string | null }) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    const deck = opts?.deck === undefined ? sp.deck : opts.deck ?? "";
    if (deck) params.set("deck", deck);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/vocabulary${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vocabulary</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} word{total !== 1 ? "s" : ""}
            {sp.q && ` matching "${sp.q}"`}
            {sp.deck && decks && ` in ${(decks as any[]).find((d) => d.id === sp.deck)?.name ?? "deck"}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/vocabulary/new"><Plus className="mr-1" /> Add new</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-3 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="lg:w-72 shrink-0 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</label>
            <VocabSearch initial={sp.q || ""} />
          </div>
          {decks && decks.length > 0 && (
            <div className="flex-1 space-y-1.5 min-w-0">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Filter className="h-3 w-3" /> Filter by deck
              </label>
              <div className="flex flex-wrap gap-1.5">
                <Link href={pageHref(1, { deck: null })}>
                  <Badge
                    variant={!sp.deck ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-xs hover:bg-primary/90 transition"
                  >
                    All
                  </Badge>
                </Link>
                {(decks as any[]).map((d) => (
                  <Link key={d.id} href={`/vocabulary?deck=${d.id}`}>
                    <Badge
                      variant={sp.deck === d.id ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1 text-xs hover:bg-accent transition"
                    >
                      {d.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {(words || []).length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">No words found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {sp.q ? "Try a different search." : "Add your first word and let AI do the rest."}
              </p>
            </div>
            {!sp.q && (
              <Button asChild size="sm">
                <Link href="/vocabulary/new"><Sparkles className="mr-1" /> Add with AI</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {(words as any[]).map((w) => (
            <Link
              key={w.id}
              href={`/vocabulary/${w.id}`}
              className="group relative rounded-lg border bg-card p-4 hover:border-primary hover:shadow-md transition flex flex-col gap-2 min-h-[132px]"
            >
              {/* Top row: word + speaker */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-lg truncate">{w.word}</span>
                    {w.ai_generated && <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {w.word_class && (
                      <span className="text-xs text-muted-foreground italic">{w.word_class}</span>
                    )}
                    {w.ipa_uk && (
                      <span className="ipa text-xs text-primary truncate">{w.ipa_uk}</span>
                    )}
                  </div>
                </div>
                <SpeakButton text={w.word} size="icon" className="h-7 w-7 shrink-0 -mt-0.5 -mr-1.5" />
              </div>

              {/* Meaning */}
              <p className="text-sm flex-1 line-clamp-2 leading-snug">
                {w.meaning_vi || <span className="text-muted-foreground italic">No meaning yet</span>}
              </p>

              {/* Footer: deck */}
              {w.decks && (
                <div>
                  <Badge variant="secondary" className="text-[10px] truncate max-w-full">
                    {w.decks.name}
                  </Badge>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} pageHref={pageHref} />
      )}
    </div>
  );
}
