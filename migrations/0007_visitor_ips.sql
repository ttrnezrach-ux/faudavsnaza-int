-- Full visitor addresses for the locked office only.
-- Retention is enforced in application code (90 days): the column is nulled,
-- the rest of the analytics row stays.
alter table behavior_events add column if not exists ip text;
alter table click_events add column if not exists ip text;
alter table unique_ips add column if not exists ip text;
