-- À exécuter si schema.sql a déjà été lancé une première fois.
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
drop policy if exists "public read site settings" on site_settings;
create policy "public read site settings" on site_settings for select using (true);
