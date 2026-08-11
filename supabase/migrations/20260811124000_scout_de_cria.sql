create extension if not exists pgcrypto;

create table if not exists public.scout_dossiers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  nickname text,
  sport text not null check (sport in ('BOXE','JIU-JITSU','MMA')),
  category text,
  nationality text,
  status text not null default 'draft' check (status in ('draft','processing','review','approved','blocked')),
  payload jsonb not null default '{}'::jsonb,
  evidence_coverage numeric(5,4) not null default 0,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scout_sources (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.scout_dossiers(id) on delete cascade,
  external_key text,
  kind text not null,
  title text not null,
  publisher text,
  source_url text,
  retrieved_at timestamptz not null default now(),
  reliability numeric(4,3) not null default 0.5 check (reliability between 0 and 1),
  content_hash text,
  raw_metadata jsonb not null default '{}'::jsonb,
  unique (dossier_id, external_key)
);

create table if not exists public.scout_claims (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.scout_dossiers(id) on delete cascade,
  claim_key text not null,
  claim_text text not null,
  status text not null check (status in ('supported','uncertain','unsupported','conflicted')),
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (dossier_id, claim_key)
);

create table if not exists public.scout_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references public.scout_dossiers(id) on delete cascade,
  requested_name text not null,
  requested_sport text check (requested_sport in ('BOXE','JIU-JITSU','MMA')),
  status text not null default 'queued' check (status in ('queued','collecting','analyzing','auditing','ready','failed','blocked')),
  stage text,
  attempt_count integer not null default 0,
  idempotency_key text not null unique,
  error_code text,
  error_message text,
  provider_trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index if not exists scout_dossiers_public_idx on public.scout_dossiers(status, sport, updated_at desc);
create index if not exists scout_sources_dossier_idx on public.scout_sources(dossier_id);
create index if not exists scout_claims_dossier_idx on public.scout_claims(dossier_id, status);
create index if not exists scout_jobs_status_idx on public.scout_generation_jobs(status, created_at);

alter table public.scout_dossiers enable row level security;
alter table public.scout_sources enable row level security;
alter table public.scout_claims enable row level security;
alter table public.scout_generation_jobs enable row level security;

create policy "public can read approved scout dossiers" on public.scout_dossiers
for select using (status = 'approved');

create policy "public can read sources for approved dossiers" on public.scout_sources
for select using (exists (select 1 from public.scout_dossiers d where d.id = scout_sources.dossier_id and d.status = 'approved'));

create policy "public can read claims for approved dossiers" on public.scout_claims
for select using (exists (select 1 from public.scout_dossiers d where d.id = scout_claims.dossier_id and d.status = 'approved'));

-- No public policies for generation jobs or writes. Generation must run server-side
-- with a service role / trusted worker, never from the browser.
