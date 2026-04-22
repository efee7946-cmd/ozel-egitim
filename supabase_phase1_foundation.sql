create extension if not exists pgcrypto;

do $$
begin
    if not exists (
        select 1
        from pg_type
        where typname = 'app_role'
    ) then
        create type public.app_role as enum ('parent', 'specialist', 'admin');
    end if;
end $$;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role public.app_role not null default 'parent',
    full_name text,
    display_name text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.students (
    id uuid primary key default gen_random_uuid(),
    created_by uuid not null references public.profiles(id) on delete cascade,
    full_name text not null,
    birth_year integer,
    support_notes text not null default '',
    active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.parent_student_links (
    id uuid primary key default gen_random_uuid(),
    parent_id uuid not null references public.profiles(id) on delete cascade,
    student_id uuid not null references public.students(id) on delete cascade,
    relationship_label text not null default 'parent',
    created_at timestamptz not null default timezone('utc', now()),
    unique (parent_id, student_id)
);

create table if not exists public.specialist_student_links (
    id uuid primary key default gen_random_uuid(),
    specialist_id uuid not null references public.profiles(id) on delete cascade,
    student_id uuid not null references public.students(id) on delete cascade,
    created_at timestamptz not null default timezone('utc', now()),
    unique (specialist_id, student_id)
);

alter table public.session_history
    add column if not exists student_id uuid references public.students(id) on delete set null,
    add column if not exists created_by uuid references public.profiles(id) on delete set null;

alter table public.session_history
    alter column created_by set default auth.uid();

create table if not exists public.parent_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    student_id uuid references public.students(id) on delete cascade,
    goal_text text not null,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_role_idx
    on public.profiles(role);

create index if not exists students_created_by_idx
    on public.students(created_by, created_at desc);

create index if not exists parent_student_links_parent_idx
    on public.parent_student_links(parent_id, student_id);

create index if not exists specialist_student_links_specialist_idx
    on public.specialist_student_links(specialist_id, student_id);

create index if not exists session_history_student_id_idx
    on public.session_history(student_id, session_date desc, created_at desc);

create index if not exists parent_goals_user_student_idx
    on public.parent_goals(user_id, student_id, created_at desc);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, role, full_name, display_name)
    values (
        new.id,
        case
            when coalesce(new.raw_user_meta_data ->> 'role', '') = 'specialist' then 'specialist'::public.app_role
            when coalesce(new.raw_user_meta_data ->> 'role', '') = 'admin' then 'admin'::public.app_role
            else 'parent'::public.app_role
        end,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
    )
    on conflict (id) do update
    set
        role = excluded.role,
        full_name = excluded.full_name,
        display_name = excluded.display_name,
        updated_at = timezone('utc', now());

    return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
    after insert on auth.users
    for each row execute procedure public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.specialist_student_links enable row level security;
alter table public.parent_goals enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
    on public.profiles
    for select
    using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
    on public.profiles
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

drop policy if exists "Parents and specialists can read linked students" on public.students;
create policy "Parents and specialists can read linked students"
    on public.students
    for select
    using (
        exists (
            select 1
            from public.parent_student_links psl
            where psl.student_id = students.id
              and psl.parent_id = auth.uid()
        )
        or exists (
            select 1
            from public.specialist_student_links ssl
            where ssl.student_id = students.id
              and ssl.specialist_id = auth.uid()
        )
        or created_by = auth.uid()
    );

drop policy if exists "Parents and specialists can create students" on public.students;
create policy "Parents and specialists can create students"
    on public.students
    for insert
    with check (created_by = auth.uid());

drop policy if exists "Owners can update students" on public.students;
create policy "Owners can update students"
    on public.students
    for update
    using (created_by = auth.uid())
    with check (created_by = auth.uid());

drop policy if exists "Users can read own parent student links" on public.parent_student_links;
create policy "Users can read own parent student links"
    on public.parent_student_links
    for select
    using (parent_id = auth.uid());

drop policy if exists "Users can manage own parent student links" on public.parent_student_links;
create policy "Users can manage own parent student links"
    on public.parent_student_links
    for all
    using (parent_id = auth.uid())
    with check (parent_id = auth.uid());

drop policy if exists "Users can read own specialist student links" on public.specialist_student_links;
create policy "Users can read own specialist student links"
    on public.specialist_student_links
    for select
    using (specialist_id = auth.uid());

drop policy if exists "Users can manage own specialist student links" on public.specialist_student_links;
create policy "Users can manage own specialist student links"
    on public.specialist_student_links
    for all
    using (specialist_id = auth.uid())
    with check (specialist_id = auth.uid());

drop policy if exists "Users can read own goals or linked student goals" on public.parent_goals;
create policy "Users can read own goals or linked student goals"
    on public.parent_goals
    for select
    using (
        user_id = auth.uid()
        or exists (
            select 1
            from public.specialist_student_links ssl
            where ssl.student_id = parent_goals.student_id
              and ssl.specialist_id = auth.uid()
        )
    );

drop policy if exists "Users can create own goals" on public.parent_goals;
create policy "Users can create own goals"
    on public.parent_goals
    for insert
    with check (user_id = auth.uid());

drop policy if exists "Users can update own goals" on public.parent_goals;
create policy "Users can update own goals"
    on public.parent_goals
    for update
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
