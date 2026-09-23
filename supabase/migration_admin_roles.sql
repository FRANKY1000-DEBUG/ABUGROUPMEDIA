-- Liste blanche des comptes administrateurs.
-- Un utilisateur Supabase Auth normal (inscrit via /login) n'a PAR DÉFAUT
-- aucun accès au dashboard : il doit être ajouté ici explicitement.
--
-- Volontairement une table séparée (plutôt qu'une colonne `role` sur un
-- `profiles`) : surface d'attaque minimale, personne ne peut s'auto-promouvoir
-- admin via l'app publique, seule la clé service_role (donc le SQL editor
-- Supabase ou une server action explicitement admin) peut y écrire.
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  note text -- ex. "Franky - compte principal"
);

alter table admin_users enable row level security;

-- Un utilisateur connecté peut vérifier UNIQUEMENT s'il est lui-même admin
-- (nécessaire pour que le middleware/layout fasse ce contrôle avec la clé
-- anon + cookies de session, sans avoir besoin de la clé service_role).
-- Il ne peut jamais lire la liste des autres admins, ni écrire.
create policy "users can check own admin status"
  on admin_users for select
  using (auth.uid() = user_id);

-- Aucune policy insert/update/delete : l'ajout d'un admin ne peut se faire
-- que via la clé service_role (SQL editor Supabase), jamais depuis l'app.

-- ---------------------------------------------------------------------
-- Pour te transformer toi-même en admin après avoir exécuté ce fichier :
-- 1. Connecte-toi une fois sur le site avec le compte que tu veux rendre admin
--    (via /login, pour créer ton compte auth.users normalement).
-- 2. Dans le SQL editor Supabase, exécute (remplace l'email) :
--
--    insert into admin_users (user_id, note)
--    select id, 'Compte principal'
--    from auth.users
--    where email = 'ton-email@exemple.com';
--
-- ---------------------------------------------------------------------
