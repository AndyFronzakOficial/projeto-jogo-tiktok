-- Execute este arquivo no SQL Editor do Supabase.

create table if not exists public.clubs (
  id text primary key,
  name text not null,
  short_name text not null,
  points integer not null default 0 check (points >= 0),
  color text not null default '#334155',
  logo_url text,
  created_at timestamptz not null default now()
);

alter table public.clubs enable row level security;

-- Projeto simples sem login: qualquer visitante com a chave anon pode ler e alterar.
-- Para uso público em produção, o ideal é adicionar autenticação ao painel /controle.
drop policy if exists "public read clubs" on public.clubs;
create policy "public read clubs" on public.clubs for select using (true);

drop policy if exists "public insert clubs" on public.clubs;
create policy "public insert clubs" on public.clubs for insert with check (true);

drop policy if exists "public update clubs" on public.clubs;
create policy "public update clubs" on public.clubs for update using (true) with check (true);

create or replace function public.increment_club_points(club_id text, amount integer default 1)
returns void
language sql
security definer
set search_path = public
as $$
  update public.clubs
  set points = greatest(0, points + amount)
  where id = club_id;
$$;

grant execute on function public.increment_club_points(text, integer) to anon, authenticated;

insert into public.clubs (id, name, short_name, points, color) values
('vasco', 'Vasco', 'VAS', 500, '#111827'),
('palmeiras', 'Palmeiras', 'PAL', 382, '#0f6b3d'),
('santos', 'Santos', 'SAN', 101, '#111827'),
('sao-paulo', 'São Paulo', 'SAO', 61, '#c91d35'),
('internacional', 'Internacional', 'INT', 45, '#d71920'),
('botafogo', 'Botafogo', 'BOT', 22, '#151515'),
('flamengo', 'Flamengo', 'FLA', 19, '#b5121b'),
('atletico-mg', 'Atlético-MG', 'CAM', 16, '#111827'),
('athletico-pr', 'Athletico-PR', 'CAP', 14, '#be123c'),
('corinthians', 'Corinthians', 'COR', 13, '#374151'),
('remo', 'Remo', 'REM', 5, '#1d4ed8'),
('gremio', 'Grêmio', 'GRE', 3, '#0891b2'),
('vitoria', 'Vitória', 'VIT', 3, '#dc2626'),
('cruzeiro', 'Cruzeiro', 'CRU', 1, '#2563eb'),
('bahia', 'Bahia', 'BAH', 0, '#2563eb'),
('ceara', 'Ceará', 'CEA', 0, '#111827'),
('fluminense', 'Fluminense', 'FLU', 0, '#7f1d1d'),
('fortaleza', 'Fortaleza', 'FOR', 0, '#1d4ed8'),
('sport', 'Sport', 'SPT', 0, '#b91c1c')
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  color = excluded.color;

-- Ative o Realtime para a tabela clubs no painel do Supabase:
-- Database > Replication > Supabase Realtime > clubs
