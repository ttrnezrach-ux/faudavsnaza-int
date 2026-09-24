-- SPA view dimensions. locale already lives on behavior_events.
-- Null on rows recorded before this migration (shown in /office as "before tracking").
alter table behavior_events add column if not exists work text;
alter table behavior_events add column if not exists content_tab text;

create index if not exists behavior_events_dims_idx
  on behavior_events (created_at, work, content_tab);
