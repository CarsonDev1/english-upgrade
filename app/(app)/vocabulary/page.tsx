import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Search, Sparkles } from "lucide-react";
import { VocabSearch } from "./vocab-search";
import { SpeakButton } from "@/components/speak-button";
import { Pagination } from "@/components/pagination";
import { PageContainer, PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

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

  const activeDeckName = sp.deck && decks ? (decks as any[]).find((d) => d.id === sp.deck)?.name : null;

  return (
    <PageContainer size="lg">
      <PageHeader
        title="Vocabulary"
        description={
          <>
            <span className="font-medium text-foreground">{total}</span> word{total !== 1 ? "s" : ""}
            {sp.q && (
              <>
                {" "}
                khớp <span className="font-medium text-foreground">"{sp.q}"</span>
              </>
            )}
            {activeDeckName && (
              <>
                {" "}
                trong <span className="font-medium text-foreground">{activeDeckName}</span>
              </>
            )}
          </>
        }
        actions={
          <Button asChild>
            <Link href="/vocabulary/new">
              <Plus /> Add new
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card className="surface-elevated">
        <CardContent className="p-4 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="lg:w-80 shrink-0 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Search
            </label>
            <VocabSearch initial={sp.q || ""} />
          </div>
          {decks && decks.length > 0 && (
            <div className="flex-1 space-y-1.5 min-w-0">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2">
                <Filter className="h-3 w-3" /> Filter by deck
              </label>
              <div className="flex flex-wrap gap-1.5">
                <DeckChip href={pageHref(1, { deck: null })} active={!sp.deck} label="All" />
                {(decks as any[]).map((d) => (
                  <DeckChip
                    key={d.id}
                    href={`/vocabulary?deck=${d.id}`}
                    active={sp.deck === d.id}
                    label={d.name}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid */}
      {(words || []).length === 0 ? (
        <EmptyState query={sp.q} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {(words as any[]).map((w) => (
            <WordCard key={w.id} w={w} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} pageHref={pageHref} />
      )}
    </PageContainer>
  );
}

function DeckChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {label}
    </Link>
  );
}

function WordCard({ w }: { w: any }) {
  return (
    <Link
      href={`/vocabulary/${w.id}`}
      className="group relative flex min-h-[140px] flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-lg leading-tight truncate">{w.word}</span>
            {w.ai_generated && (
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-label="AI generated" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 min-h-[18px]">
            {w.word_class && (
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground italic">
                {w.word_class}
              </span>
            )}
            {w.ipa_uk && <span className="ipa text-xs text-primary truncate">{w.ipa_uk}</span>}
          </div>
        </div>
        <SpeakButton text={w.word} size="icon" className="h-8 w-8 shrink-0 -mt-1 -mr-1.5" />
      </div>

      <p className="text-sm flex-1 line-clamp-2 leading-snug">
        {w.meaning_vi || <span className="text-muted-foreground italic">No meaning yet</span>}
      </p>

      {w.decks && (
        <div className="pt-1">
          <Badge variant="secondary" className="text-[10px] truncate max-w-full font-normal">
            {w.decks.name}
          </Badge>
        </div>
      )}
    </Link>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="surface-elevated">
      <CardContent className="py-16 text-center space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">No words found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {query ? "Thử tìm với từ khoá khác." : "Thêm từ đầu tiên và để AI lo phần còn lại."}
          </p>
        </div>
        {!query && (
          <Button asChild>
            <Link href="/vocabulary/new">
              <Sparkles /> Add with AI
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
