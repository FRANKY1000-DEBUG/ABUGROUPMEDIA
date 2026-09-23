-- À exécuter une fois dans le SQL editor Supabase (sans risque si déjà en place).
-- Rend fonctionnels : "Ma liste" / Favoris et "Reprendre la lecture".

create extension if not exists "uuid-ossp";

create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create table if not exists watch_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  progress numeric not null default 0 check (progress >= 0 and progress <= 1),
  updated_at timestamptz not null default now(),
  unique (user_id, video_id)
);

-- Position exacte de reprise (en secondes) en plus de la progression 0..1
alter table watch_progress add column if not exists position_seconds integer not null default 0;

create index if not exists idx_favorites_user on favorites(user_id, created_at desc);
create index if not exists idx_watch_progress_user on watch_progress(user_id, updated_at desc);

alter table favorites enable row level security;
alter table watch_progress enable row level security;

drop policy if exists "users manage own favorites" on favorites;
create policy "users manage own favorites" on favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own progress" on watch_progress;
create policy "users manage own progress" on watch_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
