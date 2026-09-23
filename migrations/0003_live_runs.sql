create table if not exists live_runs (
  id bigserial primary key,
  ran_at timestamptz not null default now(),
  slot text not null,
  significant boolean not null default false,
  note_he text not null default '',
  note_en text not null default '',
  source text not null default '',
  wiki_at text,
  fauda jsonb,
  naza jsonb,
  deltas jsonb not null default '[]'::jsonb
);

create index if not exists live_runs_ran_at on live_runs (ran_at desc);
