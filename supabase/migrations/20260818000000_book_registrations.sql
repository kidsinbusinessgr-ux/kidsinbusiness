create table if not exists public.book_registrations (
  id uuid primary key default gen_random_uuid(),
  child_name text not null,
  child_age integer,
  parent_email text not null,
  registered_at timestamptz default now(),
  progress jsonb default '{}'::jsonb,
  total_coins integer default 0,
  chapters_done integer default 0
);

alter table public.book_registrations enable row level security;

create policy "Anyone can insert book registrations"
  on public.book_registrations for insert
  with check (true);

create policy "Anyone can read book registrations"
  on public.book_registrations for select
  using (true);
