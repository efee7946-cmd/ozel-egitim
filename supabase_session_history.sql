create extension if not exists pgcrypto;

create table if not exists public.session_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    session_date date not null default current_date,
    child_name text,
    duration_min integer not null default 0,
    total_mic integer not null default 0,
    story_pct text not null default '-',
    total_turns integer not null default 0,
    story_completed boolean not null default false,
    story_name text not null default '',
    total_scenes_reached integer not null default 0,
    total_scenes integer not null default 0,
    mic_used_in_story integer not null default 0,
    mic_used_in_therapy integer not null default 0,
    therapy_turns jsonb not null default '[]'::jsonb,
    story_choices jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists session_history_user_id_idx
    on public.session_history(user_id, session_date desc, created_at desc);

alter table public.session_history enable row level security;

drop policy if exists "Users can read own session history" on public.session_history;
create policy "Users can read own session history"
    on public.session_history
    for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own session history" on public.session_history;
create policy "Users can insert own session history"
    on public.session_history
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update own session history" on public.session_history;
create policy "Users can update own session history"
    on public.session_history
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
