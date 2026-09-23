-- À exécuter une fois dans le SQL editor Supabase.
-- Dernière activité de chaque utilisateur connecté (mise à jour ~1 fois/minute
-- par le site) : alimente "En ligne maintenant" et "Utilisateurs actifs"
-- dans /admin/utilisateurs.

create table if not exists user_activity (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_user_activity_last_seen on user_activity(last_seen_at desc);

alter table user_activity enable row level security;

-- Chaque utilisateur écrit uniquement sa propre ligne ; l'admin lit tout via la
-- clé service_role (qui contourne le RLS).
drop policy if exists "users manage own activity" on user_activity;
create policy "users manage own activity" on user_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
