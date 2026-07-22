-- KidsInBusiness Venture Game — SQL Schema
-- Run this in your Supabase SQL editor

-- Game sessions (created by teacher)
create table if not exists game_sessions (
  id uuid primary key default gen_random_uuid(),
  class_code text unique not null,
  teacher_name text not null,
  title text not null default 'Venture Game',
  current_round int default 1,  -- 1=Setup, 2=Pitch & Invest, 3=Sales, 4=Results
  status text default 'active', -- active, completed
  starting_coins int default 1000,
  created_at timestamptz default now()
);

-- Players (students, no auth — identified by nickname in session)
create table if not exists game_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references game_sessions(id) on delete cascade,
  nickname text not null,
  coins numeric default 1000,
  joined_at timestamptz default now(),
  unique(session_id, nickname)
);

-- Companies (one per player per session)
create table if not exists game_companies (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references game_sessions(id) on delete cascade,
  player_id uuid references game_players(id) on delete cascade,
  -- Identity
  name text not null,
  description text,
  product_name text,
  product_price numeric default 100,
  emoji text default '🚀',
  color text default 'from-blue-400 to-indigo-500',
  -- Pitch & Ad
  pitch_text text,
  ad_text text,
  -- Shares
  share_price numeric default 100,
  shares_for_sale int default 5,   -- out of 10 total
  shares_sold int default 0,
  -- Expenses (declared upfront by student)
  cost_operational numeric default 0,
  cost_marketing numeric default 0,
  cost_staff numeric default 0,
  -- Sales (entered by teacher in Round 3)
  units_sold int default 0,
  -- Calculated (auto-computed when teacher enters sales)
  revenue numeric default 0,
  total_costs numeric default 0,
  net_profit numeric default 0,
  created_at timestamptz default now(),
  unique(session_id, player_id)
);

-- Shareholdings (who invested in what)
create table if not exists game_shareholdings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references game_companies(id) on delete cascade,
  investor_id uuid references game_players(id) on delete cascade,
  shares_owned int default 0,
  coins_invested numeric default 0,
  dividends_received numeric default 0,
  created_at timestamptz default now(),
  unique(company_id, investor_id)
);

-- Transaction log
create table if not exists game_transactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references game_sessions(id) on delete cascade,
  player_id uuid references game_players(id),
  type text not null, -- 'share_buy', 'dividend', 'startup_cost', 'sales_revenue'
  amount numeric not null,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS but allow all for MVP (no auth)
alter table game_sessions enable row level security;
alter table game_players enable row level security;
alter table game_companies enable row level security;
alter table game_shareholdings enable row level security;
alter table game_transactions enable row level security;

-- Open policies for MVP (anyone can read/write — students join by code)
create policy "public_all_sessions" on game_sessions for all using (true) with check (true);
create policy "public_all_players" on game_players for all using (true) with check (true);
create policy "public_all_companies" on game_companies for all using (true) with check (true);
create policy "public_all_shareholdings" on game_shareholdings for all using (true) with check (true);
create policy "public_all_transactions" on game_transactions for all using (true) with check (true);
