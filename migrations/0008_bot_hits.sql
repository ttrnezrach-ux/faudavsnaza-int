create table if not exists bot_hits (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  reason text not null
);

create index if not exists bot_hits_created_idx on bot_hits (created_at);
