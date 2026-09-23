-- À exécuter une fois dans le SQL editor Supabase sur un projet existant.
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
-- policy publique : les vues sont enregistrées côté serveur uniquement.
