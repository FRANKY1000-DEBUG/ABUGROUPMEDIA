-- Migration incrémentale — à exécuter une fois dans le SQL editor Supabase
-- sur un projet qui a déjà `schema.sql` en place.
-- Ajoute : compteur de likes, nom d'auteur affiché, et catégorie "Podcasts".

alter table videos add column if not exists likes integer not null default 0;
alter table videos add column if not exists author_name text;

insert into categories (name, slug) values ('Reportages', 'reportages') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Podcasts', 'podcasts') on conflict (slug) do nothing;

create index if not exists idx_videos_likes on videos(likes desc);
