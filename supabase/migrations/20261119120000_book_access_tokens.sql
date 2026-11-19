-- Server-checked access to the book (/book, /book/:id, /market-game).
-- Before: the browser flag localStorage["kib_book_access_v1"] = "1" was enough.
-- Now: a correct book code gives a random access token stored here, and the
-- book pages ask check_book_access() before they open.

-- 1. Access tokens (one per successful code entry). No policies: only the
--    SECURITY DEFINER functions below can read or write it.
create table if not exists public.book_access_tokens (
  token text primary key,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
alter table public.book_access_tokens enable row level security;
revoke all on public.book_access_tokens from anon, authenticated;

-- 2. Code attempts, for basic protection against guessing.
create table if not exists public.book_code_attempts (
  id bigserial primary key,
  ip_hash text not null,
  ok boolean not null,
  attempted_at timestamptz not null default now()
);
create index if not exists book_code_attempts_ip_time_idx
  on public.book_code_attempts (ip_hash, attempted_at);
create index if not exists book_code_attempts_time_idx
  on public.book_code_attempts (attempted_at);
alter table public.book_code_attempts enable row level security;
revoke all on public.book_code_attempts from anon, authenticated;

-- 3. Shared helper: validate a code with a rate limit.
--    At most 10 wrong tries per address per 15 minutes,
--    and at most 300 wrong tries in total per 10 minutes.
create or replace function public.book_code_check_and_count(input_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  headers json;
  ip text;
  ip_h text;
  valid boolean;
begin
  begin
    headers := current_setting('request.headers', true)::json;
  exception when others then
    headers := null;
  end;
  ip := coalesce(
    headers->>'cf-connecting-ip',
    split_part(headers->>'x-forwarded-for', ',', 1),
    headers->>'x-real-ip',
    'unknown'
  );
  ip_h := md5(trim(ip));

  if (select count(*) from book_code_attempts
        where ip_hash = ip_h and not ok
          and attempted_at > now() - interval '15 minutes') >= 10
     or (select count(*) from book_code_attempts
        where not ok and attempted_at > now() - interval '10 minutes') >= 300
  then
    raise exception 'too_many_attempts' using errcode = 'P0001';
  end if;

  select exists (
    select 1 from book_codes
    where lower(code) = lower(trim(coalesce(input_code, '')))
      and (max_uses is null or use_count < max_uses)
  ) into valid;

  if valid then
    update book_codes set use_count = use_count + 1
    where lower(code) = lower(trim(input_code));
  end if;

  insert into book_code_attempts (ip_hash, ok) values (ip_h, valid);
  delete from book_code_attempts where attempted_at < now() - interval '1 day';

  return valid;
end;
$$;
revoke all on function public.book_code_check_and_count(text) from public, anon, authenticated;

-- 4. Old function, kept callable (same name and return type), now rate-limited.
create or replace function public.validate_and_use_book_code(input_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.book_code_check_and_count(input_code);
end;
$$;
grant execute on function public.validate_and_use_book_code(text) to anon, authenticated;

-- 5. New: a correct code returns a fresh access token (null when wrong).
create or replace function public.redeem_book_code(input_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_token text;
begin
  if not public.book_code_check_and_count(input_code) then
    return null;
  end if;
  new_token := replace(gen_random_uuid()::text, '-', '')
            || replace(gen_random_uuid()::text, '-', '');
  insert into book_access_tokens (token) values (new_token);
  return new_token;
end;
$$;
grant execute on function public.redeem_book_code(text) to anon, authenticated;

-- 6. New: does this visitor have access to the book?
--    Yes when the token is real, or when the signed-in user's profile holds a
--    real book code (the BookAuth / BookActivate flow).
create or replace function public.check_book_access(access_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if access_token is not null and length(access_token) = 64 then
    update book_access_tokens set last_seen_at = now()
    where token = access_token;
    if found then
      return true;
    end if;
  end if;

  if auth.uid() is not null then
    return exists (
      select 1
      from user_profiles p
      join book_codes c on lower(c.code) = lower(p.book_code)
      where p.id = auth.uid()
    );
  end if;

  return false;
end;
$$;
grant execute on function public.check_book_access(text) to anon, authenticated;

-- 7. The codes themselves were readable by anyone ("Anyone can read book codes").
--    Only the founder may read them now (for /book-admin).
drop policy if exists "Anyone can read book codes" on public.book_codes;
drop policy if exists "founder_read_book_codes" on public.book_codes;
create policy "founder_read_book_codes"
  on public.book_codes for select
  using (auth.email() = 'kidsinbusinessgr@gmail.com');
