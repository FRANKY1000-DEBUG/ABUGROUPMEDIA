-- AGM — schéma de base de données (Supabase / PostgreSQL)

create extension if not exists "uuid-ossp";

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null
);

create table if not exists shows (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  cover_url text,
  logo_url text,
  host text,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  thumbnail_url text,
  video_url text,
  category_id uuid references categories(id) on delete set null,
  show_id uuid references shows(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  duration_seconds integer,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  featured boolean not null default false,
  views integer not null default 0,
  likes integer not null default 0,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists episodes (
  id uuid primary key default uuid_generate_v4(),
  show_id uuid not null references shows(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  episode_number integer not null,
  season integer not null default 1,
  unique (show_id, season, episode_number)
);

create table if not exists watch_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  progress numeric not null default 0 check (progress >= 0 and progress <= 1),
  position_seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

-- Journal des vues (un enregistrement par lecture) : permet de calculer de
-- vraies statistiques temporelles (vues par semaine) sur le dashboard admin,
-- en plus du compteur cumulé `videos.views`.
create table if not exists view_events (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references videos(id) on delete cascade,
  viewed_at timestamptz not null default now()
);
create index if not exists idx_view_events_viewed_at on view_events(viewed_at);
create index if not exists idx_view_events_video on view_events(video_id);
alter table view_events enable row level security;
-- Lecture/écriture réservées au service role (server actions), pas de
-- policy publique.

-- Piliers de contenu du site (émissions = table `shows`, podcasts et
-- reportages = entrées de `categories`). On les insère ici pour que les
-- pages /podcasts et /reportages aient toujours leur catégorie disponible.
insert into categories (name, slug) values ('Reportages', 'reportages') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Podcasts', 'podcasts') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Interviews', 'interviews') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Documentaires', 'documentaires') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Émissions', 'emissions') on conflict (slug) do nothing;

create index if not exists idx_videos_status on videos(status);
create index if not exists idx_videos_category on videos(category_id);
create index if not exists idx_videos_show on videos(show_id);
create index if not exists idx_episodes_show on episodes(show_id);

-- Row Level Security
alter table videos enable row level security;
alter table shows enable row level security;
alter table categories enable row level security;
alter table episodes enable row level security;
alter table watch_progress enable row level security;
alter table favorites enable row level security;

-- Public read access to published content
create policy "public read published videos" on videos
  for select using (status = 'published');
create policy "public read shows" on shows for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read episodes" on episodes for select using (true);

-- Users manage their own watch progress / favorites
create policy "users manage own progress" on watch_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own favorites" on favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admins (service role) bypass RLS by default; add an is_admin claim-based
-- policy here once your admin role strategy is decided (e.g. via a
-- `profiles.role` column or custom JWT claim).

-- Paramètres généraux du site (ligne unique, id fixe = 1)
create table if not exists site_settings (
  id integer primary key default 1,
  site_name text not null default 'AGM',
  tagline text,
  contact_email text,
  support_phone text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;
create policy "public read site settings" on site_settings for select using (true);
-- Écriture réservée au service role (server actions admin), pas de policy
-- d'insertion/update publique.

-- Dernière activité des utilisateurs connectés (page admin "Utilisateurs")
create table if not exists user_activity (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);
create index if not exists idx_user_activity_last_seen on user_activity(last_seen_at desc);
alter table user_activity enable row level security;
create policy "users manage own activity" on user_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
