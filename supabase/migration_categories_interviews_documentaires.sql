-- À exécuter une fois dans le SQL editor Supabase sur un projet existant.
insert into categories (name, slug) values ('Interviews', 'interviews') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Documentaires', 'documentaires') on conflict (slug) do nothing;
insert into categories (name, slug) values ('Émissions', 'emissions') on conflict (slug) do nothing;
