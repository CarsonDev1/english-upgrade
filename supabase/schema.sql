-- ============================================================
-- English Upgrade — Supabase Schema
-- Run this once in Supabase SQL Editor.
-- ============================================================

-- 1) PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  ipa_level int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) DECKS
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text,
  created_at timestamptz not null default now()
);

create index if not exists decks_user_id_idx on public.decks(user_id);

alter table public.decks enable row level security;

drop policy if exists "decks_all_own" on public.decks;
create policy "decks_all_own" on public.decks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) VOCABULARY
create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id uuid references public.decks(id) on delete set null,
  word text not null,
  ipa_uk text,
  ipa_us text,
  word_class text,
  meaning_vi text,
  definition_en text,
  notes text,
  image_url text,
  ai_generated boolean not null default false,
  ease_factor float not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Backfill column for existing installs
alter table public.vocabulary add column if not exists image_url text;

create index if not exists vocab_user_id_idx on public.vocabulary(user_id);
create index if not exists vocab_deck_id_idx on public.vocabulary(deck_id);
create index if not exists vocab_review_idx on public.vocabulary(user_id, next_review_at);
create index if not exists vocab_word_idx on public.vocabulary(user_id, lower(word));

alter table public.vocabulary enable row level security;

drop policy if exists "vocab_all_own" on public.vocabulary;
create policy "vocab_all_own" on public.vocabulary
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) EXAMPLES
create table if not exists public.examples (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  sentence text not null,
  translation_vi text,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists examples_vocab_idx on public.examples(vocabulary_id);

alter table public.examples enable row level security;

drop policy if exists "examples_all_via_parent" on public.examples;
create policy "examples_all_via_parent" on public.examples
  for all using (
    exists (
      select 1 from public.vocabulary v
      where v.id = examples.vocabulary_id and v.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.vocabulary v
      where v.id = examples.vocabulary_id and v.user_id = auth.uid()
    )
  );

-- 5) REVIEW LOGS
create table if not exists public.review_logs (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 4),
  reviewed_at timestamptz not null default now()
);

create index if not exists review_logs_user_idx on public.review_logs(user_id, reviewed_at desc);
create index if not exists review_logs_vocab_idx on public.review_logs(vocabulary_id);

alter table public.review_logs enable row level security;

drop policy if exists "review_logs_select_own" on public.review_logs;
create policy "review_logs_select_own" on public.review_logs
  for select using (auth.uid() = user_id);

drop policy if exists "review_logs_insert_own" on public.review_logs;
create policy "review_logs_insert_own" on public.review_logs
  for insert with check (auth.uid() = user_id);

-- 6) IPA PROGRESS
create table if not exists public.ipa_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  mastered_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.ipa_progress enable row level security;

drop policy if exists "ipa_progress_all_own" on public.ipa_progress;
create policy "ipa_progress_all_own" on public.ipa_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
