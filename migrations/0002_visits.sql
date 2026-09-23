create table if not exists unique_visitors (
  visitor_key text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  country_code text,
  visit_count int not null default 1,
  ip_hash text,
  ip_hint text
);

create table if not exists unique_ips (
  ip_hash text primary key,
  ip_hint text not null,
  country_code text,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visit_count int not null default 1
);

create table if not exists sessions (
  session_key text primary key,
  visitor_key text not null,
  country_code text,
  device text,
  source text,
  locale text,
  referrer_host text,
  landing text,
  google_product text,
  campaign text,
  started_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  pageviews int not null default 0,
  events int not null default 0
);

create table if not exists click_events (
  id bigserial primary key,
  visitor_key text not null,
  target text not null,
  country_code text,
  ip_hash text,
  ip_hint text,
  created_at timestamptz not null default now()
);

create table if not exists behavior_events (
  id bigserial primary key,
  visitor_key text not null,
  session_key text,
  kind text not null,
  name text not null,
  device text,
  source text,
  locale text,
  country_code text,
  ip_hash text,
  ip_hint text,
  created_at timestamptz not null default now()
);

create index if not exists unique_visitors_ip_hash_idx on unique_visitors (ip_hash);
create index if not exists unique_visitors_last_seen_idx on unique_visitors (last_seen);
create index if not exists unique_ips_last_seen_idx on unique_ips (last_seen);
create index if not exists click_events_created_idx on click_events (created_at);
create index if not exists click_events_ip_hash_idx on click_events (ip_hash);
create index if not exists behavior_events_created_idx on behavior_events (created_at);
create index if not exists sessions_started_idx on sessions (started_at);
