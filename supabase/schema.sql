-- Tagalong prototype schema.
-- Phone login is not wired yet, so these policies allow the public key to
-- read and write. Replace them when Supabase Auth is added.

create table if not exists public.profiles (
  id text primary key,
  name text not null,
  username text not null,
  age_range text,
  gender text,
  photo text,
  bio text,
  instagram text,
  linked_in text,
  city text,
  is_premium boolean not null default false,
  can_host boolean not null default false,
  rating numeric not null default 5,
  hosted_count integer not null default 0,
  joined_count integer not null default 0,
  current_streak integer not null default 0,
  blocked_users text[] not null default '{}',
  accepted_guidelines boolean not null default false,
  phone_number text
);

create table if not exists public.activities (
  id text primary key,
  host_id text not null references public.profiles (id),
  title text not null,
  type text not null,
  vibe_tags text[] not null default '{}',
  note text,
  time_label text,
  time_hours_from_now numeric,
  location_name text,
  lat double precision,
  lng double precision,
  max_attendees integer,
  solo_mode boolean not null default false,
  is_premium boolean not null default false,
  photo text,
  created_at timestamptz not null default now(),
  viewers_count integer not null default 0,
  viewers text[] not null default '{}'
);

create table if not exists public.participants (
  activity_id text not null references public.activities (id) on delete cascade,
  user_id text not null references public.profiles (id) on delete cascade,
  status text not null,
  role text not null,
  requested_at timestamptz,
  join_message text,
  primary key (activity_id, user_id)
);

create table if not exists public.messages (
  id text primary key,
  chat_id text not null,
  sender_id text,
  sender_name text,
  sender_photo text,
  body text,
  photo text,
  timestamp_label text,
  is_system boolean not null default false
);

create table if not exists public.notifications (
  id text primary key,
  user_id text,
  title text,
  description text,
  type text,
  activity_id text,
  related_user_id text,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

create table if not exists public.reports (
  id text primary key,
  reported_user_id text,
  reporter_user_id text,
  reason text,
  activity_id text,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists activities_host_id_idx on public.activities (host_id);
create index if not exists participants_user_id_idx on public.participants (user_id);
create index if not exists messages_chat_id_idx on public.messages (chat_id);
create index if not exists notifications_user_id_idx on public.notifications (user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.activities to anon, authenticated;
grant select, insert, update, delete on public.participants to anon, authenticated;
grant select, insert, update, delete on public.messages to anon, authenticated;
grant select, insert, update, delete on public.notifications to anon, authenticated;
grant select, insert, update, delete on public.reports to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

drop policy if exists "prototype full access" on public.profiles;
drop policy if exists "prototype full access" on public.activities;
drop policy if exists "prototype full access" on public.participants;
drop policy if exists "prototype full access" on public.messages;
drop policy if exists "prototype full access" on public.notifications;
drop policy if exists "prototype full access" on public.reports;

create policy "prototype full access" on public.profiles for all to anon, authenticated using (true) with check (true);
create policy "prototype full access" on public.activities for all to anon, authenticated using (true) with check (true);
create policy "prototype full access" on public.participants for all to anon, authenticated using (true) with check (true);
create policy "prototype full access" on public.messages for all to anon, authenticated using (true) with check (true);
create policy "prototype full access" on public.notifications for all to anon, authenticated using (true) with check (true);
create policy "prototype full access" on public.reports for all to anon, authenticated using (true) with check (true);
