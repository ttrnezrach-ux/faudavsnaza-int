create table if not exists site_versions (
  id bigserial primary key,
  version int not null,
  released_at timestamptz not null default now(),
  note_he text not null default '',
  note_en text not null default '',
  finding_he text not null default '',
  finding_en text not null default '',
  week int,
  created_at timestamptz not null default now()
);

create unique index if not exists site_versions_version_uq on site_versions (version);
create index if not exists site_versions_released_at on site_versions (released_at desc);

create table if not exists site_findings (
  id text primary key,
  week int not null,
  range_from text not null,
  range_to text not null,
  version int,
  noted_at timestamptz not null default now(),
  note_he text not null default '',
  note_en text not null default ''
);
